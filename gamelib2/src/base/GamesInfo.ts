namespace gamelib.base
{
	export class GamesInfo
	{
		private _versionInfo:any;
		public constructor()
		{
			this._versionInfo = {};
		}

		public setGameVersion(game_code:string,ver:string)
		{
			this._versionInfo[game_code] = ver;
		}
		public getGameVersion(game_code:string):string
		{
			return this._versionInfo[game_code];
		}
		public getUrlContainVersionInfo(url:string):string
		{
			if(url.indexOf("?ver") >= 0)
				return url;
			for(var key in this._versionInfo)
			{
				if(url.indexOf(key+"/")>=0)
				{
					return url +"?ver=" + this._versionInfo[key] ;
				}
			}
			return url + "?ver=" + this._versionInfo['qpq'];
		}


	}
}