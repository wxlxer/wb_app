
module gamelib.data
{
	/**
	 * 商品信息
	 * @class
	 * @ignore 除了msID的定义外，其他的都不使用了
	 */
	export class GoodsData extends GameData{		
		/**
		 * 红包 1002
		 */		
		public static MSID_HB:number = 1002;
		/**
		 * 铜钱 1000； 
		 */		
		public static MSID_TQ:number = 1000;
		
		/**
		 * 喇叭 
		 */		
		public static MSID_LB:number = 1010;
		/**
		 * 财神卡 
		 */		
		public static MSID_CS:number = 1011;
		/**
		 * 乐币 
		 */		
		public static MSID_LEBI:number = 1020;		
		/**
		 * 小游戏积分 
		 */		
		public static MSID_SMSCORE:number = 1021;
		
		/**
		 * 平台货币 
		 */		
		public static MSID_PLATFORMCOIN:number = 1050;
		
		/**
		 * 宝箱 
		 */		
		public static MSID_BOX:number = 1131;
		/**
		 * 万能钥匙 
		 */		
		public static MSID_KEY:number = 1132;
		
		/**
		 * 猜拳助手 
		 */		
		public static MSID_GUESSHELPERNUM:number = 1121;

		/**
		 * 金券
		 * @type {number}
		 */
		public static MSID_JINQUAN:number = 1023;
		/**
		 * 钻石，棋牌圈使用，相当于金券
		 * @type {number}
		 */
		public static MSID_ZUANSHI:number = 1024;
		
        /**
        * 补签卡
        */		
        public static MSID_BQK:number = 1022;
		
		public static MSID_XYX1:number = 1016;	//小幸运星
		public static MSID_XYX2:number = 1017;	//大幸运星
		public static MSID_XYX3:number = 1018;	//超幸运星
		public static MSID_JJK:number = 1019;	//救济卡
		
		public static MSID_HPK:number = 1101;	//换牌卡
		public static MSID_JBK:number = 1102;	//禁比卡
		public static MSID_FBK:number = 1103;	//翻倍卡
		public static s_goodsNames:any = {};
		public static s_goodsInfo:any = {};
		

		public static GetGoodsInfoByMsId(msId:number):any
		{
			return GoodsData.s_goodsInfo[msId];
		}

		public static GetGoodsIconByMsId(msId:number):string
		{
			var gd:any = GoodsData.s_goodsInfo[msId];
			if(gd == null)
				return "";
			var url:string = gd.model_icon;
			return utils.tools.getRemoteUrl(url);
		}
		public static GetGoodsImageByMsId(msId:number):string
		{
			var gd:any = GoodsData.s_goodsInfo[msId];
			if(gd == null)
				return "";
			var url:string = gd.model_image;
			return utils.tools.getRemoteUrl(url);
		}
		//mode_type:0x1显示在背包中，0x2可以使用，0x4微信红包
		public static checkGoodsCanUse(msId:number):boolean
		{
			var gd:any = GoodsData.s_goodsInfo[msId];
			if(gd == null)
				return false;
			if(gd.model_type & 0x2)
				return true;
			return false;
		}
		public static checkGoodsShowInBag(msId:number):boolean
		{
			var gd:any = GoodsData.s_goodsInfo[msId];
			if(gd == null)
				return false;
			if(gd.model_type & 0x1)
				return true;
			return false;
		}
		public static GetNameByMsId(msId:number):string
		{
			var str:string = GoodsData.s_goodsNames[msId];
			if(str != null)
				return str;
			if(GameVar.g_platformData)
			{
				if(msId == GameVar.g_platformData.gold_type)
					return GameVar.g_platformData.gold_name;
			}
			switch (msId)
			{
				case GoodsData.MSID_BQK:
					return "补签卡";
				case GoodsData.MSID_JJK:
					return "救济卡";
				case GoodsData.MSID_XYX1:
					return "小幸运星";
				case GoodsData.MSID_XYX2:
					return "大幸运星";
				case GoodsData.MSID_XYX3:
					return "超级幸运星";
				case GoodsData.MSID_TQ:
					return getDesByLan("铜钱");
				case GoodsData.MSID_HB:
					return getDesByLan("红包");
				case GoodsData.MSID_LB:
					return getDesByLan("喇叭");
				case GoodsData.MSID_JINQUAN:
					return getDesByLan("金券");
				case GoodsData.MSID_ZUANSHI:
					return getDesByLan("钻石");
			}
			return "物品" + msId
		}
		private static _goodsList:any = {};
		private static _shopGoodsList:any = {};
		
