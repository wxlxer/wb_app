/**
 * Created by wxlan on 2017/9/13.
 */
namespace gamelib.childGame
{
    /**
     * 进入子游戏的逻辑
     * @class EnterGame
     */
    export class EnterGame
    {
        private _web:WebDataHander;
        private _game_args:string;
        private _validation:string;

        public m_childGame:gamelib.core.GameMain;

        private _game_jsList:any;
        private _loadingGames:any;
        private _params:any;
        private _gz_id:number;

        private _gameLoaders:GameLoaderMgr;
        public constructor(web:WebDataHander)
        {
            this._web = web;
            this._game_jsList = {};
            this._loadingGames = {};
            this._gameLoaders = new GameLoaderMgr();
        }
        /**
         * 进入指定游戏。
         * 1、先检测是否是app和app是否有新的缓存包需要下载
         * 2、检测要进入的游戏是否是laya模式
         * 3、获取对应的分区信息
         * 4、加载或者跳转游戏
         * 
         * @function enterGame
         * @DateTime 2018-03-17T14:01:46+0800
         * @param    {number}                 gz_id      [description]
         * @param    {string}                 validation [如果是组局房，需要把房号加上]
         * @param    {string}                 game_args  [如果进入游戏后要做默认的处理（比如进如指定的房间),可以通过设置这个参数来实现]
         */
        public enterGame(gz_id:number,validation?:string,game_args?:string):void
        {            
            this._game_args = game_args;
            this._validation = validation;
            this._gz_id = gz_id;
            if(this._gameLoaders.checkLoaderValid())
            {
                var bCache = this._gameLoaders.loadGame(gz_id,Laya.Handler.create(this,this.enterGame_1,null,false),Laya.Handler.create(this,this.onLoaderProcess,null,false));
                if(bCache)
                {
                    g_signal.dispatch("showEnterGameLoadingMini",0);
                }
                else
                {
                    g_signal.dispatch("showEnterGameLoading",0);
                }

            }
            else
            {
                g_signal.dispatch("showEnterGameLoading",0);
                this.enterGame_1(gz_id);
            }
        }
        private onLoaderProcess(pro:number):void
        {
            g_loading.onCacheProgress(pro+"");
        }

        private enterGame_1(gz_id):void
        {            
            if(this._web.checkGameIsLaya(gz_id))
            {
                this._web.getGameInfo(gz_id,this.enterLayaGame,this);
            }
            else
            {
                this._web.getLoginInfo(gz_id,this.enterNormalGame,this);
            }
        }
        /**
         * 跳转到指定的游戏
         * @function enterNormalGame
         * @DateTime 2018-03-17T14:05:42+0800
         * @param    {any}                    obj [description]
         */
        private enterNormalGame(obj:any):void
        {
            console.log("enterNormalGame");
            if(obj.status == 0)
            {
                g_uiMgr.showAlertUiByArgs({msg:obj.msg});
                return;
            }
            var str:string = "";
            if(this._validation != null)
            {
                var circle_args:any = {"validation":this._validation};
                str = JSON.stringify(circle_args);
                str = "&circle_args=" + encodeURIComponent(str);
            }
            if(this._game_args != null)
            {
                var game_args:string = JSON.stringify(this._game_args);
                str += "&game_args=" + encodeURIComponent(game_args);
            }
            var url:string = obj.data.url + "&gameMode=1" + str;
            window.location.href = url;
        }
        /**
         * 进入laya模式的子游戏
         * 1、需要把子游戏的相关参数设置为window["child_params"]
         * 2、检测是否已经载入过改游戏的js，
         * 3、载入子游戏的js
         * 4、创建子游戏的实例对象,子游戏的显示和主游戏的关闭在GameMain类中实现         
         * @function enterLayaGame
         * @DateTime 2018-03-17T14:06:12+0800
         * @param    {any}                    obj [description]
         */
        private enterLayaGame(obj: any): void
        {
            console.log("enterGameStep2:"+ JSON.stringify(obj));
            //g_signal.dispatch("closeQpqLoadingUi",{msg:"请等待..."});
            if(obj == null)
            {
                g_uiMgr.showAlertUiByArgs({msg:"不支持h5版本"});
                return;
            }
            if(obj.status == 0)
            {
                g_uiMgr.showAlertUiByArgs({msg:obj.msg});
            }
            else
            {
                var url:string = GameVar.resource_path + "js/" + obj.game_code.split("_")[0] + "/main.js";
                if(GameVar.urlParam['game_path'].indexOf("localhost") == -1)
                {
                    url +=  "?ver=" + obj.game_ver;
                }
                if(this._loadingGames[url])
                {
                    console.log("已经有一个子游戏了");
                    return;
                }
                this._params = obj;
                this._params.circle_args = null;
                this._params.game_args = null;
                var str:string = "";
                if(this._validation != null)
                {
                    var circle_args:any = {"validation":this._validation};
                    str = JSON.stringify(circle_args);
                    this._params.circle_args = str;
                }
                if(this._game_args != null)
                {
                    var game_args:string = JSON.stringify(this._game_args);
                    this._params.game_args = game_args;
                }
                this._params.pid = GameVar.pid;
                this._params.gender = GameVar.urlParam["gender"];
                this._params.icon_url = GameVar.playerHeadUrl;
                this._params.nickname = GameVar.nickName;
                this._params.platform = GameVar.platform;
                this._params.isChildGame = true;
                this._params.game_path = GameVar.urlParam['game_path'];
                this._params.ftp = GameVar.urlParam['ftp'];
                this._params.request_host = GameVar.urlParam['request_host'];
                this._params.client_access_key = GameVar.urlParam['client_access_key'];
                this._params.client_access_token = GameVar.urlParam['client_access_token'];
                window["child_params"] = this._params;

                
                
                var bLoaded:boolean = this._game_jsList[url];
                if(bLoaded)
                {
                    this.createGame();
                }
                else
                {
                    this.loadScript(url);
                }
            }
        }
        private createGame():void
        {
            if(this.m_childGame)
            {
                console.log("已经有一个子游戏了");
                return;
            }
            var gameCode:string = this._params.game_code.split("_")[0];
            var cl = window[gameCode];
            this.m_childGame = new cl();
        }
        private loadScript(url:string)
        {
            var script = document.createElement("script");
            script.type = "text/javascript";
            var self = this;
            this._loadingGames[url] = true;
            script.onload = function ()
            {
                console.log("jsLoaded!");
                delete self._loadingGames[url];
                self.createGame();
                self._game_jsList[url] = true;
            };
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    }
}