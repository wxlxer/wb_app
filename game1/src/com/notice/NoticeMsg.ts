export default class NoticeMsg extends gamelib.core.Ui_NetHandle
{
    private _list:Array<any>;
    private _index:number;
    public constructor()
    {
        super("ui.NoticeMsgUI");
    }
    protected init():void
    {
        this.addBtnToListener("btn_ok");
    }
    public setData(data:any):boolean
    {
        this._index = 0;
        this._list = data.retData || [];
        if(this._list.length == 0)
            return false;
        this.setItme(this._list[this._index++]);
        return true;
    }
    private setItme(data:any):void
    {
        this._res['txt_gg'].text = data.ggcontent;
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        if(this._index >= this._list.length)
        {
            this.close();
            return;
        }
        this.setItme(this._list[this._index++]);
    }
}