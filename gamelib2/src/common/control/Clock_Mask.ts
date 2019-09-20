namespace gamelib.control
{
	/**
	 * 头像转圈时钟
	 * @class Clock_Mask
	 */
	export class Clock_Mask{
		private _res:any;
		private _mask:CubeMask;
		private _localSeat:number;
		private _soundName:string;
		private _waringName:string;

		/**
		 * 头像转圈时间。
		 * @constructor Clock_Mask
		 * @param {any}    res   对象必须为单独的一个皮肤。里面必须包含img_djs_2和img_djs_3两张图片
		 * @param {number} localSeat [description]
		 */
		constructor(res:any,localSeat:number){
			this._res = res;
			
			this._localSeat = localSeat;

			var radius:number = Math.sqrt(res.width*res.width + res.height*res.height)/2
			this._mask = new CubeMask(radius);
			this._mask.x = 0 + this._res.width/4;
			this._mask.y = 0 + this._res.height/4;

			this._res.mask = this._mask;
			
			this._res.visible = false;
			this._soundName = "daojishi";
		}
		/**
		 * 倒计时音效。默认为daojishi
		 * @type {string} value [description]
		 */
		public set soundName(value:string)
		{
			this._soundName =value;
		}
		/**
		 * 刚到第5秒的时候的音效。默认不播放。
		 * @type {string} value 
		 */
		public set waringName(value:string)
		{
			this._waringName = value;
		}

		// 销毁
		public destroy(){
			this._mask.destroy();

			this._res = null;
			this._localSeat = -1;
		}

		// 获取玩家本地坐标
		public get localSeat():number{
			return this._localSeat;
		}

		/**
		 * 开始计时
		 * @function startClock
		 * @DateTime 2018-03-17T14:17:08+0800
		 * @param    {number}                 time [description]
		 */
		public startClock(time:number):void{
			this._mask.visible = this._res.visible = true;
			
			this._res["img_djs_2"].visible = true;
			this._res["img_djs_3"].visible = true;

			this._mask.on("changColor1",this,this.changeColor1);
			this._mask.on("changColor2",this,this.changeColor2);
			this._mask.on("complete",this,this.complete);
			this._mask.on("voice",this,this.voice);
			this._mask.on("voicePrompt",this,this.voicePrompt);

			this._mask.start(time);			
		}

		/**
		 * 停止时间
		 * @function stop
		 * @DateTime 2018-03-17T14:17:23+0800
		 */
		public stop():void{
			this._mask.stop();

			this._mask.off("changColor1",this,this.changeColor1)
			this._mask.off("changColor2",this,this.changeColor2);
			this._mask.off("complete",this,this.complete);
			this._mask.off("voicePrompt",this,this.voicePrompt);
			this._mask.off("voice",this,this.voice);
			this._mask.visible = this._res.visible = false;
		}

		// 设置颜色1
		private changeColor1(){
			this._res["img_djs_2"].visible = false;
			this._res["img_djs_3"].visible = true;
		}

		// 设置颜色2
		private changeColor2(){
			this._res["img_djs_2"].visible = true;
			this._res["img_djs_3"].visible = false;
		}

		// 声音提示
		private voicePrompt()
		{
			console.log("声音提示一次");
			if(this._waringName)
				playSound_qipai(this._waringName);
			else
				playSound_qipai(this._soundName);
		}

		private voice():void
		{
			playSound_qipai(this._soundName);
		}

		// 完成
		private complete(){
			this.stop();
		}
	}

	// 遮罩
	export class CubeMask extends Laya.Sprite{
		private _fillColor:any;			//填充颜色

		private _radius:number;			//扇形半径
		private _startAngle:number;		//开始角度
		private _endAngle:number;		//结束角度

		private _dalta:number;			//增加的角度

		private _time:number;			//时间
		private _second:number;			//剩余秒数

		private _changeColor1:boolean;	//倒计时第一次变色
		private _changeColor2:boolean;	//倒计时第二次变色

		private _tempTime:number;		//计时

		private _bPlaySound:boolean;	//是否播放声音

		public constructor(radius:number){
			super();

			this._radius = radius;
			this._fillColor = "#000000";

			this._changeColor1 = false;
			this._changeColor2 = false;

			this._tempTime = 0;

			this._bPlaySound = false;
		}

		// 销毁
		public destroy(){
			this._fillColor = null;			//填充颜色

			this._radius = 0;			//扇形半径
			this._startAngle = 0;		//开始角度
			this._endAngle = 0;			//结束角度

			this._dalta = 0;			//增加的角度

			this._time = 0;				//时间
			this._second = 0;			//剩余秒数

			this._changeColor1 = null;	//倒计时第一次变色
			this._changeColor2 = null;	//倒计时第二次变色

			this._tempTime = 0;			//计时

			this._bPlaySound = false;	//是否播放声音
		}

		// 开始计时
		public start(second:number):void{
			this._second = second;
			this._time = second*1000;

			this._dalta = 360 / this._time * 60;

			this._startAngle = 270;
			this._endAngle = this._startAngle + this._dalta;

			this._changeColor1 = false;
			this._changeColor2 = false;

			this._tempTime = 0;

			this._bPlaySound = false;

			this.visible = true;
			this.graphics.clear();

			Laya.timer.loop(60,this,this.changeGraphics);
		}
	
		// 停止
		public stop():void{
			Laya.timer.clear(this,this.changeGraphics);
		}

		// 绘制扇形
		private changeGraphics():void{
			this.graphics.drawPie(this.x,this.y,this._radius,this._startAngle,this._endAngle,this._fillColor);
			this._endAngle += this._dalta;
			this._time -= 60;

			if(this._time < 5000)
			{
				this._tempTime += 60;

				if(this._tempTime >=1000)
				{
					this._tempTime = 0;
					if(!this._bPlaySound)
					{
						this.event("voicePrompt");	
						this._bPlaySound = true;
					}
					else
					{
						this.event("voice");	
					}
					
				}
			}

			if(this._endAngle >= this._startAngle+120 && !this._changeColor1){
				this._changeColor1 = true;
				this.event("changColor1");
			}
			
			if(this._endAngle >= this._startAngle+240  && !this._changeColor2){
				this._changeColor2 = true;
				this.event("changColor2");
			}
			
			if(this._endAngle >= this._startAngle+365){
				this.event("complete");
			}

		}
	}
}