		public static GetGoodsData(id:number,forceCreate:boolean = true):GoodsData
		{
			var gd:GoodsData = GoodsData._goodsList[id];
			if(gd == null && forceCreate){
				gd = new GoodsData();
				gd.m_id = id;
				GoodsData._goodsList[id] = gd;
			}
			return gd;
		}
		public static Clear():void
		{
			for(var key in GoodsData._goodsList)
			{
				var gd:GoodsData = GoodsData._goodsList[key];
				if(gd != null)
					gd.clear();
				delete GoodsData._goodsList[key];
			}
		}
		public static RemoveGoodsData(id:number):void{
			var gd:GoodsData = GoodsData._goodsList[id];
			if(gd != null)
				gd.clear();
			delete GoodsData._goodsList[id];
		}
		/**
		 * 添加一个物品到商城物品列表中。 
		 * @param type
		 * @param goods
		 * 
		 */		
		public static AddShopGoods(type:number,goods:GoodsData):void{
			if(goods == null)
				return;
			var arr:Array<any> = GoodsData._shopGoodsList[type];
			if(arr == null){
				arr = []
				GoodsData._shopGoodsList[type] = arr;
			}
			if(arr.indexOf(goods) == -1){
				arr.push(goods);
			}	
		}	
		public static GetShopGoodsByType(type:number):Array<any>{
			var arr:Array<any> = GoodsData._shopGoodsList[type];
			return arr;
		}
		private _msId:number = 0;
		private _num:number = 0;
		private _price:number = 0;			//物品价值
		private _priceType:number = 0;		//价值类型
		private _priceOrg:number = 0;
		public _baseNum:number = 0;
		public _payType:number = 0;
		public _info:string = '';		
		public get msId():number{
			return this._msId;
		}
		public set msId(value:number){
			this._msId = value;
		}
			
		public get m_resId():number{
			return this._resId;
		}
		public get num():number{
			return this._num;
		}
		public set num(value:number){
			this._num = value;
		}
		/**
		 * 价值 
		 * @param value
		 * 
		 */		
		public set m_price(value:number){
			this._price = value;
		}
		public get m_price():number{
			return this._price;
		}
		/**
		 * 价值类型 1000:铜钱 1002，红包
		 * 
		 */		
		public get m_price_type():number{
			return this._priceType;
		}
		public set m_price_type(value:number){
			this._priceType = value;
		}
		public get price_str():string
		{
			var str:string = this._price+'';
			if(this._payType == 1000){
				str += "铜钱";
			}
			else if(this._payType == 1002){
				str += "红包";
			}
			return str
		}
			
		/**
		 * 原价 
		 * @param value
		 * 
		 */		
		public set priceOrg(value:number){
			this._priceOrg = value;
		}
		public get priceOrg():number{
			return this._priceOrg;
			
		}
		
		/**
		 *  物品基数
		 * @param value
		 * 
		 */		
		public set baseNum(value:number){
			this._baseNum = value;
		}
		public get baseNum():number{
			return this._baseNum;
		}
		
		/**
		 *  支付方式 0x08元宝兑换 0x10 彩券兑换+
		 * @param value
		 * 
		 */		
		public set payType(value:number){
			this._payType = value;
		}
		public get payType():number{
			return this._payType
		}
		public set info(value:string){
			this._info = value;
		}
		public get info():string{
			return this._info
		}
		public constructor(){
			super();
		}
	}
}