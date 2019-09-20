namespace qpq.hall
{
	export class BaseHall extends gamelib.core.Ui_NetHandle
	{		
		protected _commonBtn:qpq.HallCommonBtns;
        protected _ani_out:Laya.FrameAnimation;
        protected _ani_in:Laya.FrameAnimation;
        private _currentAni:Laya.FrameAnimation;
        protected _houdong_box:Laya.Box;

        private _uiClassMap:any;
        protected _bFirstLoginDayLogic:boolean;
        // private _uiObjMap:any;
		constructor(url?:string)
		{
            url = url || "qpq/Art_Hall";
			super(url);
             this._bFirstLoginDayLogic = false;
		}
        /**
         * 如果点击按钮需要打开其他界面，或者调用方法,可以在这里处理
         * 需要修改默认的处理方法，也可以通过这里处理
         * @function
         * @DateTime 2019-01-10T15:35:59+0800
         * @param    {string}                 btn       [description]
         * @param    {string}                    signalMsg [description]
         * @param    {class|Laya.Handler}                    handle    [description]
         */
        protected registrerBtnHandle(signalMsg:string,btn?:string,handle?:any,needCreate?:boolean):any
        {
            this._uiClassMap = this._uiClassMap || {};
            if(btn == null && handle == null)
            {
                console.log("按钮的名字和处理方法不能同时为null");
                return;
            }
            var obj:any
            if(handle != null)
            {
                obj = qpq.registrerSignalHandle(signalMsg,handle,needCreate);   
            }
            if(btn == null)
                return obj;
            this._commonBtn.removeBtn(btn);
            if(this._uiClassMap[btn])
            {
                console.log("已经注册过按钮的点击回掉");
                return obj;
            }
            this._uiClassMap[btn] = signalMsg;
            this.addBtnToListener(btn);
            return obj;
        }
        public onReciveNetMsg():void
        {
            sendNetMsg(0x2217,1);       //签到
            sendNetMsg(0x2217,2);       //
        }
		protected init():void
        {
            this._commonBtn = new qpq.HallCommonBtns(this._res);
            this._res["img_head"].skin = GameVar.playerHeadUrl;
            // this._res["txt_name"].text = utils.StringUtility.getNameEx(GameVar.nickName,7);
            utils.tools.setLabelDisplayValue(this._res["txt_name"],GameVar.nickName);
            this._res["txt_id"].text = "ID:" + GameVar.pid;
            this._ani_out =          this._res["ani1"];
            this._ani_in =          this._res["ani1_0"];
            g_uiMgr.m_pmd.setRes(this._res["img_pmd"]);
            this.addBtnToListener("btn_roomlist");
            this.addBtnToListener("btn_zhanji");
            this.addBtnToListener("huodong");
            this.addBtnToListener("img_head");
            this.addBtnToListener("b_share");
            this.addBtnToListener("btn_gonggao");
            this.addBtnToListener("btn_huodong");
            this.addBtnToListener("btn_share");

            if(this._res["txt_money"])
            {
                this._res["txt_money"].text = "";
            }

            if(this._res["txt_diamond"])
            {
                this._res["txt_diamond"].text = "";
            }
        }

        protected onShow():void
        {
            super.onShow();
            if(this._commonBtn)
            {
                this._commonBtn.show();            
                this._commonBtn.update();    
            }            
            this.updateHuoDongIcon();
            this.updateNewIcons();
            this.showCallBoard();
            g_signal.add(this.onLocalSignal,this);
            this.updateMoney();
            gamelib.platform.autoShare();
        }
        protected onClose():void
        {
            super.onClose();
            if(this._commonBtn)
            {
                this._commonBtn.close();
            }
            g_signal.remove(this.onLocalSignal,this);
        }
        
        /**
         * 显示公告板
         */
        protected showCallBoard():void
        {
            if(g_qpqData.notice_config == null || this._res["txt_gonggao"] == null)
                return;
            this._res["b_l"].visible = g_qpqData.notice_config.visible;
            var txt:laya.ui.TextArea = this._res["txt_gonggao"];
            txt.text = g_qpqData.notice_config.txt;
            txt.mouseEnabled = false;
            txt.editable = false;
        }

        protected updateHuoDongIcon():void
        {
        	if(this._res["b_hongdong"] == null)
        		return;
            if(qpq.g_qpqData.huodong_list.length == 0)
            {
                this._res["b_hongdong"].removeSelf();
            }
            else
            {
                this._res["b_hongdong"].visible =  true;
            }
            if(this._res["b_share"])
            	this._res["b_share"].visible = false;		//活动分享按钮
        }
        protected checkOpen(id:number):boolean
        {
            var gi:any = g_configCenter.getConfigByIndex(id);
            if(gi == null)
                return this.checkOpenInGoldGame(id);
            if(this.checkOpenByPid())
            {
                return true;
            }
            if(gi.isWait)
            {  
                if(GameVar.common_ftp.indexOf('.dev.') != -1)
                {
                   return true;
                }
                else
                {
                  g_uiMgr.showAlertUiByArgs({msg:getDesByLan("游戏即将开放")});
                }
                return false;
            }
            return true;
        }
        protected checkOpenInGoldGame(id:number):boolean
        {
            if(this.checkOpenByPid())
            {
                return true;
            }

            var gi:any = g_configCenter.getConfigInGoldGamesByIndex(id);
            if(gi.isWait)
            {  
                if(GameVar.common_ftp.indexOf('open.dev.8z') != -1)
                {
                   return true;
                }
                else
                {
                  g_uiMgr.showAlertUiByArgs({msg:"游戏没开放"});
                }
                return false;
            }
            return true;
        }
        protected checkOpenByPid():boolean
        {
            if(GameVar.g_platformData['testId'])
            {
                var str:string = GameVar.g_platformData['testId'];
                if(str.indexOf(GameVar.pid+"") != -1)
                    return true
            }
            return false;
        }
        protected onLocalSignal(msg:string,data:any):void
        {
            switch(msg)
            {
                case gamelib.GameMsg.UPDATEUSERINFODATA:
                    this._res["img_head"].skin = GameVar.playerHeadUrl;
                    // this._res["txt_name"].text = utils.StringUtility.getNameEx(GameVar.nickName,7);
                    utils.tools.setLabelDisplayValue(this._res["txt_name"],GameVar.nickName);
                    this._res["txt_id"].text = "ID:" + GameVar.pid;
                    break;
                 case "updateHuoDongData":
                    this.updateHuoDongIcon();
                    g_uiMgr.showPMD(g_qpqData.pmd_config.txt);
                    break;
                case "onDailogClose":
                    if(utils.tools.is(data,"gamelib.alert.AlertUi"))
                        return;
                    if(this._ani_in && this._ani_in != this._currentAni)
                    {
                        this._ani_in.play(0,false);
                        this._currentAni = this._ani_in;
                    }
                        
                    break;
                case "onDailogOpen":
                    if(utils.tools.is(data,"gamelib.alert.AlertUi"))
                        return;
                    if(this._ani_out && this._ani_out != this._currentAni)
                    {
                        this._ani_out.play(0,false);
                        this._currentAni = this._ani_out;
                    }    
                    break;
                                  
            }
        }
        protected updateNewIcons(data:any = null):void
        {
            if(this._res["newIcon_shop"])
                this._res["newIcon_shop"].visible = false;
            if(this._res["newIcon_zhanji"])
            	this._res["newIcon_zhanji"].visible = false;
            if(this._res["newIcon_roomlist"])
            	this._res["newIcon_roomlist"].visible = qpq.g_qpqData.new_table;
            if(data == null)
                return;
            switch(data.type)
            {
                case 1:        //签到
                    if(this._res["newIcon_qianDao"])
                        this._res["newIcon_qianDao"].visible = data.num > 0;
                    break;
                case 2:        //邮件
                    if(this._res['newIcon_mail'])
                        this._res["newIcon_mail"].visible = data.num > 0;
                    break;    
            }
        }
       
        public reciveNetMsg(msgId:number,data:any):void
        {
            switch (msgId)
            {
                case 0x002D:
                case 0x0036:
                    this.updateMoney();
                    break;
               case 0x00F2:
               case 0x00F4:
               case 0x2033:
                    this.updateNewIcons();
                    break;    
                case 0x0040:
                   this.showCallBoard();
                   if(g_net_configData.getConfig('firstLogin') == undefined)
                   {
                       this.onFirstLogin();
                       g_net_configData.addConfig('firstLogin',false);
                       g_net_configData.saveConfig();
                   }
                   if(!this._bFirstLoginDayLogic && g_net_configData.m_bFirstLoginDay)                   
                   {
                       this._bFirstLoginDayLogic = true;
                       this.onFirstLoginDay();
                   }
                   break;  
                case 0x2217:
                    this.updateNewIcons(data);
                    break;      
            }
        }
        /**
         * 第一次登录游戏、需要做的处理。每个游戏自己实现
         */
        protected onFirstLogin():void
        {
            
        }
        /**
         * 每天第一次登录
         */
        protected onFirstLoginDay():void
        {
            
        }
        protected updateMoney():void
        {
            if(qpq.data.PlayerData.s_self == null)
                return;
        	if(this._res["txt_money"])
        	{
        		this._res["txt_diamond"].text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
            	this._res["txt_money"].text = qpq.data.PlayerData.s_self.getMoneyDes();	
        	}
        	else
        	{   
        		this._res["txt_diamond"].text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
        	}
        }
        protected onClickObjects(evt:laya.events.Event):void
        {
            playButtonSound();
            evt.stopPropagation();
            console.log("basehall onClickObjects" + evt.currentTarget.name);
            switch(evt.currentTarget.name)
            {
                case "btn_roomlist"://房间列表
                    g_signal.dispatch(SignalMsg.showTableListUi,0);
                    this.updateNewIcons();                 
                    break;
                case "btn_zhanji":   //战绩
                    g_signal.dispatch("showZhanjiUi",0);                    
                    break;
                case "btn_huodong":
                case "huodong" :
                case "b_share":
                    g_signal.dispatch(SignalMsg.showHuoDongUi,0);
                    if(g_commonFuncs)
                    {
                        g_commonFuncs.eventTongJi("homepage",'活动');
                    }
                    break;
                 case "img_head":
                    g_signal.dispatch(SignalMsg.showUserInfoUi_Self,0);
                    break;
                 case "btn_share":
                    if(GameVar.g_platformData['share_friend'])
                 	    appShare(true,null,null,true);
                    else
                        appShare(true);
                 	break;
                 case "btn_gonggao"	:
                 	 g_signal.dispatch(SignalMsg.showNoticeUi,qpq.g_qpqData.day_notice_config);
                 	break;

                default://创建房间
                    this.onBtnHandle(evt.currentTarget.name,0);
                    break;
            }
        }
        protected onBtnHandle(btn:string,data:any):void
        {
           if(this._uiClassMap == null)
                return;
            var signalMsg:string = this._uiClassMap[btn];
            if(signalMsg == null)
                return;
            g_signal.dispatch(signalMsg,data);
        }
	}
}