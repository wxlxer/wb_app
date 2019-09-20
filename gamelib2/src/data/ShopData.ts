module gamelib.data {
	/**
	 * 商城数据
	 * @class ShopData
	 * @author wx
	 * 
	 */
	export class ShopData extends GameData
    {
		public static SetGoods(indexs:Array<number>):void
		{
			ShopData.s_list.length = 0;
			for(var i:number = 0; i < indexs.length ;i++)
			{
				var gd = ShopData.getGoodsData(indexs[i]);
				gd.isGood = true;
				gd.platformIcon = ShopData.s_platformIcon;
				ShopData.s_list.push(gd);
			}
		}
		/**
		 * 解析商城数据
		 * @function PaseDatas
		 * @static
		 * @DateTime 2018-03-17T14:55:22+0800
		 * @param    {any}                    root [description]
		 */
		public static PaseDatas(root:any):void
		{
			if(GameVar.g_platformData['shop_version'] == 2)
			{
				ShopData.parseShopDataV2(root)
				return;
			}
			ShopData.s_shopDb = root;
			ShopData.s_list = [];
			ShopData.s_platformMoney = [];
			ShopData.s_vips = [];
			ShopData.s_fangkaList = [];
			var goods = root.goods;
			var platformMoney = root.platformMoney;
			var platforms = root.platforms;
			var vips = root.vips;
			
			
			var isIos = laya.utils.Browser.onIOS;
			var isAndroid = laya.utils.Browser.onAndroid;
			var len:number = platforms ? platforms.length:0;
			for(var i:number = 0; i < len;i++)
			{
				var pi = platforms[i];
				if(isIos)
				{
					pi = pi.iOs;
				}
				else if(isAndroid)
				{
					pi = pi.android;
				}
				else
				{
					pi = pi.pc;
				}
				if(pi == null ||pi.items == null)
					pi = platforms[i];
				if(pi.items == null)
					pi = pi.android;

				ShopData.s_platformIcon = pi.platformIcon;
				ShopData.s_bShowPlatformMoney = pi.showPlatformMoney == "true";
				ShopData.s_moneyType = pi.moneyType ? pi.moneyType :"¥";
				var res_url:string = pi.res_url;

				for(var j:number = 0; j < pi.items.length;j++)
				{
					var gd = ShopData.getGoodsData(parseInt(pi.items[j].index));
					for(var key in pi.items[j])
					{
						gd[key] = pi.items[j][key];
					}
					gd.pricetype = pi.pricetype;
					gd.platformIcon = pi.platformIcon;
					gd.isGood = true;
					if(res_url == "self")
					{
						gd.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform +"/res/" + gd.icon +".png";
					}
					else
					{
						gd.res_url = GameVar.common_ftp + "shop/" + gd.icon +".png";
					}
					
					if(gd.hide == 1)
						continue;
					ShopData.s_list.push(gd);
				}

				if(pi.diamonds)
				{
					for(j = 0; j < pi.diamonds.length;j++)
					{
						var diamond:any = pi.diamonds[j];
						if(typeof diamond == 'number')
						{
							ShopData.s_platformMoney.push(getPlatformmoney(diamond));	
						}
						else
						{
							diamond.buyindex = diamond.index;
							ShopData.s_platformMoney.push(diamond)
						}						
					}
					for(var tempDiamonds of ShopData.s_platformMoney)
					{
						if(res_url == "self")
						{
							tempDiamonds.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform +"/res/" + tempDiamonds.icon +".png";
						}
						else
						{
							tempDiamonds.res_url = GameVar.common_ftp + "shop/" + tempDiamonds.icon +".png";
						}
					}
				}
				if(pi.fangka)
				{
					for(j = 0; j < pi.fangka.length;j++)
					{
						var gd = ShopData.getGoodsData(parseInt(pi.fangka[j].index));
						for(var key in pi.fangka[j])
						{
							gd[key] = pi.fangka[j][key];
						}
						gd.pricetype = pi.pricetype;
						gd.platformIcon = pi.platformIcon;
						gd.info1 = gd.info2;
						gd.isGood = true;
						if(res_url == "self")
						{
							gd.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform +"/res/" + gd.icon +".png";
						}
						else
						{
							gd.res_url = GameVar.common_ftp + "shop/" + gd.icon +".png";
						}
						if(gd.hide == 1)
							continue;
						ShopData.s_fangkaList.push(gd);
					}
				}

				if(pi.vips)		//vip道具
				{
					for(j = 0; j < pi.vips.length;j++)
					{
						var vip = pi.vips[j];
						if(res_url == "self")
						{
							vip.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform +"/res/" + vip.icon +".png";
						}
						else
						{
							vip.res_url = GameVar.common_ftp + "shop/" + vip.icon +".png";
						}
						ShopData.s_vips.push(pi.vips[j]);
					}
				}
				if(pi.tabs)
				{
					ShopData.s_tabs = [];
					for(j = 0; j < pi.tabs.length;j++)
					{
						var tab:any = pi.tabs[j];
						if(tab.value == "items")
						{
							tab.list = ShopData.s_list;
						}
						else if(tab.value == "diamonds")
						{
							tab.list = ShopData.s_platformMoney;
						}
						else if(tab.value == "fangka")
						{
							tab.list = ShopData.s_fangkaList;
						}
						else
						{
							tab.list = ShopData.s_vips;
						}
						ShopData.s_tabs.push(tab);
					}
				}
			}
			var testpIds = root.testPid;
			if(testpIds == null)
				return;
			
			if(testpIds.indexOf(GameVar.pid) != -1)
			{

			}

			function getPlatformmoney(index:number):any
			{
				for(var m:number = 0; m < platformMoney.length;m++)
				{
					if(platformMoney[m].index == index)
					{
						platformMoney[m].buyindex = platformMoney[m].index;	
						return platformMoney[m];
					}
				}
				return {};
			}
		}

		/**
		 * 获得物品数据
		 * @param index
		 * @returns {any}
		 */
		private static getGoodsData(index:number):any
		{
			var goods:any = ShopData.s_shopDb.goods;
			for(var m:number = 0; m < goods.length;m++)
			{
				if(goods[m].index == index)
					return goods[m];
			}
			return {};
		}
		/**
		 * 通过buyindex活动商品数据信息
		 * @function getGoodsInfoById
		 * @static
		 * @DateTime 2018-03-17T14:55:44+0800
		 * @param    {number}                 buyindex [description]
		 * @return   {any}                             [description]
		 */
		public static getGoodsInfoById(buyindex:number):any
		{
			var arr:Array<any> = ShopData.s_shopDb["goods"];
			for(var i:number = 0; i < arr.length;i++)
			{
				if(parseInt(arr[i].buyindex) == buyindex)
					return arr[i];
			}
			return null;
		}

		/**
		 * 解析商城2.0数据
		 * @function
		 * @DateTime 2018-07-18T16:58:18+0800
		 * @param    {any}                    root [description]
		 */
		private static parseShopDataV2(root:any):void
		{
			ShopData.s_shopDb = root;
			ShopData.s_list = [];
			ShopData.s_platformMoney = [];
			ShopData.s_fangkaList = [];
			GameVar.s_firstBuy = !(ShopData.s_shopDb.payAmount);
		}
		public static s_shopDb:any;
		public static s_list:Array<any>;				//道具
		public static s_platformMoney:Array<any>;		//钻石
		public static s_fangkaList:Array<any>;			//房卡列表
		public static s_vips:Array<any>;				//vip
		public static s_tabs:Array<any>;
		public static s_platformIcon:string;
		public static s_bShowPlatformMoney:boolean = false;
		public static s_moneyType:string = ""
        public m_huodongId: number = 0;

        public res_url:string = "";
        public buyindex:number;

        public m_price:number;
        public m_price_name:string;
        public m_des:string;
        public m_type:number;
        
		public constructor()
		{
            super();


		}
	}

}
