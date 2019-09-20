namespace gamelib.core
{
	/**
	 * 游戏资源载入管理.
	 * html模式下，或有版本号。app模式下，没有版本号
	 * 
	 * @class MyLoaderManager
	 */
	export class MyLoaderManager
	{
		constructor() 
		{			
            Laya.URL.customFormat = function(url:string)
            {
            	return g_gamesInfo.getUrlContainVersionInfo(url);
            	// if(url.indexOf("?ver") == -1)
            	// {
            	// 	return url + g_game_ver_str;
            	// }	
            	// return url;
            }            
		}
		/**
		 * 设置游戏的版本信息
		 * @function setGameVer
		 * @DateTime 2018-03-16T13:45:54+0800
		 */
		public setGameVer():void
		{
			if(GameVar.resource_path.indexOf("localhost") != -1)
            {
                //g_game_ver_str = "";
                g_gamesInfo.setGameVersion(GameVar.s_namespace,"");
            }
            else
            {
            	g_gamesInfo.setGameVersion(GameVar.s_namespace,GameVar.game_ver);
                // g_game_ver_str = "?ver=" + GameVar.game_ver;                
            }
            if(g_gamesInfo.getGameVersion("common") == null)
            	g_gamesInfo.setGameVersion("common",new Date().getTime() +"");
		}
		public load3DObjs(params:{url:any, group?:string,complete?:Laya.Handler, progress?:Laya.Handler,atlas_pngLoaded?:boolean}):any
		{
			var url:any = params.url;
			if (params.url instanceof Array)
			{
				for(var i:number = 0; i < params.url.length; i++)
				{
					var temp :any = params.url[i];
					if(typeof temp == 'string')
					{
            			if(params.url[i].indexOf("?ver") == -1)
						{
							params.url[i] = g_gamesInfo.getUrlContainVersionInfo(params.url[i]);
							if(params.group)
							{
								Laya.loader.setGroup(params.url[i],params.group);
							}
						}
					}
					else
					{
						if(temp.url.indexOf("?ver") == -1)
						{
							// temp.url += g_game_ver_str;
							temp.url = g_gamesInfo.getUrlContainVersionInfo(temp.url);
							if(params.group)
							{
								Laya.loader.setGroup(temp.url,params.group);
							}
						}	
					}
				}
				url = params.url;
			}
			else
			{
				if(params.url.indexOf("?ver") == -1)
				{
					// url = params.url + g_game_ver_str;
					url = g_gamesInfo.getUrlContainVersionInfo(params.url);
				}	
				if(params.group)
				{
					Laya.loader.setGroup(url,params.group);
				}
			}
			Laya.loader.create(url,params.complete,params.progress);	
		}
		/**
		 * 载入资源 load
		 * @function
		 * @DateTime 2018-03-16T13:46:37+0800
		 * @param    {any}  params 包含以下属性:url:string|Array<any>,type:string,group:string,complete:Laya.Handler
		 *                   progress:Laya.Handler      	
		 * @return   {any}                           [description]
		 * @access public
		 */
		public load(params:{url:any, type?:string,group?:string,complete?:Laya.Handler, progress?:Laya.Handler,atlas_pngLoaded?:boolean}):any
		{
			var url:any = params.url;
			if (params.url instanceof Array)
			{
				for(var i:number = 0; i < params.url.length; i++)
				{
					var temp :any = params.url[i];
					if(typeof temp == 'string')
					{
            			if(params.url[i].indexOf("?ver") == -1)
						{
							// params.url[i] += g_game_ver_str;
							params.url[i] = g_gamesInfo.getUrlContainVersionInfo(params.url[i]);
							if(params.group)
							{
								Laya.loader.setGroup(params.url[i],params.group);
							}
						}
					}
					else
					{
						if(temp.url.indexOf("?ver") == -1)
						{
							// temp.url += g_game_ver_str;
							temp.url = g_gamesInfo.getUrlContainVersionInfo(temp.url);							
						}							
						if(params.group)
						{
							Laya.loader.setGroup(temp.url,params.group);
						}
					}
				}
				url = params.url;
			}
			else
			{
				if(params.url.indexOf("?ver") == -1)
				{	// url = params.url + g_game_ver_str;
					url = g_gamesInfo.getUrlContainVersionInfo(params.url);
				}
				if(params.group)
				{
					Laya.loader.setGroup(url,params.group);
				}
			}
			Laya.loader.load(url,params.complete,params.progress,params.type);			
		}

		/**
		 * 载入字体文件
		 * @function loadFonts
		 * @param {Array<any>}   fonts    [description]
		 * @param {Laya.Handler} complete [description]
		 * @access public
		 */
		public loadFonts(fonts:Array<any>,complete?:Laya.Handler):void
		{
			var total:number = fonts.length;
			var current:number = 0;
			for(var i:number = 0; i < total; i++)
			{
				var url:string = fonts[i].url;
				var fontname:string = url.split(".")[0];
	            var arr:Array<string> = fontname.split("/");
	            fontname = arr[arr.length - 1];
	            var pngname:string = url.replace('.fnt','.png');
	            
	            // var txt:any = Laya.loader.getRes(url + g_game_ver_str);
	            // var data:any = Laya.loader.getRes(pngname + g_game_ver_str);
	            var txt:any = Laya.loader.getRes(url);
	            var data:any = Laya.loader.getRes(pngname);
	            var bFont=new Laya.BitmapFont();
				bFont.parseFont(txt,data);
				Laya.Text.registerBitmapFont(fontname,bFont);
			}
			if(complete)
				complete.run();			
		}

		/**
		 * 卸载游戏中的字体 
		 * @function unregisterFont
		 * @DateTime 2018-03-16T13:49:09+0800
		 * @param    {Array<any>}             fonts [description]
		 * @access public
		 */
		public unregisterFont(fonts:Array<any>):void
		{
			var total:number = fonts.length;
			var current:number = 0;
			for(var i:number = 0; i < total; i++)
			{
				var url:string = fonts[i].url;
				var fontname:string = url.split(".")[0];
				Laya.Text.unregisterBitmapFont(fontname);
			}
		}
	}
}