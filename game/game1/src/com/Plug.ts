export default class Plug
{
    protected _box:Laya.Box;
    private _btns:Array<Laya.Button>;
    public constructor(res:Laya.Box)
    {
        this._box = res;
        this._box.visible = false;
        this._btns = [];
    }
    protected addBtnToList(name:string,res:any):void
    {
        var temp:Laya.Button = res[name]
        if(temp == null)
            return;
        temp.name = name;
        temp.mouseEnabled = true;
        if(this._btns.indexOf(temp) == -1)
            this._btns.push(temp);        
    }
    public show():void
    {
        this._box.visible = true;
        for(var temp of this._btns)
            temp.on(Laya.Event.CLICK,this,this.onClickBtn);
    }
    public close():void
    {
        this._box.visible = false;
        for(var temp of this._btns)
            temp.off(Laya.Event.CLICK,this,this.onClickBtn);
    }

    protected onClickBtn(evt:Laya.Event):void
    {

    }

}