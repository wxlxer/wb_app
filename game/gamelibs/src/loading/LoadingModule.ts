namespace gamelib.loading
{
	export class LoadingModule
	{
		private _loadingUi:gamelib.loading.LoadingUi;
		private _miniLoading:gamelib.loading.MiniLoading;
        private _miniLoading_child:gamelib.loading.MiniLoading;
        private _maskLoading:gamelib.loading.MaskLoading;
		constructor() 
		{
			g_signal.add(this.onSignal,this);
		}
		private onSignal(msg:string,data:any):void
		{
			switch(msg)
			{
				
                case "showEnterGameLoading":
                    this.showEnterGameLoading(data);
                    break;
                case "showEnterGameLoadingMini":
                    this.showMaskLoading();
                    break;
                case "closeEnterGameLoading":
                    this.closeMaskLoading();                   
                    break;
			}
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
		public showMaskLoading():loading.MaskLoading
        {
            this._maskLoading = this._maskLoading || new loading.MaskLoading();
            this._maskLoading.show();
            return this._maskLoading;
        }
        public closeMaskLoading():void
        {
            if(this._maskLoading)
                this._maskLoading.close();
        }

        /**
         * 关闭小loading
         * @function closeMiniLoading
         * @DateTime 2018-03-16T14:29:22+0800
         */
        public closeMiniLoading():void
        {
            if(this._miniLoading != null)
                this._miniLoading.close();
        }
        /**
         * 打开小转圈
         * @function showMiniLoading
         * @DateTime 2018-03-16T14:29:38+0800
         * @param    {any}}    args [一个对象，msg:string,需要显示的文本
         *                           delay:number自动关闭的时间，秒为单位
         *                           alertMsg:string关闭时的提示文本，
         *                           callBack：function关闭时的回掉]
         */
        public showMiniLoading(args?:{msg?:string,delay?:number,alertMsg?:string,callBack?:()=>void,thisObj?:any}):void
        {
            this._miniLoading = this._miniLoading || new gamelib.loading.MiniLoading();
            this._miniLoading.setMsg(args);
            this._miniLoading.show();
        }

        /**
         * 进入子游戏显示的loading
         * @function
         * @DateTime 2018-11-16T14:51:52+0800
         * @data 1:从游戏中返回大厅，0：从大厅中进入游戏
         */
        public showEnterGameLoading(data:any):void
        {
            this._miniLoading_child = this._miniLoading_child || new gamelib.loading.MiniLoading();
            this._miniLoading_child.show();
            if(data == 0)
                this._miniLoading_child.setMsg({msg:"游戏加载中..."})
            else
                this._miniLoading_child.setMsg({msg:"游戏加载中"}) 
        }
        public closeEnterGameLoading():void
        {
            if(this._miniLoading_child)
                this._miniLoading_child.close();
        }
	}
}