/**
* name 
*/
module qpq.hall{
	/**
	 * 牌桌详细信息
	 */
	export class TableInfo extends gamelib.core.Ui_NetHandle
	{
		private _list:laya.ui.List;
		private _data:any;
		private _list_data:any;
		constructor(){
			super("qpq/Art_RoomInfo");
		}
		public reciveNetMsg(msgId:number,data:any):void
		{
			if(msgId != 0x2020)
			{
				return;
			}
			if(data.groupId != this._data.groupId)
			{
				return;				
			}
			var banker_pid:number = 0;
			var curr_loop:number = 0;       //斗版牛中表示当前轮数.
			var banker_loop:number = 0;
			var banker_score:number = 0;
			
			if(data.deskInfo != "")     //banker_pid,game_time,curr_loop,[banker_loop banker_score]
			{
				var deskInfo = JSON.parse(data.deskInfo);				
				//this._res["txt_time"].text = utils.StringUtility.secToTimeString(deskInfo.game_time);

				banker_pid = deskInfo.banker_pid;
				curr_loop = deskInfo.curr_loop;
				banker_loop = deskInfo.banker_loop;
				banker_score = deskInfo.banker_score;
			}
			var arr:Array<any> = [];
			for(var i:number = 0; i < data.playerNum.length; i++)
			{
				var playerInfo = JSON.parse(data.playerNum[i].playerInfo);//name,icon,pid,score,play_count,status;
				playerInfo.isBanker = playerInfo.pid == banker_pid;
				arr.push(playerInfo);
				playerInfo.curr_loop = curr_loop;
			}
			this._list_data = arr;
			this._list.dataSource = arr;
			//this.bankerScore = banker_score;
		}
		protected init():void
		{
			this._list = this._res["list_1"];
			this._noticeOther = false;
			this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
			// this._res["b_title"].removeChild(this._res["txt_4"]);	
			// this._res["b_title"].space = 50;
		}
		public setData(data:any):void
		{
			this._data = data;
			this._res["txt_1"].text = getDesByLan("房号") + ":" + data.validation;
			var config:any = qpq.g_configCenter.getConfigByGzIdAndModeId(data.gz_id,data.gameMode);
			
			this._res["txt_3"].text = getDesByLan("玩法") + ":" + config.name;
			this._res["txt_2"].text = getDesByLan("人数") + ":" + data.playerNowNum.length + "/" + data.playerMaxNum;

			this._res["txt_4"].text = getDesByLan("局数") + ":" + data.roundNow + "/" + data.roundMax;	
           // this.baseScore = data.basePoints;
           
           this._res["txt_5"].text = "";
		}

		protected onShow():void
		{
			super.onShow();
			sendNetMsg(0x2020,this._data.groupId);
			
		}
		protected onClose():void
		{
			super.onClose();
		}

		private onItemUpdate(item:laya.ui.Box,index:number):void
		{
			var data = this._list_data[index];
			var txt = <laya.ui.Label>getChildByName(item,"txt_1");
			txt.text = data.pid; 

			txt = <laya.ui.Label>getChildByName(item,"txt_2");
			txt.text = utils.StringUtility.getNameEx(data.name);

            txt = <laya.ui.Label>getChildByName(item,"txt_3");
			txt.text = data.score + "";
        
			txt = <laya.ui.Label>getChildByName(item,"txt_4");
			var toWrite:string;
			 switch (data.status) {
                case 1:
                    toWrite = getDesByLan("空闲");
                    break;
                case 2:
                    toWrite = getDesByLan("游戏中");
                    break;
                case 3:
                    toWrite = getDesByLan("离开");
                    break;
            }
            txt.text = toWrite;

			var img_icon = <laya.ui.Image>getChildByName(item,"img_icon");
			img_icon.visible = data.isBanker;

			img_icon = <laya.ui.Image>getChildByName(item,"b_head.img_head");
			img_icon.skin = data.icon;
			//item["__data"] = data;
		}
	}
}