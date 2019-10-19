import BasePanel from "./BasePanel";
import TabList from "./control/TabList";
import { g_uiMgr } from "./UiMainager";

export default class HuoDong extends BasePanel
{
    private _tab:TabList;
    private _list:Laya.List;

    private _data:any;
    private _hd:any;
    public constructor()
    {
        super("ui.HuoDongUiUI");
    }

    protected init():void
    {
        this._list = this._res["list_1"];
        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        var arr:Array<any> = [];
        for(var i:number = 0; i < 5; i++)
        {
            var temp:any = {
                skins:["btns/hd_tab"+i+"_1.png","btns/hd_tab"+i+"_2.png"]
            }
            arr.push(temp);
        }
        this._tab.dataSource = arr;        
        this._tab.selectedIndex = 0;
        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.dataSource = [];

        this.addBtnToListener("btn_sqhd");
        this.addBtnToListener("btn_fhlb");
    }
    public reciveNetMsg(msg:string,rd:any,data:any):void
    {
        if(msg == gamelib.GameMsg.Gethotall){
            g_uiMgr.closeMiniLoading();
            this._data = data.retData;
            this.onTabChange(this._tab.selectedIndex);
        }
        else if(msg == gamelib.GameMsg.Applicationhot){
            g_uiMgr.closeMiniLoading();
            g_uiMgr.showTip(data.retMsg);
        }
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        if(evt.currentTarget.name == "btn_fhlb"){
            this._res['b_info'].visible = false;
        }
        else{
            g_uiMgr.showMiniLoading();
            g_net.requestWithToken(gamelib.GameMsg.Applicationhot,{id:this._hd.Id});
            this._res['b_info'].visible = false;
        }

    }
    protected onShow():void
    {
        super.onShow();
        this._res['b_info'].visible = false;
        this._tab.selectedIndex = 0;
        if(this._data == null)
        {
            g_uiMgr.showMiniLoading();
            g_net.request(gamelib.GameMsg.Gethotall,{});
            return;
        }
        this.onTabChange(0);
    }
    private onTabChange(index:number):void
    {
        this._res['b_info'].visible = false;
        if(this._data == null)
            return;
        
        var arr:Array<any> = [];
        var type:number = 0;
        if(index == 1)
            type = 9;
        else if(index == 2)
            type = 8;
        else if(index == 3)
            type = 7;
        else if(index == 4)
            type = 6;

        for(var obj of this._data){
            if(index == 0 || obj.Type == type)
                arr.push(obj);
        }
        this._list.dataSource = arr;
        this._res['txt_tips'].visible = arr.length == 0;
    }
    private onItemRender(box:Laya.Box,index:number):void
    {
        var data:any = this._list.dataSource[index];
        var img:Laya.Image = getChildByName(box,"img_hd");
        img.skin = GameVar.s_domain + data.Pcimg;
        img.mouseEnabled = true;
        img.offAll(Laya.Event.CLICK);
        img.on(Laya.Event.CLICK,this,this.onHuoDongInfo,[data]);
    }   
    private onHuoDongInfo(hd:any):void
    {
        this._hd = hd;
        this._res['b_info'].visible = true;
        this._res['img_hd'].skin = GameVar.s_domain + hd.Pcimg;
        this._res['txt_info'].text = hd.Hottime +"\n" + hd.Title + "";
    }
}