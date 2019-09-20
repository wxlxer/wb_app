/**
 * Created by wxlan on 2017/8/17.
 */
namespace gamelib.control
{
    /**
     * 拖动条控件
     * 需要传的res必须包含txt_0,txt_1,hslider
     * @class Slider
     */
    export class Slider
    {
        private _label_txt:Laya.Label;
        private _value_txt:Laya.Label;
        private _slider:Laya.HSlider;
        private _update_fun:Function;
        private _update_thisobj:any;
        private _res:any;
        public constructor(res:any)
        {
            this._label_txt = res["txt_0"];
            this._value_txt = res["txt_1"];
            this._slider = res["hslider"];
            if(this._slider)
            {
                this._slider.allowClickBack = true;
                this._slider.showLabel = false;
                this._slider.changeHandler = Laya.Handler.create(this,this.onChange,null,false);    
            }
            this._res = res;
        }
        public show():void
        {
            this.close();
            this._slider.on(Laya.Event.CHANGE,this,this.onChange);
        }
        public close():void
        {
            this._slider.off(Laya.Event.CHANGE,this,this.onChange);
        }
        /**
         * 设置标题 
         * @function setLabel
         * @DateTime 2018-03-17T14:28:49+0800
         * @param    {string}                 str [description]
         */
        public setLabel(str:string):void
        {
            this._label_txt.text = str;
        }
        /**
         * 设置最大值和最小值
         * @function
         * @DateTime 2018-03-17T14:29:04+0800
         * @param    {number}                 minimum [description]
         * @param    {number}                 maximum [description]
         */
        public setParams(minimum:number,maximum:number):void
        {
            this._slider.value = this._slider.min = minimum;
            this._slider.max = maximum;
            this.updateValues();
        }
        /**
         * 设置每次拖动的回调
         * @function setUpdateCallBack
         * @DateTime 2018-03-17T14:29:26+0800
         * @param    {Function}               fun     [description]
         * @param    {any}                    thisobj [description]
         */
        public setUpdateCallBack(fun:Function,thisobj:any):void
        {
            this._update_fun = fun;
            this._update_thisobj = thisobj;
        }

        /**
         * 当前的值
         * @DateTime 2018-03-17T14:29:49+0800
         * @type   {number} 
         */
        public get value():number
        {
            return this._slider.value;
        }
        public set value(v:number)
        {
            this._slider.value = v;
            this.updateValues();
            if(this._update_fun != null)
                this._update_fun.apply(this._update_thisobj,[this._slider.value]);
        }
        /**
         * 是否禁用
         * @DateTime 2018-03-17T14:29:49+0800
         * @type   {boolean} 
         */
        public set enabled(value:boolean)
        {
            this._slider.disabled = !value;
        }
        public get enabled():boolean
        {
            return !this._slider.disabled;
        }
        /**
         * 是否显示
         * @DateTime 2018-03-17T14:29:49+0800
         * @type   {boolean} 
         */
        public set visible(value:boolean)
        {
            this._res.visible = value;
        }
        public get visible():boolean
        {
            return this._res.visible;
        }

        private onChange():void
        {
            this.updateValues();
            if(this._update_fun != null)
                this._update_fun.apply(this._update_thisobj,[this._slider.value]);
        }
        private updateValues():void
        {
            this._value_txt.text = this._slider.value+"";
            var scale:number = (this._slider.value - this._slider.min) / (this._slider.max - this._slider.min);
            scale = Math.max(0,scale);
            scale = Math.min(1,scale);
        }

    }
}
