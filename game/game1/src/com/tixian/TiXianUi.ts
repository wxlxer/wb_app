import TiXianHistroy from "./TiXianHistroy";
import BasePanel from "../BasePanel";
import TabList from "../control/TabList";
import { g_playerData } from "../data/PlayerData";

export default class TiXianUi extends BasePanel
{
    private _tab:TabList;

    private _list:Laya.List;

    private _histroy:TiXianHistroy;
    public constructor()
    {
        super("ui.TiXianUI");
    }

    protected init():void
    {
        this._tab = this._res['tab_1'];
        this._tab = new TabList(this._res["list_tab"]);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {skins:["btns/ic_withdraw_bank.png","btns/ic_withdraw_bank_pressed.png"]},
            {skins:["btns/ic_withdraw_blance.png","btns/ic_withdraw_blance_pressed.png"]},
            {skins:["btns/ic_withdraw_card.png","btns/ic_withdraw_card_pressed.png"]}
        ];
        
        this.addBtnToListener("btn_tx");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_bangding");
        this.addBtnToListener("btn_addBank");
        this.addBtnToListener("btn_prev");
        this.addBtnToListener("btn_bd");
        this.addBtnToListener("btn_histroy");
        
        this._list = this._res['list_1'];
        this._list.dataSource = [];
        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
    }

    protected onShow():void
    {
        super.onShow();
        this._res['txt_money'].text = g_playerData.m_money + "元";
        this._tab.selectedIndex = 0;
        this.onTabChange(0);

    }

    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showTiXian();
        else if(index == 1)
            this.showGuanLi();
       
    }
    private onItemRender(box:Laya.Box,index:number):void
    {

    }
    protected showTiXian():void
    {
        this._res['b_tx'].visible = true;
        this._res['b_bank'].visible = false;
        this._res['b_add'].visible = false;
    }
    protected showGuanLi():void
    {
        this._res['b_tx'].visible = false;
        this._res['b_bank'].visible = true;
        this._res['b_add'].visible = false;
    }
    protected showAddBank():void
    {
        this._res['b_tx'].visible = false;
        this._res['b_bank'].visible = false;
        this._res['b_add'].visible = true;
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_clear":
                this._res['txt_input'].text = "0";
                break;
            case "btn_bangding":
                this._tab.selectedIndex = 1;
                break;
            case "btn_addBank":
                this.showAddBank();
                break;
            case "btn_prev":
                this.showGuanLi();
                break;
            case "btn_bd":
                //绑定
                break;
            case "btn_tx":  //确认体现
                break;    
            case "btn_histroy":
                this._histroy = this._histroy || new TiXianHistroy();
                this._histroy.show();
                break;
        }
    }
}