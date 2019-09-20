///<reference path="../../libs/LayaAir.d.ts"/>
namespace gamelib.core
{
    /**
     * 所有游戏入口的基类
     * 1、根据初始参数，初始舞台
     * 2、初始化游戏的各个模块
     * 3、载入游戏资源
     * 
     * @class GameMain
     * @author wx
     */
    export class GameMain
    {
        /**
         * 舞台的设计宽度
         * @type {number} 
         * @default 1280
         * @access public
         */
        public m_gameWidth:number;
        /**
         * 舞台的设计高度
         * @type {number}
         * @default 720
         * @access public
         */
        public m_gameHeight:number;

        /**
         * 当前是否是子游戏
         * @type {boolean}
         * @access private
         */
        private _isChildGame:boolean;

        /**
         * 资源路径
         * @type {string}
         * @access private
         */
        private _ftp:string;
        /**
         * 游戏明，更具game_code来获取
         * @type {string}
         * @access private
         */
        private game_code:string;
        private game_name:string;

        /**
         * 当前使用的网路模块
         * @type {gamelib.core.GameNet}
         * @access private
         */
        private _net:gamelib.core.GameNet;
        /**
         * 当前使用的层级管理器
         * @type {gamelib.core.LayerManager}
         * @access private
         */
        private _layerManager:gamelib.core.LayerManager;

        /**
         * 当前游戏的顶层
         * @type {laya.display.Sprite}
         * @access private
         */
        private _topLayer:laya.display.Sprite;

        /**
         * 资源加载器
         * @type {Resources}
         * @access private
         */
        private _resource:Resources;

        /**
         * 网络数据接收管理器,需要子类自己初始化
         * @access protected
         * @type {gamelib.core.GameDataManager}
         */
        protected _gdm:gamelib.core.GameDataManager;

        public constructor()
        {            
            var params = window["child_params"];
            params = params || window["_pf_datas"] || window["urlParam"];
            if(params)
                this._isChildGame = params['isChildGame'];
            else{
                this._isChildGame = false;
                params = {};
            }
            this.initLaya(params);
            this._resource = new gamelib.core.Resources(
                Laya.Handler.create(this,this.onResloaded),this,
                Laya.Handler.create(this,this.onProtocolLoaded)); 
            if(utils.tools.isWxgame())
            {
                wxgame.startup(Laya.Handler.create(this,this.onParamsLoaded));
                g_soundMgr = g_soundMgr || new gamelib.core.SoundManager();
                window["g_soundMgr"] = g_soundMgr;
            }
            else
            {
                this.onParamsLoaded(params);
            }
            // 
            
            
        }
        protected onParamsLoaded(params):any
        {
            GameVar.urlParam = params;
            // this._ftp = GameVar.resource_path + "resource/";
            laya.net.URL.basePath = this._resource.ftp = GameVar.resource_path + "resource/";
            // this._resource.ftp = this._ftp;
            this.initGame(GameVar.urlParam);
            this._resource.start(this._isChildGame,this.game_code);  
            g_signal.addWithPriority(this.onSignal,this,1000);  
            Laya.stage.on(laya.events.Event.RESIZE,this,this.onResize);
            this.onResize();        
        }


