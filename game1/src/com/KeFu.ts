import BasePanel from "./BasePanel";

export default class KeFu extends BasePanel
{
    private _tab:Laya.Tab;
    public constructor()
    {
        super("ui.KeFuUiUI");
    }
    protected init():void
    {
        this.addBtnToListener("btn_lx");
        
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
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