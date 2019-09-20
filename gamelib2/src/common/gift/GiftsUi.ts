/**
* name 
*/
module gamelib.common
{
	/**
	 * @class
	 * 赠送礼物界面。如果礼物面板不是在用户信息面板中，会打开这个界面
	 */
	export class GiftsUi extends gamelib.core.BaseUi
	{
		private _localSeat:number;
		private _tip:laya.ui.Label;   // 提示文本

		public m_playerId:number;
		private _cd:number = 1000;
		private _lastSendTime:number;
		constructor()
		{
			super(GameVar.s_namespace + ".ui.Art_HddjUI");
		}
		protected init(): void
		{
			for(var i = 0; i < 6; i++)
			{
				this.addBtnToListener('btn_' +(i+1));
			}
			this.initTip();
		}
		
		protected initTip():void
		{			
			if(this._res["txt_tips"])
			{
				this._tip = ( <laya.ui.Label>this._res["txt_tips"] );
				this._tip.visible = false;
				
				var consume_:any = GameVar.g_platformData["item_price"];
                if(consume_ && consume_["num"])
                {
                	var str:string = consume_["name"];
                    switch(consume_)
                	{
            			case 1024:
                        {
                            str = getDesByLan("钻石");
                        }
                        break;
                        case 1000:
                        	str = getDesByLan("钻石");
                        	break;
                    }

                	str = getDesByLan("每次使用消耗") + consume_["num"] + str;
					this._tip.text = str;
					this._tip.visible = true;
				}
			}
		}

		protected onShow():void
		{
			super.onShow();
			this.initTip();
			this._lastSendTime = 0;
		}
		public destroy():void
		{
			super.destroy();
			
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			var name_:string = evt.currentTarget.name;
			//1 鲜花 2 番茄 3 鸡蛋 4 干杯 5 鸡 6 狗
			var type:number = parseInt(name_.split("_")[1]);
			playButtonSound();
            if(type)
            {
            	if(Laya.timer.currTimer - this._lastSendTime >= this._cd)
            	{
            		sendNetMsg(0x2010, this.m_playerId, type);
            		this._lastSendTime = Laya.timer.currTimer;
            		this.close();
            	}
            }
		}
		/**
		 * 打开的时候需要设置当前打开的是哪个玩家
		 * @function
		 * @DateTime 2018-03-17T14:31:52+0800
		 * @param    {number}                 playerId [description]
		 */
		public setPlayerId(playerId:number):void
		{
			this.m_playerId = playerId;
			this.show();
		}
	}
}