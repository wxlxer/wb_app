

export default class MailInfo extends gamelib.core.Ui_NetHandle
{
    private _txt:Laya.TextArea;
    private _id:number;
    public constructor()
    {
        super("ui.MailInfoUI");
    }

    protected init():void
    {
        this._txt = this._res["txt_info"];
        this._txt.text = "";
        this.addBtnToListener('btn_remove');
    }
    public setData(data:any):void
    {
        this._id = data.id;
        this._txt.text = data.context;
    }

    protected onClickObjects(evt:Laya.Event):void
    {
        g_net.requestWithToken(gamelib.GameMsg.Websitemaildelete,{id:this._id});
        this.close();
    }
    
}