/**
 * Created by wxlan on 2017/8/22.
 */
namespace qpq.creator.parser
{
    export class SliderGroup extends Group
    {
        private _slider:SliderNode;
        public constructor(config:any)
        {
            super(config)
        }
        protected build():void
        {
            this._config.items = [this._config];
            super.build();
            for(var item of this._items)
            {
                (<SliderNode>item).slider.setUpdateCallBack(this.onSliderChange,this);
            }
            this._slider = <SliderNode>this._items[0];
        }
        public show():void
        {
            this._slider = <SliderNode>this._items[0];
            super.show();

        }
        //public toControl(node_name:string,value:number):void
        //{
        //    super.toControl(node_name, value);
        //    this.onValueChange();
        //}
        public set value(args:number)
        {
            this.setValue("",args);
        }
        private onSliderChange(value:number):void
        {
            this._config.value = value;
            this.onValueChange();
        }
        public get value():number
        {
            return this._slider.value;
        }
        /**
         * 设置数据值，仅用于应用用户习惯
         **/
        public setValue(node_name:string,value:number):void
        {
            this._slider.value = value;
            this._config.value = value;
        }
        public set label(value:string)
        {
            (<SliderNode>this._items[0]).label = value;
        }
        protected onValueChange():void
        {
        
        }
    }
}
