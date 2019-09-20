module qpq.hall 
{
	export class KeyPad_Input extends KeyPad
	{
		private _handle:Laya.Handler;
		private _maxChars:number;
		private _maxValue:number;
		protected _btn_dian:Laya.Button;
		constructor() {
			super("qpq/Art_Keyboard1")
		}
		protected init():void
		{
			super.init();
			this._checkLength = 10000;
			this._defaultInput = "";
			this._noticeOther = false;
			this._btn_dian = this._res['btn_dian'];
			if(this._btn_dian)
			{
				this.addBtnToListener("btn_dian");
			}
		}
		public setData(data:any):void
		{
			this._text_input.text = this._defaultInput = "";
			this._handle = data[0];
			if(this._res['txt_title'])
				this._res['txt_title'].text = data[1];
			else
				this._text_input.text = this._defaultInput = data[1];
			if(typeof data[2] == "string")
			{
				this._maxValue = parseInt(data[2]);
			}
			else if(typeof data[2] == "number")
			{
				this._maxChars = data[2];	
			}
			//this._maxChars = data[2] || 7;
		}
		protected onClickObjects(evt:laya.events.Event):void {
            var keyName:string = evt.target.name;
            if(keyName == "btn_back")
            {	
            	playButtonSound() ;
            	if(this._text_input.text == this._defaultInput || this._text_input.text == "")
            	{
            		return;
				}
				if(this._btn_dian == null)
					this._handle.runWith(parseInt(this._text_input.text));
				else
				{
					var rate:number = utils.tools.getExchangeRate();
					this._handle.runWith(parseFloat(this._text_input.text) * rate);
				}	
            	this.close();
            }
            else
            {
            	super.onClickObjects(evt);
            }            
		}
		
        protected checkInput(key:string):void
        {
			if(this._btn_dian == null)
			{
				var index:number = parseInt(key);
				if((this._text_input.text == this._defaultInput) && (index == 0))
					return;
				if(this._text_input.text != this._defaultInput)
				{
					if(!isNaN(this._maxChars))
					{
						if(this._text_input.text.length >= this._maxChars)
							return;
					}
					else if(!isNaN(this._maxValue))
					{
						var num:number = parseInt(this._text_input.text + key);
						if(num > this._maxValue)
							return;
					}
					this.addNum(index);
				}
				else
				{
					this.addNum(index);
				}
			}
			else
			{
				var isDian:boolean = key == "btn_dian";
				var index:number = parseInt(key);
				if((isNaN(index) || index >= 10) && !isDian)        
					return;
				if((this._text_input.text == this._defaultInput) && (isDian))
					return;
				if(isDian)
				{
					if(this._text_input.text.indexOf('.') != -1)
						return;
				}
				if(this._text_input.text != this._defaultInput)
				{
					if(!isNaN(this._maxChars))
					{
						if(this._text_input.text.length >= this._maxChars)
							return;
					}
					else if(!isNaN(this._maxValue))
					{
						var num:number = parseFloat(this._text_input.text + key);
						if(num > this._maxValue)
							return;
					}
				}
				if(isDian)
					this.addNum(".");
				else
					this.addNum(index);
			}
			
        }
	}
}
