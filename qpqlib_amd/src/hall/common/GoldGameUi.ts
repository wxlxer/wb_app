/**
* name 
*/
namespace qpq.hall{
	export class GoldGameUi extends gamelib.core.BaseUi
	{
		private _games:any;
		private _grap:number = 145;
		private _items:Array<any>;

		private _enterUi:qpq.hall.GoldGameRoomListUi;
		private _container:laya.ui.UIComponent;
		constructor()
		{
			super("qpq/Art_MoreGame_1");
		}
		protected init():void
		{
			this._noticeOther = false;
			this._games = qpq.g_configCenter.goldGames;
			this._container = new laya.ui.UIComponent();
			this._container.centerX = 0.5;
			this._container.centerY = 0.5;
			this._res.addChild(this._container);

			this._items = [];
			for(var i:number = 0; i < this._games.length;i++)
			{
				var cl = gamelib.getDefinitionByName('qpq.ui.Art_GameUI');
				var view:any = new cl();
				view.img_game.skin = this._games[i].skin;
				this._clickEventObjects.push(view.btn_game);
				this._container.addChild(view);
				this._items.push(view);				
				view.btn_game["__index"] = i;
			}

			Laya.timer.frameOnce(3,this,this.adjues);
			this._noticeOther = true;
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			console.log("click index:" + evt.currentTarget["__index"]);
			this._noticeOther = false;
			this.close();
			this._noticeOther = true;
			this._enterUi = this._enterUi || new GoldGameRoomListUi();
			this._enterUi.setData(this._games[evt.currentTarget["__index"]]);
			this._enterUi.show();

		}
		private adjues():void
		{
			var startx:number = (this._res.width -  (this._items.length * this._items[0].width + (this._items.length - 1) * this._grap)) / 2;			
			for(var i:number = 0; i < this._items.length; i++)
			{
				this._items[i].x = i * (this._items[i].width + this._grap);				
			}
		}
	}
	export class GoldGameRoomListUi extends gamelib.core.BaseUi
	{
		private _items:Array<any>;
		private _games:any;
		private _grap:number = 30;

		private _pools:Array<any>;
		public constructor()
		{
			super("qpq.ui.Art_MoreGame_1UI");			
		}
		protected init():void
		{
			this._items = [];
			this._pools = [];
		}

		
		protected onShow():void
		{
			super.onShow();
			this._noticeOther = true;
			for(var item of this._items)
			{
				item.btn_game.on(laya.events.Event.CLICK,this,this.onClickItem);
			}
		}
		protected onCloe():void
		{
			this._noticeOther = false;
			for(var item of this._items)
			{
				item.btn_game.off(laya.events.Event.CLICK,this,this.onClickItem);
			}
		}
		private onClickItem(evt:laya.events.Event):void
		{
			playButtonSound();
			var rd:any = evt.currentTarget["__data"];
			if(qpq.data.PlayerData.s_self.m_money < rd.ticket)
			{
				g_uiMgr.showAlertUiByArgs({
					msg:getDesByLan("你的铜钱不足,请充值") + "!",
					callBack:function(params:number) {
						if(params == 0)
						{
							g_uiMgr.openShop();
							this.close();
						}
					},
					thisObj:this,
					okLabel:getDesByLan("购买")});
				return;
			}
			console.log("进入金币场 ");
			g_childGame.enterGameByClient(rd.gz_id,true,null,{roomId:rd.roomId})
		}
		public setData(data:any):void
		{
			this._games = data.rooms;
			for(var item of this._items)
			{
				this._res.removeChild(item);
				this._pools.push(item);
			}
			this._items.length = 0;
			
			for(var i:number = 0; i < this._games.length;i++)
			{

				var view:any = this.getItem();
				this._games[i].gz_id = data.gz_id;
				this._games[i].game_id = data.game_id;
				view.txt_1.text = this._games[i].name;
				view.txt_2.text = this._games[i].txt1;
				view.txt_3.text = this._games[i].txt2;
				view.img_game.skin = "hall/bg_jinbi_"+(i+1)+".png";				
				this._res.addChild(view);
				this._items.push(view);				
				view.btn_game["__data"] = this._games[i];
			}
			Laya.timer.frameOnce(3,this,this.adjues);
			this._noticeOther = true;
		}
		private getItem():any
		{
			if(this._pools.length == 0)
			{
				var cl = gamelib.getDefinitionByName("qpq.ui.Art_GameEntryUI");
				return new cl();
			}
			return this._pools.shift();
		}
		private adjues():void
		{
			var startx:number = (this._res.width -  (this._items.length * this._items[0].width + (this._items.length - 1) * this._grap)) / 2;
			var starty:number = (this._res.height - this._items[0].height) / 2;
			for(var i:number = 0; i < this._items.length; i++)
			{
				this._items[i].x = startx + i * (this._items[i].width + this._grap);
				this._items[i].y = starty;
			}
		}
	}

}