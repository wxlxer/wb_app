namespace qpq.data{
    export class PlayerData extends gamelib.data.UserInfo {
        public static s_self:PlayerData;
        private static s_list:any = {};
        public static onData0x0F01(data:any):void {
            PlayerData.s_self = PlayerData.getPlayerData(data.playerId);
            var setOldMoney:boolean = false;
            var money:number,diamond:number;
            if(gamelib.data.UserInfo.s_self)
            {
                setOldMoney = true;
                money = gamelib.data.UserInfo.s_self.m_money;
                diamond = gamelib.data.UserInfo.s_self.m_diamond;
            }
            gamelib.data.UserInfo.s_self = PlayerData.s_self;
            PlayerData.s_self.read0x0F01(data);
            if(setOldMoney)
            {
                PlayerData.s_self.m_money = money;
                PlayerData.s_self.m_diamond = diamond;    
            }
            
        }
        public static getPlayerData(id:number):qpq.data.PlayerData
        {
            var pd:qpq.data.PlayerData = PlayerData.s_list[id];
            if(pd == null)
            {
                pd = new PlayerData();
                pd.m_id = id;
                PlayerData.s_list[id] = pd;
            }
            return pd;
        }
        public m_signaName:string = "";
        public m_zhanNum:number = 0;

        //俱乐部会员信息
        public m_clubVipLevel:number = 0;
        private read0x0F01(data:any):void {
            this.m_name = GameVar.nickName;
            this.m_pId = GameVar.pid;
            this.m_sex = GameVar.sex;
            this.m_headUrl = GameVar.playerHeadUrl;
            this.m_id = data.playerId;
            this.m_level = data.level;
            this.m_money = data.money;
            this.m_nextExp = data.exp_next;
            this.m_currentExp = data.exp;
            this.m_lon = data.lon;
            this.m_lat = data.lat;
            this.m_altitude = data.altitude;
            //this.paseVipDataList(data.honorNum);
        }
       
    }
}
