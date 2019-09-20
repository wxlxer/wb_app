module gamelib.childGame {
	/**
	 * @class
     * 子游戏模块
     *  var gz_idA:number = GameVar.gz_id;
     *  var gz_idB:number = GameVar.target_gz_id;
     *  var gz_idC:number = data.gameId;   服务器通知要进入的游戏分区
     *  通过0x0014和0x0015来控制进哪个游戏。
     *  在配置文件载入后，会设置当前平台下有哪些游戏。每个游戏的开发技术是laya还是白鹭
     *  如果是laya，会直接载入子游戏，否则会跳转游戏
     * 
     * @implements core.INet
	 * @author wx
	 *
	 */
    export class ChildGame implements core.INet
    {
        priority: number;
        private _web:WebDataHander;
        private _enterGameGz_idByClient:number = 0;
        private _validation:string="";
        private _game_args:any = null
        private _selfIsMainGzid: boolean;
        private _gzIdToGameId:any;
        private _quitGame:QuitGame;
        private _enterGame:EnterGame;

        public get m_web():WebDataHander
        {
            return this._web;
        }
        public constructor()
        {
            this._gzIdToGameId = {};
            this._web = new gamelib.childGame.WebDataHander(this._gzIdToGameId);
            //this._net = new gamelib.childGame.ServerDataHander();
            this._quitGame = new gamelib.childGame.QuitGame(this._web);
            this._enterGame = new gamelib.childGame.EnterGame(this._web);
        }
        /**
         * @function quitChild
         * 返回棋牌圈
         * @param jsonData
         */
        public toCircle(jsonData?:any):void
        {
            this.quitChild(jsonData);
        }
        /**
         * @function quitChild
         * 退出子游戏。
         * 1、先销毁子游戏。
         * 2、销毁子游戏的数据
         * 3、重新显示主游戏
         * 
         * @param {any} jsonData [description]
         */
        public quitChild(jsonData?:any):void
        {
            g_signal.dispatch("showEnterGameLoading",1);
            if(this._enterGame.m_childGame)
            {
                this._enterGame.m_childGame.destroy();
                this._enterGame.m_childGame = null;
            }
            GameVar.destroy();
            gamelib.chat.ChatPanel.destroy();
            g_gameMain.reshow(jsonData);
            gamelib.chat.RecordSystem.s_instance.destroy();
        }
        public hasChildGame():boolean
        {
            return this._enterGame.m_childGame != null;
        }
        /**
         * 指定分区游戏是否是laya开发
         * @function addGameIdConfig
         * @DateTime 2018-03-17T13:59:13+0800
         * @param    {number}                 gz_id      [description]
         * @param    {number}                 gameId     [description]
         * @param    {boolean}                isLayaGame [description]
         */
        public addGameIdConfig(gz_id:number,gameId:number,isLayaGame:boolean):void
        {
            this._gzIdToGameId[gz_id] = {gameId:gameId,isLayaGame:isLayaGame};
        }
        /**
         * 主要处理0x0014协议
         * data.type == 0 表示进入data.gameId的游戏
         * data.type == 1 表示退出data.gameId的游戏
         * @function
         * @DateTime 2018-03-17T13:59:56+0800
         * @param    {number}                 msgId [description]
         * @param    {any}                    data  [description]
         */
        public reciveNetMsg(msgId: number,data: any): void
        {
            switch(msgId)
            {
                case 0x0014:
                    if(GameVar.urlParam['isChildGame'])        //子游戏不处理
                        return;
                    if(data.type == 0)  //进入
                    {
                        var gz_idA:number = GameVar.gz_id;
                        var gz_idC:number = data.gameId;
                        if(gz_idA == gz_idC)
                        {
                            // g_signal.dispatch('closeEnterGameLoading',0);
                            return;
                        }
                        this._enterGame.enterGame(gz_idC);
                    }
                    else
                    {
                        //退出游戏
                        if(data.result == 1)
                        {
                            return;
                        }
                        if(data.gameId == GameVar.gz_id)
                        {
                            sendNetMsg(0x002D);
                        }
                        if(this._enterGameGz_idByClient != 0)
                        {
                            this._enterGame.enterGame(this._enterGameGz_idByClient,this._validation,this._game_args);
                        }
                    }
                    break;
                case 0x0015:
                    if(data.result == 1)
                    {
                        if(this._enterGameGz_idByClient != undefined && this._enterGameGz_idByClient != 0)
                        {
                            this._enterGame.enterGame(this._enterGameGz_idByClient,this._validation,this._game_args);
                        }
                        else
                        {
                            //this.quitGameStep3(1,GameVar.gz_id);
                        }
                    }
                    else
                    {
                        console.log("数据拷贝失败，不能退出当前游戏")
                    }
                    break;
            }
        }
        /**
         * @method
         * 客服端主动请求进入一个游戏
         * 1、退出当前游戏
         * 2、如果成功，获取gz_id的调用application_login_game获取登陆串;enterGameByClientStep1
         * 3、跳转游戏;enterGameByClientStep2
         *
         * @param validation 棋牌圈 验证码
         * @param game_args 传递参数。{}对象。
         * @param gz_id
         */
        public enterGameByClient(gz_id:number,selfIsMain:boolean = true,validation:string = null,game_args:any = null):void
        {   
            // console.time("enterGame");
            g_signal.dispatch('enterChildGame');         
            this._enterGameGz_idByClient = gz_id;
            this._validation = validation;
            this._game_args = game_args;
            this._selfIsMainGzid = selfIsMain;
            var pid:number = GameVar.pid;
            var tgz_id:number = GameVar.gz_id;
            var self = this;
            this._enterGame.enterGame(gz_id,this._validation,this._game_args);

        }
        /**
         * 进入比赛
         * @function
         * @DateTime 2018-06-07T19:34:15+0800
         */
        public enterMatch(gz_id:number,matchId:number,bSendNetMsg:boolean = true):void
        {
            var obj:any = {
                'matchId':matchId
            }
            if(bSendNetMsg)
                sendNetMsg(0x2708,matchId);
            g_childGame.enterGameByClient(gz_id,true,null,obj);
            g_signal.dispatch("enterMatch",matchId);
        }
        /**
         * 观战
         * @function
         * @DateTime 2018-06-07T19:34:10+0800
         */
        public guanZhan(gz_id:number,matchId:number,deskId:number):void
        {
            g_childGame.enterGameByClient(gz_id,true,null,{gzInfo:{"matchId":matchId,"deskId":deskId}});
            g_signal.dispatch("guanZhan",0);
        }
        /**
         * 清理游戏缓存的登录信息
         * @function
         * @DateTime 2018-06-28T11:40:58+0800
         * @param    {number}                 gz_id [description]
         */
        public clearGameInfo(gz_id:number):void
        {
            this._web.clearGameInfo(gz_id);
        }
        /**
         * 修改指定游戏的缓存信息
         * @function
         * @DateTime 2018-06-28T11:43:37+0800
         * @param    {number}                 gz_id [description]
         * @param    {string}                 att   [description]
         * @param    {string}                 value [description]
         */
        public modifyGameInfo(gz_id:number,att:string,value:string):void
        {
            this._web.modifyGameInfo(gz_id,att,value);
        }
    }



}
