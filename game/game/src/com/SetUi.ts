export default class SetUi extends gamelib.core.Ui_NetHandle
{
    private _tab:Laya.Tab;
    public constructor()
    {
        super("ui.SetUiUI");
    }
    protected init():void
    {
        this.addBtnToListener("btn_ok");
        this.addBtnToListener("btn_logout");
        this.addBtnToListener("btn_gx");
        
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
        if(index == 0)
            this.showSound();
        else if(index == 1)
            this.showPWD();
        else
            this.showAPP();
    }
    private showSound():void
    {
        this._res['b_sound'].visible = true;
        this._res['b_pwd'].visible = false;
        this._res['b_app'].visible = false;
    }
    private showPWD():void
    {
        this._res['b_sound'].visible = false;
        this._res['b_pwd'].visible = true;
        this._res['b_app'].visible = false;
    }
    private showAPP():void
    {
        this._res['b_sound'].visible = false;
        this._res['b_pwd'].visible = false;
        this._res['b_app'].visible = true;
    }
}