        /**
         * 初始化layabox，
         * 设置舞台尺寸，设置资源根目录
         * 设置舞台自适应方式
         * 
         * @function initLaya
         * @author wx
         * @DateTime 2018-03-16T11:11:32+0800
         * @access protected
         */
        protected initLaya(param:any):void
        {
            var game_orientation:string = param["game_orientation"];
            if(!this._isChildGame || !Laya['_isinit'])
            {
                //横屏：landscape    竖屏：portrait
                var bLandscape:boolean = game_orientation == "landscape" || game_orientation == null;
                if(bLandscape)
                {
                    this.m_gameWidth = 1280;
                    this.m_gameHeight = 720;    
                }
                else
                {
                    this.m_gameWidth = 720;
                    this.m_gameHeight = 1280; 
                }

                if(window['_isLoad3D'])
                    Laya3D.init(this.m_gameWidth,this.m_gameHeight);
                else
                    Laya.init(this.m_gameWidth,this.m_gameHeight,Laya.WebGL);
            }
            
         // Laya["DebugTool"].init();
            
            UIConfig.closeDialogOnSide = false;
            // Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE;
            Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
            // if(GameVar.resource_path.indexOf('192.') != -1 || utils.tools.isRuntime())
            // {
            //     Laya.stage.scaleMode = "showall";
            // }
            // else
            {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;                
            }   
            if(!this._isChildGame)
            {
                if(bLandscape)
                {
                    // Laya.stage.scaleMode = "full";
                    Laya.stage.screenMode = laya.display.Stage.SCREEN_HORIZONTAL;    
                }
                else{
                    Laya.stage.screenMode = laya.display.Stage.SCREEN_VERTICAL;    
                }         
                Laya.stage.bgColor = "#232628";
            }            
            if(param["isDebug"])
                Laya.Stat.show();
        }
        /**
         * 初始化游戏模块
         * @function initGame
         * @author wx
         * @DateTime 2018-03-16T11:13:08+0800
         * @param    {any}                    params [description]
         * @access protected
         */
        protected initGame(params:any):void
        {            
            if(window["child_params"] == null && utils.tools.isWx())
            {
                if(window["application_weixin_share_handle"])
                {
                    window["application_weixin_share_handle"](platform.onWxShareCallBack,this);
                }
            }            
            if(params.game_code.indexOf("_s") >= 0)
                this.game_code = GameVar.s_namespace = params.game_code.split("_")[0];
            else 
            this.game_code = GameVar.s_namespace = params.game_code;
            this.game_name = params.game_code;
            // if(!this._isChildGame)
            // {
            //     g_game_ver_str_qpq = "?ver=" + GameVar.game_ver;
            // }
            var arr:Array<any> = [];
            this.setPreLoadingResList(arr);
            
            this._resource.preLoadingResList = arr;

            this._layerManager = new gamelib.core.LayerManager();
            this._topLayer = new laya.display.Sprite();

            Laya.stage.addChild(this._layerManager);
            Laya.stage.addChild(this._topLayer);

            g_layerMgr = this._layerManager;
            g_topLayaer = this._topLayer;
            g_signal = g_signal || new gamelib.core.Signal();
            g_loading = g_loading || new gamelib.loading.LoadingModule();
            g_soundMgr = g_soundMgr || new gamelib.core.SoundManager();
            g_gamesInfo = g_gamesInfo || new gamelib.base.GamesInfo();
            
            g_uiMgr = g_uiMgr || new gamelib.core.UiMainager();
            g_dialogMgr = g_dialogMgr || new gamelib.core.DialogManager();
            laya.ui.Dialog.manager = g_dialogMgr;

            g_dialogMgr = Laya.Dialog.manager;
            g_loaderMgr = g_loaderMgr || new gamelib.core.MyLoaderManager();
            g_animation = g_animation || new gamelib.control.Animation();

            g_childGame = g_childGame || new gamelib.childGame.ChildGame();
            g_gameMain = g_gameMain || this;
            g_qpqCommon = g_qpqCommon || new gamelib.common.QpqCommonModule();
            g_net_configData = g_net_configData || new gamelib.data.NetConfigDatas();

            if(utils.tools.isWxgame())
            {
                window["g_layerMgr"] = g_layerMgr;
                window["g_topLayaer"] = g_topLayaer;
                window["g_signal"] = g_signal;
                window["g_loading"] = g_loading;
                window["g_soundMgr"] = g_soundMgr;
                window["g_uiMgr"] = g_uiMgr;
                window["g_animation"] = g_animation;
                window["g_childGame"] = g_childGame;
                window["g_gameMain"] = g_gameMain;
                window["g_qpqCommon"] = g_qpqCommon;
                window["g_net_configData"] = g_net_configData;  
                //获取本地配置
                window['wx'].getStorage({
                    key: 'config',
                    success(res) {
                        g_net_configData.getNetConfog({config:res.data});
                    }
                })
                    
            }

            // this._topLayer.zOrder = g_dialogMgr.zOrder + 10;
            this._topLayer.zOrder = Laya.Dialog.manager.zOrder + 10;

            g_loaderMgr.setGameVer();
        }
        /**
         * 解决加载模式下页面嵌套子页面，子页面不显示的bug
         * @function
         * @DateTime 2019-01-09T11:16:26+0800
         * @param    {any}                    obj  [description]
         * @param    {string}                 root [description]
         * @return   {any}                         [description]
         */
        protected registerClass(obj:any,root:string,needCacheResList?:Array<string>):any
        {
            var str:string = root;
            needCacheResList = needCacheResList || [];
            var arr:Array<string> = root.split(".");
            var game_code = arr[arr.length - 1];
            for(var key in obj)
            {
                Laya.ClassUtils.regClass(root + "." + key,obj[key]);
                needCacheResList.push(game_code+"/" + key.substring(0,key.length - 2));
            }
            this._resource.setCatcheResourceList(needCacheResList);
            return arr;
        }
        /**
         * 舞台尺寸改变的回掉。用最小缩放比例来缩放_layerManager;
         * 这种能保证不变形，但是在x方向或者y方向的尺寸不准确;在计算
         * 坐标的时候会有偏差
         * @function onResize
         * @author wx
         * @DateTime 2018-03-16T11:15:49+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onResize(evt?:laya.events.Event):void
        {
            var sw:number = Laya.stage.width;
            var sh:number = Laya.stage.height;

            var gw:number = g_gameMain.m_gameWidth;
            var gh:number = g_gameMain.m_gameHeight;

            var tscaleX:number = sw / gw;
            var tscaleY:number = sh / gh;
            var tscale:number = Math.min(tscaleX,tscaleY);
            
            g_scaleXY =  tscaleX < tscaleY ? "x" : "y";

            g_scaleRatio = tscale;

            
            this._layerManager.scaleX = tscale;
            this._layerManager.scaleY = tscale;

            this._topLayer.scaleX = tscale;
            this._topLayer.scaleY = tscale;

            laya.ui.Dialog.manager.scaleX = tscale;
            laya.ui.Dialog.manager.scaleY = tscale;

            // var ui:any = this._layerManager.getChildAt(0);
            // if(ui)
            // {
            //     console.log("大厅尺寸:" + ui.width,ui.height);
            // }
            // console.log("Laya.stage 尺寸:" + sw +"  " + sh + "  " + this._layerManager.scaleX);

            console.log("Laya.stage 缩放比例:" + tscale);
        }
        /**
         * 销毁游戏.由childgame调用。不要主动调用次方法
         * @function destroy
         * @author wx
         * @DateTime 2018-03-16T11:18:58+0800
         * @access public 
         */
        public destroy():void
        {
            if(this._gdm)
            {
                g_net.removeListener(this._gdm);
                this._gdm.destroy();
            }

            
            this._topLayer.removeSelf();
            this._layerManager.removeChildren();
            this._layerManager.removeSelf();
            g_qpqCommon.close();
            this._net.destroy();
            Laya.stage.off(laya.events.Event.RESIZE,this,this.onResize);
            if(Laya.Browser.onIOS)
            {
                this._resource.destroyAllRes(this.game_code);
                
            }
            else
            {
                var index:number = GameMain.s_catchList.indexOf(this.game_code);
                if(index != -1)
                {
                    GameMain.s_catchList.splice(index,1);              
                }
                GameMain.s_catchList.push(this.game_code);
                if(GameMain.s_catchList.length > 3)
                {
                    this._resource.destroyAllRes(GameMain.s_catchList.shift());
                    // Laya.loader.clearResByGroup(GameMain.s_catchList.shift());  
                }
            } 
            
            g_signal.remove(this.onSignal,this);
            this._resource.destroy();
            gamelib.common.GiftSystem.s_instance.destroy();
            gamelib.chat.WorldChatData.s_instance.clearRoomTakeData();
            g_dialogMgr.maskLayer.removeSelf();
            this._net = null;
            this._gdm = null;
            this._resource = null;
            this._topLayer = null;
            this._layerManager = null;

        }
        private static s_catchList:Array<string> = [];
        // public get ftp():string
        // {
        //     return this._ftp;
        // }
        public get resource():Resources
        {
            return this._resource;            
        }
        /**
         * 从主游戏进入子游戏，需要关闭主游戏的公共模块，断开主游戏的服务器，
         * 关闭主游戏的ui
         * @function close
         * @author wx
         * @DateTime 2018-03-16T11:59:23+0800
         * @access public
         */
        public close():void
        {
            // g_qpqCommon.close();
            // this._net.close();
            this._layerManager.removeSelf();
            g_signal.remove(this.onSignal,this);

        }
        /**
         * 从子游戏回到主游戏。
         * 需要删除子游戏相关的数据，重置urlParam，资源目录
         * 重新连接主游戏的服务器
         * @function reshow
         * @author wx
         * @DateTime 2018-03-16T11:59:41+0800
         * @param    {any}                    jsonData [description]
         * @access public
         */
        public reshow(jsonData?:any):void
        {
            g_signal.addWithPriority(this.onSignal,this,1000);
            // Laya.stage.scaleMode = "full";
            // this.onResize();

            var temp = window["_pf_datas"] || window["urlParam"];
            delete temp["circle_args"];
            delete temp["game_args"];
            GameVar.urlParam = temp;
            GameVar.circleData = new gamelib.data.CircleData();
            // laya.net.URL.basePath = this._ftp;
            GameVar.s_namespace = GameVar.game_code.split("_")[0];
            g_loaderMgr.setGameVer();
            this._resource.reshow();
            g_net = this._net;
            g_layerMgr = this._layerManager;
            g_topLayaer = this._topLayer;
            this._net.show();
            g_qpqCommon.show();
            Laya.stage.addChild(this._layerManager);
            Laya.stage.addChild(this._topLayer);
            this.playBgm();
            // this._resource.registrerFont();
        }
        /**
         * 载入游戏本身的配置文件，棋牌圈
         * @function loadGamesConfigs
         * @author wx
         * @DateTime 2018-03-16T12:03:05+0800
         * @access public
         */
        public loadGamesConfigs():void
        {
            this._resource.next();
        }

