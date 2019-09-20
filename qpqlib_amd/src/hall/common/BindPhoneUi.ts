namespace qpq.hall
{
	export class BindPhoneUi extends gamelib.core.Ui_NetHandle
	{
		private _get:Laya.Button;
		private _phone_verify_vid:number;
		private _netData:any;
		constructor() {
			super("qpq/Art_BdPhone");
		}
		protected init():void
		{
			super.init();
			this._get = this._res['btn_hqyzm'];
			this.addBtnToListener("btn_hqyzm");
			this.addBtnToListener("btn_ok");
			this._res['txt_input1'].restrict ="0-9";
			this._res['txt_input1'].maxChars ="11";

			this._res['txt_input2'].restrict ="0-9";
			this._res['txt_input2'].maxChars ="4";
			this.m_closeUiOnSide = false;
			this._noticeOther = true;
		}
		protected onShow():void
		{
			super.onShow();
			this._res['txt_input1'].text = GameVar.urlParam['bind_phone'] || "";
			this._res['txt_input2'].text = "";
			this._get.disabled = false;
			this._get.label = getDesByLan("获取验证码");

			if(g_commonFuncs == null)
			{
				sendNetMsg(0x2035,1,GameVar.pid,"");
			}
		}
		public reciveNetMsg(msgId: number,data: any):void
		{
			if(msgId == 0x2035)
			{
				this._netData = data;
			}
		}
		protected onClose():void
		{
			super.onClose();
			Laya.timer.clearAll(this);
		}

		protected onClickObjects(evt:Laya.Event):void
		{
			switch(evt.currentTarget.name)
			{
				case "btn_hqyzm":
					playButtonSound();
					var tel:string = this._res['txt_input1'].text;
					if(!utils.checkMobile(tel))
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请输入有效的手机号")});
						return;
					}					
					if(window['application_mobile_verify'])
					{
						g_uiMgr.showMiniLoading();
						window['application_mobile_verify'](tel,this.onGetVerifyCallBack,this);
					}
					this._get.disabled = true;
					this.timer(180);
					break;
				case "btn_ok":
					playButtonSound();
					var tel:string = this._res['txt_input1'].text;
					if(!utils.checkMobile(tel))
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请输入有效的手机号")});
						return;
					}
					var yzm:string = this._res['txt_input2'].text;
					if(yzm == "" || yzm.length != 4)
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请输入验证码")});
						return;
					}
					if(this._phone_verify_vid == 0 || isNaN(this._phone_verify_vid))
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("无效的验证码")});
					}
					//开始绑定
					if(window['application_bind_mobile'])
					{
						g_uiMgr.showMiniLoading();
						window['application_bind_mobile'](tel,this._phone_verify_vid,yzm,this.onBindCallBack.bind(this));
					}
					break;
			}
		}
		private timer(time:number):void
		{
			if(time == 0)
			{
				this._get.disabled = false;
				this._get.label = getDesByLan("获取验证码");
				return;
			}
			this._get.label = time + "s";
			Laya.timer.once(1000,this,this.timer,[time - 1]);
		}
		/**
		 * 返回验证玛
		 * @param {any} ret [description]
		 */
		private onGetVerifyCallBack(ret:any):void
		{
			g_uiMgr.closeMiniLoading();
			if(ret.result != 0)
			{
				this._phone_verify_vid = 0;
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("验证码发送失败") + "：" + ret.msg})
			}
			else
			{
				this._phone_verify_vid  = ret.data.vid;
			}
		}
		/**
		 * 绑定回掉
		 * @param {any} ret [description]
		 */
		private onBindCallBack(ret:any):void
		{
			g_uiMgr.closeMiniLoading();
			if(ret.result != 0)
			{
				this._phone_verify_vid = 0;
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("绑定手机失败")+"：" + ret.msg});
			}
			else
			{
				this.close();
				var tel:string = this._res['txt_input1'].text;
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("成功绑定手机") + ":" + tel});	
				GameVar.urlParam['bind_phone'] = tel;
				this._netData["手机号码"] = tel;
				sendNetMsg(0x2035,0,GameVar.pid,JSON.stringify(this._netData));
				Laya.timer.once(1000,this,function()
				{
					sendNetMsg(0x2035,1,GameVar.pid,"");	
				})			

				// if(g_commonFuncs == null)
				// {							
				// }
				// else
				// {
				// 	g_commonFuncs.saveSelfInfo({phone:parseInt(tel)});
				// }
				try
				{
					sendNetMsg(0x2202,2,6);
				}
				catch(e)
				{
					
				}
				sendNetMsg(0x001A);	//领取奖励
			}
		}
	}
}