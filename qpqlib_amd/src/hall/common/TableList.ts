
module qpq.hall
{
	/**
	 * 牌桌列表
	 */
	
	export class TableList extends gamelib.core.Ui_NetHandle
	{
		private _list:laya.ui.List;
		private _data:Array<any>;
		private _lastRequestTime:number = 0;
		private _requestGrap:number = 10000;
		public constructor()
		{
			super("qpq/Art_RoomList");
		}
		public reciveNetMsg(msgId:number,data:any):void
		{
			switch(msgId)
			{
				case 0x00F2:
					this.showList();
					break;
				case 0x00F6:
					playSound_qipai("news");
					if(data.result == 1) 
					{
						this.showList();
					}
					break;
			}
		}
		protected onShow():void
		{
			super.onShow();
			this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
			
			this.showList();			
			if(Laya.timer.currTimer - this._lastRequestTime >= this._requestGrap)
			{
				sendNetMsg(0x00F2);
				this._lastRequestTime = Laya.timer.currTimer;
			}
		}
		private showList():void
		{
			this._data = qpq.g_qpqData.m_groupList;
            
			this._res["b_title"].visible = this._data && this._data.length != 0;
			this._res["txt_tips"].visible = !this._res["b_title"].visible;
			this._list.dataSource = this._data;
		}
		protected onClose():void
		{
			super.onClose();
			
			this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
		}
		protected init():void
		{
			this._list = this._res["list_1"];
			this.addBtnToListener("btn_creat");
			this.addBtnToListener("btn_refresh");		
			this._noticeOther = true;	
		}
		/**
		 * @param {laya.events.Event}
		 * @author
		 */
		protected onClickObjects(evt:laya.events.Event):void		
		{
			playButtonSound();
			switch(evt.currentTarget.name)
			{
				case "btn_creat":				
					g_signal.dispatch(SignalMsg.showCreateUi,0);
					this._noticeOther = false;
					this.close();
					this._noticeOther = true;
					break;
				case "btn_refresh":
					sendNetMsg(0x00F2);
					this._lastRequestTime = Laya.timer.currTimer;
					var btn = <laya.ui.Button>evt.currentTarget;
					btn.disabled = true;
					Laya.timer.once(5000,this,function()
					{
						btn.disabled = false;
					});
					break;
			}
		}

		private onItemUpdate(item:laya.ui.Box,index:number):void
		{
			var data = this._data[index];
			var info:any = JSON.parse(data.gamePlayJson);
			var txt = <laya.ui.Label>getChildByName(item,"txt_1");
			txt.text = data.validation; 

			txt = <laya.ui.Label>getChildByName(item,"txt_2");
			txt.text = data.playerNowNum.length + "/" + data.playerMaxNum;

            txt = <laya.ui.Label>getChildByName(item,"txt_3");
			txt.text = qpq.g_configCenter.getConfigByGzIdAndModeId(data.gz_id,data.gameMode).name;
        
			txt = <laya.ui.Label>getChildByName(item,"txt_4");
			if(data.gameID == 14 && data.gameMode == 4)
            {
                txt.text = data.roundNow;
            }
            else
            {
                txt.text = data.roundNow + "/" + data.roundMax;
            }

			var img_icon = <laya.ui.Image>getChildByName(item,"img_icon");
			img_icon.visible = GameVar.pid == data.roomOwnerPid;

			var btn = <laya.ui.Button>getChildByName(item,"btn_1");
			btn.visible = (GameVar.pid == data.roomOwnerPid);
			btn.off(laya.events.Event.CLICK,this,this.onTouchDismiss);
			btn.on(laya.events.Event.CLICK,this,this.onTouchDismiss);

			btn = <laya.ui.Button>getChildByName(item,"btn_2");
			btn.off(laya.events.Event.CLICK,this,this.onTouchEnter);
			btn.on(laya.events.Event.CLICK,this,this.onTouchEnter);

			btn = <laya.ui.Button>getChildByName(item,"btn_3");
			btn.visible = (data.playerNowNum.length < data.playerMaxNum);
			btn.off(laya.events.Event.CLICK,this,this.onTouchInvite);
			btn.on(laya.events.Event.CLICK,this,this.onTouchInvite);

			btn = <laya.ui.Button>getChildByName(item,"btn_4");
			btn.off(laya.events.Event.CLICK,this,this.onTouchBg);
			btn.on(laya.events.Event.CLICK,this,this.onTouchBg);
			item["__data"] = data;
		}
		private _item_data:any;
		 private onTouchDismiss(evt:laya.events.Event):void
		 {
			 this._item_data = evt.currentTarget.parent["__data"];
			g_uiMgr.showConfirmUiByArgs({
				msg:getDesByLan("是否解散当前选中的房间") + "？",
				callBack:this.confirmDismiss,
				thisObj:this,
				okLabel:getDesByLan("解散"),
				cancelLabel:getDesByLan("取消")
			})
            playSound_qipai("warn");
        }
        private confirmDismiss(type:number):void
		{
			if(type == 0)
			{
				sendNetMsg(0x00F6,GameVar.pid,4,this._item_data.groupId,0,this._item_data.key);
				g_signal.dispatch("showQpqLoadingUi",{
					msg:getDesByLan("解散牌局中") + "...",
					delay:20,
					alert:getDesByLan("解散牌局超时，请稍后重试")
				});
			}			
        }
        private onDismissed(data:any):void
		{
            // s_hall.closeLoading();
            // this.data.result = data.result;
            // Debugger.onDebugKey("dismiss",this.data);
            // playSound_qipai("news");
            // if(data.result == 1) {
            //     s_hall.removeTable(data);
            // }
        }
        private onTouchEnter(evt:laya.events.Event):void
		{
			this._item_data = evt.currentTarget.parent["__data"];
            if(this._item_data.playerNowNum.length >= this._item_data.playerMaxNum)
            {
                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("房间人数已满,不能加入")});
                return;
            }
			this.close();
			//g_childGame.enterGame(this._item_data.gz_id,this._item_data.validation);
			//g_childGame.enterGameByClient(this._item_data.gz_id,true,this._item_data.validation);
			enterGameByValidation(this._item_data.validation);
            playButtonSound();
            evt.stopPropagation();
        }
        private onTouchInvite(evt:laya.events.Event):void
		{
			this._item_data = evt.currentTarget.parent["__data"];
            var temp = qpq.g_qpqData.getShare(this._item_data);
            temp.wxTips = true;
            gamelib.platform.share_circleByArgs(temp);            
            playButtonSound();
            evt.stopPropagation();
        }
        private onTouchBg(evt:laya.events.Event):void
		{
			playButtonSound();
            g_signal.dispatch("showTableInfo",evt.currentTarget.parent["__data"]);
			evt.stopPropagation();
        }
	}
}