export default class BaseHistroy extends gamelib.core.Ui_NetHandle
{
    protected _list:Laya.List;
    protected _tips:Laya.Label;
    public constructor(res:string)
    {
        super(res);
    }
    protected init():void
    {
        this._list = this._res["list_1"];
        this._tips = this._res['txt_tips'];
        this._list.selectHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.dataSource = [];
    }
    public setData(data:any):void
    {
        this._list.dataSource = data;
        this._tips.visible = data.length == 0;
    }
    protected onItemRender(box:Laya.Box,index:number):void
    {

    }   
}