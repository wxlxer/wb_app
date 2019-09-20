module gamelib.childGame {
	/**
	 * @class	WebDataHander
	 * @author wx
	 * 获取登录串相关
	 *
	 */
	export class WebDataHander
	{
		private _callBack:Function;
		private _thiObj:any;
		private _gameInfoList:any;
		private _gzIdToGameId:any;
		public constructor(gzIdToGameId:any)
		{
			this._gzIdToGameId = gzIdToGameId;
			this._gameInfoList = {};
		}
		public checkGameIsLaya(gz_id:number):boolean
		{
			if(this._gzIdToGameId[gz_id])
				return this._gzIdToGameId[gz_id].isLayaGame;
			return false;
		}
        /**
         * 获得游戏的登录信息。跳转子游戏会使用
         * @function
         * @DateTime 2018-03-17T15:31:26+0800
         * @param    {number}                 gz_id    [description]
         * @param    {function}             callBack [description]
         * @param    {any}                    thisObj  [description]
         */
		public getLoginInfo(gz_id:number,callBack:(obj:any)=>void,thisObj:any):void
		{
			var temp:any = this._gzIdToGameId[gz_id];
			if(temp == null)
			{
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("进入分区失败") + gz_id + " " + g_net.name});
				return;
			}
			console.log("获得游戏的登录信息 application_login_game");
			window["application_login_game"](gz_id,temp.gameId,callBack.bind(thisObj));
		}
		/**
		 * 获取游戏分区信息，进入子游戏会使用
		 * @function
		 * @DateTime 2018-03-17T14:11:44+0800
		 * @param    {number}                 gz_id    [description]
		 * @param    {function}             callBack [description]
		 * @param    {any}                    thisObj  [description]
		 */
		public getGameInfo(gz_id:number,callBack:(obj:any)=>void,thisObj:any):void
		{
			this._callBack = callBack;
			this._thiObj = thisObj;
			var obj:any = this._gameInfoList[gz_id];
			if(obj)
			{
				callBack.apply(thisObj,[obj]);
				return;
			}
			var data :any = getGame_zone_info(gz_id);
			if(data)
			{
				var pars:any = {};
				pars.result = 0;
				pars.data = data;
				this.onGetGame_zone_info(pars);
			}
			else
			{
				window["application_game_zone_info"](gz_id,this.onGetGame_zone_info.bind(this));	
			}
		}
		/**
		 * 清除指定游戏的信息缓存
		 * @function
		 * @DateTime 2018-06-28T11:41:58+0800
		 * @param    {number}                 gz_id [description]
		 */
		public clearGameInfo(gz_id:number):void
		{
			delete this._gameInfoList[gz_id];
		}
		/**
		 * 修改指定游戏的信息缓存
		 * @function
		 * @DateTime 2018-06-28T11:45:15+0800
		 * @param    {number}                 gz_id [description]
		 * @param    {string}                 att   [description]
		 * @param    {string}                 value [description]
		 */
		public modifyGameInfo(gz_id:number,att:string,value:string):void
		{
			var temp:any = this._gameInfoList[gz_id];
			if(temp == null)
				return;
			temp[att] = value;
		}
		private onGetGame_zone_info(ret:any):void
		{
			console.log(JSON.stringify(ret));
			var obj: any = ret.data;
			if(ret.result != 0)
			{
				console.log("目标分区的登陆信息获取失败!");
				return;
			}
			this._gameInfoList[obj.gz_id] = obj;
			this._callBack.apply(this._thiObj,[obj]);
		}
	}
}
