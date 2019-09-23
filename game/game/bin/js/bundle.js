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

},{"./com/Hall":4,"./ui/layaMaxUI":22}],2:[function(require,module,exports){
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
var UserInfo_1 = require("./UserInfo");
var SetUi_1 = require("./SetUi");
var TuiGuang_1 = require("./tuiguang/TuiGuang");
var HuoDong_1 = require("./HuoDong");
var XiMa_1 = require("./xima/XiMa");
var MailUi_1 = require("./mail/MailUi");
var KeFu_1 = require("./KeFu");
var TiXianUi_1 = require("./tixian/TiXianUi");
var ChongZhi_1 = require("./chongzhi/ChongZhi");
var Notice_1 = require("./Notice");
var Hall = /** @class */ (function (_super) {
    __extends(Hall, _super);
    function Hall() {
        return _super.call(this, "ui.HallUiUI") || this;
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
        this.addBtnToListener("btn_tixian");
        this.addBtnToListener("btn_cz");
        this._pmd = new gamelib.alert.Pmd();
        this._pmd.setRes(this._res.img_pmd);
        this._tab = this._res['tab_1'];
        g_signal.add(this.onLocalMsg, this);
        var p = this._res['p_menu'];
        p.vScrollBar.autoHide = true;
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
        }
    };
    Hall.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        g_net.request(gamelib.GameMsg.GongGao, {});
        g_net.request(gamelib.GameMsg.Indexhot, {});
        g_net.request(gamelib.GameMsg.Getapi, {});
        // g_net.request(gamelib.GameMsg.Getapiassort,{});
        // g_net.request(gamelib.GameMsg.Getapitypegame,{});
        // g_net.request(gamelib.GameMsg.Getapigame,{});
    };
    Hall.prototype.reciveNetMsg = function (msg, data) {
        console.log(msg, data);
        switch (msg) {
            case gamelib.GameMsg.Indexhot:
                this._notice = this._notice || new Notice_1.default();
                this._notice.setData(data.retData);
                this._notice.show();
                break;
            case gamelib.GameMsg.Getapi:
                g_net.request(gamelib.GameMsg.Getapigame, { game: "AG", gametype: 0 });
                break;
        }
    };
    Hall.prototype.onTabChange = function (index) {
        console.log(index);
    };
    Hall.prototype.onClickObjects = function (evt) {
        switch (evt.currentTarget.name) {
            case "img_head":
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
                this._tuiGuang = this._tuiGuang || new TuiGuang_1.default();
                this._tuiGuang.show();
                break;
            case "btn_huodong":
                this._huodong = this._huodong || new HuoDong_1.default();
                this._huodong.show();
                break;
            case "btn_xm":
                this._xima = this._xima || new XiMa_1.default();
                this._xima.show();
                break;
            case "btn_mail":
                this._mail = this._mail || new MailUi_1.default();
                this._mail.show();
                break;
            case "btn_kf":
                this._kefu = this._kefu || new KeFu_1.default();
                this._kefu.show();
                break;
            case "btn_tixian":
                this._tixian = this._tixian || new TiXianUi_1.default();
                this._tixian.show();
                break;
            case "btn_cz":
                this._chongzhi = this._chongzhi || new ChongZhi_1.default();
                this._chongzhi.show();
                break;
        }
    };
    return Hall;
}(gamelib.core.Ui_NetHandle));
exports.default = Hall;

},{"./HuoDong":5,"./KeFu":6,"./Notice":7,"./SetUi":8,"./UserInfo":9,"./chongzhi/ChongZhi":10,"./mail/MailUi":13,"./tixian/TiXianUi":15,"./tuiguang/TuiGuang":19,"./xima/XiMa":20}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var HuoDong = /** @class */ (function (_super) {
    __extends(HuoDong, _super);
    function HuoDong() {
        return _super.call(this, "ui.HuoDongUiUI") || this;
    }
    HuoDong.prototype.init = function () {
        this._tab = this._res["tab_1"];
        this._list = this._res["list_1"];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
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

},{"./BasePanel":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var KeFu = /** @class */ (function (_super) {
    __extends(KeFu, _super);
    function KeFu() {
        return _super.call(this, "ui.KeFuUiUI") || this;
    }
    KeFu.prototype.init = function () {
        this.addBtnToListener("btn_lx");
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
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

},{"./BasePanel":3}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("./BasePanel");
var UserInfo = /** @class */ (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        return _super.call(this, "ui.UserInfoUI") || this;
    }
    UserInfo.prototype.init = function () {
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange1, null, false);
        this._tab1 = this._res['tab_2'];
        this._tab1.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
        // this._tab1.on(Laya.Event.CHANGE,this,this.onTabChange);
        // this._tab.selectHandler
        this.addBtnToListener('btn_modify');
        this._info = this._res['b_info'];
        this._touzu = this._res['b_touZhu'];
        this._baobiao = this._res['b_baoBiao'];
        this._list = this._res['list_1'];
        this._list.dataSource = [];
        this._list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
    };
    UserInfo.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    UserInfo.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showInfo();
        else if (index == 1)
            this.showTZJL();
        else
            this.showGRBB();
    };
    UserInfo.prototype.onTabChange1 = function (index) {
    };
    UserInfo.prototype.onItemRender = function (box, index) {
    };
    UserInfo.prototype.showInfo = function () {
        this._info.visible = true;
        this._baobiao.visible = false;
        this._touzu.visible = false;
    };
    UserInfo.prototype.showTZJL = function () {
        this._info.visible = false;
        this._baobiao.visible = false;
        this._touzu.visible = true;
        this._res['txt_tips'].visible = this._list.dataSource.length == 0;
    };
    UserInfo.prototype.showGRBB = function () {
        this._info.visible = false;
        this._baobiao.visible = true;
        this._touzu.visible = false;
    };
    return UserInfo;
}(BasePanel_1.default));
exports.default = UserInfo;

},{"./BasePanel":3}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChongZhiHistroy_1 = require("./ChongZhiHistroy");
var BasePanel_1 = require("../BasePanel");
var ChongZhi = /** @class */ (function (_super) {
    __extends(ChongZhi, _super);
    function ChongZhi() {
        return _super.call(this, "ui.ChongZhiUiUI") || this;
    }
    ChongZhi.prototype.init = function () {
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
        this.addBtnToListener("btn_sx");
        this.addBtnToListener("btn_histroy");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_goCz");
        this.addBtnToListener("btn_prev");
        this.addBtnToListener("btn_tjcz");
        // this._list = this._res['list_1'];
        // this._list.dataSource = [];
        // this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        for (var i = 1; i <= 8; i++) {
            var btn = this._res['btn_' + i];
            btn.name = 'btn_' + i;
            btn.on(Laya.Event.CLICK, this, this.onClickBtns);
        }
        this._btn = null;
    };
    ChongZhi.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    ChongZhi.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showBank();
        else if (index == 1)
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

},{"../BasePanel":3,"./ChongZhiHistroy":11}],11:[function(require,module,exports){
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

},{"../BaseHistroy":2}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./MailInfo":12}],14:[function(require,module,exports){
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

},{"../BaseHistroy":2}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TiXianHistroy_1 = require("./TiXianHistroy");
var BasePanel_1 = require("../BasePanel");
var TiXianUi = /** @class */ (function (_super) {
    __extends(TiXianUi, _super);
    function TiXianUi() {
        return _super.call(this, "ui.TiXianUI") || this;
    }
    TiXianUi.prototype.init = function () {
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
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

},{"../BasePanel":3,"./TiXianHistroy":14}],16:[function(require,module,exports){
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

},{"../BaseHistroy":2}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"../BaseHistroy":2}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetYongJin_1 = require("./GetYongJin");
var LingQuHistroy_1 = require("./LingQuHistroy");
var FanYongList_1 = require("./FanYongList");
var BasePanel_1 = require("../BasePanel");
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
        this._tab = this._res["tab_1"];
        this._list = this._res["list_1"];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
        this._list.selectHandler = Laya.Handler.create(this, this.onItemRender, null, false);
        this._list.dataSource = [];
    };
    TuiGuang.prototype.onShow = function () {
        _super.prototype.onShow.call(this);
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    };
    TuiGuang.prototype.onTabChange = function (index) {
        if (index == 0)
            this.showMyTuiGuang();
        else
            this.showZSCX();
    };
    TuiGuang.prototype.onItemRender = function (box, index) {
    };
    /**
     * 显示我的推广
     */
    TuiGuang.prototype.showMyTuiGuang = function () {
        this._res['b_1'].visible = true;
        this._res['b_2'].visible = false;
    };
    /**
     * 显示直属查询
     */
    TuiGuang.prototype.showZSCX = function () {
        this._res['b_1'].visible = false;
        this._res['b_2'].visible = true;
    };
    // this.addBtnToListener(this._res['btn_refresh']);
    // this.addBtnToListener(this._res['btn_search']);
    // this.addBtnToListener(this._res['btn_reset']);
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
                    g_uiMgr.showTip("拷贝成功");
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

},{"../BasePanel":3,"./FanYongList":16,"./GetYongJin":17,"./LingQuHistroy":18}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XiMaHistroy_1 = require("./XiMaHistroy");
var BasePanel_1 = require("../BasePanel");
var XiMa = /** @class */ (function (_super) {
    __extends(XiMa, _super);
    function XiMa() {
        return _super.call(this, "ui.XiMaUI") || this;
    }
    XiMa.prototype.init = function () {
        this.addBtnToListener("btn_sd");
        this.addBtnToListener("btn_histroy");
        this._tab = this._res["tab_1"];
        this._list = this._res["list_1"];
        this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
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

},{"../BasePanel":3,"./XiMaHistroy":21}],21:[function(require,module,exports){
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

},{"../BaseHistroy":2}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var ChongZhiHistroyUI = /** @class */ (function (_super) {
        __extends(ChongZhiHistroyUI, _super);
        function ChongZhiHistroyUI() {
            return _super.call(this) || this;
        }
        ChongZhiHistroyUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ChongZhiHistroyUI.uiView);
        };
        ChongZhiHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1223, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1223, "skin": "comp/ddeposit_recharge_record.png", "height": 720 }, "compId": 3 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 812, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 410, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 18, "width": 379, "text": "时间", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 7 }, { "type": "Label", "props": { "y": 137, "x": 410, "width": 399, "text": "金额", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 8 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1206, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 527 }, "compId": 9, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "width": 398, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 14 }, { "type": "Label", "props": { "y": 5, "x": 398, "width": 405, "text": "123456", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 15 }, { "type": "Label", "props": { "y": 5, "x": 808, "width": 397, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 16 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1146, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 10 }, { "type": "Label", "props": { "y": 137, "x": 813, "width": 399, "text": "状态", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 11 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 12, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 17 }] }], "loadList": ["comp/ddeposit_recharge_record.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/dgetcharge_guanbianniutc.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
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
        ChongZhiUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 3 }, { "type": "Box", "props": { "y": 0, "var": "b_title", "right": 0, "left": 0 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 5 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 6 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/ddeposit_chonzhibiaoti.png" }, "compId": 7 }, { "type": "Image", "props": { "y": 18, "x": 708, "skin": "comp/ddeposit_chonzhiyue.png" }, "compId": 8 }, { "type": "Button", "props": { "y": 30, "var": "btn_sx", "stateNum": 1, "skin": "comp/ddeposit_chonzhishuaxin.png", "right": 250 }, "compId": 10 }, { "type": "Image", "props": { "y": 18, "x": 1050, "width": 224, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,2,2,2", "height": 58 }, "compId": 13 }, { "type": "Button", "props": { "y": 30, "var": "btn_histroy", "stateNum": 1, "skin": "comp/ddeposit_chonzhichontijilu.png", "right": 200 }, "compId": 9, "child": [{ "type": "Label", "props": { "y": 5, "x": 44, "width": 160, "text": "充值记录", "height": 24, "fontSize": 24, "color": "#736451" }, "compId": 14 }] }, { "type": "Label", "props": { "y": 34, "x": 783, "width": 191, "var": "txt_money", "text": "0.0", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 11 }] }, { "type": "Tab", "props": { "y": 136, "x": 0, "var": "tab_1" }, "compId": 15, "child": [{ "type": "Button", "props": { "y": 0, "stateNum": 2, "skin": "comp/btn_yhcz.png", "name": "item0" }, "compId": 16 }, { "type": "Button", "props": { "y": 86, "x": 0, "stateNum": 2, "skin": "comp/btn_zfbzz.png", "name": "item1" }, "compId": 17 }, { "type": "Button", "props": { "y": 170, "x": 0, "stateNum": 2, "skin": "comp/btn_wxcz.png", "name": "item2" }, "compId": 18 }] }, { "type": "Box", "props": { "y": 92, "x": 293, "width": 982, "var": "b_bank", "height": 622 }, "compId": 19, "child": [{ "type": "Box", "props": { "var": "b_tips" }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 39, "x": 60, "skin": "comp/dpersonalcenter_gerenzhonxindian.png" }, "compId": 20 }, { "type": "Label", "props": { "y": 38, "x": 92, "text": "充值收款银行选择", "fontSize": 22, "color": "#d6c09a" }, "compId": 21 }, { "type": "Image", "props": { "y": 89, "x": 42, "skin": "comp/ddeposit_chonzhichonzhijinebg.png", "sizeGrid": "30,34,26,34" }, "compId": 22 }, { "type": "Button", "props": { "y": 145, "x": 767, "var": "btn_goCz", "stateNum": 1, "skin": "comp/ddeposit_chonzhiqianwangchonzhi.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 23 }, { "type": "Label", "props": { "y": 121, "x": 180, "text": "银行转账:成功率100%返1%", "fontSize": 24, "color": "#ffffff" }, "compId": 24 }] }, { "type": "Box", "props": { "var": "b_input" }, "compId": 26, "child": [{ "type": "Image", "props": { "y": 43, "x": 16, "skin": "comp/ddeposit_chonzhishoukuanbg.png" }, "compId": 27, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款银行", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 67 }] }, { "type": "Image", "props": { "y": 43, "x": 520, "skin": "comp/ddeposit_chonzhishoukuanbg.png" }, "compId": 28, "child": [{ "type": "Label", "props": { "y": 16, "x": 174, "text": "收款银行", "fontSize": 28, "color": "#3e2412", "bold": true }, "compId": 68 }] }, { "type": "Label", "props": { "y": 149, "x": 45, "text": "收款银行", "fontSize": 24, "color": "#a0a0a0" }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_bankName", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 30 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 36, "child": [{ "type": "Line", "props": { "y": 1, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 38 }] }, { "type": "Button", "props": { "y": -13, "x": 364, "var": "btn_copy1", "stateNum": 1, "skin": "comp/ddeposit_chonzhifuzh.png" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 225, "x": 45, "width": 98, "text": "收款人", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "center" }, "compId": 52, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_name", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 53 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 54, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 55 }] }, { "type": "Button", "props": { "y": -14, "x": 364, "var": "btn_copy2", "stateNum": 1, "skin": "comp/ddeposit_chonzhifuzh.png" }, "compId": 56 }] }, { "type": "Label", "props": { "y": 299, "x": 45, "text": "收款账号", "fontSize": 24, "color": "#a0a0a0" }, "compId": 57, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_zh", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 58 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 59, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 60 }] }, { "type": "Button", "props": { "y": -14, "x": 364, "var": "btn_copy3", "stateNum": 1, "skin": "comp/ddeposit_chonzhifuzh.png" }, "compId": 61 }] }, { "type": "Label", "props": { "y": 373, "x": 45, "width": 96, "text": "开户地", "height": 24, "fontSize": 24, "color": "#a0a0a0", "align": "center" }, "compId": 62, "child": [{ "type": "Label", "props": { "y": 0, "x": 96, "width": 334, "var": "txt_khd", "text": "1111", "height": 24, "fontSize": 24, "color": "#a0a0a0" }, "compId": 63 }, { "type": "Image", "props": { "y": 45, "x": 96, "width": 202, "height": 2 }, "compId": 64, "child": [{ "type": "Line", "props": { "y": 0, "x": 0, "toY": 0, "toX": 336, "lineWidth": 2, "lineColor": "#b7b7b7" }, "compId": 65 }] }, { "type": "Button", "props": { "y": -14, "x": 364, "var": "btn_copy4", "stateNum": 1, "skin": "comp/ddeposit_chonzhifuzh.png" }, "compId": 66 }] }, { "type": "Label", "props": { "y": 516, "x": 26, "text": "第一步:复制收款银行前往充值", "height": 24, "fontSize": 20, "color": "#a0a0a0", "align": "center" }, "compId": 69 }, { "type": "Label", "props": { "y": 137, "x": 543, "text": "存款金额", "fontSize": 24, "color": "#a0a0a0" }, "compId": 74 }, { "type": "Image", "props": { "y": 125, "x": 654, "width": 302, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 79, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 279, "var": "txt_ckje", "type": "number", "prompt": "支付限额100-100000", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 80 }] }, { "type": "Label", "props": { "y": 224, "x": 543, "text": "存款信息", "fontSize": 24, "color": "#a0a0a0" }, "compId": 81 }, { "type": "Image", "props": { "y": 212, "x": 654, "width": 302, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "18,27,9,18", "height": 48 }, "compId": 82, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 279, "var": "txt_ckrxm", "type": "text", "prompt": "填写存款人姓名", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 83 }] }, { "type": "Label", "props": { "y": 516, "x": 530, "text": "第二步:充值完成，填写您的存款信息.最后提交充值", "height": 24, "fontSize": 20, "color": "#a0a0a0", "align": "center" }, "compId": 84 }, { "type": "Button", "props": { "y": 544, "x": 158.7783203125, "var": "btn_prev", "stateNum": 1, "skin": "comp/ddeposit_chonzhifanhuishangyiye.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 85 }, { "type": "Button", "props": { "y": 544, "x": 675, "var": "btn_tjcz", "stateNum": 1, "skin": "comp/ddeposit_chonzhitijiaochonzhi.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 86 }] }] }, { "type": "Box", "props": { "y": 92, "var": "b_zfb", "right": 0, "left": 293, "height": 623 }, "compId": 87, "child": [{ "type": "Label", "props": { "y": 46, "x": 75, "text": "玩家常玩的充值金额", "fontSize": 24, "color": "#ffffff" }, "compId": 88 }, { "type": "Button", "props": { "y": 115, "x": 42, "var": "btn_1", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 89, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "100元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 93 }] }, { "type": "Image", "props": { "y": 316, "width": 926, "skin": "comp/ddeposit_chonzhichonzhijinebg.png", "sizeGrid": "19,23,12,16", "height": 174, "centerX": 0 }, "compId": 108 }, { "type": "Label", "props": { "y": 388, "x": 85, "width": 129, "text": "充值金额", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 109 }, { "type": "Image", "props": { "y": 382, "x": 224, "width": 507, "skin": "comp/ddeposit_chonzhiweixinhao.png", "sizeGrid": "0,13,0,16", "mouseThrough": true, "height": 42 }, "compId": 110 }, { "type": "TextInput", "props": { "y": 388, "x": 234, "width": 482, "var": "txt_input", "prompt": "请输入充值金额", "mouseEnabled": true, "height": 30, "fontSize": 26, "color": "#ffffff", "align": "left" }, "compId": 111 }, { "type": "Button", "props": { "y": 377, "x": 801, "var": "btn_clear", "stateNum": 1, "skin": "comp/ddeposit_qingchu.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 112 }, { "type": "Button", "props": { "y": 538, "var": "btn_tjcz1", "stateNum": 1, "skin": "comp/ddeposit_chonzhitijiaochongzhi.png", "scaleY": 0.8, "scaleX": 0.8, "centerX": 0 }, "compId": 114 }, { "type": "Button", "props": { "y": 115, "x": 272, "var": "btn_2", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 116, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "200元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 117 }] }, { "type": "Button", "props": { "y": 115, "x": 501, "var": "btn_3", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 118, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "500元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 119 }] }, { "type": "Button", "props": { "y": 115, "x": 731, "var": "btn_4", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 120, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "1000元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 121 }] }, { "type": "Button", "props": { "y": 210, "x": 42, "var": "btn_5", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 122, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "2000元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 126 }] }, { "type": "Button", "props": { "y": 210, "x": 272, "var": "btn_6", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 123, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "5000元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 127 }] }, { "type": "Button", "props": { "y": 210, "x": 501, "var": "btn_7", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 124, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "10000元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 128 }] }, { "type": "Button", "props": { "y": 210, "x": 731, "var": "btn_8", "stateNum": 2, "skin": "comp/btn_czgz.png", "scaleY": 1, "scaleX": 1, "labelSize": 30, "labelColors": "#ffffff" }, "compId": 125, "child": [{ "type": "Label", "props": { "y": 15, "x": 0, "width": 180, "text": "20000元", "mouseEnabled": false, "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 129 }] }] }], "loadList": ["comp/dactivity_nav_left.png", "comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/ddeposit_chonzhibiaoti.png", "comp/ddeposit_chonzhiyue.png", "comp/ddeposit_chonzhishuaxin.png", "comp/ddeposit_chonzhidailibg.png", "comp/ddeposit_chonzhichontijilu.png", "comp/btn_yhcz.png", "comp/btn_zfbzz.png", "comp/btn_wxcz.png", "comp/dpersonalcenter_gerenzhonxindian.png", "comp/ddeposit_chonzhichonzhijinebg.png", "comp/ddeposit_chonzhiqianwangchonzhi.png", "comp/ddeposit_chonzhishoukuanbg.png", "comp/ddeposit_chonzhifuzh.png", "comp/dsetting_pwd_input.png", "comp/ddeposit_chonzhifanhuishangyiye.png", "comp/ddeposit_chonzhitijiaochonzhi.png", "comp/btn_czgz.png", "comp/ddeposit_chonzhiweixinhao.png", "comp/ddeposit_qingchu.png", "comp/ddeposit_chonzhitijiaochongzhi.png"], "loadList3D": [] };
        return ChongZhiUiUI;
    }(Laya.View));
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
        FanYongListUI.uiView = { "type": "Dialog", "props": { "width": 1223, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1223, "skin": "comp/moneychart.png", "height": 720 }, "compId": 3 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 812, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 13 }, { "type": "Image", "props": { "y": 130, "x": 410, "width": 400, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Label", "props": { "y": 137, "x": 18.5, "width": 379, "text": "代理级别", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 410, "width": 399, "text": "团队业绩/日", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 7 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1206, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 527 }, "compId": 8, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 5, "x": 0, "width": 398, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 11 }, { "type": "Label", "props": { "y": 5, "x": 398, "width": 405, "text": "123456", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 12 }, { "type": "Label", "props": { "y": 5, "x": 808, "width": 397, "text": "123456", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#ffdc8c", "align": "center" }, "compId": 15 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1146, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 9 }, { "type": "Label", "props": { "y": 137, "x": 813, "width": 399, "text": "返佣额度", "height": 26, "fontSize": 26, "color": "#e2dc84", "align": "center" }, "compId": 14 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 17 }] }], "loadList": ["comp/moneychart.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/dgetcharge_guanbianniutc.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
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
        HallUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "img_bg", "top": 0, "skin": "comp/dindex_bg.png", "right": 0, "left": 0, "bottom": 0 }, "compId": 3 }, { "type": "Box", "props": { "var": "b_top", "top": 0, "right": 0, "left": 0 }, "compId": 5, "child": [{ "type": "Image", "props": { "skin": "comp/dindex_header.png", "right": 0, "left": 0 }, "compId": 6 }, { "type": "Label", "props": { "y": 39, "x": 113, "width": 220, "var": "txt_name", "text": "label", "height": 24, "fontSize": 24, "color": "#f9f9f9", "align": "center" }, "compId": 9 }, { "type": "Button", "props": { "y": 46.5, "var": "btn_set", "stateNum": 1, "skin": "comp/dindex_index_set.png", "right": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 17 }, { "type": "Image", "props": { "y": 22, "var": "img_web", "skin": "comp/dindex_offiwww.png", "centerX": 300 }, "compId": 33 }, { "type": "Box", "props": { "y": 5, "var": "b_money", "centerX": -100 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 19, "x": 22, "width": 351, "skin": "comp/db7_room.png", "sizeGrid": "7,7,7,7", "scaleY": 0.8, "scaleX": 0.8, "height": 39 }, "compId": 10 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dindex_capital.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 18 }, { "type": "Label", "props": { "y": 22, "x": 51, "width": 249, "var": "txt_money", "text": "0.00", "height": 24, "fontSize": 24, "color": "#f8f1f1", "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 35, "x": 315, "var": "btn_reload", "stateNum": 1, "skin": "comp/dindex_reload.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 17, "x": 44 }, "compId": 49, "child": [{ "type": "Image", "props": { "y": -11, "x": -1, "width": 98, "skin": "comp/img_touxiangMask.png", "sizeGrid": "45,48,51,52", "renderType": "mask", "height": 83 }, "compId": 50 }, { "type": "Image", "props": { "y": -4, "x": 12, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 7 }] }, { "type": "Box", "props": { "y": 2, "x": 135.5, "var": "b_unlogin" }, "compId": 52, "child": [{ "type": "Button", "props": { "y": 30, "x": 0.5, "stateNum": 1, "skin": "comp/dindex_login.png" }, "compId": 53 }, { "type": "Button", "props": { "y": 29, "x": 88, "stateNum": 1, "skin": "comp/dindex_register.png" }, "compId": 54 }, { "type": "Label", "props": { "y": 0, "x": 0, "text": "未登录", "fontSize": 26, "color": "#FFFFFF", "bold": true }, "compId": 55 }] }] }, { "type": "Box", "props": { "width": 315, "var": "b_left", "top": 114, "left": 15, "height": 492 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dindex_leftmenu.png" }, "compId": 20 }, { "type": "Panel", "props": { "y": 58, "x": 0, "width": 311, "var": "p_menu", "vScrollBarSkin": "comp/vscroll.png", "height": 432 }, "compId": 21, "child": [{ "type": "Tab", "props": { "width": 316, "var": "tab_1", "selectedIndex": 0, "height": 516, "direction": "vertical" }, "compId": 42, "child": [{ "type": "Button", "props": { "stateNum": 2, "skin": "comp/btn_game_rm.png", "name": "item0" }, "compId": 43 }, { "type": "Button", "props": { "y": 86, "x": 0, "stateNum": 2, "skin": "comp/btn_game_qp.png", "name": "item1" }, "compId": 44 }, { "type": "Button", "props": { "y": 172, "x": 0, "stateNum": 2, "skin": "comp/btn_game_by.png", "name": "item2" }, "compId": 45 }, { "type": "Button", "props": { "y": 258, "x": 0, "stateNum": 2, "skin": "comp/btn_game_dzyy.png", "name": "item3" }, "compId": 46 }, { "type": "Button", "props": { "y": 344, "x": 0, "stateNum": 2, "skin": "comp/btn_game_zr.png", "name": "item4" }, "compId": 47 }, { "type": "Button", "props": { "y": 430, "x": 0, "stateNum": 2, "skin": "comp/btn_game_ty.png", "name": "item5" }, "compId": 48 }] }] }] }, { "type": "Box", "props": { "y": 157, "var": "b_center", "centerX": 170 }, "compId": 25, "child": [{ "type": "Panel", "props": { "y": 0, "x": 0, "width": 909, "var": "p_game", "height": 444 }, "compId": 26 }] }, { "type": "Box", "props": { "y": 114, "x": 358, "var": "b_pmd" }, "compId": 27, "child": [{ "type": "Image", "props": { "skin": "comp/dindex_msg.png" }, "compId": 28 }, { "type": "Image", "props": { "y": 0, "x": 36, "width": 849, "var": "img_pmd", "skin": "comp/laba_bg.png", "height": 34 }, "compId": 29, "child": [{ "type": "Label", "props": { "y": 3, "text": "跑马灯信息", "overflow": "visible", "name": "txt_label", "fontSize": 24, "color": "#f4f4f4" }, "compId": 30 }] }] }, { "type": "Box", "props": { "y": 0, "var": "b_bottom", "right": 0, "left": 0, "bottom": 0 }, "compId": 31, "child": [{ "type": "Image", "props": { "skin": "comp/dindex_bottom.png", "right": 0, "left": 0 }, "compId": 32 }, { "type": "Button", "props": { "y": 22, "var": "btn_tg", "stateNum": 1, "skin": "comp/dindex_forward.png", "scaleY": 0.65, "scaleX": 0.65, "left": 30 }, "compId": 34 }, { "type": "Button", "props": { "y": 13, "var": "btn_huodong", "stateNum": 1, "skin": "comp/dindex_actvt.png", "centerX": -360 }, "compId": 35 }, { "type": "Button", "props": { "y": 13, "var": "btn_mail", "stateNum": 1, "skin": "comp/dindex_botmsg.png", "centerX": 0 }, "compId": 36 }, { "type": "Button", "props": { "y": 13, "var": "btn_kf", "stateNum": 1, "skin": "comp/dindex_gust.png", "centerX": 180 }, "compId": 37 }, { "type": "Button", "props": { "y": 13, "var": "btn_xm", "stateNum": 1, "skin": "comp/dindex_washcode.png", "centerX": -180 }, "compId": 38 }, { "type": "Button", "props": { "y": 14.5, "var": "btn_tixian", "stateNum": 1, "skin": "comp/dindex_getout.png", "scaleY": 0.65, "scaleX": 0.65, "right": 220 }, "compId": 39 }, { "type": "Button", "props": { "y": 9.5, "var": "btn_cz", "stateNum": 1, "skin": "comp/dindex_load.png", "scaleY": 0.65, "scaleX": 0.65, "right": 40 }, "compId": 40 }] }], "loadList": ["comp/dindex_bg.png", "comp/dindex_header.png", "comp/dindex_index_set.png", "comp/dindex_offiwww.png", "comp/db7_room.png", "comp/dindex_capital.png", "comp/dindex_reload.png", "comp/img_touxiangMask.png", "comp/dindex_index_icon.png", "comp/dindex_login.png", "comp/dindex_register.png", "comp/dindex_leftmenu.png", "comp/vscroll.png", "comp/btn_game_rm.png", "comp/btn_game_qp.png", "comp/btn_game_by.png", "comp/btn_game_dzyy.png", "comp/btn_game_zr.png", "comp/btn_game_ty.png", "comp/dindex_msg.png", "comp/laba_bg.png", "comp/dindex_bottom.png", "comp/dindex_forward.png", "comp/dindex_actvt.png", "comp/dindex_botmsg.png", "comp/dindex_gust.png", "comp/dindex_washcode.png", "comp/dindex_getout.png", "comp/dindex_load.png"], "loadList3D": [] };
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
        HuoDongUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b_bg" }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dgetcharge_leftgide.png", "height": 722 }, "compId": 14 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 4 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/dactivity_ac_title.png" }, "compId": 6 }] }, { "type": "Tab", "props": { "y": 107, "x": 0, "width": 282, "var": "tab_1", "height": 484 }, "compId": 7, "child": [{ "type": "Button", "props": { "stateNum": 2, "skin": "comp/btn_hd_zh.png", "name": "item0", "height": 80 }, "compId": 8 }, { "type": "Button", "props": { "y": 80, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_qp.png", "name": "item1", "height": 80 }, "compId": 9 }, { "type": "Button", "props": { "y": 160, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_fish.png", "name": "item2", "height": 80 }, "compId": 10 }, { "type": "Button", "props": { "y": 240, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_dz.png", "name": "item3", "height": 80 }, "compId": 11 }, { "type": "Button", "props": { "y": 320, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_sx.png", "name": "item4", "height": 80 }, "compId": 12 }, { "type": "Button", "props": { "y": 400, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_ty.png", "name": "item5", "height": 80 }, "compId": 15 }] }, { "type": "List", "props": { "y": 107, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 10, "right": 0, "left": 300, "height": 597 }, "compId": 17, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 950, "renderType": "render", "height": 304 }, "compId": 19, "child": [{ "type": "Image", "props": { "top": 0, "skin": "comp/ic_activity_item_bg.png", "scaleY": 0.65, "scaleX": 0.65, "right": 0, "left": 0, "bottom": 0 }, "compId": 16 }, { "type": "Image", "props": { "y": 94, "x": 25, "width": 573, "skin": "comp/dactivity_ac_deflaut_pic.png", "name": "img_hd", "height": 199 }, "compId": 20 }, { "type": "Label", "props": { "y": 14, "x": 35, "text": "活动名：会生钱的APP:天天红包", "name": "txt_name", "fontSize": 30, "color": "#FFFFFF" }, "compId": 21 }, { "type": "Label", "props": { "y": 59, "x": 35, "text": "2019/12/9 12:12:00", "name": "txt_time", "fontSize": 24, "color": "#FFFFFF" }, "compId": 22 }, { "type": "Label", "props": { "y": 94, "x": 651, "var": "txt_type", "text": "改活动不支持在线领取", "name": "txt_name", "fontSize": 26, "color": "#FFFFFF" }, "compId": 23 }, { "type": "Button", "props": { "y": 212, "x": 682, "stateNum": 1, "skin": "comp/dactivity_ac_btn_service.png", "name": "btn_get" }, "compId": 24 }] }] }], "loadList": ["comp/dgetcharge_leftgide.png", "comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/dactivity_ac_title.png", "comp/btn_hd_zh.png", "comp/btn_hd_qp.png", "comp/btn_hd_fish.png", "comp/btn_hd_dz.png", "comp/btn_hd_sx.png", "comp/btn_hd_ty.png", "comp/vscroll.png", "comp/ic_activity_item_bg.png", "comp/dactivity_ac_deflaut_pic.png", "comp/dactivity_ac_btn_service.png"], "loadList3D": [] };
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
        KeFuUiUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dactivity_nav_left.png", "left": 0 }, "compId": 14 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 4 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/dservice_kefudabiaoti.png" }, "compId": 6 }] }, { "type": "Tab", "props": { "y": 107, "width": 282, "var": "tab_1", "left": 0, "height": 484 }, "compId": 7, "child": [{ "type": "Button", "props": { "stateNum": 2, "skin": "comp/btn_zxkf.png", "name": "item0", "height": 80 }, "compId": 8 }, { "type": "Button", "props": { "y": 80, "x": 0, "stateNum": 2, "skin": "comp/btn_qqkf.png", "name": "item1", "height": 80 }, "compId": 9 }, { "type": "Button", "props": { "y": 160, "x": 0, "stateNum": 2, "skin": "comp/btn_wxkf.png", "name": "item2", "height": 80 }, "compId": 10 }, { "type": "Button", "props": { "y": 240, "x": 0, "stateNum": 2, "skin": "comp/btn_cjwt.png", "name": "item3", "height": 80 }, "compId": 11 }] }, { "type": "Box", "props": { "y": 92, "x": 293, "var": "b_zx" }, "compId": 15 }, { "type": "Box", "props": { "var": "b_kf", "top": 92, "right": 0, "left": 290, "bottom": 0 }, "compId": 17, "child": [{ "type": "Image", "props": { "y": 46, "width": 307, "skin": "comp/ic_gathering_bg.png", "sizeGrid": "5,5,5,5", "height": 496, "centerX": 0 }, "compId": 20 }, { "type": "Button", "props": { "y": 271, "var": "btn_lx", "stateNum": 1, "skin": "comp/dservice_kefulianxikefuanniuqqkf.png", "centerX": 0 }, "compId": 21 }, { "type": "Label", "props": { "y": 105, "var": "txt_type", "text": "QQ客服", "fontSize": 24, "color": "#ffffff", "centerX": 0 }, "compId": 22 }, { "type": "Label", "props": { "y": 181, "var": "txt_name", "text": "游戏专员", "fontSize": 24, "color": "#ffffff", "centerX": 0 }, "compId": 23 }] }, { "type": "Box", "props": { "y": 92, "x": 293, "var": "b_wt" }, "compId": 19 }], "loadList": ["comp/dactivity_nav_left.png", "comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/dservice_kefudabiaoti.png", "comp/btn_zxkf.png", "comp/btn_qqkf.png", "comp/btn_wxkf.png", "comp/btn_cjwt.png", "comp/ic_gathering_bg.png", "comp/dservice_kefulianxikefuanniuqqkf.png"], "loadList3D": [] };
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
        LingQuHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1097, "skin": "comp/bg_get_history.png", "height": 675 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 536, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 548, "width": 536, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 8 }, { "type": "Label", "props": { "y": 135, "x": 33, "width": 488, "text": "时间", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 134, "x": 565, "width": 499, "text": "金额", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 10 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1078, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 5, "height": 460 }, "compId": 11, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 12, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 534, "text": "20171212", "name": "txt_time", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 3, "x": 541, "width": 534, "text": "123456", "name": "txt_money", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 14 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1025.5, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 15 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 17 }] }], "loadList": ["comp/bg_get_history.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/dgetcharge_guanbianniutc.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
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
        LingQuYongJinUI.uiView = { "type": "Dialog", "props": { "width": 1090, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "comp/dextension_tuiguangzhuanqianlingquyongjinpop.png" }, "compId": 3 }, { "type": "Label", "props": { "y": 172, "x": 105, "text": "可转出的佣金:", "fontSize": 28, "color": "#6b6b6b" }, "compId": 4 }, { "type": "Label", "props": { "y": 172, "x": 641, "text": "账号余额:", "fontSize": 28, "color": "#6b6b6b" }, "compId": 5 }, { "type": "Label", "props": { "y": 172, "x": 280.779296875, "var": "txt_money1", "text": "0.0元", "fontSize": 28, "color": "#ffff00" }, "compId": 6 }, { "type": "Label", "props": { "y": 172, "x": 760.779296875, "var": "txt_money2", "text": "0.0元", "fontSize": 28, "color": "#ffff00" }, "compId": 7 }, { "type": "Image", "props": { "y": 224, "x": 78, "width": 947, "skin": "comp/common_google_signin_btn_icon_dark_normal_background.9.png", "sizeGrid": "17,16,19,14", "height": 179 }, "compId": 10 }, { "type": "Button", "props": { "y": 466, "x": 416, "var": "btn_ok", "stateNum": 1, "skin": "comp/dextension_tuiguangzhuanqianquerenzhuanchu.png" }, "compId": 11 }, { "type": "Label", "props": { "y": 250, "x": 125, "text": "转出佣金金额:", "fontSize": 28, "color": "#797979" }, "compId": 12 }, { "type": "Label", "props": { "y": 300, "x": 119, "text": "￥", "fontSize": 40, "bold": true }, "compId": 13 }, { "type": "TextInput", "props": { "y": 305, "x": 159, "width": 246, "var": "txt_input", "prompt": "请输入要提现的金额", "height": 40, "fontSize": 24 }, "compId": 15 }, { "type": "Image", "props": { "y": 292, "x": 824.703125, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 50 }, "compId": 16 }, { "type": "Label", "props": { "y": 298, "x": 854, "width": 135, "var": "btn_all", "text": "全部转出", "height": 38, "fontSize": 30, "bold": true }, "compId": 17 }, { "type": "Image", "props": { "y": 377, "x": 105, "skin": "comp/dgetcharge_tixianxiangqingxian.png" }, "compId": 18 }, { "type": "Label", "props": { "y": 414, "x": 66, "text": "提示:转出后立即到账,如未到账立即联系客服人员。", "fontSize": 24, "color": "#ffffff" }, "compId": 19 }, { "type": "Button", "props": { "y": 10, "x": 1035, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 20 }], "loadList": ["comp/dextension_tuiguangzhuanqianlingquyongjinpop.png", "comp/common_google_signin_btn_icon_dark_normal_background.9.png", "comp/dextension_tuiguangzhuanqianquerenzhuanchu.png", "comp/dpersonalcenter_gerenzhonxinline2.png", "comp/dgetcharge_tixianxiangqingxian.png", "comp/dgetcharge_guanbianniutc.png"], "loadList3D": [] };
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
        LoginUiUI.uiView = { "type": "Dialog", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dregister_pop.png" }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 1019, "stateNum": 1, "skin": "comp/dmessageset_guanbianniutc.png" }, "compId": 4 }, { "type": "Button", "props": { "y": 540, "x": 0, "stateNum": 1, "skin": "comp/dregister_btn.png", "centerX": 0 }, "compId": 5 }, { "type": "Label", "props": { "y": 178, "x": 210, "text": "账号", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 6 }, { "type": "Image", "props": { "y": 169, "x": 345, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 7, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入您的账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 14 }] }, { "type": "Label", "props": { "y": 261, "x": 210, "text": "密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 8 }, { "type": "Image", "props": { "y": 252, "x": 345, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 9, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "type": "password", "prompt": "请输入您的密码", "name": "txt_pwd1", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 15 }] }, { "type": "Label", "props": { "y": 344, "x": 210, "text": "确认密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 10 }, { "type": "Image", "props": { "y": 335, "x": 344, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 11, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "type": "text", "prompt": "请输入持卡人姓名", "name": "txt_pwd2", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 16 }] }, { "type": "Label", "props": { "y": 427, "x": 210, "text": "提款密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 12 }, { "type": "Image", "props": { "y": 418, "x": 345, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 13, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "type": "number", "prompt": "请输入提款密码,6位纯数字", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 17 }] }], "loadList": ["comp/dregister_pop.png", "comp/dmessageset_guanbianniutc.png", "comp/dregister_btn.png", "comp/dsetting_pwd_input.png"], "loadList3D": [] };
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
        MailUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "comp/dmessageset_xiaoxishezhixiaoxipop.png" }, "compId": 3 }, { "type": "List", "props": { "y": 139, "x": 27, "width": 1059, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 492 }, "compId": 5, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 1046, "skin": "comp/ic_message_list_bg.png", "sizeGrid": "30,30,30,30", "height": 119 }, "compId": 7 }, { "type": "Label", "props": { "y": 12, "x": 18, "text": "邮件名", "name": "txt_name", "fontSize": 24, "color": "#FFFFFF" }, "compId": 8 }, { "type": "Label", "props": { "y": 47, "x": 18, "text": "邮件title", "name": "txt_title", "fontSize": 24, "color": "#FFFFFF" }, "compId": 9 }, { "type": "Label", "props": { "y": 82, "x": 18, "width": 817, "text": "邮件内容", "name": "txt_info", "height": 24, "fontSize": 24, "color": "#FFFFFF" }, "compId": 10 }, { "type": "Label", "props": { "y": 12, "x": 670, "width": 369, "text": "2012/12/12 12:12:00", "name": "txt_time", "height": 24, "fontSize": 22, "color": "#FFFFFF", "align": "right" }, "compId": 11 }, { "type": "Button", "props": { "y": 53.5, "x": 854.5, "stateNum": 1, "skin": "comp/check_detail.png", "scaleY": 0.6, "scaleX": 0.6, "name": "btn_check" }, "compId": 12 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 13, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 14 }] }, { "type": "Button", "props": { "y": 0, "x": 1019, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 15 }], "loadList": ["comp/dmessageset_xiaoxishezhixiaoxipop.png", "comp/vscroll.png", "comp/ic_message_list_bg.png", "comp/check_detail.png", "comp/dactivity_no_data.png", "comp/dgetcharge_guanbianniutc.png"], "loadList3D": [] };
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
        MailInfoUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "comp/message_detail.png", "scaleY": 0.67, "scaleX": 0.67 }, "compId": 3 }, { "type": "TextArea", "props": { "y": 129, "x": 16, "width": 1070, "var": "txt_info", "text": "TextArea", "height": 510, "fontSize": 24, "color": "#FFFFFF" }, "compId": 4 }, { "type": "Button", "props": { "y": 0, "x": 1019, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 5 }], "loadList": ["comp/message_detail.png", "comp/dgetcharge_guanbianniutc.png"], "loadList3D": [] };
        return MailInfoUI;
    }(Laya.Dialog));
    ui.MailInfoUI = MailInfoUI;
    REG("ui.MailInfoUI", MailInfoUI);
    var NoticeUI = /** @class */ (function (_super) {
        __extends(NoticeUI, _super);
        function NoticeUI() {
            return _super.call(this) || this;
        }
        NoticeUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(NoticeUI.uiView);
        };
        NoticeUI.uiView = { "type": "Dialog", "props": { "width": 953, "height": 568 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "comp/dindex_notice_modal.png" }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 876, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 4 }, { "type": "Image", "props": { "y": 88, "x": 0, "width": 952, "var": "img_gg", "height": 436 }, "compId": 5 }], "loadList": ["comp/dindex_notice_modal.png", "comp/dgetcharge_guanbianniutc.png"], "loadList3D": [] };
        return NoticeUI;
    }(Laya.Dialog));
    ui.NoticeUI = NoticeUI;
    REG("ui.NoticeUI", NoticeUI);
    var RegisterUiUI = /** @class */ (function (_super) {
        __extends(RegisterUiUI, _super);
        function RegisterUiUI() {
            return _super.call(this) || this;
        }
        RegisterUiUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(RegisterUiUI.uiView);
        };
        RegisterUiUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "comp/dregister_pop.png" }, "compId": 3 }, { "type": "Button", "props": { "y": 0, "x": 1019, "stateNum": 1, "skin": "comp/dmessageset_guanbianniutc.png" }, "compId": 4 }, { "type": "Button", "props": { "y": 540, "stateNum": 1, "skin": "comp/dregister_btn.png", "centerX": 0 }, "compId": 5 }, { "type": "Label", "props": { "y": 178, "x": 210, "text": "账号", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 6 }, { "type": "Image", "props": { "y": 169, "x": 345, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 7, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入您的账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 8 }] }, { "type": "Label", "props": { "y": 261, "x": 210, "text": "密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 9 }, { "type": "Image", "props": { "y": 252, "x": 345, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 10, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "type": "password", "prompt": "请输入您的密码", "name": "txt_pwd1", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 11 }] }, { "type": "Label", "props": { "y": 344, "x": 210, "text": "确认密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 12 }, { "type": "Image", "props": { "y": 335, "x": 344, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 13, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "type": "text", "prompt": "请输入持卡人姓名", "name": "txt_pwd2", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 14 }] }, { "type": "Label", "props": { "y": 427, "x": 210, "text": "提款密码", "fontSize": 30, "color": "#FFFFFF", "bold": true }, "compId": 15 }, { "type": "Image", "props": { "y": 418, "x": 345, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 16, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "type": "number", "prompt": "请输入提款密码,6位纯数字", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 17 }] }], "loadList": ["comp/dregister_pop.png", "comp/dmessageset_guanbianniutc.png", "comp/dregister_btn.png", "comp/dsetting_pwd_input.png"], "loadList3D": [] };
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
        SetUiUI.uiView = { "type": "Dialog", "props": { "width": 1084, "height": 635 }, "compId": 2, "child": [{ "type": "Image", "props": { "skin": "comp/dsetting_set_bg.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 30, "skin": "comp/dsetting_header.png", "centerX": 0 }, "compId": 4 }, { "type": "Image", "props": { "y": 94, "x": 285, "width": 550, "skin": "comp/dpersonalcenter_gerenzhonxinline.png", "rotation": 90 }, "compId": 9 }, { "type": "Tab", "props": { "y": 136, "x": 0, "var": "tab_1" }, "compId": 5, "child": [{ "type": "Button", "props": { "y": 0, "stateNum": 2, "skin": "comp/btn_soundSz.png", "name": "item0" }, "compId": 6 }, { "type": "Button", "props": { "y": 86, "x": 0, "stateNum": 2, "skin": "comp/btn_xgmm.png", "name": "item1" }, "compId": 7 }, { "type": "Button", "props": { "y": 170, "x": 0, "stateNum": 2, "skin": "comp/btn_appgx.png", "name": "item2" }, "compId": 8 }] }, { "type": "Box", "props": { "y": 106, "x": 285, "width": 797, "var": "b_sound", "height": 522 }, "compId": 10, "child": [{ "type": "Label", "props": { "y": 36, "x": 22, "text": "基础信息:", "fontSize": 30, "color": "#d6c09a" }, "compId": 13 }, { "type": "Image", "props": { "y": 89, "x": 31, "var": "img_head", "skin": "comp/dindex_index_icon.png" }, "compId": 16 }, { "type": "Label", "props": { "y": 185, "x": 22, "text": "声音设置:", "fontSize": 30, "color": "#d6c09a" }, "compId": 17 }, { "type": "Label", "props": { "y": 113, "x": 123, "text": "账号:", "fontSize": 20, "color": "#b89068" }, "compId": 18 }, { "type": "Label", "props": { "y": 137, "x": 123, "width": 243, "var": "txt_id", "text": "wx123456", "height": 24, "fontSize": 24, "color": "#ffffff" }, "compId": 19 }, { "type": "Label", "props": { "y": 253, "x": 27, "text": "背景音乐:", "fontSize": 20, "color": "#b89068" }, "compId": 20 }, { "type": "Image", "props": { "y": 253, "x": 173, "width": 514, "var": "slider_bg", "skin": "comp/dsetting_yinyuebg.png", "sizeGrid": "2,13,2,12", "height": 17 }, "compId": 22 }, { "type": "Image", "props": { "y": 253, "x": 173, "width": 514, "skin": "comp/dsetting_yinyue.png", "sizeGrid": "2,13,2,12", "name": "slider", "height": 17 }, "compId": 23 }, { "type": "Image", "props": { "y": 264, "x": 181, "width": 38, "skin": "comp/dmessageset_xiaoxishezhiyinliangdian.png", "scaleY": 0.6, "scaleX": 0.6, "pivotY": 19, "pivotX": 19, "name": "slider_bar", "height": 37 }, "compId": 24 }, { "type": "Button", "props": { "y": 346, "var": "btn_logout", "stateNum": 1, "skin": "comp/dsetting_logout_btn.png", "centerX": 0 }, "compId": 25 }] }, { "type": "Box", "props": { "y": 106, "x": 285, "width": 790, "var": "b_pwd", "height": 507 }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 79, "x": 83, "text": "现密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 26 }, { "type": "Label", "props": { "y": 160, "x": 83, "text": "新密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 27 }, { "type": "Label", "props": { "y": 240, "x": 83, "text": "确认密码:", "fontSize": 30, "color": "#d6c09a" }, "compId": 28 }, { "type": "Image", "props": { "y": 70, "x": 230, "skin": "comp/dsetting_pwd_input.png" }, "compId": 29, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_oldPwd", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 30 }] }, { "type": "Image", "props": { "y": 151, "x": 230, "skin": "comp/dsetting_pwd_input.png" }, "compId": 31, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_newPwd", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 32 }] }, { "type": "Image", "props": { "y": 232, "x": 230, "skin": "comp/dsetting_pwd_input.png" }, "compId": 35, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_newPwd1", "type": "password", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 36 }] }, { "type": "Button", "props": { "y": 346, "x": 0, "var": "btn_ok", "stateNum": 1, "skin": "comp/dsetting_modify_btn.png", "centerX": 0 }, "compId": 37 }] }, { "type": "Box", "props": { "y": 106, "x": 285, "var": "b_app" }, "compId": 12, "child": [{ "type": "Button", "props": { "y": 359, "var": "btn_gx", "stateNum": 1, "skin": "comp/dsetting_update_btn.png", "centerX": 0 }, "compId": 38 }, { "type": "Text", "props": { "y": 78, "x": 8, "width": 763, "var": "txt_app_version", "valign": "middle", "text": "text", "height": 255, "fontSize": 30, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 39 }] }, { "type": "Button", "props": { "y": -8, "x": 1017.5, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 40 }], "loadList": ["comp/dsetting_set_bg.png", "comp/dsetting_header.png", "comp/dpersonalcenter_gerenzhonxinline.png", "comp/btn_soundSz.png", "comp/btn_xgmm.png", "comp/btn_appgx.png", "comp/dindex_index_icon.png", "comp/dsetting_yinyuebg.png", "comp/dsetting_yinyue.png", "comp/dmessageset_xiaoxishezhiyinliangdian.png", "comp/dsetting_logout_btn.png", "comp/dsetting_pwd_input.png", "comp/dsetting_modify_btn.png", "comp/dsetting_update_btn.png", "comp/dgetcharge_guanbianniutc.png"], "loadList3D": [] };
        return SetUiUI;
    }(Laya.Dialog));
    ui.SetUiUI = SetUiUI;
    REG("ui.SetUiUI", SetUiUI);
    var TiXianUI = /** @class */ (function (_super) {
        __extends(TiXianUI, _super);
        function TiXianUI() {
            return _super.call(this) || this;
        }
        TiXianUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(TiXianUI.uiView);
        };
        TiXianUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dactivity_nav_left.png" }, "compId": 3 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 5 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 6 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/dgetcharge_tixaindabiaoti.png" }, "compId": 7 }] }, { "type": "Tab", "props": { "y": 107, "x": 0, "width": 282, "var": "tab_1", "height": 484 }, "compId": 8, "child": [{ "type": "Button", "props": { "stateNum": 2, "skin": "comp/btn_txdyhk.png", "name": "item0", "height": 80 }, "compId": 9 }, { "type": "Button", "props": { "y": 80, "x": 0, "stateNum": 2, "skin": "comp/btn_yhkgl.png", "name": "item1", "height": 80 }, "compId": 10 }] }, { "type": "Box", "props": { "y": 107, "width": 947, "var": "b_tx", "height": 469, "centerX": 150 }, "compId": 13, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 250, "var": "txt_money", "text": "账号余额:￥5.0", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 14 }, { "type": "Button", "props": { "y": 0, "x": 756, "var": "btn_histroy", "stateNum": 1, "skin": "comp/dgetcharge_tixiantixianjiluicon.png" }, "compId": 15, "child": [{ "type": "Label", "props": { "y": 0, "x": 36, "width": 122, "text": "提现记录", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 16 }] }, { "type": "Image", "props": { "y": 50, "x": 0, "width": 948, "skin": "comp/dgetcharge_tixaintixiandaoyinhangkadibu.png", "height": 115 }, "compId": 17 }, { "type": "Button", "props": { "y": 372, "var": "btn_tx", "stateNum": 1, "skin": "comp/dgetcharge_tixainquedingtixiananniu.png", "centerX": 0 }, "compId": 19 }, { "type": "Label", "props": { "y": 93.5, "x": 30, "width": 122, "text": "提现金额", "height": 28, "fontSize": 28, "color": "#FFFFFF" }, "compId": 20 }, { "type": "Image", "props": { "y": 80, "x": 193, "skin": "comp/dsetting_pwd_input.png" }, "compId": 21, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_input", "type": "number", "text": "0", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 65, "x": 780, "var": "btn_clear", "stateNum": 1, "skin": "comp/dgetcharge_tixianqingchuanniu.png" }, "compId": 23 }, { "type": "Box", "props": { "y": 193, "x": 0, "var": "b_unlock" }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 948, "skin": "comp/dgetcharge_tixaintixiandaoyinhangkadibu.png", "height": 115 }, "compId": 18 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "comp/dgetcharge_tixianyinliankatubiao.png" }, "compId": 24 }, { "type": "Label", "props": { "y": 13, "x": 171, "text": "提现到银行卡", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 26 }, { "type": "Label", "props": { "y": 57.5, "x": 171, "text": "你暂时未绑定银行卡,请前往绑定", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 27 }, { "type": "Button", "props": { "y": 22, "x": 759, "var": "btn_bangding", "stateNum": 1, "skin": "comp/dgetcharge_tixianbangdingyinhangkaanniu.png" }, "compId": 28 }] }] }, { "type": "Box", "props": { "y": 107, "width": 937, "var": "b_bank", "height": 570, "centerX": 150 }, "compId": 29, "child": [{ "type": "Button", "props": { "y": 473, "var": "btn_addBank", "stateNum": 1, "skin": "comp/dgetcharge_tixiantianjiadaoyinhangkaanniu.png", "centerX": 0 }, "compId": 30 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 931, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 452 }, "compId": 31, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 931, "skin": "comp/dgetcharge_tixaintixiandaoyinhangkadibu.png", "height": 115 }, "compId": 33 }, { "type": "Label", "props": { "y": 44, "x": 195, "width": 388, "text": "提现到银行卡", "name": "txt_kahao", "height": 28, "fontSize": 24, "color": "#FFFFFF" }, "compId": 34 }, { "type": "Image", "props": { "y": 27, "x": 43, "skin": "comp/dgetcharge_tixianyinliankatubiao.png", "name": "img_bank" }, "compId": 35 }] }] }] }, { "type": "Box", "props": { "y": 107, "width": 944, "var": "b_add", "height": 476, "centerX": 150 }, "compId": 36, "child": [{ "type": "Label", "props": { "y": 79, "x": 83, "text": "持卡人姓名", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 37 }, { "type": "Image", "props": { "y": 70, "x": 249, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 38, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 529, "var": "txt_name", "type": "text", "prompt": "请输入持卡人姓名", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 39 }] }, { "type": "Label", "props": { "y": 139, "x": 83, "width": 146, "text": "选择银行", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 40 }, { "type": "Image", "props": { "y": 130, "x": 249, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23" }, "compId": 41, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 522, "var": "txt_bankName", "type": "text", "prompt": "请选择银行", "height": 36, "fontSize": 30, "editable": false, "color": "#d6c09a", "align": "center" }, "compId": 42 }] }, { "type": "Label", "props": { "y": 198, "x": 83, "text": "银行卡账号", "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 43 }, { "type": "Image", "props": { "y": 189, "x": 249, "width": 545, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23" }, "compId": 44, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 531, "var": "txt_bankId", "type": "text", "prompt": "请输入银行卡账号", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 45 }] }, { "type": "Label", "props": { "y": 270, "x": 83, "width": 147, "text": "开户地址", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "right" }, "compId": 46 }, { "type": "Image", "props": { "y": 262, "x": 249, "width": 538, "skin": "comp/dsetting_pwd_input.png", "sizeGrid": "14,32,11,23", "height": 48 }, "compId": 47, "child": [{ "type": "TextInput", "props": { "y": 7, "x": 11, "width": 307, "var": "txt_bankAddress", "type": "text", "prompt": "请输入银行卡开户地址", "height": 36, "fontSize": 30, "color": "#d6c09a" }, "compId": 48 }] }, { "type": "Button", "props": { "y": 408, "x": 216, "var": "btn_prev", "stateNum": 1, "skin": "comp/dgetcharge_tixianshangyibuanniuyhkgl.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 49 }, { "type": "Button", "props": { "y": 408, "x": 426, "var": "btn_bd", "stateNum": 1, "skin": "comp/dgetcharge_tixianquerenbangdinganniuyhkgl.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 51 }, { "type": "Label", "props": { "y": 331, "x": -1, "wordWrap": true, "width": 942, "text": "提示:请正确选定开户行,并绑定真实姓名,结算时将直接转入此账户,为了您的账户安全,绑定后不可随意更改,如需修改,请联系客服人员", "height": 62, "fontSize": 20, "color": "#777777" }, "compId": 52 }] }], "loadList": ["comp/dactivity_nav_left.png", "comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/dgetcharge_tixaindabiaoti.png", "comp/btn_txdyhk.png", "comp/btn_yhkgl.png", "comp/dgetcharge_tixiantixianjiluicon.png", "comp/dgetcharge_tixaintixiandaoyinhangkadibu.png", "comp/dgetcharge_tixainquedingtixiananniu.png", "comp/dsetting_pwd_input.png", "comp/dgetcharge_tixianqingchuanniu.png", "comp/dgetcharge_tixianyinliankatubiao.png", "comp/dgetcharge_tixianbangdingyinhangkaanniu.png", "comp/dgetcharge_tixiantianjiadaoyinhangkaanniu.png", "comp/vscroll.png", "comp/dgetcharge_tixianshangyibuanniuyhkgl.png", "comp/dgetcharge_tixianquerenbangdinganniuyhkgl.png"], "loadList3D": [] };
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
        TiXianHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dgetcharge_tixianjilutanchuangdibu.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 360, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 730, "width": 357, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 369, "width": 360, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 15 }, { "type": "Label", "props": { "y": 137, "x": 66, "width": 241, "text": "时间", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 419, "width": 256, "text": "金额", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 7 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1078, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "spaceY": 10, "height": 460 }, "compId": 8, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 7, "x": 0, "width": 360, "text": "20171212", "name": "txt_time", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 12 }, { "type": "Label", "props": { "y": 7, "x": 362, "width": 354, "text": "123456", "name": "txt_money", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 7, "x": 724, "width": 354, "text": "123456", "name": "txt_status", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 17 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1025, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 9 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 10, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 14 }] }, { "type": "Label", "props": { "y": 137, "x": 780, "width": 256, "text": "状态", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 16 }], "loadList": ["comp/dgetcharge_tixianjilutanchuangdibu.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/dgetcharge_guanbianniutc.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
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
        TuiGuangUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 4 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/dextension_tuiguangzhuanqianbiaoti.png" }, "compId": 6 }] }, { "type": "Tab", "props": { "y": 92, "width": 1195, "var": "tab_1", "height": 105, "centerX": 0 }, "compId": 7, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "stateNum": 2, "skin": "comp/btn_wdtg.png", "scaleY": 0.85, "scaleX": 0.85, "name": "item0" }, "compId": 8 }, { "type": "Button", "props": { "y": 0, "x": 399, "stateNum": 2, "skin": "comp/btn_zscx.png", "scaleY": 0.85, "scaleX": 0.85, "name": "item1" }, "compId": 10 }] }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_1", "height": 527, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 819, "skin": "comp/ddeposit_chonzhikuaisuchonzhibg.png", "height": 524 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 3, "x": 15, "width": 380, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 14 }, { "type": "Image", "props": { "y": 3, "x": 418, "width": 380, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 25 }, { "type": "Image", "props": { "y": 193, "x": 15, "width": 782, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 18 }, { "type": "Image", "props": { "y": 258, "x": 15, "width": 782, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 19 }, { "type": "Image", "props": { "y": 67, "x": 15, "width": 380, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 29 }, { "type": "Image", "props": { "y": 67, "x": 419, "width": 380, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 30 }, { "type": "Image", "props": { "y": 130, "x": 15, "width": 380, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 31 }, { "type": "Image", "props": { "y": 130, "x": 418, "width": 380, "skin": "comp/ddeposit_chonzhidailibg.png", "sizeGrid": "2,5,2,5", "height": 55 }, "compId": 32 }] }, { "type": "Image", "props": { "y": 330, "x": 23.279296875, "skin": "comp/history.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 20 }, { "type": "Image", "props": { "y": 333, "x": 316, "skin": "comp/canget.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 21 }, { "type": "Label", "props": { "y": 17, "x": 58, "text": "我的ID:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 23 }, { "type": "Label", "props": { "y": 17, "x": 158, "width": 222, "var": "txt_myId", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 24 }, { "type": "Button", "props": { "y": 8, "x": 1046.5, "var": "btn_fx_hy", "stateNum": 1, "skin": "comp/sharetofriend.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 26 }, { "type": "Button", "props": { "y": 85, "x": 1046, "var": "btn_fx_qq", "stateNum": 1, "skin": "comp/sharetoqq.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 27 }, { "type": "Button", "props": { "y": 162, "x": 1046, "var": "btn_fx_pyq", "stateNum": 1, "skin": "comp/sharetocircle.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 28 }, { "type": "Label", "props": { "y": 17, "x": 454, "text": "推荐ID:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 33 }, { "type": "Label", "props": { "y": 17, "x": 556, "width": 222, "var": "txt_tjId", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 34 }, { "type": "Label", "props": { "y": 79, "x": 59, "text": "团队人数:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 48 }, { "type": "Label", "props": { "y": 82, "x": 191, "width": 198, "var": "txt_tdrs", "text": "3(0)", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 49 }, { "type": "Label", "props": { "y": 82, "x": 455, "text": "今日团队业绩:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 50 }, { "type": "Label", "props": { "y": 84, "x": 634, "width": 179, "var": "txt_jrtdyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 51 }, { "type": "Label", "props": { "y": 143.5, "x": 57, "text": "直属团队新增:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 52 }, { "type": "Label", "props": { "y": 145, "x": 244, "width": 163, "var": "txt_zstdxz", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 53 }, { "type": "Label", "props": { "y": 145, "x": 453, "text": "今日自营业绩:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 54 }, { "type": "Label", "props": { "y": 145.5, "x": 634, "width": 164, "var": "txt_zyyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 55 }, { "type": "Label", "props": { "y": 207, "x": 57, "text": "今日佣金估计:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 56 }, { "type": "Label", "props": { "y": 210, "x": 235, "width": 164, "var": "txt_yjgj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 57 }, { "type": "Label", "props": { "y": 273, "x": 57, "text": "昨日佣金:", "fontSize": 28, "color": "#d8d5ab" }, "compId": 58 }, { "type": "Label", "props": { "y": 273, "x": 191, "width": 164, "var": "txt_zryj", "text": "123456", "height": 28, "fontSize": 28, "color": "#e2dc84" }, "compId": 59 }, { "type": "Button", "props": { "y": 209, "x": 407, "var": "btn_refresh", "stateNum": 1, "skin": "comp/ddeposit_chonzhishuaxin.png" }, "compId": 60 }, { "type": "Button", "props": { "y": 339, "x": 619, "var": "btn_get", "stateNum": 1, "skin": "comp/getmoney.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 61 }, { "type": "Label", "props": { "y": 437.5, "x": 83, "width": 222, "var": "txt_lszyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 63 }, { "type": "Label", "props": { "y": 437.5, "x": 380, "width": 222, "var": "txt_klyj", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 64 }, { "type": "Image", "props": { "y": 7, "x": 827, "width": 215, "var": "img_ewm", "height": 215 }, "compId": 65 }, { "type": "Image", "props": { "y": 258, "x": 827, "width": 310, "skin": "comp/webbg.png", "sizeGrid": "2,2,2,2", "height": 54 }, "compId": 66 }, { "type": "Button", "props": { "y": 258.5, "x": 1154, "var": "btn_copy", "stateNum": 1, "skin": "comp/copywebsite.png", "scaleY": 0.4, "scaleX": 0.4 }, "compId": 67 }, { "type": "Label", "props": { "y": 271, "x": 839, "width": 299, "var": "txt_web", "text": "123456", "height": 28, "fontSize": 28, "color": "#ffffff" }, "compId": 68 }, { "type": "Button", "props": { "y": 353, "x": 830, "var": "btn_histroy", "stateNum": 1, "skin": "comp/gethitory.png", "scaleY": 0.55, "scaleX": 0.55 }, "compId": 69 }, { "type": "Button", "props": { "y": 353, "x": 1037, "var": "btn_fylist", "stateNum": 1, "skin": "comp/moneychat.png", "scaleY": 0.55, "scaleX": 0.55 }, "compId": 70 }] }, { "type": "Box", "props": { "y": 196, "width": 1221, "var": "b_2", "height": 504, "centerX": 0 }, "compId": 71, "child": [{ "type": "Image", "props": { "top": 0, "skin": "comp/ic_gathering_bg.png", "sizeGrid": "10,10,10,10", "right": 0, "left": 9, "bottom": 0 }, "compId": 72 }, { "type": "Label", "props": { "y": 33, "x": 34, "text": "直属人数:", "fontSize": 24, "color": "#d8d5ab" }, "compId": 81 }, { "type": "Label", "props": { "y": 33, "x": 247, "text": "直属总流水:", "fontSize": 24, "color": "#d8d5ab" }, "compId": 82 }, { "type": "Label", "props": { "y": 33, "x": 550, "text": "账号搜索", "fontSize": 24, "color": "#f9da64" }, "compId": 83 }, { "type": "Label", "props": { "y": 33, "x": 137, "width": 101, "var": "txt_playerNum", "text": "99999999", "height": 24, "fontSize": 24, "color": "#d8d5ab" }, "compId": 84 }, { "type": "Label", "props": { "y": 31, "x": 384, "width": 113, "text": "99999999", "height": 24, "fontSize": 24, "color": "#d8d5ab" }, "compId": 85 }, { "type": "Image", "props": { "y": 22.5, "x": 505, "skin": "comp/ic_chosed.png" }, "compId": 86 }, { "type": "Image", "props": { "y": 28, "x": 679, "width": 206, "skin": "comp/dlogin_iptbox.png", "sizeGrid": "5,20,5,20", "height": 35 }, "compId": 87 }, { "type": "TextInput", "props": { "y": 28, "x": 679, "width": 198, "var": "txt_newPwd1", "type": "password", "prompt": "输入直接玩家账号", "height": 36, "fontSize": 24, "color": "#d6c09a" }, "compId": 88 }, { "type": "Button", "props": { "y": 24.5, "x": 915, "var": "btn_search", "stateNum": 1, "skin": "comp/search.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 89 }, { "type": "Button", "props": { "y": 24.5, "x": 1075, "var": "btn_reset", "stateNum": 1, "skin": "comp/reset.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 90 }, { "type": "Image", "props": { "y": 72, "x": 13, "width": 1206, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 91 }, { "type": "Label", "props": { "y": 82, "x": 119, "text": "id", "fontSize": 20, "color": "#f3d667" }, "compId": 92 }, { "type": "Label", "props": { "y": 82, "x": 401, "text": "姓名", "fontSize": 20, "color": "#f3d667" }, "compId": 93 }, { "type": "Label", "props": { "y": 82, "x": 710, "text": "总流水", "fontSize": 20, "color": "#f3d667" }, "compId": 94 }, { "type": "Label", "props": { "y": 82, "x": 1041, "text": "直属人数", "fontSize": 20, "color": "#f3d667" }, "compId": 95 }, { "type": "List", "props": { "y": 120, "width": 1206, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 384, "centerX": 0 }, "compId": 106, "child": [{ "type": "Box", "props": { "y": 1, "x": 0, "name": "render" }, "compId": 107, "child": [{ "type": "Image", "props": { "y": 1, "x": 0, "width": 1170, "skin": "comp/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 50 }, "compId": 108 }, { "type": "Image", "props": { "y": 1, "x": 0, "width": 1171, "skin": "comp/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 50 }, "compId": 109 }, { "type": "Label", "props": { "y": 13, "x": 13, "width": 257, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 110 }, { "type": "Label", "props": { "y": 14, "x": 274, "width": 288, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 111 }, { "type": "Label", "props": { "y": 14, "x": 574, "width": 290, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 112 }, { "type": "Label", "props": { "y": 13, "x": 899, "width": 270, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 113 }] }] }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 115, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 116 }] }] }], "loadList": ["comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/dextension_tuiguangzhuanqianbiaoti.png", "comp/btn_wdtg.png", "comp/btn_zscx.png", "comp/ddeposit_chonzhikuaisuchonzhibg.png", "comp/ddeposit_chonzhidailibg.png", "comp/history.png", "comp/canget.png", "comp/sharetofriend.png", "comp/sharetoqq.png", "comp/sharetocircle.png", "comp/ddeposit_chonzhishuaxin.png", "comp/getmoney.png", "comp/webbg.png", "comp/copywebsite.png", "comp/gethitory.png", "comp/moneychat.png", "comp/ic_gathering_bg.png", "comp/ic_chosed.png", "comp/dlogin_iptbox.png", "comp/search.png", "comp/reset.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/dpersonalcenter_gerenzhonxinjilubg1.png", "comp/dpersonalcenter_gerenzhonxinjilubg2.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
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
        UserInfoUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 10, "x": 10, "skin": "comp/dactivity_nav_left.png" }, "compId": 99 }, { "type": "Tab", "props": { "y": 108, "x": 11.5, "width": 286, "var": "tab_2", "stateNum": 2, "selectedIndex": 0, "height": 290, "direction": "vertical" }, "compId": 100, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "stateNum": 2, "skin": "comp/btn_grxx.png", "name": "item0" }, "compId": 101 }, { "type": "Button", "props": { "y": 96, "x": 0, "stateNum": 2, "skin": "comp/btn_tzjl.png", "name": "item1" }, "compId": 102 }, { "type": "Button", "props": { "y": 193, "x": 0, "stateNum": 2, "skin": "comp/btn_grbb.png", "name": "item2" }, "compId": 103 }] }, { "type": "Box", "props": { "var": "b_title", "right": 0, "left": 0 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 3 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/dpersonalcenter_gerenzhonxinbiaoti.png" }, "compId": 6 }] }, { "type": "Box", "props": { "y": 108, "var": "b_info", "right": 10, "left": 347, "height": 590 }, "compId": 16, "child": [{ "type": "Image", "props": { "top": 0, "skin": "comp/dpersonalcenter_gerenzhonxinbg.png", "sizeGrid": "2,2,2,2", "right": 0, "left": 0, "bottom": 0 }, "compId": 19 }, { "type": "Label", "props": { "y": 21, "x": 52, "text": "基础信息", "fontSize": 24, "color": "#eaa65a" }, "compId": 20 }, { "type": "Image", "props": { "y": 25, "x": 23, "skin": "comp/dpersonalcenter_gerenzhonxindian.png" }, "compId": 21 }, { "type": "Button", "props": { "y": 541, "x": 338, "var": "btn_modify", "stateNum": 1, "skin": "comp/dpersonalcenter_gerenzhonxinbianji.png" }, "compId": 22, "child": [{ "type": "Label", "props": { "y": 4, "x": 42, "var": "txt_status", "text": "编辑", "fontSize": 24, "color": "#eaa65a" }, "compId": 23 }] }, { "type": "Label", "props": { "y": 83, "x": 39, "width": 456, "var": "txt_id", "text": "账号:", "height": 31, "fontSize": 26, "color": "#d6c09a" }, "compId": 25 }, { "type": "Label", "props": { "y": 144, "x": 39, "width": 456, "var": "txt_name", "text": "姓名:", "height": 29, "fontSize": 26, "color": "#d6c09a" }, "compId": 26 }, { "type": "Label", "props": { "y": 204, "x": 39, "width": 60, "text": "邮箱:", "height": 24, "fontSize": 26, "color": "#d6c09a" }, "compId": 27 }, { "type": "Label", "props": { "y": 265, "x": 39, "width": 59, "text": "电话:", "height": 24, "fontSize": 26, "color": "#d6c09a" }, "compId": 28 }, { "type": "Label", "props": { "y": 325, "x": 39, "width": 53, "text": "QQ:", "height": 24, "fontSize": 26, "color": "#d6c09a" }, "compId": 29 }, { "type": "Label", "props": { "y": 386, "x": 39, "width": 62, "text": "微信:", "height": 24, "fontSize": 26, "color": "#d6c09a" }, "compId": 30 }, { "type": "TextInput", "props": { "y": 197, "x": 131, "width": 386, "var": "txt_mail", "skin": "comp/textinput.png", "sizeGrid": "8,10,8,10", "promptColor": "#282727", "prompt": "输入你的邮箱", "height": 38, "fontSize": 26 }, "compId": 31 }, { "type": "TextInput", "props": { "y": 258, "x": 131, "width": 386, "var": "txt_tel", "skin": "comp/textinput.png", "sizeGrid": "8,10,8,10", "promptColor": "#282727", "prompt": "输入你的电话", "height": 38, "fontSize": 26 }, "compId": 32 }, { "type": "TextInput", "props": { "y": 318, "x": 131, "width": 386, "var": "txt_qq", "skin": "comp/textinput.png", "sizeGrid": "8,10,8,10", "promptColor": "#282727", "prompt": "输入你的QQ", "height": 38, "fontSize": 26 }, "compId": 33 }, { "type": "TextInput", "props": { "y": 379, "x": 131, "width": 386, "var": "txt_wx", "skin": "comp/textinput.png", "sizeGrid": "8,10,8,10", "promptColor": "#282727", "prompt": "输入你的微信", "height": 38, "fontSize": 26 }, "compId": 34 }] }, { "type": "Box", "props": { "y": 112, "var": "b_touZhu", "right": 10, "left": 347, "height": 590 }, "compId": 17, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dpersonalcenter_vippro_bg.png", "right": 0, "left": 0 }, "compId": 35 }, { "type": "Label", "props": { "y": 18, "x": 52, "text": "平台", "fontSize": 28, "color": "#f4ce7f" }, "compId": 36 }, { "type": "Image", "props": { "y": 0, "x": 134, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 64 }, "compId": 42 }, { "type": "Label", "props": { "y": 18, "x": 174, "text": "游戏名称", "fontSize": 28, "color": "#f4ce7f" }, "compId": 38 }, { "type": "Image", "props": { "y": 0, "x": 310, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 64 }, "compId": 43 }, { "type": "Label", "props": { "y": 18, "x": 360, "text": "投注", "fontSize": 28, "color": "#f4ce7f" }, "compId": 39 }, { "type": "Image", "props": { "y": 0, "x": 467, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 64 }, "compId": 44 }, { "type": "Label", "props": { "y": 18, "x": 515, "text": "输赢", "fontSize": 28, "color": "#f4ce7f" }, "compId": 40 }, { "type": "Image", "props": { "y": 0, "x": 630, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 64 }, "compId": 45 }, { "type": "Label", "props": { "y": 18, "x": 719, "text": "时间", "fontSize": 28, "color": "#f4ce7f" }, "compId": 41 }, { "type": "Label", "props": { "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 58, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 57 }] }, { "type": "List", "props": { "y": 72, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "right": 0, "left": 0, "height": 523 }, "compId": 46, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 47, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 924, "skin": "comp/dpersonalcenter_gerenzhonxinjilubg1.png", "sizeGrid": "14,13,10,13", "name": "bg_1", "height": 77 }, "compId": 48 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 924, "skin": "comp/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "14,13,10,13", "name": "bg_2", "height": 77 }, "compId": 49 }, { "type": "Label", "props": { "y": 26, "x": 16, "width": 112, "text": "#f4ce7f", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 50 }, { "type": "Label", "props": { "y": 26, "x": 145, "width": 164, "text": "#f4ce7f", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 51 }, { "type": "Label", "props": { "y": 26, "x": 309, "width": 164, "text": "#f4ce7f", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 52 }, { "type": "Label", "props": { "y": 26, "x": 462, "width": 164, "text": "#f4ce7f", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "center" }, "compId": 53 }, { "type": "Label", "props": { "y": 26, "x": 634, "width": 282, "text": "#f4ce7f", "name": "txt_5", "height": 26, "fontSize": 26, "color": "#f4ce7f", "align": "left" }, "compId": 54 }] }] }] }, { "type": "Box", "props": { "y": 112, "var": "b_baoBiao", "right": 10, "left": 347, "height": 590 }, "compId": 18, "child": [{ "type": "Image", "props": { "width": 923, "skin": "comp/dpersonalcenter_gerenzhonxinbaobiaobg.png", "sizeGrid": "86,29,29,29", "right": 0, "left": 0, "height": 513, "bottom": 0 }, "compId": 56 }, { "type": "Tab", "props": { "y": 7, "x": 1.1000000000000227, "var": "tab_1" }, "compId": 72, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "width": 214, "stateNum": 2, "skin": "comp/btn_1.png", "sizeGrid": "13,20,13,16", "scaleY": 0.85, "scaleX": 0.85, "name": "item0", "labelSize": 30, "labelColors": "#666666,#666666", "label": "棋牌平台报表", "height": 77 }, "compId": 61 }, { "type": "Button", "props": { "y": 0, "x": 185, "width": 214, "stateNum": 2, "skin": "comp/btn_1.png", "sizeGrid": "13,20,13,16", "scaleY": 0.85, "scaleX": 0.85, "name": "item1", "labelSize": 30, "labelColors": "#666666,#666666", "label": "真人视讯报表", "height": 77 }, "compId": 73 }, { "type": "Button", "props": { "y": 0, "x": 370, "width": 214, "stateNum": 2, "skin": "comp/btn_1.png", "sizeGrid": "13,20,13,16", "scaleY": 0.85, "scaleX": 0.85, "name": "item2", "labelSize": 30, "labelColors": "#666666,#666666", "label": "电子游艺报表", "height": 77 }, "compId": 75 }, { "type": "Button", "props": { "y": 0, "x": 555, "width": 214, "stateNum": 2, "skin": "comp/btn_1.png", "sizeGrid": "13,20,13,16", "scaleY": 0.85, "scaleX": 0.85, "name": "item3", "labelSize": 30, "labelColors": "#666666,#666666", "label": "体育平台报表", "height": 77 }, "compId": 76 }, { "type": "Button", "props": { "y": 0, "x": 740, "width": 214, "stateNum": 2, "skin": "comp/btn_1.png", "sizeGrid": "13,20,13,16", "scaleY": 0.85, "scaleX": 0.85, "name": "item4", "labelSize": 30, "labelColors": "#666666,#666666", "label": "捕鱼平台报表", "height": 77 }, "compId": 77 }] }, { "type": "Label", "props": { "y": 105, "x": 40, "text": "时间设置:", "fontSize": 30, "color": "#666666" }, "compId": 78 }, { "type": "Image", "props": { "y": 98.5, "x": 231, "skin": "comp/dpersonalcenter_gerenzhonxinpingtai.png" }, "compId": 79 }, { "type": "Label", "props": { "y": 104, "x": 259, "width": 130, "var": "txt_time", "text": "今天", "height": 30, "fontSize": 30, "color": "#666666", "align": "center" }, "compId": 80 }, { "type": "Label", "props": { "y": 213, "width": 128, "text": "盈利总额:", "pivotY": 15, "pivotX": 64, "height": 30, "fontSize": 30, "color": "#3d342b", "centerX": -70 }, "compId": 82 }, { "type": "Image", "props": { "y": 268, "x": 0, "skin": "comp/dpersonalcenter_gerenzhonxinline.png" }, "compId": 83 }, { "type": "Label", "props": { "y": 193, "width": 288, "var": "txt_ylze", "text": "0", "height": 35, "fontSize": 36, "color": "#008000", "centerX": 152, "bold": true, "align": "left" }, "compId": 84 }, { "type": "Image", "props": { "y": 412, "x": 0, "width": 307, "skin": "comp/dpersonalcenter_gerenzhonxinyouxiaotouzhubg.png" }, "compId": 85 }, { "type": "Image", "props": { "y": 412, "x": 309, "width": 307, "skin": "comp/dpersonalcenter_gerenzhonxinyouxiaotouzhubg.png" }, "compId": 86 }, { "type": "Image", "props": { "y": 412, "x": 617, "width": 307, "skin": "comp/dpersonalcenter_gerenzhonxinyouxiaotouzhubg.png" }, "compId": 88 }, { "type": "Image", "props": { "y": 273, "x": 307, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 198 }, "compId": 90 }, { "type": "Image", "props": { "y": 273, "x": 615, "width": 2, "skin": "comp/dpersonalcenter_gerenzhonxinline2.png", "height": 198 }, "compId": 92 }, { "type": "Label", "props": { "y": 426.5, "x": 78.3349609375, "text": "有效投注总额", "fontSize": 28, "color": "#ffffff" }, "compId": 93 }, { "type": "Label", "props": { "y": 426.5, "x": 378.05, "text": "有效投注总额", "fontSize": 28, "color": "#ffffff" }, "compId": 94 }, { "type": "Label", "props": { "y": 427.5, "x": 686.5, "text": "有效投注总额", "fontSize": 28, "color": "#ffffff" }, "compId": 95 }, { "type": "Label", "props": { "y": 333.5, "x": 151.650390625, "var": "txt_yxtz", "text": "0", "fontSize": 30, "color": "#ffff00", "bold": true }, "compId": 96 }, { "type": "Label", "props": { "y": 333.5, "x": 444.8154296875, "text": "0", "fontSize": 30, "color": "#ffff00", "bold": true }, "compId": 97 }, { "type": "Label", "props": { "y": 333.5, "x": 753.8154296875, "text": "0", "fontSize": 30, "color": "#ffff00", "bold": true }, "compId": 98 }] }], "loadList": ["comp/dactivity_nav_left.png", "comp/btn_grxx.png", "comp/btn_tzjl.png", "comp/btn_grbb.png", "comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/dpersonalcenter_gerenzhonxinbiaoti.png", "comp/dpersonalcenter_gerenzhonxinbg.png", "comp/dpersonalcenter_gerenzhonxindian.png", "comp/dpersonalcenter_gerenzhonxinbianji.png", "comp/textinput.png", "comp/dpersonalcenter_vippro_bg.png", "comp/dpersonalcenter_gerenzhonxinline2.png", "comp/dactivity_no_data.png", "comp/vscroll.png", "comp/dpersonalcenter_gerenzhonxinjilubg1.png", "comp/dpersonalcenter_gerenzhonxinjilubg2.png", "comp/dpersonalcenter_gerenzhonxinbaobiaobg.png", "comp/btn_1.png", "comp/dpersonalcenter_gerenzhonxinpingtai.png", "comp/dpersonalcenter_gerenzhonxinline.png", "comp/dpersonalcenter_gerenzhonxinyouxiaotouzhubg.png"], "loadList3D": [] };
        return UserInfoUI;
    }(Laya.View));
    ui.UserInfoUI = UserInfoUI;
    REG("ui.UserInfoUI", UserInfoUI);
    var XiMaUI = /** @class */ (function (_super) {
        __extends(XiMaUI, _super);
        function XiMaUI() {
            return _super.call(this) || this;
        }
        XiMaUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(XiMaUI.uiView);
        };
        XiMaUI.uiView = { "type": "View", "props": { "width": 1280, "height": 720 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b_bg" }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dgetcharge_leftgide.png", "height": 722 }, "compId": 5 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "b_title", "right": 0, "left": 0 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dgetcharge_header.png", "right": 0, "left": 0 }, "compId": 6 }, { "type": "Button", "props": { "y": 18, "x": 43, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_go_back.png" }, "compId": 7 }, { "type": "Image", "props": { "y": 18, "x": 263, "skin": "comp/dwashcode_wc_title.png" }, "compId": 8 }] }, { "type": "Tab", "props": { "y": 107, "x": 0, "width": 282, "var": "tab_1", "height": 484 }, "compId": 9, "child": [{ "type": "Button", "props": { "stateNum": 2, "skin": "comp/btn_hd_zh.png", "name": "item0", "height": 80 }, "compId": 10 }, { "type": "Button", "props": { "y": 80, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_qp.png", "name": "item1", "height": 80 }, "compId": 11 }, { "type": "Button", "props": { "y": 160, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_fish.png", "name": "item2", "height": 80 }, "compId": 12 }, { "type": "Button", "props": { "y": 240, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_dz.png", "name": "item3", "height": 80 }, "compId": 13 }, { "type": "Button", "props": { "y": 320, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_sx.png", "name": "item4", "height": 80 }, "compId": 14 }, { "type": "Button", "props": { "y": 400, "x": 0, "stateNum": 2, "skin": "comp/btn_hd_ty.png", "name": "item5", "height": 80 }, "compId": 15 }] }, { "type": "Box", "props": { "y": 92, "width": 982, "height": 603, "centerX": 145 }, "compId": 46, "child": [{ "type": "Image", "props": { "y": 0, "skin": "comp/dpersonalcenter_vippro_bg.png", "sizeGrid": "14,11,6,10", "right": 0, "left": 0, "height": 120 }, "compId": 16 }, { "type": "Image", "props": { "y": 7, "skin": "comp/dpersonalcenter_gerenzhonxinlan2.png", "right": 8, "left": 8, "height": 60 }, "compId": 17 }, { "type": "Label", "props": { "y": 22, "x": 71, "text": "总计游戏投注:", "fontSize": 24, "color": "#79787b" }, "compId": 18 }, { "type": "Label", "props": { "y": 21, "x": 222, "text": "0.0", "fontSize": 24, "color": "#ffd784" }, "compId": 19 }, { "type": "Button", "props": { "y": 18, "x": 779, "var": "btn_histroy", "stateNum": 1, "skin": "comp/dwashcode_wc_icon_history.png" }, "compId": 21, "child": [{ "type": "Label", "props": { "y": 3, "x": 34, "text": "历史洗码记录", "fontSize": 24, "color": "#ffd784" }, "compId": 20 }] }, { "type": "Label", "props": { "y": 82, "x": 76, "text": "全部游戏", "fontSize": 24, "color": "#ffd784" }, "compId": 25 }, { "type": "Label", "props": { "y": 82, "x": 330, "text": "游戏洗码量", "fontSize": 24, "color": "#ffd784" }, "compId": 26 }, { "type": "Label", "props": { "y": 82, "x": 607, "text": "比例", "fontSize": 24, "color": "#ffd784" }, "compId": 27 }, { "type": "Label", "props": { "y": 82, "x": 813, "text": "洗码金额", "fontSize": 24, "color": "#ffd784" }, "compId": 28 }, { "type": "Image", "props": { "y": 73, "x": 246, "width": 2, "skin": "comp/dsafebox_fengex.png", "height": 50 }, "compId": 29 }, { "type": "Image", "props": { "y": 67, "x": 527, "width": 2, "skin": "comp/dsafebox_fengex.png", "height": 50 }, "compId": 30 }, { "type": "Image", "props": { "y": 67, "x": 731, "width": 2, "skin": "comp/dsafebox_fengex.png", "height": 50 }, "compId": 31 }, { "type": "Image", "props": { "y": 518, "x": 0, "width": 978, "skin": "comp/dpersonalcenter_gerenzhonxinjilubg2.png", "sizeGrid": "20,17,15,18", "height": 85 }, "compId": 34 }, { "type": "Label", "props": { "y": 549, "x": 21, "width": 608, "text": "上次结算时间:2019/12/12 洗码金额：￥200", "height": 24, "fontSize": 24, "color": "#c7c7c7" }, "compId": 35 }, { "type": "Button", "props": { "y": 526, "x": 779, "var": "btn_sd", "stateNum": 1, "skin": "comp/dwashcode_wc_btn_wc.png" }, "compId": 36 }, { "type": "List", "props": { "y": 123, "x": 8, "width": 959, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 391 }, "compId": 37, "child": [{ "type": "Box", "props": { "renderType": "render" }, "compId": 38, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 942, "skin": "comp/dpersonalcenter_gerenzhonxinlan2.png", "sizeGrid": "1,1,1,1", "height": 40 }, "compId": 39 }, { "type": "Label", "props": { "y": 8, "x": 10, "width": 218, "text": "FC棋牌", "name": "txt_1", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 40 }, { "type": "Label", "props": { "y": 8, "x": 247, "width": 253, "text": "FC棋牌", "name": "txt_2", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 41 }, { "type": "Label", "props": { "y": 8, "x": 530, "width": 189, "text": "FC棋牌", "name": "txt_3", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 42 }, { "type": "Label", "props": { "y": 8, "x": 734, "width": 205, "text": "FC棋牌", "name": "txt_4", "height": 24, "fontSize": 24, "color": "#FFFFFF", "align": "center" }, "compId": 43 }] }] }, { "type": "Label", "props": { "y": 318, "x": 473, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 89 }, "compId": 44, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 45 }] }] }], "loadList": ["comp/dgetcharge_leftgide.png", "comp/dgetcharge_header.png", "comp/dgetcharge_go_back.png", "comp/dwashcode_wc_title.png", "comp/btn_hd_zh.png", "comp/btn_hd_qp.png", "comp/btn_hd_fish.png", "comp/btn_hd_dz.png", "comp/btn_hd_sx.png", "comp/btn_hd_ty.png", "comp/dpersonalcenter_vippro_bg.png", "comp/dpersonalcenter_gerenzhonxinlan2.png", "comp/dwashcode_wc_icon_history.png", "comp/dsafebox_fengex.png", "comp/dpersonalcenter_gerenzhonxinjilubg2.png", "comp/dwashcode_wc_btn_wc.png", "comp/vscroll.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
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
        XiMaHistroyUI.uiView = { "type": "Dialog", "props": { "width": 1096, "height": 660 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "comp/dwashcode_wc_bg_record.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 130, "x": 8, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 4 }, { "type": "Image", "props": { "y": 130, "x": 547, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 5 }, { "type": "Image", "props": { "y": 130, "x": 277, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 15 }, { "type": "Image", "props": { "y": 130, "x": 817, "width": 268, "skin": "comp/dpersonalcenter_gerenzhonxinlan1.png", "sizeGrid": "2,2,2,2", "height": 40 }, "compId": 16 }, { "type": "Label", "props": { "y": 137, "x": 46, "width": 191, "text": "洗码时间", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 137, "x": 618, "width": 126, "text": "洗码金额", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 7 }, { "type": "List", "props": { "y": 170, "x": 8, "width": 1078, "var": "list_1", "vScrollBarSkin": "comp/vscroll.png", "height": 460 }, "compId": 8, "child": [{ "type": "Box", "props": { "name": "render" }, "compId": 11, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 267, "text": "20171212", "name": "txt_1", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 12 }, { "type": "Label", "props": { "y": 3, "x": 809, "width": 269, "text": "123456", "name": "txt_4", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 5, "x": 270.5, "width": 267, "text": "20171212", "name": "txt_2", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 19 }, { "type": "Label", "props": { "y": 3, "x": 537.5, "width": 267, "text": "20171212", "name": "txt_3", "height": 26, "fontSize": 26, "color": "#FFFFFF", "align": "center" }, "compId": 20 }] }] }, { "type": "Button", "props": { "y": 0, "x": 1025, "var": "btn_close", "stateNum": 1, "skin": "comp/dgetcharge_guanbianniutc.png" }, "compId": 9 }, { "type": "Label", "props": { "y": 0, "x": 0, "var": "txt_tips", "text": "暂无数据", "fontSize": 28, "color": "#ffffff", "centerY": 52, "centerX": -1 }, "compId": 10, "child": [{ "type": "Image", "props": { "y": -94, "x": -10, "skin": "comp/dactivity_no_data.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 14 }] }, { "type": "Label", "props": { "y": 137, "x": 361, "width": 100, "text": "洗码量", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 17 }, { "type": "Label", "props": { "y": 137, "x": 901, "width": 100, "text": "详情", "height": 26, "fontSize": 26, "color": "#f3d667", "align": "center" }, "compId": 18 }], "loadList": ["comp/dwashcode_wc_bg_record.png", "comp/dpersonalcenter_gerenzhonxinlan1.png", "comp/vscroll.png", "comp/dgetcharge_guanbianniutc.png", "comp/dactivity_no_data.png"], "loadList3D": [] };
        return XiMaHistroyUI;
    }(Laya.Dialog));
    ui.XiMaHistroyUI = XiMaHistroyUI;
    REG("ui.XiMaHistroyUI", XiMaHistroyUI);
})(ui = exports.ui || (exports.ui = {}));

},{}]},{},[1]);
