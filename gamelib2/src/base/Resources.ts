/**
 * Created by wxlan on 2017/9/5.
 */
namespace gamelib.core
{
    /**
     * 资源主流程:
     * 1、先载入平台配置文件;
     * 2、载入ui.json文件
     * 3、载入loading资源
     * 4、载入游戏本身的配置文件
     * 5、载入游戏资源、
     * 6、载入公共配置文件
     * 7、资源流程结束
     * @class Resources
     * @author wx
     */
    export class Resources
    {
        private _ftp:string;
        private game_code:string;
        private _complete:Laya.Handler;
        private _progress:Laya.Handler;
        private _preLoadingResList:Array<any>;
        private _fonts:Array<any>;
        private _gameMain:GameMain;
        private _step:number = 0;
        private _isChildGame:boolean;
        private _styleIndex:number = 0;
        private _configResourceList:Array<string>;
        private _needCacheResList:Array<string>;

        private _pro_complete:Laya.Handler;
        public constructor(complete:Laya.Handler,gameMain:GameMain,pro_complete:Laya.Handler)
        { 
            this._gameMain = gameMain;
            this._complete = complete;
            this._progress = Laya.Handler.create(this,this.onProgress,null,false);
            this._pro_complete = pro_complete;

            
        }
        public set ftp(str:string)
        {
            this._ftp = str;
        }
        public set preLoadingResList(value:Array<any>)
        {
            this._preLoadingResList = value;
        }
        /**
         * 解决加载模式下页面嵌套子页面，子页面不显示的bug
         * @function
         * @DateTime 2019-01-09T11:16:26+0800
         * @param    {any}                    neewCacheResList  [description]
         */
        public setCatcheResourceList(needCacheResList:Array<string>):void
        {
            this._needCacheResList = needCacheResList;
        }
        public start(isChildGame:boolean,game_code:string):void
        {
            this.game_code = game_code;
            this._isChildGame = isChildGame;
            this._step = 1;
            this.next();
        }
        /**
         * 从子游戏回到主游戏后，需要重新把主游戏的ui配置设置到laya里面
         * @function reshow
         * @DateTime 2018-03-16T13:50:39+0800
         * @access public
         */
        public reshow():void
        {
            // Laya.ResourceManager.currentResourceManager = this._resManager;
            // var temp = Laya.loader.getRes(this._ftp + "ui.json" + g_game_ver_str)
            // utils.tools.copyTo(temp,laya.ui.View.uiMap);
        }
        /**
         * 注册游戏要用到的字体文件
         * @function
         * @DateTime 2018-03-16T13:56:41+0800
         * @access public
         */
        public registrerFont():void
        {
            if(this._fonts == null)
                return;
            g_loaderMgr.loadFonts(this._fonts);
        }
        public destroyAllRes(game_code:string):void
        {
            Laya.loader.clearResByGroup(game_code);   
            var temp = Laya.Resource['_idResourcesMap'];
            for(var key in temp)
            {
                var resource:Laya.Resource = temp[key];
                if(resource.url && resource.url.indexOf("/" + game_code+"/") >= 0)
                {
                    resource.destroy();
                    delete temp[key];
                }
            }
        }
        public destroy():void
        {
            for(var key in Laya.View.uiMap)
            {
                if(key.indexOf(this.game_code +"/") >= 0)
                    delete Laya.View.uiMap[key];
            }
            this.clearConfigResource();
            if(this._fonts == null)
                return;
            g_loaderMgr.unregisterFont(this._fonts);
        }
        
         
        public next():void
        {
            switch (this._step)
            {
                 case 1:
                    this.loadUiJson();
                    break;
                case 2:     //进入游戏本身的配置文件。
                    if(utils.tools.isApp())
                    {
                        this.onLoadingLoaded();
                    }
                    else
                    {
                        this.loadLoadingRes();    
                    }                    
                    break;
                case 3:
                    this._step++;
                    g_loading.setLoadingTitle("载入游戏配置文件");
                    this._gameMain.loadGamesConfigs();                    
                    break;                        
                case 4: //载入公共配置文件
                    g_loading.setLoadingTitle("载入公共配置文件");
                    this.loadCommonConfigs();
                    break;
                case 5:
                    g_loading.setLoadingTitle("载入资源配置文件");
                    this.loadResJson();
                    break;    
            }
        }
        /**
         * 载入ui.json文件
         * @function loadUiJson
         * @DateTime 2018-03-16T13:53:01+0800
         * @access private
         */
        private loadUiJson():void
        {
            g_loaderMgr.load({
               url:this._ftp  + this.game_code +  "/ui.json",
               type:laya.net.Loader.JSON,
               group:this.game_code,
               complete:laya.utils.Handler.create(this,this.onUiConfigLoaded)
           });
        }
        /**
         * ui.json文件载入完成。
         * @function onUiConfigLoaded
         * @DateTime 2018-03-16T13:53:18+0800
         * @param    {any}                    data [description]
         * @access private
         */
        private onUiConfigLoaded(data:any):void
        {
            if(laya.ui.View.uiMap == null)
            {
                laya.ui.View.uiMap = data;
            }
            else
            {
                utils.tools.copyTo(data,laya.ui.View.uiMap);
            }
            if(this._needCacheResList)
            {
                for(var str of this._needCacheResList)
                {
                    Laya.loader.cacheRes(str  +".scene",data[str]);
                }
            }
            if(this._isChildGame)
                this._step = 3;
            else
                this._step = 2;
            this.next();
        }
        /**
         * 载入loading相关文件
         * @function loadLoadingRes
         * @DateTime 2018-03-16T13:53:43+0800
         * @access private
         */
        private loadLoadingRes():void
        {
            var arr:Array<any> = [];
            // arr.push(this._ftp + this.game_code + "/loading/loading.jpg");
            // arr.push(this._ftp + "/atlas/"+this.game_code+"/loading.atlas");
            arr.push(this._ftp + "qpq/loading/loading.jpg");
            arr.push(this._ftp + "atlas/qpq/loading.atlas");
            g_loaderMgr.load({
                url:arr,
                group:"qpq",
                complete:laya.utils.Handler.create(this,this.onLoadingLoaded)
            });          
        }
        //
        /**
         * loading载入完成
         * @function onLoadingLoaded
         * @DateTime 2018-03-16T13:57:18+0800
         * @access private
         */
        private onLoadingLoaded():void
        {
            g_loading.showLoadingUi();
            this._step++;
            this.next();
        }
        /**
         * 载入公共配置文件
         * @function loadCommonConfigs
         * @DateTime 2018-03-16T13:57:40+0800
         * @access private;
         */
        private loadCommonConfigs():void
        {
            this.loadPhpInfos();
            g_protocols_type = GameVar.g_platformData['protocols_type'] || "xml";
            socket.NetSocket.SOCKET_TYPE = GameVar.g_platformData['socket_type'] || "string";
            var arr1:Array<any> = [];
            var url:string = getCommonResourceUrl("protocols_common."+g_protocols_type) ;//GameVar.game_ver;
            if(g_protocols_type == "xml")
            {
                arr1.push( {url: url,type:laya.net.Loader.TEXT});
            }
            else
            {
                arr1.push( {url: url,type:laya.net.Loader.JSON});   
            }   
            var lans:Array<string> = GameVar.g_platformData["multiple_lans"] || [''];
            for(var lan of lans)
            {
                if(lan == "")
                    url = getCommonResourceUrl("lan.json");
                else
                    url = getCommonResourceUrl("lan_"+lan+".json");
                arr1.push( {url: url,type:laya.net.Loader.JSON});   
            }            
            g_loaderMgr.load({
               url:arr1,
               group:'common',
               complete:laya.utils.Handler.create(this,this.onCommonLoaded)
           });
        }
        protected onCommonLoaded():void
        {
            if(this._pro_complete)
            {
                this._pro_complete.run();
            }
            this._step++;
            this.next();
        }
        /**
         * 载入res.json文件
         * @function loadResJson
         * @DateTime 2018-03-16T13:58:27+0800
         * @access private;
         */
        private loadResJson():void
        {
           g_loaderMgr.load({
               url:this._ftp + this.game_code + "/res.json",
               group:this.game_code,
               complete:laya.utils.Handler.create(this,this.onUnpackLoaded)
            });
        }
        /**
         * res.json文件载入完成.
         * @function onUnpackLoaded
         * @DateTime 2018-03-16T13:58:45+0800
         * @param    {any}                    res [description]
         */
        private onUnpackLoaded(res:any):void
        {
            var arr:Array<any> =  this._preLoadingResList;
            for(var item of res.atlas)
            {
                item.type = laya.net.Loader.ATLAS;
                arr.push(item);
            }
            this._configResourceList = [];
            for(var item of res.unpack)
            {
                if(item.url.indexOf('ui.json')!= -1)
                   continue;
                if(item.url.indexOf(".xml") != -1)
                    item.type = laya.net.Loader.TEXT;
                else if(item.url.indexOf(".json") != -1)
                    item.type = laya.net.Loader.JSON;
                arr.push(item);

                if(item.url.indexOf("config/") != -1)
                {
                    this._configResourceList.push(item.url);
                }
            }

            this._fonts = res.fonts;
            for(var item of res.fonts)
            {
                var item1 = {
                    url:item.url,
                    size:item.size,
                    type:laya.net.Loader.XML
                }
                arr.push(item1);
            }
            for(var item of arr)
            {
                if(item.url.indexOf("http") == -1 && item.url.indexOf("file") == -1)
                    item.url = this._ftp +  item.url;
            }     
            g_loading.setLoadingTitle("载入游戏资源");
            //如果有3d的场景，需要先加载3d场景
            var d3ds = res.d3d;
            if(d3ds && d3ds.length > 0)
            {
                g_loaderMgr.load3DObjs({
                   url:d3ds,
                   group:this.game_code,
                   complete:laya.utils.Handler.create(this,this.loadeResources,[arr]),
                   progress:this._progress
                  })
            }
            else
            {
                this.loadeResources(arr);
                // g_loaderMgr.load({
                //    url:arr,
                //    group:this.game_code,
                //    complete:laya.utils.Handler.create(this,this.loadFont),
                //    progress:this._progress
                //   });
            }
        }
        private loadeResources(arr:Array<any>):void
        {
            g_loaderMgr.load({
               url:arr,
               group:this.game_code,
               complete:laya.utils.Handler.create(this,this.loadFont),
               progress:this._progress
              });
        }
        public clearConfigResource():void
        {
            for(var url of this._configResourceList)
            {
                Laya.loader.clearRes(url);
            }
        }
       /**
        * 载入字体
        * @function
        * @DateTime 2018-03-16T13:59:19+0800
        */
        private loadFont():void
        {
            g_loaderMgr.loadFonts(this._fonts,this._complete);
        }
        /**
         * 载入shop.php文件
         * @function loadPhpInfos
         * @DateTime 2018-03-16T13:59:30+0800
         */
        protected loadPhpInfos():void
        {
            if(GameVar.urlParam['isChildGame'])
                return;
            //载入shop
            
            if(GameVar.g_platformData['shop_version'] == 2)
            {
                gamelib.Api.getShopData(Laya.Handler.create(this,this.onShopLoaded));
            }
            else
            {
                // var postdata:any =
                // {
                //     platform:GameVar.platform,
                //     app_verify:GameVar.s_app_verify ? 1 : 0
                // }
                // utils.tools.http_request(GameVar.common_ftp + "shop.php",postdata,"get",function(json:any)
                // {
                //     gamelib.data.ShopData.PaseDatas(json);            
                // });
            }
        }

        private onShopLoaded(data:any)
        {
            console.log(data);
            if(data.ret != 1)
            {
                console.log("获取商城数据失败" + data.clientMsg);
                return;
            }
            gamelib.data.ShopData.PaseDatas(data.data);
            
        }
        /**
         * 游戏资源加载进度
         * @function onProgress
         * @DateTime 2018-03-16T13:59:48+0800
         * @param    {number}                 progress [description]
         */
        public onProgress(progress:number):void
        {
            g_loading.updateResLoadingProgress(progress);
            // console.log("。。。" +Math.floor(progress * 100));
            
        }

        
        
        private getVerStr():string
        {
            return "?ver="+GameVar.game_ver;
        }
    }
}
