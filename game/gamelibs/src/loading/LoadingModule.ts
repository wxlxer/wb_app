namespace gamelib.loading
{
	export class LoadingModule
	{
		private _loadingUi:gamelib.loading.LoadingUi;
		constructor() 
		{
		}
		/**
		 * 更新游戏资源的进度
		 * @function
		 * @DateTime 2018-11-16T14:46:15+0800
		 * @param    {number}                 progress [description]
		 */
		public updateResLoadingProgress(progress:number):void
		{
			// if(GameVar.urlParam['isChildGame'] && (GameVar.g_platformData['childgame_loading_type'] != 1))
            // {
            //     if(this._miniLoading_child)
            //     {
            //         if(progress == 1)
            //         {
            //             this._miniLoading_child.updateMsg(getDesByLan("同步中")+"...");
            //         }
            //         else
            //         {
            //             var num:number = Math.floor(progress * 100);
            //             if(num <= 1)
            //             {
            //             	this._miniLoading_child.updateMsg("");
            //             }
            //             else
            //             {
            //                 this._miniLoading_child.updateMsg(getDesByLan("资源载入中")+"..." + num + "%" );    
            //             }
            //         }
            //     }
            //     return;
            // }
            // if(utils.tools.isApp())
            // {                 
            //     if(window["application_loading_info"])
            //         window["application_loading_info"](getDesByLan("资源载入中")+"...",Math.floor(progress * 100) );                

            //     // console.log("。。。" +Math.floor(progress * 100));
            // }
            // else
            // {
            //     if(this._loadingUi != null)
            //         this._loadingUi.showProgress(progress);                
            // }    
		}
		private _point:number;
        /**
         * 缓存包的加载进度
         * @function
         * @DateTime 2018-11-16T14:37:47+0800
         */
        public onCacheProgress(progress:string):void
        {
            // if(utils.tools.isApp() && GameVar.g_platformData['childgame_loading_type'] == 1)
            // {
            //     var title:string = "";
            //     var info:string = "";
            //     //下载cache包和加载资源一样
            //     if(progress == "")
            //     {
            //         title = "检测游戏...";
            //         info = "0";
            //     }
            //     else
            //     {
            //         title = "资源下载中..."
            //         info = "" + progress;
            //     }
            //     if(window["application_loading_info"])
            //         window["application_loading_info"](title,info);
            //     console.log(title + "  " + info);
            //     return;
            // }

            // if(this._miniLoading_child)
            // {
            //     var str:string = "...";
            //     if(progress == "")
            //     {
            //         if(isNaN(this._point))
            //             this._point = 0;
            //         else
            //             this._point ++;

            //         this._point = this._point % 3;
            //         str = "";
            //         if(this._point == 0)
            //         {
            //             str = ".  ";
            //         }
            //         else if(this._point == 1)
            //         {
            //             str = ".. ";
            //         }
            //         else
            //         {
            //             str = "...";
            //         }
            //     }
            //     this._miniLoading_child.updateMsg(getDesByLan("加载中") + str + progress);                    
            // }
        }

		/** 
		 *	显示主loading界面
		 * 
		 */
		public showLoadingUi():void
		{
			this._loadingUi = this._loadingUi || new gamelib.loading.LoadingUi();
			this._loadingUi.show();
		}
		/**
		 * 关闭主loading界面。
		 * @function
		 * @DateTime 2018-11-16T14:50:09+0800
		 */
		public closeLoadingUi():void
		{
			if(this._loadingUi)
				this._loadingUi.close();
		}
		public setLoadingTitle(msg:string):void
		{
			console.log(msg);
		}
		/**
		 * 关闭主loading界面。
		 * @function
		 * @DateTime 2018-11-16T14:50:09+0800
		 */
		public close():void
		{
			this.closeLoadingUi();
		}
		
	}
}