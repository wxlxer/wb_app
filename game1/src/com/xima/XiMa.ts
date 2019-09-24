import XiMaHistroy from "./XiMaHistroy";
import BasePanel from "../BasePanel";
import TabList from "../control/TabList";

export default class XiMa extends BasePanel
{
    private _tab:TabList;
    private _list:Laya.List;

    private _histroy:XiMaHistroy;
    public constructor()
    {
        super("ui.XiMaUI");
    }

    protected init():void
    {
        this.addBtnToListener("btn_sd");
        this.addBtnToListener("btn_histroy");
        this._tab = new TabList(this._res["list_tab"]);
        this._list = this._res["list_1"];

        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {skins:["btns/ic_xima_qipai.png","btns/ic_xima_qipai_pressed.png"]},
            {skins:["btns/ic_xima_zhenren.png","btns/ic_xima_zhenren_pressed.png"]},
            {skins:["btns/ic_xima_sport.png","btns/ic_xima_sport_pressed.png"]},
            {skins:["btns/ic_xima_dianzi.png","btns/ic_xima_dianzi_pressed.png"]},
            {skins:["btns/ic_xima_buyu.png","btns/ic_xima_buyu_pressed.png"]}
        ];

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
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_histroy":
                this._histroy = this._histroy || new XiMaHistroy();
                this._histroy.show();
                break;
            case "btn_sd":
                break;
        }
    }
}