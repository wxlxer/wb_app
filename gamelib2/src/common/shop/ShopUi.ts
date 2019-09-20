/**
* name 
*/
namespace gamelib.common
{
	/**
	 * 商城界面
	 * @class ShopUi
	 */
	export class ShopUi extends gamelib.core.Ui_NetHandle
	{
		private _list:laya.ui.List;

		private _pfMoney:Laya.Label;
		public constructor()
		{
			super("qpq/Art_Shop.scene");
		}

		protected init():void
		{
			this._list = this._res["list_1"];	
			// this._list.selectEnable = true;
			this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
			// this._list.selectHandler = new laya.utils.Handler(this, this.onSelect);

			this._pfMoney = this._res['txt_pfMoney'];
			this._noticeOther = true;
			if(this._list.scrollBar)
				this._list.scrollBar.autoHide = true;
		}
		public reciveNetMsg(msgId:number,data:any):void
		{
			if(msgId == 0x0036||msgId == 0x002D)
			{
				this.update();	
			}
		}

		protected onShow():void
		{
			super.onShow();

			this._list.dataSource = gamelib.data.ShopData.s_shopDb.goods;
			this.update();
			if(this._pfMoney)
			{
				gamelib.Api.checkPlatfromMoney(Laya.Handler.create(this,this.update));
			}
		}
		
		private onItemUpdate(item:laya.ui.Box,index:number):void
		{
			var gd:any = this._list.dataSource[index];
			var img_goods:laya.ui.Image = getChildByName(item,"img_goods");
			img_goods.skin = utils.tools.getRemoteUrl(gd.image);

			var txt:laya.ui.Label = getChildByName(item,"btn_buy.txt_1");
			txt.text = gd.price_unit + utils.tools.getMoneyDes(gd.price);

			var txt:laya.ui.Label = getChildByName(item,"txt_3");
			txt.text = utils.tools.getMoneyDes(gd.items[0].num);

			var zhekou:Laya.Image = getChildByName(item,"img_th");
			var hot:Laya.Image = getChildByName(item,"img_hot");
			if(zhekou)
			{
				zhekou.visible = gd.desc != null && gd.desc.zekou;
			}
			if(hot)
			{
				hot.visible = gd.desc != null && gd.desc.hot;
			}
			var btn:Laya.Button = getChildByName(item,"btn_buy");
			btn.offAll(Laya.Event.CLICK);
			btn.on(Laya.Event.CLICK,this,this.onBuy,[gd]);
		}
		/**
		 * 购买单个道具
		 * @param {laya.events.Event} evt [description]
		 */
		private onBuy(gd:any):void
		{
			playButtonSound();
			gamelib.Api.buyItem(gd.goods_id);
		}

		private update():void
		{
			this._res["txt_diamond"].text = utils.tools.getMoneyByExchangeRate(gamelib.data.UserInfo.s_self.getGold_num())  + "";
			if(this._pfMoney)
				this._pfMoney.text = GameVar.platfromMoney +"";
		}
	}
}