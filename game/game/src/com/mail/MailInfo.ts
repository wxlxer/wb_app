

export default class MailInfo extends gamelib.core.Ui_NetHandle
{
    private _txt:Laya.TextArea;
    public constructor()
    {
        super("ui.MailInfoUI");
    }

    protected init():void
    {
        this._txt = this._res["txt_info"];
        this._txt.text = "";
    }
    public setData(data:any):void
    {
        
    }
    
}