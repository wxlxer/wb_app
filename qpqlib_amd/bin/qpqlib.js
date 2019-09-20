var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by wxlan on 2017/9/4.
 */
var qpq;
(function (qpq) {
    qpq.g_qpqData = null;
    qpq.g_configCenter = null;
    var GameManager = /** @class */ (function (_super) {
        __extends(GameManager, _super);
        function GameManager() {
            var _this = _super.call(this) || this;
            if (GameVar.g_platformData['hall_show_time'] == 0 || GameVar.g_platformData['hall_show_time'] == undefined) {
                Laya.timer.once(100, _this, _this.onEnterHall);
            }
            return _this;
        }
        Object.defineProperty(GameManager.prototype, "m_hall", {
            get: function () {
                return this._hall;
            },
            enumerable: true,
            configurable: true
        });
        GameManager.prototype.reciveNetMsg = function (msgId, data) {
            _super.prototype.reciveNetMsg.call(this, msgId, data);
            switch (msgId) {
                case 0x0003:
                    // g_qpqData.checkHuoDong();
                    break;
                case 0x0040:
                    qpq.g_qpqData.checkNotice();
                    qpq.g_qpqData.checkHuoDong();
                    break;
                //case 0x0089:
                //    s_hall.updateMine(data);
                //    break;
                case 0x00E1: //评价总体信息
                    //s_hall.updateMyEs(data);
                    break;
                case 0x00F1:
                    if (data.result != 1) {
                        g_signal.dispatch("closeQpqLoadingUi", 0);
                        switch (data.result) {
                            case 2:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("创建局数超过上限") + "!" });
                                break;
                            case 8:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("创建数据失败") + "!" });
                                break;
                            case 13:
                                if (GameVar.g_platformData.gold_name_zj)
                                    g_uiMgr.showAlertUiByArgs({ msg: GameVar.g_platformData.gold_name_zj + getDesByLan("不足") + "!" });
                                else
                                    g_uiMgr.showAlertUiByArgs({ msg: GameVar.g_platformData.gold_name + getDesByLan("不足") + "!" });
                                break;
                            case 14:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("无效的局数") + "!" });
                                break;
                            case 15:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("无效的玩法") + "!" });
                                break;
                            case 16:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("无效的俱乐部ID") + "!" });
                                break;
                            case 17:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("玩家俱乐部权限不足") + "!" });
                                break;
                            case 18:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("需要好友才能加入") + "!" });
                                break;
                            case 19:
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("超过最大创建数") + "!" });
                                break;
                        }
                    }
                    break;
                case 0x00F2:
                    var old = qpq.g_qpqData.m_groupList;
                    qpq.g_qpqData.m_groupList = data.groupNum;
                    for (var i = qpq.g_qpqData.m_groupList.length - 1; i >= 0; i--) {
                        if (!qpq.g_configCenter.getConfigByGzIdAndModeId(qpq.g_qpqData.m_groupList[i].gz_id, qpq.g_qpqData.m_groupList[i].gameMode)) {
                            qpq.g_qpqData.m_groupList.splice(i, 1);
                        }
                    }
                    if (old == null)
                        qpq.g_qpqData.new_table = qpq.g_qpqData.m_groupList.length != 0;
                    else
                        qpq.g_qpqData.new_table = old.length != qpq.g_qpqData.m_groupList.length && qpq.g_qpqData.m_groupList.length != 0;
                    break;
                case 0x00F3:
                    this._toGzId = { gz_id: data.gz_id, gameMode: data.gameMode };
                    qpq.g_qpqData.onGetGroupInfo(data);
                    break;
                case 0x00F4:
                    g_signal.dispatch("closeQpqLoadingUi", 0);
                    if (data.result == 0) {
                        g_uiMgr.showAlertUiByArgs({ "msg": getDesByLan("游戏创建失败!请联系工作人员") });
                        return;
                    }
                    if (data.result == 5) {
                        g_uiMgr.showAlertUiByArgs({ "msg": getDesByLan("创建牌桌数据失败!") });
                        return;
                    }
                    if (data.result != 1) {
                        g_uiMgr.showAlertUiByArgs({ "msg": getDesByLan("创建失败!" + data.result) });
                        return;
                    }
                    var groupInfo = qpq.g_qpqData.getGroupInfoByGroupId(data.groupId);
                    groupInfo.validation = data.validation;
                    qpq.g_qpqData.new_table = true;
                    if (GameVar.g_platformData.autoEnterGame) {
                        this.enterChildGame(groupInfo.gz_id, data.validation);
                    }
                    else {
                        g_uiMgr.showConfirmUiByArgs({
                            msg: getDesByLan("房间创建成功，是否进入游戏") + "？",
                            callBack: function (type) {
                                if (type == 0) //进入子游戏
                                 {
                                    this.enterChildGame(groupInfo.gz_id, data.validation);
                                    return;
                                }
                            },
                            thisObj: this,
                            okLabel: getDesByLan("进入游戏"),
                            cancelLabel: getDesByLan("取消")
                        });
                    }
                    playSound_qipai("news");
                    break;
                case 0x00F6:
                    qpq.g_qpqData.onHandleGroup(data);
                    g_signal.dispatch("closeQpqLoadingUi", 0);
                    break;
                case 0x00F7:
                    qpq.g_qpqData.m_bigSaleList = data.games;
                    break;
                case 0x00F8: //申请进入组局牌桌
                    if (data.result == 1 || data.result == 2) {
                        g_signal.dispatch("closeQpqLoadingUi", 0);
                        this.enterChildGame(data.gz_id, data.validation);
                    }
                    else {
                        playSound_qipai("warn");
                        g_signal.dispatch("closeQpqLoadingUi", 0);
                    }
                    break;
                case 0x0F01:
                    qpq.data.PlayerData.onData0x0F01(data);
                    if (GameVar.g_platformData['hall_show_time'] == 0 || GameVar.g_platformData['hall_show_time'] == undefined) {
                        _super.prototype.onEnterHall.call(this);
                    }
                    else {
                        if (this._hall == null)
                            this.onEnterHall();
                    }
                    this._hall.onReciveNetMsg();
                    qpq.g_qpqData.requestHabitData();
                    break;
                case 0x0F08:
                    qpq.g_qpqData.parseHabitData(data);
                    qpq.g_configCenter.onUpdateOrder();
                    break;
                case 0x2033:
                    qpq.g_qpqData.m_siginData = data;
                    break;
                case 0x2704:
                    g_uiMgr.closeMiniLoading();
                    switch (data.result) {
                        case 1:
                            g_uiMgr.showTip(getDesByLan("报名成功"));
                            break;
                        case 2:
                            // g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:报名已结束")});
                            break;
                        case 3:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:报名被拒绝") });
                            break;
                        case 4:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:报名费用不足") });
                            break;
                        case 5:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:比赛不存在") });
                            break;
                        case 6:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:已加入其他比赛") });
                            break;
                        case 7:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:已经加入该比赛") });
                            break;
                        case 8:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:正在等待审核") });
                            break;
                        case 9:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("报名失败:报名次数不足") });
                            break;
                        case 12:
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("比赛已经结束") });
                            break;
                    }
                    break;
                case 0x2707:
                    g_uiMgr.closeMiniLoading();
                    switch (data.result) {
                        case 1:
                            g_uiMgr.showTip(getDesByLan("创建成功"));
                            break;
                        case 3:
                            g_uiMgr.showTip(getDesByLan("创建失败,报名人数限制和时间限制不能同时为0"));
                            break;
                        case 4:
                            g_uiMgr.showTip(getDesByLan("创建失败,最多只能选择同一种限制"));
                            break;
                        case 7:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的游戏id"));
                            break;
                        case 8:
                            g_uiMgr.showTip(getDesByLan("创建失败,创建数据失败"));
                            break;
                        case 13:
                            g_uiMgr.showTip(getDesByLan("创建失败," + GameVar.g_platformData.gold_name + "不足"));
                            break;
                        case 14:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的局数"));
                            break;
                        case 15:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的游戏玩法"));
                            break;
                        case 100:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的玩家pid"));
                            break;
                        case 106:
                            g_uiMgr.showTip(getDesByLan("创建失败,正在其他游戏中"));
                            break;
                    }
                    break;
                case 0x2708:
                    if (data.result == 1) {
                        // g_uiMgr.showTip(getDesByLan("比赛开始了"));
                        g_childGame.enterMatch(data.gz_id, data.id, false);
                        this._hall.onExit();
                    }
                    break;
                case 0x270A:
                    switch (data.result) {
                        case 1:
                            g_uiMgr.showTip(getDesByLan("退出比赛成功"));
                            break;
                        case 2:
                            g_uiMgr.showTip(getDesByLan("没找到该比赛"));
                            break;
                        case 3:
                            g_uiMgr.showTip(getDesByLan("不能退出未加入的比赛"));
                            break;
                        case 4:
                            g_uiMgr.showTip(getDesByLan("比赛状态错误"));
                            break;
                        case 5:
                            g_uiMgr.showTip(getDesByLan("玩家状态错误"));
                            break;
                        case 6:
                            g_uiMgr.showTip(getDesByLan("玩家尚未报名"));
                            break;
                    }
                    break;
            }
        };
        GameManager.prototype.onEnterHall = function () {
            this._hall = this._hall || new qpq.HallScene();
            this._hall.onEnter();
            g_loading.close();
        };
        GameManager.prototype.enterChildGame = function (gz_id, validation) {
            g_signal.dispatch("closeCreateUi");
            var groupInfo = qpq.g_qpqData.getGroupInfoByGz_id(gz_id, validation);
            GameVar.g_platformData["groupInfo"] = groupInfo;
            g_childGame.enterGameByClient(gz_id, true, validation);
        };
        return GameManager;
    }(gamelib.core.GameDataManager));
    qpq.GameManager = GameManager;
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/9/4.
 */
var qpq;
(function (qpq) {
    qpq.s_lastShowUi = null;
    qpq.s_lastShowData = null;
    qpq.MainUiClass = null;
    qpq._signalMsgMap = {};
    qpq._signalUiObjMap = {};
    function registrerSignalHandle(msg, handleClass, needCreate) {
        if (qpq._signalMsgMap[msg]) {
            console.log("覆盖" + msg + "消息处理方法");
        }
        qpq._signalMsgMap[msg] = handleClass;
        if (needCreate) {
            if (handleClass instanceof Laya.Handler) {
                handleClass.runWith(qpq.data);
                return handleClass;
            }
            var obj = qpq._signalUiObjMap[msg];
            if (obj == null) {
                obj = new handleClass();
                qpq._signalUiObjMap[msg] = obj;
            }
            return obj;
        }
        return null;
    }
    qpq.registrerSignalHandle = registrerSignalHandle;
    function signleHandle(msg, data) {
        var cl = qpq._signalMsgMap[msg];
        if (cl == null) {
            //console.log("没有注册" + msg +"的处理方法");
            return null;
        }
        if (cl instanceof Laya.Handler) {
            cl.runWith(data);
            return cl;
        }
        var obj = qpq._signalUiObjMap[msg];
        if (obj == null) {
            obj = new cl();
            qpq._signalUiObjMap[msg] = obj;
        }
        obj.setData(data);
        obj.show();
        return obj;
    }
    qpq.signleHandle = signleHandle;
    var SignalMsg;
    (function (SignalMsg) {
        SignalMsg["showKeypad"] = "showKeypad";
        SignalMsg["showCreateUi"] = "showCreateUi";
        SignalMsg["showKeypad_Input"] = "showKeypad_Input";
        SignalMsg["showTimerPicker"] = "showTimerPicker";
        SignalMsg["showTableListUi"] = "showTableListUi";
        SignalMsg["showTableInfo"] = "showTableInfo";
        SignalMsg["showNoticeUi"] = "showNoticeUi";
        SignalMsg["showHuoDongUi"] = "showHuoDongUi";
        SignalMsg["showGlodGameUi"] = "showGlodGameUi";
        SignalMsg["showSelectedGameUi"] = "showSelectedGameUi";
        SignalMsg["showMoreGameUi"] = "showMoreGameUi";
        SignalMsg["showEffortUi"] = "showEffortUi";
        SignalMsg["showSigninUi"] = "showSigninUi";
        SignalMsg["showBankUi"] = "showBankUi";
        SignalMsg["showRnaUi"] = "showRnaUi";
        SignalMsg["showRankUi"] = "showRankUi";
        SignalMsg["showQrcUi"] = "showQrcUi";
        SignalMsg["showBindPhoneUi"] = "showBindPhoneUi";
        SignalMsg["showTuiGuangUi"] = "showTuiGuangUi";
        SignalMsg["showUserInfoUi_Self"] = "showUserInfoUi_Self";
    })(SignalMsg = qpq.SignalMsg || (qpq.SignalMsg = {}));
    var HallScene = /** @class */ (function (_super) {
        __extends(HallScene, _super);
        function HallScene() {
            var _this = _super.call(this) || this;
            g_signal.add(_this.onSignal, _this);
            registrerSignalHandle(SignalMsg.showKeypad, qpq.hall.KeyPad);
            registrerSignalHandle(SignalMsg.showCreateUi, qpq.creator.CreateUi);
            registrerSignalHandle(SignalMsg.showKeypad_Input, qpq.hall.KeyPad_Input);
            registrerSignalHandle(SignalMsg.showTimerPicker, qpq.hall.TimerPicker);
            registrerSignalHandle(SignalMsg.showTableListUi, qpq.hall.TableList);
            registrerSignalHandle(SignalMsg.showTableInfo, qpq.hall.TableInfo);
            registrerSignalHandle(SignalMsg.showNoticeUi, gamelib.control.NoticeUi);
            registrerSignalHandle(SignalMsg.showHuoDongUi, qpq.hall.HuoDongUi);
            registrerSignalHandle(SignalMsg.showGlodGameUi, qpq.hall.GoldGameUi);
            registrerSignalHandle(SignalMsg.showUserInfoUi_Self, qpq.hall.UserInfoUi);
            registrerSignalHandle(SignalMsg.showSelectedGameUi, qpq.hall.SelectGameUi);
            registrerSignalHandle(SignalMsg.showMoreGameUi, gamelib.common.moregame.MoreGame);
            registrerSignalHandle(SignalMsg.showEffortUi, qpq.hall.EffortUi);
            registrerSignalHandle(SignalMsg.showSigninUi, qpq.hall.SignInUi_s1);
            registrerSignalHandle(SignalMsg.showBankUi, gamelib.common.BankUi);
            registrerSignalHandle(SignalMsg.showRnaUi, qpq.hall.Rna);
            registrerSignalHandle(SignalMsg.showRankUi, qpq.hall.RankUi);
            registrerSignalHandle(SignalMsg.showQrcUi, qpq.hall.QRCUi);
            registrerSignalHandle(SignalMsg.showBindPhoneUi, qpq.hall.BindPhoneUi);
            registrerSignalHandle(SignalMsg.showTuiGuangUi, qpq.hall.TuiGuang);
            return _this;
        }
        HallScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);
            g_uiMgr.showMaskLoading();
            this.getMainUi();
            this._ui.show();
            gamelib.platform.autoShare();
            if (qpq.g_qpqData.m_lastGameGroupId > 0) {
                g_qpqCommon.requestResult(qpq.g_qpqData.m_lastGameGroupId);
            }
            qpq.g_qpqData.checkHuoDong();
            qpq.g_qpqData.checkNotice();
        };
        /**
         * 服务器连接成功，可以发送协议.
         * @function
         * @DateTime 2018-07-27T12:20:15+0800
         */
        HallScene.prototype.onReciveNetMsg = function () {
            sendNetMsg(0x00F2);
            this._ui['onReciveNetMsg']();
            g_uiMgr.closeMaskLoading();
            //退出大厅后显示上一次显示的界面
            if (qpq.s_lastShowUi) {
                qpq.s_lastShowUi.show();
                qpq.s_lastShowUi.setData(qpq.s_lastShowData);
                qpq.s_lastShowUi = null;
            }
        };
        HallScene.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
            this._ui.close();
        };
        HallScene.prototype.onSignal = function (msg, data) {
            switch (msg) {
                case SignalMsg.showCreateUi:
                    this._createUi = signleHandle(msg, data);
                    break;
                case "closeCreateUi":
                    if (this._createUi)
                        this._createUi.close();
                    break;
                case SignalMsg.showTableListUi: //显示组局列表
                    qpq.g_qpqData.new_table = false;
                    signleHandle(msg, data);
                    break;
                case SignalMsg.showTuiGuangUi:
                    if (GameVar.isGameVip) {
                        openVipPage();
                    }
                    else {
                        signleHandle(msg, data);
                    }
                    break;
                default:
                    signleHandle(msg, data);
                    break;
            }
        };
        HallScene.prototype.getMainUi = function () {
            // var type:number =  GameVar.g_platformData['ui_type'];
            // var classObj:any = gamelib.getDefinitionByName('qpq.hall.HallUi' + type);
            // this._ui = this._ui || new classObj();
            this._ui = this._ui || new qpq.MainUiClass();
        };
        return HallScene;
    }(gamelib.core.Scene));
    qpq.HallScene = HallScene;
    function appShare(bTips, callBack, thisObj, wx_firendCircle) {
        if (!utils.tools.isApp() && bTips) {
            var temp = new gamelib.control.ShareTip_wxUi();
            temp.setAppData(GameVar.g_platformData.name, GameVar.g_platformData.share_info, GameVar.g_platformData.share_url);
            temp.show();
        }
        gamelib.platform.shareApp(callBack, thisObj, wx_firendCircle);
    }
    qpq.appShare = appShare;
    function enterGameByValidation(validation) {
        sendNetMsg(0x00F8, validation);
        // g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("等待加入")+"...",delay:40,alertMsg:getDesByLan("加入失败,请重试")});
    }
    qpq.enterGameByValidation = enterGameByValidation;
    function enterGameByRoomId(gz_id, roomId, game_args) {
        if (game_args === void 0) { game_args = null; }
        var args = { roomId: roomId };
        if (game_args) {
            utils.tools.copyTo(game_args, args);
        }
        g_childGame.enterGameByClient(gz_id, true, null, args);
    }
    qpq.enterGameByRoomId = enterGameByRoomId;
    function enterRoom(gz_id, rd) {
        if (rd.ticket > gamelib.data.UserInfo.s_self.m_money) {
            g_uiMgr.showAlertUiByArgs({ msg: "您的游戏币,还差" + (rd.ticket - gamelib.data.UserInfo.s_self.m_money) + "才能进入房间哦!" });
            return;
        }
        if (rd.level > gamelib.data.UserInfo.s_self.m_level) {
            g_uiMgr.showAlertUiByArgs({ msg: "您的等级不足" + rd.level + "级，不能进入房间" });
            return;
        }
        if (rd.vip > gamelib.data.UserInfo.s_self.vipLevel) {
            g_uiMgr.showAlertUiByArgs({ msg: "您的VIP等级不足" + rd.vip + "级，不能进入房间" });
            return;
        }
        enterGameByRoomId(gz_id, rd.roomId, rd.game_args);
    }
    qpq.enterRoom = enterRoom;
    /**
     * 通过验证码加入比赛
     * @function
     * @DateTime 2018-05-28T17:30:19+0800
     * @param    {string}                 validation [description]
     */
    function joinMatchByValidation(validation) {
        sendNetMsg(0x2704, 0, validation);
        g_signal.dispatch("showQpqLoadingUi", { msg: getDesByLan("加入比赛中") + "...", delay: 40, alertMsg: getDesByLan("加入失败,请重试") });
    }
    qpq.joinMatchByValidation = joinMatchByValidation;
    function openVipPage(ignoreCheckVip) {
        if (ignoreCheckVip === void 0) { ignoreCheckVip = false; }
        console.log("打开vip后台");
        if (ignoreCheckVip || GameVar.isGameVip) {
            var url = window['application_agent_url'] ? window['application_agent_url']() : "";
            if (url == "" || url == null || url == undefined)
                return;
            navigateToURL(url);
        }
        else if (GameVar.g_platformData['vip_introduce_alert']) {
            if (GameVar.g_platformData['txt_kf']) {
                g_uiMgr.showAlertUiByArgs({ msg: GameVar.g_platformData['txt_kf'] });
            }
            else {
                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请联系您的上级，开通代理权限") });
            }
        }
        else {
            var url = "";
            if (window["application_agent_url"])
                url = window["application_agent_url"]();
            if (url == undefined || url == "")
                return;
            navigateToURL(url);
        }
    }
    qpq.openVipPage = openVipPage;
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var CreateUi = /** @class */ (function (_super) {
            __extends(CreateUi, _super);
            function CreateUi() {
                var _this = _super.call(this, "qpq/Art_CreateUi_Custom_1") || this;
                _this._isFree = false;
                return _this;
            }
            CreateUi.prototype.init = function () {
                this.addBtnToListener("btn_shop");
                if (this._res["btn_roomList"])
                    this.addBtnToListener("btn_roomList");
                this.addBtnToListener("btn_creat");
                var box = this._res["b_area"];
                this._page = new creator.parser.Page(box.height);
                box.addChild(this._page);
                var area = this._res["img_area"];
                var arr = [2, 3, 4, 5, 6];
                creator.parser.g_groupWidth = area.parent['width'];
                creator.parser.g_groupStartX = area.x;
                area.removeSelf();
                creator.parser.g_posList = {};
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var num = arr_1[_i];
                    var poss = [];
                    var grap = area.width / num;
                    for (var i = 0; i < num; i++) {
                        poss.push(area.x + i * grap);
                    }
                    creator.parser.g_posList[num] = poss;
                }
                this._noticeOther = true;
                if (this._res["btn_shop"])
                    this._res["btn_shop"].visible = GameVar.g_platformData['show_shop'];
                if (this._res['txt_name'])
                    this._res['txt_name'].text = "";
                if (this._res['img_diamond']) {
                    if (GameVar.g_platformData["gold_res_name"]) {
                        this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
                    }
                }
                if (this._res["txt_xh"])
                    this._res["txt_xh"].text = "";
            };
            CreateUi.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x00F4) {
                    this._res["btn_creat"].mouseEnabled = true;
                    this.updateMoney();
                    this.setNewGame(qpq.g_qpqData.new_table);
                }
                else if (msgId == 0x00F1) {
                    this._res["btn_creat"].mouseEnabled = true;
                }
            };
            CreateUi.prototype.onLocalSignal = function (msg, data) {
                switch (msg) {
                    case creator.parser.evt_UpdateRoundCost:
                        this._consume = data;
                        this.updateConsume(this._consume);
                        break;
                }
            };
            CreateUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_shop":
                        g_signal.dispatch("showShopUi", 0);
                        this._noticeOther = false;
                        this.close();
                        this._noticeOther = true;
                        break;
                    case "btn_roomList":
                        g_signal.dispatch(qpq.SignalMsg.showTableListUi, 0);
                        this._noticeOther = false;
                        this.close();
                        this._noticeOther = true;
                        break;
                    case "btn_creat":
                        this.onCreate(evt);
                        break;
                }
            };
            CreateUi.prototype.onCreate = function (evt) {
                if (this._page.getConfig().isWait) {
                    g_uiMgr.showAlertUiByArgs({ "msg": "即将开放" });
                    return;
                }
                var money = qpq.data.PlayerData.s_self.getGold_num(true);
                if (isNaN(this._consume))
                    this._consume = 0;
                if (money >= this._consume || this._isFree) {
                    evt.currentTarget.mouseEnabled = false;
                    sendNetMsg(0x00F1, JSON.stringify(this._page.netData));
                    playButtonSound();
                    g_signal.dispatch("showQpqLoadingUi", { msg: getDesByLan("创建牌局中") + "..." });
                    qpq.g_qpqData.onCreateGame(this._page.netData);
                }
                else {
                    if (GameVar.g_platformData['create_tip'])
                        g_uiMgr.showAlertUiByArgs(GameVar.g_platformData['create_tip']);
                    else
                        g_uiMgr.showAlertUiByArgs({ "msg": GameVar.g_platformData.gold_name_zj + getDesByLan("不够") + "!" });
                    playSound_qipai("warn");
                }
            };
            CreateUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_signal.add(this.onLocalSignal, this);
                var config = qpq.g_configCenter.creator_default;
                if (this._res['txt_name'])
                    this._res['txt_name'].text = config.name;
                //    this.gameName = creator_default.name;
                this._page.setConfig(config);
                this._page.show();
                if (this._res["img_xianmian"]) {
                    var temp = qpq.g_qpqData.getSaleConfig(config.game_id, config.mode_id);
                    if (temp && qpq.g_qpqData.checkValid(temp)) {
                        this._res["img_xianmian"].visible = this._res["z"].visible = true;
                        this._isFree = true;
                    }
                    else {
                        this._res["img_xianmian"].visible = this._res["img_line"].visible = false;
                        this._isFree = false;
                    }
                }
                this.updateMoney();
                this.setNewGame(qpq.g_qpqData.new_table);
                this._res["btn_creat"].mouseEnabled = true;
            };
            CreateUi.prototype.updateMoney = function () {
                var money = qpq.data.PlayerData.s_self.getGold_num(true);
                this._res["txt_diamond"].text = utils.tools.getMoneyDes(money);
            };
            CreateUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._page.close();
                g_signal.remove(this.onLocalSignal);
                playSound_qipai("close");
            };
            CreateUi.prototype.setNewGame = function (value) {
                if (this._res["newIcon_roomlist"])
                    this._res["newIcon_roomlist"].visible = value;
            };
            CreateUi.prototype.updateConsume = function (cur) {
                if (this._res["txt_xh"]) {
                    this._res["txt_xh"].text = getDesByLan("每次消耗") + cur + GameVar.g_platformData.gold_name_zj;
                    if (cur == 0 || isNaN(cur)) {
                        this._res["txt_xh"].visible = false;
                    }
                    else {
                        this._res["txt_xh"].visible = true;
                    }
                }
            };
            return CreateUi;
        }(gamelib.core.Ui_NetHandle));
        creator.CreateUi = CreateUi;
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var CreateUi_Change = /** @class */ (function (_super) {
            __extends(CreateUi_Change, _super);
            function CreateUi_Change() {
                var _this = _super.call(this, "qpq/Art_CreateUi0") || this;
                _this._isFree = false;
                return _this;
            }
            CreateUi_Change.prototype.init = function () {
                this._game_btn = getChildByName(this._res['tab_1'], 'item0');
                this._res['tab_1'].selectedIndex = 0;
                var box = this._res["b_area"];
                this._page = new creator.parser.Page(box.height);
                box.addChild(this._page);
                var area = this._res["img_area"];
                var arr = [2, 3, 4, 5];
                area.removeSelf();
                creator.parser.g_posList = {};
                for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                    var num = arr_2[_i];
                    var poss = [];
                    var grap = area.width / num;
                    for (var i = 0; i < num; i++) {
                        poss.push(area.x + i * grap);
                    }
                    creator.parser.g_posList[num] = poss;
                }
                creator.parser.g_groupWidth = area.parent['width'];
                creator.parser.g_groupStartX = area.x;
                this._noticeOther = true;
                this.addBtnToListener("btn_shop");
                this.addBtnToListener("btn_roomList");
                this.addBtnToListener("btn_creat");
                this.addBtnToListener("btn_change");
                this._res['txt_name'].text = "";
                if (this._res["btn_shop"])
                    this._res["btn_shop"].visible = GameVar.g_platformData['show_shop'];
                if (this._res['img_diamond']) {
                    if (GameVar.g_platformData["gold_res_name"]) {
                        this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
                    }
                }
            };
            CreateUi_Change.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x00F4) {
                    this._res["btn_creat"].mouseEnabled = true;
                    this.updateMoney();
                    this.setNewGame(qpq.g_qpqData.new_table);
                }
                else if (msgId == 0x00F1) {
                    this._res["btn_creat"].mouseEnabled = true;
                }
            };
            CreateUi_Change.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_signal.add(this.onLocalSignal, this);
                this.updateMoney();
                this.setNewGame(qpq.g_qpqData.new_table);
                this._res["btn_creat"].mouseEnabled = true;
                var config = qpq.g_configCenter.creator_default;
                this._game_btn.label = config.name;
                if (this._res['img_jisu']) {
                    this._res['img_jisu'].visible = (config.isLaya == "true" || config.isLaya == true);
                }
                this._page.close();
                this._page.setConfig(config);
                this._page.show();
                var temp = qpq.g_qpqData.getSaleConfig(config.game_id, config.mode_id);
                this._res['img_xianmian'].visible = this._res['img_line'].visible = this._res['img_1'].visible = (temp && qpq.g_qpqData.checkValid(temp));
            };
            CreateUi_Change.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._page.close();
                g_signal.remove(this.onLocalSignal);
                playSound_qipai("close");
            };
            CreateUi_Change.prototype.onLocalSignal = function (msg, data) {
                switch (msg) {
                    case creator.parser.evt_UpdateRoundCost:
                        this._consume = data;
                        this.updateConsume(this._consume);
                        break;
                }
            };
            CreateUi_Change.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_shop":
                        g_signal.dispatch("showShopUi", 0);
                        this.closeSelf();
                        break;
                    case "btn_roomList":
                        g_signal.dispatch(qpq.SignalMsg.showTableListUi, 0);
                        this.closeSelf();
                        break;
                    case "btn_creat":
                        var money = qpq.data.PlayerData.s_self.getGold_num(true);
                        if (isNaN(this._consume))
                            this._consume = 0;
                        if (money >= this._consume || this._isFree) {
                            evt.currentTarget.mouseEnabled = false;
                            sendNetMsg(0x00F1, JSON.stringify(this._page.netData));
                            playButtonSound();
                            g_signal.dispatch("showQpqLoadingUi", { msg: getDesByLan("创建牌局中") + "..." });
                            qpq.g_qpqData.onCreateGame(this._page.netData);
                        }
                        else {
                            g_uiMgr.showAlertUiByArgs({ "msg": GameVar.g_platformData.gold_name_zj + getDesByLan("不够") + "!" });
                            playSound_qipai("warn");
                        }
                        break;
                    case 'btn_change':
                        g_signal.dispatch('showSelectedGameUi', 0);
                        this.closeSelf();
                        break;
                }
            };
            CreateUi_Change.prototype.updateMoney = function () {
                var money = qpq.data.PlayerData.s_self.getGold_num(true);
                this._res["txt_diamond"].text = money + "";
            };
            CreateUi_Change.prototype.closeSelf = function () {
                this._noticeOther = false;
                this.close();
                this._noticeOther = true;
            };
            CreateUi_Change.prototype.setNewGame = function (value) {
                this._res["newIcon_roomlist"].visible = value;
            };
            CreateUi_Change.prototype.updateConsume = function (cur) {
                this._res["txt_xh"].text = getDesByLan("每次消耗") + cur + GameVar.g_platformData.gold_name_zj;
            };
            return CreateUi_Change;
        }(gamelib.core.Ui_NetHandle));
        creator.CreateUi_Change = CreateUi_Change;
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var CreateUi_Tab = /** @class */ (function (_super) {
            __extends(CreateUi_Tab, _super);
            function CreateUi_Tab(res) {
                if (res === void 0) { res = "qpq/Art_CreateUi"; }
                var _this = _super.call(this, res) || this;
                _this._isFree = false;
                return _this;
            }
            CreateUi_Tab.prototype.init = function () {
                this.addBtnToListener("btn_shop");
                this.addBtnToListener("btn_roomList");
                this.addBtnToListener("btn_creat");
                var box = this._res["b_area"];
                this._page = new creator.parser.Page(box.height);
                box.addChild(this._page);
                var area = this._res["img_area"];
                var arr = [2, 3, 4, 5];
                creator.parser.g_posList = {};
                for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
                    var num = arr_3[_i];
                    var poss = [];
                    var grap = area.width / num;
                    for (var i = 0; i < num; i++) {
                        poss.push(area.x + i * grap);
                    }
                    creator.parser.g_posList[num] = poss;
                }
                creator.parser.g_groupWidth = area.parent['width'];
                creator.parser.g_groupStartX = area.x;
                area.removeSelf();
                this._noticeOther = true;
                this._tab = this._res["tab_1"];
                this._games = [];
                for (var _a = 0, _b = qpq.g_configCenter.game_configs; _a < _b.length; _a++) {
                    var tgame = _b[_a];
                    // if(tgame.isWait)
                    //  {  
                    //      if(GameVar.common_ftp.indexOf('open.dev.8z') == -1)
                    //      {
                    //          continue;
                    //      }
                    //  }
                    this._games.push(tgame);
                }
                this._marklist = [];
                var len = this._tab.numChildren;
                for (var i = len - 1; i >= 0; i--) {
                    if (i >= this._games.length) {
                        this._tab.removeChildAt(i);
                        this._res["img_" + (i + 1)].removeSelf();
                        continue;
                    }
                    //this._tab.getChildAt(i)["label"] = this._games[i].name;
                    if (this._res["img_" + (i + 1)])
                        this._marklist.unshift(this._res["img_" + (i + 1)]);
                }
                if (this._res["btn_shop"])
                    this._res["btn_shop"].visible = GameVar.g_platformData['show_shop'];
                if (this._res['img_diamond']) {
                    if (GameVar.g_platformData["gold_res_name"]) {
                        this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
                    }
                }
            };
            CreateUi_Tab.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x00F4) {
                    this._res["btn_creat"].mouseEnabled = true;
                    this.updateMoney();
                    this.setNewGame(qpq.g_qpqData.new_table);
                }
                else if (msgId == 0x00F1) {
                    this._res["btn_creat"].mouseEnabled = true;
                }
            };
            CreateUi_Tab.prototype.onLocalSignal = function (msg, data) {
                switch (msg) {
                    case creator.parser.evt_UpdateRoundCost:
                        this._consume = data;
                        this.updateConsume(this._consume);
                        break;
                }
            };
            CreateUi_Tab.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_shop":
                        g_signal.dispatch("showShopUi", 0);
                        this._noticeOther = false;
                        this.close();
                        this._noticeOther = true;
                        break;
                    case "btn_roomList":
                        g_signal.dispatch(qpq.SignalMsg.showTableListUi, 0);
                        this._noticeOther = false;
                        this.close();
                        this._noticeOther = true;
                        break;
                    case "btn_creat":
                        if (this._page.getConfig().isWait && GameVar.common_ftp.indexOf('.dev.') == -1) {
                            g_uiMgr.showAlertUiByArgs({ "msg": "即将开放" });
                            return;
                        }
                        var money = qpq.data.PlayerData.s_self.getGold_num(true);
                        if (isNaN(this._consume))
                            this._consume = 0;
                        if (money >= this._consume || this._isFree) {
                            evt.currentTarget.mouseEnabled = false;
                            sendNetMsg(0x00F1, JSON.stringify(this._page.netData));
                            playButtonSound();
                            g_signal.dispatch("showQpqLoadingUi", { msg: getDesByLan("创建牌局中") + "..." });
                            qpq.g_qpqData.onCreateGame(this._page.netData);
                        }
                        else {
                            g_uiMgr.showAlertUiByArgs({ "msg": GameVar.g_platformData.gold_name_zj + getDesByLan("不够") + "!" });
                            playSound_qipai("warn");
                        }
                        break;
                }
            };
            CreateUi_Tab.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_signal.add(this.onLocalSignal, this);
                this._tab.on(laya.events.Event.CHANGE, this, this.onTabChange);
                this.updateMoney();
                this.updateTabBigSale();
                this.setNewGame(qpq.g_qpqData.new_table);
                this._res["btn_creat"].mouseEnabled = true;
                if (this._res['txt_name'])
                    this._res['txt_name'].text = "";
                this.setDatauletGame();
            };
            CreateUi_Tab.prototype.setDatauletGame = function () {
                var lastGameIndex = 0;
                if (qpq.g_configCenter.creator_default) {
                    for (var i = 0; i < this._games.length; i++) {
                        if (this._games[i]['enter_index'] == qpq.g_configCenter.creator_default['enter_index']) {
                            lastGameIndex = i;
                            break;
                        }
                    }
                    qpq.g_configCenter.creator_default = null;
                }
                //    else if(g_qpqData.m_habitRecord)
                //    {
                //       var lastGame = g_qpqData.m_habitRecord[0];
                //       if(lastGame && lastGame.game_id == 14)
                //       {
                //           for(var i:number = 0; i < this._games.length ;i++)
                //           {
                //               if(this._games[i].mode_id == lastGame.mode_id)
                //                   lastGameIndex = i;
                //           }
                //       }
                //    }
                this._tab.selectedIndex = lastGameIndex;
                this.onTabChange();
            };
            CreateUi_Tab.prototype.updateMoney = function () {
                var money = qpq.data.PlayerData.s_self.getGold_num(true);
                this._res["txt_diamond"].text = money + "";
            };
            CreateUi_Tab.prototype.updateTabBigSale = function () {
                for (var i = 0; i < this._marklist.length; i++) {
                    if (i >= this._games.length) {
                        this._marklist[i].visible = false;
                    }
                    else {
                        var temp = qpq.g_qpqData.getSaleConfig(this._games[i].game_id, this._games[i].mode_id);
                        this._marklist[i].visible = (temp && qpq.g_qpqData.checkValid(temp));
                    }
                }
            };
            CreateUi_Tab.prototype.updateBigSale = function () {
                if (this._marklist[this._tab.selectedIndex])
                    this._res["img_line"].visible = this._res["img_xianmian"].visible = this._marklist[this._tab.selectedIndex].visible;
                else
                    this._res["img_line"].visible = this._res["img_xianmian"].visible = false;
            };
            CreateUi_Tab.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._page.close();
                g_signal.remove(this.onLocalSignal);
                playSound_qipai("close");
                this._tab.off(laya.events.Event.CHANGE, this, this.onTabChange);
            };
            CreateUi_Tab.prototype.onTabChange = function (evt) {
                var index = this._tab.selectedIndex;
                this._currentGame = this._games[index];
                this.showGame();
            };
            CreateUi_Tab.prototype.showGame = function () {
                this._page.close();
                this._page.setConfig(this._currentGame);
                this._page.show();
                this.updateBigSale();
            };
            CreateUi_Tab.prototype.setNewGame = function (value) {
                if (this._res["newIcon_roomlist"])
                    this._res["newIcon_roomlist"].visible = value;
            };
            CreateUi_Tab.prototype.updateConsume = function (cur) {
                if (this._res["txt_xh"])
                    this._res["txt_xh"].text = getDesByLan("每次消耗") + cur + GameVar.g_platformData.gold_name_zj;
            };
            return CreateUi_Tab;
        }(gamelib.core.Ui_NetHandle));
        creator.CreateUi_Tab = CreateUi_Tab;
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/8.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            parser.g_groupWidth = 0;
            parser.g_groupStartX = 0;
            parser.groupHeight = 50;
            parser.rowHeight = 50;
            parser.side_label_style_default = {
                "textColor": "#C1E2FE",
                "height": 30,
                "size": 17.5,
                "verticalAlign": "bottom",
                "name": "side_label"
            };
            parser.colors = {
                "title": "#694121",
                "button": "#694121",
                "label": "#ca3e08"
            };
            parser.sizes = {
                "font_size": 24,
                "title_size": 24
            };
            parser.evt_ItemClick = "evt_ItemClick";
            parser.evt_UpdateRoundCost = "evt_UpdateRoundCost";
            var Group = /** @class */ (function (_super) {
                __extends(Group, _super);
                function Group(config) {
                    var _this = _super.call(this) || this;
                    _this._config = config;
                    if (_this._config.bgSkin) {
                        _this.createBackGround();
                    }
                    if (_this._config.title) {
                        _this._title = new laya.display.Text();
                        _this.addChild(_this._title);
                        _this._title.fontSize = parser.sizes.title_size;
                        _this._title.color = parser.colors.title;
                        _this._title.text = _this._config.title ? _this._config.title : "";
                        _this._title.y = (parser.groupHeight - _this._title.height) / 2;
                        _this._title.x = 42;
                    }
                    _this._items = [];
                    _this.name = _this._config.name;
                    _this._type = _this._config.type;
                    _this.build();
                    return _this;
                }
                Group.prototype.setDefaultValue = function () {
                };
                /**
                 * 设置数据值，仅用于应用用户习惯
                 **/
                Group.prototype.setValue = function (node_name, value) {
                };
                Group.prototype.toControl = function (node_name, value) {
                    var controls = this._config.toControl;
                    if (controls == null)
                        return;
                    for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
                        var item = controls_1[_i];
                        if (item.relate_value == value) {
                            var others = true;
                            if (item.others != null && item.others.length != 0) {
                                others = false;
                                for (var _a = 0, _b = item.others; _a < _b.length; _a++) {
                                    var temp = _b[_a];
                                    var other_name = temp.name;
                                    var node = this.m_page.getNodeByName(other_name);
                                    if (node && node.value == temp.value)
                                        others = true;
                                }
                            }
                            if (!others)
                                continue;
                            for (var key in item) {
                                this[key] = item[key];
                            }
                        }
                    }
                };
                Object.defineProperty(Group.prototype, "enabled", {
                    set: function (value) {
                        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            item.enabled = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Group.prototype, "value", {
                    get: function () {
                        return 0;
                    },
                    set: function (args) {
                        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            item.value = args;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Group.prototype, "label", {
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Group.prototype.build = function () {
                    var node;
                    for (var i = 0; i < this._config.items.length; i++) {
                        var config = this._config.items[i];
                        config.parent_config = this._config;
                        node = parser.getNode(config);
                        if (config.name == null) {
                            config.name = this._config.name;
                        }
                        config.valueIndex = i;
                        node.setConfig(config);
                        this.addChild(node);
                        this._items.push(node);
                    }
                    this.timer.callLater(this, this.updateBgSize);
                };
                Group.prototype.updateBgSize = function () {
                    if (this._bg) {
                        var rec = this.getBounds();
                        this._bg.height = rec.height;
                    }
                };
                Group.prototype.getConfig = function () {
                    return this._config;
                };
                Group.prototype.getNodes = function () {
                    return this._items;
                };
                Group.prototype.show = function () {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var temp = _a[_i];
                        temp.on(laya.events.Event.CLICK, this, this.onItemChange);
                    }
                    this.setDefaultValue();
                };
                Group.prototype.close = function () {
                    //  this._currentClickItem = null;
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var temp = _a[_i];
                        temp.selected = false;
                        temp.off(laya.events.Event.CLICK, this, this.onItemChange);
                    }
                };
                Group.prototype.destroy = function () {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var temp = _a[_i];
                        temp.destroy();
                    }
                    this._items.length = 0;
                    this._items = null;
                    this.m_page = null;
                };
                Object.defineProperty(Group.prototype, "type", {
                    get: function () {
                        return this._type;
                    },
                    enumerable: true,
                    configurable: true
                });
                Group.prototype.hasChild = function (name) {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.name == name)
                            return true;
                    }
                    return false;
                };
                Group.prototype.getChild = function (name) {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.name == name)
                            return node;
                    }
                    return null;
                };
                Group.prototype.onItemChange = function (evt) {
                    this._currentClickItem = evt.currentTarget;
                    playButtonSound();
                    this.onValueChange();
                };
                Group.prototype.onValueChange = function () {
                    parser.g_evtDispatcher.dispatch(parser.evt_ItemClick, this._currentClickItem.config);
                };
                Group.prototype.createBackGround = function () {
                    var bg = new Laya.Image();
                    bg.width = parser.g_groupWidth;
                    bg.skin = this._config.bgSkin;
                    bg.sizeGrid = "9,9,9,9";
                    this.addChild(bg);
                    this._bg = bg;
                };
                return Group;
            }(laya.display.Sprite));
            parser.Group = Group;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
