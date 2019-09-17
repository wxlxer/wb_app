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
         * 当前游戏的顶层
         * @type {laya.display.Sprite}
         * @access private
         */
        private _topLayer:laya.display.Sprite;

        public constructor()
        {            
            var params = window["child_params"];
            params = params || window["_pf_datas"] || window["urlParam"] || {};
            this.initLaya(params);
            this.onParamsLoaded(params);
        }
        protected onParamsLoaded(params):any
        {
            GameVar.urlParam = params;
            this.initGame(GameVar.urlParam);
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
            if(!Laya['_isinit'])
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
                Laya.init(this.m_gameWidth,this.m_gameHeight,Laya.WebGL);
            }
            
            
            UIConfig.closeDialogOnSide = false;
            Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;
            Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;   
            if(bLandscape)
            {
                Laya.stage.screenMode = laya.display.Stage.SCREEN_HORIZONTAL;    
            }
            else{
                Laya.stage.screenMode = laya.display.Stage.SCREEN_VERTICAL;    
            }         
            Laya.stage.bgColor = "#232628";    
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
            this.game_name = params.game_code;
            var arr:Array<any> = [];
            

            this._topLayer = new laya.display.Sprite();
            Laya.stage.addChild(this._topLayer);

            g_signal = g_signal || new gamelib.core.Signal();
            g_loading = g_loading || new gamelib.loading.LoadingModule();
            g_soundMgr = g_soundMgr || new gamelib.core.SoundManager();
            g_uiMgr = g_uiMgr || new gamelib.core.UiMainager();
            g_dialogMgr = g_dialogMgr || new gamelib.core.DialogManager();
            g_net = new gamelib.core.GameNet();
            laya.ui.Dialog.manager = g_dialogMgr;
            g_dialogMgr = Laya.Dialog.manager;
            g_gameMain = g_gameMain || this;
            g_net_configData = g_net_configData || new gamelib.data.NetConfigDatas();
            this._topLayer.zOrder = Laya.Dialog.manager.zOrder + 10;
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


            this._topLayer.scaleX = tscale;
            this._topLayer.scaleY = tscale;

            laya.ui.Dialog.manager.scaleX = tscale;
            laya.ui.Dialog.manager.scaleY = tscale;

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
            this._topLayer.removeSelf();
            Laya.stage.off(laya.events.Event.RESIZE,this,this.onResize);
            
            
            g_signal.remove(this.onSignal,this);
            g_dialogMgr.maskLayer.removeSelf();
            this._net = null;
            this._topLayer = null;

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
            Laya.stage.addChild(this._topLayer);
            this.playBgm();
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
        /**
         * 所有资源载入完成后的回掉
         * 需要创建网络模块，连接服务器
         * @function onResloaded
         * @DateTime 2018-03-16T12:04:28+0800
         * @access protected
         */
        protected onResloaded():void
        {
            this.playBgm();
        }
        private playBgm():void
        {
            
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
               
            }
        }
    }
}
window['gamelib'] = gamelib;
