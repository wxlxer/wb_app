export default class TimePicker extends Laya.EventDispatcher
{
    private _res:Laya.Image;
    private _label:Laya.Label;
    public constructor(res:Laya.Image)
    {
        super();
        this._res = res;
        this._label = res.getChildAt(0) as Laya.Label;

        this._res.mouseEnabled = true;
        this._res.on(Laya.Event.CLICK,this,this.onClick);
        this.clear();
    }
    public clear():void
    {
        this._label.text = "";
    }
    public get time():string{
        return this._label.text;
    }   

    private onClick(evt:Laya.Event):void
    {
        var self = this;
        if(window['showDatePicker'])
        {
            window['showDatePicker'](function(txt){
                self._label.text = txt;
                self.event(Laya.Event.CHANGE,txt);
            });
        }
    }
}