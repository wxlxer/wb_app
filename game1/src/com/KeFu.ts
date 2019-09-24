import BasePanel from "./BasePanel";
import TabList from "./control/TabList";

export default class KeFu extends BasePanel
{
    private _tab:TabList;
    public constructor()
    {
        super("ui.KeFuUiUI");
    }
    protected init():void
    {
        this.addBtnToListener("btn_lx");
        
        this._tab = new TabList(this._res['list_tab']);
        this._tab.dataSource = [
            {skins:["btns/ic_cus_online.png","btns/ic_cus_online_pressed.png"]},
            {skins:["btns/ic_cus_qq.png","btns/ic_cus_qq_pressed.png"]},
            {skins:["btns/ic_cus_vx.png","btns/ic_custom_vx_pressed.png"]},
            {skins:["btns/ic_cus_fqc.png","btns/ic_cus_fqc_pressed.png"]}
        ];
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
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
    
}