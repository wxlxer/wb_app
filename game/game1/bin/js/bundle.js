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
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./ui/layaMaxUI");
var Hall_1 = require("./com/Hall");
var GameData_1 = require("./com/data/GameData");
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        var arr = [];
        arr.push({ url: "atlas/comp.atlas", type: Laya.Loader.ATLAS });
        arr.push({ url: "atlas/bgs.atlas", type: Laya.Loader.ATLAS });
        arr.push({ url: "atlas/btns.atlas", type: Laya.Loader.ATLAS });
        arr.push({ url: "atlas/icons.atlas", type: Laya.Loader.ATLAS });
        Laya.loader.load(arr, Laya.Handler.create(_this, _this.onResloaded));
        return _this;
    }
    Main.prototype.onResloaded = function () {
        _super.prototype.onResloaded.call(this);
        GameVar.s_domain = "http://show2.bodemo.vip";
        //加载IDE指定的场景
        //GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        // var main:ui.HallUiUI = new ui.HallUiUI();
        // main.width = Laya.stage.width;
        // main.height = Laya.stage.height;
        // Laya.stage.addChild(main);
        layaMaxUI_1.ui.ChongZhiHistroyUI;
        var main = new Hall_1.default();
        main.show();
        window['g_gameData'] = GameData_1.g_gameData;
    };
    return Main;
}(gamelib.core.GameMain));
//激活启动类
new Main();

},{"./com/Hall":6,"./com/data/GameData":23,"./ui/layaMaxUI":40}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class AlertUi
 * 游戏通用提示框。资源是用的ui.common.Art_CustomTipsUI如果游戏没有，则使用的是qpq中资源
 * @author wx
 * @extends gamelib.core.BaseUi
 * @uses TipManager
 */
var AlertUi = /** @class */ (function (_super) {
    __extends(AlertUi, _super);
    function AlertUi() {
        return _super.call(this, "ui.AlertUI") || this;
    }
    AlertUi.prototype.init = function () {
        _super.prototype.init.call(this);
        this.btn_ok = this._res["btn_ok"];
        this.btn_cancel = this._res["btn_cancel"];
        this.txt_tips = this._res["txt_txt"];
        this.width = this._res.width;
        this._oldAtts = {};
        this._oldAtts.okPos = this.btn_ok.x;
        this._oldAtts.cancelPos = this.btn_cancel.x;
        this._clickEventObjects.push(this.btn_ok);
        this._clickEventObjects.push(this.btn_cancel);
        this._noticeOther = false;
        this.m_closeUiOnSide = false;
        this.m_layer = 10;
        this._isModal = true;
    };
    /**
     * @function setData
     * @author wx
     * @DateTime 2018-03-15
     * @param  {any}  params 一个对象。包含
     * msg：提示文本
     * type : 0：只有确定按钮，1：确定和取消按钮,2:确定，取消，关闭按钮都有 3，三个按钮都没有 4:确定按钮和关闭按钮
     * callBack : 回掉方法 callback(type:number); ,0:确定，1:关闭按钮，2：取消按钮
     * autoCall:自动关闭的时间（秒），0：不自动关闭,否则会在确定按钮上显示倒计时
     * okLabel:确定按钮文本
     * cancelLabel：取消按钮的文本
     */
    AlertUi.prototype.setData = function (params) {
        this.txt_tips.text = params.msg;
        this.txt_tips.align = "center";
        this.txt_tips.valign = "middle";
        this.txt_tips.editable = false;
        this.txt_tips.mouseEnabled = false;
        //this.txt_title.text = "";
        this._callBack = params.callBack;
        this._thisObj = params.thisObj;
        var autoCall = params.autoCall;
        if (params.type == 0) {
            this.btn_ok.visible = true;
            this.btn_ok.x = (this.width - this.btn_ok.width) / 2;
            this.btn_cancel.visible = this.btn_close.visible = false;
        }
        else if (params.type == 1) {
            this.btn_cancel.visible = this.btn_ok.visible = true;
            this.btn_ok.x = this._oldAtts.okPos;
            this.btn_cancel.x = this._oldAtts.cancelPos;
            this.btn_close.visible = false;
        }
        else if (params.type == 2) {
            this.btn_cancel.visible = this.btn_close.visible = this.btn_ok.visible = true;
            this.btn_ok.x = this._oldAtts.okPos;
            this.btn_cancel.x = this._oldAtts.cancelPos;
        }
        else if (params.type == 3) {
            this.btn_cancel.visible = this.btn_ok.visible = this.btn_close.visible = false;
        }
        else if (params.type == 4) {
            this.btn_cancel.visible = false;
            this.btn_ok.x = (this.width - this.btn_ok.width) / 2;
        }
        this.btn_ok.mouseEnabled = this.btn_ok.visible;
    };
    AlertUi.prototype.onClose = function () {
        _super.prototype.onClose.call(this);
    };
    AlertUi.prototype.onClickObjects = function (evt) {
        playButtonSound();
        if (evt.currentTarget == this.btn_ok) {
            if (this._callBack) {
                this._callBack.call(this._thisObj, 0);
            }
        }
        else if (evt.currentTarget == this.btn_cancel) {
            if (this._callBack)
                this._callBack.call(this._thisObj, 2);
        }
        this.close();
    };
    AlertUi.prototype.onClickCloseBtn = function (evt) {
        _super.prototype.onClickCloseBtn.call(this, evt);
        if (this._callBack) {
            this._callBack.call(this._thisObj, 1);
        }
    };
    return AlertUi;
}(gamelib.core.BaseUi));
exports.default = AlertUi;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy = /** @class */ (function (_super) {
    __extends(BaseHistroy, _super);
    function BaseHistroy(res) {
        return _super.call(this, res) || this;
    }
    BaseHistroy.prototype.init = function () {
        this._list = this._res["list_1"];
        this._tips = this._res['txt_tips'];
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    BaseHistroy.prototype.setData = function (data) {
        this._list.dataSource = data;
        this._tips.visible = data == null || data.length == 0;
    };
    BaseHistroy.prototype.onItemRender = function (box, index) {
    };
    return BaseHistroy;
}(gamelib.core.Ui_NetHandle));
exports.default = BaseHistroy;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel = /** @class */ (function (_super) {
    __extends(BasePanel, _super);
    function BasePanel(res) {
        return _super.call(this, res) || this;
    }
    BasePanel.prototype.show = function () {
        _super.prototype.show.call(this);
        this.aniIn();
        g_signal.dispatch("onUiShow", this);
    };
    BasePanel.prototype.close = function () {
        this.aniOut();
        g_signal.dispatch("onUiClose", this);
    };
    BasePanel.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
    };
    BasePanel.prototype.onClose = function () {
        _super.prototype.onClose.call(this);
    };
    BasePanel.prototype.aniIn = function () {
        this._res.x = Laya.stage.width;
        Laya.Tween.to(this._res, { x: 0 }, 300, Laya.Ease.quartOut);
    };
    BasePanel.prototype.aniOut = function () {
        Laya.Tween.to(this._res, { x: Laya.stage.width }, 300, Laya.Ease.quartOut, Laya.Handler.create(this, this.onAniOutEnd));
    };
    BasePanel.prototype.onAniOutEnd = function () {
        _super.prototype.close.call(this);
    };
    return BasePanel;
}(gamelib.core.Ui_NetHandle));
exports.default = BasePanel;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiMainager_1 = require("./UiMainager");
function login(username, pwd) {
    g_net.request(gamelib.GameMsg.Login, { un: username, pw: pwd });
}
exports.default = login;
exports.UiConfig = {
    list_item_1: "comp/list_itembg1.png",
    list_item_2: "comp/list_itembg2.png",
    txt_color_select: "#28100C",
    txt_color_normal: "#DFDFDF"
};
function copyStr(str) {
    utils.tools.copyToClipboard(str, function (obj) {
        if (obj.result == 0) {
            UiMainager_1.g_uiMgr.showTip("复制成功");
        }
    });
}
exports.copyStr = copyStr;
/**
 * 获得指定的日期
 * @param str "/Date(1568794397000)/"
 * @param withTime 是否包含时间
 * @return 2012-12-14 02:03:00
 */
function getDate(str, withTime) {
    if (withTime === void 0) { withTime = true; }
    var time = utils.MathUtility.GetNumInString(str);
    var date = new Date(time);
    var str = date.toLocaleDateString();
    var date_str = str.replace(/\//g, "-");
    if (withTime) {
        str = date.toTimeString();
        date_str += " " + str.split(" ")[0];
    }
    return date_str;
}
exports.getDate = getDate;
/**
 * 保存图片到相册
 */
function saveImageToGallery(img) {
    var htmlC;
    htmlC = img.drawToCanvas(img.width, img.height, img.x || 0, img.y || 0);
    var base64Data = htmlC.toBase64('image/jpeg', 0.9);
    if (window['plus'] == null) {
        return;
    }
    var bmp = new window['plus'].nativeObj.Bitmap();
    bmp.loadBase64Data(base64Data, function () {
        console.log("创建成功");
    }, function () {
        console.log("创建失败");
    });
    bmp.save('_www/' + img.name, { overwrite: true }, function () {
        console.log("保存成功");
    }, function () {
        console.log("保存失败");
    });
    window['plus'].gallery.save('_www/' + img.name, function () {
        console.log("保存图片到相册成功");
        UiMainager_1.g_uiMgr.showTip('二维码已保存至相册');
    }, function () {
        console.log("保存图片到相册失败");
        UiMainager_1.g_uiMgr.showTip('保存失败', true);
    });
}
exports.saveImageToGallery = saveImageToGallery;
function saveSystemObj(obj) {
    exports.g_systemData = obj;
}
exports.saveSystemObj = saveSystemObj;

},{"./UiMainager":12}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserInfo_1 = require("./UserInfo");
var SetUi_1 = require("./SetUi");
var TuiGuang_1 = require("./tuiguang/TuiGuang");
var HuoDong_1 = require("./HuoDong");
var XiMa_1 = require("./xima/XiMa");
var MailUi_1 = require("./mail/MailUi");
var KeFu_1 = require("./KeFu");
var TiXianUi_1 = require("./tixian/TiXianUi");
var ChongZhi_1 = require("./chongzhi/ChongZhi");
var NoticeMsg_1 = require("./notice/NoticeMsg");
var Notice_1 = require("./notice/Notice");
var LoginUi_1 = require("./login/LoginUi");
var UiMainager_1 = require("./UiMainager");
var RegisterUi_1 = require("./login/RegisterUi");
var TabList_1 = require("./control/TabList");
var GameData_1 = require("./data/GameData");
var PlayerData_1 = require("./data/PlayerData");
var Global_1 = require("./Global");
var GameList_1 = require("./gameList/GameList");
var PlatfromList_1 = require("./gameList/PlatfromList");
var ChongZhiData_1 = require("./data/ChongZhiData");
var VerifyPassword_1 = require("./tixian/VerifyPassword");
var Hall = /** @class */ (function (_super) {
    __extends(Hall, _super);
    function Hall() {
        var _this = _super.call(this, "ui.HallUiUI") || this;
        _this._isFirst = true;
        return _this;
    }
    Hall.prototype.init = function () {
        this.addBtnToListener("img_head");
        this.addBtnToListener("btn_reload");
        this.addBtnToListener("img_web");
        this.addBtnToListener("btn_set");
        this.addBtnToListener("btn_tg");
        this.addBtnToListener("btn_huodong");
        this.addBtnToListener("btn_xm");
        this.addBtnToListener("btn_mail");
        this.addBtnToListener("btn_kf");
        this.addBtnToListener("btn_bank");
        this.addBtnToListener("btn_tixian");
        this.addBtnToListener("btn_cz");
        this.addBtnToListener("btn_login");
        this.addBtnToListener("btn_register");
        this._pmd = new gamelib.alert.Pmd();
        this._pmd.setRes(this._res.img_pmd);
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { skins: ["btns/ic_hot_game.png", "btns/ic_hot_game_pressed.png"] },
            { skins: ["btns/ic_qipai.png", "btns/ic_qipai_pressed.png"] },
            { skins: ["btns/ic_buyu.png", "btns/ic_buyu_pressed.png"] },
            { skins: ["btns/ic_dianzi.png", "btns/ic_dianzi_pressed.png"] },
            { skins: ["btns/ic_girl_online.png", "btns/ic_girl_online_pressed.png"] },
            { skins: ["btns/ic_sport.png", "btns/ic_sport_pressed.png"] },
        ];
        g_signal.add(this.onLocalMsg, this);
        var p = this._res['p_menu'];
        p.vScrollBar.autoHide = true;
        this._gameList = new GameList_1.GameListMgr(this._res['p_game']);
    };
    Hall.prototype.aniOut = function () {
        var temp = { x: -this._res.width };
        Laya.Tween.to(this._res, temp, 300, Laya.Ease.quartOut);
    };
    Hall.prototype.aniIn = function () {
        var temp = { x: 0 };
        Laya.Tween.to(this._res, temp, 300, Laya.Ease.quartOut);
    };
    Hall.prototype.onLocalMsg = function (msg, data) {
        switch (msg) {
            case "onUiShow":
                this.aniOut();
                break;
            case "onUiClose":
                this.aniIn();
                break;
            case "openUi":
                this.handBtn(data[0], data[1]);
                break;
            case "enterGame":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                UiMainager_1.g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.GetApilogin, { "platformCode": data.api_Name, "gameType": data.gameType, "gameId": data.gameId, "gameName": data.gameName, devices: 1 });
                break;
            case "enterPlatform":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                switch (this._tab.selectedIndex) {
                    case GameData_1.GameType.DianZi: //只有电子会打开子平台列表
                        this._platformList = this._platformList || new PlatfromList_1.default();
                        this._platformList.setData({ type: GameData_1.GameType.DianZi, pd: data });
                        this._platformList.show();
                        break;
                    default:
                        UiMainager_1.g_uiMgr.showMiniLoading();
                        g_net.requestWithToken(gamelib.GameMsg.GetApilogin, { "platformCode": data.api_name, "gameType": data.gameType, "gameId": data.gameId, "gameName": data.gameName, devices: 1 });
                }
                break;
            case "showLoginUi":
                this._login = this._login || new LoginUi_1.default();
                this._login.show();
                break;
        }
    };
    Hall.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        var userName = gamelib.Api.getLocalStorage("username");
        var pwd = gamelib.Api.getLocalStorage("password");
        if (userName && pwd) {
            Global_1.default(userName, pwd);
        }
        // g_net.request(gamelib.GameMsg.GongGao,{});
        // g_net.request(gamelib.GameMsg.Indexhot,{});
        g_net.request(gamelib.GameMsg.Getapi, {});
        g_net.request(gamelib.GameMsg.Systemseting, {});
        //请求热门游戏
        // g_net.request(gamelib.GameMsg.Getapigame,{gametype:-3,pageSize:100,pageIndex:1});
        // g_net.request(gamelib.GameMsg.Getapiassort,{});
        // g_net.request(gamelib.GameMsg.Getapitypegame,{});
        // g_net.request(gamelib.GameMsg.Getapigame,{});
        var temp = new VerifyPassword_1.default();
        temp.show();
        this._tab.selectedIndex = 0;
    };
    Hall.prototype.reciveNetMsg = function (msg, requestData, data) {
        console.log(msg, requestData, data);
        if (data.retCode != 0 && msg != gamelib.GameMsg.Readmoney) {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            UiMainager_1.g_uiMgr.showTip(data.retMsg);
            return;
        }
        switch (msg) {
            case gamelib.GameMsg.Login:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                GameVar.s_token = data.retMsg;
                //请求用户信息
                g_net.requestWithToken(gamelib.GameMsg.MemberInfo, {});
                gamelib.Api.saveLocalStorage('username', requestData.un);
                gamelib.Api.saveLocalStorage('password', requestData.pw);
                this._res['b_unlogin'].visible = false;
                // g_net.requestWithToken(gamelib.GameMsg.Payinfolist,{payType:"PHONE"});
                break;
            case gamelib.GameMsg.Logout:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                gamelib.Api.saveLocalStorage("password", "");
                GameVar.s_token = "";
                this._res['txt_name'].text = "";
                this._res['txt_money'].text = "0.0";
                this._res['b_unlogin'].visible = true;
                break;
            case gamelib.GameMsg.Updatepwd:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                UiMainager_1.g_uiMgr.showTip("修改成功");
                break;
            case gamelib.GameMsg.Basicxingxi:
                PlayerData_1.g_playerData.m_phone = requestData.gmyphone;
                PlayerData_1.g_playerData.m_nickName = requestData.gmyname;
                PlayerData_1.g_playerData.m_wx = requestData.WeChat;
                PlayerData_1.g_playerData.m_mail = requestData.mailbox;
                break;
            case gamelib.GameMsg.Readmoney:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                PlayerData_1.g_playerData.m_money = parseInt(data.retMsg);
                this._res['txt_money'].text = PlayerData_1.g_playerData.m_money;
                break;
            case gamelib.GameMsg.MemberInfo:
                var temp = JSON.parse(data.retMsg);
                PlayerData_1.g_playerData.m_userName = temp.Username;
                PlayerData_1.g_playerData.m_isOldWithNew = temp.is_oldwithnew;
                PlayerData_1.g_playerData.m_money = temp.Mymoney;
                PlayerData_1.g_playerData.m_phone = temp.Myphone;
                PlayerData_1.g_playerData.m_nickName = temp.Myname;
                PlayerData_1.g_playerData.m_wx = temp.WeChat;
                PlayerData_1.g_playerData.m_mail = temp.mailbox;
                this._res['txt_name'].text = PlayerData_1.g_playerData.m_userName;
                this._res['txt_money'].text = PlayerData_1.g_playerData.m_money;
                break;
            case gamelib.GameMsg.Systemseting:
                Global_1.saveSystemObj(data.retData);
                break;
            case gamelib.GameMsg.GongGao:
                this._noticeMsg = this._noticeMsg || new NoticeMsg_1.default();
                if (this._noticeMsg.setData(data))
                    this._noticeMsg.show();
                break;
            case gamelib.GameMsg.Indexhot:
                this._notice = this._notice || new Notice_1.default();
                this._notice.setData(data.retData);
                this._notice.show();
                break;
            // case gamelib.GameMsg.Getapi:
            //     g_net.request(gamelib.GameMsg.Getapigame,{game:"AG",gametype:0});
            //     break;
            case gamelib.GameMsg.Getapigame:
                if (requestData.gametype == -3) //热门
                 {
                    GameData_1.g_gameData.parseHotGame(data.retData);
                    this.onTabChange(this._tab.selectedIndex);
                }
                else if (requestData.gametype == 0) {
                    GameData_1.g_gameData.parseDianZiGame(data.retData, requestData.game);
                }
                break;
            case gamelib.GameMsg.Getapifish:
                GameData_1.g_gameData.parseFishGame(data.retData);
                this.onTabChange(this._tab.selectedIndex);
                break;
            case gamelib.GameMsg.Getapi:
                GameData_1.g_gameData.parseGetAip(data.retData);
                this.onTabChange(this._tab.selectedIndex);
                break;
            case gamelib.GameMsg.GetApilogin:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (window['enterGame']) {
                    window['enterGame'].call(window, { url: data.retMsg });
                }
                break;
            case gamelib.GameMsg.Bankinfo:
                if (requestData.payType == "bank") {
                    ChongZhiData_1.g_chongZhiData.parseBankerListXX(data.retData);
                }
                else {
                    ChongZhiData_1.g_chongZhiData.parseEwmListXX(data.retData);
                }
                break;
        }
    };
    Hall.prototype.onTabChange = function (index) {
        this._gameList.updateList(index, this._isFirst);
        this._isFirst = false;
    };
    Hall.prototype.onClickObjects = function (evt) {
        this.handBtn(evt.currentTarget['name'], null);
    };
    Hall.prototype.handBtn = function (btnName, data) {
        switch (btnName) {
            case "img_head":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                this._info = this._info || new UserInfo_1.default();
                this._info.show();
                break;
            case "btn_reload":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                var ani = this._res["ani1"];
                ani.play(0, false);
                g_net.requestWithToken(gamelib.GameMsg.Readmoney, {});
                break;
            case "img_web":
                utils.tools.copyToClipboard("ddddd");
                break;
            case "btn_set":
                this._set = this._set || new SetUi_1.default();
                this._set.show();
                break;
            case "btn_tg":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                this._tuiGuang = this._tuiGuang || new TuiGuang_1.default();
                this._tuiGuang.show();
                break;
            case "btn_huodong":
                this._huodong = this._huodong || new HuoDong_1.default();
                this._huodong.show();
                break;
            case "btn_xm":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                this._xima = this._xima || new XiMa_1.default();
                this._xima.show();
                break;
            case "btn_mail":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                this._mail = this._mail || new MailUi_1.default();
                this._mail.show();
                break;
            case "btn_kf":
                this._kefu = this._kefu || new KeFu_1.default();
                this._kefu.show();
                break;
            case "btn_tixian":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                this._tixian = this._tixian || new TiXianUi_1.default();
                this._tixian.show();
                break;
            case "btn_cz":
                if (!GameData_1.checkLogin()) {
                    return;
                }
                this._chongzhi = this._chongzhi || new ChongZhi_1.default();
                this._chongzhi.show();
                break;
            case "btn_bank":
                break;
            case "btn_login":
                this._login = this._login || new LoginUi_1.default();
                this._login.show();
                break;
            case "btn_register":
                this._register = this._register || new RegisterUi_1.default();
                this._register.show();
                break;
        }
    };
    return Hall;
}(gamelib.core.Ui_NetHandle));
exports.default = Hall;

},{"./Global":5,"./HuoDong":7,"./KeFu":8,"./SetUi":11,"./UiMainager":12,"./UserInfo":13,"./chongzhi/ChongZhi":16,"./control/TabList":20,"./data/ChongZhiData":22,"./data/GameData":23,"./data/PlayerData":24,"./gameList/GameList":25,"./gameList/PlatfromList":26,"./login/LoginUi":27,"./login/RegisterUi":28,"./mail/MailUi":30,"./notice/Notice":31,"./notice/NoticeMsg":32,"./tixian/TiXianUi":34,"./tixian/VerifyPassword":35,"./tuiguang/TuiGuang":37,"./xima/XiMa":39}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var TabList_1 = require("./control/TabList");
var UiMainager_1 = require("./UiMainager");
var HuoDong = /** @class */ (function (_super) {
    __extends(HuoDong, _super);
    function HuoDong() {
        return _super.call(this, "ui.HuoDongUiUI") || this;
    }
    HuoDong.prototype.init = function () {
        this._list = this._res["list_1"];
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        var arr = [];
        for (var i = 0; i < 5; i++) {
            var temp = {
                skins: ["btns/hd_tab" + i + "_1.png", "btns/hd_tab" + i + "_2.png"]
            };
            arr.push(temp);
        }
        this._tab.dataSource = arr;
        this._tab.selectedIndex = 0;
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
        this.addBtnToListener("btn_sqhd");
        this.addBtnToListener("btn_fhlb");
    };
    HuoDong.prototype.reciveNetMsg = function (msg, rd, data) {
        if (msg == gamelib.GameMsg.Gethotall) {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            this._data = data.retData;
            this.onTabChange(this._tab.selectedIndex);
        }
        else if (msg == gamelib.GameMsg.Applicationhot) {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            UiMainager_1.g_uiMgr.showTip(data.retMsg);
        }
    };
    HuoDong.prototype.onClickObjects = function (evt) {
        if (evt.currentTarget.name == "btn_fhlb") {
            this._res['b_info'].visible = false;
        }
        else {
            UiMainager_1.g_uiMgr.showMiniLoading();
            g_net.requestWithToken(gamelib.GameMsg.Applicationhot, { id: this._hd.Id });
            this._res['b_info'].visible = false;
        }
    };
    HuoDong.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._res['b_info'].visible = false;
        this._tab.selectedIndex = 0;
        if (this._data == null) {
            UiMainager_1.g_uiMgr.showMiniLoading();
            g_net.request(gamelib.GameMsg.Gethotall, {});
            return;
        }
        this.onTabChange(0);
    };
    HuoDong.prototype.onTabChange = function (index) {
        this._res['b_info'].visible = false;
        if (this._data == null)
            return;
        var arr = [];
        var type = 0;
        if (index == 1)
            type = 9;
        else if (index == 2)
            type = 8;
        else if (index == 3)
            type = 7;
        else if (index == 4)
            type = 6;
        for (var _i = 0, _a = this._data; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (index == 0 || obj.Type == type)
                arr.push(obj);
        }
        this._list.dataSource = arr;
        this._res['txt_tips'].visible = arr.length == 0;
    };
    HuoDong.prototype.onItemRender = function (box, index) {
        var data = this._list.dataSource[index];
        var img = getChildByName(box, "img_hd");
        img.skin = GameVar.s_domain + data.Pcimg;
        img.mouseEnabled = true;
        img.offAll(Laya.Event.CLICK);
        img.on(Laya.Event.CLICK, this, this.onHuoDongInfo, [data]);
    };
    HuoDong.prototype.onHuoDongInfo = function (hd) {
        this._hd = hd;
        this._res['b_info'].visible = true;
        this._res['img_hd'].skin = GameVar.s_domain + hd.Pcimg;
        this._res['txt_info'].text = hd.Hottime + "\n" + hd.Title + "";
    };
    return HuoDong;
}(BasePanel_1.default));
exports.default = HuoDong;

},{"./BasePanel":4,"./UiMainager":12,"./control/TabList":20}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var TabList_1 = require("./control/TabList");
var Global_1 = require("./Global");
var KeFu = /** @class */ (function (_super) {
    __extends(KeFu, _super);
    function KeFu() {
        return _super.call(this, "ui.KeFuUiUI") || this;
    }
    KeFu.prototype.init = function () {
        this.addBtnToListener("btn_lx");
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.dataSource = [
            { skins: ["btns/ic_cus_online.png", "btns/ic_cus_online_pressed.png"] },
            { skins: ["btns/ic_cus_fqc.png", "btns/ic_cus_fqc_pressed.png"] }
        ];
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this.addBtnToListener("btn_zx");
        this.addBtnToListener("btn_qq");
        this.addBtnToListener("btn_wx");
    };
    KeFu.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    KeFu.prototype.onTabChange = function (index) {
        this._res['b_kf'].visible = index == 0;
        this._res['b_wt'].visible = index == 1;
        if (index == 1) {
            window['application_layer_show'](Global_1.g_systemData.web_grawhelp);
        }
    };
    return KeFu;
}(BasePanel_1.default));
exports.default = KeFu;

},{"./BasePanel":4,"./Global":5,"./control/TabList":20}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MiniLoadingUi = /** @class */ (function (_super) {
    __extends(MiniLoadingUi, _super);
    function MiniLoadingUi() {
        return _super.call(this, 'ui.MiniLoadingUI') || this;
    }
    MiniLoadingUi.prototype.init = function () {
        this._ani = this._res['ani1'];
        this.m_closeUiOnSide = false;
    };
    MiniLoadingUi.prototype.onShow = function () {
        this._ani.play(0, true);
    };
    MiniLoadingUi.prototype.onClose = function () {
        this._ani.stop();
    };
    return MiniLoadingUi;
}(gamelib.core.BaseUi));
exports.default = MiniLoadingUi;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plug = /** @class */ (function () {
    function Plug(res) {
        this._box = res;
        this._box.visible = false;
        this._btns = [];
    }
    Plug.prototype.addBtnToList = function (name, res) {
        var temp = res[name];
        if (temp == null)
            return;
        temp.name = name;
        temp.mouseEnabled = true;
        if (this._btns.indexOf(temp) == -1)
            this._btns.push(temp);
    };
    Plug.prototype.show = function () {
        this._box.visible = true;
        for (var _i = 0, _a = this._btns; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.on(Laya.Event.CLICK, this, this.onClickBtn);
        }
    };
    Plug.prototype.close = function () {
        this._box.visible = false;
        for (var _i = 0, _a = this._btns; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.off(Laya.Event.CLICK, this, this.onClickBtn);
        }
    };
    Plug.prototype.onClickBtn = function (evt) {
    };
    return Plug;
}());
exports.default = Plug;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerData_1 = require("./data/PlayerData");
var UiMainager_1 = require("./UiMainager");
var SetUi = /** @class */ (function (_super) {
    __extends(SetUi, _super);
    function SetUi() {
        return _super.call(this, "ui.SetUiUI") || this;
    }
    SetUi.prototype.init = function () {
        this.addBtnToListener("btn_ok");
        this.addBtnToListener("btn_logout");
        this.addBtnToListener("btn_gx");
        this._tab = this._res['tab_1'];
        this._items = this._tab.items.concat();
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
    };
    SetUi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        var temp = this._tab.items.concat();
        for (var _i = 0, temp_1 = temp; _i < temp_1.length; _i++) {
            var item = temp_1[_i];
            this._tab.delItem(item);
        }
        if (!GameVar.s_token) //未登录
         {
            this._tab.addItem(this._items[0], true);
            this._tab.addItem(this._items[2], true);
        }
        else {
            this._tab.addItem(this._items[0], true);
            this._tab.addItem(this._items[1], true);
            this._tab.addItem(this._items[2], true);
        }
        this._res['b_info'].visible = GameVar.s_token;
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    SetUi.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_ok": //修改
                this.onModify();
                break;
            case "btn_logout": //退出登录
                var _self = this;
                UiMainager_1.g_uiMgr.showAlertUiByArgs({
                    msg: "确定要退出登录吗?",
                    callBack: function (type) {
                        if (type == 0) {
                            UiMainager_1.g_uiMgr.showMiniLoading();
                            g_net.requestWithToken(gamelib.GameMsg.Logout, { username: PlayerData_1.g_playerData.m_userName });
                            _self.close();
                        }
                    },
                    type: 1
                });
                break;
            case "btn_gx": //更新
                break;
        }
    };
    SetUi.prototype.onModify = function () {
        var old = this._res['txt_oldPwd'].text;
        var new1 = this._res['txt_newPwd'].text;
        var new2 = this._res['txt_newPwd1'].text;
        if (old == "") {
            UiMainager_1.g_uiMgr.showTip("请输入旧密码", true);
            return;
        }
        if (new1 == "") {
            UiMainager_1.g_uiMgr.showTip("请输入您的新密码", true);
            return;
        }
        if (new1 != new2) {
            UiMainager_1.g_uiMgr.showTip("您两次输入的密码不一样", true);
            return;
        }
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Updatepwd, { pass: old, npass: new1, par: "login" });
        this._res['txt_oldPwd'].text = this._res['txt_newPwd'].text = this._res['txt_newPwd1'].text = "";
    };
    SetUi.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showSound();
        else if (index == 1) {
            if (GameVar.s_token)
                this.showPWD();
            else
                this.showAPP();
        }
        else {
            this.showAPP();
        }
    };
    SetUi.prototype.showSound = function () {
        this._res['b_sound'].visible = true;
        this._res['b_pwd'].visible = false;
        this._res['b_app'].visible = false;
    };
    SetUi.prototype.showPWD = function () {
        this._res['b_sound'].visible = false;
        this._res['b_pwd'].visible = true;
        this._res['b_app'].visible = false;
    };
    SetUi.prototype.showAPP = function () {
        this._res['b_sound'].visible = false;
        this._res['b_pwd'].visible = false;
        this._res['b_app'].visible = true;
        this._res['txt_app_version'].text = "当前已经是最新版本";
    };
    return SetUi;
}(gamelib.core.Ui_NetHandle));
exports.default = SetUi;

},{"./UiMainager":12,"./data/PlayerData":24}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MiniLoadingUi_1 = require("./MiniLoadingUi");
var AlertUi_1 = require("./AlertUi");
/**
 * ui管理器。管理 pmd,邮件，设置，商城，miniloading，聊天界面，提示框，提示文本等界面
 * 要打开这些界面,可以调用g_singnal.dispatch("msgName",data)或者直接调用对应的方法
 * 常用的msgName有:
 * showSetUi,showShopUi,showHelpUi,showChatUi,showQpqLoadingUi,closeQpqLoadingUi
 * closeEnterGameLoading,showBugleUi
 *
 * @class UiMainager
 */