///<reference path="Group.ts" />
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var AttributeGroup = /** @class */ (function (_super) {
                __extends(AttributeGroup, _super);
                function AttributeGroup(config) {
                    return _super.call(this, config) || this;
                }
                AttributeGroup.prototype.setValue = function (node_name, value) {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.name == node_name) {
                            node.value = value;
                        }
                    }
                };
                return AttributeGroup;
            }(parser.Group));
            parser.AttributeGroup = AttributeGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/8.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            /**
             * 单选框
             */
            var ChooserGroup = /** @class */ (function (_super) {
                __extends(ChooserGroup, _super);
                function ChooserGroup(config) {
                    var _this = _super.call(this, config) || this;
                    //这里执行，只会选中默认配置中的值，toControl是不会执行的
                    _this.setDefaultValue();
                    return _this;
                }
                ChooserGroup.prototype.toControl = function (node_name, value) {
                    _super.prototype.toControl.call(this, node_name, value);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        var config = node.config;
                        var arr = config.toControl;
                        if (arr == null)
                            continue;
                        for (var _b = 0, arr_4 = arr; _b < arr_4.length; _b++) {
                            var item = arr_4[_b];
                            if (item.relate_value == value) {
                                var others = true;
                                if (item.others != null && item.others.length != 0) {
                                    others = false;
                                    for (var _c = 0, _d = item.others; _c < _d.length; _c++) {
                                        var temp = _d[_c];
                                        var other_name = temp.name;
                                        var target = this.m_page.getNodeByName(other_name);
                                        if (target && target.value == temp.value)
                                            others = true;
                                    }
                                }
                                if (!others)
                                    continue;
                                for (var key in item) {
                                    node[key] = item[key];
                                }
                                config.value = item.value;
                                if (node.selected) {
                                    this._currentClickItem = node;
                                    this.onValueChange();
                                }
                            }
                        }
                    }
                };
                Object.defineProperty(ChooserGroup.prototype, "value", {
                    get: function () {
                        return this._currentClickItem.value;
                    },
                    enumerable: true,
                    configurable: true
                });
                //public show():void
                //{
                //    super.show();
                //    this.setDefaultValue();
                //}
                ChooserGroup.prototype.setValue = function (node_name, value) {
                    this._currentClickItem.value = value;
                    for (var i = 0; i < this._items.length; i++) {
                        var node = this._items[i];
                        if (node.config.value == value) {
                            this.chooseAt(i);
                            return;
                        }
                    }
                };
                ChooserGroup.prototype.setDefaultValue = function () {
                    var index = 0;
                    for (var i = 0; i < this._items.length; i++) {
                        var node = this._items[i];
                        if (node.config.selected == true) {
                            index = i;
                        }
                    }
                    if (this._items[index].enabled != false)
                        this.chooseAt(index);
                };
                ChooserGroup.prototype.onItemChange = function (evt) {
                    if (this._currentClickItem == evt.currentTarget) {
                        this._currentClickItem.selected = true;
                        return;
                    }
                    if (this._currentClickItem != null)
                        this._currentClickItem.selected = false;
                    this._currentClickItem = evt.currentTarget;
                    playButtonSound();
                    this.onValueChange();
                };
                ChooserGroup.prototype.chooseAt = function (index) {
                    if (this._currentClickItem != null)
                        this._currentClickItem.selected = false;
                    this._currentClickItem = this._items[index];
                    this._currentClickItem.selected = true;
                    this.onValueChange();
                };
                return ChooserGroup;
            }(parser.Group));
            parser.ChooserGroup = ChooserGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
