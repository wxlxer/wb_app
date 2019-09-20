/*
* name;
*/
module gamelib.control{

    /**
     * 点击头像后显示自己的玩家信息。包含签名，头像，昵称，id，铜钱，地址等
     * @class MyPersonalInfo
     */
    export class OthersPersonalInfo extends gamelib.core.Ui_NetHandle{

        private _head:Laya.Image;        // 头像
        private _nick:Laya.Label;        // 昵称
        private _ID:Laya.Label;          // id
        private _money:Laya.Label;       // 铜钱
        private _address:Laya.Label;     // 地址
        private _signature:Laya.TextInput; // 个性签名
        private _distance:Laya.Label;
        private _vip:Laya.Image;
        private _level_label:Laya.Label;
        private _exp_bar:Laya.ProgressBar;
        private _exp_label:Laya.Label;
        private _hint:Laya.Label;    // 提示
        private _sex:Laya.Image;

        private _pd:gamelib.data.UserInfo;	// 玩家数据

        private _cd:number;					// 发送互动道具的CD
        private _lastSendTime:number;		// 发送互动的最后时间
        private _vip_txt:Laya.Label;        //vip等级，以文本模式显示
        private _jx:Laya.Image;            //军衔
        private _checkbox_1:Laya.CheckBox;
        constructor(resname:any){
            super(resname);
        }

        // 初始化
        protected init(): void{
            super.init();
            this._checkbox_1 = this._res['checkbox_1'];
            this._head = this._res["img_head"];        // 头像
            this._nick = this._res["txt_name"]         // 昵称
            this._ID = this._res["txt_id"]             // id
            this._money = this._res["txt_money"]       // 铜钱
            this._address = this._res["txt_address"]   // 地址
            this._distance = this._res['txt_distance']
            this._sex = this._res["img_sex"];

            this._signature = this._res["txt_input"];  // 个性签名
            if(this._signature)
            {
                this._signature.editable = false;   // 不是可编辑
                this._signature.mouseEnabled = false;
                this._signature.text = "";
            }

            this._hint = this._res["txt_tips"];    // 提示
            for(var i:number = 1; i <= 6; i++){
                var str:string = "btn_" + i;
                this.addBtnToListener(str);
            }

            this._pd = null;	// 玩家数据

           	this._cd = 1000;							// 发送互动道具的CD
            if(GameVar.g_platformData['cd'])
            {
                if(!isNaN(GameVar.g_platformData['cd'].gift))
                {
                    this._cd = GameVar.g_platformData['cd'].gift;
                }
            }
            this._lastSendTime = -1;
        	this._vip = this._res['img_vip'];  
            this._exp_bar = this._res['bar_exp'];
            this._level_label = this._res['txt_level'];
            this._exp_label = this._res['txt_exp1'];
            this._vip_txt = this._res['txt_vip'];
            this._jx = this._res['img_jx'];

            this._res.mouseThrough = true;
        }

        // 设置玩家数据
        public setPlayerData(pd:gamelib.data.UserInfo){
        	this._pd = pd;

        	if(pd){
        		this.show();
        	}
        }

        public update():void
        {
            if(this._pd == null)
                return;
            this.onShow();
        }
        public updatePlayerData(pd:gamelib.data.UserInfo):void
        {
            if(this._pd == null || pd.m_id!= this._pd.m_id )
                return;            
            this.onShow();
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

	        this._hint = null;    // 提示
        }

        // 显示
        protected onShow(): void{
            super.onShow();
            if(this._checkbox_1)
                this._checkbox_1.selected = false;
            this._head.skin = this._pd.m_headUrl;        // 头像
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
            if(this._ID)
	            this._ID.text = "ID:" + this._pd.m_pId;      // id
            if(this._money)
	            this._money.text = utils.tools.getMoneyByExchangeRate(this._pd.m_money);       // 铜钱
            if(this._address)
	            this._address.text = this._pd.m_address;     // 地址
            if(this._sex)
                this._sex.skin = this._pd.m_sex == 1 ? GameVar.s_namespace + "/window/sex_1.png" : GameVar.s_namespace + "/window/sex_2.png";
            if(this._hint)
            {
                var consume_:any = GameVar.g_platformData["item_price"];
                if(consume_ && consume_["num"])
                {
                    var str:string = consume_["name"];

                    str = getDesByLan("每次消耗") + consume_["num"] + str;
                    this._hint.text = str;        // 提示
                }else{
                    this._hint.visible = false; // 提示                
                }
            }
	        
            if(this._lastSendTime == -1)
                this._lastSendTime = 0;    // 发送互动的最后时间
            // 个性签名
            if(this._signature)
            {
                if(this._pd.m_pId)
                {
                    sendNetMsg(0x2035,1,this._pd.m_pId,"");    
                }
                else
                {
                    this._signature.text = GameVar.g_platformData['aiBankerSign'] || "";
                }
            }    
                
            if(this._distance)
            {
                // var dis:number = this._pd.getDistance(gamelib.data.UserInfo.s_self);
                // if(dis == -1)
                // {
                //     this._distance.text = getDesByLan("距离")+":"+ getDesByLan("未知");
                // }
                // else
                // {
                //     this._distance.text = getDesByLan("距离")+":" + dis;
                // }
            }
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

        	var name_:string = evt.currentTarget.name;

			//1 鲜花 2 番茄 3 鸡蛋 4 干杯 5 鸡 6 狗
			var type:number = parseInt(name_.split("_")[1]);

			playButtonSound();

            if(type){

            	if(Laya.timer.currTimer - this._lastSendTime >= this._cd){
                    var bSendToAll:boolean = this._checkbox_1 ? this._checkbox_1.selected : false;
                    if(!bSendToAll)
            		    sendNetMsg(0x2010, this._pd.m_id, type);
                    else
                        sendNetMsg(0x2010, 0, type);
            		this._lastSendTime = Laya.timer.currTimer;
            		this.close();
            	}
                else
                {
                     g_uiMgr.showTip(getDesByLan("请稍后再发送")+"...",true);
                }
            }

        }

        // 接受协议
        public reciveNetMsg(msgId: number, data: any): void{
            super.reciveNetMsg(msgId,data);
            switch (msgId) {
            	case 0x2035:
                    if(data.msg == ""){
                        this._signature.text = getDesByLan("默认签名");
                    }else{
                        var jsonData:any = JSON.parse(data.msg);

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