var UiMainager = /** @class */ (function () {
    function UiMainager() {
        this.m_pmd = new gamelib.alert.Pmd();
        this._alertList = [];
        this._tip_list = [];
        this._waring_tip_list = [];
    }
    /**
     * 关闭小loading
     * @function closeMiniLoading
     * @DateTime 2018-03-16T14:29:22+0800
     */
    UiMainager.prototype.closeMiniLoading = function () {
        if (this._miniLoading)
            this._miniLoading.close();
    };
    /**
     * 打开小转圈
     * @function showMiniLoading
     * @DateTime 2018-03-16T14:29:38+0800
     * @param    {any}}    args [一个对象，msg:string,需要显示的文本
     *                           delay:number自动关闭的时间，秒为单位
     *                           alertMsg:string关闭时的提示文本，
     *                           callBack：function关闭时的回掉]
     */
    UiMainager.prototype.showMiniLoading = function (args) {
        this._miniLoading = this._miniLoading || new MiniLoadingUi_1.default();
        this._miniLoading.show();
    };
    /**
     * 显示没有关闭按钮的提示框
     * @function showAlert_NoClose
     * @DateTime 2018-03-16T14:31:57+0800
     * @param    {string}                 msg [description]
     */
    UiMainager.prototype.showAlert_NoClose = function (msg) {
        var alert = this.getAlertUi();
        alert.setData({ msg: msg, type: 3 });
        alert.show();
    };
    /**
    * msg：提示文本
    * type : 0：只有确定按钮，1：确定和取消按钮,2:确定，取消，关闭按钮都有 3，三个按钮都没有
    * callBack : 回掉方法 callback(type:number); ,0:确定，1:关闭按钮，2：取消按钮
    * autoCall:自动关闭的时间（秒），0：不自动关闭,否则会在确定按钮上显示倒计时
    * okLabel:确定按钮文本
    * cancelLabel：取消按钮的文本
    *
    * @param params
    */
    /**
     * 显示提示文本
     * @function showAlertUiByArgs
     * @DateTime 2018-03-16T14:32:26+0800
     * @param    {number} args [    msg：提示文本
     *                               type : 0：只有确定按钮，1：确定和取消按钮,2:确定，取消，关闭按钮都有 3，三个按钮都没有
     *                                 callBack : 回掉方法 callback(type:number); ,0:确定，1:关闭按钮，2：取消按钮
     *                                 autoCall:自动关闭的时间（秒），0：不自动关闭,否则会在确定按钮上显示倒计时
     *                                 okLabel:确定按钮文本
     *                                 cancelLabel：取消按钮的文本]
     * @return   {gamelib.alert.AlertUi}   [description]
     */
    UiMainager.prototype.showAlertUiByArgs = function (args) {
        if (isNaN(args.autoCall))
            args.autoCall = 0;
        if (isNaN(args.type))
            args.type = 0;
        var alert = this.getAlertUi();
        if (alert == null) {
            window['alert'](args.msg);
            return null;
        }
        args.okLabel || (args.okLabel = "确定");
        args.cancelLabel || (args.cancelLabel = "取消");
        alert.setData(args);
        alert.show();
        return alert;
    };
    /**
     * 确认框，可以修改按钮文字
     */
    /**
     * 显示确认可
     * @function showConfirmUiByArgs
     * @DateTime 2018-03-16T14:33:05+0800
     * @param    {string} args [msg：提示文本
     *                          callBack : 回掉方法 callback(type:number); ,0:确定，1:关闭按钮，2：取消按钮
     *                          autoCall:自动关闭的时间（秒），0：不自动关闭,否则会在确定按钮上显示倒计时
     *                          okLabel:确定按钮文本
     *                          cancelLabel：取消按钮的文本]
     */
    UiMainager.prototype.showConfirmUiByArgs = function (args) {
        var temp_args = args;
        if (isNaN(temp_args.autoCall))
            temp_args.autoCall = 0;
        if (isNaN(temp_args.type))
            temp_args.type = 1;
        var alert = this.getAlertUi();
        alert.show();
        alert.setData(temp_args);
    };
    UiMainager.prototype.onAlertUiClose = function (alert) {
        this._alertList.push(alert);
    };
    /**
     * 显示提示文本。通常是在屏幕中间浮起一个文本，几秒后自动消失
     * @function showTip
     * @DateTime 2018-03-16T14:34:17+0800
     * @param    {string}                 msg []
     * @param    {boolean} [isWarning = false] [是否是警告，警告是红色]
     * @param    {number}  [effectType = 1]  [动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失]
     */
    UiMainager.prototype.showTip = function (msg, isWarning, effectType) {
        if (isWarning === void 0) { isWarning = false; }
        if (effectType === void 0) { effectType = 1; }
        this._tip = this._tip || new TipEffect();
        this._tip.setMsg(msg, isWarning);
        // this.showTipsEffect(msg,effectType,isWarning);
    };
    /**
     * function showPMD
     * @param msg
     */
    UiMainager.prototype.showPMD = function (msg) {
        this.m_pmd.add(msg);
    };
    UiMainager.prototype.pmd_LaBa = function (msg) {
        // var temp:gamelib.alert.Pmd_Laba = new gamelib.alert.Pmd_Laba();
        // temp.add(msg);
        // temp.show();
        this.m_pmd.add(msg);
    };
    UiMainager.prototype.getAlertUi = function () {
        // var temp = this._alertList.shift();
        // if(temp == null)
        //     temp = new gamelib.alert.AlertUi();
        // return temp;
        return new AlertUi_1.default();
    };
    return UiMainager;
}());
exports.default = UiMainager;
var TipEffect = /** @class */ (function () {
    function TipEffect() {
        this._bg = new Laya.Image();
        this._bg.skin = "bgs/ic_alert_long_bg.png";
        this._bg.height = 100;
        this._icon = new Laya.Image();
        this._icon.width = this._icon.height = 60;
        this._bg.addChild(this._icon);
        this._icon.centerY = 0;
        this._icon.x = 60;
        this._label = new laya.ui.Label();
        this._label.fontSize = 28;
        this._label.color = "#FFFFFF";
        this._label.align = "center";
        this._label.name = "_txt";
        this._label.centerY = 0;
        this._bg.addChild(this._label);
        this._bg.x = Laya.stage.width / 2;
        this._bg.y = Laya.stage.height / 2;
    }
    TipEffect.prototype.setMsg = function (msg, isWarning) {
        this._label.text = msg;
        this._bg.width = this._label.width < 512 ? 512 : this._label.width + 100;
        this._bg.pivotX = this._bg.width / 2;
        this._bg.pivotY = this._bg.height / 2;
        this._label.x = this._icon.x + this._icon.width + 20; //(this._bg.width - this._label.width) / 2;
        // this._label.y = (this._bg.height - this._label.height) / 2;
        if (isWarning)
            this._icon.skin = "icons/ic_alert_error.png";
        else
            this._icon.skin = "icons/ic_toast_success.png";
        this._bg.zOrder = 1100;
        Laya.stage.addChild(this._bg);
        this._bg.scaleY = 0;
        Laya.Tween.clearAll(this._bg);
        Laya.timer.clearAll(this);
        Laya.Tween.to(this._bg, { scaleY: 1 }, 300);
        Laya.timer.once(3000, this, this.remove);
    };
    TipEffect.prototype.remove = function () {
        this._bg.removeSelf();
    };
    return TipEffect;
}());
exports.TipEffect = TipEffect;
exports.g_uiMgr = new UiMainager();

},{"./AlertUi":2,"./MiniLoadingUi":9}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var TabList_1 = require("./control/TabList");
var Plug_1 = require("./Plug");
var PlayerData_1 = require("./data/PlayerData");
var Global_1 = require("./Global");
var TimePicker_1 = require("./control/TimePicker");
var GameData_1 = require("./data/GameData");
var UiMainager_1 = require("./UiMainager");
var UserInfo = /** @class */ (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        return _super.call(this, "ui.UserInfoUI") || this;
    }
    UserInfo.prototype.init = function () {
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { skins: ["btns/ic_pc_grxx.png", "btns/ic_pc_grxx_pressed.png"] },
            { skins: ["btns/ic_pc_tzjl.png", "btns/ic_pc_tzjl_pressed.png"] },
            { skins: ["btns/ic_pc_zhmx.png", "btns/ic_pc_zhmx_pressed.png"] } //账户明细 
        ];
        this._info = new Info(this._res);
        this._touzu = new TouZuHistroy(this._res);
        this._mingXi = new ZhangHuMingXi(this._res);
    };
    UserInfo.prototype.reciveNetMsg = function (msg, requestData, data) {
        switch (msg) {
            case gamelib.GameMsg.Betinfodata:
                this._touzu.updateData(data);
                break;
            case gamelib.GameMsg.moneyinfo:
                this._mingXi.updateData(data);
                break;
        }
    };
    UserInfo.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    UserInfo.prototype.onTabChange = function (index) {
        console.log("选中的“：" + index);
        if (index == 0)
            this.showInfo();
        else if (index == 1)
            this.showTZJL();
        else if (index == 2)
            this.showMingXi();
        else
            this.showGRBB();
    };
    UserInfo.prototype.showInfo = function () {
        this._info.show();
        this._touzu.close();
        this._mingXi.close();
    };
    UserInfo.prototype.showTZJL = function () {
        this._touzu.show();
        this._info.close();
        this._mingXi.close();
    };
    UserInfo.prototype.showGRBB = function () {
        this._touzu.close();
        this._info.close();
        this._mingXi.close();
    };
    UserInfo.prototype.showMingXi = function () {
        this._mingXi.show();
        this._touzu.close();
        this._info.close();
    };
    return UserInfo;
}(BasePanel_1.default));
exports.default = UserInfo;
//个人信息
var Info = /** @class */ (function (_super) {
    __extends(Info, _super);
    function Info(res) {
        var _this = _super.call(this, res['b_info']) || this;
        _this._res = res;
        _this._edt1 = res['btn_xg1'];
        _this._inputs_1 = [];
        _this._inputs_1.push(getChildByName(_this._box, "b_info.txt_nickName"));
        _this._inputs_1.push(getChildByName(_this._box, "b_info.txt_name"));
        _this._inputs_1.push(getChildByName(_this._box, "b_info.txt_nickName"));
        return _this;
    }
    Info.prototype.show = function () {
        _super.prototype.show.call(this);
        this._edt1.on(Laya.Event.CLICK, this, this.onClick);
        // this._edt1['__status'] = 0;
        // this.setStatue(this._edt1,0);
        this._res['txt_account'].text = PlayerData_1.g_playerData.m_userName;
        this._res['txt_level'].text = PlayerData_1.g_playerData.m_isOldWithNew ? "推广账号" : "普通会员";
        this._res['txt_name'].text = PlayerData_1.g_playerData.m_nickName;
        this._res['txt_mail'].text = PlayerData_1.g_playerData.m_mail;
        this._res['txt_tel'].text = PlayerData_1.g_playerData.m_phone;
        this._res['txt_wx'].text = PlayerData_1.g_playerData.m_wx;
    };
    Info.prototype.close = function () {
        _super.prototype.close.call(this);
        this._edt1.off(Laya.Event.CLICK, this, this.onClick);
    };
    Info.prototype.onClick = function (evt) {
        var box = evt.currentTarget;
        //提交修改
        g_net.requestWithToken(gamelib.GameMsg.Basicxingxi, {
            gmyname: this._res['txt_name'].text,
            gmyphone: this._res['txt_tel'].text,
            WeChat: this._res['txt_wx'].text,
            mailbox: this._res['txt_mail'].text,
        });
    };
    Info.prototype.setStatue = function (box, status) {
        box['__status'] = status;
        var img = box.getChildAt(0);
        var txt = box.getChildAt(1);
        if (status == 0) {
            img.skin = "btns/ic_edit.png";
            txt.text = "编辑";
        }
        else {
            img.skin = "btns/edit_done.png";
            txt.text = "完成";
        }
    };
    return Info;
}(Plug_1.default));
exports.Info = Info;
//投注历史
var TouZuHistroy = /** @class */ (function (_super) {
    __extends(TouZuHistroy, _super);
    function TouZuHistroy(res) {
        var _this = _super.call(this, res['b_touzujilv']) || this;
        _this._tips = res['txt_tips1'];
        _this._timer_start = new TimePicker_1.default(res['time_start']);
        _this._timer_start.setOffsize(-24 * 3600 * 1000);
        _this._timer_end = new TimePicker_1.default(res['time_end']);
        _this._cb_pt = res['cb_pt'];
        _this.addBtnToList('btn_time', res);
        _this.addBtnToList('btn_pt', res);
        _this._list = res['list_1'];
        _this._list.renderHandler = Laya.Handler.create(_this, _this.onListItemRender, null, false);
        _this._timer_start.on(Laya.Event.CHANGE, _this, _this.check);
        _this._timer_end.on(Laya.Event.CHANGE, _this, _this.check);
        _this._cb_pt.on(Laya.Event.CHANGE, _this, _this.check);
        return _this;
    }
    TouZuHistroy.prototype.updateData = function (data) {
        UiMainager_1.g_uiMgr.closeMiniLoading();
        if (data.retCode != 0)
            return;
        this._list.dataSource = data.retData;
        this._tips.visible = data.retData == null || data.retData.length == 0;
    };
    TouZuHistroy.prototype.check = function () {
        var start_time = this._timer_start.time;
        var end_time = this._timer_end.time;
        if (this._cb_pt.selectedIndex == -1 || isNaN(this._cb_pt.selectedIndex) || start_time == "" || end_time == "") {
            return;
        }
        var pt = this._allPlarfrom[this._cb_pt.selectedIndex]['api_name'];
        UiMainager_1.g_uiMgr.showMiniLoading();
        start_time += " 00:00:00";
        end_time += " 00:00:00";
        g_net.requestWithToken(gamelib.GameMsg.Betinfodata, { gametype: pt, bettime1: start_time, bettime2: end_time, page: 1, pagesize: 200 });
    };
    TouZuHistroy.prototype.onListItemRender = function (box, index) {
        var bg = getChildByName(box, 'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_itembg1.png" : "comp/list_itembg2.png";
        var obj = this._list.dataSource[index];
        var keys = ['BillNo', "GameType", "BetAmount", "ValidBetAmount", "BetTime", "NetAmount"];
        for (var i = 0; i < keys.length; i++) {
            var label = getChildByName(box, 'txt_' + (i + 1));
            if (keys[i] == "BetTime") {
                label.text = Global_1.getDate(obj[keys[i]]);
            }
            else if (keys[i] == "NetAmount") {
                if (parseInt(obj[keys[i]]) > 0) {
                    label.text = "+" + obj[keys[i]];
                    label.color = "#00F4C";
                }
                else {
                    label.text = obj[keys[i]];
                    label.color = "#EB0112";
                }
            }
            else {
                label.text = obj[keys[i]];
            }
        }
    };
    TouZuHistroy.prototype.show = function () {
        _super.prototype.show.call(this);
        this._list.dataSource = [];
        var arr = GameData_1.g_gameData.getAllPlatformNames();
        this._allPlarfrom = arr;
        this._cb_pt.labels = this.getDataSource(arr);
        this._cb_pt.selectedIndex = 0;
        this._timer_start.clear();
        this._timer_end.clear();
    };
    TouZuHistroy.prototype.getDataSource = function (arr) {
        var arr1 = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var temp = arr_1[_i];
            arr1.push(temp['api_mainname']);
        }
        return arr1.join(",");
    };
    TouZuHistroy.prototype.setData = function (arr) {
    };
    return TouZuHistroy;
}(Plug_1.default));
exports.TouZuHistroy = TouZuHistroy;
//账户明细
var ZhangHuMingXi = /** @class */ (function (_super) {
    __extends(ZhangHuMingXi, _super);
    function ZhangHuMingXi(res) {
        var _this = _super.call(this, res['b_mingxi']) || this;
        _this._list = res['list_mx'];
        _this._list.renderHandler = Laya.Handler.create(_this, _this.onListItemRender, null, false);
        _this._tab = new TabList_1.default(res['list_tab1']);
        // res['list_tab1'].scrollBar.hide = true;
        _this._tab.tabChangeHander = Laya.Handler.create(_this, _this.onTabChange, null, false);
        _this._tab.dataSource = [
            { label: "存款", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] },
            { label: "汇款", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] },
            { label: "提款", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] },
            { label: "返水", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] },
            { label: "优惠活动", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] },
            { label: "其他", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] },
            { label: "抢红包", colors: [Global_1.UiConfig.txt_color_normal, Global_1.UiConfig.txt_color_select] }
        ];
        _this._txt_tips = res['txt_tips2'];
        _this._timer_start = new TimePicker_1.default(res['time_start1']);
        _this._timer_start.setOffsize(-24 * 3600 * 1000);
        _this._timer_end = new TimePicker_1.default(res['time_end1']);
        _this._timer_start.on(Laya.Event.CHANGE, _this, _this.check);
        _this._timer_end.on(Laya.Event.CHANGE, _this, _this.check);
        return _this;
    }
    ZhangHuMingXi.prototype.show = function () {
        _super.prototype.show.call(this);
        this._list.dataSource = [];
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
        this._timer_start.clear();
        this._timer_end.clear();
    };
    ZhangHuMingXi.prototype.updateData = function (data) {
        UiMainager_1.g_uiMgr.closeMiniLoading();
        if (data.retCode != 0)
            return;
        this._list.dataSource = data.retData;
        this._txt_tips.visible = data.retData == null || data.retData.length == 0;
    };
    ZhangHuMingXi.prototype.onTabChange = function (index) {
        this.check();
    };
    ZhangHuMingXi.prototype.check = function () {
        var type = this._tab.selectedIndex;
        var start_time = this._timer_start.time;
        var end_time = this._timer_end.time;
        if (start_time == "" || end_time == "") {
            return;
        }
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo, { moneytype: type + 1, inputtime1: start_time, inputtime2: end_time, page: 1, pagesize: 200 });
    };
    ZhangHuMingXi.prototype.onListItemRender = function (box, index) {
        var bg = getChildByName(box, 'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_itembg1.png" : "comp/list_itembg2.png";
        var obj = this._list.dataSource[index];
        var status = getChildByName(box, 'txt_1');
        if (obj.moneystatus == 0) {
            status.text = "审核中";
            status.color = "#A1A1A1";
        }
        else if (obj.moneystatus == 1) {
            status.text = "成功";
            status.color = "#00F41C";
        }
        else
            (obj.moneystatus == 2);
        {
            status.text = "失败";
            status.color = "#EB0112";
        }
        var label = getChildByName(box, 'txt_2');
        label.text = obj.moneynum;
        label = getChildByName(box, 'txt_3');
        label.text = obj.inputtime;
        label = getChildByName(box, 'txt_4');
        label.text = obj.beizhu;
    };
    return ZhangHuMingXi;
}(Plug_1.default));
exports.ZhangHuMingXi = ZhangHuMingXi;

},{"./BasePanel":4,"./Global":5,"./Plug":10,"./UiMainager":12,"./control/TabList":20,"./control/TimePicker":21,"./data/GameData":23,"./data/PlayerData":24}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plug_1 = require("../Plug");
var UiMainager_1 = require("../UiMainager");
var Global_1 = require("../Global");
var BankCzXX = /** @class */ (function (_super) {
    __extends(BankCzXX, _super);
    function BankCzXX(res, chongzi) {
        var _this = _super.call(this, res["b_input"]) || this;
        _this._chongzi = chongzi;
        _this._res = _this._box.getChildAt(0);
        _this.addBtnToList("btn_copy1", _this._res);
        _this.addBtnToList("btn_copy2", _this._res);
        _this.addBtnToList("btn_copy3", _this._res);
        _this.addBtnToList("btn_prev", _this._res);
        _this.addBtnToList("btn_tjcz", _this._res);
        return _this;
    }
    BankCzXX.prototype.setData = function (bd) {
        this._res.txt_bankName.text = bd.banktype;
        this._res.txt_name.text = bd.bankinfo;
        this._res.txt_zh.text = bd.bankid;
        this._res.txt_ckrxm.text = "";
        this._res.txt_ckje.text = "";
    };
    BankCzXX.prototype.onClickBtn = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_copy1":
                Global_1.copyStr(this._res.txt_bankName.text);
                break;
            case "btn_copy2":
                Global_1.copyStr(this._res.txt_name.text);
                break;
            case "btn_copy3":
                Global_1.copyStr(this._res.txt_zh.text);
                break;
            case "btn_tjcz":
                var money = parseInt(this._res.txt_ckje.text);
                var name = this._res.txt_ckrxm.text;
                if (this._res.txt_ckje.text == "" || name == "") {
                    UiMainager_1.g_uiMgr.showTip("转账信息不能为空!", true);
                    return;
                }
                if (money < 10 || money > 100000) {
                    UiMainager_1.g_uiMgr.showTip("充值金额必须在10-100000之间!", true);
                    return;
                }
                g_net.requestWithToken(gamelib.GameMsg.Moneyinhk, { moneynum: money, moneyinname: name });
                break;
            case "btn_prev":
                this.close();
                this._chongzi.showBankList_xx();
                break;
        }
    };
    return BankCzXX;
}(Plug_1.default));
exports.default = BankCzXX;

},{"../Global":5,"../Plug":10,"../UiMainager":12}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plug_1 = require("../Plug");
var ChongZhiData_1 = require("../data/ChongZhiData");
var BankList = /** @class */ (function (_super) {
    __extends(BankList, _super);
    function BankList(res, chongzi) {
        var _this = _super.call(this, res["b_banklist"]) || this;
        _this._chongzi = chongzi;
        _this._list = res['list_banklist'];
        _this._list.renderHandler = Laya.Handler.create(_this, _this.onListItemRender, null, false);
        return _this;
    }
    BankList.prototype.show = function () {
        _super.prototype.show.call(this);
        this._list.dataSource = ChongZhiData_1.g_chongZhiData.m_xx_bankList;
    };
    BankList.prototype.onListItemRender = function (box, index) {
        var icon = getChildByName(box, "img_bank");
        var info = getChildByName(box, "txt_info");
        var id = getChildByName(box, "txt_id");
        var btn_ok = getChildByName(box, "btn_ok");
        var data = this._list.dataSource[index];
        id.text = data.bankid;
        info.text = data.bankinfo;
        icon.skin = GameVar.s_domain + "/img/appImage/bank/" + data.bankCode + ".jpg";
        btn_ok.offAll(Laya.Event.CLICK);
        btn_ok.on(Laya.Event.CLICK, this, this.onClickCz, [data]);
    };
    BankList.prototype.onClickCz = function (bd) {
        console.log("打开银行充值");
        this._chongzi.showBankChongZhi_XX(bd);
    };
    return BankList;
}(Plug_1.default));
exports.default = BankList;

},{"../Plug":10,"../data/ChongZhiData":22}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChongZhiHistroy_1 = require("./ChongZhiHistroy");
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
var ErweimaCz_1 = require("./ErweimaCz");
var BankCzXX_1 = require("./BankCzXX");
var BankList_1 = require("./BankList");
var ChoseMoney_1 = require("./ChoseMoney");
var ChongZhiData_1 = require("../data/ChongZhiData");
var UiMainager_1 = require("../UiMainager");
var PlayerData_1 = require("../data/PlayerData");
var ChongZhi = /** @class */ (function (_super) {
    __extends(ChongZhi, _super);
    function ChongZhi() {
        return _super.call(this, "ui.ChongZhiUiUI") || this;
    }
    ChongZhi.prototype.init = function () {
        this._tab = new TabList_1.default(this._res['list_1']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.setItemRender(Laya.Handler.create(this, this.onTabItemRender, null, false));
        this._xx_bank = new BankCzXX_1.default(this._res, this);
        this._xx_bankList = new BankList_1.default(this._res, this);
        this._xx_choseMoney = new ChoseMoney_1.default(this._res, this);
        this._xx_ewm = new ErweimaCz_1.default(this._res, this);
        this._xxList = [];
        this._xxList.push(this._xx_ewm);
        this._xxList.push(this._xx_bank);
        this._xxList.push(this._xx_bankList);
        this._xxList.push(this._xx_choseMoney);
        this.addBtnToListener('btn_refresh');
        this.addBtnToListener('btn_histroy');
        this._tab.dataSource = [];
    };
    ChongZhi.prototype.reciveNetMsg = function (msg, requesData, data) {
        switch (msg) {
            case gamelib.GameMsg.Bankinfo:
                this.checkData();
                break;
            case gamelib.GameMsg.Moneyinhk:
            case gamelib.GameMsg.Moneyinqr:
                if (data.retCode == 0) {
                    UiMainager_1.g_uiMgr.showTip("提交成功");
                }
                break;
            case gamelib.GameMsg.Readmoney:
                this._res['txt_money'].text = PlayerData_1.g_playerData.m_money;
                break;
        }
    };
    ChongZhi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        for (var _i = 0, _a = this._xxList; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.close();
        }
        this._res['txt_money'].text = PlayerData_1.g_playerData.m_money;
        this.checkData();
    };
    ChongZhi.prototype.checkData = function () {
        if (ChongZhiData_1.g_chongZhiData.m_xx_ewmList == null || ChongZhiData_1.g_chongZhiData.m_xx_bankList == null) {
            if (!this._isRequesting) {
                UiMainager_1.g_uiMgr.showMiniLoading();
                this._isRequesting = true;
                g_net.requestWithToken(gamelib.GameMsg.Bankinfo, { payType: "bank" });
                g_net.requestWithToken(gamelib.GameMsg.Bankinfo, { payType: "" });
            }
        }
        else {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            this._tab.dataSource = ChongZhiData_1.g_chongZhiData.getTitles();
            this._tab.selectedIndex = 0;
            this.onTabChange(0);
        }
    };
    ChongZhi.prototype.initTabData = function () {
        var arr = [];
        for (var i = 0; i < 3; i++) {
            arr.push({ "label": "", icon: "", isHot: false });
        }
        this._tab.dataSource = arr;
    };
    ChongZhi.prototype.onTabItemRender = function (box, index, data) {
        var icon = getChildByName(box, 'img_type');
        var img_yh = getChildByName(box, 'img_yh');
        img_yh.visible = false;
        icon.skin = data.icon;
    };
    ChongZhi.prototype.onTabChange = function (index) {
        var data = this._tab.dataSource[index];
        if (data.type == "bank") //显示银行列表
         {
            this.showBankList_xx();
        }
        else {
            this.showChoseMoney_XX(ChongZhiData_1.g_chongZhiData.getEwmInfoByType(data.type));
        }
    };
    // private onItemRender(box:Laya.Box,index:number):void
    // {
    // }、
    /*
     *显示银行卡充值
     */
    ChongZhi.prototype.showBankChongZhi_XX = function (bd) {
        for (var _i = 0, _a = this._xxList; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.close();
        }
        this._xx_bank.setData(bd);
        this._xx_bank.show();
    };
    ChongZhi.prototype.showBankList_xx = function () {
        for (var _i = 0, _a = this._xxList; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.close();
        }
        this._xx_bankList.show();
    };
    ChongZhi.prototype.showEwm_xx = function (ewm, money) {
        for (var _i = 0, _a = this._xxList; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.close();
        }
        this._xx_ewm.setData(ewm, money, this._tab.selectedIndex);
        this._xx_ewm.show();
    };
    ChongZhi.prototype.showChoseMoney_XX = function (ewms) {
        for (var _i = 0, _a = this._xxList; _i < _a.length; _i++) {
            var temp = _a[_i];
            temp.close();
        }
        this._xx_choseMoney.setData(ewms);
        this._xx_choseMoney.show();
    };
    ChongZhi.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_refresh": //刷新
                var ani = this._res['ani1'];
                ani.play(0, false);
                // g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Readmoney, {});
                break;
            case "btn_histroy": //充值历史
                this._histroy = this._histroy || new ChongZhiHistroy_1.default();
                this._histroy.show();
                break;
        }
    };
    ChongZhi.prototype.goChongZhi = function (type, money) {
    };
    return ChongZhi;
}(BasePanel_1.default));
exports.default = ChongZhi;

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"../data/ChongZhiData":22,"../data/PlayerData":24,"./BankCzXX":14,"./BankList":15,"./ChongZhiHistroy":17,"./ChoseMoney":18,"./ErweimaCz":19}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var UiMainager_1 = require("../UiMainager");
var ChongZhiHistroy = /** @class */ (function (_super) {
    __extends(ChongZhiHistroy, _super);
    function ChongZhiHistroy() {
        return _super.call(this, 'ui.ChongZhiHistroyUI') || this;
    }
    ChongZhiHistroy.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._list.dataSource = [];
        //一个月内的充值记录
        var now = new Date();
        var end = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
        var start_date = this.getDate(end, true);
        var end_date = this.getDate(now, true);
        UiMainager_1.g_uiMgr.showMiniLoading();
        this._bRequesting1 = this._bRequesting2 = true;
        //1线上 2线下
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo, {
            moneytype: 1,
            page: 1,
            pagesize: 100,
            inputtime1: start_date,
            inputtime2: end_date
        });
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo, {
            moneytype: 2,
            page: 1,
            pagesize: 100,
            inputtime1: start_date,
            inputtime2: end_date
        });
    };
    ChongZhiHistroy.prototype.reciveNetMsg = function (msg, requestData, data) {
        if (msg == gamelib.GameMsg.moneyinfo) {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            if (data.retCode == 0) {
                if (requestData.moneytype == 1) {
                    this._dataList1 = data.retData;
                    this._bRequesting1 = false;
                }
                else {
                    this._dataList2 = data.retData;
                    this._bRequesting2 = false;
                }
                this.checkData();
            }
        }
    };
    ChongZhiHistroy.prototype.checkData = function () {
        if (this._bRequesting1 || this._bRequesting2)
            return;
        UiMainager_1.g_uiMgr.closeMiniLoading();
        var arr = [];
        if (this._dataList1)
            arr = arr.concat(this._dataList1);
        if (this._dataList2)
            arr = arr.concat(this._dataList2);
        this._list.dataSource = arr;
        this._tips.visible = arr.length == 0;
    };
    //yyyy-MM-dd HH:mm:ss
    ChongZhiHistroy.prototype.getDate = function (date, only) {
        if (only === void 0) { only = false; }
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var dd = date.getDate();
        var str_month = "";
        var str_date = "";
        if (month >= 1 && month <= 9) {
            str_month = "0" + month;
        }
        else {
            str_month = month + '';
        }
        if (dd >= 0 && dd <= 9) {
            str_date = "0" + dd;
        }
        else {
            str_date = dd + "";
        }
        if (only) {
            return date.getFullYear() + seperator1 + str_month + seperator1 + str_date;
        }
        var currentdate = date.getFullYear() + seperator1 + str_month + seperator1 + str_date
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    };
    ChongZhiHistroy.prototype.onItemRender = function (box, index) {
        var data = this._list.dataSource[index];
        var label = getChildByName(box, 'txt_1');
        label.text = data['inputtime'];
        label = getChildByName(box, 'txt_2');
        label.text = data['bankcode'];
        label = getChildByName(box, 'txt_3');
        if (data['moneystatus'] == 0)
            label.text = "审核中";
        else if (data['moneystatus'] == 1)
            label.text = "成功";
        else
            label.text = "失败";
        label = getChildByName(box, 'txt_4');
        label.text = data['moneynum'] + "元";
    };
    return ChongZhiHistroy;
}(BaseHistroy_1.default));
exports.default = ChongZhiHistroy;

},{"../BaseHistroy":3,"../UiMainager":12}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plug_1 = require("../Plug");
var TabList_1 = require("../control/TabList");
var UiMainager_1 = require("../UiMainager");
var ChoseMoney = /** @class */ (function (_super) {
    __extends(ChoseMoney, _super);
    function ChoseMoney(res, chongzi) {
        var _this = _super.call(this, res["b_zf"]) || this;
        _this._chongzi = chongzi;
        _this._res = _this._box.getChildAt(0);
        _this._tab = new TabList_1.default(_this._res.list_2);
        _this._tab.setItemRender(Laya.Handler.create(_this, _this.onTabItemRender, null, false));
        _this._tab.tabChangeHander = Laya.Handler.create(_this, _this.onTabChange, null, false);
        _this._list = _this._res.list_3;
        _this._list.renderHandler = Laya.Handler.create(_this, _this.onListItemRender, null, false);
        _this._list.selectEnable = true;
        _this._list.selectHandler = Laya.Handler.create(_this, _this.onSelecte, null, false);
        _this._list.dataSource = [{ value: 10 }, { value: 50 }, { value: 100 }, { value: 200 },
            { value: 500 }, { value: 1000 }, { value: 2000 }, { value: 3000 },
            { value: 4000 }, { value: 5000 }, { value: 10000 }
        ];
        _this._list.selectedIndex = -1;
        _this.addBtnToList("btn_clear", _this._res);
        _this.addBtnToList("btn_ok", _this._res);
        return _this;
    }
    ChoseMoney.prototype.setData = function (arr) {
        var dataSource = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var info = arr_1[_i];
            dataSource.push({
                label: info['payname'],
                title: info['typeName'],
                id: info['id'],
                colors: ["#DDB47A", "#503215"]
            });
        }
        this._dataList = arr;
        this._tab.dataSource = dataSource;
        this._tab.selectedIndex = 0;
        this._list.selectedIndex = -1;
        this.onTabChange(0);
    };
    ChoseMoney.prototype.onTabItemRender = function (box, index, data) {
        var info = getChildByName(box, "txt_info");
        var label = getChildByName(box, "txt_label");
        info.text = data.title;
        info.color = label.color;
    };
    ChoseMoney.prototype.onTabChange = function (index) {
        this._data = this._dataList[index];
    };
    ChoseMoney.prototype.onListItemRender = function (box, index) {
        var selected = getChildByName(box, "img_selected");
        var info = getChildByName(box, "txt_value");
        var data = this._list.dataSource[index];
        info.text = data.value + "元";
        selected.visible = index == this._list.selectedIndex;
    };
    ChoseMoney.prototype.onSelecte = function () {
        if (this._list.selectedIndex == -1)
            return;
        var temp = this._list.dataSource[this._list.selectedIndex];
        this._res.txt_oldPwd.text = temp.value;
    };
    ChoseMoney.prototype.onClickBtn = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_clear":
                this._list.selectedIndex = -1;
                this._res.txt_oldPwd.text = "";
                break;
            case "btn_ok":
                var money = parseInt(this._res.txt_oldPwd.text);
                if (money == 0) {
                    UiMainager_1.g_uiMgr.showTip("请输入正确的金额!", true);
                    return;
                }
                this._chongzi.showEwm_xx(this._data, money);
                break;
        }
    };
    return ChoseMoney;
}(Plug_1.default));
exports.default = ChoseMoney;

},{"../Plug":10,"../UiMainager":12,"../control/TabList":20}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plug_1 = require("../Plug");
var Global_1 = require("../Global");
/**
 * 二维码充值
 */
