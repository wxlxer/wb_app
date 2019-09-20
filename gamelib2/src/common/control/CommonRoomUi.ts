namespace gamelib.control
{
	/**
	 * 公共房间逻辑部分
	 * @class CommonRoomUi
	 * @deprecated 每个游戏的人数可能不一样。礼物按钮也不一样
	 */
	export class CommonRoomUi extends gamelib.core.Ui_NetHandle
	{		
		protected _rightSetUi:gamelib.control.RoomRightSet;
        protected _ruleUi:gamelib.control.Qpq_RuleUi;
        protected _playerNum:number;
		constructor(url:string) 
		{
			super(url);
		}
		protected init():void
		{
			super.init();
			this._rightSetUi = new gamelib.control.RoomRightSet(this._res);
			var arrChat: Array<any> = [];
            for(var i:number = 1; i <= 4; i++){
                arrChat.push(this._res["ui_chat_"+i]);
            }
            gamelib.chat.ChatBubble.s_instance.init(arrChat);
            
            var arrPos: Array<any> = [];
            for(var i:number = 1; i <= 4; i++){
                
                var temp:any = this._res["ui_face_" + i];                                              
                arrPos.push(temp);
            }
            gamelib.chat.Face.s_instance.initPos(arrPos);

            gamelib.chat.RecordSystem.s_instance.setEnterBtn(this._res['btn_yuyin']);
            //礼物           
            if(this._res['btn_daoju2'])
            {
                var btns:Array<laya.ui.Button> = [];
                for(var i:number = 2; i <= 4; i++){
                    btns.push(this._res["btn_daoju"+i]);
                } 
                gamelib.common.GiftSystem.s_instance.init(arrPos,{x:1066, y:498},btns);
            }  
		}
		protected onShow():void
		{
			super.onShow();
			g_signal.add(this.onLocalSignal,this);
			this._rightSetUi.show();
		}
		protected onClose():void
		{
			super.onClose();
			this._rightSetUi.close();
			g_signal.remove(this.onLocalSignal,this);
		}
		/**
		 * 设置玩家列表和获取玩家信息的方法
		 * @param {Array<gamelib.data.UserInfo>} list             [description]
		 * @param {Function}                     getPlayerDataFun [description]
		 */
		protected setPlayerList(list:Array<gamelib.data.UserInfo>,getPlayerDataFun:(id:number)=>gamelib.data.UserInfo):void
		{
			gamelib.common.GiftSystem.s_instance.setPlayerList(list);
			gamelib.core.getPlayerData = getPlayerDataFun; 
		}

		protected onLocalSignal(msg:string):void
		{
			switch (msg) 
			{
				case "showRuleUi":
                    this._ruleUi = this._ruleUi || new gamelib.control.Qpq_RuleUi();
                    this._ruleUi.show();
                    break;
			}
			
		}
	}
}