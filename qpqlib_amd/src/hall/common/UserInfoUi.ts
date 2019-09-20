/**
* name 
*/
namespace qpq.hall
{
	export class UserInfoUi extends gamelib.core.BaseUi
	{
		private _qrcodeImg:gamelib.control.QRCodeImg;
		private _vip_introduce_url:string;
		private _bindRefer:BindRefer;
		constructor()
		{
			super("qpq/Art_Playerinfo_1");
		}
		protected init():void
		{
			this._res["icon_head"].skin = GameVar.playerHeadUrl;
			this._res["txt_id"].text = "ID:" + GameVar.pid;
			// this._res["txt_name"].text = GameVar.nickName;
			utils.tools.setLabelDisplayValue(this._res["txt_name"],GameVar.nickName);
			this.addBtnToListener("btn_zixun");
			this.addBtnToListener("btn_buy");

			this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
			this._vip_introduce_url = GameVar.g_platformData['vip_introduce_url'];

			this._res['img_coin'].visible = this._res['txt_money'].visible = GameVar.g_platformData.show_money;

			if(GameVar.g_platformData["gold_res_name"])
            {
                this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
            }
            if(this._res['b_bangding'])
			{
				this._bindRefer = new BindRefer(this._res);
			}
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
			if(this._bindRefer)
			{
				this._bindRefer.show();
			}
			this._res["txt_diamond"].text = qpq.data.PlayerData.s_self.getGold_num();
			this._res["txt_money"].text = gamelib.data.UserInfo.s_self.m_money + "";
			var isVip:boolean = GameVar.isGameVip;
			this._res["img_QRCode"].skin = GameVar.m_QRCodeUrl;
			//通过平台配置文件中vip_introduce_url的值来决定用那种vip按钮方式
			
			if(this._vip_introduce_url)
			{
				if(isVip)
				{
					this._res["b_1"].visible = true;
					this._res["btn_buy"].label = getDesByLan("VIP信息查看");
					//头像的vip专属二维码不显示玩家上传的二维码
					this._qrcodeImg.setUrl(window["application_share_url"]());
				}
				else
				{
					this._res["b_1"].visible = false;
					this._res["btn_buy"].label = getDesByLan("购买vip");
				}
			}
			else
			{
				this._res["btn_buy"].label = getDesByLan("VIP信息查看");
				this._res["b_1"].visible = isVip;
				this._res["btn_zixun"].visible = false;
				this._res['btn_buy'].x = 692;
			}
			//公众号被封，不显示咨询
			this._res["btn_zixun"].visible = false;
			this._res['btn_buy'].x = 692;

			this._res["b_0"].visible = !this._res["b_1"].visible;
			this._res['btn_buy'].visible = !utils.tools.isApp();

		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			switch(evt.currentTarget.name)
			{
				case "btn_zixun":
					Laya.Browser.window.location.href = GameVar.g_platformData['vip_introduce_url'];				
					break;
				case "btn_buy":
					if(this._vip_introduce_url == null)
					{
						if(window["application_agent_url"])
							Laya.Browser.window.location.href = window["application_agent_url"]();
						return;
					}
					if(GameVar.isGameVip)
					{
						if(window["application_agent_url"])
							Laya.Browser.window.location.href = window["application_agent_url"]();	
					}
					else
					{
						g_uiMgr.openShop(2);
						this.close();
					}		
					break;
			}
		}


		
	}
}