* 默认设置组
*/
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var DefaultGroup = /** @class */ (function (_super) {
                __extends(DefaultGroup, _super);
                function DefaultGroup(config) {
                    return _super.call(this, config) || this;
                }
                DefaultGroup.prototype.setValue = function (node_name, value) {
                    var node = this.getChild(node_name);
                    node.value = value;
                };
                DefaultGroup.prototype.toControl = function (node_name, value) {
                    var node = this.getChild(node_name);
                    var arr = node.toControl;
                    if (arr == null)
                        return;
                    for (var _i = 0, arr_5 = arr; _i < arr_5.length; _i++) {
                        var item = arr_5[_i];
                        if (item.relate_value == value) {
                            for (var key in item) {
                                node[key] = item[key];
                            }
                            continue;
                        }
                    }
                };
                DefaultGroup.prototype.build = function () {
                };
                DefaultGroup.prototype.hasChild = function (name) {
                    for (var _i = 0, _a = this._config.items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.name == name)
                            return true;
                    }
                    return false;
                };
                DefaultGroup.prototype.getChild = function (name) {
                    for (var _i = 0, _a = this._config.items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.name == name)
                            return node;
                    }
                    return null;
                };
                DefaultGroup.prototype.getNodes = function () {
                    return this._config.items;
                };
                DefaultGroup.prototype.setDefaultValue = function () {
                    for (var _i = 0, _a = this._config.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        parser.g_evtDispatcher.dispatch(parser.evt_ItemClick, item);
                    }
                };
                return DefaultGroup;
            }(parser.Group));
            parser.DefaultGroup = DefaultGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/21.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var InputGroup = /** @class */ (function (_super) {
                __extends(InputGroup, _super);
                function InputGroup(config) {
                    return _super.call(this, config) || this;
                }
                InputGroup.prototype.setDefaultValue = function () {
                    console.log("InputGroup setDefaultValue");
                    if (this._config.name) {
                        this._currentClickItem = this._items[0];
                        this.onValueChange();
                    }
                    else {
                        for (var i = 0; i < this._items.length; i++) {
                            this._currentClickItem = this._items[i];
                            this.onValueChange();
                        }
                    }
                };
                InputGroup.prototype.toControl = function (node_name, value) {
                    _super.prototype.toControl.call(this, node_name, value);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        var config = node.config;
                        var arr = config.toControl;
                        if (arr == null)
                            continue;
                        for (var _b = 0, arr_6 = arr; _b < arr_6.length; _b++) {
                            var item = arr_6[_b];
                            if (item.relate_value == value) {
                                for (var key in item) {
                                    node[key] = item[key];
                                }
                                if (!isNaN(item.value))
                                    config.value = item.value;
                                continue;
                            }
                        }
                    }
                };
                return InputGroup;
            }(parser.Group));
            parser.InputGroup = InputGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/21.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var LabelGroup = /** @class */ (function (_super) {
                __extends(LabelGroup, _super);
                function LabelGroup(config) {
                    return _super.call(this, config) || this;
                }
                LabelGroup.prototype.setDefaultValue = function () {
                    console.log("LabelGroup setDefaultValue");
                    if (this._config.name) {
                        this._currentClickItem = this._items[0];
                        this.onValueChange();
                    }
                    else {
                        for (var i = 0; i < this._items.length; i++) {
                            this._currentClickItem = this._items[i];
                            this.onValueChange();
                        }
                    }
                };
                LabelGroup.prototype.toControl = function (node_name, value) {
                    _super.prototype.toControl.call(this, node_name, value);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        var config = node.config;
                        var arr = config.toControl;
                        if (arr == null)
                            continue;
                        for (var _b = 0, arr_7 = arr; _b < arr_7.length; _b++) {
                            var item = arr_7[_b];
                            if (item.relate_value == value) {
                                for (var key in item) {
                                    node[key] = item[key];
                                }
                                if (!isNaN(item.value))
                                    config.value = item.value;
                                continue;
                            }
                        }
                    }
                };
                return LabelGroup;
            }(parser.Group));
            parser.LabelGroup = LabelGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/8.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            function getNode(config) {
                switch (config.parent_config.type) {
                    case "label":
                        return new LabelNode(config);
                    case "input":
                        return new TextInputNode(config);
                    case "slider":
                        return new SliderNode(config);
                    case "stepping":
                        return new SteppingNode(config);
                    case "attribute":
                        return new AttributeNode(config);
                    case "timepicker":
                        return new TimePickerNode(config);
                    case "pointlist":
                        return new parser.PointListNode(config);
                    default:
                        return new NodeItem(config);
                }
            }
            parser.getNode = getNode;
            var NodeItem = /** @class */ (function (_super) {
                __extends(NodeItem, _super);
                function NodeItem(config) {
                    var _this = _super.call(this) || this;
                    _this._label_padding = "20,0,0,0";
                    _this._offX = 0;
                    _this._config = config;
                    _this._offX = parser.g_groupStartX;
                    _this.build();
                    return _this;
                }
                NodeItem.prototype.destroy = function () {
                    this._config = null;
                    this._button = null;
                    this._side_label = null;
                };
                NodeItem.prototype.build = function () {
                    switch (this._config.parent_config.type) {
                        case "chooser": //单选按钮
                        case "order_chooser":
                            this._button = new laya.ui.CheckBox("qpq/comp/checkbox_1.png");
                            break;
                        case "selector": //checkbox
                        case "order_selector":
                            this._button = new laya.ui.CheckBox("qpq/comp/checkBox_2.png");
                            break;
                    }
                    if (this._button) {
                        this._button.stateNum = 3;
                        var label_colors = parser.colors.button + "," + parser.colors.button + "," + parser.colors.button;
                        this._button.labelColors = label_colors;
                        this._button.labelSize = parser.sizes.font_size;
                        this._button.labelPadding = this._label_padding;
                        this.addChild(this._button);
                    }
                };
                NodeItem.prototype.setConfig = function (config) {
                    this.name = config.name;
                    this._config = config;
                    this.label = config.label;
                    this.side_label = config.side_label;
                    this._enabled = true;
                    this.position = config.pos;
                };
                Object.defineProperty(NodeItem.prototype, "position", {
                    set: function (value) {
                        if (value) {
                            var temp = this.getPos(value);
                            this.x = temp.x;
                            this.y = temp.y;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeItem.prototype, "config", {
                    get: function () {
                        return this._config;
                    },
                    enumerable: true,
                    configurable: true
                });
                NodeItem.prototype.getPos = function (pos) {
                    var arr;
                    if (pos.indexOf(",") != -1) {
                        arr = pos.split(",");
                        return { x: parseFloat(arr[0]), y: parseFloat(arr[1]) };
                    }
                    arr = pos.split("_");
                    var rows = this._config.parent_config["rows"];
                    var cols = this._config.parent_config["cols"];
                    if (isNaN(rows) && isNaN(cols)) {
                        var type = parseInt(arr[0]);
                        var index = parseInt(arr[1]);
                        var yIndex = parseInt(arr[2]);
                        if (isNaN(yIndex))
                            yIndex = 0;
                        return { x: parser.g_posList[type][index], y: yIndex * parser.groupHeight };
                    }
                    var row_index = parseInt(arr[0]);
                    var col_index = parseInt(arr[1]);
                    var itemWidth = (parser.g_groupWidth - this._offX) / cols;
                    var ret = {};
                    ret.x = this._offX + col_index * itemWidth;
                    ret.y = 0 + row_index * parser.rowHeight;
                    return ret;
                };
                Object.defineProperty(NodeItem.prototype, "value", {
                    get: function () {
                        if (this._button == null)
                            return 0;
                        if (this._button.selected) {
                            if (this._config.parent_config.type == "selector" || this._config.parent_config.type == "order_selector")
                                return 1;
                            return this._config.value;
                        }
                        return 0;
                    },
                    set: function (args) {
                        //this.config.value = args;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeItem.prototype, "selected", {
                    get: function () {
                        if (this._button)
                            return this._button.selected;
                        return false;
                    },
                    set: function (value) {
                        value = Boolean(value);
                        if (this._button == null)
                            return;
                        this._button.selected = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeItem.prototype, "enabled", {
                    get: function () {
                        return this._enabled;
                    },
                    set: function (value) {
                        this._enabled = value = Boolean(value);
                        if (this._button == null)
                            return;
                        if (this._button.disabled == !value)
                            return;
                        this._button.disabled = !value;
                        this._button.gray = false;
                        if (this._button.disabled) {
                            this._button.selected = false;
                            this._button["state"] = 1;
                        }
                        else {
                            this._button["state"] = this._button.selected ? 2 : 0;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeItem.prototype, "label", {
                    set: function (value) {
                        this._button.label = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeItem.prototype, "side_label", {
                    set: function (value) {
                        if (value != null) {
                            if (this._side_label == null)
                                this.addSideLabel();
                            this._side_label.text = value;
                            if (this._button) {
                                this._side_label.x = this._button.x + this._button.width + 5;
                                this._side_label.y = this._button.y + this._button.height - this._side_label.height;
                            }
                        }
                        else {
                            if (this._side_label != null)
                                this._side_label.text = "";
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                NodeItem.prototype.addSideLabel = function () {
                    var txt = new laya.ui.Label();
                    for (var key in parser.side_label_style_default) { /*设置默认风格*/
                        txt[key] = parser.side_label_style_default[key];
                    }
                    txt.color = parser.colors.button;
                    this.addChild(txt);
                    this._side_label = txt;
                };
                return NodeItem;
            }(laya.display.Sprite));
            parser.NodeItem = NodeItem;
            var LabelNode = /** @class */ (function (_super) {
                __extends(LabelNode, _super);
                function LabelNode(config) {
                    return _super.call(this, config) || this;
                }
                LabelNode.prototype.build = function () {
                    this._label = new Laya.Label();
                    this._label.fontSize = 24;
                    this._label.color = parser.colors.label;
                    this.addChild(this._label);
                };
                Object.defineProperty(LabelNode.prototype, "value", {
                    get: function () {
                        return this._config.value;
                    },
                    set: function (args) {
                        this._config.value = args;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LabelNode.prototype, "label", {
                    set: function (value) {
                        this._label.text = value;
                        this._label.y = (parser.groupHeight - this._label.height) / 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LabelNode.prototype, "side_label", {
                    set: function (value) {
                        if (value != null) {
                            if (this._side_label == null)
                                this.addSideLabel();
                            this._side_label.text = value;
                            this._side_label.x = this._label.x + this._label.width + 5;
                            this._side_label.y = this._label.y + this._label.height - this._side_label.height - 10;
                        }
                        else {
                            if (this._side_label != null)
                                this._side_label.text = "";
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return LabelNode;
            }(NodeItem));
            parser.LabelNode = LabelNode;
            var TextInputNode = /** @class */ (function (_super) {
                __extends(TextInputNode, _super);
                function TextInputNode(config) {
                    return _super.call(this, config) || this;
                }
                TextInputNode.prototype.build = function () {
                    this._input_bg = new Laya.Image();
                    this._input_bg.skin = "qpq/hall/bg_create.png";
                    this._input_bg.sizeGrid = "18,18,18,18";
                    this.addChild(this._input_bg);
                    var temp = this._label = new Laya.TextInput();
                    this._label.fontSize = 24;
                    this._label.height = 26;
                    if (isNaN(this._config.width))
                        this._label.width = 200;
                    else
                        this._label.width = this._config.width;
                    this._label.color = parser.colors.label;
                    this._label.align = "center";
                    this._label.y = 1;
                    if (isNaN(this._config.maxChars))
                        temp.maxChars = 10;
                    else
                        temp.maxChars = this._config.maxChars;
                    temp.prompt = this.config.prompt;
                    this.addChild(this._label);
                    this._input_bg.height = this._label.height + 4;
                    this._input_bg.width = this._label.width + 8;
                    this._input_bg.y = 10;
                    // this._label.y = this._input_bg.y + (this._input_bg.height - this._label.height) / 2
                };
                Object.defineProperty(TextInputNode.prototype, "value", {
                    get: function () {
                        return this._label.text;
                    },
                    enumerable: true,
                    configurable: true
                });
                return TextInputNode;
            }(LabelNode));
            parser.TextInputNode = TextInputNode;
            var SteppingNode = /** @class */ (function (_super) {
                __extends(SteppingNode, _super);
                function SteppingNode(config) {
                    return _super.call(this, config) || this;
                }
                SteppingNode.prototype.build = function () {
                    this._title = new Laya.Label();
                    this._input = new Laya.Label();
                    this._input_bg = new Laya.Image();
                    this._input_btn = new Laya.Button();
                    this._input_bg.skin = "qpq/hall/bg_create.png";
                    this._input_bg.sizeGrid = "18,18,18,18";
                    this._input_btn.skin = "qpq/hall/btn_keyboard.png";
                    this._input_btn.stateNum = 2;
                    this._label_width = 150;
                    this._title.color = parser.colors.button;
                    this._input.color = parser.colors.button;
                    this._title.fontSize = this._input.fontSize = 24;
                    this._input.mouseEnabled = false;
                    this.addChild(this._title);
                    this.addChild(this._input_bg);
                    this.addChild(this._input);
                    this.addChild(this._input_btn);
                    this.adjuest();
                    this._input_btn.on(Laya.Event.CLICK, this, this.onClickInput);
                    this._input_bg.on(Laya.Event.CLICK, this, this.onClickInput);
                };
                SteppingNode.prototype.setUpdateCallBack = function (callBack, thisobj) {
                    this._callBack = callBack;
                    this._thisObj = thisobj;
                };
                SteppingNode.prototype.onClickInput = function (evt) {
                    g_signal.dispatch(qpq.SignalMsg.showKeypad_Input, [
                        Laya.Handler.create(this, this.onInputValue),
                        this._config.title,
                        this._value_max + "",
                    ]);
                };
                SteppingNode.prototype.onInputValue = function (value) {
                    this.value = value;
                };
                SteppingNode.prototype.setConfig = function (config) {
                    this.name = config.name;
                    this._config = config;
                    this._title.text = config.title ? config.title : "";
                    this.adjuest();
                    this.position = config.pos;
                    this._step = config.step;
                    this._value_min = config.value_min;
                    this._value_max = config.value_max;
                    this.value = config.value;
                };
                Object.defineProperty(SteppingNode.prototype, "value", {
                    get: function () {
                        //return parseInt(this._input.text);
                        return this._value;
                    },
                    set: function (args) {
                        if (this._value_max && args >= this._value_max)
                            args = this._value_max;
                        if (args < this._value_min)
                            args = this._value_min;
                        if (args == this._value)
                            return;
                        this._value = args;
                        // this._input.text = args +"";
                        this._input.text = utils.tools.getMoneyByExchangeRate(args);
                        this._input.y = (this._input_bg.height - this._input.height) / 2;
                        this._input.x = this._input_bg.x + (this._input_bg.width - this._input.width) / 2;
                        if (this._callBack) {
                            this._callBack.call(this._thisObj, this);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SteppingNode.prototype, "value_min", {
                    set: function (value) {
                        this._value_min = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SteppingNode.prototype, "value_max", {
                    set: function (value) {
                        this._value_max = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                SteppingNode.prototype.adjuest = function () {
                    var temp = 0;
                    this._title.x = temp;
                    temp += this._title.width + 5;
                    this._label_width = Math.max(150, this._input.width);
                    this._input_bg.x = temp;
                    this._input_bg.width = this._label_width + 4;
                    this._input.x = temp + 2;
                    temp += this._label_width + 4;
                    this._input_btn.x = temp;
                    this._title.y = (this._input_bg.height - this._title.height) / 2;
                };
                return SteppingNode;
            }(NodeItem));
            parser.SteppingNode = SteppingNode;
            var TimePickerNode = /** @class */ (function (_super) {
                __extends(TimePickerNode, _super);
                function TimePickerNode(config) {
                    return _super.call(this, config) || this;
                }
                TimePickerNode.prototype.build = function () {
                    this._title = new Laya.Label();
                    this._input = new Laya.Label();
                    this._input_bg = new Laya.Image();
                    this._input_btn = new Laya.Button();
                    this._input_bg.skin = "qpq/hall/bg_create.png";
                    this._input_bg.sizeGrid = "18,18,18,18";
                    this._input_btn.skin = "qpq/hall/btn_keyboard.png";
                    this._input_btn.stateNum = 2;
                    this._label_width = 150;
                    this._title.color = parser.colors.button;
                    this._input.color = parser.colors.button;
                    this._title.fontSize = this._input.fontSize = 24;
                    this._input.mouseEnabled = false;
                    this.addChild(this._title);
                    this.addChild(this._input_bg);
                    this.addChild(this._input);
                    this.addChild(this._input_btn);
                    this.adjuest();
                    this._input_btn.on(Laya.Event.CLICK, this, this.onClickInput);
                    this._input_bg.on(Laya.Event.CLICK, this, this.onClickInput);
                };
                TimePickerNode.prototype.setUpdateCallBack = function (callBack, thisobj) {
                    this._callBack = callBack;
                    this._thisObj = thisobj;
                };
                TimePickerNode.prototype.onClickInput = function (evt) {
                    g_signal.dispatch(qpq.SignalMsg.showTimerPicker, [Laya.Handler.create(this, this.onInputValue), this._config.default_value, this._config.offsize]);
                };
                TimePickerNode.prototype.onInputValue = function (value) {
                    this.value = value;
                };
                TimePickerNode.prototype.setConfig = function (config) {
                    this.name = config.name;
                    this._config = config;
                    this._title.text = config.title ? config.title : "";
                    this.adjuest();
                    this.position = config.pos;
                    this.value = config.value;
                };
                Object.defineProperty(TimePickerNode.prototype, "default_value", {
                    set: function (value) {
                        this.config.default_value = value;
                        this.value = "";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TimePickerNode.prototype, "value", {
                    get: function () {
                        return this._input.text;
                    },
                    set: function (args) {
                        if ((args == "" || args == undefined) && this.config.default_value == "server_time") {
                            var date = new Date();
                            var tmc = Laya.timer.currTimer - GameVar.s_loginClientTime + GameVar.s_loginSeverTime * 1000;
                            if (this.config.offsize) {
                                tmc += this.config.offsize * 1000;
                            }
                            date.setTime(tmc);
                            var temp = date.getHours();
                            args = temp < 10 ? "0" + temp : "" + temp;
                            args += ":";
                            temp = date.getMinutes();
                            args += (temp < 10 ? "0" + temp : "" + temp);
                        }
                        this._value = args;
                        this._input.text = args + "";
                        this._input.y = (this._input_bg.height - this._input.height) / 2;
                        this._input.x = this._input_bg.x + (this._input_bg.width - this._input.width) / 2;
                        if (this._config.changeAtt)
                            this._config.changeAtt.value = args;
                        if (this._callBack) {
                            this._callBack.call(this._thisObj, this.config);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                TimePickerNode.prototype.adjuest = function () {
                    var temp = 0;
                    this._title.x = temp;
                    temp += this._title.width + 5;
                    this._label_width = Math.max(150, this._input.width);
                    this._input_bg.x = temp;
                    this._input_bg.width = this._label_width + 4;
                    this._input.x = temp + 2;
                    temp += this._label_width + 4;
                    this._input_btn.x = temp;
                    this._title.y = (this._input_bg.height - this._title.height) / 2;
                };
                return TimePickerNode;
            }(NodeItem));
            parser.TimePickerNode = TimePickerNode;
            var AttributeNode = /** @class */ (function (_super) {
                __extends(AttributeNode, _super);
                function AttributeNode(config) {
                    return _super.call(this, config) || this;
                }
                AttributeNode.prototype.setConfig = function (config) {
                    this.name = config.name;
                    this._config = config;
                    this._title.text = config.title ? config.title : "";
                    this.adjuest();
                    this.position = config.pos;
                    this.value = config.value;
                };
                Object.defineProperty(AttributeNode.prototype, "value", {
                    get: function () {
                        //return parseInt(this._input.text);
                        return this._value;
                    },
                    set: function (args) {
                        this._value = args;
                        // this._input.text = args +"";
                        this._input.text = utils.tools.getMoneyByExchangeRate(args);
                        this._input.y = (this._input_bg.height - this._input.height) / 2;
                        this._input.x = this._input_bg.x + (this._input_bg.width - this._input.width) / 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                AttributeNode.prototype.build = function () {
                    this._title = new Laya.Label();
                    this._input = new Laya.Label();
                    this._input_bg = new Laya.Image();
                    this._input_bg.skin = "qpq/hall/bg_create.png";
                    this._input_bg.sizeGrid = "18,18,18,18";
                    this._label_width = 150;
                    this._title.color = parser.colors.button;
                    this._input.color = parser.colors.button;
                    this._title.fontSize = this._input.fontSize = 24;
                    this._input.mouseEnabled = false;
                    this.addChild(this._title);
                    this.addChild(this._input_bg);
                    this.addChild(this._input);
                    this.adjuest();
                };
                AttributeNode.prototype.adjuest = function () {
                    var temp = 0;
                    this._title.x = temp;
                    temp += this._title.width + 5;
                    this._label_width = Math.max(150, this._input.width);
                    this._input_bg.x = temp;
                    this._input_bg.width = this._label_width + 4;
                    this._input.x = temp + 2;
                    temp += this._label_width + 4;
                    this._title.y = (this._input_bg.height - this._title.height) / 2;
                };
                return AttributeNode;
            }(NodeItem));
            parser.AttributeNode = AttributeNode;
            var SliderNode = /** @class */ (function (_super) {
                __extends(SliderNode, _super);
                function SliderNode(config) {
                    return _super.call(this, config) || this;
                }
                Object.defineProperty(SliderNode.prototype, "slider", {
                    get: function () {
                        return this._slider;
                    },
                    enumerable: true,
                    configurable: true
                });
                SliderNode.prototype.build = function () {
                    var className = this._config.skinname ? this._config.skinname : "qpq/Art_Bar";
                    this._res = new (gamelib.getDefinitionByName(className))();
                    this.addChild(this._res);
                    this._slider = new gamelib.control.Slider(this._res);
                };
                SliderNode.prototype.setConfig = function (config) {
                    this.name = config.name;
                    this._config = config;
                    this._slider.setLabel(config.label);
                    this._slider.setParams(config.minimum, config.maximum);
                    this.side_label = config.side_label;
                    this.position = config.pos;
                };
                Object.defineProperty(SliderNode.prototype, "value", {
                    get: function () {
                        return this._slider.value;
                    },
                    set: function (args) {
                        this._slider.value = args;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SliderNode.prototype, "selected", {
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SliderNode.prototype, "enabled", {
                    set: function (value) {
                        if (value) {
                            this._slider.show();
                            this._slider.value = this.config.minimum;
                        }
                        else {
                            this._slider.close();
                        }
                        this._slider.enabled = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SliderNode.prototype, "label", {
                    set: function (value) {
                        this._slider.setLabel(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SliderNode.prototype, "side_label", {
                    set: function (value) {
                        if (value != null) {
                            if (this._side_label == null)
                                this.addSideLabel();
                            this._side_label.text = value;
                            this._side_label.x = this._res.x + this._res.width + 5;
                            this._side_label.y = this._res.y + this._res.height - this._side_label.height - 10;
                        }
                        else {
                            if (this._side_label != null)
                                this._side_label.text = "";
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return SliderNode;
            }(NodeItem));
            parser.SliderNode = SliderNode;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/8.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var Page = /** @class */ (function (_super) {
                __extends(Page, _super);
                function Page(totalHeight) {
                    var _this = _super.call(this) || this;
                    _this._roundCost_index = 0;
                    _this._totalHeight = totalHeight;
                    _this._list = [];
                    parser.g_evtDispatcher = new gamelib.core.Signal();
                    _this._common_data = ["gz_id", "game_id", "money_type", "mode_id", "room_name"];
                    return _this;
                }
                Page.prototype.show = function () {
                    parser.g_evtDispatcher.add(this.onLocalMsg, this);
                    for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                        var g = _a[_i];
                        g.show();
                    }
                    var defaultConfig = qpq.g_qpqData.getHabitData(this._config);
                    if (defaultConfig != null) {
                        this.applyDefaultConfig(defaultConfig);
                    }
                };
                Page.prototype.close = function () {
                    parser.g_evtDispatcher.remove(this.onLocalMsg);
                    for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                        var g = _a[_i];
                        g.close();
                    }
                };
                Page.prototype.getConfig = function () {
                    return this._config;
                };
                Page.prototype.setConfig = function (config) {
                    var group;
                    this._config = config;
                    parser.groupHeight = config['groupHeight'] || 50;
                    parser.rowHeight = config['rowHeight'] || 50;
                    if (this._config.roundCostName == null)
                        this._config.roundCostName = "round_num";
                    while (this.numChildren) {
                        group = this.removeChildAt(0);
                        group.close();
                        group.destroy();
                    }
                    this._net_data = {};
                    for (var _i = 0, _a = this._common_data; _i < _a.length; _i++) {
                        var key = _a[_i];
                        this._net_data[key] = config[key];
                    }
                    this._list.length = 0;
                    var index = 0;
                    var list = config.groups;
                    var __colors = config.colors;
                    if (__colors) {
                        for (var key in qpq.creator.parser.colors) {
                            if (__colors[key])
                                qpq.creator.parser.colors[key] = __colors[key];
                        }
                    }
                    var __size = config.sizes;
                    if (__size) {
                        for (var key in qpq.creator.parser.sizes) {
                            if (__size[key])
                                qpq.creator.parser.sizes[key] = __size[key];
                        }
                    }
                    var ty = 0;
                    for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
                        var item = list_1[_b];
                        switch (item.type) {
                            case "chooser":
                            case "order_chooser":
                                group = new parser.ChooserGroup(item);
                                break;
                            case "selector":
                            case "order_selector":
                                group = new parser.SelectorGroup(item);
                                break;
                            case "label":
                                group = new parser.LabelGroup(item);
                                break;
                            case "input":
                                group = new parser.InputGroup(item);
                                break;
                            case "slider":
                                group = new parser.SliderGroup(item);
                                break;
                            case "default":
                                group = new parser.DefaultGroup(item);
                                break;
                            case "stepping":
                                group = new parser.SteppingGroup(item);
                                break;
                            case "attribute":
                                group = new parser.AttributeGroup(item);
                                break;
                            case "timepicker":
                                group = new parser.TimePickerGroup(item);
                                break;
                            case "pointlist":
                                group = new parser.PointListGroup(item);
                                break;
                            default:
                                group = new parser.Group(item);
                                continue;
                        }
                        group.m_page = this;
                        this._list.push(group);
                        group.y = ty;
                        if (!item.yControl) {
                            if (item.linespacing)
                                ty += parser.groupHeight + item.linespacing;
                            else
                                ty += parser.groupHeight - 3;
                        }
                        this.addChild(group);
                    }
                    // this.frameOnce(2,this,this.layout);
                    this.timer.callLater(this, this.layoutItems);
                };
                Page.prototype.layoutItems = function () {
                    var ty = 0;
                    for (var i = 0; i < this.numChildren; i++) {
                        var temp = this.getChildAt(i);
                        temp['y'] = ty;
                        var rec = temp['getBounds']();
                        var linespacing = temp.getConfig().linespacing || 0;
                        ty += Math.max(rec.height, parser.groupHeight) + linespacing;
                    }
                };
                Object.defineProperty(Page.prototype, "netData", {
                    get: function () {
                        var result = {};
                        for (var _i = 0, _a = this._common_data; _i < _a.length; _i++) {
                            var key = _a[_i];
                            result[key] = this._config[key];
                        }
                        if (Page.extraDatas) {
                            for (var key in Page.extraDatas)
                                result[key] = Page.extraDatas[key];
                        }
                        for (var i = 0; i < this._list.length; i++) {
                            var temp = this._list[i];
                            if (temp.name) {
                                if (this._config[temp.name]) {
                                    result[temp.name] = this._config[temp.name];
                                }
                                else {
                                    result[temp.name] = temp.value;
                                }
                                continue;
                            }
                            var arr = temp.getNodes();
                            for (var _b = 0, arr_8 = arr; _b < arr_8.length; _b++) {
                                var node = arr_8[_b];
                                if (node.name) {
                                    if (node.name == "startTime") {
                                        console.log("dddd");
                                    }
                                    if (this._config[node.name]) {
                                        result[node.name] = this._config[node.name];
                                    }
                                    else {
                                        result[node.name] = node.value;
                                    }
                                }
                            }
                        }
                        return result;
                    },
                    enumerable: true,
                    configurable: true
                });
                Page.prototype.getGroupByType = function (type) {
                    var arr = [];
                    for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                        var g = _a[_i];
                        if (g.type == type)
                            arr.push(g);
                    }
                    return arr;
                };
                Page.prototype.onLocalMsg = function (msg, data) {
                    switch (msg) {
                        case parser.evt_ItemClick:
                            if (data.name)
                                this._net_data[data.name] = data.value;
                            var roundCostName = this._config.roundCostName;
                            if (roundCostName.indexOf(data.name) >= 0) {
                                this.updateRoundCost(data.valueIndex);
                            }
                            // if(typeof roundCostName == "string")
                            // {
                            //     if(data.name == this._config.roundCostName)
                            //     {
                            //         this._roundCost_index = data.valueIndex;
                            //         g_signal.dispatch(evt_UpdateRoundCost,this._config.roundCost[data.valueIndex]);
                            //     }    
                            // }
                            // else
                            // {
                            // }
                            var arr;
                            if (data.control) {
                                arr = data.control.split(",");
                                for (var i = 0; i < arr.length; i++) {
                                    this.control(arr[i], data);
                                }
                            }
                            if (data.parent_config && data.parent_config.control) {
                                arr = data.parent_config.control.split(",");
                                for (var i = 0; i < arr.length; i++) {
                                    this.control(arr[i], data);
                                }
                            }
                            if (data.changeAtt) {
                                if (data.changeAtt instanceof Array) {
                                    for (var _i = 0, _a = data.changeAtt; _i < _a.length; _i++) {
                                        var item = _a[_i];
                                        this._config[item.name] = item.value;
                                        if (roundCostName.indexOf(item.name) >= 0 || item.name == "roundCost") {
                                            this.updateRoundCost();
                                        }
                                    }
                                }
                                else {
                                    this._config[data.changeAtt.name] = data.changeAtt.value;
                                    if (roundCostName.indexOf(data.name) >= 0 || data.name == "roundCost") {
                                        this.updateRoundCost();
                                    }
                                    // if(data.changeAtt.name == roundCostName)
                                    // {
                                    //    g_signal.dispatch(evt_UpdateRoundCost,this._config.roundCost[this._roundCost_index]);
                                    // }     
                                }
                            }
                            if (data.config && data.config.changeAtt) {
                                this.changeValue(data.config.changeAtt, data.value);
                            }
                            if (data.config && data.config.parent_config && data.config.parent_config.changeAtt) {
                                this.changeValue(data.config.parent_config.changeAtt, data.value);
                            }
                            break;
                    }
                };
                Page.prototype.updateRoundCost = function (valueIndex) {
                    var roundCostName = this._config.roundCostName;
                    if (typeof roundCostName == "string") {
                        if (!isNaN(valueIndex))
                            this._roundCost_index = valueIndex;
                        g_signal.dispatch(parser.evt_UpdateRoundCost, this._config.roundCost[this._roundCost_index]);
                    }
                    else {
                        var values = [];
                        for (var _i = 0, roundCostName_1 = roundCostName; _i < roundCostName_1.length; _i++) {
                            var name = roundCostName_1[_i];
                            var g = this.getGroupByName(name);
                            if (g)
                                values.push(g.value);
                        }
                        var str = values.join(",");
                        var num = this._config.roundCost[str] || 0;
                        g_signal.dispatch(parser.evt_UpdateRoundCost, this._config.roundCost[str]);
                    }
                };
                /**
                 * 应用默认配置
                 * */
                Page.prototype.applyDefaultConfig = function (data) {
                    var ignoreVec = ["gz_id", "game_id", "money_type", "mode_id", "room_name", "pay_mode"];
                    var failVec = [];
                    for (var key in data) { /*为在JSON对象中的所有属性寻找适配器并赋值*/
                        if (ignoreVec.indexOf(key) != -1)
                            continue;
                        var group = this.getGroupByName(key);
                        if (group) {
                            group.setValue(key, data[key]);
                        }
                    }
                };
                Page.prototype.changeValue = function (targetList, value) {
                    for (var i = 0; i < targetList.length; i++) {
                        var temp = this.getGroupByName(targetList[i].name);
                        if (temp == null)
                            return;
                        //需要修改的值，可以为原始值，+-*/的数据。+30表示在value基础上+30
                        var tv = targetList[i].value;
                        var target_value = 0;
                        if (tv == "value") {
                            target_value = value;
                        }
                        else {
                            var first = tv.charAt(0);
                            var change_value = parseInt(tv.slice(1));
                            switch (first) {
                                case "+":
                                    target_value = value + change_value;
                                    break;
                                case "-":
                                    target_value = value - change_value;
                                    break;
                                case "*":
                                    target_value = value * change_value;
                                    break;
                                case "/":
                                    target_value = value / change_value;
                                    break;
                                case "=":
                                    target_value = this.parseGongShi(tv, targetList[i].variables);
                                    break;
                                default:
                                    target_value = tv;
                                    break;
                            }
                        }
                        switch (targetList[i].att) {
                            case "value":
                                temp.setValue(targetList[i].name, target_value);
                                break;
                            case "selectedIndex":
                                var items = temp.getNodes();
                                for (var j = 0; j < items.length; j++) {
                                    items[j].selected = (j == parseInt(target_value));
                                }
                                break;
                            default:
                                // code...
                                break;
                        }
                    }
                };
                //公式格式为 =a+b*c;
                Page.prototype.parseGongShi = function (gongshi, variables) {
                    gongshi = gongshi.slice(1, gongshi.length); //去掉=;
                    for (var i = 0; i < variables.length; i++) {
                        var value = this.getNodeByName(variables[i]).value;
                        var reg = new RegExp(variables[i], "g");
                        gongshi = gongshi.replace(reg, value + "");
                    }
                    return eval(gongshi);
                };
                /**
                 * 控制其他元件
                 * @param controlName
                 * @param data
                 */
                Page.prototype.control = function (controlName, data) {
                    var group = this.getGroupByName(controlName);
                    group.toControl(controlName, data.value);
                };
                Page.prototype.getNodeByName = function (name) {
                    for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                        var g = _a[_i];
                        if (g.name == name)
                            return g;
                        if (g.hasChild(name)) {
                            return g.getChild(name);
                        }
                    }
                    return null;
                };
                Page.prototype.getGroupByName = function (name) {
                    for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                        var g = _a[_i];
                        if (g.type == "selector" || g.type == "timepicker" || g.type == "label" || g.type == "stepping" || g.type == "attribute" || g.type == "default") {
                            if (g.hasChild(name))
                                return g;
                        }
                        else {
                            if (g.name == name)
                                return g;
                        }
                    }
                    return null;
                };
                Page.prototype.layout = function () {
                    this.y = (this._totalHeight - this.height) * 0.5;
                };
                return Page;
            }(laya.display.Sprite));
            parser.Page = Page;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var PointListGroup = /** @class */ (function (_super) {
                __extends(PointListGroup, _super);
                function PointListGroup(config) {
                    return _super.call(this, config) || this;
                }
                PointListGroup.prototype.build = function () {
                    this._config.items = [this._config];
                    _super.prototype.build.call(this);
                    this._items[0].x = this._config.x || 0;
                    this._items[0].y = this._config.y || 0;
                    this.timer.callLater(this, this.updateBgSize);
                };
                PointListGroup.prototype.setValue = function (node_name, value) {
                    this._items[0].value = value;
                };
                Object.defineProperty(PointListGroup.prototype, "value", {
                    get: function () {
                        return this._items[0].value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PointListGroup;
            }(parser.Group));
            parser.PointListGroup = PointListGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var PointListNode = /** @class */ (function (_super) {
                __extends(PointListNode, _super);
                function PointListNode(config) {
                    return _super.call(this, config) || this;
                }
                PointListNode.prototype.build = function () {
                    this._label = new Laya.Label();
                    this._label.fontSize = 24;
                    this._label.color = this.config.color || parser.colors.label;
                    this.addChild(this._label);
                    this._add = new Laya.Button();
                    this._add.skin = "comp/btn_jia.png";
                    this._sub = new Laya.Button();
                    this._sub.skin = "comp/btn_jian.png";
                    this._add.stateNum = this._sub.stateNum = 2;
                    this._point = new Laya.Image();
                    this._point.skin = "comp/bg_df2.png";
                    this._bg = new Laya.Image();
                    this._bg.skin = "comp/bg_df1.png";
                    this.addChild(this._add);
                    this.addChild(this._bg);
                    this._bg.addChild(this._point);
                    this.addChild(this._sub);
                    this._point.addChild(this._label);
                    this.timer.callLater(this, this.setPos);
                    this._value = parseInt(this._config.value);
                    this._maxValue = parseInt(this._config.maxValue);
                    this._minValue = parseInt(this._config.minValue);
                    this._tick = parseInt(this._config.tick);
                    this._add.on(Laya.Event.CLICK, this, this.onAdd);
                    this._sub.on(Laya.Event.CLICK, this, this.onSub);
                    this._label.text = "1";
                };
                PointListNode.prototype.setConfig = function (config) {
                    this.name = config.name;
                    this._config = config;
                    this.position = config.pos;
                };
                PointListNode.prototype.setPos = function () {
                    var off = (this._bg.height - this._point.height) / 2;
                    this._sub.x = 0;
                    this._bg.x = this._add.width + 5;
                    this._add.x = this._bg.x + this._bg.width + 5;
                    this._point.x = this._point.y = off;
                    this._label.y = (this._point.height - this._label.height) / 2;
                    this._label.width = this._point.width;
                    this._label.align = "center";
                    this.updateValue();
                };
                PointListNode.prototype.updateValue = function () {
                    var off = (this._bg.height - this._add.height) / 2;
                    //两个之间的间隔.（总宽度-10 * 单个的宽度） / （10 -1）
                    var grap = (this._bg.width - off * 2 - this._maxValue * this._point.width) / (this._maxValue - 1);
                    this._point.x = off + (this._point.width + grap) * (this._value - 1);
                    this._label.text = this._value + "";
                };
                Object.defineProperty(PointListNode.prototype, "value", {
                    get: function () {
                        return this._value;
                    },
                    set: function (args) {
                        this._value = parseInt(args);
                        this.updateValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                PointListNode.prototype.onAdd = function (evt) {
                    if (this._value < this._maxValue) {
                        this.value = this._value + this._tick;
                    }
                };
                PointListNode.prototype.onSub = function (evt) {
                    if (this._value > this._minValue) {
                        this.value = this._value - this._tick;
                    }
                };
                return PointListNode;
            }(parser.NodeItem));
            parser.PointListNode = PointListNode;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/8.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            /**
             * 复选框
             */
            var SelectorGroup = /** @class */ (function (_super) {
                __extends(SelectorGroup, _super);
                function SelectorGroup(config) {
                    var _this = _super.call(this, config) || this;
                    _this.setDefaultValue();
                    return _this;
                }
                SelectorGroup.prototype.show = function () {
                    _super.prototype.show.call(this);
                    this.setDefaultValue();
                };
                SelectorGroup.prototype.setValue = function (node_name, value) {
                    for (var i = 0; i < this._items.length; i++) {
                        var node = this._items[i];
                        if (node.name == node_name) {
                            node.selected = value != 0;
                            node.config.value = node.value;
                            this._currentClickItem = node;
                            this.onValueChange();
                            return;
                        }
                    }
                };
                SelectorGroup.prototype.toControl = function (node_name, value) {
                    _super.prototype.toControl.call(this, node_name, value);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.config.name != node_name || node.config.toControl == null)
                            continue;
                        for (var _b = 0, _c = node.config.toControl; _b < _c.length; _b++) {
                            var item = _c[_b];
                            if (item.relate_value == value) {
                                var others = true;
                                if (item.others != null && item.others.length != 0) {
                                    others = false;
                                    for (var _d = 0, _e = item.others; _d < _e.length; _d++) {
                                        var temp = _e[_d];
                                        var other_name = temp.name;
                                        var target = this.m_page.getNodeByName(other_name);
                                        if (target && target.value == temp.value)
                                            others = true;
                                    }
                                }
                                if (!others)
                                    continue;
                                for (var key in item) {
                                    node[key] = item[key];
                                }
                            }
                        }
                    }
                };
                SelectorGroup.prototype.setDefaultValue = function () {
                    for (var i = 0; i < this._items.length; i++) {
                        var node = this._items[i];
                        node.selected = node.config.selected;
                        node.config.value = node.value;
                        this._currentClickItem = node;
                        this.onValueChange();
                    }
                };
                SelectorGroup.prototype.onItemChange = function (evt) {
                    this._currentClickItem = evt.currentTarget;
                    this._currentClickItem["config"].value = this._currentClickItem.value;
                    playButtonSound();
                    this.onValueChange();
                };
                return SelectorGroup;
            }(parser.Group));
            parser.SelectorGroup = SelectorGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
 * Created by wxlan on 2017/8/22.
 */
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var SliderGroup = /** @class */ (function (_super) {
                __extends(SliderGroup, _super);
                function SliderGroup(config) {
                    return _super.call(this, config) || this;
                }
                SliderGroup.prototype.build = function () {
                    this._config.items = [this._config];
                    _super.prototype.build.call(this);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        item.slider.setUpdateCallBack(this.onSliderChange, this);
                    }
                    this._slider = this._items[0];
                };
                SliderGroup.prototype.show = function () {
                    this._slider = this._items[0];
                    _super.prototype.show.call(this);
                };
                Object.defineProperty(SliderGroup.prototype, "value", {
                    get: function () {
                        return this._slider.value;
                    },
                    //public toControl(node_name:string,value:number):void
                    //{
                    //    super.toControl(node_name, value);
                    //    this.onValueChange();
                    //}
                    set: function (args) {
                        this.setValue("", args);
                    },
                    enumerable: true,
                    configurable: true
                });
                SliderGroup.prototype.onSliderChange = function (value) {
                    this._config.value = value;
                    this.onValueChange();
                };
                /**
                 * 设置数据值，仅用于应用用户习惯
                 **/
                SliderGroup.prototype.setValue = function (node_name, value) {
                    this._slider.value = value;
                    this._config.value = value;
                };
                Object.defineProperty(SliderGroup.prototype, "label", {
                    set: function (value) {
                        this._items[0].label = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                SliderGroup.prototype.onValueChange = function () {
                };
                return SliderGroup;
            }(parser.Group));
            parser.SliderGroup = SliderGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
* 默认设置组
*/
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var SteppingGroup = /** @class */ (function (_super) {
                __extends(SteppingGroup, _super);
                function SteppingGroup(config) {
                    return _super.call(this, config) || this;
                }
                SteppingGroup.prototype.show = function () {
                };
                SteppingGroup.prototype.build = function () {
                    _super.prototype.build.call(this);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        item.setUpdateCallBack(this.onSliderChange, this);
                    }
                };
                SteppingGroup.prototype.toControl = function (node_name, value) {
                    _super.prototype.toControl.call(this, node_name, value);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        var config = node.config;
                        var arr = config.toControl;
                        if (arr == null)
                            continue;
                        for (var _b = 0, arr_9 = arr; _b < arr_9.length; _b++) {
                            var item = arr_9[_b];
                            if (item.relate_value == value) {
                                var others = true;
                                if (item.others != null && item.others.length != 0) {
                                    others = false;
                                    for (var _c = 0, _d = item.others; _c < _d.length; _c++) {
                                        var temp = _d[_c];
                                        var other_name = temp.name;
                                        var target = this.m_page.getNodeByName(other_name);
                                        if (target && target.value == temp.value)
                                            others = true;
                                    }
                                }
                                if (!others)
                                    continue;
                                for (var key in item) {
                                    if (key == 'value')
                                        continue;
                                    node[key] = item[key];
                                }
                                if (item['value'])
                                    node.value = item['value'];
                                config.value = item.value;
                                if (node.selected) {
                                    this.onSliderChange(node);
                                }
                            }
                        }
                    }
                };
                // protected setDefaultValue()
                // {
                // 	for(var item of this._config.items)
                // 	{
                // 		g_evtDispatcher.dispatch(evt_ItemClick,item);
                // 	}
                // }
                SteppingGroup.prototype.onSliderChange = function (item) {
                    parser.g_evtDispatcher.dispatch(parser.evt_ItemClick, item);
                };
                SteppingGroup.prototype.setValue = function (node_name, value) {
                    for (var i = 0; i < this._items.length; i++) {
                        var node = this._items[i];
                        if (node.name == node_name) {
                            //  node.config.value = node.value;
                            node.value = value;
                            this._currentClickItem = node;
                            parser.g_evtDispatcher.dispatch(parser.evt_ItemClick, node);
                            return;
                        }
                    }
                };
                return SteppingGroup;
            }(parser.Group));
            parser.SteppingGroup = SteppingGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
/**
* 默认设置组
*/
var qpq;
(function (qpq) {
    var creator;
    (function (creator) {
        var parser;
        (function (parser) {
            var TimePickerGroup = /** @class */ (function (_super) {
                __extends(TimePickerGroup, _super);
                function TimePickerGroup(config) {
                    return _super.call(this, config) || this;
                }
                TimePickerGroup.prototype.build = function () {
                    _super.prototype.build.call(this);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        item.setUpdateCallBack(this.onSliderChange, this);
                    }
                };
                TimePickerGroup.prototype.setDefaultValue = function () {
                    //   this.onSliderChange(this._items[0].config);
                };
                TimePickerGroup.prototype.toControl = function (node_name, value) {
                    _super.prototype.toControl.call(this, node_name, value);
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var node = _a[_i];
                        var config = node.config;
                        var arr = config.toControl;
                        if (arr == null)
                            continue;
                        for (var _b = 0, arr_10 = arr; _b < arr_10.length; _b++) {
                            var item = arr_10[_b];
                            if (item.relate_value == value) {
                                var others = true;
                                if (item.others != null && item.others.length != 0) {
                                    others = false;
                                    for (var _c = 0, _d = item.others; _c < _d.length; _c++) {
                                        var temp = _d[_c];
                                        var other_name = temp.name;
                                        var target = this.m_page.getNodeByName(other_name);
                                        if (target && target.value == temp.value)
                                            others = true;
                                    }
                                }
                                if (!others)
                                    continue;
                                for (var key in item) {
                                    if (key == 'value')
                                        continue;
                                    node[key] = item[key];
                                }
                                if (item['value'])
                                    node.value = item['value'];
                                config.value = item.value;
                                if (node.selected) {
                                    this.onSliderChange(node.config);
                                }
                            }
                        }
                    }
                };
                TimePickerGroup.prototype.onSliderChange = function (item) {
                    parser.g_evtDispatcher.dispatch(parser.evt_ItemClick, item);
                };
                TimePickerGroup.prototype.setValue = function (node_name, value) {
                    for (var i = 0; i < this._items.length; i++) {
                        var node = this._items[i];
                        if (node.name == node_name) {
                            //  node.config.value = node.value;
                            node.value = value;
                            this._currentClickItem = node;
                            parser.g_evtDispatcher.dispatch(parser.evt_ItemClick, node.config);
                            return;
                        }
                    }
                };
                return TimePickerGroup;
            }(parser.Group));
            parser.TimePickerGroup = TimePickerGroup;
        })(parser = creator.parser || (creator.parser = {}));
    })(creator = qpq.creator || (qpq.creator = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var CommonFuncs = /** @class */ (function () {
        function CommonFuncs() {
        }
        CommonFuncs.prototype.getSelfLoginInfo = function (callBack) {
            if (this._selfLoginInfo != null) {
                if (callBack)
                    callBack.runWith(this._selfLoginInfo);
                return this._selfLoginInfo;
            }
            var self = this;
            gamelib.Api.getUserLoginInfo(Laya.Handler.create(this, function (obj) {
                self._selfLoginInfo = obj.data;
                if (callBack)
                    callBack.runWith(self._selfLoginInfo);
            }));
            return null;
        };
        CommonFuncs.prototype.saveSelfLoginInfo = function (key, data) {
            if (this._selfLoginInfo == null)
                return;
            this._selfLoginInfo[key] = data;
        };
        /**
         * 获得玩家信息
         * @function
         * @DateTime 2018-08-20T16:12:15+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        CommonFuncs.prototype.getSelfInfo = function (callBack) {
            if (this._selfInfo != null) {
                if (callBack)
                    callBack.runWith(this._selfInfo);
                return this._selfInfo;
            }
            var self = this;
            gamelib.Api.getUserIdentity(Laya.Handler.create(this, function (obj) {
                self._selfInfo = obj.data;
                if (callBack)
                    callBack.runWith(self._selfInfo);
            }));
            return null;
        };
        /**
         * 获得玩家联系方式信息
         * @function
         * @DateTime 2018-08-20T16:12:25+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        CommonFuncs.prototype.getSelfContactsInfo = function (callBack) {
            if (this._selfContactsInfo != null) {
                callBack.runWith(this._selfContactsInfo);
                return;
            }
            var self = this;
            gamelib.Api.getUserContacts(Laya.Handler.create(this, function (obj) {
                self._selfContactsInfo = obj.data;
                callBack.runWith(self._selfContactsInfo);
            }));
        };
        /**
         * 保存玩家联系信息
         * @function
         * @DateTime 2018-08-20T16:12:45+0800
         * @param    {string;							                              }} obj [description]
         * @param    {Laya.Handler}           callBack [description]
         */
        CommonFuncs.prototype.saveSelfContactsInfo = function (obj, callBack) {
            var self = this;
            var temp = {};
            utils.tools.copyTo(obj, temp);
            gamelib.Api.updateUserContacts(obj, Laya.Handler.create(this, function (ret) {
                if (ret.ret == 1) {
                    for (var key in temp) {
                        if (self._selfContactsInfo)
                            self._selfContactsInfo[key] = temp[key];
                    }
                    g_uiMgr.showTip("保存成功");
                }
                else {
                    g_uiMgr.showTip(ret.clientMsg);
                }
                if (callBack)
                    callBack.runWith(ret);
            }));
        };
        CommonFuncs.prototype.saveSelfInfo = function (obj, callBack) {
            var self = this;
            var temp = {};
            utils.tools.copyTo(obj, temp);
            gamelib.Api.updateUserInfo(obj, Laya.Handler.create(this, function (ret) {
                if (ret.ret == 1) {
                    for (var key in temp) {
                        if (self._selfInfo)
                            self._selfInfo[key] = temp[key];
                    }
                    if (callBack == null)
                        g_uiMgr.showTip("保存成功");
                }
                else {
                    if (callBack == null)
                        g_uiMgr.showTip(ret.clientMsg);
                }
                if (callBack)
                    callBack.runWith(ret);
            }));
        };
        /**
         * 点击事件统计
         * @function
         * @DateTime 2018-07-30T09:51:11+0800
         */
        CommonFuncs.prototype.eventTongJi = function (evt, value, addData) {
            gamelib.Api.ApplicationEventNotify(evt, value, addData);
        };
        return CommonFuncs;
    }());
    qpq.CommonFuncs = CommonFuncs;
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var data;
    (function (data_1) {
        /**
         * 所有游戏的配置文件
         */
        var ConfigCenter = /** @class */ (function () {
            function ConfigCenter() {
            }
            ConfigCenter.prototype.init = function (call, thisArg, args) {
                if (args === void 0) { args = null; }
                this._callBack = call;
                this._thisArg = thisArg;
                this._params = args;
                this._version = new Date().getTime();
                var pFileName = "";
                if (GameVar.s_app_verify)
                    pFileName = GameVar.platform + "_verify.json?ver=" + this._version;
                else
                    pFileName = GameVar.platform + ".json?ver=" + this._version;
                this._platform_config_url = GameVar.urlParam["ftp"] + "common/" + pFileName;
                Laya.loader.load(this._platform_config_url, Laya.Handler.create(this, this.onPlatformLoaded), null, laya.net.Loader.JSON);
                console.log("url:" + this._platform_config_url);
            };
            ConfigCenter.prototype.onPlatformLoaded = function (bSuccess) {
                if (!bSuccess) {
                    var str = GameVar.platform;
                    if (GameVar.s_app_verify)
                        str += "_verify.json";
                    window.alert("没有找到平台配置！平台:" + str);
                    // g_uiMgr.showAlertUiByArgs({msg:"没有找到平台配置！平台:" + GameVar.platform});
                }
                else {
                    console.log("平台配置载入完成!0");
                    var data = Laya.loader.getRes(this._platform_config_url);
                    this.m_platformData = data;
                    Laya.loader.clearRes(this._platform_config_url);
                    console.log("平台配置载入完成!1");
                    this._games = data.games;
                    this._goldGames = data.goldGames;
                    this._smallGames = data.smallgame;
                    this._gamesObj = {};
                    this._loadedGames = 0;
                    this._gamesToLoad = this._games.length;
                    var platform_config = GameVar.g_platformData;
                    console.log("平台配置载入完成!2");
                    if (data.general) {
                        for (var key in data.general) {
                            platform_config[key] = data.general[key];
                        }
                        if (data.general.bgm) {
                            qpq.g_qpqData.m_bgms = data.general.bgm;
                        }
                        else {
                            qpq.g_qpqData.m_bgms = ["BGM_back", "BGM"];
                        }
                    }
                    if (GameVar.g_platformData['lans']) //语言资源载入完成前的配置
                     {
                        s_lanConif = GameVar.g_platformData['lans'];
                    }
                    console.log("平台配置载入完成!3");
                    var arr = [];
                    for (var i = 0; i < this._games.length; i++) {
                        if (this._games[i].isGold) //金币场
                         {
                            continue;
                        }
                        if (!this.initGamesConfig(this._games[i]))
                            continue;
                        var url = GameVar.urlParam["ftp"] + "common/" + this._games[i].config_id + ".json?ver=" + this._version;
                        arr.push({
                            url: url,
                            type: laya.net.Loader.JSON
                        });
                    }
                    if (this._goldGames) {
                        for (var i = 0; i < this._goldGames.length; i++) {
                            var config = this._goldGames[i];
                            if (!this.initGamesConfig(config))
                                continue;
                            var games = config.games;
                            if (games) {
                                for (var _i = 0, games_1 = games; _i < games_1.length; _i++) {
                                    var con = games_1[_i];
                                    this.initGamesConfig(con);
                                }
                            }
                        }
                    }
                    if (this._smallGames) {
                        for (var _a = 0, _b = this._smallGames; _a < _b.length; _a++) {
                            var config = _b[_a];
                            this.initGamesConfig(config);
                        }
                    }
                    console.log("平台配置载入完成!4");
                    if (arr.length != 0)
                        Laya.loader.load(arr, Laya.Handler.create(this, this.onGameLoaded));
                    else
                        this.onGameLoaded(true);
                }
                console.log("平台配置载入完成!5");
            };
            ConfigCenter.prototype.initGamesConfig = function (config) {
                // if(Boolean(config.isWait) == true)
                //     return false;
                var key = config.key;
                if (key == undefined)
                    key = config.game_code;
                var game_zone_info = getGame_zone_info(key);
                if (game_zone_info == null)
                    return false;
                game_zone_info.game_code = config.game_code;
                config.gz_id = game_zone_info.gz_id;
                config.game_id = game_zone_info.gameid;
                g_childGame.addGameIdConfig(config.gz_id, config.game_id, true);
                return true;
            };
            ConfigCenter.prototype.onGameLoaded = function (bSuccess) {
                console.log("onGameLoaded!0" + bSuccess);
                if (!bSuccess) {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("没有找到游戏配置") + "！" });
                }
                else {
                    console.log("onGameLoaded!1");
                    for (var i = 0; i < this._games.length; i++) {
                        var game = this._games[i];
                        var url = GameVar.common_ftp + game.config_id + ".json?ver=" + this._version;
                        var data = Laya.loader.getRes(url);
                        if (!data) {
                            console.log("游戏名称不匹配：" + this._games[i].name);
                            data = this._games[i];
                        }
                        for (var key in game) {
                            data[key] = game[key];
                        }
                        this._games[i] = data;
                        this._gamesObj[data.config_id] = data;
                        Laya.loader.clearRes(url);
                    }
                    console.log("onGameLoaded!2");
                }
                this.onAllLoaded();
            };
            ConfigCenter.prototype.onAllLoaded = function () {
                console.log("onAllLoaded!1");
                // return;
                this._callBack.apply(this._thisArg, this._params);
                this.creator_default = this._games[0];
            };
            Object.defineProperty(ConfigCenter.prototype, "config_id", {
                /**
                 * 设置焦点游戏config_id，设置后可直接调用焦点游戏配置s_cur_config（仅当选择的游戏在game_lf配置中时有效）
                 * */
                set: function (value) {
                    this.s_cur_config = this.getGameByConfigId(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 收到玩家组局习惯后更新游戏顺序
             * */
            ConfigCenter.prototype.onUpdateOrder = function () {
                if (GameVar.g_platformData['noHabitRecord'])
                    return;
                var habits = qpq.g_qpqData.m_habitRecord;
                if (habits && habits.length) {
                    for (var i = 0; i < this._games.length; i++) {
                        this._games[i].index = qpq.g_qpqData.habit_store_max;
                    }
                    // for(var i:number = 0;i < habits.length; i++) {
                    for (var i = habits.length - 1; i >= 0; i--) {
                        var gz_id = habits[i].gz_id;
                        var mode_id = habits[i].mode_id;
                        var data = this.getConfigByGzIdAndModeId(gz_id, mode_id);
                        if (data) {
                            data.index = i;
                        }
                        else {
                            habits.splice(i, 1);
                            console.log("no game of gz_id:" + gz_id + " mode_id:" + mode_id);
                        }
                    }
                    this._games.sort(this.sortGame);
                }
            };
            ConfigCenter.prototype.sortGame = function (a, b) {
                return a.index - b.index;
            };
            Object.defineProperty(ConfigCenter.prototype, "game_configs", {
                /**
                 * 所有游戏配置列表
                 * */
                get: function () {
                    return this._games;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ConfigCenter.prototype, "goldGames", {
                get: function () {
                    return this._goldGames;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ConfigCenter.prototype, "smallGames", {
                get: function () {
                    return this._smallGames;
                },
                enumerable: true,
                configurable: true
            });
            ConfigCenter.prototype.getStatistics = function (id) {
                return this._statisticsObJ[id];
            };
            /**
             * 根据configId获取游戏配置
             * */
            ConfigCenter.prototype.getGameByConfigId = function (configId) {
                return this._gamesObj[configId];
            };
            ConfigCenter.prototype.getConfigByGameCode = function (game_code, bInGoldGame) {
                if (bInGoldGame === void 0) { bInGoldGame = false; }
                if (!bInGoldGame) {
                    for (var _i = 0, _a = this._games; _i < _a.length; _i++) {
                        var temp = _a[_i];
                        if (temp.game_code == game_code)
                            return temp;
                    }
                }
                if (qpq.g_configCenter.goldGames) {
                    for (var _b = 0, _c = qpq.g_configCenter.goldGames; _b < _c.length; _b++) {
                        var config = _c[_b];
                        if (config.game_code == game_code) {
                            return config;
                        }
                    }
                }
                return null;
            };
            ConfigCenter.prototype.getConfigByGzIdAndModeId = function (gz_id, modeId) {
                modeId = modeId % 100;
                var prefer;
                for (var i = 0; i < this._games.length; i++) {
                    if (this._games[i].gz_id == gz_id) {
                        if (this._games[i].mode_id == modeId) {
                            return this._games[i];
                        }
                        else {
                            prefer = this._games[i];
                        }
                    }
                }
                return prefer;
            };
            ConfigCenter.prototype.getConfigByGzId = function (gz_id) {
                var prefer;
                for (var i = 0; i < this._games.length; i++) {
                    if (this._games[i].gz_id == gz_id) {
                        prefer = this._games[i];
                    }
                }
                if (qpq.g_configCenter.goldGames) {
                    for (var _i = 0, _a = qpq.g_configCenter.goldGames; _i < _a.length; _i++) {
                        var config = _a[_i];
                        if (config.gz_id == gz_id) {
                            prefer = config;
                        }
                    }
                }
                return prefer;
            };
            /** 通过enter_index获得配置文件
             */
            ConfigCenter.prototype.getConfigByIndex = function (enter_index) {
                for (var _i = 0, _a = qpq.g_configCenter.game_configs; _i < _a.length; _i++) {
                    var config = _a[_i];
                    if (config.enter_index == enter_index)
                        return config;
                }
                if (qpq.g_configCenter.goldGames) {
                    for (var _b = 0, _c = qpq.g_configCenter.goldGames; _b < _c.length; _b++) {
                        var config = _c[_b];
                        if (config.enter_index == enter_index)
                            return config;
                    }
                }
                return null;
            };
            /**
             * 通过enter_index获得金币游戏的配置文件
             * @param  {number} enter_index [description]
             * @return {any}                [description]
             */
            ConfigCenter.prototype.getConfigInGoldGamesByIndex = function (enter_index) {
                if (qpq.g_configCenter.goldGames) {
                    for (var _i = 0, _a = qpq.g_configCenter.goldGames; _i < _a.length; _i++) {
                        var config = _a[_i];
                        if (config.enter_index == enter_index)
                            return config;
                    }
                }
                return null;
            };
            /**
             * 根据game_id和mode_id来获取游戏config
             * */
            ConfigCenter.prototype.getConfigGM = function (gameId, modeId) {
                modeId = modeId % 100;
                for (var i = 0; i < this._games.length; i++) {
                    if (this._games[i].game_id == gameId && this._games[i].mode_id == modeId) {
                        return this._games[i];
                    }
                }
            };
            ConfigCenter.prototype.onStatisticsLoaded = function (data) {
                this._statistics = data.games;
                this._statisticsObJ = {};
                for (var i = 0; i < this._statistics.length; i++) {
                    this._statisticsObJ[this._statistics[i].id] = this._statistics[i];
                }
            };
            return ConfigCenter;
        }());
        data_1.ConfigCenter = ConfigCenter;
    })(data = qpq.data || (qpq.data = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var data;
    (function (data_2) {
        /**
         *
         * @author
         *
         */
        var EffortData = /** @class */ (function (_super) {
            __extends(EffortData, _super);
            function EffortData(data) {
                if (data === void 0) { data = null; }
                var _this = _super.call(this) || this;
                /**
                 * 类型
                 * @type {number}
                 */
                _this.m_type = 0;
                /**
                 * 描述
                 * @type {string}
                 */
                _this.m_des = "";
                /**
                 * 当前完成数量
                 * @type {number}
                 */
                _this.m_finishNumber = 0;
                /**
                 * 当前完成数量
                 * @type {number}
                 */
                _this.m_totalNumber = 0; //当前完成数量
                _this._fisnishTime = "";
                /**
                 * 1进行中 2完成未领取 3已领取
                 * @type {number}
                 */
                _this.m_status = 0;
                _this.m_money = 0;
                if (data)
                    _this.update(data);
                return _this;
            }
            EffortData.PaseData = function (data) {
                EffortData.s_list = EffortData.s_list || [];
                EffortData.s_list.length = 0;
                for (var i = 0; i < data.effort_Num.length; i++) {
                    var eff = new qpq.data.EffortData(data.effort_Num[i]);
                    EffortData.s_list.push(eff);
                }
                EffortData.Order();
            };
            EffortData.UpdateEffortData = function (data) {
                var ed = EffortData.getEffortDataById(data.effort_Id);
                if (ed == null) {
                    console.log("更新成数据出错" + data.effort_Id);
                    return;
                }
                ed.m_status = data.effort_Status;
                ed.m_finishNumber = data.effort_FinishNumber;
                ed.m_totalNumber = data.effort_TotalNumber;
                EffortData.Order();
            };
            EffortData.UpdateStatus = function (id, type) {
                if (type === void 0) { type = 3; }
                var ed;
                for (var i = 0, len = EffortData.s_list.length; i < len; i++) {
                    if (EffortData.s_list[i].m_id == id) {
                        EffortData.s_list[i].m_status = type;
                        ed = EffortData.s_list[i];
                        break;
                    }
                }
                EffortData.Order();
                return ed;
            };
            Object.defineProperty(EffortData, "s_getNum", {
                get: function () {
                    var temp = 0;
                    for (var i = 0, len = EffortData.s_list.length; i < len; i++) {
                        if (EffortData.s_list[i].m_status == 3) {
                            temp += 1;
                        }
                    }
                    return temp;
                },
                enumerable: true,
                configurable: true
            });
            EffortData.Order = function () {
                EffortData.s_list.sort(EffortData.SortFun);
            };
            EffortData.getEffortDataById = function (id) {
                for (var i = 0; i < EffortData.s_list.length; i++) {
                    if (EffortData.s_list[i].m_id == id) {
                        return EffortData.s_list[i];
                    }
                }
                return new EffortData();
            };
            EffortData.SortFun = function (a, b) {
                if (a.m_status == 2 && b.m_status != 2) {
                    return -1;
                }
                if (a.m_status != 2 && b.m_status == 2) {
                    return 1;
                }
                if (a.m_status > b.m_status)
                    return -1;
                return a.m_id - b.m_id;
            };
            EffortData.prototype.update = function (data) {
                this.m_id = data.effort_Id;
                this.m_type = data.type;
                this.m_status = data.effort_Status;
                this.m_des = data.effort_Description;
                this.m_money = data.effort_RewardsMoney;
                this.m_finishNumber = data.effort_FinishNumber;
                this.m_totalNumber = data.effort_TotalNumber;
                this.setFinishTime(data.effort_FinishTime * 1000);
                this.m_name = data.effort_Name;
            };
            EffortData.prototype.setFinishTime = function (value) {
                this._fisnishTime = utils.StringUtility.GetTimeString(value);
            };
            Object.defineProperty(EffortData.prototype, "m_finishTime", {
                get: function () {
                    return this._fisnishTime;
                },
                enumerable: true,
                configurable: true
            });
            EffortData.s_list = null;
            return EffortData;
        }(gamelib.data.GameData));
        data_2.EffortData = EffortData;
    })(data = qpq.data || (qpq.data = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var data;
    (function (data) {
        /**
         * 组局信息
         */
        var GroupInfoData = /** @class */ (function () {
            function GroupInfoData() {
            }
            GroupInfoData.addGroupInfo = function (info) {
                GroupInfoData.s_list[info.groupId] = info;
            };
            GroupInfoData.getInfoByGroupId = function (groupId) {
                return GroupInfoData.s_list[groupId];
            };
            GroupInfoData.getInfoByGz_id = function (gz_id, validation) {
                for (var key in GroupInfoData.s_list) {
                    if (GroupInfoData.s_list[key].gz_id == gz_id && GroupInfoData.s_list[key].gz_id == gz_id && GroupInfoData.s_list[key].validation == validation)
                        return GroupInfoData.s_list[key];
                    return null;
                }
            };
            GroupInfoData.removeGameInfo = function (groupId) {
                delete GroupInfoData.s_list[groupId];
            };
            GroupInfoData.s_list = {};
            return GroupInfoData;
        }());
        data.GroupInfoData = GroupInfoData;
    })(data = qpq.data || (qpq.data = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var data;
    (function (data_3) {
        var PlayerData = /** @class */ (function (_super) {
            __extends(PlayerData, _super);
            function PlayerData() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.m_signaName = "";
                _this.m_zhanNum = 0;
                //俱乐部会员信息
                _this.m_clubVipLevel = 0;
                return _this;
            }
            PlayerData.onData0x0F01 = function (data) {
                PlayerData.s_self = PlayerData.getPlayerData(data.playerId);
                var setOldMoney = false;
                var money, diamond;
                if (gamelib.data.UserInfo.s_self) {
                    setOldMoney = true;
                    money = gamelib.data.UserInfo.s_self.m_money;
                    diamond = gamelib.data.UserInfo.s_self.m_diamond;
                }
                gamelib.data.UserInfo.s_self = PlayerData.s_self;
                PlayerData.s_self.read0x0F01(data);
                if (setOldMoney) {
                    PlayerData.s_self.m_money = money;
                    PlayerData.s_self.m_diamond = diamond;
                }
            };
            PlayerData.getPlayerData = function (id) {
                var pd = PlayerData.s_list[id];
                if (pd == null) {
                    pd = new PlayerData();
                    pd.m_id = id;
                    PlayerData.s_list[id] = pd;
                }
                return pd;
            };
            PlayerData.prototype.read0x0F01 = function (data) {
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
            };
            PlayerData.s_list = {};
            return PlayerData;
        }(gamelib.data.UserInfo));
        data_3.PlayerData = PlayerData;
    })(data = qpq.data || (qpq.data = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var data;
    (function (data_4) {
        var QpqData = /** @class */ (function () {
            function QpqData() {
                this.habit_store_max = 100; //保存玩家建房数据（习惯）的列表长度上限        
                this.new_table = false; //是否显示牌桌红点
                this.huodong_list = [];
                this.m_habitRecord = [];
            }
            QpqData.prototype.checkSiginIcon = function () {
                if (this.m_siginData == null)
                    return;
                for (var _i = 0, _a = this.m_siginData.list; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    if (temp.statue == 1) {
                        return true;
                    }
                }
                if (this.m_siginData.list_lx) {
                    for (var _b = 0, _c = this.m_siginData.list_lx; _b < _c.length; _b++) {
                        var temp = _c[_b];
                        if (temp.statue == 1) {
                            return true;
                        }
                    }
                }
                if (this.m_siginData.list_lj) {
                    for (var _d = 0, _e = this.m_siginData.list_lj; _d < _e.length; _d++) {
                        var temp = _e[_d];
                        if (temp.statue == 1) {
                            return true;
                        }
                    }
                }
                return false;
            };
            /**
             * 0x00F3获得组局信息
             * @param data
             */
            QpqData.prototype.onGetGroupInfo = function (data) {
                this.m_groupList = this.m_groupList || [];
                for (var i = 0; i < this.m_groupList.length; i++) {
                    if (this.m_groupList[i].groupId == data.groupId) {
                        this.m_groupList[i] = data;
                        return;
                    }
                }
                this.m_groupList.push(data);
            };
            QpqData.prototype.getGroupInfoByGroupId = function (groupId) {
                for (var _i = 0, _a = this.m_groupList; _i < _a.length; _i++) {
                    var info = _a[_i];
                    if (info.groupId == groupId)
                        return info;
                }
                return null;
            };
            QpqData.prototype.getGroupInfoByGz_id = function (gz_id, validation) {
                for (var _i = 0, _a = this.m_groupList; _i < _a.length; _i++) {
                    var info = _a[_i];
                    if (info.gz_id == gz_id && info.validation == validation)
                        return info;
                }
                return null;
            };
            /**
             * 操作组局
             * @param data
             */
            QpqData.prototype.onHandleGroup = function (data) {
                if (data.result != 1) {
                    console.log("0x00F6操作失败!");
                    return;
                }
                if (data.handle == 4) //解散s
                 {
                    for (var i = 0; i < this.m_groupList.length; i++) {
                        var item = this.m_groupList[i];
                        if (item.groupId == data.groupId) {
                            this.m_groupList.splice(i, 1);
                            return;
                        }
                    }
                }
            };
            /**
             * 请求网络配置
             */
            QpqData.prototype.requestWebConfig = function () {
                console.time("requestWebConfig");
                // var url:string = GameVar.urlParam['ftp'] + "/scripts/circle_config.php";
                // utils.tools.http_request(url,
                // 	{
                // 		platform:GameVar.platform,
                // 		pid:GameVar.pid,
                // 		action:"circle_config"
                // 	},
                // 	"get",this.onWebConfigLoade.bind(this));	
                window["application_circle_info"](GameVar.platform, GameVar.pid, this.onWebConfigLoade, this);
            };
            QpqData.prototype.onWebConfigLoade = function (data) {
                data = data.data;
                console.timeEnd("requestWebConfig");
                // g_uiMgr.showAlertUiByArgs({"msg":"消耗时间:" +(Laya.timer.currTimer - this._test_time)});
                this.notice_config = data.hallBulletin;
                this.pmd_config = data.Pmd;
                var temp = ["<left>", "<right>", "<center>"];
                this.day_notice_config = data.greenGameBulletin;
                this.day_notice_config.align = "left";
                var gg = this.day_notice_config.txt;
                if (gg != null) {
                    for (var i = 0; i < temp.length; i++) {
                        var str = temp[i];
                        var index = gg.indexOf(str);
                        if (index != -1) {
                            if (i == 0)
                                this.day_notice_config.align = "left";
                            else if (i == 1)
                                this.day_notice_config.align = "right";
                            else
                                this.day_notice_config.align = "center";
                            gg = gg.slice(index + str.length);
                        }
                    }
                }
                this.day_notice_config.txt = gg;
                this.huodong_list.length = 0;
                var temp1 = null;
                if (typeof data.huodong == "string") {
                    if (data.huodong != "")
                        this._huodongData = JSON.parse(data.huodong);
                }
                else {
                    this._huodongData = data.huodong;
                }
                this.checkHuoDong();
                if (data.promots) {
                    if (data.owner_promots) {
                        GameVar.m_QRCodeUrl_Vip = data.owner_promots.promot1;
                        GameVar.m_QRCodeUrl_Vip = GameVar.m_QRCodeUrl_Vip || data.owner_promots.promot2;
                    }
                    GameVar.m_QRCodeUrl = GameVar.m_QRCodeUrl || data.promots.promot1;
                    GameVar.m_QRCodeUrl = GameVar.m_QRCodeUrl || data.promots.promot2;
                }
                GameVar.m_QRCodeUrl = GameVar.m_QRCodeUrl || window['application_share_url']();
                g_signal.dispatch("updateHuoDongData", 0);
                this.showPmd();
                this.checkNotice();
            };
            QpqData.prototype.showPmd = function () {
                g_uiMgr.showPMD(qpq.g_qpqData.pmd_config.txt);
                var time_grap = qpq.g_qpqData.pmd_config.timer;
                if (!isNaN(time_grap) && time_grap != 0) {
                    Laya.timer.once(time_grap, this, this.showPmd);
                }
            };
            /**
             * 检测活动是否可以显示
             */
            QpqData.prototype.checkHuoDong = function () {
                if (this._huodongData == null || GameVar.s_loginSeverTime == 0 || isNaN(GameVar.s_loginSeverTime))
                    return;
                if (g_net_configData.m_waitConfig)
                    return;
                this.huodong_list.length = 0;
                var bShowHuoDong = false;
                for (var i = 0; i < this._huodongData.length; i++) {
                    if (this.isHuoDongTime(this._huodongData[i])) {
                        this.huodong_list.push(this._huodongData[i]);
                        var login_show = this._huodongData[i].login_show;
                        if (login_show && login_show != "false") {
                            bShowHuoDong = true;
                        }
                    }
                }
                if (bShowHuoDong) {
                    var cur = GameVar.s_loginSeverTime;
                    var lastShow = g_net_configData.getConfig("lastShowTime_Notice");
                    if (isNaN(lastShow))
                        lastShow = 0;
                    var past = cur - lastShow;
                    if (past >= 3600 * 24) {
                        g_signal.dispatch('showHuoDongUi', 0);
                        g_net_configData.addConfig("lastShowTime_Notice", cur);
                        g_net_configData.saveConfig();
                    }
                }
            };
            /**
             * 检测是否可以显示公告
             * @return {boolean}
             */
            QpqData.prototype.checkNotice = function () {
                if (this.day_notice_config == null || GameVar.s_loginSeverTime == 0 || isNaN(GameVar.s_loginSeverTime))
                    return false;
                if (g_net_configData.m_waitConfig)
                    return false;
                if (this.day_notice_config.show) {
                    var cur = GameVar.s_loginSeverTime;
                    var lastShow = g_net_configData.getConfig("lastShowTime");
                    if (isNaN(lastShow))
                        lastShow = 0;
                    var past = cur - lastShow;
                    if (past >= 3600 * 24) {
                        g_signal.dispatch("showNoticeUi", qpq.g_qpqData.day_notice_config);
                        g_net_configData.addConfig("lastShowTime", cur);
                        g_net_configData.saveConfig();
                    }
                }
                return false;
            };
            /**
             * 请求用户习惯数据
             */
            QpqData.prototype.requestHabitData = function () {
                sendNetMsg(0x0F08, 1, "");
            };
            /**
             * 解析用户习惯数据
             * @param data
             */
            QpqData.prototype.parseHabitData = function (data) {
                if (data.config) {
                    try {
                        this.m_habitRecord = JSON.parse(data.config).groupHabits;
                        for (var i = this.m_habitRecord.length - 1; i >= 0; i--) {
                            if (this.m_habitRecord[i].gz_id == null) {
                                if (this.m_habitRecord[i].length == 15) {
                                    this.m_habitRecord[i] = this.transfer(this.m_habitRecord[i]);
                                }
                                else {
                                    this.m_habitRecord.splice(i, 1);
                                }
                            }
                        }
                    }
                    catch (e) {
                        this.m_habitRecord = [];
                    }
                }
                else {
                    this.m_habitRecord = [];
                }
                for (var i = 0; i < this.m_habitRecord.length; i++) {
                    if (typeof this.m_habitRecord[i] == "string") {
                        this.m_habitRecord[i] = JSON.parse(this.m_habitRecord[i]);
                    }
                }
            };
            QpqData.prototype.transfer = function (dataVec) {
                var back = JSON.parse(dataVec[13]);
                back.mode_id = dataVec[14];
                if (back.mode_id > 100) {
                    back.mode_id = back.mode_id % 100;
                    back.money_type = 1024;
                }
                else {
                    back.money_type = 1023;
                }
                back.gz_id = dataVec[0];
                back.game_id = dataVec[1];
                back.room_name = dataVec[12];
                return back;
            };
            /**
             * 创建游戏，保存用户习惯
             * @param data
             */
            QpqData.prototype.onCreateGame = function (data) {
                var toRemove = (this.m_habitRecord.length >= this.habit_store_max);
                for (var i = 0; i < this.m_habitRecord.length; i++) {
                    var record = this.m_habitRecord[i];
                    if (record.gz_id == data.gz_id && record.mode_id == data.mode_id) {
                        this.m_habitRecord.splice(i, 1);
                        toRemove = false;
                        break;
                    }
                }
                this.m_habitRecord.unshift(data);
                if (toRemove) {
                    this.m_habitRecord.pop();
                }
                sendNetMsg(0x0F08, 0, JSON.stringify({ groupHabits: this.m_habitRecord }));
            };
            QpqData.prototype.getHabitData = function (config) {
                if (this.m_habitRecord && this.m_habitRecord.length) {
                    for (var i = 0; i < this.m_habitRecord.length; i++) {
                        if (this.m_habitRecord[i].gz_id == config.gz_id && this.inSameMode(this.m_habitRecord[i].mode_id, config.mode_id)) {
                            return this.m_habitRecord[i];
                        }
                    }
                }
            };
            QpqData.prototype.inSameMode = function (a, b) {
                if (isNaN(a) || isNaN(b))
                    return true;
                return a % 100 == b % 100;
            };
            /**
             * 获得指定游戏和局数的折扣信息
             * @param config
             * @param roundNum
             */
            QpqData.prototype.getGameSale = function (config, roundNum) {
                var back = this.getSaleConfig(config.game_id, config.mode_id, roundNum);
                if (back && this.checkValid(back)) {
                    return back;
                }
                return null;
            };
            /**
             * 检测是否是在折扣时间内
             * @param data
             */
            QpqData.prototype.checkValid = function (data) {
                var curSeverTime = GameVar.s_loginSeverTime;
                if (curSeverTime > data.startTime && curSeverTime < data.endTime) {
                    return true;
                }
                return false;
            };
            /**
             * 获得指定游戏和模式的折扣信息
             * @param gameId
             * @param modeId
             * @param roundNum
             */
            QpqData.prototype.getSaleConfig = function (gameId, modeId, roundNum) {
                if (roundNum === void 0) { roundNum = 0; }
                if (this.m_bigSaleList == null)
                    return;
                for (var i = 0; i < this.m_bigSaleList.length; i++) {
                    if (this.m_bigSaleList[i].gameId == gameId) {
                        var list = this.m_bigSaleList[i].configs;
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].modeId % 100 == modeId && (roundNum == 0 || list[j].roundNum == roundNum)) {
                                return list[j];
                            }
                        }
                        break;
                    }
                }
                return null;
            };
            /**
             * 获取一个游戏是否打折中
             * @game_id 分区id
             * @modeId 模式id，
             * @returns {boolean}
             */
            QpqData.prototype.getGameSaleById = function (game_id, modeId) {
                if (modeId === void 0) { modeId = 0; }
                for (var i = 0; i < this.m_bigSaleList.length; i++) {
                    if (this.m_bigSaleList[i].gameId == game_id) {
                        var list = this.m_bigSaleList[i].configs;
                        for (var j = 0; j < list.length; j++) {
                            if (modeId) {
                                if (list[j].modeId % 100 == modeId && this.checkValid(list[j])) {
                                    return true;
                                }
                            }
                            else {
                                if (this.checkValid(list[j])) {
                                    return true;
                                }
                            }
                        }
                        break;
                    }
                }
            };
            /**
             * 获得分享数据
             * @param data
             */
            QpqData.prototype.getShare = function (data) {
                var back = {};
                this.copyCommon(data, back);
                this.copyExtra(data, back);
                back.platform = GameVar.platform;
                return back;
            };
            /**
             * 通过指定的配置文件来申请组局。不展示创建界面，五子棋
             * @param config
             */
            QpqData.prototype.createGameByDefaultConfig = function (config) {
                var obj = {};
                obj.gz_id = config.gz_id;
                obj.game_id = config.game_id;
                obj.money_type = config.money_type;
                obj.mode_id = config.mode_id;
                for (var i = 0; i < config.groups.length; i++) {
                    if (config.groups[i].name) {
                        obj[config.groups[i].name] = config.groups[i].value;
                    }
                    else {
                        for (var _i = 0, _a = config.groups[i].items; _i < _a.length; _i++) {
                            var temp = _a[_i];
                            if (temp.name == null)
                                continue;
                            obj[temp.name] = temp.value;
                        }
                    }
                }
                sendNetMsg(0x00F1, JSON.stringify(obj));
                playButtonSound();
                g_signal.dispatch("showQpqLoadingUi", { msg: getDesByLan("创建牌局中") + "..." });
                this.onCreateGame(obj);
            };
            QpqData.prototype.copyCommon = function (data, back) {
                back.gz_id = data.gz_id;
                back.gameId = data.gameID;
                back.validation = data.validation;
                back.wxTips = false;
                back.fd = data.multipleMax;
                back.js = data.roundMax;
                back.groupId = data.groupId;
            };
            QpqData.prototype.copyExtra = function (data, back) {
                var extra = {};
                switch (data.gameID) {
                    case 14:
                    case 20:
                    case 22:
                    case 24:
                    case 26:
                        extra = JSON.parse(data.gamePlayJson);
                        extra.playerSum = data.playerMaxNum;
                        break;
                    default: //不知道有问题没wx
                        extra = JSON.parse(data.gamePlayJson);
                        extra.playerSum = data.playerMaxNum;
                        break;
                }
                extra.mode_id = data.gameMode;
                back.addDatas = extra;
            };
            QpqData.prototype.isHuoDongTime = function (obj) {
                //2017-12-21 00:00:00
                var loginTime = GameVar.s_loginSeverTime;
                // var huoDongTime: string = obj.time;
                // if(huoDongTime.length == 0)
                //     return true;
                // var arr: Array<string> = obj.start_time;//huoDongTime.split("-");
                var temp = obj.start_time;
                var year = parseInt(temp.substr(0, 4));
                var month = parseInt(temp.substr(5, 2));
                var day = parseInt(temp.substr(8, 2));
                var hour = parseInt(temp.substr(11, 2));
                var min = parseInt(temp.substr(14, 2));
                var data = new Date(year, month - 1, day, hour, min);
                var start = data.getTime();
                temp = obj.end_time;
                year = parseInt(temp.substr(0, 4));
                month = parseInt(temp.substr(5, 2));
                day = parseInt(temp.substr(8, 2));
                hour = parseInt(temp.substr(11, 2));
                min = parseInt(temp.substr(14, 2));
                data = new Date(year, month - 1, day, hour, min);
                var end = data.getTime();
                var now = loginTime * 1000;
                var b = now >= start && now <= end;
                console.log("isHuoDongTime: start:" + start + " end:" + end + " now:" + now + getDesByLan("是否登陆显示") + ":" + b);
                return b;
            };
            return QpqData;
        }());
        data_4.QpqData = QpqData;
    })(data = qpq.data || (qpq.data = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var BaseHall = /** @class */ (function (_super) {
            __extends(BaseHall, _super);
            // private _uiObjMap:any;
            function BaseHall(url) {
                var _this = this;
                url = url || "qpq/Art_Hall";
                _this = _super.call(this, url) || this;
                _this._bFirstLoginDayLogic = false;
                return _this;
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
            BaseHall.prototype.registrerBtnHandle = function (signalMsg, btn, handle, needCreate) {
                this._uiClassMap = this._uiClassMap || {};
                if (btn == null && handle == null) {
                    console.log("按钮的名字和处理方法不能同时为null");
                    return;
                }
                var obj;
                if (handle != null) {
                    obj = qpq.registrerSignalHandle(signalMsg, handle, needCreate);
                }
                if (btn == null)
                    return obj;
                this._commonBtn.removeBtn(btn);
                if (this._uiClassMap[btn]) {
                    console.log("已经注册过按钮的点击回掉");
                    return obj;
                }
                this._uiClassMap[btn] = signalMsg;
                this.addBtnToListener(btn);
                return obj;
            };
            BaseHall.prototype.onReciveNetMsg = function () {
                sendNetMsg(0x2217, 1); //签到
                sendNetMsg(0x2217, 2); //
            };
            BaseHall.prototype.init = function () {
                this._commonBtn = new qpq.HallCommonBtns(this._res);
                this._res["img_head"].skin = GameVar.playerHeadUrl;
                // this._res["txt_name"].text = utils.StringUtility.getNameEx(GameVar.nickName,7);
                utils.tools.setLabelDisplayValue(this._res["txt_name"], GameVar.nickName);
                this._res["txt_id"].text = "ID:" + GameVar.pid;
                this._ani_out = this._res["ani1"];
                this._ani_in = this._res["ani1_0"];
                g_uiMgr.m_pmd.setRes(this._res["img_pmd"]);
                this.addBtnToListener("btn_roomlist");
                this.addBtnToListener("btn_zhanji");
                this.addBtnToListener("huodong");
                this.addBtnToListener("img_head");
                this.addBtnToListener("b_share");
                this.addBtnToListener("btn_gonggao");
                this.addBtnToListener("btn_huodong");
                this.addBtnToListener("btn_share");
                if (this._res["txt_money"]) {
                    this._res["txt_money"].text = "";
                }
                if (this._res["txt_diamond"]) {
                    this._res["txt_diamond"].text = "";
                }
            };
            BaseHall.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                if (this._commonBtn) {
                    this._commonBtn.show();
                    this._commonBtn.update();
                }
                this.updateHuoDongIcon();
                this.updateNewIcons();
                this.showCallBoard();
                g_signal.add(this.onLocalSignal, this);
                this.updateMoney();
                gamelib.platform.autoShare();
            };
            BaseHall.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this._commonBtn) {
                    this._commonBtn.close();
                }
                g_signal.remove(this.onLocalSignal, this);
            };
            /**
             * 显示公告板
             */
            BaseHall.prototype.showCallBoard = function () {
                if (qpq.g_qpqData.notice_config == null || this._res["txt_gonggao"] == null)
                    return;
                this._res["b_l"].visible = qpq.g_qpqData.notice_config.visible;
                var txt = this._res["txt_gonggao"];
                txt.text = qpq.g_qpqData.notice_config.txt;
                txt.mouseEnabled = false;
                txt.editable = false;
            };
            BaseHall.prototype.updateHuoDongIcon = function () {
                if (this._res["b_hongdong"] == null)
                    return;
                if (qpq.g_qpqData.huodong_list.length == 0) {
                    this._res["b_hongdong"].removeSelf();
                }
                else {
                    this._res["b_hongdong"].visible = true;
                }
                if (this._res["b_share"])
                    this._res["b_share"].visible = false; //活动分享按钮
            };
            BaseHall.prototype.checkOpen = function (id) {
                var gi = qpq.g_configCenter.getConfigByIndex(id);
                if (gi == null)
                    return this.checkOpenInGoldGame(id);
                if (this.checkOpenByPid()) {
                    return true;
                }
                if (gi.isWait) {
                    if (GameVar.common_ftp.indexOf('.dev.') != -1) {
                        return true;
                    }
                    else {
                        g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("游戏即将开放") });
                    }
                    return false;
                }
                return true;
            };
            BaseHall.prototype.checkOpenInGoldGame = function (id) {
                if (this.checkOpenByPid()) {
                    return true;
                }
                var gi = qpq.g_configCenter.getConfigInGoldGamesByIndex(id);
                if (gi.isWait) {
                    if (GameVar.common_ftp.indexOf('open.dev.8z') != -1) {
                        return true;
                    }
                    else {
                        g_uiMgr.showAlertUiByArgs({ msg: "游戏没开放" });
                    }
                    return false;
                }
                return true;
            };
            BaseHall.prototype.checkOpenByPid = function () {
                if (GameVar.g_platformData['testId']) {
                    var str = GameVar.g_platformData['testId'];
                    if (str.indexOf(GameVar.pid + "") != -1)
                        return true;
                }
                return false;
            };
            BaseHall.prototype.onLocalSignal = function (msg, data) {
                switch (msg) {
                    case gamelib.GameMsg.UPDATEUSERINFODATA:
                        this._res["img_head"].skin = GameVar.playerHeadUrl;
                        // this._res["txt_name"].text = utils.StringUtility.getNameEx(GameVar.nickName,7);
                        utils.tools.setLabelDisplayValue(this._res["txt_name"], GameVar.nickName);
                        this._res["txt_id"].text = "ID:" + GameVar.pid;
                        break;
                    case "updateHuoDongData":
                        this.updateHuoDongIcon();
                        g_uiMgr.showPMD(qpq.g_qpqData.pmd_config.txt);
                        break;
                    case "onDailogClose":
                        if (utils.tools.is(data, "gamelib.alert.AlertUi"))
                            return;
                        if (this._ani_in && this._ani_in != this._currentAni) {
                            this._ani_in.play(0, false);
                            this._currentAni = this._ani_in;
                        }
                        break;
                    case "onDailogOpen":
                        if (utils.tools.is(data, "gamelib.alert.AlertUi"))
                            return;
                        if (this._ani_out && this._ani_out != this._currentAni) {
                            this._ani_out.play(0, false);
                            this._currentAni = this._ani_out;
                        }
                        break;
                }
            };
            BaseHall.prototype.updateNewIcons = function (data) {
                if (data === void 0) { data = null; }
                if (this._res["newIcon_shop"])
                    this._res["newIcon_shop"].visible = false;
                if (this._res["newIcon_zhanji"])
                    this._res["newIcon_zhanji"].visible = false;
                if (this._res["newIcon_roomlist"])
                    this._res["newIcon_roomlist"].visible = qpq.g_qpqData.new_table;
                if (data == null)
                    return;
                switch (data.type) {
                    case 1: //签到
                        if (this._res["newIcon_qianDao"])
                            this._res["newIcon_qianDao"].visible = data.num > 0;
                        break;
                    case 2: //邮件
                        if (this._res['newIcon_mail'])
                            this._res["newIcon_mail"].visible = data.num > 0;
                        break;
                }
            };
            BaseHall.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
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
                        if (g_net_configData.getConfig('firstLogin') == undefined) {
                            this.onFirstLogin();
                            g_net_configData.addConfig('firstLogin', false);
                            g_net_configData.saveConfig();
                        }
                        if (!this._bFirstLoginDayLogic && g_net_configData.m_bFirstLoginDay) {
                            this._bFirstLoginDayLogic = true;
                            this.onFirstLoginDay();
                        }
                        break;
                    case 0x2217:
                        this.updateNewIcons(data);
                        break;
                }
            };
            /**
             * 第一次登录游戏、需要做的处理。每个游戏自己实现
             */
            BaseHall.prototype.onFirstLogin = function () {
            };
            /**
             * 每天第一次登录
             */
            BaseHall.prototype.onFirstLoginDay = function () {
            };
            BaseHall.prototype.updateMoney = function () {
                if (qpq.data.PlayerData.s_self == null)
                    return;
                if (this._res["txt_money"]) {
                    this._res["txt_diamond"].text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
                    this._res["txt_money"].text = qpq.data.PlayerData.s_self.getMoneyDes();
                }
                else {
                    this._res["txt_diamond"].text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
                }
            };
            BaseHall.prototype.onClickObjects = function (evt) {
                playButtonSound();
                evt.stopPropagation();
                console.log("basehall onClickObjects" + evt.currentTarget.name);
                switch (evt.currentTarget.name) {
                    case "btn_roomlist": //房间列表
                        g_signal.dispatch(qpq.SignalMsg.showTableListUi, 0);
                        this.updateNewIcons();
                        break;
                    case "btn_zhanji": //战绩
                        g_signal.dispatch("showZhanjiUi", 0);
                        break;
                    case "btn_huodong":
                    case "huodong":
                    case "b_share":
                        g_signal.dispatch(qpq.SignalMsg.showHuoDongUi, 0);
                        if (qpq.g_commonFuncs) {
                            qpq.g_commonFuncs.eventTongJi("homepage", '活动');
                        }
                        break;
                    case "img_head":
                        g_signal.dispatch(qpq.SignalMsg.showUserInfoUi_Self, 0);
                        break;
                    case "btn_share":
                        if (GameVar.g_platformData['share_friend'])
                            qpq.appShare(true, null, null, true);
                        else
                            qpq.appShare(true);
                        break;
                    case "btn_gonggao":
                        g_signal.dispatch(qpq.SignalMsg.showNoticeUi, qpq.g_qpqData.day_notice_config);
                        break;
                    default: //创建房间
                        this.onBtnHandle(evt.currentTarget.name, 0);
                        break;
                }
            };
            BaseHall.prototype.onBtnHandle = function (btn, data) {
                if (this._uiClassMap == null)
                    return;
                var signalMsg = this._uiClassMap[btn];
                if (signalMsg == null)
                    return;
                g_signal.dispatch(signalMsg, data);
            };
            return BaseHall;
        }(gamelib.core.Ui_NetHandle));
        hall.BaseHall = BaseHall;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var Banner = /** @class */ (function () {
        function Banner(res) {
            this._grap = 3000; //3秒切换一次
            this._index = 0;
            this._box = res['img_guanggao'].parent;
            var image1 = res['img_guanggao'];
            var image2 = new Laya.Image();
            image2.width = image1.width;
            image2.height = image1.height;
            this._box.addChild(image2);
            image2.x = image1.x + image1.width;
            image2.y = image1.y;
            // image1.skin = "";
            this._image_list = [];
            this._image_list.push(image1, image2);
            image1.mouseEnabled = image2.mouseEnabled = true; //on不会对mouseEnabled = false的对象处理
            image1.on(Laya.Event.CLICK, this, this.onClick);
            image2.on(Laya.Event.CLICK, this, this.onClick);
            image1.mouseEnabled = image2.mouseEnabled = false;
        }
        Banner.prototype.onClick = function (evt) {
            if (this._list == null)
                return;
            var hd = evt.currentTarget['__hd'];
            if (hd && hd.callback) {
                try {
                    eval(hd.callback);
                }
                catch (e) {
                }
            }
        };
        Banner.prototype.setData = function () {
            if (this._list != null)
                return;
            this._list = qpq.g_qpqData.huodong_list;
            // this._list = this._list.concat(this._list).concat(this._list);
            // this._list.push({img_url:"huodong/huodong_2_1.jpg"},{img_url:"huodong/huodong_3_1.jpg"});
            if (this._list.length == 0) {
                this._list = null;
                this._image_list[0].mouseEnabled = this._image_list[1].mouseEnabled = false;
                return;
            }
            if (this._list.length == 1) {
                // this._image_list[0].x = 0;				
                this.setUrl(this._list[0], this._image_list[0]);
                this._image_list[0].mouseEnabled = true;
                this._image_list[1].mouseEnabled = false;
            }
            else {
                this._image_list[0].mouseEnabled = this._image_list[1].mouseEnabled = true;
                this._index = 0;
                this.setUrl(this._list[0], this._image_list[0]);
                this.setUrl(this._list[1], this._image_list[1]);
                Laya.timer.once(this._grap, this, this.showImage);
            }
        };
        Banner.prototype.showImage = function () {
            var hd = this._list[this._index++];
            if (this._index >= this._list.length)
                this._index = 0;
            var image1 = this._image_list.shift();
            var image2 = this._image_list.shift();
            // console.log(image1.x,image2.x);
            image1.x = 0;
            image2.x = image1.width;
            Laya.Tween.to(image1, { x: -image1.width }, 200);
            Laya.Tween.to(image2, { x: 0 }, 200);
            this._image_list.push(image2, image1);
            this.setUrl(hd, image2);
            Laya.timer.once(this._grap, this, this.showImage);
        };
        Banner.prototype.setUrl = function (hd, image) {
            if (hd.img_url.indexOf("http") == -1)
                image.skin = GameVar.urlParam['request_host'] + hd.img_url;
            else
                image.skin = hd.img_url;
            image['__hd'] = hd;
        };
        return Banner;
    }());
    qpq.Banner = Banner;
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var BindPhoneUi = /** @class */ (function (_super) {
            __extends(BindPhoneUi, _super);
            function BindPhoneUi() {
                return _super.call(this, "qpq/Art_BdPhone") || this;
            }
            BindPhoneUi.prototype.init = function () {
                _super.prototype.init.call(this);
                this._get = this._res['btn_hqyzm'];
                this.addBtnToListener("btn_hqyzm");
                this.addBtnToListener("btn_ok");
                this._res['txt_input1'].restrict = "0-9";
                this._res['txt_input1'].maxChars = "11";
                this._res['txt_input2'].restrict = "0-9";
                this._res['txt_input2'].maxChars = "4";
                this.m_closeUiOnSide = false;
                this._noticeOther = true;
            };
            BindPhoneUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._res['txt_input1'].text = GameVar.urlParam['bind_phone'] || "";
                this._res['txt_input2'].text = "";
                this._get.disabled = false;
                this._get.label = getDesByLan("获取验证码");
                if (qpq.g_commonFuncs == null) {
                    sendNetMsg(0x2035, 1, GameVar.pid, "");
                }
            };
            BindPhoneUi.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x2035) {
                    this._netData = data;
                }
            };
            BindPhoneUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                Laya.timer.clearAll(this);
            };
            BindPhoneUi.prototype.onClickObjects = function (evt) {
                switch (evt.currentTarget.name) {
                    case "btn_hqyzm":
                        playButtonSound();
                        var tel = this._res['txt_input1'].text;
                        if (!utils.checkMobile(tel)) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请输入有效的手机号") });
                            return;
                        }
                        if (window['application_mobile_verify']) {
                            g_uiMgr.showMiniLoading();
                            window['application_mobile_verify'](tel, this.onGetVerifyCallBack, this);
                        }
                        this._get.disabled = true;
                        this.timer(180);
                        break;
                    case "btn_ok":
                        playButtonSound();
                        var tel = this._res['txt_input1'].text;
                        if (!utils.checkMobile(tel)) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请输入有效的手机号") });
                            return;
                        }
                        var yzm = this._res['txt_input2'].text;
                        if (yzm == "" || yzm.length != 4) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请输入验证码") });
                            return;
                        }
                        if (this._phone_verify_vid == 0 || isNaN(this._phone_verify_vid)) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("无效的验证码") });
                        }
                        //开始绑定
                        if (window['application_bind_mobile']) {
                            g_uiMgr.showMiniLoading();
                            window['application_bind_mobile'](tel, this._phone_verify_vid, yzm, this.onBindCallBack.bind(this));
                        }
                        break;
                }
            };
            BindPhoneUi.prototype.timer = function (time) {
                if (time == 0) {
                    this._get.disabled = false;
                    this._get.label = getDesByLan("获取验证码");
                    return;
                }
                this._get.label = time + "s";
                Laya.timer.once(1000, this, this.timer, [time - 1]);
            };
            /**
             * 返回验证玛
             * @param {any} ret [description]
             */
            BindPhoneUi.prototype.onGetVerifyCallBack = function (ret) {
                g_uiMgr.closeMiniLoading();
                if (ret.result != 0) {
                    this._phone_verify_vid = 0;
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("验证码发送失败") + "：" + ret.msg });
                }
                else {
                    this._phone_verify_vid = ret.data.vid;
                }
            };
            /**
             * 绑定回掉
             * @param {any} ret [description]
             */
            BindPhoneUi.prototype.onBindCallBack = function (ret) {
                g_uiMgr.closeMiniLoading();
                if (ret.result != 0) {
                    this._phone_verify_vid = 0;
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("绑定手机失败") + "：" + ret.msg });
                }
                else {
                    this.close();
                    var tel = this._res['txt_input1'].text;
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("成功绑定手机") + ":" + tel });
                    GameVar.urlParam['bind_phone'] = tel;
                    this._netData["手机号码"] = tel;
                    sendNetMsg(0x2035, 0, GameVar.pid, JSON.stringify(this._netData));
                    Laya.timer.once(1000, this, function () {
                        sendNetMsg(0x2035, 1, GameVar.pid, "");
                    });
                    // if(g_commonFuncs == null)
                    // {							
                    // }
                    // else
                    // {
                    // 	g_commonFuncs.saveSelfInfo({phone:parseInt(tel)});
                    // }
                    try {
                        sendNetMsg(0x2202, 2, 6);
                    }
                    catch (e) {
                    }
                    sendNetMsg(0x001A); //领取奖励
                }
            };
            return BindPhoneUi;
        }(gamelib.core.Ui_NetHandle));
        hall.BindPhoneUi = BindPhoneUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 绑定推荐人
         * @type {[type]}
         */
        var BindRefer = /** @class */ (function () {
            function BindRefer(res) {
                this._box = res['b_bangding'];
                this._btn = res['btn_bangding'];
                this._box["name"] = this._btn["name"] = "btn_bangding";
                this._label = res['txt_tjr'];
                this._input = res['txt_input2'];
                this._input.editable = false;
                this._input.mouseEnabled = false;
            }
            BindRefer.prototype.show = function () {
                this._box.visible = true;
                var refer = GameVar.urlParam['refer'];
                if (refer == "" || refer == undefined || refer == "0") {
                    this._label.visible = true;
                    this._label.text = getDesByLan("请绑定推荐人");
                    this._btn.disabled = false;
                }
                else {
                    this._label.visible = true;
                    // this._box.visible = false;
                    this._label.text = getDesByLan("推荐人") + ":" + refer;
                    this._btn.disabled = true;
                }
                this._input.text = "";
                this._input.prompt = "";
                this._btn.on(Laya.Event.CLICK, this, this.onClickInput);
                this._box.on(Laya.Event.CLICK, this, this.onClickInput);
            };
            BindRefer.prototype.close = function () {
                this._box.visible = false;
                // this._box.off(Laya.Event.CLICK,this,this.onClickInput)
                this._btn.off(Laya.Event.CLICK, this, this.onClickInput);
            };
            BindRefer.prototype.onInputValue = function (value) {
                // this._input.text = value + "";
                this._label.text = value + "";
                if (window['application_bind_refer']) {
                    g_uiMgr.showMiniLoading();
                    window['application_bind_refer'](value, function (jsonObj) {
                        g_uiMgr.closeMiniLoading();
                        if (jsonObj.result == 0) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("绑定成功") });
                            GameVar.urlParam['refer'] = value;
                            this._btn.disabled = true;
                        }
                        else {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("绑定失败") + jsonObj.msg });
                            // this._input.text = "";
                            this._label.text = getDesByLan("请绑定推荐人");
                        }
                    }, this);
                }
            };
            BindRefer.prototype.onClickInput = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_bangding":
                    case "btn_bangding":
                        g_signal.dispatch(qpq.SignalMsg.showKeypad_Input, [Laya.Handler.create(this, this.onInputValue), getDesByLan("输入代理ID"), 12]);
                        break;
                }
                // if(evt.target instanceof Laya.Button)
                // {
                // 	this.onClickBtn();
                // }
                // else
                // {				
                // 	g_signal.dispatch("showKeypad_Input", [Laya.Handler.create(this, this.onInputValue), getDesByLan("请输入推荐人的ID")]);
                // }	
            };
            BindRefer.prototype.onClickBtn = function () {
                var str = this._input.text;
                if (str == "") {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请输入推荐人的ID") });
                    return;
                }
                if (window['application_bind_refer']) {
                    g_uiMgr.showMiniLoading();
                    window['application_bind_refer'](str, function (jsonObj) {
                        g_uiMgr.closeMiniLoading();
                        if (jsonObj.result == 0) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("绑定成功") });
                            GameVar.urlParam['refer'] = str;
                        }
                        else {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("绑定失败") + jsonObj.msg });
                        }
                    }, this);
                }
            };
            return BindRefer;
        }());
        hall.BindRefer = BindRefer;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var ChangeHeadUi = /** @class */ (function (_super) {
            __extends(ChangeHeadUi, _super);
            function ChangeHeadUi() {
                return _super.call(this, "qpq/Art_XGTX") || this;
            }
            ChangeHeadUi.prototype.init = function () {
                this._noticeOther = false;
                var arr = [];
                var list = Laya.loader.getRes("qpq/config/config.json").head_list;
                for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                    var str = list_2[_i];
                    var head = "";
                    if (str.indexOf("http") == -1) {
                        head = GameVar.common_ftp + str;
                    }
                    else {
                        head = str;
                    }
                    arr.push(head);
                }
                this._list = this._res['list_1'];
                this._list.dataSource = arr;
                this._list.selectEnable = true;
                this._list.selectHandler = Laya.Handler.create(this, this.onSelect, null, false);
                this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
                this.addBtnToListener('btn_add');
                this.addBtnToListener('btn_ok');
                this._callBack = Laya.Handler.create(this, this.onSaveCallBack, null, false);
            };
            ChangeHeadUi.prototype.onSelect = function (index) {
                if (index == -1)
                    return;
                this._res["img_head"].skin = this._list.dataSource[index];
            };
            ChangeHeadUi.prototype.onItemRender = function (box, index) {
                var head = getChildByName(box, "b_playerhead.img_head");
                var gg = getChildByName(box, "img_gg");
                gg.visible = index == this._list.selectedIndex;
                head.skin = this._list.dataSource[index];
            };
            ChangeHeadUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._res['img_head'].skin = GameVar.playerHeadUrl;
                var index = this._list.dataSource.indexOf(GameVar.playerHeadUrl);
                this._list.selectedIndex = index;
                playSound_qipai("open");
                this.updateOther();
            };
            ChangeHeadUi.prototype.updateOther = function () {
            };
            ChangeHeadUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._lastSelectIndex = -1;
                if (this.m_parentUi)
                    this.m_parentUi.show();
            };
            ChangeHeadUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_add":
                        //通知app打开是手机相册
                        this._selecteImg = this._selecteImg || new hall.SelectHeadImgUi(this._callBack);
                        this._selecteImg.show();
                        break;
                    case "btn_ok":
                        //修改头像
                        qpq.g_commonFuncs.saveSelfInfo({ icon: this._res['img_head'].skin }, this._callBack);
                        break;
                    default:
                        break;
                }
            };
            ChangeHeadUi.prototype.onSaveCallBack = function (ret) {
                if (ret.ret == 1) {
                    g_net_configData.addConfig("modifyHead", 1);
                    g_net_configData.saveConfig();
                    var url = ret['__url'];
                    if (url != undefined)
                        this._res['img_head'].skin = url;
                    else
                        url = this._res['img_head'].skin;
                    GameVar.urlParam['icon_url'] = url;
                    gamelib.data.UserInfo.s_self.m_headUrl = GameVar.playerHeadUrl;
                    gamelib.Api.saveAppUserInfo({ icon: url });
                    for (var i = 1; i <= 5; i++) {
                        var temp = qpq.g_configCenter.getConfigByIndex(i);
                        if (temp)
                            g_childGame.modifyGameInfo(temp.gz_id, "icon_url", GameVar.urlParam['icon_url']);
                    }
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA, 0);
                    sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
                }
                else {
                    playSound_qipai("warning");
                }
                g_uiMgr.showTip(ret.clientMsg);
            };
            return ChangeHeadUi;
        }(gamelib.core.BaseUi));
        hall.ChangeHeadUi = ChangeHeadUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var EffortUi = /** @class */ (function (_super) {
            __extends(EffortUi, _super);
            function EffortUi() {
                return _super.call(this, "qpq/Art_Effort") || this;
            }
            EffortUi.prototype.init = function () {
                this._list_1 = this._res["list_1"];
                this._list_1.dataSource = [];
                this._list_1.renderHandler = new laya.utils.Handler(this, this.onItemUpdate, null, false);
                this._noticeOther = true;
            };
            EffortUi.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x00D3:
                        g_uiMgr.closeMiniLoading();
                        qpq.data.EffortData.PaseData(data);
                        this.update();
                        break;
                    case 0x00D5:
                        if (data.effort_Result == 1) {
                            qpq.data.EffortData.UpdateStatus(data.effort_Id, 3);
                            this.update();
                        }
                        break;
                    default:
                        break;
                }
            };
            EffortUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                if (qpq.data.EffortData.s_list == null) {
                    sendNetMsg(0x00D3);
                    g_uiMgr.showMiniLoading();
                    return;
                }
                this.update();
            };
            EffortUi.prototype.update = function () {
                this.listdata = qpq.data.EffortData.s_list;
                this._list_1.dataSource = this.listdata;
            };
            // 渲染方式
            EffortUi.prototype.onItemUpdate = function (item, index) {
                var data = this.listdata[index];
                var btn = item.getChildByName("btn_ok");
                // 获取该单元格的数据
                var name = getChildByName(item, "txt_1");
                var num = getChildByName(item, "txt_2");
                var jd = getChildByName(item, "txt_3");
                var goods = getChildByName(item, "img_goods");
                var btn_ok = getChildByName(item, "btn_ok");
                var img_ywc = getChildByName(item, "img_ywc");
                name.text = data.m_name;
                num.text = "X" + data.m_money;
                jd.text = data.m_finishNumber + "/" + data.m_totalNumber;
                switch (data.m_status) {
                    case 1:
                        btn_ok.visible = false;
                        img_ywc.visible = false;
                        jd.visible = true;
                        break;
                    case 2:
                        btn_ok.visible = true;
                        img_ywc.visible = false;
                        jd.visible = false;
                        break;
                    case 3:
                        btn_ok.visible = false;
                        img_ywc.visible = true;
                        jd.visible = false;
                        break;
                }
                btn.off(Laya.Event.CLICK, this, this.onclick);
                btn.on(Laya.Event.CLICK, this, this.onclick, [index]);
            };
            EffortUi.prototype.onclick = function (index) {
                var id = this.listdata[index].m_id;
                sendNetMsg(0x00D5, id, 0); //棋牌圈本身发0
            };
            return EffortUi;
        }(gamelib.core.Ui_NetHandle));
        hall.EffortUi = EffortUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var GoldGameUi = /** @class */ (function (_super) {
            __extends(GoldGameUi, _super);
            function GoldGameUi() {
                var _this = _super.call(this, "qpq/Art_MoreGame_1") || this;
                _this._grap = 145;
                return _this;
            }
            GoldGameUi.prototype.init = function () {
                this._noticeOther = false;
                this._games = qpq.g_configCenter.goldGames;
                this._container = new laya.ui.UIComponent();
                this._container.centerX = 0.5;
                this._container.centerY = 0.5;
                this._res.addChild(this._container);
                this._items = [];
                for (var i = 0; i < this._games.length; i++) {
                    var cl = gamelib.getDefinitionByName('qpq.ui.Art_GameUI');
                    var view = new cl();
                    view.img_game.skin = this._games[i].skin;
                    this._clickEventObjects.push(view.btn_game);
                    this._container.addChild(view);
                    this._items.push(view);
                    view.btn_game["__index"] = i;
                }
                Laya.timer.frameOnce(3, this, this.adjues);
                this._noticeOther = true;
            };
            GoldGameUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                console.log("click index:" + evt.currentTarget["__index"]);
                this._noticeOther = false;
                this.close();
                this._noticeOther = true;
                this._enterUi = this._enterUi || new GoldGameRoomListUi();
                this._enterUi.setData(this._games[evt.currentTarget["__index"]]);
                this._enterUi.show();
            };
            GoldGameUi.prototype.adjues = function () {
                var startx = (this._res.width - (this._items.length * this._items[0].width + (this._items.length - 1) * this._grap)) / 2;
                for (var i = 0; i < this._items.length; i++) {
                    this._items[i].x = i * (this._items[i].width + this._grap);
                }
            };
            return GoldGameUi;
        }(gamelib.core.BaseUi));
        hall.GoldGameUi = GoldGameUi;
        var GoldGameRoomListUi = /** @class */ (function (_super) {
            __extends(GoldGameRoomListUi, _super);
            function GoldGameRoomListUi() {
                var _this = _super.call(this, "qpq.ui.Art_MoreGame_1UI") || this;
                _this._grap = 30;
                return _this;
            }
            GoldGameRoomListUi.prototype.init = function () {
                this._items = [];
                this._pools = [];
            };
            GoldGameRoomListUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._noticeOther = true;
                for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.btn_game.on(laya.events.Event.CLICK, this, this.onClickItem);
                }
            };
            GoldGameRoomListUi.prototype.onCloe = function () {
                this._noticeOther = false;
                for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.btn_game.off(laya.events.Event.CLICK, this, this.onClickItem);
                }
            };
            GoldGameRoomListUi.prototype.onClickItem = function (evt) {
                playButtonSound();
                var rd = evt.currentTarget["__data"];
                if (qpq.data.PlayerData.s_self.m_money < rd.ticket) {
                    g_uiMgr.showAlertUiByArgs({
                        msg: getDesByLan("你的铜钱不足,请充值") + "!",
                        callBack: function (params) {
                            if (params == 0) {
                                g_uiMgr.openShop();
                                this.close();
                            }
                        },
                        thisObj: this,
                        okLabel: getDesByLan("购买")
                    });
                    return;
                }
                console.log("进入金币场 ");
                g_childGame.enterGameByClient(rd.gz_id, true, null, { roomId: rd.roomId });
            };
            GoldGameRoomListUi.prototype.setData = function (data) {
                this._games = data.rooms;
                for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this._res.removeChild(item);
                    this._pools.push(item);
                }
                this._items.length = 0;
                for (var i = 0; i < this._games.length; i++) {
                    var view = this.getItem();
                    this._games[i].gz_id = data.gz_id;
                    this._games[i].game_id = data.game_id;
                    view.txt_1.text = this._games[i].name;
                    view.txt_2.text = this._games[i].txt1;
                    view.txt_3.text = this._games[i].txt2;
                    view.img_game.skin = "hall/bg_jinbi_" + (i + 1) + ".png";
                    this._res.addChild(view);
                    this._items.push(view);
                    view.btn_game["__data"] = this._games[i];
                }
                Laya.timer.frameOnce(3, this, this.adjues);
                this._noticeOther = true;
            };
            GoldGameRoomListUi.prototype.getItem = function () {
                if (this._pools.length == 0) {
                    var cl = gamelib.getDefinitionByName("qpq.ui.Art_GameEntryUI");
                    return new cl();
                }
                return this._pools.shift();
            };
            GoldGameRoomListUi.prototype.adjues = function () {
                var startx = (this._res.width - (this._items.length * this._items[0].width + (this._items.length - 1) * this._grap)) / 2;
                var starty = (this._res.height - this._items[0].height) / 2;
                for (var i = 0; i < this._items.length; i++) {
                    this._items[i].x = startx + i * (this._items[i].width + this._grap);
                    this._items[i].y = starty;
                }
            };
            return GoldGameRoomListUi;
        }(gamelib.core.BaseUi));
        hall.GoldGameRoomListUi = GoldGameRoomListUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    /**
     * 大厅公共按钮,包括商城，签到，游戏，喇叭，cdk，设置，帮助，发送到桌面，首充
     * 需要关注消息为: showSetUi,showHelpUi,showRankUi,showEffortUi,showTaskUi
     * @class HallCommonBtns
     */
    var HallCommonBtns = /** @class */ (function () {
        function HallCommonBtns(res) {
            this._bSendToDesk = false;
            this._btns = {};
            var arr = [
                "btn_shop", "btn_shop1", "btn_shop2", "btn_signin", "btn_mail",
                "btn_laba", "btn_cdk", "btn_set",
                "btn_help", "btn_sendToDesk", "b_shouchong"
            ];
            for (var key in arr) {
                if (res[arr[key]] == undefined)
                    continue;
                this._btns[arr[key]] = res[arr[key]];
                this._btns[arr[key]].name = arr[key];
            }
            if (this._btns['btn_shop']) {
                this._btns['btn_shop'].visible = GameVar.g_platformData['show_shop'];
            }
            if (this._btns['btn_shop1']) {
                this._btns['btn_shop1'].visible = GameVar.g_platformData['show_shop'];
            }
            this._mailIcon = res.newIcon_mial;
            if (this._mailIcon == null)
                this._mailIcon = res.newIcon_mail;
            this._signinIcon = res.newIcon_sigin;
            this._mailIcon.visible = false;
            if (this._signinIcon)
                this._signinIcon.visible = false;
            g_signal.add(this.onGlobalSigna, this);
        }
        HallCommonBtns.prototype.removeBtn = function (btn) {
            delete this._btns[btn];
        };
        HallCommonBtns.prototype.onGlobalSigna = function (msg, data) {
            if (msg == gamelib.GameMsg.SENDTODESKMSG) {
                this._bSendToDesk = true;
            }
            else if (msg == gamelib.GameMsg.UPDATEUSERINFODATA) {
                if (this._signinIcon)
                    this._signinIcon.visible = gamelib.data.UserInfo.s_self.m_bSignIn;
                this._mailIcon.visible = gamelib.data.UserInfo.s_self.m_unreadMailNum != 0;
            }
            else if (msg == gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE) {
                this.updateItemBtn();
            }
        };
        HallCommonBtns.prototype.show = function () {
            for (var key in this._btns) {
                this._btns[key].on(laya.events.Event.CLICK, this, this.onClickBtns);
            }
            this.updateItemBtn();
        };
        HallCommonBtns.prototype.close = function () {
            for (var key in this._btns) {
                this._btns[key].off(laya.events.Event.CLICK, this, this.onClickBtns);
            }
        };
        HallCommonBtns.prototype.update = function () {
            if (gamelib.data.UserInfo.s_self == null)
                return;
            if (this._signinIcon)
                this._signinIcon.visible = gamelib.data.UserInfo.s_self.m_bSignIn;
            this._mailIcon.visible = gamelib.data.UserInfo.s_self.m_unreadMailNum != 0;
        };
        HallCommonBtns.prototype.updateItemBtn = function () {
            if (this._btns["yuekaG"]) {
                this._btns["yuekaG"].visible = true;
                var newIcon = this._btns["yuekaG"].getChildByName("newIcon_yueka");
                newIcon.visible = GameVar.s_item_yue.state <= 1 || GameVar.s_item_zhou.state <= 1;
            }
            var btn = this._btns["b_shouchong"];
            if (btn == null)
                return;
            if (!GameVar.s_firstBuy) {
                btn.removeSelf();
            }
        };
        HallCommonBtns.prototype.onClickBtns = function (evt) {
            playButtonSound();
            switch (evt.currentTarget.name) {
                case "btn_shop":
                case "btn_shop1":
                case "btn_shop2":
                    // g_signal.dispatch("showEnterGameLoading", 0);
                    g_uiMgr.openShop();
                    if (qpq.g_commonFuncs) {
                        qpq.g_commonFuncs.eventTongJi("homepage", '商场');
                    }
                    break;
                case "btn_signin":
                    break;
                case "btn_mail":
                    g_uiMgr.openMail();
                    if (qpq.g_commonFuncs) {
                        qpq.g_commonFuncs.eventTongJi("homepage", '信件');
                    }
                    // var url:string = GameVar.common_ftp + "circle_config.php";
                    // utils.tools.http_request(url,{platform:GameVar.platform,pid:GameVar.pid,action:'circle_config'},"get",null);
                    break;
                case "btn_laba":
                    break;
                case "btn_cdk":
                    //g_uiMgr.showUiByClass(gamelib.cdk.CDKeyUi);
                    break;
                case "btn_set":
                    // var tmp = new gamelib.control.ArcMask(64);
                    // tmp.x = tmp.y = 200;
                    // Laya.stage.addChild(tmp);
                    // tmp.pre = 0;
                    // Laya.Tween.to(tmp,{pre:1},10000);
                    g_signal.dispatch("showSetUi", 0);
                    if (qpq.g_commonFuncs) {
                        qpq.g_commonFuncs.eventTongJi("homepage", '设置');
                    }
                    break;
                case "btn_help":
                case "help":
                    g_signal.dispatch("showHelpUi", 0);
                    break;
                case "btn_rank":
                    g_signal.dispatch("showRankUi", 0);
                    if (qpq.g_commonFuncs) {
                        qpq.g_commonFuncs.eventTongJi("homepage", '排行榜');
                    }
                    break;
                case "btn_effort":
                    g_signal.dispatch("showEffortUi", 0);
                    break;
                case "btn_shouchong":
                case "b_shouchong":
                    g_uiMgr.openShop();
                    break;
                case "yuekaG":
                    //g_uiMgr.showUiByClass(gamelib.shop.YueKaUi);
                    break;
            }
        };
        return HallCommonBtns;
    }());
    qpq.HallCommonBtns = HallCommonBtns;
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var Help = /** @class */ (function (_super) {
            __extends(Help, _super);
            function Help() {
                return _super.call(this, "qpq/Art_Help") || this;
            }
            Help.prototype.init = function () {
                this._tab = this._res['tab'];
                this._url = GameVar.g_platformData['help_file_name'];
                if (this._url == "" || this._url == null) {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("先设置帮助文件") + "!" });
                }
                this._url = GameVar.common_ftp + this._url;
                this._isLoading = true;
                Laya.loader.load(this._url, Laya.Handler.create(this, this.onHelpFileLoaded), null, laya.net.Loader.JSON);
                this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
                this._toShowIndex = 0;
                this._res["txt_txt"].text = "";
                this._page = new Laya.HTMLIframeElement();
                this._res.addChild(this._page);
                this._page.x = this._res["txt_txt"].x;
                this._page.y = this._res["txt_txt"].y;
                // this._slider = new Laya.VSlider();
                // vs.skin = "../../res/ui/vslider.png";
                // vs.height = this._res["txt_txt"].height;
                // vs.pos(this._res["txt_txt"].x + this._res["txt_txt"].width - 50, 50);
                // vs.min = 0;
                // vs.max = 100;
                // vs.value = 50;
                // vs.tick = 1;
            };
            Help.prototype.setIndex = function (index) {
                this._toShowIndex = index;
            };
            Help.prototype.onHelpFileLoaded = function (bSuccess) {
                if (!bSuccess) {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("帮助文件出错") + "!" });
                    return;
                }
                this._isLoading = false;
                var data = Laya.loader.getRes(this._url);
                Laya.loader.clearRes(this._url);
                this._datas = [];
                var tabs = [];
                for (var _i = 0, _a = data.tabs; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    tabs.push(obj.label);
                    var url = GameVar.common_ftp + obj.href;
                    this._datas.push(url);
                    ;
                }
                this._tab.labels = tabs.join(",");
                this._tab.selectedIndex = this._toShowIndex;
            };
            Help.prototype.onShow = function () {
                if (this._isLoading) {
                    return;
                }
                this._tab.selectedIndex = this._toShowIndex;
            };
            Help.prototype.onTabChange = function () {
                this.showData(this._tab.selectedIndex);
            };
            Help.prototype.showData = function (index) {
                this._page.href = this._datas[index];
            };
            return Help;
        }(gamelib.core.BaseUi));
        hall.Help = Help;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var HuoDongUi = /** @class */ (function (_super) {
            __extends(HuoDongUi, _super);
            function HuoDongUi() {
                return _super.call(this, "qpq/Art_Huodong") || this;
            }
            HuoDongUi.prototype.init = function () {
                this._ok_btn = this._res["btn_ok"];
                this._tab = this._res["tab_1"];
                this._img = this._res["img_hd"];
                this.addBtnToListener("btn_ok");
                this._noticeOther = true;
                this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
                var vScrollBar = this._res['p_1'].vScrollBar;
                if (vScrollBar)
                    vScrollBar.autoHide = true;
            };
            HuoDongUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                var arr = [];
                for (var i = 0; i < qpq.g_qpqData.huodong_list.length; i++) {
                    arr.push(qpq.g_qpqData.huodong_list[i].name);
                }
                this._tab.labels = arr.join(",");
                this._tab.selectedIndex = 0;
                this.onTabChange(0);
            };
            HuoDongUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            HuoDongUi.prototype.onClickObjects = function (evt) {
                this.close();
                playButtonSound();
                if (this._huodongData == null || this._huodongData.callback == null) {
                    return;
                }
                eval(this._huodongData.callback);
            };
            HuoDongUi.prototype.onTabChange = function (index) {
                this._huodongData = qpq.g_qpqData.huodong_list[index];
                if (this._huodongData == null) {
                    this._ok_btn.visible = false;
                    return;
                }
                if (qpq.g_commonFuncs) {
                    qpq.g_commonFuncs.eventTongJi("exercise", "活动" + (index + 1));
                }
                if (this._huodongData.buttonLabel == getDesByLan("隐藏")) {
                    this._ok_btn.visible = false;
                }
                else {
                    this._ok_btn.visible = true;
                    this._ok_btn.label = this._huodongData.buttonLabel ? this._huodongData.buttonLabel : getDesByLan("确定");
                }
                if (this._huodongData.img_url.indexOf("http") == -1)
                    this._img.skin = GameVar.urlParam['request_host'] + this._huodongData.img_url;
                else
                    this._img.skin = this._huodongData.img_url;
            };
            return HuoDongUi;
        }(gamelib.core.BaseUi));
        hall.HuoDongUi = HuoDongUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var KeyPad = /** @class */ (function (_super) {
            __extends(KeyPad, _super);
            function KeyPad(str) {
                if (str === void 0) { str = "qpq/Art_Keyboard"; }
                return _super.call(this, str) || this;
            }
            KeyPad.prototype.init = function () {
                this._defaultInput = getDesByLan("输入房号");
                this._checkLength = 6;
                this._text_input = this._res["txt_input"];
                this._text_input.text = this._defaultInput;
                for (var i = 0; i < 10; i++) {
                    var btn = this._res["btn_" + i];
                    btn.name = i;
                    this._clickEventObjects.push(btn);
                }
                this.addBtnToListener("btn_back");
                this.addBtnToListener("btn_clear");
                this._noticeOther = true;
            };
            KeyPad.prototype.onShow = function () {
                this.clearInput();
            };
            KeyPad.prototype.onClose = function () {
                //this.visible = false;
                //this.btnEnabled = false;
            };
            KeyPad.prototype.onClickCloseBtn = function (evt) {
                this.close();
                playSound_qipai("close");
            };
            KeyPad.prototype.onClickObjects = function (evt) {
                var keyName = evt.target.name;
                switch (keyName) {
                    case "btn_back":
                        this.deleteNum();
                        playSound_qipai("turn");
                        break;
                    case "btn_ok":
                        this.checkValid();
                        break;
                    case "btn_clear":
                        this.clearInput();
                        playSound_qipai("num");
                        break;
                    default:
                        this.checkInput(keyName);
                        playSound_qipai("num");
                }
            };
            KeyPad.prototype.clearInput = function () {
                this._inputVec = [];
                this.updateInput();
            };
            KeyPad.prototype.addNum = function (value) {
                this._inputVec.push(value);
                this.updateInput();
                if (this._inputVec.length == this._checkLength) {
                    this.checkValid();
                }
            };
            KeyPad.prototype.deleteNum = function () {
                if (this._inputVec.length) {
                    this._inputVec.pop();
                    this.updateInput();
                }
            };
            KeyPad.prototype.updateInput = function () {
                if (this._inputVec && this._inputVec.length) {
                    var input = this._inputVec.join("");
                    this._text_input.text = input;
                }
                else {
                    this._text_input.text = this._defaultInput;
                }
            };
            KeyPad.prototype.checkValid = function () {
                if (this._text_input.text == "")
                    return;
                qpq.enterGameByValidation(this._text_input.text);
                //s_hall.showLoading("等待加入...");
                this.close();
            };
            KeyPad.prototype.checkInput = function (key) {
                var index = parseInt(key);
                if (isNaN(index) || index >= 10)
                    return;
                this.addNum(index);
            };
            return KeyPad;
        }(gamelib.core.BaseUi));
        hall.KeyPad = KeyPad;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var KeyPad_Input = /** @class */ (function (_super) {
            __extends(KeyPad_Input, _super);
            function KeyPad_Input() {
                return _super.call(this, "qpq/Art_Keyboard1") || this;
            }
            KeyPad_Input.prototype.init = function () {
                _super.prototype.init.call(this);
                this._checkLength = 10000;
                this._defaultInput = "";
                this._noticeOther = false;
                this._btn_dian = this._res['btn_dian'];
                if (this._btn_dian) {
                    this.addBtnToListener("btn_dian");
                }
            };
            KeyPad_Input.prototype.setData = function (data) {
                this._text_input.text = this._defaultInput = "";
                this._handle = data[0];
                if (this._res['txt_title'])
                    this._res['txt_title'].text = data[1];
                else
                    this._text_input.text = this._defaultInput = data[1];
                if (typeof data[2] == "string") {
                    this._maxValue = parseInt(data[2]);
                }
                else if (typeof data[2] == "number") {
                    this._maxChars = data[2];
                }
                //this._maxChars = data[2] || 7;
            };
            KeyPad_Input.prototype.onClickObjects = function (evt) {
                var keyName = evt.target.name;
                if (keyName == "btn_back") {
                    playButtonSound();
                    if (this._text_input.text == this._defaultInput || this._text_input.text == "") {
                        return;
                    }
                    if (this._btn_dian == null)
                        this._handle.runWith(parseInt(this._text_input.text));
                    else {
                        var rate = utils.tools.getExchangeRate();
                        this._handle.runWith(parseFloat(this._text_input.text) * rate);
                    }
                    this.close();
                }
                else {
                    _super.prototype.onClickObjects.call(this, evt);
                }
            };
            KeyPad_Input.prototype.checkInput = function (key) {
                if (this._btn_dian == null) {
                    var index = parseInt(key);
                    if ((this._text_input.text == this._defaultInput) && (index == 0))
                        return;
                    if (this._text_input.text != this._defaultInput) {
                        if (!isNaN(this._maxChars)) {
                            if (this._text_input.text.length >= this._maxChars)
                                return;
                        }
                        else if (!isNaN(this._maxValue)) {
                            var num = parseInt(this._text_input.text + key);
                            if (num > this._maxValue)
                                return;
                        }
                        this.addNum(index);
                    }
                    else {
                        this.addNum(index);
                    }
                }
                else {
                    var isDian = key == "btn_dian";
                    var index = parseInt(key);
                    if ((isNaN(index) || index >= 10) && !isDian)
                        return;
                    if ((this._text_input.text == this._defaultInput) && (isDian))
                        return;
                    if (isDian) {
                        if (this._text_input.text.indexOf('.') != -1)
                            return;
                    }
                    if (this._text_input.text != this._defaultInput) {
                        if (!isNaN(this._maxChars)) {
                            if (this._text_input.text.length >= this._maxChars)
                                return;
                        }
                        else if (!isNaN(this._maxValue)) {
                            var num = parseFloat(this._text_input.text + key);
                            if (num > this._maxValue)
                                return;
                        }
                    }
                    if (isDian)
                        this.addNum(".");
                    else
                        this.addNum(index);
                }
            };
            return KeyPad_Input;
        }(hall.KeyPad));
        hall.KeyPad_Input = KeyPad_Input;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var LevelUpUi = /** @class */ (function (_super) {
            __extends(LevelUpUi, _super);
            function LevelUpUi() {
                return _super.call(this, "qpq/Art_Ani_VipUpgrade") || this;
            }
            LevelUpUi.prototype.init = function () {
                _super.prototype.init.call(this);
                // this.addBtnToListener("")
                this.m_closeUiOnSide = false;
            };
            /**
             * [setType description]
             * @function
             * @DateTime 2018-11-05T17:38:04+0800
             * @param    {Array}       arr[0] 1:等级 2：vip等级.arr[1]变化的值
             */
            LevelUpUi.prototype.setType = function (arr) {
                var url = "";
                if (arr[0] == 1)
                    url = getGameResourceUrl("animation/ani_djts.png", "qpq");
                else
                    url = getGameResourceUrl("animation/ani_vip.png", "qpq");
                this._res['tips_bankerwin'].skin = url;
                var ani = this._res['ani1'];
                ani.play(0, false);
                this.show();
                Laya.timer.once(2500, this, this.close);
            };
            return LevelUpUi;
        }(gamelib.core.BaseUi));
        hall.LevelUpUi = LevelUpUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var ModifyNickName = /** @class */ (function (_super) {
            __extends(ModifyNickName, _super);
            function ModifyNickName() {
                return _super.call(this, "qpq/Art_XGNC") || this;
            }
            ModifyNickName.prototype.init = function () {
                this.addBtnToListener("btn_ok");
                this._txt_input = this._res['txt_name'];
                this._txt_input.text = "";
                this._txt_input.maxChars = 14;
                this._noticeOther = false;
                this._name = this._res['txt_name1'];
            };
            ModifyNickName.prototype.onShow = function () {
                this._name.text = GameVar.nickName;
                this._txt_input.prompt = getDesByLan("修改昵称默认文本");
                this._txt_input.on(Laya.Event.CHANGE, this, this.onTextChange);
            };
            ModifyNickName.prototype.onClose = function () {
                this._txt_input.off(Laya.Event.CHANGE, this, this.onTextChange);
                if (this.m_parentUi)
                    this.m_parentUi.show();
            };
            ModifyNickName.prototype.onTextChange = function (evt) {
                var len = utils.StringUtility.GetStrLen(this._txt_input.text);
                if (len >= 14) {
                    this._txt_input.text = utils.StringUtility.GetSubstr(this._txt_input.text, 14);
                }
            };
            ModifyNickName.prototype.onClickObjects = function (evt) {
                playButtonSound();
                var str = this._txt_input.text;
                if (str == "" || str == GameVar.nickName) {
                    g_uiMgr.showAlertUiByArgs({ msg: "请输入新昵称" });
                    playSound_qipai("warn");
                    return;
                }
                var newStr = utils.StringUtility.Trim(str);
                if (newStr == "") {
                    g_uiMgr.showAlertUiByArgs({ msg: "昵称不能全是空格" });
                    playSound_qipai("warn");
                    return;
                }
                qpq.g_commonFuncs.saveSelfInfo({ nick: str }, Laya.Handler.create(this, this.onSaveCallBack));
            };
            ModifyNickName.prototype.onSaveCallBack = function (ret) {
                if (ret.ret == 1) {
                    g_net_configData.addConfig("modifyNickName", 1);
                    g_net_configData.saveConfig();
                    GameVar.urlParam['nickname'] = this._txt_input.text;
                    gamelib.data.UserInfo.s_self.m_name = GameVar.nickName;
                    gamelib.Api.saveAppUserInfo({ nick: GameVar.urlParam['nickname'] });
                    for (var i = 1; i <= 6; i++) {
                        var temp = qpq.g_configCenter.getConfigByIndex(i);
                        if (temp)
                            g_childGame.modifyGameInfo(temp.gz_id, "nickname", GameVar.urlParam['nickname']);
                    }
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA, 0);
                    sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
                    g_uiMgr.showTip(getDesByLan("修改成功"));
                    this.close();
                }
                else {
                    playSound_qipai("warn");
                    g_uiMgr.showAlertUiByArgs({ msg: ret.clientMsg });
                }
            };
            return ModifyNickName;
        }(gamelib.core.BaseUi));
        hall.ModifyNickName = ModifyNickName;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var QRCUi = /** @class */ (function (_super) {
            __extends(QRCUi, _super);
            function QRCUi() {
                return _super.call(this, "qpq/Art_QRC") || this;
            }
            QRCUi.prototype.init = function () {
                this.addBtnToListener("btn_share");
                this.addBtnToListener("img_QRCode");
                this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
            };
            QRCUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                if (GameVar.isGameVip) {
                    this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl_Vip || GameVar.m_QRCodeUrl || window["application_share_url"]());
                }
                else {
                    this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl);
                }
            };
            QRCUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                if (evt.currentTarget.name == "img_QRCode")
                    utils.tools.snapshotShare(this._res["img_QRCode"]);
                else
                    qpq.appShare(true);
            };
            return QRCUi;
        }(gamelib.core.BaseUi));
        hall.QRCUi = QRCUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var RankUi = /** @class */ (function (_super) {
            __extends(RankUi, _super);
            function RankUi(url) {
                if (url === void 0) { url = "qpq/Art_Rank"; }
                var _this = _super.call(this, url) || this;
                _this._data = null;
                return _this;
            }
            RankUi.prototype.init = function () {
                this.addBtnToListener("btn_shop2");
                this._self_rank_icon = this._res['img_rankIcon'];
                this._self_rank_txt = this._res['txt_rank'];
                this._txt_money = this._res['txt_diamond'];
                this._res['img_head'].skin = GameVar.playerHeadUrl;
                this._res['txt_name'].text = qpq.data.PlayerData.s_self.m_name_ex;
                this._res['txt_id'].text = "ID:" + GameVar.pid;
                this.initList();
                this._noticeOther = true;
            };
            RankUi.prototype.initList = function () {
                this._list = this._res['list_1'];
                this._list.renderHandler = Laya.Handler.create(this, this.updateItem, null, false);
                this._list.selectEnable = true;
                this._list.selectHandler = Laya.Handler.create(this, this.onSelecttList, null, false);
                this._list.dataSource = [];
            };
            RankUi.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x00D7) {
                    this.pase0x00D7(data);
                    this.update();
                    g_uiMgr.closeMiniLoading();
                }
            };
            RankUi.prototype.pase0x00D7 = function (data) {
                this._data = data.players;
                for (var i = 0; i < this._data.length; i++) {
                    var obj = this._data[i];
                    try {
                        var name = utils.Base64.utf8to16(utils.Base64.base64decode(obj.name));
                        // console.log(name);
                        obj.name = name;
                    }
                    catch (e) {
                        console.log("namenamenamename" + obj.name);
                    }
                    try {
                        var sign = utils.Base64.utf8to16(utils.Base64.base64decode(obj.sign_name));
                        sign = utils.StringUtility.Trim(sign);
                        obj.sign = sign;
                    }
                    catch (e) {
                        console.log("signsignsignsignsignsign" + obj.name + "   " + obj.sign_name);
                    }
                }
            };
            RankUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_uiMgr.showMiniLoading();
                sendNetMsg(0x00D7, 1, 0, 50);
                this._txt_money.text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
            };
            RankUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            RankUi.prototype.update = function () {
                this._list.dataSource = this._data;
                this.updateMyRank();
            };
            RankUi.prototype.updateMyRank = function () {
                var myOrder = -1;
                for (var i = 0; i < this._data.length; i++) {
                    if (this._data[i].id == qpq.data.PlayerData.s_self.m_id) {
                        myOrder = i + 1;
                        break;
                    }
                }
                if (myOrder == -1) {
                    this._self_rank_icon.visible = false;
                    this._self_rank_txt.visible = true;
                    this._self_rank_txt.text = getDesByLan("未上榜");
                }
                else {
                    if (myOrder <= 3) {
                        this._self_rank_icon.visible = true;
                        this._self_rank_icon.skin = "hall/rank_icon" + myOrder + ".png";
                        this._self_rank_txt.visible = false;
                    }
                    else {
                        this._self_rank_icon.visible = false;
                        this._self_rank_txt.visible = true;
                        this._self_rank_txt.text = myOrder + "";
                    }
                }
            };
            RankUi.prototype.onSelecttList = function (index) {
                if (index == -1)
                    return;
                var temp = this._list.dataSource[index];
                g_signal.dispatch("showUserInfoUi", temp);
                this._list.selectedIndex = -1;
            };
            RankUi.prototype.updateItem = function (box, index) {
                var obj = this._list.dataSource[index];
                var icon = getChildByName(box, 'img_rankIcon');
                var head = getChildByName(box, 'b_head.img_head');
                var name_txt = getChildByName(box, 'txt_2');
                var id_txt = getChildByName(box, 'txt_3');
                var value_txt = getChildByName(box, 'txt_4');
                var rank_txt = getChildByName(box, 'txt_1');
                if (index >= 3) {
                    icon.visible = false;
                    rank_txt.visible = true;
                    rank_txt.text = (index + 1) + "";
                }
                else {
                    icon.visible = true;
                    rank_txt.visible = false;
                    icon.skin = "hall/rank_icon" + (index + 1) + ".png";
                }
                if (obj.headUrl)
                    head.skin = obj.headUrl;
                else
                    head.skin = "comp/icon_player.png";
                value_txt.text = obj.value + "";
                name_txt.text = utils.tools.getBanWord(obj.name);
                var sign = obj.sign;
                if (sign == "" || sign == null) {
                    sign = getDesByLan("默认签名") + "..."; //UserInfoUi1.getRandomSign();
                    obj.sign = sign;
                }
                id_txt.text = utils.tools.getBanWord(sign);
            };
            RankUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                g_uiMgr.openShop();
            };
            return RankUi;
        }(gamelib.core.Ui_NetHandle));
        hall.RankUi = RankUi;
        var RankUi_page = /** @class */ (function (_super) {
            __extends(RankUi_page, _super);
            function RankUi_page() {
                return _super.call(this, "qpq.ui.Art_RankUI") || this;
            }
            RankUi_page.prototype.init = function () {
                this.addBtnToListener("btn_shop2");
                this._self_rank_icon = this._res['img_rankIcon'];
                this._self_rank_txt = this._res['txt_rank'];
                this._txt_money = this._res['txt_diamond'];
                this._res['img_head'].skin = GameVar.playerHeadUrl;
                this._res['txt_name'].text = qpq.data.PlayerData.s_self.m_name_ex;
                this._res['txt_id'].text = "ID:" + GameVar.pid;
                this.initList();
                this._allDatas = [];
            };
            RankUi_page.prototype.initList = function () {
                this._page = new gamelib.control.Page(this._res['btn_up'], this._res['btn_down'], this._res["txt_page"], Laya.Handler.create(this, this.onPageChange, null, false));
                this._numOfPage = 5;
                this._lists = [];
                for (var i = 0; i < this._numOfPage; i++) {
                    this._lists.push(this._res['ui_list' + (i + 1)]);
                }
                this._listBox = this._res['b_l'];
                this._listBox.visible = false;
            };
            RankUi_page.prototype.requestData = function (page) {
                g_uiMgr.showMiniLoading();
                sendNetMsg(0x00D7, 1, page * this._numOfPage, this._numOfPage);
                this._currentPage = page;
            };
            RankUi_page.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.requestData(0);
                this._txt_money.text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
                for (var _i = 0, _a = this._lists; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    temp.on(Laya.Event.CLICK, this, this.onClickItem);
                }
                this._page.show();
            };
            RankUi_page.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                for (var _i = 0, _a = this._lists; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    temp.on(Laya.Event.CLICK, this, this.onClickItem);
                }
                this._page.close();
            };
            RankUi_page.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId != 0x00D7)
                    return;
                g_uiMgr.closeMiniLoading();
                this._totalNum = data.totalNum;
                var totalPage = Math.ceil(this._totalNum / this._numOfPage);
                var page = data.offsize / this._numOfPage;
                this._listBox.visible = this._totalNum > 0;
                // this._allDatas[page] = data.players;
                this.showPage(page, data.players);
            };
            RankUi_page.prototype.showPage = function (page, arr) {
                this.setDataSource(arr, page);
                this._page.setPage(page, Math.ceil(this._totalNum / this._numOfPage));
            };
            RankUi_page.prototype.onPageChange = function (page) {
                if (this._currentPage == page)
                    return;
                this.requestData(page);
                // var arr:Array<any> = this._allDatas[page];
                //          if(arr == null)
                //          {
                //              this.requestData(page);
                //          }
                //          else
                //          {
                //              this.setDataSource(arr,page);    
                //          }
            };
            RankUi_page.prototype.setDataSource = function (arr, page) {
                for (var i = 0; i < this._lists.length; i++) {
                    var obj = arr[i];
                    if (obj == null) {
                        this._lists[i].visible = false;
                        continue;
                    }
                    obj.rank = page * this._numOfPage + i;
                    this._lists[i].visible = true;
                    this.updateItem1(this._lists[i], obj);
                }
            };
            RankUi_page.prototype.onClickItem = function (evt) {
                var temp = evt.currentTarget;
                var data = temp['__data'];
                g_signal.dispatch("showUserInfoUi", data);
            };
            RankUi_page.prototype.updateItem1 = function (box, obj) {
                var index = obj.rank;
                var icon = box['img_rankIcon'];
                var head = box['img_head'];
                var name_txt = box['txt_2'];
                var id_txt = box['txt_3'];
                var value_txt = box['txt_4'];
                var rank_txt = box['txt_1'];
                box['__data'] = obj;
                if (index >= 3) {
                    icon.visible = false;
                    rank_txt.visible = true;
                    rank_txt.text = (index + 1) + "";
                }
                else {
                    icon.visible = true;
                    rank_txt.visible = false;
                    icon.skin = "hall/rank_icon" + (index + 1) + ".png";
                }
                if (obj.headUrl)
                    head.skin = obj.headUrl;
                else
                    head.skin = "comp/icon_player.png";
                value_txt.text = obj.value + "";
                var name = decodeURIComponent(obj.name);
                obj.name = name;
                name_txt.text = utils.tools.getBanWord(name);
                var sign = decodeURIComponent(obj.sign_name);
                if (sign == "" || sign == null) {
                    sign = getDesByLan("默认签名") + "..."; //UserInfoUi1.getRandomSign();
                }
                obj.sign = sign;
                id_txt.text = utils.tools.getBanWord(sign);
            };
            RankUi_page.prototype.onClickObjects = function (evt) {
                playButtonSound();
                g_uiMgr.openShop();
            };
            return RankUi_page;
        }(gamelib.core.Ui_NetHandle));
        hall.RankUi_page = RankUi_page;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name  奖励动画
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var Reward = /** @class */ (function (_super) {
            __extends(Reward, _super);
            function Reward() {
                return _super.call(this, "qpq/Art_GetItems") || this;
            }
            Reward.prototype.init = function () {
                _super.prototype.init.call(this);
                this.addBtnToListener('btn_ok');
            };
            /**
             * 播放获得单个个物品动画
             * 推荐使用playGetItemsAni方法
             * @param url 图片资源
             * @param num 道具的数量
             * @param msId 道具msid
             *
             */
            Reward.prototype.rewardAni = function (url, num, msId) {
                this._res.visible = true;
                this._res["img_daoju"].skin = url;
                this._res["txt_2"].text = "" + gamelib.data.GoodsData.GetNameByMsId(msId) + "X" + num;
                // this._res['txt_3'].visible = !(name == gamelib.data.GoodsData.MSID_TQ ||gamelib.data.GoodsData.MSID_PLATFORMCOIN ||gamelib.data.GoodsData.MSID_ZUANSHI)
                this.show();
                this._res["ani1"].play(0, false);
                playSound_qipai('get', 1, null, true);
            };
            /**
             * 播放获得道具的动画
             * @param list Array<{msId:number,num:number}>|{items:Array<{msId:number,num:number}>,goods:any}
             */
            Reward.prototype.playGetItemsAni = function (list) {
                if (list instanceof Array) {
                    this._list = list;
                }
                else {
                    this._list = list.items;
                    this._goods = list.goods;
                }
                if (this._list == null || this._list.length == 0) {
                    this.close();
                    return;
                }
                var obj = this._list.shift();
                var msId = obj.msId;
                if (isNaN(msId))
                    msId = obj.msid;
                this.playAni(msId, obj.num);
                playSound_qipai('get', 1, null, true);
            };
            Reward.prototype.playAni = function (msId, num) {
                var url = gamelib.data.GoodsData.GetGoodsIconByMsId(msId);
                this._res["img_daoju"].skin = url;
                this._res["txt_2"].text = "" + gamelib.data.GoodsData.GetNameByMsId(msId) + "X" + num;
                this.show();
                this._res["ani1"].play(0, false);
            };
            Reward.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
            };
            Reward.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._res["ani1"].stop();
                this._list = null;
                if (this._goods) {
                    if (!utils.tools.isQpqHall())
                        return;
                    if (this._goods.group_id == 1) {
                        // g_uiMgr.showAlertUiByArgs({
                        // 	msg:"您已获得1次抽奖机会,是否现在去抽奖",
                        // 	type:4,
                        // 	okLabel:"试试手气",
                        // 	cancelLabel:"关闭",
                        // 	callBack:function(type:number){
                        // 		if(type == 0)
                        // 		{
                        // 			g_signal.dispatch("showFanFanLe",0);
                        // 		}
                        // 	}
                        // });
                    }
                }
                this._goods = null;
            };
            Reward.prototype.onClickObjects = function (evt) {
                switch (evt.currentTarget.name) {
                    case "btn_ok":
                        if (this._list == null)
                            this.close();
                        else
                            this.playGetItemsAni(this._list);
                        break;
                }
            };
            return Reward;
        }(gamelib.core.BaseUi));
        hall.Reward = Reward;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var SelectGameUi = /** @class */ (function (_super) {
            __extends(SelectGameUi, _super);
            function SelectGameUi() {
                return _super.call(this, 'qpq/Art_MoreGame') || this;
            }
            SelectGameUi.prototype.init = function () {
                this._list = this._res['list_1'];
                this._list.selectEnable = true;
                this._list.selectHandler = Laya.Handler.create(this, this.onSelected, null, false);
                this._list.renderHandler = Laya.Handler.create(this, this.onUpdateItem, null, false);
                this._res['img_2'].visible = false;
                this.m_closeUiOnSide = false;
            };
            SelectGameUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._list.selectedIndex = -1;
                this._list.dataSource = qpq.g_configCenter.game_configs;
            };
            SelectGameUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                //g_signal.dispatch('showCreateUi',0);
                g_signal.dispatch(qpq.SignalMsg.showCreateUi, 0);
            };
            SelectGameUi.prototype.onUpdateItem = function (box, index) {
                var gd = this._list.dataSource[index];
                var img_game = getChildByName(box, 'img_game');
                var txt_jd = getChildByName(box, 'txt_jd');
                var txt_game = getChildByName(box, 'txt_game');
                var img_icon = getChildByName(box, 'img_icon');
                var img_mask = getChildByName(box, 'img_mask');
                var img_jisu = getChildByName(box, 'img_jisu');
                img_game.skin = GameVar.common_ftp + 'hall/icons_2/' + gd.icon;
                txt_game.text = gd.name;
                img_jisu.visible = (gd.isLaya == "true" || gd.isLaya == true);
                txt_jd.visible = img_mask.visible = img_icon.visible = false;
            };
            SelectGameUi.prototype.onSelected = function (index) {
                if (index == -1)
                    return;
                qpq.g_configCenter.creator_default = this._list.dataSource[index];
                // console.log(JSON.stringify(qpq.g_configCenter.creator_default));
                playButtonSound();
                this.close();
            };
            return SelectGameUi;
        }(gamelib.core.BaseUi));
        hall.SelectGameUi = SelectGameUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var SelectHeadImgUi = /** @class */ (function (_super) {
            __extends(SelectHeadImgUi, _super);
            function SelectHeadImgUi(callBack) {
                var _this = _super.call(this, 'qpq/Art_XGTX1') || this;
                _this._callBack = callBack;
                return _this;
            }
            SelectHeadImgUi.prototype.init = function () {
                this.addBtnToListener('btn_ps');
                this.addBtnToListener('btn_sc');
                this.addBtnToListener('btn_qx');
                this._noticeOther = false;
            };
            SelectHeadImgUi.prototype.onShow = function () {
                playSound_qipai("open");
            };
            SelectHeadImgUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this.m_parentUi)
                    this.m_parentUi.show();
            };
            SelectHeadImgUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_ps":
                        if (window['application_camera_thumb']) {
                            window['application_camera_thumb'](true, false, this.onSelectCallBack, this);
                        }
                        break;
                    case "btn_sc":
                        if (window['application_modify_thumb']) {
                            window['application_modify_thumb'](true, this.onSelectCallBack, this);
                        }
                        break;
                    case "btn_qx":
                        this.close();
                        break;
                }
            };
            SelectHeadImgUi.prototype.onSelectCallBack = function (ret) {
                if (ret.result != 0) {
                    g_uiMgr.showTip("选择失败！" + ret.msg);
                    playSound_qipai("warning");
                    return;
                }
                this._url = ret.url;
                qpq.g_commonFuncs.saveSelfInfo({ icon: this._url }, Laya.Handler.create(this, this.onSaveCallBack));
            };
            SelectHeadImgUi.prototype.onSaveCallBack = function (ret) {
                ret['__url'] = this._url;
                this._callBack.runWith(ret);
                this.close();
            };
            return SelectHeadImgUi;
        }(gamelib.core.BaseUi));
        hall.SelectHeadImgUi = SelectHeadImgUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 修改个人信息，包括名字
         * @type {[type]}
         */
        var SelfInfoModify = /** @class */ (function (_super) {
            __extends(SelfInfoModify, _super);
            function SelfInfoModify(res) {
                if (res === void 0) { res = "qpq/Art_GaiMing"; }
                return _super.call(this, res) || this;
            }
            SelfInfoModify.prototype.init = function () {
                this._res['img_head'].skin = GameVar.playerHeadUrl;
                this.addBtnToListener("btn_ok");
                this._noticeOther = true;
                this._sex = this._res['RG_sex'];
                this.m_closeUiOnSide = false;
            };
            SelfInfoModify.prototype.onShow = function () {
                if (this._sex) {
                    this._oldSex = GameVar.sex == 1 ? 0 : 1;
                    this._sex.selectedIndex = this._oldSex;
                }
                this._res['txt_input1'].text = gamelib.data.UserInfo.s_self.m_name;
            };
            SelfInfoModify.prototype.onClickObjects = function (evt) {
                if (evt.currentTarget.name == "btn_ok") {
                    if (this._res['txt_input1'].text == "") {
                        g_uiMgr.showAlertUiByArgs({ msg: "昵称不能为空" });
                        return;
                    }
                    var _name = this._res['txt_input1'].text;
                    var isChange = _name != GameVar.nickName;
                    if (this._sex) {
                        isChange = isChange || (this._oldSex != this._sex.selectedIndex);
                    }
                    if (true) //不需要检测是否修改过
                     {
                        if (qpq.g_commonFuncs) {
                            if (this._sex) {
                                var sex = this._sex.selectedIndex == 0 ? 1 : 2;
                                gamelib.Api.updateUserInfo({ nick: _name, gender: sex }, Laya.Handler.create(this, this.onModifyNickName));
                            }
                            else {
                                gamelib.Api.updateUserInfo({ nick: _name }, Laya.Handler.create(this, this.onModifyNickName));
                            }
                        }
                        else {
                            if (window['application_modify_nickname']) {
                                g_uiMgr.showMiniLoading({ delay: 10, msg: "修改中", alertMsg: "修改失败" });
                                window['application_modify_nickname'](_name, this.onModifyNickName, this);
                            }
                        }
                    }
                    // else
                    // {
                    // 	g_uiMgr.showAlertUiByArgs({msg:"无法保存"});
                    // }
                }
            };
            SelfInfoModify.prototype.onModifyNickName = function (obj) {
                g_uiMgr.closeMiniLoading();
                if (obj.ret == 1) {
                    g_uiMgr.showTip("修改成功");
                    GameVar.urlParam['nickname'] = this._res['txt_input1'].text;
                    if (this._sex) {
                        var sex = this._sex.selectedIndex == 0 ? 1 : 2;
                        GameVar.urlParam['gender'] = sex;
                    }
                    gamelib.data.UserInfo.s_self.m_name = GameVar.nickName;
                    gamelib.data.UserInfo.s_self.m_sex = GameVar.sex;
                    var temp = qpq.g_configCenter.getConfigByIndex(0);
                    if (temp == null)
                        temp = qpq.g_configCenter.getConfigByIndex(1);
                    g_childGame.modifyGameInfo(temp.gz_id, "nickname", GameVar.urlParam['nickname']);
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA, 0);
                    sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
                    this.close();
                    try {
                        sendNetMsg(0x2202, 2, 7);
                    }
                    catch (e) {
                    }
                }
                else {
                    g_uiMgr.showTip("修改失败" + obj.clientMsg);
                }
            };
            return SelfInfoModify;
        }(gamelib.core.BaseUi));
        hall.SelfInfoModify = SelfInfoModify;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var ShengMing = /** @class */ (function (_super) {
            __extends(ShengMing, _super);
            function ShengMing() {
                return _super.call(this, "qpq/Art_Shengming") || this;
            }
            ShengMing.prototype.init = function () {
            };
            ShengMing.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
            };
            ShengMing.prototype.onClickObjects = function (evt) {
                playButtonSound();
            };
            return ShengMing;
        }(gamelib.core.BaseUi));
        hall.ShengMing = ShengMing;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 牌桌详细信息
         */
        var TableInfo = /** @class */ (function (_super) {
            __extends(TableInfo, _super);
            function TableInfo() {
                return _super.call(this, "qpq/Art_RoomInfo") || this;
            }
            TableInfo.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId != 0x2020) {
                    return;
                }
                if (data.groupId != this._data.groupId) {
                    return;
                }
                var banker_pid = 0;
                var curr_loop = 0; //斗版牛中表示当前轮数.
                var banker_loop = 0;
                var banker_score = 0;
                if (data.deskInfo != "") //banker_pid,game_time,curr_loop,[banker_loop banker_score]
                 {
                    var deskInfo = JSON.parse(data.deskInfo);
                    //this._res["txt_time"].text = utils.StringUtility.secToTimeString(deskInfo.game_time);
                    banker_pid = deskInfo.banker_pid;
                    curr_loop = deskInfo.curr_loop;
                    banker_loop = deskInfo.banker_loop;
                    banker_score = deskInfo.banker_score;
                }
                var arr = [];
                for (var i = 0; i < data.playerNum.length; i++) {
                    var playerInfo = JSON.parse(data.playerNum[i].playerInfo); //name,icon,pid,score,play_count,status;
                    playerInfo.isBanker = playerInfo.pid == banker_pid;
                    arr.push(playerInfo);
                    playerInfo.curr_loop = curr_loop;
                }
                this._list_data = arr;
                this._list.dataSource = arr;
                //this.bankerScore = banker_score;
            };
            TableInfo.prototype.init = function () {
                this._list = this._res["list_1"];
                this._noticeOther = false;
                this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
                // this._res["b_title"].removeChild(this._res["txt_4"]);	
                // this._res["b_title"].space = 50;
            };
            TableInfo.prototype.setData = function (data) {
                this._data = data;
                this._res["txt_1"].text = getDesByLan("房号") + ":" + data.validation;
                var config = qpq.g_configCenter.getConfigByGzIdAndModeId(data.gz_id, data.gameMode);
                this._res["txt_3"].text = getDesByLan("玩法") + ":" + config.name;
                this._res["txt_2"].text = getDesByLan("人数") + ":" + data.playerNowNum.length + "/" + data.playerMaxNum;
                this._res["txt_4"].text = getDesByLan("局数") + ":" + data.roundNow + "/" + data.roundMax;
                // this.baseScore = data.basePoints;
                this._res["txt_5"].text = "";
            };
            TableInfo.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                sendNetMsg(0x2020, this._data.groupId);
            };
            TableInfo.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            TableInfo.prototype.onItemUpdate = function (item, index) {
                var data = this._list_data[index];
                var txt = getChildByName(item, "txt_1");
                txt.text = data.pid;
                txt = getChildByName(item, "txt_2");
                txt.text = utils.StringUtility.getNameEx(data.name);
                txt = getChildByName(item, "txt_3");
                txt.text = data.score + "";
                txt = getChildByName(item, "txt_4");
                var toWrite;
                switch (data.status) {
                    case 1:
                        toWrite = getDesByLan("空闲");
                        break;
                    case 2:
                        toWrite = getDesByLan("游戏中");
                        break;
                    case 3:
                        toWrite = getDesByLan("离开");
                        break;
                }
                txt.text = toWrite;
                var img_icon = getChildByName(item, "img_icon");
                img_icon.visible = data.isBanker;
                img_icon = getChildByName(item, "b_head.img_head");
                img_icon.skin = data.icon;
                //item["__data"] = data;
            };
            return TableInfo;
        }(gamelib.core.Ui_NetHandle));
        hall.TableInfo = TableInfo;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 牌桌列表
         */
        var TableList = /** @class */ (function (_super) {
            __extends(TableList, _super);
            function TableList() {
                var _this = _super.call(this, "qpq/Art_RoomList") || this;
                _this._lastRequestTime = 0;
                _this._requestGrap = 10000;
                return _this;
            }
            TableList.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x00F2:
                        this.showList();
                        break;
                    case 0x00F6:
                        playSound_qipai("news");
                        if (data.result == 1) {
                            this.showList();
                        }
                        break;
                }
            };
            TableList.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._list.on(laya.events.Event.RENDER, this, this.onItemUpdate);
                this.showList();
                if (Laya.timer.currTimer - this._lastRequestTime >= this._requestGrap) {
                    sendNetMsg(0x00F2);
                    this._lastRequestTime = Laya.timer.currTimer;
                }
            };
            TableList.prototype.showList = function () {
                this._data = qpq.g_qpqData.m_groupList;
                this._res["b_title"].visible = this._data && this._data.length != 0;
                this._res["txt_tips"].visible = !this._res["b_title"].visible;
                this._list.dataSource = this._data;
            };
            TableList.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._list.off(laya.events.Event.RENDER, this, this.onItemUpdate);
            };
            TableList.prototype.init = function () {
                this._list = this._res["list_1"];
                this.addBtnToListener("btn_creat");
                this.addBtnToListener("btn_refresh");
                this._noticeOther = true;
            };
            /**
             * @param {laya.events.Event}
             * @author
             */
            TableList.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_creat":
                        g_signal.dispatch(qpq.SignalMsg.showCreateUi, 0);
                        this._noticeOther = false;
                        this.close();
                        this._noticeOther = true;
                        break;
                    case "btn_refresh":
                        sendNetMsg(0x00F2);
                        this._lastRequestTime = Laya.timer.currTimer;
                        var btn = evt.currentTarget;
                        btn.disabled = true;
                        Laya.timer.once(5000, this, function () {
                            btn.disabled = false;
                        });
                        break;
                }
            };
            TableList.prototype.onItemUpdate = function (item, index) {
                var data = this._data[index];
                var info = JSON.parse(data.gamePlayJson);
                var txt = getChildByName(item, "txt_1");
                txt.text = data.validation;
                txt = getChildByName(item, "txt_2");
                txt.text = data.playerNowNum.length + "/" + data.playerMaxNum;
                txt = getChildByName(item, "txt_3");
                txt.text = qpq.g_configCenter.getConfigByGzIdAndModeId(data.gz_id, data.gameMode).name;
                txt = getChildByName(item, "txt_4");
                if (data.gameID == 14 && data.gameMode == 4) {
                    txt.text = data.roundNow;
                }
                else {
                    txt.text = data.roundNow + "/" + data.roundMax;
                }
                var img_icon = getChildByName(item, "img_icon");
                img_icon.visible = GameVar.pid == data.roomOwnerPid;
                var btn = getChildByName(item, "btn_1");
                btn.visible = (GameVar.pid == data.roomOwnerPid);
                btn.off(laya.events.Event.CLICK, this, this.onTouchDismiss);
                btn.on(laya.events.Event.CLICK, this, this.onTouchDismiss);
                btn = getChildByName(item, "btn_2");
                btn.off(laya.events.Event.CLICK, this, this.onTouchEnter);
                btn.on(laya.events.Event.CLICK, this, this.onTouchEnter);
                btn = getChildByName(item, "btn_3");
                btn.visible = (data.playerNowNum.length < data.playerMaxNum);
                btn.off(laya.events.Event.CLICK, this, this.onTouchInvite);
                btn.on(laya.events.Event.CLICK, this, this.onTouchInvite);
                btn = getChildByName(item, "btn_4");
                btn.off(laya.events.Event.CLICK, this, this.onTouchBg);
                btn.on(laya.events.Event.CLICK, this, this.onTouchBg);
                item["__data"] = data;
            };
            TableList.prototype.onTouchDismiss = function (evt) {
                this._item_data = evt.currentTarget.parent["__data"];
                g_uiMgr.showConfirmUiByArgs({
                    msg: getDesByLan("是否解散当前选中的房间") + "？",
                    callBack: this.confirmDismiss,
                    thisObj: this,
                    okLabel: getDesByLan("解散"),
                    cancelLabel: getDesByLan("取消")
                });
                playSound_qipai("warn");
            };
            TableList.prototype.confirmDismiss = function (type) {
                if (type == 0) {
                    sendNetMsg(0x00F6, GameVar.pid, 4, this._item_data.groupId, 0, this._item_data.key);
                    g_signal.dispatch("showQpqLoadingUi", {
                        msg: getDesByLan("解散牌局中") + "...",
                        delay: 20,
                        alert: getDesByLan("解散牌局超时，请稍后重试")
                    });
                }
            };
            TableList.prototype.onDismissed = function (data) {
                // s_hall.closeLoading();
                // this.data.result = data.result;
                // Debugger.onDebugKey("dismiss",this.data);
                // playSound_qipai("news");
                // if(data.result == 1) {
                //     s_hall.removeTable(data);
                // }
            };
            TableList.prototype.onTouchEnter = function (evt) {
                this._item_data = evt.currentTarget.parent["__data"];
                if (this._item_data.playerNowNum.length >= this._item_data.playerMaxNum) {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("房间人数已满,不能加入") });
                    return;
                }
                this.close();
                //g_childGame.enterGame(this._item_data.gz_id,this._item_data.validation);
                //g_childGame.enterGameByClient(this._item_data.gz_id,true,this._item_data.validation);
                qpq.enterGameByValidation(this._item_data.validation);
                playButtonSound();
                evt.stopPropagation();
            };
            TableList.prototype.onTouchInvite = function (evt) {
                this._item_data = evt.currentTarget.parent["__data"];
                var temp = qpq.g_qpqData.getShare(this._item_data);
                temp.wxTips = true;
                gamelib.platform.share_circleByArgs(temp);
                playButtonSound();
                evt.stopPropagation();
            };
            TableList.prototype.onTouchBg = function (evt) {
                playButtonSound();
                g_signal.dispatch("showTableInfo", evt.currentTarget.parent["__data"]);
                evt.stopPropagation();
            };
            return TableList;
        }(gamelib.core.Ui_NetHandle));
        hall.TableList = TableList;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var TimerPicker = /** @class */ (function (_super) {
            __extends(TimerPicker, _super);
            function TimerPicker() {
                return _super.call(this, "qpq/Art_CreateUI_Time1") || this;
            }
            TimerPicker.prototype.init = function () {
                this.m_closeUiOnSide = false;
                this.addBtnToListener('btn_ok');
                this._res['btn_close'].visible = false;
                this._hour_txt = this._res['txt_1'];
                this._minute_txt = this._res['txt_2'];
                this._hour_txt.text = this._minute_txt.text = "";
                this._btns = [];
                this._btns.push(this._res['btn_up1']);
                this._btns.push(this._res['btn_up2']);
                this._btns.push(this._res['btn_down1']);
                this._btns.push(this._res['btn_down2']);
            };
            TimerPicker.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                for (var _i = 0, _a = this._btns; _i < _a.length; _i++) {
                    var btn = _a[_i];
                    btn.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown1);
                }
            };
            TimerPicker.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                for (var _i = 0, _a = this._btns; _i < _a.length; _i++) {
                    var btn = _a[_i];
                    btn.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown1);
                }
            };
            TimerPicker.prototype.onMouseDown1 = function (evt) {
                this._dowTime = Laya.timer.currTimer;
                var target = evt.currentTarget;
                Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp1, [target]);
                Laya.timer.once(200, this, this.btnTimer, [target, true]);
            };
            TimerPicker.prototype.btnTimer = function (target, isLoop) {
                switch (target) {
                    case this._res['btn_up1']:
                        this.setHour(this._hour - 1);
                        break;
                    case this._res['btn_up2']:
                        this.setMin(this._minute - 1);
                        break;
                    case this._res['btn_down1']:
                        this.setHour(this._hour + 1);
                        break;
                    case this._res['btn_down2']:
                        this.setMin(this._minute + 1);
                        break;
                    default:
                        // code...
                        break;
                }
                if (isLoop) {
                    Laya.timer.once(100, this, this.btnTimer, [target, true]);
                }
            };
            TimerPicker.prototype.onMouseUp1 = function (target, evt) {
                console.log("onMouseUp1" + (Laya.timer.currTimer - this._dowTime));
                Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp1);
                Laya.timer.clear(this, this.btnTimer);
                if (Laya.timer.currTimer - this._dowTime <= 200) //点击
                 {
                    this.btnTimer(target, false);
                    return;
                }
            };
            TimerPicker.prototype.setData = function (data) {
                this._handle = data[0];
                if (this._res['txt_title'])
                    this._res['txt_title'].text = data[1];
                var default_str = data[1];
                var offsize = data[2];
                var hour, min;
                if (default_str == "server_time") {
                    var date = new Date();
                    var tmc = Laya.timer.currTimer - GameVar.s_loginClientTime + GameVar.s_loginSeverTime * 1000;
                    if (!isNaN(offsize)) {
                        tmc += offsize * 1000;
                    }
                    date.setTime(tmc);
                    hour = date.getHours();
                    min = date.getMinutes();
                }
                else {
                    var arr = default_str.split(':');
                    hour = parseInt(arr[0]);
                    min = parseInt(arr[1]);
                }
                this._minHour = hour;
                this._minMinute = min;
                this.setHour(hour);
                this.setMin(min);
            };
            TimerPicker.prototype.onClickObjects = function (evt) {
                switch (evt.currentTarget.name) {
                    // case "btn_up1":
                    // 	this.setHour(this._hour - 1)
                    // 	break;
                    // case "btn_up2":
                    // 	this.setMin(this._minute - 1)
                    // 	break;
                    // case "btn_down1":
                    // 	this.setHour(this._hour + 1)
                    // 	break;
                    // case "btn_down2":
                    // 	this.setMin(this._minute + 1)
                    // 	break;	
                    case "btn_ok":
                        var str = this._hour < 10 ? "0" + this._hour : "" + this._hour;
                        str += ":";
                        str += this._minute < 10 ? "0" + this._minute : "" + this._minute;
                        this._handle.runWith(str);
                        this.close();
                        break;
                }
            };
            TimerPicker.prototype.setHour = function (value) {
                if (value < 0) {
                    value = 23;
                }
                else if (value > 23)
                    value = this._minHour;
                if (value < this._minHour) {
                    // value = this._minHour;
                    value = 23;
                }
                if (value == this._minHour) {
                    if (this._minute < this._minMinute)
                        this.setMin(this._minMinute);
                }
                this._hour = value;
                this._hour_txt.text = value < 10 ? "0" + value : "" + value;
            };
            TimerPicker.prototype.setMin = function (value) {
                if (value < 0) {
                    value = 59;
                }
                else if (value > 59) {
                    value = 59;
                    if (this._hour > this._minHour)
                        value = 0;
                    else
                        value = this._minMinute;
                }
                if (this._hour <= this._minHour) {
                    if (value < this._minMinute) {
                        // value = this._minMinute;
                        value = 59;
                    }
                }
                this._minute = value;
                this._minute_txt.text = value < 10 ? "0" + value : "" + value;
            };
            return TimerPicker;
        }(gamelib.core.BaseUi));
        hall.TimerPicker = TimerPicker;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var TuiGuang = /** @class */ (function (_super) {
            __extends(TuiGuang, _super);
            function TuiGuang() {
                return _super.call(this, 'qpq/Art_Tuiguang') || this;
            }
            TuiGuang.prototype.init = function () {
                this._res['txt_2'].text = GameVar.g_platformData['txt_kf'];
            };
            return TuiGuang;
        }(gamelib.core.BaseUi));
        hall.TuiGuang = TuiGuang;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var UserInfoUi = /** @class */ (function (_super) {
            __extends(UserInfoUi, _super);
            function UserInfoUi() {
                return _super.call(this, "qpq/Art_Playerinfo_1") || this;
            }
            UserInfoUi.prototype.init = function () {
                this._res["icon_head"].skin = GameVar.playerHeadUrl;
                this._res["txt_id"].text = "ID:" + GameVar.pid;
                // this._res["txt_name"].text = GameVar.nickName;
                utils.tools.setLabelDisplayValue(this._res["txt_name"], GameVar.nickName);
                this.addBtnToListener("btn_zixun");
                this.addBtnToListener("btn_buy");
                this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
                this._vip_introduce_url = GameVar.g_platformData['vip_introduce_url'];
                this._res['img_coin'].visible = this._res['txt_money'].visible = GameVar.g_platformData.show_money;
                if (GameVar.g_platformData["gold_res_name"]) {
                    this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
                }
                if (this._res['b_bangding']) {
                    this._bindRefer = new hall.BindRefer(this._res);
                }
            };
            UserInfoUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this._bindRefer) {
                    this._bindRefer.close();
                }
            };
            UserInfoUi.prototype.onShow = function () {
                if (this._bindRefer) {
                    this._bindRefer.show();
                }
                this._res["txt_diamond"].text = qpq.data.PlayerData.s_self.getGold_num();
                this._res["txt_money"].text = gamelib.data.UserInfo.s_self.m_money + "";
                var isVip = GameVar.isGameVip;
                this._res["img_QRCode"].skin = GameVar.m_QRCodeUrl;
                //通过平台配置文件中vip_introduce_url的值来决定用那种vip按钮方式
                if (this._vip_introduce_url) {
                    if (isVip) {
                        this._res["b_1"].visible = true;
                        this._res["btn_buy"].label = getDesByLan("VIP信息查看");
                        //头像的vip专属二维码不显示玩家上传的二维码
                        this._qrcodeImg.setUrl(window["application_share_url"]());
                    }
                    else {
                        this._res["b_1"].visible = false;
                        this._res["btn_buy"].label = getDesByLan("购买vip");
                    }
                }
                else {
                    this._res["btn_buy"].label = getDesByLan("VIP信息查看");
                    this._res["b_1"].visible = isVip;
                    this._res["btn_zixun"].visible = false;
                    this._res['btn_buy'].x = 692;
                }
                //公众号被封，不显示咨询
                this._res["btn_zixun"].visible = false;
                this._res['btn_buy'].x = 692;
                this._res["b_0"].visible = !this._res["b_1"].visible;
                this._res['btn_buy'].visible = !utils.tools.isApp();
            };
            UserInfoUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_zixun":
                        Laya.Browser.window.location.href = GameVar.g_platformData['vip_introduce_url'];
                        break;
                    case "btn_buy":
                        if (this._vip_introduce_url == null) {
                            if (window["application_agent_url"])
                                Laya.Browser.window.location.href = window["application_agent_url"]();
                            return;
                        }
                        if (GameVar.isGameVip) {
                            if (window["application_agent_url"])
                                Laya.Browser.window.location.href = window["application_agent_url"]();
                        }
                        else {
                            g_uiMgr.openShop(2);
                            this.close();
                        }
                        break;
                }
            };
            return UserInfoUi;
        }(gamelib.core.BaseUi));
        hall.UserInfoUi = UserInfoUi;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 有签名
         * @type {[type]}
         */
        var UserInfoUi1 = /** @class */ (function (_super) {
            __extends(UserInfoUi1, _super);
            function UserInfoUi1() {
                return _super.call(this, "qpq/Art_Playerinfo") || this;
            }
            UserInfoUi1.getRandomSign = function () {
                return "说点什么呢~哼哼唧唧";
                // var strs:Array<string> = [];
                // strs.push(getDesByLan("才、才不是懒得写签名呢！只是在思考"),getDesByLan("这个人很懒，神马都没写..."),getDesByLan("不好了，我的签名跑掉了"));
                // strs.push(getDesByLan("怎么吃都吃不胖的一个人"),getDesByLan("来来来，血战到天亮！"));
                // var index:number = utils.MathUtility.random(0,strs.length - 1);
                // return strs[index];
            };
            UserInfoUi1.prototype.init = function () {
                this._txt_input = this._res["txt_input"];
                this.addBtnToListener("btn_shop2");
                this.addBtnToListener("btn_shop");
                this.addBtnToListener("btn_modify");
                if (this._res['btn_shop2'])
                    this._shop_btn = this._res['btn_shop2'];
                if (this._res['btn_shop'])
                    this._shop_btn = this._res['btn_shop'];
                if (this._res['img_diamond']) {
                    if (GameVar.g_platformData["gold_res_name"]) {
                        this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
                    }
                }
                this._txt_input.maxChars = 60;
                if (this._res['b_bangding']) {
                    this._bindRefer = new hall.BindRefer(this._res);
                }
            };
            UserInfoUi1.prototype.setData = function (pd) {
                this._pd = pd;
            };
            UserInfoUi1.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this._bindRefer) {
                    this._bindRefer.close();
                }
            };
            UserInfoUi1.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                if (this._bindRefer)
                    this._bindRefer.show();
                // 排行榜 不显示绑定
                if (this._pd != 0 && this._pd.pid != qpq.data.PlayerData.s_self.m_pId) {
                    if (this._bindRefer) {
                        this._bindRefer.close();
                    }
                }
                var pid = 0;
                var headUrl;
                var nickname;
                var address;
                var money;
                if (this._pd != 0 && this._pd != null) {
                    pid = this._pd.pid;
                }
                else {
                    this._pd = null;
                }
                if (this._pd == null || pid == GameVar.pid) {
                    pid = 0;
                    this._res['btn_modify'].visible = true;
                    if (this._shop_btn)
                        this._shop_btn.visible = true;
                    money = gamelib.data.UserInfo.s_self.getGold_num();
                    this._txt_input.editable = true;
                    this._txt_input.mouseEnabled = true;
                    headUrl = GameVar.playerHeadUrl;
                    nickname = GameVar.nickName;
                    address = gamelib.data.UserInfo.s_self.m_address;
                    sendNetMsg(0x2035, 1, pid, "");
                }
                else {
                    pid = this._pd.pid;
                    nickname = this._pd.name;
                    headUrl = this._pd.headUrl;
                    money = this._pd.value;
                    address = this._pd.address;
                    this._res['btn_modify'].visible = false;
                    if (this._shop_btn)
                        this._shop_btn.visible = false;
                    this._txt_input.editable = false;
                    this._txt_input.mouseEnabled = false;
                    this._txt_input.text = this._pd.sign;
                    if (this._txt_input.text == "") {
                        this._txt_input.text = getDesByLan('默认签名');
                    }
                }
                if (pid == 0)
                    pid = GameVar.pid;
                this._res["icon_head"].skin = headUrl;
                this._res["txt_id"].text = "ID:" + pid;
                // this._res["txt_name"].text = nickname;
                utils.tools.setLabelDisplayValue(this._res["txt_name"], nickname);
                this._res["txt_money"].text = money + "";
                this._res["txt_money"].text = utils.tools.getMoneyByExchangeRate(money);
                if (this._res['txt_address'])
                    this._res['txt_address'].text = address;
                if (this._res['txt_ip'])
                    this._res['txt_ip'].text = "";
                this._pd = null;
            };
            UserInfoUi1.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x2035) {
                    try {
                        var obj = JSON.parse(data.msg);
                        this._netData = obj;
                        this._txt_input.text = obj["签名"];
                    }
                    catch (e) {
                        this._txt_input.text = UserInfoUi1.getRandomSign();
                    }
                    if (this._txt_input.text == "" || this._txt_input.text == "undefined")
                        this._txt_input.text = UserInfoUi1.getRandomSign();
                }
            };
            UserInfoUi1.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_shop2":
                    case "btn_shop":
                        g_uiMgr.openShop(2);
                        this.close();
                        break;
                    case "btn_modify":
                        if (this._txt_input.text == "") {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("签名不能为空") });
                            return;
                        }
                        if (this._netData == null)
                            this._netData = {};
                        this._netData["签名"] = this._txt_input.text;
                        sendNetMsg(0x2035, 0, GameVar.pid, JSON.stringify(this._netData));
                        g_uiMgr.showTip(getDesByLan("修改成功"));
                        break;
                }
            };
            return UserInfoUi1;
        }(gamelib.core.Ui_NetHandle));
        hall.UserInfoUi1 = UserInfoUi1;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
