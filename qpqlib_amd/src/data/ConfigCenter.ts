namespace qpq.data{
    /**
     * 所有游戏的配置文件
     */
    export class ConfigCenter
    {
        public creator_default:any;
        private _callBack:Function;
        private _thisArg:any;
        private _params:any[];

        private _loadedGames:number;
        private _gamesToLoad:number;
        private _games:any[];           //所有游戏配置列表
        private _gamesObj:any;
        private _statistics:any[];
        private _statisticsObJ:any;
        public s_cur_config:any;
        private _version:number;
        private _platform_config_url:string;
        private _goldGames:any;       //金币场房间列表
        private _smallGames:any;       //小游戏

        public m_help_file:string;

        public m_platformData:any;
        public init(call:Function,thisArg:any,args:any[]=null):void
        {
            this._callBack = call;
            this._thisArg = thisArg;
            this._params = args;
            this._version = new Date().getTime();    
            var pFileName:string = "";
            if(GameVar.s_app_verify)
                pFileName = GameVar.platform+"_verify.json?ver=" + this._version;
            else
                pFileName = GameVar.platform+".json?ver=" + this._version;
            this._platform_config_url = GameVar.urlParam["ftp"] +"common/" + pFileName;
            Laya.loader.load(this._platform_config_url,Laya.Handler.create(this,this.onPlatformLoaded),null,laya.net.Loader.JSON);
            console.log("url:" + this._platform_config_url)            
        }
        private onPlatformLoaded(bSuccess:boolean):void {
             if(!bSuccess)
            {
                var str:string = GameVar.platform;
                if(GameVar.s_app_verify)
                    str += "_verify.json";
                window.alert("没有找到平台配置！平台:" + str);
                // g_uiMgr.showAlertUiByArgs({msg:"没有找到平台配置！平台:" + GameVar.platform});
            }
            else
            {
                console.log("平台配置载入完成!0");
                var data:any = Laya.loader.getRes(this._platform_config_url);
                this.m_platformData = data;
                Laya.loader.clearRes(this._platform_config_url);
                console.log("平台配置载入完成!1");
                this._games = data.games;
                this._goldGames = data.goldGames;
                this._smallGames = data.smallgame;
                this._gamesObj = {};
                this._loadedGames = 0;
                this._gamesToLoad = this._games.length;
                var platform_config:gamelib.data.PlatformConfigs = GameVar.g_platformData;
                 console.log("平台配置载入完成!2");
                if(data.general)
                {
                    for(var key in data.general)
                    {
                        platform_config[key] = data.general[key];
                    }                    
                    if(data.general.bgm)
                    {
                        g_qpqData.m_bgms = data.general.bgm;
                    }
                    else
                    {
                        g_qpqData.m_bgms = ["BGM_back","BGM"];
                    }                     
                }
                if(GameVar.g_platformData['lans'])  //语言资源载入完成前的配置
                {
                    s_lanConif = GameVar.g_platformData['lans'];
                }

                console.log("平台配置载入完成!3");
                var arr:Array<any> = [];
                for(var i:number = 0; i < this._games.length; i++)
                {
                    if(this._games[i].isGold)   //金币场
                    {
                        continue;
                    }
                    if(!this.initGamesConfig(this._games[i]))
                        continue;
                    var url:string = GameVar.urlParam["ftp"] +"common/"  + this._games[i].config_id+".json?ver="+ this._version;
                    arr.push({
                        url:url,
                        type:laya.net.Loader.JSON
                    });
                }
                if(this._goldGames)
                {
                    for(var i:number = 0; i < this._goldGames.length; i++)
                    {
                        var config:any = this._goldGames[i];
                        if(!this.initGamesConfig(config))
                            continue;
                        var games:Array<any> = config.games;
                        if(games)
                        {
                            for(var con of games)
                            {
                                this.initGamesConfig(con);  
                            }
                        }
                        
                    }
                }
                if(this._smallGames)
                {
                    for(var config of this._smallGames)
                    {
                        this.initGamesConfig(config);  
                    }
                }
                console.log("平台配置载入完成!4");
                if(arr.length != 0)
                    Laya.loader.load(arr,Laya.Handler.create(this,this.onGameLoaded));
                else
                    this.onGameLoaded(true);
            }
             console.log("平台配置载入完成!5");
        }
        private initGamesConfig(config:any):boolean
        {
            // if(Boolean(config.isWait) == true)
            //     return false;
            var key:string = config.key;
            if(key == undefined)
                key = config.game_code;
            var game_zone_info = getGame_zone_info(key)
            if(game_zone_info == null)
                return false;
            game_zone_info.game_code = config.game_code;

            config.gz_id = game_zone_info.gz_id;
            config.game_id = game_zone_info.gameid;
            g_childGame.addGameIdConfig(config.gz_id,config.game_id,true);   
            return true; 
        }
        private onGameLoaded(bSuccess:boolean):void
        {
             console.log("onGameLoaded!0" + bSuccess);
            if(!bSuccess)
            {
                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("没有找到游戏配置") + "！"});
            }
            else
            {
                console.log("onGameLoaded!1");
                for(var i:number = 0; i < this._games.length; i++)
                {
                    var game:any = this._games[i];
                    var url:string = GameVar.common_ftp + game.config_id + ".json?ver=" + this._version;
                    var data:any = Laya.loader.getRes(url);
                    if(!data) {
                        console.log("游戏名称不匹配："+this._games[i].name);
                        data = this._games[i];
                    }
                    for(var key in game) {
                        data[key] = game[key];
                    }
                    this._games[i] = data;
                    this._gamesObj[data.config_id] = data;
                    Laya.loader.clearRes(url);
                }
                console.log("onGameLoaded!2");
            }
            this.onAllLoaded();
        }
        private onAllLoaded():void
        {
            console.log("onAllLoaded!1");
            // return;
            this._callBack.apply(this._thisArg,this._params);
            this.creator_default = this._games[0];
        }

        /**
         * 设置焦点游戏config_id，设置后可直接调用焦点游戏配置s_cur_config（仅当选择的游戏在game_lf配置中时有效）
         * */
        public set config_id(value:number) {
            this.s_cur_config = this.getGameByConfigId(value);
        }
        /**
         * 收到玩家组局习惯后更新游戏顺序
         * */
        public onUpdateOrder():void
        {
            if(GameVar.g_platformData['noHabitRecord'])
                return;
            var habits:any[] = qpq.g_qpqData.m_habitRecord;
            if(habits && habits.length) {
                for(var i:number = 0;i < this._games.length; i++) {
                    this._games[i].index = qpq.g_qpqData.habit_store_max;
                }

                // for(var i:number = 0;i < habits.length; i++) {
                for(var i:number = habits.length - 1;i >=0 ; i--) {
                    var gz_id:number = habits[i].gz_id;
                    var mode_id:number = habits[i].mode_id;
                    var data = this.getConfigByGzIdAndModeId(gz_id,mode_id);
                    if(data)
                    {
                        data.index = i;
                    } else 
                    {
                        habits.splice(i,1);
                        console.log("no game of gz_id:"+gz_id+" mode_id:"+mode_id);
                    }
                }
                this._games.sort(this.sortGame);
            }
        }
        private sortGame(a:any,b:any):number {
            return a.index-b.index;
        }
        /**
         * 所有游戏配置列表
         * */
        public get game_configs():any[] {
            return this._games;
        }
        public get goldGames():any
        {
            return this._goldGames;
        }
        public get smallGames():any
        {
            return this._smallGames;
        }
        public getStatistics(id:number):any {
            return this._statisticsObJ[id];
        }
        /**
         * 根据configId获取游戏配置
         * */
        public getGameByConfigId(configId:number):any {
            return this._gamesObj[configId];
        }
        public getConfigByGameCode(game_code:string,bInGoldGame:boolean = false):any
        {
            if(!bInGoldGame)
            {
                for(var temp of this._games)
                {
                    if(temp.game_code == game_code)
                        return temp;
                }
            }
            

            if(qpq.g_configCenter.goldGames)
            {
                for(var config of qpq.g_configCenter.goldGames)
                {
                    if(config.game_code == game_code)
                    {
                        return config;
                    }
                }
            }
            return null;
        }
        public getConfigByGzIdAndModeId(gz_id:number,modeId:number):any {
            modeId = modeId%100;
            var prefer:any;
            for(var i:number = 0;i < this._games.length; i++) {
                if(this._games[i].gz_id == gz_id) {
                    if(this._games[i].mode_id == modeId) {
                        return this._games[i];
                    } else {
                        prefer = this._games[i];
                    }
                }
            }
            return prefer;
        }
        public getConfigByGzId(gz_id:number):any {
            var prefer:any;
            for(var i:number = 0;i < this._games.length; i++) {
                if(this._games[i].gz_id == gz_id)
                {
                    prefer = this._games[i];
                }
            }
            if(qpq.g_configCenter.goldGames)
            {
                for(var config of qpq.g_configCenter.goldGames)
                {
                    if(config.gz_id == gz_id)
                    {
                        prefer = config;
                    }
                }
            }
            return prefer;
        }
        /** 通过enter_index获得配置文件
         */
        public getConfigByIndex(enter_index:number):any
        {
            for(var config of qpq.g_configCenter.game_configs)
            {
                if(config.enter_index == enter_index)
                    return config;
            }
            if(qpq.g_configCenter.goldGames)
            {
                for(var config of qpq.g_configCenter.goldGames)
                {
                    if(config.enter_index == enter_index)
                        return config;
                }
            }
           
            return null;
        }
        /**
         * 通过enter_index获得金币游戏的配置文件
         * @param  {number} enter_index [description]
         * @return {any}                [description]
         */
        public getConfigInGoldGamesByIndex(enter_index:number):any
        {
            if(qpq.g_configCenter.goldGames)
            {
                for(var config of qpq.g_configCenter.goldGames)
                {
                    if(config.enter_index == enter_index)
                        return config;
                }
            }           
            return null;
        }

        /**
         * 根据game_id和mode_id来获取游戏config
         * */
        public getConfigGM(gameId:number,modeId:number):number {
            modeId = modeId%100;
            for(var i:number = 0;i < this._games.length; i++) {
                if(this._games[i].game_id == gameId && this._games[i].mode_id == modeId) {
                    return this._games[i];
                }
            }
        }
        private onStatisticsLoaded(data:any):void {
            this._statistics = data.games;
            this._statisticsObJ = {};
            for(var i:number = 0;i < this._statistics.length; i++) {
                this._statisticsObJ[this._statistics[i].id] = this._statistics[i];
            }
        }
    }
}