var ErweimaCz = /** @class */ (function (_super) {
    __extends(ErweimaCz, _super);
    function ErweimaCz(res, chongzhi) {
        var _this = _super.call(this, res["b_erweima"]) || this;
        _this.tips = ["以上{0}账号限本次存款使用,账户不定期更换!"];
        _this._chaxunInfo = {
            'wx': '如何查询订单号:\n1.进入微信右下角"我"，点击钱包，点击右上角"+"。\n2.进入"账单",点击对应的转账信息即可查询转账订单。',
            "qqpay": '如何查询订单号:\n1.进入QQ点击左上角头像，点开"我的钱包"。\n2.进入"设置-交易记录",点击对应的转账信息即可查询转账订单。',
            "zfb": '如何查询订单号:\n1.打开支付宝，点击右下角"我的"。\n2.进入"账单",点击对应的转账信息即可查询转账订单。',
            "ysf": '如何查询订单号:\n1.打开云闪付，点击右下角"我的"。\n2.进入"账单",点击对应的转账信息即可查询转账订单。'
        };
        _this._chongzhi = chongzhi;
        _this._res = _this._box.getChildAt(0);
        _this.addBtnToList("btn_copy1", _this._res);
        _this.addBtnToList("btn_save", _this._res);
        _this.addBtnToList("btn_open", _this._res);
        _this.addBtnToList("btn_tjcz", _this._res);
        _this.addBtnToList("btn_prev", _this._res);
        return _this;
    }
    ErweimaCz.prototype.setData = function (data, money, tabIndex) {
        this._data = data;
        this._res.txt_bankName.text = data['payname'];
        this._res.txt_zh.text = money + "";
        this._tabIndex = tabIndex;
        this._res.img_ewm.skin = GameVar.s_domain + data['img'];
        var url = data['img'];
        var arr = url.split("/");
        this._res.img_ewm.name = arr[arr.length - 1];
        this._res.txt_tips1.text = utils.StringUtility.format("以上{0}账号限本次存款使用,账户不定期更换!", data['typeName']);
        this._res.txt_tips0.text = utils.StringUtility.format("第一步:保存付款二维码,{0}扫码转账到指定{0}账号。", data['typeName']);
        this._res.txt_tip2.visible = data.type == 'wx';
        this._res.txt_cx.text = this._chaxunInfo[data.type];
    };
    ErweimaCz.prototype.onClickBtn = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_copy1":
                Global_1.copyStr(this._res.txt_bankName.text);
                break;
            case "btn_save":
                Global_1.saveImageToGallery(this._res.img_ewm);
                break;
            case "btn_open":
                break;
            case "btn_tjcz":
                g_net.requestWithToken(gamelib.GameMsg.Moneyinqr, { save: 1, money: this._res.txt_zh.text, type: this._data['payname'], par: this._data["type"] });
                this._chongzhi.onTabChange(this._tabIndex);
                break;
            case "btn_prev":
                this._chongzhi.onTabChange(this._tabIndex);
                break;
        }
    };
    return ErweimaCz;
}(Plug_1.default));
exports.default = ErweimaCz;

},{"../Global":5,"../Plug":10}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TabList = /** @class */ (function () {
    function TabList(list) {
        this._list = list;
        this._list.selectEnable = true;
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        if (this._list.scrollBar)
            this._list.scrollBar.visible = false;
        //this._list.selectHandler = Laya.Handler.create(this,this.onTabChanger,null,false)
    }
    Object.defineProperty(TabList.prototype, "selectedIndex", {
        get: function () {
            return this._list.selectedIndex;
        },
        set: function (value) {
            this._list.selectedIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    TabList.prototype.setItemRender = function (handler) {
        this._itemRender = handler;
    };
    Object.defineProperty(TabList.prototype, "tabChangeHander", {
        set: function (handler) {
            this._list.selectHandler = handler;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabList.prototype, "dataSource", {
        get: function () {
            return this._list.dataSource;
        },
        set: function (dataSource) {
            this._list.dataSource = dataSource;
        },
        enumerable: true,
        configurable: true
    });
    TabList.prototype.onItemRender = function (box, index) {
        var data = this._list.dataSource[index];
        var skins = data.skins;
        var img_normal = box.getChildByName('bg_normal');
        var img_selected = box.getChildByName('bg_selected');
        img_selected.visible = index == this._list.selectedIndex;
        img_normal.visible = !img_selected.visible;
        if (skins) {
            img_normal.skin = skins[0];
            img_selected.skin = skins[1];
        }
        var colors = data.colors;
        var label = box.getChildByName('txt_label');
        if (colors) {
            label.color = index == this._list.selectedIndex ? colors[1] : colors[0];
        }
        if (label && data.label)
            label.text = data.label;
        if (this._itemRender) {
            this._itemRender.runWith([box, index, data]);
        }
    };
    return TabList;
}());
exports.default = TabList;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimePicker = /** @class */ (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker(res) {
        var _this = _super.call(this) || this;
        _this._offSize = 0;
        _this._res = res;
        _this._label = res.getChildAt(0);
        _this._res.mouseEnabled = true;
        _this._res.on(Laya.Event.CLICK, _this, _this.onClick);
        _this.clear();
        return _this;
    }
    TimePicker.prototype.clear = function () {
        this._label.text = "";
    };
    Object.defineProperty(TimePicker.prototype, "time", {
        get: function () {
            return this._label.text;
        },
        set: function (value) {
            this._label.text = value;
        },
        enumerable: true,
        configurable: true
    });
    TimePicker.prototype.setOffsize = function (time) {
        this._offSize = time;
    };
    TimePicker.prototype.onClick = function (evt) {
        var self = this;
        if (window['showDatePicker']) {
            window['showDatePicker'](function (txt) {
                self._label.text = txt;
                self.event(Laya.Event.CHANGE, txt);
            }, this._offSize);
        }
    };
    return TimePicker;
}(Laya.EventDispatcher));
exports.default = TimePicker;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChongZhiData = /** @class */ (function () {
    function ChongZhiData() {
    }
    //解析线下交易的银行列表
    ChongZhiData.prototype.parseBankerListXX = function (list) {
        this.m_xx_bankList = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var temp = list_1[_i];
            this.m_xx_bankList.push(temp);
        }
    };
    //解析线下交易二维码列表
    ChongZhiData.prototype.parseEwmListXX = function (list) {
        this.m_xx_ewmList = {};
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var temp = list_2[_i];
            var info = new EwmInfo();
            info.parse(temp);
            var arr = this.m_xx_ewmList[info.type];
            if (arr == null) {
                this.m_xx_ewmList[info.type] = arr = [];
            }
            arr.push(info);
        }
    };
    ChongZhiData.prototype.getTitles = function () {
        var result = [];
        if (this.m_xx_bankList && this.m_xx_bankList.length != 0) {
            var temp = {
                label: '银行卡转账',
                icon: 'icons/dgetcharge_tixianyinliankatubiao.png',
                type: "bank",
                colors: ["#DDB47A", "#503215"],
            };
            result.push(temp);
        }
        for (var key in this.m_xx_ewmList) {
            var item = {
                type: key,
                colors: ["#DDB47A", "#503215"]
            };
            item.label = this.m_xx_ewmList[key][0].typeName + "转账";
            item.icon = this.m_xx_ewmList[key][0].icon;
            result.push(item);
        }
        return result;
    };
    ChongZhiData.prototype.getEwmInfoByType = function (type) {
        return this.m_xx_ewmList[type];
    };
    return ChongZhiData;
}());
exports.default = ChongZhiData;
var EwmInfo = /** @class */ (function () {
    function EwmInfo() {
        this.m_id = EwmInfo.s_id++;
    }
    EwmInfo.prototype.parse = function (temp) {
        switch (temp.type) {
            case "wx":
                this.icon = "icons/ic_wechat.png";
                break;
            case "zfb":
                this.icon = "icons/ic_alipay.png";
                break;
            case "ysf":
                this.icon = "icons/nfc_icon.png";
                break;
            case "qqpay":
                this.icon = "icons/ic_QQ.png";
                break;
        }
        for (var key in temp) {
            this[key] = temp[key];
        }
    };
    EwmInfo.s_id = 0;
    return EwmInfo;
}());
exports.EwmInfo = EwmInfo;
exports.g_chongZhiData = new ChongZhiData();

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameData = /** @class */ (function () {
    function GameData() {
        window['g_gameData'] = this;
        this._bigData = [];
        this._allPlatform = {};
    }
    GameData.prototype.getTypeData = function (type) {
        return this._bigData[type];
    };
    /**
     *
     * @param data 解析热门游戏
     */
    GameData.prototype.parseHotGame = function (data) {
        var bd = this._bigData[GameType.Hot] || new BigTypeData();
        bd.type = GameType.Hot;
        var arr = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            var item = new GameItemData();
            item.parse(obj);
            arr.push(item);
        }
        bd.addList(arr, true);
        this._bigData[GameType.Hot] = bd;
    };
    GameData.prototype.parseDianZiGame = function (list, platformName) {
        var bd = this._bigData[GameType.DianZi];
        var pfd;
        for (var _i = 0, _a = bd.list; _i < _a.length; _i++) {
            var pd = _a[_i];
            if (pd['api_name'] == platformName) {
                pfd = pd;
                break;
            }
        }
        if (pfd == null) {
            console.log(platformName + " 对应的平台数据不存在!");
            return;
        }
        for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
            var gd = list_1[_b];
            var gameData = new GameItemData();
            gameData.parse(gd);
            pfd.games.push(gameData);
        }
    };
    GameData.prototype.parseFishGame = function (data) {
        var bd = this._bigData[GameType.Fish] || new BigTypeData();
        bd.type = GameType.Fish;
        var arr = [];
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var obj = data_2[_i];
            var item = new GameItemData();
            item.parse(obj);
            arr.push(item);
        }
        bd.addList(arr, true);
        this._bigData[GameType.Fish] = bd;
    };
    /**
     *
     * @param list 解析所有平台数据
     */
    GameData.prototype.parseGetAip = function (list) {
        for (var i = GameType.QiPai; i <= GameType.Sport; i++) {
            var bd = this._bigData[i] || new BigTypeData();
            bd.type = i;
            this._bigData[i] = bd;
        }
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var obj = list_2[_i];
            if (!obj.is_open)
                continue;
            var item = new PlatformData();
            item.parse(obj);
            var plattypes = obj.plattype.split(",");
            for (var _a = 0, plattypes_1 = plattypes; _a < plattypes_1.length; _a++) {
                var str = plattypes_1[_a];
                var types = this.getType(str);
                for (var _b = 0, types_1 = types; _b < types_1.length; _b++) {
                    var type = types_1[_b];
                    this.addPlatform(item, type);
                }
            }
            for (var key in this._allPlatform) {
                var arr = this._allPlatform[key];
                var type1 = parseInt(key);
                var big = this._bigData[type1] || new BigTypeData();
                big.type = type1;
                big.addList(arr, false);
                this._bigData[type1] = big;
            }
        }
    };
    GameData.prototype.getType = function (str) {
        var result = [];
        var type;
        if (str.indexOf("|") == -1) {
            switch (str) //类型(game:电子,live:真人,sport:体育,lottery:彩票,fish:捕鱼,chess:棋牌,liuhecai:六合彩)
             {
                case "game":
                    type = GameType.DianZi;
                    break;
                case "live":
                    type = GameType.ZhenRen;
                    break;
                case "sport":
                    type = GameType.Sport;
                    break;
                case "fish":
                    type = GameType.Fish;
                    break;
                case "chess":
                    type = GameType.QiPai;
                    break;
                default:
                    console.log("unknow type " + str);
                    return result;
            }
            result.push(type);
        }
        else {
            var arr = str.split("|");
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var ts = arr_1[_i];
                result = result.concat(this.getType(ts));
            }
        }
        return result;
    };
    GameData.prototype.getAllPlatformNames = function () {
        var result = [];
        for (var key in this._allPlatform) {
            var arr = this._allPlatform[key];
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var temp = arr_2[_i];
                result.push(temp);
            }
        }
        return result;
    };
    /**
     *
     * @param pfd 添加平台数据
     * @param type
     */
    GameData.prototype.addPlatform = function (pfd, type) {
        console.log("addPlatform" + type);
        this._allPlatform = this._allPlatform || {};
        var arr = this._allPlatform[type] || [];
        arr.push(pfd);
        this._allPlatform[type] = arr;
    };
    return GameData;
}());
exports.default = GameData;
exports.g_gameData = new GameData();
var GameItemData = /** @class */ (function () {
    function GameItemData() {
    }
    GameItemData.prototype.parse = function (data) {
        for (var key in data) {
            this[key] = data[key];
        }
        this.res = GameVar.s_domain + "/img/imgPC/" + data.api_Name + "/" + data.onlyImg + ".png";
        this.name = data.chineseName;
        return true;
    };
    return GameItemData;
}());
exports.GameItemData = GameItemData;
var PlatformData = /** @class */ (function () {
    function PlatformData() {
        this.games = [];
    }
    PlatformData.prototype.parse = function (data) {
        for (var key in data) {
            this[key] = data[key];
        }
        this.res = GameVar.s_domain + "/img/appimage/" + data.api_name + ".png";
        this.icon = GameVar.s_domain + "/img/appimage/page/" + data.api_name + ".png";
        return true;
    };
    return PlatformData;
}());
exports.PlatformData = PlatformData;
/**
 * 大类。包含的是游戏列表或者平台列表
 */
