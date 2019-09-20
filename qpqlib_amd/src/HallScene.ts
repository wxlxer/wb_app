/**
 * Created by wxlan on 2017/9/4.
 */
namespace qpq
{
    export var s_lastShowUi:gamelib.core.BaseUi = null;
    export var s_lastShowData:any = null;
    export var MainUiClass:any = null;
    export var _signalMsgMap:any = {};
    export var _signalUiObjMap:any = {};
    export function registrerSignalHandle(msg:string,handleClass:any,needCreate?:boolean):any
    {
        if(_signalMsgMap[msg])
        {
            console.log("覆盖"+msg+"消息处理方法");            
        }
        _signalMsgMap[msg] = handleClass;
        if(needCreate)
        {
            if(handleClass instanceof Laya.Handler)
            {
                handleClass.runWith(data);
                return handleClass;
            }
            var obj:any = _signalUiObjMap[msg];
            if(obj == null)
            {            
                obj = new handleClass();
                _signalUiObjMap[msg] = obj;
            }    
            return obj;
        }
        return null;
    }
    export function signleHandle(msg,data:any):any
    {        
        var cl:any = _signalMsgMap[msg];
        if(cl == null)
        {
            //console.log("没有注册" + msg +"的处理方法");
            return null;
        }
        if(cl instanceof Laya.Handler)
        {
            cl.runWith(data);
            return cl;
        }
        var obj:any = _signalUiObjMap[msg];
        if(obj == null)
        {            
            obj = new cl();
            _signalUiObjMap[msg] = obj;
        }    
        obj.setData(data);
        obj.show();
        return obj;
    }
    export enum SignalMsg
    {
        showKeypad="showKeypad",
        showCreateUi="showCreateUi",
        showKeypad_Input="showKeypad_Input",
        showTimerPicker="showTimerPicker",
        showTableListUi="showTableListUi",
        showTableInfo="showTableInfo",
        showNoticeUi="showNoticeUi",
        showHuoDongUi="showHuoDongUi",
        showGlodGameUi="showGlodGameUi",
        showSelectedGameUi="showSelectedGameUi",
        showMoreGameUi="showMoreGameUi",
        showEffortUi="showEffortUi",
        showSigninUi="showSigninUi",
        showBankUi="showBankUi",
        showRnaUi="showRnaUi",
        showRankUi="showRankUi",
        showQrcUi="showQrcUi",
        showBindPhoneUi="showBindPhoneUi",
        showTuiGuangUi="showTuiGuangUi",
        showUserInfoUi_Self="showUserInfoUi_Self",
    }
    export class HallScene extends gamelib.core.Scene
    {
        private _ui:gamelib.core.BaseUi;
        private _createUi:gamelib.core.BaseUi;
        public constructor()
        {
            super();

            g_signal.add(this.onSignal,this);            
            registrerSignalHandle(SignalMsg.showKeypad,qpq.hall.KeyPad);
            registrerSignalHandle(SignalMsg.showCreateUi,qpq.creator.CreateUi);
            registrerSignalHandle(SignalMsg.showKeypad_Input,qpq.hall.KeyPad_Input);
            registrerSignalHandle(SignalMsg.showTimerPicker,qpq.hall.TimerPicker);
            registrerSignalHandle(SignalMsg.showTableListUi,qpq.hall.TableList);
            registrerSignalHandle(SignalMsg.showTableInfo,qpq.hall.TableInfo);
            registrerSignalHandle(SignalMsg.showNoticeUi,gamelib.control.NoticeUi);
            registrerSignalHandle(SignalMsg.showHuoDongUi,qpq.hall.HuoDongUi);
            registrerSignalHandle(SignalMsg.showGlodGameUi,qpq.hall.GoldGameUi);
            registrerSignalHandle(SignalMsg.showUserInfoUi_Self,qpq.hall.UserInfoUi);
            registrerSignalHandle(SignalMsg.showSelectedGameUi,qpq.hall.SelectGameUi);
            registrerSignalHandle(SignalMsg.showMoreGameUi,gamelib.common.moregame.MoreGame);
            registrerSignalHandle(SignalMsg.showEffortUi,qpq.hall.EffortUi);
            registrerSignalHandle(SignalMsg.showSigninUi,qpq.hall.SignInUi_s1);
            registrerSignalHandle(SignalMsg.showBankUi,gamelib.common.BankUi);
            registrerSignalHandle(SignalMsg.showRnaUi,qpq.hall.Rna);
            registrerSignalHandle(SignalMsg.showRankUi,qpq.hall.RankUi);
            registrerSignalHandle(SignalMsg.showQrcUi,qpq.hall.QRCUi);
            registrerSignalHandle(SignalMsg.showBindPhoneUi,qpq.hall.BindPhoneUi);
            registrerSignalHandle(SignalMsg.showTuiGuangUi,qpq.hall.TuiGuang);
        }
        public onEnter():void
        {
            super.onEnter();
            g_uiMgr.showMaskLoading();
            this.getMainUi();
            this._ui.show();     

            gamelib.platform.autoShare();
            if(g_qpqData.m_lastGameGroupId > 0)
            {
                g_qpqCommon.requestResult(g_qpqData.m_lastGameGroupId);
            }   
            g_qpqData.checkHuoDong();
            g_qpqData.checkNotice();
           
        }
        /**
         * 服务器连接成功，可以发送协议.
         * @function
         * @DateTime 2018-07-27T12:20:15+0800
         */
        public onReciveNetMsg():void
        {
             sendNetMsg(0x00F2);
             this._ui['onReciveNetMsg']();
             g_uiMgr.closeMaskLoading();
              //退出大厅后显示上一次显示的界面
            if(s_lastShowUi)
            {
                s_lastShowUi.show();
                s_lastShowUi.setData(s_lastShowData);
                s_lastShowUi = null;
            }
        }
        public onExit():void
        {
            super.onExit();
            this._ui.close();
        }
        private onSignal(msg:string,data:any):void
        {
            switch (msg)
            {
                case SignalMsg.showCreateUi:
                    this._createUi = signleHandle(msg,data);
                    break;
                case "closeCreateUi":
                    if(this._createUi)
                        this._createUi.close();
                    break;  
              case SignalMsg.showTableListUi://显示组局列表
                    g_qpqData.new_table = false;                    
                    signleHandle(msg,data);
                    break;
                case SignalMsg.showTuiGuangUi:
                    if(GameVar.isGameVip)
                    {
                        openVipPage();
                    }
                    else
                    {
                        signleHandle(msg,data);   
                    }                    
                    break;
                default:
                    signleHandle(msg,data);
                    break;

            }
        }
        
