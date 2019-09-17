import XiMaHistroy from "./XiMaHistroy";
import BasePanel from "../BasePanel";

export default class XiMa extends BasePanel
{
    private _tab:Laya.Tab;
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
        this._tab = this._res["tab_1"];
        this._list = this._res["list_1"];

        this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
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