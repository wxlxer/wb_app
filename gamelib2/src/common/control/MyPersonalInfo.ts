
module gamelib.control{
    /**
     * 点击头像后显示自己的玩家信息。包含签名，头像，昵称，id，铜钱，地址等
     * @class MyPersonalInfo
     */
    export class MyPersonalInfo extends gamelib.core.Ui_NetHandle{

        private _head:Laya.Image;        // 头像
        private _nick:Laya.Label;        // 昵称
        private _ID:Laya.Label;          // id
        private _money:Laya.Label;       // 铜钱
        private _address:Laya.Label;     // 地址
        private _signature:Laya.TextInput; // 个性签名
        private _vip:Laya.Image;
        private _netData:any;    // 玩家个性签名数据
        private _level_label:Laya.Label;
        private _exp_bar:Laya.ProgressBar;
        private _exp_label:Laya.Label;
        private _pd:gamelib.data.UserInfo;    // 玩家数据
        private _sex:Laya.Image;
        private _vip_txt:Laya.Label;        //vip等级，以文本模式显示
        private _jx:Laya.Image;            //军衔


        constructor(resname:any){
            super(resname);
        }

        // 初始化
        protected init(): void{
            super.init();

            this._head = this._res["img_head"];        // 头像
            this._nick = this._res["txt_name"]         // 昵称
            this._ID = this._res["txt_id"]             // id            
            this._address = this._res["txt_address"]   // 地址
            if(this._address == null)
                this._address = this._res["txt_add"]   // 地址
            this._signature = this._res["txt_input"];  // 个性签名
            this._money = this._res["txt_money"]       // 铜钱
            this._sex = this._res['img_sex'];
            this.addBtnToListener("btn_modify");      // 修改
            this.addBtnToListener("btn_shop");        // 商城

            this._netData = null;    // 玩家个性签名数据

            this._pd = null;    // 玩家数据

            if(this._res['btn_shop'] && !utils.tools.isQpqHall())
            {
                if(this._res['btn_shop'] && GameVar.g_platformData['hideShopInRoom'])
                {
                    this._res['btn_shop'].removeSelf();
                }
            }

            this._vip = this._res['img_vip'];  
            this._exp_bar = this._res['bar_exp'];
            this._level_label = this._res['txt_level'];
            this._exp_label = this._res['txt_exp1'];
            this._vip_txt = this._res['txt_vip'];
            this._jx = this._res['img_jx'];
            if(this._signature)
                this._signature.prompt = getDesByLan("默认签名");
        }

        /**
         * 设置玩家数据
         * @function setPlayerData
         * @DateTime 2018-03-17T14:23:04+0800
         * @param    {gamelib.data.UserInfo}  pd [description]
         */
        public setPlayerData(pd:gamelib.data.UserInfo):void
        {
            this._pd = pd;
            if(pd){
                this.show();
            }
        }
        public updatePlayerData(pd:gamelib.data.UserInfo):void
        {
            if(this._pd == null || pd.m_id!= this._pd.m_id )
                return;            
            this.setValues();
        }

        // 销毁
        public destroy(): void{
            super.destroy();

            this._head = null;        // 头像
            this._nick = null;        // 昵称
            this._ID = null;          // id
            this._money = null;       // 铜钱
            this._address = null;     // 地址
            this._signature = null; // 个性签名
        }

        // 显示
        protected onShow(): void{
            super.onShow();
            this.setValues();            
        }
        private setValues():void
        {
            this._head.skin = this._pd.m_headUrl;        // 头像
            // this._nick.text = this._pd.m_name_ex;        // 昵称
            if(this._nick)
            {                
                if(this._nick.width)
                {
                    utils.tools.setLabelDisplayValue(this._nick,this._pd.m_name);
                }
                else
                {
                    this._nick.text = this._pd.m_name_ex;        // 昵称
                }
            }
            this._ID.text = "ID:" + this._pd.m_pId;      // id
            if(this._money)
                this._money.text =  utils.tools.getMoneyByExchangeRate(this._pd.m_money);       // 铜钱
            if(this._address)
                this._address.text = this._pd.m_address;     // 地址

            if(this._signature)
            {
                // 个性签名
                sendNetMsg(0x2035,1,this._pd.m_pId,"");    
                this._signature.mouseEnabled = (this._pd.m_roomId ==  0);

            }    
            if(this._res['btn_modify'])
            {
                this._res['btn_modify'].visible = (this._pd.m_roomId ==  0);
            }    
            if(this._sex)
                this._sex.skin = this._pd.m_sex == 1 ? GameVar.s_namespace + "/window/sex_1.png" : GameVar.s_namespace + "/window/sex_2.png";
            if(this._vip)
            {
                if(window["qpq"]["getVipIcon"])
                    this._vip.skin = window["qpq"]["getVipIcon"](this._pd.vipLevel,true);
                else
                    this._vip.visible = false;
            }
            if(this._exp_label)
            {
                this._exp_label.text = this._pd.m_currentExp +"/"+this._pd.m_nextExp;
            }
            if(this._exp_bar)
            {
                this._exp_bar.value = this._pd.m_nextExp == 0 ? 0:(this._pd.m_currentExp/this._pd.m_nextExp);
            }
             if(this._level_label)
            {
                var qz:string = "lv:";
                if(GameVar.g_platformData['playerInfo_config'])
                {
                    if(GameVar.g_platformData['playerInfo_config']["level_qz"] != null)
                        qz = GameVar.g_platformData['playerInfo_config']["level_qz"];
                }
                this._level_label.text = qz + this._pd.m_level +"";
            }
            if(this._vip_txt)
            {
                this._vip_txt.text = "" + this._pd.vipLevel;
            }
            if(this._jx)
            {
                if(window["qpq"]["getMilitaryRankIcon"])
                    this._jx.skin = window["qpq"]["getMilitaryRankIcon"](this._pd.m_level);
            }
            if(window["qpq"]["setHeadBoxAndNameStyle"])
                window["qpq"]["setHeadBoxAndNameStyle"](this._pd.m_smallGameScore,this._res["img_headK"],this._nick);
        }

        // 关闭
        protected onClose(): void{
            super.onClose();

        }

        protected onClickObjects(evt: laya.events.Event): void{

            playButtonSound();

            switch (evt.target.name) {

                case "btn_modify":    // 修改                    
                    console.log("修改");

                    if(this._netData == null)
                        this._netData = {};
                    this._netData["签名"] = this._signature.text;
                    sendNetMsg(0x2035,0,GameVar.pid,JSON.stringify(this._netData));

                    break;
                
                 case "btn_shop":     // 商城                    
                    console.log("商城");
                    g_uiMgr.openShop();
                    break;
            }
        }

        // 接受协议
        public reciveNetMsg(msgId: number, data: any): void{
            super.reciveNetMsg(msgId,data);

            switch (msgId) {
                case 0x2035:
                    if(data.msg == ""){
                        this._signature.text = getDesByLan("默认签名");;
                        this._netData = null;
                    }else{
                        var jsonData:any = JSON.parse(data.msg);
                        this._netData = jsonData;

                        if(jsonData["签名"]){
                            this._signature.text = jsonData["签名"];
                        }else{
                            this._signature.text = getDesByLan("默认签名");
                        }
                    }
                    
                    break;
            }
        }

    }

}