export default class BasePanel extends gamelib.core.Ui_NetHandle
{
    public constructor(res)
    {
        super(res);
    }
    public show():void
    {
        super.show();
        this.aniIn();
        g_signal.dispatch("onUiShow",this);
    }
    public close():void
    {
        this.aniOut();
        g_signal.dispatch("onUiClose",this);
    }
    protected onShow():void
    {
        super.onShow();
        
    }
    protected onClose():void
    {
        super.onClose();
    }
    private aniIn():void
    {
        this._res.x = Laya.stage.width;
        Laya.Tween.to(this._res,{x:0},300,Laya.Ease.quartOut);
    }
    private aniOut():void
    {
        Laya.Tween.to(this._res,{x:Laya.stage.width},300,Laya.Ease.quartOut,Laya.Handler.create(this,this.onAniOutEnd));
    }
    private onAniOutEnd():void
    {
        super.close();
    }
}