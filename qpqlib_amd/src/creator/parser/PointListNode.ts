namespace qpq.creator.parser
{
	export class PointListNode extends NodeItem
	{	
		private _bg:Laya.Image;
		private _point:Laya.Image;
		private _label:Laya.Label;
		private _add:Laya.Button;
		private _sub:Laya.Button;

		private _value:number;
		private _maxValue:number;
		private _minValue:number;
		private _tick:number;
		constructor(config:any) 
		{
			super(config);
		}
		protected build()
        {
            this._label = new Laya.Label();
            this._label.fontSize = 24;
            this._label.color = this.config.color || colors.label;
            this.addChild(this._label);

            this._add = new Laya.Button();
            this._add.skin = "comp/btn_jia.png";

            this._sub = new Laya.Button();
            this._sub.skin = "comp/btn_jian.png";

            this._add.stateNum = this._sub.stateNum = 2;

            this._point = new Laya.Image();
            this._point.skin = "comp/bg_df2.png";

            this._bg = new Laya.Image();
            this._bg.skin = "comp/bg_df1.png";

            this.addChild(this._add);
            this.addChild(this._bg);
            this._bg.addChild(this._point);
            this.addChild(this._sub);
            this._point.addChild(this._label);
            this.timer.callLater(this,this.setPos);

            this._value = parseInt(this._config.value);
            this._maxValue = parseInt(this._config.maxValue);
            this._minValue = parseInt(this._config.minValue);
            this._tick = parseInt(this._config.tick);
            this._add.on(Laya.Event.CLICK,this,this.onAdd);
            this._sub.on(Laya.Event.CLICK,this,this.onSub);
            this._label.text = "1";
        }     
        public setConfig(config:any):void
        {
            this.name = config.name;
            this._config = config;
            this.position = config.pos;      
        }   
        private setPos():void
        {
        	var off:number = (this._bg.height - this._point.height ) / 2;      
        	this._sub.x = 0;
        	this._bg.x = this._add.width + 5;
        	this._add.x = this._bg.x + this._bg.width + 5;
        	this._point.x = this._point.y = off;
        	this._label.y = (this._point.height - this._label.height) /2;
        	this._label.width = this._point.width;
        	this._label.align = "center";
            this.updateValue();
        }
        private updateValue():void
        {
        	var off:number = (this._bg.height - this._add.height ) / 2;     
        	//两个之间的间隔.（总宽度-10 * 单个的宽度） / （10 -1）
        	var grap:number = (this._bg.width - off * 2 - this._maxValue * this._point.width) / (this._maxValue -1);
        	this._point.x = off + (this._point.width + grap) * (this._value - 1);
            this._label.text = this._value + "";
        }
        public get value():any 
        {
            return this._value;
        }
        public set value(args:any)
        {
            this._value = parseInt(args);
            this.updateValue();
        }
        private onAdd(evt:Laya.Event):void
        {
        	if(this._value < this._maxValue)
        	{
        		this.value = this._value + this._tick;
        	}
        }
        private onSub(evt:Laya.Event):void
        {
        	if(this._value > this._minValue)
        	{
        		this.value = this._value -  this._tick;
        	}
        }

	}
}