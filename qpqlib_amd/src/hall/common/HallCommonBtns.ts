module qpq
{
	/**
	 * 大厅公共按钮,包括商城，签到，游戏，喇叭，cdk，设置，帮助，发送到桌面，首充
	 * 需要关注消息为: showSetUi,showHelpUi,showRankUi,showEffortUi,showTaskUi
	 * @class HallCommonBtns
	 */
	export class HallCommonBtns
	{
		private _btns:any;

		private _mailIcon:laya.ui.Image;
		private _signinIcon:laya.ui.Image;
		private _signal:gamelib.core.Signal;
		private _bSendToDesk:boolean = false;
		private _qpqEnter:laya.ui.Button;
		public constructor(res:any)
		{
			this._btns = {};
			var arr:Array<string> = [
				"btn_shop","btn_shop1","btn_shop2","btn_signin","btn_mail",
				"btn_laba","btn_cdk","btn_set",
				"btn_help","btn_sendToDesk","b_shouchong"
			]
			for(var key in arr)
			{
				if(res[arr[key]] == undefined)
					continue;
				this._btns[arr[key]] = res[arr[key]];
				this._btns[arr[key]].name = arr[key];
			}

			
			if(this._btns['btn_shop'])
			{
				this._btns['btn_shop'].visible = GameVar.g_platformData['show_shop'];
			}

			if(this._btns['btn_shop1'])
			{
				this._btns['btn_shop1'].visible = GameVar.g_platformData['show_shop'];
			}

			this._mailIcon = res.newIcon_mial;
			 if(this._mailIcon == null)
                    this._mailIcon = res.newIcon_mail;
			this._signinIcon = res.newIcon_sigin;
			this._mailIcon.visible = false;
			if(this._signinIcon)
				this._signinIcon.visible = false;
			g_signal.add(this.onGlobalSigna,this);
		}
		public removeBtn(btn:string):void
		{
			delete this._btns[btn];
		}

		private onGlobalSigna(msg:string,data:any):void
		{
			if(msg == gamelib.GameMsg.SENDTODESKMSG)
			{
				this._bSendToDesk = true;
			}
			else if(msg == gamelib.GameMsg.UPDATEUSERINFODATA)
			{
				if(this._signinIcon)
					this._signinIcon.visible = gamelib.data.UserInfo.s_self.m_bSignIn;
				this._mailIcon.visible = gamelib.data.UserInfo.s_self.m_unreadMailNum != 0;
			}
			else if(msg == gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE)
			{
				this.updateItemBtn();
			}
		}
		public show():void
		{
			for(var key in this._btns)
			{
				this._btns[key].on(laya.events.Event.CLICK,this,this.onClickBtns);
			}
			this.updateItemBtn();
		}
		public close():void
		{
			for(var key in this._btns)
			{
				this._btns[key].off(laya.events.Event.CLICK,this,this.onClickBtns);
			}
		}
		public update():void
		{
			if(gamelib.data.UserInfo.s_self == null)
				return;
			if(this._signinIcon)
				this._signinIcon.visible = gamelib.data.UserInfo.s_self.m_bSignIn;
			this._mailIcon.visible = gamelib.data.UserInfo.s_self.m_unreadMailNum != 0;
		}
		private updateItemBtn():void
		{
			if(this._btns["yuekaG"])
			{
				this._btns["yuekaG"].visible = true;
				var newIcon = this._btns["yuekaG"].getChildByName("newIcon_yueka");
				newIcon.visible = GameVar.s_item_yue.state <= 1 || GameVar.s_item_zhou.state <= 1;
			}
			var btn:any = this._btns["b_shouchong"];
			if(btn == null)	return;
			if(!GameVar.s_firstBuy)
			{
				btn.removeSelf();
			}			
		}
		
		private onClickBtns(evt:laya.events.Event):void
		{
			playButtonSound();
			switch (evt.currentTarget.name)
			{
				case "btn_shop":
				case "btn_shop1":
				case "btn_shop2":
					 // g_signal.dispatch("showEnterGameLoading", 0);
					g_uiMgr.openShop();
					if(g_commonFuncs)
                    {
                        g_commonFuncs.eventTongJi("homepage",'商场');
                    }
					break;
				case "btn_signin":
					break;
				case "btn_mail":
					g_uiMgr.openMail();
					if(g_commonFuncs)
                    {
                        g_commonFuncs.eventTongJi("homepage",'信件');
                    }
					// var url:string = GameVar.common_ftp + "circle_config.php";
					// utils.tools.http_request(url,{platform:GameVar.platform,pid:GameVar.pid,action:'circle_config'},"get",null);
			
					break;
				case "btn_laba":
					break;
				case "btn_cdk":
					//g_uiMgr.showUiByClass(gamelib.cdk.CDKeyUi);
					break;
				case "btn_set":

					// var tmp = new gamelib.control.ArcMask(64);
					// tmp.x = tmp.y = 200;
					// Laya.stage.addChild(tmp);
					// tmp.pre = 0;
					// Laya.Tween.to(tmp,{pre:1},10000);

					g_signal.dispatch("showSetUi",0);
					if(g_commonFuncs)
                    {
                        g_commonFuncs.eventTongJi("homepage",'设置');
                    }
					break;
				case "btn_help":
				case "help":
					g_signal.dispatch("showHelpUi",0);					
					break;
				case "btn_rank":
					g_signal.dispatch("showRankUi",0);
					if(g_commonFuncs)
                    {
                        g_commonFuncs.eventTongJi("homepage",'排行榜');
                    }
					break;
				case "btn_effort":
					g_signal.dispatch("showEffortUi",0);
					break;
				case "btn_shouchong":
				case "b_shouchong":
					g_uiMgr.openShop();
					break;
				case "yuekaG":
					//g_uiMgr.showUiByClass(gamelib.shop.YueKaUi);
					break;
			}
		}
	}
}
