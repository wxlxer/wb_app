/**
* name 
*/
namespace qpq.hall
{
	/**
	 * 有统计信息和签名
	 * @type {[type]}
	 */
	export class UserInfoUi2 extends gamelib.core.Ui_NetHandle
	{		
		private _txt_input:Laya.TextInput;
		private _pd:qpq.data.PlayerData;
		private _str:Array<string>;

		private _tjList:Array<laya.ui.Label>;
		private _tjStrings:Array<string>;

		private _bindRefer:BindRefer;
		constructor()
		{
			super("qpq/Art_Playerinfo");
		}
		protected init():void
		{
			this._txt_input = this._res["txt_input"];
			this.addBtnToListener("btn_shop2");
			this.addBtnToListener("btn_modify");
			if(this._res['img_diamond'])
			{
				if(GameVar.g_platformData["gold_res_name"])
	            {
	                this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
	            }
			}		
			this._txt_input.maxChars = 60;
			this._tjList = [];
			this._tjList.push(this._res['txt_sl']);
			this._tjList.push(this._res['txt_changci1']);
			this._tjList.push(this._res['txt_changci2']);
			this._tjList.push(this._res['txt_changci3']);
			this._tjList.push(this._res['txt_dyj']);
			this._tjList.push(this._res['txt_zm']);
			this._tjList.push(this._res['txt_djzg']);
			this._tjList.push(this._res['txt_px']);
			this._res['txt_px'].text = "";
			this._tjStrings = [];
			this._tjStrings.push(getDesByLan("胜率"));
			this._tjStrings.push(getDesByLan("转嘴子"));
			this._tjStrings.push(getDesByLan("摸张听"));
			this._tjStrings.push(getDesByLan("推到胡"));
			this._tjStrings.push(getDesByLan("大赢家次数"));
			this._tjStrings.push(getDesByLan("自摸次数"));
			this._tjStrings.push(getDesByLan("单局最高分数"));
			for(var label of this._tjList)
			{
				label.text = "";
			}

			this._res['img_head'].skin = GameVar.playerHeadUrl;
			this._res['txt_id'].text = "ID:" + GameVar.pid;
			// this._res['txt_name'].text = "" + GameVar.nickName;
			utils.tools.setLabelDisplayValue(this._res["txt_name"],GameVar.nickName);
			this._res['btn_shop2'].visible = GameVar.g_platformData['show_shop'];

			if(this._res['b_bangding'])
			{
				this._bindRefer = new BindRefer(this._res);
			}
		}
		protected onShow():void
		{
			super.onShow();
			if(this._bindRefer)
			{
				this._bindRefer.show();
			}
			this._pd = qpq.data.PlayerData.s_self;
			this._res['txt_ip'].text = this._pd.m_address;
			this._res["txt_money"].text = this._pd.getGold_num() + "";
			sendNetMsg(0x2035,1,this._pd.m_pId,"");
			sendNetMsg(0x0089,this._pd.m_pId,g_configCenter.getConfigByIndex(1).gz_id,1);
		}
		protected onClose():void
		{
			super.onClose();
			if(this._bindRefer)
			{
				this._bindRefer.close();
			}
		}
		private _netData:any;
		public reciveNetMsg(msgId: number,data: any):void
		{
			if(msgId == 0x2035)
			{
				try
				{
					var obj:any = JSON.parse(data.msg);
					this._netData = obj;
					this._txt_input.text = obj["签名"];
				}
				catch(e)
				{
					this._txt_input.text = UserInfoUi1.getRandomSign();
				}

				if(this._txt_input.text == "" || this._txt_input.text == "undefined")
					this._txt_input.text = UserInfoUi1.getRandomSign();
			}
			else if(msgId == 0x0089)
			{
				if(data.dataNum.length == 0)
				{
					this.initValues();
				}
				else
				{
					var obj:any = data.dataNum[0];
					try
					{
						obj = JSON.parse(obj.datas).normal;	
						for(var i:number = 0; i < this._tjStrings.length ;i++)
						{
							var key:string = this._tjStrings[i];
							var label:Laya.Label = this._tjList[i];
							var value:number = obj[key];
							if(isNaN(value))
							{
								value = 0;
							}
							if(key == getDesByLan("胜率"))
							{
								value = value / 100;
								label.text = key + ":" + value +"%";
							}	
							else
							{
								label.text = key + ":" + value;
							}
						}
						
					}
					catch(e)
					{
						this.initValues();
					}
					
				}
			}
		}
		private initValues():void
		{
			for(var i:number = 0; i < this._tjList.length ; i++)
			{
				var label:Laya.Label = this._tjList[i];
				var str:string = this._tjStrings[i];
				label.text = utils.StringUtility.format(str,['----']);
			}
		}

		
		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			switch(evt.currentTarget.name)
			{
				case "btn_shop2":
					g_uiMgr.openShop(2);
					this.close();	
					break;
				case "btn_modify":
					if(this._txt_input.text == "")
					{
						g_uiMgr.showAlertUiByArgs({msg:getDesByLan("签名不能为空")});
						return;
					}
					if(this._netData == null)
						this._netData = {};
					this._netData["签名"] = this._txt_input.text;
					sendNetMsg(0x2035,0,GameVar.pid,JSON.stringify(this._netData));
					g_uiMgr.showTip(getDesByLan("修改成功!"));
					break;
			}
		}


		
	}
}