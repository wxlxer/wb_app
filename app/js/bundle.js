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

},{"./com/Hall":5,"./ui/layaMaxUI":33}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function login(username, pwd) {
    g_net.request(gamelib.GameMsg.Login, { un: username, pw: pwd });
    gamelib.Api.saveLocalStorage('username', username);
    gamelib.Api.saveLocalStorage('password', pwd);
}
exports.default = login;

},{}],5:[function(require,module,exports){
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
        switch (msg) {
            case gamelib.GameMsg.Login:
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (data.retCode == 0) {
                    GameVar.s_token = data.retMsg;
                    //请求用户信息
                    g_net.requestWithToken(gamelib.GameMsg.MemberInfo, {});
                    this._res['b_unlogin'].visible = false;
                }
                else {
                    UiMainager_1.g_uiMgr.showTip(data.retMsg);
                }
                break;
            case gamelib.GameMsg.Basicxingxi:
                if (data.retCode != 0)
                    return;
                PlayerData_1.g_playerData.m_phone = requestData.gmyphone;
                PlayerData_1.g_playerData.m_nickName = requestData.gmyname;
                PlayerData_1.g_playerData.m_wx = requestData.WeChat;
                PlayerData_1.g_playerData.m_mail = requestData.mailbox;
                break;
            case gamelib.GameMsg.MemberInfo:
                if (data.retCode == 0) {
                    var temp = JSON.parse(data.retMsg);
                    PlayerData_1.g_playerData.m_name = temp.Username;
                    PlayerData_1.g_playerData.m_isOldWithNew = temp.is_oldwithnew;
                    PlayerData_1.g_playerData.m_money = temp.Mymoney;
                    PlayerData_1.g_playerData.m_phone = temp.Myphone;
                    PlayerData_1.g_playerData.m_nickName = temp.Myname;
                    PlayerData_1.g_playerData.m_wx = temp.WeChat;
                    PlayerData_1.g_playerData.m_mail = temp.mailbox;
                    this._res['txt_name'].text = PlayerData_1.g_playerData.m_name;
                    this._res['txt_money'].text = PlayerData_1.g_playerData.m_money;
                }
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
                if (data.retCode != 0)
                    return;
                if (requestData.gametype == -3) //热门
                 {
                    GameData_1.g_gameData.parseHotGame(data.retData);
                    this.onTabChange(this._tab.selectedIndex);
                }
                break;
            case gamelib.GameMsg.Getapi:
                if (data.retCode != 0)
                    return;
                GameData_1.g_gameData.parseGetAip(data.retData);
                this.onTabChange(this._tab.selectedIndex);
                break;
            case gamelib.GameMsg.GetApilogin:
                if (data.retCode != 0)
                    return;
                UiMainager_1.g_uiMgr.closeMiniLoading();
                if (window['enterGame']) {
                    window['enterGame'].call(window, { url: data.retMsg });
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

},{"./Global":4,"./HuoDong":6,"./KeFu":7,"./SetUi":10,"./UiMainager":11,"./UserInfo":12,"./chongzhi/ChongZhi":13,"./control/TabList":15,"./data/GameData":16,"./data/PlayerData":17,"./gameList/GameList":18,"./login/LoginUi":19,"./login/RegisterUi":20,"./mail/MailUi":22,"./notice/Notice":23,"./notice/NoticeMsg":24,"./tixian/TiXianUi":26,"./tuiguang/TuiGuang":30,"./xima/XiMa":31}],6:[function(require,module,exports){
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

},{"./BasePanel":3,"./control/TabList":15}],7:[function(require,module,exports){
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

},{"./BasePanel":3,"./control/TabList":15}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
    };
    SetUi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    SetUi.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showSound();
        else if (index == 1)
            this.showPWD();
        else
            this.showAPP();
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
    };
    return SetUi;
}(gamelib.core.Ui_NetHandle));
exports.default = SetUi;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MiniLoadingUi_1 = require("./MiniLoadingUi");
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
     * 显示提示文本。通常是在屏幕中浮起一个文本，几秒后自动消失，可以指定要显示的位置，文本的颜色，尺寸
     * @function showTip_ex
     * @DateTime 2018-03-16T14:36:30+0800
     * @param    {number} arg msg:提示文本
     *                        x，y:左边
     *                        color:文本的颜色
     *                        size:文本的尺寸
     *                        time:文本的显示时间
     */
    UiMainager.prototype.showTip_ex = function (arg) {
        arg.color = arg.color || "#09ff88";
        arg.size = arg.size || 24;
        arg.time = arg.time || 1000;
        arg.x = isNaN(arg.x) ? (g_gameMain.m_gameWidth) / 2 : arg.x;
        arg.y = isNaN(arg.y) ? (g_gameMain.m_gameHeight) / 2 : arg.y;
        var txt = new laya.ui.Label();
        txt.fontSize = arg.size;
        txt.color = arg.color;
        txt.align = "center";
        txt.name = "_txt";
        txt.text = arg.msg;
        Laya.stage.addChild(txt);
        var timeLine = new Laya.TimeLine();
        txt.x = arg.x;
        txt.y = arg.y + 100;
        timeLine.addLabel("toShow", 0).to(txt, { y: arg.y, alpha: 1 }, 300, Laya.Ease.backIn);
        timeLine.addLabel("toHide", 0).to(txt, { y: arg.y - 100, alpha: 0.3 }, 300, Laya.Ease.backIn, arg.time);
        timeLine.play(0, false);
        timeLine.on(laya.events.Event.COMPLETE, this, function (evt) {
            timeLine.offAll(laya.events.Event.COMPLETE);
            txt.removeSelf();
        });
    };
    UiMainager.prototype.getEffectTip = function (isWarning, create) {
        var list = isWarning ? this._waring_tip_list : this._tip_list;
        if (!create) {
            if (list.length > 0)
                return list.shift();
        }
        var spr = new laya.ui.Image();
        spr.skin = "qpq/comp/tips_bg_1.png";
        spr.sizeGrid = "16,50,16,50";
        spr.sizeGrid = "24,255,25,256";
        var txt = new laya.ui.Label();
        txt.fontSize = 24;
        if (isWarning) {
            txt.color = "#ff2323";
        }
        else {
            txt.color = "#09ff88";
        }
        txt.align = "center";
        txt.name = "_txt";
        spr.width = txt.width < 512 ? 512 : txt.width + 100;
        spr.height = 50;
        spr.pivotX = spr.width / 2;
        spr.pivotY = spr.height / 2;
        spr.addChild(txt);
        spr.zOrder = 100;
        if (create) {
            list.push(spr);
        }
        return spr;
    };
    UiMainager.prototype.showTipsEffect = function (str, effectType, isWarning) {
        var spr = this.getEffectTip(isWarning);
        var txt = spr.getChildByName("_txt");
        txt.text = str;
        spr.zOrder = 2000;
        spr.width = txt.width < 512 ? 512 : txt.width + 100;
        spr.height = 50;
        txt.x = (spr.width - txt.width) / 2;
        txt.y = (spr.height - txt.height) / 2;
        spr.pivotX = spr.width / 2;
        spr.pivotY = spr.height / 2;
        spr.pivotX = spr.width / 2;
        spr.pivotY = spr.height / 2;
        Laya.stage.addChild(spr);
        var tx = (g_gameMain.m_gameWidth) / 2;
        var ty = (g_gameMain.m_gameHeight) / 2;
        var timeLine = new Laya.TimeLine();
        spr.alpha = 0.3;
        switch (effectType) {
            case 1:
                spr.x = (Laya.stage.width) / 2;
                spr.y = ty + 100;
                timeLine.addLabel("toShow", 0).to(spr, { y: ty, alpha: 1 }, 300, Laya.Ease.backIn);
                timeLine.addLabel("toHide", 0).to(spr, { y: ty - 100, alpha: 0.3 }, 300, Laya.Ease.backIn, 3000);
                break;
            case 2:
                spr.x = -spr.width - 50;
                spr.y = ty;
                timeLine.addLabel("toShow", 0).to(spr, { x: tx, alpha: 1 }, 300, Laya.Ease.backIn);
                timeLine.addLabel("toHide", 0).to(spr, { x: g_gameMain.m_gameWidth + spr.pivotX, alpha: 0.3 }, 300, Laya.Ease.backIn, 3000);
                break;
            case 3:
                spr.x = Laya.stage.width;
                spr.y = ty;
                timeLine.addLabel("toShow", 0).to(spr, { x: tx, alpha: 1 }, 300, Laya.Ease.backIn);
                timeLine.addLabel("toHide", 0).to(spr, { x: -spr.width - spr.pivotX, alpha: 0.3 }, 300, Laya.Ease.backIn, 3000);
                break;
            case 4:
                spr.x = tx;
                spr.y = ty;
                spr.scaleX = spr.scaleY = 0.1;
                timeLine.addLabel("toShow", 0).to(spr, { scaleX: 1, alpha: 1 }, 300, Laya.Ease.backIn);
                timeLine.addLabel("toHide", 0).to(spr, { scaleX: 0.1, alpha: 0.3 }, 300, Laya.Ease.backIn, 3000);
                break;
        }
        timeLine.play(0, false);
        var list = isWarning ? this._waring_tip_list : this._tip_list;
        timeLine.on(laya.events.Event.COMPLETE, this, function (evt) {
            timeLine.offAll(laya.events.Event.COMPLETE);
            spr.removeSelf();
            list.push(spr);
        });
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
        var temp = this._alertList.shift();
        if (temp == null)
            temp = new gamelib.alert.AlertUi();
        return temp;
    };
    return UiMainager;
}());
exports.default = UiMainager;
var TipEffect = /** @class */ (function () {
    function TipEffect() {
        this._bg = new Laya.Image();
        this._bg.skin = "qpq/comp/tips_bg_1.png";
        this._bg.sizeGrid = "16,50,16,50";
        this._bg.sizeGrid = "24,255,25,256";
        this._label = new laya.ui.Label();
        this._label.fontSize = 24;
        this._label.align = "center";
        this._label.name = "_txt";
        this._bg.x = Laya.stage.width / 2;
        this._bg.y = Laya.stage.height / 2;
        // spr.width = txt.width < 512 ? 512 : txt.width + 100;
        // spr.height = 50;
        // spr.pivotX = spr.width / 2;
        // spr.pivotY = spr.height / 2;
        // spr.addChild(txt);
        // spr.zOrder = 100;
    }
    TipEffect.prototype.setMsg = function (msg, isWarning) {
        this._label.text = msg;
        this._label.color = isWarning ? "#ff2323" : "#09ff88";
        this._bg.width = this._label.width < 512 ? 512 : this._label.width + 100;
        this._bg.height = 50;
        this._bg.pivotX = this._bg.width / 2;
        this._bg.pivotY = this._bg.height / 2;
        this._label.x = (this._bg.width - this._label.width) / 2;
        this._label.y = (this._bg.height - this._label.height) / 2;
        this._bg.addChild(this._label);
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

},{"./MiniLoadingUi":8}],12:[function(require,module,exports){
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
        this._res['txt_account'].text = PlayerData_1.g_playerData.m_name;
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

},{"./BasePanel":3,"./Plug":9,"./control/TabList":15,"./data/PlayerData":17}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChongZhiHistroy_1 = require("./ChongZhiHistroy");
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
var ChongZhi = /** @class */ (function (_super) {
    __extends(ChongZhi, _super);
    function ChongZhi() {
        return _super.call(this, "ui.ChongZhiUiUI") || this;
    }
    ChongZhi.prototype.init = function () {
        this._tab = new TabList_1.default(this._res['list_1']);
        this._tab.tabChangeHander = Laya.Handler.create(this, this.onTabChange, null, false);
        this._tab.setItemRender(Laya.Handler.create(this, this.onTabItemRender, null, false));
        this.addBtnToListener("btn_sx");
        this.addBtnToListener("btn_histroy");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_goCz");
        this.addBtnToListener("btn_prev");
        this.addBtnToListener("btn_tjcz");
        this._btn = null;
    };
    ChongZhi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    ChongZhi.prototype.initTabData = function () {
        var arr = [];
        for (var i = 0; i < 3; i++) {
            arr.push({ "label": "", icon: "", isHot: false });
        }
        this._tab.dataSource = arr;
    };
    ChongZhi.prototype.onTabItemRender = function (box, index, data) {
    };
    ChongZhi.prototype.onTabChange = function (index) {
        if (this._datas == null)
            return;
        var data = this._datas[index];
        if (data.type == 0)
            this.showBank();
        else if (data.type == 1)
            this.showChongZhi("zfb");
        else
            this.showChongZhi("wx");
    };
    // private onItemRender(box:Laya.Box,index:number):void
    // {
    // }
    ChongZhi.prototype.showBank = function () {
        this._res['b_bank'].visible = true;
        this._res['b_zfb'].visible = false;
        this._res['b_tips'].visible = true;
        this._res['b_input'].visible = false;
    };
    ChongZhi.prototype.showChongZhi = function (value) {
        this._res['b_zfb'].visible = true;
        this._res['b_bank'].visible = false;
        if (this._btn) {
            this._btn.selected = false;
        }
        this._res['txt_input'].text = "";
    };
    ChongZhi.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "btn_sx": //刷新
                break;
            case "btn_histroy": //充值历史
                this._histroy = this._histroy || new ChongZhiHistroy_1.default();
                this._histroy.show();
                break;
            case "btn_clear":
                this._res['txt_input'].text = "";
                break;
            case "btn_goCz":
                this._res['b_tips'].visible = false;
                this._res['b_input'].visible = true;
                break;
            case "btn_prev":
                this._res['b_tips'].visible = true;
                this._res['b_input'].visible = false;
                break;
            case "btn_tjcz":
                this.goChongZhi(this._tab.selectedIndex, parseInt(this._res['txt_input'].text));
                break;
        }
    };
    ChongZhi.prototype.goChongZhi = function (type, money) {
        console.log("前去充值" + (this._tab.selectedIndex == 1 ? "支付宝" : "微信充值") + " " + money);
    };
    ChongZhi.prototype.onClickBtns = function (evt) {
        if (this._btn) {
            this._btn.selected = false;
        }
        this._btn = evt.currentTarget;
        this._res['txt_input'].text = this._btn.getChildAt(0).text;
    };
    return ChongZhi;
}(BasePanel_1.default));
exports.default = ChongZhi;

},{"../BasePanel":3,"../control/TabList":15,"./ChongZhiHistroy":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseHistroy_1 = require("../BaseHistroy");
var ChongZhiHistroy = /** @class */ (function (_super) {
    __extends(ChongZhiHistroy, _super);
    function ChongZhiHistroy() {
        return _super.call(this, 'ui.ChongZhiHistroyUI') || this;
    }
    ChongZhiHistroy.prototype.onItemRender = function (box, index) {
    };
    return ChongZhiHistroy;
}(BaseHistroy_1.default));
exports.default = ChongZhiHistroy;

},{"../BaseHistroy":2}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var obj = list_1[_i];
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

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerData = /** @class */ (function () {
    function PlayerData() {
        this.m_name = "";
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

},{}],18:[function(require,module,exports){
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

},{"../UiMainager":11,"../data/GameData":16}],19:[function(require,module,exports){
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

},{"../Global":4,"../UiMainager":11}],20:[function(require,module,exports){
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

},{"../Global":4,"../UiMainager":11}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"./MailInfo":21}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"../BaseHistroy":2}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TiXianHistroy_1 = require("./TiXianHistroy");
var BasePanel_1 = require("../BasePanel");
var TabList_1 = require("../control/TabList");
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

},{"../BasePanel":3,"../control/TabList":15,"./TiXianHistroy":25}],27:[function(require,module,exports){
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

},{"../BaseHistroy":2}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"../BaseHistroy":2}],30:[function(require,module,exports){
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

},{"../BasePanel":3,"../UiMainager":11,"../control/TabList":15,"./FanYongList":27,"./GetYongJin":28,"./LingQuHistroy":29}],31:[function(require,module,exports){
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

},{"../BasePanel":3,"../control/TabList":15,"./XiMaHistroy":32}],32:[function(require,module,exports){
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

},{"../BaseHistroy":2}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var View = Laya.View;
var Dialog = Laya.Dialog;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
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
        ChongZhiHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1097, "height": 664 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 19 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_deposit_record_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 20 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 21 }] }, { "type": "List", "props": { "y": 170, "x": 39, "width": 1034, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 15, "repeatX": 1, "height": 449 }, "compId": 9, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "width": 206, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 14 }, { "type": "Label", "props": { "y": 5, "x": 213, "width": 206, "text": "123456", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 15 }, { "type": "Label", "props": { "y": 5, "x": 421, "width": 203, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 16 }, { "type": "Label", "props": { "y": 5, "x": 630, "width": 203, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 35 }, { "type": "Label", "props": { "y": 5, "x": 842, "width": 178, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 36 }] }] }, { "type": "Label", "props": { "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 12, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 17 }] }, { "type": "Box", "props": { "y": 130, "x": 35, "width": 1043, "height": 500 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 0, "x": 4, "width": 207, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4, "child": [{ "type": "Label", "props": { "y": 7, "text": "全部时间", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 7 }] }, { "type": "Image", "props": { "y": 0, "x": 213, "width": 207, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 25, "child": [{ "type": "Label", "props": { "y": 7, "text": "全部类型", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 26 }] }, { "type": "Image", "props": { "y": 0, "x": 422, "width": 207, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 7, "text": "全部状态", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 30 }] }, { "type": "Image", "props": { "y": 0, "x": 631, "width": 207, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 31, "child": [{ "type": "Label", "props": { "y": 7, "text": "金额", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 32 }] }, { "type": "Image", "props": { "y": 0, "x": 840, "width": 208, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 33, "child": [{ "type": "Label", "props": { "y": 7, "text": "详情", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 34 }] }] }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_deposit_record_title.png", "btns/ic_close.png", "comp/vscroll.png", "comp/bg_data_null.png", "bgs/ic_pc_pop_wind.png"], "loadList3D": [] };
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
        ChongZhiUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 179 }, { "type": "Image", "props": { "top": 0, "skin": "comp/dactivity_nav_left.png", "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "y": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 4, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 5 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 6 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_recharge_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 7 }, { "type": "Image", "props": { "skin": "bgs/ic_recharge_account.png", "scaleY": 0.8, "scaleX": 0.8, "centerY": 2, "centerX": 88 }, "compId": 8 }, { "type": "Button", "props": { "var": "btn_refresh", "stateNum": 1, "skin": "btns/btn_refresh.png", "right": 292, "centerY": 0 }, "compId": 10 }, { "type": "Button", "props": { "y": 27, "var": "btn_histroy", "stateNum": 1, "skin": "btns/ic_recharge_jilu.png", "scaleY": 0.8, "scaleX": 0.8, "right": 14 }, "compId": 9 }, { "type": "Label", "props": { "y": 46, "x": 702, "width": 191, "var": "txt_money", "text": "0.0", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 11 }] }, { "type": "Box", "props": { "var": "b_bank", "right": 5, "left": 298, "height": 598, "bottom": 0 }, "compId": 19, "child": [{ "type": "Box", "props": { "var": "b_tips", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 39, "x": 60, "skin": "icons/ic_dot.png" }, "compId": 20 }, { "type": "Label", "props": { "y": 38, "x": 92, "text": "充值收款银行选择", "fontSize": 22, "color": "#d6c09a" }, "compId": 21 }, { "type": "List", "props": { "y": 83, "var": "list_banklist", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "right": 5, "left": 10, "height": 446 }, "compId": 130, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 131, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_member_find_bg.png", "sizeGrid": "16,24,13,24", "right": 0, "left": 0, "height": 144 }, "compId": 132 }, { "type": "Image", "props": { "y": 25, "x": 50, "skin": "icons/bankIcon.png", "sizeGrid": "30,34,26,34", "name": "img_bank" }, "compId": 22 }, { "type": "Label", "props": { "y": 25, "x": 148, "text": "网银、手机网页庄站通道送2%", "name": "txt_info", "fontSize": 30, "color": "#ffffff", "bold": true }, "compId": 133 }, { "type": "Label", "props": { "y": 79, "x": 148, "text": "2123156465464564.", "name": "txt_id", "fontSize": 30, "color": "#ffffff", "bold": true }, "compId": 134 }, { "type": "Button", "props": { "y": 40, "x": 766, "stateNum": 1, "skin": "btns/ic_to_recharge.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 135 }] }] }] }, { "type": "Box", "props": { "var": "b_input", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 26, "child": [{ "type": "Image", "props": { "y": 20, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "left": 16 }, "compId": 27, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款银行", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 67 }] }, { "type": "Image", "props": { "y": 20, "skin": "bgs/ddeposit_chonzhishoukuanbg.png", "right": 0 }, "compId": 28, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款银行", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 68 }] }, { "type": "Label", "props": { "y": 133, "x": 32, "text": "收款银行", "fontSize": 24, "color": "#a0a0a0" }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_bankName", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 30 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 36, "child": [{ "type": "Line", "props": { "y": 1, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 38 }] }, { "type": "Button", "props": { "y": -6, "x": 358, "var": "btn_copy1", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 39 }] }, { "type": "Label", "props": { "y": 209, "x": 32, "width": 98, "text": "收款人", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "center" }, "compId": 52, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_name", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 53 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 54, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 55 }] }, { "type": "Button", "props": { "y": -3, "x": 360, "var": "btn_copy2", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 56 }] }, { "type": "Label", "props": { "y": 283, "x": 32, "text": "收款账号", "fontSize": 24, "color": "#a0a0a0" }, "compId": 57, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_zh", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 58 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 59, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 60 }] }, { "type": "Button", "props": { "y": 0, "x": 356, "var": "btn_copy3", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 61 }] }, { "type": "Label", "props": { "y": 357, "x": 32, "width": 96, "text": "开户地", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "center" }, "compId": 62, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_khd", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 63 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 64, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 65 }] }, { "type": "Button", "props": { "y": 0, "x": 361, "var": "btn_copy4", "stateNum": 1, "skin": "btns/ic_copy2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 66 }] }, { "type": "Label", "props": { "y": 493, "x": 26, "text": "第一步:复制收款银行前往充值", "height": 24, "fontSize": 20, "color": "#a0a0a0", "align": "center" }, "compId": 69 }, { "type": "Label", "props": { "y": 138, "x": 543, "text": "存款金额", "fontSize": 24, "color": "#a0a0a0" }, "compId": 74 }, { "type": "Image", "props": { "y": 126, "x": 654, "width": 302, "skin": "comp/ic_input_bg.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 79, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 279, "var": "txt_ckje", "type": "number", "prompt": "支付限额100-100000", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 80 }] }, { "type": "Label", "props": { "y": 224, "x": 543, "text": "存款信息", "fontSize": 24, "color": "#a0a0a0" }, "compId": 81 }, { "type": "Image", "props": { "y": 212, "x": 654, "width": 302, "skin": "comp/ic_input_bg.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 82, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 279, "var": "txt_ckrxm", "type": "text", "prompt": "填写存款人姓名", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 83 }] }, { "type": "Label", "props": { "y": 487, "x": 530, "text": "第二步:充值完成，填写您的存款信息.最后提交充值", "height": 24, "fontSize": 20, "color": "#a0a0a0", "align": "center" }, "compId": 84 }, { "type": "Button", "props": { "y": 520, "x": 83.5, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 85 }, { "type": "Button", "props": { "y": 518, "x": 675, "var": "btn_tjcz", "stateNum": 1, "skin": "btns/ic_go.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 86 }] }] }, { "type": "Box", "props": { "var": "b_zf", "right": 5, "left": 298, "height": 598, "bottom": 0 }, "compId": 136, "child": [{ "type": "Label", "props": { "y": 95, "x": 32, "text": "玩家常玩的充值金额", "fontSize": 24, "color": "#ffffff" }, "compId": 141 }, { "type": "Image", "props": { "y": 70, "x": 0, "width": 966, "skin": "bgs/ic_online_bg.png", "height": 524 }, "compId": 142 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 964, "spaceX": 10, "repeatY": 1, "name": "list_2", "height": 61 }, "compId": 154, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 156, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao2.png" }, "compId": 158 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/ddeposit_chonzhizhifubaotongdao.png", "name": "img_selected" }, "compId": 157 }, { "type": "Label", "props": { "y": 6, "x": 0, "width": 176, "text": "微信", "name": "txt_name", "height": 28, "fontSize": 24, "align": "center" }, "compId": 159 }, { "type": "Image", "props": { "y": 6, "x": 123, "skin": "icons/ic_charge_discount.png", "scaleY": 0.5, "scaleX": 0.5, "name": "img_yh" }, "compId": 164 }, { "type": "Label", "props": { "y": 36, "x": 0, "width": 176, "text": "微信", "name": "txt_info", "height": 20, "fontSize": 22, "align": "center" }, "compId": 165 }] }] }, { "type": "List", "props": { "y": 138, "width": 957, "spaceY": 20, "spaceX": 120, "right": 10, "name": "list_3", "left": 10, "height": 163 }, "compId": 166, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 168, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 138, "skin": "comp/ic_pc_grbb_tab.png", "sizeGrid": "15,15,15,15", "height": 55 }, "compId": 169 }, { "type": "Image", "props": { "width": 138, "skin": "comp/ic_pc_grbb_tab_pressed.png", "sizeGrid": "15,15,15,15", "name": "img_selected", "height": 55 }, "compId": 170 }, { "type": "Label", "props": { "y": 13, "x": 4, "width": 131, "text": "10000元", "name": "txt_value", "height": 26, "fontSize": 26, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 171 }] }] }, { "type": "Image", "props": { "y": 309, "width": 967, "skin": "bgs/ic_safe_yue_bg.png", "sizeGrid": "19,15,36,13", "right": 5, "left": 5, "height": 164 }, "compId": 172, "child": [{ "type": "Label", "props": { "y": 28, "x": 32, "text": "充值金额", "fontSize": 36, "color": "#ffffff", "bold": true }, "compId": 173 }, { "type": "Image", "props": { "y": 20, "x": 246, "width": 399, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 60 }, "compId": 174, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_oldPwd", "type": "password", "text": "111", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 175 }] }, { "type": "Button", "props": { "y": 20, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_clear_bg.png", "scaleY": 0.6, "scaleX": 0.6, "right": 50 }, "compId": 176 }] }, { "type": "Button", "props": { "stateNum": 1, "skin": "btns/ic_commit_charge.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 0, "bottom": 10 }, "compId": 177 }] }, { "type": "Box", "props": { "width": 283, "var": "b_left", "top": 120, "left": 0, "height": 600, "bottom": 0 }, "compId": 144, "child": [{ "type": "List", "props": { "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "top": 0, "spaceY": 5, "right": 0, "left": 0, "bottom": 0 }, "compId": 146, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 147, "child": [{ "type": "Image", "props": { "x": 0, "width": 283, "skin": "bgs/ic_charge_unchose.png", "name": "img_normal", "height": 86 }, "compId": 148 }, { "type": "Image", "props": { "width": 283, "skin": "bgs/ic_charge_chose.png", "name": "img_selected", "height": 86 }, "compId": 149 }, { "type": "Image", "props": { "x": 16, "width": 50, "skin": "bgs/nfc_icon.png", "name": "img_type", "height": 50, "centerY": 0 }, "compId": 150 }, { "type": "Label", "props": { "y": 30, "x": 89, "width": 189, "text": "label", "name": "txt_name", "height": 26, "fontSize": 26 }, "compId": 152 }, { "type": "Image", "props": { "y": 5.5, "x": 223, "skin": "icons/ic_charge_discount.png", "scaleY": 0.5, "scaleX": 0.5, "name": "img_yh" }, "compId": 153 }] }] }] }], "loadList": ["bgs/ic_recharge_bg.png", "comp/dactivity_nav_left.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_recharge_title.png", "bgs/ic_recharge_account.png", "btns/btn_refresh.png", "btns/ic_recharge_jilu.png", "icons/ic_dot.png", "comp/vscroll.png", "bgs/ic_member_find_bg.png", "icons/bankIcon.png", "btns/ic_to_recharge.png", "bgs/ddeposit_chonzhishoukuanbg.png", "btns/ic_copy2.png", "comp/ic_input_bg.png", "btns/ic_return_back.png", "btns/ic_go.png", "bgs/ic_online_bg.png", "comp/ddeposit_chonzhizhifubaotongdao2.png", "comp/ddeposit_chonzhizhifubaotongdao.png", "icons/ic_charge_discount.png", "comp/ic_pc_grbb_tab.png", "comp/ic_pc_grbb_tab_pressed.png", "bgs/ic_safe_yue_bg.png", "comp/big_input_box.png", "btns/ic_clear_bg.png", "btns/ic_commit_charge.png", "bgs/ic_charge_unchose.png", "bgs/ic_charge_chose.png", "bgs/nfc_icon.png"], "loadList3D": [] };
        return ChongZhiUiUI;
    }(View));
    ui.ChongZhiUiUI = ChongZhiUiUI;
    REG("ui.ChongZhiUiUI", ChongZhiUiUI);
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
        HallUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "img_bg", "top": 0, "skin": "bgs/catch_fish_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "var": "b_top", "top": 0, "right": 0, "left": 0 }, "compId": 5, "child": [{ "type": "Image", "props": { "skin": "bgs/dindex_header.png", "right": 0, "left": 0 }, "compId": 6 }, { "type": "Label", "props": { "y": 39, "x": 113, "width": 220, "var": "txt_name", "text": "label", "height": 24, "fontSize": 24, "color": "#f9f9f9", "align": "center" }, "compId": 9 }, { "type": "Button", "props": { "y": 32, "x": 1120, "var": "btn_set", "stateNum": 1, "skin": "btns/dindex_index_set.png", "right": 60 }, "compId": 17 }, { "type": "Image", "props": { "y": 24, "var": "img_web", "skin": "bgs/ic_website_ky.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 243 }, "compId": 33 }, { "type": "Box", "props": { "y": 5, "var": "b_money", "centerX": -100 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 19, "x": 22, "width": 351, "skin": "comp/db7_room.png", "sizeGrid": "7,7,7,7", "scaleY": 0.8, "scaleX": 0.8, "height": 39 }, "compId": 10 }, { "type": "Image", "props": { "y": 4.5, "x": 0, "width": 50, "skin": "icons/ic_golden.png", "height": 50 }, "compId": 18 }, { "type": "Label", "props": { "y": 22, "x": 51, "width": 249, "var": "txt_money", "text": "0.00", "height": 24, "fontSize": 24, "color": "#f8f1f1", "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 35, "x": 307, "width": 50, "var": "btn_reload", "stateNum": 1, "skin": "btns/dindex_reload.png", "pivotY": 25, "pivotX": 25, "height": 50 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 17, "x": 44 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": -11, "x": -1, "width": 98, "skin": "comp/img_touxiangMask.png", "sizeGrid": "45,48,51,52", "renderType": "mask", "height": 83 }, "compId": 50 }, { "type": "Image", "props": { "y": -4, "x": 12, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 7 }] }, { "type": "Box", "props": { "y": 2, "x": 135.5, "var": "b_unlogin" }, "compId": 52, "child": [{ "type": "Button", "props": { "y": 30, "x": 0.5, "var": "btn_login", "stateNum": 1, "skin": "btns/ic_login.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 53 }, { "type": "Button", "props": { "y": 29, "x": 88, "var": "btn_register", "stateNum": 1, "skin": "btns/ic_register.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 54 }, { "type": "Label", "props": { "y": 0, "x": 0, "text": "未登录", "fontSize": 26, "color": "#FFFFFF", "bold": true }, "compId": 55 }] }] }, { "type": "Panel", "props": { "var": "p_game", "right": 30, "left": 350, "height": 444, "hScrollBarSkin": "comp/hscroll.png", "centerY": 10 }, "compId": 26, "child": [{ "type": "Box", "props": {}, "compId": 66 }] }, { "type": "Box", "props": { "width": 315, "var": "b_left", "left": 15, "height": 492, "centerY": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_left.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 20 }, { "type": "Panel", "props": { "var": "p_menu", "vScrollBarSkin": "comp/vscroll.png", "top": 0, "right": 0, "left": 0, "bottom": 0 }, "compId": 21 }, { "type": "List", "props": { "y": 42, "x": 0, "width": 316, "var": "list_tab", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 2, "height": 446 }, "compId": 56, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 57, "child": [{ "type": "Image", "props": { "width": 316, "skin": "btns/ic_hot_game.png", "name": "bg_normal", "height": 86 }, "compId": 58 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 316, "skin": "btns/ic_hot_game_pressed.png", "name": "bg_selected", "height": 86 }, "compId": 59 }] }] }] }, { "type": "Box", "props": { "y": 114, "x": 357.5, "var": "b_pmd" }, "compId": 27, "child": [{ "type": "Image", "props": { "y": 0, "x": 36, "width": 849, "var": "img_pmd", "skin": "comp/laba_bg.png", "height": 34 }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 3, "text": "跑马灯信息", "overflow": "visible", "name": "txt_label", "fontSize": 24, "color": "#f4f4f4" }, "compId": 30 }] }] }, { "type": "Box", "props": { "var": "b_bottom", "right": 0, "left": 0, "height": 107, "bottom": 0 }, "compId": 31, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_bottom.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 32 }, { "type": "Button", "props": { "var": "btn_tg", "stateNum": 1, "skin": "btns/ic_promotion.png", "scaleY": 0.5, "scaleX": 0.5, "left": 15, "centerY": 0 }, "compId": 34 }, { "type": "Button", "props": { "var": "btn_tixian", "stateNum": 1, "skin": "btns/ic_withdrawal.png", "scaleY": 0.5, "scaleX": 0.5, "right": 185, "centerY": 1 }, "compId": 39 }, { "type": "Button", "props": { "var": "btn_cz", "stateNum": 1, "skin": "btns/ic_recharge.png", "scaleY": 0.5, "scaleX": 0.5, "right": 10, "centerY": 0 }, "compId": 40 }, { "type": "HBox", "props": { "y": 16, "right": 370, "left": 236, "align": "none" }, "compId": 62, "child": [{ "type": "Button", "props": { "var": "btn_huodong", "stateNum": 1, "skin": "btns/ic_activity.png", "scaleY": 0.7, "scaleX": 0.7, "left": 0 }, "compId": 35 }, { "type": "Button", "props": { "var": "btn_xm", "stateNum": 1, "skin": "btns/ic_shuffle.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 1, "centerX": -98 }, "compId": 38 }, { "type": "Button", "props": { "var": "btn_mail", "stateNum": 1, "skin": "btns/ic_message.png", "scaleY": 0.7, "scaleX": 0.7, "centerY": 1, "centerX": 102 }, "compId": 36 }, { "type": "Button", "props": { "y": 0, "var": "btn_kf", "stateNum": 1, "skin": "btns/ic_customer_service.png", "scaleY": 0.7, "scaleX": 0.7, "right": 0 }, "compId": 37 }] }] }], "loadList": ["bgs/catch_fish_bg.png", "bgs/dindex_header.png", "btns/dindex_index_set.png", "bgs/ic_website_ky.png", "comp/db7_room.png", "icons/ic_golden.png", "btns/dindex_reload.png", "comp/img_touxiangMask.png", "comp/dindex_index_icon.png", "btns/ic_login.png", "btns/ic_register.png", "comp/hscroll.png", "bgs/ic_home_left.png", "comp/vscroll.png", "btns/ic_hot_game.png", "btns/ic_hot_game_pressed.png", "comp/laba_bg.png", "bgs/ic_home_bottom.png", "btns/ic_promotion.png", "btns/ic_withdrawal.png", "btns/ic_recharge.png", "btns/ic_activity.png", "btns/ic_shuffle.png", "btns/ic_message.png", "btns/ic_customer_service.png"], "loadList3D": [] };
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
        HuoDongUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b_bg" }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png", "height": 722 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 25, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 26 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 27 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_act_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 28 }] }, { "type": "List", "props": { "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "top": 125, "spaceY": 10, "right": 30, "left": 293, "height": 597 }, "compId": 17, "child": [{ "type": "Box", "props": { "y": 0, "right": 0, "renderType": "render", "left": 0, "height": 340 }, "compId": 19, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_activity_item_bg.png", "scaleY": 0.65, "scaleX": 0.65, "right": 0, "left": 0, "bottom": 0 }, "compId": 16 }, { "type": "Image", "props": { "y": 94, "x": 25, "width": 573, "skin": "bgs/dactivity_ac_deflaut_pic.png", "name": "img_hd", "height": 199 }, "compId": 20 }, { "type": "Label", "props": { "y": 14, "x": 35, "text": "活动名：会生钱的APP:天天红包", "name": "txt_name", "fontSize": 30, "color": "#FFFFFF" }, "compId": 21 }, { "type": "Label", "props": { "y": 59, "x": 35, "text": "2019/12/9 12:12:00", "name": "txt_time", "fontSize": 24, "color": "#FFFFFF" }, "compId": 22 }, { "type": "Label", "props": { "y": 94, "x": 651, "var": "txt_type", "text": "改活动不支持在线领取", "name": "txt_name", "fontSize": 26, "color": "#FFFFFF" }, "compId": 23 }, { "type": "Button", "props": { "y": 211, "x": 718, "stateNum": 1, "skin": "btns/ic_cus_zixun.png", "scaleY": 0.5, "scaleX": 0.5, "name": "btn_get" }, "compId": 24 }, { "type": "Button", "props": { "y": 233.84615384615384, "x": 25, "stateNum": 1, "skin": "btns/ic_act_check_deatil.png", "scaleY": 0.5, "scaleX": 0.5, "name": "btn_info" }, "compId": 37 }] }] }, { "type": "List", "props": { "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 590 }, "compId": 33, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 34, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_act_buyu.png", "name": "bg_normal", "height": 96 }, "compId": 35 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_act_buyu_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 36 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_act_title.png", "comp/vscroll.png", "bgs/ic_activity_item_bg.png", "bgs/dactivity_ac_deflaut_pic.png", "btns/ic_cus_zixun.png", "btns/ic_act_check_deatil.png", "btns/ic_act_buyu.png", "btns/ic_act_buyu_pressed.png"], "loadList3D": [] };
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
        KeFuUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dactivity_nav_left.png", "left": 0 }, "compId": 14 }, { "type": "Box", "props": { "y": 92, "x": 293, "var": "b_zx" }, "compId": 15 }, { "type": "Box", "props": { "var": "b_kf", "top": 125, "right": 25, "left": 300, "bottom": 0 }, "compId": 17, "child": [{ "type": "List", "props": { "y": 46, "x": 0, "width": 970, "spaceX": 5, "repeatY": 1, "name": "list_1", "height": 505 }, "compId": 33, "child": [{ "type": "Box", "props": { "width": 307, "renderType": "render", "height": 496 }, "compId": 34, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 307, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "5,5,5,5", "height": 496 }, "compId": 20 }, { "type": "Label", "props": { "y": 366, "text": "QQ客服", "right": 0, "name": "txt_name", "left": 0, "height": 24, "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 22 }, { "type": "Button", "props": { "y": 404, "var": "btn_lx", "stateNum": 1, "skin": "btns/ic_customer_lianxi.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 21 }, { "type": "Label", "props": { "y": 330, "text": "游戏专员", "name": "txt_id", "fontSize": 24, "color": "#ffffff", "centerX": 0 }, "compId": 23 }, { "type": "Box", "props": { "y": 141, "x": 117.5 }, "compId": 36, "child": [{ "type": "Image", "props": { "y": -17, "x": -18, "width": 98, "skin": "comp/img_touxiangMask.png", "sizeGrid": "45,45,45,45", "renderType": "mask", "height": 98 }, "compId": 37 }, { "type": "Image", "props": { "y": 0, "x": 0, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 38 }] }] }] }] }, { "type": "Box", "props": { "var": "b_wt", "top": 125, "left": 300 }, "compId": 19 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 24, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 25 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 26 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_cus_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 27 }] }, { "type": "List", "props": { "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 29, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 30, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_cus_fqc.png", "name": "bg_normal", "height": 96 }, "compId": 31 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_cus_fqc_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 32 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_gathering_bg.png", "btns/ic_customer_lianxi.png", "comp/img_touxiangMask.png", "comp/dindex_index_icon.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_cus_title.png", "btns/ic_cus_fqc.png", "btns/ic_cus_fqc_pressed.png"], "loadList3D": [] };
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
        MailUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 10, "x": 10 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 17 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_main_message_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 18 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 19 }] }, { "type": "List", "props": { "y": 139, "x": 45, "width": 1028, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 466 }, "compId": 5, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_message_list_bg.png", "sizeGrid": "30,30,30,30", "right": 0, "left": 0, "height": 119 }, "compId": 7 }, { "type": "Label", "props": { "y": 12, "x": 18, "text": "邮件名", "name": "txt_name", "fontSize": 24, "color": "#FFFFFF" }, "compId": 8 }, { "type": "Label", "props": { "y": 47, "x": 18, "text": "邮件title", "name": "txt_title", "fontSize": 24, "color": "#FFFFFF" }, "compId": 9 }, { "type": "Label", "props": { "y": 82, "x": 18, "width": 817, "text": "邮件内容", "name": "txt_info", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 10 }, { "type": "Label", "props": { "y": 12, "width": 369, "text": "2012/12/12 12:12:00", "right": 0, "name": "txt_time", "height": 24, "fontSize": 22, "color": "#FFFFFF", "align": "right" }, "compId": 11 }, { "type": "Button", "props": { "y": 53.5, "x": 854.5, "stateNum": 1, "skin": "btns/ic_detail.png", "scaleY": 1, "scaleX": 1, "name": "btn_check" }, "compId": 12 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 21 }] }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_main_message_title.png", "btns/ic_close.png", "comp/vscroll.png", "bgs/ic_message_list_bg.png", "btns/ic_detail.png", "comp/bg_data_null.png"], "loadList3D": [] };
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
        MailInfoUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "bgs/message_detail.png", "scaleY": 0.67, "scaleX": 0.67 }, "compId": 3 }, { "type": "TextArea", "props": { "y": 129, "x": 16, "width": 1070, "var": "txt_info", "text": "TextArea", "height": 510, "fontSize": 24, "color": "#FFFFFF" }, "compId": 4 }, { "type": "Button", "props": { "y": 0, "x": 995, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png" }, "compId": 5 }, { "type": "Button", "props": { "y": 469, "var": "btn_remove", "stateNum": 1, "skin": "btns/delete_message.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 6 }], "loadList": ["bgs/message_detail.png", "btns/ic_close.png", "btns/delete_message.png"], "loadList3D": [] };
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
    var SetUiUI = /** @class */ (function (_super) {
        __extends(SetUiUI, _super);
        function SetUiUI() {
            return _super.call(this) || this;
        }
        SetUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(SetUiUI.uiView);
        };
        SetUiUI.uiView = { "type": "Dialog", "props": { "width": 1084, "height": 635 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 50, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bgs/ic_dialog_bj.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 33, "x": 485, "skin": "bgs/ic_setting_title.png", "scaleY": 0.6, "scaleX": 0.6, "centerX": 10 }, "compId": 4 }, { "type": "Button", "props": { "y": 0, "x": 1008, "var": "btn_close", "stateNum": 1, "skin": "btns/ic_close.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 40 }] }, { "type": "Tab", "props": { "y": 116.5, "x": 27, "var": "tab_1" }, "compId": 5, "child": [{ "type": "Button", "props": { "y": 0, "stateNum": 2, "skin": "btns/btn_setting_sound.png", "name": "item0" }, "compId": 6 }, { "type": "Button", "props": { "y": 86, "x": 0, "stateNum": 2, "skin": "btns/btn_setting_password.png", "name": "item1" }, "compId": 7 }, { "type": "Button", "props": { "y": 170, "x": 0, "stateNum": 2, "skin": "btns/btn_setting_app.png", "name": "item2" }, "compId": 8 }] }, { "type": "Box", "props": { "y": 122, "x": 282, "width": 781, "var": "b_sound", "height": 485 }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 36, "x": 22, "text": "基础信息:", "fontSize": 30, "color": "#d6c09a" }, "compId": 13 }, { "type": "Image", "props": { "y": 89, "x": 31, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 16 }, { "type": "Label", "props": { "y": 185, "x": 22, "text": "声音设置:", "fontSize": 30, "color": "#d6c09a" }, "compId": 17 }, { "type": "Label", "props": { "y": 113, "x": 123, "text": "账号:", "fontSize": 20, "color": "#b89068" }, "compId": 18 }, { "type": "Image", "props": { "y": 137, "x": 114, "width": 178, "skin": "bgs/money_get_out_box.png", "sizeGrid": "12,25,16,21", "height": 29 }, "compId": 42, "child": [{ "type": "Label", "props": { "y": 2, "x": 9, "width": 161, "var": "txt_id", "text": "wx123456", "height": 24, "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 19 }] }, { "type": "Label", "props": { "y": 255, "x": 27, "text": "背景音乐:", "fontSize": 20, "color": "#b89068" }, "compId": 20 }, { "type": "Button", "props": { "y": 367, "width": 235, "var": "btn_logout", "stateNum": 1, "skin": "btns/ic_logout.png", "height": 70, "centerX": 0 }, "compId": 25 }, { "type": "Label", "props": { "y": 113, "x": 384.443359375, "text": "等级:", "fontSize": 20, "color": "#b89068" }, "compId": 43 }, { "type": "Image", "props": { "y": 137, "x": 382, "width": 124, "skin": "bgs/money_get_out_box.png", "sizeGrid": "12,22,16,16", "height": 29 }, "compId": 44, "child": [{ "type": "Label", "props": { "y": 2, "x": 9, "width": 102, "var": "txt_level", "text": "VIP1", "height": 24, "fontSize": 24, "color": "#ffffff", "align": "center" }, "compId": 45 }] }, { "type": "CheckBox", "props": { "y": 230.5, "x": 145.7783203125, "stateNum": 2, "skin": "comp/checkbox_0.png" }, "compId": 46 }, { "type": "Label", "props": { "y": 252.5, "x": 407.2216796875, "text": "音效:", "fontSize": 20, "color": "#b89068" }, "compId": 47 }, { "type": "CheckBox", "props": { "y": 230, "x": 482, "stateNum": 2, "skin": "comp/checkbox_0.png" }, "compId": 48 }] }, { "type": "Box", "props": { "y": 122, "x": 282, "width": 781, "var": "b_pwd", "height": 485 }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 81, "x": 143, "text": "现密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 26 }, { "type": "Label", "props": { "y": 162, "x": 143, "text": "新密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 27 }, { "type": "Label", "props": { "y": 240, "x": 113, "text": "确认密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 28 }, { "type": "Image", "props": { "y": 70, "x": 260, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 29, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_oldPwd", "type": "password", "text": "111", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 30 }] }, { "type": "Image", "props": { "y": 151, "x": 260, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 31, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 365, "var": "txt_newPwd", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 32 }] }, { "type": "Image", "props": { "y": 232, "x": 260, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 35, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 361, "var": "txt_newPwd1", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 36 }] }, { "type": "Button", "props": { "y": 365, "width": 235, "var": "btn_ok", "stateNum": 1, "skin": "btns/ic_replace_password.png", "scaleY": 1, "scaleX": 1, "height": 70, "centerX": 0 }, "compId": 37 }] }, { "type": "Box", "props": { "y": 124, "x": 282, "width": 781, "var": "b_app", "height": 485 }, "compId": 12, "child": [{ "type": "Text", "props": { "y": 79, "x": 8, "width": 763, "var": "txt_app_version", "valign": "middle", "text": "text", "height": 255, "fontSize": 30, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 535, "x": 974.63818359375, "var": "txt_version", "text": "1.0.0", "fontSize": 30, "color": "#b89068" }, "compId": 49 }], "loadList": ["bgs/ic_dialog_bj.png", "bgs/ic_setting_title.png", "btns/ic_close.png", "btns/btn_setting_sound.png", "btns/btn_setting_password.png", "btns/btn_setting_app.png", "comp/dindex_index_icon.png", "bgs/money_get_out_box.png", "btns/ic_logout.png", "comp/checkbox_0.png", "comp/big_input_box.png", "btns/ic_replace_password.png"], "loadList3D": [] };
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
        SubGameListUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 13 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 3, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 5 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 6 }, { "type": "Image", "props": { "x": 329, "var": "img_title", "skin": "bgs/ic_xima_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 7 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "vScrollBarSkin": "comp/vscroll.png", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 4, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/ic_charge_unchose.png", "name": "bg_normal", "height": 96 }, "compId": 9 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/ic_charge_chose.png", "name": "bg_selected", "height": 96 }, "compId": 10 }, { "type": "Label", "props": { "width": 193, "text": "开元棋牌", "right": 0, "name": "txt_name", "height": 36, "fontSize": 36, "color": "#462C11", "centerY": 0, "bold": true }, "compId": 11 }, { "type": "Image", "props": { "x": 0, "width": 80, "name": "game_icon", "height": 80, "centerY": 0 }, "compId": 12 }] }] }, { "type": "Panel", "props": { "y": 222, "var": "p_1", "right": 30, "left": 295, "height": 498, "hScrollBarSkin": "comp/hscroll.png" }, "compId": 14 }, { "type": "Text", "props": { "y": 141, "x": 295, "var": "txt_info", "text": "开元棋牌，总共15个游戏", "fontSize": 22, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 15 }, { "type": "TextInput", "props": { "y": 152, "x": 1122, "skin": "comp/ic_search_bg.png", "promptColor": "#fffdfd", "prompt": "请输入游戏名字", "height": 25, "color": "#fffdfd" }, "compId": 19 }, { "type": "Image", "props": { "y": 153, "x": 1226, "width": 24, "var": "btn_search", "skin": "comp/ic_search_btn.png", "height": 24 }, "compId": 16 }], "loadList": ["comp/dactivity_nav_left.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_xima_title.png", "comp/vscroll.png", "bgs/ic_charge_unchose.png", "bgs/ic_charge_chose.png", "comp/hscroll.png", "comp/ic_search_bg.png", "comp/ic_search_btn.png"], "loadList3D": [] };
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
        TiXianUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 92 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 3 }, { "type": "Box", "props": { "var": "b_tx", "top": 125, "right": 30, "left": 300, "height": 469 }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 22, "x": 30, "width": 95, "text": "账号余额:", "height": 28, "fontSize": 22, "color": "#FFFFFF" }, "compId": 14 }, { "type": "Label", "props": { "y": 16, "x": 125, "width": 95, "var": "txt_money", "text": "￥5.00", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 69 }, { "type": "Box", "props": { "y": 13, "x": 799, "name": "btn_histroy" }, "compId": 70, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "stateNum": 1, "skin": "icons/ic_tixiam_record.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 15 }, { "type": "Label", "props": { "y": 3, "x": 41, "width": 122, "text": "提现记录", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 16 }] }, { "type": "Image", "props": { "y": 51, "x": 0, "width": 948, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 17 }, { "type": "Label", "props": { "y": 93.5, "x": 30, "width": 122, "text": "提现金额", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 20 }, { "type": "Image", "props": { "y": 80, "x": 193, "width": 632, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 56 }, "compId": 21, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 612, "var": "txt_input", "type": "number", "prompt": "请输入您的提现金额 单笔最低100 最高10000000", "height": 36, "fontSize": 28, "color": "#d6c09a" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 88, "x": 830, "var": "btn_clear", "stateNum": 1, "skin": "btns/ic_safe_clear.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "Box", "props": { "y": 193, "x": 0, "var": "b_unlock" }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 948, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 18 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png" }, "compId": 24 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 26 }, { "type": "Label", "props": { "y": 57.5, "x": 171, "text": "你暂时未绑定银行卡,请前往绑定", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 27 }, { "type": "Button", "props": { "y": 27, "x": 763, "var": "btn_bangding", "stateNum": 1, "skin": "btns/ic_bind_bank.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 28 }] }, { "type": "Button", "props": { "y": 445, "x": 362, "var": "btn_tx", "stateNum": 1, "skin": "btns/ic_comfirm_tixiam.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 19 }, { "type": "Box", "props": { "y": 193, "x": 0, "var": "b_myBank" }, "compId": 80, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 948, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 115 }, "compId": 81 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png", "name": "img_bank" }, "compId": 82 }, { "type": "Label", "props": { "y": 57, "x": 174, "text": "1234567 89", "name": "txt_id", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 83 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "name": "txt_name", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 84 }, { "type": "Box", "props": { "y": 41, "x": 757, "var": "btn_change" }, "compId": 85, "child": [{ "type": "Label", "props": { "text": "更换银行卡", "fontSize": 26, "color": "#ffffff" }, "compId": 87 }] }] }] }, { "type": "Box", "props": { "var": "b_bank", "top": 125, "right": 30, "left": 300, "height": 570 }, "compId": 29, "child": [{ "type": "Button", "props": { "y": 473, "var": "btn_addBank", "stateNum": 1, "skin": "btns/ic_btn_add_bank.png", "scaleY": 0.5, "scaleX": 0.5, "centerX": 0 }, "compId": 30 }, { "type": "List", "props": { "y": 0, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "right": 0, "left": 0, "height": 452 }, "compId": 31, "child": [{ "type": "Box", "props": { "right": 0, "renderType": "render", "left": 0 }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 0, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "right": 0, "left": 0, "height": 115 }, "compId": 88 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "icons/dgetcharge_tixianyinliankatubiao.png", "name": "img_bank" }, "compId": 89 }, { "type": "Label", "props": { "y": 57, "x": 174, "text": "1234567 89", "name": "txt_id", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 90 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "name": "txt_name", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 91 }] }] }] }, { "type": "Box", "props": { "var": "b_add", "top": 125, "right": 30, "left": 300, "height": 476 }, "compId": 36, "child": [{ "type": "Label", "props": { "y": 79, "x": 83, "text": "持卡人姓名", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 37 }, { "type": "Image", "props": { "y": 70, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 38, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入持卡人姓名", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 139, "x": 83, "width": 146, "text": "选择银行", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 40 }, { "type": "Image", "props": { "y": 130, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 41, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 522, "var": "txt_bankName", "type": "text", "prompt": "请选择银行", "height": 36, "fontSize": 30, "editable": false, "color": "#d6c09a", "align": "center" }, "compId": 42 }] }, { "type": "Label", "props": { "y": 198, "x": 83, "text": "银行卡账号", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 43 }, { "type": "Image", "props": { "y": 189, "x": 249, "width": 545, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 44, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 531, "var": "txt_bankId", "type": "text", "prompt": "请输入银行卡账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 45 }] }, { "type": "Label", "props": { "y": 270, "x": 83, "width": 147, "text": "开户地址", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 46 }, { "type": "Image", "props": { "y": 262, "x": 249, "width": 538, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 48 }, "compId": 47, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_bankAddress", "type": "text", "prompt": "请输入银行卡开户地址", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 48 }] }, { "type": "Button", "props": { "y": 432, "x": 143, "var": "btn_prev", "stateNum": 1, "skin": "btns/ic_return_back.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 49 }, { "type": "Button", "props": { "y": 432, "x": 470, "var": "btn_bd", "stateNum": 1, "skin": "btns/ic_btn_bind.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 51 }, { "type": "Label", "props": { "y": 331, "x": -1, "wordWrap": true, "width": 942, "text": "提示:请正确选定开户行,并绑定真实姓名,结算时将直接转入此账户,为了您的账户安全,绑定后不可随意更改,如需修改,请联系客服人员", "height": 62, "fontSize": 20, "color": "#777777" }, "compId": 52 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 53, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 54 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 55 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_withdraw_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 56 }] }, { "type": "List", "props": { "y": 0, "x": 0, "width": 295, "var": "list_tab", "top": 125, "spaceY": 5, "repeatX": 1, "left": 0, "height": 578 }, "compId": 65, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 66, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_withdraw_bank.png", "name": "bg_normal", "height": 96 }, "compId": 67 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "btns/ic_withdraw_bank_pressed.png", "name": "bg_selected", "height": 96 }, "compId": 68 }] }] }], "loadList": ["bgs/ic_recharge_bg.png", "comp/dactivity_nav_left.png", "icons/ic_tixiam_record.png", "bgs/ic_gathering_bg.png", "comp/big_input_box.png", "btns/ic_safe_clear.png", "icons/dgetcharge_tixianyinliankatubiao.png", "btns/ic_bind_bank.png", "btns/ic_comfirm_tixiam.png", "btns/ic_btn_add_bank.png", "comp/vscroll.png", "btns/ic_return_back.png", "btns/ic_btn_bind.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_withdraw_title.png", "btns/ic_withdraw_bank.png", "btns/ic_withdraw_bank_pressed.png"], "loadList3D": [] };
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
        TuiGuangUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_recharge_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 127 }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_1", "height": 527, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 819, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 11 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 819, "height": 524 }, "compId": 130, "child": [{ "type": "Image", "props": { "y": 3, "x": 15, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 14 }, { "type": "Image", "props": { "y": 3, "x": 418, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 25 }, { "type": "Image", "props": { "y": 193, "x": 15, "width": 782, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 18 }, { "type": "Image", "props": { "y": 258, "x": 15, "width": 782, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 19 }, { "type": "Image", "props": { "y": 67, "x": 15, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 29 }, { "type": "Image", "props": { "y": 67, "x": 419, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 30 }, { "type": "Image", "props": { "y": 130, "x": 15, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 31 }, { "type": "Image", "props": { "y": 130, "x": 418, "width": 380, "skin": "bgs/ic_net_bank_bg.png", "sizeGrid": "29,45,42,25", "height": 55 }, "compId": 32 }] }, { "type": "Image", "props": { "y": 330, "x": 23.279296875, "skin": "bgs/history.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 20 }, { "type": "Image", "props": { "y": 333, "x": 316, "skin": "btns/canget.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 21 }, { "type": "Label", "props": { "y": 17, "x": 58, "text": "我的ID:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 23 }, { "type": "Label", "props": { "y": 17, "x": 158, "width": 222, "var": "txt_myId", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 24 }, { "type": "Button", "props": { "y": 8, "x": 1046.5, "var": "btn_fx_hy", "stateNum": 1, "skin": "btns/sharetofriend.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 26 }, { "type": "Button", "props": { "y": 85, "x": 1046, "var": "btn_fx_qq", "stateNum": 1, "skin": "btns/sharetoqq.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 27 }, { "type": "Button", "props": { "y": 162, "x": 1046, "var": "btn_fx_pyq", "stateNum": 1, "skin": "btns/sharetocircle.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 28 }, { "type": "Label", "props": { "y": 17, "x": 454, "text": "推荐ID:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 33 }, { "type": "Label", "props": { "y": 17, "x": 556, "width": 222, "var": "txt_tjId", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 34 }, { "type": "Label", "props": { "y": 79, "x": 59, "text": "团队人数:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 48 }, { "type": "Label", "props": { "y": 82, "x": 191, "width": 198, "var": "txt_tdrs", "text": "3(0)", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 49 }, { "type": "Label", "props": { "y": 82, "x": 455, "text": "今日团队业绩:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 50 }, { "type": "Label", "props": { "y": 84, "x": 634, "width": 179, "var": "txt_jrtdyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 51 }, { "type": "Label", "props": { "y": 143.5, "x": 57, "text": "直属团队新增:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 52 }, { "type": "Label", "props": { "y": 145, "x": 244, "width": 163, "var": "txt_zstdxz", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 53 }, { "type": "Label", "props": { "y": 145, "x": 453, "text": "今日自营业绩:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 54 }, { "type": "Label", "props": { "y": 145.5, "x": 634, "width": 164, "var": "txt_zyyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 55 }, { "type": "Label", "props": { "y": 207, "x": 57, "text": "今日佣金估计:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 56 }, { "type": "Label", "props": { "y": 210, "x": 235, "width": 164, "var": "txt_yjgj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 57 }, { "type": "Label", "props": { "y": 273, "x": 57, "text": "昨日佣金:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 58 }, { "type": "Label", "props": { "y": 273, "x": 191, "width": 164, "var": "txt_zryj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 59 }, { "type": "Button", "props": { "y": 198.5, "x": 409.5, "var": "btn_refresh", "stateNum": 1, "skin": "btns/btn_refresh.png" }, "compId": 60 }, { "type": "Button", "props": { "y": 339, "x": 619, "var": "btn_get", "stateNum": 1, "skin": "btns/getmoney.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 61 }, { "type": "Label", "props": { "y": 437.5, "x": 83, "width": 222, "var": "txt_lszyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 63 }, { "type": "Label", "props": { "y": 437.5, "x": 380, "width": 222, "var": "txt_klyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 64 }, { "type": "Image", "props": { "y": 7, "x": 827, "width": 215, "var": "img_ewm", "height": 215 }, "compId": 65 }, { "type": "Image", "props": { "y": 258, "x": 827, "width": 310, "skin": "bgs/ic_website_bg.png", "sizeGrid": "2,2,2,2", "height": 54 }, "compId": 66 }, { "type": "Button", "props": { "y": 258.5, "x": 1154, "var": "btn_copy", "stateNum": 1, "skin": "btns/copywebsite.png", "scaleY": 0.4, "scaleX": 0.4 }, "compId": 67 }, { "type": "Label", "props": { "y": 271, "x": 839, "width": 299, "var": "txt_web", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 68 }, { "type": "Button", "props": { "y": 353, "x": 830, "var": "btn_histroy", "stateNum": 1, "skin": "btns/gethitory.png", "scaleY": 0.55, "scaleX": 0.55 }, "compId": 69 }, { "type": "Button", "props": { "y": 353, "x": 1037, "var": "btn_fylist", "stateNum": 1, "skin": "btns/moneychat.png", "scaleY": 0.55, "scaleX": 0.55 }, "compId": 70 }] }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_2", "height": 524, "centerX": 0 }, "compId": 71, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1220, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 137 }, { "type": "Label", "props": { "y": 33, "x": 34, "text": "直属人数:", "fontSize": 24, "color": "#d8d5ab" }, "compId": 81 }, { "type": "Label", "props": { "y": 33, "x": 247, "text": "直属总流水:", "fontSize": 24, "color": "#d8d5ab" }, "compId": 82 }, { "type": "Label", "props": { "y": 33, "x": 550, "text": "账号搜索", "fontSize": 24, "color": "#f9da64" }, "compId": 83 }, { "type": "Label", "props": { "y": 33, "x": 137, "width": 101, "var": "txt_playerNum", "text": "99999999", "height": 24, "fontSize": 24, "color": "#d8d5ab" }, "compId": 84 }, { "type": "Label", "props": { "y": 31, "x": 384, "width": 113, "text": "99999999", "height": 24, "fontSize": 24, "color": "#d8d5ab" }, "compId": 85 }, { "type": "Image", "props": { "y": 30, "x": 523, "skin": "comp/radio_chose.png" }, "compId": 86 }, { "type": "Image", "props": { "y": 28, "x": 679, "width": 206, "skin": "comp/ic_input_bg.png", "sizeGrid": "19,20,19,20", "height": 35 }, "compId": 87 }, { "type": "TextInput", "props": { "y": 28, "x": 679, "width": 198, "var": "txt_newPwd1", "type": "password", "prompt": "输入直接玩家账号", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 88 }, { "type": "Button", "props": { "y": 24.5, "x": 915, "var": "btn_search", "stateNum": 1, "skin": "btns/search.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 89 }, { "type": "Button", "props": { "y": 24.5, "x": 1075, "var": "btn_reset", "stateNum": 1, "skin": "btns/reset.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 90 }, { "type": "Image", "props": { "y": 72, "x": 13, "width": 1206, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 91 }, { "type": "Label", "props": { "y": 82, "x": 119, "text": "id", "fontSize": 20, "color": "#f3d667" }, "compId": 92 }, { "type": "Label", "props": { "y": 82, "x": 401, "text": "姓名", "fontSize": 20, "color": "#f3d667" }, "compId": 93 }, { "type": "Label", "props": { "y": 82, "x": 710, "text": "总流水", "fontSize": 20, "color": "#f3d667" }, "compId": 94 }, { "type": "Label", "props": { "y": 82, "x": 1041, "text": "直属人数", "fontSize": 20, "color": "#f3d667" }, "compId": 95 }, { "type": "List", "props": { "y": 120, "width": 1206, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 384, "centerX": 0 }, "compId": 106, "child": [{ "type": "Box", "props": { "y": 1, "x": 0, "name": "render" }, "compId": 107, "child": [{ "type": "Image", "props": { "y": 1, "x": 0, "width": 1170, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 50 }, "compId": 108 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 1171, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 50 }, "compId": 109 }, { "type": "Label", "props": { "y": 13, "x": 13, "width": 257, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 110 }, { "type": "Label", "props": { "y": 14, "x": 274, "width": 288, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 111 }, { "type": "Label", "props": { "y": 14, "x": 574, "width": 290, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 112 }, { "type": "Label", "props": { "y": 13, "x": 899, "width": 270, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 113 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips1", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 131, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 132 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0, "height": 120 }, "compId": 118, "child": [{ "type": "Image", "props": { "top": 0, "skin": "bgs/ic_home_top_bg.png", "right": 0, "left": 0, "height": 120 }, "compId": 120 }, { "type": "Button", "props": { "y": 4, "x": 0, "var": "btn_close", "stateNum": 1, "skin": "btns/back_btn.png", "scaleY": 0.85, "scaleX": 0.85 }, "compId": 121 }, { "type": "Image", "props": { "x": 329, "skin": "bgs/ic_extension_title.png", "scaleY": 0.5, "scaleX": 0.5, "centerY": 0 }, "compId": 122 }] }, { "type": "List", "props": { "width": 1253, "var": "list_tab", "top": 120, "spaceX": 140, "repeatY": 1, "repeatX": 4, "left": 30, "height": 68 }, "compId": 119, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 123, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/chart_noselect.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_normal", "height": 96 }, "compId": 124 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bgs/chart_select.png", "scaleY": 0.7, "scaleX": 0.7, "name": "bg_selected", "height": 96 }, "compId": 125 }, { "type": "Label", "props": { "y": 20, "x": 44.44999999999999, "text": "我的推广", "name": "txt_label", "fontSize": 28 }, "compId": 126 }] }] }, { "type": "Box", "props": { "y": 196, "x": 30, "var": "b_3" }, "compId": 133, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1220, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 138 }, { "type": "Box", "props": { "y": 71, "x": 0, "width": 1218, "height": 47 }, "compId": 140, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 172, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 141, "child": [{ "type": "Label", "props": { "y": 7, "text": "日期", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 142 }] }, { "type": "Image", "props": { "y": 0, "x": 174, "width": 172, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 143, "child": [{ "type": "Label", "props": { "y": 7, "text": "直属新增", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 144 }] }, { "type": "Image", "props": { "y": 0, "x": 348, "width": 172, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 145, "child": [{ "type": "Label", "props": { "y": 7, "text": "自营业绩", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 146 }] }, { "type": "Image", "props": { "y": 0, "x": 522, "width": 174, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 147, "child": [{ "type": "Label", "props": { "y": 7, "text": "团队新增", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 148 }] }, { "type": "Image", "props": { "y": 0, "x": 698, "width": 174, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 149, "child": [{ "type": "Label", "props": { "y": 7, "text": "团队业绩", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 150 }] }, { "type": "Image", "props": { "y": 0, "x": 874, "width": 174, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 156, "child": [{ "type": "Label", "props": { "y": 7, "text": "所得佣金", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 157 }] }, { "type": "Image", "props": { "y": 0, "x": 1050, "width": 170, "skin": "bgs/ic_pc_pop_wind.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 158, "child": [{ "type": "Label", "props": { "y": 7, "text": "操作", "right": 0, "left": 0, "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 159 }] }] }, { "type": "Image", "props": { "y": 10, "x": 229, "width": 381, "skin": "comp/big_input_box.png", "sizeGrid": "20,20,20,20", "height": 52 }, "compId": 151, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 355, "var": "txt_id", "type": "number", "prompt": "输入ID可查看直属会员信息", "height": 36, "fontSize": 28, "color": "#d6c09a" }, "compId": 152 }] }, { "type": "Button", "props": { "y": 14.5, "x": 664, "var": "btn_search1", "stateNum": 1, "skin": "btns/search.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 153 }, { "type": "Button", "props": { "y": 14.5, "x": 826, "var": "btn_reset1", "stateNum": 1, "skin": "btns/reset.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 155 }, { "type": "List", "props": { "y": 120, "x": 0, "width": 1206, "var": "list_3", "vScrollBarSkin": "comp/vscroll.png", "height": 384, "centerX": 0 }, "compId": 160, "child": [{ "type": "Box", "props": { "y": 1, "x": 0, "name": "render" }, "compId": 162, "child": [{ "type": "Image", "props": { "y": 1, "x": 0, "width": 1204, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 50 }, "compId": 163 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 1204, "skin": "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 50 }, "compId": 164 }, { "type": "Label", "props": { "y": 13, "x": 0, "width": 150, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 165 }, { "type": "Label", "props": { "y": 13, "x": 176, "width": 150, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 166 }, { "type": "Label", "props": { "y": 13, "x": 351, "width": 150, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 167 }, { "type": "Label", "props": { "y": 13, "x": 527, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 168 }, { "type": "Label", "props": { "y": 12.5, "x": 703, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 170 }, { "type": "Label", "props": { "y": 13, "x": 878, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 171 }, { "type": "Label", "props": { "y": 13, "x": 1054, "width": 150, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 172 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 101, "centerX": 0 }, "compId": 161, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/bg_data_null.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 169 }] }] }, { "type": "Box", "props": { "y": 196, "x": 30, "var": "b_4" }, "compId": 134, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1220, "skin": "bgs/ic_gathering_bg.png", "sizeGrid": "20,20,20,20", "height": 524 }, "compId": 139 }, { "type": "Image", "props": { "y": 11, "x": 16, "width": 958, "var": "img_jc", "height": 481 }, "compId": 173 }] }], "loadList": ["bgs/ic_recharge_bg.png", "bgs/ic_gathering_bg.png", "bgs/ic_net_bank_bg.png", "bgs/history.png", "btns/canget.png", "btns/sharetofriend.png", "btns/sharetoqq.png", "btns/sharetocircle.png", "btns/btn_refresh.png", "btns/getmoney.png", "bgs/ic_website_bg.png", "btns/copywebsite.png", "btns/gethitory.png", "btns/moneychat.png", "comp/radio_chose.png", "comp/ic_input_bg.png", "btns/search.png", "btns/reset.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "bgs/dpersonalcenter_gerenzhonxinjilubg1.png", "bgs/dpersonalcenter_gerenzhonxinjilubg2.png", "comp/bg_data_null.png", "bgs/ic_home_top_bg.png", "btns/back_btn.png", "bgs/ic_extension_title.png", "bgs/chart_noselect.png", "bgs/chart_select.png", "bgs/ic_pc_pop_wind.png", "comp/big_input_box.png"], "loadList3D": [] };
        return TuiGuangUI;
    }(View));
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
    }(View));
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
    }(View));
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
    }(View));
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
    }(Dialog));
    ui.XiMaHistroyUI = XiMaHistroyUI;
    REG("ui.XiMaHistroyUI", XiMaHistroyUI);
})(ui = exports.ui || (exports.ui = {}));

},{}]},{},[1]);
