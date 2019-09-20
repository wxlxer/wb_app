namespace qpq.creator 
{
	export class CreateUi_Change extends gamelib.core.Ui_NetHandle
	{
		private _game_btn:laya.ui.Button;
		protected _page:creator.parser.Page;
		public netMsgStr:string;
		private _consume:number;
		private _isFree:boolean = false;   
		constructor() 
		{
			super("qpq/Art_CreateUi0");
		}
		protected init():void
		{
			this._game_btn = getChildByName(this._res['tab_1'],'item0');
			this._res['tab_1'].selectedIndex = 0;

			var box:laya.ui.Box = this._res["b_area"];
			this._page = new creator.parser.Page(box.height);
			box.addChild(this._page);

			var area:laya.ui.Image = this._res["img_area"];
			var arr:Array<number> = [2,3,4,5];
			area.removeSelf();
			creator.parser.g_posList = {};
			for(var num of arr)
			{
				var poss:Array<number> = [];
				var grap:number = area.width / num;
				for(var i:number = 0; i < num; i ++)
				{
					poss.push(area.x + i * grap);
				}
				creator.parser.g_posList[num] = poss;
			}			
			creator.parser.g_groupWidth = area.parent['width'];
		    creator.parser.g_groupStartX = area.x;
			this._noticeOther = true;

			this.addBtnToListener("btn_shop");
			this.addBtnToListener("btn_roomList");
			this.addBtnToListener("btn_creat");
			this.addBtnToListener("btn_change");
			this._res['txt_name'].text = "";
			if(this._res["btn_shop"])
				this._res["btn_shop"].visible = GameVar.g_platformData['show_shop'];

			if(this._res['img_diamond'])
          {
              if(GameVar.g_platformData["gold_res_name"])
              {
                  this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
              }
          }
		}
		public reciveNetMsg(msgId:number,data:any):void
		{
			if(msgId == 0x00F4)
			{
				this._res["btn_creat"].mouseEnabled = true;
				this.updateMoney();           
				this.setNewGame(qpq.g_qpqData.new_table);
			}
			else if(msgId == 0x00F1)
			{
				this._res["btn_creat"].mouseEnabled = true;
			}
		}
		protected onShow():void
		{
			super.onShow();
			g_signal.add(this.onLocalSignal,this);
			this.updateMoney();
			this.setNewGame(qpq.g_qpqData.new_table);
			this._res["btn_creat"].mouseEnabled = true;

			var config:any = g_configCenter.creator_default;
			this._game_btn.label = config.name;
			if(this._res['img_jisu'])
			{
				this._res['img_jisu'].visible = (config.isLaya == "true" || config.isLaya == true);
			}

			this._page.close();
			this._page.setConfig(config);
			this._page.show();
			var temp = g_qpqData.getSaleConfig(config.game_id,config.mode_id);
			this._res['img_xianmian'].visible = this._res['img_line'].visible = this._res['img_1'].visible = (temp && g_qpqData.checkValid(temp));

		}
		protected onClose():void {
			super.onClose();
			this._page.close();
			g_signal.remove(this.onLocalSignal);
			playSound_qipai("close");
		}
		protected onLocalSignal(msg:string,data:any):void
		{
			switch (msg)
			{
				case creator.parser.evt_UpdateRoundCost:
				this._consume = data;
				this.updateConsume(this._consume);
				break;
			}
		}
		
		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			switch(evt.currentTarget.name)          
			{
				case "btn_shop":
					g_signal.dispatch("showShopUi",0);
					this.closeSelf();
					break;  
				case "btn_roomList":
					g_signal.dispatch(SignalMsg.showTableListUi,0);
					this.closeSelf();
					break;  
				case "btn_creat":                    
					var money:number = qpq.data.PlayerData.s_self.getGold_num(true);
					if(isNaN(this._consume))
                       this._consume = 0;
					if(money >= this._consume || this._isFree)
					{
						evt.currentTarget.mouseEnabled = false;
						sendNetMsg(0x00F1,JSON.stringify(this._page.netData));
						playButtonSound();
						g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("创建牌局中") + "..."});
						qpq.g_qpqData.onCreateGame(this._page.netData);                        
					} else {                        
						g_uiMgr.showAlertUiByArgs({"msg":GameVar.g_platformData.gold_name_zj + getDesByLan("不够") + "!"});
						playSound_qipai("warn");
					}
					break;
				case 'btn_change':
					g_signal.dispatch('showSelectedGameUi',0);
					this.closeSelf();
					break;
			}
		}

		protected updateMoney():void
		{
			var money:number = qpq.data.PlayerData.s_self.getGold_num(true);
			this._res["txt_diamond"].text = money +"";
		}

		private closeSelf():void
		{
			this._noticeOther = false;
			this.close();
			this._noticeOther = true;
		}

		public setNewGame(value:boolean)
		{
			this._res["newIcon_roomlist"].visible = value;
		}

		public updateConsume(cur:number)
		{
			this._res["txt_xh"].text = getDesByLan("每次消耗") + cur +GameVar.g_platformData.gold_name_zj;
		}
	}
}