        /**
         * 设置游戏本身需要载入的文件,
         * @function setPreLoadingResList
         * @author wx
         * @DateTime 2018-03-16T12:03:52+0800
         * @param    {Array<any>}             arr [description]
         * @access protected
         */
        protected setPreLoadingResList(arr:Array<any>):void
        {

        }

        protected onProtocolLoaded():void
        {
            
        }
        /**
         * 所有资源载入完成后的回掉
         * 需要创建网络模块，连接服务器
         * @function onResloaded
         * @DateTime 2018-03-16T12:04:28+0800
         * @access protected
         */
        protected onResloaded():void
        {
            this.loadLan();           
            if(!this._isChildGame)
            {
                g_signal.dispatch(GameMsg.GAMERESOURCELOADED,this.game_name);
            }
            else
            {
                if(g_net)
                {
                    g_qpqCommon.close();
                    g_gameMain._net.close();    
                }
            }    
            this.playBgm();
            if(g_net)
            {
                g_net.close();                
            }
            this._net = new gamelib.core.GameNet(this.game_code,this._isChildGame);
            this._net.show();
            g_net = this._net;
            g_qpqCommon.show();
            this._net.addListener(g_childGame);
            if(this._gdm)
            {
                g_net.addListener(this._gdm);
            }
        }
        private playBgm():void
        {
             var bgms:any = GameVar.g_platformData["bgms"];
            if(bgms)
            {
                var code:string = GameVar.game_code.split("_")[0];
                if(bgms[code])
                {
                    g_soundMgr.playBgm(bgms[code]);
                }
            } 
        }
        /**
         * 全局信号处理方法
         * @function onSignal
         * @DateTime 2018-03-16T12:05:43+0800
         * @param    {string}                 msg  [description]
         * @param    {any}                    data [description]
         */
        protected onSignal(msg:string,data:any):void
        {
            switch (msg)
            {
                case GameMsg.GAMERESOURCELOADED:
                    if(this.game_name != data)
                    {
                        this.close();
                    }
                    break;
                case GameMsg.CHANGELAN:        //切换语言配置
                    this.loadLan();
                    break;    
            }
        }
        protected loadLan():void
        {
            var url:string = "";
            if(!isMultipleLans())
            {
                url = getCommonResourceUrl("lan.json");
                s_lanConif = Laya.loader.getRes(url) || {};   
    
                url = getGameResourceUrl("config/lan.json");
                var temp_lan:any = Laya.loader.getRes(url)||{};   
                utils.tools.copyTo(temp_lan,s_lanConif);
            }
            else
            {
                var str:string = gamelib.Api.getLocalStorage("lan");
                if(str == null)
                {
                    str = GameVar.g_platformData['multiple_lans'][0];
                    gamelib.Api.saveLocalStorage("lan",str);
                }
                url = getCommonResourceUrl("lan_"+str+".json");
                s_lanConif = Laya.loader.getRes(url) || {};   

                url = getGameResourceUrl("config/lan_"+str+".json");
                var temp_lan:any = Laya.loader.getRes(url)||{};   
                utils.tools.copyTo(temp_lan,s_lanConif);

            }
        }
    }
}
window['gamelib'] = gamelib;
