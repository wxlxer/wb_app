namespace qpq
{
	export var g_commonFuncs:CommonFuncs;
	export class CommonFuncs
	{
		private _selfInfo:any;					//玩家个人信息
		private _selfContactsInfo:any;			//玩家个人联系信息
		private _selfLoginInfo:any;				//玩家登录相关信息
		constructor()
		{
		}
		public getSelfLoginInfo(callBack?:Laya.Handler):any
		{
			if(this._selfLoginInfo != null)
			{
				if(callBack)
					callBack.runWith(this._selfLoginInfo);
				return this._selfLoginInfo;
			}
			var self:any = this;
			gamelib.Api.getUserLoginInfo(Laya.Handler.create(this,function(obj:any)
			{
				self._selfLoginInfo = obj.data;
				if(callBack)				
					callBack.runWith(self._selfLoginInfo);
			}))
			return null;
		}
		public saveSelfLoginInfo(key:string,data:any):void
		{
			if(this._selfLoginInfo == null)
				return;
			this._selfLoginInfo[key] = data;
		}

		/**
		 * 获得玩家信息
		 * @function
		 * @DateTime 2018-08-20T16:12:15+0800
		 * @param    {Laya.Handler}           callBack [description]
		 */
		public getSelfInfo(callBack?:Laya.Handler):any
		{
			if(this._selfInfo != null)
			{
				if(callBack)
					callBack.runWith(this._selfInfo);
				return this._selfInfo;
			}
			var self:any = this;
			gamelib.Api.getUserIdentity(Laya.Handler.create(this,function(obj:any)
			{
				self._selfInfo = obj.data;
				if(callBack)				
					callBack.runWith(self._selfInfo);
			}))
			return null;
		}
		/**
		 * 获得玩家联系方式信息
		 * @function
		 * @DateTime 2018-08-20T16:12:25+0800
		 * @param    {Laya.Handler}           callBack [description]
		 */
		public getSelfContactsInfo(callBack:Laya.Handler):void
		{
			if(this._selfContactsInfo != null)
			{
				callBack.runWith(this._selfContactsInfo);
				return;
			}
			var self:any = this;
			gamelib.Api.getUserContacts(Laya.Handler.create(this,function(obj:any)
			{
				self._selfContactsInfo = obj.data;
				callBack.runWith(self._selfContactsInfo);
			}))
		}
		/**
		 * 保存玩家联系信息
		 * @function
		 * @DateTime 2018-08-20T16:12:45+0800
		 * @param    {string;							                              }} obj [description]
		 * @param    {Laya.Handler}           callBack [description]
		 */
		public saveSelfContactsInfo(obj: {	phone?: string;
							        idcard?: string;
							        street_address?: string;
							        actual?: string;
							    },callBack?:Laya.Handler):void
		{
			var self:any = this;
			var temp:any = {};
			utils.tools.copyTo(obj,temp);
			gamelib.Api.updateUserContacts(obj,Laya.Handler.create(this,function(ret:any)
			{
				if(ret.ret == 1)
				{
					for(var key in temp)
					{
						if(self._selfContactsInfo)
							self._selfContactsInfo[key] = temp[key];
					}	
					g_uiMgr.showTip("保存成功");				
				}
				else
				{
					g_uiMgr.showTip(ret.clientMsg);
				}
				if(callBack)
					callBack.runWith(ret);
			}))
		}
		public saveSelfInfo(obj: {	nick?: string,
							        icon?: string,
							        sign_name?:string,
							        gender?: number,
							        phone?: number
							    },callBack?:Laya.Handler):void
		{
			var self:any = this;
			var temp:any = {};
			utils.tools.copyTo(obj,temp);
			gamelib.Api.updateUserInfo(obj,Laya.Handler.create(this,function(ret:any)
			{
				if(ret.ret == 1)
				{
					for(var key in temp)
					{
						if(self._selfInfo)
							self._selfInfo[key] = temp[key];
					}	
					if(callBack == null)
						g_uiMgr.showTip("保存成功");				
				}
				else
				{
					if(callBack == null)
						g_uiMgr.showTip(ret.clientMsg);
				}
				if(callBack)
					callBack.runWith(ret);
			}))
		}
		/**
		 * 点击事件统计
		 * @function
		 * @DateTime 2018-07-30T09:51:11+0800
		 */
		public eventTongJi(evt:string,value:string,addData?:any):void
		{
			gamelib.Api.ApplicationEventNotify(evt,value,addData);
		}
	}
	
}