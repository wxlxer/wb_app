export default class Notice extends gamelib.core.Ui_NetHandle
{
    public constructor()
    {
        super("ui.NoticeUI");
    }
    public setData(data:any):void
    {
        this._res['img_gg'].skin = GameVar.s_domain + data.image;
    }
}