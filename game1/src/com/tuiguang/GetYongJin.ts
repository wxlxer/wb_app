export default class GetYongJin extends gamelib.core.Ui_NetHandle
{
    public constructor()
    {
        super('ui.LingQuYongJinUI');
    }
    protected init():void
    {
        this.addBtnToListener(this._res['btn_ok']);
        this.addBtnToListener(this._res['btn_all']);
    }
    
}