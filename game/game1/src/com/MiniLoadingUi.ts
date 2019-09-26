export default class MiniLoadingUi extends gamelib.core.BaseUi
{
    private _ani:Laya.FrameAnimation;
    public constructor()
    {
        super('ui.MiniLoadingUI');
    }
    protected init():void
    {
        this._ani = this._res['ani1'];
        this.m_closeUiOnSide = false;
    }
    protected onShow():void
    {
        this._ani.play(0,true);
    }
    protected onClose():void
    {
        this._ani.stop();
    }


}