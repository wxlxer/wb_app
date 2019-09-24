import BasePanel from "./BasePanel";
import TabList from "./control/TabList";

export default class HuoDong extends BasePanel
{
    private _tab:TabList;
    private _list:Laya.List;
    public constructor()
    {
        super("ui.HuoDongUiUI");
    }

    protected init():void
    {
        this._list = this._res["list_1"];
        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {skins:["btns/ic_act_zonghe.png","btns/ic_act_zonghe_pressed.png"]},
            {skins:["btns/ic_act_qipai.png","btns/ic_act_qipai_pressed.png"]},
            {skins:["btns/ic_act_buyu.png","btns/ic_act_buyu_pressed.png"]},
            {skins:["btns/ic_act_dianzi.png","btns/ic_act_dianzi_pressed.png"]},
            {skins:["btns/ic_act_shixun.png","btns/ic_act_shixun_pressed.png"]},
            {skins:["btns/ic_act_sports.png","btns/ic_act_sports_pressed.png"]},
        ];
        this._tab.selectedIndex = 0;

        this._list.selectHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.dataSource = [];
    }
    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    }
    private onTabChange(index:number):void
    {
        
    }
    private onItemRender(box:Laya.Box,index:number):void
    {

    }   
}