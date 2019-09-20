module gamelib.common {
	/**
	 * 互动相关功能，包括聊天泡泡，表情，礼物，弹幕,跑马灯
	 */
	export class InteractiveSystem implements gamelib.core.INet{
		
		private _getBubble:Function;
		private _getFacePos:Function;
		private _getGiftPos:Function;
		private _giftToggle:Laya.CheckBox;
		private _danmuToggle:Laya.CheckBox;
		private _pmd:gamelib.alert.Pmd;

		private _gift:gamelib.common.GiftSystem;
		private _dm:gamelib.chat.DanMu;
		priority:number;

		private _bubbleList:any;
		constructor() {
			this._bubbleList = {};
		}
		public destroy():void
		{
			if(this._pmd){
				this._pmd.destroy();				
			}
			if(this._dm)
			{
				this._dm.destroy();
			}

			for(var key in this._bubbleList)
			{
				var b:gamelib.chat.Bubble  = this._bubbleList[key];
				if(b)
					b.destroy();
			}
			this._bubbleList = null;
			this._getBubble = null;
			this._getFacePos = null;
			this._getGiftPos = null;
			this._giftToggle = null;
			this._danmuToggle = null;
			this._pmd = null;
			this._dm = null;
			this._gift = null;
		}
		public initChatBubble(getBubble:(lseat:number) => Laya.UIComponent):void
		{
			this._getBubble = getBubble;
		}
		public initFace(getpos:(lseat:number) => {x:number,y:number}){
			this._getFacePos = getpos;
		}
		public initGift(getpos:(lseat:number) => {x:number,y:number},tipArea?:{x:number,y:number}){
			this._getGiftPos = getpos;
			this._gift = this._gift || new gamelib.common.GiftSystem();
			this._gift.init_br(getpos,tipArea);
		}
		public initPmd(res:any):void
		{
			if(this._pmd != null)
				this._pmd.destroy();
			this._pmd = new gamelib.alert.Pmd();
			this._pmd.setRes(res);
		}
		public initBtns(hddj:Laya.CheckBox,danMu:Laya.CheckBox):void
		{	
			this._giftToggle = hddj;
			this._danmuToggle = danMu;
			if(this._danmuToggle)
			{
				this._dm = this._dm || new gamelib.chat.DanMu();
				this._dm.initArea(132,580);
			}
		}
		public show():void
		{
			if(this._gift)
				this._gift.enable = true;
			if(this._dm)
				this._dm.enable = true;
			if(this._danmuToggle)
			{
				
				this._danmuToggle.selected = true;
				this._danmuToggle.on(Laya.Event.CHANGE,this,this.onDanMuToggle);
			}
			if(this._giftToggle)
			{
				
				this._giftToggle.selected = true;
				this._giftToggle.on(Laya.Event.CHANGE,this,this.onGiftToggle);
			}
			g_net.addListener(this);
		}
		public close():void
		{
			g_net.removeListener(this);
		}

		public reciveNetMsg(msgId:number,data:any):void
		{
			switch (msgId) 
			{
				case 0x002F:
				case 0x022F:
					if(this._pmd && data.type == 1) {
						this._pmd.add(data.msg);
					}
					break;
				case 0x0074:
					var pd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.sendId);
					gamelib.chat.ChatPanel.s_instance.onData0x0074(pd,data);
					if(this._dm)
						this._dm.onGetMsgByUser(pd,gamelib.chat.ChatPanel.s_instance.getMsgByNetData(data));
					this.showChatBubble(data);
					break;	
				case 0x2215:	//新版本聊天
					if(data.result != 1 )
        				return;
        			switch(data.type)
        			{
        				case 1:	       
        					if(data.sign == 0) 				
	                    		this._dm.onGetMsg(data.content,data.vip > 0,data.PID == gamelib.data.UserInfo.s_self.m_pId);
        					break;
        				case 2:    // 世界
		                    // 跑马灯
		                    if(this._pmd)
        						this._pmd.add(data.nickName +":" + data.content);
		                    break;
		                case 3:    // 游戏公告
		                case 4:    // 系统公告
		                    if(this._pmd)
        						this._pmd.add(getDesByLan("系统")  +":" +  data.content);
		                    break;
		            }
					break;	
				case 0x00C0:
					this.showFace(data);
					break;
				case 0x2010:
					this.showGift(data);
					break;
				default:
					// code...
					break;
			}
		}
		private onGiftToggle(evt:Laya.Event):void
		{
			this._gift.enable = this._giftToggle.selected;
		}
		private onDanMuToggle(evt:Laya.Event):void
		{
			this._dm.enable = this._danmuToggle.selected;
		}
		private showGift(data:any):void
		{
			if(this._gift == null)
				return;
			this._gift.showGift(data);
		}
		/**
		 * 显示表情
		 * @function
		 * @DateTime 2019-05-16T10:27:08+0800
		 * @param    {any}                    data [description]
		 */
		private showFace(data:any):void
		{
			if(this._getFacePos == null)
				return;
			var pd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.playerId);
			var temp:{x:number,y:number} = this._getFacePos(pd.m_seat_local);
			var face:Face = new Face();
			face.play(temp,data.addData2);
		}
		/**
		 * 显示聊天泡泡
		 * @function
		 * @DateTime 2019-05-16T10:26:38+0800
		 * @param    {any}                    data [description]
		 */
		private showChatBubble(data:any):void
		{
			if(this._getBubble == null)
				return;
			var pd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.sendId);
			var temp:Laya.UIComponent = this._getBubble(pd.m_seat_local);
			if(temp == null)
			{
				console.log("没找到位置为" + pd.m_seat_local +"的泡泡资源");
				return;
			}
			var bubble:gamelib.chat.Bubble = temp["_bubble"];
			if(bubble == null)
			{
				temp.mouseEnabled = false;
                temp["__oldY"] = temp.y;
                temp["__oldX"] = temp.x;
				temp.visible = false;
				bubble = new gamelib.chat.Bubble(temp);
				temp["_bubble"] = bubble;
			}
			bubble.setMsg(data);
			this._bubbleList[pd.m_seat_local] = bubble;
		}
		
	}

	export class Face  {
		
		constructor() {
			// code...
		}
		public play(pos:{x:number,y:number},id:number):void
		{
			var face = this.getFaceRes(id);
			face.x = pos.x;
            face.y = pos.y;
            g_layerMgr.addChild(face);
            
            var ani1:Laya.FrameAnimation = face.ani1;
            ani1.play(0,false);
            ani1.once(laya.events.Event.COMPLETE,this,this.onPlayEnd,[face]);
		}
		private getFaceRes(id:number):any
        {
            var url:string = "qpq/face/Art_face_" + (id+1);        
            var face =utils.tools.createSceneByViewObj(url);           
            face['anchorX'] = face['anchorY'] = 0.5
            face.zOrder = 10;

            return face;
        }
        private onPlayEnd(face:any):void
        {
            console.log("播放完成");
            face.removeSelf();
        }
	}
}