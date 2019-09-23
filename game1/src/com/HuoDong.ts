import BasePanel from "./BasePanel";

export default class HuoDong extends BasePanel
{
    private _tab:Laya.Tab;
    private _list:Laya.List;
    public constructor()
    {
        super("ui.HuoDongUiUI");
    }

    protected init():void
    {
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
}