/**
* name 
*/
namespace qpq.hall
{
	/**
	 * 有签名
	 * @type {[type]}
	 */
	export class UserInfoUi1 extends gamelib.core.Ui_NetHandle
	{
		public static getRandomSign():string
		{
			return "说点什么呢~哼哼唧唧";
			// var strs:Array<string> = [];
			// strs.push(getDesByLan("才、才不是懒得写签名呢！只是在思考"),getDesByLan("这个人很懒，神马都没写..."),getDesByLan("不好了，我的签名跑掉了"));
			// strs.push(getDesByLan("怎么吃都吃不胖的一个人"),getDesByLan("来来来，血战到天亮！"));
			// var index:number = utils.MathUtility.random(0,strs.length - 1);
			// return strs[index];
		}
		private _txt_input:Laya.TextInput;
		private _pd:any;


		private _str:Array<string>;

		private _shop_btn:Laya.Button;

		private _bindRefer:BindRefer;
		constructor()
		{
			super("qpq/Art_Playerinfo");
		}
		protected init():void
		{
			
			this._txt_input = this._res["txt_input"];
			this.addBtnToListener("btn_shop2");
			this.addBtnToListener("btn_shop");
			this.addBtnToListener("btn_modify");

			if(this._res['btn_shop2'])
				this._shop_btn = this._res['btn_shop2'];
			if(this._res['btn_shop'])
				this._shop_btn = this._res['btn_shop'];
			if(this._res['img_diamond'])
			{
				if(GameVar.g_platformData["gold_res_name"])
	            {
	                this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
	            }
			}		
			this._txt_input.maxChars = 60;

			if(this._res['b_bangding'])
			{
				this._bindRefer = new BindRefer(this._res);
			}
		}

		public setData(pd:any):void
		{
			this._pd = pd;
		}
		protected onClose():void
		{
			super.onClose();
			if(this._bindRefer)
			{
				this._bindRefer.close();
			}
		}
		protected onShow():void
		{
			super.onShow();

			if(this._bindRefer)
				this._bindRefer.show();

			// 排行榜 不显示绑定
			if(this._pd != 0 && this._pd.pid != qpq.data.PlayerData.s_self.m_pId) {
				if(this._bindRefer) {
					this._bindRefer.close();
				}	
			}

			var pid:number = 0;
			var headUrl:string;
			var nickname:string;
			var address:string;
			var money:number;
			if(this._pd != 0 && this._pd != null)
			{
				pid = this._pd.pid;
			}
			else
			{
				this._pd = null;
			}
			if(this._pd == null || pid == GameVar.pid)
			{
				pid = 0;
				this._res['btn_modify'].visible = true;
				if(this._shop_btn)
					this._shop_btn.visible = true;				
				money = gamelib.data.UserInfo.s_self.getGold_num();
				this._txt_input.editable = true;
				this._txt_input.mouseEnabled = true;
				headUrl = GameVar.playerHeadUrl;
				nickname = GameVar.nickName;
				address = gamelib.data.UserInfo.s_self.m_address;
				sendNetMsg(0x2035,1,pid,"");
			}
			else
			{
				pid = this._pd.pid;
				nickname = this._pd.name;
				headUrl = this._pd.headUrl;
				money = this._pd.value;
				address = this._pd.address;
				this._res['btn_modify'].visible = false;	
				if(this._shop_btn)
					this._shop_btn.visible = false;
				this._txt_input.editable = false;
				this._txt_input.mouseEnabled = false;
				this._txt_input.text = this._pd.sign;
				if(this._txt_input.text == "")
				{
					this._txt_input.text = getDesByLan('默认签名');
				}
			}
			
			if(pid == 0)
				pid = GameVar.pid;
			this._res["icon_head"].skin = headUrl;
			this._res["txt_id"].text = "ID:" + pid;
			// this._res["txt_name"].text = nickname;
			utils.tools.setLabelDisplayValue(this._res["txt_name"],nickname);
			this._res["txt_money"].text = money + "";
			this._res["txt_money"].text = utils.tools.getMoneyByExchangeRate(money);
			if(this._res['txt_address'])
				this._res['txt_address'].text = address;

			if(this._res['txt_ip'])
				this._res['txt_ip'].text = "";

			this._pd = null;
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
		}
		
		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			switch(evt.currentTarget.name)
			{
				case "btn_shop2":
				case "btn_shop":
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
					g_uiMgr.showTip(getDesByLan("修改成功"));
					break;
			}
		}


		
	}
}