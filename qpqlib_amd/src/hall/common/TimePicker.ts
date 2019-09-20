namespace qpq.hall
{
	export class TimerPicker extends gamelib.core.BaseUi
	{
		private _handle:Laya.Handler;
		private _hour_txt:Laya.Label;
		private _minute_txt:Laya.Label;

		private _hour:number;
		private _minute:number;

		private _minHour:number;
		private _minMinute:number;

		private _btns:Array<Laya.Button>;
		constructor() {
			super("qpq/Art_CreateUI_Time1");
		}

		protected init():void
		{
			this.m_closeUiOnSide = false;
			this.addBtnToListener('btn_ok');
			this._res['btn_close'].visible = false;

			this._hour_txt = this._res['txt_1'];
			this._minute_txt = this._res['txt_2'];
			this._hour_txt.text = this._minute_txt.text = "";

			this._btns = [];
			this._btns.push(this._res['btn_up1']);
			this._btns.push(this._res['btn_up2']);
			this._btns.push(this._res['btn_down1']);
			this._btns.push(this._res['btn_down2']);
		}
		protected onShow():void
		{
			super.onShow();
			for(var btn of this._btns)
			{
				btn.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown1);
			}
		}
		protected onClose():void
		{
			super.onClose();
			for(var btn of this._btns)
			{
				btn.off(Laya.Event.MOUSE_DOWN,this,this.onMouseDown1);
			}
		}
		private _dowTime:number;
		protected onMouseDown1(evt:Laya.Event):void
		{
			this._dowTime = Laya.timer.currTimer;
			var target:Laya.Button = <Laya.Button>evt.currentTarget;
			Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp1,[target]);
			Laya.timer.once(200,this,this.btnTimer,[target,true]);
		}
		private btnTimer(target:Laya.Button,isLoop:boolean):void
		{
			switch (target) {
				case this._res['btn_up1']:
					this.setHour(this._hour - 1);	
					break;
				case this._res['btn_up2']:
					this.setMin(this._minute - 1);
					break;
				case this._res['btn_down1']:
					this.setHour(this._hour + 1);
					break;
				case this._res['btn_down2']:
					this.setMin(this._minute + 1);
					break;				
				default:
					// code...
					break;
			}
			if(isLoop)
			{
				Laya.timer.once(100,this,this.btnTimer,[target,true])
			}
		}
		protected onMouseUp1(target:Laya.Button,evt:Laya.Event):void
		{			
			console.log("onMouseUp1" + (Laya.timer.currTimer - this._dowTime));
			Laya.stage.off(Laya.Event.MOUSE_UP,this,this.onMouseUp1);
			Laya.timer.clear(this,this.btnTimer)
			if(Laya.timer.currTimer - this._dowTime <= 200)		//点击
			{
				this.btnTimer(target,false);
				return;
			}
			
		}
		public setData(data:any):void
		{
			this._handle = data[0];
			if(this._res['txt_title'])
				this._res['txt_title'].text = data[1];
			
			var default_str:string = data[1];
			var offsize:number = data[2];

			var hour:number,min:number;
			if(default_str == "server_time")
			{
				var date:Date = new Date();
				var tmc:number = Laya.timer.currTimer - GameVar.s_loginClientTime + GameVar.s_loginSeverTime * 1000;
				if(!isNaN(offsize))
                {
                    tmc += offsize * 1000;
                }
				date.setTime(tmc);
				hour = date.getHours();
				min = date.getMinutes();
			}
			else
			{
				var arr:Array<string> = default_str.split(':');
				hour = parseInt(arr[0]);
				min = parseInt(arr[1]);
			}
			this._minHour = hour;
			this._minMinute = min;

			this.setHour(hour);
			this.setMin(min);
		}
		protected onClickObjects(evt:Laya.Event):void
		{
			switch(evt.currentTarget.name)
			{
				// case "btn_up1":
				// 	this.setHour(this._hour - 1)
				// 	break;
				// case "btn_up2":
				// 	this.setMin(this._minute - 1)
				// 	break;
				// case "btn_down1":
				// 	this.setHour(this._hour + 1)
				// 	break;
				// case "btn_down2":
				// 	this.setMin(this._minute + 1)
				// 	break;	
				case "btn_ok":
					var str:string = this._hour < 10 ? "0" + this._hour :"" + this._hour;
					str += ":";
					str += this._minute < 10 ? "0" + this._minute :"" + this._minute;
					this._handle.runWith(str);
					this.close();
					break;
			}
		}
		private setHour(value:number):void
		{
			if(value < 0)
			{
				value = 23;
			}	
			else if(value > 23) 
				value = this._minHour;
			if(value < this._minHour)
			{
				// value = this._minHour;
				value = 23;
			}
			if(value == this._minHour)
			{
				if(this._minute < this._minMinute)
					this.setMin(this._minMinute);
			}

			this._hour = value;

			this._hour_txt.text = value < 10 ? "0" + value : "" + value;
		}
		private setMin(value:number):void
		{
			if(value < 0)
			{
				value = 59;
			}	
			else if(value > 59) 
			{
				value = 59;
				if(this._hour > this._minHour)
					value = 0;
				else
					value = this._minMinute;
			}	
			if(this._hour <= this._minHour)
			{
				if(value < this._minMinute)
				{
					// value = this._minMinute;
					value = 59;
				}	
			}			
			this._minute = value;
			this._minute_txt.text = value < 10 ? "0" + value : "" + value;	
		}

	}
}