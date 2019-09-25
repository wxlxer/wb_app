import MailInfo from "./MailInfo";


export default class MailUi extends gamelib.core.Ui_NetHandle
{
    private _list:Laya.List;

    private _info:MailInfo;
    public constructor()
    {
        super("ui.MailUI");
    }

    protected init():void
    {
        this._list = this._res["list_1"];

        this._list.selectHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.dataSource = [];
    }
    private onItemRender(box:Laya.Box,index:number):void
    {
        var btn:Laya.Button = getChildByName(box,'btn_check');
        btn.offAll(Laya.Event.CLICK);
        var md:any = this._list.dataSource[index];

        btn.on(Laya.Event.CLICK,this,this.onClickInfo,[md]);
    }  
    
    private onClickInfo(md:any,evt:Laya.Event):void
    {
        this._info = this._info || new MailInfo();
        this._info.setData(md);
        this._info.show();
    }
    
}