/**
 * Created by wxlan on 2017/9/4.
 */
namespace gamelib.data
{
    /**
     * 网络配置数据，包括音乐音效的开关，新手引导的开关.各种需要保存在服务器的配置
     * 不要实例化次类。调用请使用g_net_configData
     * @class NetConfigDatas
     */
    export class NetConfigDatas
    {

        public m_waitConfig:boolean = true;
        public m_bFirstLoginDay:boolean = false;//当天是否是第一次登录
        /**
         * 保存配置。
         * @function addConfig
         * @DateTime 2018-03-17T14:49:58+0800
         * @param    {string}                 key   保存和读取的键。
         * @param    {any}                    value [description]
         */
        public addConfig(key:string,value:any):void
        {            
            this[key] = value;
            try
            {
                if(key == "sound")
                {                    
                    g_soundMgr.m_sound = value != 0;                    
                }
                else if(key == "music")
                {
                    //在播放后马上暂停会报错
                    if(Laya.timer.currTimer - g_soundMgr.m_lastBgmPlayTime <= 500)
                    {
                        Laya.timer.once(500,this,this.addConfig,[key,value]);
                    }
                    else
                    {
                        g_soundMgr.m_music = value != 0;
                    }

                }
            }
            catch (e)
            {

            }

        }
        public getConfig(key:string):any
        {
            return this[key];
        }
        /**
         * 通过类型来获取配置
         * @function getConfigByType
         * @DateTime 2018-03-17T14:50:51+0800
         * @param    {number}  type  0：sound,1:music,2:sub_sound,方言,3:guide
         * @return   {any}   [description]
         */
        public getConfigByType(type:number):any
        {
            var key:string = this.getKey(type);
            return this.getConfig(key);
        }
        /**
         * 通过类型来保存配置
         * @function addConfigByType
         * @DateTime 2018-03-17T14:51:42+0800
         * @param    {number}  type  type  0：sound,1:music,2:sub_sound,方言,3:guide
         * @param    {any}                 value [description]
         */
        public addConfigByType(type:number,value):void
        {
            var key:string = this.getKey(type);
            this.addConfig(key,value);
        }
        private getKey(type:number):string
        {
            var key:string = "key" + type;
            switch (type)
            {
                case 0:
                    key = "sound";
                    break;
                case 1:
                    key = "music";
                    break;
                case 2:
                    key = "sub_sound";
                    break;
                case 3:
                    key = "guide";
                    break;    
            }
            return key;
        }
        /**
         * 向服务器发包，保存当前的配置
         * @function saveConfig
         * @DateTime 2018-03-17T14:52:17+0800
         */
        public saveConfig():void
        {
           // sendNetMsg(0x003F,JSON.stringify(this));
            sendNetMsg(0x0040,JSON.stringify(this));
            if(utils.tools.isWxgame()){
                window['wx'].setStorage({
                    key:"config",
                    data:JSON.stringify(this)
                })    
            }
        }
        /**
         * 解析网络配置数据
         * @function getNetConfog
         * @DateTime 2018-03-17T14:52:42+0800
         * @param    {any}                    data [description]
         */
        public getNetConfog(data:any):void
        {        
            // if(g_soundMgr.m_waitConfig)
            // {
            //     g_soundMgr.m_waitConfig = false;
            // }
            // this.m_waitConfig = false;    
            // try
            // {
            //     var temp = JSON.parse(data.config);
            //     for(var key in temp)
            //     {
            //         this.addConfig(key,temp[key]);
            //     }
            // }
            // catch(e)
            // {
            //     this.addConfig("sound",1);
            //     this.addConfig("music",1);
            // }

            if(g_soundMgr.m_waitConfig)
            {
                g_soundMgr.m_waitConfig = false;
            }
            this.m_waitConfig = false;    
            
            try
            {
                var temp = JSON.parse(data.config);
                for(var key in temp)
                {
                    this.addConfig(key,temp[key]);
                }
            }
            catch(e)
            {
                this.addConfig("sound",1);
                this.addConfig("music",1);
                
            }
            this.m_bFirstLoginDay = false;
            var time:number = this.getConfig("lastLoginTime");
            if(GameVar.s_loginSeverTime != time)
            {
                this.addConfig("lastLoginTime",GameVar.s_loginSeverTime);
                this.saveConfig();
                if(isNaN(time))
                {
                    this.m_bFirstLoginDay = true;
                    return ;
                }
                var date1:Date = new Date(GameVar.s_loginSeverTime * 1000);
                var date2:Date = new Date(time * 1000);
                this.m_bFirstLoginDay = date1.getDate() != date2.getDate();
                console.log("是不是新的一天：当前日期" + date1.toDateString() +"   上一期登录日期 " + date2.toDateString())         
            } 
        }
    }
}