/**
* name
*/
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 有统计信息和签名
         * @type {[type]}
         */
        var UserInfoUi2 = /** @class */ (function (_super) {
            __extends(UserInfoUi2, _super);
            function UserInfoUi2() {
                return _super.call(this, "qpq/Art_Playerinfo") || this;
            }
            UserInfoUi2.prototype.init = function () {
                this._txt_input = this._res["txt_input"];
                this.addBtnToListener("btn_shop2");
                this.addBtnToListener("btn_modify");
                if (this._res['img_diamond']) {
                    if (GameVar.g_platformData["gold_res_name"]) {
                        this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
                    }
                }
                this._txt_input.maxChars = 60;
                this._tjList = [];
                this._tjList.push(this._res['txt_sl']);
                this._tjList.push(this._res['txt_changci1']);
                this._tjList.push(this._res['txt_changci2']);
                this._tjList.push(this._res['txt_changci3']);
                this._tjList.push(this._res['txt_dyj']);
                this._tjList.push(this._res['txt_zm']);
                this._tjList.push(this._res['txt_djzg']);
                this._tjList.push(this._res['txt_px']);
                this._res['txt_px'].text = "";
                this._tjStrings = [];
                this._tjStrings.push(getDesByLan("胜率"));
                this._tjStrings.push(getDesByLan("转嘴子"));
                this._tjStrings.push(getDesByLan("摸张听"));
                this._tjStrings.push(getDesByLan("推到胡"));
                this._tjStrings.push(getDesByLan("大赢家次数"));
                this._tjStrings.push(getDesByLan("自摸次数"));
                this._tjStrings.push(getDesByLan("单局最高分数"));
                for (var _i = 0, _a = this._tjList; _i < _a.length; _i++) {
                    var label = _a[_i];
                    label.text = "";
                }
                this._res['img_head'].skin = GameVar.playerHeadUrl;
                this._res['txt_id'].text = "ID:" + GameVar.pid;
                // this._res['txt_name'].text = "" + GameVar.nickName;
                utils.tools.setLabelDisplayValue(this._res["txt_name"], GameVar.nickName);
                this._res['btn_shop2'].visible = GameVar.g_platformData['show_shop'];
                if (this._res['b_bangding']) {
                    this._bindRefer = new hall.BindRefer(this._res);
                }
            };
            UserInfoUi2.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                if (this._bindRefer) {
                    this._bindRefer.show();
                }
                this._pd = qpq.data.PlayerData.s_self;
                this._res['txt_ip'].text = this._pd.m_address;
                this._res["txt_money"].text = this._pd.getGold_num() + "";
                sendNetMsg(0x2035, 1, this._pd.m_pId, "");
                sendNetMsg(0x0089, this._pd.m_pId, qpq.g_configCenter.getConfigByIndex(1).gz_id, 1);
            };
            UserInfoUi2.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this._bindRefer) {
                    this._bindRefer.close();
                }
            };
            UserInfoUi2.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x2035) {
                    try {
                        var obj = JSON.parse(data.msg);
                        this._netData = obj;
                        this._txt_input.text = obj["签名"];
                    }
                    catch (e) {
                        this._txt_input.text = hall.UserInfoUi1.getRandomSign();
                    }
                    if (this._txt_input.text == "" || this._txt_input.text == "undefined")
                        this._txt_input.text = hall.UserInfoUi1.getRandomSign();
                }
                else if (msgId == 0x0089) {
                    if (data.dataNum.length == 0) {
                        this.initValues();
                    }
                    else {
                        var obj = data.dataNum[0];
                        try {
                            obj = JSON.parse(obj.datas).normal;
                            for (var i = 0; i < this._tjStrings.length; i++) {
                                var key = this._tjStrings[i];
                                var label = this._tjList[i];
                                var value = obj[key];
                                if (isNaN(value)) {
                                    value = 0;
                                }
                                if (key == getDesByLan("胜率")) {
                                    value = value / 100;
                                    label.text = key + ":" + value + "%";
                                }
                                else {
                                    label.text = key + ":" + value;
                                }
                            }
                        }
                        catch (e) {
                            this.initValues();
                        }
                    }
                }
            };
            UserInfoUi2.prototype.initValues = function () {
                for (var i = 0; i < this._tjList.length; i++) {
                    var label = this._tjList[i];
                    var str = this._tjStrings[i];
                    label.text = utils.StringUtility.format(str, ['----']);
                }
            };
            UserInfoUi2.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_shop2":
                        g_uiMgr.openShop(2);
                        this.close();
                        break;
                    case "btn_modify":
                        if (this._txt_input.text == "") {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("签名不能为空") });
                            return;
                        }
                        if (this._netData == null)
                            this._netData = {};
                        this._netData["签名"] = this._txt_input.text;
                        sendNetMsg(0x2035, 0, GameVar.pid, JSON.stringify(this._netData));
                        g_uiMgr.showTip(getDesByLan("修改成功!"));
                        break;
                }
            };
            return UserInfoUi2;
        }(gamelib.core.Ui_NetHandle));
        hall.UserInfoUi2 = UserInfoUi2;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var Rna = /** @class */ (function (_super) {
            __extends(Rna, _super);
            function Rna() {
                return _super.call(this, "qpq/Art_RNA") || this;
            }
            Rna.prototype.init = function () {
                this.addBtnToListener("btn_ok");
                this.sheng_fen = this._res["txt_input1"];
                this.hao_ma = this._res["txt_input2"];
                this.hao_ma.restrict = "0-9xX";
                this._noticeOther = true;
            };
            Rna.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_uiMgr.showMiniLoading();
                if (qpq.g_commonFuncs == null)
                    sendNetMsg(0x2035, 1, GameVar.pid, "");
                else {
                    gamelib.Api.getUserIdentity(Laya.Handler.create(this, this.onGetCallBack));
                }
            };
            Rna.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x2035) {
                    g_uiMgr.closeMiniLoading();
                    try {
                        var obj = JSON.parse(data.msg);
                        this._netData = obj;
                        var temp = obj["实名认证"];
                        if (temp) {
                            this.sheng_fen.text = temp['name'];
                            this.hao_ma.text = temp['num'];
                            this.editable = false;
                        }
                        else {
                            this.sheng_fen.text = "";
                            this.hao_ma.text = "";
                            this.editable = true;
                        }
                    }
                    catch (e) {
                        this.editable = true;
                    }
                }
            };
            Object.defineProperty(Rna.prototype, "editable", {
                get: function () {
                    return this._bSet;
                },
                set: function (value) {
                    this._bSet = value;
                    this.sheng_fen.editable = this.hao_ma.editable = value;
                },
                enumerable: true,
                configurable: true
            });
            Rna.prototype.onClickObjects = function (evt) {
                switch (evt.currentTarget.name) {
                    //确定
                    case "btn_ok":
                        if (!this.editable) {
                            this.close();
                            return;
                        }
                        var shenf = this.sheng_fen.text + "";
                        var haoma = this.hao_ma.text + "";
                        if (shenf != "" && haoma != "" && /^.{18}$/.test(haoma)) {
                            if (qpq.g_commonFuncs != null) {
                                gamelib.Api.updateUserIdentity({ actual: shenf, idcard: haoma }, Laya.Handler.create(this, this.onSaveCallBack));
                            }
                            else {
                                g_uiMgr.showTip(getDesByLan("实名成功") + "！");
                                if (this._netData == null)
                                    this._netData = {};
                                var temp = this._netData["实名认证"];
                                if (temp == null) {
                                    temp = {};
                                    this._netData["实名认证"] = temp;
                                }
                                temp['name'] = this.sheng_fen.text;
                                temp['num'] = this.hao_ma.text;
                                sendNetMsg(0x2035, 0, GameVar.pid, JSON.stringify(this._netData));
                                this.close();
                            }
                        }
                        else {
                            g_uiMgr.showTip(getDesByLan("请输入正确的姓名和身份证号码") + "！");
                        }
                        shenf = "";
                        haoma = "";
                        break;
                }
            };
            Rna.prototype.onSaveCallBack = function (obj) {
                if (obj.ret == 1) {
                    g_uiMgr.showTip(getDesByLan("实名成功") + "！");
                    this.close();
                    try {
                        sendNetMsg(0x2202, 2, 5);
                    }
                    catch (e) {
                    }
                }
                else {
                    g_uiMgr.showTip(getDesByLan("实名失败") + "  " + obj.clientMsg);
                }
            };
            Rna.prototype.onGetCallBack = function (obj) {
                g_uiMgr.closeMiniLoading();
                if (obj.ret == 1) {
                    this.sheng_fen.text = obj.data.actual;
                    this.hao_ma.text = obj.data.idcard;
                    if (obj.data.actual != "" && obj.data.idcard != "") {
                        this.editable = false;
                        this._res['btn_ok'].visible = false;
                    }
                    else {
                        this.editable = true;
                        this._res['btn_ok'].visible = true;
                    }
                }
                else {
                    this.sheng_fen.text = "";
                    this.hao_ma.text = "";
                    this.editable = true;
                }
            };
            return Rna;
        }(gamelib.core.Ui_NetHandle));
        hall.Rna = Rna;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        var SignInUi_s0 = /** @class */ (function (_super) {
            __extends(SignInUi_s0, _super);
            function SignInUi_s0() {
                return _super.call(this, "qpq/Art_Signin") || this;
            }
            SignInUi_s0.prototype.init = function () {
                var arr = [getDesByLan("周一"), getDesByLan("周二"), getDesByLan("周三"), getDesByLan("周四"), getDesByLan("周五"), getDesByLan("周六"), getDesByLan("周日")];
                for (var i = 1; i <= 7; i++) {
                    var btn = this._res['UI_' + i]['btn_ok1'];
                    var label = this._res['UI_' + i]['txt_1'];
                    label.text = arr[i - 1];
                    btn.label = getDesByLan("签到");
                }
                this.addBtnToListener('btn_ok8');
                this.addBtnToListener('btn_ok9');
                this.addBtnToListener('btn_ok10');
            };
            SignInUi_s0.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x2034:
                        if (data.result != 1) {
                            g_uiMgr.showTip(getDesByLan("签到失败") + "!" + data.result);
                            return;
                        }
                        g_uiMgr.showTip(getDesByLan("签到成功") + "!");
                        break;
                    case 0x2033:
                        this.update();
                        break;
                }
            };
            SignInUi_s0.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                for (var i = 1; i <= 7; i++) {
                    var btn = this._res['UI_' + i]['btn_ok1'];
                    btn.on(Laya.Event.CLICK, this, this.onClickQd);
                }
                var temp = new Date();
                temp.setTime(GameVar.s_loginSeverTime * 1000);
                console.log(temp.getFullYear());
                this._today = temp.getDay();
                this.update();
            };
            SignInUi_s0.prototype.update = function () {
                var list = qpq.g_qpqData.m_siginData.list;
                for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                    var item = list_3[_i];
                    this.setItem(item);
                }
                list = qpq.g_qpqData.m_siginData.list_lj;
                for (var i = 0; i < list.length; i++) {
                    this.setLeiJi(list[i], i);
                }
                this._res['txt_day'].text = getDesByLan("累计天数") + ":" + qpq.g_qpqData.m_siginData.day_lj;
            };
            SignInUi_s0.prototype.onClickObjects = function (evt) {
                var day = evt.currentTarget['__day'];
                sendNetMsg(0x2034, 3, day);
            };
            SignInUi_s0.prototype.onClickQd = function (evt) {
                console.log("签到");
                sendNetMsg(0x2034, 1, evt.currentTarget['__index']);
            };
            SignInUi_s0.prototype.setItem = function (itemData) {
                var index = itemData.index;
                var res = this._res['UI_' + index];
                res['btn_ok1']['__index'] = index;
                var gd = res['img_goods1'];
                var ylq = res['img_ylq1'];
                var btn = res['btn_ok1'];
                var num = res['txt_2'];
                if (itemData.awards[0].msId == GameVar.g_platformData.gold_type)
                    gd.skin = "window/signin_gift_1.png";
                num.text = "x" + itemData.awards[0].num;
                if (itemData.statue == 0) {
                    ylq.visible = btn.visible = false;
                    res.disabled = this._today >= index;
                }
                else if (itemData.statue == 1) {
                    ylq.visible = false;
                    btn.visible = true;
                }
                else if (itemData.statue == 2) {
                    ylq.visible = true;
                    btn.visible = false;
                }
            };
            SignInUi_s0.prototype.setLeiJi = function (itemdata, index) {
                var day = this._res['txt_ts' + (1 + index)];
                var btn = this._res['btn_ok' + (8 + index)];
                var num = this._res['txt_sl' + (1 + index)];
                btn['__day'] = itemdata.days;
                day.text = getDesByLan("累计") + " itemdata.days " + getDesByLan("天");
                num.text = itemdata.awards[0].num;
                if (itemdata.statue == 0) {
                    btn.disabled = true;
                    btn.label = getDesByLan("领取");
                }
                else if (itemdata.statue == 1) {
                    btn.disabled = false;
                    btn.label = getDesByLan("领取");
                }
                else {
                    btn.disabled = true;
                    btn.label = getDesByLan("已领取");
                }
            };
            return SignInUi_s0;
        }(gamelib.core.Ui_NetHandle));
        hall.SignInUi_s0 = SignInUi_s0;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 没有累计领取
         * @type {[type]}
         */
        var SignInUi_s1 = /** @class */ (function (_super) {
            __extends(SignInUi_s1, _super);
            function SignInUi_s1() {
                return _super.call(this, "qpq/Art_Signin") || this;
            }
            SignInUi_s1.prototype.init = function () {
                var arr = [getDesByLan("周一"), getDesByLan("周二"), getDesByLan("周三"), getDesByLan("周四"), getDesByLan("周五"), getDesByLan("周六"), getDesByLan("周日")];
                for (var i = 1; i <= 7; i++) {
                    var box = this._res['b_' + i];
                    var btn = getChildByName(box, "btn_ok");
                    var label = getChildByName(box, "txt_1");
                    label.text = arr[i - 1];
                    btn["__day"] = i;
                    this._clickEventObjects.push(btn);
                }
            };
            SignInUi_s1.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x2034:
                        if (data.result != 1) {
                            g_uiMgr.showTip(getDesByLan("签到失败") + "!" + data.result);
                            return;
                        }
                        g_uiMgr.showTip(getDesByLan("签到成功") + "!");
                        break;
                    case 0x2033:
                        this.update();
                        break;
                }
            };
            SignInUi_s1.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.update();
            };
            SignInUi_s1.prototype.update = function () {
                var list = qpq.g_qpqData.m_siginData.list;
                for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                    var item = list_4[_i];
                    this.setItem(item);
                }
            };
            SignInUi_s1.prototype.onClickObjects = function (evt) {
                var day = evt.currentTarget['__day'];
                console.log("签到");
                sendNetMsg(0x2034, 1, day);
            };
            SignInUi_s1.prototype.setItem = function (itemData) {
                var index = itemData.index;
                var box = this._res["b_" + index];
                var gd = getChildByName(box, 'img_goods');
                var ylq = getChildByName(box, 'img_ylq');
                var btn = getChildByName(box, 'btn_ok');
                var num = getChildByName(box, 'txt_2');
                if (itemData.awards[0].msId == GameVar.g_platformData.gold_type)
                    gd.skin = "window/signin_gift_1.png";
                num.text = "x" + itemData.awards[0].num;
                if (itemData.statue == 0) {
                    ylq.visible = btn.visible = false;
                    btn.disabled = true;
                }
                else if (itemData.statue == 1) {
                    ylq.visible = false;
                    btn.visible = true;
                    btn.disabled = false;
                }
                else if (itemData.statue == 2) {
                    ylq.visible = true;
                    btn.visible = false;
                }
            };
            return SignInUi_s1;
        }(gamelib.core.Ui_NetHandle));
        hall.SignInUi_s1 = SignInUi_s1;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
