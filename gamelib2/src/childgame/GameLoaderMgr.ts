namespace gamelib.childGame
{
	export class GameLoaderMgr{
		
		private _loaders:any;
		constructor() {
			this._loaders = {};
		}
		public checkLoaderValid():boolean
		{
			return utils.tools.isApp() && window['application_check_game_cache'] != null;
		}
		/**
		 * 载入游戏
		 * @function
		 * @DateTime 2019-06-14T17:38:07+0800
		 * @param    {number}                 gz_id    [description]
		 * @param    {Laya.Handler}           complete [description]
		 * @param    {Laya.Handler}           progress [description]
		 * @return   {boolean}                         [是否用的cache。如果是用的cache,不需要展示apploading]
		 */
		public loadGame(gz_id:number,complete:Laya.Handler,progress:Laya.Handler):boolean
		{
			var loader:GameLoader = this._loaders[gz_id];
			var bCache:boolean = true;
			if(loader == null)
			{
				bCache = false;
				loader = new GameLoader(gz_id);				
				this._loaders[gz_id] = loader;
			}
			loader.load(complete,progress);
			return bCache;
		}	
	}

	export class GameLoader{
		private gz_id:number;
		private _completes:Array<Laya.Handler>;
		private _progresss:Array<Laya.Handler>;
		private _status:number;		//0:未开始,1：加载中，2：完成
		private _jd:number|string;

		private _loader:any;
		constructor(gz_id:number) {
			this.gz_id = gz_id;
			this._completes = [];
			this._progresss = [];
			this._jd = 0;
			this._status = 0;
		}
		public load(complete?:Laya.Handler,progress?:Laya.Handler):void
		{
			if(this._status == 2)
			{
				progress && progress.runWith(100);
				complete && complete.runWith(this.gz_id);
				return;
			}
			this._completes.push(complete);
			this._progresss.push(progress);			
			if(this._status == 0)
			{
				this._status = 1;
				this._jd = "";
				this._loader = window['application_check_game_cache'](this.gz_id, this.onLoaded,this);
             	Laya.timer.loop(100,this,this.checkProgress)
			}
			progress && progress.runWith(this._jd);

		}
		public stop():void
		{
			this._status = 0;
			Laya.timer.clearAll(this);
		}
		private onLoaded():void
		{
			this._jd = 100;
			this._status = 2;
			for(var handle of this._progresss)
			{
				handle.runWith(100);
			}
			for(var handle of this._completes)
			{
				handle.runWith(this.gz_id);
			}
			this._progresss.length = this._completes.length = 0;
			Laya.timer.clearAll(this);
			
		}

		private checkProgress():void
		{
			if(!window['application_check_game_cache']) {
                 return;
             }
             this._jd = this._loader.get_download_percent();
             for(var handle of this._progresss)
             {
             	handle.runWith(this._jd);
             }
		}
	}
}