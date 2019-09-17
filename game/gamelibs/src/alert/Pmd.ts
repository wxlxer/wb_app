module gamelib.alert {

	/**
	 * @class Pmd
	 * @author wx
	 * 游戏跑马灯.需要主动设置资源。
	 */
	export class Pmd extends Laya.Sprite {
		private _msgList:Array<string>;
		private _txt:Laya.Text;
		private _container:Laya.Sprite;
		private _scrolling:boolean = false;
		private _res:Laya.Sprite;
		private _rec:laya.maths.Rectangle;
		private _speed:number;

		private _totalWidth:number;
		public constructor() {
			super();
			this._msgList = [];
			this.zOrder = 10;
		}

		/**
		 * 设置跑马灯的资源，目前主要是在qpq大厅里面设置
		 * @function setRes
		 * @author wx
		 * @DateTime 2018-03-15
		 * @param    {laya.display.Sprite} res [跑马灯会放在res上面运行]
		 */
		public setRes(res:laya.display.Sprite,speed:number = 3):void {
			if(this._res != null)
				return;
			this._speed = speed;
			this._res = res;
			var _mask:Laya.Sprite = new Laya.Sprite();
			_mask.graphics.drawRect(0,0,this._res.width,this._res.height,"#FF0000");
			
			this._res.mask = _mask;
			this._txt = <laya.display.Text>res.getChildByName("txt_label");
			this._txt['_oldX'] = this._txt.x;
			this._txt.width = 0;
			this._totalWidth = this._res.width;
			//this._rec = new laya.maths.Rectangle(0, 0, this._res.width - this._txt.x - 10, this._res.height);
			
			this._txt.overflow = "visible";
			this._txt.y = (this._res.height - this._txt.height) / 2;
			this._txt.text = "";
			this.checkShow();
		}
		public destroy():void
		{
			this.clearTimer(this, this.onScroll);
		}
		public setSpeed(value:number):void
		{
			this._speed = value;
		}
		public resize():void
		{
			this._totalWidth = this._res.width;
			var _mask:Laya.Sprite = this._res.mask || new Laya.Sprite();
			_mask.graphics.drawRect(0,0,this._res.width,this._res.height,"#FF0000");
			
			this._res.mask = _mask;

			// this._rec = new laya.maths.Rectangle(0, 0, this._res.width - this._txt['_oldX'] - 10, this._res.height);
		}
		/**
		 * 添加消息到跑马灯队列中
		 * @function add
		 * @author wx
		 * @DateTime 2018-03-15T20:49:00+0800
		 * @param    {string}     msg [description]
		 */
		public add(msg:string):void {
			this._msgList.push(msg);
			if (this._res == null) {
				return;
			}
			this.checkShow();
		}

		private checkShow():void {
			if (this._msgList.length == 0 && !this._scrolling )
			{
				this.clearTimer(this, this.onScroll);
			}
			else if(this._scrolling)
			{
				return;
			}
			else
			{
				var msg:string = this._msgList.shift();
				this._txt.text = msg;
				this._txt.x = this._totalWidth;
				// this._rec.x = - this._rec.width;
				// this._txt.scrollRect = this._rec;
				this.frameLoop(1, this, this.onScroll);
				this._scrolling = true;
			}
		}

		private onScroll():void {
			this._txt.x -= this._speed;
			if(this._txt.x <= -this._txt.width)
			{
				this._scrolling = false;
				this.checkShow();
			}
			// this._rec.x += this._speed;
			// this._txt.scrollRect = this._rec;
			// if (this._rec.x > this._rec.width + this._txt.width) {
			// 	this._scrolling = false;
			// 	this.checkShow();
			// }
		}
	}

	/**
	 * @class Pmd_Laba
	 * @ignore
	 */
	export class Pmd_Laba extends gamelib.core.BaseUi {
		private _container:laya.display.Sprite;
		private _msgList:Array<string>;
		private _txt:laya.display.Text;
		private _scrolling:boolean = false;

		public constructor() {
			super("ui.Art_Laba_tipsSkin");
		}

		public init():void {
			//this._res.touchChildren = false;
			//this._res.touchEnabled = false;
			var temp = this._res["txt_laba"];
			this._container = new laya.display.Sprite();
			
			//this._container.mask = new egret.Rectangle(0,0,temp.width,temp.height);
			//this._container.x = temp.x;
			//this._container.y = temp.y;
			//this.addChild(this._container);
			this._msgList = [];
		}

		public add(msg:string):void {
			msg = msg.replace(/\n/, "");
			this._msgList.push(msg);
			this.checkShow();
		}

		private checkShow():void 
		{
			if (this._msgList.length == 0) {
				//this.parent.removeChild(this);
			}
			else {
				//g_director.getRunningScene().addChild(this);
				//if(this._scrolling == false)
				//	this.scrollText(this._msgList.shift());
			}
		}

		private scrollText(msg:string):void {
			if (this._txt == null) {
				//this._txt = new egret.TextField();
				//this._txt.multiline = false;
				//this._txt.wordWrap = false;
				//this._txt.size = 24;
			}
			this._container.addChild(this._txt);
			this._txt.text = msg;
			this._txt.x = 650;
			//egret.Tween.get(this._txt).to({x:-this._txt.width},15000).call(this.scrollEnd,this);
			this._scrolling = true;
		}

		private scrollEnd():void {
			this._container.removeChild(this._txt);
			//egret.Tween.removeTweens(this._txt);
			this._scrolling = false;
			this.checkShow();
		}
	}
}