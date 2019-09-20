namespace qpq.hall
{
	/**
	 * 绑定推荐人
	 * @type {[type]}
	 */
	export class BindRefer
	{		
		private _input:Laya.TextInput;
		private _btn:Laya.Button;
		private _label:Laya.Label;
		private _box:Laya.Box;

		constructor(res:any) {
			this._box = res['b_bangding'];			
			this._btn = res['btn_bangding'];
			this._box["name"] = this._btn["name"] = "btn_bangding";
			this._label = res['txt_tjr'];
			this._input = res['txt_input2'];
			this._input.editable = false;
			this._input.mouseEnabled = false;
		}

		public show():void {
			this._box.visible = true;

			var refer:string = GameVar.urlParam['refer'];
			if(refer == "" || refer == undefined || refer == "0") {
				this._label.visible = true;	

				this._label.text = getDesByLan("请绑定推荐人");

				this._btn.disabled = false;

			} else {

				this._label.visible = true;
				// this._box.visible = false;
				this._label.text = getDesByLan("推荐人") + ":" + refer;

				this._btn.disabled = true;
			}

			this._input.text = "";
			this._input.prompt = "";
			this._btn.on(Laya.Event.CLICK,this,this.onClickInput);
			this._box.on(Laya.Event.CLICK,this,this.onClickInput)
		}

		public close():void
		{
			this._box.visible = false;
			// this._box.off(Laya.Event.CLICK,this,this.onClickInput)
			this._btn.off(Laya.Event.CLICK,this,this.onClickInput);
		}

		private onInputValue(value:number):void {
			// this._input.text = value + "";
			this._label.text = value + "";

			if(window['application_bind_refer']) {

				g_uiMgr.showMiniLoading();
				window['application_bind_refer'](value,function(jsonObj:any):void
				{
					g_uiMgr.closeMiniLoading();
					if(jsonObj.result == 0)				
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("绑定成功")});
						GameVar.urlParam['refer'] = value;
						this._btn.disabled = true;
					}
					else
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("绑定失败") + jsonObj.msg});	

						// this._input.text = "";
						this._label.text = getDesByLan("请绑定推荐人");
					}
				},this);
			}

		}

		private onClickInput(evt:Laya.Event):void
		{
			playButtonSound();

			switch(evt.currentTarget.name) {
				case "btn_bangding":
				case "btn_bangding":
					g_signal.dispatch(qpq.SignalMsg.showKeypad_Input, [Laya.Handler.create(this, this.onInputValue), getDesByLan("输入代理ID"),12]);
					break;
			}


			// if(evt.target instanceof Laya.Button)
			// {
			// 	this.onClickBtn();
			// }
			// else
			// {				
			// 	g_signal.dispatch("showKeypad_Input", [Laya.Handler.create(this, this.onInputValue), getDesByLan("请输入推荐人的ID")]);
			// }	
		}

		private onClickBtn():void
		{
			var str:string = this._input.text;
			if(str == "")
			{
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请输入推荐人的ID")});
				return;
			}

			if(window['application_bind_refer'])
			{
				g_uiMgr.showMiniLoading();
				window['application_bind_refer'](str,function(jsonObj:any):void
				{
					g_uiMgr.closeMiniLoading();
					if(jsonObj.result == 0)				
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("绑定成功")});
						GameVar.urlParam['refer'] = str;
					}
					else
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("绑定失败") + jsonObj.msg});	
					}
				},this);
			}
		}
	}
}