        private getMainUi():void
        {
            // var type:number =  GameVar.g_platformData['ui_type'];
            // var classObj:any = gamelib.getDefinitionByName('qpq.hall.HallUi' + type);
            // this._ui = this._ui || new classObj();
            this._ui = this._ui || new MainUiClass();
        }
    }

    export function appShare(bTips:boolean,callBack?:Function,thisObj?:any,wx_firendCircle?:boolean)
    {
        if(!utils.tools.isApp() && bTips)
        {
            var temp:gamelib.control.ShareTip_wxUi = new gamelib.control.ShareTip_wxUi();
            temp.setAppData(GameVar.g_platformData.name,GameVar.g_platformData.share_info,GameVar.g_platformData.share_url);
            temp.show();
        }   
        gamelib.platform.shareApp(callBack,thisObj,wx_firendCircle);
    }

    export function enterGameByValidation(validation:string):void
    {
        sendNetMsg(0x00F8,validation);
        // g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("等待加入")+"...",delay:40,alertMsg:getDesByLan("加入失败,请重试")});
    }
    export function enterGameByRoomId(gz_id:number,roomId:number,game_args:any = null ):void
    {
        var args :any = {roomId:roomId};
        if(game_args)
        {
            utils.tools.copyTo(game_args,args);
        }
        g_childGame.enterGameByClient(gz_id,true,null,args);
    }
    export function enterRoom(gz_id:number,rd:any):void
    {
        if(rd.ticket > gamelib.data.UserInfo.s_self.m_money)
        {
            g_uiMgr.showAlertUiByArgs({msg:"您的游戏币,还差"+(rd.ticket - gamelib.data.UserInfo.s_self.m_money) + "才能进入房间哦!"});
            return;
        }
        if(rd.level > gamelib.data.UserInfo.s_self.m_level)
        {
            g_uiMgr.showAlertUiByArgs({msg:"您的等级不足"+rd.level + "级，不能进入房间"});
            return;
        }
        if(rd.vip > gamelib.data.UserInfo.s_self.vipLevel)
        {
            g_uiMgr.showAlertUiByArgs({msg:"您的VIP等级不足"+rd.vip + "级，不能进入房间"});
            return;
        }
        enterGameByRoomId(gz_id,rd.roomId,rd.game_args);
    }
    /**
     * 通过验证码加入比赛
     * @function
     * @DateTime 2018-05-28T17:30:19+0800
     * @param    {string}                 validation [description]
     */
    export function joinMatchByValidation(validation:string):void
    {
        sendNetMsg(0x2704,0,validation);
        g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("加入比赛中")+"...",delay:40,alertMsg:getDesByLan("加入失败,请重试")});
    }
    

    export function openVipPage(ignoreCheckVip:boolean = false):void
    {
        console.log("打开vip后台");
        if(ignoreCheckVip || GameVar.isGameVip)
        {
            var url:string = window['application_agent_url'] ?  window['application_agent_url'] ():"" ;
            if(url == "" || url == null || url == undefined)
                return;
            navigateToURL(url);
        }
        else if(GameVar.g_platformData['vip_introduce_alert'])
        {
            if(GameVar.g_platformData['txt_kf'])
            {
                g_uiMgr.showAlertUiByArgs({msg:GameVar.g_platformData['txt_kf']});
            }
            else
            {
                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请联系您的上级，开通代理权限")});
            }            
        }
        else
        {
            var url:string = "";
            if(window["application_agent_url"])
                url = window["application_agent_url"]();
            if(url == undefined || url == "")
                return;
            navigateToURL(url);
        }
    }
}

