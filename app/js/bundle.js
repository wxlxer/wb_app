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
    };
    return Main;
}(gamelib.core.GameMain));
//激活启动类
new Main();

},{"./com/Hall":6,"./ui/layaMaxUI":40}],2:[function(require,module,exports){
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
        this._list.selectHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    BaseHistroy.prototype.setData = function (data) {
        this._list.dataSource = data;
        this._tips.visible = data.length == 0;
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
function copyStr(str) {
    utils.tools.copyToClipboard(str, function (obj) {
        if (obj.result == 0) {
            UiMainager_1.g_uiMgr.showTip("复制成功");
        }
    });
}
exports.copyStr = copyStr;
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
        // g_net.request(gamelib.GameMsg.Getapi,{});
        // g_net.request(gamelib.GameMsg.Systemseting,{});
        //请求热门游戏
        // g_net.request(gamelib.GameMsg.Getapigame,{gametype:-3,pageSize:100,pageIndex:1});
        // g_net.request(gamelib.GameMsg.Getapiassort,{});
        // g_net.request(gamelib.GameMsg.Getapitypegame,{});
        // g_net.request(gamelib.GameMsg.Getapigame,{});
        this._tab.selectedIndex = 0;
    };
    Hall.prototype.reciveNetMsg = function (msg, requestData, data) {
        console.log(msg, requestData, data);
        if (data.retCode != 0) {
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

},{"./Global":5,"./HuoDong":7,"./KeFu":8,"./SetUi":11,"./UiMainager":12,"./UserInfo":13,"./chongzhi/ChongZhi":16,"./control/TabList":20,"./data/ChongZhiData":21,"./data/GameData":22,"./data/PlayerData":23,"./gameList/GameList":24,"./gameList/PlatfromList":25,"./login/LoginUi":26,"./login/RegisterUi":27,"./mail/MailUi":29,"./notice/Notice":30,"./notice/NoticeMsg":31,"./tixian/TiXianUi":33,"./tuiguang/TuiGuang":37,"./xima/XiMa":38}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var TabList_1 = require("./control/TabList");
var HuoDong = /** @class */ (function (_super) {
    __extends(HuoDong, _super);
    function HuoDong() {
        return _super.call(this, "ui.HuoDongUiUI") || this;
    }
    HuoDong.prototype.init = function () {
        this._list = this._res["list_1"];
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { skins: ["btns/ic_act_zonghe.png", "btns/ic_act_zonghe_pressed.png"] },
            { skins: ["btns/ic_act_qipai.png", "btns/ic_act_qipai_pressed.png"] },
            { skins: ["btns/ic_act_buyu.png", "btns/ic_act_buyu_pressed.png"] },
            { skins: ["btns/ic_act_dianzi.png", "btns/ic_act_dianzi_pressed.png"] },
            { skins: ["btns/ic_act_shixun.png", "btns/ic_act_shixun_pressed.png"] },
            { skins: ["btns/ic_act_sports.png", "btns/ic_act_sports_pressed.png"] },
        ];
        this._tab.selectedIndex = 0;
        this._list.selectHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    HuoDong.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    HuoDong.prototype.onTabChange = function (index) {
    };
    HuoDong.prototype.onItemRender = function (box, index) {
    };
    return HuoDong;
}(BasePanel_1.default));
exports.default = HuoDong;

},{"./BasePanel":4,"./control/TabList":20}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var TabList_1 = require("./control/TabList");
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
            { skins: ["btns/ic_cus_qq.png", "btns/ic_cus_qq_pressed.png"] },
            { skins: ["btns/ic_cus_vx.png", "btns/ic_custom_vx_pressed.png"] },
            { skins: ["btns/ic_cus_fqc.png", "btns/ic_cus_fqc_pressed.png"] }
        ];
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
    };
    KeFu.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    KeFu.prototype.onTabChange = function (index) {
    };
    return KeFu;
}(BasePanel_1.default));
exports.default = KeFu;

},{"./BasePanel":4,"./control/TabList":20}],9:[function(require,module,exports){
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

},{"./UiMainager":12,"./data/PlayerData":23}],12:[function(require,module,exports){
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
            { skins: ["btns/ic_pc_zhmx.png", "btns/ic_pc_zhmx_pressed.png"] },
            { skins: ["btns/ic_pc_grbb.png", "btns/ic_pc_grbb_pressed.png"] },
        ];
        this._info = new Info(this._res);
        this._touzu = new TouZuHistroy(this._res);
        this._baobiao = new GeRenBapBiao(this._res);
        this._mingXi = new ZhangHuMingXi(this._res);
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
        this._baobiao.close();
    };
    UserInfo.prototype.showTZJL = function () {
        this._touzu.show();
        this._info.close();
        this._mingXi.close();
        this._baobiao.close();
    };
    UserInfo.prototype.showGRBB = function () {
        this._baobiao.show();
        this._touzu.close();
        this._info.close();
        this._mingXi.close();
    };
    UserInfo.prototype.showMingXi = function () {
        this._mingXi.show();
        this._baobiao.close();
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
        _this._tab = new TabList_1.default(res['list_tab1']);
        _this._tab.tabChangeHander = Laya.Handler.create(_this, _this.onTabChange, null, false);
        _this._tab.dataSource = [
            { label: "棋牌投注记录", colors: ["#919196", "#33200B"] },
            { label: "视讯投注记录", colors: ["#919196", "#33200B"] },
            { label: "体育投注记录", colors: ["#919196", "#33200B"] },
            { label: "电子投注记录", colors: ["#919196", "#33200B"] },
            { label: "捕鱼投注记录", colors: ["#919196", "#33200B"] }
        ];
        _this._tips = res['txt_tips1'];
        _this.cb_time = res['cb_time'];
        _this.cb_pt = res['cb_pt'];
        _this.addBtnToList('btn_time', res);
        _this.addBtnToList('btn_pt', res);
        _this._list = res['list_1'];
        _this._list.renderHandler = Laya.Handler.create(_this, _this.onListItemRender, null, false);
        _this.cb_time.on(Laya.Event.CHANGE, _this, _this.onTimeChange);
        _this.cb_pt.on(Laya.Event.CHANGE, _this, _this.onPtChange);
        return _this;
    }
    TouZuHistroy.prototype.onTabChange = function (index) {
        console.log(index);
    };
    TouZuHistroy.prototype.onTimeChange = function () {
        console.log(this.cb_time.selectedIndex);
    };
    TouZuHistroy.prototype.onPtChange = function () {
        console.log(this.cb_pt.selectedIndex);
    };
    TouZuHistroy.prototype.onListItemRender = function (box, index) {
        var bg = getChildByName(box, 'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_item_bg1.png" : "comp/list_item_bg2.png";
    };
    TouZuHistroy.prototype.show = function () {
        _super.prototype.show.call(this);
        this.cb_time.selectedIndex = 0;
        this.cb_pt.selectedIndex = 0;
    };
    TouZuHistroy.prototype.setData = function (arr) {
    };
    return TouZuHistroy;
}(Plug_1.default));
exports.TouZuHistroy = TouZuHistroy;
//个人报表
var GeRenBapBiao = /** @class */ (function (_super) {
    __extends(GeRenBapBiao, _super);
    function GeRenBapBiao(res) {
        var _this = _super.call(this, res['b_baoBiao']) || this;
        _this._tab = new TabList_1.default(res['list_tab2']);
        _this._tab.tabChangeHander = Laya.Handler.create(_this, _this.onTabChange, null, false);
        _this._tab.dataSource = [
            { label: "棋牌报表", colors: ["#919196", "#33200B"] },
            { label: "电子报表", colors: ["#919196", "#33200B"] },
            { label: "捕鱼报表", colors: ["#919196", "#33200B"] },
            { label: "视讯报表", colors: ["#919196", "#33200B"] },
            { label: "体育报表", colors: ["#919196", "#33200B"] }
        ];
        _this._time = res['txt_time3'];
        _this._ylze = res['txt_ylze'];
        _this.txt_yxtzze = res['txt_yxtzze'];
        _this.txt_pcze = res['txt_pcze'];
        _this.txt_fdze = res['txt_fdze'];
        return _this;
    }
    GeRenBapBiao.prototype.onTabChange = function (index) {
        console.log(index);
    };
    return GeRenBapBiao;
}(Plug_1.default));
exports.GeRenBapBiao = GeRenBapBiao;
//账户明细
var ZhangHuMingXi = /** @class */ (function (_super) {
    __extends(ZhangHuMingXi, _super);
    function ZhangHuMingXi(res) {
        var _this = _super.call(this, res['b_mingxi']) || this;
        _this._list = res['list_mx'];
        _this._list.renderHandler = Laya.Handler.create(_this, _this.onListItemRender, null, false);
        _this.addBtnToList('btn_time1', res);
        _this.addBtnToList('btn_status', res);
        _this._txt_time = res['txt_time1'];
        _this._txt_status = res['txt_status'];
        _this._txt_cz = res['txt_cz'];
        _this._txt_tx = res['txt_tx'];
        _this._txt_yh = res['txt_yh'];
        _this._txt_fs = res['txt_fs'];
        _this._txt_ye = res['txt_ye'];
        _this._txt_tips = res['txt_tips2'];
        return _this;
    }
    ZhangHuMingXi.prototype.onListItemRender = function (box, index) {
        var bg = getChildByName(box, 'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_item_bg1.png" : "comp/list_item_bg2.png";
    };
    return ZhangHuMingXi;
}(Plug_1.default));
exports.ZhangHuMingXi = ZhangHuMingXi;

},{"./BasePanel":4,"./Plug":10,"./control/TabList":20,"./data/PlayerData":23}],14:[function(require,module,exports){
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

},{"../Plug":10,"../data/ChongZhiData":21}],16:[function(require,module,exports){
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
        this.addBtnToListener('btn_sx');
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
            case "btn_sx": //刷新
                UiMainager_1.g_uiMgr.showMiniLoading();
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

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"../data/ChongZhiData":21,"../data/PlayerData":23,"./BankCzXX":14,"./BankList":15,"./ChongZhiHistroy":17,"./ChoseMoney":18,"./ErweimaCz":19}],17:[function(require,module,exports){
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
            page: 0,
            pagesize: 100,
            inputtime1: start_date,
            inputtime2: end_date
        });
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo, {
            moneytype: 2,
            page: 0,
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
var UiMainager_1 = require("../UiMainager");
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
        _this.addBtnToList("btn_copy2", _this._res);
        _this.addBtnToList("btn_save", _this._res);
        _this.addBtnToList("btn_open", _this._res);
        _this.addBtnToList("btn_tjcz", _this._res);
        _this.addBtnToList("btn_prev", _this._res);
        return _this;
    }
    ErweimaCz.prototype.setData = function (data, money, tabIndex) {
        this._data = data;
        this._res.txt_bankName.text = data['payname'];
        this._res.txt_name.text = "";
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
            case "btn_copy2":
                Global_1.copyStr(this._res.txt_name.text);
                break;
            case "btn_save":
                Global_1.saveImageToGallery(this._res.img_ewm);
                break;
            case "btn_open":
                break;
            case "btn_tjcz":
                if (this._res.txt_info.text == "") {
                    UiMainager_1.g_uiMgr.showTip("转账信息不能为空", true);
                    return;
                }
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

},{"../Global":5,"../Plug":10,"../UiMainager":12}],20:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
        for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
            var temp = arr_2[_i];
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"../UiMainager":12,"../data/GameData":22}],25:[function(require,module,exports){
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

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"../data/GameData":22,"./GameList":24}],26:[function(require,module,exports){
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

},{"../Global":5,"../UiMainager":12}],27:[function(require,module,exports){
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

},{"../Global":5,"../UiMainager":12}],28:[function(require,module,exports){
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
    };
    MailInfo.prototype.setData = function (data) {
    };
    return MailInfo;
}(gamelib.core.Ui_NetHandle));
exports.default = MailInfo;

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MailInfo_1 = require("./MailInfo");
var MailUi = /** @class */ (function (_super) {
    __extends(MailUi, _super);
    function MailUi() {
        return _super.call(this, "ui.MailUI") || this;
    }
    MailUi.prototype.init = function () {
        this._list = this._res["list_1"];
        this._list.selectHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    MailUi.prototype.onItemRender = function (box, index) {
        var btn = getChildByName(box, 'btn_check');
        btn.offAll(Laya.Event.CLICK);
        var md = this._list.dataSource[index];
        btn.on(Laya.Event.CLICK, this, this.onClickInfo, [md]);
    };
    MailUi.prototype.onClickInfo = function (md, evt) {
        this._info = this._info || new MailInfo_1.default();
        this._info.setData(md);
        this._info.show();
    };
    return MailUi;
}(gamelib.core.Ui_NetHandle));
exports.default = MailUi;

},{"./MailInfo":28}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var TiXianHistroy = /** @class */ (function (_super) {
    __extends(TiXianHistroy, _super);
    function TiXianHistroy() {
        return _super.call(this, 'ui.TiXianHistroyUI') || this;
    }
    TiXianHistroy.prototype.onItemRender = function (box, index) {
    };
    return TiXianHistroy;
}(BaseHistroy_1.default));
exports.default = TiXianHistroy;

},{"../BaseHistroy":3}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TiXianHistroy_1 = require("./TiXianHistroy");
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
var PlayerData_1 = require("../data/PlayerData");
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
            { skins: ["btns/ic_withdraw_blance.png", "btns/ic_withdraw_blance_pressed.png"] },
            { skins: ["btns/ic_withdraw_card.png", "btns/ic_withdraw_card_pressed.png"] }
        ];
        this.addBtnToListener("btn_tx");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_bangding");
        this.addBtnToListener("btn_addBank");
        this.addBtnToListener("btn_prev");
        this.addBtnToListener("btn_bd");
        this.addBtnToListener("btn_histroy");
        this._list = this._res['list_1'];
        this._list.dataSource = [];
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
    };
    TiXianUi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._res['txt_money'].text = PlayerData_1.g_playerData.m_money + "元";
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    TiXianUi.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showTiXian();
        else if (index == 1)
            this.showGuanLi();
    };
    TiXianUi.prototype.onItemRender = function (box, index) {
    };
    TiXianUi.prototype.showTiXian = function () {
        this._res['b_tx'].visible = true;
        this._res['b_bank'].visible = false;
        this._res['b_add'].visible = false;
    };
    TiXianUi.prototype.showGuanLi = function () {
        this._res['b_tx'].visible = false;
        this._res['b_bank'].visible = true;
        this._res['b_add'].visible = false;
    };
    TiXianUi.prototype.showAddBank = function () {
        this._res['b_tx'].visible = false;
        this._res['b_bank'].visible = false;
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
            case "btn_prev":
                this.showGuanLi();
                break;
            case "btn_bd":
                //绑定
                break;
            case "btn_tx": //确认体现
                break;
            case "btn_histroy":
                this._histroy = this._histroy || new TiXianHistroy_1.default();
                this._histroy.show();
                break;
        }
    };
    return TiXianUi;
}(BasePanel_1.default));
exports.default = TiXianUi;

},{"../BasePanel":4,"../control/TabList":20,"../data/PlayerData":23,"./TiXianHistroy":32}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var FanYongList = /** @class */ (function (_super) {
    __extends(FanYongList, _super);
    function FanYongList() {
        return _super.call(this, "ui.FanYongListUI") || this;
    }
    FanYongList.prototype.onItemRender = function (box, index) {
    };
    return FanYongList;
}(BaseHistroy_1.default));
exports.default = FanYongList;

},{"../BaseHistroy":3}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetYongJin = /** @class */ (function (_super) {
    __extends(GetYongJin, _super);
    function GetYongJin() {
        return _super.call(this, 'ui.LingQuYongJinUI') || this;
    }
    GetYongJin.prototype.init = function () {
        this.addBtnToListener(this._res['btn_ok']);
        this.addBtnToListener(this._res['btn_all']);
    };
    return GetYongJin;
}(gamelib.core.Ui_NetHandle));
exports.default = GetYongJin;

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var LingQuHistroy = /** @class */ (function (_super) {
    __extends(LingQuHistroy, _super);
    function LingQuHistroy() {
        return _super.call(this, 'ui.LingQuHistroyUI') || this;
    }
    LingQuHistroy.prototype.onItemRender = function (box, index) {
    };
    return LingQuHistroy;
}(BaseHistroy_1.default));
exports.default = LingQuHistroy;

},{"../BaseHistroy":3}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetYongJin_1 = require("./GetYongJin");
var LingQuHistroy_1 = require("./LingQuHistroy");
var FanYongList_1 = require("./FanYongList");
var BasePanel_1 = require("../BasePanel");
var UiMainager_1 = require("../UiMainager");
var TabList_1 = require("../control/TabList");
var TuiGuang = /** @class */ (function (_super) {
    __extends(TuiGuang, _super);
    function TuiGuang() {
        return _super.call(this, 'ui.TuiGuangUI') || this;
    }
    TuiGuang.prototype.init = function () {
        this.addBtnToListener('btn_get');
        this.addBtnToListener('btn_histroy');
        this.addBtnToListener('btn_fylist');
        this.addBtnToListener('btn_fx_hy');
        this.addBtnToListener('btn_fx_qq');
        this.addBtnToListener('btn_fx_pyq');
        this.addBtnToListener('btn_copy');
        this.addBtnToListener('btn_refresh');
        this.addBtnToListener('btn_search');
        this.addBtnToListener('btn_reset');
        this._qrc = new gamelib.control.QRCodeImg(this._res['img_ewm']);
        this._list = this._res["list_1"];
        this._tab = new TabList_1.default(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { label: "我的推广", colors: ["#f9d6ab", "#faf7f2"] }, { label: "直属查询", colors: ["#f9d6ab", "#faf7f2"] },
            { label: "业绩查询", colors: ["#f9d6ab", "#faf7f2"] }, { label: "推广教程", colors: ["#f9d6ab", "#faf7f2"] }
        ];
        this._boxs = [];
        for (var i = 1; i <= 4; i++) {
            this._boxs.push(this._res['b_' + i]);
            this._res['b_' + i].visible = false;
        }
        this._list.selectHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    TuiGuang.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
    };
    TuiGuang.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showMyTuiGuang();
        else if (index == 1)
            this.showZSCX();
        else if (index == 2)
            this.showYeJi();
        else
            this.showJiaoCheng();
        this.showBox(index);
    };
    TuiGuang.prototype.onItemRender = function (box, index) {
    };
    /**
     * 显示我的推广
     */
    TuiGuang.prototype.showMyTuiGuang = function () {
    };
    /**
     * 显示直属查询
     */
    TuiGuang.prototype.showZSCX = function () {
    };
    //业绩查询
    TuiGuang.prototype.showYeJi = function () {
    };
    TuiGuang.prototype.showJiaoCheng = function () {
    };
    TuiGuang.prototype.showBox = function (index) {
        for (var i = 0; i < this._boxs.length; i++) {
            this._boxs[i].visible = i == index;
        }
    };
    TuiGuang.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_get":
                this._getYongJin = this._getYongJin || new GetYongJin_1.default();
                this._getYongJin.show();
                break;
            case "btn_histroy":
                this._lingQuHistroy = this._lingQuHistroy || new LingQuHistroy_1.default();
                this._lingQuHistroy.show();
                break;
            case "btn_fylist":
                this._fanYongList = this._fanYongList || new FanYongList_1.default();
                this._fanYongList.show();
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
            case "btn_refresh":
                break;
            case "btn_search":
                break;
            case "btn_reset":
                this._res['txt_newPwd1'].text = "";
                break;
        }
    };
    TuiGuang.prototype.doShare = function (name) {
    };
    return TuiGuang;
}(BasePanel_1.default));
exports.default = TuiGuang;

},{"../BasePanel":4,"../UiMainager":12,"../control/TabList":20,"./FanYongList":34,"./GetYongJin":35,"./LingQuHistroy":36}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XiMaHistroy_1 = require("./XiMaHistroy");
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
var XiMa = /** @class */ (function (_super) {
    __extends(XiMa, _super);
    function XiMa() {
        return _super.call(this, "ui.XiMaUI") || this;
    }
    XiMa.prototype.init = function () {
        this.addBtnToListener("btn_sd");
        this.addBtnToListener("btn_histroy");
        this._tab = new TabList_1.default(this._res["list_tab"]);
        this._list = this._res["list_1"];
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.dataSource = [
            { skins: ["btns/ic_xima_qipai.png", "btns/ic_xima_qipai_pressed.png"] },
            { skins: ["btns/ic_xima_zhenren.png", "btns/ic_xima_zhenren_pressed.png"] },
            { skins: ["btns/ic_xima_sport.png", "btns/ic_xima_sport_pressed.png"] },
            { skins: ["btns/ic_xima_dianzi.png", "btns/ic_xima_dianzi_pressed.png"] },
            { skins: ["btns/ic_xima_buyu.png", "btns/ic_xima_buyu_pressed.png"] }
        ];
        this._list.selectHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    XiMa.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    XiMa.prototype.onTabChange = function (index) {
    };
    XiMa.prototype.onItemRender = function (box, index) {
    };
    XiMa.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_histroy":
                this._histroy = this._histroy || new XiMaHistroy_1.default();
                this._histroy.show();
                break;
            case "btn_sd":
                break;
        }
    };
    return XiMa;
}(BasePanel_1.default));
exports.default = XiMa;

},{"../BasePanel":4,"../control/TabList":20,"./XiMaHistroy":39}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var XiMaHistroy = /** @class */ (function (_super) {
    __extends(XiMaHistroy, _super);
    function XiMaHistroy() {
        return _super.call(this, 'ui.XiMaHistroyUI') || this;
    }
    XiMaHistroy.prototype.onItemRender = function (box, index) {
    };
    return XiMaHistroy;
}(BaseHistroy_1.default));
exports.default = XiMaHistroy;

},{"../BaseHistroy":3}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }(Laya.Dialog));
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
    }(Laya.View));
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
    }(Laya.Dialog));
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
        ChongZhiUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 179 }, { "type": "Image", "props": { "top": 0, "skin": "comp/dactivity_nav_left.png", "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "y": 120, "x": 0, "width": 283, "var": "b_left", "top": 120, "left": 0, "height": 600 }, "compId": 144, "child": [{ "type": "List", "props": { "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "top": 0, "spaceY": 5, "right": 0, "left": 0, "bottom": 0 }, "compId": 146, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 147, "child": [{ "type": "Image", "props": { "x": 0, "width": 283, "skin": "bgs/ic_charge_unchose.png", "name": "bg_normal", "height": 86 }, "compId": 148 }, { "type": "Image", "props": { "width": 283, "skin": "bgs/ic_charge_chose.png", "name": "bg_selected", "height": 86 }, "compId": 149 }, { "type": "Image", "props": { "x": 16, "width": 50, "skin": "icons/nfc_icon.png", "name": "img_type", "height": 50, "centerY": 0 }, "compId": 150 }, { "type": "Label", "props": { "y": 30, "x": 89, "width": 189, "text": "label", "name": "txt_label", "height": 26, "fontSize": 26 }, "compId": 152 }, { "type": "Image", "props": { "y": 5.5, "x": 223, "skin": "icons/ic_charge_discount.png", "scaleY": 0.5, "scaleX": 0.5, "name": "img_yh" }, "compId": 153 }] }] }] }, { "type": "Box", "props": { "y": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 4, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 5 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 6 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_recharge_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 7 }, { "type": "Image", "props": { "skin": "bgs/ic_recharge_account.png", "scaleY": 0.8, "scaleX": 0.8, "centerY": 2, "centerX": 88 }, "compId": 8 }, { "type": "Button", "props": { "var": "btn_refresh", "stateNum": 1, "skin": "btns/btn_refresh.png", "right": 292, "centerY": 0 }, "compId": 10 }, { "type": "Button", "props": { "y": 27, "var": "btn_histroy", "stateNum": 1, "skin": "btns/ic_recharge_jilu.png", "scaleY": 0.8, "scaleX": 0.8, "right": 14 }, "compId": 9 }, { "type": "Label", "props": { "y": 46, "x": 655, "width": 238, "var": "txt_money", "text": "0.0", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 11 }] }, { "type": "Box", "props": { "y": 122, "var": "b_zf", "right": 5, "left": 298, "height": 598 }, "compId": 136, "child": [{ "type": "Cz_xx_chooseMoney", "props": { "runtime": "ui.Cz_xx_chooseMoneyUI" }, "compId": 190 }] }, { "type": "Box", "props": { "var": "b_erweima", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 182, "child": [{ "type": "Cz_xx_ewm", "props": { "centerX": 0, "runtime": "ui.Cz_xx_ewmUI" }, "compId": 188 }] }, { "type": "Box", "props": { "var": "b_banklist", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 39, "x": 60, "skin": "icons/ic_dot.png" }, "compId": 20 }, { "type": "Label", "props": { "y": 38, "x": 92, "text": "充值收款银行选择", "fontSize": 22, "color": "#d6c09a" }, "compId": 21 }, { "type": "List", "props": { "y": 83, "var": "list_banklist", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "right": 5, "left": 10, "height": 446 }, "compId": 130, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 131, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_member_find_bg.png", "sizeGrid": "16,24,13,24", "right": 0, "left": 0, "height": 144 }, "compId": 132 }, { "type": "Image", "props": { "y": 25, "x": 50, "width": 70, "skin": "icons/bankIcon.png", "sizeGrid": "30,34,26,34", "name": "img_bank", "height": 70 }, "compId": 22 }, { "type": "Label", "props": { "y": 25, "x": 148, "text": "网银、手机网页庄站通道送2%", "name": "txt_info", "fontSize": 30, "color": "#ffffff", "bold": true }, "compId": 133 }, { "type": "Label", "props": { "y": 79, "x": 148, "text": "2123156465464564.", "name": "txt_id", "fontSize": 30, "color": "#ffffff", "bold": true }, "compId": 134 }, { "type": "Button", "props": { "y": 40, "x": 766, "stateNum": 1, "skin": "btns/ic_to_recharge.png", "scaleY": 0.5, "scaleX": 0.5, "name": "btn_ok" }, "compId": 135 }] }] }] }, { "type": "Box", "props": { "var": "b_input", "top": 120, "right": 5, "left": 293, "bottom": 0 }, "compId": 26, "child": [{ "type": "Cz_xx_Bank", "props": { "centerX": 0, "runtime": "ui.Cz_xx_BankUI" }, "compId": 189 }] }], "loadList": ["bgs/ic_recharge_bg.png", "comp/dactivity_nav_left.png", "comp/vscroll.png", "bgs/ic_charge_unchose.png", "bgs/ic_charge_chose.png", "icons/nfc_icon.png", "icons/ic_charge_discount.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_recharge_title.png", "bgs/ic_recharge_account.png", "btns/btn_refresh.png", "btns/ic_recharge_jilu.png", "icons/ic_dot.png", "bgs/ic_member_find_bg.png", "icons/bankIcon.png", "btns/ic_to_recharge.png"], "loadList3D": [] };
        return ChongZhiUiUI;
    }(Laya.View));
    ui.ChongZhiUiUI = ChongZhiUiUI;
    REG("ui.ChongZhiUiUI", ChongZhiUiUI);
    var Cz_xx_BankUI = /** @class */ (function (_super) {
        __extends(Cz_xx_BankUI, _super);
        function Cz_xx_BankUI() {
            return _super.call(this) || this;
        }
        Cz_xx_BankUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(Cz_xx_BankUI.uiView);
        };
        Cz_xx_BankUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 20, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "left": 10 }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款银行", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 17 }] }, { "type": "Image", "props": { "y": 20, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "right": 10 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款信息", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 18 }] }, { "type": "Label", "props": { "y": 133, "x": 32, "text": "收款银行", "fontSize": 24, "color": "#a0a0a0" }, "compId": 5, "child": [{ "type": "Label", "props": { "y": 0, "x": 102, "width": 212, "var": "txt_bankName", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 19 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 20, "child": [{ "type": "Line", "props": { "y": 1, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 21 }] }, { "type": "Button", "props": { "y": -6, "x": 358, "var": "btn_copy1", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 22 }] }, { "type": "Label", "props": { "y": 209, "x": 32, "width": 98, "text": "收款人", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "center" }, "compId": 6, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_name", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 23 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 24, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 25 }] }, { "type": "Button", "props": { "y": -3, "x": 360, "var": "btn_copy2", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 26 }] }, { "type": "Label", "props": { "y": 283, "x": 32, "text": "收款账号", "fontSize": 24, "color": "#a0a0a0" }, "compId": 7, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_zh", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 27 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 28, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 29 }] }, { "type": "Button", "props": { "y": 0, "x": 356, "var": "btn_copy3", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 30 }] }, { "type": "Label", "props": { "y": 493, "x": 26, "text": "第一步:复制收款银行前往充值", "height": 24, "fontSize": 20, "color": "#919196", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 138, "x": 543, "text": "存款金额", "fontSize": 24, "color": "#a0a0a0" }, "compId": 10 }, { "type": "Image", "props": { "y": 126, "x": 654, "width": 302, "skin": "comp/ic_input_bg.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 11, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 279, "var": "txt_ckje", "type": "number", "prompt": "支付限额10-100000元", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 35 }] }, { "type": "Label", "props": { "y": 224, "x": 543, "text": "存款信息", "fontSize": 24, "color": "#a0a0a0" }, "compId": 12 }, { "type": "Image", "props": { "y": 212, "x": 654, "width": 302, "skin": "comp/ic_input_bg.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 13, "child": [{ "type": "TextInput", "props": { "y": 6, "x": 8, "width": 294, "var": "txt_ckrxm", "type": "text", "prompt": "请输入存款人姓名或卡号后四位", "height": 36, "fontSize": 20, "color": "#d6c09a" }, "compId": 36 }] }, { "type": "Label", "props": { "y": 487, "x": 530, "text": "第二步:充值完成，填写您的存款信息.最后提交充值", "height": 24, "fontSize": 20, "color": "#919196", "align": "center" }, "compId": 14 }, { "type": "Button", "props": { "y": 520, "x": 83, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 15 }, { "type": "Button", "props": { "y": 518, "x": 675, "var": "btn_tjcz", "stateNum": 1, "skin": "btns/ic_go.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 16 }, { "type": "Label", "props": { "y": 288, "x": 685, "text": "--提示--", "fontSize": 24, "color": "#919196" }, "compId": 38 }, { "type": "Label", "props": { "y": 324.5, "x": 519, "wordWrap": true, "width": 440, "text": "以上银行账户限本次存款使用,账户不定期更换每次存款前请依照本页面所显示的银行账户入款,如入款至已过期账户,无法查收，本公司恕不负责", "height": 113, "fontSize": 22, "color": "#919196" }, "compId": 39 }], "loadList": ["bgs/ddeposit_chonzhishoukuanbg.png", "btns/ic_copy2.png", "comp/ic_input_bg.png", "btns/ic_return_back.png", "btns/ic_go.png"], "loadList3D": [] };
        return Cz_xx_BankUI;
    }(Laya.View));
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
        Cz_xx_chooseMoneyUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Label", "props": { "y": 95, "x": 32, "text": "玩家常玩的充值金额", "fontSize": 24, "color": "#ffffff" }, "compId": 3 }, { "type": "Image", "props": { "y": 70, "x": 0, "width": 966, "skin": "bgs/ic_online_bg.png", "height": 524 }, "compId": 4 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 964, "var": "list_2", "spaceX": 10, "repeatY": 1, "height": 61 }, "compId": 5, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 10, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao2.png", "name": "bg_normal" }, "compId": 11 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao.png", "name": "bg_selected" }, "compId": 12 }, { "type": "Label", "props": { "y": 6, "x": 0, "width": 176, "text": "微信", "name": "txt_label", "height": 28, "fontSize": 24, "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 36, "x": 0, "width": 176, "text": "微信", "name": "txt_info", "height": 20, "fontSize": 22, "align": "center" }, "compId": 15 }] }] }, { "type": "List", "props": { "y": 138, "x": 0, "width": 957, "var": "list_3", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 20, "spaceX": 120, "right": 10, "left": 10, "height": 163 }, "compId": 6, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 138, "skin": "comp/ic_pc_grbb_tab.png", "sizeGrid": "15,15,15,15", "name": "bg_normal", "height": 55 }, "compId": 17 }, { "type": "Image", "props": { "width": 138, "skin": "comp/ic_pc_grbb_tab_pressed.png", "sizeGrid": "15,15,15,15", "name": "img_selected", "height": 55 }, "compId": 18 }, { "type": "Label", "props": { "y": 13, "x": 4, "width": 131, "text": "10000元", "name": "txt_value", "height": 26, "fontSize": 26, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 19 }] }] }, { "type": "Image", "props": { "y": 309, "x": 0, "width": 967, "skin": "bgs/ic_safe_yue_bg.png", "sizeGrid": "19,15,36,13", "right": 5, "left": 5, "height": 164 }, "compId": 7, "child": [{ "type": "Label", "props": { "y": 28, "x": 32, "text": "充值金额", "fontSize": 36, "color": "#ffffff", "bold": true }, "compId": 20 }, { "type": "Image", "props": { "y": 20, "x": 246, "width": 399, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 60 }, "compId": 21, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_oldPwd", "type": "number", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 20, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_clear_bg.png", "scaleY": 0.6, "scaleX": 0.6, "right": 50 }, "compId": 23 }] }, { "type": "Button", "props": { "y": 0, "x": 0, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_commit_charge.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 0, "bottom": 10 }, "compId": 8 }, { "type": "Label", "props": { "y": 408, "x": 32, "text": "温馨提示:冲只成功到账备注真实姓名", "fontSize": 24, "color": "#B88C5B" }, "compId": 9 }], "loadList": ["bgs/ic_online_bg.png", "comp/ddeposit_chonzhizhifubaotongdao2.png", "comp/ddeposit_chonzhizhifubaotongdao.png", "comp/vscroll.png", "comp/ic_pc_grbb_tab.png", "comp/ic_pc_grbb_tab_pressed.png", "bgs/ic_safe_yue_bg.png", "comp/big_input_box.png", "btns/ic_clear_bg.png", "btns/ic_commit_charge.png"], "loadList3D": [] };
        return Cz_xx_chooseMoneyUI;
    }(Laya.View));
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
        Cz_xx_ewmUI.uiView = { "type": "View", "props": { "width": 980, "height": 600 }, "compId": 2, "child": [{ "type": "Box", "props": { "var": "s_bg", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 20, "x": 10, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "left": 10 }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款信息", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 18 }] }, { "type": "Image", "props": { "y": 20, "x": 508, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "right": 10 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 16, "x": 122, "width": 210, "text": "扫描二维码", "height": 28, "fontSize": 28, "color": "#3e2412", "bold": true, "align": "center" }, "compId": 19 }] }, { "type": "Label", "props": { "y": 137, "x": 15, "width": 115, "text": "个人信息", "height": 22, "fontSize": 22, "color": "#a0a0a0", "align": "right" }, "compId": 5 }, { "type": "Image", "props": { "y": 164, "x": 150, "width": 285, "height": 2 }, "compId": 46, "child": [{ "type": "Line", "props": { "toY": 0, "toX": 295, "lineWidth": 3, "lineColor": "#b7b7b7" }, "compId": 48 }] }, { "type": "Label", "props": { "y": 286, "x": 15, "width": 115, "text": "收款账号", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "right" }, "compId": 7 }, { "type": "Label", "props": { "y": 361, "x": 15, "width": 115, "text": "存款信息", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "right" }, "compId": 34 }, { "type": "Image", "props": { "y": 238, "x": 150, "width": 285, "height": 2 }, "compId": 49, "child": [{ "type": "Line", "props": { "toY": 0, "toX": 295, "lineWidth": 3, "lineColor": "#b7b7b7" }, "compId": 50 }] }, { "type": "Label", "props": { "y": 212, "x": 15, "width": 115, "var": "txt_type", "text": "支付宝账号", "height": 24, "fontSize": 22, "color": "#a0a0a0", "align": "right" }, "compId": 51 }, { "type": "Image", "props": { "y": 385, "x": 150, "width": 285, "height": 2 }, "compId": 52, "child": [{ "type": "Line", "props": { "toY": 0, "toX": 295, "lineWidth": 3, "lineColor": "#b7b7b7" }, "compId": 53 }] }, { "type": "Image", "props": { "y": 311, "x": 150, "width": 285, "height": 2 }, "compId": 54, "child": [{ "type": "Line", "props": { "toY": 0, "toX": 295, "lineWidth": 3, "lineColor": "#b7b7b7" }, "compId": 55 }] }, { "type": "Label", "props": { "y": 474.5, "x": 25, "wordWrap": true, "width": 441, "var": "txt_tips0", "text": "第一步:保存付款二维码,支付宝扫码转账到指定支付宝账号。", "height": 49, "fontSize": 20, "color": "#919196", "align": "left" }, "compId": 56 }, { "type": "Label", "props": { "y": 437, "x": 25, "var": "txt_tip2", "text": "微信转账请备注成功到账时间", "fontSize": 20, "color": "#919196" }, "compId": 60 }, { "type": "Label", "props": { "y": 411, "x": 26, "text": "注:收款信息仅限本次使用！", "fontSize": 20, "color": "#919196" }, "compId": 61 }, { "type": "Label", "props": { "y": 524, "x": 26, "wordWrap": true, "width": 441, "visible": true, "var": "txt_cx", "text": "如何查询订单号:\\n1.打开支付宝，点击右下角\"我的\"。\\n2.进入\"账单\",点击对应的转账信息即可查询转账订单。", "height": 66, "fontSize": 16, "color": "#919196", "align": "left" }, "compId": 62 }, { "type": "Label", "props": { "y": 286, "x": 415, "width": 25, "text": "元", "height": 24, "fontSize": 24, "color": "#919196" }, "compId": 63 }] }, { "type": "TextInput", "props": { "y": 361, "x": 150, "width": 294, "var": "txt_info", "promptColor": "#a0a0a0", "prompt": "请备注转账人姓名", "height": 26, "fontSize": 22, "color": "#ffffff" }, "compId": 35 }, { "type": "Label", "props": { "y": 138, "x": 150, "width": 230, "var": "txt_bankName", "text": "1111", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 20 }, { "type": "Button", "props": { "y": 129, "x": 400, "var": "btn_copy1", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "Button", "props": { "y": 517, "x": 508, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 14 }, { "type": "Button", "props": { "y": 523, "x": 805.5, "var": "btn_tjcz", "stateNum": 1, "skin": "btns/transfered_money.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 15 }, { "type": "Label", "props": { "y": 287, "x": 150, "width": 258, "var": "txt_zh", "text": "1111", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 28 }, { "type": "Label", "props": { "y": 212, "x": 150, "width": 230, "var": "txt_name", "text": "1111", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 24 }, { "type": "Button", "props": { "y": 205, "x": 400, "var": "btn_copy2", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 27 }, { "type": "Box", "props": { "y": 20, "width": 462, "right": 10, "height": 500 }, "compId": 66, "child": [{ "type": "Button", "props": { "y": 324, "var": "btn_save", "stateNum": 1, "skin": "btns/save_qr.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 4 }, "compId": 65 }, { "type": "Label", "props": { "y": 460, "width": 456, "text": "第二步:填写转账信息,点击我已转账。", "height": 24, "fontSize": 20, "color": "#919196", "centerX": 0, "align": "center" }, "compId": 67 }, { "type": "Label", "props": { "y": 366, "text": "--说明--", "fontSize": 24, "color": "#919196", "centerX": 0 }, "compId": 68 }, { "type": "Label", "props": { "y": 415, "wordWrap": true, "width": 440, "var": "txt_tips1", "text": "以上支付宝账号限本次存款使用,账户不定期更换!", "height": 28, "fontSize": 20, "color": "#919196", "centerX": 0 }, "compId": 69 }, { "type": "Image", "props": { "y": 69, "width": 200, "var": "img_ewm", "height": 200, "centerX": 0 }, "compId": 70 }, { "type": "Label", "props": { "y": 280, "width": 224, "text": "扫描二维码完成支付", "height": 24, "fontSize": 24, "color": "#919196", "centerX": 0, "align": "center" }, "compId": 71 }] }], "loadList": ["bgs/ddeposit_chonzhishoukuanbg.png", "btns/ic_copy2.png", "btns/ic_return_back.png", "btns/transfered_money.png", "btns/save_qr.png"], "loadList3D": [] };
        return Cz_xx_ewmUI;
    }(Laya.View));
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
    }(Laya.Dialog));
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
        HallUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "img_bg", "top": 0, "skin": "bgs/catch_fish_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "var": "b_top", "top": 0, "right": 0, "left": 0 }, "compId": 5, "child": [{ "type": "Image", "props": { "skin": "bgs/dindex_header.png", "right": 0, "left": 0 }, "compId": 6 }, { "type": "Label", "props": { "y": 39, "x": 113, "width": 220, "var": "txt_name", "text": "label", "height": 24, "fontSize": 24, "color": "#f9f9f9", "align": "center" }, "compId": 9 }, { "type": "Button", "props": { "y": 32, "x": 1120, "var": "btn_set", "stateNum": 1, "skin": "btns/dindex_index_set.png", "right": 60 }, "compId": 17 }, { "type": "Image", "props": { "y": 24, "var": "img_web", "skin": "bgs/ic_website_ky.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 243 }, "compId": 33 }, { "type": "Box", "props": { "y": 5, "var": "b_money", "centerX": -100 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 19, "x": 22, "width": 351, "skin": "comp/db7_room.png", "sizeGrid": "7,7,7,7", "scaleY": 0.8, "scaleX": 0.8, "height": 39 }, "compId": 10 }, { "type": "Image", "props": { "y": 4.5, "x": 0, "width": 50, "skin": "icons/ic_golden.png", "height": 50 }, "compId": 18 }, { "type": "Label", "props": { "y": 22, "x": 51, "width": 249, "var": "txt_money", "text": "0.00", "height": 24, "fontSize": 24, "color": "#f8f1f1", "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 35, "x": 307, "width": 50, "var": "btn_reload", "stateNum": 1, "skin": "btns/dindex_reload.png", "pivotY": 25, "pivotX": 25, "height": 50 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 17, "x": 44 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": -11, "x": -1, "width": 98, "skin": "comp/img_touxiangMask.png", "sizeGrid": "45,48,51,52", "renderType": "mask", "height": 83 }, "compId": 50 }, { "type": "Image", "props": { "y": -4, "x": 12, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 7 }] }, { "type": "Box", "props": { "y": 2, "x": 135.5, "var": "b_unlogin" }, "compId": 52, "child": [{ "type": "Button", "props": { "y": 30, "x": 0.5, "var": "btn_login", "stateNum": 1, "skin": "btns/ic_login.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 53 }, { "type": "Button", "props": { "y": 29, "x": 88, "var": "btn_register", "stateNum": 1, "skin": "btns/ic_register.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 54 }, { "type": "Label", "props": { "y": 0, "x": 0, "text": "未登录", "fontSize": 26, "color": "#FFFFFF", "bold": true }, "compId": 55 }] }] }, { "type": "Panel", "props": { "var": "p_game", "right": 30, "left": 350, "height": 444, "hScrollBarSkin": "comp/hscroll.png", "centerY": 10 }, "compId": 26, "child": [{ "type": "Box", "props": {}, "compId": 66 }] }, { "type": "Box", "props": { "width": 315, "var": "b_left", "left": 15, "height": 492, "centerY": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_left.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 20 }, { "type": "Panel", "props": { "var": "p_menu", "vScrollBarSkin": "comp/vscroll.png", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 21 }, { "type": "List", "props": { "y": 42, "x": 0, "width": 316, "var": "list_tab", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 2, "height": 446 }, "compId": 56, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 57, "child": [{ "type": "Image", "props": { "width": 316, "skin": "btns/ic_hot_game.png", "name": "bg_normal", "height": 86 }, "compId": 58 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 316, "skin": "btns/ic_hot_game_pressed.png", "name": "bg_selected", "height": 86 }, "compId": 59 }] }] }] }, { "type": "Box", "props": { "y": 114, "x": 357.5, "var": "b_pmd" }, "compId": 27, "child": [{ "type": "Image", "props": { "y": 0, "x": 36, "width": 849, "var": "img_pmd", "skin": "comp/laba_bg.png", "height": 34 }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 3, "text": "跑马灯信息", "overflow": "visible", "name": "txt_label", "fontSize": 24, "color": "#f4f4f4" }, "compId": 30 }] }] }, { "type": "Box", "props": { "var": "b_bottom", "right": 0, "left": 0, "height": 107, "bottom": 0 }, "compId": 31, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_bottom.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 32 }, { "type": "Button", "props": { "var": "btn_tg", "stateNum": 1, "skin": "btns/ic_promotion.png", "scaleY": 0.5, "scaleX": 0.5, "left": 15, "centerY": 0 }, "compId": 34 }, { "type": "Button", "props": { "var": "btn_tixian", "stateNum": 1, "skin": "btns/ic_withdrawal.png", "scaleY": 0.5, "scaleX": 0.5, "right": 185, "centerY": 1 }, "compId": 39 }, { "type": "Button", "props": { "var": "btn_cz", "stateNum": 1, "skin": "btns/ic_recharge.png", "scaleY": 0.5, "scaleX": 0.5, "right": 10, "centerY": 0 }, "compId": 40 }, { "type": "HBox", "props": { "y": 16, "right": 370, "left": 236, "align": "none" }, "compId": 62, "child": [{ "type": "Button", "props": { "var": "btn_huodong", "stateNum": 1, "skin": "btns/ic_activity.png", "scaleY": 0.7, "scaleX": 0.7, "left": 0 }, "compId": 35 }, { "type": "Button", "props": { "var": "btn_xm", "stateNum": 1, "skin": "btns/ic_shuffle.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 1, "centerX": -98 }, "compId": 38 }, { "type": "Button", "props": { "var": "btn_mail", "stateNum": 1, "skin": "btns/ic_message.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 1, "centerX": 102 }, "compId": 36 }, { "type": "Button", "props": { "y": 0, "var": "btn_kf", "stateNum": 1, "skin": "btns/ic_customer_service.png", "scaleY": 0.7, "scaleX": 0.7, "right": 0 }, "compId": 37 }] }] }], "loadList": ["bgs/catch_fish_bg.png", "bgs/dindex_header.png", "btns/dindex_index_set.png", "bgs/ic_website_ky.png", "comp/db7_room.png", "icons/ic_golden.png", "btns/dindex_reload.png", "comp/img_touxiangMask.png", "comp/dindex_index_icon.png", "btns/ic_login.png", "btns/ic_register.png", "comp/hscroll.png", "bgs/ic_home_left.png", "comp/vscroll.png", "btns/ic_hot_game.png", "btns/ic_hot_game_pressed.png", "comp/laba_bg.png", "bgs/ic_home_bottom.png", "btns/ic_promotion.png", "btns/ic_withdrawal.png", "btns/ic_recharge.png", "btns/ic_activity.png", "btns/ic_shuffle.png", "btns/ic_message.png", "btns/ic_customer_service.png"], "loadList3D": [] };
        return HallUiUI;
    }(Laya.View));
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
        HuoDongUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b_bg" }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png", "height": 722 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 25, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 26 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 27 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_act_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 28 }] }, { "type": "List", "props": { "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "top": 125, "spaceY": 10, "right": 30, "left": 293, "height": 597 }, "compId": 17, "child": [{ "type": "Box", "props": { "y": 0, "right": 0, "renderType": "render", "left": 0, "height": 340 }, "compId": 19, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_activity_item_bg.png", "scaleY": 0.65, "scaleX": 0.65, "right": 0, "left": 0, "bottom": 0 }, "compId": 16 }, { "type": "Image", "props": { "y": 94, "x": 25, "width": 573, "skin": "bgs/dactivity_ac_deflaut_pic.png", "name": "img_hd", "height": 199 }, "compId": 20 }, { "type": "Label", "props": { "y": 14, "x": 35, "text": "活动名：会生钱的APP:天天红包", "name": "txt_name", "fontSize": 30, "color": "#FFFFFF" }, "compId": 21 }, { "type": "Label", "props": { "y": 59, "x": 35, "text": "2019/12/9 12:12:00", "name": "txt_time", "fontSize": 24, "color": "#FFFFFF" }, "compId": 22 }, { "type": "Label", "props": { "y": 94, "x": 651, "var": "txt_type", "text": "改活动不支持在线领取", "name": "txt_name", "fontSize": 26, "color": "#FFFFFF" }, "compId": 23 }, { "type": "Button", "props": { "y": 211, "x": 718, "stateNum": 1, "skin": "btns/ic_cus_zixun.png", "scaleY": 0.5, "scaleX": 0.5, "name": "btn_get" }, "compId": 24 }, { "type": "Button", "props": { "y": 233.84615384615384, "x": 25, "stateNum": 1, "skin": "btns/ic_act_check_deatil.png", "scaleY": 0.5, "scaleX": 0.5, "name": "btn_info" }, "compId": 37 }] }] }, { "type": "List", "props": { "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 590 }, "compId": 33, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 34, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_act_buyu.png", "name": "bg_normal", "height": 96 }, "compId": 35 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_act_buyu_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 36 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_act_title.png", "comp/vscroll.png", "bgs/ic_activity_item_bg.png", "bgs/dactivity_ac_deflaut_pic.png", "btns/ic_cus_zixun.png", "btns/ic_act_check_deatil.png", "btns/ic_act_buyu.png", "btns/ic_act_buyu_pressed.png"], "loadList3D": [] };
        return HuoDongUiUI;
    }(Laya.View));
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
        KeFuUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dactivity_nav_left.png", "left": 0 }, "compId": 14 }, { "type": "Box", "props": { "y": 92, "x": 293, "var": "b_zx" }, "compId": 15 }, { "type": "Box", "props": { "var": "b_kf", "top": 125, "right": 25, "left": 300, "bottom": 0 }, "compId": 17, "child": [{ "type": "List", "props": { "y": 46, "x": 0, "width": 970, "spaceX": 5, "repeatY": 1, "name": "list_1", "height": 505 }, "compId": 33, "child": [{ "type": "Box", "props": { "width": 307, "renderType": "render", "height": 496 }, "compId": 34, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 307, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "5,5,5,5", "height": 496 }, "compId": 20 }, { "type": "Label", "props": { "y": 366, "text": "QQ客服", "right": 0, "name": "txt_name", "left": 0, "height": 24, "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 22 }, { "type": "Button", "props": { "y": 404, "var": "btn_lx", "stateNum": 1, "skin": "btns/ic_customer_lianxi.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 21 }, { "type": "Label", "props": { "y": 330, "text": "游戏专员", "name": "txt_id", "fontSize": 24, "color": "#ffffff", "centerX": 0 }, "compId": 23 }, { "type": "Box", "props": { "y": 141, "x": 117.5 }, "compId": 36, "child": [{ "type": "Image", "props": { "y": -17, "x": -18, "width": 98, "skin": "comp/img_touxiangMask.png", "sizeGrid": "45,45,45,45", "renderType": "mask", "height": 98 }, "compId": 37 }, { "type": "Image", "props": { "y": 0, "x": 0, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 38 }] }] }] }] }, { "type": "Box", "props": { "var": "b_wt", "top": 125, "left": 300 }, "compId": 19 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 24, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 25 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 26 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_cus_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 27 }] }, { "type": "List", "props": { "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 29, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 30, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_cus_fqc.png", "name": "bg_normal", "height": 96 }, "compId": 31 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_cus_fqc_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 32 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_gathering_bg.png", "btns/ic_customer_lianxi.png", "comp/img_touxiangMask.png", "comp/dindex_index_icon.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_cus_title.png", "btns/ic_cus_fqc.png", "btns/ic_cus_fqc_pressed.png"], "loadList3D": [] };
        return KeFuUiUI;
    }(Laya.View));
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
    }(Laya.Dialog));
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
    }(Laya.Dialog));
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
    }(Laya.Dialog));
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
        MailUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 17 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_main_message_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 18 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 19 }] }, { "type": "List", "props": { "y": 139, "x": 45, "width": 1028, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 466 }, "compId": 5, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_message_list_bg.png", "sizeGrid": "30,30,30,30", "right": 0, "left": 0, "height": 119 }, "compId": 7 }, { "type": "Label", "props": { "y": 12, "x": 18, "text": "邮件名", "name": "txt_name", "fontSize": 24, "color": "#FFFFFF" }, "compId": 8 }, { "type": "Label", "props": { "y": 47, "x": 18, "text": "邮件title", "name": "txt_title", "fontSize": 24, "color": "#FFFFFF" }, "compId": 9 }, { "type": "Label", "props": { "y": 82, "x": 18, "width": 817, "text": "邮件内容", "name": "txt_info", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 10 }, { "type": "Label", "props": { "y": 12, "width": 369, "text": "2012/12/12 12:12:00", "right": 0, "name": "txt_time", "height": 24, "fontSize": 22, "color": "#FFFFFF", "align": "right" }, "compId": 11 }, { "type": "Button", "props": { "y": 53.5, "x": 854.5, "stateNum": 1, "skin": "btns/ic_detail.png", "scaleY": 1, "scaleX": 1, "name": "btn_check" }, "compId": 12 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 21 }] }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_main_message_title.png", "btns/ic_close.png", "comp/vscroll.png", "bgs/ic_message_list_bg.png", "btns/ic_detail.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return MailUI;
    }(Laya.Dialog));
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
        MailInfoUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "bgs/message_detail.png", "scaleY": 0.67, "scaleX": 0.67 }, "compId": 3 }, { "type": "TextArea", "props": { "y": 129, "x": 16, "width": 1070, "var": "txt_info", "text": "TextArea", "height": 510, "fontSize": 24, "color": "#FFFFFF" }, "compId": 4 }, { "type": "Button", "props": { "y": 0, "x": 995, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 5 }, { "type": "Button", "props": { "y": 469, "var": "btn_remove", "stateNum": 1, "skin": "btns/delete_message.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 6 }], "loadList": ["bgs/message_detail.png", "btns/ic_close.png", "btns/delete_message.png"], "loadList3D": [] };
        return MailInfoUI;
    }(Laya.Dialog));
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
    }(Laya.Dialog));
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
    }(Laya.Dialog));
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
    }(Laya.Dialog));
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
    }(Laya.Dialog));
    ui.RegisterUiUI = RegisterUiUI;
    REG("ui.RegisterUiUI", RegisterUiUI);
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
    }(Laya.Dialog));
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
    }(Laya.View));
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
        TiXianUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 92 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 3 }, { "type": "Box", "props": { "var": "b_tx", "top": 125, "right": 30, "left": 300, "height": 469 }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 22, "x": 30, "width": 95, "text": "账号余额:", "height": 28, "fontSize": 22, "color": "#FFFFFF" }, "compId": 14 }, { "type": "Label", "props": { "y": 16, "x": 125, "width": 95, "var": "txt_money", "text": "￥5.00", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 69 }, { "type": "Box", "props": { "y": 13, "x": 799, "name": "btn_histroy" }, "compId": 70, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "stateNum": 1, "skin": "icons/ic_tixiam_record.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 15 }, { "type": "Label", "props": { "y": 3, "x": 41, "width": 122, "text": "提现记录", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 16 }] }, { "type": "Image", "props": { "y": 51, "x": 0, "width": 948, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 17 }, { "type": "Label", "props": { "y": 93.5, "x": 30, "width": 122, "text": "提现金额", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 20 }, { "type": "Image", "props": { "y": 80, "x": 193, "width": 632, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 56 }, "compId": 21, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 612, "var": "txt_input", "type": "number", "prompt": "请输入您的提现金额 单笔最低100 最高10000000", "height": 36, "fontSize": 28, "color": "#d6c09a" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 88, "x": 830, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_safe_clear.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "Box", "props": { "y": 193, "x": 0, "var": "b_unlock" }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 948, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 18 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png" }, "compId": 24 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 26 }, { "type": "Label", "props": { "y": 57.5, "x": 171, "text": "你暂时未绑定银行卡,请前往绑定", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 27 }, { "type": "Button", "props": { "y": 27, "x": 763, "var": "btn_bangding", "stateNum": 1, "skin": "btns/ic_bind_bank.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 28 }] }, { "type": "Button", "props": { "y": 445, "x": 362, "var": "btn_tx", "stateNum": 1, "skin": "btns/ic_comfirm_tixiam.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 19 }, { "type": "Box", "props": { "y": 193, "x": 0, "var": "b_myBank" }, "compId": 80, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 948, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 81 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png", "name": "img_bank" }, "compId": 82 }, { "type": "Label", "props": { "y": 57, "x": 174, "text": "1234567 89", "name": "txt_id", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 83 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "name": "txt_name", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 84 }, { "type": "Box", "props": { "y": 41, "x": 757, "var": "btn_change" }, "compId": 85, "child": [{ "type": "Label", "props": { "text": "更换银行卡", "fontSize": 26, "color": "#ffffff" }, "compId": 87 }] }] }] }, { "type": "Box", "props": { "var": "b_bank", "top": 125, "right": 30, "left": 300, "height": 570 }, "compId": 29, "child": [{ "type": "Button", "props": { "y": 473, "var": "btn_addBank", "stateNum": 1, "skin": "btns/ic_btn_add_bank.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 30 }, { "type": "List", "props": { "y": 0, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "right": 0, "left": 0, "height": 452 }, "compId": 31, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "right": 0, "left": 0, "height": 115 }, "compId": 88 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png", "name": "img_bank" }, "compId": 89 }, { "type": "Label", "props": { "y": 57, "x": 174, "text": "1234567 89", "name": "txt_id", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 90 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "name": "txt_name", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 91 }] }] }] }, { "type": "Box", "props": { "var": "b_add", "top": 125, "right": 30, "left": 300, "height": 476 }, "compId": 36, "child": [{ "type": "Label", "props": { "y": 79, "x": 83, "text": "持卡人姓名", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 37 }, { "type": "Image", "props": { "y": 70, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 38, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入持卡人姓名", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 139, "x": 83, "width": 146, "text": "选择银行", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 40 }, { "type": "Image", "props": { "y": 130, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 41, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 522, "var": "txt_bankName", "type": "text", "prompt": "请选择银行", "height": 36, "fontSize": 30, "editable": false, "color": "#d6c09a", "align": "center" }, "compId": 42 }] }, { "type": "Label", "props": { "y": 198, "x": 83, "text": "银行卡账号", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 43 }, { "type": "Image", "props": { "y": 189, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 44, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 531, "var": "txt_bankId", "type": "text", "prompt": "请输入银行卡账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 45 }] }, { "type": "Label", "props": { "y": 270, "x": 83, "width": 147, "text": "开户地址", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 46 }, { "type": "Image", "props": { "y": 262, "x": 249, "width": 538, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 47, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_bankAddress", "type": "text", "prompt": "请输入银行卡开户地址", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 48 }] }, { "type": "Button", "props": { "y": 432, "x": 143, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 49 }, { "type": "Button", "props": { "y": 432, "x": 470, "var": "btn_bd", "stateNum": 1, "skin": "btns/ic_btn_bind.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 51 }, { "type": "Label", "props": { "y": 331, "x": -1, "wordWrap": true, "width": 942, "text": "提示:请正确选定开户行,并绑定真实姓名,结算时将直接转入此账户,为了您的账户安全,绑定后不可随意更改,如需修改,请联系客服人员", "height": 62, "fontSize": 20, "color": "#777777" }, "compId": 52 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 53, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 54 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 55 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_withdraw_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 56 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 65, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 66, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_withdraw_bank.png", "name": "bg_normal", "height": 96 }, "compId": 67 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_withdraw_bank_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 68 }] }] }], "loadList": ["bgs/ic_recharge_bg.png", "comp/dactivity_nav_left.png", "icons/ic_tixiam_record.png", "bgs/ic_gathering_bg.png", "comp/big_input_box.png", "btns/ic_safe_clear.png", "icons/dgetcharge_tixianyinliankatubiao.png", "btns/ic_bind_bank.png", "btns/ic_comfirm_tixiam.png", "btns/ic_btn_add_bank.png", "comp/vscroll.png", "btns/ic_return_back.png", "btns/ic_btn_bind.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_withdraw_title.png", "btns/ic_withdraw_bank.png", "btns/ic_withdraw_bank_pressed.png"], "loadList3D": [] };
        return TiXianUI;
    }(Laya.View));
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
    }(Laya.Dialog));
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
        TuiGuangUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 127 }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_1", "height": 527, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 819, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 11 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 819, "height": 524 }, "compId": 130, "child": [{ "type": "Image", "props": { "y": 3, "x": 15, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 14 }, { "type": "Image", "props": { "y": 3, "x": 418, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 25 }, { "type": "Image", "props": { "y": 193, "x": 15, "width": 782, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 18 }, { "type": "Image", "props": { "y": 258, "x": 15, "width": 782, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 19 }, { "type": "Image", "props": { "y": 67, "x": 15, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 29 }, { "type": "Image", "props": { "y": 67, "x": 419, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 30 }, { "type": "Image", "props": { "y": 130, "x": 15, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 31 }, { "type": "Image", "props": { "y": 130, "x": 418, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 32 }] }, { "type": "Image", "props": { "y": 330, "x": 23.279296875, "skin": "bgs/history.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 20 }, { "type": "Image", "props": { "y": 333, "x": 316, "skin": "btns/canget.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 21 }, { "type": "Label", "props": { "y": 17, "x": 58, "text": "我的ID:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 23 }, { "type": "Label", "props": { "y": 17, "x": 158, "width": 222, "var": "txt_myId", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 24 }, { "type": "Button", "props": { "y": 8, "x": 1046.5, "var": "btn_fx_hy", "stateNum": 1, "skin": "btns/sharetofriend.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 26 }, { "type": "Button", "props": { "y": 85, "x": 1046, "var": "btn_fx_qq", "stateNum": 1, "skin": "btns/sharetoqq.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 27 }, { "type": "Button", "props": { "y": 162, "x": 1046, "var": "btn_fx_pyq", "stateNum": 1, "skin": "btns/sharetocircle.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 28 }, { "type": "Label", "props": { "y": 17, "x": 454, "text": "推荐ID:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 33 }, { "type": "Label", "props": { "y": 17, "x": 556, "width": 222, "var": "txt_tjId", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 34 }, { "type": "Label", "props": { "y": 79, "x": 59, "text": "团队人数:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 48 }, { "type": "Label", "props": { "y": 82, "x": 191, "width": 198, "var": "txt_tdrs", "text": "3(0)", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 49 }, { "type": "Label", "props": { "y": 82, "x": 455, "text": "今日团队业绩:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 50 }, { "type": "Label", "props": { "y": 84, "x": 634, "width": 179, "var": "txt_jrtdyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 51 }, { "type": "Label", "props": { "y": 143.5, "x": 57, "text": "直属团队新增:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 52 }, { "type": "Label", "props": { "y": 145, "x": 244, "width": 163, "var": "txt_zstdxz", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 53 }, { "type": "Label", "props": { "y": 145, "x": 453, "text": "今日自营业绩:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 54 }, { "type": "Label", "props": { "y": 145.5, "x": 634, "width": 164, "var": "txt_zyyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 55 }, { "type": "Label", "props": { "y": 207, "x": 57, "text": "今日佣金估计:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 56 }, { "type": "Label", "props": { "y": 210, "x": 235, "width": 164, "var": "txt_yjgj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 57 }, { "type": "Label", "props": { "y": 273, "x": 57, "text": "昨日佣金:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 58 }, { "type": "Label", "props": { "y": 273, "x": 191, "width": 164, "var": "txt_zryj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 59 }, { "type": "Button", "props": { "y": 198.5, "x": 409.5, "var": "btn_refresh", "stateNum": 1, "skin": "btns/btn_refresh.png" }, "compId": 60 }, { "type": "Button", "props": { "y": 339, "x": 619, "var": "btn_get", "stateNum": 1, "skin": "btns/getmoney.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 61 }, { "type": "Label", "props": { "y": 437.5, "x": 83, "width": 222, "var": "txt_lszyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 63 }, { "type": "Label", "props": { "y": 437.5, "x": 380, "width": 222, "var": "txt_klyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 64 }, { "type": "Image", "props": { "y": 7, "x": 827, "width": 215, "var": "img_ewm", "height": 215 }, "compId": 65 }, { "type": "Image", "props": { "y": 258, "x": 827, "width": 310, "skin": "bgs/ic_website_bg.png", "sizeGrid": "2,2,2,2", "height": 54 }, "compId": 66 }, { "type": "Button", "props": { "y": 258.5, "x": 1154, "var": "btn_copy", "stateNum": 1, "skin": "btns/copywebsite.png", "scaleY": 0.4, "scaleX": 0.4 }, "compId": 67 }, { "type": "Label", "props": { "y": 271, "x": 839, "width": 299, "var": "txt_web", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 68 }, { "type": "Button", "props": { "y": 353, "x": 830, "var": "btn_histroy", "stateNum": 1, "skin": "btns/gethitory.png", "scaleY": 0.55, "scaleX": 0.55 }, "compId": 69 }, { "type": "Button", "props": { "y": 353, "x": 1037, "var": "btn_fylist", "stateNum": 1, "skin": "btns/moneychat.png", "scaleY": 0.55, "scaleX": 0.55 }, "compId": 70 }] }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_2", "height": 524, "centerX": 0 }, "compId": 71, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1220, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 137 }, { "type": "Label", "props": { "y": 33, "x": 34, "text": "直属人数:", "fontSize": 24, "color": "#d8d5ab" }, "compId": 81 }, { "type": "Label", "props": { "y": 33, "x": 247, "text": "直属总流水:", "fontSize": 24, "color": "#d8d5ab" }, "compId": 82 }, { "type": "Label", "props": { "y": 33, "x": 550, "text": "账号搜索", "fontSize": 24, "color": "#f9da64" }, "compId": 83 }, { "type": "Label", "props": { "y": 33, "x": 137, "width": 101, "var": "txt_playerNum", "text": "99999999", "height": 24, "fontSize": 24, "color": "#d8d5ab" }, "compId": 84 }, { "type": "Label", "props": { "y": 31, "x": 384, "width": 113, "text": "99999999", "height": 24, "fontSize": 24, "color": "#d8d5ab" }, "compId": 85 }, { "type": "Image", "props": { "y": 30, "x": 523, "skin": "comp/radio_chose.png" }, "compId": 86 }, { "type": "Image", "props": { "y": 28, "x": 679, "width": 206, "skin": "comp/ic_input_bg.png", "sizeGrid": "19,20,19,20", "height": 35 }, "compId": 87 }, { "type": "TextInput", "props": { "y": 28, "x": 679, "width": 198, "var": "txt_newPwd1", "type": "password", "prompt": "输入直接玩家账号", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 88 }, { "type": "Button", "props": { "y": 24.5, "x": 915, "var": "btn_search", "stateNum": 1, "skin": "btns/search.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 89 }, { "type": "Button", "props": { "y": 24.5, "x": 1075, "var": "btn_reset", "stateNum": 1, "skin": "btns/reset.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 90 }, { "type": "Image", "props": { "y": 72, "x": 13, "width": 1206, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 91 }, { "type": "Label", "props": { "y": 82, "x": 119, "text": "id", "fontSize": 20, "color": "#f3d667" }, "compId": 92 }, { "type": "Label", "props": { "y": 82, "x": 401, "text": "姓名", "fontSize": 20, "color": "#f3d667" }, "compId": 93 }, { "type": "Label", "props": { "y": 82, "x": 710, "text": "总流水", "fontSize": 20, "color": "#f3d667" }, "compId": 94 }, { "type": "Label", "props": { "y": 82, "x": 1041, "text": "直属人数", "fontSize": 20, "color": "#f3d667" }, "compId": 95 }, { "type": "List", "props": { "y": 120, "width": 1206, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 384, "centerX": 0 }, "compId": 106, "child": [{ "type": "Box", "props": { "y": 1, "x": 0, "name": "render" }, "compId": 107, "child": [{ "type": "Image", "props": { "y": 1, "x": 0, "width": 1170, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 50 }, "compId": 108 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 1171, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 50 }, "compId": 109 }, { "type": "Label", "props": { "y": 13, "x": 13, "width": 257, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 110 }, { "type": "Label", "props": { "y": 14, "x": 274, "width": 288, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 111 }, { "type": "Label", "props": { "y": 14, "x": 574, "width": 290, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 112 }, { "type": "Label", "props": { "y": 13, "x": 899, "width": 270, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 113 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 131, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 132 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 118, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 120 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 121 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_extension_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 122 }] }, { "type": "List", "props": { "width": 1253, "var": "list_tab", "top": 120, "spaceX": 140, "repeatY": 1, "repeatX": 4, "left": 30, "height": 68 }, "compId": 119, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 123, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/chart_noselect.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_normal", "height": 96 }, "compId": 124 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/chart_select.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_selected", "height": 96 }, "compId": 125 }, { "type": "Label", "props": { "y": 20, "x": 44.44999999999999, "text": "我的推广", "name": "txt_label", "fontSize": 28 }, "compId": 126 }] }] }, { "type": "Box", "props": { "y": 196, "x": 30, "var": "b_3" }, "compId": 133, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1220, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 138 }, { "type": "Box", "props": { "y": 71, "x": 0, "width": 1218, "height": 47 }, "compId": 140, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 172, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 141, "child": [{ "type": "Label", "props": { "y": 7, "text": "日期", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 142 }] }, { "type": "Image", "props": { "y": 0, "x": 174, "width": 172, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 143, "child": [{ "type": "Label", "props": { "y": 7, "text": "直属新增", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 144 }] }, { "type": "Image", "props": { "y": 0, "x": 348, "width": 172, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 145, "child": [{ "type": "Label", "props": { "y": 7, "text": "自营业绩", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 146 }] }, { "type": "Image", "props": { "y": 0, "x": 522, "width": 174, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 147, "child": [{ "type": "Label", "props": { "y": 7, "text": "团队新增", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 148 }] }, { "type": "Image", "props": { "y": 0, "x": 698, "width": 174, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 149, "child": [{ "type": "Label", "props": { "y": 7, "text": "团队业绩", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 150 }] }, { "type": "Image", "props": { "y": 0, "x": 874, "width": 174, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 156, "child": [{ "type": "Label", "props": { "y": 7, "text": "所得佣金", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 157 }] }, { "type": "Image", "props": { "y": 0, "x": 1050, "width": 170, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 158, "child": [{ "type": "Label", "props": { "y": 7, "text": "操作", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 159 }] }] }, { "type": "Image", "props": { "y": 10, "x": 229, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 151, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_id", "type": "number", "prompt": "输入ID可查看直属会员信息", "height": 36, "fontSize": 28, "color": "#d6c09a" }, "compId": 152 }] }, { "type": "Button", "props": { "y": 14.5, "x": 664, "var": "btn_search1", "stateNum": 1, "skin": "btns/search.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 153 }, { "type": "Button", "props": { "y": 14.5, "x": 826, "var": "btn_reset1", "stateNum": 1, "skin": "btns/reset.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 155 }, { "type": "List", "props": { "y": 120, "x": 0, "width": 1206, "var": "list_3", "vScrollBarSkin": "comp/vscroll.png", "height": 384, "centerX": 0 }, "compId": 160, "child": [{ "type": "Box", "props": { "y": 1, "x": 0, "name": "render" }, "compId": 162, "child": [{ "type": "Image", "props": { "y": 1, "x": 0, "width": 1204, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 50 }, "compId": 163 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 1204, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 50 }, "compId": 164 }, { "type": "Label", "props": { "y": 13, "x": 0, "width": 150, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 165 }, { "type": "Label", "props": { "y": 13, "x": 176, "width": 150, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 166 }, { "type": "Label", "props": { "y": 13, "x": 351, "width": 150, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 167 }, { "type": "Label", "props": { "y": 13, "x": 527, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 168 }, { "type": "Label", "props": { "y": 12.5, "x": 703, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 170 }, { "type": "Label", "props": { "y": 13, "x": 878, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 171 }, { "type": "Label", "props": { "y": 13, "x": 1054, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 172 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 161, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 169 }] }] }, { "type": "Box", "props": { "y": 196, "x": 30, "var": "b_4" }, "compId": 134, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1220, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 139 }, { "type": "Image", "props": { "y": 11, "x": 16, "width": 958, "var": "img_jc", "height": 481 }, "compId": 173 }] }], "loadList": ["bgs/ic_recharge_bg.png", "bgs/ic_gathering_bg.png", "bgs/ic_net_bank_bg.png", "bgs/history.png", "btns/canget.png", "btns/sharetofriend.png", "btns/sharetoqq.png", "btns/sharetocircle.png", "btns/btn_refresh.png", "btns/getmoney.png", "bgs/ic_website_bg.png", "btns/copywebsite.png", "btns/gethitory.png", "btns/moneychat.png", "comp/radio_chose.png", "comp/ic_input_bg.png", "btns/search.png", "btns/reset.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "comp/bg_data_null.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_extension_title.png", "bgs/chart_noselect.png", "bgs/chart_select.png", "bgs/ic_pc_pop_wind.png", "comp/big_input_box.png"], "loadList3D": [] };
        return TuiGuangUI;
    }(Laya.View));
    ui.TuiGuangUI = TuiGuangUI;
    REG("ui.TuiGuangUI", TuiGuangUI);
    var UserInfoUI = /** @class */ (function (_super) {
        __extends(UserInfoUI, _super);
        function UserInfoUI() {
            return _super.call(this) || this;
        }
        UserInfoUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(UserInfoUI.uiView);
        };
        UserInfoUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720, "centerY": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_qipai_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 115 }, { "type": "Image", "props": { "y": 10, "x": 10, "skin": "comp/dactivity_nav_left.png" }, "compId": 99 }, { "type": "Box", "props": { "var": "b_info", "top": 130, "right": 10, "left": 303, "height": 590 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 969, "skin": "bgs/ic_pc_title.png", "right": 0, "left": 0, "height": 48 }, "compId": 176, "child": [{ "type": "Image", "props": { "x": 23, "skin": "icons/ic_dot.png", "centerY": 0 }, "compId": 177 }, { "type": "Label", "props": { "x": 76, "text": "基础信息", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 178 }] }, { "type": "Label", "props": { "y": 82, "x": 64, "text": "账号：", "fontSize": 22, "color": "#eaa65a" }, "compId": 183 }, { "type": "Label", "props": { "y": 82, "x": 129, "var": "txt_account", "text": "玩家账号", "fontSize": 22, "color": "#FFFFFF" }, "compId": 184 }, { "type": "Label", "props": { "y": 135, "x": 184, "width": 267, "var": "txt_level", "text": "玩家账号", "styleSkin": "comp/ic_input_bg.png", "height": 27, "fontSize": 22, "color": "#FFFFFF" }, "compId": 186 }, { "type": "Label", "props": { "y": 137, "x": 69, "width": 44, "text": "会员等级:", "height": 22, "fontSize": 22, "color": "#eaa65a" }, "compId": 185 }, { "type": "Label", "props": { "y": 199, "x": 69, "text": "姓名：", "fontSize": 22, "color": "#eaa65a" }, "compId": 188 }, { "type": "TextInput", "props": { "y": 195, "x": 135, "width": 245, "var": "txt_name", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 189 }, { "type": "Label", "props": { "y": 264, "x": 69, "text": "邮箱：", "fontSize": 22, "color": "#eaa65a" }, "compId": 198 }, { "type": "TextInput", "props": { "y": 260, "x": 135, "width": 245, "var": "txt_mail", "type": "email", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 199 }, { "type": "Label", "props": { "y": 332, "x": 69, "text": "电话：", "fontSize": 22, "color": "#eaa65a" }, "compId": 200 }, { "type": "TextInput", "props": { "y": 329, "x": 138, "width": 241, "var": "txt_tel", "type": "number", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 201 }, { "type": "Label", "props": { "y": 403, "x": 69, "text": "微信：", "fontSize": 22, "color": "#eaa65a" }, "compId": 204 }, { "type": "TextInput", "props": { "y": 399, "x": 136, "width": 249, "var": "txt_wx", "text": "玩家账号", "skin": "comp/ic_input_bg.png", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 205 }, { "type": "Box", "props": { "y": 488, "width": 133, "var": "btn_xg1", "right": 504, "height": 41 }, "compId": 367, "child": [{ "type": "Image", "props": { "y": 4, "x": 0, "stateNum": 1, "skin": "btns/ic_edit.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 0 }, "compId": 368 }, { "type": "Label", "props": { "y": 8.5, "x": 66, "text": "编辑", "fontSize": 24, "color": "#eaa65a" }, "compId": 369 }] }] }, { "type": "Box", "props": { "width": 967, "var": "b_mingxi", "top": 130, "right": 10, "left": 303, "height": 574 }, "compId": 260, "child": [{ "type": "Image", "props": { "x": 0, "width": 967, "skin": "bgs/ic_gathering_bg.png", "right": 0, "left": 0, "height": 584, "bottom": 0 }, "compId": 261 }, { "type": "Image", "props": { "y": 0, "width": 969, "skin": "bgs/ic_pc_title.png", "right": 0, "left": 0, "height": 48 }, "compId": 265, "child": [{ "type": "Label", "props": { "x": 46, "text": "交易时间", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 266 }, { "type": "Label", "props": { "x": 584, "text": "交易状态", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 267 }, { "type": "Image", "props": { "y": 4, "x": 187, "width": 229, "var": "btn_time1", "skin": "comp/ic_pc_edit.png", "sizeGrid": "22,22,22,22", "height": 44 }, "compId": 268 }, { "type": "Image", "props": { "y": 0, "x": 705, "width": 229, "var": "btn_status", "skin": "comp/ic_pc_edit.png", "sizeGrid": "22,22,22,22", "height": 44 }, "compId": 269 }, { "type": "Label", "props": { "y": 12, "x": 206, "width": 167, "var": "txt_time1", "text": "派彩时间", "height": 24, "fontSize": 24, "color": "#ffffff" }, "compId": 364 }, { "type": "Label", "props": { "y": 12, "x": 716, "width": 167, "var": "txt_status", "text": "派彩时间", "height": 24, "fontSize": 24, "color": "#ffffff" }, "compId": 365 }] }, { "type": "Image", "props": { "y": 70, "x": 0, "width": 188, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 275, "child": [{ "type": "Label", "props": { "text": "派彩时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 276 }] }, { "type": "Image", "props": { "y": 70, "x": 189, "width": 198, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 277, "child": [{ "type": "Label", "props": { "text": "注单号", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 278 }] }, { "type": "Image", "props": { "y": 70, "x": 388, "width": 180, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 279, "child": [{ "type": "Label", "props": { "text": "游戏名称", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 280 }] }, { "type": "Image", "props": { "y": 70, "x": 569, "width": 189, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 281, "child": [{ "type": "Label", "props": { "text": "投注金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 282 }] }, { "type": "Image", "props": { "y": 70, "x": 759, "width": 198, "skin": "comp/list_title.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 283, "child": [{ "type": "Label", "props": { "text": "已派奖", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 284 }] }, { "type": "List", "props": { "y": 119, "width": 967, "var": "list_mx", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "right": 0, "left": 0, "height": 339 }, "compId": 285, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 287, "child": [{ "type": "Image", "props": { "y": 0, "width": 962, "skin": "comp/list_item_bg1.png", "right": 5, "name": "item_bg", "left": 0, "height": 50 }, "compId": 286 }, { "type": "Label", "props": { "y": 0, "x": 0, "width": 185, "valign": "middle", "text": "label", "name": "txt_1", "height": 24, "fontSize": 24, "color": "#FFFFFF", "centerY": 0, "align": "center" }, "compId": 288 }, { "type": "Label", "props": { "y": 0, "x": 197, "width": 185, "valign": "middle", "text": "label", "name": "txt_2", "height": 24, "fontSize": 24, "color": "#FFFFFF", "centerY": 0, "align": "center" }, "compId": 289 }, { "type": "Label", "props": { "y": 0, "x": 391, "width": 175, "valign": "middle", "text": "label", "name": "txt_3", "height": 24, "fontSize": 24, "color": "#FFFFFF", "centerY": 0, "align": "center" }, "compId": 290 }, { "type": "Label", "props": { "y": 0, "x": 577, "width": 179, "valign": "middle", "text": "label", "name": "txt_4", "height": 24, "fontSize": 24, "color": "#FFFFFF", "centerY": 0, "align": "center" }, "compId": 291 }, { "type": "Label", "props": { "y": 0, "x": 770, "width": 179, "valign": "middle", "text": "label", "height": 24, "fontSize": 24, "color": "#FFFFFF", "centerY": 0, "align": "center" }, "compId": 292 }] }] }, { "type": "Label", "props": { "var": "txt_tips2", "text": "您暂时还没有任何数据 先去游戏下吧", "fontSize": 24, "color": "#ffffff", "centerY": 33, "centerX": 0 }, "compId": 294, "child": [{ "type": "Image", "props": { "y": -99, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 295 }] }, { "type": "Box", "props": { "y": 476, "x": 46 }, "compId": 302, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "text": "-合计-", "fontSize": 22, "color": "#828287" }, "compId": 296 }, { "type": "Label", "props": { "y": 0, "x": 139, "text": "充值:", "fontSize": 22, "color": "#828287" }, "compId": 297 }, { "type": "Label", "props": { "y": 0, "x": 380, "text": "提现:", "fontSize": 22, "color": "#828287" }, "compId": 298 }, { "type": "Label", "props": { "y": 53, "x": 139, "text": "优惠:", "fontSize": 22, "color": "#828287" }, "compId": 299 }, { "type": "Label", "props": { "y": 53, "x": 380, "text": "返水:", "fontSize": 22, "color": "#828287" }, "compId": 300 }, { "type": "Label", "props": { "y": 53, "x": 743, "text": "余额", "fontSize": 22, "color": "#828287" }, "compId": 301 }, { "type": "Label", "props": { "y": 0, "x": 189, "width": 145, "var": "txt_cz", "text": "0.0", "height": 22, "fontSize": 22, "color": "#13764F" }, "compId": 304 }, { "type": "Label", "props": { "y": 53, "x": 189.1123046875, "width": 145, "var": "txt_yh", "text": "0.0", "height": 22, "fontSize": 22, "color": "#CE9956" }, "compId": 305 }, { "type": "Label", "props": { "y": 0, "x": 439, "width": 145, "var": "txt_tx", "text": "0.0", "height": 22, "fontSize": 22, "color": "#6B0D27" }, "compId": 306 }, { "type": "Label", "props": { "y": 53, "x": 439, "width": 145, "var": "txt_fs", "text": "0.0", "height": 22, "fontSize": 22, "color": "#CE9956" }, "compId": 307 }, { "type": "Label", "props": { "y": 55, "x": 792, "width": 126, "var": "txt_ye", "text": "0.0", "height": 22, "fontSize": 22, "color": "#CE9956" }, "compId": 308 }] }] }, { "type": "Box", "props": { "var": "b_baoBiao", "top": 130, "right": 10, "left": 303, "height": 590 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 60, "width": 967, "skin": "bgs/ic_pc_bgm.png", "right": 0, "left": 0, "height": 524 }, "compId": 238 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 894, "var": "list_tab2", "spaceX": 5, "repeatY": 1, "repeatX": 5, "left": 0, "height": 57 }, "compId": 232, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 233, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 250, "skin": "bgs/chart_noselect.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_normal", "height": 80 }, "compId": 234 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 250, "skin": "bgs/chart_select.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_selected", "height": 80 }, "compId": 235 }, { "type": "Label", "props": { "y": 12, "x": 1, "width": 171, "text": "我的推广", "name": "txt_label", "height": 28, "fontSize": 28, "align": "center" }, "compId": 236 }] }] }, { "type": "Image", "props": { "y": 77, "width": 969, "skin": "bgs/ic_pc_title.png", "right": 0, "left": 4, "height": 48 }, "compId": 239, "child": [{ "type": "Label", "props": { "x": 46, "text": "时间设置", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 241 }] }, { "type": "Image", "props": { "y": 76, "x": 185, "width": 229, "var": "txt_time2", "skin": "comp/ic_pc_edit.png", "sizeGrid": "22,22,22,22", "height": 44 }, "compId": 253 }, { "type": "Label", "props": { "y": 86, "x": 187, "width": 187, "var": "txt_time3", "text": "派彩时间", "height": 24, "fontSize": 24, "color": "#ffffff" }, "compId": 366 }, { "type": "Box", "props": { "y": 214, "x": 83 }, "compId": 314, "child": [{ "type": "Image", "props": { "y": 62, "x": 0, "width": 600, "skin": "bgs/pc_horizonal_line.png", "centerX": 0 }, "compId": 315 }, { "type": "Image", "props": { "y": 111, "x": 246, "skin": "bgs/ic_safe_split.png" }, "compId": 316 }, { "type": "Image", "props": { "y": 111, "x": 571, "skin": "bgs/ic_safe_split.png" }, "compId": 317 }, { "type": "Image", "props": { "y": 185, "x": 0, "width": 150, "skin": "bgs/pc_text_bg.png", "height": 40 }, "compId": 318, "child": [{ "type": "Label", "props": { "y": 6, "x": 0, "text": "有效投注总额", "fontSize": 28, "color": "#C9B190" }, "compId": 323 }] }, { "type": "Image", "props": { "y": 185, "x": 340, "width": 150, "skin": "bgs/pc_text_bg.png", "height": 40 }, "compId": 319, "child": [{ "type": "Label", "props": { "y": 6, "x": 0, "width": 154, "text": "派彩总额", "height": 28, "fontSize": 28, "color": "#C9B190", "align": "center" }, "compId": 324 }] }, { "type": "Image", "props": { "y": 185, "x": 617, "width": 150, "skin": "bgs/pc_text_bg.png", "height": 40 }, "compId": 320, "child": [{ "type": "Label", "props": { "y": 6, "x": 0, "width": 157, "text": "返点总额", "height": 28, "fontSize": 28, "color": "#C9B190", "align": "center" }, "compId": 325 }] }, { "type": "Label", "props": { "y": 6, "x": 264, "text": "盈利总额:", "fontSize": 34, "color": "#414142" }, "compId": 321 }, { "type": "Label", "props": { "y": 0, "x": 415, "var": "txt_ylze", "text": "0.0", "fontSize": 40, "color": "#148759" }, "compId": 322 }, { "type": "Label", "props": { "y": 119, "x": -1, "width": 173, "var": "txt_yxtzze", "text": "0.0", "height": 40, "fontSize": 40, "color": "#FAB965", "align": "center" }, "compId": 326 }, { "type": "Label", "props": { "y": 119, "x": 336.72314453125, "width": 173, "var": "txt_pcze", "text": "0.0", "height": 40, "fontSize": 40, "color": "#FAB965", "align": "center" }, "compId": 327 }, { "type": "Label", "props": { "y": 119, "x": 616, "width": 173, "var": "txt_fdze", "text": "0.0", "height": 40, "fontSize": 40, "color": "#FAB965", "align": "center" }, "compId": 328 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 104, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 106 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 107 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_user_info.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 108 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 105, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 109, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_pc_grxx.png", "name": "bg_normal", "height": 96 }, "compId": 110 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_pc_grxx_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 111 }] }] }, { "type": "Box", "props": { "width": 967, "var": "b_touzujilv", "top": 130, "right": 10, "left": 303, "height": 581 }, "compId": 330, "child": [{ "type": "Image", "props": { "y": 0, "width": 967, "skin": "bgs/ic_gathering_bg.png", "right": 0, "left": 0, "height": 584 }, "compId": 331 }, { "type": "List", "props": { "y": 153, "width": 967, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "right": 0, "left": 0, "height": 429 }, "compId": 332, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 333, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 957, "skin": "comp/list_item_bg1.png", "sizeGrid": "14,13,10,13", "name": "item_bg", "height": 60 }, "compId": 334 }, { "type": "Label", "props": { "y": 26, "x": 0, "width": 188, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "centerY": 0, "align": "center" }, "compId": 336 }, { "type": "Label", "props": { "y": 26, "x": 200, "width": 188, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "centerY": 0, "align": "center" }, "compId": 337 }, { "type": "Label", "props": { "y": 26, "x": 387, "width": 191, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "centerY": 0, "align": "center" }, "compId": 338 }, { "type": "Label", "props": { "y": 26, "x": 585, "width": 192, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "centerY": 0, "align": "center" }, "compId": 339 }, { "type": "Label", "props": { "x": 777, "width": 169, "text": "#f4ce7f", "name": "txt_5", "height": 26, "fontSize": 26, "color": "#f4ce7f", "centerY": 0, "align": "center" }, "compId": 340 }] }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 926, "var": "list_tab1", "spaceX": 5, "repeatY": 1, "height": 58 }, "compId": 341, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 342, "child": [{ "type": "Image", "props": { "skin": "btns/ic_pc_grbb_tab.png", "scaleY": 0.5, "scaleX": 0.5, "name": "bg_normal" }, "compId": 343 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "btns/ic_pc_grbb_tab_pressed.png", "scaleY": 0.5, "scaleX": 0.5, "name": "bg_selected" }, "compId": 344 }, { "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "棋牌投注记录", "name": "txt_label", "height": 24, "fontSize": 24, "align": "center" }, "compId": 345 }] }] }, { "type": "Label", "props": { "y": 72, "x": 12, "text": "派彩时间", "fontSize": 24, "color": "#ffffff" }, "compId": 346 }, { "type": "Label", "props": { "y": 72, "x": 671, "text": "游戏平台", "fontSize": 24, "color": "#ffffff" }, "compId": 349 }, { "type": "Image", "props": { "y": 67, "x": 783, "var": "cb_pt", "skin": "bgs/ic_pc_edit.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 350 }, { "type": "Image", "props": { "y": 113.5, "x": 0, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 352, "child": [{ "type": "Label", "props": { "text": "派彩时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 353 }] }, { "type": "Image", "props": { "y": 113.5, "x": 194, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 354, "child": [{ "type": "Label", "props": { "text": "注单号", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 355 }] }, { "type": "Image", "props": { "y": 113, "x": 388, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 356, "child": [{ "type": "Label", "props": { "text": "游戏名称", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 357 }] }, { "type": "Image", "props": { "y": 113, "x": 582, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 358, "child": [{ "type": "Label", "props": { "text": "投注金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 359 }] }, { "type": "Image", "props": { "y": 113.5, "x": 776, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 360, "child": [{ "type": "Label", "props": { "text": "已派奖", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 361 }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 362, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 363 }] }, { "type": "ComboBox", "props": { "y": 73, "x": 125.5, "width": 165, "var": "cb_time", "stateNum": 1, "skin": "comp/combobox.png", "labels": "所有时间,今天,昨天,一个月内", "labelSize": 22, "labelColors": "#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF", "itemSize": 24, "itemColors": "#847C68,#ffffff,#ffffff,##847C68,#847C68", "height": 32 }, "compId": 370 }] }], "loadList": ["bgs/ic_qipai_bg.png", "comp/dactivity_nav_left.png", "bgs/ic_pc_title.png", "icons/ic_dot.png", "comp/ic_input_bg.png", "btns/ic_edit.png", "bgs/ic_gathering_bg.png", "comp/ic_pc_edit.png", "comp/list_title.png", "comp/vscroll.png", "comp/list_item_bg1.png", "comp/bg_data_null.png", "bgs/ic_pc_bgm.png", "bgs/chart_noselect.png", "bgs/chart_select.png", "bgs/pc_horizonal_line.png", "bgs/ic_safe_split.png", "bgs/pc_text_bg.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_user_info.png", "btns/ic_pc_grxx.png", "btns/ic_pc_grxx_pressed.png", "btns/ic_pc_grbb_tab.png", "btns/ic_pc_grbb_tab_pressed.png", "bgs/ic_pc_edit.png", "bgs/ic_pc_pop_wind.png", "comp/combobox.png"], "loadList3D": [] };
        return UserInfoUI;
    }(Laya.View));
    ui.UserInfoUI = UserInfoUI;
    REG("ui.UserInfoUI", UserInfoUI);
    var UserInfo1UI = /** @class */ (function (_super) {
        __extends(UserInfo1UI, _super);
        function UserInfo1UI() {
            return _super.call(this) || this;
        }
        UserInfo1UI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(UserInfo1UI.uiView);
        };
        UserInfo1UI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_qipai_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 115 }, { "type": "Image", "props": { "y": 10, "x": 10, "skin": "comp/dactivity_nav_left.png" }, "compId": 99 }, { "type": "Box", "props": { "var": "b_info", "top": 130, "right": 10, "left": 303, "height": 590 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 969, "skin": "bgs/ic_pc_title.png", "right": 0, "left": 0, "height": 48 }, "compId": 176, "child": [{ "type": "Image", "props": { "x": 23, "skin": "icons/ic_dot.png", "centerY": 0 }, "compId": 177 }, { "type": "Label", "props": { "x": 76, "text": "基础信息", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 178 }, { "type": "Box", "props": { "y": 0, "width": 133, "var": "btn_xg1", "right": 0, "height": 41 }, "compId": 257, "child": [{ "type": "Image", "props": { "y": 4, "x": 0, "stateNum": 1, "skin": "btns/ic_edit.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 0 }, "compId": 187 }, { "type": "Label", "props": { "y": 8.5, "x": 66, "text": "编辑", "fontSize": 24, "color": "#eaa65a" }, "compId": 259 }] }] }, { "type": "Label", "props": { "y": 82, "x": 64, "text": "账号：", "fontSize": 22, "color": "#eaa65a" }, "compId": 183 }, { "type": "Label", "props": { "y": 82, "x": 129, "text": "玩家账号", "name": "txt_account", "fontSize": 22, "color": "#FFFFFF" }, "compId": 184 }, { "type": "Label", "props": { "y": 135, "x": 184, "width": 267, "text": "玩家账号", "styleSkin": "comp/ic_input_bg.png", "name": "txt_level", "height": 27, "fontSize": 22, "color": "#FFFFFF" }, "compId": 186 }, { "type": "Label", "props": { "y": 137, "x": 69, "width": 44, "text": "会员等级:", "height": 22, "fontSize": 22, "color": "#eaa65a" }, "compId": 185 }, { "type": "Label", "props": { "y": 199, "x": 69, "text": "姓名：", "fontSize": 22, "color": "#eaa65a" }, "compId": 188 }, { "type": "TextInput", "props": { "y": 195, "x": 135, "width": 245, "text": "玩家账号", "skin": "comp/ic_input_bg.png", "name": "txt_name", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 189 }, { "type": "Label", "props": { "y": 264, "x": 69, "text": "邮箱：", "fontSize": 22, "color": "#eaa65a" }, "compId": 198 }, { "type": "TextInput", "props": { "y": 260, "x": 135, "width": 245, "text": "玩家账号", "skin": "comp/ic_input_bg.png", "name": "txt_mail", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 199 }, { "type": "Label", "props": { "y": 332, "x": 69, "text": "电话：", "fontSize": 22, "color": "#eaa65a" }, "compId": 200 }, { "type": "TextInput", "props": { "y": 329, "x": 138, "width": 241, "text": "玩家账号", "skin": "comp/ic_input_bg.png", "name": "txt_tel", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 201 }, { "type": "Label", "props": { "y": 403, "x": 69, "text": "微信：", "fontSize": 22, "color": "#eaa65a" }, "compId": 204 }, { "type": "TextInput", "props": { "y": 399, "x": 136, "width": 249, "text": "玩家账号", "skin": "comp/ic_input_bg.png", "name": "txt_wx", "height": 31, "fontSize": 22, "color": "#FFFFFF" }, "compId": 205 }] }, { "type": "Box", "props": { "var": "b_touZhu", "top": 130, "right": 10, "left": 303, "height": 590 }, "compId": 17, "child": [{ "type": "Image", "props": { "y": 0, "width": 967, "skin": "bgs/ic_gathering_bg.png", "right": 0, "left": 0, "height": 584 }, "compId": 212 }, { "type": "List", "props": { "y": 153, "width": 967, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "right": 0, "left": 0, "height": 429 }, "compId": 46, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 47, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 957, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 77 }, "compId": 48 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 958, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 77 }, "compId": 49 }, { "type": "Label", "props": { "y": 26, "x": 0, "width": 188, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 50 }, { "type": "Label", "props": { "y": 26, "x": 200, "width": 188, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 51 }, { "type": "Label", "props": { "y": 26, "x": 387, "width": 191, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 52 }, { "type": "Label", "props": { "y": 26, "x": 585, "width": 192, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 53 }, { "type": "Label", "props": { "y": 26, "x": 777, "width": 139, "text": "#f4ce7f", "name": "txt_5", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "left" }, "compId": 54 }] }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 926, "var": "list_tab1", "spaceX": 5, "repeatY": 1, "height": 58 }, "compId": 206, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 208, "child": [{ "type": "Image", "props": { "skin": "btns/ic_pc_grbb_tab.png", "scaleY": 0.5, "scaleX": 0.5, "name": "bg_normal" }, "compId": 209 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "btns/ic_pc_grbb_tab_pressed.png", "scaleY": 0.5, "scaleX": 0.5, "name": "bg_selected" }, "compId": 210 }, { "type": "Label", "props": { "y": 15, "x": 18.75, "text": "棋牌投注记录", "name": "txt_label", "fontSize": 24 }, "compId": 211 }] }] }, { "type": "Label", "props": { "y": 72, "x": 12, "text": "派彩时间", "fontSize": 24, "color": "#ffffff" }, "compId": 213 }, { "type": "Image", "props": { "y": 68.5, "x": 125.5, "var": "btn_time", "skin": "bgs/ic_pc_edit.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 214 }, { "type": "Label", "props": { "y": 72, "x": 147, "var": "txt_time1", "text": "派彩时间", "fontSize": 24, "color": "#ffffff" }, "compId": 215 }, { "type": "Label", "props": { "y": 72, "x": 671, "text": "游戏平台", "fontSize": 24, "color": "#ffffff" }, "compId": 216 }, { "type": "Image", "props": { "y": 67, "x": 783, "var": "btn_platfrom", "skin": "bgs/ic_pc_edit.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 217 }, { "type": "Label", "props": { "y": 71, "x": 805, "var": "txt_platfrom", "text": "全部平台", "fontSize": 24, "color": "#ffffff" }, "compId": 218 }, { "type": "Image", "props": { "y": 113.5, "x": 0, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 219, "child": [{ "type": "Label", "props": { "text": "派彩时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 220 }] }, { "type": "Image", "props": { "y": 113.5, "x": 194, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 221, "child": [{ "type": "Label", "props": { "text": "注单号", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 222 }] }, { "type": "Image", "props": { "y": 113, "x": 388, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 223, "child": [{ "type": "Label", "props": { "text": "游戏名称", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 224 }] }, { "type": "Image", "props": { "y": 113, "x": 582, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 225, "child": [{ "type": "Label", "props": { "text": "投注金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 226 }] }, { "type": "Image", "props": { "y": 113.5, "x": 776, "width": 191, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 227, "child": [{ "type": "Label", "props": { "text": "已派奖", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 228 }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 229, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 230 }] }] }, { "type": "Box", "props": { "var": "b_baoBiao", "top": 130, "right": 10, "left": 303, "height": 590 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 0, "x": -303, "width": 967, "skin": "bgs/ic_gathering_bg.png", "right": 0, "left": 0, "height": 584 }, "compId": 238 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 894, "var": "list_tab2", "spaceX": 5, "repeatY": 1, "repeatX": 5, "left": 0, "height": 57 }, "compId": 232, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 233, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 250, "skin": "bgs/chart_noselect.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_normal", "height": 80 }, "compId": 234 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 250, "skin": "bgs/chart_select.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_selected", "height": 80 }, "compId": 235 }, { "type": "Label", "props": { "y": 12, "x": 31.5, "text": "我的推广", "name": "txt_label", "fontSize": 28 }, "compId": 236 }] }] }, { "type": "Image", "props": { "y": 61, "width": 969, "skin": "bgs/ic_pc_title.png", "right": 0, "left": 0, "height": 48 }, "compId": 239, "child": [{ "type": "Label", "props": { "x": 46, "text": "开始时间", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 241 }, { "type": "Label", "props": { "x": 529, "text": "结束时间", "fontSize": 24, "color": "#eaa65a", "centerY": 0 }, "compId": 243 }] }, { "type": "Image", "props": { "y": 113, "x": 0, "width": 230, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 244, "child": [{ "type": "Label", "props": { "text": "派彩时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 248 }] }, { "type": "Image", "props": { "y": 113, "x": 238, "width": 230, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 245, "child": [{ "type": "Label", "props": { "text": "注单号", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 249 }] }, { "type": "Image", "props": { "y": 113, "x": 483.5, "width": 230, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 246, "child": [{ "type": "Label", "props": { "text": "游戏名称", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 250 }] }, { "type": "Image", "props": { "y": 113, "width": 230, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "right": 10, "height": 40 }, "compId": 247, "child": [{ "type": "Label", "props": { "text": "投注金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 251 }] }, { "type": "Image", "props": { "y": 65, "x": 185, "width": 229, "skin": "comp/ic_input_bg.png", "sizeGrid": "22,22,22,22", "height": 44 }, "compId": 253 }, { "type": "Image", "props": { "y": 63, "x": 665, "width": 229, "skin": "comp/ic_input_bg.png", "sizeGrid": "22,22,22,22", "height": 44 }, "compId": 254 }, { "type": "List", "props": { "y": 161, "x": 0, "width": 965, "height": 416 }, "compId": 255, "child": [{ "type": "Box", "props": {}, "compId": 256 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 104, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 106 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 107 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_user_info.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 108 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 105, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 109, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_pc_grxx.png", "name": "bg_normal", "height": 96 }, "compId": 110 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_pc_grxx_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 111 }] }] }, { "type": "Box", "props": { "var": "b_vipInfo" }, "compId": 231 }], "loadList": ["bgs/ic_qipai_bg.png", "comp/dactivity_nav_left.png", "bgs/ic_pc_title.png", "icons/ic_dot.png", "btns/ic_edit.png", "comp/ic_input_bg.png", "bgs/ic_gathering_bg.png", "comp/vscroll.png", "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "btns/ic_pc_grbb_tab.png", "btns/ic_pc_grbb_tab_pressed.png", "bgs/ic_pc_edit.png", "bgs/ic_pc_pop_wind.png", "comp/bg_data_null.png", "bgs/chart_noselect.png", "bgs/chart_select.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_user_info.png", "btns/ic_pc_grxx.png", "btns/ic_pc_grxx_pressed.png"], "loadList3D": [] };
        return UserInfo1UI;
    }(Laya.View));
    ui.UserInfo1UI = UserInfo1UI;
    REG("ui.UserInfo1UI", UserInfo1UI);
    var XiMaUI = /** @class */ (function (_super) {
        __extends(XiMaUI, _super);
        function XiMaUI() {
            return _super.call(this) || this;
        }
        XiMaUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(XiMaUI.uiView);
        };
        XiMaUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 47 }, { "type": "Box", "props": { "y": 125, "right": 15, "left": 300, "height": 603 }, "compId": 46, "child": [{ "type": "Image", "props": { "y": 123, "skin": "bgs/ic_mingxi_bottom.png", "sizeGrid": "14,11,6,10", "scaleY": -1, "right": 8, "left": 0, "height": 120 }, "compId": 16 }, { "type": "Image", "props": { "y": 64, "width": 957, "skin": "bgs/ic_mingxi_bottom.png", "scaleY": -1, "right": 8, "left": 0, "height": 60 }, "compId": 17 }, { "type": "Label", "props": { "y": 22, "x": 71, "text": "总计游戏投注:", "fontSize": 24, "color": "#79787b" }, "compId": 18 }, { "type": "Label", "props": { "y": 22, "x": 230.318359375, "text": "0.0", "fontSize": 24, "color": "#ffd784" }, "compId": 19 }, { "type": "Label", "props": { "y": 83, "x": 607, "text": "比例", "fontSize": 24, "color": "#ffd784" }, "compId": 27 }, { "type": "Label", "props": { "y": 83, "x": 813, "text": "洗码金额", "fontSize": 24, "color": "#ffd784" }, "compId": 28 }, { "type": "Image", "props": { "y": 538, "x": 0, "width": 978, "skin": "bgs/ic_mingxi_bottom.png", "sizeGrid": "20,17,15,18", "height": 85 }, "compId": 34 }, { "type": "Label", "props": { "y": 569, "x": 21, "width": 608, "text": "上次结算时间:2019/12/12 洗码金额：￥200", "height": 24, "fontSize": 24, "color": "#c7c7c7" }, "compId": 35 }, { "type": "Button", "props": { "y": 555, "x": 813, "var": "btn_sd", "stateNum": 1, "skin": "btns/pc_sdxm_btn.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 36 }, { "type": "List", "props": { "y": 123, "x": 8, "width": 959, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 391 }, "compId": 37, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 38, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 957, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 45 }, "compId": 76 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 958, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 45 }, "compId": 77 }, { "type": "Label", "props": { "y": 8, "x": 10, "width": 218, "text": "FC棋牌", "name": "txt_1", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 40 }, { "type": "Label", "props": { "y": 8, "x": 247, "width": 223, "text": "FC棋牌", "name": "txt_2", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 41 }, { "type": "Label", "props": { "y": 8, "x": 479, "width": 227, "text": "FC棋牌", "name": "txt_3", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 42 }, { "type": "Label", "props": { "y": 8, "x": 722, "width": 217, "text": "FC棋牌", "name": "txt_4", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 43 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 57, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 58 }] }, { "type": "Box", "props": { "y": 74, "width": 962, "right": 0, "left": 3, "height": 41 }, "compId": 62, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 237, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 60, "child": [{ "type": "Label", "props": { "text": "全部游戏", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 61 }] }, { "type": "Image", "props": { "y": 0, "x": 238.5, "width": 237, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 70, "child": [{ "type": "Label", "props": { "text": "游戏洗码量", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 71 }] }, { "type": "Image", "props": { "y": 0, "x": 477, "width": 237, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 72, "child": [{ "type": "Label", "props": { "text": "比例", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 73 }] }, { "type": "Image", "props": { "y": 0, "x": 716, "width": 237, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 74, "child": [{ "type": "Label", "props": { "text": "洗码金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#f3d667", "centerY": 0, "align": "center" }, "compId": 75 }] }] }, { "type": "Box", "props": { "y": 11.5, "var": "btn_histroy", "right": 8 }, "compId": 63, "child": [{ "type": "Label", "props": { "y": 10.5, "x": 47, "text": "历史洗码记录", "fontSize": 24, "color": "#ffd784" }, "compId": 20 }, { "type": "Button", "props": { "y": 0, "x": 0, "stateNum": 1, "skin": "btns/ic_xima_history.png" }, "compId": 21 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 48, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 50 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 51 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_xima_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 52 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 49, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 53, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_xima_qipai.png", "name": "bg_normal", "height": 96 }, "compId": 54 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_xima_qipai_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 55 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_mingxi_bottom.png", "btns/pc_sdxm_btn.png", "comp/vscroll.png", "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "comp/bg_data_null.png", "bgs/ic_pc_pop_wind.png", "btns/ic_xima_history.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_xima_title.png", "btns/ic_xima_qipai.png", "btns/ic_xima_qipai_pressed.png"], "loadList3D": [] };
        return XiMaUI;
    }(Laya.View));
    ui.XiMaUI = XiMaUI;
    REG("ui.XiMaUI", XiMaUI);
    var XiMaHistroyUI = /** @class */ (function (_super) {
        __extends(XiMaHistroyUI, _super);
        function XiMaHistroyUI() {
            return _super.call(this) || this;
        }
        XiMaHistroyUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(XiMaHistroyUI.uiView);
        };
        XiMaHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_xima_detail.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 547, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 277, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 15 }, { "type": "Image", "props": { "y": 130, "x": 817, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 16 }, { "type": "Label", "props": { "y": 137, "x": 46, "width": 191, "text": "洗码时间", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 618, "width": 126, "text": "洗码金额", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 7 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1078, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 460 }, "compId": 8, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 267, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 12 }, { "type": "Label", "props": { "y": 3, "x": 809, "width": 269, "text": "123456", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 5, "x": 270.5, "width": 267, "text": "20171212", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 19 }, { "type": "Label", "props": { "y": 3, "x": 537.5, "width": 267, "text": "20171212", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 20 }] }] }, { "type": "Button", "props": { "y": 0, "x": 989, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 9 }, { "type": "Label", "props": { "y": 137, "x": 361, "width": 100, "text": "洗码量", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 17 }, { "type": "Label", "props": { "y": 137, "x": 901, "width": 100, "text": "详情", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 18 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 21, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 22 }] }], "loadList": ["bgs/ic_xima_detail.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "btns/ic_close.png", "comp/bg_data_null.png"], "loadList3D": [] };
        return XiMaHistroyUI;
    }(Laya.Dialog));
    ui.XiMaHistroyUI = XiMaHistroyUI;
    REG("ui.XiMaHistroyUI", XiMaHistroyUI);
})(ui = exports.ui || (exports.ui = {}));

},{}]},{},[1]);