var qpq;
(function (qpq) {
    var hall;
    (function (hall) {
        /**
         * 没有累计领取
         * @type {[type]}
         */
        var SignInUi_s2 = /** @class */ (function (_super) {
            __extends(SignInUi_s2, _super);
            function SignInUi_s2() {
                return _super.call(this, "qpq/Art_Signin") || this;
            }
            SignInUi_s2.prototype.init = function () {
                var arr = [getDesByLan("周一"), getDesByLan("周二"), getDesByLan("周三"), getDesByLan("周四"), getDesByLan("周五"), getDesByLan("周六"), getDesByLan("周日")];
                for (var i = 1; i <= 7; i++) {
                    var box = this._res['ui_' + i];
                    var label = box["txt_1"];
                    label.text = arr[i - 1];
                    box["__day"] = i;
                    this._clickEventObjects.push(box);
                }
                this._res['btn_lingqu'].visible = false;
            };
            SignInUi_s2.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x2034:
                        if (data.result != 1) {
                            g_uiMgr.showTip(getDesByLan("签到失败") + "!" + data.result);
                            return;
                        }
                        g_uiMgr.showTip(getDesByLan("签到成功") + "!");
                        break;
                    case 0x2033:
                        this.update();
                        break;
                }
            };
            SignInUi_s2.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.update();
            };
            SignInUi_s2.prototype.update = function () {
                var list = qpq.g_qpqData.m_siginData.list;
                var isGuoqi = true;
                for (var _i = 0, list_5 = list; _i < list_5.length; _i++) {
                    var item = list_5[_i];
                    if (isGuoqi && item.statue >= 1) {
                        isGuoqi = false;
                    }
                    item.isGuoqi = isGuoqi;
                    this.setItem(item);
                }
            };
            SignInUi_s2.prototype.onClickObjects = function (evt) {
                var day = evt.currentTarget['__day'];
                console.log("签到");
                sendNetMsg(0x2034, 1, evt.currentTarget['__index']);
            };
            SignInUi_s2.prototype.setItem = function (itemData) {
                var index = itemData.index;
                var box = this._res["ui_" + index];
                var gd = box['img_goods'];
                var ylq = box['img_ylq1'];
                var num = box['txt_2'];
                var ygq = box['b_guoqi'];
                if (itemData.awards[0].msId == GameVar.g_platformData.gold_type)
                    gd.skin = "window/signin_gift_1.png";
                num.text = "x" + itemData.awards[0].num;
                if (itemData.statue == 0) {
                    ylq.visible = false;
                    box.mouseEnabled = false;
                }
                else if (itemData.statue == 1) {
                    ylq.visible = false;
                    box.mouseEnabled = true;
                }
                else if (itemData.statue == 2) {
                    ylq.visible = true;
                    box.mouseEnabled = false;
                }
                ygq.visible = itemData.isGuoqi;
            };
            return SignInUi_s2;
        }(gamelib.core.Ui_NetHandle));
        hall.SignInUi_s2 = SignInUi_s2;
    })(hall = qpq.hall || (qpq.hall = {}));
})(qpq || (qpq = {}));