var BigTypeData = /** @class */ (function () {
    function BigTypeData() {
    }
    BigTypeData.prototype.addList = function (arr, isGames) {
        this.list = [];
        this.isGames = isGames;
        for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
            var temp = arr_3[_i];
            this.list.push(temp);
        }
    };
    return BigTypeData;
}());
exports.BigTypeData = BigTypeData;
var GameType;
(function (GameType) {
    GameType[GameType["Hot"] = 0] = "Hot";
    GameType[GameType["QiPai"] = 1] = "QiPai";
    GameType[GameType["Fish"] = 2] = "Fish";
    GameType[GameType["DianZi"] = 3] = "DianZi";
    GameType[GameType["ZhenRen"] = 4] = "ZhenRen";
    GameType[GameType["Sport"] = 5] = "Sport";
})(GameType = exports.GameType || (exports.GameType = {}));
function checkLogin() {
    if (GameVar.s_token == "" || GameVar.s_token == null) {
        g_signal.dispatch("showLoginUi", 0);
        return false;
    }
    return true;
}
exports.checkLogin = checkLogin;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerData = /** @class */ (function () {
    function PlayerData() {
        this.m_userName = "";
        this.m_nickName = "";
        this.m_phone = "";
        this.m_money = 0;
        this.m_isOldWithNew = false;
        this.m_wx = "";
        this.m_mail = "";
    }
    return PlayerData;
}());
exports.default = PlayerData;
exports.g_playerData = new PlayerData();

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameData_1 = require("../data/GameData");
var UiMainager_1 = require("../UiMainager");
var GameList = /** @class */ (function (_super) {
    __extends(GameList, _super);
    function GameList(type) {
        var _this = _super.call(this) || this;
        _this._list = [];
        _this._type = type;
        return _this;
    }
    return GameList;
}(Laya.Sprite));
exports.default = GameList;
var GameListMgr = /** @class */ (function (_super) {
    __extends(GameListMgr, _super);
    function GameListMgr(panel) {
        var _this = _super.call(this) || this;
        _this._panel = panel;
        _this._tweens = [];
        return _this;
    }
    GameListMgr.prototype.updateList = function (type, isAnimation) {
        var content = this._panel.content;
        for (var _i = 0, _a = this._tweens; _i < _a.length; _i++) {
            var tw = _a[_i];
            Laya.Tween.clear(tw);
        }
        this._tweens.length = 0;
        content.removeChildren();
        var bigType = GameData_1.g_gameData.getTypeData(type);
        if (bigType == null) {
            this.requestDataByType(type);
            return;
        }
        UiMainager_1.g_uiMgr.closeMiniLoading();
        var arr = bigType.list;
        if (bigType.isGames) {
            this.showGames(arr, isAnimation);
        }
        else {
            this.showPlatforms(arr, isAnimation);
        }
    };
    GameListMgr.prototype.showGames = function (arr, isAnimation) {
        var content = this._panel.content;
        var num = Math.floor(arr.length / 2);
        var size = 3;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var icon = new GameIcon();
            content.addChild(icon);
            icon.setData(arr[i]);
            var col = i % size;
            var row = Math.floor(i / size);
            icon.y = col * (icon.height + 10);
            var tx = row * (icon.width + 50);
            if (!isAnimation || tx > Laya.stage.width) {
                icon.x = tx;
            }
            else {
                icon.x = Laya.stage.width - this._panel.left;
                this._tweens.push(Laya.Tween.to(icon, { x: tx }, 100));
            }
        }
        this._panel.refresh();
    };
    GameListMgr.prototype.showPlatforms = function (arr, isAnimation) {
        var content = this._panel.content;
        var num = Math.floor(arr.length / 2);
        var size = 2;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var icon = new PlatformIcon();
            content.addChild(icon);
            icon.setPlatformData(arr[i]);
            var col = i % size;
            var row = Math.floor(i / size);
            icon.y = col * (icon.height + 10);
            var tx = row * (icon.width + 50);
            if (!isAnimation || tx > Laya.stage.width) {
                icon.x = tx;
            }
            else {
                icon.x = Laya.stage.width - this._panel.left;
                this._tweens.push(Laya.Tween.to(icon, { x: tx }, 100));
            }
        }
        this._panel.refresh();
    };
    GameListMgr.prototype.requestDataByType = function (type) {
        UiMainager_1.g_uiMgr.showMiniLoading();
        switch (type) {
            case GameData_1.GameType.Hot:
                g_net.request(gamelib.GameMsg.Getapigame, { gametype: -3, pageSize: 100, pageIndex: 1 });
                break;
            case GameData_1.GameType.Fish:
                g_net.request(gamelib.GameMsg.Getapifish, {});
                break;
            case GameData_1.GameType.ZhenRen:
                g_net.request(gamelib.GameMsg.Getapifish, {});
                break;
            default:
                g_net.request(gamelib.GameMsg.Getapi, {});
        }
        // if(type == GameType.QiPai)
        // {
        //     g_net.request(gamelib.GameMsg.Getapi,{})
        // }
    };
    return GameListMgr;
}(Laya.Sprite));
exports.GameListMgr = GameListMgr;
var GameIcon = /** @class */ (function (_super) {
    __extends(GameIcon, _super);
    function GameIcon() {
        var _this = _super.call(this) || this;
        _this.width = _this.height = 140;
        return _this;
    }
    GameIcon.prototype.setData = function (gameData) {
        this._gameData = gameData;
        this.setRes(gameData.res);
        this.mouseEnabled = true;
        this.on(Laya.Event.CLICK, this, this.onClickGame);
    };
    GameIcon.prototype.setRes = function (res) {
        var source = Laya.Loader.getRes(res);
        if (source != null) {
            this.source = source;
        }
        else {
            this.skin = "icons/placeholder.png";
            Laya.loader.load(res, Laya.Handler.create(this, this.onResLoaded, [res]));
        }
    };
    GameIcon.prototype.onResLoaded = function (res) {
        this.skin = res;
    };
    GameIcon.prototype.onClickGame = function (evt) {
        console.log("enterGame" + this._gameData.name);
        g_signal.dispatch("enterGame", this._gameData);
    };
    return GameIcon;
}(Laya.Image));
exports.GameIcon = GameIcon;
var PlatformIcon = /** @class */ (function (_super) {
    __extends(PlatformIcon, _super);
    function PlatformIcon() {
        var _this = _super.call(this) || this;
        _this.width = _this.height = 140;
        return _this;
    }
    PlatformIcon.prototype.setPlatformData = function (pd) {
        this._pfd = pd;
        this.setRes(pd.res);
        this.mouseEnabled = true;
        this.on(Laya.Event.CLICK, this, this.onClickGame);
    };
    PlatformIcon.prototype.onClickGame = function (evt) {
        console.log("enterPlatform" + this._pfd);
        g_signal.dispatch("enterPlatform", this._pfd);
    };
    return PlatformIcon;
}(GameIcon));
exports.PlatformIcon = PlatformIcon;

},{"../UiMainager":12,"../data/GameData":23}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
var GameData_1 = require("../data/GameData");
var UiMainager_1 = require("../UiMainager");
var GameList_1 = require("./GameList");
var PlatfromList = /** @class */ (function (_super) {
    __extends(PlatfromList, _super);
    function PlatfromList() {
        var _this = _super.call(this, "ui.SubGameListUI") || this;
        _this._isFirst = true;
        return _this;
    }
    PlatfromList.prototype.init = function () {
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.setItemRender(Laya.Handler.create(this, this.onTabItemRender, null, false));
        this._title = this._res['img_title'];
        this._panel = this._res['p_1'];
        this._box = this._panel.content;
        this._txt = this._res['txt_info'];
        this._txt_input = this._res['txt_input'];
        this.addBtnToListener("btn_search");
        this._tweens = [];
    };
    PlatfromList.prototype.setData = function (data) {
        if (data.type == GameData_1.GameType.QiPai) {
            this._title.skin = "bgs/ic_qipai_title/png";
        }
        else {
            this._title.skin = "bgs/ic_dz_title/png";
        }
        var big = GameData_1.g_gameData.getTypeData(data.type);
        var list = big.list;
        var ds = [];
        this._pfds = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var pfd = list_1[_i];
            ds.push({
                label: pfd['api_mainname'],
                "colors": ["#DDB47A", "#503215"],
                icon: pfd.icon
            });
            this._pfds.push(pfd);
        }
        this._tab.dataSource = ds;
        var index = list.indexOf(data.pd);
        if (index == -1)
            index = 0;
        this._tab.selectedIndex = index;
    };
    PlatfromList.prototype.onTabItemRender = function (box, index, data) {
        var icon = getChildByName(box, 'game_icon');
        icon.skin = data.icon;
    };
    PlatfromList.prototype.onTabChange = function (index) {
        console.log("选中的“：" + index);
        var pfd = this._pfds[index];
        if (pfd.games.length == 0) {
            //请求平台对应的游戏;
            g_net.requestWithToken(gamelib.GameMsg.Getapigame, { game: pfd['api_name'], gametype: 0, pageSize: 50, pageIndex: 0 });
            return;
        }
        this.showGames(pfd.games, index == 0 && this._isFirst);
        this._isFirst = false;
        UiMainager_1.g_uiMgr.closeMiniLoading();
    };
    PlatfromList.prototype.showGames = function (arr, isAnimation) {
        this._box.removeChildren();
        var num = Math.floor(arr.length / 2);
        var size = 3;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var icon = new GameList_1.GameIcon();
            this._box.addChild(icon);
            icon.setData(arr[i]);
            var col = i % size;
            var row = Math.floor(i / size);
            icon.y = col * (icon.height + 10);
            var tx = row * (icon.width + 50);
            if (!isAnimation || tx > Laya.stage.width) {
                icon.x = tx;
            }
            else {
                icon.x = Laya.stage.width - this._panel.left;
                this._tweens.push(Laya.Tween.to(icon, { x: tx }, 100));
            }
        }
        this._panel.refresh();
    };
    return PlatfromList;
}(BasePanel_1.default));
exports.default = PlatfromList;

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"../data/GameData":23,"./GameList":25}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiMainager_1 = require("../UiMainager");
var Global_1 = require("../Global");
var LoginUi = /** @class */ (function (_super) {
    __extends(LoginUi, _super);
    function LoginUi() {
        return _super.call(this, 'ui.LoginUiUI') || this;
    }
    LoginUi.prototype.init = function () {
        this.addBtnToListener('btn_login');
        this.addBtnToListener('btn_zc');
    };
    LoginUi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._res['txt_name'].text = gamelib.Api.getLocalStorage("username") || "";
    };
    LoginUi.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_login":
                if (this._res['txt_name'].text == "" || this._res["txt_pwd"].text == "") {
                    UiMainager_1.g_uiMgr.showTip("请输入账户和密码");
                    return;
                }
                UiMainager_1.g_uiMgr.showMiniLoading();
                Global_1.default(this._res['txt_name'].text, this._res["txt_pwd"].text);
                this.close();
                break;
            case "btn_zc":
                g_signal.dispatch("openUi", ["btn_register"]);
                break;
        }
    };
    return LoginUi;
}(gamelib.core.Ui_NetHandle));
exports.default = LoginUi;

},{"../Global":5,"../UiMainager":12}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiMainager_1 = require("../UiMainager");
var Global_1 = require("../Global");
var RegisterUi = /** @class */ (function (_super) {
    __extends(RegisterUi, _super);
    function RegisterUi() {
        return _super.call(this, "ui.RegisterUiUI") || this;
    }
    RegisterUi.prototype.init = function () {
        _super.prototype.init.call(this);
        this.addBtnToListener('btn_ok');
    };
    RegisterUi.prototype.reciveNetMsg = function (msg, requestData, data) {
        if (msg == gamelib.GameMsg.Register) {
            UiMainager_1.g_uiMgr.showMiniLoading();
            if (data.retCode == 0) {
                Global_1.default(this._res['txt_name'].text, this._res["txt_pwd1"].text);
                this.close();
            }
            else {
                UiMainager_1.g_uiMgr.showTip(data.retMsg);
            }
        }
    };
    RegisterUi.prototype.onClickObjects = function (evt) {
        var _id = this._res['txt_name'].text;
        var _pw1 = this._res['txt_pwd1'].text;
        var _pw2 = this._res['txt_pwd2'].text;
        if (_id == "") {
            UiMainager_1.g_uiMgr.showTip("请输入您的账户!");
            return;
        }
        if (_pw1 == "" || _pw2 == "") {
            UiMainager_1.g_uiMgr.showTip("请输入您的密码!");
            return;
        }
        if (_pw1 != _pw2) {
            UiMainager_1.g_uiMgr.showTip("2次密码不一致!");
            return;
        }
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.request(gamelib.GameMsg.Register, {
            gusername: _id,
            gpassword: _pw1
        });
    };
    return RegisterUi;
}(gamelib.core.Ui_NetHandle));
exports.default = RegisterUi;

},{"../Global":5,"../UiMainager":12}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MailInfo = /** @class */ (function (_super) {
    __extends(MailInfo, _super);
    function MailInfo() {
        return _super.call(this, "ui.MailInfoUI") || this;
    }
    MailInfo.prototype.init = function () {
        this._txt = this._res["txt_info"];
        this._txt.text = "";
        this.addBtnToListener('btn_remove');
    };
    MailInfo.prototype.setData = function (data) {
        this._id = data.id;
        this._txt.text = data.context;
    };
    MailInfo.prototype.onClickObjects = function (evt) {
        g_net.requestWithToken(gamelib.GameMsg.Websitemaildelete, { id: this._id });
        this.close();
    };
    return MailInfo;
}(gamelib.core.Ui_NetHandle));
exports.default = MailInfo;

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MailInfo_1 = require("./MailInfo");
var UiMainager_1 = require("../UiMainager");
var MailUi = /** @class */ (function (_super) {
    __extends(MailUi, _super);
    function MailUi() {
        return _super.call(this, "ui.MailUI") || this;
    }
    MailUi.prototype.reciveNetMsg = function (msg, rd, data) {
        switch (msg) {
            case gamelib.GameMsg.Websitemaillist:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (data.retCode != 0) {
                    return;
                }
                this._data = [];
                for (var _i = 0, _a = data.retData; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    this._data.push(temp);
                }
                this.setData(this._data);
                break;
            case gamelib.GameMsg.Readwebsitemail:
                for (var _b = 0, _c = this._data; _b < _c.length; _b++) {
                    var md = _c[_b];
                    if (md.id == rd.id || rd.id == 0) {
                        md.state = "True";
                    }
                }
                this.setData(this._data);
                break;
            case gamelib.GameMsg.Websitemaildelete:
                for (var index = 0; index < this._data.length; index++) {
                    var element = this._data[index];
                    if (element.id == rd.id) {
                        this._data.splice(index, 1);
                        break;
                    }
                }
                this.setData(this._data);
                break;
        }
    };
    MailUi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Websitemaillist, { pageIndex: 0, pageSize: 200 });
    };
    MailUi.prototype.setData = function (data) {
        this._list.dataSource = data;
        this._res['txt_tips1'].visible = data == null || data.length == 0;
    };
    MailUi.prototype.init = function () {
        this._list = this._res["list_1"];
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    MailUi.prototype.onItemRender = function (box, index) {
        var btn = getChildByName(box, 'btn_check');
        btn.offAll(Laya.Event.CLICK);
        var md = this._list.dataSource[index];
        btn.on(Laya.Event.CLICK, this, this.onClickInfo, [md]);
        var label = getChildByName(box, 'txt_name');
        label.text = md.username;
        label = getChildByName(box, 'txt_title');
        label.text = md.title;
        label = getChildByName(box, 'txt_info');
        utils.tools.setLabelDisplayValue(label, md.context);
        label = getChildByName(box, 'txt_time');
        label.text = md.inputtime;
    };
    MailUi.prototype.onClickInfo = function (md, evt) {
        this._info = this._info || new MailInfo_1.default();
        this._info.setData(md);
        this._info.show();
    };
    return MailUi;
}(gamelib.core.Ui_NetHandle));
exports.default = MailUi;

},{"../UiMainager":12,"./MailInfo":29}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Notice = /** @class */ (function (_super) {
    __extends(Notice, _super);
    function Notice() {
        return _super.call(this, "ui.NoticeUI") || this;
    }
    Notice.prototype.setData = function (data) {
        this._res['img_gg'].skin = GameVar.s_domain + data.image;
    };
    return Notice;
}(gamelib.core.Ui_NetHandle));
exports.default = Notice;

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoticeMsg = /** @class */ (function (_super) {
    __extends(NoticeMsg, _super);
    function NoticeMsg() {
        return _super.call(this, "ui.NoticeMsgUI") || this;
    }
    NoticeMsg.prototype.init = function () {
        this.addBtnToListener("btn_ok");
    };
    NoticeMsg.prototype.setData = function (data) {
        this._index = 0;
        this._list = data.retData || [];
        if (this._list.length == 0)
            return false;
        this.setItme(this._list[this._index++]);
        return true;
    };
    NoticeMsg.prototype.setItme = function (data) {
        this._res['txt_gg'].text = data.ggcontent;
    };
    NoticeMsg.prototype.onClickObjects = function (evt) {
        if (this._index >= this._list.length) {
            this.close();
            return;
        }
        this.setItme(this._list[this._index++]);
    };
    return NoticeMsg;
}(gamelib.core.Ui_NetHandle));
exports.default = NoticeMsg;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiMainager_1 = require("../UiMainager");
var SetPassword = /** @class */ (function (_super) {
    __extends(SetPassword, _super);
    function SetPassword() {
        var _this = _super.call(this, 'ui.SetBankPasswordUI') || this;
        _this._currentIndex = 0;
        return _this;
    }
    SetPassword.prototype.init = function () {
        this._txt_input1 = this._res['txt_input1'];
        this._txt_input2 = this._res['txt_input2'];
        this.addBtnToListener("btn_ok");
        this.m_closeUiOnSide = false;
    };
    SetPassword.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._txt_input1.text = this._txt_input2.text = "";
        this._inputValue1 = this._inputValue2 = "";
        this._txt_input1.on(Laya.Event.INPUT, this, this.onInput1);
        this._txt_input2.on(Laya.Event.INPUT, this, this.onInput2);
        this._txt_input1.on(Laya.Event.FOCUS, this, this.onFocusChange);
        this._txt_input2.on(Laya.Event.FOCUS, this, this.onFocusChange);
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        for (var i = 0; i < 6; i++) {
            this._res['b_input1'].getChildAt(i).getChildAt(0).text = "";
            this._res['b_input2'].getChildAt(i).getChildAt(0).text = "";
        }
    };
    SetPassword.prototype.onClose = function () {
        _super.prototype.onClose.call(this);
        this._txt_input1.off(Laya.Event.INPUT, this, this.onInput1);
        this._txt_input2.off(Laya.Event.INPUT, this, this.onInput2);
        this._txt_input1.off(Laya.Event.FOCUS, this, this.onFocusChange);
        this._txt_input2.off(Laya.Event.FOCUS, this, this.onFocusChange);
        Laya.stage.off(Laya.Event.KEY_DOWN, this, this.onKeyDown);
    };
    SetPassword.prototype.onKeyDown = function (evt) {
        console.log(evt.keyCode);
        if (evt.keyCode == 8) {
            if (this._currentIndex == 0)
                return;
            var str = this['_inputValue' + this._currentIndex];
            str = str.slice(0, str.length - 1);
            this['_inputValue' + this._currentIndex] = str;
            this.update(str, this._res['b_input' + this._currentIndex]);
        }
    };
    SetPassword.prototype.onFocusChange = function (txt) {
        this._currentIndex = txt == this._txt_input1 ? 1 : 2;
    };
    SetPassword.prototype.onInput1 = function (evt) {
        this._currentIndex = 1;
        this._inputValue1 += this._txt_input1.text;
        this._txt_input1.text = "";
        this.update(this._inputValue1, this._res['b_input1']);
    };
    SetPassword.prototype.onInput2 = function (evt) {
        this._currentIndex = 2;
        this._inputValue2 += this._txt_input2.text;
        this._txt_input2.text = "";
        this.update(this._inputValue2, this._res['b_input2']);
    };
    SetPassword.prototype.onClickObjects = function (evt) {
        if (this._inputValue1 == "" || this._inputValue2 == "") {
            UiMainager_1.g_uiMgr.showTip("请输入密码", true);
            return;
        }
        if (this._inputValue1 != this._inputValue2) {
            UiMainager_1.g_uiMgr.showTip("两次的密码必须一样", true);
            return;
        }
        g_net.requestWithToken(gamelib.GameMsg.Qkpassword, { qkpassword: this._inputValue1 });
        this.close();
    };
    SetPassword.prototype.update = function (value, box) {
        for (var i = 0; i < 6; i++) {
            var label = box.getChildAt(i).getChildAt(0);
            label.text = i >= value.length ? "" : value.charAt(i);
        }
    };
    return SetPassword;
}(gamelib.core.BaseUi));
exports.default = SetPassword;

},{"../UiMainager":12}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
var PlayerData_1 = require("../data/PlayerData");
var UiMainager_1 = require("../UiMainager");
var SetPassword_1 = require("./SetPassword");
var VerifyPassword_1 = require("./VerifyPassword");
var TiXianUi = /** @class */ (function (_super) {
    __extends(TiXianUi, _super);
    function TiXianUi() {
        return _super.call(this, "ui.TiXianUI") || this;
    }
    TiXianUi.prototype.init = function () {
        this._tab = this._res['tab_1'];
        this._tab = new TabList_1.default(this._res["list_tab"]);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { skins: ["btns/ic_withdraw_bank.png", "btns/ic_withdraw_bank_pressed.png"] },
        ];
        this.addBtnToListener("btn_tx");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_bangding");
        this.addBtnToListener("btn_bd");
    };
    TiXianUi.prototype.reciveNetMsg = function (msg, rd, data) {
        switch (msg) {
            case gamelib.GameMsg.Bindbank:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (data.retCode != 0) {
                    return;
                }
                var obj = JSON.parse(data.retMsg);
                this.updateData(obj);
                break;
            case gamelib.GameMsg.Bindbankadd:
                g_net.requestWithToken(gamelib.GameMsg.Bindbank, {});
                break;
            case gamelib.GameMsg.Readmoney:
                this._needSetPassword = data.retCode == 1;
                break;
            // case gamelib.GameMsg.Getqkpwd:
            //     var money:number
            //     if(data.retCode == 0)
            //     {
            //     }
            //     break;
        }
    };
    TiXianUi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Bindbank, {}); //请求绑定银行信息
        g_net.requestWithToken(gamelib.GameMsg.Readmoney, {}); //获取是否设置绑定密码
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    TiXianUi.prototype.updateData = function (data) {
        if (data.mybanknum == "") {
            this._tab.dataSource = [
                { skins: ["btns/ic_withdraw_bank.png", "btns/ic_withdraw_bank_pressed.png"] },
                { skins: ["btns/ic_withdraw_card.png", "btns/ic_withdraw_card_pressed.png"] }
            ];
            this._res['b_unlock'].visible = true;
            this._res['b_myBank'].visible = false;
            this._needAddBank = true;
        }
        else {
            this._tab.dataSource = [
                { skins: ["btns/ic_withdraw_bank.png", "btns/ic_withdraw_bank_pressed.png"] }
            ];
            this._res['b_unlock'].visible = false;
            this._res['b_myBank'].visible = true;
            this._res['txt_name'].text = data.mybankname;
            this._res['txt_id'].text = data.mybanknum;
            this._needAddBank = false;
            this._bankInfo = data;
        }
    };
    TiXianUi.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showTiXian();
        else if (index == 1)
            this.showAddBank();
    };
    TiXianUi.prototype.showTiXian = function () {
        this._res['b_tx'].visible = true;
        this._res['b_add'].visible = false;
    };
    TiXianUi.prototype.showAddBank = function () {
        this._res['b_tx'].visible = false;
        this._res['b_add'].visible = true;
    };
    TiXianUi.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_clear":
                this._res['txt_input'].text = "0";
                break;
            case "btn_bangding":
                this._tab.selectedIndex = 1;
                break;
            case "btn_addBank":
                this.showAddBank();
                break;
            case "btn_bd":
                this.onBind();
                break;
            case "btn_tx": //确认体现
                if (this._needAddBank) {
                    UiMainager_1.g_uiMgr.showTip("请先绑定您的银行卡", true);
                    return;
                }
                if (this._needSetPassword) {
                    this._setPwd = this._setPwd || new SetPassword_1.default();
                    this._setPwd.show();
                }
                else {
                    var money = parseInt(this._res['txt_input'].text);
                    this._verifyPwd = this._verifyPwd || new VerifyPassword_1.default();
                    this._verifyPwd.setData(money);
                    this._verifyPwd.show();
                }
                break;
        }
    };
    TiXianUi.prototype.onBind = function () {
        var userName = this._res['txt_name'].text;
        var bankName = this._res['txt_bankName'].text;
        var mybanknum = this._res['txt_bankId'].text;
        var mybankaddress = this._res['txt_bankAddress'].text;
        if (userName == "") {
            UiMainager_1.g_uiMgr.showTip("请输入持卡人姓名", true);
            return;
        }
        if (bankName == "") {
            UiMainager_1.g_uiMgr.showTip("请输入银行名", true);
            return;
        }
        if (mybanknum == "") {
            UiMainager_1.g_uiMgr.showTip("请输入银行卡号", true);
            return;
        }
        if (mybankaddress == "") {
            UiMainager_1.g_uiMgr.showTip("请输入银行卡开户地址", true);
            return;
        }
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Basicxingxi, {
            gmyname: userName,
            gmyphone: PlayerData_1.g_playerData.m_phone || "",
            WeChat: PlayerData_1.g_playerData.m_wx || "",
            mailbox: PlayerData_1.g_playerData.m_mail || ""
        });
        g_net.requestWithToken(gamelib.GameMsg.Bindbankadd, {
            mybankname: bankName,
            mybanknum: mybanknum,
            mybankaddress: mybankaddress
        });
    };
    return TiXianUi;
}(BasePanel_1.default));
exports.default = TiXianUi;

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"../data/PlayerData":24,"./SetPassword":33,"./VerifyPassword":35}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UiMainager_1 = require("../UiMainager");
var VerifyPassword = /** @class */ (function (_super) {
    __extends(VerifyPassword, _super);
    function VerifyPassword() {
        return _super.call(this, 'ui.VerifyBankPasswordUI') || this;
    }
    VerifyPassword.prototype.init = function () {
        this._txt_input1 = this._res['txt_input'];
        this.addBtnToListener("btn_ok");
        this.m_closeUiOnSide = false;
    };
    VerifyPassword.prototype.reciveNetMsg = function (msg, rd, data) {
        if (msg == gamelib.GameMsg.Moneyout) {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            if (data.retCode == 0) {
                this.close();
            }
        }
    };
    VerifyPassword.prototype.setData = function (value) {
        this._money = value;
    };
    VerifyPassword.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._txt_input1.text = "";
        this._inputValue1 = "";
        this._txt_input1.on(Laya.Event.INPUT, this, this.onInput1);
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        for (var i = 0; i < 6; i++) {
            this._res['b_input1'].getChildAt(i).getChildAt(0).text = "";
        }
    };
    VerifyPassword.prototype.onClose = function () {
        _super.prototype.onClose.call(this);
        this._txt_input1.off(Laya.Event.INPUT, this, this.onInput1);
        Laya.stage.off(Laya.Event.KEY_DOWN, this, this.onKeyDown);
    };
    VerifyPassword.prototype.onKeyDown = function (evt) {
        console.log(evt.keyCode);
        if (evt.keyCode == 8) {
            this._inputValue1 = this._inputValue1.slice(0, this._inputValue1.length - 1);
            this.update(this._inputValue1, this._res['b_input1']);
        }
    };
    VerifyPassword.prototype.onInput1 = function (evt) {
        this._inputValue1 += this._txt_input1.text;
        this._txt_input1.text = "";
        this.update(this._inputValue1, this._res['b_input1']);
    };
    VerifyPassword.prototype.onClickObjects = function (evt) {
        if (this._money == 0 || isNaN(this._money)) {
            UiMainager_1.g_uiMgr.showTip("请输入金额", true);
            return;
        }
        if (this._inputValue1 == "") {
            UiMainager_1.g_uiMgr.showTip("请输入密码", true);
            return;
        }
        UiMainager_1.g_uiMgr.showMiniLoading();
        // g_net.requestWithToken(gamelib.GameMsg.Getqkpwd,{qkpwd:this._inputValue1});
        g_net.requestWithToken(gamelib.GameMsg.Moneyout, { qkmoney: this._money, qkpwd: this._inputValue1 });
    };
    VerifyPassword.prototype.update = function (value, box) {
        for (var i = 0; i < 6; i++) {
            var label = box.getChildAt(i).getChildAt(0);
            label.text = i >= value.length ? "" : value.charAt(i);
        }
    };
    return VerifyPassword;
}(gamelib.core.Ui_NetHandle));
exports.default = VerifyPassword;

},{"../UiMainager":12}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TuiGuangRule = /** @class */ (function (_super) {
    __extends(TuiGuangRule, _super);
    function TuiGuangRule() {
        return _super.call(this, 'ui.TuiGuang_GZUI') || this;
    }
    TuiGuangRule.prototype.init = function () {
        var str = "1\u3001\u6BCF\u4E2A\u63A8\u8350\u4EBA\u53EA\u53EF\u4EAB\u53D7\u4E00\u6B21\u5956\u52B1\n2\u3001\u6210\u4E3A\u8001\u7528\u6237\u540E\u624D\u80FD\u63A8\u8350\u65B0\u7528\u6237\n3\u3001\u9080\u8BF7\u7684\u65B0\u7528\u6237\u8FBE\u5230\u6761\u4EF6\u540E\uFF0C\u8001\u7528\u6237\u624D\u80FD\u8FD4\u4F63,\u4F63\u91D1\u8FBE\u5230\u6D41\u6C34\u5373\u53EF\u63D0\u6B3E\n4\u3001\u4F63\u91D1\u4F1A\u5728\u7CFB\u7EDF\u89C4\u5B9A\u65F6\u95F4\u53D1\u653E\n5\u3001\u5982\u6709\u7591\u95EE\u8BF7\u8054\u7CFB\u5BA2\u670D";
        this._res['txt_info'].text = str;
    };
    return TuiGuangRule;
}(gamelib.core.BaseUi));
exports.default = TuiGuangRule;

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("../BasePanel");
var UiMainager_1 = require("../UiMainager");
var TabList_1 = require("../control/TabList");
var PlayerData_1 = require("../data/PlayerData");
var TuiGuangHistroy_1 = require("./TuiGuangHistroy");
var TuiGUangRule_1 = require("./TuiGUangRule");
var TuiGuang = /** @class */ (function (_super) {
    __extends(TuiGuang, _super);
    function TuiGuang() {
        return _super.call(this, 'ui.TuiGuangUI') || this;
    }
    TuiGuang.prototype.init = function () {
        this.addBtnToListener('btn_gz');
        this.addBtnToListener('btn_sq');
        this.addBtnToListener('btn_xq');
        this.addBtnToListener('btn_fx_hy');
        this.addBtnToListener('btn_fx_qq');
        this.addBtnToListener('btn_copy');
        this._qrc = new gamelib.control.QRCodeImg(this._res['img_ewm']);
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { skins: ["btns/tg_tab1_2.png", "btns/tg_tab1_1.png"] },
            { skins: ["btns/tg_tab2_2.png", "btns/tg_tab2_1.png"] } //申请代理 
        ];
    };
    TuiGuang.prototype.reciveNetMsg = function (msg, requestData, data) {
        switch (msg) {
            case gamelib.GameMsg.Subagent:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (data.retCode == 0) {
                    UiMainager_1.g_uiMgr.showTip("申请成功!");
                }
                else {
                    UiMainager_1.g_uiMgr.showTip("申请失败!" + data.retMsg);
                }
                break;
        }
    };
    TuiGuang.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._res['txt_id'].text = PlayerData_1.g_playerData.m_userName;
        this._res['txt_info'].text = "";
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    TuiGuang.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showMyTuiGuang();
        else
            this.showShenQingDaiLi();
    };
    /**
     * 显示我的推广
     */
    TuiGuang.prototype.showMyTuiGuang = function () {
        this._res['b_1'].visible = true;
        this._res['b_2'].visible = false;
    };
    /**
     *
     */
    TuiGuang.prototype.showShenQingDaiLi = function () {
        this._res['b_1'].visible = false;
        this._res['b_2'].visible = true;
    };
    TuiGuang.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_gz":
                this._rule = this._rule || new TuiGUangRule_1.default();
                this._rule.show();
                break;
            case "btn_xq":
                this._histroy = this._histroy || new TuiGuangHistroy_1.default();
                this._histroy.show();
                break;
            case "btn_sq":
                if (this._res['txt_info'].text == "") {
                    UiMainager_1.g_uiMgr.showTip("请输入备注信息", true);
                    return;
                }
                UiMainager_1.g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Subagent, { subcontent: this._res['txt_info'].text });
                break;
            case "btn_fx_hy":
            case "btn_fx_qq":
            case "btn_fx_pyq":
                this.doShare(evt.currentTarget.name);
                break;
            case "btn_copy":
                utils.tools.copyToClipboard(this._res['txt_web'].text, function () {
                    UiMainager_1.g_uiMgr.showTip("拷贝成功");
                });
                break;
        }
    };
    TuiGuang.prototype.doShare = function (name) {
    };
    return TuiGuang;
}(BasePanel_1.default));
exports.default = TuiGuang;

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"../data/PlayerData":24,"./TuiGUangRule":36,"./TuiGuangHistroy":38}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var UiMainager_1 = require("../UiMainager");
var TuiGuangHistroy = /** @class */ (function (_super) {
    __extends(TuiGuangHistroy, _super);
    function TuiGuangHistroy() {
        return _super.call(this, 'ui.TuiGuang_XQUI') || this;
    }
    TuiGuangHistroy.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Oldwithnewinfolist, { pageIndex: 0, pageSize: 200 });
    };
    TuiGuangHistroy.prototype.reciveNetMsg = function (msg, requestData, data) {
        if (msg == gamelib.GameMsg.Oldwithnewinfolist) {
            UiMainager_1.g_uiMgr.closeMiniLoading();
            this.setData(data.retData);
        }
    };
    TuiGuangHistroy.prototype.onItemRender = function (box, index) {
        var obj = this._list.dataSource[index];
        var label = getChildByName(box, "txt_1");
        label.text = obj.username;
        label = getChildByName(box, "txt_2");
        label.text = obj.addtime;
        label = getChildByName(box, "txt_3");
        if (obj.isRebate == 0) {
            label.text = "未返佣";
            label.color = "#EB0112";
        }
        else {
            label.text = "已返佣";
            label.color = "#00F41C";
        }
        label = getChildByName(box, "txt_4");
        label.text = obj.rebateamount;
    };
    return TuiGuangHistroy;
}(BaseHistroy_1.default));
exports.default = TuiGuangHistroy;

},{"../BaseHistroy":3,"../UiMainager":12}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("../BasePanel");
var UiMainager_1 = require("../UiMainager");
var XiMa = /** @class */ (function (_super) {
    __extends(XiMa, _super);
    function XiMa() {
        return _super.call(this, "ui.XiMaUI") || this;
    }
    XiMa.prototype.init = function () {
        this.addBtnToListener("btn_get");
        this._list = this._res["list_1"];
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    XiMa.prototype.reciveNetMsg = function (msg, rd, data) {
        switch (msg) {
            case gamelib.GameMsg.Realtimereturn:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (data.retCode != 0) {
                    return;
                }
                var total = 0;
                for (var _i = 0, _a = data.retData; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    var num = parseFloat(temp.fs);
                    temp.fs = (num * 100).toFixed(2) + "%";
                    total += parseFloat(temp.fs_money);
                }
                this._res['txt_money'].text = total.toFixed(2) + "元";
                this._list.dataSource = data.retData;
                this._res['txt_tips1'].visible = data.retData == null || data.retData.length == 0;
                break;
            case gamelib.GameMsg.Rreceivereturn:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                UiMainager_1.g_uiMgr.showTip(data.retMsg, data.retMsg != 0);
                break;
        }
    };
    XiMa.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        UiMainager_1.g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Realtimereturn, {});
    };
    XiMa.prototype.onItemRender = function (box, i) {
        var data = this._list.dataSource[i];
        var keys = ["typename", "BetAmount", "ValidBetAmount", "NetAmount", "fs", "fs_money"];
        for (var index = 0; index < keys.length; index++) {
            var element = keys[index];
            var label = getChildByName(box, 'txt_' + index);
            label.text = data[element];
        }
        var bg = getChildByName(box, 'item_bg');
        bg.skin = i % 2 == 0 ? "comp/list_itembg1.png" : "comp/list_itembg2.png";
    };
    XiMa.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_get":
                UiMainager_1.g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Rreceivereturn, {});
                break;
        }
    };
    return XiMa;
}(BasePanel_1.default));
exports.default = XiMa;

},{"../BasePanel":4,"../UiMainager":12}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var View = Laya.View;
var Dialog = Laya.Dialog;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var AlertUI = /** @class */ (function (_super) {
        __extends(AlertUI, _super);
        function AlertUI() {
            return _super.call(this) || this;
        }
        AlertUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(AlertUI.uiView);
        };
        AlertUI.uiView = { "type": "Dialog", "props": { "width": 1000, "height": 650 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1000, "var": "img_bg", "skin": "bgs/ic_dialog_tip.png", "height": 650 }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 929, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 4 }, { "type": "Button", "props": { "y": 495, "x": 570, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_button_sure.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 5 }, { "type": "Button", "props": { "y": 495, "x": 215, "var": "btn_cancel", "stateNum": 1, "skin": "btns/ic_button_cancel.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 8 }, { "type": "TextArea", "props": { "y": 203, "x": 145, "wordWrap": true, "width": 717, "var": "txt_txt", "valign": "middle", "text": "TextArea", "height": 150, "fontSize": 30, "editable": false, "color": "#DFA562", "align": "center" }, "compId": 10 }], "loadList": ["bgs/ic_dialog_tip.png", "btns/ic_close.png", "btns/ic_button_sure.png", "btns/ic_button_cancel.png"], "loadList3D": [] };
        return AlertUI;
    }(Dialog));
    ui.AlertUI = AlertUI;
    REG("ui.AlertUI", AlertUI);
    var BankUI = /** @class */ (function (_super) {
        __extends(BankUI, _super);
        function BankUI() {
            return _super.call(this) || this;
        }
        BankUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(BankUI.uiView);
        };
        BankUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "loadList": [], "loadList3D": [] };
        return BankUI;
    }(View));
    ui.BankUI = BankUI;
    REG("ui.BankUI", BankUI);
    var ChongZhiHistroyUI = /** @class */ (function (_super) {
        __extends(ChongZhiHistroyUI, _super);
        function ChongZhiHistroyUI() {
            return _super.call(this) || this;
        }
        ChongZhiHistroyUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ChongZhiHistroyUI.uiView);
        };
        ChongZhiHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1097, "height": 664 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 19 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_deposit_record_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 20 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 21 }] }, { "type": "List", "props": { "y": 170, "x": 39, "width": 1034, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 15, "repeatX": 1, "height": 449 }, "compId": 9, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "width": 255, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 14 }, { "type": "Label", "props": { "y": 5, "x": 259, "width": 258, "text": "123456", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 15 }, { "type": "Label", "props": { "y": 5, "x": 523, "width": 257, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 16 }, { "type": "Label", "props": { "y": 7, "x": 786, "width": 235, "text": "123456", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 35 }] }] }, { "type": "Label", "props": { "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 12, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 17 }] }, { "type": "Box", "props": { "y": 130, "x": 35, "width": 1043, "height": 500 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 0, "x": 4, "width": 258, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 7, "text": "全部时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 7 }] }, { "type": "Image", "props": { "y": 0, "x": 264, "width": 258, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 25, "child": [{ "type": "Label", "props": { "y": 7, "text": "全部类型", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 26 }] }, { "type": "Image", "props": { "y": 0, "x": 525, "width": 258, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 7, "text": "全部状态", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 30 }] }, { "type": "Image", "props": { "y": 0, "x": 785, "width": 258, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 31, "child": [{ "type": "Label", "props": { "y": 7, "text": "金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 32 }] }] }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_deposit_record_title.png", "btns/ic_close.png", "comp/vscroll.png", "comp/bg_data_null.png", "comp/list_title.png"], "loadList3D": [] };
        return ChongZhiHistroyUI;
    }(Dialog));
    ui.ChongZhiHistroyUI = ChongZhiHistroyUI;
    REG("ui.ChongZhiHistroyUI", ChongZhiHistroyUI);
    var ChongZhiUiUI = /** @class */ (function (_super) {
        __extends(ChongZhiUiUI, _super);
        function ChongZhiUiUI() {
            return _super.call(this) || this;
        }
        ChongZhiUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ChongZhiUiUI.uiView);
        };
        ChongZhiUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 179 }, { "type": "Image", "props": { "top": 0, "skin": "comp/dactivity_nav_left.png", "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "y": 120, "x": 0, "width": 283, "var": "b_left", "top": 120, "left": 0, "height": 600 }, "compId": 144, "child": [{ "type": "List", "props": { "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "top": 0, "spaceY": 5, "right": 0, "left": 0, "bottom": 0 }, "compId": 146, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 147, "child": [{ "type": "Image", "props": { "x": 0, "width": 283, "skin": "bgs/ic_charge_unchose.png", "name": "bg_normal", "height": 86 }, "compId": 148 }, { "type": "Image", "props": { "width": 283, "skin": "bgs/ic_charge_chose.png", "name": "bg_selected", "height": 86 }, "compId": 149 }, { "type": "Image", "props": { "x": 16, "width": 50, "skin": "icons/nfc_icon.png", "name": "img_type", "height": 50, "centerY": 0 }, "compId": 150 }, { "type": "Label", "props": { "y": 30, "x": 89, "width": 189, "text": "label", "name": "txt_label", "height": 26, "fontSize": 26 }, "compId": 152 }, { "type": "Image", "props": { "y": 5.5, "x": 223, "skin": "icons/ic_charge_discount.png", "scaleY": 0.5, "scaleX": 0.5, "name": "img_yh" }, "compId": 153 }] }] }] }, { "type": "Box", "props": { "y": 0, "var": "b_title", "right": 0, "mouseThrough": true, "left": 0, "height": 120 }, "compId": 4, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 5 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 6 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_recharge_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 7 }, { "type": "Image", "props": { "skin": "bgs/ic_recharge_account.png", "scaleY": 0.8, "scaleX": 0.8, "centerY": 2, "centerX": 88 }, "compId": 8 }, { "type": "Button", "props": { "y": 60, "x": 959, "var": "btn_refresh", "stateNum": 1, "skin": "btns/btn_refresh.png", "right": 292, "centerY": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }, { "type": "Label", "props": { "y": 46, "x": 655, "width": 238, "var": "txt_money", "text": "0.0", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 11 }] }, { "type": "Box", "props": { "y": 122, "var": "b_zf", "right": 5, "left": 298, "height": 598 }, "compId": 136, "child": [{ "type": "Cz_xx_chooseMoney", "props": { "runtime": "ui.Cz_xx_chooseMoneyUI" }, "compId": 190 }] }, { "type": "Box", "props": { "var": "b_erweima", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 182, "child": [{ "type": "Cz_xx_ewm", "props": { "centerX": 0, "runtime": "ui.Cz_xx_ewmUI" }, "compId": 188 }] }, { "type": "Box", "props": { "var": "b_banklist", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 39, "x": 60, "skin": "icons/ic_dot.png" }, "compId": 20 }, { "type": "Label", "props": { "y": 38, "x": 92, "text": "充值收款银行选择", "fontSize": 22, "color": "#d6c09a" }, "compId": 21 }, { "type": "List", "props": { "y": 83, "var": "list_banklist", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "right": 5, "left": 10, "height": 446 }, "compId": 130, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 131, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_member_find_bg.png", "sizeGrid": "16,24,13,24", "right": 0, "left": 0, "height": 144 }, "compId": 132 }, { "type": "Image", "props": { "y": 25, "x": 50, "width": 70, "skin": "icons/bankIcon.png", "sizeGrid": "30,34,26,34", "name": "img_bank", "height": 70 }, "compId": 22 }, { "type": "Label", "props": { "y": 25, "x": 148, "text": "网银、手机网页庄站通道送2%", "name": "txt_info", "fontSize": 30, "color": "#ffffff", "bold": true }, "compId": 133 }, { "type": "Label", "props": { "y": 79, "x": 148, "text": "2123156465464564.", "name": "txt_id", "fontSize": 30, "color": "#ffffff", "bold": true }, "compId": 134 }, { "type": "Button", "props": { "y": 40, "x": 766, "stateNum": 1, "skin": "btns/ic_to_recharge.png", "scaleY": 0.5, "scaleX": 0.5, "name": "btn_ok" }, "compId": 135 }] }] }] }, { "type": "Box", "props": { "var": "b_input", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 26, "child": [{ "type": "Cz_xx_Bank", "props": { "centerX": 0, "runtime": "ui.Cz_xx_BankUI" }, "compId": 189 }] }, { "type": "Box", "props": { "var": "b_xs", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 192, "child": [{ "type": "Cz_xs", "props": { "runtime": "ui.Cz_xsUI" }, "compId": 193 }] }], "animations": [{ "nodes": [{ "target": 10, "keyframes": { "x": [{ "value": 959, "tweenMethod": "linearNone", "tween": true, "target": 10, "key": "x", "index": 0 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 10, "key": "rotation", "index": 0 }, { "value": 180, "tweenMethod": "linearNone", "tween": true, "target": 10, "key": "rotation", "index": 20 }, { "value": 360, "tweenMethod": "linearNone", "tween": true, "target": 10, "key": "rotation", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["bgs/ic_recharge_bg.png", "comp/dactivity_nav_left.png", "comp/vscroll.png", "bgs/ic_charge_unchose.png", "bgs/ic_charge_chose.png", "icons/nfc_icon.png", "icons/ic_charge_discount.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_recharge_title.png", "bgs/ic_recharge_account.png", "btns/btn_refresh.png", "icons/ic_dot.png", "bgs/ic_member_find_bg.png", "icons/bankIcon.png", "btns/ic_to_recharge.png"], "loadList3D": [] };
        return ChongZhiUiUI;
    }(View));
    ui.ChongZhiUiUI = ChongZhiUiUI;
    REG("ui.ChongZhiUiUI", ChongZhiUiUI);
    var Cz_xsUI = /** @class */ (function (_super) {
        __extends(Cz_xsUI, _super);
        function Cz_xsUI() {
            return _super.call(this) || this;
        }
        Cz_xsUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(Cz_xsUI.uiView);
        };
        Cz_xsUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 524, "x": 0, "width": 966, "skin": "bgs/xm_bg2.png", "scaleY": -1, "height": 524 }, "compId": 4 }, { "type": "Label", "props": { "y": 95, "x": 32, "text": "请选择您所使用的银行", "fontSize": 24, "color": "#ffffff" }, "compId": 3 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 964, "var": "list_2", "spaceX": 10, "repeatY": 1, "height": 61 }, "compId": 5, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 10, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao2.png", "name": "bg_normal" }, "compId": 11 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao.png", "name": "bg_selected" }, "compId": 12 }, { "type": "Label", "props": { "y": 6, "x": 0, "width": 176, "text": "微信", "name": "txt_label", "height": 28, "fontSize": 24, "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 36, "x": 0, "width": 176, "text": "微信", "name": "txt_info", "height": 20, "fontSize": 22, "align": "center" }, "compId": 14 }] }] }, { "type": "Image", "props": { "y": 369, "width": 970, "skin": "bgs/ic_safe_yue_bg.png", "sizeGrid": "19,15,36,13", "right": 5, "left": 0, "height": 111 }, "compId": 7, "child": [{ "type": "Label", "props": { "y": 28, "x": 32, "text": "充值金额", "fontSize": 36, "color": "#ffffff", "bold": true }, "compId": 19 }, { "type": "Image", "props": { "y": 20, "x": 246, "width": 479, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 60 }, "compId": 20, "child": [{ "type": "TextInput", "props": { "y": 12, "x": 11, "width": 456, "var": "txt_oldPwd", "type": "number", "prompt": "存款金额必须在1~10000之间", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 21 }] }, { "type": "Button", "props": { "y": 20, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_clear_bg.png", "scaleY": 0.6, "scaleX": 0.6, "right": 50 }, "compId": 22 }] }, { "type": "Button", "props": { "y": 0, "x": 0, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_commit_charge.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 0, "bottom": 10 }, "compId": 8 }, { "type": "List", "props": { "y": 168, "x": 32, "width": 843, "var": "list_1", "spaceX": 10, "repeatY": 1, "height": 51 }, "compId": 27, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 28, "child": [{ "type": "Image", "props": { "y": 0, "x": 31, "width": 155, "skin": "icons/CCB.jpg", "name": "img_icon", "height": 40 }, "compId": 29 }, { "type": "Image", "props": { "y": 6.5, "x": 0, "skin": "comp/radio_unchose.png", "name": "img_choose" }, "compId": 30 }] }] }], "loadList": ["bgs/xm_bg2.png", "comp/ddeposit_chonzhizhifubaotongdao2.png", "comp/ddeposit_chonzhizhifubaotongdao.png", "bgs/ic_safe_yue_bg.png", "comp/big_input_box.png", "btns/ic_clear_bg.png", "btns/ic_commit_charge.png", "icons/CCB.jpg", "comp/radio_unchose.png"], "loadList3D": [] };
        return Cz_xsUI;
    }(View));
    ui.Cz_xsUI = Cz_xsUI;
    REG("ui.Cz_xsUI", Cz_xsUI);
    var Cz_xx_BankUI = /** @class */ (function (_super) {
        __extends(Cz_xx_BankUI, _super);
        function Cz_xx_BankUI() {
            return _super.call(this) || this;
        }
        Cz_xx_BankUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(Cz_xx_BankUI.uiView);
        };
        Cz_xx_BankUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 20, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "left": 10 }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款银行", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 17 }] }, { "type": "Image", "props": { "y": 20, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "right": 10 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款信息", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 18 }] }, { "type": "Label", "props": { "y": 133, "x": 32, "text": "收款银行", "fontSize": 24, "color": "#a0a0a0" }, "compId": 5, "child": [{ "type": "Label", "props": { "y": 0, "x": 102, "width": 212, "var": "txt_bankName", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 19 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 20, "child": [{ "type": "Line", "props": { "y": 1, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 21 }] }, { "type": "Button", "props": { "y": -6, "x": 358, "var": "btn_copy1", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 22 }] }, { "type": "Label", "props": { "y": 209, "x": 32, "width": 98, "text": "收款人", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "center" }, "compId": 6, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_name", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 23 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 24, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 25 }] }, { "type": "Button", "props": { "y": -3, "x": 360, "var": "btn_copy2", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 26 }] }, { "type": "Label", "props": { "y": 283, "x": 32, "text": "收款账号", "fontSize": 24, "color": "#a0a0a0" }, "compId": 7, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_zh", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 27 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 28, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 29 }] }, { "type": "Button", "props": { "y": 0, "x": 356, "var": "btn_copy3", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 30 }] }, { "type": "Label", "props": { "y": 493, "x": 26, "text": "第一步:复制收款银行前往充值", "height": 24, "fontSize": 20, "color": "#919196", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 138, "x": 543, "text": "存款金额", "fontSize": 24, "color": "#a0a0a0" }, "compId": 10 }, { "type": "Image", "props": { "y": 126, "x": 654, "width": 302, "skin": "comp/ic_input_bg.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 11, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 279, "var": "txt_ckje", "type": "number", "prompt": "支付限额10-100000元", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 35 }] }, { "type": "Label", "props": { "y": 224, "x": 519, "text": "汇款人姓名", "fontSize": 24, "color": "#a0a0a0" }, "compId": 12 }, { "type": "Image", "props": { "y": 212, "x": 654, "width": 302, "skin": "comp/ic_input_bg.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 13, "child": [{ "type": "TextInput", "props": { "y": 6, "x": 8, "width": 294, "var": "txt_ckrxm", "type": "text", "prompt": "请输入汇款人姓名", "height": 36, "fontSize": 20, "color": "#d6c09a" }, "compId": 36 }] }, { "type": "Label", "props": { "y": 487, "x": 530, "text": "第二步:充值完成，填写您的存款信息.最后提交充值", "height": 24, "fontSize": 20, "color": "#919196", "align": "center" }, "compId": 14 }, { "type": "Button", "props": { "y": 520, "x": 83, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 15 }, { "type": "Button", "props": { "y": 518, "x": 675, "var": "btn_tjcz", "stateNum": 1, "skin": "btns/ic_go.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 16 }, { "type": "Label", "props": { "y": 288, "x": 685, "text": "--提示--", "fontSize": 24, "color": "#919196" }, "compId": 38 }, { "type": "Label", "props": { "y": 324.5, "x": 519, "wordWrap": true, "width": 440, "text": "以上银行账户限本次存款使用,账户不定期更换每次存款前请依照本页面所显示的银行账户入款,如入款至已过期账户,无法查收，本公司恕不负责", "height": 113, "fontSize": 22, "color": "#919196" }, "compId": 39 }], "loadList": ["bgs/ddeposit_chonzhishoukuanbg.png", "btns/ic_copy2.png", "comp/ic_input_bg.png", "btns/ic_return_back.png", "btns/ic_go.png"], "loadList3D": [] };
        return Cz_xx_BankUI;
    }(View));
    ui.Cz_xx_BankUI = Cz_xx_BankUI;
    REG("ui.Cz_xx_BankUI", Cz_xx_BankUI);
    var Cz_xx_chooseMoneyUI = /** @class */ (function (_super) {
        __extends(Cz_xx_chooseMoneyUI, _super);
        function Cz_xx_chooseMoneyUI() {
            return _super.call(this) || this;
        }
        Cz_xx_chooseMoneyUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(Cz_xx_chooseMoneyUI.uiView);
        };
        Cz_xx_chooseMoneyUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Label", "props": { "y": 95, "x": 32, "text": "玩家常玩的充值金额", "fontSize": 24, "color": "#ffffff" }, "compId": 3 }, { "type": "Image", "props": { "y": 70, "x": 0, "width": 966, "skin": "bgs/ic_online_bg.png", "height": 524 }, "compId": 4 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 964, "var": "list_2", "spaceX": 10, "repeatY": 1, "height": 61 }, "compId": 5, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 10, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao2.png", "name": "bg_normal" }, "compId": 11 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao.png", "name": "bg_selected" }, "compId": 12 }, { "type": "Label", "props": { "y": 6, "x": 0, "width": 176, "text": "微信", "name": "txt_label", "height": 28, "fontSize": 24, "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 36, "x": 0, "width": 176, "text": "微信", "name": "txt_info", "height": 20, "fontSize": 22, "align": "center" }, "compId": 15 }] }] }, { "type": "List", "props": { "y": 138, "x": 0, "width": 957, "var": "list_3", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 20, "spaceX": 120, "right": 10, "left": 10, "height": 180 }, "compId": 6, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 138, "skin": "comp/ic_pc_grbb_tab.png", "sizeGrid": "15,15,15,15", "name": "bg_normal", "height": 55 }, "compId": 17 }, { "type": "Image", "props": { "width": 138, "skin": "comp/ic_pc_grbb_tab_pressed.png", "sizeGrid": "15,15,15,15", "name": "img_selected", "height": 55 }, "compId": 18 }, { "type": "Label", "props": { "y": 13, "x": 4, "width": 131, "text": "10000元", "name": "txt_value", "height": 26, "fontSize": 26, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 19 }] }] }, { "type": "Image", "props": { "y": 349, "width": 970, "skin": "bgs/ic_safe_yue_bg.png", "sizeGrid": "19,15,36,13", "right": 5, "left": 5, "height": 124 }, "compId": 7, "child": [{ "type": "Label", "props": { "y": 28, "x": 32, "text": "充值金额", "fontSize": 36, "color": "#ffffff", "bold": true }, "compId": 20 }, { "type": "Image", "props": { "y": 20, "x": 246, "width": 399, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 60 }, "compId": 21, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_oldPwd", "type": "number", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 20, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_clear_bg.png", "scaleY": 0.6, "scaleX": 0.6, "right": 50 }, "compId": 23 }] }, { "type": "Button", "props": { "y": 0, "x": 0, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_commit_charge.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 0, "bottom": 10 }, "compId": 8 }], "loadList": ["bgs/ic_online_bg.png", "comp/ddeposit_chonzhizhifubaotongdao2.png", "comp/ddeposit_chonzhizhifubaotongdao.png", "comp/vscroll.png", "comp/ic_pc_grbb_tab.png", "comp/ic_pc_grbb_tab_pressed.png", "bgs/ic_safe_yue_bg.png", "comp/big_input_box.png", "btns/ic_clear_bg.png", "btns/ic_commit_charge.png"], "loadList3D": [] };
        return Cz_xx_chooseMoneyUI;
    }(View));
    ui.Cz_xx_chooseMoneyUI = Cz_xx_chooseMoneyUI;
    REG("ui.Cz_xx_chooseMoneyUI", Cz_xx_chooseMoneyUI);
    var Cz_xx_ewmUI = /** @class */ (function (_super) {
        __extends(Cz_xx_ewmUI, _super);
        function Cz_xx_ewmUI() {
            return _super.call(this) || this;
        }
        Cz_xx_ewmUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(Cz_xx_ewmUI.uiView);
        };
        Cz_xx_ewmUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Box", "props": { "var": "s_bg", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 20, "x": 10, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "left": 10 }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款信息", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 18 }] }, { "type": "Image", "props": { "y": 20, "x": 508, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "right": 10 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 16, "x": 122, "width": 210, "text": "扫描二维码", "height": 28, "fontSize": 28, "color": "#3e2412", "bold": true, "align": "center" }, "compId": 19 }] }, { "type": "Label", "props": { "y": 137, "x": 15, "width": 115, "text": "收款人", "height": 22, "fontSize": 22, "color": "#a0a0a0", "align": "right" }, "compId": 5 }, { "type": "Image", "props": { "y": 164, "x": 150, "width": 285, "height": 2 }, "compId": 46, "child": [{ "type": "Line", "props": { "toY": 0, "toX": 295, "lineWidth": 3, "lineColor": "#b7b7b7" }, "compId": 48 }] }, { "type": "Label", "props": { "y": 226, "x": 15, "width": 115, "text": "存款金额", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "right" }, "compId": 7 }, { "type": "Image", "props": { "y": 251, "x": 150, "width": 285, "height": 2 }, "compId": 54, "child": [{ "type": "Line", "props": { "toY": 0, "toX": 295, "lineWidth": 3, "lineColor": "#b7b7b7" }, "compId": 55 }] }, { "type": "Label", "props": { "y": 474.5, "x": 25, "wordWrap": true, "width": 441, "var": "txt_tips0", "text": "第一步:保存付款二维码,支付宝扫码转账到指定支付宝账号。", "height": 49, "fontSize": 20, "color": "#919196", "align": "left" }, "compId": 56 }, { "type": "Label", "props": { "y": 437, "x": 25, "var": "txt_tip2", "text": "微信转账请备注成功到账时间", "fontSize": 20, "color": "#919196" }, "compId": 60 }, { "type": "Label", "props": { "y": 411, "x": 26, "text": "注:收款信息仅限本次使用！", "fontSize": 20, "color": "#919196" }, "compId": 61 }, { "type": "Label", "props": { "y": 524, "x": 26, "wordWrap": true, "width": 441, "visible": true, "var": "txt_cx", "text": "如何查询订单号:\\n1.打开支付宝，点击右下角\"我的\"。\\n2.进入\"账单\",点击对应的转账信息即可查询转账订单。", "height": 66, "fontSize": 16, "color": "#919196", "align": "left" }, "compId": 62 }, { "type": "Label", "props": { "y": 226, "x": 415, "width": 25, "text": "元", "height": 24, "fontSize": 24, "color": "#919196" }, "compId": 63 }] }, { "type": "Label", "props": { "y": 138, "x": 150, "width": 230, "var": "txt_bankName", "text": "1111", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 20 }, { "type": "Button", "props": { "y": 129, "x": 400, "var": "btn_copy1", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "Button", "props": { "y": 517, "x": 508, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 14 }, { "type": "Button", "props": { "y": 523, "x": 805.5, "var": "btn_tjcz", "stateNum": 1, "skin": "btns/transfered_money.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 15 }, { "type": "Label", "props": { "y": 221, "x": 150, "width": 258, "var": "txt_zh", "text": "1111", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 28 }, { "type": "Box", "props": { "y": 20, "width": 462, "right": 10, "height": 500 }, "compId": 66, "child": [{ "type": "Button", "props": { "y": 324, "var": "btn_save", "stateNum": 1, "skin": "btns/save_qr.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 4 }, "compId": 65 }, { "type": "Label", "props": { "y": 460, "width": 456, "text": "第二步:填写转账信息,点击我已转账。", "height": 24, "fontSize": 20, "color": "#919196", "centerX": 0, "align": "center" }, "compId": 67 }, { "type": "Label", "props": { "y": 366, "text": "--说明--", "fontSize": 24, "color": "#919196", "centerX": 0 }, "compId": 68 }, { "type": "Label", "props": { "y": 415, "wordWrap": true, "width": 440, "var": "txt_tips1", "text": "以上支付宝账号限本次存款使用,账户不定期更换!", "height": 28, "fontSize": 20, "color": "#919196", "centerX": 0 }, "compId": 69 }, { "type": "Image", "props": { "y": 69, "width": 200, "var": "img_ewm", "height": 200, "centerX": 0 }, "compId": 70 }, { "type": "Label", "props": { "y": 280, "width": 224, "text": "扫描二维码完成支付", "height": 24, "fontSize": 24, "color": "#919196", "centerX": 0, "align": "center" }, "compId": 71 }] }], "loadList": ["bgs/ddeposit_chonzhishoukuanbg.png", "btns/ic_copy2.png", "btns/ic_return_back.png", "btns/transfered_money.png", "btns/save_qr.png"], "loadList3D": [] };
        return Cz_xx_ewmUI;
    }(View));
    ui.Cz_xx_ewmUI = Cz_xx_ewmUI;
    REG("ui.Cz_xx_ewmUI", Cz_xx_ewmUI);
    var FanYongListUI = /** @class */ (function (_super) {
        __extends(FanYongListUI, _super);
        function FanYongListUI() {
            return _super.call(this) || this;
        }
        FanYongListUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(FanYongListUI.uiView);
        };
        FanYongListUI.uiView = { "type": "Dialog", "props": { "width": 1223, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1223, "skin": "bgs/moneychart.png", "height": 720 }, "compId": 3 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 812, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 13 }, { "type": "Image", "props": { "y": 130, "x": 410, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Label", "props": { "y": 137, "x": 18.5, "width": 379, "text": "代理级别", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 410, "width": 399, "text": "团队业绩/日", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 7 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1206, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 527 }, "compId": 8, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "width": 398, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 11 }, { "type": "Label", "props": { "y": 5, "x": 398, "width": 405, "text": "123456", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 12 }, { "type": "Label", "props": { "y": 5, "x": 808, "width": 397, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 15 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1146, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 9 }, { "type": "Label", "props": { "y": 137, "x": 813, "width": 399, "text": "返佣额度", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 14 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 20 }] }], "loadList": ["bgs/moneychart.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "btns/ic_close.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return FanYongListUI;
    }(Dialog));
    ui.FanYongListUI = FanYongListUI;
    REG("ui.FanYongListUI", FanYongListUI);
    var HallUiUI = /** @class */ (function (_super) {
        __extends(HallUiUI, _super);
        function HallUiUI() {
            return _super.call(this) || this;
        }
        HallUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(HallUiUI.uiView);
        };
        HallUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "img_bg", "top": 0, "skin": "bgs/catch_fish_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "var": "b_top", "top": 0, "right": 0, "left": 0 }, "compId": 5, "child": [{ "type": "Image", "props": { "skin": "bgs/dindex_header.png", "right": 0, "left": 0 }, "compId": 6 }, { "type": "Label", "props": { "y": 39, "x": 113, "width": 220, "var": "txt_name", "text": "label", "height": 24, "fontSize": 24, "color": "#f9f9f9", "align": "center" }, "compId": 9 }, { "type": "Button", "props": { "y": 32, "x": 1120, "var": "btn_set", "stateNum": 1, "skin": "btns/dindex_index_set.png", "right": 60 }, "compId": 17 }, { "type": "Image", "props": { "y": 24, "var": "img_web", "skin": "bgs/ic_website_ky.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 243 }, "compId": 33 }, { "type": "Box", "props": { "y": 5, "var": "b_money", "centerX": -100 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 19, "x": 22, "width": 351, "skin": "comp/db7_room.png", "sizeGrid": "7,7,7,7", "scaleY": 0.8, "scaleX": 0.8, "height": 39 }, "compId": 10 }, { "type": "Image", "props": { "y": 4.5, "x": 0, "width": 50, "skin": "icons/ic_golden.png", "height": 50 }, "compId": 18 }, { "type": "Label", "props": { "y": 22, "x": 51, "width": 249, "var": "txt_money", "text": "0.00", "height": 24, "fontSize": 24, "color": "#f8f1f1", "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 35, "x": 307, "width": 50, "var": "btn_reload", "stateNum": 1, "skin": "btns/dindex_reload.png", "pivotY": 25, "pivotX": 25, "height": 50 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 17, "x": 44 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": -11, "x": -1, "width": 98, "skin": "comp/img_touxiangMask.png", "sizeGrid": "45,48,51,52", "renderType": "mask", "height": 83 }, "compId": 50 }, { "type": "Image", "props": { "y": -4, "x": 12, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 7 }] }, { "type": "Box", "props": { "y": 2, "x": 135.5, "var": "b_unlogin" }, "compId": 52, "child": [{ "type": "Button", "props": { "y": 30, "x": 0.5, "var": "btn_login", "stateNum": 1, "skin": "btns/ic_login.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 53 }, { "type": "Button", "props": { "y": 29, "x": 88, "var": "btn_register", "stateNum": 1, "skin": "btns/ic_register.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 54 }, { "type": "Label", "props": { "y": 0, "x": 0, "text": "未登录", "fontSize": 26, "color": "#FFFFFF", "bold": true }, "compId": 55 }] }] }, { "type": "Panel", "props": { "var": "p_game", "right": 30, "left": 350, "height": 444, "hScrollBarSkin": "comp/hscroll.png", "centerY": 10 }, "compId": 26, "child": [{ "type": "Box", "props": {}, "compId": 66 }] }, { "type": "Box", "props": { "width": 315, "var": "b_left", "left": 15, "height": 492, "centerY": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_left.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 20 }, { "type": "Panel", "props": { "var": "p_menu", "vScrollBarSkin": "comp/vscroll.png", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 21 }, { "type": "List", "props": { "y": 42, "x": 0, "width": 316, "var": "list_tab", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 2, "height": 446 }, "compId": 56, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 57, "child": [{ "type": "Image", "props": { "width": 316, "skin": "btns/ic_hot_game.png", "name": "bg_normal", "height": 86 }, "compId": 58 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 316, "skin": "btns/ic_hot_game_pressed.png", "name": "bg_selected", "height": 86 }, "compId": 59 }] }] }] }, { "type": "Box", "props": { "y": 114, "x": 357.5, "var": "b_pmd" }, "compId": 27, "child": [{ "type": "Image", "props": { "y": 0, "x": 36, "width": 849, "var": "img_pmd", "skin": "comp/laba_bg.png", "height": 34 }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 3, "text": "跑马灯信息", "overflow": "visible", "name": "txt_label", "fontSize": 24, "color": "#f4f4f4" }, "compId": 30 }] }] }, { "type": "Box", "props": { "var": "b_bottom", "right": 0, "left": 0, "height": 107, "bottom": 0 }, "compId": 31, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_home_bottom.png", "right": 0, "left": 0, "height": 100 }, "compId": 32 }, { "type": "Box", "props": { "width": 1280, "centerX": 0 }, "compId": 72, "child": [{ "type": "Button", "props": { "y": 18, "x": 15, "var": "btn_tg", "stateNum": 1, "skin": "btns/ic_promotion.png", "scaleY": 0.5, "scaleX": 0.5, "left": 15, "centerY": 0 }, "compId": 34 }, { "type": "Button", "props": { "y": 11, "x": 933, "var": "btn_tixian", "stateNum": 1, "skin": "btns/ic_withdrawal.png", "scaleY": 0.5, "scaleX": 0.5, "right": 185, "centerY": 1 }, "compId": 39 }, { "type": "Button", "props": { "y": 9, "x": 1108, "var": "btn_cz", "stateNum": 1, "skin": "btns/ic_recharge.png", "scaleY": 0.5, "scaleX": 0.5, "right": 10, "centerY": 0 }, "compId": 40 }, { "type": "HBox", "props": { "y": 16, "x": 236, "right": 370, "left": 236, "align": "none" }, "compId": 62, "child": [{ "type": "Button", "props": { "var": "btn_huodong", "stateNum": 1, "skin": "btns/ic_activity.png", "scaleY": 0.7, "scaleX": 0.7, "left": 0 }, "compId": 35 }, { "type": "Button", "props": { "var": "btn_xm", "stateNum": 1, "skin": "btns/ic_shuffle.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 1, "centerX": -98 }, "compId": 38 }, { "type": "Button", "props": { "var": "btn_mail", "stateNum": 1, "skin": "btns/ic_message.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 1, "centerX": 102 }, "compId": 36 }, { "type": "Button", "props": { "y": 0, "var": "btn_kf", "stateNum": 1, "skin": "btns/ic_customer_service.png", "scaleY": 0.7, "scaleX": 0.7, "right": 0 }, "compId": 37 }] }] }] }], "animations": [{ "nodes": [{ "target": 14, "keyframes": { "x": [{ "value": 307, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "x", "index": 0 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "rotation", "index": 0 }, { "value": 180, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "rotation", "index": 20 }, { "value": 360, "tweenMethod": "linearNone", "tween": true, "target": 14, "key": "rotation", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["bgs/catch_fish_bg.png", "bgs/dindex_header.png", "btns/dindex_index_set.png", "bgs/ic_website_ky.png", "comp/db7_room.png", "icons/ic_golden.png", "btns/dindex_reload.png", "comp/img_touxiangMask.png", "comp/dindex_index_icon.png", "btns/ic_login.png", "btns/ic_register.png", "comp/hscroll.png", "bgs/ic_home_left.png", "comp/vscroll.png", "btns/ic_hot_game.png", "btns/ic_hot_game_pressed.png", "comp/laba_bg.png", "bgs/ic_home_bottom.png", "btns/ic_promotion.png", "btns/ic_withdrawal.png", "btns/ic_recharge.png", "btns/ic_activity.png", "btns/ic_shuffle.png", "btns/ic_message.png", "btns/ic_customer_service.png"], "loadList3D": [] };
        return HallUiUI;
    }(View));
    ui.HallUiUI = HallUiUI;
    REG("ui.HallUiUI", HallUiUI);
    var HuoDongUiUI = /** @class */ (function (_super) {
        __extends(HuoDongUiUI, _super);
        function HuoDongUiUI() {
            return _super.call(this) || this;
        }
        HuoDongUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(HuoDongUiUI.uiView);
        };
        HuoDongUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b_bg" }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png", "height": 722 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 25, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 26 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 27 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_act_title.png", "centerY": 0 }, "compId": 28 }] }, { "type": "List", "props": { "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 590 }, "compId": 33, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 34, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/hd_tab0_1.png", "name": "bg_normal", "height": 96 }, "compId": 35 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/hd_tab0_2.png", "name": "bg_selected", "height": 96 }, "compId": 36 }] }] }, { "type": "Box", "props": { "y": 123, "width": 963, "height": 597, "centerX": 150 }, "compId": 38, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/hd_bg1.png" }, "compId": 39 }, { "type": "List", "props": { "y": 6, "x": 6, "width": 941, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 564 }, "compId": 17, "child": [{ "type": "Box", "props": { "y": 0, "width": 941, "right": 0, "renderType": "render", "left": 0, "height": 152 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 920, "name": "img_hd", "height": 150 }, "compId": 16 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无活动", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 47, "child": [{ "type": "Image", "props": { "y": -141, "skin": "comp/bg_data_null.png", "centerX": 0 }, "compId": 48 }] }] }, { "type": "Box", "props": { "y": 123, "width": 963, "var": "b_info", "height": 597, "centerX": 150 }, "compId": 40, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/hd_bg1.png" }, "compId": 43 }, { "type": "Image", "props": { "y": 8, "x": 14, "width": 920, "var": "img_hd", "height": 140 }, "compId": 41 }, { "type": "Image", "props": { "y": 158, "x": 14, "skin": "bgs/hd_bg2.png" }, "compId": 42 }, { "type": "TextArea", "props": { "y": 171, "x": 24, "width": 901, "var": "txt_info", "text": "TextArea", "height": 336, "fontSize": 24, "color": "#A1A1A1" }, "compId": 44 }, { "type": "Button", "props": { "y": 507, "var": "btn_sqhd", "stateNum": 1, "skin": "btns/hd_sqhd.png", "centerX": 0 }, "compId": 45 }, { "type": "Label", "props": { "y": 518, "x": 684, "var": "btn_fhlb", "underline": true, "text": "返回列表", "fontSize": 24, "color": "#A1A1A1" }, "compId": 46 }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_act_title.png", "btns/hd_tab0_1.png", "btns/hd_tab0_2.png", "bgs/hd_bg1.png", "comp/vscroll.png", "comp/bg_data_null.png", "bgs/hd_bg2.png", "btns/hd_sqhd.png"], "loadList3D": [] };
        return HuoDongUiUI;
    }(View));
    ui.HuoDongUiUI = HuoDongUiUI;
    REG("ui.HuoDongUiUI", HuoDongUiUI);
    var KeFuUiUI = /** @class */ (function (_super) {
        __extends(KeFuUiUI, _super);
        function KeFuUiUI() {
            return _super.call(this) || this;
        }
        KeFuUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(KeFuUiUI.uiView);
        };
        KeFuUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dactivity_nav_left.png", "left": 0 }, "compId": 14 }, { "type": "Box", "props": { "y": 164, "x": 332, "width": 872, "var": "b_kf" }, "compId": 17, "child": [{ "type": "Image", "props": { "y": 32, "x": 11, "width": 246, "var": "b_zx", "skin": "bgs/kf_bg.png" }, "compId": 39, "child": [{ "type": "Button", "props": { "y": 356, "x": 8, "var": "btn_zx", "stateNum": 1, "skin": "btns/kf_zx.png" }, "compId": 40 }, { "type": "Image", "props": { "y": 30, "skin": "bgs/kf_icon1.png", "centerX": 0 }, "compId": 41 }] }, { "type": "Image", "props": { "y": 32, "x": 324, "width": 246, "var": "b_qq", "skin": "bgs/kf_bg.png" }, "compId": 42, "child": [{ "type": "Button", "props": { "y": 356, "x": 8, "var": "btn_qq", "stateNum": 1, "skin": "btns/kf_zx.png" }, "compId": 43 }, { "type": "Image", "props": { "y": 30, "skin": "bgs/kf_icon2.png", "centerX": 0 }, "compId": 44 }] }, { "type": "Image", "props": { "y": 32, "x": 637, "width": 246, "var": "b_wx", "skin": "bgs/kf_bg.png" }, "compId": 45, "child": [{ "type": "Button", "props": { "y": 356, "x": 8, "var": "btn_wx", "stateNum": 1, "skin": "btns/kf_zx.png" }, "compId": 46 }, { "type": "Image", "props": { "y": 30, "skin": "bgs/kf_icon3.png", "centerX": 0 }, "compId": 47 }] }] }, { "type": "Box", "props": { "var": "b_wt", "top": 125, "left": 300 }, "compId": 19 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 24, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 25 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 26 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_cus_title.png", "centerY": 0 }, "compId": 27 }] }, { "type": "List", "props": { "width": 295, "var": "list_tab", "top": 125, "spaceY": 3, "repeatY": 2, "repeatX": 1, "left": 0, "height": 537 }, "compId": 29, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 30, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_cus_fqc.png", "name": "bg_normal", "height": 96 }, "compId": 31 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_cus_fqc_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 32 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/kf_bg.png", "btns/kf_zx.png", "bgs/kf_icon1.png", "bgs/kf_icon2.png", "bgs/kf_icon3.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_cus_title.png", "btns/ic_cus_fqc.png", "btns/ic_cus_fqc_pressed.png"], "loadList3D": [] };
        return KeFuUiUI;
    }(View));
    ui.KeFuUiUI = KeFuUiUI;
    REG("ui.KeFuUiUI", KeFuUiUI);
    var LingQuHistroyUI = /** @class */ (function (_super) {
        __extends(LingQuHistroyUI, _super);
        function LingQuHistroyUI() {
            return _super.call(this) || this;
        }
        LingQuHistroyUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(LingQuHistroyUI.uiView);
        };
        LingQuHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1097, "skin": "bgs/bg_get_history.png", "height": 675 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 536, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 548, "width": 536, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 8 }, { "type": "Label", "props": { "y": 135, "x": 33, "width": 488, "text": "时间", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 134, "x": 565, "width": 499, "text": "金额", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 10 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1078, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 460 }, "compId": 11, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 12, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 534, "text": "20171212", "name": "txt_time", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 3, "x": 541, "width": 534, "text": "123456", "name": "txt_money", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 14 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1006, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 15 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 19 }] }], "loadList": ["bgs/bg_get_history.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "btns/ic_close.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return LingQuHistroyUI;
    }(Dialog));
    ui.LingQuHistroyUI = LingQuHistroyUI;
    REG("ui.LingQuHistroyUI", LingQuHistroyUI);
    var LingQuYongJinUI = /** @class */ (function (_super) {
        __extends(LingQuYongJinUI, _super);
        function LingQuYongJinUI() {
            return _super.call(this) || this;
        }
        LingQuYongJinUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(LingQuYongJinUI.uiView);
        };
        LingQuYongJinUI.uiView = { "type": "Dialog", "props": { "width": 1090, "height": 660 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 21, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 22 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_get_glob_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 23 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 24 }] }, { "type": "Label", "props": { "y": 172, "x": 105, "text": "可转出的佣金:", "fontSize": 28, "color": "#6b6b6b" }, "compId": 4 }, { "type": "Label", "props": { "y": 172, "x": 641, "text": "账号余额:", "fontSize": 28, "color": "#6b6b6b" }, "compId": 5 }, { "type": "Label", "props": { "y": 172, "x": 280.779296875, "var": "txt_money1", "text": "0.0元", "fontSize": 28, "color": "#ffff00" }, "compId": 6 }, { "type": "Label", "props": { "y": 172, "x": 760.779296875, "var": "txt_money2", "text": "0.0元", "fontSize": 28, "color": "#ffff00" }, "compId": 7 }, { "type": "Image", "props": { "y": 224, "x": 78, "width": 947, "skin": "bgs/bg.png", "sizeGrid": "17,16,19,14", "height": 179 }, "compId": 10 }, { "type": "Button", "props": { "y": 498, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_btn_confirm_out.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 11 }, { "type": "Label", "props": { "y": 250, "x": 125, "text": "转出佣金金额:", "fontSize": 28, "color": "#797979" }, "compId": 12 }, { "type": "Label", "props": { "y": 300, "x": 119, "text": "￥", "fontSize": 40, "bold": true }, "compId": 13 }, { "type": "TextInput", "props": { "y": 305, "x": 159, "width": 246, "var": "txt_input", "prompt": "请输入要提现的金额", "height": 40, "fontSize": 24 }, "compId": 15 }, { "type": "Image", "props": { "y": 292, "x": 824.703125, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 50 }, "compId": 16 }, { "type": "Label", "props": { "y": 298, "x": 854, "width": 135, "var": "btn_all", "text": "全部转出", "height": 38, "fontSize": 30, "bold": true }, "compId": 17 }, { "type": "Image", "props": { "y": 372, "x": 105, "width": 873, "skin": "bgs/ic_line.png", "height": 1 }, "compId": 18 }, { "type": "Label", "props": { "y": 414, "x": 66, "text": "提示:转出后立即到账,如未到账立即联系客服人员。", "fontSize": 24, "color": "#ffffff" }, "compId": 19 }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_get_glob_title.png", "btns/ic_close.png", "bgs/bg.png", "btns/ic_btn_confirm_out.png", "comp/dpersonalcenter_gerenzhonxinline2.png", "bgs/ic_line.png"], "loadList3D": [] };
        return LingQuYongJinUI;
    }(Dialog));
    ui.LingQuYongJinUI = LingQuYongJinUI;
    REG("ui.LingQuYongJinUI", LingQuYongJinUI);
    var LoginUiUI = /** @class */ (function (_super) {
        __extends(LoginUiUI, _super);
        function LoginUiUI() {
            return _super.call(this) || this;
        }
        LoginUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(LoginUiUI.uiView);
        };
        LoginUiUI.uiView = { "type": "Dialog", "props": { "width": 1097, "height": 644 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 19 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_login_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 20 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 21 }] }, { "type": "Button", "props": { "y": 440, "var": "btn_login", "stateNum": 1, "skin": "btns/ic_login_button.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 5 }, { "type": "Label", "props": { "y": 232, "x": 210, "text": "账号", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 6 }, { "type": "Image", "props": { "y": 223, "x": 345, "width": 545, "skin": "comp/ic_input_bg.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 7, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入您的账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 14 }] }, { "type": "Label", "props": { "y": 332, "x": 210, "text": "密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 8 }, { "type": "Image", "props": { "y": 323, "x": 345, "width": 545, "skin": "comp/ic_input_bg.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 9, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_pwd", "type": "password", "prompt": "请输入您的密码", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 15 }] }, { "type": "Label", "props": { "y": 475, "x": 717, "text": "没有账号，", "fontSize": 26, "color": "#868686" }, "compId": 23 }, { "type": "Label", "props": { "y": 475, "x": 845, "var": "btn_zc", "underline": true, "text": "立即注册", "fontSize": 26, "color": "#988f7e" }, "compId": 24 }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_login_title.png", "btns/ic_close.png", "btns/ic_login_button.png", "comp/ic_input_bg.png"], "loadList3D": [] };
        return LoginUiUI;
    }(Dialog));
    ui.LoginUiUI = LoginUiUI;
    REG("ui.LoginUiUI", LoginUiUI);
    var MailUI = /** @class */ (function (_super) {
        __extends(MailUI, _super);
        function MailUI() {
            return _super.call(this) || this;
        }
        MailUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(MailUI.uiView);
        };
        MailUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 17 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_main_message_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 18 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 19 }] }, { "type": "List", "props": { "y": 139, "x": 45, "width": 1028, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 466 }, "compId": 5, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_message_list_bg.png", "sizeGrid": "30,30,30,30", "right": 0, "left": 0, "height": 119 }, "compId": 7 }, { "type": "Label", "props": { "y": 12, "x": 18, "text": "邮件名", "name": "txt_name", "fontSize": 24, "color": "#FFFFFF" }, "compId": 8 }, { "type": "Label", "props": { "y": 47, "x": 18, "text": "邮件title", "name": "txt_title", "fontSize": 24, "color": "#FFFFFF" }, "compId": 9 }, { "type": "Label", "props": { "y": 82, "x": 18, "width": 817, "text": "邮件内容", "name": "txt_info", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 10 }, { "type": "Label", "props": { "y": 12, "width": 369, "text": "2012/12/12 12:12:00", "right": 0, "name": "txt_time", "height": 24, "fontSize": 22, "color": "#FFFFFF", "align": "right" }, "compId": 11 }, { "type": "Button", "props": { "y": 53.5, "x": 854.5, "stateNum": 1, "skin": "btns/ic_detail.png", "scaleY": 1, "scaleX": 1, "name": "btn_check" }, "compId": 12 }] }] }, { "type": "Box", "props": { "y": 276, "width": 158, "var": "txt_tips1", "height": 128, "centerX": 0 }, "compId": 22, "child": [{ "type": "Label", "props": { "y": 146, "text": "暂无数据", "fontSize": 28, "color": "#F8F8F8", "centerX": 0, "alpha": 0.43 }, "compId": 20 }, { "type": "Image", "props": { "skin": "comp/bg_data_null.png" }, "compId": 21 }] }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_main_message_title.png", "btns/ic_close.png", "comp/vscroll.png", "bgs/ic_message_list_bg.png", "btns/ic_detail.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return MailUI;
    }(Dialog));
    ui.MailUI = MailUI;
    REG("ui.MailUI", MailUI);
    var MailInfoUI = /** @class */ (function (_super) {
        __extends(MailInfoUI, _super);
        function MailInfoUI() {
            return _super.call(this) || this;
        }
        MailInfoUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(MailInfoUI.uiView);
        };
        MailInfoUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "bgs/message_detail.png", "scaleY": 0.67, "scaleX": 0.67 }, "compId": 3 }, { "type": "TextArea", "props": { "y": 129, "x": 16, "width": 1070, "var": "txt_info", "text": "TextArea", "height": 510, "fontSize": 24, "color": "#FFFFFF" }, "compId": 4 }, { "type": "Button", "props": { "y": 0, "x": 995, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 5 }, { "type": "Button", "props": { "y": 556, "var": "btn_remove", "stateNum": 1, "skin": "btns/delete_message.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 4 }, "compId": 6 }], "loadList": ["bgs/message_detail.png", "btns/ic_close.png", "btns/delete_message.png"], "loadList3D": [] };
        return MailInfoUI;
    }(Dialog));
    ui.MailInfoUI = MailInfoUI;
    REG("ui.MailInfoUI", MailInfoUI);
    var MiniLoadingUI = /** @class */ (function (_super) {
        __extends(MiniLoadingUI, _super);
        function MiniLoadingUI() {
            return _super.call(this) || this;
        }
        MiniLoadingUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(MiniLoadingUI.uiView);
        };
        MiniLoadingUI.uiView = { "type": "Dialog", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Animation", "props": { "y": 283, "x": 530, "var": "ani1", "source": "icons/ic_loading0.png,icons/ic_loading1.png,icons/ic_loading2.png,icons/ic_loading3.png", "scaleY": 0.5, "scaleX": 0.5, "interval": 200, "autoPlay": true }, "compId": 5 }], "loadList": ["icons/ic_loading0.png,icons/ic_loading1.png,icons/ic_loading2.png,icons/ic_loading3.png"], "loadList3D": [] };
        return MiniLoadingUI;
    }(Dialog));
    ui.MiniLoadingUI = MiniLoadingUI;
    REG("ui.MiniLoadingUI", MiniLoadingUI);
    var NoticeUI = /** @class */ (function (_super) {
        __extends(NoticeUI, _super);
        function NoticeUI() {
            return _super.call(this) || this;
        }
        NoticeUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(NoticeUI.uiView);
        };
        NoticeUI.uiView = { "type": "Dialog", "props": { "width": 953, "height": 568 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_news_dialog.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": 96, "x": 17, "width": 917, "var": "img_gg", "height": 439 }, "compId": 5 }, { "type": "Button", "props": { "y": 10, "x": 867, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 8 }], "loadList": ["bgs/ic_news_dialog.png", "btns/ic_close.png"], "loadList3D": [] };
        return NoticeUI;
    }(Dialog));
    ui.NoticeUI = NoticeUI;
    REG("ui.NoticeUI", NoticeUI);
    var NoticeMsgUI = /** @class */ (function (_super) {
        __extends(NoticeMsgUI, _super);
        function NoticeMsgUI() {
            return _super.call(this) || this;
        }
        NoticeMsgUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(NoticeMsgUI.uiView);
        };
        NoticeMsgUI.uiView = { "type": "Dialog", "props": { "width": 953, "height": 568 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_news_dialog.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 857, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 4 }, { "type": "TextArea", "props": { "y": 99, "x": 18, "width": 911, "var": "txt_gg", "vScrollBarSkin": "comp/vscroll.png", "text": "TextArea", "height": 349, "fontSize": 24, "color": "#ffffff" }, "compId": 6 }, { "type": "Button", "props": { "y": 459, "x": 402, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_button_sure.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 8 }], "loadList": ["bgs/ic_news_dialog.png", "btns/ic_close.png", "comp/vscroll.png", "btns/ic_button_sure.png"], "loadList3D": [] };
        return NoticeMsgUI;
    }(Dialog));
    ui.NoticeMsgUI = NoticeMsgUI;
    REG("ui.NoticeMsgUI", NoticeMsgUI);
    var RegisterUiUI = /** @class */ (function (_super) {
        __extends(RegisterUiUI, _super);
        function RegisterUiUI() {
            return _super.call(this) || this;
        }
        RegisterUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(RegisterUiUI.uiView);
        };
        RegisterUiUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_register_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 998, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 4 }, { "type": "Button", "props": { "y": 540, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_register_dialog.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 5 }, { "type": "Label", "props": { "y": 237, "x": 211, "text": "账号", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 6 }, { "type": "Image", "props": { "y": 228, "x": 346, "width": 545, "skin": "comp/ic_input_bg.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 7, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入您的账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 8 }] }, { "type": "Label", "props": { "y": 320, "x": 211, "text": "密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 9 }, { "type": "Image", "props": { "y": 311, "x": 346, "width": 545, "skin": "comp/ic_input_bg.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 10, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_pwd1", "type": "password", "prompt": "请输入您的密码", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 11 }] }, { "type": "Label", "props": { "y": 403, "x": 211, "text": "确认密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 12 }, { "type": "Image", "props": { "y": 394, "x": 345, "width": 545, "skin": "comp/ic_input_bg.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 13, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_pwd2", "type": "password", "prompt": "请输入您的密码", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 14 }] }], "loadList": ["bgs/ic_register_bg.png", "btns/ic_close.png", "btns/ic_register_dialog.png", "comp/ic_input_bg.png"], "loadList3D": [] };
        return RegisterUiUI;
    }(Dialog));
    ui.RegisterUiUI = RegisterUiUI;
    REG("ui.RegisterUiUI", RegisterUiUI);
    var SetBankPasswordUI = /** @class */ (function (_super) {
        __extends(SetBankPasswordUI, _super);
        function SetBankPasswordUI() {
            return _super.call(this) || this;
        }
        SetBankPasswordUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(SetBankPasswordUI.uiView);
        };
        SetBankPasswordUI.uiView = { "type": "Dialog", "props": { "width": 784, "height": 544 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "bgs/ic_dialog_tip.png" }, "compId": 3 }, { "type": "Label", "props": { "y": 140, "wordWrap": true, "width": 703, "text": "亲爱的玩家，为了您的账户安全，请设置您的取款密码，每次提款都需要输入密码", "height": 61, "fontSize": 24, "color": "#FFD39F", "centerX": 0 }, "compId": 4 }, { "type": "Label", "props": { "y": 231, "x": 95, "text": "输入密码", "fontSize": 24, "color": "#FFFFFF" }, "compId": 5 }, { "type": "Label", "props": { "y": 309, "x": 95, "text": "确认密码", "fontSize": 24, "color": "#FFFFFF" }, "compId": 6 }, { "type": "Box", "props": { "y": 218, "x": 217, "var": "b_input1" }, "compId": 23, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/mm_bg.png" }, "compId": 8, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 32 }] }, { "type": "Image", "props": { "y": 0, "x": 72, "skin": "bgs/mm_bg.png" }, "compId": 14, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 33 }] }, { "type": "Image", "props": { "y": 0, "x": 144, "skin": "bgs/mm_bg.png" }, "compId": 18, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 34 }] }, { "type": "Image", "props": { "y": 0, "x": 215, "skin": "bgs/mm_bg.png" }, "compId": 19, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 35 }] }, { "type": "Image", "props": { "y": 0, "x": 287, "skin": "bgs/mm_bg.png" }, "compId": 20, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 36 }] }, { "type": "Image", "props": { "y": 0, "x": 359, "skin": "bgs/mm_bg.png" }, "compId": 22, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 37 }] }, { "type": "TextInput", "props": { "y": 0, "x": 0, "width": 417, "var": "txt_input1", "type": "number", "height": 53 }, "compId": 31 }] }, { "type": "Box", "props": { "y": 294, "x": 217, "var": "b_input2" }, "compId": 24, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/mm_bg.png" }, "compId": 38, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 45 }] }, { "type": "Image", "props": { "y": 0, "x": 72, "skin": "bgs/mm_bg.png" }, "compId": 39, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 46 }] }, { "type": "Image", "props": { "y": 0, "x": 144, "skin": "bgs/mm_bg.png" }, "compId": 40, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 47 }] }, { "type": "Image", "props": { "y": 0, "x": 215, "skin": "bgs/mm_bg.png" }, "compId": 41, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 48 }] }, { "type": "Image", "props": { "y": 0, "x": 287, "skin": "bgs/mm_bg.png" }, "compId": 42, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 49 }] }, { "type": "Image", "props": { "y": 0, "x": 359, "skin": "bgs/mm_bg.png" }, "compId": 43, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 50 }] }, { "type": "TextInput", "props": { "y": 0, "x": 0, "width": 417, "var": "txt_input2", "type": "number", "height": 53 }, "compId": 44 }] }, { "type": "Button", "props": { "y": 413, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_confirm_commit.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 51 }], "loadList": ["bgs/ic_dialog_tip.png", "bgs/mm_bg.png", "btns/ic_confirm_commit.png"], "loadList3D": [] };
        return SetBankPasswordUI;
    }(Dialog));
    ui.SetBankPasswordUI = SetBankPasswordUI;
    REG("ui.SetBankPasswordUI", SetBankPasswordUI);
    var SetUiUI = /** @class */ (function (_super) {
        __extends(SetUiUI, _super);
        function SetUiUI() {
            return _super.call(this) || this;
        }
        SetUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(SetUiUI.uiView);
        };
        SetUiUI.uiView = { "type": "Dialog", "props": { "width": 1084, "height": 635 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 50, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_setting_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 4 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 40 }] }, { "type": "Tab", "props": { "y": 116.5, "x": 27, "var": "tab_1", "direction": "vertical" }, "compId": 5, "child": [{ "type": "Button", "props": { "y": 0, "stateNum": 2, "skin": "btns/btn_setting_sound.png", "name": "item0" }, "compId": 6 }, { "type": "Button", "props": { "y": 86, "x": 0, "stateNum": 2, "skin": "btns/btn_setting_password.png", "name": "item1" }, "compId": 7 }, { "type": "Button", "props": { "y": 170, "x": 0, "stateNum": 2, "skin": "btns/btn_setting_app.png", "name": "item2" }, "compId": 8 }] }, { "type": "Box", "props": { "var": "b_sound", "top": 122, "right": 20, "left": 282, "height": 485 }, "compId": 10, "child": [{ "type": "Box", "props": { "y": 0, "var": "b_info", "right": 0, "left": 0, "height": 437 }, "compId": 51, "child": [{ "type": "Label", "props": { "y": 36, "x": 22, "text": "基础信息:", "fontSize": 30, "color": "#d6c09a" }, "compId": 13 }, { "type": "Image", "props": { "y": 89, "x": 31, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 16 }, { "type": "Image", "props": { "y": 137, "x": 114, "width": 178, "skin": "bgs/money_get_out_box.png", "sizeGrid": "12,25,16,21", "height": 29 }, "compId": 42, "child": [{ "type": "Label", "props": { "y": 2, "x": 9, "width": 161, "var": "txt_id", "text": "wx123456", "height": 24, "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 19 }] }, { "type": "Label", "props": { "y": 113, "x": 123, "text": "账号:", "fontSize": 20, "color": "#b89068" }, "compId": 18 }, { "type": "Label", "props": { "y": 113, "x": 384, "text": "等级:", "fontSize": 20, "color": "#b89068" }, "compId": 43 }, { "type": "Image", "props": { "y": 137, "x": 382, "width": 124, "skin": "bgs/money_get_out_box.png", "sizeGrid": "12,22,16,16", "height": 29 }, "compId": 44, "child": [{ "type": "Label", "props": { "y": 2, "x": 9, "width": 102, "var": "txt_level", "text": "VIP1", "height": 24, "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 45 }] }, { "type": "Button", "props": { "y": 367, "x": 274, "width": 235, "var": "btn_logout", "stateNum": 1, "skin": "btns/ic_logout.png", "height": 70, "centerX": 0 }, "compId": 25 }] }, { "type": "Label", "props": { "y": 185, "x": 22, "text": "声音设置:", "fontSize": 30, "color": "#d6c09a" }, "compId": 17 }, { "type": "Label", "props": { "y": 255, "x": 27, "text": "背景音乐:", "fontSize": 20, "color": "#b89068" }, "compId": 20 }, { "type": "CheckBox", "props": { "y": 230.5, "x": 145.7783203125, "var": "cb_music", "stateNum": 2, "skin": "comp/checkbox_0.png" }, "compId": 46 }, { "type": "Label", "props": { "y": 252.5, "x": 407.2216796875, "text": "音效:", "fontSize": 20, "color": "#b89068" }, "compId": 47 }, { "type": "CheckBox", "props": { "y": 230, "x": 482, "var": "cb_sound", "stateNum": 2, "skin": "comp/checkbox_0.png" }, "compId": 48 }] }, { "type": "Box", "props": { "var": "b_pwd", "top": 122, "right": 20, "left": 282, "height": 485 }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 81, "x": 143, "text": "现密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 26 }, { "type": "Label", "props": { "y": 162, "x": 143, "text": "新密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 27 }, { "type": "Label", "props": { "y": 240, "x": 113, "text": "确认密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 28 }, { "type": "Image", "props": { "y": 70, "x": 260, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 29, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_oldPwd", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 30 }] }, { "type": "Image", "props": { "y": 151, "x": 260, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 31, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 365, "var": "txt_newPwd", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 32 }] }, { "type": "Image", "props": { "y": 232, "x": 260, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 35, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 361, "var": "txt_newPwd1", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 36 }] }, { "type": "Button", "props": { "y": 365, "width": 235, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_replace_password.png", "scaleY": 1, "scaleX": 1, "height": 70, "centerX": 0 }, "compId": 37 }] }, { "type": "Box", "props": { "var": "b_app", "top": 122, "right": 20, "left": 282, "height": 485 }, "compId": 12, "child": [{ "type": "Text", "props": { "y": 79, "x": 8, "width": 763, "var": "txt_app_version", "valign": "middle", "text": "text", "height": 255, "fontSize": 30, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 535, "x": 974.63818359375, "var": "txt_version", "text": "1.0.0", "fontSize": 30, "color": "#b89068" }, "compId": 49 }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_setting_title.png", "btns/ic_close.png", "btns/btn_setting_sound.png", "btns/btn_setting_password.png", "btns/btn_setting_app.png", "comp/dindex_index_icon.png", "bgs/money_get_out_box.png", "btns/ic_logout.png", "comp/checkbox_0.png", "comp/big_input_box.png", "btns/ic_replace_password.png"], "loadList3D": [] };
        return SetUiUI;
    }(Dialog));
    ui.SetUiUI = SetUiUI;
    REG("ui.SetUiUI", SetUiUI);
    var SubGameListUI = /** @class */ (function (_super) {
        __extends(SubGameListUI, _super);
        function SubGameListUI() {
            return _super.call(this) || this;
        }
        SubGameListUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(SubGameListUI.uiView);
        };
        SubGameListUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 13 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 3, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 5 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 6 }, { "type": "Image", "props": { "x": 329, "var": "img_title", "skin": "bgs/ic_xima_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 7 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "vScrollBarSkin": "comp/vscroll.png", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 4, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/ic_charge_unchose.png", "name": "bg_normal", "height": 96 }, "compId": 9 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/ic_charge_chose.png", "name": "bg_selected", "height": 96 }, "compId": 10 }, { "type": "Label", "props": { "width": 193, "text": "开元棋牌", "right": 0, "name": "txt_label", "height": 36, "fontSize": 36, "color": "#462C11", "centerY": 0, "bold": true }, "compId": 11 }, { "type": "Image", "props": { "x": 0, "width": 80, "name": "game_icon", "height": 80, "centerY": 0 }, "compId": 12 }] }] }, { "type": "Panel", "props": { "y": 222, "var": "p_1", "right": 30, "left": 295, "height": 498, "hScrollBarSkin": "comp/hscroll.png" }, "compId": 14, "child": [{ "type": "Box", "props": {}, "compId": 20 }] }, { "type": "Text", "props": { "y": 141, "x": 295, "var": "txt_info", "text": "开元棋牌，总共15个游戏", "fontSize": 22, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 15 }, { "type": "TextInput", "props": { "y": 152, "x": 1122, "var": "txt_input", "skin": "comp/ic_search_bg.png", "promptColor": "#fffdfd", "prompt": "请输入游戏名字", "height": 25, "color": "#fffdfd" }, "compId": 19 }, { "type": "Image", "props": { "y": 153, "x": 1226, "width": 24, "var": "btn_search", "skin": "comp/ic_search_btn.png", "height": 24 }, "compId": 16 }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_xima_title.png", "comp/vscroll.png", "bgs/ic_charge_unchose.png", "bgs/ic_charge_chose.png", "comp/hscroll.png", "comp/ic_search_bg.png", "comp/ic_search_btn.png"], "loadList3D": [] };
        return SubGameListUI;
    }(View));
    ui.SubGameListUI = SubGameListUI;
    REG("ui.SubGameListUI", SubGameListUI);
    var TiXianUI = /** @class */ (function (_super) {
        __extends(TiXianUI, _super);
        function TiXianUI() {
            return _super.call(this) || this;
        }
        TiXianUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(TiXianUI.uiView);
        };
        TiXianUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 92 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 3 }, { "type": "Box", "props": { "y": 125, "x": 302, "var": "b_tx" }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/tx_bg.png" }, "compId": 93 }, { "type": "Image", "props": { "y": 53, "x": 23, "width": 920, "skin": "bgs/tx_bg3.png", "sizeGrid": "20,20,20,20", "height": 110 }, "compId": 17 }, { "type": "Label", "props": { "y": 93.5, "x": 30, "width": 122, "text": "提现金额", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 20 }, { "type": "Image", "props": { "y": 80, "x": 193, "width": 632, "skin": "bgs/tx_bg2.png", "sizeGrid": "20,20,20,20", "height": 56 }, "compId": 21, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 612, "var": "txt_input", "type": "number", "prompt": "请输入您的提现金额 单笔最低100 最高10000000", "height": 36, "fontSize": 28, "color": "#d6c09a" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 88, "x": 830, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_safe_clear.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "Box", "props": { "y": 193, "x": 20, "var": "b_unlock" }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 923, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 18 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png" }, "compId": 24 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 26 }, { "type": "Label", "props": { "y": 57.5, "x": 171, "text": "你暂时未绑定银行卡,请前往绑定", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 27 }, { "type": "Button", "props": { "y": 27, "x": 763, "var": "btn_bangding", "stateNum": 1, "skin": "btns/ic_bind_bank.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 28 }] }, { "type": "Button", "props": { "y": 445, "x": 362, "var": "btn_tx", "stateNum": 1, "skin": "btns/ic_comfirm_tixiam.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 19 }, { "type": "Box", "props": { "y": 193, "x": 22, "var": "b_myBank" }, "compId": 80, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 921, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 81 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png", "name": "img_bank" }, "compId": 82 }, { "type": "Label", "props": { "y": 57, "x": 174, "var": "txt_id", "text": "1234567 89", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 83 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "name": "txt_name", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 84 }] }] }, { "type": "Box", "props": { "width": 950, "var": "b_add", "top": 125, "right": 30, "left": 300, "height": 539 }, "compId": 36, "child": [{ "type": "Label", "props": { "y": 79, "x": 83, "text": "持卡人姓名", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 37 }, { "type": "Image", "props": { "y": 70, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 38, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入持卡人姓名", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 139, "x": 83, "width": 146, "text": "选择银行", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 40 }, { "type": "Image", "props": { "y": 130, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 41, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 522, "var": "txt_bankName", "type": "text", "prompt": "请输入银行", "height": 36, "fontSize": 30, "color": "#d6c09a", "align": "left" }, "compId": 42 }] }, { "type": "Label", "props": { "y": 198, "x": 83, "text": "银行卡账号", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 43 }, { "type": "Image", "props": { "y": 189, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 44, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 531, "var": "txt_bankId", "type": "number", "prompt": "请输入银行卡账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 45 }] }, { "type": "Label", "props": { "y": 270, "x": 83, "width": 147, "text": "开户地址", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 46 }, { "type": "Image", "props": { "y": 262, "x": 249, "width": 538, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 47, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_bankAddress", "type": "text", "prompt": "请输入银行卡开户地址", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 48 }] }, { "type": "Button", "props": { "y": 432, "var": "btn_bd", "stateNum": 1, "skin": "btns/ic_btn_bind.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 51 }, { "type": "Label", "props": { "y": 331, "x": -1, "wordWrap": true, "width": 942, "text": "提示:请正确选定开户行,并绑定真实姓名,结算时将直接转入此账户,为了您的账户安全,绑定后不可随意更改,如需修改,请联系客服人员", "height": 62, "fontSize": 20, "color": "#777777" }, "compId": 52 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 53, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 54 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 55 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_withdraw_title.png", "centerY": 0 }, "compId": 56 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatY": 2, "repeatX": 1, "left": 0, "height": 578 }, "compId": 65, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 66, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_withdraw_bank.png", "name": "bg_normal", "height": 96 }, "compId": 67 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_withdraw_bank_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 68 }] }] }], "loadList": ["bgs/ic_recharge_bg.png", "comp/dactivity_nav_left.png", "bgs/tx_bg.png", "bgs/tx_bg3.png", "bgs/tx_bg2.png", "btns/ic_safe_clear.png", "bgs/ic_gathering_bg.png", "icons/dgetcharge_tixianyinliankatubiao.png", "btns/ic_bind_bank.png", "btns/ic_comfirm_tixiam.png", "comp/big_input_box.png", "btns/ic_btn_bind.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_withdraw_title.png", "btns/ic_withdraw_bank.png", "btns/ic_withdraw_bank_pressed.png"], "loadList3D": [] };
        return TiXianUI;
    }(View));
    ui.TiXianUI = TiXianUI;
    REG("ui.TiXianUI", TiXianUI);
    var TiXianHistroyUI = /** @class */ (function (_super) {
        __extends(TiXianHistroyUI, _super);
        function TiXianHistroyUI() {
            return _super.call(this) || this;
        }
        TiXianHistroyUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(TiXianHistroyUI.uiView);
        };
        TiXianHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 19 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_deposit_record_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 20 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 21 }] }, { "type": "Image", "props": { "y": 130, "x": 41, "width": 327, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 730, "width": 343, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 369, "width": 360, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 15 }, { "type": "Label", "props": { "y": 137, "x": 66, "width": 241, "text": "时间", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 419, "width": 256, "text": "金额", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 7 }, { "type": "List", "props": { "y": 170, "x": 41, "width": 1029, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 10, "height": 448 }, "compId": 8, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 7, "x": 0, "width": 360, "text": "20171212", "name": "txt_time", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 12 }, { "type": "Label", "props": { "y": 7, "x": 362, "width": 354, "text": "123456", "name": "txt_money", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 7, "x": 724, "width": 354, "text": "123456", "name": "txt_status", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 17 }] }] }, { "type": "Label", "props": { "y": 137, "x": 780, "width": 256, "text": "状态", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 16 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }] }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_deposit_record_title.png", "btns/ic_close.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return TiXianHistroyUI;
    }(Dialog));
    ui.TiXianHistroyUI = TiXianHistroyUI;
    REG("ui.TiXianHistroyUI", TiXianHistroyUI);
    var TuiGuangUI = /** @class */ (function (_super) {
        __extends(TuiGuangUI, _super);
        function TuiGuangUI() {
            return _super.call(this) || this;
        }
        TuiGuangUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(TuiGuangUI.uiView);
        };
        TuiGuangUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 127 }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_1", "height": 527, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 327, "x": 694, "skin": "bgs/tg_bg2.png" }, "compId": 179 }, { "type": "Button", "props": { "y": 104.5, "x": 956, "width": 256, "var": "btn_fx_hy", "stateNum": 1, "skin": "btns/sharetofriend.png", "scaleY": 1, "scaleX": 1, "height": 80 }, "compId": 26 }, { "type": "Button", "props": { "y": 197, "x": 956, "width": 256, "var": "btn_fx_qq", "stateNum": 1, "skin": "btns/sharetoqq.png", "height": 80 }, "compId": 27 }, { "type": "Image", "props": { "y": 55.5, "x": 694, "var": "img_ewm", "skin": "comp/ewmbg.png" }, "compId": 65 }, { "type": "Image", "props": { "y": 349, "x": 718, "width": 310, "skin": "bgs/ic_website_bg.png", "sizeGrid": "2,2,2,2", "height": 54 }, "compId": 66 }, { "type": "Button", "props": { "y": 341, "x": 1047, "width": 130, "var": "btn_copy", "stateNum": 1, "skin": "btns/copywebsite.png", "height": 76 }, "compId": 67 }, { "type": "Label", "props": { "y": 362, "x": 729, "width": 299, "var": "txt_web", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 68 }, { "type": "Image", "props": { "y": 28, "x": 663, "skin": "comp/line.png" }, "compId": 178 }, { "type": "Box", "props": { "y": 94.5, "x": 0 }, "compId": 180, "child": [{ "type": "Image", "props": { "y": -46, "x": 0, "skin": "bgs/tg_bg1.png" }, "compId": 176 }, { "type": "Image", "props": { "y": 41, "x": 38, "skin": "bgs/tg_img1.png" }, "compId": 181 }, { "type": "Image", "props": { "y": 173, "x": 199, "skin": "bgs/tg_img4.png" }, "compId": 182 }, { "type": "Image", "props": { "y": 40, "x": 337, "skin": "bgs/tg_img2.png" }, "compId": 183 }, { "type": "Image", "props": { "y": -69, "x": 199, "skin": "bgs/tg_img3.png" }, "compId": 184 }, { "type": "Button", "props": { "y": -46, "x": -15, "var": "btn_xq", "stateNum": 1, "skin": "btns/tg_info.png" }, "compId": 177 }, { "type": "Label", "props": { "y": 228, "x": 141.646484375, "text": "label", "fontSize": 24, "color": "#FF0000" }, "compId": 185 }, { "type": "Label", "props": { "y": 108, "x": 288.29296875, "text": "label", "fontSize": 24, "color": "#FF0000" }, "compId": 186 }, { "type": "Label", "props": { "y": 228, "x": 451, "text": "label", "fontSize": 24, "color": "#FF0000" }, "compId": 187 }, { "type": "Label", "props": { "y": 341, "x": 289.646484375, "text": "label", "fontSize": 24, "color": "#FF0000" }, "compId": 188 }] }] }, { "type": "Box", "props": { "y": 206.5, "width": 1221, "var": "b_2", "height": 506, "centerX": 0 }, "compId": 71, "child": [{ "type": "Image", "props": { "y": 22, "x": -3.5, "skin": "bgs/tg_bg4.png" }, "compId": 189 }, { "type": "Image", "props": { "y": 68, "x": 4, "skin": "bgs/tg_bg5.png" }, "compId": 190 }, { "type": "Label", "props": { "y": 33, "x": 12, "text": "代理账号:", "fontSize": 24, "color": "#A1A1A1" }, "compId": 191 }, { "type": "Label", "props": { "y": 33, "x": 114.66796875, "var": "txt_id", "text": "当前账号", "fontSize": 24, "color": "#FFD39F" }, "compId": 192 }, { "type": "TextArea", "props": { "y": 79, "x": 12, "width": 1202, "var": "txt_info", "promptColor": "#A1A1A1", "prompt": "请尽量注明您的优势!", "overflow": "scroll", "height": 253, "fontSize": 24, "color": "#FFFFFF" }, "compId": 193 }, { "type": "Button", "props": { "y": 391, "var": "btn_sq", "stateNum": 1, "skin": "btns/tg_sq.png", "centerX": 0 }, "compId": 194 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 118, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 120 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 121 }, { "type": "Image", "props": { "x": 334, "skin": "bgs/ic_extension_title.png", "scaleY": 1, "scaleX": 1, "centerY": 0 }, "compId": 122 }] }, { "type": "List", "props": { "width": 609, "var": "list_tab", "top": 120, "spaceX": 80, "repeatY": 1, "repeatX": 2, "height": 83, "centerX": 0 }, "compId": 119, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 123, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "btns/tg_tab1_2.png", "name": "bg_normal" }, "compId": 124 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "btns/tg_tab1_1.png", "name": "bg_selected" }, "compId": 125 }] }] }, { "type": "Button", "props": { "y": 130.5, "x": 1016, "var": "btn_gz", "stateNum": 1, "skin": "btns/tg_ldx.png" }, "compId": 175 }], "loadList": ["bgs/ic_recharge_bg.png", "bgs/tg_bg2.png", "btns/sharetofriend.png", "btns/sharetoqq.png", "comp/ewmbg.png", "bgs/ic_website_bg.png", "btns/copywebsite.png", "comp/line.png", "bgs/tg_bg1.png", "bgs/tg_img1.png", "bgs/tg_img4.png", "bgs/tg_img2.png", "bgs/tg_img3.png", "btns/tg_info.png", "bgs/tg_bg4.png", "bgs/tg_bg5.png", "btns/tg_sq.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_extension_title.png", "btns/tg_tab1_2.png", "btns/tg_tab1_1.png", "btns/tg_ldx.png"], "loadList3D": [] };
        return TuiGuangUI;
    }(View));
    ui.TuiGuangUI = TuiGuangUI;
    REG("ui.TuiGuangUI", TuiGuangUI);
    var TuiGuang_GZUI = /** @class */ (function (_super) {
        __extends(TuiGuang_GZUI, _super);
        function TuiGuang_GZUI() {
            return _super.call(this) || this;
        }
        TuiGuang_GZUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(TuiGuang_GZUI.uiView);
        };
        TuiGuang_GZUI.uiView = { "type": "Dialog", "props": { "width": 954, "height": 560 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/tg_gz_bg.png" }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 896, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 4 }, { "type": "TextArea", "props": { "y": 139, "x": 44, "width": 867, "var": "txt_info", "text": "1、每个推荐人只可享受一次奖励\\n 2、成为老用户后才能推荐新用户\\n 3、邀请的新用户达到条件后，老用户才能返佣,佣金达到流水即可提款\\n 4、佣金会在系统规定时间发放\\n 5、如有疑问请联系客服\\n", "height": 373, "fontSize": 24, "editable": false, "color": "#F7C695" }, "compId": 22 }], "loadList": ["bgs/tg_gz_bg.png", "btns/ic_close.png"], "loadList3D": [] };
        return TuiGuang_GZUI;
    }(Dialog));
    ui.TuiGuang_GZUI = TuiGuang_GZUI;
    REG("ui.TuiGuang_GZUI", TuiGuang_GZUI);
    var TuiGuang_XQUI = /** @class */ (function (_super) {
        __extends(TuiGuang_XQUI, _super);
        function TuiGuang_XQUI() {
            return _super.call(this) || this;
        }
        TuiGuang_XQUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(TuiGuang_XQUI.uiView);
        };
        TuiGuang_XQUI.uiView = { "type": "Dialog", "props": { "width": 954, "height": 560 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "bgs/tg_xq_bg.png" }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 896, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 4 }, { "type": "Box", "props": { "y": 102, "x": 0 }, "compId": 5, "child": [{ "type": "Image", "props": { "y": 0, "x": 4, "width": 236, "skin": "comp/list_title2.png", "height": 58 }, "compId": 6 }, { "type": "Image", "props": { "y": 0, "x": 241, "width": 236, "skin": "comp/list_title2.png", "height": 58 }, "compId": 7 }, { "type": "Image", "props": { "y": 0, "x": 477, "width": 236, "skin": "comp/list_title2.png", "height": 58 }, "compId": 8 }, { "type": "Image", "props": { "y": 0, "x": 714, "width": 236, "skin": "comp/list_title2.png", "height": 58 }, "compId": 9 }, { "type": "Label", "props": { "x": 66, "text": "会员账号", "fontSize": 24, "color": "#FFD39F", "centerY": 0 }, "compId": 10 }, { "type": "Label", "props": { "x": 311, "text": "推广时间", "fontSize": 24, "color": "#FFD39F", "centerY": 0 }, "compId": 11 }, { "type": "Label", "props": { "x": 547, "text": "是否返佣", "fontSize": 24, "color": "#FFD39F", "centerY": 0 }, "compId": 12 }, { "type": "Label", "props": { "x": 784, "text": "返佣金额", "fontSize": 24, "color": "#FFD39F", "centerY": 0 }, "compId": 13 }] }, { "type": "List", "props": { "y": 169, "width": 944, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "right": 10, "left": 0, "height": 384 }, "compId": 14, "child": [{ "type": "Box", "props": { "y": 0, "x": 4, "name": "render" }, "compId": 15, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 946, "skin": "comp/list_itembg1.png", "sizeGrid": "14,13,10,13", "name": "item_bg", "height": 42 }, "compId": 16 }, { "type": "Label", "props": { "x": 8, "width": 231, "text": "123458", "name": "txt_1", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 17 }, { "type": "Label", "props": { "x": 717, "width": 227, "text": "25058", "name": "txt_4", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 20 }, { "type": "Label", "props": { "x": 473, "width": 237, "text": "红色色号#EB0112", "name": "txt_6", "height": 26, "fontSize": 26, "color": "#00F41C", "centerY": 0, "align": "center" }, "compId": 21 }, { "type": "Label", "props": { "x": 242, "width": 232, "text": "2019-10-10 10:00", "name": "txt_5", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 22 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 24, "color": "#F8F8F8", "centerY": 101, "centerX": 0, "alpha": 0.43 }, "compId": 23, "child": [{ "type": "Image", "props": { "y": -80, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 24 }] }], "loadList": ["bgs/tg_xq_bg.png", "btns/ic_close.png", "comp/list_title2.png", "comp/vscroll.png", "comp/list_itembg1.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return TuiGuang_XQUI;
    }(Dialog));
    ui.TuiGuang_XQUI = TuiGuang_XQUI;
    REG("ui.TuiGuang_XQUI", TuiGuang_XQUI);
    var UserInfoUI = /** @class */ (function (_super) {
        __extends(UserInfoUI, _super);
        function UserInfoUI() {
            return _super.call(this) || this;
        }
        UserInfoUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(UserInfoUI.uiView);
        };
        UserInfoUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720, "centerY": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_qipai_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 115 }, { "type": "Image", "props": { "y": 10, "x": 10, "skin": "comp/dactivity_nav_left.png" }, "compId": 99 }, { "type": "Box", "props": { "var": "b_info", "top": 130, "right": 10, "left": 303, "height": 590 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 969, "skin": "bgs/ic_pc_title.png", "right": 0, "left": 0, "height": 48 }, "compId": 176, "child": [{ "type": "Image", "props": { "x": 23, "skin": "icons/ic_dot.png", "centerY": 0 }, "compId": 177 }, { "type": "Label", "props": { "x": 76, "text": "基础信息", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 178 }] }, { "type": "Label", "props": { "y": 82, "x": 64, "text": "账号：", "fontSize": 22, "color": "#eaa65a" }, "compId": 183 }, { "type": "Label", "props": { "y": 82, "x": 129, "var": "txt_account", "text": "玩家账号", "fontSize": 22, "color": "#FFFFFF" }, "compId": 184 }, { "type": "Label", "props": { "y": 135, "x": 184, "width": 267, "var": "txt_level", "text": "玩家账号", "styleSkin": "comp/ic_input_bg.png", "height": 27, "fontSize": 22, "color": "#FFFFFF" }, "compId": 186 }, { "type": "Label", "props": { "y": 137, "x": 69, "width": 44, "text": "会员等级:", "height": 22, "fontSize": 22, "color": "#eaa65a" }, "compId": 185 }, { "type": "Label", "props": { "y": 199, "x": 69, "text": "姓名：", "fontSize": 22, "color": "#eaa65a" }, "compId": 188 }, { "type": "TextInput", "props": { "y": 195, "x": 135, "width": 245, "var": "txt_name", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 189 }, { "type": "Label", "props": { "y": 264, "x": 69, "text": "邮箱：", "fontSize": 22, "color": "#eaa65a" }, "compId": 198 }, { "type": "TextInput", "props": { "y": 260, "x": 135, "width": 245, "var": "txt_mail", "type": "email", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 199 }, { "type": "Label", "props": { "y": 332, "x": 69, "text": "电话：", "fontSize": 22, "color": "#eaa65a" }, "compId": 200 }, { "type": "TextInput", "props": { "y": 329, "x": 138, "width": 241, "var": "txt_tel", "type": "number", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 201 }, { "type": "Label", "props": { "y": 403, "x": 69, "text": "微信：", "fontSize": 22, "color": "#eaa65a" }, "compId": 204 }, { "type": "TextInput", "props": { "y": 399, "x": 136, "width": 249, "var": "txt_wx", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 205 }, { "type": "Box", "props": { "y": 488, "width": 133, "var": "btn_xg1", "right": 504, "height": 41 }, "compId": 367, "child": [{ "type": "Image", "props": { "y": 4, "x": 0, "stateNum": 1, "skin": "btns/ic_edit.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 0 }, "compId": 368 }, { "type": "Label", "props": { "y": 8.5, "x": 66, "text": "编辑", "fontSize": 24, "color": "#eaa65a" }, "compId": 369 }] }] }, { "type": "Box", "props": { "width": 978, "var": "b_mingxi", "top": 130, "height": 581, "centerX": 150 }, "compId": 260, "child": [{ "type": "Image", "props": { "y": 84, "width": 948, "skin": "comp/panel_bg1.png", "left": 0, "height": 490 }, "compId": 261 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 951, "var": "list_tab1", "spaceX": 7, "repeatY": 1, "height": 72, "hScrollBarSkin": "comp/hscroll.png" }, "compId": 378, "child": [{ "type": "Box", "props": { "width": 182, "renderType": "render", "height": 74 }, "compId": 379, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/tab_1.png", "name": "bg_normal" }, "compId": 380 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/tab_2.png", "name": "bg_selected" }, "compId": 381 }, { "type": "Label", "props": { "x": 1, "width": 182, "text": "我的推广", "name": "txt_label", "height": 28, "fontSize": 28, "centerY": 0, "align": "center" }, "compId": 382 }] }] }, { "type": "Box", "props": { "y": 100, "x": 0 }, "compId": 383, "child": [{ "type": "Label", "props": { "text": "开始时间", "left": 50, "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0 }, "compId": 385 }, { "type": "Image", "props": { "x": 155, "width": 178, "var": "time_start1", "stateNum": 1, "skin": "comp/combobox.png", "selectedLabel": "AG视讯", "labels": "AG视讯,电子游戏", "labelSize": 22, "labelColors": "#DFDFDF,#DFDFDF,#DFDFDF,#DFDFDF", "itemSize": 24, "itemColors": "#847C68,#ffffff,#ffffff,##847C68,#847C68", "height": 36, "centerY": 0 }, "compId": 404, "child": [{ "type": "Label", "props": { "y": 0, "x": 4, "width": 151, "text": "2019-12-12", "height": 24, "fontSize": 24, "color": "#DFDFDF", "centerY": 0 }, "compId": 405 }] }, { "type": "Label", "props": { "text": "结束时间", "left": 600, "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0 }, "compId": 406 }, { "type": "Image", "props": { "x": 704, "width": 178, "var": "time_end1", "stateNum": 1, "skin": "comp/combobox.png", "selectedLabel": "AG视讯", "labels": "AG视讯,电子游戏", "labelSize": 22, "labelColors": "#DFDFDF,#DFDFDF,#DFDFDF,#DFDFDF", "itemSize": 24, "itemColors": "#847C68,#ffffff,#ffffff,##847C68,#847C68", "height": 36, "centerY": 0 }, "compId": 407, "child": [{ "type": "Label", "props": { "y": 0, "x": 4, "width": 151, "text": "2019-12-12", "height": 24, "fontSize": 24, "color": "#DFDFDF", "centerY": 0 }, "compId": 408 }] }] }, { "type": "List", "props": { "y": 207, "width": 945, "var": "list_mx", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "left": 0, "height": 357 }, "compId": 285, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 287, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 946, "skin": "comp/list_itembg1.png", "sizeGrid": "14,13,10,13", "name": "item_bg", "height": 42 }, "compId": 398 }, { "type": "Label", "props": { "x": 0, "width": 236, "valign": "middle", "text": "label", "name": "txt_1", "height": 24, "fontSize": 20, "color": "#00F41C", "centerY": 0, "align": "center" }, "compId": 288 }, { "type": "Label", "props": { "x": 239, "width": 235, "valign": "middle", "text": "label", "name": "txt_2", "height": 24, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 289 }, { "type": "Label", "props": { "x": 473, "width": 236, "valign": "middle", "text": "label", "name": "txt_3", "height": 24, "fontSize": 18, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 290 }, { "type": "Label", "props": { "x": 712, "width": 235, "valign": "middle", "text": "label", "name": "txt_4", "height": 24, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 291 }] }] }, { "type": "Box", "props": { "y": 149, "x": 0 }, "compId": 389, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 236, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 390, "child": [{ "type": "Label", "props": { "text": "状态", "right": 0, "left": 0, "height": 26, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 391 }] }, { "type": "Image", "props": { "y": 0, "x": 237, "width": 236, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 392, "child": [{ "type": "Label", "props": { "text": "金额", "right": 0, "left": 0, "height": 26, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 393 }] }, { "type": "Image", "props": { "y": 0, "x": 473, "width": 236, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 394, "child": [{ "type": "Label", "props": { "text": "时间", "right": 0, "left": 0, "height": 26, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 395 }] }, { "type": "Image", "props": { "y": 0, "x": 710, "width": 236, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 396, "child": [{ "type": "Label", "props": { "text": "备注", "right": 0, "left": 0, "height": 26, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 397 }] }] }, { "type": "Box", "props": { "y": 300, "width": 400, "var": "txt_tips2", "height": 177, "centerX": 0 }, "compId": 409, "child": [{ "type": "Label", "props": { "y": 144, "text": "您暂时没有任何数据,先去游戏一下吧!", "fontSize": 24, "color": "#F8F8F8", "centerX": 0, "alpha": 0.43 }, "compId": 399 }, { "type": "Image", "props": { "x": 159, "skin": "comp/bg_data_null.png", "centerX": 0 }, "compId": 400 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 104, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 106 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 107 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_user_info.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 108 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 105, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 109, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_pc_grxx.png", "name": "bg_normal", "height": 96 }, "compId": 110 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_pc_grxx_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 111 }] }] }, { "type": "Box", "props": { "width": 978, "var": "b_touzujilv", "top": 130, "height": 581, "centerX": 150 }, "compId": 330, "child": [{ "type": "Image", "props": { "y": 0, "width": 967, "skin": "comp/panel_bg1.png", "right": 0, "left": 0, "height": 584 }, "compId": 331 }, { "type": "List", "props": { "y": 133, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "right": 10, "left": 0, "height": 440 }, "compId": 332, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 333, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 946, "skin": "comp/list_itembg1.png", "sizeGrid": "14,13,10,13", "name": "item_bg", "height": 42 }, "compId": 334 }, { "type": "Label", "props": { "x": 0, "width": 151, "text": "123458", "name": "txt_1", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 336 }, { "type": "Label", "props": { "x": 159, "width": 150, "text": "欢乐麻将", "name": "txt_2", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 337 }, { "type": "Label", "props": { "x": 309, "width": 159, "text": "10253", "name": "txt_3", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 338 }, { "type": "Label", "props": { "x": 479, "width": 148, "text": "25058", "name": "txt_4", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 339 }, { "type": "Label", "props": { "x": 795, "width": 151, "text": "+88.88", "name": "txt_6", "height": 26, "fontSize": 26, "color": "#00F41C", "centerY": 0, "align": "center" }, "compId": 340 }, { "type": "Label", "props": { "x": 627, "width": 159, "text": "2019-10-10 10:00", "name": "txt_5", "height": 20, "fontSize": 20, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 377 }] }] }, { "type": "Label", "props": { "y": 29, "x": 20, "text": "选择平台", "fontSize": 24, "color": "#A1A1A1" }, "compId": 346 }, { "type": "Image", "props": { "y": 68.5, "x": 2, "width": 158, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 352, "child": [{ "type": "Label", "props": { "text": "注单号", "right": 0, "left": 0, "height": 26, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 353 }] }, { "type": "Image", "props": { "y": 68, "x": 160, "width": 158, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 354, "child": [{ "type": "Label", "props": { "text": "游戏名称", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 355 }] }, { "type": "Image", "props": { "y": 68, "x": 318, "width": 158, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 356, "child": [{ "type": "Label", "props": { "text": "投注金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 357 }] }, { "type": "Image", "props": { "y": 68, "x": 476, "width": 158, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 358, "child": [{ "type": "Label", "props": { "text": "有效投注", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 359 }] }, { "type": "Image", "props": { "y": 68.5, "x": 792, "width": 158, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 360, "child": [{ "type": "Label", "props": { "text": "结算", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 361 }] }, { "type": "ComboBox", "props": { "y": 27, "x": 124.5, "width": 178, "var": "cb_pt", "stateNum": 1, "skin": "comp/combobox.png", "selectedIndex": 0, "scrollBarSkin": "comp/vscroll.png", "labelSize": 22, "labelColors": "#DFDFDF,#DFDFDF,#DFDFDF,#DFDFDF", "itemSize": 24, "itemColors": "#847C68,#ffffff,#ffffff,##847C68,#847C68", "height": 36 }, "compId": 370 }, { "type": "Label", "props": { "y": 31, "text": "开始时间", "fontSize": 24, "color": "#A1A1A1", "centerX": -134 }, "compId": 371 }, { "type": "Image", "props": { "y": 28, "width": 178, "var": "time_start", "stateNum": 1, "skin": "comp/combobox.png", "selectedLabel": "AG视讯", "labels": "AG视讯,电子游戏", "labelSize": 22, "labelColors": "#DFDFDF,#DFDFDF,#DFDFDF,#DFDFDF", "itemSize": 24, "itemColors": "#847C68,#ffffff,#ffffff,##847C68,#847C68", "height": 36, "centerX": 0 }, "compId": 372, "child": [{ "type": "Label", "props": { "y": 0, "x": 4, "width": 151, "text": "2019-12-12", "height": 24, "fontSize": 24, "color": "#DFDFDF", "centerY": 0 }, "compId": 402 }] }, { "type": "Label", "props": { "y": 30, "text": "结束时间", "right": 188, "fontSize": 24, "color": "#A1A1A1" }, "compId": 373 }, { "type": "Image", "props": { "y": 25, "width": 178, "var": "time_end", "stateNum": 1, "skin": "comp/combobox.png", "selectedLabel": "AG视讯", "right": 10, "labels": "AG视讯,电子游戏", "labelSize": 22, "labelColors": "#DFDFDF,#DFDFDF,#DFDFDF,#DFDFDF", "itemSize": 24, "itemColors": "#847C68,#ffffff,#ffffff,##847C68,#847C68", "height": 36 }, "compId": 374, "child": [{ "type": "Label", "props": { "x": 4, "width": 151, "text": "2019-12-12", "height": 24, "fontSize": 24, "color": "#DFDFDF", "centerY": 0 }, "compId": 401 }] }, { "type": "Image", "props": { "y": 68.5, "x": 634, "width": 158, "skin": "comp/list_title2.png", "sizeGrid": "2,2,2,2" }, "compId": 375, "child": [{ "type": "Label", "props": { "text": "投注时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 376 }] }, { "type": "Box", "props": { "y": 247, "width": 400, "var": "txt_tips1", "height": 177, "centerX": 0 }, "compId": 410, "child": [{ "type": "Label", "props": { "y": 144, "text": "您暂时没有任何数据,先去游戏一下吧!", "fontSize": 24, "color": "#F8F8F8", "centerX": 0, "alpha": 0.43 }, "compId": 411 }, { "type": "Image", "props": { "x": 159, "skin": "comp/bg_data_null.png", "centerX": 0 }, "compId": 412 }] }] }], "loadList": ["bgs/ic_qipai_bg.png", "comp/dactivity_nav_left.png", "bgs/ic_pc_title.png", "icons/ic_dot.png", "comp/ic_input_bg.png", "btns/ic_edit.png", "comp/panel_bg1.png", "comp/hscroll.png", "comp/tab_1.png", "comp/tab_2.png", "comp/combobox.png", "comp/vscroll.png", "comp/list_itembg1.png", "comp/list_title2.png", "comp/bg_data_null.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_user_info.png", "btns/ic_pc_grxx.png", "btns/ic_pc_grxx_pressed.png"], "loadList3D": [] };
        return UserInfoUI;
    }(View));
    ui.UserInfoUI = UserInfoUI;
    REG("ui.UserInfoUI", UserInfoUI);
    var VerifyBankPasswordUI = /** @class */ (function (_super) {
        __extends(VerifyBankPasswordUI, _super);
        function VerifyBankPasswordUI() {
            return _super.call(this) || this;
        }
        VerifyBankPasswordUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(VerifyBankPasswordUI.uiView);
        };
        VerifyBankPasswordUI.uiView = { "type": "Dialog", "props": { "width": 784, "height": 544 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_tip.png" }, "compId": 3 }, { "type": "Label", "props": { "y": 140, "wordWrap": true, "width": 677, "text": "亲爱的玩家，为了您的账户安全，每次提款都需要输入取款密码", "height": 61, "fontSize": 24, "color": "#FFD39F", "centerX": 0 }, "compId": 4 }, { "type": "Label", "props": { "y": 272, "x": 95, "text": "输入密码", "fontSize": 24, "color": "#FFFFFF" }, "compId": 5 }, { "type": "Box", "props": { "y": 259, "x": 217, "var": "b_input1" }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/mm_bg.png" }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 11 }] }, { "type": "Image", "props": { "y": 0, "x": 72, "skin": "bgs/mm_bg.png" }, "compId": 12, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 13 }] }, { "type": "Image", "props": { "y": 0, "x": 144, "skin": "bgs/mm_bg.png" }, "compId": 14, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 15 }] }, { "type": "Image", "props": { "y": 0, "x": 215, "skin": "bgs/mm_bg.png" }, "compId": 16, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 17 }] }, { "type": "Image", "props": { "y": 0, "x": 287, "skin": "bgs/mm_bg.png" }, "compId": 18, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 19 }] }, { "type": "Image", "props": { "y": 0, "x": 359, "skin": "bgs/mm_bg.png" }, "compId": 20, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 56, "text": "*", "height": 24, "fontSize": 24, "color": "#FFD39F", "align": "center" }, "compId": 21 }] }, { "type": "TextInput", "props": { "y": 0, "x": 0, "width": 417, "var": "txt_input", "type": "number", "height": 53 }, "compId": 22 }] }, { "type": "Button", "props": { "y": 404, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_button_cancel.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": -142 }, "compId": 9 }, { "type": "Button", "props": { "y": 404, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_button_sure.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 118 }, "compId": 36 }], "loadList": ["bgs/ic_dialog_tip.png", "bgs/mm_bg.png", "btns/ic_button_cancel.png", "btns/ic_button_sure.png"], "loadList3D": [] };
        return VerifyBankPasswordUI;
    }(Dialog));
    ui.VerifyBankPasswordUI = VerifyBankPasswordUI;
    REG("ui.VerifyBankPasswordUI", VerifyBankPasswordUI);
    var XiMaUI = /** @class */ (function (_super) {
        __extends(XiMaUI, _super);
        function XiMaUI() {
            return _super.call(this) || this;
        }
        XiMaUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(XiMaUI.uiView);
        };
        XiMaUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/xm_bg1.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 78 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 48, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 50 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 51 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_xima_title.png", "centerY": 0 }, "compId": 52 }] }, { "type": "Box", "props": { "width": 1246, "height": 580, "centerX": 0, "bottom": 10 }, "compId": 80, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1246, "skin": "bgs/xm_bg2.png", "height": 589 }, "compId": 79 }, { "type": "Image", "props": { "y": 66.5, "x": 0, "skin": "bgs/xm_bg3.png" }, "compId": 102 }, { "type": "Box", "props": { "y": 5, "x": 0 }, "compId": 81, "child": [{ "type": "Image", "props": { "y": 0, "x": 4, "width": 206, "skin": "comp/list_title2.png", "height": 58 }, "compId": 82, "child": [{ "type": "Label", "props": { "y": 17, "text": "返水类型", "right": 0, "left": 0, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 86 }] }, { "type": "Image", "props": { "y": 0, "x": 211, "width": 206, "skin": "comp/list_title2.png", "height": 58 }, "compId": 94, "child": [{ "type": "Label", "props": { "y": 17, "text": "下注金额", "right": 0, "left": 0, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 95 }] }, { "type": "Image", "props": { "y": 0, "x": 418, "width": 206, "skin": "comp/list_title2.png", "height": 58 }, "compId": 96, "child": [{ "type": "Label", "props": { "y": 17, "text": "有效投注", "right": 0, "left": 0, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 97 }] }, { "type": "Image", "props": { "y": 0, "x": 624, "width": 206, "skin": "comp/list_title2.png", "height": 58 }, "compId": 90, "child": [{ "type": "Label", "props": { "y": 17, "text": "实际输赢", "right": 0, "left": 0, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 91 }] }, { "type": "Image", "props": { "y": 0, "x": 831, "width": 206, "skin": "comp/list_title2.png", "height": 58 }, "compId": 92, "child": [{ "type": "Label", "props": { "y": 17, "text": "返水比例", "right": 0, "left": 0, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 93 }] }, { "type": "Image", "props": { "y": 0, "x": 1038, "width": 206, "skin": "comp/list_title2.png", "height": 58 }, "compId": 98, "child": [{ "type": "Label", "props": { "y": 17, "text": "返水金额", "right": 0, "left": 0, "fontSize": 24, "color": "#FFD39F", "centerY": 0, "align": "center" }, "compId": 99 }] }] }, { "type": "List", "props": { "y": 63, "x": 0, "width": 1245, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 444 }, "compId": 100, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 1244, "renderType": "render", "height": 65 }, "compId": 101, "child": [{ "type": "Image", "props": { "y": 61, "skin": "bgs/xm_line.png", "name": "img_line" }, "compId": 103 }, { "type": "Image", "props": { "y": 0, "x": 208, "width": 1034, "skin": "comp/list_itembg1.png", "sizeGrid": "14,13,10,13", "name": "item_bg", "height": 65 }, "compId": 105 }, { "type": "Label", "props": { "x": 0, "width": 208, "text": "label", "name": "txt_0", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 106 }, { "type": "Label", "props": { "x": 208, "width": 208, "text": "label", "name": "txt_1", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 107 }, { "type": "Label", "props": { "x": 416, "width": 208, "text": "label", "name": "txt_2", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 108 }, { "type": "Label", "props": { "x": 624, "width": 208, "text": "label", "name": "txt_3", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 109 }, { "type": "Label", "props": { "x": 832, "width": 208, "text": "label", "name": "txt_4", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 110 }, { "type": "Label", "props": { "x": 1040, "width": 199, "text": "label", "name": "txt_5", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 0, "align": "center" }, "compId": 111 }] }] }, { "type": "Label", "props": { "x": 30, "width": 129, "text": "返水总金额:", "height": 24, "fontSize": 24, "color": "#A1A1A1", "centerY": 261, "align": "left" }, "compId": 113 }, { "type": "Label", "props": { "x": 159, "width": 129, "var": "txt_money", "text": "1000元", "height": 24, "fontSize": 24, "color": "#FF9F08", "centerY": 261, "align": "left" }, "compId": 114 }, { "type": "Button", "props": { "y": 533, "x": 1072, "var": "btn_get", "stateNum": 1, "skin": "btns/xm_yjlq.png" }, "compId": 115 }, { "type": "Label", "props": { "var": "txt_tips1", "text": "您暂时没有任何数据,先去游戏一下吧!", "fontSize": 24, "color": "#F8F8F8", "centerY": 33, "centerX": 9, "alpha": 0.43 }, "compId": 116, "child": [{ "type": "Image", "props": { "y": -80, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 117 }] }] }], "loadList": ["bgs/xm_bg1.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_xima_title.png", "bgs/xm_bg2.png", "bgs/xm_bg3.png", "comp/list_title2.png", "comp/vscroll.png", "bgs/xm_line.png", "comp/list_itembg1.png", "btns/xm_yjlq.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return XiMaUI;
    }(View));
    ui.XiMaUI = XiMaUI;
    REG("ui.XiMaUI", XiMaUI);
})(ui = exports.ui || (exports.ui = {}));

},{}]},{},[1]);
