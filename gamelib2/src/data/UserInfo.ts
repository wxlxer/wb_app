module gamelib.data
{
	/**
	 * @class
	 * 游戏玩家数据
	 * @extends GameData
	 */
	export class UserInfo extends GameData
	{
		/**
		 * @property {UserInfo} s_self
		 * 玩家自己的数据,这个对象需要游戏在接受玩家自身信息包的时候，赋值
		 * @static
		 */
		public static s_self:UserInfo = null;

		/**
		 * @property {number} m_pId
		 */
		public m_pId:number = 0;

		/**
		 * @property {string} m_headUrl
		 * 头像资源
		 */
		private _headUrl:string = "";

		public get m_headUrl():string
		{
			return this._headUrl;
		}
		public set m_headUrl(value:string)
		{
			this._headUrl = value;
		}
		/**
		 * @property {string} m_title
		 * 称号
		 */
		public m_title:string ="";
		/**
		 * @property {number} m_title
		 * 游戏获胜次数
		 */
		public m_winNum:number = 0;
		/**
		 * @property {number} m_gameNum
		 * 游戏次数
		 */
		public m_gameNum:number = 0;
		/**
		 * @property {number} m_winRate
		 * 胜率
		 */
		public m_winRate:number = 0;

		/**
		 * 经度
		 * @type {number}
		 */
		public m_lon:number = 0;

		/**
		 * 纬度
		 * @type {number}
		 */
		public m_lat:number = 0;

		/**
		 * 高度
		 */
		public m_altitude:number = 0;

		/**
		 * 网络座位号
		 * @type {number}
		 */
		public m_seat_local:number = -1;

		/**
		 * 本地座位号
		 * @type {number}
		 */
		public m_seat_net:number = -1;


		/**
		 * ip地址
		 */
		public m_ip:string;

		private _sex:number = 0;
		private m_goodsList:any = {};
		private _name_ex:string = "";


		public get m_name():string
		{
			return this._name;
		}
		public set m_name(value:string)
		{
			this._name = value;
			if(utils.StringUtility.GetStrLen(value)>7)
			{
				this._name_ex = utils.StringUtility.GetSubstr(value,7) +"...";
			}
			else
			{
				this._name_ex = value;
			}
		}

		/**
		 * @property {string} m_name_ex
		 * 昵称，取m_name的0-8位字符，如果超出用...代替
		 * @readonly
		 */
		public get m_name_ex():string
		{
			return this._name_ex;
		}
		/**
		 * @property {number} m_sex
		 * 性别，0是女，1是男
		 */
		public get m_sex():number
		{
			return this._sex;
		}
		public set m_sex(value:number)
		{
			this._sex = value;
		}
		private _roomId:number = -1;
		/**
		 * @property {number} m_roomId
		 * 房间号，如果为0表示在大厅
		 * @readonly
		 */
		public get m_roomId():number
		{
			return this._roomId;
		}
		public set m_roomId(value:number)
		{
			var bChange:boolean = this._roomId != value
			this._roomId = value;
		}

		/**
		 * @property {number} m_leBi
		 * 乐币
		 */
		public m_leBi:number = 0;
		/**
		 * @property {number} m_smallGameScore
		 * 小游戏积分
		 */
		public m_smallGameScore:number = 0;
		/**
		 * @property {number} m_guessHelperNum
		 * 猜拳助手
		 */
		public m_guessHelperNum:number = 0;
		/**
		 * @property {number} m_guessNum
		 * 猜拳次数
		 */
		public m_guessNum:number = 0;

		/**
		 * @property {number} m_money
		 * 铜钱数量
		 */
		public m_money:number = 0
		/**
		 * @property {number} m_hb
		 * 红包数量
		 */
		public m_hb:number = 0;

		/**
		 * @property {string} m_address
		 * 地址
		 */
		public m_address:string = "";

		/**
		 * @property {number} m_jjk
		 * 救济卡
		 */
		public m_jjk:number = 0;
		/**
		 * @property {number} m_cskNum
		 * 财神卡
		 */
		public m_cskNum:number = 0;
		/**
		 * @property {number} m_laba
		 * 喇叭
		 */
		public m_laba:number = 0;
		
		//幸运星
		/**
		 * @property {number} m_luckstart1
		 * 小幸运星
		 */
		public m_luckstart1:number = 0;
		/**
		 * @property {number} m_luckstart2
		 * 中幸运星
		 */
		public m_luckstart2:number = 0;
		/**
		 * @property {number} m_luckstart3
		 * 超级幸运星
		 */
		public m_luckstart3:number = 0;

		/**
		 * @property {number} m_itemLevel
		 * 道具等级
		 */
		public m_itemLevel:number = 0;
		/**
		 * @property {number} m_itemExpPer
		 * 道具经验
		 */
		public m_itemExpPer:number = 0;
		/**
		 * @property {number} m_boxNum
		 * 宝箱数量
		 */
		public m_boxNum:number = 0;				//宝箱数量
		/**
		 * @property {number} m_keyNum
		 * 钥匙数量
		 */
		public m_keyNum:number = 0;				//钥匙数量
		/**
		 * @property {number} m_platformCoin
		 * 平台货币数量
		 */
		public m_platformCoin:number = 0;
		/**
		 * @property {number} m_unreadMailNum
		 * 未读邮件数量
		 */
		public m_unreadMailNum:number = 0;
		private _level:number = 0;

		private _registerTime:number;		//注册时间
		private _lastLoginTime:number;		//最后登录时间
		/**
		 * @property {number} m_bqk
		 * 补签卡
		 */
        public m_bqk: number = 0;
		/**
		 * @property {boolean} m_bSignIn
		 * 可签到吗
		 */
		public m_bSignIn :boolean = false;

		/**
		 * 钻石，用于棋牌圈，相当于金券
		 * @type {number}
		 */
		public m_diamond:number = 0;

		/**
		 * 金券，用于棋牌圈
		 * @type {number}
		 */
		public m_jinQuan:number = 0;

		/**
		 * 获得当前平台对应的货币数据
		 * @function  getGold_num
		 * @DateTime 2018-03-17T14:57:22+0800
		 * @return   {number}                 [description]
		 */
		public getGold_num(isZj:boolean = false):number {
			var type:number = isZj ? GameVar.g_platformData.gold_type_zj : GameVar.g_platformData.gold_type;
			switch (type) {
				case GoodsData.MSID_TQ:
					return this.m_money;					
				case GoodsData.MSID_JINQUAN:
					return this.m_jinQuan;
				case GoodsData.MSID_ZUANSHI:
					return this.m_diamond;	
				case GoodsData.MSID_HB:
					return this.m_hb;		
				case GoodsData.MSID_LB:
					return this.m_leBi;
				case GoodsData.MSID_SMSCORE:
					return this.m_smallGameScore;	
				case GoodsData.MSID_PLATFORMCOIN:
					return this.m_platformCoin;	
				default:
					return this.m_money;					
			}
		}

		public constructor(){
			super();
		}
		/**
		 * @property {number} m_level
		 * 等级
		 */
		public get m_level():number{
			return this._level;
		}
		public set m_level(value:number)
		{
			this._level = value;
		}
		/**
		 * @property {number} m_currentExp
		 * 当前经验
		 */
		public m_currentExp:number = 0;
		/**
		 * @property {number} m_nextExp
		 * 下一次升级经验
		 */
		public m_nextExp:number = 0;

		/**
		 * @property {string} m_designation
		 * 财富称号
		 */
		public m_designation:string = "";
		/**
		 * @property {number} gameVipLevel
		 * 游戏vip等级 1-6
		 */		
		private _gamevipLevel:number = 0;
		//public _vipDataList:Array<VipDate> = new Array<VipDate>();
		public get gameVipLevel():number
		{
			var vip:number = this._gamevipLevel - 500;
			vip = vip > 0 ? vip:0;
			return vip;
		}

		private _vipLevel:number;
		public get vipLevel():number
		{
			return this._vipLevel;
		}
		public set vipLevel(value:number)
		{
			this._vipLevel = value;
		}
		//vip的数据信息
		public m_vipData:any;
		/**
		 * @method
		 * 获取玩家的所有vip数据
		 * @returns {Array<VipDate>}
		 */
		//public getVipList():Array<VipDate>{
		//	var arr:Array<VipDate> = [];
		//	var length:number = this._vipDataList.length;
		//	for(var i:number = 0;i < length;i++){
		//		var vd:VipDate = this._vipDataList[i];
		//		arr.push(vd);
		//	}
		//	return arr;
		//}
		/**
		 * @method
		 * 添加一个vip勋章 
		 * @param {VipDate} vd
		 * 
		 */		
		//public addVipDate(vd:VipDate):void
		//{
		//	this._vipDataList.push(vd);
		//	if(vd.m_id <= 506 && vd.m_id > this._gamevipLevel){
		//		this._gamevipLevel = vd.m_id;
		//
		//	}
		//}

		/**
		 * @method
		 * 获取指定的vip数据
		 * @param {number} id
		 * @returns {VipDate}
		 */
		//public getVipDate(id:number):VipDate
		//{
		//	if(id == 0) return null;
		//	var length:number = this._vipDataList.length;
		//	for(var i:number = 0;i < length;i++)
		//	{
		//		var vd:VipDate = this._vipDataList[i];
		//		if(vd.m_id == id)
		//			return vd;
		//	}
		//	return null;
		//}
		/**
		 * @method
		 * 删除一个vip勋章 
		 * @param {VipDate} vd
		 * 
		 */		
		//public removeVipDate(vd:VipDate):void
		//{
		//	var index:number = this._vipDataList.indexOf(vd);
		//	if(index == -1)
		//		return;
		//	var vd:VipDate = this._vipDataList.splice(index,1)[0];
		//	if(vd.m_id <= 506 && vd.m_id == this._gamevipLevel)		//重新设置vip等级
		//	{
		//		this._gamevipLevel = 0;
		//		var length:number = this._vipDataList.length;
		//		for(var i:number = 0;i < length;i++){
		//			vd = this._vipDataList[i];
		//			if(vd.m_id <= 506 && vd.m_id > this._gamevipLevel)
		//				this._gamevipLevel = vd.m_id;
		//		}
		//	}
		//}
		/**
		 * @method
		 * 清除所有vip数据
		 *
		 */
		//public clearVipDate():void{
		//	this._vipDataList.splice(0,this._vipDataList.length);
		//	this._gamevipLevel = 0;
		//}
		/**
		 * @method
		 * 解析所有vip数据
		 * @param {Array<any>} arr
		 */
		//public paseVipDataList(arr:Array<any>):void
		//{
		//	var length:number = arr.length;
		//	for(var i:number = 0;i < length;i++){
		//		var obj:any = arr[i];
		//		this.paseVipData(obj);
		//	}
		//}
		/**
		 * @method
		 * 解析单个vip数据
		 * @param {any} obj
		 */
		public paseVipData(obj:any):void{
			switch(obj.honorId){
				case GoodsData.MSID_TQ:
					this.m_money = obj.honorTime;
					break;
				case GoodsData.MSID_CS:
					this.m_cskNum = obj.honorTime;
					break;
				case GoodsData.MSID_XYX1:
					this.m_luckstart1 = obj.honorTime;
					break;
				case GoodsData.MSID_XYX2:
					this.m_luckstart2 = obj.honorTime;
					break;
				case GoodsData.MSID_XYX3:
					this.m_luckstart3 = obj.honorTime;
					break;
				case GoodsData.MSID_JJK:
					this.m_jjk = obj.honorTime;					
					break;
				case GoodsData.MSID_PLATFORMCOIN:
					this.m_platformCoin = obj.honorTime;
					break;
				case GoodsData.MSID_BOX:
					this.m_bqk = obj.honorTime;
					break;
				case GoodsData.MSID_JINQUAN:
					this.m_jinQuan = obj.honorTime;
					break;
				case GoodsData.MSID_ZUANSHI:
					this.m_diamond = obj.honorTime;
					break;
				default:
					if(obj.honorId > 10000){
						this.m_itemLevel = obj.honorId - 10000;
						this.m_itemExpPer = obj.honorTime / 10000;
					}
					else{	
						//var vipdata:VipDate = new VipDate();
						//vipdata.m_id = obj.honorId;
						//vipdata.setLeftTime(obj.honorTime);
						//this.addVipDate(vipdata);
					}
					break;					
			}
		}

		/**
		 * 处理打开背包协议
		 * @param data
		 */
		public openBag(data:any):void
		{
			var arr:Array<any> = data.goodsNum;
			var length:number = arr.length;
			for(var i:number = 0;i < length;i++){
				var obj:any = arr[i];
				this.onItemUpte(obj);
			}
		}

		/**
		 * 处理单个物品更新协议
		 * @param data
		 */
		public onItemUpte(data:any):void
		{
			var msId:number = data.msId;
			if(msId == 0)
				msId = data.msID;
		//	trace(msId,data.num);
			this.m_goodsList[msId] = data;
			switch(msId){	
				case GoodsData.MSID_HB:
					this.m_hb = data.num;
					break;
				case GoodsData.MSID_TQ:
					this.m_money = data.num;
					break;
				case GoodsData.MSID_LB:
					this.m_laba = data.num;
					break;
				case GoodsData.MSID_CS:
					this.m_cskNum = data.num;
					break;
				case GoodsData.MSID_XYX1:
					this.m_luckstart1 = data.num;
					break;
				case GoodsData.MSID_XYX2:
					this.m_luckstart2 = data.num;
					break;
				case GoodsData.MSID_XYX3:
					this.m_luckstart3 = data.num;
					break;
				case GoodsData.MSID_JJK:
					this.m_jjk = data.num;
					break;
				case GoodsData.MSID_LEBI:
					this.m_leBi = data.num;
					break;
				case GoodsData.MSID_SMSCORE:
					// this.m_smallGameScore = data.num;
					break;
				case GoodsData.MSID_GUESSHELPERNUM:
					this.m_guessHelperNum = data.num;
					break;
				case GoodsData.MSID_PLATFORMCOIN:
					this.m_platformCoin = data.num;
					break;
                case GoodsData.MSID_BQK:
                    this.m_bqk = data.num;
                    break;
				case GoodsData.MSID_JINQUAN:
					this.m_jinQuan = data.num;
					break;
				case GoodsData.MSID_ZUANSHI:
					this.m_diamond = data.num;
					break;
			}
		}

		/**
		 * 获得指定msid的物品对象
		 * @param msId
		 * @returns {GoodsData}
		 */
		public getGoodsByMsId(msId:number):any
		{
			return this.m_goodsList[msId];
		}
		public getGooodsNumByMsId(msId:number):number
		{
			var temp = this.m_goodsList[msId];
			if(temp == null)
				return 0;
			return temp.num;
		}
		public getBagGoods():Array<any>
		{
			var arr:Array<any> = [];
			var result:Array<{msId:number,url:string,model_type:number,num:number}> = [];
			for(var msId in gamelib.data.GoodsData.s_goodsInfo)
			{
				var temp:any = gamelib.data.GoodsData.s_goodsInfo[msId];
				if(temp.model_type & 0x1)
				{
					arr.push(temp);
				}
			}
			for(var temp of arr)
			{
				var gd:any = utils.tools.clone(temp);
				gd.num = this.getGooodsNumByMsId(gd.model_id);
				result.push(gd);
				gd.model_icon = utils.tools.getRemoteUrl(gd.model_icon);
			}
			return result

		}
		/**
		 * @method
		 * 设置注册时间 
		 * @param value
		 * 
		 */		
		public setRegisterTime(value:number):void{
			this._registerTime = value;
		}
		/**
		 * 获取注册时间 
		 * @return 时间字符串
		 * 
		 */		
		public getRegisterTime():string
		{
			if(isNaN(this._registerTime))
				return '';
			var data:Date = new Date();
			data.setTime( this._registerTime * 1000);
			var str:string = data.getFullYear() + "-" ;
			var temp:number = data.getMonth() + 1;
			str += (temp < 10 ? "0" +temp : temp)+"-";

			temp = data.getDate();
			str += (temp < 10 ? "0" +temp : temp)+" "

			temp = data.getHours();
			str += (temp < 10 ? "0" +temp : temp)+":";

			temp = data.getMinutes();
			str += (temp < 10 ? "0" +temp : temp)+":";

			temp = data.getSeconds();
			str += (temp < 10 ? "0" +temp : temp);

			return str;
		}
		/**
		 * 设置最后登录时间 
		 * @param value
		 * 
		 */		
		public setLastLoginTime(value:number):void
		{
			this._lastLoginTime = value;
		}	
		/**
		 * 获取最后登录时间字符串 
		 * @function
		 * @DateTime 2018-03-17T15:37:33+0800
		 * @return   {string}                 [description]
		 */
		public getLastLoginTime():string
		{
			if(isNaN(this._lastLoginTime))
				return '';
			var data:Date = new Date();
			data.setTime( this._lastLoginTime * 1000);

			var data:Date = new Date();
			data.setTime( this._lastLoginTime * 1000);
			var str:string = data.getFullYear() + "-" ;
			var temp:number = data.getMonth() + 1;
			str += (temp < 10 ? "0" +temp : temp)+"-";

			temp = data.getDate();
			str += (temp < 10 ? "0" +temp : temp)+" "

			temp = data.getHours();
			str += (temp < 10 ? "0" +temp : temp)+":";

			temp = data.getMinutes();
			str += (temp < 10 ? "0" +temp : temp)+":";

			temp = data.getSeconds();
			str += (temp < 10 ? "0" +temp : temp);
			return str;
		}

		/**
		 * 获得铜钱描述
		 * @returns {string} 例如1.11万，1.11亿
		 */
		public getMoneyDes():string
		{
			return utils.tools.getMoneyDes(this.m_money);
		}
		/**
		 * 获取目标相对于自己的地理位置距离
		 * @param user
		 * @returns {number}返回的距离，单位km
		 */
		public getDistance(user:data.UserInfo):string
		{
			if(user.m_lon == 0 && user.m_lat == 0 && user.m_lat == 0)
			{
				return getDesByLan("未知");
			}
			if(this.m_lon == 0 && this.m_lat == 0 && this.m_lat == 0)
			{
				return getDesByLan("未知");
			}
			var temp:number = utils.MathUtility.LantitudeLongitudeDist(this.m_lon,this.m_lat,user.m_lon,user.m_lat);
			if(temp > 1000)
			{
				temp = temp / 1000;
				var str:string = temp.toFixed(2);
				return str + getDesByLan("千米");
			}
			else
			{
				var str:string = temp.toFixed(2);
				// if(temp <= 2)
				// {
				// 	return this.m_name + getDesByLan("与") + user.m_name +getDesByLan("地理位置相近");
				// }
				return str + getDesByLan("米");
			}
		}
		/**
		 * 
		 * @param user 
		 * @return -1：没有距离信息，其他值，单位米
		 */
		public getDistanceNum(user:data.UserInfo):number
		{
			if(user.m_lon == 0 && user.m_lat == 0 && user.m_lat == 0)
				return -1;
			if(this.m_lon == 0 && this.m_lat == 0 && this.m_lat == 0)
				return -1;
			var temp:number = utils.MathUtility.LantitudeLongitudeDist(this.m_lon,this.m_lat,user.m_lon,user.m_lat);			
			return temp;
		} 
		
	}
}