import MailInfo from "./MailInfo";
import { g_uiMgr } from "../UiMainager";


export default class MailUi extends gamelib.core.Ui_NetHandle
{
    private _list:Laya.List;

    private _info:MailInfo;

    private _data:Array<any>;
    public constructor()
    {
        super("ui.MailUI");
    }
    public reciveNetMsg(msg:string,rd:any,data:any):void
    {
        switch(msg)
        {
            case gamelib.GameMsg.Websitemaillist:
                g_uiMgr.closeMiniLoading();
                if(data.retCode != 0)
                {                   
                    return;
                }
                this._data = [];
                for(var temp of data.retData)
                {
                    this._data.push(temp);
                }
                this.setData(this._data);
                break;
            case gamelib.GameMsg.Readwebsitemail:
                for(var md of this._data)
                {
                    if(md.id == rd.id || rd.id == 0)
                    {
                        md.state = "True";
                    }
                }
                this.setData(this._data);
                break;
            case gamelib.GameMsg.Websitemaildelete:
                for (let index = 0; index < this._data.length; index++) {
                    const element = this._data[index];
                    if(element.id == rd.id)
                    {
                        this._data.splice(index,1)
                        break;
                    }
                    
                }
                this.setData(this._data);
                break;
        }
    }
    protected onShow():void
    {
        super.onShow();
        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Websitemaillist,{pageIndex:0,pageSize:200});
    }
    public setData(data:any):void
    {
        this._list.dataSource = data;
        this._res['txt_tips1'].visible = data== null || data.length == 0;
    }
    protected init():void
    {
        this._list = this._res["list_1"];

        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.dataSource = [];
    }
    private onItemRender(box:Laya.Box,index:number):void
    {
        var btn:Laya.Button = getChildByName(box,'btn_check');
        btn.offAll(Laya.Event.CLICK);
        var md:any = this._list.dataSource[index];        
        btn.on(Laya.Event.CLICK,this,this.onClickInfo,[md]);
        var label:Laya.Label = getChildByName(box,'txt_name');
        label.text = md.username;
        
        label = getChildByName(box,'txt_title');
        label.text = md.title;
        
        label = getChildByName(box,'txt_info');
        utils.tools.setLabelDisplayValue(label,md.context);

        label = getChildByName(box,'txt_time');
        label.text = md.inputtime;
    }  
    
    private onClickInfo(md:any,evt:Laya.Event):void
    {
        this._info = this._info || new MailInfo();
        this._info.setData(md);
        this._info.show();
    }
    
}