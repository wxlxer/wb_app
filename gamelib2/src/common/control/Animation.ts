namespace gamelib.control
{
	/**
	 * 管理动画的。直接用g_animation来使用，不要实例化次类
	 * @class Animation
	 */
	export class Animation {
		constructor() {
					
		}

		/**
		 * 播放动画
		 * @function playAnimation
		 * @param {string}   res "qpq.ui.FaceUI"
		 * @param {number}} pos 0:(0,0)点，1：居中显示，{x,y}，显示到指定坐标
		 * @param {autoRemove} 播放完成后是否自动删除
		 */
		public playAnimation(res:string,pos:number|{x:number,y:number},autoRemove:boolean,callBack?:Laya.Handler):Laya.Scene
		{
			// var classObj:any = gamelib.getDefinitionByName(res);
			// if(classObj == null)
			// {
			// 	console.log("动画资源" + res +"不存在")
			// 	return null;
			// }
   //          var movie = new classObj();
   			var movie = utils.tools.createSceneByViewObj(res);
   			if(movie == null)
			{
				console.log("动画资源" + res +"不存在")
				return null;
			}
			g_topLayaer.addChild(movie);
			var tx:number = 0;
			var ty:number = 0;
			if(pos == 0)
			{
				tx = 0;
				ty = 0;
			}
			else if(pos == 1)
			{
				var sw:number = Math.max(Laya.stage.width,g_gameMain.m_gameWidth);
				var sh:number = Math.max(Laya.stage.height,g_gameMain.m_gameHeight);
				tx = (sw - movie['width']) /2;
				ty = (sh - movie['height']) / 2;
			}
			else
			{
				tx = pos['x'];
				ty = pos['y'];
			}
			movie.x = tx;
			movie.y = ty;
			var ani1:Laya.FrameAnimation = movie['ani1'];
			if(ani1 == null)
			{
				console.log("资源" + res +" 没有动画");
				return movie;
			}
            ani1.play(0,false);
			if(autoRemove)
			{
            	ani1.once(laya.events.Event.COMPLETE,this,this.onPlayEnd,[movie,callBack]);	
			}
			return movie;
		}
		private onPlayEnd(movie:any,callBack?:Laya.Handler):void
		{
			movie.removeSelf();			
			if(callBack)
			{
				callBack.run();
			}
		}
	}
}