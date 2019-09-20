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
 * Created by wxlan on 2017/8/28.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 游戏中美术提供资源，程序使用美术提供资源的基类。
         * 美术资源的对象为_res;
         * 逻辑包括：自动生成界面，显示、关闭、消耗、自适应屏幕
         * 美术资源中，把所有静态的图层放到组里面，命名为s_bgxx(xx为数字);
         * 会把这些静态图当成一张图片来渲染，提升效率
         * @class BaseUi
         * @author wx
         */
        var BaseUi = /** @class */ (function (_super) {
            __extends(BaseUi, _super);
            function BaseUi(resname) {
                var _this = _super.call(this) || this;
                _this._isModal = true;
                _this.m_layer = 0;
                _this.m_closeUiOnSide = true;
                _this._autoDestroy = resname == null;
                if (resname) {
                    _this._scene = utils.tools.createSceneByViewObj(resname);
                    _this._scene.name = resname;
                    _this.onSceneLoaded(_this._scene);
                }
                BaseUi.s_instanceList.push(_this);
                return _this;
            }
            BaseUi.prototype.setData = function (params) {
            };
            BaseUi.prototype.onAwake = function () {
                if (this._autoDestroy)
                    this.__init();
            };
            /**
             * 解决子页面嵌套获取不到var的情况(2.1之前)
             * @function
             * @DateTime 2019-01-05T17:02:31+0800
             * @param    {[type]}                 var child of this._res._children [description]
             */
            BaseUi.prototype.initProps = function (view, root) {
                if (view instanceof Laya.View) {
                    if (view['var']) {
                        root[view['var']] = view;
                    }
                    this.initViewProps(view, view);
                }
                else {
                    for (var _i = 0, _a = view._children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        this.initProps(child, root);
                    }
                }
            };
            /**
             * 子页面不能再嵌套子页面了
             * @function
             * @DateTime 2019-01-07T10:11:04+0800
             * @param    {Laya.Node}              view [description]
             * @param    {any}                    root [description]
             */
            BaseUi.prototype.initViewProps = function (view, root) {
                if (view['var']) {
                    root[view['var']] = view;
                }
                var len = view._children.length;
                for (var i = 0; i < len; i++) {
                    this.initViewProps(view._children[i], root);
                }
            };
            /**
             * 修复页面嵌套
             * @function
             * @DateTime 2019-01-05T15:11:40+0800
             */
            BaseUi.prototype.initUiViewProps = function () {
            };
            BaseUi.prototype.onEnable = function () {
                this._res.zOrder = this.m_layer;
                this.onResize();
                if (this._isDialog) {
                    g_uiMgr.m_temp_ui = this;
                    // this._res["popup"]();
                    this._closeByMaskBg = true;
                    if (this._noticeOther)
                        g_signal.dispatch("onDailogOpen", this);
                    var arr = g_dialogMgr.maskLayer["__listenerList"] || [];
                    arr.push(this);
                    g_dialogMgr.maskLayer["__listenerList"] = arr;
                    g_dialogMgr.maskLayer.offAll(Laya.Event.CLICK);
                    g_dialogMgr.maskLayer.on(Laya.Event.CLICK, this, this.onClickBg);
                }
                // else
                // {
                //     g_layerMgr.addChild(this._scene);
                // }
                for (var _i = 0, _a = this._clickEventObjects; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.on(laya.events.Event.CLICK, this, this.onClickObjects);
                }
                this.isClosedByCloseBtn = false;
                Laya.stage.on(laya.events.Event.RESIZE, this, this.onResize);
                Laya.stage.on(laya.events.Event.FOCUS, this, this.onFocus);
                if (this.btn_close)
                    this.btn_close.on(laya.events.Event.CLICK, this, this.onClickCloseBtn);
                this.onShow();
                g_signal.add(this.onBaseLocalMsg, this);
                if (isMultipleLans()) {
                    this.changeResourceByLan();
                }
            };
            BaseUi.prototype.onDisable = function () {
                if (this._isDialog) {
                    this._closeByMaskBg = false;
                    g_dialogMgr.maskLayer.off(Laya.Event.CLICK, this, this.onClickBg);
                    var arr = g_dialogMgr.maskLayer["__listenerList"] || [];
                    var index = arr.indexOf(this);
                    if (index >= 0)
                        arr.splice(index, 1);
                    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                        var temp = arr_1[_i];
                        g_dialogMgr.maskLayer.on(Laya.Event.CLICK, temp, temp.onClickBg);
                    }
                }
                else {
                    // this._res.removeSelf();
                }
                for (var _a = 0, _b = this._clickEventObjects; _a < _b.length; _a++) {
                    var item = _b[_a];
                    item.off(laya.events.Event.CLICK, this, this.onClickObjects);
                }
                if (this.btn_close)
                    this.btn_close.off(laya.events.Event.CLICK, this, this.onClickCloseBtn);
                Laya.stage.off(laya.events.Event.RESIZE, this, this.onResize);
                Laya.stage.off(laya.events.Event.FOCUS, this, this.onFocus);
                this.onClose();
                g_signal.remove(this.onBaseLocalMsg, this);
            };
            BaseUi.prototype.onSceneLoaded = function (scene) {
                scene.addComponentIntance(this);
                this._scene = scene;
                this.__init();
            };
            BaseUi.prototype.__init = function () {
                this._res = this.owner;
                this._scene = this._res;
                this._isDialog = (this._res instanceof laya.ui.Dialog);
                if (this._isDialog) {
                    this._res["closeHandler"] = Laya.Handler.create(this, this.onDialogClosed, null, false);
                    this._noticeOther = false;
                    //this._res["onOpened"] = this.onOpened;
                }
                this._clickEventObjects = [];
                this.btn_close = this._res["btn_close"];
                if (this._res["s_bg"]) {
                    this._res["s_bg"].cacheAsBitmap = true;
                }
                var i = 0;
                while (i >= 0) {
                    if (this._res["s_bg" + i]) {
                        this._res["s_bg" + i].cacheAsBitmap = true;
                        i++;
                    }
                    else {
                        i = -1;
                    }
                }
                if (isMultipleLans()) {
                    this._vars = [];
                    this._excepts = [];
                    // for(var key in this._res)
                    // {
                    //     if(this._res[key] instanceof Laya.UIComponent)
                    //     {
                    //         this._vars.push(this._res[key]);
                    //         // this._vars[key] = this._res[key];
                    //     }
                    // }
                    this.initVars(this._res);
                    this.changeResourceByLan();
                }
                this.init();
                if (this._isDialog)
                    this._res['isModal'] = this._isModal;
            };
            BaseUi.prototype.initVars = function (obj) {
                var arr = Object.getOwnPropertyNames(obj);
                for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                    var key = arr_2[_i];
                    if (key == "_scene" || key == "_parent")
                        continue;
                    var varObj = obj[key];
                    if (varObj == null || varObj instanceof Array || typeof varObj == "string" || typeof varObj == "number" || typeof varObj == "boolean" || varObj == obj)
                        continue;
                    if (varObj instanceof Laya.UIComponent) {
                        this._vars.push(varObj);
                    }
                    if (varObj instanceof Laya.Scene) {
                        if (varObj['runtime']) {
                            this.initVars(varObj);
                        }
                    }
                }
            };
            /**
             * 设置对象不自动切换语言
             * @param item
             */
            BaseUi.prototype.addItemToExceptsList = function (item) {
                if (!isMultipleLans())
                    return;
                this._excepts = this._excepts || [];
                this._excepts.push(item);
            };
            /**
            * 将按钮添加到事件监听列表中。
            * 需要重写onClickObjects方法来实现点击逻辑
            * @function addBtnToListener
            * @author wx
            * @DateTime 2018-03-15T20:57:24+0800
            * @param    {string}   name 按钮对象的var。注意是var，不是name
            * @access public
            */
            BaseUi.prototype.addBtnToListener = function (name) {
                var temp = this._res[name];
                if (temp == null) {
                    console.log("addBtnToListener 失败" + name);
                    return;
                }
                this._clickEventObjects.push(temp);
                temp.name = name;
            };
            BaseUi.prototype.removeBtnToListener = function (name) {
                for (var i = 0; i < this._clickEventObjects.length; i++) {
                    if (this._clickEventObjects[i].name == name) {
                        this._clickEventObjects.splice(i, 1);
                        return;
                    }
                }
            };
            /**
             * 初始化的工作放到这个函数里面，需要重写。不要主动都调用
             * @function init
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:14:55+0800
             */
            BaseUi.prototype.init = function () {
            };
            /**
             * 界面显示后会自动调用.不要主动都调用
             * @function onShow
             * @author wx
             * @DateTime 2018-03-16T10:15:32+0800
             * @access protected
             */
            BaseUi.prototype.onShow = function () {
            };
            /**
             * 界面关闭会自动调用。不要主动都调用
             * @function onClose
             * @author wx
             * @DateTime 2018-03-16T10:16:12+0800
             * @access protected
             */
            BaseUi.prototype.onClose = function () {
            };
            BaseUi.prototype.onBaseLocalMsg = function (msg, data) {
                switch (msg) {
                    case gamelib.GameMsg.CHANGELAN:
                        this.changeResourceByLan();
                        break;
                }
            };
            /**
             * 销毁界面。需要重写
             * @function destroy
             * @author wx
             * @DateTime 2018-03-16T10:16:29+0800
             * @access public
             */
            BaseUi.prototype.destroy = function () {
                if (this._scene) {
                    this.close();
                    this._scene.destroy();
                }
                var index = BaseUi.s_instanceList.indexOf(this);
                if (index >= 0)
                    BaseUi.s_instanceList.splice(index, 1);
                if (this._vars)
                    this._vars.length = 0;
                if (this._excepts)
                    this._excepts.length = 0;
                this._vars = this._excepts = null;
            };
            /**
             * 在scene销毁的时候会掉次方法
             * @function
             * @DateTime 2019-01-04T16:50:32+0800
             */
            BaseUi.prototype.onDestroy = function () {
                if (g_uiMgr.m_temp_ui == this)
                    g_uiMgr.m_temp_ui = null;
                this._isDestroyed = true;
                this._res = null;
                this._clickEventObjects.length = 0;
                this._clickEventObjects = null;
                this.btn_close = null;
                this._scene = null;
            };
            /**
             * 把界面显示到舞台上。不要重写。
             * 会根据 m_layer 来设置层级;会自动给_clickEventObjects的每个对象添加监听
             * 回自动调用this.onShow();
             * @function show
             * @author wx
             * @DateTime 2018-03-16T10:17:08+0800
             * @access public
             */
            BaseUi.prototype.show = function () {
                if (this._scene.parent == null)
                    this._scene.open(false);
            };
            /**
             * 从舞台上移除界面.回自动调用this.onClose();
             * .如果是dialog样式，并且_noticeOther && _closeByMaskBg。则会发送onDailogClose消息
             * @function close
             * @author wx
             * @DateTime 2018-03-16T10:18:48+0800
             * @access public
             */
            BaseUi.prototype.close = function () {
                if (this._scene.parent != null) {
                    this._scene.close();
                    if (this._isDialog) {
                        if (this._noticeOther && this._closeByMaskBg)
                            g_signal.dispatch("onDailogClose", this);
                    }
                }
            };
            /**
             * 舞台尺寸改变的时候的回掉。不要重写
             * @function onResize
             * @author wx
             * @DateTime 2018-03-16T10:19:12+0800
             * @param    {laya.events.Event}      evt [description]
             * @access protected
             */
            BaseUi.prototype.onResize = function (evt) {
                if (!this._isDialog) {
                    this._res.size(Laya.stage.width / g_scaleRatio, Laya.stage.height / g_scaleRatio);
                }
                else {
                    // this._res.scale(g_scaleRatio);
                }
            };
            BaseUi.prototype.onFocus = function (evt) {
                if (!this._isDialog) {
                    this._res.size(Laya.stage.width / g_scaleRatio, Laya.stage.height / g_scaleRatio);
                }
            };
            /**
             * 点击背景的回掉
             * @function onClickBg
             * @author wx
             * @DateTime 2018-03-16T10:29:29+0800
             * @param    {laya.events.Event}      evt [description]
             * @access private
             */
            BaseUi.prototype.onClickBg = function (evt) {
                if (evt)
                    evt.stopPropagation();
                playButtonSound();
                if (this.m_closeUiOnSide) {
                    this.close();
                }
            };
            /**
             * 按钮点击事件的回掉
             * @function onClickObjects
             * @author wx
             * @DateTime 2018-03-16T10:19:39+0800
             * @param    {laya.events.Event}      evt [description]
             * @access protected
             */
            BaseUi.prototype.onClickObjects = function (evt) {
            };
            /**
             * 关闭按钮的回掉.会调用this.close();
             * @function onClickCloseBtn
             * @author wx
             * @DateTime 2018-03-16T10:20:15+0800
             * @param    {laya.events.Event}      evt [description]
             * @access protected
             */
            BaseUi.prototype.onClickCloseBtn = function (evt) {
                evt.stopPropagation();
                playSound_qipai(g_closeUiSoundName, 1, null, true);
                this.isClosedByCloseBtn = true;
                this.close();
            };
            /**
             * ui关闭后的回掉
             * @function onDialogClosed
             * @author wx
             * @DateTime 2018-03-16T10:30:11+0800
             * @access protected
             */
            BaseUi.prototype.onDialogClosed = function () {
                if (this._autoDestroy) {
                    this.destroy();
                }
            };
            /**
             * 界面关闭特效
             * @function onDialogCloseEffect
             * @author wx
             * @DateTime 2018-03-16T10:31:35+0800
             * @access protected
             */
            BaseUi.prototype.onDialogCloseEffect = function () {
                this._res.manager.doClose(this._res);
            };
            /**
             * 界面显示特效
             * @function onDialogShowEffect
             * @author wx
             * @DateTime 2018-03-16T10:31:56+0800
             * @access protected
             */
            BaseUi.prototype.onDialogShowEffect = function () {
                this._res.manager.doOpen(this._res);
            };
            BaseUi.prototype.changeResourceByLan = function () {
                if (gamelib.Api.getLocalStorage("lan") == null)
                    return;
                this.changeResource(this._res);
            };
            BaseUi.prototype.changeResource = function (temp) {
                if (this._excepts.indexOf(temp) != -1)
                    return;
                for (var i = 0; i < temp.numChildren; i++) {
                    this.changeResource(temp.getChildAt(i));
                }
                if (this._excepts.indexOf(temp) != -1)
                    return;
                if (temp instanceof Laya.Label && this._vars.indexOf(temp) == -1) {
                    if (temp.text) {
                        if (temp["__lanKey"] == null) {
                            temp["__lanKey"] = temp.text;
                        }
                        temp.text = getDesByLan(temp["__lanKey"]);
                    }
                    return;
                }
                else if (temp instanceof Laya.Button) {
                    if (temp.label) {
                        if (temp["__lanKey"] == null) {
                            temp["__lanKey"] = temp.label;
                        }
                        temp.label = getDesByLan(temp["__lanKey"]);
                    }
                }
                var skin = temp['skin'];
                skin = this.getNewSkin(skin);
                temp['skin'] = skin;
            };
            BaseUi.prototype.getNewSkin = function (url) {
                var currentLan = gamelib.Api.getLocalStorage("lan");
                var newHz = currentLan == "zh" ? "en" : "zh";
                if (url == null || (url.indexOf("_zh.") == -1 && url.indexOf("_en.") == -1))
                    return url;
                if (url.indexOf("_" + currentLan + ".") >= 0) //如果已经是当前的语言版本，不需要替换。否则会出错。a_zhuang_en.png替换成英文版本会出错
                    return url;
                if (currentLan == "zh")
                    url = url.replace(/(.*)_en/, "$1_zh");
                else
                    url = url.replace(/(.*)_zh/, "$1_en");
                return url;
            };
            BaseUi.s_instanceList = [];
            return BaseUi;
        }(Laya.Script));
        core.BaseUi = BaseUi;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
///<reference path="../base/BaseUi.ts" />
var gamelib;
(function (gamelib) {
    var alert;
    (function (alert) {
        /**
         * @class AlertBuyGoods
         * @author wx
         * @extends gamelib.core.BaseUi
         * 购买商品提示框提示框，不要主动实例化这个类
         * @uses TipManager
         *
         */
        var AlertBuyGoods = /** @class */ (function (_super) {
            __extends(AlertBuyGoods, _super);
            function AlertBuyGoods() {
                var _this = _super.call(this, GameVar.s_namespace + ".Art_JJK_Skin.exml") || this;
                _this._buyIndex = 0;
                return _this;
            }
            AlertBuyGoods.prototype.init = function () {
                this._clickEventObjects.push(this["btn_ok"]);
                this._clickEventObjects.push(this["btn_more"]);
            };
            /**
             * @function setMsg
             * 设置消息
             * @param {number}  buyIndex 商品的buyIndex
             * @param {string} 提示消息
             */
            AlertBuyGoods.prototype.setMsg = function (buyIndex, msg) {
                this["txt_tips"].text = msg;
                var gd = gamelib.data.ShopData.getGoodsInfoById(buyIndex);
                this["txt_0"].text = gd.info1;
                this["txt_1"].text = gd.info2;
                this["txt_2"].text = gd.price + " " + gd.pricetype;
                this["icon"].source = GameVar.common_ftp + "shop/" + gd.icon + ".png";
                this["btn_ok"].icon = GameVar.common_ftp + "shop/" + gd.platformIcon + ".png";
                this._buyIndex = buyIndex;
                this["txt_tips"].visible = !(buyIndex >= 55 && buyIndex <= 57);
            };
            AlertBuyGoods.prototype.onClickObjects = function (evt) {
                playButtonSound();
                if (evt.currentTarget.name == "btn_ok") {
                    // utils.tools.BuyItem(this._buyIndex);
                }
                else if (evt.currentTarget.name == "btn_more") {
                    //openShop();
                }
            };
            return AlertBuyGoods;
        }(gamelib.core.BaseUi));
        alert.AlertBuyGoods = AlertBuyGoods;
    })(alert = gamelib.alert || (gamelib.alert = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/8/29.
 */
var gamelib;
(function (gamelib) {
    var alert;
    (function (alert) {
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
                return _super.call(this, "qpq/Art_CustomTips.scene") || this;
            }
            AlertUi.prototype.init = function () {
                _super.prototype.init.call(this);
                this.btn_ok = this._res["btn_ok"];
                this.btn_cancel = this._res["btn_cancel"];
                this.txt_tips = this._res["txt_txt"];
                this.txt_title = this._res["txt_title"];
                this.width = this._res.width;
                this._oldAtts = {};
                this._oldAtts.okLabel = this.btn_ok.label;
                this._oldAtts.cancelLabel = this.btn_cancel.label;
                this._oldAtts.okPos = this.btn_ok.x;
                this._oldAtts.cancelPos = this.btn_cancel.x;
                this._clickEventObjects.push(this.btn_ok);
                this._clickEventObjects.push(this.btn_cancel);
                this._noticeOther = false;
                this.m_closeUiOnSide = false;
                this.m_layer = 10;
                this._isModal = true;
                this.addItemToExceptsList(this.btn_cancel);
                this.addItemToExceptsList(this.btn_ok);
                this.addItemToExceptsList(this.txt_tips);
                this.addItemToExceptsList(this.txt_title);
            };
            /**
             * @function setData
             * @author wx
             * @DateTime 2018-03-15
             * @param  {any}  params 一个对象。包含
             * msg：提示文本
             * type : 0：只有确定按钮，1：确定和取消按钮,2:确定，取消，关闭按钮都有 3，三个按钮都没有
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
                this.btn_cancel.label = params.cancelLabel ? params.cancelLabel : this._oldAtts.cancelLabel;
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
                var label = params.okLabel ? params.okLabel : this._oldAtts.okLabel;
                if (autoCall == 0)
                    this.btn_ok.label = label;
                else {
                    this.btn_ok.label = label + "(" + autoCall + ")";
                    Laya.timer.once(1000, this, this.timer, [label, autoCall - 1]);
                }
                this.btn_ok.mouseEnabled = this.btn_ok.visible;
            };
            AlertUi.prototype.timer = function (label, time) {
                if (time < 0) {
                    if (this._callBack != null) {
                        this._callBack.apply(this._thisObj);
                    }
                    this.close();
                    return;
                }
                this.btn_ok.label = label + "(" + time + ")";
                Laya.timer.once(1000, this, this.timer, [label, time - 1]);
            };
            AlertUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                Laya.timer.clear(this, this.timer);
                g_uiMgr.onAlertUiClose(this);
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
        alert.AlertUi = AlertUi;
    })(alert = gamelib.alert || (gamelib.alert = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var alert;
    (function (alert) {
        /**
         * @class Pmd
         * @author wx
         * 游戏跑马灯.需要主动设置资源。
         */
        var Pmd = /** @class */ (function (_super) {
            __extends(Pmd, _super);
            function Pmd() {
                var _this = _super.call(this) || this;
                _this._scrolling = false;
                _this._msgList = [];
                _this.zOrder = 10;
                return _this;
            }
            /**
             * 设置跑马灯的资源，目前主要是在qpq大厅里面设置
             * @function setRes
             * @author wx
             * @DateTime 2018-03-15
             * @param    {laya.display.Sprite} res [跑马灯会放在res上面运行]
             */
            Pmd.prototype.setRes = function (res, speed) {
                if (speed === void 0) { speed = 3; }
                if (this._res != null)
                    return;
                this._speed = speed;
                this._res = res;
                var _mask = new Laya.Sprite();
                _mask.graphics.drawRect(0, 0, this._res.width, this._res.height, "#FF0000");
                this._res.mask = _mask;
                this._txt = res.getChildByName("txt_label");
                this._txt['_oldX'] = this._txt.x;
                this._txt.width = 0;
                this._totalWidth = this._res.width;
                //this._rec = new laya.maths.Rectangle(0, 0, this._res.width - this._txt.x - 10, this._res.height);
                this._txt.overflow = "visible";
                this._txt.y = (this._res.height - this._txt.height) / 2;
                this._txt.text = "";
                this.checkShow();
            };
            Pmd.prototype.destroy = function () {
                this.clearTimer(this, this.onScroll);
            };
            Pmd.prototype.setSpeed = function (value) {
                this._speed = value;
            };
            Pmd.prototype.resize = function () {
                this._totalWidth = this._res.width;
                var _mask = this._res.mask || new Laya.Sprite();
                _mask.graphics.drawRect(0, 0, this._res.width, this._res.height, "#FF0000");
                this._res.mask = _mask;
                // this._rec = new laya.maths.Rectangle(0, 0, this._res.width - this._txt['_oldX'] - 10, this._res.height);
            };
            /**
             * 添加消息到跑马灯队列中
             * @function add
             * @author wx
             * @DateTime 2018-03-15T20:49:00+0800
             * @param    {string}     msg [description]
             */
            Pmd.prototype.add = function (msg) {
                this._msgList.push(msg);
                if (this._res == null) {
                    return;
                }
                this.checkShow();
            };
            Pmd.prototype.checkShow = function () {
                if (this._msgList.length == 0 && !this._scrolling) {
                    this.clearTimer(this, this.onScroll);
                }
                else if (this._scrolling) {
                    return;
                }
                else {
                    var msg = this._msgList.shift();
                    this._txt.text = msg;
                    this._txt.x = this._totalWidth;
                    // this._rec.x = - this._rec.width;
                    // this._txt.scrollRect = this._rec;
                    this.frameLoop(1, this, this.onScroll);
                    this._scrolling = true;
                }
            };
            Pmd.prototype.onScroll = function () {
                if (this._txt == null) {
                    this._scrolling = false;
                    return;
                }
                this._txt.x -= this._speed;
                if (this._txt.x <= -this._txt.width) {
                    this._scrolling = false;
                    this.checkShow();
                }
                // this._rec.x += this._speed;
                // this._txt.scrollRect = this._rec;
                // if (this._rec.x > this._rec.width + this._txt.width) {
                // 	this._scrolling = false;
                // 	this.checkShow();
                // }
            };
            return Pmd;
        }(Laya.Sprite));
        alert.Pmd = Pmd;
        /**
         * @class Pmd_Laba
         * @ignore
         */
        var Pmd_Laba = /** @class */ (function (_super) {
            __extends(Pmd_Laba, _super);
            function Pmd_Laba() {
                var _this = _super.call(this, "ui.Art_Laba_tipsSkin") || this;
                _this._scrolling = false;
                return _this;
            }
            Pmd_Laba.prototype.init = function () {
                //this._res.touchChildren = false;
                //this._res.touchEnabled = false;
                var temp = this._res["txt_laba"];
                this._container = new laya.display.Sprite();
                //this._container.mask = new egret.Rectangle(0,0,temp.width,temp.height);
                //this._container.x = temp.x;
                //this._container.y = temp.y;
                //this.addChild(this._container);
                this._msgList = [];
            };
            Pmd_Laba.prototype.add = function (msg) {
                msg = msg.replace(/\n/, "");
                this._msgList.push(msg);
                this.checkShow();
            };
            Pmd_Laba.prototype.checkShow = function () {
                if (this._msgList.length == 0) {
                    //this.parent.removeChild(this);
                }
                else {
                    //g_director.getRunningScene().addChild(this);
                    //if(this._scrolling == false)
                    //	this.scrollText(this._msgList.shift());
                }
            };
            Pmd_Laba.prototype.scrollText = function (msg) {
                if (this._txt == null) {
                    //this._txt = new egret.TextField();
                    //this._txt.multiline = false;
                    //this._txt.wordWrap = false;
                    //this._txt.size = 24;
                }
                this._container.addChild(this._txt);
                this._txt.text = msg;
                this._txt.x = 650;
                //egret.Tween.get(this._txt).to({x:-this._txt.width},15000).call(this.scrollEnd,this);
                this._scrolling = true;
            };
            Pmd_Laba.prototype.scrollEnd = function () {
                this._container.removeChild(this._txt);
                //egret.Tween.removeTweens(this._txt);
                this._scrolling = false;
                this.checkShow();
            };
            return Pmd_Laba;
        }(gamelib.core.BaseUi));
        alert.Pmd_Laba = Pmd_Laba;
    })(alert = gamelib.alert || (gamelib.alert = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/10/24.
 */
var gamelib;
(function (gamelib) {
    var Api;
    (function (Api) {
        //保存在app本地的数据
        function getLocalStorage(key) {
            var storage;
            if (utils.tools.isApp()) {
                storage = window['plus'].storage;
            }
            else {
                storage = window['localStorage'];
            }
            return storage.getItem(key);
        }
        Api.getLocalStorage = getLocalStorage;
        function saveLocalStorage(key, value) {
            var storage;
            if (utils.tools.isApp()) {
                storage = window['plus'].storage;
            }
            else {
                storage = window['localStorage'];
            }
            storage.setItem(key, value);
        }
        Api.saveLocalStorage = saveLocalStorage;
        /**
         * 检测平台货币
         * @param callback
         */
        function checkPlatfromMoney(callback) {
            console.log("checkPlatfromMoney:::" + gamelib.data.ShopData.s_bShowPlatformMoney);
            if (window["application_query_diamond"])
                window["application_query_diamond"](queryCallBack);
            else if (callback) {
                callback.runWith(0);
            }
            function queryCallBack(data) {
                console.log("检查钻石结果:" + JSON.stringify(data));
                GameVar.platfromMoney = data.balance;
                if (callback) {
                    callback.runWith(GameVar.platfromMoney);
                }
            }
        }
        Api.checkPlatfromMoney = checkPlatfromMoney;
        /**
         * 更新玩家信息
         * @function
         * @DateTime 2018-08-10T12:07:51+0800
         * @param    {number}} obj [description]
         * @param    {Laya.Handler}           callBack [description]
         */
        function updateUserInfo(obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Updateuser");
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
                //修改app数据
                if (data.ret == 1 && window['application_set_userinfo']) {
                    var dd = {};
                    if (obj.nick)
                        dd.nickname = obj.nick;
                    if (obj.icon)
                        dd.icon_url = obj.icon;
                    if (obj.gender)
                        dd.gender = obj.gender;
                    if (obj.phone)
                        dd.bind_phone = obj.phone;
                    window['application_set_userinfo'](dd);
                }
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.updateUserInfo = updateUserInfo;
        /**
         *  玩家联系方式(快递
         * @function
         * @DateTime 2018-07-13T10:23:01+0800
         * @param    {string,                }} obj [description]
         */
        function updateUserContacts(obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Updateusercontacts");
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.updateUserContacts = updateUserContacts;
        /**
         *  玩家实名信息(实名
         * @function
         * @DateTime 2018-07-18T19:12:19+0800
         * @param    {string,                                     }} obj [description]
         * @param    {Laya.Handler}           callBack [description]
         */
        function updateUserIdentity(obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Updateuseridentify");
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.updateUserIdentity = updateUserIdentity;
        /**
         * 修改游戏的某些属性。通过接口来修改
         * @function
         * @DateTime 2018-10-15T15:56:44+0800
         * @param    {string}                 interfaceName [description]
         * @param    {any}                    obj           [description]
         * @param    {Laya.Handler}           callBack      [description]
         */
        function modfiyAttByInterface(interfaceName, obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl(interfaceName);
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.modfiyAttByInterface = modfiyAttByInterface;
        /**
         * 更新玩家的登录相关的信息
         * @function
         * @DateTime 2018-10-12T17:09:40+0800
         * @param    {string,                                     }} obj [description]
         * @param    {Laya.Handler}           callBack [description]
         */
        function updateUserLoginInfo(obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Updateuser");
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.updateUserLoginInfo = updateUserLoginInfo;
        /**
         * 手机注册
         * @function
         * @DateTime 2018-10-12T17:12:51+0800
         * @param    {{}}                   obj [description]
         */
        function registerByPhone(obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Bindphone");
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.registerByPhone = registerByPhone;
        /**
         * 通过指定接口获取信息
         * @function
         * @DateTime 2018-10-15T16:04:54+0800
         * @param    {string}                 interfaceName [description]
         * @param    {any}                    obj           [description]
         * @param    {Laya.Handler}           callBack      [description]
         */
        function getInfoByInterface(interfaceName, obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl(interfaceName);
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getInfoByInterface = getInfoByInterface;
        /**
         * 获取短信验证码
         * @function
         * @DateTime 2018-10-12T17:28:32+0800
         */
        function GetPhoneVerifyCode(obj, callBack) {
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Sendsms");
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.GetPhoneVerifyCode = GetPhoneVerifyCode;
        function getSig(obj, access_key) {
            var keys = Object.keys(obj).sort();
            var sig = "";
            for (var i = 0; i < keys.length; i++) {
                sig += obj[keys[i]];
            }
            sig += access_key;
            console.log(sig);
            sig = new md5().hex_md5(sig);
            return sig;
        }
        Api.getSig = getSig;
        /**
         * 获得玩家实名信息
         */
        function getUserIdentity(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/Getuseridentify");
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token }, 'post', function (data) {
                console.log(JSON.stringify(data));
                callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getUserIdentity = getUserIdentity;
        /**
         * 获取玩家联系信息
         * @function
         * @DateTime 2018-07-18T19:12:41+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        function getUserContacts(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/Getusercontacts");
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token }, 'post', function (data) {
                console.log(JSON.stringify(data));
                callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getUserContacts = getUserContacts;
        /**
         * 获得玩家登录相关的信息。包括登录账号，
         * @function
         * @DateTime 2018-10-12T11:19:53+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        function getUserLoginInfo(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/Getuser");
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token }, 'post', function (data) {
                console.log(JSON.stringify(data));
                callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getUserLoginInfo = getUserLoginInfo;
        /** 获取代理列表
         */
        function getDailiList(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/Getweekrebateriseranking");
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token }, 'post', function (data) {
                callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getDailiList = getDailiList;
        /**
         * 获得兑换物品列表
         * @function
         * @DateTime 2018-07-16T14:32:43+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        function getExchangeGoodsList(callBack) {
            var url = GameVar.urlParam['request_host'] + "/platform/getPrizes";
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token }, 'post', function (data) {
                callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getExchangeGoodsList = getExchangeGoodsList;
        /**
         * 兑换商品
         */
        function exchangeGoods(id, num, callBack) {
            if (num === void 0) { num = 1; }
            if (callBack === void 0) { callBack = null; }
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Exchangeprize");
            var obj = {
                prize_id: id,
                num: num,
                gz_id: GameVar.gz_id
            };
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.exchangeGoods = exchangeGoods;
        /**
         * 兑换商品
         */
        function exchangeCDKey(cdkey, callBack) {
            if (callBack === void 0) { callBack = null; }
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Exchangecdkey");
            var obj = {
                key: cdkey,
                gz_id: GameVar.gz_id
            };
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.exchangeCDKey = exchangeCDKey;
        /**
         * 上传事件日志
         */
        function ApplicationEventNotify(evt, value, addData, callBack) {
            if (callBack === void 0) { callBack = null; }
            if (!GameVar.g_platformData['eventTongJi'])
                return;
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/Applicationeventnotify");
            var obj = {
                event: evt,
                value: value
            };
            if (addData) {
                obj.addData = addData;
            }
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.ApplicationEventNotify = ApplicationEventNotify;
        function buyItem(buyindex, callBack, num, extra_data) {
            if (callBack === void 0) { callBack = null; }
            if (num === void 0) { num = 1; }
            var access_token = GameVar.urlParam['client_access_token'];
            var access_key = GameVar.urlParam['client_access_key'];
            var url = utils.tools.getRemoteUrl("/platform/buy");
            var platform = laya.utils.Browser.onIOS ? "ios" : laya.utils.Browser.onAndroid ? "android" : "default";
            var obj = {
                "platform": platform,
                "goods_id": buyindex,
                "gz_id": GameVar.gz_id,
                "num": num
            };
            if (extra_data) {
                utils.tools.copyTo(extra_data, obj);
            }
            var sig = getSig(obj, access_key);
            obj['access_token'] = access_token;
            obj['sig'] = sig;
            utils.tools.http_request(url, obj, 'post', function (data) {
                if (data.ret == 1) {
                    if (data.data) {
                        if (Laya.Browser.onWeiXin) {
                            if (window['open_h5_payment']) {
                                window['open_h5_payment'](data.data.payUrl);
                            }
                            else if (window['application_layer_show']) {
                                window['application_layer_show'](data.data.payUrl);
                            }
                            else {
                                window.location.href = data.data.payUrl;
                            }
                        }
                        else {
                            window['open_h5_payment'](data.data.payUrl);
                        }
                    }
                    else {
                        //购买或兑换成功
                        if (callBack) {
                            callBack.runWith(data);
                        }
                    }
                }
                else {
                    g_uiMgr.showTip("购买商品失败:" + data.clientMsg);
                    if (callBack) {
                        callBack.runWith(data);
                    }
                }
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.buyItem = buyItem;
        /**
         * 获得商城道具
         * @function
         * @DateTime 2018-07-19T12:07:02+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        function getShopData(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/Getshop");
            var access_token = GameVar.urlParam['client_access_token'];
            var platform = laya.utils.Browser.onIOS ? "ios" : laya.utils.Browser.onAndroid ? "android" : "default";
            utils.tools.http_request(url, { access_token: access_token, "platform": platform }, 'post', function (data) {
                // console.log(JSON.stringify(data));
                if (callBack)
                    callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getShopData = getShopData;
        /**
         * 获取平台道具
         */
        function getPlatformMoneyMsId(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/Getmsid");
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token, app: GameVar.platform }, 'get', function (data) {
                var list = data.data;
                if (list == null)
                    return;
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var obj = list_1[_i];
                    gamelib.data.GoodsData.s_goodsNames[obj.model_id] = obj.model_name;
                    gamelib.data.GoodsData.s_goodsInfo[obj.model_id] = obj;
                }
                if (callBack)
                    callBack.runWith(data);
                g_signal.dispatch(gamelib.GameMsg.GOODSMSIDDATALOADED, 0);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getPlatformMoneyMsId = getPlatformMoneyMsId;
        /** 获得比赛相关信息 */
        function getPublicMatchInfo(callBack) {
            var url = utils.tools.getRemoteUrl("/platform/getPublicMatchInfo");
            var access_token = GameVar.urlParam['client_access_token'];
            utils.tools.http_request(url, { access_token: access_token, app_code: GameVar.platform }, 'post', function (data) {
                callBack.runWith(data);
            }, function () {
                if (callBack)
                    callBack.runWith({ ret: 0, clientMsg: "接口调用失败" });
            });
        }
        Api.getPublicMatchInfo = getPublicMatchInfo;
        /**
         * 判断是否app是否已经登录
         * @function gamelib.Api.logined
         * @author wx
         * @DateTime 2018-03-15T20:50:20+0800
         * @return   {boolean}   [description]
         */
        function logined() {
            return getAtt("g_app_logined");
        }
        Api.logined = logined;
        /**
         * 登录app
         * @function gamelib.Api.login
         * @author wx
         * @DateTime 2018-03-15T20:52:08+0800
         * @param    {string}                 loginType 登录的类型，wx,qq
         * @param    {Function}               callBack  回掉
         * @param    {any}                    thisobj   [description]
         */
        function login(loginType, callBack, thisobj) {
            if (logined())
                return;
            var fun = getFunction("application_login");
            fun(loginType, callBack, thisobj);
        }
        Api.login = login;
        /**
         * 登出app
         * @function gamelib.Api.logout
         * @author wx
         * @DateTime 2018-03-15T20:53:08+0800
         * @param    {Function}               callBack 操作的回掉
         * @param    {any}                    thisobj  [description]
         */
        function logout(callBack, thisobj) {
            var fun = getFunction("application_logout");
            fun("", callBack, thisobj);
        }
        Api.logout = logout;
        /**
         * 获得剪切版的内容。只有在app下才能使用
         * @function
         * @DateTime 2018-11-05T10:53:24+0800
         * @param    {Function}               callBack [description]
         */
        function getclipboard(callBack) {
            if (window['application_get_clipboard']) {
                return window['application_get_clipboard'](callBack);
            }
            callBack({ result: 1, data: "" });
        }
        Api.getclipboard = getclipboard;
        /**
         * 复制到剪贴版
         * @function
         * @DateTime 2018-11-05T10:55:04+0800
         * @param    {[type]}                 str      [description]
         * @param    {Function}               callBack [ callback
            result: 0 成功 ， 1 失败
            msg: 信息
            data:  设置的数据]
         */
        function copyToClipboard(str, callBack) {
            if (window['application_set_clipboard']) {
                return window['application_set_clipboard'](str, callBack);
            }
            utils.tools.copyStrToClipboard(str);
            if (callBack)
                callBack({ result: 0 });
        }
        Api.copyToClipboard = copyToClipboard;
        function enterGame(parms) {
            if (!logined())
                return false;
            var temp = {};
            temp.gz_id = parms.gz_id;
            temp.orientation = parms.orientation;
            var fun = getFunction("application_login_game");
            fun(parms.gz_id, parms.gameId, function (obj) {
                if (obj.status != 1) {
                    console.log(obj.msg);
                    return;
                }
                temp.url = obj.data.url;
                var fun = getFunction("hall_open_game");
                fun(temp);
            });
            return true;
        }
        Api.enterGame = enterGame;
        /** 保存app的玩家信息
         */
        function saveAppUserInfo(info) {
            if (info.nick)
                window['g_app_nickname'] = info.nick;
            if (info.icon)
                window['g_app_icon_url'] = info.icon;
            if (info.gender)
                window['g_app_gender'] = info.gender;
            if (window['hall_store_login_session']) {
                window['hall_store_login_session']();
            }
            if (window['hall_store_userinfo']) {
                window['hall_store_userinfo']();
            }
        }
        Api.saveAppUserInfo = saveAppUserInfo;
        function getAtt(attname) {
            return window[attname];
        }
        Api.getAtt = getAtt;
        function getFunction(name) {
            return window[name];
        }
        Api.getFunction = getFunction;
    })(Api = gamelib.Api || (gamelib.Api = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/8/28.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * @class BaseUi_ex
         * @author wx
         * 非dialog界面.用动画的形式打开和关闭。游戏牌桌中结算用弹出框的形式，
         * 屏幕适配的时候会出问题
         *
         */
        var BaseUi_ex = /** @class */ (function () {
            function BaseUi_ex(resname) {
                this.m_layer = 0;
                var classObj = gamelib.getDefinitionByName(resname);
                if (classObj == null) {
                    console.log(resname + " 不存在");
                }
                else {
                    this._res = new classObj();
                    this.__oldWidth = this._res.width;
                    this.__oldHeight = this._res.height;
                    this.__oldX = this._res.x;
                    this.__oldY = this._res.y;
                    this._noticeOther = false;
                    this._clickEventObjects = [];
                    this.btn_close = this._res["btn_close"];
                    this.init();
                }
            }
            /**
             * 将按钮添加到事件监听列表中。
             * 需要重写onClickObjects方法来实现点击逻辑
             * @function addBtnToListener
             * @author wx
             * @access protected
             * @DateTime 2018-03-15T20:57:24+0800
             * @param    {string}   name 按钮对象的var。注意是var，不是name
             */
            BaseUi_ex.prototype.addBtnToListener = function (name) {
                var temp = this._res[name];
                if (temp == null) {
                    console.log("addBtnToListener 失败" + name);
                    return;
                }
                this._clickEventObjects.push(temp);
                temp.name = name;
            };
            BaseUi_ex.prototype.removeBtnToListener = function (name) {
                for (var i = 0; i < this._clickEventObjects.length; i++) {
                    if (this._clickEventObjects[i].name == name) {
                        this._clickEventObjects.splice(i, 1);
                        return;
                    }
                }
            };
            /**
             * 接收到网络消息的处理
             * @function reciveNetMsg
             * @author wx
             * @access public
             * @DateTime 2018-03-15T20:59:01+0800
             * @param    {number}                 msgId 协议号，例如0x0001
             * @param    {any}                    data  [description]
             */
            BaseUi_ex.prototype.reciveNetMsg = function (msgId, data) {
            };
            /**
             * 初始化的工作放到这个函数里面，需要重写。不要主动都调用
             * @function init
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:14:55+0800
             */
            BaseUi_ex.prototype.init = function () {
            };
            /**
             * 界面显示后会自动调用.不要主动都调用
             * @function onShow
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:15:32+0800
             */
            BaseUi_ex.prototype.onShow = function () {
            };
            /**
             * 界面关闭会自动调用。不要主动都调用
             * @function onClose
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:16:12+0800
             */
            BaseUi_ex.prototype.onClose = function () {
            };
            /**
             * 销毁界面。需要重写
             * @function destroy
             * @author wx
             * @access public
             * @DateTime 2018-03-16T10:16:29+0800
             */
            BaseUi_ex.prototype.destroy = function () {
                if (this._isDestroyed)
                    return;
                this._isDestroyed = true;
                this.close();
                Laya.Tween.clearAll(this._res);
                this._res = null;
                this._clickEventObjects.length = 0;
                this._clickEventObjects = null;
                this.btn_close = null;
            };
            /**
             * 把界面显示到舞台上。不要重写。
             * 会根据 m_layer 来设置层级;会自动给_clickEventObjects的每个对象添加监听
             * 回自动调用this.onShow();
             * @function show
             * @author wx
             * @access public
             * @DateTime 2018-03-16T10:17:08+0800
             */
            BaseUi_ex.prototype.show = function () {
                if (this._res.parent)
                    return;
                this._res.zOrder = this.m_layer;
                this.onResize();
                g_layerMgr.addChild(this._res);
                this.onDialogShowEffect();
                this.isClosedByCloseBtn = false;
                for (var _i = 0, _a = this._clickEventObjects; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.on(laya.events.Event.CLICK, this, this.onClickObjects);
                }
                if (this._noticeOther)
                    g_signal.dispatch("onDailogOpen", this);
                Laya.stage.on(laya.events.Event.RESIZE, this, this.onResize);
                if (this.btn_close)
                    this.btn_close.on(laya.events.Event.CLICK, this, this.onClickCloseBtn);
                g_net.addListener(this);
                this.onShow();
            };
            /**
             * 从舞台上移除界面.回自动调用this.onClose();
             * @function close
             * @author wx
             * @access public
             * @DateTime 2018-03-16T10:18:48+0800
             */
            BaseUi_ex.prototype.close = function () {
                if (!this._res.parent)
                    return;
                // this._res.removeSelf();
                this.onDialogCloseEffect();
                for (var _i = 0, _a = this._clickEventObjects; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.off(laya.events.Event.CLICK, this, this.onClickObjects);
                }
                if (this._noticeOther)
                    g_signal.dispatch("onDailogClose", this);
                if (this.btn_close)
                    this.btn_close.off(laya.events.Event.CLICK, this, this.onClickCloseBtn);
                Laya.stage.off(laya.events.Event.RESIZE, this, this.onResize);
                g_net.removeListener(this);
                this.onClose();
            };
            /**
             * 舞台尺寸改变的时候的回掉。不要重写
             * @function onResize
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:19:12+0800
             * @param    {laya.events.Event}      evt [description]
             */
            BaseUi_ex.prototype.onResize = function (evt) {
                this._res.size(Laya.stage.width / g_scaleRatio, Laya.stage.height / g_scaleRatio);
            };
            /**
             * 按钮点击事件的回掉
             * @function onClickObjects
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:19:39+0800
             * @param    {laya.events.Event}      evt [description]
             */
            BaseUi_ex.prototype.onClickObjects = function (evt) {
            };
            /**
             * 关闭按钮的回掉.会调用this.close();
             * @function onClickCloseBtn
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:20:15+0800
             * @param    {laya.events.Event}      evt [description]
             */
            BaseUi_ex.prototype.onClickCloseBtn = function (evt) {
                playSound_qipai(g_closeUiSoundName);
                this.isClosedByCloseBtn = true;
                this.close();
            };
            BaseUi_ex.prototype.onDialogCloseEffect = function () {
                var centerX, centerY;
                if (g_scaleXY == "x") {
                    centerX = g_gameMain.m_gameWidth / 2;
                    centerY = g_gameMain.m_gameHeight / 2 + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio) / 2 / g_scaleRatio;
                }
                else {
                    centerX = g_gameMain.m_gameWidth / 2 + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio) / 2 / g_scaleRatio;
                    centerY = g_gameMain.m_gameHeight / 2;
                }
                Laya.Tween.to(this._res, { x: centerX, y: centerY, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.strongOut, Laya.Handler.create(this, this.doClose));
            };
            BaseUi_ex.prototype.doClose = function () {
                this._res.removeSelf();
            };
            BaseUi_ex.prototype.onDialogShowEffect = function () {
                this._res.scale(1, 1);
                this._res.x = this.__oldX;
                this._res.y = this.__oldY;
                var centerX, centerY;
                if (g_scaleXY == "x") {
                    centerX = g_gameMain.m_gameWidth / 2;
                    centerY = g_gameMain.m_gameHeight / 2 + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio) / 2 / g_scaleRatio;
                }
                else {
                    centerX = g_gameMain.m_gameWidth / 2 + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio) / 2 / g_scaleRatio;
                    centerY = g_gameMain.m_gameHeight / 2;
                }
                Laya.Tween.from(this._res, { x: centerX, y: centerY, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.backOut);
            };
            return BaseUi_ex;
        }());
        core.BaseUi_ex = BaseUi_ex;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/14.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 弹出框管理器。laya.ui.DialogManager在Laya.stage.scaleMode = "full"模式下有bug。不能使弹出框剧中对齐
         * 不要主动调用这个类里面的任何方法。
         * @class DialogManager
         * @extends laya.ui.DialogManager
         */
        var DialogManager = /** @class */ (function (_super) {
            __extends(DialogManager, _super);
            function DialogManager() {
                var _this = _super.call(this) || this;
                _this.closeEffectHandler = new Laya.Handler(_this, _this.closeEffect1);
                _this.popupEffectHandler = new Laya.Handler(_this, _this.popupEffect1);
                Laya.stage.on(Laya.Event.FOCUS, _this, _this._onResize);
                var self = _this;
                window.onresize = function () {
                    Laya.timer.once(500, this, function () {
                        self._onResize();
                        // console.log("延时输出:" + Laya.stage.width +" " + Laya.stage.height)
                    });
                };
                return _this;
            }
            DialogManager.prototype.open = function (dialog, closeOther, showEffect) {
                _super.prototype.open.call(this, dialog, closeOther, showEffect);
                this._onResize(null);
            };
            DialogManager.prototype.popupEffect1 = function (dialog) {
                dialog.scale(1, 1);
                var centerX, centerY;
                if (g_scaleXY == "x") {
                    centerX = g_gameMain.m_gameWidth / 2;
                    centerY = g_gameMain.m_gameHeight / 2 + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio) / 2 / g_scaleRatio;
                }
                else {
                    centerX = g_gameMain.m_gameWidth / 2 + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio) / 2 / g_scaleRatio;
                    centerY = g_gameMain.m_gameHeight / 2;
                }
                Laya.Tween.from(dialog, { x: centerX, y: centerY, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.backOut, Laya.Handler.create(this, this.doOpen, [dialog]));
            };
            DialogManager.prototype.closeEffect1 = function (dialog, type) {
                var centerX, centerY;
                if (g_scaleXY == "x") {
                    centerX = g_gameMain.m_gameWidth / 2;
                    centerY = g_gameMain.m_gameHeight / 2 + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio) / 2 / g_scaleRatio;
                }
                else {
                    centerX = g_gameMain.m_gameWidth / 2 + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio) / 2 / g_scaleRatio;
                    centerY = g_gameMain.m_gameHeight / 2;
                }
                Laya.Tween.to(dialog, { x: centerX, y: centerY, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.strongOut, Laya.Handler.create(this, this.doClose, [dialog, type]));
            };
            DialogManager.prototype._onResize = function (e) {
                // console.log(Laya.stage.width,Laya.stage.height);
                var width = this.maskLayer.width = Laya.stage.width / g_scaleRatio;
                var height = this.maskLayer.height = Laya.stage.height / g_scaleRatio;
                if (this.lockLayer)
                    this.lockLayer.size(width, height);
                this.maskLayer.graphics.clear();
                this.maskLayer.graphics.drawRect(0, 0, width, height, UIConfig.popupBgColor);
                this.maskLayer.alpha = UIConfig.popupBgAlpha;
                for (var i = this.numChildren - 1; i > -1; i--) {
                    var item = this.getChildAt(i);
                    if (item["popupCenter"])
                        this._centerDialog(item);
                }
            };
            DialogManager.prototype._centerDialog = function (dialog) {
                // Laya.stage.width/g_scaleRatio,Laya.stage.height/g_scaleRatio
                if (g_scaleXY == "x") {
                    dialog.x = Math.round(((g_gameMain.m_gameWidth - dialog.width) >> 1) + dialog.pivotX);
                    dialog.y = Math.round(((g_gameMain.m_gameHeight - dialog.height) >> 1) + dialog.pivotY + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio) / 2 / g_scaleRatio);
                }
                else {
                    dialog.x = Math.round(((g_gameMain.m_gameWidth - dialog.width) >> 1) + dialog.pivotX + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio) / 2 / g_scaleRatio);
                    dialog.y = Math.round(((g_gameMain.m_gameHeight - dialog.height) >> 1) + dialog.pivotY);
                }
                // dialog.x = (Laya.stage.width - dialog.width) / 2 - dialog.pivotX;
                // dialog.y = (Laya.stage.height - dialog.height) / 2 - dialog.pivotY;
                //console.log(dialog.x,dialog.y);
            };
            return DialogManager;
        }(laya.ui.DialogManager));
        core.DialogManager = DialogManager;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/2/13.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 通过id获取玩家数据的方法。需要每个游戏单独设置一下这个方法，以确保能获取玩家数据
         * @function gamelib.core.getPlayerData
         * @author wx
         * @DateTime 2018-03-16T10:34:05+0800
         * @param    {number}   playerId 玩家的id
         * @return   {gamelib.data.UserInfo}          玩家数据
         * @access public
         */
        function getPlayerData(playerId) {
            return null;
        }
        core.getPlayerData = getPlayerData;
        /**
         * 游戏接收网络数据的管理器。游戏需要继承此类
         * @class GameDataManager
         * @author wx
         * @implements gamelib.core.INet
         *
         */
        var GameDataManager = /** @class */ (function () {
            function GameDataManager() {
                this._enterMatchData = null;
            }
            /**
             * 销毁
             * @function destroy
             * @author wx
             * @DateTime 2018-03-16T10:48:34+0800
             */
            GameDataManager.prototype.destroy = function () {
            };
            /**
             * 接收到网络消息
             * @function reciveNetMsg
             * @author wx
             * @DateTime 2018-03-16T10:48:14+0800
             * @param    {number}                 msgId 协议号
             * @param    {any}                    data  协议数据
             * @access public
             */
            GameDataManager.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x0040:
                        g_net_configData.getNetConfog(data);
                        break;
                    case 0x0074:
                        if (data.type == 1) {
                            if (data.sendId == 0) //系统公告
                                g_uiMgr.showPMD("[" + getDesByLan("系统") + "]" + ":" + data.msg);
                            else //喇叭
                                g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭") + " [" + data.sendName + "]:" + data.msg);
                            return;
                        }
                        // var pd = gamelib.core.getPlayerData(data.sendId);
                        // if(pd == null)
                        //     return;
                        // var str:string = gamelib.chat.ChatPanel.s_instance.onData0x0074(pd,data);
                        // gamelib.chat.ChatBubble.s_instance.showMsg(pd.m_seat_local,str);                    
                        break;
                    // case 0x00C0:
                    //     var lSeat:number = gamelib.core.getPlayerData(data.playerId).m_seat_local;
                    //     gamelib.chat.Face.s_instance.showFace(data.addData2,lSeat);
                    //     break;
                    // case 0x2010:    
                    //     gamelib.common.GiftSystem.s_instance.showGift(data);
                    //     break;
                    case 0x00F0:
                        gamelib.data.BugleData.getData(data);
                        g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭") + " [" + data.sendName + "]:" + data.msg);
                        break;
                    case 0x00F3:
                        if (GameVar.urlParam["isChildGame"]) {
                            GameVar.g_platformData["groupInfo"] = data;
                        }
                        break;
                    case 0x00FF:
                        this.onShowReplay(data);
                        break;
                    case 0x0011:
                        gamelib.data.UserInfo.s_self.m_roomId = data.roomId;
                        break;
                    case 0x0016:
                        var getted = false;
                        var _today = new Date(GameVar.s_loginSeverTime * 1000).getDate();
                        for (var i = 0; i < data.list.length; i++) {
                            if (data.list[i].day == _today) {
                                getted = true;
                                break;
                            }
                        }
                        gamelib.data.UserInfo.s_self.m_bSignIn = !getted;
                        g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA, 0);
                        //gamelib.data.g_signData = data;
                        break;
                    case 0x0018:
                        gamelib.data.UserInfo.s_self.m_roomId = 0;
                        break;
                    case 0x002D:
                        gamelib.data.UserInfo.s_self.openBag(data);
                        g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA);
                        if (!GameVar.urlParam['isChildGame']) {
                            g_loading.closeEnterGameLoading();
                            // g_signal.dispatch('closeEnterGameLoading',0);
                        }
                        break;
                    case 0x002F:
                        if (data.type == 3) {
                            data.type = 0;
                            g_uiMgr.showAlertUiByArgs(data);
                        }
                        else if (data.type == 1) {
                            g_uiMgr.showPMD(data.msg);
                        }
                        else if (data.type == 6) {
                            g_uiMgr.showTip(data.msg);
                        }
                        break;
                    case 0x0036:
                        gamelib.data.UserInfo.s_self.onItemUpte(data);
                        g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA);
                        break;
                    case 0x007F:
                        this.onGet0x007F(data);
                        break;
                    case 0x007B:
                        switch (data.opr) {
                            case 5:
                                GameVar.s_firstBuy = false;
                                g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                                break;
                            case 7:
                                if (GameVar.g_platformData['first_buy'] == true) {
                                    GameVar.s_firstBuy = true;
                                    g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                                }
                                break;
                            case 14:
                                GameVar.s_firstBuyGift = false;
                                g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                                break;
                            case 15:
                                GameVar.s_firstBuyGift = true;
                                g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                                break;
                            case 20:
                                GameVar.s_item_zhou.endTime = data.data1 * 1000;
                                GameVar.s_item_zhou.state = data.data2;
                                g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                                break;
                            case 21:
                                GameVar.s_item_yue.endTime = data.data1 * 1000;
                                GameVar.s_item_yue.state = data.data2;
                                g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                                break;
                            case 9:
                                //var tempUi:gamelib.alert.SystemJiujiUi = <gamelib.alert.SystemJiujiUi>g_uiMgr.showUiByClass(gamelib.alert.SystemJiujiUi);
                                //if(data.data3)
                                //    tempUi.showSysAid(data.data3,data.data2,data.data4)
                                //else
                                //    tempUi.showSysAid(data.data1,data.data2);
                                break;
                        }
                        break;
                    case 0x00B5:
                        g_uiMgr.showTip("游戏已成功保存到桌面, 获得3000铜钱", false);
                        break;
                    case 0x0056:
                        if (gamelib.data.UserInfo.s_self != null)
                            gamelib.data.UserInfo.s_self.m_unreadMailNum = data.num;
                        g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA);
                        break;
                    case 0x0094: //获取语音
                        g_signal.dispatch("get_record", data);
                        break;
                    case 0x2001:
                        GameVar.circleData.info = JSON.parse(data.info);
                        GameVar.circleData.validation = GameVar.circleData.info.join_code;
                        GameVar.circleData.groupId = GameVar.circleData.info.cb_id;
                        GameVar.circleData.fzPid = GameVar.circleData.info.fz_pid;
                        GameVar.circleData.round_current = GameVar.circleData.info.curr_loop;
                        GameVar.circleData.round_max = GameVar.circleData.info.limit_loop;
                        GameVar.circleData.isReplay = false;
                        g_signal.dispatch("initCircleData", data);
                        if (!this._bRequesCircleData) {
                            var info = GameVar.circleData.info.extra_data;
                            g_qpqCommon.requestRule(info);
                            gamelib.platform.autoShare();
                            this._bRequesCircleData = true;
                        }
                        if (GameVar.circleData.info.extra_data.pay_mode == 2) {
                            if (GameVar.circleData.round_current == 0) {
                                //提示aa制扣费
                                var msg = getDesByLan("AA制付费") + " " + GameVar.circleData.info["pay_num"] + GameVar.g_platformData.gold_name;
                                g_uiMgr.showTip(msg, true);
                            }
                        }
                        break;
                    case 0x2700:
                        gamelib.data.MathData.ParseList(data);
                        if (this._enterMatchData != null) {
                            this.reciveNetMsg(0x2708, this._enterMatchData);
                            this._enterMatchData = null;
                        }
                        break;
                    case 0x2708: //进入比赛
                        if (data.result == 1) {
                            // var md:gamelib.data.MathData = gamelib.data.MathData.GetMatchDataById(data.id);
                            // if(md == null)
                            // {
                            //     this._enterMatchData = data;
                            //     sendNetMsg(0x2700,1);
                            //     return;
                            // }
                            // GameVar.g_platformData["groupInfo"] = GameVar.g_platformData["groupInfo"] ||{}
                            // GameVar.g_platformData["groupInfo"].gamePlayJson = JSON.stringify({"playerSum":md['maxPlayerNum']})
                            GameVar.game_args.matchId = data.id;
                        }
                        break;
                    case 0x270C: //观战比赛
                        if (data.result == 2) //跳转
                         {
                            g_childGame.guanZhan(data.gz_id, data.id, data.deskId);
                        }
                        else {
                            switch (data.result) {
                                case 1:
                                    g_uiMgr.showTip(getDesByLan("观战成功,当前观看的牌桌为") + ":" + data.deskId);
                                    break;
                                case 3:
                                    g_uiMgr.showTip(getDesByLan("观战失败,未找到牌桌"));
                                    if (!utils.tools.isQpqHall())
                                        g_childGame.toCircle();
                                    break;
                                case 4:
                                    g_uiMgr.showTip(getDesByLan("观战失败,进入失败"));
                                    if (!utils.tools.isQpqHall())
                                        g_childGame.toCircle();
                                    break;
                                case 5:
                                    g_uiMgr.showTip(getDesByLan("观战失败,比赛未开始"));
                                    if (!utils.tools.isQpqHall())
                                        g_childGame.toCircle();
                                    break;
                                case 6:
                                    g_uiMgr.showTip(getDesByLan("观战失败,没找到指定的比赛"));
                                    if (!utils.tools.isQpqHall())
                                        g_childGame.toCircle();
                                    break;
                                case 0:
                                    if (!utils.tools.isQpqHall())
                                        g_childGame.toCircle();
                                    break;
                            }
                        }
                        break;
                    case 0x2212:
                        var pd = gamelib.core.getPlayerData(data.id);
                        if (pd == null)
                            return;
                        if (pd.m_id == gamelib.data.UserInfo.s_self.m_id) {
                            if (!isNaN(pd.vipLevel)) {
                                if (pd.vipLevel < data.vip_level) {
                                    g_signal.dispatch("vipLevelUp", data.vip_level);
                                }
                            }
                        }
                        pd.m_vipData = data;
                        pd.vipLevel = data.vip_level;
                        break;
                    case 0x2213:
                        var rd = JSON.parse(data.json_str);
                        if (!isNaN(rd.shop_id))
                            GameVar.urlParam["shop_id"] = rd.shop_id;
                        if (rd.wx_service_openid)
                            GameVar.urlParam["wx_service_openid"] = rd.wx_service_openid;
                        if (GameVar.s_pochanData && rd.goods_id && rd.goods_id == GameVar.s_pochanData["goods_id"]) //购买破产礼包成功
                         {
                            sendNetMsg(0x221E, GameVar.s_pochanData["gift_type"]);
                        }
                        if (rd.goods_id == 9999) //至尊宝购买
                         {
                            g_signal.dispatch("zzbBuySuccess", rd.num);
                            return;
                        }
                        if (rd.items == null)
                            return;
                        var arr = [];
                        for (var _i = 0, _a = rd.items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            arr.push({ msId: item.msid, num: item.num });
                        }
                        g_signal.dispatch(gamelib.GameMsg.PLAYGETITEMEFFECT, arr);
                        if (gamelib.data.ShopData.s_shopDb != null && gamelib.data.ShopData.s_shopDb.goods != null) {
                            var arr = gamelib.data.ShopData.s_shopDb.goods;
                            for (var _b = 0, arr_3 = arr; _b < arr_3.length; _b++) {
                                var temp = arr_3[_b];
                                if (temp.goods_id == rd.goods_id) {
                                    var num = temp.purchase_num;
                                    if (isNaN(num))
                                        num = 0;
                                    num += parseInt(rd.num);
                                    temp.purchase_num = num;
                                    break;
                                }
                            }
                        }
                        break;
                    case 0x2215:
                        gamelib.chat.WorldChatData.s_instance.onAnalysisData(data);
                        break;
                    case 0x2216:
                        var obj = JSON.parse(data.json_str);
                        var lvchange = obj['lvUp'];
                        var vipLvchange = obj['vipLvUp'];
                        if (lvchange)
                            g_signal.dispatch("showLevelUpEffect", [1, lvchange]);
                        if (vipLvchange)
                            g_signal.dispatch("showLevelUpEffect", [2, vipLvchange]);
                        break;
                    case 0x221E:
                        GameVar.s_pochanData = JSON.parse(data.json_str);
                        break;
                    case 0x3005:
                        if (data.type == 23) {
                            GameVar.circleData.round_current = data.addData;
                        }
                        break;
                }
            };
            /**
             * [onShowReplay description]
             * @function
             * @DateTime 2018-04-20T15:48:49+0800
             * @param    {any}                    data [description]
             */
            GameDataManager.prototype.onShowReplay = function (data) {
            };
            /**
             * 进入大厅。大厅场景类：game.hall.HallScene
             * @function onEnterHall
             * @author wx
             * @DateTime 2018-03-16T10:49:19+0800
             * @deprecated  目前很多游戏没有大厅了
             * @access protected
             */
            GameDataManager.prototype.onEnterHall = function () {
                gamelib.data.UserInfo.s_self.m_roomId = 0;
                //g_director.runWithSceneName("game.hall.HallScene",true);
            };
            /**
             * 进入牌卓。大厅场景类：game.room.RoomScene
             * @function onEnterRoom
             * @author wx
             * @DateTime 2018-03-16T11:04:14+0800
             * @param    {number}                 roomId 房间号。不能为0
             * @access protected
             */
            GameDataManager.prototype.onEnterRoom = function (roomId) {
                gamelib.data.UserInfo.s_self.m_roomId = roomId;
                //g_director.runWithSceneName("game.room.RoomScene",true);
                //
                g_signal.dispatch(gamelib.GameMsg.GAMERESOURCELOADED, GameVar.urlParam['game_code']);
            };
            GameDataManager.prototype.onGet0x007F = function (data) {
                switch (data.type) {
                    case 11:
                        //if(!utils.tools.isIos() && GameVar.platform == GameVar.pf_QQBrowser)
                        //{
                        //    g_signal.dispatch(gamelib.GameMsg.SENDTODESKMSG,0);
                        //}
                        break;
                    case 12:
                        g_uiMgr.showTip("您获得了" + data.addNum1 + "铜钱,救济卡剩余" + gamelib.data.UserInfo.s_self.m_jjk + "次");
                        break;
                    case 20:
                    case 21:
                        g_uiMgr.showTip('领取成功!!获得' + data.addNum2 + gamelib.data.GoodsData.GetNameByMsId(data.addNum1));
                        break;
                }
            };
            return GameDataManager;
        }());
        core.GameDataManager = GameDataManager;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
///<reference path="../../libs/LayaAir.d.ts"/>
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 所有游戏入口的基类
         * 1、根据初始参数，初始舞台
         * 2、初始化游戏的各个模块
         * 3、载入游戏资源
         *
         * @class GameMain
         * @author wx
         */
        var GameMain = /** @class */ (function () {
            function GameMain() {
                var params = window["child_params"];
                params = params || window["_pf_datas"] || window["urlParam"];
                if (params)
                    this._isChildGame = params['isChildGame'];
                else {
                    this._isChildGame = false;
                    params = {};
                }
                this.initLaya(params);
                this._resource = new gamelib.core.Resources(Laya.Handler.create(this, this.onResloaded), this, Laya.Handler.create(this, this.onProtocolLoaded));
                if (utils.tools.isWxgame()) {
                    gamelib.wxgame.startup(Laya.Handler.create(this, this.onParamsLoaded));
                    g_soundMgr = g_soundMgr || new gamelib.core.SoundManager();
                    window["g_soundMgr"] = g_soundMgr;
                }
                else {
                    this.onParamsLoaded(params);
                }
                // 
            }
            GameMain.prototype.onParamsLoaded = function (params) {
                GameVar.urlParam = params;
                // this._ftp = GameVar.resource_path + "resource/";
                laya.net.URL.basePath = this._resource.ftp = GameVar.resource_path + "resource/";
                // this._resource.ftp = this._ftp;
                this.initGame(GameVar.urlParam);
                this._resource.start(this._isChildGame, this.game_code);
                g_signal.addWithPriority(this.onSignal, this, 1000);
                Laya.stage.on(laya.events.Event.RESIZE, this, this.onResize);
                this.onResize();
            };
            /**
             * 初始化layabox，
             * 设置舞台尺寸，设置资源根目录
             * 设置舞台自适应方式
             *
             * @function initLaya
             * @author wx
             * @DateTime 2018-03-16T11:11:32+0800
             * @access protected
             */
            GameMain.prototype.initLaya = function (param) {
                var game_orientation = param["game_orientation"];
                if (!this._isChildGame || !Laya['_isinit']) {
                    //横屏：landscape    竖屏：portrait
                    var bLandscape = game_orientation == "landscape" || game_orientation == null;
                    if (bLandscape) {
                        this.m_gameWidth = 1280;
                        this.m_gameHeight = 720;
                    }
                    else {
                        this.m_gameWidth = 720;
                        this.m_gameHeight = 1280;
                    }
                    if (window['_isLoad3D'])
                        Laya3D.init(this.m_gameWidth, this.m_gameHeight);
                    else
                        Laya.init(this.m_gameWidth, this.m_gameHeight, Laya.WebGL);
                }
                // Laya["DebugTool"].init();
                UIConfig.closeDialogOnSide = false;
                // Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE;
                Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;
                Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
                // if(GameVar.resource_path.indexOf('192.') != -1 || utils.tools.isRuntime())
                // {
                //     Laya.stage.scaleMode = "showall";
                // }
                // else
                {
                    Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
                }
                if (!this._isChildGame) {
                    if (bLandscape) {
                        // Laya.stage.scaleMode = "full";
                        Laya.stage.screenMode = laya.display.Stage.SCREEN_HORIZONTAL;
                    }
                    else {
                        Laya.stage.screenMode = laya.display.Stage.SCREEN_VERTICAL;
                    }
                    Laya.stage.bgColor = "#232628";
                }
                if (param["isDebug"])
                    Laya.Stat.show();
            };
            /**
             * 初始化游戏模块
             * @function initGame
             * @author wx
             * @DateTime 2018-03-16T11:13:08+0800
             * @param    {any}                    params [description]
             * @access protected
             */
            GameMain.prototype.initGame = function (params) {
                if (window["child_params"] == null && utils.tools.isWx()) {
                    if (window["application_weixin_share_handle"]) {
                        window["application_weixin_share_handle"](gamelib.platform.onWxShareCallBack, this);
                    }
                }
                if (params.game_code.indexOf("_s") >= 0)
                    this.game_code = GameVar.s_namespace = params.game_code.split("_")[0];
                else
                    this.game_code = GameVar.s_namespace = params.game_code;
                this.game_name = params.game_code;
                // if(!this._isChildGame)
                // {
                //     g_game_ver_str_qpq = "?ver=" + GameVar.game_ver;
                // }
                var arr = [];
                this.setPreLoadingResList(arr);
                this._resource.preLoadingResList = arr;
                this._layerManager = new gamelib.core.LayerManager();
                this._topLayer = new laya.display.Sprite();
                Laya.stage.addChild(this._layerManager);
                Laya.stage.addChild(this._topLayer);
                g_layerMgr = this._layerManager;
                g_topLayaer = this._topLayer;
                g_signal = g_signal || new gamelib.core.Signal();
                g_loading = g_loading || new gamelib.loading.LoadingModule();
                g_soundMgr = g_soundMgr || new gamelib.core.SoundManager();
                g_gamesInfo = g_gamesInfo || new gamelib.base.GamesInfo();
                g_uiMgr = g_uiMgr || new gamelib.core.UiMainager();
                g_dialogMgr = g_dialogMgr || new gamelib.core.DialogManager();
                laya.ui.Dialog.manager = g_dialogMgr;
                g_dialogMgr = Laya.Dialog.manager;
                g_loaderMgr = g_loaderMgr || new gamelib.core.MyLoaderManager();
                g_animation = g_animation || new gamelib.control.Animation();
                g_childGame = g_childGame || new gamelib.childGame.ChildGame();
                g_gameMain = g_gameMain || this;
                g_qpqCommon = g_qpqCommon || new gamelib.common.QpqCommonModule();
                g_net_configData = g_net_configData || new gamelib.data.NetConfigDatas();
                if (utils.tools.isWxgame()) {
                    window["g_layerMgr"] = g_layerMgr;
                    window["g_topLayaer"] = g_topLayaer;
                    window["g_signal"] = g_signal;
                    window["g_loading"] = g_loading;
                    window["g_soundMgr"] = g_soundMgr;
                    window["g_uiMgr"] = g_uiMgr;
                    window["g_animation"] = g_animation;
                    window["g_childGame"] = g_childGame;
                    window["g_gameMain"] = g_gameMain;
                    window["g_qpqCommon"] = g_qpqCommon;
                    window["g_net_configData"] = g_net_configData;
                    //获取本地配置
                    window['wx'].getStorage({
                        key: 'config',
                        success: function (res) {
                            g_net_configData.getNetConfog({ config: res.data });
                        }
                    });
                }
                // this._topLayer.zOrder = g_dialogMgr.zOrder + 10;
                this._topLayer.zOrder = Laya.Dialog.manager.zOrder + 10;
                g_loaderMgr.setGameVer();
            };
            /**
             * 解决加载模式下页面嵌套子页面，子页面不显示的bug
             * @function
             * @DateTime 2019-01-09T11:16:26+0800
             * @param    {any}                    obj  [description]
             * @param    {string}                 root [description]
             * @return   {any}                         [description]
             */
            GameMain.prototype.registerClass = function (obj, root, needCacheResList) {
                var str = root;
                needCacheResList = needCacheResList || [];
                var arr = root.split(".");
                var game_code = arr[arr.length - 1];
                for (var key in obj) {
                    Laya.ClassUtils.regClass(root + "." + key, obj[key]);
                    needCacheResList.push(game_code + "/" + key.substring(0, key.length - 2));
                }
                this._resource.setCatcheResourceList(needCacheResList);
                return arr;
            };
            /**
             * 舞台尺寸改变的回掉。用最小缩放比例来缩放_layerManager;
             * 这种能保证不变形，但是在x方向或者y方向的尺寸不准确;在计算
             * 坐标的时候会有偏差
             * @function onResize
             * @author wx
             * @DateTime 2018-03-16T11:15:49+0800
             * @param    {laya.events.Event}      evt [description]
             * @access protected
             */
            GameMain.prototype.onResize = function (evt) {
                var sw = Laya.stage.width;
                var sh = Laya.stage.height;
                var gw = g_gameMain.m_gameWidth;
                var gh = g_gameMain.m_gameHeight;
                var tscaleX = sw / gw;
                var tscaleY = sh / gh;
                var tscale = Math.min(tscaleX, tscaleY);
                g_scaleXY = tscaleX < tscaleY ? "x" : "y";
                g_scaleRatio = tscale;
                this._layerManager.scaleX = tscale;
                this._layerManager.scaleY = tscale;
                this._topLayer.scaleX = tscale;
                this._topLayer.scaleY = tscale;
                laya.ui.Dialog.manager.scaleX = tscale;
                laya.ui.Dialog.manager.scaleY = tscale;
                // var ui:any = this._layerManager.getChildAt(0);
                // if(ui)
                // {
                //     console.log("大厅尺寸:" + ui.width,ui.height);
                // }
                // console.log("Laya.stage 尺寸:" + sw +"  " + sh + "  " + this._layerManager.scaleX);
                console.log("Laya.stage 缩放比例:" + tscale);
            };
            /**
             * 销毁游戏.由childgame调用。不要主动调用次方法
             * @function destroy
             * @author wx
             * @DateTime 2018-03-16T11:18:58+0800
             * @access public
             */
            GameMain.prototype.destroy = function () {
                if (this._gdm) {
                    g_net.removeListener(this._gdm);
                    this._gdm.destroy();
                }
                this._topLayer.removeSelf();
                this._layerManager.removeChildren();
                this._layerManager.removeSelf();
                g_qpqCommon.close();
                this._net.destroy();
                Laya.stage.off(laya.events.Event.RESIZE, this, this.onResize);
                if (Laya.Browser.onIOS) {
                    this._resource.destroyAllRes(this.game_code);
                }
                else {
                    var index = GameMain.s_catchList.indexOf(this.game_code);
                    if (index != -1) {
                        GameMain.s_catchList.splice(index, 1);
                    }
                    GameMain.s_catchList.push(this.game_code);
                    if (GameMain.s_catchList.length > 3) {
                        this._resource.destroyAllRes(GameMain.s_catchList.shift());
                        // Laya.loader.clearResByGroup(GameMain.s_catchList.shift());  
                    }
                }
                g_signal.remove(this.onSignal, this);
                this._resource.destroy();
                gamelib.common.GiftSystem.s_instance.destroy();
                gamelib.chat.WorldChatData.s_instance.clearRoomTakeData();
                g_dialogMgr.maskLayer.removeSelf();
                this._net = null;
                this._gdm = null;
                this._resource = null;
                this._topLayer = null;
                this._layerManager = null;
            };
            Object.defineProperty(GameMain.prototype, "resource", {
                // public get ftp():string
                // {
                //     return this._ftp;
                // }
                get: function () {
                    return this._resource;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 从主游戏进入子游戏，需要关闭主游戏的公共模块，断开主游戏的服务器，
             * 关闭主游戏的ui
             * @function close
             * @author wx
             * @DateTime 2018-03-16T11:59:23+0800
             * @access public
             */
            GameMain.prototype.close = function () {
                // g_qpqCommon.close();
                // this._net.close();
                this._layerManager.removeSelf();
                g_signal.remove(this.onSignal, this);
            };
            /**
             * 从子游戏回到主游戏。
             * 需要删除子游戏相关的数据，重置urlParam，资源目录
             * 重新连接主游戏的服务器
             * @function reshow
             * @author wx
             * @DateTime 2018-03-16T11:59:41+0800
             * @param    {any}                    jsonData [description]
             * @access public
             */
            GameMain.prototype.reshow = function (jsonData) {
                g_signal.addWithPriority(this.onSignal, this, 1000);
                // Laya.stage.scaleMode = "full";
                // this.onResize();
                var temp = window["_pf_datas"] || window["urlParam"];
                delete temp["circle_args"];
                delete temp["game_args"];
                GameVar.urlParam = temp;
                GameVar.circleData = new gamelib.data.CircleData();
                // laya.net.URL.basePath = this._ftp;
                GameVar.s_namespace = GameVar.game_code.split("_")[0];
                g_loaderMgr.setGameVer();
                this._resource.reshow();
                g_net = this._net;
                g_layerMgr = this._layerManager;
                g_topLayaer = this._topLayer;
                this._net.show();
                g_qpqCommon.show();
                Laya.stage.addChild(this._layerManager);
                Laya.stage.addChild(this._topLayer);
                this.playBgm();
                // this._resource.registrerFont();
            };
            /**
             * 载入游戏本身的配置文件，棋牌圈
             * @function loadGamesConfigs
             * @author wx
             * @DateTime 2018-03-16T12:03:05+0800
             * @access public
             */
            GameMain.prototype.loadGamesConfigs = function () {
                this._resource.next();
            };
            /**
             * 设置游戏本身需要载入的文件,
             * @function setPreLoadingResList
             * @author wx
             * @DateTime 2018-03-16T12:03:52+0800
             * @param    {Array<any>}             arr [description]
             * @access protected
             */
            GameMain.prototype.setPreLoadingResList = function (arr) {
            };
            GameMain.prototype.onProtocolLoaded = function () {
            };
            /**
             * 所有资源载入完成后的回掉
             * 需要创建网络模块，连接服务器
             * @function onResloaded
             * @DateTime 2018-03-16T12:04:28+0800
             * @access protected
             */
            GameMain.prototype.onResloaded = function () {
                this.loadLan();
                if (!this._isChildGame) {
                    g_signal.dispatch(gamelib.GameMsg.GAMERESOURCELOADED, this.game_name);
                }
                else {
                    if (g_net) {
                        g_qpqCommon.close();
                        g_gameMain._net.close();
                    }
                }
                this.playBgm();
                if (g_net) {
                    g_net.close();
                }
                this._net = new gamelib.core.GameNet(this.game_code, this._isChildGame);
                this._net.show();
                g_net = this._net;
                g_qpqCommon.show();
                this._net.addListener(g_childGame);
                if (this._gdm) {
                    g_net.addListener(this._gdm);
                }
            };
            GameMain.prototype.playBgm = function () {
                var bgms = GameVar.g_platformData["bgms"];
                if (bgms) {
                    var code = GameVar.game_code.split("_")[0];
                    if (bgms[code]) {
                        g_soundMgr.playBgm(bgms[code]);
                    }
                }
            };
            /**
             * 全局信号处理方法
             * @function onSignal
             * @DateTime 2018-03-16T12:05:43+0800
             * @param    {string}                 msg  [description]
             * @param    {any}                    data [description]
             */
            GameMain.prototype.onSignal = function (msg, data) {
                switch (msg) {
                    case gamelib.GameMsg.GAMERESOURCELOADED:
                        if (this.game_name != data) {
                            this.close();
                        }
                        break;
                    case gamelib.GameMsg.CHANGELAN: //切换语言配置
                        this.loadLan();
                        break;
                }
            };
            GameMain.prototype.loadLan = function () {
                var url = "";
                if (!isMultipleLans()) {
                    url = getCommonResourceUrl("lan.json");
                    s_lanConif = Laya.loader.getRes(url) || {};
                    url = getGameResourceUrl("config/lan.json");
                    var temp_lan = Laya.loader.getRes(url) || {};
                    utils.tools.copyTo(temp_lan, s_lanConif);
                }
                else {
                    var str = gamelib.Api.getLocalStorage("lan");
                    if (str == null) {
                        str = GameVar.g_platformData['multiple_lans'][0];
                        gamelib.Api.saveLocalStorage("lan", str);
                    }
                    url = getCommonResourceUrl("lan_" + str + ".json");
                    s_lanConif = Laya.loader.getRes(url) || {};
                    url = getGameResourceUrl("config/lan_" + str + ".json");
                    var temp_lan = Laya.loader.getRes(url) || {};
                    utils.tools.copyTo(temp_lan, s_lanConif);
                }
            };
            GameMain.s_catchList = [];
            return GameMain;
        }());
        core.GameMain = GameMain;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
window['gamelib'] = gamelib;
/**
 * Created by wxlan on 2016/1/9.
 */
var gamelib;
(function (gamelib) {
    /**
     * @class
     */
    var GameMsg = /** @class */ (function () {
        function GameMsg() {
        }
        /**
         * @property
         * 更新玩家信息
         * @type {string}
         * @static
         */
        GameMsg.UPDATEUSERINFODATA = "update_userinfo_data";
        /**
         * @property
         * 更新平台货币，(qqgame:钻石);
         * @type {string}
         * @static
         */
        GameMsg.UPDATEPLATFORMICON = "update_platformIcon_data";
        /**
         * @property
         * 添加到桌面
         * @type {string}
         * @static
         */
        GameMsg.SENDTODESKMSG = "sendToDesk";
        /**
         * @property
         * 场景切换
         * @type {string}
         * @static
         */
        GameMsg.SCENECHANGE = "scene_change";
        /**
         * @property
         * 开始游戏
         * @type {string}
         * @static
         */
        GameMsg.STARPLAY = "start_play";
        /**
         * @property
         * 结束游戏
         * @type {string}
         * @static
         */
        GameMsg.ENDPLAY = "end_play";
        /**
         * @property
         * 更新首冲按钮
         * @type {string}
         * @static
         */
        GameMsg.UPDATE_ITEMBTN_VISIBLE = "update_itembtn_visible";
        /**
         * @property
         * 游戏所有资源载入完成
         * @type {string}
         * @static
         */
        GameMsg.GAMERESOURCELOADED = "game_resource_loaded";
        /**
         * @property
         * 游戏重连
         * @type {string}
         * @static
         */
        GameMsg.RECONNECT = "game_reconnect";
        /**
         * @property
         * 切换语言版本
         * @type {string}
         * @static
         */
        GameMsg.CHANGELAN = "change_lan";
        /** @type {物品模式数据载入完成} [description] */
        GameMsg.GOODSMSIDDATALOADED = "goods_msId_data_loaded";
        /**
         * 播放获得道具的特效
         */
        GameMsg.PLAYGETITEMEFFECT = "showGetItemEffect";
        /**
         * 刷新平台数据
         */
        GameMsg.REFRESHPLATFORMDATA = "refreshPlatformData";
        return GameMsg;
    }());
    gamelib.GameMsg = GameMsg;
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * @class GameNet
         * @author wx
         * 网络模块
         * 流程入下:
         * 1、gameMain中配置文件加载成功后，设置协议配置文件
         * 2、连接服务器
         * 3、成功后发送0x0003
         * 4、接收到0x0003后发送0x00C2
         * 5、服务器会主动发送0x0010，接收到后更新玩家数据，包括玩家名，玩家头像
         * 6、解析公共协议，包括 ping pong,0x0003,0x0010,0x002D,0x0036,0x0074,0x007A,0x0056,0x00254
         *
         */
        var GameNet = /** @class */ (function () {
            function GameNet(name, isChild) {
                this._currentIp = "";
                this._otherIp = "";
                this._otherGz_id = 0;
                this._mainIp = "";
                this._bC2 = false;
                this._needConnectOther = false;
                //牌桌重连策略，1：刷新，2：重连
                this.m_reconnectPolicy = 2;
                this._ping_grap = 2000;
                this.server_url = "";
                this._name = name;
                this._isChild = isChild;
                this._listeners = [];
                this._reconnect_count = 10;
                this._bReconnecting = false;
                this.m_signal = new gamelib.core.Signal();
            }
            GameNet.prototype.setGameProtocols = function (protocols) {
                if (protocols == null)
                    return;
                this._gameProtocols = protocols;
            };
            GameNet.prototype.createSocket = function () {
                var common;
                var protocols;
                var url;
                if (this._gameProtocols == null) {
                    url = getGameResourceUrl("config/protocols." + g_protocols_type);
                }
                else {
                    url = getGameResourceUrl("config/" + this._gameProtocols + "." + g_protocols_type);
                }
                var url_common = getCommonResourceUrl("protocols_common." + g_protocols_type);
                if (g_protocols_type == 'xml') {
                    protocols = Laya.Utils.parseXMLFromString(Laya.loader.getRes(url)).firstChild;
                    common = Laya.Utils.parseXMLFromString(Laya.loader.getRes(url_common)).firstChild;
                }
                else {
                    protocols = Laya.loader.getRes(url).protocols;
                    common = Laya.loader.getRes(url_common).protocols;
                }
                if (this._socket) {
                    this.close();
                    this._socket.destroy();
                }
                this._socket = new gamelib.socket.NetSocket(protocols, common, g_protocols_type == 'xml');
                this._socket.m_name = this._name;
                this._socket.on(gamelib.socket.NetSocket.SOCKET_CONNECTD, this, this.onConnected);
                this._socket.on(gamelib.socket.NetSocket.SOCKET_CLOSE, this, this.onServerClose);
                this._socket.on(gamelib.socket.NetSocket.SOCKET_GETMSG, this, this.onGetNetMsg);
                this._socket.on(gamelib.socket.NetSocket.SOCKET_SERVER_ERROR, this, this.onServerError);
            };
            GameNet.prototype.destroy = function () {
                this.close();
                Laya.timer.clearAll(this);
                this._socket.destroy();
                this._listeners.length = 0;
                this._listeners = null;
            };
            GameNet.prototype.show = function () {
                if (!GameVar.urlParam['isChildGame'])
                    g_uiMgr.showMiniLoading({ msg: "" });
                this.createSocket();
                this.connectSever(0);
            };
            GameNet.prototype.close = function () {
                this._socket.off(gamelib.socket.NetSocket.SOCKET_CONNECTD, this, this.onConnected);
                this._socket.off(gamelib.socket.NetSocket.SOCKET_CLOSE, this, this.onServerClose);
                this._socket.off(gamelib.socket.NetSocket.SOCKET_GETMSG, this, this.onGetNetMsg);
                this._socket.off(gamelib.socket.NetSocket.SOCKET_SERVER_ERROR, this, this.onServerError);
                this._socket.disconnect();
            };
            GameNet.prototype.reconnect = function () {
                this.close();
                this.createSocket();
                console.log("重新连接服务器:" + this._name + " " + this.server_url);
                this._socket.connectServer(this.server_url);
            };
            GameNet.prototype.addListener = function (target) {
                if (this._listeners.indexOf(target) == -1) {
                    this._listeners.push(target);
                    //从大到小
                    this._listeners.sort(function (a, b) {
                        return b.priority - a.priority;
                    });
                }
            };
            GameNet.prototype.removeListener = function (target) {
                if (this._listeners == null)
                    return;
                var index = this._listeners.indexOf(target);
                if (index != -1)
                    this._listeners.splice(index, 1);
                console.log(this._listeners);
            };
            Object.defineProperty(GameNet.prototype, "socket", {
                get: function () {
                    return this._socket;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameNet.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            GameNet.prototype.onConnected = function (evt) {
                console.timeEnd(this._name + " connectServer");
                g_uiMgr.closeMiniLoading();
                console.log(this._name + " 连接成功了，发送0x0003");
                this._send0x00B6 = false;
                sendNetMsg(0x0003);
                this._lastPingTime = new Date().getTime();
                this.ping();
                Laya.timer.loop(this._ping_grap, this, this.ping, [0x0001, this._lastPingTime]);
                this._bReconnecting = false;
            };
            GameNet.prototype.onServerError = function (evt) {
                console.log("server error!" + this.server_url);
                g_uiMgr.closeMiniLoading();
                if (this._bReconnecting) {
                    g_uiMgr.showAlert_NoClose(this._name + getDesByLan("重连失败!请检测网络状况"));
                }
                else {
                    //TipManager.Alert_noClose("服务器维护中，请稍后在试");
                    g_uiMgr.showAlertUiByArgs({ msg: this._name + getDesByLan("服务器连接失败，点击重新连接"), callBack: function () {
                            this.reconnectByInof();
                            // window.location.reload();
                        }, thisObj: this });
                }
            };
            GameNet.prototype.onServerClose = function (evt) {
                console.log(this._name + " 连接断开");
                g_uiMgr.closeMiniLoading();
                Laya.timer.clear(this, this.ping);
                //1：直接重连，重连次数为0，弹提示框
                //2：弹提示框，点击确认，重新连接
                //3：弹提示框，点击确认，重载页面
                var connect_status = 0;
                if (gamelib.data.UserInfo.s_self == null) {
                    connect_status = 1;
                }
                else {
                    if (gamelib.data.UserInfo.s_self.m_roomId == 0) {
                        connect_status = 2;
                    }
                    else {
                        //当前在牌桌里面，如果是大厅的socket断了，则不处理
                        if (!this._isChild)
                            return;
                        if (GameVar.g_platformData['reconnect'] == 1) {
                            connect_status = 1;
                        }
                        else {
                            if (this.m_reconnectPolicy == 1)
                                connect_status = 3;
                            else
                                connect_status = 2;
                        }
                    }
                }
                switch (connect_status) {
                    case 1: //没连接成功。需要重新连接
                        if (this._reconnect_count > 0) {
                            // this.reconnect();
                            this.reconnectByInof();
                            this._reconnect_count--;
                            this._bC2 = false;
                        }
                        else {
                            var str = getDesByLan("服务器连接失败，点击重新连接");
                            if (GameVar.g_platformData['disconnectInHallTip'] && GameVar.g_platformData['disconnectInHallTip']['noLogin'])
                                str = GameVar.g_platformData['disconnectInHallTip']['noLogin'];
                            g_uiMgr.showAlertUiByArgs({ msg: str, callBack: function () {
                                    window.location.reload();
                                } });
                        }
                        break;
                    case 2: //在大厅中。。。
                        // g_uiMgr.showMiniLoading({msg:"与服务器连接断开,重连中..."});
                        var str = getDesByLan("长时间未操作或网络断开了，点击确定重新连接");
                        if (GameVar.g_platformData['disconnectInHallTip'] && GameVar.g_platformData['disconnectInHallTip']['hall'])
                            str = GameVar.g_platformData['disconnectInHallTip']['hall'];
                        g_uiMgr.showAlertUiByArgs({ msg: str,
                            callBack: function () {
                                this.reconnect();
                                this._bReconnecting = true;
                                this._bC2 = false;
                                g_uiMgr.showMiniLoading();
                            },
                            thisObj: this
                        });
                        // this.reconnect();
                        // this._bReconnecting = true;
                        // this._bC2 = false;
                        break;
                    case 3: //在牌桌中
                        if (!this._isChild)
                            return;
                        var str = getDesByLan("长时间未操作或网络断开了，点击确定重新连接");
                        if (GameVar.g_platformData['disconnectInHallTip'] && GameVar.g_platformData['disconnectInHallTip']['hall'])
                            str = GameVar.g_platformData['disconnectInHallTip']['hall'];
                        g_uiMgr.showAlertUiByArgs({ msg: str, callBack: function () {
                                window.location.reload();
                            } });
                        break;
                }
            };
            GameNet.prototype.ping = function () {
                var temp = new Date().getTime();
                if (GameVar.urlParam['isChildGame'] && GameVar.s_bActivate) {
                    if (temp - this._lastPingTime > this._ping_grap * 2) //进入自动连接游戏
                     {
                        console.log("超过ping时长，重新获取连接信息，并重新连接服务器");
                        //已经掉线了
                        if (!Laya.Browser.onPC)
                            this.reconnectByInof();
                        else
                            this._lastPingTime = temp;
                        return;
                    }
                }
                this._lastPingTime = temp;
                sendNetMsg(0x0001, this._lastPingTime);
            };
            /**
             * 重新连接，需要重新获取分区信息
             * @function
             * @DateTime 2018-05-08T10:28:22+0800
             */
            GameNet.prototype.reconnectByInof = function () {
                g_uiMgr.showMiniLoading({ msg: getDesByLan("资源载入中") + "..." });
                var data = getGame_zone_info(GameVar.gz_id);
                if (data) {
                    var pars = {};
                    pars.result = 0;
                    pars.data = data;
                    this.onGetGame_zone_info(pars);
                }
                else {
                    window["application_game_zone_info"](GameVar.gz_id, this.onGetGame_zone_info.bind(this));
                }
            };
            GameNet.prototype.onGetGame_zone_info = function (ret) {
                var obj = ret.data;
                g_uiMgr.closeMiniLoading();
                if (ret.result != 0) {
                    console.log("目标分区的登陆信息获取失败!");
                    return;
                }
                GameVar.urlParam['wss_host'] = obj['wss_host'];
                GameVar.urlParam['ws_host'] = obj['ws_host'];
                var url = "";
                if (GameVar.wss_host != null && GameVar.wss_host != "")
                    this.server_url = "wss://" + GameVar.wss_host;
                else
                    this.server_url = "ws://" + GameVar.ws_host;
                this.reconnect();
            };
            GameNet.prototype.onLoginServer = function () {
                sendNetMsg(0x0010, 1, GameVar.gameMode, GameVar.session + ":" + 0x20 + ":" + 2, //20html5版本
                GameVar.pid);
            };
            GameNet.prototype.connectOther = function (bc3) {
                if (bc3)
                    sendNetMsg(0x00C3, 2);
                else
                    this.connectSever(2);
            };
            /**
             * @function connectSever
             * 连接服务器
             * @param type 0:按照正常登陆，1:主服务器，2：其他服务器
             *
             */
            GameNet.prototype.connectSever = function (type) {
                console.time(this._name + " connectServer");
                console.time(this._name + " start");
                var ip, port;
                var url = "";
                if (type == 0) {
                    if (GameVar.wss_host != null && GameVar.wss_host != "")
                        url = "wss://" + GameVar.wss_host;
                    else
                        url = "ws://" + GameVar.ws_host;
                }
                else if (type == 1) {
                    ip = this._mainIp.split(":")[0];
                    port = this._mainIp.split(":")[1];
                    GameVar.mainGameGz_id = GameVar.gz_id;
                    url = "ws://" + ip + ":" + port;
                }
                else {
                    ip = this._otherIp.split(":")[0];
                    port = this._otherIp.split(":")[1];
                    this._currentIp = this._otherIp;
                    GameVar.mainGameGz_id = this._otherGz_id;
                    url = "ws://" + ip + ":" + port;
                }
                this._socket.disconnect();
                this._socket.connectServer(url);
                this.server_url = url;
                console.log("connectSever " + this.server_url);
            };
            GameNet.prototype.updatePlayerInfoToServer = function () {
                // sendNetMsg(0x005F, GameVar.platformVipLevel, new md5().hex_md5(GameVar.pid + "" + GameVar.platformVipLevel + "E82494FD36167386332fA1DE11908578"));
                sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
                if (isMultipleLans()) {
                    var lan = gamelib.Api.getLocalStorage("lan");
                    sendNetMsg(0x001D, 2, lan);
                    gamelib.Api.modfiyAttByInterface("/platform/setlanguage", { "language": lan }, null);
                }
            };
            GameNet.prototype.onGetNetMsg = function (data) {
                this.m_signal.dispatch(data.msgId, data.content);
                this.reciveNetMsg(data.msgId, data.content);
                if (this._listeners == null)
                    return;
                var len = this._listeners.length;
                for (var i = 0; i < len; i++) {
                    if (this._listeners == null || this._listeners[i] == null)
                        continue;
                    this._listeners[i].reciveNetMsg(data.msgId, data.content);
                }
            };
            GameNet.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x0002:
                        var temp = Laya.timer.currTimer;
                        GameVar.s_netDelay = temp - data.time;
                        break;
                    case 0x0003:
                        GameVar.s_loginSeverTime = data.ms;
                        GameVar.s_loginClientTime = Laya.timer.currTimer;
                        this._bReconnecting = false;
                        //
                        if (!this._bC2) {
                            sendNetMsg(0x00C2, 0, GameVar.session + ":" + 0x20 + ":" + 1, GameVar.pid);
                            this._bC2 = true;
                        }
                        else {
                            sendNetMsg(0x00C2, 0, GameVar.session + ":" + 0x20 + ":" + 1, GameVar.pid);
                            // sendNetMsg(0x00C4,1,1,GameVar.session + ":" + 0x20 + ":" + 1,GameVar.pid);
                        }
                        break;
                    case 0x00C2:
                        var ip = data.ip;
                        var port = data.port + 1; //+1：wss，+2：ws，port是flash的端口
                        //做测试，先屏蔽
                        if (ip + ":" + port == this._currentIp)
                            return;
                        this._otherIp = ip + ":" + port;
                        this._otherGz_id = data.gz_id;
                        if (gamelib.data.UserInfo.s_self && gamelib.data.UserInfo.s_self.m_roomId != 0) {
                            this._needConnectOther = true;
                        }
                        else {
                            this.connectOther(data.bC3 == 1);
                            this._needConnectOther = false;
                        }
                        break;
                    case 0x00C3:
                        if (data.result == 0)
                            return;
                        this.connectSever(data.actionId);
                        break;
                    case 0x0010:
                        this.onLoginResult(data);
                        break;
                    case 0x00F8:
                        if (data.result == 1) {
                            if (GameVar.validation == undefined) {
                                GameVar.circle_args["validation"] = data.validation;
                            }
                            sendNetMsg(0x00B6);
                            this._send0x00B6 = true;
                            return;
                        }
                        if (data.result == 2) //需要进入其他服务器
                         {
                            return;
                        }
                        var bQuit;
                        var str = "";
                        switch (data.result) {
                            case 0:
                                str = getDesByLan("进入牌桌失败");
                                break;
                            case 3: //
                                str = getDesByLan("无效的验证码");
                                break;
                            case 4: //
                                str = getDesByLan("错误状态");
                                break;
                            case 5:
                                str = getDesByLan("请求进入的牌桌不存在");
                                break;
                            case 6:
                                str = getDesByLan("牌桌人数已满");
                                break;
                            case 7:
                                str = getDesByLan("重复进入");
                                break;
                            case 8:
                                str = getDesByLan("您正在其他游戏中");
                                break;
                            case 9:
                                str = getDesByLan("数据更新失败");
                                break;
                            case 10:
                                str = getDesByLan("牌桌已经开始");
                                break;
                            case 11:
                                str = getDesByLan("您已经被踢出此牌桌,不能加入");
                                break;
                            case 12:
                                str = getDesByLan("游戏已开始!");
                                break;
                            case 13:
                                str = GameVar.g_platformData.gold_name + getDesByLan("不足") + "!";
                                break;
                            case 14:
                                str = getDesByLan("牌桌已经结束"); //请求打开列表
                                break;
                            case 15:
                                str = getDesByLan("密码错误");
                                break;
                            case 16:
                                str = getDesByLan("该位置已被占用");
                                break;
                            case 18:
                                str = getDesByLan("只有好友才能加入");
                                break;
                            default:
                                str = getDesByLan("未知错误") + data.result;
                                break;
                        }
                        if (utils.tools.isQpqHall()) {
                            if (!this._send0x00B6) {
                                this.updatePlayerInfoToServer();
                                sendNetMsg(0x00B6);
                                this._send0x00B6 = true;
                            }
                            g_uiMgr.showAlertUiByArgs({ msg: str });
                            g_uiMgr.closeMiniLoading();
                        }
                        else {
                            g_signal.dispatch("closeEnterGameLoading", 0);
                            g_uiMgr.showAlertUiByArgs({ msg: str, callBack: g_childGame.toCircle, thisObj: g_childGame });
                        }
                        break;
                    case 0x00FD: //玩家组局最后行踪信息
                        if (data.bGameing == 1) {
                            GameVar.circleData.validation = data.validation;
                            GameVar.circle_args["validation"] = data.validation;
                        }
                        this.updatePlayerInfoToServer();
                        sendNetMsg(0x00B6);
                        this._send0x00B6 = true;
                        break;
                }
            };
            GameNet.prototype.onLoginResult = function (data) {
                if (data.status == 1) {
                    this._socket.onLoginSuccess();
                    g_uiMgr.closeMiniLoading();
                    if (GameVar.ip_addr != undefined && GameVar.ip_addr != "") {
                        sendNetMsg(0x0019, GameVar.ip_addr);
                    }
                    console.log("circle_args:" + GameVar.circle_args + " " + GameVar.urlParam["circle_args"]);
                    console.log("validation:" + GameVar.validation);
                    if (GameVar.game_args.roundId && GameVar.game_args.groupId) {
                        //请求录像
                        sendNetMsg(0x00FF, GameVar.game_args.groupId, GameVar.game_args.roundId);
                        return;
                    }
                    else if (!isNaN(GameVar.game_args.roomId)) //请求进入房间
                     {
                        this.updatePlayerInfoToServer();
                        sendNetMsg(0x00B6);
                        this._send0x00B6 = true;
                        // if(GameVar.urlParam["game_code"].indexOf("zjh") != -1)
                        // {
                        // 	sendNetMsg(0x0110,GameVar.game_args.roomId,1);
                        // }
                        // else 
                        // {
                        sendNetMsg(0x0011, GameVar.game_args.roomId);
                        // }
                        return;
                    }
                    else if (!isNaN(GameVar.game_args.matchId)) {
                        this.updatePlayerInfoToServer();
                        sendNetMsg(0x00B6);
                        this._send0x00B6 = true;
                        sendNetMsg(0x2708, GameVar.game_args.matchId);
                    }
                    else if (GameVar.game_args.gzInfo) //观战
                     {
                        this.updatePlayerInfoToServer();
                        sendNetMsg(0x00B6);
                        this._send0x00B6 = true;
                        sendNetMsg(0x270C, GameVar.game_args.gzInfo.matchId, GameVar.game_args.gzInfo.deskId);
                    }
                    else if (GameVar.urlParam["circle_args"] == undefined || GameVar.urlParam["circle_args"] == "") {
                        this.updatePlayerInfoToServer();
                        sendNetMsg(0x00B6);
                        this._send0x00B6 = true;
                        return;
                    }
                    //检测是否需要跳转游戏
                    if (GameVar.validation != "" && GameVar.validation != null && GameVar.validation != undefined) {
                        if (GameVar.g_platformData['showEnterGameTipInUrl'] && !GameVar.urlParam['isChildGame']) {
                            this.updatePlayerInfoToServer();
                            sendNetMsg(0x00B6);
                            this._send0x00B6 = true;
                            if (GameVar.groupId != "" && GameVar.groupId != null && parseInt(GameVar.groupId) > 100000) {
                                g_signal.dispatch("showEnterGameTipUi", [GameVar.validation, GameVar.groupId]);
                                // sendNetMsg(0x00F8,GameVar.validation +","+GameVar.groupId);
                            }
                            else {
                                // sendNetMsg(0x00F8,GameVar.validation);	
                                g_signal.dispatch("showEnterGameTipUi", [GameVar.validation]);
                            }
                        }
                        else {
                            if (GameVar.groupId != "" && GameVar.groupId != null && parseInt(GameVar.groupId) > 100000) {
                                sendNetMsg(0x00F8, GameVar.validation + "," + GameVar.groupId);
                            }
                            else {
                                sendNetMsg(0x00F8, GameVar.validation);
                            }
                        }
                        this.updatePlayerInfoToServer();
                    }
                    else {
                        sendNetMsg(0x00FD);
                    }
                }
            };
            return GameNet;
        }());
        core.GameNet = GameNet;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var base;
    (function (base) {
        var GamesInfo = /** @class */ (function () {
            function GamesInfo() {
                this._versionInfo = {};
            }
            GamesInfo.prototype.setGameVersion = function (game_code, ver) {
                this._versionInfo[game_code] = ver;
            };
            GamesInfo.prototype.getGameVersion = function (game_code) {
                return this._versionInfo[game_code];
            };
            GamesInfo.prototype.getUrlContainVersionInfo = function (url) {
                if (url.indexOf("?ver") >= 0)
                    return url;
                for (var key in this._versionInfo) {
                    if (url.indexOf(key + "/") >= 0) {
                        return url + "?ver=" + this._versionInfo[key];
                    }
                }
                return url + "?ver=" + this._versionInfo['qpq'];
            };
            return GamesInfo;
        }());
        base.GamesInfo = GamesInfo;
    })(base = gamelib.base || (gamelib.base = {}));
})(gamelib || (gamelib = {}));
/**
 * @global
 * loading界面
 * @type {gamelib.loading.LoadingModule}
 */
var g_loading;
/**
 * 全局信号对象
 * @global
 * @type {gamelib.core.Signal}
 */
var g_signal;
/**
 * 网络模块
 * @global
 * @type {gamelib.core.GameNet}
 */
var g_net;
/**
 * ui管理器
 * @global
 * @type {gamelib.core.UiMainager}
 */
var g_uiMgr;
/**
 * 子游戏模块，控制子游戏的进入与退出
 * @type {gamelib.childGame.ChildGame}
 * @global
 */
var g_childGame;
/**
 * 主游戏入口实例
 * @type {gamelib.core.GameMain}
 * @global
 */
var g_gameMain;
/**
 * 棋牌圈公共模块
 * @type {gamelib.common.QpqCommonModule}
 * @global
 */
var g_qpqCommon;
/**
 * 层级管理
 * @type {gamelib.core.LayerManager}
 * @global
 */
var g_layerMgr;
/**
 * 顶层容器
 * @type {laya.display.Sprite}
 * @global
 */
var g_topLayaer;
/**
 * 网络数据配置文件数据
 * @type {gamelib.data.NetConfigDatas}
 * @global
 */
var g_net_configData;
/**
 * 声音管理器
 * @type {gamelib.core.SoundManager}
 * @global
 */
var g_soundMgr;
/**
 * 自定义弹框管理器
 * @type {gamelib.core.DialogManager}
 * @global
 */
var g_dialogMgr; //gamelib.core.DialogManager;
/**
 * 资源载入器
 * @type {gamelib.core.MyLoaderManager}
 * @global
 */
var g_loaderMgr;
/**
 * 动画控制器
 * @type {gamelib.control.Animation}
 * @global
 */
var g_animation;
/**
 * @global
 * 屏幕适配用到的缩放比例
 * 根据屏幕尺寸和游戏设计尺寸，算出最小的缩放比例，就是g_scaleRatio；
 * 然后把g_layerMgr，和dialogManager缩放g_scaleRatio；
 * 最后在具体的ui界面中。x或者y方向扩展剩下的尺寸
 * 如屏幕尺寸为1668 1334。则对应的xScale= 1668 / 1280 = 1.30，yScale= 1334 / 720 = 1.85;
 * g_scaleRatio = min(xScale,yScale) = 1.30;
 * 具体ui.size(1280,Laya.stage.height/g_scaleRatio);
 *
 * @type {number}
 */
var g_scaleRatio = 1; //
/**
 * 缩放是以哪个方向为标准，如果是x则x，y方向的保持缩放比缩放，y方向要拉伸剩余的尺寸
 * @type {string}
 */
var g_scaleXY = "x";
/**
 * 按钮音效
 * @global
 * @type {string}
 * @default "button"
 */
var g_buttonSoundName = "button";
/**
 * 关闭按钮音效
 * @type {string}
 * @global
 * @default "close"
 */
var g_closeUiSoundName = "close";
var g_gamesInfo;
// /**
//  * 当前游戏的资源版本号
//  * @global
//  * @type {string}
//  */
// var g_game_ver_str:string;
// /**
//  * 主游戏的资源版本号
//  * @type {string}
//  */
// var g_game_ver_str_qpq:string;
/**
 * 协议文件类型
 * @type {string}
 */
var g_protocols_type = "xml";
/**
 * 平台数据
 * @type {any}
 * @global
 */
var g_platformData;
/**
 * @function
 * 获取当前游戏对应的样式id
 * @return {number} [description]
 */
function getStyleIndex() {
    return 0;
}
/**
 * @function
 * 获得当前游戏样式的前缀路径
 * @return {string} [description]
 */
function getStylePath() {
    return '';
}
/**
 * 发送协议
 * @function sendNetMsg
 * @DateTime 2018-03-16T12:27:54+0800
 * @param    {number}                 msgId   [description]
 * @param    {type}                 ...args [description]
 */
function sendNetMsg(msgId) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    g_net.socket.sendDataByArgs(msgId, args);
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['sendNetMsg'] = sendNetMsg;
}
/**
 * 播放按钮音效
 * @global
 * @function playButtonSound
 * @DateTime 2018-03-16T12:28:12+0800
 */
function playButtonSound() {
    playSound_qipai(g_buttonSoundName, 1, null, true);
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['playButtonSound'] = playButtonSound;
}
/* 播放关闭音效
* @global
* @function playButtonSound
* @DateTime 2018-03-16T12:28:12+0800
*/
function playCloseSound() {
    playSound_qipai(g_closeUiSoundName, 1, null, true);
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['playCloseSound'] = playCloseSound;
}
/**
 * 获取服务器登录后到当前调用时消耗的时间
 * @function
 * @DateTime 2018-04-23T15:35:53+0800
 * @return   {number}                 [description]
 */
function getTimer() {
    return Laya.timer.currTimer - GameVar.s_loginClientTime;
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['getTimer'] = getTimer;
}
/**
 * 播放游戏音效
 * @global
 * @function playSound_qipai
 * @DateTime 2018-03-16T12:28:35+0800
 * @param    {string}                 name     音效名
 * @param    {number} [loops= 1]     播放次数
 * @param    {laya.utils.Handler}     complete 播放完成的回掉
 */
function playSound_qipai(name, loops, complete, isCommon) {
    if (loops === void 0) { loops = 1; }
    if (isCommon === void 0) { isCommon = false; }
    g_soundMgr.playSound(name, loops, complete, isCommon);
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['playSound_qipai'] = playSound_qipai;
}
/**
 * 停止音效
 * @global
 * @function stopSound_qipai
 * @DateTime 2018-03-16T12:29:47+0800
 * @param    {string}                 name [description]
 */
function stopSound_qipai(name) {
    g_soundMgr.stopSound(name);
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['stopSound_qipai'] = stopSound_qipai;
}
/**
 * @global
 * @function getChildByName
 * 获取容器中的指定名字的节点
 * @param target
 * @param name  "box.box1.txt_id"
 * @returns {any}
 */
function getChildByName(target, name) {
    var arr = name.split(".");
    for (var i = 0; i < arr.length; i++) {
        target = target.getChildByName(arr[i]);
        if (target == null) {
            return null;
        }
    }
    return target;
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['getChildByName'] = getChildByName;
}
var s_lanConif;
function getDesByLan(des) {
    if (s_lanConif == null)
        return des;
    console.log("des:" + des);
    return s_lanConif[des] || des;
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['getDesByLan'] = getDesByLan;
}
function isMultipleLans() {
    var arr = GameVar.g_platformData['multiple_lans'];
    return arr != null;
}
function getGameResourceUrl(res, game_code) {
    game_code = game_code || GameVar.s_namespace;
    return g_gamesInfo.getUrlContainVersionInfo(GameVar.resource_path + "resource/" + game_code + "/" + res);
    // return GameVar.resource_path + "resource/" + game_code +"/"+ res + g_game_ver_str;
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['getGameResourceUrl'] = getGameResourceUrl;
}
function getCommonResourceUrl(res) {
    return g_gamesInfo.getUrlContainVersionInfo(GameVar.common_ftp + res);
    // return GameVar.common_ftp + res + g_game_ver_str_qpq;
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['getCommonResourceUrl'] = getCommonResourceUrl;
}
function getGame_zone_info(game_code) {
    if (typeof game_code == "number") {
        for (var key in window['game_zone_info']) {
            if (window['game_zone_info'][key].gz_id == game_code)
                return window['game_zone_info'][key];
        }
        return null;
    }
    else {
        if (window['game_zone_info'][game_code] == null) {
            console.log(game_code + " 分区信息不存在!");
        }
        return window['game_zone_info'][game_code];
    }
}
if (Laya.Browser.onMiniGame || window["GameGlobal"]) {
    window['getGame_zone_info'] = getGame_zone_info;
}
function navigateToURL(url) {
    if (window['application_open_url']) {
        window['application_open_url'](url);
    }
    else if (window['application_layer_show']) {
        window['application_layer_show'](url);
    }
    else {
        Laya.Browser.window.location.href = url;
    }
}
/**
 * Created by wxlan on 2017/9/2.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 层级管理器
         * @class
         * @extends    laya.display.Sprite
         */
        var LayerManager = /** @class */ (function (_super) {
            __extends(LayerManager, _super);
            function LayerManager() {
                var _this = _super.call(this) || this;
                _this._layers = [];
                return _this;
            }
            /**
             * 获得指定层级的容器
             * @function getContainerByLayer
             * @DateTime 2018-03-16T13:42:45+0800
             * @param    {number}                 layer [description]
             * @return   {laya.display.Sprite}          [description]
             * @deprecated 用对象的zOrder来替代
             */
            LayerManager.prototype.getContainerByLayer = function (layer) {
                if (isNaN(layer))
                    layer = 0;
                var temp;
                for (var i = 0; i < this._layers.length; i++) {
                    if (this._layers[i].zOrder == layer) {
                        temp = this._layers[i];
                        return temp;
                    }
                }
                temp = new laya.display.Sprite();
                this.addChild(temp);
                this._layers.push(temp);
                this._layers[i].zOrder = layer;
                this.updateZOrder();
                //this._layers.sort(function(g1:laya.display.Sprite,g2:laya.display.Sprite):number
                //{
                //    if(g1["layer"] < g2["layer"])
                //        return -1;
                //    return 1;
                //});
                //for(var i:number = 0; i < this._layers.length; i++)
                //{
                //    this.addChildAt(this._layers[i],i);
                //}
                return temp;
            };
            LayerManager.prototype.debug = function () {
                this.graphics.clear();
                this.graphics.drawRect(0, 0, g_gameMain.m_gameWidth, g_gameMain.m_gameHeight, "#FF0000");
            };
            return LayerManager;
        }(laya.display.Sprite));
        core.LayerManager = LayerManager;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 游戏资源载入管理.
         * html模式下，或有版本号。app模式下，没有版本号
         *
         * @class MyLoaderManager
         */
        var MyLoaderManager = /** @class */ (function () {
            function MyLoaderManager() {
                Laya.URL.customFormat = function (url) {
                    return g_gamesInfo.getUrlContainVersionInfo(url);
                    // if(url.indexOf("?ver") == -1)
                    // {
                    // 	return url + g_game_ver_str;
                    // }	
                    // return url;
                };
            }
            /**
             * 设置游戏的版本信息
             * @function setGameVer
             * @DateTime 2018-03-16T13:45:54+0800
             */
            MyLoaderManager.prototype.setGameVer = function () {
                if (GameVar.resource_path.indexOf("localhost") != -1) {
                    //g_game_ver_str = "";
                    g_gamesInfo.setGameVersion(GameVar.s_namespace, "");
                }
                else {
                    g_gamesInfo.setGameVersion(GameVar.s_namespace, GameVar.game_ver);
                    // g_game_ver_str = "?ver=" + GameVar.game_ver;                
                }
                if (g_gamesInfo.getGameVersion("common") == null)
                    g_gamesInfo.setGameVersion("common", new Date().getTime() + "");
            };
            MyLoaderManager.prototype.load3DObjs = function (params) {
                var url = params.url;
                if (params.url instanceof Array) {
                    for (var i = 0; i < params.url.length; i++) {
                        var temp = params.url[i];
                        if (typeof temp == 'string') {
                            if (params.url[i].indexOf("?ver") == -1) {
                                params.url[i] = g_gamesInfo.getUrlContainVersionInfo(params.url[i]);
                                if (params.group) {
                                    Laya.loader.setGroup(params.url[i], params.group);
                                }
                            }
                        }
                        else {
                            if (temp.url.indexOf("?ver") == -1) {
                                // temp.url += g_game_ver_str;
                                temp.url = g_gamesInfo.getUrlContainVersionInfo(temp.url);
                                if (params.group) {
                                    Laya.loader.setGroup(temp.url, params.group);
                                }
                            }
                        }
                    }
                    url = params.url;
                }
                else {
                    if (params.url.indexOf("?ver") == -1) {
                        // url = params.url + g_game_ver_str;
                        url = g_gamesInfo.getUrlContainVersionInfo(params.url);
                    }
                    if (params.group) {
                        Laya.loader.setGroup(url, params.group);
                    }
                }
                Laya.loader.create(url, params.complete, params.progress);
            };
            /**
             * 载入资源 load
             * @function
             * @DateTime 2018-03-16T13:46:37+0800
             * @param    {any}  params 包含以下属性:url:string|Array<any>,type:string,group:string,complete:Laya.Handler
             *                   progress:Laya.Handler
             * @return   {any}                           [description]
             * @access public
             */
            MyLoaderManager.prototype.load = function (params) {
                var url = params.url;
                if (params.url instanceof Array) {
                    for (var i = 0; i < params.url.length; i++) {
                        var temp = params.url[i];
                        if (typeof temp == 'string') {
                            if (params.url[i].indexOf("?ver") == -1) {
                                // params.url[i] += g_game_ver_str;
                                params.url[i] = g_gamesInfo.getUrlContainVersionInfo(params.url[i]);
                                if (params.group) {
                                    Laya.loader.setGroup(params.url[i], params.group);
                                }
                            }
                        }
                        else {
                            if (temp.url.indexOf("?ver") == -1) {
                                // temp.url += g_game_ver_str;
                                temp.url = g_gamesInfo.getUrlContainVersionInfo(temp.url);
                            }
                            if (params.group) {
                                Laya.loader.setGroup(temp.url, params.group);
                            }
                        }
                    }
                    url = params.url;
                }
                else {
                    if (params.url.indexOf("?ver") == -1) { // url = params.url + g_game_ver_str;
                        url = g_gamesInfo.getUrlContainVersionInfo(params.url);
                    }
                    if (params.group) {
                        Laya.loader.setGroup(url, params.group);
                    }
                }
                Laya.loader.load(url, params.complete, params.progress, params.type);
            };
            /**
             * 载入字体文件
             * @function loadFonts
             * @param {Array<any>}   fonts    [description]
             * @param {Laya.Handler} complete [description]
             * @access public
             */
            MyLoaderManager.prototype.loadFonts = function (fonts, complete) {
                var total = fonts.length;
                var current = 0;
                for (var i = 0; i < total; i++) {
                    var url = fonts[i].url;
                    var fontname = url.split(".")[0];
                    var arr = fontname.split("/");
                    fontname = arr[arr.length - 1];
                    var pngname = url.replace('.fnt', '.png');
                    // var txt:any = Laya.loader.getRes(url + g_game_ver_str);
                    // var data:any = Laya.loader.getRes(pngname + g_game_ver_str);
                    var txt = Laya.loader.getRes(url);
                    var data = Laya.loader.getRes(pngname);
                    var bFont = new Laya.BitmapFont();
                    bFont.parseFont(txt, data);
                    Laya.Text.registerBitmapFont(fontname, bFont);
                }
                if (complete)
                    complete.run();
            };
            /**
             * 卸载游戏中的字体
             * @function unregisterFont
             * @DateTime 2018-03-16T13:49:09+0800
             * @param    {Array<any>}             fonts [description]
             * @access public
             */
            MyLoaderManager.prototype.unregisterFont = function (fonts) {
                var total = fonts.length;
                var current = 0;
                for (var i = 0; i < total; i++) {
                    var url = fonts[i].url;
                    var fontname = url.split(".")[0];
                    Laya.Text.unregisterBitmapFont(fontname);
                }
            };
            return MyLoaderManager;
        }());
        core.MyLoaderManager = MyLoaderManager;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/5.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 资源主流程:
         * 1、先载入平台配置文件;
         * 2、载入ui.json文件
         * 3、载入loading资源
         * 4、载入游戏本身的配置文件
         * 5、载入游戏资源、
         * 6、载入公共配置文件
         * 7、资源流程结束
         * @class Resources
         * @author wx
         */
        var Resources = /** @class */ (function () {
            function Resources(complete, gameMain, pro_complete) {
                this._step = 0;
                this._styleIndex = 0;
                this._gameMain = gameMain;
                this._complete = complete;
                this._progress = Laya.Handler.create(this, this.onProgress, null, false);
                this._pro_complete = pro_complete;
            }
            Object.defineProperty(Resources.prototype, "ftp", {
                set: function (str) {
                    this._ftp = str;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Resources.prototype, "preLoadingResList", {
                set: function (value) {
                    this._preLoadingResList = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 解决加载模式下页面嵌套子页面，子页面不显示的bug
             * @function
             * @DateTime 2019-01-09T11:16:26+0800
             * @param    {any}                    neewCacheResList  [description]
             */
            Resources.prototype.setCatcheResourceList = function (needCacheResList) {
                this._needCacheResList = needCacheResList;
            };
            Resources.prototype.start = function (isChildGame, game_code) {
                this.game_code = game_code;
                this._isChildGame = isChildGame;
                this._step = 1;
                this.next();
            };
            /**
             * 从子游戏回到主游戏后，需要重新把主游戏的ui配置设置到laya里面
             * @function reshow
             * @DateTime 2018-03-16T13:50:39+0800
             * @access public
             */
            Resources.prototype.reshow = function () {
                // Laya.ResourceManager.currentResourceManager = this._resManager;
                // var temp = Laya.loader.getRes(this._ftp + "ui.json" + g_game_ver_str)
                // utils.tools.copyTo(temp,laya.ui.View.uiMap);
            };
            /**
             * 注册游戏要用到的字体文件
             * @function
             * @DateTime 2018-03-16T13:56:41+0800
             * @access public
             */
            Resources.prototype.registrerFont = function () {
                if (this._fonts == null)
                    return;
                g_loaderMgr.loadFonts(this._fonts);
            };
            Resources.prototype.destroyAllRes = function (game_code) {
                Laya.loader.clearResByGroup(game_code);
                var temp = Laya.Resource['_idResourcesMap'];
                for (var key in temp) {
                    var resource = temp[key];
                    if (resource.url && resource.url.indexOf("/" + game_code + "/") >= 0) {
                        resource.destroy();
                        delete temp[key];
                    }
                }
            };
            Resources.prototype.destroy = function () {
                for (var key in Laya.View.uiMap) {
                    if (key.indexOf(this.game_code + "/") >= 0)
                        delete Laya.View.uiMap[key];
                }
                this.clearConfigResource();
                if (this._fonts == null)
                    return;
                g_loaderMgr.unregisterFont(this._fonts);
            };
            Resources.prototype.next = function () {
                switch (this._step) {
                    case 1:
                        this.loadUiJson();
                        break;
                    case 2: //进入游戏本身的配置文件。
                        if (utils.tools.isApp()) {
                            this.onLoadingLoaded();
                        }
                        else {
                            this.loadLoadingRes();
                        }
                        break;
                    case 3:
                        this._step++;
                        g_loading.setLoadingTitle("载入游戏配置文件");
                        this._gameMain.loadGamesConfigs();
                        break;
                    case 4: //载入公共配置文件
                        g_loading.setLoadingTitle("载入公共配置文件");
                        this.loadCommonConfigs();
                        break;
                    case 5:
                        g_loading.setLoadingTitle("载入资源配置文件");
                        this.loadResJson();
                        break;
                }
            };
            /**
             * 载入ui.json文件
             * @function loadUiJson
             * @DateTime 2018-03-16T13:53:01+0800
             * @access private
             */
            Resources.prototype.loadUiJson = function () {
                g_loaderMgr.load({
                    url: this._ftp + this.game_code + "/ui.json",
                    type: laya.net.Loader.JSON,
                    group: this.game_code,
                    complete: laya.utils.Handler.create(this, this.onUiConfigLoaded)
                });
            };
            /**
             * ui.json文件载入完成。
             * @function onUiConfigLoaded
             * @DateTime 2018-03-16T13:53:18+0800
             * @param    {any}                    data [description]
             * @access private
             */
            Resources.prototype.onUiConfigLoaded = function (data) {
                if (laya.ui.View.uiMap == null) {
                    laya.ui.View.uiMap = data;
                }
                else {
                    utils.tools.copyTo(data, laya.ui.View.uiMap);
                }
                if (this._needCacheResList) {
                    for (var _i = 0, _a = this._needCacheResList; _i < _a.length; _i++) {
                        var str = _a[_i];
                        Laya.loader.cacheRes(str + ".scene", data[str]);
                    }
                }
                if (this._isChildGame)
                    this._step = 3;
                else
                    this._step = 2;
                this.next();
            };
            /**
             * 载入loading相关文件
             * @function loadLoadingRes
             * @DateTime 2018-03-16T13:53:43+0800
             * @access private
             */
            Resources.prototype.loadLoadingRes = function () {
                var arr = [];
                // arr.push(this._ftp + this.game_code + "/loading/loading.jpg");
                // arr.push(this._ftp + "/atlas/"+this.game_code+"/loading.atlas");
                arr.push(this._ftp + "qpq/loading/loading.jpg");
                arr.push(this._ftp + "atlas/qpq/loading.atlas");
                g_loaderMgr.load({
                    url: arr,
                    group: "qpq",
                    complete: laya.utils.Handler.create(this, this.onLoadingLoaded)
                });
            };
            //
            /**
             * loading载入完成
             * @function onLoadingLoaded
             * @DateTime 2018-03-16T13:57:18+0800
             * @access private
             */
            Resources.prototype.onLoadingLoaded = function () {
                g_loading.showLoadingUi();
                this._step++;
                this.next();
            };
            /**
             * 载入公共配置文件
             * @function loadCommonConfigs
             * @DateTime 2018-03-16T13:57:40+0800
             * @access private;
             */
            Resources.prototype.loadCommonConfigs = function () {
                this.loadPhpInfos();
                g_protocols_type = GameVar.g_platformData['protocols_type'] || "xml";
                gamelib.socket.NetSocket.SOCKET_TYPE = GameVar.g_platformData['socket_type'] || "string";
                var arr1 = [];
                var url = getCommonResourceUrl("protocols_common." + g_protocols_type); //GameVar.game_ver;
                if (g_protocols_type == "xml") {
                    arr1.push({ url: url, type: laya.net.Loader.TEXT });
                }
                else {
                    arr1.push({ url: url, type: laya.net.Loader.JSON });
                }
                var lans = GameVar.g_platformData["multiple_lans"] || [''];
                for (var _i = 0, lans_1 = lans; _i < lans_1.length; _i++) {
                    var lan = lans_1[_i];
                    if (lan == "")
                        url = getCommonResourceUrl("lan.json");
                    else
                        url = getCommonResourceUrl("lan_" + lan + ".json");
                    arr1.push({ url: url, type: laya.net.Loader.JSON });
                }
                g_loaderMgr.load({
                    url: arr1,
                    group: 'common',
                    complete: laya.utils.Handler.create(this, this.onCommonLoaded)
                });
            };
            Resources.prototype.onCommonLoaded = function () {
                if (this._pro_complete) {
                    this._pro_complete.run();
                }
                this._step++;
                this.next();
            };
            /**
             * 载入res.json文件
             * @function loadResJson
             * @DateTime 2018-03-16T13:58:27+0800
             * @access private;
             */
            Resources.prototype.loadResJson = function () {
                g_loaderMgr.load({
                    url: this._ftp + this.game_code + "/res.json",
                    group: this.game_code,
                    complete: laya.utils.Handler.create(this, this.onUnpackLoaded)
                });
            };
            /**
             * res.json文件载入完成.
             * @function onUnpackLoaded
             * @DateTime 2018-03-16T13:58:45+0800
             * @param    {any}                    res [description]
             */
            Resources.prototype.onUnpackLoaded = function (res) {
                var arr = this._preLoadingResList;
                for (var _i = 0, _a = res.atlas; _i < _a.length; _i++) {
                    var item = _a[_i];
                    item.type = laya.net.Loader.ATLAS;
                    arr.push(item);
                }
                this._configResourceList = [];
                for (var _b = 0, _c = res.unpack; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (item.url.indexOf('ui.json') != -1)
                        continue;
                    if (item.url.indexOf(".xml") != -1)
                        item.type = laya.net.Loader.TEXT;
                    else if (item.url.indexOf(".json") != -1)
                        item.type = laya.net.Loader.JSON;
                    arr.push(item);
                    if (item.url.indexOf("config/") != -1) {
                        this._configResourceList.push(item.url);
                    }
                }
                this._fonts = res.fonts;
                for (var _d = 0, _e = res.fonts; _d < _e.length; _d++) {
                    var item = _e[_d];
                    var item1 = {
                        url: item.url,
                        size: item.size,
                        type: laya.net.Loader.XML
                    };
                    arr.push(item1);
                }
                for (var _f = 0, arr_4 = arr; _f < arr_4.length; _f++) {
                    var item = arr_4[_f];
                    if (item.url.indexOf("http") == -1 && item.url.indexOf("file") == -1)
                        item.url = this._ftp + item.url;
                }
                g_loading.setLoadingTitle("载入游戏资源");
                //如果有3d的场景，需要先加载3d场景
                var d3ds = res.d3d;
                if (d3ds && d3ds.length > 0) {
                    g_loaderMgr.load3DObjs({
                        url: d3ds,
                        group: this.game_code,
                        complete: laya.utils.Handler.create(this, this.loadeResources, [arr]),
                        progress: this._progress
                    });
                }
                else {
                    this.loadeResources(arr);
                    // g_loaderMgr.load({
                    //    url:arr,
                    //    group:this.game_code,
                    //    complete:laya.utils.Handler.create(this,this.loadFont),
                    //    progress:this._progress
                    //   });
                }
            };
            Resources.prototype.loadeResources = function (arr) {
                g_loaderMgr.load({
                    url: arr,
                    group: this.game_code,
                    complete: laya.utils.Handler.create(this, this.loadFont),
                    progress: this._progress
                });
            };
            Resources.prototype.clearConfigResource = function () {
                for (var _i = 0, _a = this._configResourceList; _i < _a.length; _i++) {
                    var url = _a[_i];
                    Laya.loader.clearRes(url);
                }
            };
            /**
             * 载入字体
             * @function
             * @DateTime 2018-03-16T13:59:19+0800
             */
            Resources.prototype.loadFont = function () {
                g_loaderMgr.loadFonts(this._fonts, this._complete);
            };
            /**
             * 载入shop.php文件
             * @function loadPhpInfos
             * @DateTime 2018-03-16T13:59:30+0800
             */
            Resources.prototype.loadPhpInfos = function () {
                if (GameVar.urlParam['isChildGame'])
                    return;
                //载入shop
                if (GameVar.g_platformData['shop_version'] == 2) {
                    gamelib.Api.getShopData(Laya.Handler.create(this, this.onShopLoaded));
                }
                else {
                    // var postdata:any =
                    // {
                    //     platform:GameVar.platform,
                    //     app_verify:GameVar.s_app_verify ? 1 : 0
                    // }
                    // utils.tools.http_request(GameVar.common_ftp + "shop.php",postdata,"get",function(json:any)
                    // {
                    //     gamelib.data.ShopData.PaseDatas(json);            
                    // });
                }
            };
            Resources.prototype.onShopLoaded = function (data) {
                console.log(data);
                if (data.ret != 1) {
                    console.log("获取商城数据失败" + data.clientMsg);
                    return;
                }
                gamelib.data.ShopData.PaseDatas(data.data);
            };
            /**
             * 游戏资源加载进度
             * @function onProgress
             * @DateTime 2018-03-16T13:59:48+0800
             * @param    {number}                 progress [description]
             */
            Resources.prototype.onProgress = function (progress) {
                g_loading.updateResLoadingProgress(progress);
                // console.log("。。。" +Math.floor(progress * 100));
            };
            Resources.prototype.getVerStr = function () {
                return "?ver=" + GameVar.game_ver;
            };
            return Resources;
        }());
        core.Resources = Resources;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/4.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        var Scene = /** @class */ (function (_super) {
            __extends(Scene, _super);
            function Scene() {
                var _this = _super.call(this) || this;
                _this._containerList = [];
                return _this;
            }
            Scene.prototype.onEnter = function () {
                g_signal.dispatch(gamelib.GameMsg.SCENECHANGE, 0);
            };
            Scene.prototype.onExit = function () {
            };
            Scene.prototype.destroy = function () {
                while (this.numChildren) {
                    var obj = this.removeChildAt(0);
                    if (utils.tools.is(obj, "gamelib.core.IDestroy")) {
                        var temp = obj;
                        temp.destroy();
                    }
                }
            };
            return Scene;
        }(laya.display.Sprite));
        core.Scene = Scene;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         *
         *
         * 信号，用于不同对象间的通信。
         * m_signal.add(functionA,caller);
         * m_signal.dispatch(eventname,eventdata);
         * @class
         * @author wx
         *
         */
        var Signal = /** @class */ (function () {
            function Signal() {
                this._listenerList = [];
                this._index = 0;
            }
            /**
             * 添加监听
             * @function add
             * @param {function} listener
             * @param {any} caller
             */
            Signal.prototype.add = function (listener, caller) {
                if (this.hasListener(listener, caller))
                    return;
                var obj = {};
                obj["listener"] = listener;
                obj["caller"] = caller;
                obj["priority"] = 0; // this._index++;
                this._listenerList.push(obj);
                this._listenerList = this._listenerList.sort(function (a, b) {
                    if (a.priority <= b.priority)
                        return 1;
                    return -1;
                });
            };
            /**
             * 是否已经有监听了
             * @function add
             * @param {function} listener
             * @param {any} caller
             * @returns {boolean}
             */
            Signal.prototype.hasListener = function (listener, caller) {
                for (var i = 0; i < this._listenerList.length; i++) {
                    var obj = this._listenerList[i];
                    if (obj.caller == caller && obj.listener == listener)
                        return true;
                }
                return false;
            };
            /**
             * 移除监听
             * @function remove
             * @param {function} listener
             */
            Signal.prototype.remove = function (listener, caller) {
                for (var i = 0; i < this._listenerList.length; i++) {
                    var obj = this._listenerList[i];
                    if (caller == null) {
                        if (obj.listener == listener) {
                            this._listenerList.splice(i, 1);
                            break;
                        }
                    }
                    else {
                        if (obj.caller == caller && obj.listener == listener) {
                            this._listenerList.splice(i, 1);
                            break;
                        }
                    }
                }
                this._listenerList = this._listenerList.sort(function (a, b) {
                    if (a.priority < b.priority)
                        return 1;
                    return -1;
                });
            };
            /**
             * 指定优先级来添加监听
             * @function addWithPriority
             * @param {function} listener
             * @param {any} caller
             * @param {number} priority值越大，越先调用
             */
            Signal.prototype.addWithPriority = function (listener, caller, priority) {
                var obj = {};
                obj["listener"] = listener;
                obj["caller"] = caller;
                obj["priority"] = priority; // + this._index++;
                this._listenerList.push(obj);
            };
            /**
             * 发送事件
             * @function dispatch
             * @param args
             */
            Signal.prototype.dispatch = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var i = 0; i < this._listenerList.length; i++) {
                    var obj = this._listenerList[i];
                    obj.listener.apply(obj.caller, arguments);
                }
            };
            return Signal;
        }());
        core.Signal = Signal;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/11.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * @class
         * 声音管理器
         */
        var SoundManager = /** @class */ (function () {
            function SoundManager() {
                this._waitConfig = true;
                this._type = "";
                this._type = '.mp3';
                if (utils.tools.isAndroid() || utils.tools.isRuntime()) {
                    this._type = '.ogg';
                }
                laya.media.SoundManager.autoStopMusic = true;
            }
            Object.defineProperty(SoundManager.prototype, "m_sound", {
                get: function () {
                    return this._bSound;
                },
                /**
                 * 是否开启音效
                 * @DateTime 2018-03-16T14:09:26+0800
                 * @type    {boolean}
                 */
                set: function (value) {
                    this._bSound = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SoundManager.prototype, "m_music", {
                get: function () {
                    return this._bMusic;
                },
                /**
                 * 是否开启背景音乐
                 * @DateTime 2018-03-16T14:10:12+0800
                 * @type    {boolean}
                 */
                set: function (value) {
                    this._bMusic = value;
                    if (value) {
                        if (laya.media.SoundManager.musicMuted)
                            laya.media.SoundManager.musicMuted = false;
                        if (!this._waitConfig) {
                            if (this._bgmSoundChannel)
                                this._bgmSoundChannel.resume();
                            else if (this._bgmList)
                                this.playBgm(this._bgmList);
                        }
                    }
                    else {
                        if (!laya.media.SoundManager.musicMuted)
                            laya.media.SoundManager.musicMuted = true;
                        laya.media.SoundManager.musicVolume = 0.6;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 背景音乐音量小 在录音的时候会用
             * @function
             * @DateTime 2018-03-16T14:10:33+0800
             */
            SoundManager.prototype.volume_normal = function () {
                laya.media.SoundManager.setMusicVolume(0.8);
                // laya.media.SoundManager.musicVolume = 0.8;
            };
            /**
             * 背景音乐音量恢复正常
             * @function
             * @DateTime 2018-03-16T14:11:22+0800
             */
            SoundManager.prototype.volume_small = function () {
                laya.media.SoundManager.setMusicVolume(0);
                // laya.media.SoundManager.musicVolume = 0;
            };
            /**
             * 播放声音
             * @function
             * @DateTime 2018-03-16T14:11:59+0800
             * @param    {string}  name     声音文件名。如button
             * @param    {number}  loops    播放次数，默认播1次，0为循环播放
             * @param    {laya.utils.Handler}     complete 播放完成后的回掉
             */
            SoundManager.prototype.playSound = function (name, loops, complete, isCommon) {
                if (loops === void 0) { loops = 1; }
                if (isCommon === void 0) { isCommon = false; }
                if (!this._bSound)
                    return;
                var url = GameVar.resource_path + "resource";
                if (isCommon) {
                    url += "/qpq/sound/";
                }
                else {
                    url += "/" + GameVar.s_namespace + "/sound/";
                }
                // url += name + this._type + g_game_ver_str;            
                url = g_gamesInfo.getUrlContainVersionInfo(url + name + this._type);
                laya.media.SoundManager.playSound(url, loops, complete);
            };
            /**
             * 停止播放
             * @function
             * @DateTime 2018-03-16T14:13:41+0800
             * @param    {string}                 name [description]
             */
            SoundManager.prototype.stopSound = function (name, isCommon) {
                if (isCommon === void 0) { isCommon = false; }
                var url = GameVar.resource_path + "resource";
                if (isCommon) {
                    url += "/qpq/sound/";
                }
                else {
                    url += "/" + GameVar.s_namespace + "/sound/";
                }
                // url += name + this._type + g_game_ver_str;   
                url = g_gamesInfo.getUrlContainVersionInfo(url + name + this._type);
                laya.media.SoundManager.stopSound(url);
            };
            Object.defineProperty(SoundManager.prototype, "m_waitConfig", {
                /**
                 * 当前是否在等待配置文件
                 * @DateTime 2018-03-16T14:14:09+0800
                 * @type {boolean}
                 */
                get: function () {
                    return this._waitConfig;
                },
                set: function (value) {
                    // if(this._waitConfig && !value)
                    // {
                    //     this._waitConfig = value;
                    //     if(this._bgmList != null)
                    //     {
                    //         this.playBgm(this._bgmList);
                    //     }
                    // }
                    this._waitConfig = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 播放背景音乐
             * @function
             * @param {any} index 如果为number，播放指定的序号。如果为array,则循环播放列表中的
             */
            SoundManager.prototype.playBgm = function (name) {
                if (this.m_waitConfig) {
                    this._bgmList = name;
                    return;
                }
                this._bgmList = name;
                if (name == "") {
                    laya.media.SoundManager.stopMusic();
                    return;
                }
                this.m_lastBgmPlayTime = Laya.timer.currTimer;
                if (this._bgmSoundChannel)
                    this._bgmSoundChannel.completeHandler = null;
                this._bgmSoundChannel = laya.media.SoundManager.playMusic(this.getBgmUrl(0), 1, Laya.Handler.create(this, this.onBgmPlayEnd, [0]));
                //  return;
                // if(typeof name === 'string')
                // {
                //     laya.media.SoundManager.playMusic(this.getBgmUrl(0),0);
                // }            
                // else
                // {
                //     laya.media.SoundManager.playMusic(this.getBgmUrl(0),1,Laya.Handler.create(this,this.onBgmPlayEnd,[0]));
                // }
            };
            /**
             * 暂停背景音乐
             * @function
             * @DateTime 2018-03-16T14:15:35+0800
             * @deprecated 使用laya.media.SoundManager.autoStopMusic 来代替了
             */
            SoundManager.prototype.pauseAll = function () {
                if (this.m_music)
                    laya.media.SoundManager.musicMuted = true;
            };
            /**
             * 恢复背景音乐
             * @function
             * @DateTime 2018-03-16T14:15:55+0800
             * @deprecated 使用laya.media.SoundManager.autoStopMusic 来代替了
             */
            SoundManager.prototype.resumesAll = function () {
                if (this.m_music)
                    laya.media.SoundManager.musicMuted = false;
            };
            /**
             * 背景音乐播放完成
             * @function
             * @DateTime 2018-03-16T14:19:04+0800
             * @param    {number}                 index [description]
             */
            SoundManager.prototype.onBgmPlayEnd = function (index) {
                console.log("播放背景音乐");
                index++;
                if (this._bgmSoundChannel)
                    this._bgmSoundChannel.completeHandler = null;
                this._bgmSoundChannel = laya.media.SoundManager.playMusic(this.getBgmUrl(index), 1, Laya.Handler.create(this, this.onBgmPlayEnd, [index]));
                this.m_lastBgmPlayTime = Laya.timer.currTimer;
            };
            /**
             * 获得背景音乐的资源地址
             * @function
             * @DateTime 2018-03-16T14:19:16+0800
             * @param    {number}                 index [description]
             * @return   {string}                       [description]
             */
            SoundManager.prototype.getBgmUrl = function (index) {
                if (typeof this._bgmList === "string") {
                    return GameVar.resource_path + "resource/" + GameVar.s_namespace + "/sound/" + this._bgmList + this._type;
                }
                if (index < 0 || index >= this._bgmList.length)
                    index = 0;
                return GameVar.resource_path + "resource/" + GameVar.s_namespace + "/sound/" + this._bgmList[index] + this._type;
            };
            return SoundManager;
        }());
        core.SoundManager = SoundManager;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/8/29.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
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
                //this._setUi = new gamelib.control.SetUi();  //需要开始就初始化。进入子游戏可能要显示
                g_signal.add(this.onSignal, this);
            }
            Object.defineProperty(UiMainager.prototype, "showUi", {
                set: function (value) {
                    this._shopUi = value;
                },
                enumerable: true,
                configurable: true
            });
            UiMainager.prototype.showMaskLoading = function () {
                return g_loading.showMaskLoading();
            };
            UiMainager.prototype.closeMaskLoading = function () {
                g_loading.closeMaskLoading();
            };
            UiMainager.prototype.onDialogOpen = function (evt) {
                console.log(laya.ui.Dialog.manager);
                g_signal.dispatch("onDailogOpen");
            };
            UiMainager.prototype.onDialogClose = function (evt) {
                console.log("有界面关闭了" + this.m_temp_ui);
                g_signal.dispatch("onDailogClose", 0);
            };
            UiMainager.prototype.onSignal = function (msg, data) {
                switch (msg) {
                    case "showSetUi":
                        this._setUi = this._setUi || new gamelib.control.SetUi();
                        this._setUi.show();
                        break;
                    case "showShopUi":
                        this.openShop();
                        break;
                    case "showHelpUi":
                        this.showHelpUi(data);
                        break;
                    case "showChatUi":
                        this._chat = gamelib.chat.ChatPanel.s_instance;
                        this._chat.show();
                        break;
                    case "showBugleUi":
                        var temp = new gamelib.common.BugleUi();
                        temp.show();
                        break;
                    // case GameMsg.GAMERESOURCELOADED:
                    //     if(!GameVar.urlParam["isChildGame"])
                    //     {
                    //         this._setUi = this._setUi || new gamelib.control.SetUi();
                    //         if(this._alertList.length == 0)
                    //         {
                    //             this._alertList.push( new gamelib.alert.AlertUi(),new gamelib.alert.AlertUi(),new gamelib.alert.AlertUi());
                    //         }
                    //         platform.g_wxShareUi = new gamelib.control.ShareTip_wxUi();
                    //         for(var i:number = 0; i < 8 ;i++)
                    //         {
                    //             this.getEffectTip(true,true);
                    //             this.getEffectTip(false,true);
                    //         }
                    //     }
                    //     break;
                }
            };
            /**
             * 打开帮助ui
             * @function showHelpUi
             * @DateTime 2018-03-16T14:25:07+0800
             * @param    {number}  index [要显示的帮助文件在平台配置中的序号]
             */
            UiMainager.prototype.showHelpUi = function (index) {
                console.log("showHelpUi" + index);
                if (window['application_layer_show'] == null) {
                    return;
                }
                var url = GameVar.common_ftp;
                var temp = GameVar.g_platformData["help_file_name"];
                if (typeof index == "number") {
                    index = isNaN(index) ? 0 : index;
                    if (temp instanceof Array) {
                        url += temp[index];
                    }
                    else {
                        url += temp;
                    }
                }
                else if (typeof index == "string") {
                    var type = index.split("_")[0];
                    url += temp[type];
                }
                else {
                    url += temp;
                }
                window['application_layer_show'](url);
            };
            /**
             * 打开设置界面
             * @function openSetUi
             * @DateTime 2018-03-16T14:28:26+0800
             */
            UiMainager.prototype.openSetUi = function () {
                this._setUi = this._setUi || new gamelib.control.SetUi();
                this._setUi.show();
            };
            /**
            * 打开商城
            *  @type:0:钻石，1金币，2vip
            */
            UiMainager.prototype.openShop = function (type) {
                if (type === void 0) { type = 0; }
                console.log("打开商城!");
                if (this._shopUi == null) {
                    this._shopUi = new gamelib.common.ShopUi();
                }
                this._shopUi["m_openType"] = type;
                this._shopUi.show();
            };
            /**
             * 打开邮件
             * @function openMail
             * @DateTime 2018-03-16T14:29:11+0800
             */
            UiMainager.prototype.openMail = function () {
                console.log("打开邮件!");
                if (GameVar.g_platformData['mail_type'] == 2) {
                    this._mailUi = this._mailUi || new gamelib.common.MailUi2();
                }
                else {
                    this._mailUi = this._mailUi || new gamelib.common.MailUi();
                }
                this._mailUi.show();
            };
            /**
             * 关闭小loading
             * @function closeMiniLoading
             * @DateTime 2018-03-16T14:29:22+0800
             */
            UiMainager.prototype.closeMiniLoading = function () {
                g_loading.closeMiniLoading();
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
                g_loading.showMiniLoading(args);
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
                args.okLabel || (args.okLabel = getDesByLan("确定"));
                args.cancelLabel || (args.cancelLabel = getDesByLan("取消"));
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
                g_topLayaer.addChild(txt);
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
             * 购买道具提示框
             * @function buyItemAlert
             * @param buyIndex
             * @param msg
             */
            UiMainager.prototype.buyItemAlert = function (buyIndex, msg) {
                if (msg === void 0) { msg = "你的铜钱太少了,充点小钱补补吧!"; }
                var temp = new gamelib.alert.AlertBuyGoods();
                temp.setMsg(buyIndex, msg);
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
        core.UiMainager = UiMainager;
        var TipEffect = /** @class */ (function () {
            function TipEffect() {
                this._bg = new Laya.Image();
                this._bg.skin = "qpq/comp/tips_bg_1.png";
                this._bg.sizeGrid = "16,50,16,50";
                this._bg.sizeGrid = "24,255,25,256";
                this._label = new laya.ui.Label();
                this._label.fontSize = 24;
                // if(isWarning)
                // {
                //     txt.color = "#ff2323";    
                // }
                // else
                // {
                //     txt.color = "#09ff88";
                // }            
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
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/9/20.
 */
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        /**
         * 可以接收网络数据的协议
         * @class Ui_NetHandle
         * @extends  gamelib.core.BaseUi
         * @implements INet
         */
        var Ui_NetHandle = /** @class */ (function (_super) {
            __extends(Ui_NetHandle, _super);
            function Ui_NetHandle(resname) {
                return _super.call(this, resname) || this;
            }
            Ui_NetHandle.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };
            /**
             * 接收到网络消息的处理
             * @function reciveNetMsg
             * @author wx
             * @access public
             * @DateTime 2018-03-15T20:59:01+0800
             * @param    {number}                 msgId 协议号，例如0x0001
             * @param    {any}                    data  [description]
             */
            Ui_NetHandle.prototype.reciveNetMsg = function (msgId, data) {
            };
            /**
             * 界面显示后会自动调用.不要主动都调用。同时会注册网络监听
             * @function onShow
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:15:32+0800
             */
            Ui_NetHandle.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_net.addListener(this);
            };
            /**
             * 界面关闭会自动调用。不要主动都调用 同时会移除网络监听
             * @function onClose
             * @author wx
             * @access protected
             * @DateTime 2018-03-16T10:16:12+0800
             */
            Ui_NetHandle.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                g_net.removeListener(this);
            };
            return Ui_NetHandle;
        }(core.BaseUi));
        core.Ui_NetHandle = Ui_NetHandle;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        var Bubble = /** @class */ (function () {
            function Bubble(res) {
                this._bg = res['img_bg'];
                if (this._bg == null)
                    this._bg = res.getChildAt(0);
                var txt = res['txt_txt'];
                this._color = txt.color;
                txt.removeSelf();
                if (!isNaN(txt.left)) {
                    this._align = 'left';
                    this._boder = txt.left;
                }
                else if (!isNaN(txt.right)) {
                    this._align = 'right';
                    this._boder = txt.right;
                }
                this._spr = new Laya.Sprite();
                res.addChild(this._spr);
                this._oldY = res.y;
                this._res = res;
                this._res.visible = false;
            }
            Bubble.prototype.destroy = function () {
                if (this._timeLine) {
                    this._timeLine.destroy();
                }
                this._timeLine = null;
            };
            Bubble.prototype.setMsg = function (netData) {
                var msg = netData.msg;
                if (netData.type == 4) {
                    var index = parseInt(msg);
                    var obj = gamelib.chat.ChatPanel.s_instance.getQuickTalkByIndex(index);
                    if (typeof obj == "object") {
                        msg = obj.msg;
                    }
                    else {
                        msg = obj;
                    }
                }
                this.clearSpr();
                this._res.y = this._oldY;
                var arr = chat.parseMsg(msg);
                var ox = 0;
                var size = 24;
                for (var i = 0; i < arr.length; i++) {
                    var m = arr[i];
                    if (typeof m == "string") {
                        var label = new Laya.Text();
                        label.font = "Arial";
                        label.fontSize = size;
                        label.text = m;
                        label.wordWrap = false;
                        label.mouseEnabled = false;
                        label.color = this._color;
                        label.x = ox;
                        ox += label.width;
                        this._spr.addChild(label);
                    }
                    else if (typeof m == "number") {
                        var face = this.getFaceRes(m + 1);
                        if (face == null)
                            continue;
                        face.x = ox;
                        face.y = (size - face.height) / 2;
                        if (face.ani1)
                            face.ani1.play(0, false);
                        ox += face.width;
                        this._spr.addChild(face);
                    }
                }
                this._res.width = ox + 2 * this._boder;
                this._spr.width = ox;
                this._spr.height = size;
                // if(this._align == "left")
                // 	this._spr.x = this._boder;
                // else
                // 	this._spr.x = this._bg.width - this._spr.width - this._boder;
                // 	
                this._spr.x = this._boder;
                this._spr.y = (this._bg.height - this._spr.height) / 2;
                var timeLine = new Laya.TimeLine();
                timeLine.addLabel("show", 0).to(this._res, { y: this._oldY, alpha: 1 }, 400, null, 0);
                timeLine.addLabel("close", 0).to(this._res, { y: this._oldY - 100, alpha: 0 }, 400, null, 3000);
                timeLine.play(0, false);
                timeLine.once(laya.events.Event.COMPLETE, this, this.onShowEnd, [timeLine]);
                this._res.visible = true;
                this._timeLine = timeLine;
            };
            Bubble.prototype.getFaceRes = function (id) {
                var url = "qpq/face/Art_face_" + (id + 1);
                var face = utils.tools.createSceneByViewObj(url);
                face.zOrder = 10;
                return face;
            };
            Bubble.prototype.onShowEnd = function (timeLine) {
                timeLine.destroy();
                this._res.y = this._oldY;
                this._res.visible = false;
                this._timeLine = null;
            };
            Bubble.prototype.clearSpr = function () {
                while (this._spr.numChildren) {
                    var temp = this._spr.removeChildAt(0);
                    if (temp.ani1) {
                        temp.ani1.stop();
                    }
                }
            };
            return Bubble;
        }());
        chat.Bubble = Bubble;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/1/14.
 */
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        /**
         * 聊天泡泡.需要把所有玩家的泡泡资源传过来
         * @class ChatBubble
         */
        var ChatBubble = /** @class */ (function () {
            function ChatBubble() {
            }
            Object.defineProperty(ChatBubble, "s_instance", {
                /**
                 * @static
                 * @property s_instance
                 */
                get: function () {
                    if (ChatBubble._instance == null)
                        ChatBubble._instance = new gamelib.chat.ChatBubble();
                    return ChatBubble._instance;
                },
                enumerable: true,
                configurable: true
            });
            ChatBubble.prototype.init = function (arr) {
                this._list = arr;
                Laya.timer.once(100, this, function () {
                    arr.forEach(function (ui, index, list) {
                        ui.visible = false;
                        ui.mouseEnabled = false;
                        ui["__oldY"] = ui.y;
                        ui["__oldX"] = ui.x;
                    });
                });
                this._enabled = true;
            };
            Object.defineProperty(ChatBubble.prototype, "enabled", {
                set: function (value) {
                    this._enabled = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 显示消息，用指定的资源
             * @function
             * @DateTime 2018-03-17T13:48:32+0800
             * @param    {any}                    res [description]
             * @param    {string}                 msg [description]
             */
            ChatBubble.prototype.showMsgByRes = function (res, msg) {
                if (res == null || !this._enabled)
                    return;
                var txt = res.getChildAt(1);
                txt.text = msg;
                var oldY = res["__oldY"];
                res.y = oldY + 100;
                res.alpha = 0.1;
                res.visible = true;
                var bg = res.getChildAt(0);
                if (txt.left) {
                    res.width = txt.width + txt.left * 2;
                }
                else {
                    res.width = txt.width + txt.right * 2;
                    if (res.anchorX != 1)
                        res.x = res["__oldX"] - res.width;
                }
                res.height = 60;
                var timeLine = new Laya.TimeLine();
                timeLine.addLabel("show", 0).to(res, { y: oldY, alpha: 1 }, 400, null, 0);
                timeLine.addLabel("close", 0).to(res, { y: oldY - 100, alpha: 0 }, 400, null, 3000);
                timeLine.play(0, false);
                timeLine.once(laya.events.Event.COMPLETE, this, this.onShowEnd, [res, timeLine]);
            };
            /**
             * 显示消息，通过传如的位置号
             * @function
             * @DateTime 2018-03-17T13:48:56+0800
             * @param    {number}                 localSeat [description]
             * @param    {string}                 msg       [description]
             */
            ChatBubble.prototype.showMsg = function (localSeat, msg) {
                if (localSeat == -1 || !this._enabled)
                    return;
                var res = this._list[localSeat];
                this.showMsgByRes(res, msg);
            };
            ChatBubble.prototype.onShowEnd = function (res, timeLine) {
                res.visible = false;
                timeLine.destroy();
            };
            return ChatBubble;
        }());
        chat.ChatBubble = ChatBubble;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        /**
         * 聊天窗口，包含 快捷聊天，表情、聊天窗口
         * 快捷聊天的数据通过GameVar.g_platformData["quick_talk"]设置
         * 这个配置列表元素可以为字符串。也可以为obj对象
         * @class  ChatPanel
         *
         */
        var ChatPanel = /** @class */ (function (_super) {
            __extends(ChatPanel, _super);
            function ChatPanel() {
                var _this = _super.call(this, GameVar.s_namespace + "/Art_Chat") || this;
                /**
                 * 发送消息类型，0：普通，1：弹幕
                 * @type {number}
                 */
                _this.m_sendType = 0;
                /**
                 * 当前是否可发送，发送有个时间间隔
                 * @type {boolean}
                 * @access private
                 */
                _this._isSendCd = false;
                //private _histroy_ds:Array<any>;       //历史纪录
                /**
                 * 消息历史记录的条数 默认为50条
                 * @type {number}
                 */
                _this._histroy_ds_totalNum = 50;
                return _this;
            }
            Object.defineProperty(ChatPanel, "s_instance", {
                get: function () {
                    if (ChatPanel._instance == null)
                        ChatPanel._instance = new gamelib.chat.ChatPanel();
                    return ChatPanel._instance;
                },
                enumerable: true,
                configurable: true
            });
            ChatPanel.destroy = function () {
                if (ChatPanel._instance)
                    ChatPanel._instance.destroy();
                ChatPanel._instance = null;
            };
            ChatPanel.prototype.init = function () {
                this._tab = this._res["tab_1"];
                this._tab.centerX = 0;
                this._oldItems = this._tab.items.concat();
                this._quickTalkList = this._res["list"];
                this._face = this._res["b_face"];
                this._histroy = this._res["list_record"];
                this._sendBox = this._res["b_send"];
                this._sendBtn = this._res["btn_send"];
                this._input_txt = this._res["txt_input"];
                this._input_txt.maxChars = 30;
                this._sendBox.visible = this._quickTalkList.visible = this._face.visible = this._histroy.visible = false;
                this._quickTalkList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
                var arr;
                if (GameVar.g_platformData["quick_talk"]) {
                    var temp = GameVar.g_platformData["quick_talk"];
                    if (temp instanceof Array) {
                        arr = GameVar.g_platformData["quick_talk"];
                    }
                    else {
                        arr = temp[GameVar.gz_id];
                        if (arr == null)
                            arr = temp["default"];
                    }
                }
                else {
                    arr = [];
                    arr.push("哎呀，又冲动了", "全押了，你敢跟吗!");
                    arr.push("今天就凭这把翻身了", "小意思，来把大的！", "朋友，玩的不赖呀", "无敌真是寂寞啊");
                    arr.push("催什么催我在想下什么好", "好多钱啊！", "不要羡慕我哦");
                }
                this._configs = GameVar.g_platformData['chat_config'];
                if (this._configs == null) {
                    this._configs = {
                        input_cd: 3000,
                        face_cd: 3000,
                        quick_cd: 3000,
                        input_vipLevel: 0,
                        face_vipLevel: 0,
                        quick_vipLevel: 0,
                        tips1: "",
                        tips2: "",
                        input_enabled: false,
                        face_enabled: true,
                        quick_enabled: true
                    };
                }
                if (this._configs.quick_enabled == undefined)
                    this._configs.quick_enabled = true;
                this._quickTalkList.dataSource = arr;
                this._histroy.itemRender = TalkItem;
                this._histroy.spaceY = 10;
                this._histroy.repeatX = 1;
                this._histroy.vScrollBarSkin = "";
                this._histroy.renderHandler = Laya.Handler.create(this, this.onHistroyListRender, null, false);
                if (this._res['b_face']) {
                    for (var i = 0; i < 20; i++) {
                        if (this._res['btn_' + (i + 1)]) {
                            this._res['btn_' + (i + 1)].name = "btn_" + i; //注意name是从0开始
                        }
                    }
                }
                this.setInputEnabled(this._configs.input_enabled);
                this.setExpressionEanbled(this._configs.face_enabled);
                this.setQuickTalkEnabled(this._configs.quick_enabled);
            };
            ChatPanel.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._input_txt.text = "";
                this._tab.on(laya.events.Event.CHANGE, this, this.onTabChange);
                this._sendBtn.on(laya.events.Event.CLICK, this, this.onSend);
                this._input_txt.on(laya.events.Event.INPUT, this, this.onTextInput);
                this._face.on(laya.events.Event.CLICK, this, this.onTouchFaceBtn);
                this._tab.selectedIndex = 0;
                this.onTabChange();
                var minVipLevel = GameVar.g_platformData['chat_vipLevel'];
                var minVipLevelTips = "";
                if (gamelib.data.UserInfo.s_self.vipLevel <= this._configs.input_vipLevel) {
                    this._input_txt.prompt = this._configs.tips1;
                    this._input_txt.editable = false;
                    this._input_txt.mouseEnabled = false;
                    this._sendBtn.disabled = true;
                }
                else {
                    this._input_txt.prompt = this._configs.tips2;
                    this._input_txt.editable = true;
                    this._input_txt.mouseEnabled = true;
                    this._sendBtn.disabled = false;
                }
            };
            ChatPanel.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._tab.off(laya.events.Event.CHANGE, this, this.onTabChange);
                this._sendBtn.off(laya.events.Event.CLICK, this, this.onSend);
                this._input_txt.off(laya.events.Event.INPUT, this, this.onTextInput);
                this._face.off(laya.events.Event.CLICK, this, this.onTouchFaceBtn);
            };
            ChatPanel.prototype.onTabChange = function (evt) {
                var index = this._tab.selectedIndex;
                var temp = this._tab.items[index];
                index = this._oldItems.indexOf(temp);
                if (index == 0) //表情
                 {
                    this._face.visible = true;
                    this._sendBox.visible = this._inputEnabled;
                    this._histroy.visible = false;
                    this._quickTalkList.visible = false;
                }
                else if (index == 1) //快捷聊天
                 {
                    this._face.visible = false;
                    this._sendBox.visible = this._inputEnabled;
                    this._histroy.visible = false;
                    this._quickTalkList.visible = true;
                }
                else //历史
                 {
                    this._face.visible = false;
                    this._sendBox.visible = this._inputEnabled;
                    this._histroy.visible = true;
                    this._quickTalkList.visible = false;
                }
            };
            /**
             * 输入框是否可用.默认是不可用
             * @function setInputEnabled
             * @param {boolean} value [description]
             */
            ChatPanel.prototype.setInputEnabled = function (value) {
                value = GameVar.circleData.isMatch() ? false : value;
                this._inputEnabled = value;
                this.updateItems();
            };
            /**
             * 快捷聊天是否可用.默认是可用
             * @function setInputEnabled
             * @param {boolean} value [description]
             */
            ChatPanel.prototype.setQuickTalkEnabled = function (value) {
                this._quiclEnabled = value;
                this.updateItems();
            };
            /**
             * 设置 表情是否可用
             * @function
             * @DateTime 2018-05-08T15:43:28+0800
             * @param    {boolean}                value [description]
             */
            ChatPanel.prototype.setExpressionEanbled = function (value) {
                this._expressionEanbled = value;
                this.updateItems();
            };
            ChatPanel.prototype.updateItems = function () {
                var temp = this._tab.items.concat();
                for (var _i = 0, temp_1 = temp; _i < temp_1.length; _i++) {
                    var item = temp_1[_i];
                    this._tab.delItem(item);
                }
                if (this._quiclEnabled)
                    this._tab.addItem(this._oldItems[1], true);
                if (this._expressionEanbled)
                    this._tab.addItem(this._oldItems[0], true);
                if (this._inputEnabled)
                    this._tab.addItem(this._oldItems[2], true);
            };
            ChatPanel.prototype.onListRender = function (cell, index) {
                var txt;
                for (var i = 0; i < cell.numChildren; i++) {
                    var temp = cell.getChildAt(i);
                    if (temp instanceof Laya.Label) {
                        txt = temp;
                        break;
                    }
                }
                var obj = this._quickTalkList.dataSource[index];
                if (typeof obj == "string") {
                    txt.text = obj;
                }
                else {
                    txt.text = obj.msg;
                }
                cell.off(laya.events.Event.CLICK, this, this.onSelectQuickTalk);
                cell.on(laya.events.Event.CLICK, this, this.onSelectQuickTalk);
            };
            ChatPanel.prototype.onHistroyListRender = function (cell, index) {
                // console.log("onHistroyListRender:" + index);
                var temp = this._histroy.dataSource[index];
                cell.setData(temp[0], temp[1], this._histroy.width);
            };
            ChatPanel.prototype.onTextInput = function (evt) {
                var msg = this._input_txt.text;
                if (msg.length > 20) {
                    msg = msg.slice(20, msg.length - 20);
                    msg += "...";
                }
            };
            /**
             *
             * 发送消息
             * @param evt
             */
            ChatPanel.prototype.onSend = function (evt) {
                playButtonSound();
                var msg = this._input_txt.text;
                if (!this.checkCanSend()) {
                    return;
                }
                if (msg == '') {
                    g_uiMgr.showTip(getDesByLan("无法发送空内容"), true);
                    return;
                }
                if (msg.length > 20) {
                    msg = msg.slice(0, 20);
                    msg += "...";
                }
                switch (this.m_sendType) {
                    case 0:
                        this.sendChatFunction(2, msg);
                        break;
                    case 1:
                        this.sendDanmuFunction(0, msg);
                        break;
                }
                this._input_txt.text = '';
                this._isSendCd = true;
                Laya.timer.once(this._configs.input_cd, this, this.clearCd);
                this.close();
            };
            /**
             * 发送快捷聊天
             * @param evt
             */
            ChatPanel.prototype.onSelectQuickTalk = function (evt) {
                if (!this.checkCanSend())
                    return;
                var msg;
                var ds = evt.currentTarget["_dataSource"];
                if (typeof ds == 'string') {
                    msg = ds;
                }
                else {
                    msg = ds.msg;
                }
                var arr = this._quickTalkList.dataSource;
                var index = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (typeof arr[i] == "string") {
                        if (arr[i] == msg) {
                            index = i;
                            break;
                        }
                    }
                    else {
                        if (arr[i].msg == msg) {
                            index = i;
                            break;
                        }
                    }
                }
                this._isSendCd = true;
                Laya.timer.once(this._configs.quick_cd, this, this.clearCd);
                this.sendChatFunction(4, index + "");
                playButtonSound();
                this._quickTalkList.selectedIndex = -1;
                this.close();
            };
            /**
             * 发送表情
             * @param evt
             */
            ChatPanel.prototype.onTouchFaceBtn = function (evt) {
                var temp = evt.target.name;
                var index = parseInt(temp.split("_")[1]);
                if (isNaN(index))
                    return;
                if (!this.checkCanSend())
                    return;
                this.sendFaceFunction(index);
                this._isSendCd = true;
                Laya.timer.once(this._configs.face_cd, this, this.clearCd);
                this.close();
            };
            ChatPanel.prototype.clearCd = function () {
                this._isSendCd = false;
            };
            //检测当前是否可以发送
            ChatPanel.prototype.checkCanSend = function () {
                if (this._isSendCd) {
                    g_uiMgr.showTip(getDesByLan("请稍候再发") + "...", true);
                    return false;
                }
                return true;
            };
            /**
             * 发送表情函数
             * @param index
             */
            ChatPanel.prototype.sendFaceFunction = function (index) {
                sendNetMsg(0x00C0, 1, gamelib.data.UserInfo.s_self.m_id, index);
            };
            /**
             * 发送聊天函数
             * @param type:2:输入聊天，4：快捷聊天
             */
            ChatPanel.prototype.sendChatFunction = function (type, msg) {
                sendNetMsg(0x0074, type, 0, "", msg);
                // if(Math.random() * 10 < 5)
                // this.addMsg(gamelib.data.UserInfo.s_self,msg);
                // else
                //     this.addMsg(null,msg);
            };
            /**
             * 发送弹幕函数
             */
            ChatPanel.prototype.sendDanmuFunction = function (type, msg) {
                sendNetMsg(0x0076, 1, 0, 0, msg);
            };
            ChatPanel.prototype.getMsgByNetData = function (data) {
                if (data.type == 4) {
                    var arr = this._quickTalkList.dataSource;
                    var index = parseInt(data.msg);
                    var temp = arr[index];
                    if (temp == null)
                        return "";
                    if (typeof temp == "string") {
                        return temp;
                    }
                    return temp.msg;
                }
                return data.msg;
            };
            ChatPanel.prototype.addMsg = function (user, msg) {
                if (GameVar.g_platformData['chat_histroy_disabled'])
                    return;
                if (this._histroy.dataSource == null)
                    this._histroy.dataSource = [];
                if (this._histroy.dataSource.length >= this._histroy_ds_totalNum) {
                    this._histroy.deleteItem(0);
                }
                this._histroy.addItem([user, msg]);
                this._histroy.tweenTo(this._histroy.dataSource.length - 1);
            };
            /**
             * 通过序号获取快捷聊天消息
             * @function
             * @DateTime 2018-05-04T11:44:22+0800
             * @param    {number}                 index [description]
             * @return   {string}                       [description]
             */
            ChatPanel.prototype.getQuickTalkByIndex = function (index) {
                var arr = this._quickTalkList.dataSource;
                return arr[index];
            };
            ChatPanel.prototype.onData0x0074 = function (user, obj) {
                if (user == null)
                    return;
                var str = obj.msg;
                switch (obj.type) {
                    case 1: //系统消失
                        if (obj.sendId == 0)
                            this.addMsg(null, "[" + getDesByLan("系统") + "]：" + str);
                        break;
                    case 2: //输入聊天
                        this.addMsg(user, str);
                        break;
                    case 4: //快捷聊天
                        var arr = this._quickTalkList.dataSource;
                        var index = parseInt(str);
                        var hz = user.m_sex == 1 ? "_m" : "_w";
                        var temp = arr[index];
                        if (temp == null)
                            return;
                        if (typeof temp == "string") {
                            str = temp;
                        }
                        else {
                            if (temp.sound) {
                                var isCommon = temp.isCommon;
                                if (temp.checkSex)
                                    playSound_qipai(temp.sound + hz, 1, null, isCommon);
                                else
                                    playSound_qipai(temp.sound, 1, null, isCommon);
                            }
                            str = temp.msg;
                        }
                        break;
                }
                return str;
            };
            /**
             * 弹幕
             * @param obj
             * @param user
             */
            ChatPanel.prototype.onData0x0076 = function (obj, user) {
                this.addMsg(user, obj.msg);
            };
            return ChatPanel;
        }(gamelib.core.BaseUi));
        chat.ChatPanel = ChatPanel;
        var TalkItem = /** @class */ (function (_super) {
            __extends(TalkItem, _super);
            function TalkItem() {
                var _this = _super.call(this) || this;
                _this._headSize = 64;
                _this._systemHeight = 39;
                _this._bgSizeGrid = "15,15,15,15";
                _this.txt_msg = new laya.ui.Label();
                _this.txt_msg.fontSize = 24;
                _this._img_bg = new laya.ui.Image();
                _this.addChild(_this._img_bg);
                _this.addChild(_this.txt_msg);
                _this._img_bg.height = 39;
                _this._head = new laya.ui.Image();
                _this._head.size(_this._headSize, _this._headSize);
                _this.txt_name = new laya.ui.Label();
                _this.txt_name.color = "#EFEFEF";
                _this.txt_name.fontSize = 18;
                _this.addChild(_this._head);
                _this.addChild(_this.txt_name);
                _this._img_bg.sizeGrid = _this._bgSizeGrid;
                return _this;
            }
            TalkItem.prototype.setData = function (user, msg, width) {
                this.txt_msg.text = msg;
                var self_name = "#834f24";
                var self_msg = "#834f24";
                var other_name = "#272625";
                var other_msg = "#474747";
                var system_msg = "#E44530";
                var temp = GameVar.g_platformData['chat_color'];
                if (temp) {
                    if (temp['self_name'])
                        self_name = temp['self_name'];
                    if (temp['self_msg'])
                        self_msg = temp['self_msg'];
                    if (temp['other_name'])
                        other_name = temp['other_name'];
                    if (temp['other_msg'])
                        other_msg = temp['other_msg'];
                    if (temp['system_msg'])
                        system_msg = temp['system_msg'];
                }
                if (user == null) {
                    this.txt_msg.color = "#E44530";
                    this._isSystem = true;
                    this.width = width;
                    this.height = this._systemHeight;
                }
                else {
                    this._isSystem = false;
                    this._isSelf = user.m_id == gamelib.data.UserInfo.s_self.m_id;
                    this.width = width;
                    this.height = this._headSize;
                    if (user.m_pId == 0) {
                        this.txt_name.text = user.m_name_ex;
                    }
                    else {
                        this.txt_name.text = user.m_name_ex + "(ID:" + user.m_pId + ")";
                    }
                    this._head.skin = user.m_headUrl;
                    if (this._isSelf) {
                        this.txt_msg.color = self_msg;
                        this.txt_name.color = self_name;
                    }
                    else {
                        this.txt_msg.color = other_msg;
                        this.txt_name.color = other_name;
                    }
                }
                this.build();
                this.updateSize();
            };
            TalkItem.prototype.updateSize = function () {
                this._img_bg.width = this.txt_msg.width + 40;
            };
            TalkItem.prototype.build = function () {
                if (this._isSystem) {
                    this._img_bg.skin = "chat/chat_bg_1.png"; //确保有底，chat_bg_3可能不存在
                    this._img_bg.skin = "chat/chat_bg_3.png";
                    this._img_bg.sizeGrid = this._bgSizeGrid;
                    this._head.visible = this.txt_name.visible = false;
                    this._img_bg.top = this._img_bg.left = 0;
                    this._img_bg.bottom = 0;
                    this.txt_msg.left = 10;
                    this.txt_msg.bottom = this.txt_msg.top = 5;
                }
                else {
                    this._head.visible = this.txt_name.visible = true;
                    this._img_bg.left = this._img_bg.top = this.txt_msg.left = this.txt_msg.top = parseInt("dd");
                    if (!this._isSelf) {
                        this._img_bg.skin = "chat/chat_bg_2.png";
                        this.txt_msg.anchorX = this._img_bg.anchorX = this.txt_name.anchorX = 0;
                        this._head.top = 0;
                        this._head.x = 0;
                        this.txt_name.x = this._headSize + 5;
                        this.txt_name.top = 3;
                        this._img_bg.x = this._headSize + 5;
                        this._img_bg.bottom = 0;
                        this.txt_msg.x = this._headSize + 10;
                        this.txt_msg.bottom = 7.5;
                    }
                    else {
                        this._img_bg.skin = "chat/chat_bg_1.png";
                        this._head.top = 0;
                        this._head.x = this.width - this._headSize;
                        this.txt_msg.anchorX = this._img_bg.anchorX = this.txt_name.anchorX = 1;
                        this.txt_name.x = this.width - this._headSize - 5;
                        this.txt_name.top = 3;
                        this._img_bg.x = this.width - this._headSize - 5;
                        this._img_bg.bottom = 0;
                        this.txt_msg.x = this.width - this._headSize - 25;
                        this.txt_msg.bottom = 7.5;
                    }
                }
            };
            return TalkItem;
        }(laya.ui.Box));
        chat.TalkItem = TalkItem;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        chat.s_face_alias = "abcdefghijklmnopq";
        function parseMsg(msg) {
            var arr = [];
            var index = 0;
            var str = "";
            while (index <= msg.length) {
                var s = msg.charAt(index++);
                if (s == "/") {
                    var s1 = msg.charAt(index++);
                    var i = chat.s_face_alias.indexOf(s1);
                    if (i == -1) {
                        str += s;
                    }
                    else {
                        if (str.length > 0)
                            arr.push(str);
                        str = "";
                        arr.push(i);
                    }
                }
                else {
                    str += s;
                }
            }
            arr.push(str);
            return arr;
        }
        chat.parseMsg = parseMsg;
        function getQuickTalkByIndex(index) {
            var quick_talk = GameVar.g_platformData['quick_talk'];
            var arr;
            if (quick_talk != null) {
                if (quick_talk instanceof Array) {
                    arr = GameVar.g_platformData["quick_talk"];
                }
                else {
                    arr = quick_talk[GameVar.gz_id];
                    if (arr == null)
                        arr = quick_talk["default"];
                }
                var obj = arr[index];
                if (typeof obj == "string") {
                    return { msg: obj, sound: '', checkSex: false };
                }
                return obj;
            }
            return null;
        }
        chat.getQuickTalkByIndex = getQuickTalkByIndex;
        var ChatSystem_BR = /** @class */ (function () {
            function ChatSystem_BR(res) {
                this._res = res;
                this._input = new chat.Input(res);
                this._danmu = new chat.DanMu();
                this._danmuToggle = res.checkBox_danmu;
                //默认打开
                this._danmu.enable = true;
                this._danmuToggle.selected = false;
            }
            Object.defineProperty(ChatSystem_BR.prototype, "danMu", {
                get: function () {
                    return this._danmu;
                },
                enumerable: true,
                configurable: true
            });
            ChatSystem_BR.prototype.show = function () {
                this._input.show();
                if (this._danmuToggle)
                    this._danmuToggle.on(Laya.Event.CHANGE, this, this.onDanMuToggle);
                g_net.addListener(this);
            };
            ChatSystem_BR.prototype.close = function () {
                this._input.close();
                if (this._danmuToggle)
                    this._danmuToggle.off(Laya.Event.CHANGE, this, this.onDanMuToggle);
                g_net.removeListener(this);
            };
            ChatSystem_BR.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x0074:
                        if (data.type == 1) {
                            if (data.sendId == 0) //系统公告
                                g_uiMgr.showPMD("[" + getDesByLan("系统") + "]" + ":" + data.msg);
                            else //喇叭
                                g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭") + " [" + data.sendName + "]:" + data.msg);
                            return;
                        }
                        var pd = gamelib.core.getPlayerData(data.sendId);
                        if (pd == null)
                            return;
                        var str = data.msg;
                        if (data.type == 4) {
                            var index = parseInt(data.msg);
                            var hz = pd.m_sex == 1 ? "_m" : "_w";
                            var temp = getQuickTalkByIndex(index);
                            if (temp != null) {
                                str = temp.msg;
                                if (temp.sound) {
                                    str = temp.msg;
                                    if (temp.checkSex)
                                        playSound_qipai(temp.sound + hz);
                                    else
                                        playSound_qipai(temp.sound);
                                }
                            }
                        }
                        this._danmu.onGetMsgByUser(pd, str);
                        // var str:string = gamelib.chat.ChatPanel.s_instance.onData0x0074(pd,data);
                        // gamelib.chat.ChatBubble.s_instance.showMsg(pd.m_seat_local,str);  
                        break;
                }
            };
            ChatSystem_BR.prototype.destroy = function () {
                this.close();
                this._input.destroy();
                this._res = null;
            };
            ChatSystem_BR.prototype.setBubbles = function (arr) {
            };
            ChatSystem_BR.prototype.onDanMuToggle = function () {
                this._danmu.enable = !this._danmuToggle.selected;
            };
            return ChatSystem_BR;
        }());
        chat.ChatSystem_BR = ChatSystem_BR;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        /**
         *@class DanMu
         *
         */
        var DanMu = /** @class */ (function () {
            function DanMu() {
                this._speed = 2.5;
                this._height = 0;
                this._list = [];
                this._postions = [];
                this._grap = g_gameMain.m_gameWidth - 100;
            }
            DanMu.prototype.initArea = function (minY, maxY) {
                this._minY = minY;
                this._maxY = maxY;
            };
            DanMu.prototype.destroy = function () {
                Laya.timer.clear(this, this.update);
                this._list.length = 0;
            };
            Object.defineProperty(DanMu.prototype, "enable", {
                set: function (value) {
                    this._enable = value;
                    if (!value) {
                        this._postions.length = 0;
                        Laya.timer.clear(this, this.update);
                        for (var i = this._list.length - 1; i >= 0; i--) {
                            var label = this._list[i];
                            label.removeSelf();
                        }
                        this._list.length = 0;
                    }
                },
                enumerable: true,
                configurable: true
            });
            DanMu.prototype.onGetMsg = function (msg, isVip, isSelf) {
                if (!this._enable)
                    return;
                var ty = this.getY(0);
                if (ty >= 17)
                    return;
                var color = isVip ? "#fd4527" : "#FFFFFF";
                var item = new DanMuItem();
                item.createTextField(msg, color, isSelf);
                this.addItem(item, ty);
            };
            DanMu.prototype.onGetMsgByUser = function (user, msg) {
                if (!this._enable)
                    return;
                var ty = this.getY(0);
                if (ty >= 17)
                    return;
                console.log(ty);
                var item = new DanMuItem();
                item.createByUser(msg, user);
                this.addItem(item, ty);
            };
            DanMu.prototype.addItem = function (item, yIndex) {
                this._height = item.height;
                item.x = Laya.stage.width;
                item.y = this._minY + yIndex * this._height;
                var tl = this._postions[yIndex];
                if (tl != null && tl != undefined) {
                    tl.m_index = -1;
                }
                item.m_index = yIndex;
                this._postions[yIndex] = item;
                g_layerMgr.addChild(item);
                if (this._list.length == 0) {
                    Laya.timer.frameLoop(1, this, this.update);
                }
                this._list.push(item);
            };
            DanMu.prototype.getY = function (index) {
                var txt = this._postions[index];
                if (txt == null)
                    return index;
                if (txt.x + txt.width > this._grap)
                    return this.getY(index + 1);
                return index;
            };
            DanMu.prototype.update = function (dt) {
                for (var i = this._list.length - 1; i >= 0; i--) {
                    var label = this._list[i];
                    label.x -= this._speed;
                    if (label.x <= -label.width) {
                        this._list.splice(i, 1);
                        label.removeSelf();
                        var index = label.m_index;
                        if (index != -1 && !isNaN(index))
                            this._postions[index] = null;
                    }
                }
                if (this._list.length == 0) {
                    Laya.timer.clear(this, this.update);
                }
                return false;
            };
            return DanMu;
        }());
        chat.DanMu = DanMu;
        var DanMuItem = /** @class */ (function (_super) {
            __extends(DanMuItem, _super);
            function DanMuItem() {
                var _this = _super.call(this) || this;
                _this._zOrders = {
                    "bg": 0,
                    "head": 1,
                    "head_bg": 2,
                    "vip": 3,
                    "msg": 4
                };
                return _this;
            }
            DanMuItem.prototype.createTextField = function (msg, color, isBorder) {
                if (isBorder === void 0) { isBorder = false; }
                //创建 TextField 对象
                var label = new Laya.Text();
                if (isBorder) {
                    ////设置边框颜色
                    label.borderColor = "#00ff00";
                }
                label.stroke = 1;
                label.strokeColor = "#000000";
                //设置字体
                label.font = "Arial";
                //设置文本颜色
                label.color = color;
                //设置字号
                label.fontSize = 34;
                //设置显示文本
                label.text = msg;
                label.wordWrap = false;
                label.mouseEnabled = false;
                this._msg = label;
                this.addChild(this._msg);
                return label;
            };
            Object.defineProperty(DanMuItem.prototype, "width", {
                get: function () {
                    if (this._bg != null)
                        return this._bg.width;
                    return this._msg.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DanMuItem.prototype, "height", {
                get: function () {
                    if (this._bg != null)
                        return this._bg.height;
                    return this._msg.height;
                },
                enumerable: true,
                configurable: true
            });
            DanMuItem.prototype.destroy = function () {
            };
            /**
             * vip:有背景、头像框背景、头像、vip图标
             * 非vis:头像，
             * @function
             * @DateTime 2018-08-28T11:06:45+0800
             * @param    {string}                 msg  [description]
             * @param    {gamelib.data.UserInfo}  user [description]
             */
            DanMuItem.prototype.createByUser = function (msg, user) {
                var color;
                var url;
                var head_url;
                if (user.vipLevel <= 3) {
                    url = "danmu/vipBg1.png";
                    head_url = "danmu/vipKuang1.png";
                }
                else if (user.vipLevel <= 7) {
                    url = "danmu/vipBg2.png";
                    head_url = "danmu/vipKuang2.png";
                }
                else {
                    url = "danmu/vipBg3.png";
                    head_url = "danmu/vipKuang3.png";
                }
                if (user.vipLevel >= 8) {
                    color = "#ffe553";
                }
                else {
                    color = "#fbfafa";
                }
                this._msg = this.buildMsg(user.m_name + ":" + msg, color);
                this.addChild(this._msg);
                var head = new Laya.Image();
                head.skin = user.m_headUrl;
                head.width = head.height = 42;
                head.zOrder = this._zOrders.head;
                this.addChild(head);
                this._msg.x = 46;
                this._msg.y = (head.height - this._msg.height) / 2;
                if (user.vipLevel == 0) {
                    return;
                }
                var bg = new Laya.Image();
                bg.skin = url;
                bg.sizeGrid = "3,13,4,11";
                this.addChildAt(bg, 0);
                bg.zOrder = this._zOrders.bg;
                this._bg = bg;
                var head_bg = new Laya.Image();
                head_bg.skin = head_url;
                head_bg.width = head_bg.height = 50;
                head_bg.y = -4;
                head_bg.zOrder = this._zOrders.head_bg;
                this.addChild(head_bg);
                var vipIcon = new Laya.Image();
                var vipIconUrl = window['qpq']['getVipIcon'](user.vipLevel, true);
                vipIcon.skin = vipIconUrl;
                vipIcon.width = vipIcon.height = 30;
                vipIcon.x = 30;
                vipIcon.y = 19;
                this.addChild(vipIcon);
                vipIcon.zOrder = this._zOrders.vip;
                bg.width = this._msg.width + head_bg.width;
                this.cacheAs = "bitmap";
            };
            DanMuItem.prototype.buildMsg = function (msg, color) {
                var spr = new Laya.Sprite();
                spr.zOrder = this._zOrders.msg;
                var arr = chat.parseMsg(msg);
                var ox = 0;
                var size = 24;
                for (var i = 0; i < arr.length; i++) {
                    var m = arr[i];
                    if (typeof m == "string") {
                        var label = new Laya.Text();
                        label.font = "Arial";
                        label.fontSize = size;
                        label.text = m;
                        label.wordWrap = false;
                        label.mouseEnabled = false;
                        label.color = color;
                        label.x = ox;
                        ox += label.width;
                        spr.addChild(label);
                    }
                    else if (typeof m == "number") {
                        var classObj = gamelib.getDefinitionByName(GameVar.s_namespace + ".ui.face.Art_face_" + (m + 1) + "UI");
                        if (classObj == null)
                            continue;
                        var face = new classObj();
                        face.x = ox;
                        face.y = (size - face.height) / 2;
                        if (face.ani1)
                            face.ani1.play(0, false);
                        ox += face.width;
                        spr.addChild(face);
                    }
                }
                spr.width = ox;
                spr.height = size;
                return spr;
            };
            return DanMuItem;
        }(Laya.Sprite));
        chat.DanMuItem = DanMuItem;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        var DanMuUi = /** @class */ (function () {
            function DanMuUi(cb, pmdRes) {
                this._danmu = new chat.DanMu();
                this._danmuToggle = cb;
                this._danmu.enable = true;
                this._danmuToggle.selected = false;
                this._danmu.initArea(100, 600);
                this._danmuToggle.on(Laya.Event.CHANGE, this, this.onDanMuToggle);
                if (pmdRes) {
                    this._pmd = new gamelib.alert.Pmd();
                    this._pmd.setRes(pmdRes);
                }
                g_net.addListener(this);
            }
            Object.defineProperty(DanMuUi.prototype, "enabled", {
                set: function (value) {
                    this._danmu.enable = value;
                    this._danmuToggle.selected = !value;
                },
                enumerable: true,
                configurable: true
            });
            DanMuUi.prototype.addPmd = function (msg) {
                if (this._pmd) {
                    this._pmd.add(msg);
                }
            };
            DanMuUi.prototype.destroy = function () {
                if (this._danmuToggle)
                    this._danmuToggle.off(Laya.Event.CHANGE, this, this.onDanMuToggle);
                if (this._pmd) {
                    this._pmd.destroy();
                }
                g_net.removeListener(this);
            };
            DanMuUi.prototype.onDanMuToggle = function () {
                this._danmu.enable = !this._danmuToggle.selected;
            };
            DanMuUi.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x002F:
                        if (data.type == 1) {
                            if (this._pmd)
                                this._pmd.add(getDesByLan("系统") + ":" + data.msg);
                        }
                        break;
                    case 0x0074:
                        if (data.type == 1) {
                            if (data.sendId == 0) //系统公告
                                g_uiMgr.showPMD("[" + getDesByLan("系统") + "]" + ":" + data.msg);
                            else //喇叭
                                g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭") + " [" + data.sendName + "]:" + data.msg);
                            return;
                        }
                        var pd = gamelib.core.getPlayerData(data.sendId);
                        if (pd == null)
                            return;
                        var str = data.msg;
                        this._danmu.onGetMsgByUser(pd, str);
                        break;
                    case 0x2215:
                        if (data.result != 1)
                            return;
                        switch (data.type) {
                            case 1:
                                if (data.sign == 0)
                                    this._danmu.onGetMsg(data.content, data.vip > 0, data.PID == gamelib.data.UserInfo.s_self.m_pId);
                                break;
                            case 2: // 世界
                                // 跑马灯
                                if (this._pmd)
                                    this._pmd.add(data.nickName + ":" + data.content);
                                break;
                            case 3: // 游戏公告
                            case 4: // 系统公告
                                if (this._pmd)
                                    this._pmd.add(getDesByLan("系统") + ":" + data.content);
                                break;
                        }
                }
            };
            return DanMuUi;
        }());
        chat.DanMuUi = DanMuUi;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/1/14.
 *
 */
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        /**
         * 显示表情.需要把美术资源提供的表情图标传过来
         * @class Face
         */
        var Face = /** @class */ (function () {
            function Face() {
            }
            Object.defineProperty(Face, "s_instance", {
                get: function () {
                    if (Face._instance == null)
                        Face._instance = new gamelib.chat.Face();
                    return Face._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 设置表情图标列表
             * @function initPos
             * @DateTime 2018-03-17T13:54:45+0800
             * @param    {Array<any>}             arr [description]
             */
            Face.prototype.initPos = function (arr) {
                this._pos_list = arr;
                for (var key in arr) {
                    arr[key].visible = false;
                }
            };
            /**
             * 显示指定id的表情到指定的容器里面
             * @function showFaceToPos
             * @DateTime 2018-03-17T13:55:07+0800
             * @param    {number}                 id     [description]
             * @param    {Laya.Box}               parent [description]
             */
            Face.prototype.showFaceToPos = function (id, parent) {
                if (id < 0)
                    id = 1;
                var face = this.getFaceRes(id);
                parent.addChild(face);
                var ani1 = face.ani1;
                ani1.play(0, false);
                ani1.once(laya.events.Event.COMPLETE, this, this.onPlayEnd, [face]);
            };
            /**
             * 在指定座位号处显示表情
             * @function
             * @DateTime 2018-03-17T13:55:36+0800
             * @param    {number}                 id        [description]
             * @param    {number}                 localSeat [description]
             */
            Face.prototype.showFace = function (id, localSeat) {
                if (localSeat == -1)
                    return;
                var temp = this._pos_list[localSeat];
                if (temp == null)
                    return;
                var pos;
                var b = false;
                if (temp instanceof Laya.UIComponent) {
                    b = true;
                }
                else {
                    pos = { x: temp.x, y: temp.y };
                }
                if (id < 0)
                    id = 1;
                var face = this.getFaceRes(id);
                // else if(id > 17) id = 17;
                if (b) {
                    var tParent = (temp.parent);
                    face.x = temp.x;
                    face.y = temp.y;
                    tParent.addChild(face);
                }
                else {
                    face.x = pos.x;
                    face.y = pos.y;
                    g_layerMgr.addChild(face);
                }
                var ani1 = face.ani1;
                ani1.play(0, false);
                ani1.once(laya.events.Event.COMPLETE, this, this.onPlayEnd, [face]);
            };
            Face.prototype.getFaceRes = function (id) {
                var url = "qpq/face/Art_face_" + (id + 1);
                var face = utils.tools.createSceneByViewObj(url);
                face.zOrder = 10;
                return face;
            };
            Face.prototype.onPlayEnd = function (face) {
                console.log("播放完成");
                face.removeSelf();
            };
            return Face;
        }());
        chat.Face = Face;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        var Input = /** @class */ (function () {
            function Input(res) {
                this._quickTalkIndex = -1;
                this._cd = 5000;
                this._lastSendTime = 0;
                this._faceList = res['list_face'];
                this._quickTalkList = res['list_talk'];
                this._faceG = res['bg_face'];
                this._quickG = res['bg_talk'];
                this._faceBtn = res['btn_face'];
                this._sendBtn = res['btn_send'];
                this._input_txt = res['txt_input'];
                this._quickTalkBtn = res['checkBox_chat'];
                this._faceList.selectEnable = true;
                this._quickTalkList.selectEnable = true;
                this._faceList.selectHandler = Laya.Handler.create(this, this.onFaceSelected, null, false);
                this._quickTalkList.selectHandler = Laya.Handler.create(this, this.onQuickSelected, null, false);
                this._faceList.renderHandler = Laya.Handler.create(this, this.onFaceRender, null, false);
                this._quickTalkList.renderHandler = Laya.Handler.create(this, this.onQuickRender, null, false);
                var arr = [];
                for (var i = 1; i <= 17; i++) {
                    var obj = {};
                    obj.skin = "face/btn_face_" + i + ".png";
                    obj.alias = "/" + chat.s_face_alias.charAt(i - 1);
                    arr.push(obj);
                }
                this._faceList.dataSource = arr;
                var arr1;
                if (GameVar.g_platformData["quick_talk"]) {
                    var temp = GameVar.g_platformData["quick_talk"];
                    if (temp instanceof Array) {
                        arr1 = GameVar.g_platformData["quick_talk"];
                    }
                    else {
                        arr1 = temp[GameVar.gz_id];
                        if (arr1 == null)
                            arr1 = temp["default"];
                    }
                }
                else {
                    arr1 = [];
                    arr1.push("哎呀，又冲动了", "全押了，你敢跟吗!");
                    arr1.push("今天就凭这把翻身了", "小意思，来把大的！", "朋友，玩的不赖呀", "无敌真是寂寞啊");
                    arr1.push("催什么催我在想下什么好", "好多钱啊！", "不要羡慕我哦");
                }
                this._quickTalkList.dataSource = arr1;
                this._faceG.visible = this._quickG.visible = false;
                this._quickTalkBtn.selected = this._quickG.visible;
                this._input_txt.maxChars = 30;
                this._input_txt.text = "";
            }
            Input.prototype.destroy = function () {
                this.close();
                this._quickTalkList = null;
                this._quickG = null;
                this._quickTalkBtn = null;
                this._faceG = null;
                this._faceBtn = null;
                this._faceList = null;
                this._input_txt = null;
            };
            Input.prototype.show = function () {
                this._quickTalkBtn.on(Laya.Event.CLICK, this, this.onClickQuickBtn);
                this._faceBtn.on(Laya.Event.CLICK, this, this.onClickFaceBtn);
                this._sendBtn.on(Laya.Event.CLICK, this, this.onClickSendBtn);
                Laya.stage.on(Laya.Event.CLICK, this, this.onClickStage);
                this._input_txt.on(Laya.Event.INPUT, this, this.onTextInput);
            };
            Input.prototype.close = function () {
                this._quickTalkBtn.off(Laya.Event.CLICK, this, this.onClickQuickBtn);
                this._faceBtn.off(Laya.Event.CLICK, this, this.onClickFaceBtn);
                this._sendBtn.off(Laya.Event.CLICK, this, this.onClickSendBtn);
                Laya.stage.off(Laya.Event.CLICK, this, this.onClickStage);
                this._input_txt.off(Laya.Event.INPUT, this, this.onTextInput);
            };
            Input.prototype.onTextInput = function (evt) {
                this._quickTalkIndex = -1;
                for (var i = 0; i < this._quickTalkList.dataSource.length; i++) {
                    var obj = this._quickTalkList.dataSource[i];
                    var msg = "";
                    if (typeof obj == "string") {
                        msg = obj;
                    }
                    else {
                        msg = obj.msg;
                    }
                    if (msg == this._input_txt.text) {
                        this._quickTalkIndex = i;
                        return;
                    }
                }
            };
            Input.prototype.onFaceRender = function (box, index) {
                var btn = box.getChildAt(0);
                btn.skin = this._faceList.dataSource[index].skin;
            };
            Input.prototype.onQuickRender = function (cell, index) {
                var txt = getChildByName(cell, 'txt_txt');
                var obj = this._quickTalkList.dataSource[index];
                if (typeof obj == "string") {
                    txt.text = obj;
                }
                else {
                    txt.text = obj.msg;
                }
            };
            //选择表情
            Input.prototype.onFaceSelected = function (index) {
                if (this._faceList.selectedIndex == -1)
                    return;
                var obj = this._faceList.dataSource[this._faceList.selectedIndex];
                this._input_txt.text += obj.alias;
                this._faceList.selectedIndex = -1;
            };
            //选择快捷聊天
            Input.prototype.onQuickSelected = function (index) {
                if (this._quickTalkList.selectedIndex == -1)
                    return;
                this._quickTalkIndex = this._quickTalkList.selectedIndex;
                var obj = this._quickTalkList.dataSource[this._quickTalkList.selectedIndex];
                var str = "";
                if (typeof obj == "string") {
                    str = obj;
                }
                else {
                    str = obj.msg;
                }
                if (this.checkCD()) {
                    sendNetMsg(0x0074, 4, 0, "", this._quickTalkList.selectedIndex + "");
                }
                else {
                    g_uiMgr.showTip(getDesByLan("请稍后再发送"), true);
                }
                this._quickTalkIndex = -1;
                this._quickTalkList.selectedIndex = -1;
            };
            Input.prototype.onClickQuickBtn = function (evt) {
                evt.stopPropagation();
                this._quickG.visible = !this._quickG.visible;
                this._quickTalkBtn.selected = this._quickG.visible;
            };
            Input.prototype.onClickFaceBtn = function (evt) {
                evt.stopPropagation();
                this._faceG.visible = !this._faceG.visible;
            };
            Input.prototype.onClickSendBtn = function (evt) {
                evt.stopPropagation();
                if (this._input_txt.text == "")
                    return;
                if (this.checkCD()) {
                    if (this._quickTalkIndex >= 0) {
                        sendNetMsg(0x0074, 4, 0, "", this._quickTalkIndex + "");
                    }
                    else {
                        sendNetMsg(0x0074, 2, 0, "", this._input_txt.text + "");
                    }
                    this._lastSendTime = Laya.timer.currTimer;
                    this._input_txt.text = "";
                    this._quickTalkIndex = -1;
                }
                else {
                    g_uiMgr.showTip(getDesByLan("请稍后再发送"), true);
                }
            };
            Input.prototype.checkCD = function () {
                return Laya.timer.currTimer - this._lastSendTime > this._cd;
            };
            Input.prototype.onClickStage = function (evt) {
                if (evt.target == this._faceList || evt.target.parent == this._faceList)
                    return;
                this._faceG.visible = this._quickG.visible = false;
            };
            return Input;
        }());
        chat.Input = Input;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
/*
* name;
*/
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        /**
         *    世界聊天数据(所有游戏通用)
         */
        var WorldChatData = /** @class */ (function () {
            function WorldChatData() {
                this.m_worldTakeData = []; // 世界聊天数据
                this.m_roomTakeData = []; // 房间聊天数据
                this.m_maxRoomDataNum = 50; // 最多保存房间聊天数据条数
                this.m_maxWorldDataNum = 50; // 最多保存世界聊天数据条数
            }
            Object.defineProperty(WorldChatData, "s_instance", {
                get: function () {
                    if (WorldChatData._instance == null)
                        WorldChatData._instance = new WorldChatData();
                    return WorldChatData._instance;
                },
                enumerable: true,
                configurable: true
            });
            /**
             *    解析数据
             */
            WorldChatData.prototype.onAnalysisData = function (data) {
                if (data.result != 1) { // 没有成功
                    this.sendResult(data.result);
                    return;
                }
                switch (data.type) {
                    case 1: // 游戏(房间)
                        if (this.m_roomTakeData.length > this.m_maxRoomDataNum) {
                            this.m_roomTakeData.shift();
                        }
                        this.m_roomTakeData.push(data);
                        break;
                    case 2: // 世界
                        if (this.m_worldTakeData.length > this.m_maxWorldDataNum) {
                            this.m_roomTakeData.shift();
                        }
                        this.m_worldTakeData.push(data);
                        // 跑马灯
                        g_uiMgr.showPMD(data.nickName + ":" + data.content);
                        break;
                    case 3: // 游戏公告
                    case 4: // 系统公告
                        if (this.m_worldTakeData.length > this.m_maxWorldDataNum) {
                            this.m_roomTakeData.shift();
                        }
                        data.headUrl = GameVar.common_ftp + "qpq_config/" + GameVar.platform + "/gameIcon.png";
                        data.nickName = "系统";
                        this.m_worldTakeData.push(data);
                        // 跑马灯
                        g_uiMgr.showPMD(data.content);
                        break;
                }
            };
            /**
             *    添加跑马灯信息
             *   data.PID        // PID（玩家PID(系统是0)）
             *   data.headUrl    // 头像
             *   data.nickName   // 昵称
             *   data.sign       // 标志(0表示文字 1表示表情)
             *   data.content    // 消息内容
             *   data.level      // 等级
             */
            WorldChatData.prototype.addPMDData = function (msg) {
                var data = {};
                data.level = data.PID = 0;
                data.headUrl = GameVar.common_ftp + "qpq_config/" + GameVar.platform + "/gameIcon.png";
                data.nickName = getDesByLan("系统");
                data.sign = "";
                data.content = msg;
                if (this.m_worldTakeData.length > this.m_maxWorldDataNum) {
                    this.m_roomTakeData.shift();
                }
                this.m_worldTakeData.push(data);
            };
            /**
             *    清理房间聊天数据
             */
            WorldChatData.prototype.clearRoomTakeData = function () {
                this.m_roomTakeData.length = 0;
            };
            /**
             * 发送消息失败结果
             * @param reult
             */
            WorldChatData.prototype.sendResult = function (reult) {
                switch (reult) {
                    case 0: // 失败
                        g_uiMgr.showTip(getDesByLan("失败"));
                        break;
                    case 2: // 禁言
                        g_uiMgr.showTip("禁言中！");
                        break;
                    case 3: // 喇叭不足
                        g_uiMgr.showTip("喇叭不足！");
                        break;
                    case 4: // 等级不足
                        g_uiMgr.showTip("等级不足！");
                        break;
                }
            };
            return WorldChatData;
        }());
        chat.WorldChatData = WorldChatData;
        /**
         *    世界聊天(公共)
         */
        var WorldChat = /** @class */ (function (_super) {
            __extends(WorldChat, _super);
            function WorldChat() {
                var _this = _super.call(this, GameVar.s_namespace + "/Art_WorldChat") || this;
                _this._curMsgPosY = 0; // 当前聊天信息显示的坐标Y
                _this._maxShowData = 50; // 最多显示聊天记录条数
                return _this;
            }
            /**
             * 初始化
             */
            WorldChat.prototype.init = function () {
                _super.prototype.init.call(this);
                this._tab = this._res["tab_pingdao"]; // 世界聊天  房间聊天
                this._takeList = this._res["l_talk"]; // 聊天记录列表
                this._btnSend = this._res["btn_send"]; // 发送按钮
                this._boxWorld = this._res["b_chat_world"]; // 世界聊天组
                this._textInputWorld = this._res["txt_input2"]; // 世界聊天文本输入框
                this._txtLaBa = this._res["txt_number"]; // 喇叭数量
                this._boxRoom = this._res["b_chat_room"]; // 房间聊天组
                this._textInputRoom = this._res["txt_input1"]; // 房间聊天文本输入框
                this._btnFace1 = this._res["btn_face2"]; // 表情按钮1
                this._btnFace1["name"] = "btn_face1";
                if (this._res["btn_face3"]) {
                    this._btnFace2 = this._res["btn_face3"]; // 表情按钮2
                    this._btnFace2["name"] = "btn_face2";
                }
                this._imgFace = this._res["img_biaoqing"]; // 表情列表组
                this._faceList = this._res["list_biaoqing"]; // 表情列表
                this._boxWorld.visible = false;
                this._boxRoom.visible = false;
                this._imgFace.visible = false;
                // 世界聊天  房间聊天
                this._tab.selectHandler = Laya.Handler.create(this, this.onTabChange, null, false);
                if (GameVar.g_platformData["chat_config"] && GameVar.g_platformData["chat_config"]["tabs"]) {
                    this._tab.labels = GameVar.g_platformData["chat_config"]["tabs"];
                    //this._typeNumber = this._tab.items.length;
                }
                this._typeNumber = this._tab.items.length;
                // 聊天内容列表
                this._takeList.vScrollBar.autoHide = true;
                this._takeList.vScrollBar.elasticBackTime = 100;
                this._takeList.vScrollBar.elasticDistance = 100;
                var str = utils.StringUtility.format(getDesByLan("最多输入{0}个字"), [50]);
                // 世界聊天文本输入框
                this._textInputWorld.maxChars = 50;
                this._textInputWorld.prompt = str;
                this._txtLaBa.text = "0";
                // 房间聊天文本输入框
                this._textInputRoom.maxChars = 50;
                this._textInputRoom.prompt = str;
                // 表情列表
                this._faceList.selectedIndex = 0;
                this._faceList.selectEnable = true;
                this._faceList.renderHandler = Laya.Handler.create(this, this.onFaceListRender, null, false);
                // 当前表情类型(1通用表情 2动物乐园表情)
                this._curFaceType = 0;
                this._selectIndex1 = 0; // 通用表情当前选择的表情下标
                this._selectIndex2 = 0; // 动物表情当前选择的表情下标
                this._lastSendTime_face = this._lastSendTime_world = 0;
            };
            /**
            * 界面显示
            */
            WorldChat.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                // 世界聊天  房间聊天
                if (this._tab.items.length > 1)
                    this._tab.selectedIndex = 1;
                else
                    this._tab.selectedIndex = 0;
                this.onTabChange();
                // 发送按钮
                this._btnSend.on(laya.events.Event.CLICK, this, this.onSend);
                // 表情按钮1
                this._btnFace1.on(laya.events.Event.CLICK, this, this.onFaceList);
                // 表情按钮2
                if (this._btnFace2) {
                    this._btnFace2.on(laya.events.Event.CLICK, this, this.onFaceList);
                }
            };
            // 切换世界聊天 房间聊天
            WorldChat.prototype.onTabChange = function (evt) {
                var index = this._tab.selectedIndex;
                // var temp:any = this._tab.items[index];
                if (index == 0) // 世界聊天
                 {
                    if (this._typeNumber == 2)
                        this.showWorldChat();
                    else
                        this.showRoomChat();
                }
                else if (index == 1) // 房间聊天
                 {
                    this.showRoomChat();
                }
            };
            WorldChat.prototype.showWorldChat = function () {
                console.log("世界聊天！！！！！！！！");
                this._boxWorld.visible = true;
                this._boxRoom.visible = false;
                // 显示世界聊天记录
                this.showTalkData(WorldChatData.s_instance.m_worldTakeData);
                // 喇叭数量
                this._txtLaBa.text = "" + gamelib.data.UserInfo.s_self.m_laba;
                // 表情列表
                this._imgFace.visible = false;
                this._textInputRoom.text = '';
            };
            WorldChat.prototype.showRoomChat = function () {
                console.log("房间聊天！！！！！！！！");
                this._boxWorld.visible = false;
                this._boxRoom.visible = true;
                // 显示房间聊天记录
                this.showTalkData(WorldChatData.s_instance.m_roomTakeData);
                this._textInputWorld.text = '';
            };
            /**
             * 界面关闭
             */
            WorldChat.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                // 发送按钮
                this._btnSend.off(laya.events.Event.CLICK, this, this.onSend);
                // 表情按钮
                this._btnFace1.off(laya.events.Event.CLICK, this, this.onFaceList);
                // 表情按钮2
                if (this._btnFace2) {
                    this._btnFace2.off(laya.events.Event.CLICK, this, this.onFaceList);
                }
                this._curFaceType = 0;
                this._imgFace.visible = false;
            };
            /**
             * 销毁
             */
            WorldChat.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };
            WorldChat.prototype.reciveNetMsg = function (msgId, data) {
                _super.prototype.reciveNetMsg.call(this, msgId, data);
                switch (msgId) {
                    case 0x2215:
                        if (data.result != 1) { // 没有成功  
                            return;
                        }
                        if (data.type == 1) //接到的消息是房间聊天
                         {
                            if (this._typeNumber == 1 || this._tab.selectedIndex == 1)
                                this.addTalkData(data);
                        }
                        else //接到的消息是世界聊天
                         {
                            if (this._typeNumber == 2 && this._tab.selectedIndex == 0)
                                this.addTalkData(data);
                        }
                        // if(this._tab.selectedIndex == 0 && data.type != 1) {    // 显示的是世界聊天  并且 接到的消息是世界聊天
                        //     this.addTalkData(data);
                        // } else if(this._tab.selectedIndex == 1 && data.type == 1){ //  显示的是房间聊天  并且 接到的消息是房间聊天
                        //     this.addTalkData(data);
                        // }
                        break;
                    case 0x0036:
                        // 喇叭数量
                        this._txtLaBa.text = "" + gamelib.data.UserInfo.s_self.m_laba;
                        break;
                }
            };
            /**
             *    显示聊天内容
             */
            WorldChat.prototype.showTalkData = function (data) {
                // 检查参数
                if (data == null) {
                    console.log("WorldChat::showTalkData 参数data为空！！！");
                    return;
                }
                // 移除旧的聊天记录
                this._takeList.removeChildren();
                // 位置重新计算
                this._curMsgPosY = 0;
                // 聊天记录添加到显示容器里
                for (var i = 0; i < data.length; i++) {
                    var item = new TalkItem_World();
                    item.setData(data[i], this._takeList.width, 740);
                    item.y = this._curMsgPosY;
                    this._takeList.addChild(item);
                    this._curMsgPosY += item.height;
                }
                // 刷新位置
                this._takeList.refresh();
                if (this._takeList.height < this._curMsgPosY) {
                    this._takeList.scrollTo(0, this._curMsgPosY - this._takeList.height);
                }
            };
            /**
             *    添加聊天记录
             */
            WorldChat.prototype.addTalkData = function (data) {
                // 检查参数
                if (data == null) {
                    console.log("WorldChat::addTalkData 参数data为空！！！");
                    return;
                }
                // 添加聊天记录
                var item = new TalkItem_World();
                item.setData(data, this._takeList.width, 740);
                item.y = this._curMsgPosY;
                this._takeList.addChild(item);
                this._curMsgPosY += item.height;
                // 刷新位置
                this._takeList.refresh();
                if (this._takeList.height < this._curMsgPosY) {
                    this._takeList.scrollTo(0, this._curMsgPosY - this._takeList.height);
                }
                // 显示聊天记录达到上限
                if (this._takeList.numChildren > this._maxShowData) {
                    // 删除第一条
                    this._takeList.removeChildAt(0);
                    // 重新排版
                    this.recountChildrenPosY();
                }
            };
            /**
             *    重新计算聊天记录的位置
             */
            WorldChat.prototype.recountChildrenPosY = function () {
                this._curMsgPosY = 0;
                for (var i = 0; i < this._takeList.numChildren; i++) {
                    var item = this._takeList.getChildAt(i);
                    if (item) {
                        item.y = this._curMsgPosY;
                        this._curMsgPosY += item.height;
                    }
                }
            };
            // 表情 
            WorldChat.prototype.onFaceListRender = function (item, index) {
                if (this._curFaceType == 1) {
                    getChildByName(item, "btn_face1").skin = "qpq/face/btn_face_" + this._faceList.dataSource[index] + ".png";
                    var imgFace = getChildByName(item, "img_face1");
                    if (index == this._faceList.selectedIndex) {
                        imgFace.visible = true;
                        this._selectIndex1 = index;
                    }
                    else {
                        imgFace.visible = false;
                    }
                }
                else if (this._curFaceType == 2) {
                    getChildByName(item, "btn_face1").skin = GameVar.s_namespace + "/face/btn_face_" + this._faceList.dataSource[index] + ".png";
                    var imgFace = getChildByName(item, "img_face1");
                    if (index == this._faceList.selectedIndex) {
                        imgFace.visible = true;
                        this._selectIndex2 = index;
                    }
                    else {
                        imgFace.visible = false;
                    }
                }
            };
            /**
             *
             * 发送消息
             * @param evt
             */
            WorldChat.prototype.onSend = function (evt) {
                playButtonSound();
                var time = Laya.timer.currTimer;
                if (this._imgFace.visible) { // 发送表情
                    // 发送表情的等级限制
                    if (gamelib.data.UserInfo.s_self.m_level < GameVar.g_platformData['chat_config']['face_level']) {
                        var str = utils.StringUtility.format(getDesByLan("等级不足{0}级"), [GameVar.g_platformData['chat_config']['face_level']]);
                        g_uiMgr.showAlertUiByArgs({ msg: str });
                        return;
                    }
                    if (time - this._lastSendTime_face < GameVar.g_platformData["chat_config"].face_cd) {
                        g_uiMgr.showTip(getDesByLan("请稍候再发"));
                        return;
                    }
                    this._lastSendTime_face = time;
                    if (this._curFaceType == 1) { // 通用表情
                        var content = "" + (this._selectIndex1 + 1);
                        sendNetMsg(0x2215, 1, 1, content);
                        this.sendFaceFunction(this._selectIndex1);
                    }
                    else { // 动物表情
                        var content = "" + (this._selectIndex2 + 31);
                        sendNetMsg(0x2215, 1, 1, content);
                        this.sendFaceFunction(this._selectIndex2 + 30);
                    }
                    this._imgFace.visible = false;
                }
                else { // 发送文字
                    if (gamelib.data.UserInfo.s_self.m_level < GameVar.g_platformData['chat_config']['input_level']) { // 玩家等级限制
                        var str = utils.StringUtility.format(getDesByLan("等级不足{0}级"), [GameVar.g_platformData['chat_config']['input_level']]);
                        g_uiMgr.showTip(str, true);
                        return;
                    }
                    var msg = "";
                    switch (this._tab.selectedIndex) {
                        case 0: // 世界聊天
                            if (this._typeNumber == 2) {
                                msg = this._textInputWorld.text;
                                if (gamelib.data.UserInfo.s_self.m_laba <= 0) {
                                    g_uiMgr.showAlertUiByArgs({ msg: "您的喇叭不足，请先补充道具后再发送!" });
                                    return;
                                }
                            }
                            else {
                                msg = this._textInputRoom.text;
                            }
                            break;
                        case 1: // 房间聊天
                            msg = this._textInputRoom.text;
                            break;
                    }
                    if (msg == '') {
                        g_uiMgr.showTip(getDesByLan("无法发送空内容"), true);
                        return;
                    }
                    if (time - this._lastSendTime_world < GameVar.g_platformData["chat_config"].input_cd) {
                        g_uiMgr.showTip(getDesByLan("请稍候再发"));
                        return;
                    }
                    this._lastSendTime_world = time;
                    if (msg.length > 50) {
                        msg = msg.slice(0, 50);
                        msg += "...";
                    }
                    switch (this._tab.selectedIndex) {
                        case 0: // 世界聊天
                            if (this._typeNumber == 2) {
                                sendNetMsg(0x2215, 2, 0, msg);
                                this._textInputWorld.text = '';
                            }
                            else {
                                sendNetMsg(0x2215, 1, 0, msg);
                                this._textInputRoom.text = '';
                            }
                            break;
                        case 1: // 房间聊天
                            sendNetMsg(0x2215, 1, 0, msg);
                            this._textInputRoom.text = '';
                            break;
                    }
                }
            };
            /**
             *
             * 显示表情列表
             * @param evt
             */
            WorldChat.prototype.onFaceList = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_face1": // 表情1
                        if (this._curFaceType != 1) {
                            this._curFaceType = 1;
                            this._faceList.dataSource = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
                            this._imgFace.visible = true;
                        }
                        else {
                            this._imgFace.visible = !this._imgFace.visible;
                        }
                        break;
                    case "btn_face2": // 表情2
                        if (this._curFaceType != 2) {
                            this._curFaceType = 2;
                            this._faceList.dataSource = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
                            this._imgFace.visible = true;
                        }
                        else {
                            this._imgFace.visible = !this._imgFace.visible;
                        }
                        break;
                }
            };
            /**
             * 发送表情函数
             * @param index
             */
            WorldChat.prototype.sendFaceFunction = function (index) {
                sendNetMsg(0x00C0, 1, gamelib.data.UserInfo.s_self.m_id, index);
            };
            return WorldChat;
        }(gamelib.core.Ui_NetHandle));
        chat.WorldChat = WorldChat;
        /**
         *    聊天内容
         */
        var TalkItem_World = /** @class */ (function (_super) {
            __extends(TalkItem_World, _super);
            function TalkItem_World() {
                var _this = _super.call(this) || this;
                _this._headSize = 64; // 头像尺寸
                _this._MRWidth = 44; // 军衔宽度
                _this._MRHeight = 39; // 军衔高度
                _this._msgMaxWidth = 740; // 显示消息的最大宽度
                _this._faceSize = 39; // 表情的最大尺寸
                _this._showType = 0; // 显示的类型(0文字消息 1表情)
                _this._bgSizeGrid = "15,15,15,15";
                // 头像
                _this._head = new Laya.Image();
                _this._head.size(_this._headSize, _this._headSize);
                _this.addChild(_this._head);
                // 军衔
                _this._militaryRank = new Laya.Image;
                _this._militaryRank.size(_this._MRWidth, _this._MRHeight);
                _this.addChild(_this._militaryRank);
                // 昵称
                _this._name = new Laya.Label();
                _this._name.color = "#EFEFEF";
                _this._name.fontSize = 18;
                _this.addChild(_this._name);
                // 背景
                _this._bg = new Laya.Image();
                _this._bg.sizeGrid = _this._bgSizeGrid;
                _this.addChild(_this._bg);
                // 消息
                _this._msg = new Laya.Label();
                _this._msg.fontSize = 24;
                _this.addChild(_this._msg);
                // 表情
                _this._face = new Laya.Image();
                _this._face.size(_this._headSize, _this._headSize);
                _this.addChild(_this._face);
                return _this;
            }
            /**
             * 设置要显示的内容
             * @ data 显示的内容数据
             * @ width 宽度
             * @ msgMaxWidth 消息字符最多显示的宽度
             */
            TalkItem_World.prototype.setData = function (data, width, msgMaxWidth) {
                // 参数判断
                if (data == null) {
                    console.log("TalkItem_World::setData 参数data为空！！！");
                    return;
                }
                this.width = width;
                this._msgMaxWidth = msgMaxWidth;
                var self_name = "#834f24"; // 玩家自己名字颜色
                var self_msg = "#834f24"; // 玩家自己信息颜色
                var other_name = "#272625"; // 其他玩家名字颜色
                var other_msg = "#474747"; // 其他玩家信息颜色
                var system_name = "#272625"; // 系统名字颜色
                var system_msg = "#E44530"; // 系统信息颜色
                var temp = GameVar.g_platformData['chat_color'];
                if (temp) {
                    if (temp['self_name'])
                        self_name = temp['self_name'];
                    if (temp['self_msg'])
                        self_msg = temp['self_msg'];
                    if (temp['other_name'])
                        other_name = temp['other_name'];
                    if (temp['other_msg'])
                        other_msg = temp['other_msg'];
                    if (temp['system_name'])
                        system_name = temp['system_name'];
                    if (temp['system_msg'])
                        system_msg = temp['system_msg'];
                }
                this._isSystem = data.PID == 0;
                this._isSelf = data.PID == gamelib.data.UserInfo.s_self.m_pId;
                // 匹配颜色
                if (this._isSelf) {
                    this._msg.color = self_msg;
                    this._name.color = self_name;
                }
                else if (this._isSystem) {
                    this._msg.color = system_msg;
                    this._name.color = system_name;
                }
                else {
                    this._msg.color = other_msg;
                    this._name.color = other_name;
                }
                // 头像
                this._head.skin = data.headUrl;
                // 军衔
                if (!this._isSystem && window['qpq']['getMilitaryRankIcon']) {
                    this._militaryRank.skin = window['qpq']['getMilitaryRankIcon'](data.level);
                }
                else {
                    this._militaryRank.visible = false;
                }
                // 名字
                if (this._isSystem) {
                    this._name.text = data.nickName;
                }
                else {
                    this._name.text = utils.StringUtility.getNameEx(data.nickName, 7) + "(ID:" + data.PID + ")";
                }
                // 消息
                this._msg.text = data.content;
                // 显示的类型(0文字消息 1表情)
                this._showType = data.sign;
                // 消息类型
                if (data.sign == 0) { // 文字消息
                    this._msg.visible = true;
                    this._bg.visible = true;
                    this._face.visible = false;
                }
                else { // 表情消息
                    this._msg.visible = false;
                    this._bg.visible = false;
                    this._face.visible = true;
                    this._face.removeChildren();
                    // var classObj:any = gamelib.getDefinitionByName(GameVar.s_namespace + ".ui.face.Art_face_" + data.content +"UI");
                    // if(classObj == null)
                    //     return;
                    // var face = new classObj();
                    var face = this.getFaceRes(parseInt(data.content));
                    if (face == null)
                        return;
                    if (face.ani1)
                        face.ani1.play();
                    this._face.addChild(face);
                    this._face.scaleX = 0.7;
                    this._face.scaleY = 0.7;
                }
                this.build();
                this.updateSize();
            };
            TalkItem_World.prototype.getFaceRes = function (id) {
                var url = "";
                if (id <= 20) {
                    url = "qpq/face/Art_face_" + (id);
                }
                else {
                    url = GameVar.s_namespace + "/face/Art_face_" + (id);
                }
                return utils.tools.createSceneByViewObj(url);
            };
            TalkItem_World.prototype.updateSize = function () {
                if (this._showType == 0) { // 文字内容
                    // 消息的宽度
                    var msgWidth = this.getMsgWidth(this._msg);
                    if (msgWidth > this._msgMaxWidth) {
                        msgWidth = this._msgMaxWidth;
                    }
                    // 消息的高度
                    var msgHeight = this.getMsgHeight(this._msg, msgWidth);
                    this._msg.width = msgWidth;
                    this._msg.height = msgHeight;
                    this._msg.wordWrap = true;
                    this._bg.width = msgWidth + 20;
                    this._bg.height = msgHeight + 20;
                    this.height = this._headSize + this._bg.height;
                }
                else {
                    this.height = this._headSize + 30;
                }
            };
            TalkItem_World.prototype.build = function () {
                if (this._isSystem || !this._isSelf) { // 系统消息 其他玩家消息
                    // 设置背景图片
                    if (this._isSystem) {
                        this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_1.png";
                        this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_3.png";
                    }
                    else {
                        this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_2.png";
                    }
                    // 设置锚点
                    this._head.anchorX = 0;
                    this._militaryRank.anchorX = 0;
                    this._name.anchorX = 0;
                    this._msg.anchorX = 0;
                    this._bg.anchorX = 0;
                    this._face.anchorX = 0;
                    // 头像
                    this._head.top = 0;
                    this._head.x = 0;
                    // 军衔
                    this._militaryRank.x = this._headSize - this._MRWidth / 2;
                    this._militaryRank.top = this._headSize - this._MRHeight;
                    // 名字
                    this._name.x = this._headSize + 5;
                    this._name.top = 3;
                    // 消息
                    this._msg.x = this._headSize + 35;
                    this._msg.top = this._headSize / 2 + 8;
                    // 背景
                    this._bg.x = this._headSize + 25;
                    this._bg.top = this._headSize / 2;
                    // 表情
                    this._face.x = this._headSize + 30;
                    this._face.top = this._headSize / 2 - 15;
                }
                else {
                    // 设置背景图片
                    this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_1.png";
                    // 设置锚点
                    this._head.anchorX = 1;
                    this._militaryRank.anchorX = 1;
                    this._name.anchorX = 1;
                    this._msg.anchorX = 1;
                    this._bg.anchorX = 1;
                    this._face.anchorX = 1;
                    // 头像
                    this._head.top = 0;
                    this._head.x = this.width;
                    // 军衔
                    this._militaryRank.x = this.width - this._headSize + this._militaryRank.width / 2;
                    this._militaryRank.top = this._headSize - this._MRHeight;
                    // 名字
                    this._name.x = this.width - this._headSize - 5;
                    this._name.top = 3;
                    // 消息
                    this._msg.x = this.width - this._headSize - 35;
                    this._msg.top = this._headSize / 2 + 8;
                    // 背景
                    this._bg.x = this.width - this._headSize - 25;
                    this._bg.top = this._headSize / 2;
                    // 表情
                    this._face.x = this.width - this._headSize - 50;
                    this._face.top = this._headSize / 2 - 15;
                }
            };
            // 获取文字消息的宽度
            TalkItem_World.prototype.getMsgWidth = function (label) {
                var txt = new Laya.Text();
                txt.fontSize = label.fontSize;
                txt.overflow = Laya.Text.HIDDEN;
                txt.text = label.text;
                return txt.width;
            };
            // 获取文字消息的高度
            TalkItem_World.prototype.getMsgHeight = function (label, width) {
                var txt = new Laya.Text();
                txt.fontSize = label.fontSize;
                txt.overflow = Laya.Text.HIDDEN;
                txt.text = label.text;
                txt.width = width;
                txt.wordWrap = true;
                return txt.height;
            };
            return TalkItem_World;
        }(Laya.Box));
        chat.TalkItem_World = TalkItem_World;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        var WorldChatZoo = /** @class */ (function () {
            function WorldChatZoo(res, needClose) {
                if (needClose === void 0) { needClose = true; }
                this._curMsgPosY = 0; // 当前聊天信息显示的坐标Y
                this._maxShowData = 50; // 最多显示聊天记录条数
                this._msgMaxWidth = 360; // 文字最多显示的宽度
                this._res = res["ui_chat"];
                this.init();
                this._needClose = needClose;
            }
            /**
             * 初始化
             */
            WorldChatZoo.prototype.init = function () {
                this._textInput = this._res["txt_input"]; // 文本输入框
                this._btnSend = this._res["btn_send"]; // 发送按钮
                this._takeList = this._res["l_talk"]; // 聊天记录列表
                this._res.visible = false;
                // 最多输入50个字符
                this._textInput.maxChars = 50;
                // 聊天内容列表
                this._takeList.vScrollBar.autoHide = true;
                this._takeList.vScrollBar.elasticBackTime = 100;
                this._takeList.vScrollBar.elasticDistance = 100;
            };
            /**
             * 设置文字显示的最大宽度
            */
            WorldChatZoo.prototype.setMsgMaxWidth = function (width) {
                this._msgMaxWidth = width;
            };
            /**
             * 获取文字显示的最大宽度
            */
            WorldChatZoo.prototype.getMsgMaxWidth = function (width) {
                return this._msgMaxWidth;
            };
            /**
            * 界面显示
            */
            WorldChatZoo.prototype.show = function () {
                this._res.visible = true;
                // 发送按钮
                this._btnSend.on(laya.events.Event.CLICK, this, this.onSend);
                // 聊天内容
                // 显示世界聊天记录
                this.showTalkData(chat.WorldChatData.s_instance.m_roomTakeData);
                if (this._needClose)
                    Laya.stage.on(Laya.Event.CLICK, this, this.onClickStage);
                g_net.addListener(this);
            };
            /**
             * 界面关闭
             */
            WorldChatZoo.prototype.close = function () {
                this._res.visible = false;
                // 发送按钮
                this._btnSend.off(laya.events.Event.CLICK, this, this.onSend);
                if (this._needClose)
                    Laya.stage.off(Laya.Event.CLICK, this, this.onClickStage);
                g_net.removeListener(this);
                g_signal.dispatch("WorldChatZooClose", 0);
            };
            WorldChatZoo.prototype.onClickStage = function (evt) {
                evt.stopPropagation();
                if (this.isChild(evt.target, this._res)) {
                    return;
                }
                this.close();
            };
            WorldChatZoo.prototype.isChild = function (target, container) {
                if (target == container)
                    return true;
                for (var i = 0; i < container.numChildren; i++) {
                    if (this.isChild(target, container.getChildAt(i)))
                        return true;
                }
                return false;
            };
            /**
             * 销毁
             */
            WorldChatZoo.prototype.destroy = function () {
                this._textInput = null;
                this._btnSend = null;
                this._takeList = null;
            };
            /**
             *    接受网络协议
             */
            WorldChatZoo.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x2215:
                        if (data.type == 1 && data.result == 1) // 房间聊天
                         {
                            this.addTalkData(data);
                        }
                        break;
                }
            };
            /**
             *
             * 发送消息
             * @param evt
             */
            WorldChatZoo.prototype.onSend = function (evt) {
                playButtonSound();
                if (gamelib.data.UserInfo.s_self.m_level < GameVar.g_platformData['chat_config']['input_level']) { // 玩家等级限制
                    var str = utils.StringUtility.format(getDesByLan("等级不足{0}级"), [GameVar.g_platformData['chat_config']['input_level']]);
                    g_uiMgr.showTip(str, true);
                    return;
                }
                var msg = this._textInput.text;
                if (msg == '') {
                    g_uiMgr.showTip(getDesByLan("无法发送空内容"), true);
                    return;
                }
                if (msg.length > 50) {
                    msg = msg.slice(0, 50);
                    msg += "...";
                }
                // 发送聊天内容
                sendNetMsg(0x2215, 1, 0, msg);
                this._textInput.text = '';
            };
            /**
            *    显示聊天内容
            */
            WorldChatZoo.prototype.showTalkData = function (data) {
                // 检查参数
                if (data == null) {
                    console.log("WorldChat::showTalkData 参数data为空！！！");
                    return;
                }
                // 移除旧的聊天记录
                this._takeList.removeChildren();
                // 位置重新计算
                this._curMsgPosY = 0;
                // 聊天记录添加到显示容器里
                for (var i = 0; i < data.length; i++) {
                    var item = new gamelib.chat.TalkItem_World();
                    item.setData(data[i], this._takeList.width, this._msgMaxWidth);
                    item.y = this._curMsgPosY;
                    this._takeList.addChild(item);
                    this._curMsgPosY += item.height;
                }
                // 刷新位置
                this._takeList.refresh();
                if (this._takeList.height < this._curMsgPosY) {
                    this._takeList.scrollTo(0, this._curMsgPosY - this._takeList.height);
                }
            };
            /**
             *    添加聊天记录
             */
            WorldChatZoo.prototype.addTalkData = function (data) {
                // 检查参数
                if (data == null) {
                    console.log("WorldChat::addTalkData 参数data为空！！！");
                    return;
                }
                // 添加聊天记录
                var item = new gamelib.chat.TalkItem_World();
                item.setData(data, this._takeList.width, this._msgMaxWidth);
                item.y = this._curMsgPosY;
                this._takeList.addChild(item);
                this._curMsgPosY += item.height;
                // 刷新位置
                this._takeList.refresh();
                if (this._takeList.height < this._curMsgPosY) {
                    this._takeList.scrollTo(0, this._curMsgPosY - this._takeList.height);
                }
                // 显示聊天记录达到上限
                if (this._takeList.numChildren > this._maxShowData) {
                    // 删除第一条
                    this._takeList.removeChildAt(0);
                    // 重新排版
                    this.recountChildrenPosY();
                }
            };
            /**
             *    重新计算聊天记录的位置
             */
            WorldChatZoo.prototype.recountChildrenPosY = function () {
                this._curMsgPosY = 0;
                for (var i = 0; i < this._takeList.numChildren; i++) {
                    var item = this._takeList.getChildAt(i);
                    if (item) {
                        item.y = this._curMsgPosY;
                        this._curMsgPosY += item.height;
                    }
                }
            };
            return WorldChatZoo;
        }());
        chat.WorldChatZoo = WorldChatZoo;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var childGame;
    (function (childGame) {
        /**
         * @class
         * 子游戏模块
         *  var gz_idA:number = GameVar.gz_id;
         *  var gz_idB:number = GameVar.target_gz_id;
         *  var gz_idC:number = data.gameId;   服务器通知要进入的游戏分区
         *  通过0x0014和0x0015来控制进哪个游戏。
         *  在配置文件载入后，会设置当前平台下有哪些游戏。每个游戏的开发技术是laya还是白鹭
         *  如果是laya，会直接载入子游戏，否则会跳转游戏
         *
         * @implements core.INet
         * @author wx
         *
         */
        var ChildGame = /** @class */ (function () {
            function ChildGame() {
                this._enterGameGz_idByClient = 0;
                this._validation = "";
                this._game_args = null;
                this._gzIdToGameId = {};
                this._web = new gamelib.childGame.WebDataHander(this._gzIdToGameId);
                //this._net = new gamelib.childGame.ServerDataHander();
                this._quitGame = new gamelib.childGame.QuitGame(this._web);
                this._enterGame = new gamelib.childGame.EnterGame(this._web);
            }
            Object.defineProperty(ChildGame.prototype, "m_web", {
                get: function () {
                    return this._web;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @function quitChild
             * 返回棋牌圈
             * @param jsonData
             */
            ChildGame.prototype.toCircle = function (jsonData) {
                this.quitChild(jsonData);
            };
            /**
             * @function quitChild
             * 退出子游戏。
             * 1、先销毁子游戏。
             * 2、销毁子游戏的数据
             * 3、重新显示主游戏
             *
             * @param {any} jsonData [description]
             */
            ChildGame.prototype.quitChild = function (jsonData) {
                g_signal.dispatch("showEnterGameLoading", 1);
                if (this._enterGame.m_childGame) {
                    this._enterGame.m_childGame.destroy();
                    this._enterGame.m_childGame = null;
                }
                GameVar.destroy();
                gamelib.chat.ChatPanel.destroy();
                g_gameMain.reshow(jsonData);
                gamelib.chat.RecordSystem.s_instance.destroy();
            };
            ChildGame.prototype.hasChildGame = function () {
                return this._enterGame.m_childGame != null;
            };
            /**
             * 指定分区游戏是否是laya开发
             * @function addGameIdConfig
             * @DateTime 2018-03-17T13:59:13+0800
             * @param    {number}                 gz_id      [description]
             * @param    {number}                 gameId     [description]
             * @param    {boolean}                isLayaGame [description]
             */
            ChildGame.prototype.addGameIdConfig = function (gz_id, gameId, isLayaGame) {
                this._gzIdToGameId[gz_id] = { gameId: gameId, isLayaGame: isLayaGame };
            };
            /**
             * 主要处理0x0014协议
             * data.type == 0 表示进入data.gameId的游戏
             * data.type == 1 表示退出data.gameId的游戏
             * @function
             * @DateTime 2018-03-17T13:59:56+0800
             * @param    {number}                 msgId [description]
             * @param    {any}                    data  [description]
             */
            ChildGame.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x0014:
                        if (GameVar.urlParam['isChildGame']) //子游戏不处理
                            return;
                        if (data.type == 0) //进入
                         {
                            var gz_idA = GameVar.gz_id;
                            var gz_idC = data.gameId;
                            if (gz_idA == gz_idC) {
                                // g_signal.dispatch('closeEnterGameLoading',0);
                                return;
                            }
                            this._enterGame.enterGame(gz_idC);
                        }
                        else {
                            //退出游戏
                            if (data.result == 1) {
                                return;
                            }
                            if (data.gameId == GameVar.gz_id) {
                                sendNetMsg(0x002D);
                            }
                            if (this._enterGameGz_idByClient != 0) {
                                this._enterGame.enterGame(this._enterGameGz_idByClient, this._validation, this._game_args);
                            }
                        }
                        break;
                    case 0x0015:
                        if (data.result == 1) {
                            if (this._enterGameGz_idByClient != undefined && this._enterGameGz_idByClient != 0) {
                                this._enterGame.enterGame(this._enterGameGz_idByClient, this._validation, this._game_args);
                            }
                            else {
                                //this.quitGameStep3(1,GameVar.gz_id);
                            }
                        }
                        else {
                            console.log("数据拷贝失败，不能退出当前游戏");
                        }
                        break;
                }
            };
            /**
             * @method
             * 客服端主动请求进入一个游戏
             * 1、退出当前游戏
             * 2、如果成功，获取gz_id的调用application_login_game获取登陆串;enterGameByClientStep1
             * 3、跳转游戏;enterGameByClientStep2
             *
             * @param validation 棋牌圈 验证码
             * @param game_args 传递参数。{}对象。
             * @param gz_id
             */
            ChildGame.prototype.enterGameByClient = function (gz_id, selfIsMain, validation, game_args) {
                if (selfIsMain === void 0) { selfIsMain = true; }
                if (validation === void 0) { validation = null; }
                if (game_args === void 0) { game_args = null; }
                // console.time("enterGame");
                g_signal.dispatch('enterChildGame');
                this._enterGameGz_idByClient = gz_id;
                this._validation = validation;
                this._game_args = game_args;
                this._selfIsMainGzid = selfIsMain;
                var pid = GameVar.pid;
                var tgz_id = GameVar.gz_id;
                var self = this;
                this._enterGame.enterGame(gz_id, this._validation, this._game_args);
            };
            /**
             * 进入比赛
             * @function
             * @DateTime 2018-06-07T19:34:15+0800
             */
            ChildGame.prototype.enterMatch = function (gz_id, matchId, bSendNetMsg) {
                if (bSendNetMsg === void 0) { bSendNetMsg = true; }
                var obj = {
                    'matchId': matchId
                };
                if (bSendNetMsg)
                    sendNetMsg(0x2708, matchId);
                g_childGame.enterGameByClient(gz_id, true, null, obj);
                g_signal.dispatch("enterMatch", matchId);
            };
            /**
             * 观战
             * @function
             * @DateTime 2018-06-07T19:34:10+0800
             */
            ChildGame.prototype.guanZhan = function (gz_id, matchId, deskId) {
                g_childGame.enterGameByClient(gz_id, true, null, { gzInfo: { "matchId": matchId, "deskId": deskId } });
                g_signal.dispatch("guanZhan", 0);
            };
            /**
             * 清理游戏缓存的登录信息
             * @function
             * @DateTime 2018-06-28T11:40:58+0800
             * @param    {number}                 gz_id [description]
             */
            ChildGame.prototype.clearGameInfo = function (gz_id) {
                this._web.clearGameInfo(gz_id);
            };
            /**
             * 修改指定游戏的缓存信息
             * @function
             * @DateTime 2018-06-28T11:43:37+0800
             * @param    {number}                 gz_id [description]
             * @param    {string}                 att   [description]
             * @param    {string}                 value [description]
             */
            ChildGame.prototype.modifyGameInfo = function (gz_id, att, value) {
                this._web.modifyGameInfo(gz_id, att, value);
            };
            return ChildGame;
        }());
        childGame.ChildGame = ChildGame;
    })(childGame = gamelib.childGame || (gamelib.childGame = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/13.
 */
var gamelib;
(function (gamelib) {
    var childGame;
    (function (childGame) {
        /**
         * 进入子游戏的逻辑
         * @class EnterGame
         */
        var EnterGame = /** @class */ (function () {
            function EnterGame(web) {
                this._web = web;
                this._game_jsList = {};
                this._loadingGames = {};
                this._gameLoaders = new childGame.GameLoaderMgr();
            }
            /**
             * 进入指定游戏。
             * 1、先检测是否是app和app是否有新的缓存包需要下载
             * 2、检测要进入的游戏是否是laya模式
             * 3、获取对应的分区信息
             * 4、加载或者跳转游戏
             *
             * @function enterGame
             * @DateTime 2018-03-17T14:01:46+0800
             * @param    {number}                 gz_id      [description]
             * @param    {string}                 validation [如果是组局房，需要把房号加上]
             * @param    {string}                 game_args  [如果进入游戏后要做默认的处理（比如进如指定的房间),可以通过设置这个参数来实现]
             */
            EnterGame.prototype.enterGame = function (gz_id, validation, game_args) {
                this._game_args = game_args;
                this._validation = validation;
                this._gz_id = gz_id;
                if (this._gameLoaders.checkLoaderValid()) {
                    var bCache = this._gameLoaders.loadGame(gz_id, Laya.Handler.create(this, this.enterGame_1, null, false), Laya.Handler.create(this, this.onLoaderProcess, null, false));
                    if (bCache) {
                        g_signal.dispatch("showEnterGameLoadingMini", 0);
                    }
                    else {
                        g_signal.dispatch("showEnterGameLoading", 0);
                    }
                }
                else {
                    g_signal.dispatch("showEnterGameLoading", 0);
                    this.enterGame_1(gz_id);
                }
            };
            EnterGame.prototype.onLoaderProcess = function (pro) {
                g_loading.onCacheProgress(pro + "");
            };
            EnterGame.prototype.enterGame_1 = function (gz_id) {
                if (this._web.checkGameIsLaya(gz_id)) {
                    this._web.getGameInfo(gz_id, this.enterLayaGame, this);
                }
                else {
                    this._web.getLoginInfo(gz_id, this.enterNormalGame, this);
                }
            };
            /**
             * 跳转到指定的游戏
             * @function enterNormalGame
             * @DateTime 2018-03-17T14:05:42+0800
             * @param    {any}                    obj [description]
             */
            EnterGame.prototype.enterNormalGame = function (obj) {
                console.log("enterNormalGame");
                if (obj.status == 0) {
                    g_uiMgr.showAlertUiByArgs({ msg: obj.msg });
                    return;
                }
                var str = "";
                if (this._validation != null) {
                    var circle_args = { "validation": this._validation };
                    str = JSON.stringify(circle_args);
                    str = "&circle_args=" + encodeURIComponent(str);
                }
                if (this._game_args != null) {
                    var game_args = JSON.stringify(this._game_args);
                    str += "&game_args=" + encodeURIComponent(game_args);
                }
                var url = obj.data.url + "&gameMode=1" + str;
                window.location.href = url;
            };
            /**
             * 进入laya模式的子游戏
             * 1、需要把子游戏的相关参数设置为window["child_params"]
             * 2、检测是否已经载入过改游戏的js，
             * 3、载入子游戏的js
             * 4、创建子游戏的实例对象,子游戏的显示和主游戏的关闭在GameMain类中实现
             * @function enterLayaGame
             * @DateTime 2018-03-17T14:06:12+0800
             * @param    {any}                    obj [description]
             */
            EnterGame.prototype.enterLayaGame = function (obj) {
                console.log("enterGameStep2:" + JSON.stringify(obj));
                //g_signal.dispatch("closeQpqLoadingUi",{msg:"请等待..."});
                if (obj == null) {
                    g_uiMgr.showAlertUiByArgs({ msg: "不支持h5版本" });
                    return;
                }
                if (obj.status == 0) {
                    g_uiMgr.showAlertUiByArgs({ msg: obj.msg });
                }
                else {
                    var url = GameVar.resource_path + "js/" + obj.game_code.split("_")[0] + "/main.js";
                    if (GameVar.urlParam['game_path'].indexOf("localhost") == -1) {
                        url += "?ver=" + obj.game_ver;
                    }
                    if (this._loadingGames[url]) {
                        console.log("已经有一个子游戏了");
                        return;
                    }
                    this._params = obj;
                    this._params.circle_args = null;
                    this._params.game_args = null;
                    var str = "";
                    if (this._validation != null) {
                        var circle_args = { "validation": this._validation };
                        str = JSON.stringify(circle_args);
                        this._params.circle_args = str;
                    }
                    if (this._game_args != null) {
                        var game_args = JSON.stringify(this._game_args);
                        this._params.game_args = game_args;
                    }
                    this._params.pid = GameVar.pid;
                    this._params.gender = GameVar.urlParam["gender"];
                    this._params.icon_url = GameVar.playerHeadUrl;
                    this._params.nickname = GameVar.nickName;
                    this._params.platform = GameVar.platform;
                    this._params.isChildGame = true;
                    this._params.game_path = GameVar.urlParam['game_path'];
                    this._params.ftp = GameVar.urlParam['ftp'];
                    this._params.request_host = GameVar.urlParam['request_host'];
                    this._params.client_access_key = GameVar.urlParam['client_access_key'];
                    this._params.client_access_token = GameVar.urlParam['client_access_token'];
                    window["child_params"] = this._params;
                    var bLoaded = this._game_jsList[url];
                    if (bLoaded) {
                        this.createGame();
                    }
                    else {
                        this.loadScript(url);
                    }
                }
            };
            EnterGame.prototype.createGame = function () {
                if (this.m_childGame) {
                    console.log("已经有一个子游戏了");
                    return;
                }
                var gameCode = this._params.game_code.split("_")[0];
                var cl = window[gameCode];
                this.m_childGame = new cl();
            };
            EnterGame.prototype.loadScript = function (url) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                var self = this;
                this._loadingGames[url] = true;
                script.onload = function () {
                    console.log("jsLoaded!");
                    delete self._loadingGames[url];
                    self.createGame();
                    self._game_jsList[url] = true;
                };
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            };
            return EnterGame;
        }());
        childGame.EnterGame = EnterGame;
    })(childGame = gamelib.childGame || (gamelib.childGame = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var childGame;
    (function (childGame) {
        var GameLoaderMgr = /** @class */ (function () {
            function GameLoaderMgr() {
                this._loaders = {};
            }
            GameLoaderMgr.prototype.checkLoaderValid = function () {
                return utils.tools.isApp() && window['application_check_game_cache'] != null;
            };
            /**
             * 载入游戏
             * @function
             * @DateTime 2019-06-14T17:38:07+0800
             * @param    {number}                 gz_id    [description]
             * @param    {Laya.Handler}           complete [description]
             * @param    {Laya.Handler}           progress [description]
             * @return   {boolean}                         [是否用的cache。如果是用的cache,不需要展示apploading]
             */
            GameLoaderMgr.prototype.loadGame = function (gz_id, complete, progress) {
                var loader = this._loaders[gz_id];
                var bCache = true;
                if (loader == null) {
                    bCache = false;
                    loader = new GameLoader(gz_id);
                    this._loaders[gz_id] = loader;
                }
                loader.load(complete, progress);
                return bCache;
            };
            return GameLoaderMgr;
        }());
        childGame.GameLoaderMgr = GameLoaderMgr;
        var GameLoader = /** @class */ (function () {
            function GameLoader(gz_id) {
                this.gz_id = gz_id;
                this._completes = [];
                this._progresss = [];
                this._jd = 0;
                this._status = 0;
            }
            GameLoader.prototype.load = function (complete, progress) {
                if (this._status == 2) {
                    progress && progress.runWith(100);
                    complete && complete.runWith(this.gz_id);
                    return;
                }
                this._completes.push(complete);
                this._progresss.push(progress);
                if (this._status == 0) {
                    this._status = 1;
                    this._jd = "";
                    this._loader = window['application_check_game_cache'](this.gz_id, this.onLoaded, this);
                    Laya.timer.loop(100, this, this.checkProgress);
                }
                progress && progress.runWith(this._jd);
            };
            GameLoader.prototype.stop = function () {
                this._status = 0;
                Laya.timer.clearAll(this);
            };
            GameLoader.prototype.onLoaded = function () {
                this._jd = 100;
                this._status = 2;
                for (var _i = 0, _a = this._progresss; _i < _a.length; _i++) {
                    var handle = _a[_i];
                    handle.runWith(100);
                }
                for (var _b = 0, _c = this._completes; _b < _c.length; _b++) {
                    var handle = _c[_b];
                    handle.runWith(this.gz_id);
                }
                this._progresss.length = this._completes.length = 0;
                Laya.timer.clearAll(this);
            };
            GameLoader.prototype.checkProgress = function () {
                if (!window['application_check_game_cache']) {
                    return;
                }
                this._jd = this._loader.get_download_percent();
                for (var _i = 0, _a = this._progresss; _i < _a.length; _i++) {
                    var handle = _a[_i];
                    handle.runWith(this._jd);
                }
            };
            return GameLoader;
        }());
        childGame.GameLoader = GameLoader;
    })(childGame = gamelib.childGame || (gamelib.childGame = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/13.
 */
var gamelib;
(function (gamelib) {
    var childGame;
    (function (childGame) {
        /**
         * 退出游戏逻辑
         * @class QuitGame
         * @deprecated
         */
        var QuitGame = /** @class */ (function () {
            function QuitGame(web) {
                this._web = web;
                this._net = new gamelib.childGame.ServerDataHander();
            }
            QuitGame.prototype.quitGame = function (gz_id, callBack) {
                console.log("quitGame" + gz_id);
                this._callBack = callBack;
                if (gz_id == GameVar.gz_id) {
                    var pid = GameVar.pid;
                    var tgz_id = GameVar.gz_id;
                    var ts = GameVar.ts;
                    if (isNaN(ts)) {
                        ts = Laya.timer.currTimer;
                    }
                    var url = new md5().hex_md5(tgz_id + "762ff77aa3f33ebdc57401b2a31eb88d" + pid + ts);
                    sendNetMsg(0x0015, pid, tgz_id, ts, url);
                    return;
                }
                this._web.getGameInfo(gz_id, this.onGetGame_zone_info, this);
            };
            QuitGame.prototype.onGetGame_zone_info = function (ret) {
                var obj = ret.data;
                if (obj.status != 1) {
                    console.log("目标分区的登陆信息获取失败!");
                    return;
                }
                var host;
                host = obj.data["h5s_gamehost"];
                var type = "wss";
                if (host == null || host == "" || typeof host == "undefined") {
                    host = obj.data["h5_gamehost"];
                    type = "ws";
                }
                var arr = host.split(":");
                this._net.quitServer(arr[0], arr[1], GameVar.pid, this.quitGameStep3, this, obj.gz_id, type);
            };
            QuitGame.prototype.quitGameStep3 = function (result, gz_id) {
                console.log("quitGameStep3  " + result);
                if (result == 1) {
                    if (this._callBack != null)
                        this._callBack.apply(null, [true]);
                    if (gz_id == GameVar.gz_id) {
                        sendNetMsg(0x0014, 1, GameVar.gz_id);
                    }
                    return;
                }
                if (this._callBack != null)
                    this._callBack.apply(null, [false]);
                if (gz_id == GameVar.gz_id) {
                    console.log("拷贝数据失败,数据异常");
                    return;
                }
                console.log("拷贝数据失败,数据异常");
                //this.enterGame(gz_id);
            };
            return QuitGame;
        }());
        childGame.QuitGame = QuitGame;
    })(childGame = gamelib.childGame || (gamelib.childGame = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var childGame;
    (function (childGame) {
        /**
         * @class
         * @author wx
         * 负责向目标服务器发送0x0015协议,并检测数据拷贝是否成功
         * @deprecated
         *
         */
        var ServerDataHander = /** @class */ (function () {
            function ServerDataHander() {
            }
            ServerDataHander.prototype.initSocket = function () {
                //var p: any = egret.XML.parse("<root/>");
                var common;
                // var url:string = GameVar.common_ftp + "protocols_common." +g_protocols_type;
                var url = GameVar.common_ftp + "protocols_common." + g_protocols_type + "?ver=" + GameVar.game_ver;
                if (g_protocols_type == "xml") {
                    common = Laya.Utils.parseXMLFromString(Laya.loader.getRes(url)).firstChild;
                }
                else {
                    common = Laya.loader.getRes(url).protocols;
                }
                this._socket = new gamelib.socket.NetSocket(common, null, g_protocols_type == "xml");
                this._socket.on(gamelib.socket.NetSocket.SOCKET_CLOSE, this, this.onClose);
                this._socket.on(gamelib.socket.NetSocket.SOCKET_CONNECTD, this, this.onConnectd);
                this._socket.on(gamelib.socket.NetSocket.SOCKET_GETMSG, this, this.onGetMsg);
            };
            ServerDataHander.prototype.disconnect = function () {
                this._socket.disconnect();
                this._socket.off(gamelib.socket.NetSocket.SOCKET_CLOSE, this, this.onClose);
                this._socket.off(gamelib.socket.NetSocket.SOCKET_CONNECTD, this, this.onConnectd);
                this._socket.off(gamelib.socket.NetSocket.SOCKET_GETMSG, this, this.onGetMsg);
            };
            /**
             * 退出服务器
             * @param ip
             * @param port
             * @param pid
             * @param callback
             * @param thisobj
             * @param gz_id
             */
            ServerDataHander.prototype.quitServer = function (ip, port, pid, callback, thisobj, gz_id, type) {
                if (type === void 0) { type = "ws"; }
                this._status = 1;
                this._callback = callback;
                this._thisobj = thisobj;
                this._pid = pid;
                this._gz_id = gz_id;
                this.initSocket();
                var url = type + "://" + ip + ":" + port;
                this._socket.connectServer(url);
            };
            /**
             * 通知服务器创建牌桌
             * @param ip
             * @param port
             * @param pid
             * @param zjid 创建id
             * @param callback
             * @param thisobj
             * @param gz_id
             */
            ServerDataHander.prototype.noticeServerCreateGame = function (ip, port, pid, args, callback, thisobj) {
                this._status = 2;
                this._callback = callback;
                this._thisobj = thisobj;
                this._pid = pid;
                this._args = args;
                this.initSocket();
                var url = "ws://" + ip + ":" + port;
                this._socket.connectServer(url);
            };
            ServerDataHander.prototype.noticeServerOpGame = function (ip, port, args, callback, thisobj) {
                console.log("开始连接目标服务器!");
                this._status = 3;
                this._callback = callback;
                this._thisobj = thisobj;
                this._args = args;
                this.initSocket();
                var url = "ws://" + ip + ":" + port;
                this._socket.connectServer(url);
            };
            ServerDataHander.prototype.onClose = function () {
                console.log("目标服务器链接关闭!");
            };
            ServerDataHander.prototype.onConnectd = function () {
                console.log("目标服务器连接成功!");
                if (this._status == 1) {
                    var ts = GameVar.ts;
                    var url = new md5().hex_md5(this._gz_id + "762ff77aa3f33ebdc57401b2a31eb88d" + this._pid + ts);
                    this._socket.sendDataByArgs(0x0015, [this._pid, this._gz_id, ts, new md5().hex_md5(this._gz_id + "762ff77aa3f33ebdc57401b2a31eb88d" + this._pid + ts)]);
                }
                else if (this._status == 2) {
                    this._socket.sendDataByArgs(0x00F4, this._args);
                }
                else if (this._status == 3) {
                    this._socket.sendDataByArgs(0x00F6, this._args);
                }
            };
            ServerDataHander.prototype.onGetMsg = function (evt) {
                var data = evt.m_data;
                switch (data.msgId) {
                    case 0x0015:
                        //数据拷贝完成
                        this._callback.call(this._thisobj, data.content.result, this._gz_id);
                        //this.quitGameResult(data.content.result);
                        this.disconnect();
                        break;
                    //case 0x0F3:
                    //	if(this._callback != null)
                    //		this._callback.call(this._thisobj,data.msgId,data.content);
                    //	break;
                    case 0x00F4:
                        if (this._callback != null)
                            this._callback.call(this._thisobj, data.content);
                        this.disconnect();
                        break;
                    case 0x00F6:
                        if (this._callback != null)
                            this._callback.call(this._thisobj, data.content);
                        this.disconnect();
                        break;
                }
            };
            return ServerDataHander;
        }());
        childGame.ServerDataHander = ServerDataHander;
    })(childGame = gamelib.childGame || (gamelib.childGame = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var childGame;
    (function (childGame) {
        /**
         * @class	WebDataHander
         * @author wx
         * 获取登录串相关
         *
         */
        var WebDataHander = /** @class */ (function () {
            function WebDataHander(gzIdToGameId) {
                this._gzIdToGameId = gzIdToGameId;
                this._gameInfoList = {};
            }
            WebDataHander.prototype.checkGameIsLaya = function (gz_id) {
                if (this._gzIdToGameId[gz_id])
                    return this._gzIdToGameId[gz_id].isLayaGame;
                return false;
            };
            /**
             * 获得游戏的登录信息。跳转子游戏会使用
             * @function
             * @DateTime 2018-03-17T15:31:26+0800
             * @param    {number}                 gz_id    [description]
             * @param    {function}             callBack [description]
             * @param    {any}                    thisObj  [description]
             */
            WebDataHander.prototype.getLoginInfo = function (gz_id, callBack, thisObj) {
                var temp = this._gzIdToGameId[gz_id];
                if (temp == null) {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("进入分区失败") + gz_id + " " + g_net.name });
                    return;
                }
                console.log("获得游戏的登录信息 application_login_game");
                window["application_login_game"](gz_id, temp.gameId, callBack.bind(thisObj));
            };
            /**
             * 获取游戏分区信息，进入子游戏会使用
             * @function
             * @DateTime 2018-03-17T14:11:44+0800
             * @param    {number}                 gz_id    [description]
             * @param    {function}             callBack [description]
             * @param    {any}                    thisObj  [description]
             */
            WebDataHander.prototype.getGameInfo = function (gz_id, callBack, thisObj) {
                this._callBack = callBack;
                this._thiObj = thisObj;
                var obj = this._gameInfoList[gz_id];
                if (obj) {
                    callBack.apply(thisObj, [obj]);
                    return;
                }
                var data = getGame_zone_info(gz_id);
                if (data) {
                    var pars = {};
                    pars.result = 0;
                    pars.data = data;
                    this.onGetGame_zone_info(pars);
                }
                else {
                    window["application_game_zone_info"](gz_id, this.onGetGame_zone_info.bind(this));
                }
            };
            /**
             * 清除指定游戏的信息缓存
             * @function
             * @DateTime 2018-06-28T11:41:58+0800
             * @param    {number}                 gz_id [description]
             */
            WebDataHander.prototype.clearGameInfo = function (gz_id) {
                delete this._gameInfoList[gz_id];
            };
            /**
             * 修改指定游戏的信息缓存
             * @function
             * @DateTime 2018-06-28T11:45:15+0800
             * @param    {number}                 gz_id [description]
             * @param    {string}                 att   [description]
             * @param    {string}                 value [description]
             */
            WebDataHander.prototype.modifyGameInfo = function (gz_id, att, value) {
                var temp = this._gameInfoList[gz_id];
                if (temp == null)
                    return;
                temp[att] = value;
            };
            WebDataHander.prototype.onGetGame_zone_info = function (ret) {
                console.log(JSON.stringify(ret));
                var obj = ret.data;
                if (ret.result != 0) {
                    console.log("目标分区的登陆信息获取失败!");
                    return;
                }
                this._gameInfoList[obj.gz_id] = obj;
                this._callBack.apply(this._thiObj, [obj]);
            };
            return WebDataHander;
        }());
        childGame.WebDataHander = WebDataHander;
    })(childGame = gamelib.childGame || (gamelib.childGame = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var CommonGameModule = /** @class */ (function () {
            function CommonGameModule(res) {
            }
            CommonGameModule.prototype.show = function () {
            };
            CommonGameModule.prototype.close = function () {
            };
            CommonGameModule.prototype.destroy = function () {
            };
            return CommonGameModule;
        }());
        common.CommonGameModule = CommonGameModule;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        var IOSScreenTipUi = /** @class */ (function (_super) {
            __extends(IOSScreenTipUi, _super);
            function IOSScreenTipUi() {
                return _super.call(this, "qpq.ui.common_Art_ComTips1UI") || this;
            }
            IOSScreenTipUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._res['ani1'].play(0, true);
            };
            IOSScreenTipUi.prototype.onClose = function () {
                this._res['ani1'].stop();
            };
            return IOSScreenTipUi;
        }(gamelib.core.BaseUi));
        control.IOSScreenTipUi = IOSScreenTipUi;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * 互动相关功能，包括聊天泡泡，表情，礼物，弹幕,跑马灯
         */
        var InteractiveSystem = /** @class */ (function () {
            function InteractiveSystem() {
                this._bubbleList = {};
            }
            InteractiveSystem.prototype.destroy = function () {
                if (this._pmd) {
                    this._pmd.destroy();
                }
                if (this._dm) {
                    this._dm.destroy();
                }
                for (var key in this._bubbleList) {
                    var b = this._bubbleList[key];
                    if (b)
                        b.destroy();
                }
                this._bubbleList = null;
                this._getBubble = null;
                this._getFacePos = null;
                this._getGiftPos = null;
                this._giftToggle = null;
                this._danmuToggle = null;
                this._pmd = null;
                this._dm = null;
                this._gift = null;
            };
            InteractiveSystem.prototype.initChatBubble = function (getBubble) {
                this._getBubble = getBubble;
            };
            InteractiveSystem.prototype.initFace = function (getpos) {
                this._getFacePos = getpos;
            };
            InteractiveSystem.prototype.initGift = function (getpos, tipArea) {
                this._getGiftPos = getpos;
                this._gift = this._gift || new gamelib.common.GiftSystem();
                this._gift.init_br(getpos, tipArea);
            };
            InteractiveSystem.prototype.initPmd = function (res) {
                if (this._pmd != null)
                    this._pmd.destroy();
                this._pmd = new gamelib.alert.Pmd();
                this._pmd.setRes(res);
            };
            InteractiveSystem.prototype.initBtns = function (hddj, danMu) {
                this._giftToggle = hddj;
                this._danmuToggle = danMu;
                if (this._danmuToggle) {
                    this._dm = this._dm || new gamelib.chat.DanMu();
                    this._dm.initArea(132, 580);
                }
            };
            InteractiveSystem.prototype.show = function () {
                if (this._gift)
                    this._gift.enable = true;
                if (this._dm)
                    this._dm.enable = true;
                if (this._danmuToggle) {
                    this._danmuToggle.selected = true;
                    this._danmuToggle.on(Laya.Event.CHANGE, this, this.onDanMuToggle);
                }
                if (this._giftToggle) {
                    this._giftToggle.selected = true;
                    this._giftToggle.on(Laya.Event.CHANGE, this, this.onGiftToggle);
                }
                g_net.addListener(this);
            };
            InteractiveSystem.prototype.close = function () {
                g_net.removeListener(this);
            };
            InteractiveSystem.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x002F:
                    case 0x022F:
                        if (this._pmd && data.type == 1) {
                            this._pmd.add(data.msg);
                        }
                        break;
                    case 0x0074:
                        var pd = gamelib.core.getPlayerData(data.sendId);
                        gamelib.chat.ChatPanel.s_instance.onData0x0074(pd, data);
                        if (this._dm)
                            this._dm.onGetMsgByUser(pd, gamelib.chat.ChatPanel.s_instance.getMsgByNetData(data));
                        this.showChatBubble(data);
                        break;
                    case 0x2215: //新版本聊天
                        if (data.result != 1)
                            return;
                        switch (data.type) {
                            case 1:
                                if (data.sign == 0)
                                    this._dm.onGetMsg(data.content, data.vip > 0, data.PID == gamelib.data.UserInfo.s_self.m_pId);
                                break;
                            case 2: // 世界
                                // 跑马灯
                                if (this._pmd)
                                    this._pmd.add(data.nickName + ":" + data.content);
                                break;
                            case 3: // 游戏公告
                            case 4: // 系统公告
                                if (this._pmd)
                                    this._pmd.add(getDesByLan("系统") + ":" + data.content);
                                break;
                        }
                        break;
                    case 0x00C0:
                        this.showFace(data);
                        break;
                    case 0x2010:
                        this.showGift(data);
                        break;
                    default:
                        // code...
                        break;
                }
            };
            InteractiveSystem.prototype.onGiftToggle = function (evt) {
                this._gift.enable = this._giftToggle.selected;
            };
            InteractiveSystem.prototype.onDanMuToggle = function (evt) {
                this._dm.enable = this._danmuToggle.selected;
            };
            InteractiveSystem.prototype.showGift = function (data) {
                if (this._gift == null)
                    return;
                this._gift.showGift(data);
            };
            /**
             * 显示表情
             * @function
             * @DateTime 2019-05-16T10:27:08+0800
             * @param    {any}                    data [description]
             */
            InteractiveSystem.prototype.showFace = function (data) {
                if (this._getFacePos == null)
                    return;
                var pd = gamelib.core.getPlayerData(data.playerId);
                var temp = this._getFacePos(pd.m_seat_local);
                var face = new Face();
                face.play(temp, data.addData2);
            };
            /**
             * 显示聊天泡泡
             * @function
             * @DateTime 2019-05-16T10:26:38+0800
             * @param    {any}                    data [description]
             */
            InteractiveSystem.prototype.showChatBubble = function (data) {
                if (this._getBubble == null)
                    return;
                var pd = gamelib.core.getPlayerData(data.sendId);
                var temp = this._getBubble(pd.m_seat_local);
                if (temp == null) {
                    console.log("没找到位置为" + pd.m_seat_local + "的泡泡资源");
                    return;
                }
                var bubble = temp["_bubble"];
                if (bubble == null) {
                    temp.mouseEnabled = false;
                    temp["__oldY"] = temp.y;
                    temp["__oldX"] = temp.x;
                    temp.visible = false;
                    bubble = new gamelib.chat.Bubble(temp);
                    temp["_bubble"] = bubble;
                }
                bubble.setMsg(data);
                this._bubbleList[pd.m_seat_local] = bubble;
            };
            return InteractiveSystem;
        }());
        common.InteractiveSystem = InteractiveSystem;
        var Face = /** @class */ (function () {
            function Face() {
                // code...
            }
            Face.prototype.play = function (pos, id) {
                var face = this.getFaceRes(id);
                face.x = pos.x;
                face.y = pos.y;
                g_layerMgr.addChild(face);
                var ani1 = face.ani1;
                ani1.play(0, false);
                ani1.once(laya.events.Event.COMPLETE, this, this.onPlayEnd, [face]);
            };
            Face.prototype.getFaceRes = function (id) {
                var url = "qpq/face/Art_face_" + (id + 1);
                var face = utils.tools.createSceneByViewObj(url);
                face['anchorX'] = face['anchorY'] = 0.5;
                face.zOrder = 10;
                return face;
            };
            Face.prototype.onPlayEnd = function (face) {
                console.log("播放完成");
                face.removeSelf();
            };
            return Face;
        }());
        common.Face = Face;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
* name
*/
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 公告界面
         * @class NoticeUi
         */
        var NoticeUi = /** @class */ (function (_super) {
            __extends(NoticeUi, _super);
            function NoticeUi() {
                return _super.call(this, "qpq/Art_Notice") || this;
            }
            NoticeUi.prototype.init = function () {
                this.txt_txt = this._res["txt_txt"];
                this.txt_txt.editable = false;
                this.txt_txt.mouseEnabled = false;
                this.txt_txt.vScrollBarSkin = "qpq/comp/vscroll.png";
            };
            NoticeUi.prototype.setData = function (day_notice_config) {
                this.txt_txt.text = day_notice_config.txt;
                this.txt_txt.align = day_notice_config.align;
                this.txt_txt.valign = "middle";
            };
            NoticeUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.txt_txt["changeScroll"]();
            };
            NoticeUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            return NoticeUi;
        }(gamelib.core.BaseUi));
        control.NoticeUi = NoticeUi;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/6/22.
 */
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 设置界面
         * @class SetUi
         */
        var SetUi = /** @class */ (function (_super) {
            __extends(SetUi, _super);
            function SetUi(saveFunction, hideHelpBtnInHall, url) {
                if (hideHelpBtnInHall === void 0) { hideHelpBtnInHall = false; }
                if (url === void 0) { url = "qpq/Art_CustomSet"; }
                var _this = _super.call(this, url) || this;
                _this._version = -1;
                _this._saveFunction = saveFunction;
                _this._hideHelpBtnInHall = hideHelpBtnInHall;
                return _this;
            }
            Object.defineProperty(SetUi.prototype, "help_btn", {
                get: function () {
                    return this._help_btn;
                },
                enumerable: true,
                configurable: true
            });
            SetUi.prototype.init = function () {
                this._res.isModal = true;
                this._help_btn = this._res["btn_2"];
                this._logout = this._res['btn_logout'];
                this._sound = this._res["checkBox_1"];
                this._music = this._res["checkBox_2"];
                this._radio = this._res['radio'];
                this._houtai = this._res['btn_houtai'];
                this._lan = this._res["btn_lan"];
                this._version_txt = this._res["txt_version"];
                if (this._help_btn) {
                    this._clickEventObjects.push(this._help_btn);
                    this._help_btn.visible = false;
                }
                if (this._lan) {
                    this._lan.itemSize = 36;
                    this._lan.labelSize = 34;
                    this._lan.labelColors = "#ffffff,#9a9a9a,#9a9a9a,#9a9a9a";
                    this._lan.itemColors = "#373735,#9a9a9a,#ffffff,#232321,#c3c3c3";
                    this._lan.labelPadding = "0,0,0,10";
                    this._excepts.push(this._lan);
                }
                if (this._logout)
                    this._clickEventObjects.push(this._logout);
                this._clickEventObjects.push(this._sound);
                this._clickEventObjects.push(this._music);
                this.addBtnToListener("btn_gonggao");
                if (this._houtai)
                    this._clickEventObjects.push(this._houtai);
                this._noticeOther = true;
                if (this._res["txt_tips1"] && this._res["txt_tips2"]) {
                    this._res["txt_tips1"].text = this._res["txt_tips2"].text = "";
                }
            };
            SetUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                var ver = g_gamesInfo.getGameVersion(GameVar.game_code);
                if (typeof (ver) == "number") {
                    this._version = ver / 100;
                    this._version_txt.text = getDesByLan("版本") + ":" + this._version.toFixed(2);
                }
                else
                    this._version_txt.text = getDesByLan("版本") + ":" + ver;
                this._sound.selected = g_net_configData.getConfig("sound");
                this._music.selected = g_net_configData.getConfig("music");
                if (this._radio) {
                    this._radio.on(Laya.Event.CHANGE, this, this.onChange);
                    var sub_sound = g_net_configData.getConfig("sub_sound");
                    if (isNaN(sub_sound))
                        sub_sound = 1;
                    this._radio.selectedIndex = sub_sound;
                    this._radio.disabled = !this._sound.selected;
                }
                if (this._lan) {
                    this._lan.on(Laya.Event.CHANGE, this, this.onChangeLan);
                    var lan = gamelib.Api.getLocalStorage("lan") || GameVar.g_platformData["multiple_lans"][0];
                    this._lan.selectedIndex = lan == "zh" ? 0 : 1;
                    //this._lan.selectedLabel = this._lan.labels.split(",")[this._lan.selectedIndex];
                    this._lan.button.label = this._lan.labels.split(",")[this._lan.selectedIndex];
                    this._oldLan = this._lan.selectedIndex;
                }
            };
            SetUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this._radio) {
                    this._radio.off(Laya.Event.CHANGE, this, this.onChange);
                }
                if (this._lan) {
                    this._lan.off(Laya.Event.CHANGE, this, this.onChangeLan);
                    if (this._oldLan != this._lan.selectedIndex) {
                        var lan = this._lan.selectedIndex == 0 ? "zh" : "en";
                        gamelib.Api.saveLocalStorage("lan", lan);
                        //通知服务器和平台
                        sendNetMsg(0x001D, 2, lan);
                        g_signal.dispatch(gamelib.GameMsg.CHANGELAN, lan);
                        gamelib.Api.modfiyAttByInterface("/platform/setlanguage", { "language": lan }, Laya.Handler.create(this, function () {
                            g_signal.dispatch(gamelib.GameMsg.REFRESHPLATFORMDATA, 0);
                        }));
                    }
                }
            };
            SetUi.prototype.onChange = function (evt) {
                this.save();
            };
            SetUi.prototype.onChangeLan = function (evt) {
                //g_net_configData.addConfig("lan",this._lan.selectedIndex == 0 ? "zh":"en");
            };
            SetUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget) {
                    case this._sound:
                    case this._music:
                        if (this._radio)
                            this._radio.disabled = !this._sound.selected;
                        this.save();
                        if (evt.currentTarget == this._sound) {
                            gamelib.Api.ApplicationEventNotify('set_sound', this._sound.selected ? "打开" : "关闭");
                        }
                        else {
                            gamelib.Api.ApplicationEventNotify('set_music', this._music.selected ? "打开" : "关闭");
                        }
                        break;
                    case this._help_btn:
                        g_signal.dispatch("showHelpUi", 0);
                        this.close();
                        break;
                    case this._logout:
                        if (gamelib.data.UserInfo.s_self.m_roomId != 0) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请退回大厅后再操作") });
                            return;
                        }
                        if (window['application_logout']) {
                            window['application_logout']();
                        }
                        break;
                    case this._houtai: //打开后台
                        if (window['qpq'] && window['qpq']['openVipPage']) {
                            window['qpq']['openVipPage'](GameVar.g_platformData['ignoreCheckVip']);
                        }
                        break;
                }
                if (evt.currentTarget.name == "btn_gonggao") {
                    g_signal.dispatch("showNoticeUi", 0);
                }
            };
            SetUi.prototype.save = function () {
                g_net_configData.addConfigByType(0, this._sound.selected);
                g_net_configData.addConfigByType(1, this._music.selected);
                if (this._radio) {
                    var sub_sound = this._radio.selectedIndex;
                    g_net_configData.addConfigByType(2, sub_sound);
                }
                else {
                    g_net_configData.addConfigByType(2, 0);
                }
                g_net_configData.saveConfig();
                if (this._saveFunction)
                    this._saveFunction.call(this);
                ;
            };
            return SetUi;
        }(gamelib.core.BaseUi));
        control.SetUi = SetUi;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/9/21.
 */
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 微信分享
         * @class ShareTip_wxUi
         */
        var ShareTip_wxUi = /** @class */ (function (_super) {
            __extends(ShareTip_wxUi, _super);
            function ShareTip_wxUi() {
                var _this = _super.call(this, "qpq/Art_Share1") || this;
                _this._url = "";
                return _this;
            }
            /**
             * 分享牌局
             * @function setData
             * @DateTime 2018-03-17T14:42:37+0800
             * @param    {any}     args     [description]
             * @param    {Function}               callBack [description]
             * @param    {any}                    thisObj  [description]
             */
            ShareTip_wxUi.prototype.setData = function (args, callBack, thisObj) {
                this._args = args;
                //请求分享内容
                gamelib.platform.get_share_circleByArgs(args, this.onGetShartArgsEnd, this);
                //请求二维码
                //this._web.getGameInfo(args.gz_id,this.onGetGameInfoEnd,this);
                var circle_args = { "validation": args.validation };
                if (args.groupId != null && args.groupId != "") {
                    circle_args.groupId = args.groupId;
                }
                var str = JSON.stringify(circle_args);
                str = "&circle_args=" + encodeURIComponent(str);
                var url = window["application_share_url"]();
                if (url.indexOf("?") == -1) {
                    url += "?" + str;
                }
                else {
                    url += "&" + str;
                }
                this._qrcodeImg.setUrl(url);
                this._url = url;
            };
            /**
             * 分享app信息
             * @function setAppData
             * @DateTime 2018-03-17T14:43:23+0800
             * @param    {string}                 appName [description]
             * @param    {string}                 info    [description]
             * @param    {string}                 imgUrl  [description]
             */
            ShareTip_wxUi.prototype.setAppData = function (appName, info, imgUrl) {
                if (GameVar.m_QRCodeUrl) {
                    this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl);
                }
                var str = appName + "\n" + info;
                this._msg_txt.text = str;
                if (imgUrl.indexOf("http") == -1) {
                    imgUrl = GameVar.common_ftp + imgUrl;
                }
                this._img_game.skin = imgUrl;
                this._url = GameVar.m_QRCodeUrl;
            };
            ShareTip_wxUi.prototype.onGetShartArgsEnd = function (rep) {
                var str = rep.title + "\n";
                str += rep.desc;
                this._msg_txt.text = str;
                this._img_game.skin = rep.img_url;
                gamelib.platform.share_circle(this._args.gz_id, this._args.validation, this._args.gameId, this._args.groupId, rep.title, rep.desc, rep.img_url);
                this._url = GameVar.g_platformData['name'] + " " + rep.title + " 房间链接:" + this._url;
            };
            ShareTip_wxUi.prototype.onGetGameInfoEnd = function (rep) {
                console.log(JSON.stringify(rep));
            };
            ShareTip_wxUi.prototype.init = function () {
                this._web = g_childGame.m_web;
                this._img_game = this._res["img_name"];
                this._tab = this._res["tab_1"];
                this._msg_txt = this._res["txt_1"];
                this._msg_txt.mouseEnabled = this._msg_txt.editable = false;
                this._res["img_1"].visible = false;
                this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
                this._noticeOther = true;
                this.addBtnToListener("img_QRCode");
                this.addBtnToListener("btn_fuzhi");
            };
            ShareTip_wxUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._tab.on(laya.events.Event.CHANGE, this, this.onTabChange);
                this._tab.selectedIndex = 0;
                this.onTabChange();
            };
            ShareTip_wxUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._tab.off(laya.events.Event.CHANGE, this, this.onTabChange);
            };
            ShareTip_wxUi.prototype.onTabChange = function (evt) {
                if (this._tab.selectedIndex == 0) {
                    this._res["b_1"].visible = true;
                    this._res["b_2"].visible = false;
                }
                else {
                    this._res["b_1"].visible = false;
                    this._res["b_2"].visible = true;
                }
            };
            ShareTip_wxUi.prototype.onClickObjects = function (evt) {
                if (evt.currentTarget.name == "img_QRCode") {
                    utils.tools.snapshotShare(this._res["img_QRCode"]);
                }
                else if (evt.currentTarget.name == "btn_fuzhi") {
                    this, gamelib.Api.copyToClipboard(this._url, function (ret) {
                        if (ret.result == 0) {
                            g_uiMgr.showTip("复制成功");
                        }
                    });
                    // Laya.timer.once(100,this,gamelib.Api.copyToClipboard,[this._url,function(ret:any)
                    // {
                    //     if(ret.result == 0)
                    //     {
                    //         g_uiMgr.showTip("复制成功");
                    //     }
                    // }]);
                    // Laya.timer.once(200,this,function()
                    // {
                    //     eval("gamelib.Api.copyToClipboard('www.baidu.com');")    
                    // })
                    // var input = document.createElement("input");
                    // input.width = 100;
                    // input.height = 30;
                    // input.style.opacity = "0";
                    // input.style.position = "absolute";
                    // input.type = "text";
                    // input.innerHTML = "www.qq.com";
                    // input.select();
                    // document.execCommand("Copy");
                    // gamelib.Api.copyToClipboard(this._url,function(ret:any)
                    // {
                    //     if(ret.result == 0)
                    //     {
                    //         g_uiMgr.showTip("复制成功");
                    //     }
                    // })
                }
            };
            return ShareTip_wxUi;
        }(gamelib.core.BaseUi));
        control.ShareTip_wxUi = ShareTip_wxUi;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * 保险箱ui
         * @class Bankui
         */
        var BankUi = /** @class */ (function (_super) {
            __extends(BankUi, _super);
            function BankUi() {
                return _super.call(this, "qpq/Art_Bank.scene") || this;
            }
            BankUi.prototype.init = function () {
                this.addBtnToListener("btn_cr");
                this.addBtnToListener("btn_qc");
                this.addBtnToListener("btn_clear");
                this.addBtnToListener("btn_del");
                for (var i = 0; i <= 9; i++) {
                    this.addBtnToListener("btn_" + i);
                }
                this._input_txt = this._res['txt_input'];
                this.money_self = this._res["txt_money1"];
                this.money_bank = this._res["txt_money2"];
                this._moneyInBank = 0;
                this._minMoney = 5000;
                this._input_txt.text = "";
                this._noticeOther = true;
            };
            Object.defineProperty(BankUi.prototype, "minMoney", {
                set: function (value) {
                    this._minMoney = value;
                },
                enumerable: true,
                configurable: true
            });
            BankUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.update();
                sendNetMsg(0x023E);
                this._input_txt.text = "";
                this._res['txt_tips'].text = utils.StringUtility.format(getDesByLan('资产{0}{1}以上可存入保险箱'), [this._minMoney, GameVar.g_platformData.gold_name]);
                this._res['txt_tips'].visible = this._minMoney > 0;
            };
            BankUi.prototype.update = function () {
                this.money_self.text = gamelib.data.UserInfo.s_self.m_money + "";
                this.money_bank.text = this._moneyInBank + "";
            };
            BankUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            BankUi.prototype.onClickObjects = function (evt) {
                switch (evt.currentTarget.name) {
                    //存入
                    case "btn_cr":
                        if (this._input_txt.text == "") {
                            g_uiMgr.showTip(getDesByLan("请输入金额"), true);
                            return;
                        }
                        var opMoney = parseInt(this._input_txt.text);
                        var playermoney = gamelib.data.UserInfo.s_self.m_money;
                        //自身资金少于20000不能存！
                        if (playermoney - opMoney < this._minMoney) {
                            g_uiMgr.showAlertUiByArgs({ msg: GameVar.g_platformData['gold_name'] + getDesByLan("不足") + "，" + getDesByLan("请重新输入") });
                            return;
                        }
                        sendNetMsg(0x023F, 1, parseInt(this._input_txt.text));
                        this._input_txt.text = "";
                        break;
                    //取出
                    case "btn_qc":
                        var num = parseInt(this._input_txt.text);
                        if (this._input_txt.text == "" || num == 0) {
                            g_uiMgr.showTip(getDesByLan("请输入金额"), true);
                            return;
                        }
                        if (num > 4000000000) {
                            g_uiMgr.showTip(getDesByLan("每次最多取40亿"), true);
                            return;
                        }
                        //sendNetMsg(0x0240,1, parseInt(this._input_txt.text),"");
                        sendNetMsg(0x0240, 1, num, new md5().hex_md5("888888"));
                        this._input_txt.text = "";
                        break;
                    case "btn_del":
                        var str = this._input_txt.text;
                        if (str == "")
                            return;
                        str = str.substring(0, str.length - 1);
                        this._input_txt.text = str;
                        break;
                    case "btn_clear":
                        this._input_txt.text = "";
                        break;
                    default:
                        if (evt.currentTarget.name.indexOf("btn_") == -1)
                            return;
                        var num = parseInt(evt.currentTarget.name.charAt(4));
                        var str = this._input_txt.text;
                        if (str.length >= 10)
                            return;
                        str += num + "";
                        this._input_txt.text = str;
                        break;
                }
            };
            //网络消息
            BankUi.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x0036: //更新
                        this.update();
                        break;
                    case 0x023E: //银行信息
                        this._moneyInBank = parseInt(data.money);
                        this.update();
                        break;
                    case 0x023F: //存入
                        if (data.result != 1) {
                            g_uiMgr.showTip(getDesByLan("存入失败") + "！");
                            return;
                        }
                        this._moneyInBank += parseInt(data.number);
                        this.update();
                        g_uiMgr.showTip(getDesByLan("存入成功") + "！");
                        break;
                    case 0x0240: //取出
                        //this.money_bank.text = this._moneyInBank - data.number;
                        if (data.result != 1) {
                            g_uiMgr.showTip(getDesByLan("存款不足") + "！");
                            return;
                        }
                        this._moneyInBank -= parseInt(data.number);
                        this.update();
                        g_uiMgr.showTip(getDesByLan("取款成功") + "！");
                        break;
                }
            };
            return BankUi;
        }(gamelib.core.Ui_NetHandle));
        common.BankUi = BankUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * 发送喇叭界面
         * @class
         */
        var BugleUi = /** @class */ (function (_super) {
            __extends(BugleUi, _super);
            function BugleUi() {
                return _super.call(this, "qpq.ui.Art_LabaWindowUI") || this;
            }
            ;
            BugleUi.prototype.init = function () {
                this.addBtnToListener("btn_ok");
                this._histroy = this._res['txt_2'];
                this._text_input = this._res['txt_input'];
                this._histroy.overflow = "scroll";
                this._histroy.editable = false;
                this._text_input.maxChars = 50;
                this._price = GameVar.g_platformData['bugle_price'];
                this._goods_name = gamelib.data.GoodsData.GetNameByMsId(this._price['msId']);
                this._text_input.prompt = getDesByLan("每次消耗") + this._price["num"] + this._goods_name;
            };
            BugleUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._histroy.text = "";
                for (var i = 0; i < gamelib.data.BugleData.s_list.length; i++) {
                    this.showData(gamelib.data.BugleData.s_list[i]);
                }
            };
            BugleUi.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x00F0) {
                    this.showData(gamelib.data.BugleData.s_list[gamelib.data.BugleData.s_list.length - 1]);
                }
            };
            BugleUi.prototype.showData = function (bd) {
                this._histroy.text += bd.m_sendName + ":" + bd.m_msg + "\n";
                this._histroy.scrollTo(this._histroy.maxScrollY);
                this._histroy["changeScroll"]();
            };
            BugleUi.prototype.onClickObjects = function (evt) {
                if (this._text_input.text == "")
                    return;
                if (gamelib.data.UserInfo.s_self.getGooodsNumByMsId(this._price.msId) <= this._price.num) {
                    g_uiMgr.showAlertUiByArgs({ msg: this._goods_name + getDesByLan("不足") + this._price.num });
                }
                sendNetMsg(0x00F0, this._text_input.text);
                this._text_input.text = "";
            };
            return BugleUi;
        }(gamelib.core.Ui_NetHandle));
        common.BugleUi = BugleUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 管理动画的。直接用g_animation来使用，不要实例化次类
         * @class Animation
         */
        var Animation = /** @class */ (function () {
            function Animation() {
            }
            /**
             * 播放动画
             * @function playAnimation
             * @param {string}   res "qpq.ui.FaceUI"
             * @param {number}} pos 0:(0,0)点，1：居中显示，{x,y}，显示到指定坐标
             * @param {autoRemove} 播放完成后是否自动删除
             */
            Animation.prototype.playAnimation = function (res, pos, autoRemove, callBack) {
                // var classObj:any = gamelib.getDefinitionByName(res);
                // if(classObj == null)
                // {
                // 	console.log("动画资源" + res +"不存在")
                // 	return null;
                // }
                //          var movie = new classObj();
                var movie = utils.tools.createSceneByViewObj(res);
                if (movie == null) {
                    console.log("动画资源" + res + "不存在");
                    return null;
                }
                g_topLayaer.addChild(movie);
                var tx = 0;
                var ty = 0;
                if (pos == 0) {
                    tx = 0;
                    ty = 0;
                }
                else if (pos == 1) {
                    var sw = Math.max(Laya.stage.width, g_gameMain.m_gameWidth);
                    var sh = Math.max(Laya.stage.height, g_gameMain.m_gameHeight);
                    tx = (sw - movie['width']) / 2;
                    ty = (sh - movie['height']) / 2;
                }
                else {
                    tx = pos['x'];
                    ty = pos['y'];
                }
                movie.x = tx;
                movie.y = ty;
                var ani1 = movie['ani1'];
                if (ani1 == null) {
                    console.log("资源" + res + " 没有动画");
                    return movie;
                }
                ani1.play(0, false);
                if (autoRemove) {
                    ani1.once(laya.events.Event.COMPLETE, this, this.onPlayEnd, [movie, callBack]);
                }
                return movie;
            };
            Animation.prototype.onPlayEnd = function (movie, callBack) {
                movie.removeSelf();
                if (callBack) {
                    callBack.run();
                }
            };
            return Animation;
        }());
        control.Animation = Animation;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by liuyi_000 on 2016/9/28.
 */
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 扇形遮罩
         * @class
         */
        var ArcMask = /** @class */ (function (_super) {
            __extends(ArcMask, _super);
            function ArcMask(r) {
                var _this = _super.call(this) || this;
                _this._pre = 0;
                _this._angle = 0;
                _this._r = r;
                _this._color = '#FF0000';
                _this.mouseEnabled = false;
                return _this;
            }
            Object.defineProperty(ArcMask.prototype, "pre", {
                get: function () {
                    return this._pre;
                },
                set: function (value) {
                    if (value > 1)
                        value = 1;
                    this._pre = value;
                    this._angle = 270 + value * 360;
                    // this._angle = this._angle % 360;
                    this.graphics.clear();
                    if (value != 0) {
                        //this.graphics.drawLine(0,0,this._r,0,this._color);
                        this.graphics.drawPie(0, 0, this._r, 270, this._angle, this._color);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return ArcMask;
        }(Laya.Sprite));
        control.ArcMask = ArcMask;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 管理动画的。直接用g_animation来使用，不要实例化次类
         * @class Animation
         */
        var ChilpInHeadEffect = /** @class */ (function () {
            function ChilpInHeadEffect() {
                this._list = [];
            }
            /**
             * 注册头像，如果头像的位置如下
             * 1  5
             * 2  6
             * 3  7
             * 4  8
             * registerHeads1([1,2,3,4],3,1);
             * registerHeads1([5,6,7,8],2,5);
             *
             * @function
             * @DateTime 2019-03-28T10:32:45+0800
             * @param    {any}                    heads          [description]
             * @param    {number}                 type           移动的类型 0上 1下 2左  3右
             * @param    {number}                 startLocalSeat [description]
             */
            ChilpInHeadEffect.prototype.registerHeads1 = function (heads, type, startLocalSeat) {
                if (heads instanceof Array) {
                    for (var i = 0; i < heads.length; i++) {
                        var effect = new HeadEffect(heads[i], type);
                        this._list[startLocalSeat + i] = effect;
                    }
                }
                else {
                    var effect = new HeadEffect(heads, type);
                    this._list[startLocalSeat] = effect;
                }
            };
            /**
             * 注册头像，如果头像的位置如下
             * 1  2
             * 3  4
             * 5  6
             * 7  8
             * registerHeads2([1,3,5,7],3,1);
             * registerHeads2([2,4,6,8],2,2);
             *
             * @function
             * @DateTime 2019-03-28T10:32:45+0800
             * @param    {any}                    heads          [description]
             * @param    {number}                 type           移动的类型 0上 1下 2左  3右
             * @param    {number}                 startLocalSeat [description]
             */
            ChilpInHeadEffect.prototype.registerHeads2 = function (heads, type, startLocalSeat) {
                if (heads instanceof Array) {
                    for (var i = 0; i < heads.length; i++) {
                        var effect = new HeadEffect(heads[i], type);
                        this._list[startLocalSeat + i * 2] = effect;
                    }
                }
                else {
                    var effect = new HeadEffect(heads, type);
                    this._list[startLocalSeat] = effect;
                }
            };
            /**
             * 注册头像，如果头像的位置是乱的,用以下方法
             * @function
             * @DateTime 2019-03-28T10:32:45+0800
             * @param    {any}                    heads          [单个位置或者按位置排好的]
             * @param    {number}                 type           移动的类型 0上 1下 2左  3右
             * @param    {number}                 localSeat [description]
             */
            ChilpInHeadEffect.prototype.registerHeads3 = function (heads, type, localSeat) {
                var seat = isNaN(localSeat) ? this._list.length : localSeat;
                if (heads instanceof Array) {
                    for (var i = 0; i < heads.length; i++) {
                        var effect = new HeadEffect(heads[i], type);
                        this._list[seat + i] = effect;
                    }
                }
                else {
                    var effect = new HeadEffect(heads, type);
                    this._list[seat] = effect;
                }
            };
            ChilpInHeadEffect.prototype.destroy = function () {
                for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                    var effect = _a[_i];
                    if (effect == null)
                        continue;
                    effect.destroy();
                }
                this._list = null;
            };
            ChilpInHeadEffect.prototype.play = function (localSeat) {
                var effect = this._list[localSeat];
                if (effect) {
                    effect.show();
                }
            };
            return ChilpInHeadEffect;
        }());
        control.ChilpInHeadEffect = ChilpInHeadEffect;
        var HeadEffect = /** @class */ (function () {
            /**
           * 头像容器移动类实例化
             * @param res 头像容器
             * @param effectType 移动的类型 0上 1下 2左  3右
             * @param offset 移动的偏移
             * @param delay 缓动时间
             */
            function HeadEffect(res, effectType, offset, delay) {
                if (offset === void 0) { offset = 30; }
                if (delay === void 0) { delay = 400; }
                this._res = res;
                this._effceType = effectType;
                this._offset = offset;
                this._delay = delay / 2;
                this.init();
            }
            Object.defineProperty(HeadEffect.prototype, "offset", {
                get: function () {
                    return this.offset;
                },
                set: function (value) {
                    this._offset = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeadEffect.prototype, "effectType", {
                get: function () {
                    return this._effceType;
                },
                set: function (value) {
                    this._effceType = value;
                    this.getTheTargetPos();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeadEffect.prototype, "delay", {
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = value / 2;
                },
                enumerable: true,
                configurable: true
            });
            HeadEffect.prototype.init = function () {
                this._targetPos = { x: 0, y: 0 };
                this._formerPos = { x: this._res.x, y: this._res.y };
                this.getTheTargetPos();
            };
            HeadEffect.prototype.show = function () {
                this.close();
                Laya.Tween.to(this._res, { x: this._targetPos.x, y: this._targetPos.y }, this._delay, null, Laya.Handler.create(this, this.moveEnd), 0, false);
            };
            HeadEffect.prototype.moveEnd = function () {
                Laya.Tween.to(this._res, { x: this._formerPos.x, y: this._formerPos.y }, this._delay, null, Laya.Handler.create(this, this.close), 0, false);
            };
            HeadEffect.prototype.close = function () {
                Laya.Tween.clearAll(this._res);
            };
            HeadEffect.prototype.destroy = function () {
                this.close();
                this._res = null;
                this._targetPos = null;
                this._effceType = null;
                this._offset = null;
                this._formerPos = null;
            };
            HeadEffect.prototype.getTheTargetPos = function () {
                var effectX = 0;
                var effectY = 0;
                switch (this._effceType) {
                    case 0:
                        effectY = -1;
                        break;
                    case 1:
                        effectY = 1;
                        break;
                    case 2:
                        effectX = -1;
                        break;
                    case 3:
                        effectX = 1;
                        break;
                }
                this._targetPos.x = this._formerPos.x + this._offset * effectX;
                this._targetPos.y = this._formerPos.y + this._offset * effectY;
            };
            return HeadEffect;
        }());
        control.HeadEffect = HeadEffect;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 头像转圈时钟
         * @class Clock_Mask
         */
        var Clock_Mask = /** @class */ (function () {
            /**
             * 头像转圈时间。
             * @constructor Clock_Mask
             * @param {any}    res   对象必须为单独的一个皮肤。里面必须包含img_djs_2和img_djs_3两张图片
             * @param {number} localSeat [description]
             */
            function Clock_Mask(res, localSeat) {
                this._res = res;
                this._localSeat = localSeat;
                var radius = Math.sqrt(res.width * res.width + res.height * res.height) / 2;
                this._mask = new CubeMask(radius);
                this._mask.x = 0 + this._res.width / 4;
                this._mask.y = 0 + this._res.height / 4;
                this._res.mask = this._mask;
                this._res.visible = false;
                this._soundName = "daojishi";
            }
            Object.defineProperty(Clock_Mask.prototype, "soundName", {
                /**
                 * 倒计时音效。默认为daojishi
                 * @type {string} value [description]
                 */
                set: function (value) {
                    this._soundName = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Clock_Mask.prototype, "waringName", {
                /**
                 * 刚到第5秒的时候的音效。默认不播放。
                 * @type {string} value
                 */
                set: function (value) {
                    this._waringName = value;
                },
                enumerable: true,
                configurable: true
            });
            // 销毁
            Clock_Mask.prototype.destroy = function () {
                this._mask.destroy();
                this._res = null;
                this._localSeat = -1;
            };
            Object.defineProperty(Clock_Mask.prototype, "localSeat", {
                // 获取玩家本地坐标
                get: function () {
                    return this._localSeat;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 开始计时
             * @function startClock
             * @DateTime 2018-03-17T14:17:08+0800
             * @param    {number}                 time [description]
             */
            Clock_Mask.prototype.startClock = function (time) {
                this._mask.visible = this._res.visible = true;
                this._res["img_djs_2"].visible = true;
                this._res["img_djs_3"].visible = true;
                this._mask.on("changColor1", this, this.changeColor1);
                this._mask.on("changColor2", this, this.changeColor2);
                this._mask.on("complete", this, this.complete);
                this._mask.on("voice", this, this.voice);
                this._mask.on("voicePrompt", this, this.voicePrompt);
                this._mask.start(time);
            };
            /**
             * 停止时间
             * @function stop
             * @DateTime 2018-03-17T14:17:23+0800
             */
            Clock_Mask.prototype.stop = function () {
                this._mask.stop();
                this._mask.off("changColor1", this, this.changeColor1);
                this._mask.off("changColor2", this, this.changeColor2);
                this._mask.off("complete", this, this.complete);
                this._mask.off("voicePrompt", this, this.voicePrompt);
                this._mask.off("voice", this, this.voice);
                this._mask.visible = this._res.visible = false;
            };
            // 设置颜色1
            Clock_Mask.prototype.changeColor1 = function () {
                this._res["img_djs_2"].visible = false;
                this._res["img_djs_3"].visible = true;
            };
            // 设置颜色2
            Clock_Mask.prototype.changeColor2 = function () {
                this._res["img_djs_2"].visible = true;
                this._res["img_djs_3"].visible = false;
            };
            // 声音提示
            Clock_Mask.prototype.voicePrompt = function () {
                console.log("声音提示一次");
                if (this._waringName)
                    playSound_qipai(this._waringName);
                else
                    playSound_qipai(this._soundName);
            };
            Clock_Mask.prototype.voice = function () {
                playSound_qipai(this._soundName);
            };
            // 完成
            Clock_Mask.prototype.complete = function () {
                this.stop();
            };
            return Clock_Mask;
        }());
        control.Clock_Mask = Clock_Mask;
        // 遮罩
        var CubeMask = /** @class */ (function (_super) {
            __extends(CubeMask, _super);
            function CubeMask(radius) {
                var _this = _super.call(this) || this;
                _this._radius = radius;
                _this._fillColor = "#000000";
                _this._changeColor1 = false;
                _this._changeColor2 = false;
                _this._tempTime = 0;
                _this._bPlaySound = false;
                return _this;
            }
            // 销毁
            CubeMask.prototype.destroy = function () {
                this._fillColor = null; //填充颜色
                this._radius = 0; //扇形半径
                this._startAngle = 0; //开始角度
                this._endAngle = 0; //结束角度
                this._dalta = 0; //增加的角度
                this._time = 0; //时间
                this._second = 0; //剩余秒数
                this._changeColor1 = null; //倒计时第一次变色
                this._changeColor2 = null; //倒计时第二次变色
                this._tempTime = 0; //计时
                this._bPlaySound = false; //是否播放声音
            };
            // 开始计时
            CubeMask.prototype.start = function (second) {
                this._second = second;
                this._time = second * 1000;
                this._dalta = 360 / this._time * 60;
                this._startAngle = 270;
                this._endAngle = this._startAngle + this._dalta;
                this._changeColor1 = false;
                this._changeColor2 = false;
                this._tempTime = 0;
                this._bPlaySound = false;
                this.visible = true;
                this.graphics.clear();
                Laya.timer.loop(60, this, this.changeGraphics);
            };
            // 停止
            CubeMask.prototype.stop = function () {
                Laya.timer.clear(this, this.changeGraphics);
            };
            // 绘制扇形
            CubeMask.prototype.changeGraphics = function () {
                this.graphics.drawPie(this.x, this.y, this._radius, this._startAngle, this._endAngle, this._fillColor);
                this._endAngle += this._dalta;
                this._time -= 60;
                if (this._time < 5000) {
                    this._tempTime += 60;
                    if (this._tempTime >= 1000) {
                        this._tempTime = 0;
                        if (!this._bPlaySound) {
                            this.event("voicePrompt");
                            this._bPlaySound = true;
                        }
                        else {
                            this.event("voice");
                        }
                    }
                }
                if (this._endAngle >= this._startAngle + 120 && !this._changeColor1) {
                    this._changeColor1 = true;
                    this.event("changColor1");
                }
                if (this._endAngle >= this._startAngle + 240 && !this._changeColor2) {
                    this._changeColor2 = true;
                    this.event("changColor2");
                }
                if (this._endAngle >= this._startAngle + 365) {
                    this.event("complete");
                }
            };
            return CubeMask;
        }(Laya.Sprite));
        control.CubeMask = CubeMask;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 公共房间逻辑部分
         * @class CommonRoomUi
         * @deprecated 每个游戏的人数可能不一样。礼物按钮也不一样
         */
        var CommonRoomUi = /** @class */ (function (_super) {
            __extends(CommonRoomUi, _super);
            function CommonRoomUi(url) {
                return _super.call(this, url) || this;
            }
            CommonRoomUi.prototype.init = function () {
                _super.prototype.init.call(this);
                this._rightSetUi = new gamelib.control.RoomRightSet(this._res);
                var arrChat = [];
                for (var i = 1; i <= 4; i++) {
                    arrChat.push(this._res["ui_chat_" + i]);
                }
                gamelib.chat.ChatBubble.s_instance.init(arrChat);
                var arrPos = [];
                for (var i = 1; i <= 4; i++) {
                    var temp = this._res["ui_face_" + i];
                    arrPos.push(temp);
                }
                gamelib.chat.Face.s_instance.initPos(arrPos);
                gamelib.chat.RecordSystem.s_instance.setEnterBtn(this._res['btn_yuyin']);
                //礼物           
                if (this._res['btn_daoju2']) {
                    var btns = [];
                    for (var i = 2; i <= 4; i++) {
                        btns.push(this._res["btn_daoju" + i]);
                    }
                    gamelib.common.GiftSystem.s_instance.init(arrPos, { x: 1066, y: 498 }, btns);
                }
            };
            CommonRoomUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                g_signal.add(this.onLocalSignal, this);
                this._rightSetUi.show();
            };
            CommonRoomUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._rightSetUi.close();
                g_signal.remove(this.onLocalSignal, this);
            };
            /**
             * 设置玩家列表和获取玩家信息的方法
             * @param {Array<gamelib.data.UserInfo>} list             [description]
             * @param {Function}                     getPlayerDataFun [description]
             */
            CommonRoomUi.prototype.setPlayerList = function (list, getPlayerDataFun) {
                gamelib.common.GiftSystem.s_instance.setPlayerList(list);
                gamelib.core.getPlayerData = getPlayerDataFun;
            };
            CommonRoomUi.prototype.onLocalSignal = function (msg) {
                switch (msg) {
                    case "showRuleUi":
                        this._ruleUi = this._ruleUi || new gamelib.control.Qpq_RuleUi();
                        this._ruleUi.show();
                        break;
                }
            };
            return CommonRoomUi;
        }(gamelib.core.Ui_NetHandle));
        control.CommonRoomUi = CommonRoomUi;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
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
                // var other:any = Laya.loader.getRes(GameVar.common_ftp + "other.json" + g_game_ver_str);
                // console.log("HallCommonBtns  inits " + GameVar.platform);
                // if(this._btns["gamehall"])
                // {
                // 	this._btns["gamehall"].visible = this.getVisible(other,"gamehall");
                // }
                // if(this._btns["btn_cdk"])
                // {
                // 	this._btns["btn_cdk"].visible = this.getVisible(other,"btn_cdk");
                // }
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
            HallCommonBtns.prototype.getVisible = function (data_source, key) {
                if (data_source == null)
                    return false;
                var pf_data = data_source[key];
                if (pf_data == null)
                    return false;
                pf_data = pf_data[GameVar.platform];
                if (pf_data == null)
                    return false;
                var gameid = pf_data.gameid;
                var not_gz_id = pf_data.not_gz_id;
                if (gameid == "all") {
                    if (not_gz_id == null || not_gz_id.length == 0)
                        return true;
                    return not_gz_id.indexOf(GameVar.gz_id) == -1;
                }
                return gameid.indexOf(GameVar.s_game_id) != -1;
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
                //console.log("btn  update" +  utils.tools.getReturnBtnVisible() +"  "+GameVar.gz_id +" " + GameVar.src_gz_id)
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
                        g_uiMgr.openShop();
                        break;
                    case "btn_signin":
                        break;
                    case "btn_mail":
                        g_uiMgr.openMail();
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
                        break;
                    case "btn_help":
                    case "help":
                        g_signal.dispatch("showHelpUi", 0);
                        break;
                    case "btn_rank":
                        g_signal.dispatch("showRankUi", 0);
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
        control.HallCommonBtns = HallCommonBtns;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 点击头像后显示自己的玩家信息。包含签名，头像，昵称，id，铜钱，地址等
         * @class MyPersonalInfo
         */
        var MyPersonalInfo = /** @class */ (function (_super) {
            __extends(MyPersonalInfo, _super);
            function MyPersonalInfo(resname) {
                return _super.call(this, resname) || this;
            }
            // 初始化
            MyPersonalInfo.prototype.init = function () {
                _super.prototype.init.call(this);
                this._head = this._res["img_head"]; // 头像
                this._nick = this._res["txt_name"]; // 昵称
                this._ID = this._res["txt_id"]; // id            
                this._address = this._res["txt_address"]; // 地址
                if (this._address == null)
                    this._address = this._res["txt_add"]; // 地址
                this._signature = this._res["txt_input"]; // 个性签名
                this._money = this._res["txt_money"]; // 铜钱
                this._sex = this._res['img_sex'];
                this.addBtnToListener("btn_modify"); // 修改
                this.addBtnToListener("btn_shop"); // 商城
                this._netData = null; // 玩家个性签名数据
                this._pd = null; // 玩家数据
                if (this._res['btn_shop'] && !utils.tools.isQpqHall()) {
                    if (this._res['btn_shop'] && GameVar.g_platformData['hideShopInRoom']) {
                        this._res['btn_shop'].removeSelf();
                    }
                }
                this._vip = this._res['img_vip'];
                this._exp_bar = this._res['bar_exp'];
                this._level_label = this._res['txt_level'];
                this._exp_label = this._res['txt_exp1'];
                this._vip_txt = this._res['txt_vip'];
                this._jx = this._res['img_jx'];
                if (this._signature)
                    this._signature.prompt = getDesByLan("默认签名");
            };
            /**
             * 设置玩家数据
             * @function setPlayerData
             * @DateTime 2018-03-17T14:23:04+0800
             * @param    {gamelib.data.UserInfo}  pd [description]
             */
            MyPersonalInfo.prototype.setPlayerData = function (pd) {
                this._pd = pd;
                if (pd) {
                    this.show();
                }
            };
            MyPersonalInfo.prototype.updatePlayerData = function (pd) {
                if (this._pd == null || pd.m_id != this._pd.m_id)
                    return;
                this.setValues();
            };
            // 销毁
            MyPersonalInfo.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                this._head = null; // 头像
                this._nick = null; // 昵称
                this._ID = null; // id
                this._money = null; // 铜钱
                this._address = null; // 地址
                this._signature = null; // 个性签名
            };
            // 显示
            MyPersonalInfo.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.setValues();
            };
            MyPersonalInfo.prototype.setValues = function () {
                this._head.skin = this._pd.m_headUrl; // 头像
                // this._nick.text = this._pd.m_name_ex;        // 昵称
                if (this._nick) {
                    if (this._nick.width) {
                        utils.tools.setLabelDisplayValue(this._nick, this._pd.m_name);
                    }
                    else {
                        this._nick.text = this._pd.m_name_ex; // 昵称
                    }
                }
                this._ID.text = "ID:" + this._pd.m_pId; // id
                if (this._money)
                    this._money.text = utils.tools.getMoneyByExchangeRate(this._pd.m_money); // 铜钱
                if (this._address)
                    this._address.text = this._pd.m_address; // 地址
                if (this._signature) {
                    // 个性签名
                    sendNetMsg(0x2035, 1, this._pd.m_pId, "");
                    this._signature.mouseEnabled = (this._pd.m_roomId == 0);
                }
                if (this._res['btn_modify']) {
                    this._res['btn_modify'].visible = (this._pd.m_roomId == 0);
                }
                if (this._sex)
                    this._sex.skin = this._pd.m_sex == 1 ? GameVar.s_namespace + "/window/sex_1.png" : GameVar.s_namespace + "/window/sex_2.png";
                if (this._vip) {
                    if (window["qpq"]["getVipIcon"])
                        this._vip.skin = window["qpq"]["getVipIcon"](this._pd.vipLevel, true);
                    else
                        this._vip.visible = false;
                }
                if (this._exp_label) {
                    this._exp_label.text = this._pd.m_currentExp + "/" + this._pd.m_nextExp;
                }
                if (this._exp_bar) {
                    this._exp_bar.value = this._pd.m_nextExp == 0 ? 0 : (this._pd.m_currentExp / this._pd.m_nextExp);
                }
                if (this._level_label) {
                    var qz = "lv:";
                    if (GameVar.g_platformData['playerInfo_config']) {
                        if (GameVar.g_platformData['playerInfo_config']["level_qz"] != null)
                            qz = GameVar.g_platformData['playerInfo_config']["level_qz"];
                    }
                    this._level_label.text = qz + this._pd.m_level + "";
                }
                if (this._vip_txt) {
                    this._vip_txt.text = "" + this._pd.vipLevel;
                }
                if (this._jx) {
                    if (window["qpq"]["getMilitaryRankIcon"])
                        this._jx.skin = window["qpq"]["getMilitaryRankIcon"](this._pd.m_level);
                }
                if (window["qpq"]["setHeadBoxAndNameStyle"])
                    window["qpq"]["setHeadBoxAndNameStyle"](this._pd.m_smallGameScore, this._res["img_headK"], this._nick);
            };
            // 关闭
            MyPersonalInfo.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            MyPersonalInfo.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.target.name) {
                    case "btn_modify": // 修改                    
                        console.log("修改");
                        if (this._netData == null)
                            this._netData = {};
                        this._netData["签名"] = this._signature.text;
                        sendNetMsg(0x2035, 0, GameVar.pid, JSON.stringify(this._netData));
                        break;
                    case "btn_shop": // 商城                    
                        console.log("商城");
                        g_uiMgr.openShop();
                        break;
                }
            };
            // 接受协议
            MyPersonalInfo.prototype.reciveNetMsg = function (msgId, data) {
                _super.prototype.reciveNetMsg.call(this, msgId, data);
                switch (msgId) {
                    case 0x2035:
                        if (data.msg == "") {
                            this._signature.text = getDesByLan("默认签名");
                            ;
                            this._netData = null;
                        }
                        else {
                            var jsonData = JSON.parse(data.msg);
                            this._netData = jsonData;
                            if (jsonData["签名"]) {
                                this._signature.text = jsonData["签名"];
                            }
                            else {
                                this._signature.text = getDesByLan("默认签名");
                            }
                        }
                        break;
                }
            };
            return MyPersonalInfo;
        }(gamelib.core.Ui_NetHandle));
        control.MyPersonalInfo = MyPersonalInfo;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/*
* name;
*/
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 点击头像后显示自己的玩家信息。包含签名，头像，昵称，id，铜钱，地址等
         * @class MyPersonalInfo
         */
        var OthersPersonalInfo = /** @class */ (function (_super) {
            __extends(OthersPersonalInfo, _super);
            function OthersPersonalInfo(resname) {
                return _super.call(this, resname) || this;
            }
            // 初始化
            OthersPersonalInfo.prototype.init = function () {
                _super.prototype.init.call(this);
                this._checkbox_1 = this._res['checkbox_1'];
                this._head = this._res["img_head"]; // 头像
                this._nick = this._res["txt_name"]; // 昵称
                this._ID = this._res["txt_id"]; // id
                this._money = this._res["txt_money"]; // 铜钱
                this._address = this._res["txt_address"]; // 地址
                this._distance = this._res['txt_distance'];
                this._sex = this._res["img_sex"];
                this._signature = this._res["txt_input"]; // 个性签名
                if (this._signature) {
                    this._signature.editable = false; // 不是可编辑
                    this._signature.mouseEnabled = false;
                    this._signature.text = "";
                }
                this._hint = this._res["txt_tips"]; // 提示
                for (var i = 1; i <= 6; i++) {
                    var str = "btn_" + i;
                    this.addBtnToListener(str);
                }
                this._pd = null; // 玩家数据
                this._cd = 1000; // 发送互动道具的CD
                if (GameVar.g_platformData['cd']) {
                    if (!isNaN(GameVar.g_platformData['cd'].gift)) {
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
            };
            // 设置玩家数据
            OthersPersonalInfo.prototype.setPlayerData = function (pd) {
                this._pd = pd;
                if (pd) {
                    this.show();
                }
            };
            OthersPersonalInfo.prototype.update = function () {
                if (this._pd == null)
                    return;
                this.onShow();
            };
            OthersPersonalInfo.prototype.updatePlayerData = function (pd) {
                if (this._pd == null || pd.m_id != this._pd.m_id)
                    return;
                this.onShow();
            };
            // 销毁
            OthersPersonalInfo.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                this._head = null; // 头像
                this._nick = null; // 昵称
                this._ID = null; // id
                this._money = null; // 铜钱
                this._address = null; // 地址
                this._signature = null; // 个性签名
                this._hint = null; // 提示
            };
            // 显示
            OthersPersonalInfo.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                if (this._checkbox_1)
                    this._checkbox_1.selected = false;
                this._head.skin = this._pd.m_headUrl; // 头像
                if (this._nick) {
                    if (this._nick.width) {
                        utils.tools.setLabelDisplayValue(this._nick, this._pd.m_name);
                    }
                    else {
                        this._nick.text = this._pd.m_name_ex; // 昵称
                    }
                }
                if (this._ID)
                    this._ID.text = "ID:" + this._pd.m_pId; // id
                if (this._money)
                    this._money.text = utils.tools.getMoneyByExchangeRate(this._pd.m_money); // 铜钱
                if (this._address)
                    this._address.text = this._pd.m_address; // 地址
                if (this._sex)
                    this._sex.skin = this._pd.m_sex == 1 ? GameVar.s_namespace + "/window/sex_1.png" : GameVar.s_namespace + "/window/sex_2.png";
                if (this._hint) {
                    var consume_ = GameVar.g_platformData["item_price"];
                    if (consume_ && consume_["num"]) {
                        var str = consume_["name"];
                        str = getDesByLan("每次消耗") + consume_["num"] + str;
                        this._hint.text = str; // 提示
                    }
                    else {
                        this._hint.visible = false; // 提示                
                    }
                }
                if (this._lastSendTime == -1)
                    this._lastSendTime = 0; // 发送互动的最后时间
                // 个性签名
                if (this._signature) {
                    if (this._pd.m_pId) {
                        sendNetMsg(0x2035, 1, this._pd.m_pId, "");
                    }
                    else {
                        this._signature.text = GameVar.g_platformData['aiBankerSign'] || "";
                    }
                }
                if (this._distance) {
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
                if (this._vip) {
                    if (window["qpq"]["getVipIcon"])
                        this._vip.skin = window["qpq"]["getVipIcon"](this._pd.vipLevel, true);
                    else
                        this._vip.visible = false;
                }
                if (this._exp_label) {
                    this._exp_label.text = this._pd.m_currentExp + "/" + this._pd.m_nextExp;
                }
                if (this._exp_bar) {
                    this._exp_bar.value = this._pd.m_nextExp == 0 ? 0 : (this._pd.m_currentExp / this._pd.m_nextExp);
                }
                if (this._level_label) {
                    var qz = "lv:";
                    if (GameVar.g_platformData['playerInfo_config']) {
                        if (GameVar.g_platformData['playerInfo_config']["level_qz"] != null)
                            qz = GameVar.g_platformData['playerInfo_config']["level_qz"];
                    }
                    this._level_label.text = qz + this._pd.m_level + "";
                }
                if (this._vip_txt) {
                    this._vip_txt.text = "" + this._pd.vipLevel;
                }
                if (this._jx) {
                    if (window["qpq"]["getMilitaryRankIcon"])
                        this._jx.skin = window["qpq"]["getMilitaryRankIcon"](this._pd.m_level);
                }
                if (window["qpq"]["setHeadBoxAndNameStyle"])
                    window["qpq"]["setHeadBoxAndNameStyle"](this._pd.m_smallGameScore, this._res["img_headK"], this._nick);
            };
            // 关闭
            OthersPersonalInfo.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
            };
            OthersPersonalInfo.prototype.onClickObjects = function (evt) {
                var name_ = evt.currentTarget.name;
                //1 鲜花 2 番茄 3 鸡蛋 4 干杯 5 鸡 6 狗
                var type = parseInt(name_.split("_")[1]);
                playButtonSound();
                if (type) {
                    if (Laya.timer.currTimer - this._lastSendTime >= this._cd) {
                        var bSendToAll = this._checkbox_1 ? this._checkbox_1.selected : false;
                        if (!bSendToAll)
                            sendNetMsg(0x2010, this._pd.m_id, type);
                        else
                            sendNetMsg(0x2010, 0, type);
                        this._lastSendTime = Laya.timer.currTimer;
                        this.close();
                    }
                    else {
                        g_uiMgr.showTip(getDesByLan("请稍后再发送") + "...", true);
                    }
                }
            };
            // 接受协议
            OthersPersonalInfo.prototype.reciveNetMsg = function (msgId, data) {
                _super.prototype.reciveNetMsg.call(this, msgId, data);
                switch (msgId) {
                    case 0x2035:
                        if (data.msg == "") {
                            this._signature.text = getDesByLan("默认签名");
                        }
                        else {
                            var jsonData = JSON.parse(data.msg);
                            if (jsonData["签名"]) {
                                this._signature.text = jsonData["签名"];
                            }
                            else {
                                this._signature.text = getDesByLan("默认签名");
                            }
                        }
                        break;
                }
            };
            return OthersPersonalInfo;
        }(gamelib.core.Ui_NetHandle));
        control.OthersPersonalInfo = OthersPersonalInfo;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 分页控件
         * @class Page
         */
        var Page = /** @class */ (function () {
            /**
             * @constructor
             * @param {Laya.Button}  prev   [上一页按钮]
             * @param {Laya.Button}  next   [下一页按钮]
             * @param {Laya.Label}   page   [页面文本]
             * @param {Laya.Handler} change [页码变化的回掉。参数为page，0-最大页面-1]
             */
            function Page(prev, next, page, change) {
                this._prev = prev;
                this._next = next;
                this._page = page;
                this._change = change;
            }
            Page.prototype.show = function () {
                this._prev.on(Laya.Event.CLICK, this, this.onPrev);
                this._next.on(Laya.Event.CLICK, this, this.onNext);
            };
            Page.prototype.close = function () {
                this._prev.off(Laya.Event.CLICK, this, this.onPrev);
                this._next.off(Laya.Event.CLICK, this, this.onNext);
            };
            Object.defineProperty(Page.prototype, "page", {
                get: function () {
                    return this._current_page;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 设置页面
             * @function setPage
             * @param {number} page    [当前页码，从0开始]
             * @param {number} maxPage [最大页码]
             */
            Page.prototype.setPage = function (page, maxPage) {
                this._current_page = page;
                this._total_page = maxPage == 0 ? 1 : maxPage;
                this.showPage();
            };
            Page.prototype.onPrev = function (evt) {
                playButtonSound();
                if (this._current_page == 0)
                    return;
                this._current_page--;
                this.showPage();
            };
            Page.prototype.onNext = function (evt) {
                playButtonSound();
                if (this._current_page == this._total_page - 1)
                    return;
                this._current_page++;
                this.showPage();
            };
            Page.prototype.showPage = function () {
                this._page.text = (this._current_page + 1) + "/" + this._total_page;
                this._change.runWith(this._current_page);
                this._prev.disabled = this._current_page == 0;
                this._next.disabled = this._current_page == this._total_page - 1;
            };
            return Page;
        }());
        control.Page = Page;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 二维码图片
         * @class QRCodeImg
         */
        var QRCodeImg = /** @class */ (function () {
            function QRCodeImg(img) {
                this._spr_QRCode = new laya.display.Sprite();
                this._spr_QRCode.width = img.width;
                this._spr_QRCode.height = img.height;
                this._spr_QRCode.mouseEnabled = false;
                this._img = img;
            }
            /**
             * 设置二维码内容
             * @function setUrl
             * @DateTime 2018-03-17T14:26:07+0800
             * @param    {string}                 url [description]
             */
            QRCodeImg.prototype.setUrl = function (url) {
                if (url == this._url)
                    return;
                this._url = url;
                if (url.indexOf('.png') == -1 && url.indexOf('.jpg') == -1) {
                    //生成二维码
                    utils.tools.createQRCode(url, this._spr_QRCode);
                    this._img.addChild(this._spr_QRCode);
                }
                else {
                    this._spr_QRCode.removeSelf();
                    this._img.skin = url;
                }
            };
            return QRCodeImg;
        }());
        control.QRCodeImg = QRCodeImg;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by code on 2017/7/24.
 */
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 规则界面
         * @class Qpq_RuleUi
         */
        var Qpq_RuleUi = /** @class */ (function (_super) {
            __extends(Qpq_RuleUi, _super);
            function Qpq_RuleUi() {
                return _super.call(this, GameVar.s_namespace + "/Art_Rule") || this;
            }
            Qpq_RuleUi.prototype.init = function () {
                this._list = this._res["list_1"];
                if (this._list.scrollBar)
                    this._list.scrollBar.autoHide = true;
            };
            Qpq_RuleUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._ruleData = [];
                if (!GameVar.circleData.ruleData || !GameVar.circleData.ruleData["list"]) {
                }
                else {
                    var rule_ = GameVar.circleData.ruleData["list"];
                    for (var key in rule_) {
                        this._ruleData.push({ name: key, value: rule_[key] });
                    }
                }
                this._list.on(laya.events.Event.RENDER, this, this.set_listItemData);
                this._list.dataSource = this._ruleData;
            };
            Qpq_RuleUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                this._list.off(laya.events.Event.RENDER, this, this.set_listItemData);
            };
            Qpq_RuleUi.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };
            // 设置规则数据
            Qpq_RuleUi.prototype.setRuleData = function () {
                if (!GameVar.circleData.ruleData || !GameVar.circleData.ruleData["list"]) {
                    this._ruleData = [];
                    return;
                }
                this._ruleData = [];
                var rule_ = GameVar.circleData.ruleData["list"];
                for (var key in rule_) {
                    this._ruleData.push({ name: key, value: rule_[key] });
                }
            };
            Qpq_RuleUi.prototype.set_listItemData = function (item, index) {
                var data = this._ruleData[index];
                var txt = getChildByName(item, "txt_1");
                txt.text = data["name"];
            };
            return Qpq_RuleUi;
        }(gamelib.core.BaseUi));
        control.Qpq_RuleUi = Qpq_RuleUi;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 牌桌右侧公共面板
         * @class RoomRightSet
         */
        var RoomRightSet = /** @class */ (function () {
            /**
             * [constructor description]
             * @param {any}        res [description]
             * @param {boolean}    [checkFz= true]   解散的时候是否检测是房主。五子棋不需要检测
             */
            function RoomRightSet(res, checkFz) {
                if (checkFz === void 0) { checkFz = true; }
                if (res['b_function']) {
                    this._style = new RoomRightSetStyle1(res, checkFz);
                }
                else {
                    this._style = new RoomRightSetStyle2(res, checkFz);
                }
                g_signal.add(this.onLocalMsg, this);
            }
            RoomRightSet.prototype.show = function () {
                this._style.show();
            };
            RoomRightSet.prototype.close = function () {
                this._style.close();
            };
            RoomRightSet.prototype.destroy = function () {
                g_signal.remove(this.onLocalMsg, this);
                this._style.destroy();
                this._style = null;
            };
            RoomRightSet.prototype.onLocalMsg = function (msg, data) {
                if (msg == "initCircleData") {
                    this._style.update();
                }
            };
            return RoomRightSet;
        }());
        control.RoomRightSet = RoomRightSet;
        var RoomRightSetStyle1 = /** @class */ (function () {
            function RoomRightSetStyle1(res, checkFz) {
                if (checkFz === void 0) { checkFz = true; }
                this._checkFz = checkFz;
                this._panel = res['b_function'];
                this._panel.parent["mouseThrough"] = true;
                this._panel.visible = false;
                this._clip = res['clip_back'];
                var arr = [];
                arr.push('btn_rule');
                arr.push('clip_back');
                arr.push('btn_set');
                arr.push('btn_record');
                arr.push('btn_deskInfo');
                arr.push('btn_jiesan');
                arr.push('btn_shop');
                this._click_list = [];
                for (var _i = 0, arr_5 = arr; _i < arr_5.length; _i++) {
                    var str = arr_5[_i];
                    var temp = res[str];
                    if (temp == null) {
                        continue;
                    }
                    temp.name = str;
                    this._click_list.push(temp);
                }
                this._sub_btns = [];
                if (res['btn_set'])
                    this._sub_btns.push(res['btn_set']);
                if (res['btn_deskInfo'])
                    this._sub_btns.push(res['btn_deskInfo']);
                if (res['btn_record'])
                    this._sub_btns.push(res['btn_record']);
                if (res['btn_jiesan'])
                    this._sub_btns.push(res['btn_jiesan']);
                this._posList = [];
                for (var i = 0; i < this._sub_btns.length; i++) {
                    this._posList.push(this._sub_btns[i].y);
                }
                this._posList.sort();
            }
            RoomRightSetStyle1.prototype.update = function () {
            };
            RoomRightSetStyle1.prototype.show = function () {
                for (var _i = 0, _a = this._click_list; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    temp.on(Laya.Event.CLICK, this, this.onClick);
                }
                //
                this.setPanelVisible(false);
            };
            RoomRightSetStyle1.prototype.close = function () {
                for (var _i = 0, _a = this._click_list; _i < _a.length; _i++) {
                    var temp = _a[_i];
                    temp.off(Laya.Event.CLICK, this, this.onClick);
                }
            };
            RoomRightSetStyle1.prototype.destroy = function () {
                if (this._click_list == null)
                    return;
                this.close();
                this._click_list.length = 0;
                this._click_list = null;
            };
            RoomRightSetStyle1.prototype.setPanelVisible = function (value) {
                this._panel.visible = value;
                if (value) {
                    this._clip.index = 0;
                    Laya.stage.on(Laya.Event.CLICK, this, this.onClickStage);
                    for (var _i = 0, _a = this._click_list; _i < _a.length; _i++) {
                        var temp = _a[_i];
                        if (temp.name == "btn_record" || temp.name == "btn_deskInfo") {
                            if (GameVar.circleData.isGoldScoreModle() || !utils.tools.isQpq())
                                temp.removeSelf();
                        }
                        if (temp.name == "btn_jiesan") {
                            if (!utils.tools.isQpq())
                                temp.removeSelf();
                        }
                    }
                    var index = 0;
                    for (var _b = 0, _c = this._sub_btns; _b < _c.length; _b++) {
                        var btn = _c[_b];
                        if (btn.parent)
                            btn.y = this._posList[index++];
                    }
                }
                else {
                    this._clip.index = 1;
                    Laya.stage.off(Laya.Event.CLICK, this, this.onClickStage);
                }
            };
            RoomRightSetStyle1.prototype.onClickStage = function (evt) {
                this.setPanelVisible(!this._panel.visible);
            };
            RoomRightSetStyle1.prototype.onClick = function (evt) {
                evt.stopPropagation();
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_rule":
                        g_signal.dispatch('showRuleUi', 0);
                        break;
                    case "clip_back":
                        this.onClickStage();
                        break;
                    case "btn_set":
                        g_signal.dispatch('showSetUi', 0);
                        break;
                    case "btn_record":
                        g_signal.dispatch('showShangJuUi', 0);
                        break;
                    case "btn_deskInfo":
                        g_signal.dispatch('showDeskInfoUi', 0);
                        break;
                    case "btn_jiesan":
                        g_qpqCommon.doJieSan(this._checkFz);
                        break;
                    case "btn_shop":
                        g_uiMgr.openShop();
                        break;
                    default:
                        // code...
                        break;
                }
            };
            return RoomRightSetStyle1;
        }());
        control.RoomRightSetStyle1 = RoomRightSetStyle1;
        var RoomRightSetStyle2 = /** @class */ (function () {
            function RoomRightSetStyle2(res, checkFz) {
                if (checkFz === void 0) { checkFz = true; }
                this._res = res;
                this._checkFz = checkFz;
                this._btnList = [];
                this._box = res['b_gongneng'];
                var arr = [];
                arr.push('btn_rule');
                arr.push('btn_set');
                arr.push('btn_shop');
                if (res['btn_jiesan']) {
                    arr.push('btn_jiesan');
                    if (GameVar.game_code.indexOf("wzq_") == -1) //多玩五子棋可以解散
                     {
                        res['btn_jiesan'].removeSelf();
                    }
                }
                if (utils.tools.isMatch()) {
                }
                else {
                    if (!utils.tools.isQpq()) {
                        if (res['btn_rule'])
                            res['btn_rule'].removeSelf();
                    }
                }
                for (var _i = 0, arr_6 = arr; _i < arr_6.length; _i++) {
                    var key = arr_6[_i];
                    var btn = res[key];
                    if (btn == null)
                        continue;
                    btn.name = key;
                    this._btnList.push(btn);
                }
                if (res['btn_shop']) {
                    if (GameVar.g_platformData['hideShopInRoom']) {
                        res['btn_shop'].removeSelf();
                    }
                }
            }
            RoomRightSetStyle2.prototype.update = function () {
                if (utils.tools.isMatch()) {
                    return;
                }
                if (!utils.tools.isQpq()) {
                    if (this._res['btn_rule'])
                        this._res['btn_rule'].removeSelf();
                }
                if (GameVar.circleData.isGoldScoreModle()) {
                    if (this._res['btn_rule']) {
                        if (GameVar.g_platformData['showHelpInGoldMode']) {
                        }
                        else {
                            this._res['btn_rule'].removeSelf();
                        }
                    }
                }
            };
            RoomRightSetStyle2.prototype.show = function () {
                for (var _i = 0, _a = this._btnList; _i < _a.length; _i++) {
                    var btn = _a[_i];
                    btn.on(Laya.Event.CLICK, this, this.onClickBtn);
                }
            };
            RoomRightSetStyle2.prototype.close = function () {
                for (var _i = 0, _a = this._btnList; _i < _a.length; _i++) {
                    var btn = _a[_i];
                    btn.off(Laya.Event.CLICK, this, this.onClickBtn);
                }
            };
            RoomRightSetStyle2.prototype.destroy = function () {
                this.close();
                this._res = null;
                this._btnList.length = 0;
                this._btnList = null;
            };
            RoomRightSetStyle2.prototype.onClickBtn = function (evt) {
                playButtonSound();
                switch (evt.currentTarget.name) {
                    case "btn_set":
                        g_signal.dispatch('showSetUi', 0);
                        break;
                    case "btn_rule":
                        if (GameVar.circleData.isGoldScoreModle()) {
                            var index = 0;
                            var helpInfo = GameVar.g_platformData['helpInfo'];
                            if (helpInfo) {
                                var name = GameVar.game_code.split('_')[0];
                                index = helpInfo[name];
                            }
                            g_signal.dispatch('showHelpUi', index);
                        }
                        else {
                            g_signal.dispatch('showRuleUi', 0);
                        }
                        break;
                    case "btn_jiesan":
                        // if(GameVar.circleData.isGoldScoreModle())
                        // {
                        // 	g_childGame.toCircle();
                        // }
                        // else
                        {
                            g_qpqCommon.doJieSan(this._checkFz);
                        }
                        break;
                    case "btn_shop":
                        g_uiMgr.openShop();
                        break;
                    default:
                        // code...
                        break;
                }
            };
            return RoomRightSetStyle2;
        }());
        control.RoomRightSetStyle2 = RoomRightSetStyle2;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/8/17.
 */
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 拖动条控件
         * 需要传的res必须包含txt_0,txt_1,hslider
         * @class Slider
         */
        var Slider = /** @class */ (function () {
            function Slider(res) {
                this._label_txt = res["txt_0"];
                this._value_txt = res["txt_1"];
                this._slider = res["hslider"];
                if (this._slider) {
                    this._slider.allowClickBack = true;
                    this._slider.showLabel = false;
                    this._slider.changeHandler = Laya.Handler.create(this, this.onChange, null, false);
                }
                this._res = res;
            }
            Slider.prototype.show = function () {
                this.close();
                this._slider.on(Laya.Event.CHANGE, this, this.onChange);
            };
            Slider.prototype.close = function () {
                this._slider.off(Laya.Event.CHANGE, this, this.onChange);
            };
            /**
             * 设置标题
             * @function setLabel
             * @DateTime 2018-03-17T14:28:49+0800
             * @param    {string}                 str [description]
             */
            Slider.prototype.setLabel = function (str) {
                this._label_txt.text = str;
            };
            /**
             * 设置最大值和最小值
             * @function
             * @DateTime 2018-03-17T14:29:04+0800
             * @param    {number}                 minimum [description]
             * @param    {number}                 maximum [description]
             */
            Slider.prototype.setParams = function (minimum, maximum) {
                this._slider.value = this._slider.min = minimum;
                this._slider.max = maximum;
                this.updateValues();
            };
            /**
             * 设置每次拖动的回调
             * @function setUpdateCallBack
             * @DateTime 2018-03-17T14:29:26+0800
             * @param    {Function}               fun     [description]
             * @param    {any}                    thisobj [description]
             */
            Slider.prototype.setUpdateCallBack = function (fun, thisobj) {
                this._update_fun = fun;
                this._update_thisobj = thisobj;
            };
            Object.defineProperty(Slider.prototype, "value", {
                /**
                 * 当前的值
                 * @DateTime 2018-03-17T14:29:49+0800
                 * @type   {number}
                 */
                get: function () {
                    return this._slider.value;
                },
                set: function (v) {
                    this._slider.value = v;
                    this.updateValues();
                    if (this._update_fun != null)
                        this._update_fun.apply(this._update_thisobj, [this._slider.value]);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slider.prototype, "enabled", {
                get: function () {
                    return !this._slider.disabled;
                },
                /**
                 * 是否禁用
                 * @DateTime 2018-03-17T14:29:49+0800
                 * @type   {boolean}
                 */
                set: function (value) {
                    this._slider.disabled = !value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slider.prototype, "visible", {
                get: function () {
                    return this._res.visible;
                },
                /**
                 * 是否显示
                 * @DateTime 2018-03-17T14:29:49+0800
                 * @type   {boolean}
                 */
                set: function (value) {
                    this._res.visible = value;
                },
                enumerable: true,
                configurable: true
            });
            Slider.prototype.onChange = function () {
                this.updateValues();
                if (this._update_fun != null)
                    this._update_fun.apply(this._update_thisobj, [this._slider.value]);
            };
            Slider.prototype.updateValues = function () {
                this._value_txt.text = this._slider.value + "";
                var scale = (this._slider.value - this._slider.min) / (this._slider.max - this._slider.min);
                scale = Math.max(0, scale);
                scale = Math.min(1, scale);
            };
            return Slider;
        }());
        control.Slider = Slider;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/3/15.
 */
var gamelib;
(function (gamelib) {
    var control;
    (function (control) {
        /**
         * 控制一些方法按顺序调用。
         * 先调用addStep，添加需要调用的回掉，
         * 最后调用start，开始顺序调用。
         *
         */
        var StepManager = /** @class */ (function () {
            function StepManager() {
                this._list = [];
            }
            /**
             * 添加回调
             * @param    {Function}               callBack  [description]
             * @param    {any}                    thisObj   [description]
             * @param    {Array<any>}             args      [description]
             * @param    {number}                 delayTime [在此方法调用后延迟多少毫秒调用下一个方法]
             */
            StepManager.prototype.addStep = function (callBack, thisObj, args, delayTime) {
                var obj = {
                    fun: callBack,
                    args: args,
                    thisObj: thisObj,
                    delay: delayTime
                };
                this._list.push(obj);
            };
            StepManager.prototype.clear = function () {
                this._list.length = 0;
                Laya.timer.clearAll(this);
            };
            /**
             * 开始调用列表中的方法
             * @function
             * @DateTime 2018-04-11T16:56:45+0800
             */
            StepManager.prototype.start = function () {
                if (this._list.length == 0) {
                    console.log("处理完成!");
                    return;
                }
                var obj = this._list.shift();
                var callBack = obj.fun;
                var thisObj = obj.thisObj;
                var args = obj.args;
                var delayTime = obj.delay;
                callBack.apply(thisObj, args);
                if (delayTime == 0)
                    this.start();
                else {
                    // egret.Tween.get(obj).wait(delayTime).call(this.start,this);
                    Laya.timer.once(delayTime, this, this.start);
                }
            };
            return StepManager;
        }());
        control.StepManager = StepManager;
    })(control = gamelib.control || (gamelib.control = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         *  距离检测系统
         *  @class DistanceCheck
         */
        var DistanceCheck = /** @class */ (function () {
            function DistanceCheck() {
            }
            Object.defineProperty(DistanceCheck, "s_instance", {
                get: function () {
                    if (DistanceCheck._instance == null)
                        DistanceCheck._instance = new gamelib.common.DistanceCheck();
                    return DistanceCheck._instance;
                },
                enumerable: true,
                configurable: true
            });
            DistanceCheck.prototype.setEnterBtn = function (btn) {
                if (btn == null)
                    return;
                this._enterBtn = btn;
                var temp = GameVar.g_platformData['distanceCheck'];
                if (temp == null || temp === false || GameVar.circleData.isGoldScoreModle() || GameVar.circleData.isMatch()) {
                    this._enterBtn.visible = false;
                    return;
                }
                this._enterBtn.on(laya.events.Event.CLICK, this, this.onShowDisUi);
            };
            DistanceCheck.prototype.setPlayerList = function (arr) {
                this._playerList = arr;
                if (this._ui)
                    this._ui.setPlayerList(arr);
            };
            DistanceCheck.prototype.destroy = function () {
                if (this._enterBtn)
                    this._enterBtn.off(laya.events.Event.CLICK, this, this.onShowDisUi);
                if (this._ui)
                    this._ui.destroy();
                this._ui = null;
                this._enterBtn = null;
                DistanceCheck._instance = null;
            };
            /**
             * 在开始的时候检测。如果有距离低于100米的，弹出提示框
             * @return 有距离低于100米的 true,否则false
             */
            DistanceCheck.prototype.checkInStart = function (okCallBack) {
                if (this._enterBtn == null || this._playerList == null)
                    return false;
                var b = false;
                for (var i = 0; i < this._playerList.length - 1; i++) {
                    if (this._playerList[i] == null)
                        continue;
                    for (var j = 1; j < this._playerList.length; j++) {
                        if (this._playerList[j] == null)
                            continue;
                        var dis = this._playerList[i].getDistanceNum(this._playerList[j]);
                        if (dis == -1)
                            continue;
                        if (dis < 100) {
                            b = true;
                            break;
                        }
                    }
                }
                if (b) {
                    this._ui = this._ui || new common.DistanceCheckUi();
                    this._ui.setPlayerList(this._playerList, okCallBack);
                    this._ui.show();
                }
                return b;
            };
            DistanceCheck.prototype.onShowDisUi = function (evt) {
                playButtonSound();
                this._ui = this._ui || new common.DistanceCheckUi();
                this._ui.setPlayerList(this._playerList);
                this._ui.show();
            };
            return DistanceCheck;
        }());
        common.DistanceCheck = DistanceCheck;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         *  距离检测系统
         *  @class DistanceCheck
         */
        var DistanceCheckUi = /** @class */ (function (_super) {
            __extends(DistanceCheckUi, _super);
            function DistanceCheckUi() {
                return _super.call(this, GameVar.s_namespace + "/Art_AnQuanJC") || this;
            }
            DistanceCheckUi.prototype.init = function () {
                this.addBtnToListener("btn_likai");
                this.addBtnToListener("btn_ok");
                this._res['txt_juli12'].text = "";
                this._res['txt_juli13'].text = "";
                this._res['txt_juli14'].text = "";
                this._res['txt_juli23'].text = "";
                this._res['txt_juli23'].text = "";
                this._res['txt_juli34'].text = "";
            };
            DistanceCheckUi.prototype.setPlayerList = function (list, okHandler) {
                if (list == null) {
                    console.log("须要设置要检测玩家的列表");
                    return;
                }
                this._okHandler = okHandler;
                var arr = [];
                for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                    var pd = list_2[_i];
                    if (pd == null)
                        continue;
                    arr.push(pd);
                }
                //设置头像
                for (var i = 0; i < 4; i++) {
                    var box = this._res['b_p' + (i + 1)];
                    var head = this._res['img_player' + (i + 1)];
                    if (i >= arr.length) {
                        box.visible = false;
                        continue;
                    }
                    box.visible = true;
                    head.skin = arr[i].m_headUrl;
                }
                this._res['txt_juli12'].text = "";
                this._res['txt_juli13'].text = "";
                this._res['txt_juli14'].text = "";
                this._res['txt_juli23'].text = "";
                this._res['txt_juli24'].text = "";
                this._res['txt_juli34'].text = "";
                if (arr.length == 4) {
                    this.setDis(0, 1, arr);
                    this.setDis(0, 2, arr);
                    this.setDis(0, 3, arr);
                    this.setDis(1, 2, arr);
                    this.setDis(1, 3, arr);
                    this.setDis(2, 3, arr);
                }
                else if (arr.length == 3) {
                    this.setDis(0, 1, arr);
                    this.setDis(0, 2, arr);
                    this.setDis(1, 2, arr);
                }
                else if (arr.length == 2) {
                    this.setDis(0, 1, arr);
                }
                var names = [];
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = 1; j < arr.length; j++) {
                        var dis = arr[i].getDistanceNum(arr[j]);
                        if (dis == -1)
                            continue;
                        if (dis < 100) {
                            if (names.indexOf(arr[i].m_name) == -1)
                                names.push(arr[i].m_name);
                            if (names.indexOf(arr[j].m_name) == -1)
                                names.push(arr[j].m_name);
                        }
                    }
                }
                if (names.length > 1 && !this._bTips) {
                    this._bTips = true; //同一局只提示一次
                    var str = "玩家" + names.join(",") + "距离低于100米,请注意";
                    g_uiMgr.showTip(str);
                }
            };
            DistanceCheckUi.prototype.setDis = function (seat1, seat2, arr) {
                var txt = this._res['txt_juli' + (seat1 + 1) + (seat2 + 1)];
                var user1 = arr[seat1];
                var user2 = arr[seat2];
                txt.text = user1.getDistance(user2);
            };
            DistanceCheckUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                if (evt.currentTarget.name == "btn_likai") {
                    g_qpqCommon.doJieSan();
                    this.close();
                }
                else {
                    if (this._okHandler)
                        this._okHandler.run();
                    this.close();
                }
            };
            return DistanceCheckUi;
        }(gamelib.core.BaseUi));
        common.DistanceCheckUi = DistanceCheckUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by code on 2017/8/2.
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         *  礼物赠送、接收显示管理
         *  @class GiftSystem
         */
        var GiftSystem = /** @class */ (function () {
            function GiftSystem() {
            }
            Object.defineProperty(GiftSystem, "s_instance", {
                get: function () {
                    if (GiftSystem._instance == null)
                        GiftSystem._instance = new gamelib.common.GiftSystem();
                    return GiftSystem._instance;
                },
                enumerable: true,
                configurable: true
            });
            GiftSystem.prototype.destroy = function () {
                if (this._ui)
                    this._ui.destroy();
                if (this._playerList)
                    this._playerList.length = 0;
                if (this._btns)
                    this._btns.length = 0;
                this._btns = null;
                this._playerList = null;
                this._ui = null;
                GiftSystem._instance = null;
            };
            Object.defineProperty(GiftSystem.prototype, "enable", {
                set: function (value) {
                    this._enabled = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 初始化各个参数
             * @function
             * @DateTime 2018-03-17T14:34:04+0800
             * @param    {Array<{any}>}         postions 需要显示礼物的位置。可以设置具体的x,y，也可以传入美术提供的资源对象
             * @param    {any}               tipArea  提示文本显示的位置
             * @param    {Array<laya.ui.Button>}  btns    礼物按钮列表。如果没有。传[];注意需要列表的第一个按钮为位置1的玩家，不是位置0的玩家
             */
            GiftSystem.prototype.init = function (postions, tipArea, btns) {
                this._enabled = true;
                this._sprite = this._sprite || new Laya.Box();
                var p;
                if (this._btns) {
                    for (var _i = 0, _a = this._btns; _i < _a.length; _i++) {
                        var btn = _a[_i];
                        btn.offAll();
                    }
                }
                this._btns = btns;
                this._labels = [];
                this._postions = postions;
                this._area = tipArea;
                for (var i = 0; i < this._btns.length; i++) {
                    var btn = this._btns[i];
                    btn['_localseat'] = (i + 1);
                    btn.on("click", this, this.onClickBtn);
                    p = btn.parent.parent;
                }
                if (p == null) {
                    if (postions[0] && postions[0]['parent'])
                        p = postions[0]['parent']['parent'];
                    else
                        p = g_layerMgr;
                }
                p.addChild(this._sprite);
                this._sprite.zOrder = 10;
            };
            GiftSystem.prototype.init_br = function (getpos, tipArea) {
                this._getPosFun = getpos;
                this._area = tipArea || { x: 1066, y: 498 };
                this._sprite = this._sprite || new Laya.Box();
                Laya.stage.addChild(this._sprite);
            };
            /**
             * 很重要。需要在牌桌玩家数据确定后，传进来，否则找不到玩家，礼物不会正确显示
             * @function setPlayerList
             * @DateTime 2018-03-17T14:37:03+0800
             * @param    {Array<gamelib.data.UserInfo>} list 牌桌玩家列表
             */
            GiftSystem.prototype.setPlayerList = function (list) {
                this._playerList = list;
            };
            GiftSystem.prototype.close = function () {
                Laya.Tween.clearAll(this);
                Laya.timer.clearAll(this);
            };
            /**
             * 显示礼物
             * @function showGift
             * @DateTime 2018-03-17T14:38:16+0800
             * @param    {any}               data [description]
             * @param    {number}            [flyTime =    1000]
             */
            GiftSystem.prototype.showGift = function (data, flyTime) {
                if (flyTime === void 0) { flyTime = 1000; }
                if (!data || !data.playerNum || !data.playerNum.length || !this._enabled || data.result == 0)
                    return;
                // if(this._playerList == null)
                // {
                //     console.log("GiftSystem 未设置玩家列表");
                //     return;
                // }
                if (data.playerNum.length > 1) {
                    this.oneToMore(data, flyTime);
                }
                else {
                    this.oneToOne(data, flyTime);
                }
            };
            GiftSystem.prototype.onClickBtn = function (evt) {
                this._ui = this._ui || new common.GiftsUi();
                var lc = evt.currentTarget['_localseat'];
                console.log("__lc:" + lc);
                for (var _i = 0, _a = this._playerList; _i < _a.length; _i++) {
                    var pd = _a[_i];
                    if (pd == null)
                        continue;
                    if (pd.m_seat_local == lc) {
                        this._ui.setPlayerId(pd.m_id);
                        // console.log("__lc:" + pd.m_seat_local +" "  + pd.m_name);
                        return;
                    }
                }
            };
            // 一对一 赠送
            GiftSystem.prototype.oneToOne = function (data, flyTime) {
                if (flyTime === void 0) { flyTime = 1000; }
                var item;
                var sendPos, recuvePos;
                var temp = this.getUrls(data.type);
                if (temp == null)
                    return;
                // 找到赠送者、接收者
                var sendPd = gamelib.core.getPlayerData(data.sendId);
                if (data.sendId && !sendPd)
                    return;
                var recivePd = gamelib.core.getPlayerData(data.playerNum[0].reciveId);
                if (!recivePd)
                    return;
                var sendseat = sendPd.m_seat_local;
                var reciveSeat = recivePd.m_seat_local;
                this.appendMsg(sendPd.m_name, recivePd.m_name, temp.img);
                if (this._getPosFun) {
                    sendPos = this._getPosFun(sendseat);
                    recuvePos = this._getPosFun(reciveSeat);
                }
                else {
                    sendPos = this._postions[sendseat];
                    recuvePos = this._postions[reciveSeat];
                }
                if (sendPos == null || recuvePos == null)
                    return;
                item = new GiftItem(data.type, temp.sound);
                item.setFlyTime(flyTime);
                item.flyTo(sendPos, recuvePos);
                this._sprite.addChild(item);
            };
            // 一对多 赠送
            GiftSystem.prototype.oneToMore = function (data, flyTime) {
                if (flyTime === void 0) { flyTime = 1000; }
                var item;
                var sendPos, recuvePos;
                var temp = this.getUrls(data.type);
                if (temp == null)
                    return;
                // 找到赠送者、接收者
                var sendPd = gamelib.core.getPlayerData(data.sendId);
                if (data.sendId && !sendPd)
                    return;
                var sendseat = sendPd.m_seat_local;
                // sendPos = this._postions[sendseat];
                if (this._getPosFun) {
                    sendPos = this._getPosFun(sendseat);
                }
                else {
                    sendPos = this._postions[sendseat];
                }
                for (var i = 0; i < data.playerNum.length; i++) {
                    var recivePd = gamelib.core.getPlayerData(data.playerNum[i].reciveId);
                    if (!recivePd || recivePd.m_id == sendPd.m_id)
                        continue;
                    var reciveSeat = recivePd.m_seat_local;
                    // recuvePos = this._postions[reciveSeat];
                    if (this._getPosFun) {
                        recuvePos = this._getPosFun(reciveSeat);
                    }
                    else {
                        recuvePos = this._postions[reciveSeat];
                    }
                    if (recuvePos == null)
                        continue;
                    item = new GiftItem(data.type, temp.sound);
                    item.setFlyTime(flyTime);
                    item.flyTo(sendPos, recuvePos);
                    this._sprite.addChild(item);
                }
                this.appendMsg(sendPd.m_name, getDesByLan("全桌玩家"), temp.img);
            };
            // 获取道具
            GiftSystem.prototype.getUrls = function (type) {
                var temp = {};
                var url = "qpq/daoju/Art_Hddj_";
                var img = "qpq/daoju/daoju_icon_";
                var sound = "";
                console.log(type);
                switch (type) {
                    case 1:
                        url += "xh"; // 鲜花
                        img += "1.png";
                        sound = "flower";
                        break;
                    case 2:
                        url += "fq"; // 番茄
                        img += "2.png";
                        sound = "egg";
                        break;
                    case 3:
                        url += "jd"; // 鸡蛋
                        img += "3.png";
                        sound = "egg";
                        break;
                    case 4:
                        url += "pd"; // 干杯
                        img += "4.png";
                        sound = "cheers";
                        break;
                    case 6:
                        url += "gou"; // 狗
                        img += "5.png";
                        sound = "dog";
                        break;
                    case 5:
                        url += "zj"; // 鸡
                        img += "6.png";
                        sound = "chiken";
                        break;
                    default:
                        return null;
                }
                temp.sound = sound;
                temp.url = url;
                temp.img = img;
                return temp;
            };
            // 设置消息
            GiftSystem.prototype.appendMsg = function (sendName, recName, type) {
                if (type === void 0) { type = ""; }
                if (GameVar.g_platformData['gift_tips'] === false) {
                    return;
                }
                var label = this.createTextField(sendName, recName, type);
                label.x = Laya.stage.width - label.width;
                label.y = this._area.y;
                this._sprite.addChild(label);
                if (GameVar.s_bActivate) {
                    laya.utils.Tween.to(label, { y: label.y - 100 }, 4000, null, laya.utils.Handler.create(this, this.removeOneLable, [label]));
                }
                else {
                    this.removeOneLable(label);
                }
            };
            GiftSystem.prototype.removeOneLable = function (obj) {
                if (obj) {
                    obj.parent.removeChild(obj);
                    obj = null;
                }
            };
            GiftSystem.prototype.createTextField = function (sendName, recName, type) {
                // 1 
                var spr = new Laya.Sprite();
                // 2 文本
                //创建 TextField 对象
                var label_1 = new laya.ui.Label(); // sendName
                var label_2 = new laya.ui.Label(); // "送给"
                var label_3 = new laya.ui.Label(); // recName
                // 道具图片
                var icon = new laya.ui.Image();
                icon.skin = type;
                // var bmp:laya.ui.Image = new laya.ui.Image();
                // bmp.skin = "bg_tips_fddj";
                // spr.addChild(bmp);
                spr.addChild(icon);
                spr.addChild(label_1);
                spr.addChild(label_2);
                spr.addChild(label_3);
                // 文本
                // 是否自动换行
                label_1.wordWrap = label_2.wordWrap = label_3.wordWrap = false;
                // //设置字体 字号
                label_1.font = label_2.font = label_3.font = "Arial";
                label_1.fontSize = label_2.fontSize = label_3.fontSize = 24;
                // //设置文本颜色
                label_1.strokeColor = label_2.strokeColor = label_3.strokeColor = "#000000"; // 描边颜色
                label_1.stroke = label_2.stroke = label_3.stroke = 2; // 描边
                label_1.color = "#ff3000";
                label_2.color = "#FFFFFF";
                label_3.color = "#ff9000";
                // //设置显示文本
                var temp_str = utils.StringUtility.GetSubstr(sendName, 8);
                sendName = temp_str == sendName ? sendName : temp_str + "...";
                temp_str = utils.StringUtility.GetSubstr(recName, 8);
                recName = temp_str == recName ? recName : temp_str + "...";
                label_1.text = sendName;
                label_2.text = getDesByLan("送给");
                label_3.text = recName;
                // 设置文本位置
                label_2.y = label_3.y = label_1.y;
                label_2.x = label_1.x + label_1.width;
                label_3.x = label_2.x + label_2.width;
                // 图片
                icon.x = label_3.x + label_3.width;
                icon.y = (label_1.height - icon.height) * 0.5;
                spr.width = icon.x + 30;
                // bmp.width = label_1.width + label_2.width + label_3.width + icon.width + 14;
                // bmp.height = label_1.height + 14;
                // bmp.x = -7;
                // bmp.y = -7;
                // spr.cacheAsBitmap = true;
                return spr;
            };
            return GiftSystem;
        }());
        common.GiftSystem = GiftSystem;
        var GiftItem = /** @class */ (function (_super) {
            __extends(GiftItem, _super);
            function GiftItem(type, sound) {
                var _this = _super.call(this) || this;
                _this._type = type;
                _this._animation = _this.getObjByType(type);
                // this._animation.visible = false;
                if (_this._animation["ani1"]) {
                    _this._ani = _this._animation["ani1"];
                }
                _this.addChild(_this._animation);
                _this._animation.anchorX = _this._animation.anchorY = 0.5;
                _this._sound = sound;
                _this._flyTime = 1000;
                _this.initData();
                return _this;
            }
            // 获取道具
            GiftItem.prototype.getObjByType = function (type) {
                var resname = "qpq/";
                switch (type) {
                    case 1: // 鲜花
                        resname += 'daoju/Art_Hddj_xh';
                        break;
                    case 2: // 番茄
                        resname += 'daoju/Art_Hddj_fq';
                        break;
                    case 3: // 鸡蛋
                        resname += 'daoju/Art_Hddj_jd';
                        break;
                    case 4: // 干杯
                        resname += 'daoju/Art_Hddj_pb';
                        break;
                    case 6: // 狗
                        resname += 'daoju/Art_Hddj_gou';
                        break;
                    case 5: // 鸡
                        resname += 'daoju/Art_Hddj_zj';
                        break;
                    default:
                        return null;
                }
                // this._scene = utils.tools.createSceneByViewObj(resname);
                // var classObj = gamelib.getDefinitionByName(resname);
                return utils.tools.createSceneByViewObj(resname);
            };
            GiftItem.prototype.initData = function () {
                this._stageSize = {};
                this._stageSize.width = g_gameMain.m_gameWidth;
                this._stageSize.height = g_gameMain.m_gameHeight;
                this.zOrder = 100;
            };
            GiftItem.prototype.init = function () {
            };
            GiftItem.prototype.close = function () {
                if (this._ani) {
                    this._ani.loop = false;
                    this._ani.stop();
                }
                this.visible = false;
                this.destroy();
            };
            // 设置 飞行时间
            GiftItem.prototype.setFlyTime = function (time_) {
                if (time_ != null)
                    this._flyTime = time_;
            };
            GiftItem.prototype.flyTo = function (sendPos, recuvePos, delayTime, bPlayeSound) {
                if (delayTime === void 0) { delayTime = 0; }
                if (bPlayeSound === void 0) { bPlayeSound = true; }
                if (bPlayeSound)
                    playSound_qipai("throw", 1, null, true);
                var send_pos;
                var recive_pos;
                send_pos = { x: sendPos.x, y: sendPos.y };
                recive_pos = { x: recuvePos.x, y: recuvePos.y };
                if (sendPos instanceof Laya.UIComponent) {
                    //x:要取到顶层的坐标
                    send_pos =
                        {
                            x: sendPos.parent['x'] + sendPos.x + sendPos.width / 2,
                            y: sendPos.parent['y'] + sendPos.y + sendPos.height / 2
                        };
                }
                else {
                    send_pos = { x: sendPos.x, y: sendPos.y };
                }
                if (recuvePos instanceof Laya.UIComponent) {
                    recive_pos = {
                        x: recuvePos.parent['x'] + recuvePos.x + recuvePos.width / 2,
                        y: recuvePos.parent['y'] + recuvePos.y + recuvePos.height / 2
                    };
                }
                else {
                    recive_pos = { x: recuvePos.x, y: recuvePos.y };
                }
                if (this._animation && this._ani) {
                    this.visible = true;
                    this._animation.visible = true;
                    this._ani.loop = true;
                    this._animation.x = send_pos.x;
                    this._animation.y = send_pos.y;
                    this._ani.gotoAndStop(1); // 初始到第一帧
                    var isPlayAtOnce = false; // 是否直接播放动画
                    var showTime = 1000; // 动画完成后的保留显示时长
                    var aniTime = this._ani.count * this._ani.interval; // 动画本身的时长
                    var totalTime = 0; // 总时长
                    totalTime += aniTime;
                    if (this._type != 2 && this._type != 3 && this._type != 6) // 番茄 鸡蛋 狗
                     {
                        isPlayAtOnce = true;
                        this._ani.play();
                    }
                    if (this._type == 5 || this._type == 4) // 鸡 干杯
                     {
                        this._animation.x = recive_pos.x;
                        this._animation.y = recive_pos.y;
                        this._flyTime = 0; // 动画飞行时间
                        this.giftSound();
                    }
                    else {
                        this._flyTime = 1000;
                        laya.utils.Tween.to(this._animation, { x: recive_pos.x, y: recive_pos.y, scaleX: 1, scaleY: 1, rotation: 0 }, this._flyTime, laya.utils.Ease.quartIn, null, delayTime, false);
                        Laya.timer.once(this._flyTime, this, this.giftSound);
                    }
                    totalTime += (isPlayAtOnce ? 0 : this._flyTime); // 直接播放则不增加额外时间， 否则增加额外的飞行时间
                    if (!isPlayAtOnce) {
                        Laya.timer.once(this._flyTime, this._ani, this._ani.play);
                    }
                    Laya.timer.once(totalTime, this, this.moveEnd);
                    if (this._type == 5 || this._type == 6) // 狗
                     {
                        showTime = 0;
                    }
                    totalTime += showTime;
                    Laya.timer.once(totalTime, this, this.remove);
                }
            };
            GiftItem.prototype.giftSound = function () {
                playSound_qipai(this._sound, 1, null, true);
            };
            GiftItem.prototype.moveEnd = function () {
                if (this._ani) {
                    this._ani.loop = false;
                    this._ani.stop();
                }
            };
            GiftItem.prototype.remove = function () {
                this.close();
            };
            return GiftItem;
        }(Laya.Sprite));
        common.GiftItem = GiftItem;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
* name
*/
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * @class
         * 赠送礼物界面。如果礼物面板不是在用户信息面板中，会打开这个界面
         */
        var GiftsUi = /** @class */ (function (_super) {
            __extends(GiftsUi, _super);
            function GiftsUi() {
                var _this = _super.call(this, GameVar.s_namespace + ".ui.Art_HddjUI") || this;
                _this._cd = 1000;
                return _this;
            }
            GiftsUi.prototype.init = function () {
                for (var i = 0; i < 6; i++) {
                    this.addBtnToListener('btn_' + (i + 1));
                }
                this.initTip();
            };
            GiftsUi.prototype.initTip = function () {
                if (this._res["txt_tips"]) {
                    this._tip = this._res["txt_tips"];
                    this._tip.visible = false;
                    var consume_ = GameVar.g_platformData["item_price"];
                    if (consume_ && consume_["num"]) {
                        var str = consume_["name"];
                        switch (consume_) {
                            case 1024:
                                {
                                    str = getDesByLan("钻石");
                                }
                                break;
                            case 1000:
                                str = getDesByLan("钻石");
                                break;
                        }
                        str = getDesByLan("每次使用消耗") + consume_["num"] + str;
                        this._tip.text = str;
                        this._tip.visible = true;
                    }
                }
            };
            GiftsUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this.initTip();
                this._lastSendTime = 0;
            };
            GiftsUi.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };
            GiftsUi.prototype.onClickObjects = function (evt) {
                var name_ = evt.currentTarget.name;
                //1 鲜花 2 番茄 3 鸡蛋 4 干杯 5 鸡 6 狗
                var type = parseInt(name_.split("_")[1]);
                playButtonSound();
                if (type) {
                    if (Laya.timer.currTimer - this._lastSendTime >= this._cd) {
                        sendNetMsg(0x2010, this.m_playerId, type);
                        this._lastSendTime = Laya.timer.currTimer;
                        this.close();
                    }
                }
            };
            /**
             * 打开的时候需要设置当前打开的是哪个玩家
             * @function
             * @DateTime 2018-03-17T14:31:52+0800
             * @param    {number}                 playerId [description]
             */
            GiftsUi.prototype.setPlayerId = function (playerId) {
                this.m_playerId = playerId;
                this.show();
            };
            return GiftsUi;
        }(gamelib.core.BaseUi));
        common.GiftsUi = GiftsUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
* name
*/
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var MailInfoUi = /** @class */ (function (_super) {
            __extends(MailInfoUi, _super);
            function MailInfoUi() {
                return _super.call(this, "qpq/Art_MailTips.scene") || this;
            }
            MailInfoUi.prototype.init = function () {
                this._list = this._res["list_1"];
                this._ylq = this._res["img_ylq"];
                this._name = this._res["txt_1"];
                this._title = this._res["txt_2"];
                this._info = this._res["txt_3"];
                this._time = this._res["txt_4"];
                this._ok = this._res["btn_ok"];
                this._info.editable = false;
                this.addBtnToListener("btn_ok");
            };
            MailInfoUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._list.on(laya.events.Event.RENDER, this, this.onItemUpdate);
                this._list.dataSource = this._data.items || [];
            };
            MailInfoUi.prototype.onClose = function () {
                this._list.off(laya.events.Event.RENDER, this, this.onItemUpdate);
            };
            MailInfoUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                if (this._data.items) {
                    sendNetMsg(0x0054, this._data.m_id, 3);
                }
                this.close();
            };
            MailInfoUi.prototype.onItemUpdate = function (item, index) {
                var msId = this._data.items[index][0];
                var num = this._data.items[index][1];
                var url = this.getItemUrl(msId);
                getChildByName(item, "img_goods").skin = url;
                var txt_num = getChildByName(item, "txt_num");
                if (num < 1)
                    txt_num.visible = false;
                else {
                    txt_num.visible = true;
                    txt_num.text = utils.tools.getMoneyByExchangeRate(num);
                }
            };
            MailInfoUi.prototype.getItemUrl = function (msId) {
                var temp = gamelib.data.GoodsData.s_goodsInfo[msId];
                if (temp) {
                    return utils.tools.getRemoteUrl(temp.model_icon);
                }
                return GameVar.common_ftp + "shop/item_" + msId + ".png";
            };
            MailInfoUi.prototype.setData = function (data) {
                this._data = data;
                this._ok.visible = !this._data.extraGetted && this._data.hasExtra;
                this._ylq.visible = this._data.extraGetted && this._data.hasExtra;
                this._name.text = getDesByLan("发件人") + ":" + getDesByLan("系统邮件");
                this._title.text = data.title;
                this._info.text = data.info;
                this._time.text = data.createTime;
                gamelib.Api.ApplicationEventNotify("mail", data.title);
            };
            return MailInfoUi;
        }(gamelib.core.BaseUi));
        common.MailInfoUi = MailInfoUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
* name
*/
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * 邮件ui
         * @class MailUi
         */
        var MailUi = /** @class */ (function (_super) {
            __extends(MailUi, _super);
            function MailUi() {
                return _super.call(this, "qpq/Art_Mail.scene") || this;
            }
            MailUi.prototype.reciveNetMsg = function (msgId, data) {
                var md;
                switch (msgId) {
                    case 0x0053: //获取邮件列表
                        gamelib.data.MailData.s_list.length = 0;
                        for (var i = 0; i < data.num.length; i++) {
                            md = gamelib.data.MailData.ReadMail(data.num[i]);
                        }
                        this.showMainUI();
                        break;
                    case 0x0054: //操作邮件
                        md = gamelib.data.MailData.GetMail(data.id, false);
                        if (data.result == 1) {
                            if (data.op == 1) {
                                md.status = 4;
                                this.update(md);
                            }
                            else if (data.op == 2) {
                                this.deleteMaile(data.id);
                            }
                            else if (data.op == 3) {
                                g_uiMgr.showTip(getDesByLan("领取成功"));
                                md.extraGetted = true;
                                this.update(md);
                            }
                            else if (data.op == 4) {
                                g_uiMgr.showTip(getDesByLan("领取成功"));
                                gamelib.data.MailData.AllGet();
                                this.update(null);
                            }
                            else if (data.op == 5) {
                                g_uiMgr.showTip(getDesByLan("操作成功"));
                                gamelib.data.MailData.AllRead();
                                this.update(null);
                            }
                        }
                        else {
                            g_uiMgr.showTip(getDesByLan("操作失败"));
                        }
                        break;
                    case 0x0056:
                        this.updateBtns();
                        break;
                }
            };
            MailUi.prototype.deleteMaile = function (id) {
                var len = gamelib.data.MailData.s_list.length;
                for (var i = 0; i < len; i++) {
                    if (gamelib.data.MailData.s_list[i].m_id == id) {
                        gamelib.data.MailData.s_list.splice(i, 1);
                        break;
                    }
                }
                this.update(null);
            };
            MailUi.prototype.update = function (data) {
                if (data == null) {
                    this._list.refresh();
                    var txt = this._res["txt_txt"];
                    if (txt != null) {
                        txt.visible = this._dataSource.length == 0;
                    }
                }
                else {
                    var index = this._dataSource.indexOf(data);
                    this._list.changeItem(index, data);
                }
                this.updateBtns();
            };
            MailUi.prototype.showInfo = function (data) {
                this._mainInfo = this._mainInfo || new common.MailInfoUi();
                this._mainInfo.setData(data);
                this._mainInfo.show();
            };
            MailUi.prototype.showMainUI = function () {
                this._dataSource = gamelib.data.MailData.s_list;
                this._list.dataSource = this._dataSource;
                var txt = this._res["txt_txt"];
                if (txt != null) {
                    txt.visible = this._dataSource.length == 0;
                }
                this.updateBtns();
            };
            MailUi.prototype.updateBtns = function () {
                this._allGet.visible = gamelib.data.MailData.canGet();
                this._allRead.visible = gamelib.data.UserInfo.s_self.m_unreadMailNum != 0;
                if (this._allGet.visible == this._allRead.visible) {
                    this._allGet.x = this._x2;
                    this._allRead.x = this._x1;
                }
                else {
                    if (this._allGet.visible)
                        this._allGet.x = this._x3;
                    else
                        this._allRead.x = this._x3;
                }
            };
            MailUi.prototype.init = function () {
                this._allGet = this._res["btn_lingqu"];
                this._allRead = this._res["btn_yidu"];
                this._list = this._res["list_1"];
                this._list.dataSource = [];
                this._list.scrollBar.autoHide = true;
                this._x1 = Math.min(this._allRead.x, this._allGet.x);
                this._x2 = Math.max(this._allRead.x, this._allGet.x);
                this._x3 = this._x1 + (this._x2 - this._x1) / 2;
                this.addBtnToListener("btn_yidu");
                this.addBtnToListener("btn_lingqu");
                this._noticeOther = true;
                this._list.selectEnable = true;
                this._list.selectHandler = new laya.utils.Handler(this, this.onSelect);
                this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
            };
            MailUi.prototype.onClickObjects = function (evt) {
                playButtonSound();
                switch (evt.currentTarget) {
                    case this._allGet:
                        sendNetMsg(0x0054, 0, 4);
                        gamelib.Api.ApplicationEventNotify('mail_click', '全部领取');
                        break;
                    case this._allRead:
                        sendNetMsg(0x0054, 0, 5);
                        gamelib.Api.ApplicationEventNotify('mail_click', '全部已读');
                        break;
                }
            };
            MailUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                sendNetMsg(0x0053, 1, 0, 20); //需要每次请求，有新邮件需要更新
                this._allGet.visible = this._allRead.visible = false;
                // this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
            };
            MailUi.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                // this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
            };
            MailUi.prototype.onSelect = function (index) {
                if (index == -1)
                    return;
                var md = this._list.dataSource[index];
                if (md.status == 3) {
                    md.status = 4;
                    sendNetMsg(0x0054, md.m_id, 1);
                }
                this.showInfo(md);
                this._list.selectedIndex = -1;
            };
            MailUi.prototype.onItemUpdate = function (item, index) {
                var sd = this._dataSource[index];
                getChildByName(item, "txt_1").text = sd.title;
                getChildByName(item, "txt_2").text = sd.itemsDes;
                getChildByName(item, "txt_3").text = sd.createTime;
                getChildByName(item, "txt_4").text = sd.leftTime;
                var lq = getChildByName(item, "btn_lingqu");
                // lq.visible = sd.hasExtra && !sd.extraGetted;
                lq.off(laya.events.Event.CLICK, this, this.onGetOnItem);
                lq.on(laya.events.Event.CLICK, this, this.onGetOnItem);
                // item.off(laya.events.Event.CLICK,this, this.onClickItem);
                // item.on(laya.events.Event.CLICK,this, this.onClickItem);
                if (sd.status == 4) {
                    if (sd.hasExtra) {
                        if (sd.extraGetted) {
                            //已读，已领取 显示删除
                            lq.visible = true;
                            lq.label = getDesByLan("删除");
                        }
                    }
                    else {
                        lq.visible = true;
                        lq.label = getDesByLan("删除");
                    }
                }
                else {
                    if (sd.hasExtra && !sd.extraGetted)
                        lq.label = getDesByLan("领取");
                    else
                        lq.label = getDesByLan("查看");
                }
                var img = getChildByName(item, "img_mail");
                if (sd.status == 4) {
                    img.skin = "qpq/comp/mail_2.png";
                }
                else {
                    img.skin = "qpq/comp/mail_1.png";
                }
                item["__mail"] = sd;
            };
            MailUi.prototype.onGetOnItem = function (evt) {
                evt.stopPropagation();
                var index = evt.currentTarget.parent["__mail"].m_id;
                if (evt.currentTarget["label"] == getDesByLan("删除")) {
                    sendNetMsg(0x0054, index, 2);
                    gamelib.Api.ApplicationEventNotify('mail_click', '删除');
                }
                else if (evt.currentTarget["label"] == getDesByLan("查看")) {
                    var md = evt.currentTarget.parent["__mail"];
                    if (md.status == 3) {
                        md.status = 4;
                        sendNetMsg(0x0054, md.m_id, 1);
                    }
                    this.showInfo(md);
                }
                else {
                    sendNetMsg(0x0054, index, 3);
                    gamelib.Api.ApplicationEventNotify('mail_click', '领取');
                }
            };
            return MailUi;
        }(gamelib.core.Ui_NetHandle));
        common.MailUi = MailUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var MailUi2 = /** @class */ (function (_super) {
            __extends(MailUi2, _super);
            function MailUi2() {
                return _super.call(this, "qpq/Art_Mail") || this;
            }
            MailUi2.prototype.reciveNetMsg = function (msgId, data) {
                var md;
                switch (msgId) {
                    case 0x0053: //获取邮件列表
                        gamelib.data.MailData.s_list.length = 0;
                        for (var i = 0; i < data.num.length; i++) {
                            md = gamelib.data.MailData.ReadMail(data.num[i]);
                        }
                        this.refreshList(true);
                        break;
                    case 0x0054: //操作邮件
                        md = gamelib.data.MailData.GetMail(data.id, false);
                        var getItemList;
                        if (data.result == 1) {
                            if (data.op == 1) {
                                md.status = 4;
                            }
                            else if (data.op == 2 || data.op == 6) //删除。如果有附件，自动领取
                             {
                                if (data.id == 0) { //删除所有
                                    getItemList = gamelib.data.MailData.GetItems(gamelib.data.MailData.s_list);
                                }
                                else {
                                    getItemList = gamelib.data.MailData.GetItems(md);
                                }
                                gamelib.data.MailData.RemoveMail(data.id);
                            }
                            else if (data.op == 3) //单个领取
                             {
                                g_uiMgr.showTip(getDesByLan("领取成功"));
                                getItemList = gamelib.data.MailData.GetItems(md);
                                md.extraGetted = true;
                            }
                            else if (data.op == 4) {
                                g_uiMgr.showTip(getDesByLan("领取成功")); //全部领取
                                getItemList = gamelib.data.MailData.GetItems(gamelib.data.MailData.s_list);
                                gamelib.data.MailData.AllGet();
                            }
                            else if (data.op == 5) //全部已读
                             {
                                g_uiMgr.showTip(getDesByLan("操作成功"));
                                gamelib.data.MailData.AllRead();
                            }
                            if (getItemList && getItemList.length > 0)
                                g_signal.dispatch(gamelib.GameMsg.PLAYGETITEMEFFECT, getItemList);
                            this.refreshList();
                        }
                        else {
                            g_uiMgr.showTip(getDesByLan("操作失败"));
                        }
                        break;
                }
            };
            MailUi2.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                sendNetMsg(0x0053, 1, 0, 50); //需要每次请求，有新邮件需要更新     
                this._tips.text = getDesByLan("空邮件提示");
                this._sender.text = getDesByLan("发件人") + ":" + getDesByLan("系统邮件");
            };
            MailUi2.prototype.refreshList = function (changeIndexToZero) {
                if (changeIndexToZero === void 0) { changeIndexToZero = false; }
                this._list.dataSource = gamelib.data.MailData.s_list;
                this.onSelecteChange();
                this._tips.visible = gamelib.data.MailData.s_list.length == 0;
                this._res['btn_sc'].visible = !this._tips.visible;
                if (changeIndexToZero)
                    this._list.selectedIndex = 0;
            };
            MailUi2.prototype.onClickObjects = function (evt) {
                switch (evt.currentTarget.name) {
                    case "btn_lq":
                        evt.currentTarget['visible'] = false;
                        sendNetMsg(0x0054, this._currentMail.m_id, 3);
                        break;
                    case "btn_sc": //全部删除
                        sendNetMsg(0x0054, 0, 6);
                        break;
                }
            };
            MailUi2.prototype.init = function () {
                this._list = this._res['list_1'];
                this._time = this._res['txt_time'];
                this._sender = this._res['txt_name'];
                this._info = this._res['txt_txt'];
                this._itemList = this._res['list_2'];
                this._sender.text = this._time.text = this._info.text = "";
                this._info.editable = false;
                this.addBtnToListener("btn_lq");
                this.addBtnToListener("btn_sc");
                this._ok = this._res['btn_lq'];
                this._ylq = this._res['img_ylq'];
                this._tips = this._res['txt_tips'];
                this._list.dataSource = [];
                this.onSelecteChange();
                this._list.renderHandler = Laya.Handler.create(this, this.onMailListRender, null, false);
                this._list.selectEnable = true;
                this._list.selectHandler = Laya.Handler.create(this, this.onSelecteChange, null, false);
                this._itemList.renderHandler = Laya.Handler.create(this, this.onItemListRender, null, false);
            };
            MailUi2.prototype.onMailListRender = function (box, index) {
                var icon_img = getChildByName(box, "img_lq");
                var title_txt = getChildByName(box, "txt_1");
                var status_img = getChildByName(box, "img_icon");
                var time_txt = getChildByName(box, "txt_2");
                var md = this._list.dataSource[index];
                var delete_btn = getChildByName(box, 'btn_close');
                var select_img = getChildByName(box, "img_2");
                select_img.visible = index == this._list.selectedIndex;
                title_txt.text = md.title;
                time_txt.text = md.createDate;
                status_img.skin = md.status == 3 ? "qpq/comp/mail_1.png" : "qpq/comp/mail_2.png";
                icon_img.visible = md.hasExtra;
                if (icon_img.visible) {
                    if (md.extraGetted) //已领取
                     {
                        icon_img.skin = "qpq/window/img_fujian1.png";
                    }
                    else {
                        icon_img.skin = "qpq/window/img_fujian.png";
                    }
                }
                delete_btn.offAll(Laya.Event.CLICK);
                delete_btn.on(Laya.Event.CLICK, this, this.removeMaile, [md]);
            };
            MailUi2.prototype.removeMaile = function (md) {
                sendNetMsg(0x0054, md.m_id, 2);
            };
            MailUi2.prototype.onItemListRender = function (box, index) {
                var icon_img = getChildByName(box, "img_goods");
                var txt_num = getChildByName(box, "txt_num");
                var data = this._itemList.dataSource[index];
                var num = data[1];
                var url = gamelib.data.GoodsData.GetGoodsIconByMsId(data[0]);
                icon_img.skin = url;
                if (num < 1)
                    txt_num.visible = false;
                else {
                    txt_num.visible = true;
                    txt_num.text = utils.tools.getMoneyByExchangeRate(num);
                }
            };
            MailUi2.prototype.onSelecteChange = function () {
                var selectIndex = this._list.selectedIndex;
                var md = this._list.dataSource[selectIndex];
                if (md == null) {
                    this._ok.visible = this._ylq.visible = false;
                    this._itemList.dataSource = [];
                    this._info.text = "";
                    this._sender.text = this._time.text = "";
                    return;
                }
                if (md.status == 3) {
                    md.status = 4;
                    sendNetMsg(0x0054, md.m_id, 1);
                }
                this._time.text = md.createTime;
                this._info.text = md.info;
                this._ok.visible = !md.extraGetted && md.hasExtra;
                this._ylq.visible = md.extraGetted && md.hasExtra;
                this._currentMail = md;
                this._itemList.dataSource = md.items || [];
            };
            return MailUi2;
        }(gamelib.core.Ui_NetHandle));
        common.MailUi2 = MailUi2;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var moregame;
        (function (moregame) {
            moregame.s_debug = false;
            /**
             * 金币场ui。微棋牌圈的界面
             * @class MoreGame
             */
            var MoreGame = /** @class */ (function (_super) {
                __extends(MoreGame, _super);
                function MoreGame() {
                    return _super.call(this, "qpq.ui.Art_MoreGameUI") || this;
                }
                MoreGame.prototype.init = function () {
                    this._res['img_2'].visible = false;
                    var list = [];
                    // var temp:any = Laya.loader.getRes(GameVar.common_ftp + "hall/moregame.json" + g_game_ver_str);
                    // var temp:any = Laya.loader.getRes(GameVar.common_ftp + "hall/moregame.json" + g_game_ver_str);
                    // temp = temp[GameVar.platform];
                    var temp = { games: [] };
                    var base = "";
                    if (GameVar.s_game_id == 5) //棋牌圈
                        base = "icons_2";
                    else
                        base = "icons_1";
                    base = base || "";
                    this._list = this._res["list_1"];
                    if (temp != null) {
                        for (var i = 0; i < temp.games.length; i++) {
                            var obj = temp.games[i];
                            if (obj.gameId == GameVar.s_game_id)
                                continue;
                            g_childGame.addGameIdConfig(obj.gz_id, obj.gameId, obj.isLaya);
                            obj.url = GameVar.common_ftp + "hall/" + base + "/" + obj.res;
                            list.push(obj);
                        }
                    }
                    this._list.selectEnable = true;
                    this._list.selectHandler = Laya.Handler.create(this, this.onListSelecet, null, false);
                    this._list.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
                    this._list.dataSource = list;
                    this._list.scrollBar.autoHide = true;
                    // this._list.itemRenderer = MoreGameItem
                    // this._list.dataProvider = new eui.ArrayCollection(list);
                };
                MoreGame.prototype.onListRender = function (cell, index) {
                    var game = getChildByName(cell, 'img_game');
                    var iMask = getChildByName(cell, 'img_mask');
                    var iIcon = getChildByName(cell, 'img_icon');
                    var jd = getChildByName(cell, 'txt_jd');
                    var name_txt = getChildByName(cell, 'txt_game');
                    cell['txt_jd'] = jd;
                    var gamedata = this._list.dataSource[index];
                    game.skin = gamedata.url;
                    name_txt.text = gamedata.name;
                    jd.text = "";
                    iIcon.visible = false;
                    jd.visible = iMask.visible = false;
                    getChildByName(cell, 'img_jisu').visible = false;
                    var arcMask = cell['arcmask'];
                    arcMask = arcMask || new gamelib.control.ArcMask(iMask.width * 1.4);
                    arcMask.pre = 0;
                    arcMask.y = arcMask.x = iMask.width / 2;
                    cell['arcmask'] = arcMask;
                    iIcon.mask = arcMask;
                };
                MoreGame.prototype.onListSelecet = function (index) {
                    if (index == -1)
                        return;
                    this._selected_game = this._list.dataSource[index];
                    if (moregame.s_debug || utils.tools.isApp() && moregame.checkLoaderValid()) {
                        moregame.addWatch(moregame.COMPLETE, this.onGameCached, this);
                        moregame.addWatch(moregame.UPDATE, this.onLoaderProcess, this);
                        moregame.startLoad(this._selected_game.gz_id);
                    }
                    else {
                        this.enterGame();
                    }
                };
                MoreGame.prototype.enterGame = function () {
                    if (this._selected_game == null)
                        return;
                    g_childGame.enterGameByClient(this._selected_game.gz_id);
                    this.close();
                };
                MoreGame.prototype.onGameCached = function (loader) {
                    for (var i = 0; i < this._list.dataSource.length; i++) {
                        if (loader.gz_id == this._list.dataSource[i].gz_id) {
                            var box = this._list.cells[i];
                            var iMask = getChildByName(box, 'img_mask');
                            var iIcon = getChildByName(box, 'img_icon');
                            var jd = getChildByName(box, 'txt_jd');
                            iMask.visible = iIcon.visible = false;
                            jd.text = "";
                            break;
                        }
                    }
                    if (loader.gz_id == this._selected_game.gz_id) {
                        this.enterGame();
                    }
                };
                MoreGame.prototype.onLoaderProcess = function (loader) {
                    for (var i = 0; i < this._list.dataSource.length; i++) {
                        if (loader.gz_id == this._list.dataSource[i].gz_id) {
                            var box = this._list.cells[i];
                            var iMask = getChildByName(box, 'img_mask');
                            var iIcon = getChildByName(box, 'img_icon');
                            iMask.visible = iIcon.visible = true;
                            box['arcmask'].pre = loader.curValue;
                            box["txt_jd"].text = loader.toPercent();
                            box["txt_jd"].visible = true;
                            return;
                        }
                    }
                };
                return MoreGame;
            }(gamelib.core.BaseUi));
            moregame.MoreGame = MoreGame;
        })(moregame = common.moregame || (common.moregame = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
//     export class MoreGameItem extends eui.ItemRenderer {
//         private _mask:control.ArcMask;
//         public constructor() {
//             super();
//             this.skinName = "GameHall_itemSkin";
//         }
//         public dataChanged():void
//         {
//             this["txt_txt"].text = this.data["name"];
//             this["gameicon"].source = this.data["url"];
//             this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickItem,this);
//             this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickItem,this);
//             if(this["barG"]) {
//                 this["barG"].visible = false;
//                 this._mask = new gamelib.control.ArcMask(64);
//                 this["bar_mask"].source = this._mask;
//                 this._mask.x = this['bg'].width / 2;
//                 this._mask.y = this['bg'].height / 2;
//                 this["barG"].addChild(this._mask);
//                 this["bar"].mask = this._mask;
//             }
//         }
//         private onClickItem(evt:egret.TouchEvent):void
//         {
//             if(PreLoad.checkCacheValid(this.data.gz_id)) {
//                 this.enterGame();
//             } else {
//                 PreLoad.addWatch(PreLoad.COMPLETE,this.onLoaded,this);
//                 PreLoad.addWatch(PreLoad.UPDATE,this.onLoaderProcess,this);
//                 PreLoad.startLoad(this.data.gz_id);
//                 if(this["barG"]) {
//                     this["barG"].visible = true;
//                 }
//             }
//         }
//         private onLoaderProcess(loader:PreLoad):void {
//             if(loader.gz_id == this.data.gz_id) {
//                 if(this._mask) {
//                     this._mask.pre = loader.curValue;
//                     this["txt_jd"].text = loader.toPercent();
//                 }
//             }
//         }
//         private onLoaded(loader:PreLoad):void {
//             if(loader.gz_id == this.data.gz_id) {
//                 this.enterGame();
//             }
//         }
//         private enterGame():void {
//             g_uiMgr.showMiniLoading();
//             g_child.enterGameByClient(this.data.gz_id);
//         }
//     }
// }
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var moregame;
        (function (moregame) {
            moregame.UPDATE = "on_update";
            moregame.COMPLETE = "on_complete";
            /**
             * 检查缓存组件是否可用
             * */
            function checkLoaderValid() {
                return window['application_check_game_cache'] != null;
            }
            moregame.checkLoaderValid = checkLoaderValid;
            /**
             * 开始缓存指定游戏
             * @param {number} gz_id [description]
             */
            function startLoad(gz_id) {
                console.log("init loader " + gz_id + "...");
                if (moregame.s_debug || checkLoaderValid()) {
                    moregame.loaders = moregame.loaders || {};
                    if (moregame._loading) {
                        moregame._loading.stopUpdate = true;
                    }
                    if (!moregame.loaders[gz_id]) {
                        moregame._loading = new PreLoad(gz_id);
                        moregame.loaders[gz_id] = moregame._loading;
                        moregame._loading.onCacheUpdate();
                        console.log("    success:new loader started");
                    }
                    else {
                        moregame._loading = moregame.loaders[gz_id];
                        moregame._loading.stopUpdate = false;
                        console.log("    success:game loader exist");
                    }
                }
                else {
                    console.log("    fail:loader not available");
                }
            }
            moregame.startLoad = startLoad;
            function addWatch(type, onHandle, thisArg) {
                moregame._watchers = moregame._watchers || {};
                moregame._watchers[type] = moregame._watchers[type] || [];
                moregame._watchers[type].push({ onHandle: onHandle, thisArg: thisArg });
            }
            moregame.addWatch = addWatch;
            function removeWatch(type, onHandle, thisArg) {
                if (!moregame._watchers) {
                    return;
                }
                if (!moregame._watchers[type]) {
                    return;
                }
                var watchers = this._watchers[type];
                for (var i = 0; i < watchers.length; i++) {
                    if (watchers[i].onHandle == onHandle) {
                        watchers.splice(i, 1);
                        break;
                    }
                }
            }
            moregame.removeWatch = removeWatch;
            function updateProcess(loader) {
                dispatch(moregame.UPDATE, loader);
            }
            moregame.updateProcess = updateProcess;
            function onLoaded(loader) {
                dispatch(moregame.COMPLETE, loader);
                moregame.loaders[loader.gz_id] = null;
                delete moregame.loaders[loader.gz_id];
            }
            moregame.onLoaded = onLoaded;
            function dispatch(type, loader) {
                if (moregame._watchers && moregame._watchers[type]) {
                    var watchers = moregame._watchers[type];
                    for (var i = 0; i < watchers.length; i++) {
                        watchers[i].onHandle.call(watchers[i].thisArg, loader);
                    }
                }
            }
            moregame.dispatch = dispatch;
            var PreLoad = /** @class */ (function () {
                function PreLoad(id) {
                    this.loaded = false;
                    this._stop = false;
                    this.gz_id = id;
                    this._lastCheck = 0;
                    this._load = window['application_check_game_cache'](id, this.onCacheComplete, this);
                    this.intervalIndex = setInterval(this.onCacheUpdate.bind(this), 100);
                }
                PreLoad.prototype.onCacheComplete = function () {
                    this.loaded = true;
                    this._lastCheck = 100;
                    clearInterval(this.intervalIndex);
                    if (!this._stop) {
                        onLoaded(this);
                    }
                };
                Object.defineProperty(PreLoad.prototype, "curValue", {
                    get: function () {
                        return this._lastCheck / 100;
                    },
                    enumerable: true,
                    configurable: true
                });
                PreLoad.prototype.toPercent = function () {
                    if (this._lastCheck == 0)
                        return "";
                    var back = this._lastCheck + "";
                    return back;
                };
                Object.defineProperty(PreLoad.prototype, "stopUpdate", {
                    get: function () {
                        return this._stop;
                    },
                    set: function (value) {
                        if (this._stop != value) {
                            this._stop = value;
                            if (value) {
                                clearInterval(this.intervalIndex);
                            }
                            else {
                                this.intervalIndex = setInterval(this.onCacheUpdate.bind(this), 100);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                PreLoad.prototype.onCacheUpdate = function () {
                    if (!this._load || !window['application_check_game_cache'] || this.stopUpdate) {
                        return;
                    }
                    var curPercent = this._load.get_download_percent();
                    this._lastCheck = curPercent;
                    updateProcess(this);
                    // if(this.loaded) {
                    //     this.onCacheComplete();
                    // }
                };
                return PreLoad;
            }());
            moregame.PreLoad = PreLoad;
        })(moregame = common.moregame || (common.moregame = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
* name
*/
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * 商城界面
         * @class ShopUi
         */
        var ShopUi = /** @class */ (function (_super) {
            __extends(ShopUi, _super);
            function ShopUi() {
                return _super.call(this, "qpq/Art_Shop.scene") || this;
            }
            ShopUi.prototype.init = function () {
                this._list = this._res["list_1"];
                // this._list.selectEnable = true;
                this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
                // this._list.selectHandler = new laya.utils.Handler(this, this.onSelect);
                this._pfMoney = this._res['txt_pfMoney'];
                this._noticeOther = true;
                if (this._list.scrollBar)
                    this._list.scrollBar.autoHide = true;
            };
            ShopUi.prototype.reciveNetMsg = function (msgId, data) {
                if (msgId == 0x0036 || msgId == 0x002D) {
                    this.update();
                }
            };
            ShopUi.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                this._list.dataSource = gamelib.data.ShopData.s_shopDb.goods;
                this.update();
                if (this._pfMoney) {
                    gamelib.Api.checkPlatfromMoney(Laya.Handler.create(this, this.update));
                }
            };
            ShopUi.prototype.onItemUpdate = function (item, index) {
                var gd = this._list.dataSource[index];
                var img_goods = getChildByName(item, "img_goods");
                img_goods.skin = utils.tools.getRemoteUrl(gd.image);
                var txt = getChildByName(item, "btn_buy.txt_1");
                txt.text = gd.price_unit + utils.tools.getMoneyDes(gd.price);
                var txt = getChildByName(item, "txt_3");
                txt.text = utils.tools.getMoneyDes(gd.items[0].num);
                var zhekou = getChildByName(item, "img_th");
                var hot = getChildByName(item, "img_hot");
                if (zhekou) {
                    zhekou.visible = gd.desc != null && gd.desc.zekou;
                }
                if (hot) {
                    hot.visible = gd.desc != null && gd.desc.hot;
                }
                var btn = getChildByName(item, "btn_buy");
                btn.offAll(Laya.Event.CLICK);
                btn.on(Laya.Event.CLICK, this, this.onBuy, [gd]);
            };
            /**
             * 购买单个道具
             * @param {laya.events.Event} evt [description]
             */
            ShopUi.prototype.onBuy = function (gd) {
                playButtonSound();
                gamelib.Api.buyItem(gd.goods_id);
            };
            ShopUi.prototype.update = function () {
                this._res["txt_diamond"].text = utils.tools.getMoneyByExchangeRate(gamelib.data.UserInfo.s_self.getGold_num()) + "";
                if (this._pfMoney)
                    this._pfMoney.text = GameVar.platfromMoney + "";
            };
            return ShopUi;
        }(gamelib.core.Ui_NetHandle));
        common.ShopUi = ShopUi;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var data;
    (function (data_1) {
        /**
         * @class 喇叭数据
         */
        var BugleData = /** @class */ (function () {
            function BugleData() {
            }
            BugleData.getData = function (data) {
                if (BugleData.s_list.length >= BugleData.s_maxNum) {
                    BugleData.s_list.shift();
                }
                var temp = new BugleData();
                temp.m_msg = data.msg;
                temp.m_sendId = data.sendId;
                temp.m_sendName = data.sendName;
                BugleData.s_list.push(temp);
                return temp;
            };
            BugleData.s_list = [];
            BugleData.s_maxNum = 100; //保存100条记录
            return BugleData;
        }());
        data_1.BugleData = BugleData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/9/26.
 */
var gamelib;
(function (gamelib) {
    var data;
    (function (data) {
        /**
         * 棋牌圈相关信息
         * @class CircleData
         */
        var CircleData = /** @class */ (function () {
            function CircleData() {
                /**
                 * 房主pid
                 * @type {number}
                 */
                this.fzPid = 0; //创建牌局玩家id
                /**
                 * 牌局验证码
                 * @type {string}
                 */
                this.validation = ""; //
                /**
                 * 组局id
                 * @type {number}
                 */
                this.groupId = 0;
            }
            CircleData.prototype.selfIsFz = function () {
                return GameVar.pid == this.fzPid;
            };
            /**
             * 是否是金币积分模式
             * @return {boolean} [description]
             */
            CircleData.prototype.isGoldScoreModle = function () {
                if (GameVar.g_platformData["groupInfo"]) {
                    try {
                        var obj = JSON.parse(GameVar.g_platformData["groupInfo"].gamePlayJson);
                        if (obj.pay_mode == 3 && (isNaN(obj.isPublic) || obj.isPublic != 0))
                            return true;
                        else
                            return false;
                    }
                    catch (_a) {
                    }
                }
                if (this.info && this.info.extra_data && this.info.extra_data.pay_mode == 3)
                    return true;
                return false;
            };
            CircleData.prototype.isMatch = function () {
                return GameVar.game_args && GameVar.game_args["matchId"];
            };
            return CircleData;
        }());
        data.CircleData = CircleData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var data;
    (function (data) {
        /**
         * @class
         * 数据基类
         */
        var GameData = /** @class */ (function () {
            function GameData() {
                this._id = 0;
                this._resId = 0;
            }
            Object.defineProperty(GameData.prototype, "m_id", {
                /**
                 * @property {number} m_id
                 * 序列号
                 */
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "m_resId", {
                get: function () {
                    return this._resId;
                },
                /**
                 * @property {number} m_resId
                 * 资源id
                 *
                 */
                set: function (value) {
                    this._resId = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameData.prototype, "m_name", {
                /**
                 * @property {string} m_name
                 * 对象名
                 */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method
             * 清理数据
             */
            GameData.prototype.clear = function () {
                this._resId = 0;
                this._name = '';
            };
            /**
             * @method
             * 销毁数据
             */
            GameData.prototype.destroy = function () {
                this._id = 0;
                this.clear();
            };
            /**
             * 输出对象
             * @returns {string}
             */
            GameData.prototype.toString = function () {
                return "name: " + this._name + " id:" + this.m_id;
            };
            return GameData;
        }());
        data.GameData = GameData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
///<reference path="./GameData.ts" />
var gamelib;
(function (gamelib) {
    var data;
    (function (data) {
        /**
         * 好友数据
         * @class FirendData
         */
        var FirendData = /** @class */ (function (_super) {
            __extends(FirendData, _super);
            function FirendData() {
                return _super.call(this) || this;
            }
            FirendData.getFirendById = function (id, forceCreate) {
                if (forceCreate === void 0) { forceCreate = true; }
                var pd = FirendData.s_list[id];
                if (pd == null && forceCreate) {
                    pd = new FirendData();
                    pd.m_id = id;
                    FirendData.s_list[id] = pd;
                }
                return pd;
            };
            FirendData.parseFirendData = function (obj) {
                for (var i = obj.list.length - 1; i >= 0; i--) {
                    var pd = FirendData.getFirendById(obj.list[i].id);
                    for (var key in obj.list[i]) {
                        pd['m_' + key] = obj.list[i][key];
                    }
                }
            };
            FirendData.getFirendByPID = function (pid) {
                for (var key in FirendData.s_list) {
                    if (FirendData.s_list[key].m_pid == pid)
                        return FirendData.s_list[key];
                }
                return;
            };
            FirendData.s_list = {};
            return FirendData;
        }(data.GameData));
        data.FirendData = FirendData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
/**
* name
*/
var gamelib;
(function (gamelib) {
    var data;
    (function (data) {
        /**
         * 平台配置数据相关
         * @class PlatformConfigs
         */
        var PlatformConfigs = /** @class */ (function () {
            function PlatformConfigs() {
                /**
                 * 是否显示铜钱
                 * @type {boolean}
                 * */
                this.show_money = false;
                /**
                 * 界面类型【1-棋牌圈，2-牛牛大厅】
                 * @type {number}
                 * */
                this.hall_type = 1;
                /**
                 * 创建游戏后是否自动进入房间
                 * @type {boolean}
                 */
                this.autoEnterGame = false;
                /**
                 * 金币名字
                 * @type {string}
                 */
                this.gold_name = "铜钱";
                /**
                 * 金币物品的msid
                 * @type {gold_type}
                 */
                this.gold_type = 1000;
                /**
                 * 金币名字
                 * @type {string}
                 */
                this.gold_name_zj = "房卡";
                /**
                 * 金币物品的msid
                 * @type {gold_type}
                 */
                this.gold_type_zj = 1024;
                /**
                 * 棋牌圈的game_id
                 * @type {number}
                 */
                this.qpq_game_id = 5;
            }
            return PlatformConfigs;
        }());
        data.PlatformConfigs = PlatformConfigs;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
///<reference path="./PlatformConfigs.ts" />
/**
 * @class
 * 登录数据相关
 * @author wx
 *
 */
var GameVar = /** @class */ (function () {
    function GameVar() {
    }
    Object.defineProperty(GameVar, "s_game_id", {
        get: function () {
            return GameVar.getValyeByKey("gameid");
        },
        set: function (value) {
            GameVar._game_id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "s_bActivate", {
        //是否激活状态
        get: function () {
            return Laya.stage.isFocused;
        },
        enumerable: true,
        configurable: true
    });
    GameVar.destroy = function () {
        GameVar.s_game_args = null;
        GameVar.s_circleData = null;
        GameVar.s_circle_args = null;
    };
    Object.defineProperty(GameVar, "game_args", {
        get: function () {
            if (GameVar.s_game_args == null) {
                var str = GameVar._urlParams["game_args"];
                if (str == null || str == "") {
                    GameVar.s_game_args = {};
                }
                else {
                    GameVar.s_game_args = JSON.parse(str);
                }
            }
            return GameVar.s_game_args;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "validation", {
        /**
         * 组局验证码
         * @returns {any}
         */
        get: function () {
            return GameVar.circle_args["validation"];
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "groupId", {
        get: function () {
            return GameVar.circle_args["groupId"];
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "circleData", {
        get: function () {
            GameVar.s_circleData = GameVar.s_circleData || new gamelib.data.CircleData();
            return GameVar.s_circleData;
        },
        set: function (value) {
            GameVar.s_circleData = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "circle_args", {
        get: function () {
            if (GameVar.s_circle_args == null) {
                if (GameVar._urlParams["circle_args"] == null || GameVar._urlParams["circle_args"] == "") {
                    GameVar.s_circle_args = {};
                }
                else {
                    var str = decodeURIComponent(GameVar._urlParams["circle_args"]);
                    GameVar.s_circle_args = JSON.parse(str);
                    GameVar.circleData.validation = GameVar.s_circle_args["validation"];
                }
            }
            return GameVar.s_circle_args;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "urlParam", {
        get: function () {
            return GameVar._urlParams || {};
        },
        set: function (value) {
            GameVar.s_circle_args = null;
            GameVar.s_circleData = null;
            GameVar.s_game_args = null;
            GameVar._urlParams = value;
        },
        enumerable: true,
        configurable: true
    });
    GameVar.clearCircleData = function () {
        GameVar.circle_args["validation"] = null;
    };
    /**
     * @method
     * @private
     * 通过可以获得对应的值
     * @param value
     * @static
     * @returns {any}
     */
    GameVar.getValyeByKey = function (value) {
        return GameVar._urlParams[value];
    };
    Object.defineProperty(GameVar, "ip_addr", {
        get: function () {
            return GameVar.getValyeByKey("ip_addr");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "common_ftp", {
        get: function () {
            if (GameVar.getValyeByKey("ftp"))
                return GameVar.getValyeByKey("ftp") + "common/";
            return GameVar.getValyeByKey("game_path") + "common/";
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "game_ver", {
        get: function () {
            return GameVar.getValyeByKey("game_ver");
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "s_app_verify", {
        //当前是否是审核版本
        get: function () {
            if (window['application_app_verify'])
                return window['application_app_verify']();
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "gz_id", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("gz_id"));
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "main_gz_id", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("maingz_id"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "src_gz_id", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("src_gz_id"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "gameMode", {
        //0：主游戏 1:子游戏
        get: function () {
            var temp = parseInt(GameVar.getValyeByKey("gameMode"));
            if (temp == null || temp == undefined)
                temp = 0;
            return temp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "resource_path", {
        get: function () {
            if (GameVar.getValyeByKey("game_path") != null)
                return GameVar.getValyeByKey("game_path");
            return "";
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "game_code", {
        get: function () {
            if (GameVar.getValyeByKey("game_code") != null)
                return GameVar.getValyeByKey("game_code");
            return "";
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "ts", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("ts"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "target_gz_id", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("target_gz_id"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "pid", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("pid"));
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "platform", {
        get: function () {
            return (GameVar.getValyeByKey("platform"));
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "session", {
        get: function () {
            return (GameVar.getValyeByKey("username")) || GameVar.getValyeByKey("loginkey");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "serverIp", {
        get: function () {
            return (GameVar.getValyeByKey("GameNetCore")).split(":")[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "wss_host", {
        get: function () {
            return GameVar.getValyeByKey("wss_host");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "ws_host", {
        get: function () {
            var url = GameVar.getValyeByKey("ws_host");
            if (url == "" || url == null) {
                url = GameVar.getValyeByKey("GameNetCore");
            }
            return url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "protocol", {
        /**
         * 返回 http 或者https
         *
         * @returns {string}
         */
        get: function () {
            var str = GameVar.getValyeByKey("protocol");
            if (str == "" || str == null || typeof (str) == "undefined")
                str = "http://";
            return str;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "serverPort", {
        get: function () {
            return (GameVar.getValyeByKey("GameNetCore")).split(":")[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "platformVipLevel", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("level"));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "isGameVip", {
        get: function () {
            return parseInt(GameVar.getValyeByKey("shop_id")) > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "sex", {
        get: function () {
            var sex = parseInt(GameVar.getValyeByKey("gender"));
            if (sex == 1)
                sex = 1;
            else if (sex == 2)
                sex = 0;
            else
                sex = 0; //utils.MathUtility.random(0, 1);
            return sex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "playerHeadUrl", {
        get: function () {
            var urlReg1 = /\|/g;
            var str = GameVar.getValyeByKey("icon_url");
            if (str == null)
                str = "https://open.8z.net/m/icons/default.png";
            str = str.replace(urlReg1, "&");
            str = str.replace("http://", GameVar.protocol);
            //if(egret.Capabilities.renderMode == "webgl")
            //{
            //    str = "getimage.php?url=" + encodeURIComponent(str);
            //}
            return str;
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "playerHeadUrl_ex", {
        get: function () {
            // var urlReg1 = /\|/g;
            // var str:string = GameVar.getValyeByKey("icon_url");
            // if (str == null)
            //     return "http://open.8z.net/m/icons/default.png";
            // return str.replace(urlReg1, "&");
            return GameVar.playerHeadUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "payurl", {
        get: function () {
            var urlReg = /\|\|/g;
            return GameVar.getValyeByKey("pay_url").replace(urlReg, "&");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "nickName", {
        get: function () {
            var nickname = GameVar.getValyeByKey("nickname");
            if (nickname == null || nickname == "null") {
                nickname = "";
            }
            else {
                var arr = ["天天德州", "金币收售", "收售金币", "官方客服"];
                for (var i; i < arr.length; i++) {
                    nickname = nickname.replace(arr[i], "****");
                }
                var characters = nickname.split("");
                var strLen = characters.length;
                for (var i = strLen - 1; i >= 0; i--) {
                    if (characters[i] == ";" ||
                        characters[i] == " " ||
                        characters[i] == "\\" ||
                        characters[i] == "'" ||
                        characters[i] == '"' ||
                        characters[i] == ",")
                        characters.splice(i, 1);
                }
                nickname = characters.join("");
                if (utils.StringUtility.GetStrLen(nickname) > 16)
                    nickname = utils.StringUtility.GetSubstr(nickname, 16);
            }
            return utils.tools.getBanWord(nickname);
        },
        set: function (value) {
            throw new Error("只读属性");
        },
        enumerable: true,
        configurable: true
    });
    GameVar.s_version = "0";
    /**
     * 平台配置相关的数据
     * @type {gamelib.data.PlatformConfigs}
     * @static
     */
    GameVar.g_platformData = new gamelib.data.PlatformConfigs();
    /**
     * @property {number} s_netDelay
     * 网络延时
     * @static
     */
    GameVar.s_netDelay = 0;
    /**
     * @property {number} s_loginSeverTime
     * 登录服务器时间 秒
     * @static
     */
    GameVar.s_loginSeverTime = 0;
    /**
     * 登录服务器时，客服端本地的时间。Laya.timer.currTimer的值
     * @type {number}
     */
    GameVar.s_loginClientTime = 0;
    GameVar.s_namespace = "qpq";
    /**
     * @property {string} s_gameName
     * 当前游戏名，例如为erddz，ddz，nn,
     * 这个值是通过
     *
     */
    GameVar.s_gameName = "";
    GameVar.dir = "c"; //当前方向
    GameVar.s_firstBuy = false; //首充是否可用
    GameVar.s_firstBuyGift = false; //首充礼包是否可用
    /**
     * 周卡和月卡。state:0没购买，1：未领取，2：已领取，endTime：到期时间
     * @type {number}
     */
    GameVar.s_item_zhou = { endTime: 0, state: 0 }; //周卡
    GameVar.s_item_yue = { endTime: 0, state: 0 }; //月卡
    /**
     * 游戏返回棋牌圈的参数
     * @type {null}
     */
    GameVar.s_game_args = null;
    /**
     * 棋牌圈参数
     * @type {null}
     */
    GameVar.s_circle_args = null;
    /**
     * @property {number} appid
     * @static
     */
    GameVar.appid = "";
    //平台货币数量，因为获取的时候userinfo可能还没创建
    GameVar.platfromMoney = 0;
    return GameVar;
}());
window["GameVar"] = GameVar;
var gamelib;
(function (gamelib) {
    var data;
    (function (data) {
        /**
         * 商品信息
         * @class
         * @ignore 除了msID的定义外，其他的都不使用了
         */
        var GoodsData = /** @class */ (function (_super) {
            __extends(GoodsData, _super);
            function GoodsData() {
                var _this = _super.call(this) || this;
                _this._msId = 0;
                _this._num = 0;
                _this._price = 0; //物品价值
                _this._priceType = 0; //价值类型
                _this._priceOrg = 0;
                _this._baseNum = 0;
                _this._payType = 0;
                _this._info = '';
                return _this;
            }
            GoodsData.GetGoodsInfoByMsId = function (msId) {
                return GoodsData.s_goodsInfo[msId];
            };
            GoodsData.GetGoodsIconByMsId = function (msId) {
                var gd = GoodsData.s_goodsInfo[msId];
                if (gd == null)
                    return "";
                var url = gd.model_icon;
                return utils.tools.getRemoteUrl(url);
            };
            GoodsData.GetGoodsImageByMsId = function (msId) {
                var gd = GoodsData.s_goodsInfo[msId];
                if (gd == null)
                    return "";
                var url = gd.model_image;
                return utils.tools.getRemoteUrl(url);
            };
            //mode_type:0x1显示在背包中，0x2可以使用，0x4微信红包
            GoodsData.checkGoodsCanUse = function (msId) {
                var gd = GoodsData.s_goodsInfo[msId];
                if (gd == null)
                    return false;
                if (gd.model_type & 0x2)
                    return true;
                return false;
            };
            GoodsData.checkGoodsShowInBag = function (msId) {
                var gd = GoodsData.s_goodsInfo[msId];
                if (gd == null)
                    return false;
                if (gd.model_type & 0x1)
                    return true;
                return false;
            };
            GoodsData.GetNameByMsId = function (msId) {
                var str = GoodsData.s_goodsNames[msId];
                if (str != null)
                    return str;
                if (GameVar.g_platformData) {
                    if (msId == GameVar.g_platformData.gold_type)
                        return GameVar.g_platformData.gold_name;
                }
                switch (msId) {
                    case GoodsData.MSID_BQK:
                        return "补签卡";
                    case GoodsData.MSID_JJK:
                        return "救济卡";
                    case GoodsData.MSID_XYX1:
                        return "小幸运星";
                    case GoodsData.MSID_XYX2:
                        return "大幸运星";
                    case GoodsData.MSID_XYX3:
                        return "超级幸运星";
                    case GoodsData.MSID_TQ:
                        return getDesByLan("铜钱");
                    case GoodsData.MSID_HB:
                        return getDesByLan("红包");
                    case GoodsData.MSID_LB:
                        return getDesByLan("喇叭");
                    case GoodsData.MSID_JINQUAN:
                        return getDesByLan("金券");
                    case GoodsData.MSID_ZUANSHI:
                        return getDesByLan("钻石");
                }
                return "物品" + msId;
            };
            GoodsData.GetGoodsData = function (id, forceCreate) {
                if (forceCreate === void 0) { forceCreate = true; }
                var gd = GoodsData._goodsList[id];
                if (gd == null && forceCreate) {
                    gd = new GoodsData();
                    gd.m_id = id;
                    GoodsData._goodsList[id] = gd;
                }
                return gd;
            };
            GoodsData.Clear = function () {
                for (var key in GoodsData._goodsList) {
                    var gd = GoodsData._goodsList[key];
                    if (gd != null)
                        gd.clear();
                    delete GoodsData._goodsList[key];
                }
            };
            GoodsData.RemoveGoodsData = function (id) {
                var gd = GoodsData._goodsList[id];
                if (gd != null)
                    gd.clear();
                delete GoodsData._goodsList[id];
            };
            /**
             * 添加一个物品到商城物品列表中。
             * @param type
             * @param goods
             *
             */
            GoodsData.AddShopGoods = function (type, goods) {
                if (goods == null)
                    return;
                var arr = GoodsData._shopGoodsList[type];
                if (arr == null) {
                    arr = [];
                    GoodsData._shopGoodsList[type] = arr;
                }
                if (arr.indexOf(goods) == -1) {
                    arr.push(goods);
                }
            };
            GoodsData.GetShopGoodsByType = function (type) {
                var arr = GoodsData._shopGoodsList[type];
                return arr;
            };
            Object.defineProperty(GoodsData.prototype, "msId", {
                get: function () {
                    return this._msId;
                },
                set: function (value) {
                    this._msId = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "m_resId", {
                get: function () {
                    return this._resId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "num", {
                get: function () {
                    return this._num;
                },
                set: function (value) {
                    this._num = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "m_price", {
                get: function () {
                    return this._price;
                },
                /**
                 * 价值
                 * @param value
                 *
                 */
                set: function (value) {
                    this._price = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "m_price_type", {
                /**
                 * 价值类型 1000:铜钱 1002，红包
                 *
                 */
                get: function () {
                    return this._priceType;
                },
                set: function (value) {
                    this._priceType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "price_str", {
                get: function () {
                    var str = this._price + '';
                    if (this._payType == 1000) {
                        str += "铜钱";
                    }
                    else if (this._payType == 1002) {
                        str += "红包";
                    }
                    return str;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "priceOrg", {
                get: function () {
                    return this._priceOrg;
                },
                /**
                 * 原价
                 * @param value
                 *
                 */
                set: function (value) {
                    this._priceOrg = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "baseNum", {
                get: function () {
                    return this._baseNum;
                },
                /**
                 *  物品基数
                 * @param value
                 *
                 */
                set: function (value) {
                    this._baseNum = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "payType", {
                get: function () {
                    return this._payType;
                },
                /**
                 *  支付方式 0x08元宝兑换 0x10 彩券兑换+
                 * @param value
                 *
                 */
                set: function (value) {
                    this._payType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoodsData.prototype, "info", {
                get: function () {
                    return this._info;
                },
                set: function (value) {
                    this._info = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 红包 1002
             */
            GoodsData.MSID_HB = 1002;
            /**
             * 铜钱 1000；
             */
            GoodsData.MSID_TQ = 1000;
            /**
             * 喇叭
             */
            GoodsData.MSID_LB = 1010;
            /**
             * 财神卡
             */
            GoodsData.MSID_CS = 1011;
            /**
             * 乐币
             */
            GoodsData.MSID_LEBI = 1020;
            /**
             * 小游戏积分
             */
            GoodsData.MSID_SMSCORE = 1021;
            /**
             * 平台货币
             */
            GoodsData.MSID_PLATFORMCOIN = 1050;
            /**
             * 宝箱
             */
            GoodsData.MSID_BOX = 1131;
            /**
             * 万能钥匙
             */
            GoodsData.MSID_KEY = 1132;
            /**
             * 猜拳助手
             */
            GoodsData.MSID_GUESSHELPERNUM = 1121;
            /**
             * 金券
             * @type {number}
             */
            GoodsData.MSID_JINQUAN = 1023;
            /**
             * 钻石，棋牌圈使用，相当于金券
             * @type {number}
             */
            GoodsData.MSID_ZUANSHI = 1024;
            /**
            * 补签卡
            */
            GoodsData.MSID_BQK = 1022;
            GoodsData.MSID_XYX1 = 1016; //小幸运星
            GoodsData.MSID_XYX2 = 1017; //大幸运星
            GoodsData.MSID_XYX3 = 1018; //超幸运星
            GoodsData.MSID_JJK = 1019; //救济卡
            GoodsData.MSID_HPK = 1101; //换牌卡
            GoodsData.MSID_JBK = 1102; //禁比卡
            GoodsData.MSID_FBK = 1103; //翻倍卡
            GoodsData.s_goodsNames = {};
            GoodsData.s_goodsInfo = {};
            GoodsData._goodsList = {};
            GoodsData._shopGoodsList = {};
            return GoodsData;
        }(data.GameData));
        data.GoodsData = GoodsData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var data;
    (function (data_2) {
        /**
         * 邮件数据
         * @class MailData
         * @author wx
         */
        var MailData = /** @class */ (function (_super) {
            __extends(MailData, _super);
            function MailData() {
                var _this = _super.call(this) || this;
                /**
                 *  状态 4:已读，3：未读
                 */
                _this.status = 0;
                /**
                 * 标题
                 */
                _this.title = '';
                /**
                 * 邮件内容
                 */
                _this.info = "";
                //附件是否被领取了
                _this.extraGetted = false;
                //是否有附件
                _this.hasExtra = false;
                //附件
                _this.items = null;
                //创建时间
                _this._createTime = '';
                //附件的描述
                _this._items_des = "";
                return _this;
            }
            MailData.GetMail = function (id, forceCreate) {
                if (forceCreate === void 0) { forceCreate = true; }
                var md;
                for (var i = 0; i < MailData.s_list.length; i++) {
                    md = MailData.s_list[i];
                    if (md.m_id != id) {
                        md = null;
                    }
                    else {
                        break;
                    }
                }
                if (md == null && forceCreate) {
                    md = new MailData();
                    md.m_id = id;
                    MailData.s_list.push(md);
                }
                return md;
            };
            MailData.AllGet = function () {
                for (var i = 0; i < MailData.s_list.length; i++) {
                    var md = MailData.s_list[i];
                    md.extraGetted = true;
                    md.status = 4;
                }
                gamelib.data.UserInfo.s_self.m_unreadMailNum = 0;
                g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA, 0);
            };
            /**
             *
             * @param md 获得邮件的所有附件。如果指定的邮件已经被领取，则没有附件
             */
            MailData.GetItems = function (md) {
                if (md == null)
                    return null;
                var arr = [];
                if (md instanceof MailData) {
                    if (!md.extraGetted && md.hasExtra) {
                        for (var _i = 0, _a = md.items; _i < _a.length; _i++) {
                            var good = _a[_i];
                            getGoods(good[0], good[1]);
                        }
                    }
                }
                else if (md instanceof Array) {
                    for (var _b = 0, md_1 = md; _b < md_1.length; _b++) {
                        var mailD = md_1[_b];
                        if (!mailD.extraGetted && mailD.hasExtra) {
                            for (var _c = 0, _d = mailD.items; _c < _d.length; _c++) {
                                var good = _d[_c];
                                getGoods(good[0], good[1]);
                            }
                        }
                    }
                }
                function getGoods(msId, num) {
                    var goods;
                    for (var _i = 0, arr_7 = arr; _i < arr_7.length; _i++) {
                        var gd = arr_7[_i];
                        if (gd.msId == msId) {
                            gd.num += num;
                            return gd;
                        }
                    }
                    goods = { 'msId': msId, num: num };
                    arr.push(goods);
                    return goods;
                }
                return arr;
            };
            MailData.AllRead = function () {
                for (var i = 0; i < MailData.s_list.length; i++) {
                    var md = MailData.s_list[i];
                    md.status = 4;
                }
                gamelib.data.UserInfo.s_self.m_unreadMailNum = 0;
                g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA, 0);
            };
            /**
             * 是否有未领取附件的邮件
             */
            MailData.canGet = function () {
                for (var i = 0; i < MailData.s_list.length; i++) {
                    var md = MailData.s_list[i];
                    if (md.hasExtra && !md.extraGetted) {
                        return true;
                    }
                }
                return false;
            };
            MailData.ReadMail = function (obj) {
                var md = MailData.GetMail(obj.id, true);
                md.status = obj.status;
                md.title = obj.title;
                if (obj.info != null) {
                    obj.content = obj.info;
                }
                var str = obj.content.trim();
                //trace("前:" +str);
                str = str.replace(/\r\n/g, "<br>");
                str = str.replace(/\n/g, "<br>");
                str = str.replace(/\t/g, "<tr>");
                //trace("后:" +str);
                var temp = JSON.parse(str);
                md.info = temp.content;
                md.info = md.info.replace(/<br>/g, "\r\n");
                md.info = md.info.replace(/<tr>/g, "\t");
                temp = temp.items;
                if (temp != null) {
                    md.items = [];
                    for (var key in temp) {
                        md.items.push([parseInt(key), temp[key]]);
                    }
                }
                if (obj.recycleTime != null)
                    md._leftTime = obj.recycleTime;
                md.setCreateTime(obj.time);
                md.setDes();
                md.hasExtra = obj.hasExtra != 0;
                md.extraGetted = obj.extraGetted != 0;
                return md;
            };
            MailData.RemoveMail = function (id) {
                if (id == 0) //	删除所有的
                 {
                    MailData.s_list.length = 0;
                    return;
                }
                for (var i = 0; i < MailData.s_list.length; i++) {
                    var md = MailData.s_list[i];
                    if (id == md.m_id) {
                        MailData.s_list.splice(i, 1);
                        return;
                    }
                }
            };
            Object.defineProperty(MailData.prototype, "createTime", {
                /**
                 * 创建时间
                 */
                get: function () {
                    return this._createTime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MailData.prototype, "createDate", {
                /**
                 * 创建日期
                 */
                get: function () {
                    return this._createTime.split(" ")[0];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MailData.prototype, "itemsDes", {
                get: function () {
                    return this._items_des;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MailData.prototype, "leftTime", {
                get: function () {
                    var temp = (this._leftTime - GameVar.s_loginSeverTime);
                    var day = temp / (3600 * 24);
                    day = parseInt(day + "");
                    if (day < 0)
                        day = 0;
                    return getDesByLan("剩余") + day + getDesByLan("天");
                },
                enumerable: true,
                configurable: true
            });
            MailData.prototype.setDes = function () {
                this._items_des = "";
                if (this.items == null)
                    return;
                for (var i = 0; i < this.items.length; i++) {
                    this._items_des += gamelib.data.GoodsData.GetNameByMsId(this.items[i][0]) + ":" + utils.tools.getMoneyByExchangeRate(this.items[i][1]) + " ";
                }
            };
            MailData.prototype.setCreateTime = function (value) {
                var data = new Date();
                data.setTime(value * 1000);
                var str = data.getFullYear() + "-";
                str += (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1);
                str += "-";
                str += data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
                str += " ";
                str += data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
                str += ":";
                str += data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
                str += ":";
                str += data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
                this._createTime = str;
            };
            MailData.prototype.toString = function () {
                var str = this._createTime + " 创建的 标题为'" + this.title + "'状态是:" + status;
                return str;
            };
            MailData.s_list = [];
            return MailData;
        }(data_2.GameData));
        data_2.MailData = MailData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var data;
    (function (data_3) {
        var MathData = /** @class */ (function (_super) {
            __extends(MathData, _super);
            function MathData() {
                return _super.call(this) || this;
            }
            MathData.ParseList = function (data) {
                MathData.s_list.length = 0;
                var type = data.type;
                var arr = data.list;
                for (var _i = 0, arr_8 = arr; _i < arr_8.length; _i++) {
                    var obj = arr_8[_i];
                    var md = new MathData();
                    md.type = type;
                    utils.tools.copyTo(obj, md);
                    MathData.s_list.push(md);
                }
            };
            MathData.GetMatchDataById = function (id, type) {
                for (var _i = 0, _a = MathData.s_list; _i < _a.length; _i++) {
                    var md = _a[_i];
                    if (md['id'] == id) {
                        if (isNaN(type))
                            return md;
                        if (md['type'] == type)
                            return md;
                        continue;
                    }
                }
                return null;
            };
            MathData.s_list = [];
            return MathData;
        }(gamelib.data.GameData));
        data_3.MathData = MathData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/4.
 */
var gamelib;
(function (gamelib) {
    var data;
    (function (data_4) {
        /**
         * 网络配置数据，包括音乐音效的开关，新手引导的开关.各种需要保存在服务器的配置
         * 不要实例化次类。调用请使用g_net_configData
         * @class NetConfigDatas
         */
        var NetConfigDatas = /** @class */ (function () {
            function NetConfigDatas() {
                this.m_waitConfig = true;
                this.m_bFirstLoginDay = false; //当天是否是第一次登录
            }
            /**
             * 保存配置。
             * @function addConfig
             * @DateTime 2018-03-17T14:49:58+0800
             * @param    {string}                 key   保存和读取的键。
             * @param    {any}                    value [description]
             */
            NetConfigDatas.prototype.addConfig = function (key, value) {
                this[key] = value;
                try {
                    if (key == "sound") {
                        g_soundMgr.m_sound = value != 0;
                    }
                    else if (key == "music") {
                        //在播放后马上暂停会报错
                        if (Laya.timer.currTimer - g_soundMgr.m_lastBgmPlayTime <= 500) {
                            Laya.timer.once(500, this, this.addConfig, [key, value]);
                        }
                        else {
                            g_soundMgr.m_music = value != 0;
                        }
                    }
                }
                catch (e) {
                }
            };
            NetConfigDatas.prototype.getConfig = function (key) {
                return this[key];
            };
            /**
             * 通过类型来获取配置
             * @function getConfigByType
             * @DateTime 2018-03-17T14:50:51+0800
             * @param    {number}  type  0：sound,1:music,2:sub_sound,方言,3:guide
             * @return   {any}   [description]
             */
            NetConfigDatas.prototype.getConfigByType = function (type) {
                var key = this.getKey(type);
                return this.getConfig(key);
            };
            /**
             * 通过类型来保存配置
             * @function addConfigByType
             * @DateTime 2018-03-17T14:51:42+0800
             * @param    {number}  type  type  0：sound,1:music,2:sub_sound,方言,3:guide
             * @param    {any}                 value [description]
             */
            NetConfigDatas.prototype.addConfigByType = function (type, value) {
                var key = this.getKey(type);
                this.addConfig(key, value);
            };
            NetConfigDatas.prototype.getKey = function (type) {
                var key = "key" + type;
                switch (type) {
                    case 0:
                        key = "sound";
                        break;
                    case 1:
                        key = "music";
                        break;
                    case 2:
                        key = "sub_sound";
                        break;
                    case 3:
                        key = "guide";
                        break;
                }
                return key;
            };
            /**
             * 向服务器发包，保存当前的配置
             * @function saveConfig
             * @DateTime 2018-03-17T14:52:17+0800
             */
            NetConfigDatas.prototype.saveConfig = function () {
                // sendNetMsg(0x003F,JSON.stringify(this));
                sendNetMsg(0x0040, JSON.stringify(this));
                if (utils.tools.isWxgame()) {
                    window['wx'].setStorage({
                        key: "config",
                        data: JSON.stringify(this)
                    });
                }
            };
            /**
             * 解析网络配置数据
             * @function getNetConfog
             * @DateTime 2018-03-17T14:52:42+0800
             * @param    {any}                    data [description]
             */
            NetConfigDatas.prototype.getNetConfog = function (data) {
                // if(g_soundMgr.m_waitConfig)
                // {
                //     g_soundMgr.m_waitConfig = false;
                // }
                // this.m_waitConfig = false;    
                // try
                // {
                //     var temp = JSON.parse(data.config);
                //     for(var key in temp)
                //     {
                //         this.addConfig(key,temp[key]);
                //     }
                // }
                // catch(e)
                // {
                //     this.addConfig("sound",1);
                //     this.addConfig("music",1);
                // }
                if (g_soundMgr.m_waitConfig) {
                    g_soundMgr.m_waitConfig = false;
                }
                this.m_waitConfig = false;
                try {
                    var temp = JSON.parse(data.config);
                    for (var key in temp) {
                        this.addConfig(key, temp[key]);
                    }
                }
                catch (e) {
                    this.addConfig("sound", 1);
                    this.addConfig("music", 1);
                }
                this.m_bFirstLoginDay = false;
                var time = this.getConfig("lastLoginTime");
                if (GameVar.s_loginSeverTime != time) {
                    this.addConfig("lastLoginTime", GameVar.s_loginSeverTime);
                    this.saveConfig();
                    if (isNaN(time)) {
                        this.m_bFirstLoginDay = true;
                        return;
                    }
                    var date1 = new Date(GameVar.s_loginSeverTime * 1000);
                    var date2 = new Date(time * 1000);
                    this.m_bFirstLoginDay = date1.getDate() != date2.getDate();
                    console.log("是不是新的一天：当前日期" + date1.toDateString() + "   上一期登录日期 " + date2.toDateString());
                }
            };
            return NetConfigDatas;
        }());
        data_4.NetConfigDatas = NetConfigDatas;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var data;
    (function (data) {
        /**
         * 商城数据
         * @class ShopData
         * @author wx
         *
         */
        var ShopData = /** @class */ (function (_super) {
            __extends(ShopData, _super);
            function ShopData() {
                var _this = _super.call(this) || this;
                _this.m_huodongId = 0;
                _this.res_url = "";
                return _this;
            }
            ShopData.SetGoods = function (indexs) {
                ShopData.s_list.length = 0;
                for (var i = 0; i < indexs.length; i++) {
                    var gd = ShopData.getGoodsData(indexs[i]);
                    gd.isGood = true;
                    gd.platformIcon = ShopData.s_platformIcon;
                    ShopData.s_list.push(gd);
                }
            };
            /**
             * 解析商城数据
             * @function PaseDatas
             * @static
             * @DateTime 2018-03-17T14:55:22+0800
             * @param    {any}                    root [description]
             */
            ShopData.PaseDatas = function (root) {
                if (GameVar.g_platformData['shop_version'] == 2) {
                    ShopData.parseShopDataV2(root);
                    return;
                }
                ShopData.s_shopDb = root;
                ShopData.s_list = [];
                ShopData.s_platformMoney = [];
                ShopData.s_vips = [];
                ShopData.s_fangkaList = [];
                var goods = root.goods;
                var platformMoney = root.platformMoney;
                var platforms = root.platforms;
                var vips = root.vips;
                var isIos = laya.utils.Browser.onIOS;
                var isAndroid = laya.utils.Browser.onAndroid;
                var len = platforms ? platforms.length : 0;
                for (var i = 0; i < len; i++) {
                    var pi = platforms[i];
                    if (isIos) {
                        pi = pi.iOs;
                    }
                    else if (isAndroid) {
                        pi = pi.android;
                    }
                    else {
                        pi = pi.pc;
                    }
                    if (pi == null || pi.items == null)
                        pi = platforms[i];
                    if (pi.items == null)
                        pi = pi.android;
                    ShopData.s_platformIcon = pi.platformIcon;
                    ShopData.s_bShowPlatformMoney = pi.showPlatformMoney == "true";
                    ShopData.s_moneyType = pi.moneyType ? pi.moneyType : "¥";
                    var res_url = pi.res_url;
                    for (var j = 0; j < pi.items.length; j++) {
                        var gd = ShopData.getGoodsData(parseInt(pi.items[j].index));
                        for (var key in pi.items[j]) {
                            gd[key] = pi.items[j][key];
                        }
                        gd.pricetype = pi.pricetype;
                        gd.platformIcon = pi.platformIcon;
                        gd.isGood = true;
                        if (res_url == "self") {
                            gd.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform + "/res/" + gd.icon + ".png";
                        }
                        else {
                            gd.res_url = GameVar.common_ftp + "shop/" + gd.icon + ".png";
                        }
                        if (gd.hide == 1)
                            continue;
                        ShopData.s_list.push(gd);
                    }
                    if (pi.diamonds) {
                        for (j = 0; j < pi.diamonds.length; j++) {
                            var diamond = pi.diamonds[j];
                            if (typeof diamond == 'number') {
                                ShopData.s_platformMoney.push(getPlatformmoney(diamond));
                            }
                            else {
                                diamond.buyindex = diamond.index;
                                ShopData.s_platformMoney.push(diamond);
                            }
                        }
                        for (var _i = 0, _a = ShopData.s_platformMoney; _i < _a.length; _i++) {
                            var tempDiamonds = _a[_i];
                            if (res_url == "self") {
                                tempDiamonds.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform + "/res/" + tempDiamonds.icon + ".png";
                            }
                            else {
                                tempDiamonds.res_url = GameVar.common_ftp + "shop/" + tempDiamonds.icon + ".png";
                            }
                        }
                    }
                    if (pi.fangka) {
                        for (j = 0; j < pi.fangka.length; j++) {
                            var gd = ShopData.getGoodsData(parseInt(pi.fangka[j].index));
                            for (var key in pi.fangka[j]) {
                                gd[key] = pi.fangka[j][key];
                            }
                            gd.pricetype = pi.pricetype;
                            gd.platformIcon = pi.platformIcon;
                            gd.info1 = gd.info2;
                            gd.isGood = true;
                            if (res_url == "self") {
                                gd.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform + "/res/" + gd.icon + ".png";
                            }
                            else {
                                gd.res_url = GameVar.common_ftp + "shop/" + gd.icon + ".png";
                            }
                            if (gd.hide == 1)
                                continue;
                            ShopData.s_fangkaList.push(gd);
                        }
                    }
                    if (pi.vips) //vip道具
                     {
                        for (j = 0; j < pi.vips.length; j++) {
                            var vip = pi.vips[j];
                            if (res_url == "self") {
                                vip.res_url = GameVar.common_ftp + "qpq_config/" + GameVar.platform + "/res/" + vip.icon + ".png";
                            }
                            else {
                                vip.res_url = GameVar.common_ftp + "shop/" + vip.icon + ".png";
                            }
                            ShopData.s_vips.push(pi.vips[j]);
                        }
                    }
                    if (pi.tabs) {
                        ShopData.s_tabs = [];
                        for (j = 0; j < pi.tabs.length; j++) {
                            var tab = pi.tabs[j];
                            if (tab.value == "items") {
                                tab.list = ShopData.s_list;
                            }
                            else if (tab.value == "diamonds") {
                                tab.list = ShopData.s_platformMoney;
                            }
                            else if (tab.value == "fangka") {
                                tab.list = ShopData.s_fangkaList;
                            }
                            else {
                                tab.list = ShopData.s_vips;
                            }
                            ShopData.s_tabs.push(tab);
                        }
                    }
                }
                var testpIds = root.testPid;
                if (testpIds == null)
                    return;
                if (testpIds.indexOf(GameVar.pid) != -1) {
                }
                function getPlatformmoney(index) {
                    for (var m = 0; m < platformMoney.length; m++) {
                        if (platformMoney[m].index == index) {
                            platformMoney[m].buyindex = platformMoney[m].index;
                            return platformMoney[m];
                        }
                    }
                    return {};
                }
            };
            /**
             * 获得物品数据
             * @param index
             * @returns {any}
             */
            ShopData.getGoodsData = function (index) {
                var goods = ShopData.s_shopDb.goods;
                for (var m = 0; m < goods.length; m++) {
                    if (goods[m].index == index)
                        return goods[m];
                }
                return {};
            };
            /**
             * 通过buyindex活动商品数据信息
             * @function getGoodsInfoById
             * @static
             * @DateTime 2018-03-17T14:55:44+0800
             * @param    {number}                 buyindex [description]
             * @return   {any}                             [description]
             */
            ShopData.getGoodsInfoById = function (buyindex) {
                var arr = ShopData.s_shopDb["goods"];
                for (var i = 0; i < arr.length; i++) {
                    if (parseInt(arr[i].buyindex) == buyindex)
                        return arr[i];
                }
                return null;
            };
            /**
             * 解析商城2.0数据
             * @function
             * @DateTime 2018-07-18T16:58:18+0800
             * @param    {any}                    root [description]
             */
            ShopData.parseShopDataV2 = function (root) {
                ShopData.s_shopDb = root;
                ShopData.s_list = [];
                ShopData.s_platformMoney = [];
                ShopData.s_fangkaList = [];
                GameVar.s_firstBuy = !(ShopData.s_shopDb.payAmount);
            };
            ShopData.s_bShowPlatformMoney = false;
            ShopData.s_moneyType = "";
            return ShopData;
        }(data.GameData));
        data.ShopData = ShopData;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var data;
    (function (data_5) {
        /**
         * @class
         * 游戏玩家数据
         * @extends GameData
         */
        var UserInfo = /** @class */ (function (_super) {
            __extends(UserInfo, _super);
            function UserInfo() {
                var _this = _super.call(this) || this;
                /**
                 * @property {number} m_pId
                 */
                _this.m_pId = 0;
                /**
                 * @property {string} m_headUrl
                 * 头像资源
                 */
                _this._headUrl = "";
                /**
                 * @property {string} m_title
                 * 称号
                 */
                _this.m_title = "";
                /**
                 * @property {number} m_title
                 * 游戏获胜次数
                 */
                _this.m_winNum = 0;
                /**
                 * @property {number} m_gameNum
                 * 游戏次数
                 */
                _this.m_gameNum = 0;
                /**
                 * @property {number} m_winRate
                 * 胜率
                 */
                _this.m_winRate = 0;
                /**
                 * 经度
                 * @type {number}
                 */
                _this.m_lon = 0;
                /**
                 * 纬度
                 * @type {number}
                 */
                _this.m_lat = 0;
                /**
                 * 高度
                 */
                _this.m_altitude = 0;
                /**
                 * 网络座位号
                 * @type {number}
                 */
                _this.m_seat_local = -1;
                /**
                 * 本地座位号
                 * @type {number}
                 */
                _this.m_seat_net = -1;
                _this._sex = 0;
                _this.m_goodsList = {};
                _this._name_ex = "";
                _this._roomId = -1;
                /**
                 * @property {number} m_leBi
                 * 乐币
                 */
                _this.m_leBi = 0;
                /**
                 * @property {number} m_smallGameScore
                 * 小游戏积分
                 */
                _this.m_smallGameScore = 0;
                /**
                 * @property {number} m_guessHelperNum
                 * 猜拳助手
                 */
                _this.m_guessHelperNum = 0;
                /**
                 * @property {number} m_guessNum
                 * 猜拳次数
                 */
                _this.m_guessNum = 0;
                /**
                 * @property {number} m_money
                 * 铜钱数量
                 */
                _this.m_money = 0;
                /**
                 * @property {number} m_hb
                 * 红包数量
                 */
                _this.m_hb = 0;
                /**
                 * @property {string} m_address
                 * 地址
                 */
                _this.m_address = "";
                /**
                 * @property {number} m_jjk
                 * 救济卡
                 */
                _this.m_jjk = 0;
                /**
                 * @property {number} m_cskNum
                 * 财神卡
                 */
                _this.m_cskNum = 0;
                /**
                 * @property {number} m_laba
                 * 喇叭
                 */
                _this.m_laba = 0;
                //幸运星
                /**
                 * @property {number} m_luckstart1
                 * 小幸运星
                 */
                _this.m_luckstart1 = 0;
                /**
                 * @property {number} m_luckstart2
                 * 中幸运星
                 */
                _this.m_luckstart2 = 0;
                /**
                 * @property {number} m_luckstart3
                 * 超级幸运星
                 */
                _this.m_luckstart3 = 0;
                /**
                 * @property {number} m_itemLevel
                 * 道具等级
                 */
                _this.m_itemLevel = 0;
                /**
                 * @property {number} m_itemExpPer
                 * 道具经验
                 */
                _this.m_itemExpPer = 0;
                /**
                 * @property {number} m_boxNum
                 * 宝箱数量
                 */
                _this.m_boxNum = 0; //宝箱数量
                /**
                 * @property {number} m_keyNum
                 * 钥匙数量
                 */
                _this.m_keyNum = 0; //钥匙数量
                /**
                 * @property {number} m_platformCoin
                 * 平台货币数量
                 */
                _this.m_platformCoin = 0;
                /**
                 * @property {number} m_unreadMailNum
                 * 未读邮件数量
                 */
                _this.m_unreadMailNum = 0;
                _this._level = 0;
                /**
                 * @property {number} m_bqk
                 * 补签卡
                 */
                _this.m_bqk = 0;
                /**
                 * @property {boolean} m_bSignIn
                 * 可签到吗
                 */
                _this.m_bSignIn = false;
                /**
                 * 钻石，用于棋牌圈，相当于金券
                 * @type {number}
                 */
                _this.m_diamond = 0;
                /**
                 * 金券，用于棋牌圈
                 * @type {number}
                 */
                _this.m_jinQuan = 0;
                /**
                 * @property {number} m_currentExp
                 * 当前经验
                 */
                _this.m_currentExp = 0;
                /**
                 * @property {number} m_nextExp
                 * 下一次升级经验
                 */
                _this.m_nextExp = 0;
                /**
                 * @property {string} m_designation
                 * 财富称号
                 */
                _this.m_designation = "";
                /**
                 * @property {number} gameVipLevel
                 * 游戏vip等级 1-6
                 */
                _this._gamevipLevel = 0;
                return _this;
            }
            Object.defineProperty(UserInfo.prototype, "m_headUrl", {
                get: function () {
                    return this._headUrl;
                },
                set: function (value) {
                    this._headUrl = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserInfo.prototype, "m_name", {
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._name = value;
                    if (utils.StringUtility.GetStrLen(value) > 7) {
                        this._name_ex = utils.StringUtility.GetSubstr(value, 7) + "...";
                    }
                    else {
                        this._name_ex = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserInfo.prototype, "m_name_ex", {
                /**
                 * @property {string} m_name_ex
                 * 昵称，取m_name的0-8位字符，如果超出用...代替
                 * @readonly
                 */
                get: function () {
                    return this._name_ex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserInfo.prototype, "m_sex", {
                /**
                 * @property {number} m_sex
                 * 性别，0是女，1是男
                 */
                get: function () {
                    return this._sex;
                },
                set: function (value) {
                    this._sex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserInfo.prototype, "m_roomId", {
                /**
                 * @property {number} m_roomId
                 * 房间号，如果为0表示在大厅
                 * @readonly
                 */
                get: function () {
                    return this._roomId;
                },
                set: function (value) {
                    var bChange = this._roomId != value;
                    this._roomId = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获得当前平台对应的货币数据
             * @function  getGold_num
             * @DateTime 2018-03-17T14:57:22+0800
             * @return   {number}                 [description]
             */
            UserInfo.prototype.getGold_num = function (isZj) {
                if (isZj === void 0) { isZj = false; }
                var type = isZj ? GameVar.g_platformData.gold_type_zj : GameVar.g_platformData.gold_type;
                switch (type) {
                    case data_5.GoodsData.MSID_TQ:
                        return this.m_money;
                    case data_5.GoodsData.MSID_JINQUAN:
                        return this.m_jinQuan;
                    case data_5.GoodsData.MSID_ZUANSHI:
                        return this.m_diamond;
                    case data_5.GoodsData.MSID_HB:
                        return this.m_hb;
                    case data_5.GoodsData.MSID_LB:
                        return this.m_leBi;
                    case data_5.GoodsData.MSID_SMSCORE:
                        return this.m_smallGameScore;
                    case data_5.GoodsData.MSID_PLATFORMCOIN:
                        return this.m_platformCoin;
                    default:
                        return this.m_money;
                }
            };
            Object.defineProperty(UserInfo.prototype, "m_level", {
                /**
                 * @property {number} m_level
                 * 等级
                 */
                get: function () {
                    return this._level;
                },
                set: function (value) {
                    this._level = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserInfo.prototype, "gameVipLevel", {
                //public _vipDataList:Array<VipDate> = new Array<VipDate>();
                get: function () {
                    var vip = this._gamevipLevel - 500;
                    vip = vip > 0 ? vip : 0;
                    return vip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserInfo.prototype, "vipLevel", {
                get: function () {
                    return this._vipLevel;
                },
                set: function (value) {
                    this._vipLevel = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method
             * 获取玩家的所有vip数据
             * @returns {Array<VipDate>}
             */
            //public getVipList():Array<VipDate>{
            //	var arr:Array<VipDate> = [];
            //	var length:number = this._vipDataList.length;
            //	for(var i:number = 0;i < length;i++){
            //		var vd:VipDate = this._vipDataList[i];
            //		arr.push(vd);
            //	}
            //	return arr;
            //}
            /**
             * @method
             * 添加一个vip勋章
             * @param {VipDate} vd
             *
             */
            //public addVipDate(vd:VipDate):void
            //{
            //	this._vipDataList.push(vd);
            //	if(vd.m_id <= 506 && vd.m_id > this._gamevipLevel){
            //		this._gamevipLevel = vd.m_id;
            //
            //	}
            //}
            /**
             * @method
             * 获取指定的vip数据
             * @param {number} id
             * @returns {VipDate}
             */
            //public getVipDate(id:number):VipDate
            //{
            //	if(id == 0) return null;
            //	var length:number = this._vipDataList.length;
            //	for(var i:number = 0;i < length;i++)
            //	{
            //		var vd:VipDate = this._vipDataList[i];
            //		if(vd.m_id == id)
            //			return vd;
            //	}
            //	return null;
            //}
            /**
             * @method
             * 删除一个vip勋章
             * @param {VipDate} vd
             *
             */
            //public removeVipDate(vd:VipDate):void
            //{
            //	var index:number = this._vipDataList.indexOf(vd);
            //	if(index == -1)
            //		return;
            //	var vd:VipDate = this._vipDataList.splice(index,1)[0];
            //	if(vd.m_id <= 506 && vd.m_id == this._gamevipLevel)		//重新设置vip等级
            //	{
            //		this._gamevipLevel = 0;
            //		var length:number = this._vipDataList.length;
            //		for(var i:number = 0;i < length;i++){
            //			vd = this._vipDataList[i];
            //			if(vd.m_id <= 506 && vd.m_id > this._gamevipLevel)
            //				this._gamevipLevel = vd.m_id;
            //		}
            //	}
            //}
            /**
             * @method
             * 清除所有vip数据
             *
             */
            //public clearVipDate():void{
            //	this._vipDataList.splice(0,this._vipDataList.length);
            //	this._gamevipLevel = 0;
            //}
            /**
             * @method
             * 解析所有vip数据
             * @param {Array<any>} arr
             */
            //public paseVipDataList(arr:Array<any>):void
            //{
            //	var length:number = arr.length;
            //	for(var i:number = 0;i < length;i++){
            //		var obj:any = arr[i];
            //		this.paseVipData(obj);
            //	}
            //}
            /**
             * @method
             * 解析单个vip数据
             * @param {any} obj
             */
            UserInfo.prototype.paseVipData = function (obj) {
                switch (obj.honorId) {
                    case data_5.GoodsData.MSID_TQ:
                        this.m_money = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_CS:
                        this.m_cskNum = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_XYX1:
                        this.m_luckstart1 = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_XYX2:
                        this.m_luckstart2 = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_XYX3:
                        this.m_luckstart3 = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_JJK:
                        this.m_jjk = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_PLATFORMCOIN:
                        this.m_platformCoin = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_BOX:
                        this.m_bqk = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_JINQUAN:
                        this.m_jinQuan = obj.honorTime;
                        break;
                    case data_5.GoodsData.MSID_ZUANSHI:
                        this.m_diamond = obj.honorTime;
                        break;
                    default:
                        if (obj.honorId > 10000) {
                            this.m_itemLevel = obj.honorId - 10000;
                            this.m_itemExpPer = obj.honorTime / 10000;
                        }
                        else {
                            //var vipdata:VipDate = new VipDate();
                            //vipdata.m_id = obj.honorId;
                            //vipdata.setLeftTime(obj.honorTime);
                            //this.addVipDate(vipdata);
                        }
                        break;
                }
            };
            /**
             * 处理打开背包协议
             * @param data
             */
            UserInfo.prototype.openBag = function (data) {
                var arr = data.goodsNum;
                var length = arr.length;
                for (var i = 0; i < length; i++) {
                    var obj = arr[i];
                    this.onItemUpte(obj);
                }
            };
            /**
             * 处理单个物品更新协议
             * @param data
             */
            UserInfo.prototype.onItemUpte = function (data) {
                var msId = data.msId;
                if (msId == 0)
                    msId = data.msID;
                //	trace(msId,data.num);
                this.m_goodsList[msId] = data;
                switch (msId) {
                    case data_5.GoodsData.MSID_HB:
                        this.m_hb = data.num;
                        break;
                    case data_5.GoodsData.MSID_TQ:
                        this.m_money = data.num;
                        break;
                    case data_5.GoodsData.MSID_LB:
                        this.m_laba = data.num;
                        break;
                    case data_5.GoodsData.MSID_CS:
                        this.m_cskNum = data.num;
                        break;
                    case data_5.GoodsData.MSID_XYX1:
                        this.m_luckstart1 = data.num;
                        break;
                    case data_5.GoodsData.MSID_XYX2:
                        this.m_luckstart2 = data.num;
                        break;
                    case data_5.GoodsData.MSID_XYX3:
                        this.m_luckstart3 = data.num;
                        break;
                    case data_5.GoodsData.MSID_JJK:
                        this.m_jjk = data.num;
                        break;
                    case data_5.GoodsData.MSID_LEBI:
                        this.m_leBi = data.num;
                        break;
                    case data_5.GoodsData.MSID_SMSCORE:
                        // this.m_smallGameScore = data.num;
                        break;
                    case data_5.GoodsData.MSID_GUESSHELPERNUM:
                        this.m_guessHelperNum = data.num;
                        break;
                    case data_5.GoodsData.MSID_PLATFORMCOIN:
                        this.m_platformCoin = data.num;
                        break;
                    case data_5.GoodsData.MSID_BQK:
                        this.m_bqk = data.num;
                        break;
                    case data_5.GoodsData.MSID_JINQUAN:
                        this.m_jinQuan = data.num;
                        break;
                    case data_5.GoodsData.MSID_ZUANSHI:
                        this.m_diamond = data.num;
                        break;
                }
            };
            /**
             * 获得指定msid的物品对象
             * @param msId
             * @returns {GoodsData}
             */
            UserInfo.prototype.getGoodsByMsId = function (msId) {
                return this.m_goodsList[msId];
            };
            UserInfo.prototype.getGooodsNumByMsId = function (msId) {
                var temp = this.m_goodsList[msId];
                if (temp == null)
                    return 0;
                return temp.num;
            };
            UserInfo.prototype.getBagGoods = function () {
                var arr = [];
                var result = [];
                for (var msId in gamelib.data.GoodsData.s_goodsInfo) {
                    var temp = gamelib.data.GoodsData.s_goodsInfo[msId];
                    if (temp.model_type & 0x1) {
                        arr.push(temp);
                    }
                }
                for (var _i = 0, arr_9 = arr; _i < arr_9.length; _i++) {
                    var temp = arr_9[_i];
                    var gd = utils.tools.clone(temp);
                    gd.num = this.getGooodsNumByMsId(gd.model_id);
                    result.push(gd);
                    gd.model_icon = utils.tools.getRemoteUrl(gd.model_icon);
                }
                return result;
            };
            /**
             * @method
             * 设置注册时间
             * @param value
             *
             */
            UserInfo.prototype.setRegisterTime = function (value) {
                this._registerTime = value;
            };
            /**
             * 获取注册时间
             * @return 时间字符串
             *
             */
            UserInfo.prototype.getRegisterTime = function () {
                if (isNaN(this._registerTime))
                    return '';
                var data = new Date();
                data.setTime(this._registerTime * 1000);
                var str = data.getFullYear() + "-";
                var temp = data.getMonth() + 1;
                str += (temp < 10 ? "0" + temp : temp) + "-";
                temp = data.getDate();
                str += (temp < 10 ? "0" + temp : temp) + " ";
                temp = data.getHours();
                str += (temp < 10 ? "0" + temp : temp) + ":";
                temp = data.getMinutes();
                str += (temp < 10 ? "0" + temp : temp) + ":";
                temp = data.getSeconds();
                str += (temp < 10 ? "0" + temp : temp);
                return str;
            };
            /**
             * 设置最后登录时间
             * @param value
             *
             */
            UserInfo.prototype.setLastLoginTime = function (value) {
                this._lastLoginTime = value;
            };
            /**
             * 获取最后登录时间字符串
             * @function
             * @DateTime 2018-03-17T15:37:33+0800
             * @return   {string}                 [description]
             */
            UserInfo.prototype.getLastLoginTime = function () {
                if (isNaN(this._lastLoginTime))
                    return '';
                var data = new Date();
                data.setTime(this._lastLoginTime * 1000);
                var data = new Date();
                data.setTime(this._lastLoginTime * 1000);
                var str = data.getFullYear() + "-";
                var temp = data.getMonth() + 1;
                str += (temp < 10 ? "0" + temp : temp) + "-";
                temp = data.getDate();
                str += (temp < 10 ? "0" + temp : temp) + " ";
                temp = data.getHours();
                str += (temp < 10 ? "0" + temp : temp) + ":";
                temp = data.getMinutes();
                str += (temp < 10 ? "0" + temp : temp) + ":";
                temp = data.getSeconds();
                str += (temp < 10 ? "0" + temp : temp);
                return str;
            };
            /**
             * 获得铜钱描述
             * @returns {string} 例如1.11万，1.11亿
             */
            UserInfo.prototype.getMoneyDes = function () {
                return utils.tools.getMoneyDes(this.m_money);
            };
            /**
             * 获取目标相对于自己的地理位置距离
             * @param user
             * @returns {number}返回的距离，单位km
             */
            UserInfo.prototype.getDistance = function (user) {
                if (user.m_lon == 0 && user.m_lat == 0 && user.m_lat == 0) {
                    return getDesByLan("未知");
                }
                if (this.m_lon == 0 && this.m_lat == 0 && this.m_lat == 0) {
                    return getDesByLan("未知");
                }
                var temp = utils.MathUtility.LantitudeLongitudeDist(this.m_lon, this.m_lat, user.m_lon, user.m_lat);
                if (temp > 1000) {
                    temp = temp / 1000;
                    var str = temp.toFixed(2);
                    return str + getDesByLan("千米");
                }
                else {
                    var str = temp.toFixed(2);
                    // if(temp <= 2)
                    // {
                    // 	return this.m_name + getDesByLan("与") + user.m_name +getDesByLan("地理位置相近");
                    // }
                    return str + getDesByLan("米");
                }
            };
            /**
             *
             * @param user
             * @return -1：没有距离信息，其他值，单位米
             */
            UserInfo.prototype.getDistanceNum = function (user) {
                if (user.m_lon == 0 && user.m_lat == 0 && user.m_lat == 0)
                    return -1;
                if (this.m_lon == 0 && this.m_lat == 0 && this.m_lat == 0)
                    return -1;
                var temp = utils.MathUtility.LantitudeLongitudeDist(this.m_lon, this.m_lat, user.m_lon, user.m_lat);
                return temp;
            };
            /**
             * @property {UserInfo} s_self
             * 玩家自己的数据,这个对象需要游戏在接受玩家自身信息包的时候，赋值
             * @static
             */
            UserInfo.s_self = null;
            return UserInfo;
        }(data_5.GameData));
        data_5.UserInfo = UserInfo;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var firend;
    (function (firend) {
        var FirendSystem = /** @class */ (function () {
            function FirendSystem() {
            }
            return FirendSystem;
        }());
        firend.FirendSystem = FirendSystem;
    })(firend = gamelib.firend || (gamelib.firend = {}));
})(gamelib || (gamelib = {}));
// namespace gamelib.firend
// {
// 	export class FirendUi extends gamelib.core.Ui_NetHandle
// 	{
// 		private _list:laya.ui.List;
// 		private _ts_list:laya.ui.List;
// 		private _tab:laya.ui.Tab;
// 		private _tip_new:laya.ui.Image;
// 		private _list_view:laya.ui.Box;		//好友列表
// 		private _add_view:laya.ui.Box;		//添加列表
// 		private _sq_view:laya.ui.Box;		//申请列表
// 		constructor()
// 		{
// 			super(GameVar.s_namespace + ".ui.Art_FrindsUI");
// 		}
// 		protected init():void
// 		{
// 			this._tab = this._res["tab_1"];
// 			this._list = this._res['list_1'];
// 			this._list_view = this._res["b_1"];
// 			this._add_view = this._res["b_2"];
// 			this._sq_view = this._res["b_1"];
// 			this._list_view.visible = this._add_view.visible = true;
// 			this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
// 			this.addBtnToListener("btn_refresh");
// 			this.addBtnToListener("btn_apply");
// 		}
// 		public reciveNetMsg(msgId: number,data: any):void
// 		{
// 			switch (msgId) {
// 				case 0x2041:
// 					this.updateFirendList();
// 					break;				
// 				default:
// 					// code...
// 					break;
// 			}
// 		}
// 		protected onShow():void
// 		{
// 			super.onShow();
// 			this._tab.selectedIndex = 0;
// 			this._tab.on(laya.events.Event.CHANGE,this,this.onTabChange);
// 			this.showListView();
// 			if(gamelib.data.FirendData.s_list.values.length == 0)
// 			{
// 				sendNetMsg(0x2041);	
// 			}
// 			this.updateFirendList();
// 		}
// 		protected onClickObjects(evt:laya.events.Event):void
// 		{
// 			switch (evt.currentTarget.name)
// 			{
// 				case "btn_refresh":
// 					sendNetMsg(0x2041);
// 					evt.currentTarget.mouseEnabled = false;
// 					Laya.timer.once(5000,this,function()
// 					{
// 						evt.currentTarget.mouseEnabled = true;
// 					})
// 					break;
// 				case "btn_apply":
// 					break;
// 				default:
// 					// code...
// 					break;
// 			}
// 		}
// 		private showListView():void
// 		{
// 			this._add_view.visible = false;
// 			this._sq_view.visible = false;
// 			this._list_view.visible = true;
// 		}
// 		private updateFirendList():void
// 		{
// 			this._list.dataSource = gamelib.data.FirendData.s_list.values;
// 			this._res["txt_frinds"].text = this._list.dataSource.length + "/50";
// 		}
// 		private showAddView():void
// 		{
// 			this._list_view.visible = false;			
// 			this._sq_view.visible = false;
// 			this._add_view.visible = true;
// 			this._res['img_head'].skin = GameVar.playerHeadUrl;			
// 			this._res['txt_id'].text = "PID:" + GameVar.pid;
// 			this._res['txt_name'].text = "PID:" + GameVar.nickName;
// 		}
// 		private showSqView():void
// 		{
// 			this._list_view.visible = false;			
// 			this._add_view.visible = false;
// 			this._sq_view.visible = true;
// 		}
// 		private onTabChange(ev?:laya.events.Event):void
// 		{
// 			switch (this._tab.selectedIndex) {
// 				case 0:
// 					this.showListView()	;
// 					break;
// 				case 1:
// 					this.showAddView();
// 					break;	
// 				case 2:
// 					this.showSqView();
// 					break;	
// 				default:
// 					// code...
// 					break;
// 			}
// 		}
// 		private onItemUpdate(box:laya.ui.Box,index:number):void
// 		{
// 			var fd:gamelib.data.FirendData = this._list.dataSource[index];
// 			var head:Laya.Image = getChildByName(box,'');
// 			head.skin = fd.m_headUrl;
// 			getChildByName(box,"txt_1").text = fd.m_pId +"";
// 			getChildByName(box,"txt_2").text = fd.m_name +"";
// 			getChildByName(box,"txt_3").text = fd.m_statue +"";
// 			var yaoqing_btn:laya.ui.Button = getChildByName(box,'btn_1');
// 			var del_btn:laya.ui.Button = getChildByName(box,'btn_2');
// 			yaoqing_btn.offAll();
// 			del_btn.offAll();
// 			yaoqing_btn.on('click',this,function(evt)
// 			{
// 				//邀请组队
// 			});
// 			del_btn.on('click',this,function(evt)
// 			{
// 				//删除
// 				g_uiMgr.showAlertUiByArgs({msg:"确定要删除"+fd.m_name+"吗?",callBack:function(type)
// 				{
// 					if(type == 0)
// 					{
// 						sendNetMsg(0x2043,4,fd.m_pId);
// 					}
// 				}})
// 			});
// 		}
// 	}
// }
var gamelib;
(function (gamelib) {
    var loading;
    (function (loading) {
        var LoadingModule = /** @class */ (function () {
            function LoadingModule() {
                g_signal.add(this.onSignal, this);
            }
            LoadingModule.prototype.onSignal = function (msg, data) {
                switch (msg) {
                    case "showQpqLoadingUi":
                        this.showMiniLoading(data);
                        break;
                    case "closeQpqLoadingUi":
                        this.closeMiniLoading();
                        break;
                    case "showEnterGameLoading":
                        this.showEnterGameLoading(data);
                        break;
                    case "showEnterGameLoadingMini":
                        this.showMaskLoading();
                        break;
                    case "closeEnterGameLoading":
                        if (GameVar.urlParam['isChildGame']) {
                            Laya.timer.once(500, this, this.closeEnterGameLoading);
                        }
                        else {
                            this.closeEnterGameLoading();
                        }
                        this.closeMaskLoading();
                        break;
                }
            };
            /**
             * 更新游戏资源的进度
             * @function
             * @DateTime 2018-11-16T14:46:15+0800
             * @param    {number}                 progress [description]
             */
            LoadingModule.prototype.updateResLoadingProgress = function (progress) {
                if (GameVar.urlParam['isChildGame'] && (GameVar.g_platformData['childgame_loading_type'] != 1)) {
                    if (this._miniLoading_child) {
                        if (progress == 1) {
                            this._miniLoading_child.updateMsg(getDesByLan("同步中") + "...");
                        }
                        else {
                            var num = Math.floor(progress * 100);
                            if (num <= 1) {
                                this._miniLoading_child.updateMsg("");
                            }
                            else {
                                this._miniLoading_child.updateMsg(getDesByLan("资源载入中") + "..." + num + "%");
                            }
                        }
                    }
                    return;
                }
                if (utils.tools.isApp()) {
                    if (window["application_loading_info"])
                        window["application_loading_info"](getDesByLan("资源载入中") + "...", Math.floor(progress * 100));
                    // console.log("。。。" +Math.floor(progress * 100));
                }
                else {
                    if (this._loadingUi != null)
                        this._loadingUi.showProgress(progress);
                }
            };
            /**
             * 缓存包的加载进度
             * @function
             * @DateTime 2018-11-16T14:37:47+0800
             */
            LoadingModule.prototype.onCacheProgress = function (progress) {
                if (utils.tools.isApp() && GameVar.g_platformData['childgame_loading_type'] == 1) {
                    var title = "";
                    var info = "";
                    //下载cache包和加载资源一样
                    if (progress == "") {
                        title = "检测游戏...";
                        info = "0";
                    }
                    else {
                        title = "资源下载中...";
                        info = "" + progress;
                    }
                    if (window["application_loading_info"])
                        window["application_loading_info"](title, info);
                    console.log(title + "  " + info);
                    return;
                }
                if (this._miniLoading_child) {
                    var str = "...";
                    if (progress == "") {
                        if (isNaN(this._point))
                            this._point = 0;
                        else
                            this._point++;
                        this._point = this._point % 3;
                        str = "";
                        if (this._point == 0) {
                            str = ".  ";
                        }
                        else if (this._point == 1) {
                            str = ".. ";
                        }
                        else {
                            str = "...";
                        }
                    }
                    this._miniLoading_child.updateMsg(getDesByLan("加载中") + str + progress);
                }
            };
            /**
             *	显示主loading界面
             *
             */
            LoadingModule.prototype.showLoadingUi = function () {
                if (utils.tools.isApp()) {
                    return;
                }
                this._loadingUi = this._loadingUi || new gamelib.loading.LoadingUi();
                this._loadingUi.show();
            };
            /**
             * 关闭主loading界面。
             * @function
             * @DateTime 2018-11-16T14:50:09+0800
             */
            LoadingModule.prototype.closeLoadingUi = function () {
                if (this._loadingUi)
                    this._loadingUi.close();
                if (utils.tools.isApp()) {
                    if (window["application_close_loading"]) {
                        Laya.timer.once(1000, this, function () {
                            window["application_close_loading"]();
                        });
                    }
                }
            };
            LoadingModule.prototype.setLoadingTitle = function (msg) {
                console.log(msg);
            };
            /**
             * 关闭主loading界面。
             * @function
             * @DateTime 2018-11-16T14:50:09+0800
             */
            LoadingModule.prototype.close = function () {
                this.closeLoadingUi();
            };
            LoadingModule.prototype.showMaskLoading = function () {
                this._maskLoading = this._maskLoading || new loading.MaskLoading();
                this._maskLoading.show();
                return this._maskLoading;
            };
            LoadingModule.prototype.closeMaskLoading = function () {
                if (this._maskLoading)
                    this._maskLoading.close();
            };
            /**
             * 关闭小loading
             * @function closeMiniLoading
             * @DateTime 2018-03-16T14:29:22+0800
             */
            LoadingModule.prototype.closeMiniLoading = function () {
                if (this._miniLoading != null)
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
            LoadingModule.prototype.showMiniLoading = function (args) {
                this._miniLoading = this._miniLoading || new gamelib.loading.MiniLoading();
                this._miniLoading.setMsg(args);
                this._miniLoading.show();
            };
            /**
             * 进入子游戏显示的loading
             * @function
             * @DateTime 2018-11-16T14:51:52+0800
             * @data 1:从游戏中返回大厅，0：从大厅中进入游戏
             */
            LoadingModule.prototype.showEnterGameLoading = function (data) {
                if (data == 0 && GameVar.g_platformData['childgame_loading_type'] == 1) {
                    if (window['application_show_loading']) {
                        window['application_show_loading']();
                    }
                }
                else {
                    this._miniLoading_child = this._miniLoading_child || new gamelib.loading.MiniLoading();
                    this._miniLoading_child.show();
                    if (data == 0)
                        this._miniLoading_child.setMsg({ msg: getDesByLan("游戏加载中") + "..." });
                    else
                        this._miniLoading_child.setMsg({ msg: getDesByLan("同步中") + "..." });
                }
            };
            LoadingModule.prototype.closeEnterGameLoading = function () {
                if (GameVar.g_platformData['childgame_loading_type'] == 1) {
                    if (window['application_close_loading']) {
                        window['application_close_loading']();
                    }
                }
                if (this._miniLoading_child)
                    this._miniLoading_child.close();
            };
            return LoadingModule;
        }());
        loading.LoadingModule = LoadingModule;
    })(loading = gamelib.loading || (gamelib.loading = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/8/29.
 */
var gamelib;
(function (gamelib) {
    var loading;
    (function (loading) {
        var LoadingUi = /** @class */ (function (_super) {
            __extends(LoadingUi, _super);
            function LoadingUi() {
                return _super.call(this, "qpq/Art_Loading.scene") || this;
            }
            LoadingUi.prototype.init = function () {
                if (this._res == null || this._res["bar"] == null)
                    return;
                this._res["bar"].value = 0;
            };
            LoadingUi.prototype.onClose = function () {
            };
            LoadingUi.prototype.onShow = function () {
                this.showCopyright();
            };
            LoadingUi.prototype.showCopyright = function () {
                if (this._res["txt_info"])
                    this._res["txt_info"].text = GameVar.g_platformData['copyright'] || '';
            };
            LoadingUi.prototype.showProgress = function (pro) {
                this.showCopyright();
                if (this._res == null || this._res["bar"] == null)
                    return;
                this._res["bar"].value = pro;
                pro = Math.floor(pro * 100);
                if (this._res["txt_jd"])
                    this._res["txt_jd"].text = pro + "%";
            };
            return LoadingUi;
        }(gamelib.core.BaseUi));
        loading.LoadingUi = LoadingUi;
    })(loading = gamelib.loading || (gamelib.loading = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var loading;
    (function (loading) {
        var MaskLoading = /** @class */ (function (_super) {
            __extends(MaskLoading, _super);
            function MaskLoading() {
                var _this = _super.call(this) || this;
                _this.mouseEnabled = true;
                _this.mouseThrough = true;
                return _this;
            }
            MaskLoading.prototype.show = function () {
                this.graphics.clear();
                this.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#FFFFFF");
                this.alpha = 0.1;
                this.zOrder = 200;
                Laya.stage.addChild(this);
            };
            MaskLoading.prototype.close = function () {
                this.removeSelf();
            };
            return MaskLoading;
        }(Laya.Sprite));
        loading.MaskLoading = MaskLoading;
    })(loading = gamelib.loading || (gamelib.loading = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var loading;
    (function (loading) {
        var MiniLoading = /** @class */ (function (_super) {
            __extends(MiniLoading, _super);
            function MiniLoading() {
                return _super.call(this, "qpq/Art_ZhuanQuan.scene") || this;
            }
            MiniLoading.prototype.init = function () {
                this.ani1 = this._res["ani1"];
                this._noticeOther = false;
                this._res.removeChildAt(0);
                this._res.mouseThrough = false;
                this._res.mouseEnabled = true;
                this._bg = new Laya.Sprite();
            };
            MiniLoading.prototype.setMsg = function (args) {
                if (this._res == null || this._res["txt_txt"] == null)
                    return;
                Laya.timer.clear(this, this.onDelayed);
                if (args == null) {
                    this._res["txt_txt"].text = "";
                }
                else {
                    this._res["txt_txt"].text = args.msg || "";
                    var delay = args.delay || 0;
                    if (delay) {
                        Laya.timer.once(delay * 1000, this, this.onDelayed, [args]);
                    }
                }
            };
            MiniLoading.prototype.updateMsg = function (msg) {
                if (this._res == null || this._res['txt_txt'] == null)
                    return;
                this._res['txt_txt'].text = msg;
            };
            // public show():void
            // {
            // if(this._res == null)
            //     return;
            // if(this._res.parent)
            //     return;
            // this._res.zOrder = this.m_layer;
            // this._bg.zOrder = this.m_layer - 1;
            // this.onResize();
            // g_dialogMgr.addChild(this._bg);
            // g_dialogMgr.addChild(this._res);
            // this.onShow();
            // this._scene.open()
            // }
            // public close():void
            // {
            //     if(this._res == null)
            //         return;
            //     super.close();
            //     this._bg.removeSelf();
            // }
            MiniLoading.prototype.onShow = function () {
                _super.prototype.onShow.call(this);
                Laya.stage.on(laya.events.Event.RESIZE, this, this.onResize);
                this.ani1.play();
            };
            MiniLoading.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                Laya.stage.off(laya.events.Event.RESIZE, this, this.onResize);
                Laya.timer.clear(this, this.onDelayed);
                this.ani1.stop();
            };
            MiniLoading.prototype.onDelayed = function (args) {
                g_uiMgr.showAlertUiByArgs({ msg: args.alertMsg });
                if (args.callBack) {
                    args.callBack.call(args.thisObj);
                }
                this.close();
            };
            MiniLoading.prototype.onResize = function (evt) {
                if (g_scaleXY == "x") {
                    this._res.x = Math.round(((g_gameMain.m_gameWidth - this._res.width) >> 1) + this._res.pivotX);
                    this._res.y = Math.round(((g_gameMain.m_gameHeight - this._res.height) >> 1) + this._res.pivotY + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio) / 2 / g_scaleRatio);
                }
                else {
                    this._res.x = Math.round(((g_gameMain.m_gameWidth - this._res.width) >> 1) + this._res.pivotX + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio) / 2 / g_scaleRatio);
                    this._res.y = Math.round(((g_gameMain.m_gameHeight - this._res.height) >> 1) + this._res.pivotY);
                }
                this._bg.graphics.clear();
                this._bg.graphics.drawRect(0, 0, g_gameMain.m_gameWidth, g_gameMain.m_gameHeight, "#FF0000");
                this._bg.alpha = 0.3;
                this._bg.x = this._bg.y = 0;
                this._bg.scaleX = Math.max(1, Laya.stage.width / g_gameMain.m_gameWidth);
                this._bg.scaleY = Math.max(1, Laya.stage.width / g_gameMain.m_gameHeight);
            };
            return MiniLoading;
        }(gamelib.core.BaseUi));
        loading.MiniLoading = MiniLoading;
    })(loading = gamelib.loading || (gamelib.loading = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var platform;
    (function (platform) {
        /**
         * 检测平台货币
         * @function gamelib.platform.checkPlatfromMoney
         * @DateTime 2018-03-17T14:58:30+0800
         * @param    {function}               callback [description]
         */
        function checkPlatfromMoney(callback) {
            if (!gamelib.data.ShopData.s_bShowPlatformMoney) {
                if (callback) {
                    callback.call(null);
                }
                return;
            }
            window["application_query_diamond"](queryCallBack);
            //nest.qqhall2.iap.checkbalance(queryCallBack);
            function queryCallBack(data) {
                console.log("检查钻石结果:" + JSON.stringify(data));
                GameVar.platfromMoney = data.balance;
                g_signal.dispatch(gamelib.GameMsg.UPDATEPLATFORMICON, 0);
                if (callback) {
                    callback.call(null);
                }
            }
        }
        platform.checkPlatfromMoney = checkPlatfromMoney;
        /**
         * 微信分享回掉
         * @function gamelib.platform.onWxShareCallBack
         * @DateTime 2018-03-17T14:58:53+0800
         * @param    {any}                    ret [description]
         */
        function onWxShareCallBack(ret) {
            console.log("微信分享回掉:" + JSON.stringify(ret));
            if (ret.result == 0) {
                if (ret.data.link.indexOf("circle_args") == -1) {
                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("分享成功") });
                    sendNetMsg(0x001A);
                }
            }
        }
        platform.onWxShareCallBack = onWxShareCallBack;
        /**
         * 支付.
         * @function gamelib.platform.pay
         * @DateTime 2018-03-17T14:59:20+0800
         * @param    {number}                 itemId  物品id
         * @param    {number}                 itemNum 充值数量
         * @param    {string}                 itemDes 物品描述
         */
        function pay(itemId, itemNum, itemDes) {
            var payInfo = {
                "gz_id": GameVar.gz_id,
                "goods_id": itemId + "",
                "item_num": 1,
                "desc": itemDes,
                "amount": itemNum + "",
                "pay_type": 0,
                "callback": payCallBack
            };
            window["application_buy"](payInfo);
            function payCallBack(data) {
                if (data.result == 0) //支付成功
                 {
                    GameVar.platfromMoney = data.balance;
                    g_signal.dispatch(gamelib.GameMsg.UPDATEPLATFORMICON, 0);
                    g_uiMgr.showTip(getDesByLan("充值成功!"), false);
                    console.log("充值成功!");
                }
                else if (data.result == 2) //不提示
                 {
                }
                else {
                    g_uiMgr.showTip(getDesByLan("充值失败!"), true);
                    console.log("充值失败!");
                }
            }
        }
        platform.pay = pay;
        /**
         * 购买商城道具
         * @function gamelib.platform.buyGoods
         * @DateTime 2018-03-17T14:59:56+0800
         * @param {any}        gd       商品对象
         * @param {function} callback [description]
         * @param {any}        thisobj  [description]
         * @param {boolean}    [tips = true] [是否显示等待信息]
         * @param {number}     [num = 1] [数量,默认1]
         */
        function buyGoods(gd, callback, thisobj, tips, num) {
            if (tips === void 0) { tips = true; }
            if (num === void 0) { num = 1; }
            var isFirstBuy = GameVar.s_firstBuy;
            var isVip = GameVar.isGameVip;
            var buyIndex = gd.buyindex;
            if (gd.buyIndexs) {
                if (isVip) {
                    if (isFirstBuy) {
                        buyIndex = gd.buyIndexs.vip_firstbuy;
                    }
                    else {
                        buyIndex = gd.buyIndexs.vip;
                    }
                }
                else {
                    if (isFirstBuy) {
                        buyIndex = gd.buyIndexs.firsbuy;
                    }
                }
            }
            if (gd.isGood)
                buyItem(buyIndex, gd.price, gd.info1, callback, thisobj, tips, num);
            else
                pay(buyIndex, 1, "");
        }
        platform.buyGoods = buyGoods;
        /**
         * 购买商品
         * @function gamelib.platform.buyItem
         * @DateTime 2018-03-17T15:01:50+0800
         * @param    {number}                 buyIndex 物品buyIndex
         * @param    {number}                 price    充值数量 物品价格
         * @param    {string}                 itemDes  物品描述
         * @param    {function}             calback  [description]
         * @param    {any}                    [thisobj = null]         [description]
         * @param    {boolean}                [tips = true]        tips    是否显示转圈
         * @param    {number}                 [num= 1]           num     [商品数量]
         */
        function buyItem(buyIndex, price, itemDes, calback, thisobj, tips, num) {
            if (thisobj === void 0) { thisobj = null; }
            if (tips === void 0) { tips = true; }
            if (num === void 0) { num = 1; }
            if (tips)
                g_uiMgr.showMiniLoading();
            var payInfo = {
                "gz_id": GameVar.gz_id,
                "goods_id": buyIndex + "",
                "item_num": num,
                "desc": itemDes,
                "amount": price + "",
                "pay_type": 1,
                "callback": payCallBack
            };
            //utils.trace(JSON.stringify(payInfo));
            window["application_buy"](payInfo);
            function payCallBack(data) {
                if (tips)
                    g_uiMgr.closeMiniLoading();
                if (data.result == 0) {
                    GameVar.platfromMoney = data.balance;
                    g_signal.dispatch(gamelib.GameMsg.UPDATEPLATFORMICON, 0);
                    if (tips) {
                        g_uiMgr.showTip(getDesByLan("购买成功") + "!", false);
                    }
                    console.log("购买成功!");
                }
                else if (data.result == 2) //不提示
                 {
                }
                else {
                    if (tips) {
                        g_uiMgr.showTip(getDesByLan("购买失败!"), true);
                    }
                    console.log("购买失败!");
                }
                if (calback != null) {
                    calback.call(thisobj, data);
                }
            }
        }
        platform.buyItem = buyItem;
        /**
         * 分享
         * @function gamelib.platform.share_circle
         * @DateTime 2018-03-17T15:03:51+0800
         * @param    {number}                 gz_id      [description]
         * @param    {string}                 validation [description]
         * @param    {number}                 gameId     [description]
         * @param    {string}                 groupId    [description]
         * @param    {string}                 title      [description]
         * @param    {string}                 desc       [description]
         * @param    {string}                 img_url    [description]
         * @param    {Function}               callBack   [description]
         * @param    {any}                    thisObj    [description]
         */
        function share_circle(gz_id, validation, gameId, groupId, title, desc, img_url, callBack, thisObj) {
            var url = window["application_share_url"]();
            var obj = {
                "gz_id": gz_id,
                "validation": validation,
                "gameId": gameId,
                "groupId": groupId
            };
            var str = JSON.stringify(obj);
            str = encodeURIComponent(str);
            if (url.indexOf("?") != -1)
                url += "&circle_args=" + str;
            else
                url += "?circle_args=" + str;
            var share_params = {};
            share_params.title = title;
            share_params.description = share_params.summary = desc;
            share_params.url = url;
            share_params.img_title = "游戏图标" + GameVar.gz_id;
            share_params.icon_url = share_params.img_url = img_url;
            callBack = callBack ? callBack.bind(thisObj) : callBack;
            console.log("share_params.url:" + share_params.url);
            window["application_game_share"](share_params, callBack);
        }
        platform.share_circle = share_circle;
        /**
         * 棋牌圈分享
         * @function gamelib.platform.share_circleByArgs
         * @DateTime 2018-03-17T15:04:37+0800
         * @param    {string}}               args     [description]
         * @param    {Function}               callBack [description]
         * @param    {any}                    thisObj  [description]
         */
        function share_circleByArgs(args, callBack, thisObj) {
            if (args.wxTips && Laya.Browser.onWeiXin) {
                platform.g_wxShareUi.setData(args, callBack, thisObj);
                platform.g_wxShareUi.show();
                return;
            }
            var url = GameVar.urlParam["ftp"] + "scripts/circle_config.php";
            var temp = {};
            for (var key in args) {
                temp[key] = args[key];
            }
            temp.platform = GameVar.platform;
            temp.action = "circle_share";
            temp.game_path = GameVar.urlParam['game_path'];
            utils.tools.http_request(url, temp, "get", function (rep) {
                console.log("请求结束了!" + JSON.stringify(rep));
                share_circle(args.gz_id, args.validation, args.gameId, args.groupId, rep.title, rep.desc, rep.img_url, callBack, thisObj);
            }.bind(this));
        }
        platform.share_circleByArgs = share_circleByArgs;
        /**
         * 拷贝房间号url到剪切板
         * @function
         * @DateTime 2018-12-04T19:04:16+0800
         * @param    {Function}               args    [description]
         * @param    {any}                    thisObj [description]
         */
        function copyShareUrlToClipboard(args, callBack, thisObj) {
            var url = window["application_share_url"]();
            var obj = {
                "gz_id": args.gz_id,
                "validation": args.validation,
                "gameId": args.gameId,
                "groupId": args.groupId
            };
            var str = JSON.stringify(obj);
            str = encodeURIComponent(str);
            if (url.indexOf("?") != -1)
                url += "&circle_args=" + str;
            else
                url += "?circle_args=" + str;
            if (GameVar.circleData.info && GameVar.circleData.info.extra_data) {
                url = GameVar.g_platformData['name'] + " " + GameVar.circleData.info.extra_data['roomName'] + " 房号[" + args.validation + "] 房间链接:" + url;
            }
            else {
            }
            gamelib.Api.copyToClipboard(url, callBack.bind(thisObj));
        }
        platform.copyShareUrlToClipboard = copyShareUrlToClipboard;
        /**
         * 获得棋牌圈分享的参数
         * @function gamelib.platform.get_share_circleByArgs
         * @DateTime 2018-03-17T15:05:07+0800
         * @param    {any}                  args     [description]
         * @param    {Function}               callBack [description]
         * @param    {any}                    thiobj   [description]
         */
        function get_share_circleByArgs(args, callBack, thisobj) {
            var url = GameVar.urlParam["ftp"] + "scripts/circle_config.php";
            var temp = {};
            for (var key in args) {
                temp[key] = args[key];
            }
            temp.platform = GameVar.platform;
            temp.action = "circle_share";
            temp.game_path = GameVar.urlParam['game_path'];
            utils.tools.http_request(url, temp, "get", function (rep) {
                callBack.call(thisobj, rep);
                console.log("请求结束了!" + JSON.stringify(rep));
            }.bind(this));
        }
        platform.get_share_circleByArgs = get_share_circleByArgs;
        /**
         * 自动分享,非wx平台不做处理
         * @function gamelib.platform.autoShare
         * @DateTime 2018-03-17T15:06:04+0800
         */
        function autoShare() {
            //app不做处理
            // var isWx:boolean = GameVar.platform.indexOf("wx") != -1;
            // if(!isWx) return;
            // 
            if (utils.tools.isApp())
                return;
            if (utils.tools.isQpqHall()) {
                shareApp();
            }
            else //分享组局信息
             {
                g_qpqCommon.doShare(false);
            }
        }
        platform.autoShare = autoShare;
        /**
         * 分享app
         * @function gamelib.platform.shareApp
         * @DateTime 2018-03-17T15:06:24+0800
         * @param wx_firendCircle 分享微信朋友圈
         */
        function shareApp(callBack, thisobj, wx_firendCircle, extra_data) {
            var args = {
                title: GameVar.g_platformData.name,
                url: window["application_share_url"](),
                summary: GameVar.g_platformData.share_info,
                icon_url: GameVar.g_platformData.share_url,
                wx_timeline: wx_firendCircle
            };
            if (extra_data) {
                var ts = "&";
                if (args.url.indexOf("?") == -1)
                    ts = "?";
                for (var key in extra_data) {
                    args.url += (ts + key + "=" + extra_data[key]);
                    ts = "&";
                }
            }
            if (args.icon_url && args.icon_url.indexOf("http") == -1) {
                args.icon_url = GameVar.common_ftp + args.icon_url;
            }
            if (window["application_game_share"]) {
                window["application_game_share"](args, callBack, thisobj);
            }
        }
        platform.shareApp = shareApp;
    })(platform = gamelib.platform || (gamelib.platform = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var wxgame;
    (function (wxgame) {
        var wx = window['wx'];
        var _wxGameInfo = window['wxGameInfo'];
        var _callBack;
        //微信登录用到的code	
        var _code;
        var _openid;
        var _access_token;
        var _unionid;
        var _game_code = "fxq";
        /**
         * 小游戏登录流程
         * 1、登录微信
         * 2、获取微信用户信息
         * 3、登录平台
         * 4、获取urlParam
         * @function
         * @DateTime 2019-03-26T17:18:20+0800
         */
        function startup(callBack) {
            _callBack = callBack;
            wx.login({
                success: function (res) {
                    _code = res.code;
                    console.log("_code:" + _code);
                    //getOpenId();
                    checkLoginScope();
                },
                fail: function (res) {
                    wx.showModal({ "title": "登录失败", "content": "登录失败", "showCancel": false });
                }
            });
        }
        wxgame.startup = startup;
        /**
         * 获得openid
         * @function
         * @DateTime 2019-03-29T11:08:38+0800
         */
        function getOpenId() {
            wx.request({
                url: ""
            });
            var url = "https://api.weixin.qq.com/sns/jscode2session"; //
            //?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code"
            var data = {
                appid: _wxGameInfo.appid,
                //secret :"cf2c2af4664f9c8e07a04585448baf1a",
                secret: _wxGameInfo.secret,
                js_code: _code,
                grant_type: "authorization_code"
            };
            utils.tools.http_request(url, data, "get", function (res) {
                console.log(res);
                if (!res.errcode) {
                    _openid = res.openid;
                    _unionid = res.unionid;
                    return;
                }
                switch (res.errcode) {
                    case -1: //系统繁忙，此时请开发者稍候再试
                        getOpenId();
                        break;
                    case 40029: //code 无效
                        wx.showModal({ "title": "请求失败", "content": "code 无效", "showCancel": false });
                        break;
                    case 45011: //频率限制，每个用户每分钟100次
                        wx.showModal({ "title": "请求失败", "content": "频率限制,每个用户每分钟100次", "showCancel": false });
                        break;
                }
            });
        }
        /**
         * 检测登录授权
         * @function
         * @DateTime 2019-03-29T11:08:12+0800
         */
        function checkLoginScope() {
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting['scope.userInfo'] === true) {
                        //用户已授权，可以直接调用相关 API
                        getUserInfo();
                        //TODO: 调用wx.login, wx.getUserInfo 
                        //TODO: 调用自己的注册登录接口
                    }
                    else if (res.authSetting['scope.userInfo'] === false) {
                        // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                        console.log('授权：请点击右上角菜单->关于（' + _wxGameInfo.name + '）->右上角菜单->设置');
                        createUserInfoButton();
                    }
                    else {
                        // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                        createUserInfoButton();
                    }
                },
                fail: function () {
                    createUserInfoButton();
                }
            });
        }
        function onGetUserInfo(res) {
            console.log(res);
            if (res.errMsg == "getUserInfo:ok") {
                //登录平台，获取分区数据
                getPlatformUserInfo(res);
            }
            else if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                // 处理用户拒绝授权的情况
                wx.showModal({ "title": "授权失败", "content": "用户拒绝授权", "showCancel": false });
            }
        }
        function createUserInfoButton() {
            var img = new Laya.Image();
            img.skin = "resource/loading.jpg";
            Laya.stage.addChild(img);
            var button = createButton(140, 40);
            button.onTap(function (res) {
                if (res.errMsg == "getUserInfo:ok") {
                    button.destroy();
                    img.removeSelf();
                }
                onGetUserInfo(res);
            });
            function createButton(width, height) {
                var info = wx.getSystemInfoSync();
                var button = wx.createUserInfoButton({
                    type: 'image',
                    image: 'resource/wxLogin.png',
                    style: {
                        left: (info.windowWidth - width) / 1.5,
                        top: (info.windowHeight - height) / 1.5,
                        width: width,
                        height: height,
                        lineHeight: 40
                    }
                });
                return button;
            }
        }
        /**
         * 获得微信用户信息
         * @function
         * @DateTime 2019-03-26T17:08:52+0800
         * @return   {Promise<any>}           [description]
         */
        function getUserInfo() {
            wx.getUserInfo({
                withCredentials: true,
                lang: '',
                success: function (res) {
                    onGetUserInfo(res);
                },
                fail: function (res) {
                    onGetUserInfo(res);
                },
                complete: function (res) { },
            });
        }
        function getPlatformUserInfo(res) {
            var url = _wxGameInfo.loginUrl;
            var postData = {
                app: _wxGameInfo.app,
                agent_id: _wxGameInfo.agent_id,
                code: _code,
                gender: res.userInfo.gender,
                nickname: res.userInfo.nickName || "",
                thumb_url: res.userInfo.avatarUrl || ""
            };
            wx.request({
                url: _wxGameInfo.loginUrl,
                data: {
                    app: _wxGameInfo.app,
                    agent_id: _wxGameInfo.agent_id,
                    code: _code,
                    gender: res.userInfo.gender,
                    nickname: res.userInfo.nickName,
                    thumb_url: res.userInfo.avatarUrl
                },
                success: function (params) {
                    if (params.ret != 1) {
                        wx.showModal({ "title": "登录失败", "content": "平台登录失败", "showCancel": false });
                        return;
                    }
                    GameVar.s_version = params.data.version;
                    var urlParams = {};
                    urlParams["game_ver"] = params.data.version;
                    utils.tools.copyTo(params.data.user, urlParams);
                    window["game_zone_info"] = params.data.game_zone_info;
                    utils.tools.copyTo(params.data.game_zone_info[_game_code], urlParams);
                    _callBack.runWith(urlParams);
                }
            });
            // utils.tools.http_request(url, postData, "get",function(params){
            // 	if(params.ret != 1){
            // 		wx.showModal({ "title": "登录失败", "content": "平台登录失败", "showCancel": false });
            // 		return;
            // 	}
            // 	GameVar.s_version = params.data.version;
            // 	var urlParams:any = {};
            // 	urlParams["game_ver"] = params.data.version; 
            // 	utils.tools.copyTo(params.data.user,urlParams);
            // 	window["game_zone_info"] = params.data.game_zone_info;
            // 	utils.tools.copyTo(params.data.game_zone_info[_game_code],urlParams);
            // 	_callBack.runWith(urlParams);    		
            // },
            // function(res){
            // 	wx.showModal({ "title": "登录失败", "content": "平台登录失败", "showCancel": false });
            // });
        }
    })(wxgame = gamelib.wxgame || (gamelib.wxgame = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/5.
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 结算界面
             */
            var QPQResultUi = /** @class */ (function (_super) {
                __extends(QPQResultUi, _super);
                function QPQResultUi() {
                    return _super.call(this, "qpq/Art_JieSuan") || this;
                }
                QPQResultUi.prototype.init = function () {
                    this.addBtnToListener("btn_pingjia");
                    this.addBtnToListener("btn_info");
                    this.addBtnToListener("btn_share");
                    this.addBtnToListener("btn_back");
                    //this.addBtnToListener("img_QRCode");
                    this._btn_return = this._res["btn_back"];
                    this._btn_info = this._res["btn_info"];
                    this._btn_share = this._res["btn_share"];
                    this._itemList = [];
                    this._player_container = this._res["b_players"];
                    this._noticeOther = true;
                    if (this._res["img_QRCode"])
                        this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
                    //需要先把资源载入进来
                    for (var i = 0; i < 6; i++) {
                        var item = new QPQResultItem();
                        this._itemList.push(item);
                    }
                    this._btn_container = new Laya.Box();
                    this._res.addChild(this._btn_container);
                    this._btn_container.x = this._btn_return.x;
                    this._btn_container.y = this._btn_return.y;
                    this._grap = this._btn_info.x - this._btn_return.x;
                    this._btn_return.x = 0;
                    this._btn_return.y = 0;
                    this._btn_info.x = 0;
                    this._btn_info.y = 0;
                    this._btn_share.x = 0;
                    this._btn_share.y = 0;
                    this._btn_container.addChildren(this._btn_return, this._btn_info, this._btn_share);
                    this._player_container.centerX = 0;
                    this._btn_container.centerX = 0;
                };
                QPQResultUi.prototype.reciveNetMsg = function (msgId, data) {
                    switch (msgId) {
                        case 0x00E2:
                            if (data.result != 1)
                                return;
                            var itemData = this.searchPropertyInList(this._data.playerNum, "playerPid", data.targetPid);
                            itemData.estimated = 1;
                            this.updateList();
                            if (data.targetPid == this._data.homewnerPid) {
                                this._res["btn_pingjia"].visible = false;
                            }
                            break;
                        case 0x00E4:
                            if (this._data.groupId != data.groupId)
                                return;
                            var players = this._data.playerNum;
                            var estimatedVec = data.list;
                            for (var i = 0; i < estimatedVec.length; i++) {
                                var pd = this.searchPropertyInList(players, "playerPid", estimatedVec[i].pid);
                                if (pd == null)
                                    continue;
                                pd.estimated = 1;
                                if (pd.playerPid == this._data.homewnerPid) {
                                    this._res["btn_pingjia"].visible = false;
                                }
                            }
                            this.updateList();
                            break;
                    }
                };
                QPQResultUi.prototype.setData = function (obj) {
                    this._data = obj;
                    var list = this._data.playerNum;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].playerPid == this._data.playerPidOfWinMax) {
                            list[i].markType = 1;
                        }
                        else if (list[i].playerPid == this._data.playerPidOfLoseMax) {
                            list[i].markType = 2;
                        }
                        else {
                            list[i].markType = 0;
                        }
                        list[i].showType = 1;
                        list[i].groupId = this._data.groupId;
                        list[i].index = i;
                        list[i].isFangzhu = list[i].playerPid == this._data.homewnerPid;
                    }
                    this._res["txt_wanfa"].text = obj.gameName;
                    this._res["txt_fanghao"].text = getDesByLan("房号") + ":" + obj.roomId;
                    this._res["txt_fangzhu"].text = getDesByLan("房主") + ":" + utils.StringUtility.getNameEx(obj.homewnerName, 10);
                    this._res["txt_date"].text = obj.creatTime;
                    //先不做评论
                    //this.checkEstimate();
                    if (this._res["btn_pingjia"])
                        this._res["btn_pingjia"].visible = false;
                    if (this._res["img_ypj"])
                        this._res["img_ypj"].visible = false;
                    this.updateList();
                    if (this._qrcodeImg) {
                        if (GameVar.isGameVip) {
                            this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl_Vip || window["application_share_url"]());
                        }
                        else {
                            this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl);
                        }
                    }
                };
                QPQResultUi.prototype.updateList = function () {
                    var list = this._data.playerNum;
                    while (this._player_container.numChildren) {
                        var temp = this._player_container.removeChildAt(0);
                        temp.clear();
                        this._itemList.push(temp);
                    }
                    var len = list.length;
                    switch (len) {
                        case 4:
                        case 5:
                            this._player_container.space = 10;
                            break;
                        case 6:
                            this._player_container.space = 5;
                            break;
                        default:
                            this._player_container.space = 20;
                    }
                    for (var i = 0; i < len; i++) {
                        var temp = this.getItem();
                        temp.setData(list[i]);
                        this._player_container.addChild(temp);
                    }
                    // Laya.timer.frameOnce(2,this,function()
                    // {
                    //    this._player_container.x = (Math.min(this._res.width,g_gameMain.m_gameWidth) - this._player_container.width) / 2;
                    // })
                    this._player_container["_getWidget"]().resetLayoutX();
                    // this._player_container.resetLayoutX()
                };
                /**
                 * 检测是否可以评价
                 */
                QPQResultUi.prototype.checkEstimate = function () {
                    var players = this._data.playerNum;
                    var ownerEsd = false; //能否对房主评价
                    if (players.length && players[0].estimated == null) {
                        sendNetMsg(0x00E4, this._data.groupId, 1);
                        for (var i = 0; i < players.length; i++) {
                            players[i].estimated = -1;
                            players[i].groupId = this._data.groupId;
                            players[i].showType = 1;
                        }
                    }
                    else {
                        if (this._data.homewnerPid == gamelib.data.UserInfo.s_self.m_pId) {
                            ownerEsd = false;
                        }
                        else {
                            ownerEsd = this.searchPropertyInList(players, "playerPid", this._data.homewnerPid).estimated < 0;
                        }
                    }
                    this._res["btn_pingjia"].visible = ownerEsd;
                };
                QPQResultUi.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    var tw = 0;
                    if (utils.tools.isQpqHall()) {
                        this._btn_return.removeSelf();
                        this._res["btn_close"].visible = true;
                        this._btn_info.x = this._grap * 0;
                        this._btn_share.x = this._grap * 1;
                    }
                    else {
                        this._btn_container.addChild(this._btn_return);
                        this._res["btn_close"].visible = false;
                        this._btn_info.x = this._grap * 1;
                        this._btn_share.x = this._grap * 2;
                    }
                    this._btn_container["_getWidget"]().resetLayoutX();
                    if (this._res["ani1"])
                        this._res["ani1"].play();
                    //this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
                };
                QPQResultUi.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    if (this._res["ani1"])
                        this._res["ani1"].stop();
                    //this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
                };
                QPQResultUi.prototype.getItem = function () {
                    if (this._itemList.length)
                        return this._itemList.shift();
                    return new QPQResultItem();
                };
                QPQResultUi.prototype.onClickObjects = function (evt) {
                    playButtonSound();
                    switch (evt.currentTarget.name) {
                        case "btn_pingjia":
                            break;
                        case "btn_info":
                            g_signal.dispatch("showDetailUi", this._data);
                            this.close();
                            break;
                        case "btn_back":
                            g_childGame.toCircle();
                            this.close();
                            break;
                        case "img_QRCode":
                            utils.tools.snapshotShare(this._res["img_QRCode"]);
                            break;
                        case "btn_share":
                            utils.tools.snapshotShare(this._res);
                            break;
                    }
                };
                QPQResultUi.prototype.searchPropertyInList = function (list, key, value) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i][key] == value) {
                            return list[i];
                        }
                    }
                };
                return QPQResultUi;
            }(gamelib.core.BaseUi));
            qpq.QPQResultUi = QPQResultUi;
            var QPQResultItem = /** @class */ (function (_super) {
                __extends(QPQResultItem, _super);
                function QPQResultItem() {
                    return _super.call(this) || this;
                }
                QPQResultItem.prototype.createChildren = function () {
                    _super.prototype.createChildren.call(this);
                    this.loadUI("qpq/Art_JiesuanItem");
                };
                QPQResultItem.prototype.clear = function () {
                    this["img_head"].skin = "";
                };
                QPQResultItem.prototype.setData = function (obj) {
                    this["img_ypj1"].visible = false;
                    this["btn_pingjia1"].visible = false;
                    this["img_head"].skin = obj.playerHead;
                    this["img_fangzhu"].visible = obj.isFangzhu;
                    this["img_1"].visible = obj.playerPid == GameVar.pid;
                    this["img_2"].visible = !this["img_1"].visible;
                    this["txt_name"].text = utils.StringUtility.getNameEx(obj.playerName);
                    this["txt_id"].text = "ID:" + obj.playerPid;
                    if (obj.winOrLosePoints > 0) {
                        this["txt_fen_2"].text = "+" + obj.winOrLosePoints;
                        this["txt_fen_2"].visible = true;
                    }
                    else {
                        this["txt_fen_1"].text = "" + obj.winOrLosePoints;
                        this["txt_fen_2"].visible = false;
                    }
                    this["txt_fen_1"].visible = !this["txt_fen_2"].visible;
                    //0-无，1-赢，2-输
                    if (obj.markType == 1) {
                        this["img_biaoqian_1"].visible = true;
                        this["img_biaoqian_2"].visible = false;
                    }
                    else if (obj.markType == 2) {
                        this["img_biaoqian_2"].visible = true;
                        this["img_biaoqian_1"].visible = false;
                    }
                    else {
                        this["img_biaoqian_2"].visible = false;
                        this["img_biaoqian_1"].visible = false;
                    }
                    var detail = obj.detailedRecord;
                    if (typeof (detail) == "string") {
                        if (detail == "")
                            detail = {};
                        else
                            detail = JSON.parse(detail);
                    }
                    var tongji = detail.tongji;
                    var tw = 0;
                    for (var i = 0; i < 6; i++) {
                        var txt = this["txt_" + (i + 1)];
                        if (tongji == null) {
                            txt.visible = false;
                            continue;
                        }
                        var tjd = tongji[i];
                        if (tjd == null) {
                            txt.visible = false;
                            continue;
                        }
                        txt.visible = true;
                        for (var key in tjd) {
                            txt.text = key + ":" + tjd[key];
                        }
                        tw = Math.max(tw, txt.width);
                    }
                    this["txt_1"].parent.width = tw;
                };
                return QPQResultItem;
            }(laya.ui.View));
            qpq.QPQResultItem = QPQResultItem;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/5.
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        /**
         * 棋牌圈公告模块。包含战绩界面。总结算界面，详细结算界面，同ip提示，解散界面，历史信息,退出游戏，分享
         * 不要实例次类。请用g_qpqCommon
         * @class QpqCommonModule
         * @implements gamelib.core.INet
         */
        var QpqCommonModule = /** @class */ (function () {
            function QpqCommonModule() {
                g_signal.add(this.onLocalSignal, this);
            }
            /**
             * 棋牌圈请求结果信息
             * @function requestResult
             * @DateTime 2018-03-17T15:08:42+0800
             * @param    {number}                 groupId [description]
             * @param    {number}      [page = 0]   [description]
             * @param    {number}      [number = 0]           number [description]
             */
            QpqCommonModule.prototype.requestResult = function (groupId, page, number) {
                if (page === void 0) { page = 0; }
                if (number === void 0) { number = 0; }
                sendNetMsg(0x00FA, groupId, page, number, 0);
            };
            /**
             * 解散逻辑
             * @function doJieSan
             * @DateTime 2018-03-17T15:09:35+0800
             * @param    {boolean}           [checkFz = true] checkFz [是否检测房主]
             */
            QpqCommonModule.prototype.doJieSan = function (checkFz) {
                if (checkFz === void 0) { checkFz = true; }
                var isFz = GameVar.circleData.selfIsFz();
                var isBegin = GameVar.circleData.round_current >= 1;
                var canJieSan = isFz;
                if (checkFz)
                    canJieSan = isFz;
                else
                    canJieSan = true;
                if (canJieSan) {
                    if (isBegin) {
                        g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请求解散牌局") + "?", callBack: function (type) {
                                if (type == 0)
                                    sendNetMsg(0x2003);
                            }, okLabel: getDesByLan("确定"), cancelLabel: getDesByLan("取消"), type: 1 });
                        // this.showTip(1);
                    }
                    else {
                        g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("确定要解散牌局吗") + "?", callBack: function (type) {
                                if (type == 0)
                                    sendNetMsg(0x00F6, GameVar.pid, 4, GameVar.circleData.groupId, 0, 0);
                            }, okLabel: getDesByLan("确定"), cancelLabel: getDesByLan("取消"), type: 1 });
                    }
                }
                else {
                    if (isBegin) {
                        // this.showTip(1);
                        g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("请求解散牌局") + "?", callBack: function (type) {
                                if (type == 0)
                                    sendNetMsg(0x2003);
                            }, okLabel: getDesByLan("确定"), cancelLabel: getDesByLan("取消"), type: 1 });
                    }
                    else
                        g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("游戏未开始,只能由房主解散游戏") });
                }
            };
            /**
             * 退出逻辑
             * 如果不是组局模式，发送0x0018协议。收到后在退出游戏
             * 如果是金币模式，直接退出子游戏
             * 如果是组局，进入退出组局的流程
             * @function doQuit
             * @DateTime 2018-03-17T15:10:24+0800
             */
            QpqCommonModule.prototype.doQuit = function () {
                if (!utils.tools.isQpq()) {
                    if (GameVar.game_args.groupId && GameVar.game_args.roundId) {
                        //回放
                        g_childGame.toCircle();
                        return;
                    }
                    this._needToQuitGame = true;
                    sendNetMsg(0x0018);
                    return;
                }
                var circle_data = GameVar.circleData;
                if (circle_data.isGoldScoreModle()) //金币模式
                 {
                    //     this._needToQuitGame = true;
                    //     sendNetMsg(0x0018);
                    g_childGame.toCircle();
                    return;
                }
                if (circle_data.selfIsFz() && circle_data.round_current < 1) {
                    //组局金币场不需要提示
                    if (GameVar.g_platformData['exitRoomNoAlert']) {
                        g_childGame.toCircle();
                    }
                    else {
                        g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("返回大厅您的房间仍会保留哦，您可以在房间列表中查看") + "!", callBack: function (type) {
                                if (type == 0)
                                    g_childGame.toCircle();
                            }, okLabel: "确定", type: 1 });
                    }
                }
                else if (circle_data.round_current >= circle_data.round_max && circle_data.round_current != 0) {
                    //牌局结束了
                    //收到0x2005在处理
                    //g_childGame.toCircle({groupId:circle_data.groupId});
                }
                else {
                    g_childGame.toCircle();
                }
            };
            /**
             * 分享
             * @function doShare
             * @param {boolean}  [wxTips = true] 是否显示微信的提示框
             */
            QpqCommonModule.prototype.doShare = function (wxTips) {
                if (wxTips === void 0) { wxTips = true; }
                var circle_data = GameVar.circleData;
                if (circle_data.validation == "") {
                    gamelib.platform.shareApp();
                    return;
                }
                var temp = {
                    gz_id: GameVar.gz_id,
                    gameId: GameVar.s_game_id,
                    validation: circle_data.validation,
                    groupId: circle_data.groupId + "",
                    callBack: null,
                    wxTips: wxTips,
                    fd: circle_data.info && circle_data.info.extra_data ? circle_data.info.extra_data.limit : 0,
                    js: circle_data.round_max,
                    addDatas: circle_data.info && circle_data.info.extra_data ? circle_data.info.extra_data : {}
                };
                if (circle_data.info && circle_data.info.extra_data && circle_data.info.extra_data.club_name) {
                    //如果是俱乐部，加上俱乐部名字
                    temp['club_name'] = circle_data.info.extra_data.club_name;
                }
                gamelib.platform.share_circleByArgs(temp);
            };
            /**
             * 游戏中返回棋牌圈
             * @function toCircle
             * @DateTime 2018-03-17T15:12:59+0800
             * @param    {boolean}  bRequestResult [是否请求结算信息]
             */
            QpqCommonModule.prototype.toCircle = function (bRequestResult, groupId) {
                g_uiMgr.showTip(getDesByLan('系统结算中') + '...');
                if (bRequestResult)
                    sendNetMsg(0x00FA, groupId, 0, 0, 0);
                if (this._tipUi)
                    this._tipUi.close();
                if (this._vote)
                    this._vote.close();
            };
            /**
             * 请求指定游戏的规制
             * @function requestRule
             * @DateTime 2018-03-17T15:13:33+0800
             * @param    {any}                    info [description]
             */
            QpqCommonModule.prototype.requestRule = function (info, callBack) {
                var postdata = {};
                postdata.action = "circle_rule";
                postdata.addDatas = JSON.stringify(info);
                postdata.platform = GameVar.platform;
                postdata.game_path = GameVar.common_ftp;
                utils.tools.http_request(GameVar.urlParam['ftp'] + "scripts/circle_config.php", postdata, "get", function (rep) {
                    GameVar.circleData.ruleData = rep;
                    if (callBack) {
                        callBack.runWith(rep);
                    }
                });
            };
            /**
             *
             * @param type 2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局，8：同ip拒绝游戏
             * @param kickedUserName
             */
            /**
             * 显示提示框
             * @function showTip
             * @DateTime 2018-03-17T15:13:48+0800
             * @param    {number}  type 1-确定请求投票，2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局，8：同ip拒绝游戏
             * @param    {string}  [kickedUserName=""] 相关操作的玩家
             */
            QpqCommonModule.prototype.showTip = function (type, kickedUserName) {
                if (kickedUserName === void 0) { kickedUserName = ""; }
                this._tipUi = this._tipUi || new gamelib.common.qpq.QpqTip();
                this._tipUi.showTip(type, kickedUserName);
                this._tipUi.show();
            };
            QpqCommonModule.prototype.show = function () {
                g_net.addListener(this);
            };
            QpqCommonModule.prototype.close = function () {
                g_net.removeListener(this);
            };
            QpqCommonModule.prototype.onLocalSignal = function (msg, data) {
                switch (msg) {
                    // case GameMsg.GAMERESOURCELOADED:                
                    //     if(GameVar.urlParam["isChildGame"])
                    //     {
                    //         return;
                    //     }
                    //     this._resultUi = this._resultUi || new gamelib.common.qpq.QPQResultUi();
                    //     this._detailUi = this._detailUi || new gamelib.common.qpq.ResultDetail();
                    //     this._tipUi = this._tipUi || new gamelib.common.qpq.QpqTip();
                    //     this._tip_ip = this._tip_ip || new gamelib.common.qpq.QpqTip_IP();
                    //     this._vote = this._vote || new gamelib.common.qpq.VoteUi();
                    // break;
                    case "showZhanjiUi": //显示战绩
                        if (GameVar.g_platformData['histroy_type'] == 0 || isNaN(GameVar.g_platformData['histroy_type'])) {
                            this._zhanji = this._zhanji || new gamelib.common.qpq.ResultHistroyUi();
                            this._zhanji.show();
                        }
                        else if (GameVar.g_platformData['histroy_type'] == 1) {
                            this._histroy_person = this._histroy_person || new gamelib.common.qpq.QppHistroy_Person();
                            this._histroy_person.show();
                        }
                        else if (GameVar.g_platformData['histroy_type'] == 2) {
                            this._histroy_zj = this._histroy_zj || new gamelib.common.qpq.QppHistroy_ZuJu();
                            this._histroy_zj.show();
                        }
                        break;
                    case "showQpqResultUi": //显示结算界面   
                        if (data.add_data != null && data.add_data.pay_mode == 3) //如果是金币场，直接显示每轮结算
                         {
                            this.onLocalSignal("showDetailUi", data);
                            return;
                        }
                        this._resultUi = this._resultUi || new gamelib.common.qpq.QPQResultUi();
                        this._resultUi.setData(data);
                        this._resultUi.show();
                        break;
                    case "showDetailUi":
                        this._detailUi = this._detailUi || new gamelib.common.qpq.ResultDetail();
                        this._detailUi.showDetail(data);
                        this._detailUi.show();
                        break;
                }
            };
            QpqCommonModule.prototype.reciveNetMsg = function (msgId, data) {
                switch (msgId) {
                    case 0x0018:
                        if (this._needToQuitGame) {
                            if (data.bDisconnect == 1) {
                                g_net.close();
                                g_childGame.toCircle();
                            }
                            this._needToQuitGame = true;
                        }
                        break;
                    case 0x00E2: //评价结果
                        break;
                    case 0x00E4: //评价结果确认
                        break;
                    case 0x00EB: //同意或拒绝进行游戏
                        if (data.result == 0)
                            return;
                        if (data.roleId != gamelib.data.UserInfo.s_self.m_id) {
                            if (data.operation == 2) {
                                var pdd = gamelib.core.getPlayerData(data.roleId);
                                if (this._tip_ip)
                                    this._tip_ip.close();
                                this.showTip(8, pdd.m_name_ex);
                            }
                        }
                        break;
                    case 0x00EA: //同ip玩家提示
                        this.checkIp(data);
                        break;
                    case 0x00FA: //组局完整记录
                        if (data.groupId != 0 && !isNaN(data.groupId)) {
                            var list1 = data.recordNum;
                            for (var _i = 0, list1_1 = list1; _i < list1_1.length; _i++) {
                                var obj = list1_1[_i];
                                if (obj.addData)
                                    obj.add_data = JSON.parse(obj.addData);
                            }
                            if (data.recordNum.length > 0) {
                                this.onLocalSignal("showQpqResultUi", data.recordNum[0]);
                            }
                            else {
                                //返回棋牌圈
                                g_childGame.toCircle();
                            }
                        }
                        break;
                    case 0x00FB: //实时成绩
                    //if(GameVar.s_game_id != 5)
                    //{
                    //    var temp:RealTimeScoreUi = <RealTimeScoreUi>g_uiMgr.showUiByClass(RealTimeScoreUi);
                    //    temp.setData(data);
                    //}
                    //break;
                    case 0x2002:
                        break;
                    case 0x2003:
                        if (data.result == 3) {
                            g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("未参与游戏，不能发起投票") + "！" });
                        }
                        break;
                    case 0x2004: //投票玩家列表
                        this._vote = this._vote || new gamelib.common.qpq.VoteUi();
                        this._vote.show();
                        this._vote.update(data);
                        break;
                    case 0x2005:
                        //<!--1 投票解散 2 房主解散 5 超时 7 达到指定局数-->
                        switch (data.reason) {
                            case 1:
                                if (this._vote)
                                    this._vote.close();
                                if (GameVar.circleData.isGoldScoreModle()) {
                                    g_childGame.toCircle();
                                    return;
                                }
                                this.showTip(3);
                                break;
                            case 2:
                                if (GameVar.circleData.selfIsFz()) {
                                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("解散牌局成功") + "!", callBack: function () {
                                            g_childGame.toCircle();
                                        }, type: 0 });
                                }
                                else {
                                    this.showTip(7);
                                }
                                break;
                            case 5:
                            case 6:
                                if (GameVar.circleData.isGoldScoreModle()) {
                                    g_childGame.toCircle();
                                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("牌桌超时关闭，自动返回大厅") });
                                }
                                else {
                                    g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("牌桌超时关闭，自动返回大厅"), callBack: function () {
                                            this.requestResult(GameVar.circleData.groupId);
                                        }, thisObj: this });
                                }
                                break;
                            case 7: //正常結束
                                // this.toCircle();
                                this.requestResult(GameVar.circleData.groupId);
                                break;
                            case 9: //货币不足，退回大厅
                                //流程:直接退出牌桌，在大厅中弹出铜钱不足的提示
                                g_childGame.toCircle();
                                var goodName = "";
                                // if(GameVar.circleData.isGoldScoreModle())
                                // {
                                //     goodName = GameVar.g_platformData['gold_name_gold'];
                                //     if(goodName == null)
                                //         goodName = GameVar.g_platformData['gold_name'];
                                // }
                                // else
                                // {
                                //     goodName = GameVar.g_platformData['gold_name'];                                
                                // }
                                goodName = "游戏币";
                                g_uiMgr.showAlertUiByArgs({ msg: "您的" + goodName + getDesByLan("不足") + "！" });
                                break;
                            case 10: //您长时间未准备
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("您长时间未准备，自动返回大厅") });
                                break;
                            case 11:
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("无人抢地主，房间解散") });
                                break;
                            case 12:
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({ msg: getDesByLan("您被提出俱乐部") });
                                break;
                            case 13: //俱乐部牌桌超时                            
                                g_uiMgr.showAlertUiByArgs({
                                    msg: getDesByLan("牌桌超时关闭，自动返回大厅"),
                                    callBack: function (type) {
                                        g_childGame.toCircle(GameVar.circleData.info);
                                    },
                                    thisObj: this
                                });
                                break;
                            case 14: //你已被管理员强制退分
                                g_uiMgr.showAlertUiByArgs({
                                    msg: "你已被管理员强制退分!",
                                    callBack: function (type) {
                                        g_childGame.toCircle(GameVar.circleData.info);
                                    },
                                    thisObj: this
                                });
                                break;
                            case 15:
                                g_uiMgr.showAlertUiByArgs({
                                    msg: "比赛已经结束!",
                                    callBack: function (type) {
                                        g_childGame.toCircle(GameVar.circleData.info);
                                    },
                                    thisObj: this
                                });
                                break;
                            case 17:
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({ msg: "观战牌桌结束!" });
                                break;
                            case 18:
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({ msg: "赛区已结束!" });
                                break;
                            case 19:
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({ msg: "比赛人数不足，比赛结束!" });
                                break;
                        }
                        break;
                }
            };
            QpqCommonModule.prototype.checkIp = function (data) {
                var ipStr = "";
                if (data.num.length) {
                    ipStr += getDesByLan("玩家");
                    for (var i = 0; i < data.num.length; i++) {
                        var obJ = data.num[i];
                        for (var j = 0; j < obJ.withId.length; j++) {
                            ipStr += "【" + obJ.withId[j].nickName + "】";
                        }
                        ipStr += "同IP";
                        if (i < data.num.length - 1) {
                            ipStr += "、";
                        }
                    }
                    ipStr += "!";
                }
                // var addStr:string = this.checkDis();
                if (ipStr != "") {
                    this._tip_ip = this._tip_ip || new gamelib.common.qpq.QpqTip_IP();
                    this._tip_ip.show();
                    this._tip_ip.showSameIp(ipStr, "", data.times);
                }
                else {
                    sendNetMsg(0x00EB, 1);
                }
            };
            return QpqCommonModule;
        }());
        common.QpqCommonModule = QpqCommonModule;
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 战绩历史---金币场 请求0x2021
             * @type {[type]}
             */
            var QppHistroy_Person = /** @class */ (function (_super) {
                __extends(QppHistroy_Person, _super);
                function QppHistroy_Person() {
                    var _this = _super.call(this, "qpq/Art_Record1") || this;
                    _this._cd = 5000;
                    _this._lastTime = 0;
                    _this._numOfPage = 4;
                    return _this;
                }
                QppHistroy_Person.prototype.reciveNetMsg = function (msgId, data) {
                    if (msgId != 0x2021)
                        return;
                    g_uiMgr.closeMiniLoading();
                    var page = data.offsize / this._numOfPage;
                    this._allDatas[page] = data.list;
                    this._totalNum = data.totalNum;
                    this._totalNum = Math.min(this._totalNum, this._maxHistroyNum);
                    this.showPage(page);
                };
                QppHistroy_Person.prototype.init = function () {
                    this._maxHistroyNum = GameVar.g_platformData['histroy_num'];
                    if (isNaN(this._maxHistroyNum)) {
                        this._maxHistroyNum = 200;
                    }
                    this._page = new gamelib.control.Page(this._res['btn_up'], this._res['btn_down'], this._res['txt_page'], Laya.Handler.create(this, this.onPageChange, null, false));
                    this._list = [];
                    this._numOfPage = 4;
                    for (var i = 1; i <= this._numOfPage; i++) {
                        this._list.push(this._res['ui_' + i]);
                        this._res['ui_' + i].visible = false;
                    }
                    this._noticeOther = true;
                    this._allDatas = [];
                };
                QppHistroy_Person.prototype.onPageChange = function (page) {
                    var arr = this._allDatas[page];
                    if (arr == null) {
                        this.requestData(page);
                    }
                    else {
                        this.setDataSource(arr);
                    }
                };
                QppHistroy_Person.prototype.showPage = function (page) {
                    this.onPageChange(page);
                    this._page.setPage(page, Math.ceil(this._totalNum / this._numOfPage));
                };
                QppHistroy_Person.prototype.requestData = function (page) {
                    sendNetMsg(0x2021, page * this._numOfPage, this._numOfPage);
                    g_uiMgr.showMiniLoading();
                };
                QppHistroy_Person.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    if (Laya.timer.currTimer - this._lastTime > this._cd) {
                        this._allDatas.length;
                        this.requestData(0);
                        this._lastTime = Laya.timer.currTimer;
                    }
                    else {
                        this.showPage(0);
                    }
                    this._page.show();
                };
                QppHistroy_Person.prototype.setDataSource = function (datasource) {
                    this._res['txt_tips'].visible = datasource.length == 0;
                    for (var i = 0; i < this._list.length; i++) {
                        var item = this._list[i];
                        if (datasource[i] == null) {
                            item.visible = false;
                            continue;
                        }
                        var obj = JSON.parse(datasource[i].json_str);
                        if (obj == null) {
                            item.visible = false;
                            continue;
                        }
                        item.visible = true;
                        var game_name = item['txt_2'];
                        var time = item['txt_4'];
                        var list = item['list_1'];
                        if (list.scrollBar)
                            list.scrollBar.autoHide = true;
                        list.visible = true;
                        list.renderHandler = Laya.Handler.create(this, this.onItemUpdate, [obj.players], false);
                        list.dataSource = obj.players ? obj.players : [];
                        game_name.text = obj.game_name;
                        time.text = obj.create_time;
                    }
                };
                QppHistroy_Person.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    this._page.close();
                };
                QppHistroy_Person.prototype.onItemUpdate = function (list, item, index) {
                    var pd = list[index];
                    var txt = getChildByName(item, "txt_1");
                    try {
                        txt.text = utils.StringUtility.getNameEx(decodeURIComponent(pd.name), 10);
                    }
                    catch (e) {
                        txt.text = "????";
                    }
                    txt = getChildByName(item, "txt_3");
                    var money = utils.tools.getMoneyByExchangeRate(pd.winlose);
                    txt.text = pd.winlose > 0 ? "+" + money : money + "";
                    txt = getChildByName(item, "txt_2");
                    txt.text = "";
                    var banker = getChildByName(item, "img_icon");
                    banker.visible = false;
                    var temp;
                    try {
                        temp = JSON.parse(pd.extra_data);
                    }
                    catch (e) {
                        return;
                    }
                    if (temp['isBanker'] != undefined)
                        banker.visible = temp.isBanker == 1;
                    else if (temp['isbanker'] != undefined)
                        banker.visible = temp.isbanker == 1;
                    if (temp.card_type_name == null || temp.card_type_name == "") {
                        txt.visible = false;
                        return;
                    }
                    txt.text = temp.card_type_name;
                    txt.visible = true;
                };
                return QppHistroy_Person;
            }(gamelib.core.Ui_NetHandle));
            qpq.QppHistroy_Person = QppHistroy_Person;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 战绩历史---组局场 请求0x00FA
             * @type {[type]}
             */
            var QppHistroy_ZuJu = /** @class */ (function (_super) {
                __extends(QppHistroy_ZuJu, _super);
                function QppHistroy_ZuJu() {
                    var _this = _super.call(this, "qpq/Art_Record1") || this;
                    _this._cd = 5000;
                    _this._lastTime = 0;
                    _this._numOfPage = 4;
                    return _this;
                }
                QppHistroy_ZuJu.prototype.reciveNetMsg = function (msgId, data) {
                    if (msgId != 0x00FA)
                        return;
                    g_uiMgr.closeMiniLoading();
                    var page = data.offsize / this._numOfPage;
                    this._allDatas[page] = data.recordNum;
                    this._totalNum = data.totalNum;
                    this._totalNum = Math.min(this._totalNum, this._maxHistroyNum);
                    this.showPage(page);
                };
                QppHistroy_ZuJu.prototype.init = function () {
                    this._maxHistroyNum = GameVar.g_platformData['histroy_num'];
                    if (isNaN(this._maxHistroyNum)) {
                        this._maxHistroyNum = 200;
                    }
                    this._page = new gamelib.control.Page(this._res['btn_up'], this._res['btn_down'], this._res['txt_page'], Laya.Handler.create(this, this.onPageChange, null, false));
                    this._list = [];
                    this._numOfPage = 4;
                    for (var i = 1; i <= this._numOfPage; i++) {
                        this._list.push(this._res['ui_' + i]);
                        this._res['ui_' + i].visible = false;
                    }
                    this._noticeOther = true;
                    this._allDatas = [];
                };
                QppHistroy_ZuJu.prototype.onPageChange = function (page) {
                    var arr = this._allDatas[page];
                    if (arr == null) {
                        this.requestData(page);
                    }
                    else {
                        this.setDataSource(arr);
                    }
                };
                QppHistroy_ZuJu.prototype.showPage = function (page) {
                    this.onPageChange(page);
                    this._page.setPage(page, Math.ceil(this._totalNum / this._numOfPage));
                };
                QppHistroy_ZuJu.prototype.requestData = function (page) {
                    sendNetMsg(0x00FA, 0, page * this._numOfPage, this._numOfPage, 0);
                    g_uiMgr.showMiniLoading();
                };
                QppHistroy_ZuJu.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    if (Laya.timer.currTimer - this._lastTime > this._cd) {
                        this._allDatas.length;
                        this.requestData(0);
                        this._lastTime = Laya.timer.currTimer;
                    }
                    else {
                        this.showPage(0);
                    }
                    this._page.show();
                };
                QppHistroy_ZuJu.prototype.setDataSource = function (datasource) {
                    this._res['txt_tips'].visible = datasource.length == 0;
                    for (var i = 0; i < this._list.length; i++) {
                        var item = this._list[i];
                        var obj = datasource[i];
                        if (obj == null) {
                            item.visible = false;
                            continue;
                        }
                        item.visible = true;
                        var game_name = item['txt_2'];
                        var time = item['txt_4'];
                        var list = item['list_1'];
                        if (list.scrollBar)
                            list.scrollBar.autoHide = true;
                        list.visible = true;
                        list.renderHandler = Laya.Handler.create(this, this.onItemUpdate, [obj.playerNum], false);
                        list.dataSource = obj.playerNum ? obj.playerNum : [];
                        game_name.text = obj.gameName;
                        time.text = obj.creatTime;
                    }
                };
                QppHistroy_ZuJu.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    this._page.close();
                };
                QppHistroy_ZuJu.prototype.onItemUpdate = function (list, item, index) {
                    var pd = list[index];
                    var txt = getChildByName(item, "txt_1");
                    try {
                        txt.text = utils.StringUtility.getNameEx(decodeURIComponent(pd.playerName), 10);
                    }
                    catch (e) {
                        txt.text = "????";
                    }
                    txt = getChildByName(item, "txt_3");
                    txt.text = pd.winOrLosePoints > 0 ? "+" + pd.winOrLosePoints : pd.winOrLosePoints + "";
                    txt = getChildByName(item, "txt_2");
                    txt.text = "";
                    var banker = getChildByName(item, "img_icon");
                    banker.visible = false;
                    var temp;
                    try {
                        temp = JSON.parse(pd.detailedRecord);
                    }
                    catch (e) {
                        return;
                    }
                    if (temp['isBanker'] != undefined)
                        banker.visible = temp.isBanker == 1;
                    else if (temp['isbanker'] != undefined)
                        banker.visible = temp.isBanker == 1;
                    if (temp.card_type_name == null || temp.card_type_name == "") {
                        txt.visible = false;
                        return;
                    }
                    txt.text = temp.card_type_name;
                    txt.visible = true;
                };
                return QppHistroy_ZuJu;
            }(gamelib.core.Ui_NetHandle));
            qpq.QppHistroy_ZuJu = QppHistroy_ZuJu;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by Administrator on 2017/4/26.
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 投票确认框
             */
            var QpqTip = /** @class */ (function (_super) {
                __extends(QpqTip, _super);
                function QpqTip() {
                    return _super.call(this, "qpq/Art_CustomTips1") || this;
                }
                QpqTip.prototype.init = function () {
                    this._res["txt_2"].align = "center";
                    this._res["txt_2"].valign = "middle";
                    this._res["txt_2"].editable = false;
                    this.addBtnToListener("btn_cancel");
                    this.addBtnToListener("btn_ok");
                    this._res.isModal = true;
                    if (this._res['btn_close'])
                        this._res['btn_close'].visible = false;
                    this._pos =
                        {
                            okX: this._res["btn_ok"].x,
                            cancelX: this._res["btn_cancel"].x,
                            centerX: this._res["btn_ok"].x + (this._res["btn_cancel"].x - this._res["btn_ok"].x) / 2
                        };
                    this._res["btn_cancel"].label = "取消";
                    this._res["btn_ok"].label = "确定";
                    this.m_closeUiOnSide = false;
                };
                /**
                 * 设置按钮数量
                 * @param {number} type [description]
                 */
                QpqTip.prototype.setBtns = function (type) {
                    if (type == 1) {
                        this._res["btn_cancel"].x = this._pos.cancelX;
                        this._res["btn_ok"].x = this._pos.okX;
                        this._res["btn_ok"].visible = this._res["btn_cancel"].visible = true;
                    }
                    else {
                        this._res["btn_ok"].x = this._pos.centerX;
                        this._res["btn_cancel"].visible = false;
                    }
                };
                /**
                 * 显示提示
                 * @function
                 * @DateTime 2018-03-17T15:39:28+0800
                 * @param    {number}                 type  2-投票未通过，3-投票通过，
                 *                                          4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局
                 *                                          8-同ip拒绝游戏
                 * @param    {string}                 extra [description]
                 */
                QpqTip.prototype.showTip = function (type, extra) {
                    this._type = type;
                    var msg = "";
                    var title = "";
                    switch (type) {
                        case 2:
                        case 8:
                            title = getDesByLan("投票未通过");
                            msg = "【" + extra + "】" + getDesByLan("拒绝了投票") + "!";
                            break;
                        case 3:
                            title = getDesByLan("一致通过，牌局解散");
                            msg = getDesByLan("本局游戏结束");
                            break;
                        case 4:
                            msg = utils.StringUtility.format(getDesByLan("玩家{0}已被房主踢出房间"), [extra]);
                            break;
                        case 5:
                            msg = getDesByLan("房间人数已满");
                            break;
                        case 6:
                            msg = getDesByLan("您已被房主踢出房间");
                            break;
                        case 7:
                            title = getDesByLan("房主已将牌局解散");
                            msg = getDesByLan("本局游戏结束") + "！";
                            break;
                    }
                    this._res["txt_1"].text = title;
                    this._res["txt_2"].text = msg;
                    this.setBtns(type);
                    this._groupId = GameVar.circleData.groupId;
                };
                QpqTip.prototype.onClickObjects = function (evt) {
                    playButtonSound();
                    switch (evt.currentTarget.name) {
                        case "btn_ok":
                            switch (this._type) {
                                case 3:
                                    g_qpqCommon.toCircle(true, this._groupId);
                                    break;
                                case 7:
                                    g_childGame.toCircle();
                                    break;
                                case 8:
                                    break;
                                default:
                                    g_qpqCommon.toCircle();
                                    break;
                            }
                            break;
                    }
                    this.close();
                };
                return QpqTip;
            }(gamelib.core.BaseUi));
            qpq.QpqTip = QpqTip;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by Administrator on 2017/5/3.
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            var QpqTip_IP = /** @class */ (function (_super) {
                __extends(QpqTip_IP, _super);
                function QpqTip_IP() {
                    return _super.call(this, "qpq/Art_CustomTips") || this;
                }
                QpqTip_IP.prototype.init = function () {
                    this.addBtnToListener("btn_cancel");
                    this.addBtnToListener("btn_ok");
                    this._btn_ok = this._res["btn_ok"];
                    this._tip_txt = this._res["txt_txt"];
                    this._res["btn_cancel"].label = "拒绝";
                    this.m_closeUiOnSide = false;
                };
                QpqTip_IP.prototype.showSameIp = function (ipStr, addStr, time) {
                    var setStr = getDesByLan("注意") + "：\n";
                    if (this.checkValid(ipStr)) {
                        setStr += "    " + ipStr;
                    }
                    if (this.checkValid(addStr)) {
                        setStr += "    " + addStr;
                    }
                    setStr += getDesByLan("您确定要和他们一起游戏") + "？";
                    this._tip_txt.text = setStr;
                    this._sec = time;
                    this.onCount();
                };
                QpqTip_IP.prototype.checkValid = function (str) {
                    if (str == null) {
                        return false;
                    }
                    else if (str == "") {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                QpqTip_IP.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    Laya.timer.loop(1000, this, this.onCount);
                };
                QpqTip_IP.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    Laya.timer.clear(this, this.onCount);
                };
                QpqTip_IP.prototype.onCount = function () {
                    this._btn_ok.label = "(" + getDesByLan("同意") + this._sec + "s)";
                    if (this._sec <= 0) {
                        sendNetMsg(0x00EB, 1);
                        this.close();
                    }
                    this._sec--;
                };
                QpqTip_IP.prototype.onClickObjects = function (evt) {
                    if (evt.currentTarget.name == "btn_ok") //同意
                     {
                        sendNetMsg(0x00EB, 1);
                    }
                    else {
                        sendNetMsg(0x00EB, 2);
                    }
                    this.close();
                };
                return QpqTip_IP;
            }(gamelib.core.BaseUi));
            qpq.QpqTip_IP = QpqTip_IP;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 *
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 对局详情信息
             */
            var ResultDetail = /** @class */ (function (_super) {
                __extends(ResultDetail, _super);
                function ResultDetail() {
                    var _this = _super.call(this, "qpq/Art_Record") || this;
                    _this._bInHall = false;
                    _this.m_clickHuiFang = false;
                    return _this;
                }
                ResultDetail.prototype.reciveNetMsg = function (msgId, data) {
                    if (this._normal)
                        this._normal.reciveNetMsg(msgId, data);
                    if (this._pageView)
                        this._pageView.reciveNetMsg(msgId, data);
                };
                ResultDetail.prototype.init = function () {
                    if (this._res['b_page']) {
                        this._pageView = new ResultDetailPage(this, this._res);
                    }
                    else {
                        this._normal = new ResultDetailNormal(this, this._res);
                    }
                    this._noticeOther = false;
                };
                ResultDetail.prototype.close = function () {
                    this._bInHall = utils.tools.isQpqHall();
                    _super.prototype.close.call(this);
                };
                ResultDetail.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    if (this._normal)
                        this._normal.show();
                    if (this._pageView)
                        this._pageView.show();
                    this._noticeOther = true;
                    this.m_clickHuiFang = false;
                };
                ResultDetail.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    if (this._normal)
                        this._normal.close();
                    if (this._pageView)
                        this._pageView.close();
                    if (!this._bInHall && !this.m_clickHuiFang)
                        g_childGame.toCircle(); //在牌桌中也会出现这个界面
                    this._noticeOther = false;
                };
                ResultDetail.prototype.showDetail = function (data) {
                    var temp = ResultDetail.s_list[data.groupId];
                    if (temp == null) {
                        temp = {
                            "roomId": data.roomId,
                            "gameID": data.gameID,
                            "gameMode": data.gameMode,
                            "groupId": data.groupId,
                            "bRequest": false
                        };
                        ResultDetail.s_list[data.groupId] = temp;
                    }
                    if (this._normal)
                        this._normal.setData(temp);
                    if (this._pageView)
                        this._pageView.setData(temp);
                };
                ResultDetail.s_list = {};
                return ResultDetail;
            }(gamelib.core.Ui_NetHandle));
            qpq.ResultDetail = ResultDetail;
            var ResultDetailNormal = /** @class */ (function () {
                function ResultDetailNormal(parent, res) {
                    this._parent = parent;
                    this._res = res;
                    this._tips = res['txt_tips'];
                    this._list = this._res["list_1"];
                    this._list.dataSource = [];
                    this._list.renderHandler = Laya.Handler.create(this, this.onItemUpdate, null, false);
                    this._res["txt_11"].text = "";
                    this._res["txt_12"].text = "";
                    this._res["txt_13"].text = "";
                }
                ResultDetailNormal.prototype.reciveNetMsg = function (msgId, data) {
                    if (msgId != 0x00F9 || data.groupId != this._data.groupId)
                        return;
                    this._data.bRequest = true;
                    for (var key in data) {
                        this._data[key] = data[key];
                    }
                    var list = this._data.recordNum;
                    for (var i = 0; i < list.length; i++) {
                        list[i].roomId = this._data.roomId;
                        list[i].gameID = this._data.gameID;
                        list[i].gameMode = this._data.gameMode;
                        list[i].parentData = data;
                        list[i].gz_id = data.gz_id;
                        list[i].groupId = data.groupId;
                        for (var _i = 0, _a = list[i].playerNum; _i < _a.length; _i++) {
                            var pd = _a[_i];
                            pd.playerInfo = this.getPlayerInfo(pd.playerPid, this._data.playerList);
                        }
                    }
                    this._list.dataSource = this._data.recordNum;
                    this._tips.visible = this._data.recordNum.length == 0;
                    this.setCommonData();
                };
                ResultDetailNormal.prototype.setData = function (data) {
                    this._data = data;
                    this._list.dataSource = [];
                };
                ResultDetailNormal.prototype.show = function () {
                    if (!this._data.bRequest) {
                        sendNetMsg(0x00F9, this._data.groupId);
                        return;
                    }
                    this._list.dataSource = this._data.recordNum;
                    this._tips.visible = this._data.recordNum.length == 0;
                    this.setCommonData();
                };
                ResultDetailNormal.prototype.setCommonData = function () {
                    this._res["txt_11"].text = this._data.roomName;
                    this._res["txt_12"].text = "总局数:" + this._data.roundMax;
                    this._res["txt_13"].text = "房号:" + this._data.roomId;
                };
                ResultDetailNormal.prototype.close = function () {
                };
                ResultDetailNormal.prototype.getPlayerInfo = function (pid, list) {
                    for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                        var pd = list_3[_i];
                        if (pd.playerPid == pid)
                            return pd;
                    }
                    return null;
                };
                ResultDetailNormal.prototype.onItemUpdate = function (item, index) {
                    var data = this._data.recordNum[index];
                    var txt = getChildByName(item, "txt_1");
                    txt.text = "第" + data.roundId + "局";
                    // txt = <laya.ui.Label>getChildByName(item,"txt_2");
                    // txt.text = data.parentData.roomName;
                    // txt = <laya.ui.Label>getChildByName(item,"txt_3");
                    // txt.text = getDesByLan("房号")+":" + data.roomId;
                    txt = getChildByName(item, "txt_4");
                    txt.text = "" + data.creatTime;
                    var btn = getChildByName(item, "btn_huifang");
                    if (btn != null) {
                        btn["__roundId"] = data.roundId;
                        if (data.hasVideo > 0) {
                            btn.visible = true;
                            btn.off(laya.events.Event.CLICK, this, this.onClickReplay);
                            btn.on(laya.events.Event.CLICK, this, this.onClickReplay);
                        }
                        else {
                            btn.visible = false;
                            btn.off(laya.events.Event.CLICK, this, this.onClickReplay);
                        }
                    }
                    var showing_items = [];
                    var playerList = data.playerNum;
                    var itemheight = 0;
                    //是否需要进行排序,把显示的人数居中显示。默认都排序
                    //斗地主不需要排序 
                    //如果所有显示的人数x值都相同，则不排序
                    var isORder = true;
                    var oldX, allSame;
                    for (var i = 0; i < 6; i++) {
                        var item1 = getChildByName(item, "b_" + (i + 1));
                        if (item1 == null) {
                            break;
                        }
                        if (i >= playerList.length) {
                            item1.visible = false;
                            continue;
                        }
                        if (isNaN(oldX)) {
                            oldX = item1.x;
                            allSame = true;
                        }
                        else if (oldX == item1.x) {
                            allSame = allSame && true;
                        }
                        else {
                            allSame = false;
                        }
                        var obj = playerList[i];
                        item1.visible = true;
                        showing_items.push(item1);
                        this.setPlayerInfo(item1, obj, data);
                        itemheight = item1.height + 2;
                    }
                    isORder = !allSame;
                    if (isORder) {
                        var row = Math.ceil(showing_items.length / 2);
                        var ty = (item.height - row * itemheight) / 2;
                        for (var i = 0; i < showing_items.length; i++) {
                            var item1 = showing_items[i];
                            item1.y = ty + Math.floor(i / 2) * itemheight;
                        }
                    }
                };
                ResultDetailNormal.prototype.onClickReplay = function (evt) {
                    this._parent.close();
                    this._parent.m_clickHuiFang = true;
                    if (utils.tools.isQpqHall()) {
                        g_childGame.enterGameByClient(this._data.gz_id, true, null, { "groupId": this._data.groupId, "roundId": evt.currentTarget["__roundId"] });
                    }
                    else {
                        sendNetMsg(0x00FF, this._data.groupId, evt.currentTarget["__roundId"]);
                    }
                };
                ResultDetailNormal.prototype.setPlayerInfo = function (res, pd, data) {
                    var txt = getChildByName(res, "txt_1");
                    utils.tools.setLabelDisplayValue(txt, pd.playerInfo.playerName); // utils.StringUtility.getNameEx(pd.playerInfo.playerName,10);
                    txt = getChildByName(res, "txt_3");
                    txt.text = pd.winOrLosePoints > 0 ? "+" + pd.winOrLosePoints : pd.winOrLosePoints + "";
                    txt = getChildByName(res, "txt_2");
                    txt.text = "";
                    var banker = getChildByName(res, "img_icon");
                    banker.visible = false;
                    var temp;
                    if (pd.detailedRecord == "") {
                        return;
                    }
                    temp = JSON.parse(pd.detailedRecord);
                    banker.visible = temp.isBanker == 1;
                    if (temp.card_type_name) {
                        txt.text = temp.card_type_name;
                        txt.visible = true;
                    }
                    else {
                        txt.visible = false;
                    }
                };
                return ResultDetailNormal;
            }());
            qpq.ResultDetailNormal = ResultDetailNormal;
            var ResultDetailPage = /** @class */ (function () {
                function ResultDetailPage(parent, res) {
                    this._numOfPage = 3;
                    this._totalNum = 0;
                    this._parent = parent;
                    this._res = res;
                    this._tips = res['txt_tips'];
                    this._items = [];
                    this._numOfPage = this.getNum();
                    for (var i = 0; i < this._numOfPage; i++) {
                        var item = res['ui_' + (i + 1)];
                        this._items.push(item);
                        var list = item['list_1'];
                        list.dataSource = [];
                        list.renderHandler = Laya.Handler.create(this, this.onItemUpdate, [list], false);
                    }
                    this._page = new gamelib.control.Page(res['btn_page_1'], res['btn_page_2'], res['txt_page'], Laya.Handler.create(this, this.onPageChange, null, false));
                }
                ResultDetailPage.prototype.getNum = function () {
                    var i = 0;
                    while (true) {
                        if (this._res['ui_' + (i + 1)])
                            i++;
                        else
                            break;
                    }
                    return i;
                };
                ResultDetailPage.prototype.reciveNetMsg = function (msgId, data) {
                    if (msgId != 0x00F9 || data.groupId != this._data.groupId)
                        return;
                    this._data.bRequest = true;
                    for (var key in data) {
                        this._data[key] = data[key];
                    }
                    var list = this._data.recordNum;
                    for (var i = 0; i < list.length; i++) {
                        list[i].roomId = this._data.roomId;
                        list[i].gameID = this._data.gameID;
                        list[i].gameMode = this._data.gameMode;
                        list[i].parentData = data;
                        list[i].gz_id = data.gz_id;
                        list[i].groupId = data.groupId;
                        for (var _i = 0, _a = list[i].playerNum; _i < _a.length; _i++) {
                            var pd = _a[_i];
                            pd.playerInfo = this.getPlayerInfo(pd.playerPid, this._data.playerList);
                        }
                    }
                    this._totalNum = list.length;
                    this.showPage(0);
                };
                ResultDetailPage.prototype.showPage = function (page) {
                    this.onPageChange(page);
                    this._page.setPage(page, Math.ceil(this._totalNum / this._numOfPage));
                };
                ResultDetailPage.prototype.onItemUpdate = function (list, box, index) {
                    var pd = list.dataSource[index];
                    var txt_name = getChildByName(box, 'txt_player');
                    var txt_value = getChildByName(box, 'txt_defen');
                    var banker = getChildByName(box, 'img_dizhu');
                    txt_name.text = utils.StringUtility.getNameEx(pd.playerInfo.playerName, 10);
                    txt_value.text = pd.winOrLosePoints > 0 ? "+" + pd.winOrLosePoints : pd.winOrLosePoints + "";
                    banker.visible = false;
                    var temp;
                    if (pd.detailedRecord == "") {
                        return;
                    }
                    temp = JSON.parse(pd.detailedRecord);
                    if (temp['isBanker'] != undefined)
                        banker.visible = temp.isBanker == 1;
                    else if (temp['isbanker'] != undefined)
                        banker.visible = temp.isbanker == 1;
                    // banker.visible = temp.isBanker == 1;
                };
                ResultDetailPage.prototype.onPageChange = function (page) {
                    var list = this._data.recordNum;
                    var arr = list.slice(page * this._numOfPage, (page + 1) * this._numOfPage);
                    for (var i = 0; i < this._items.length; i++) {
                        var item = this._items[i];
                        var data = arr[i];
                        if (data == null) {
                            item.visible = false;
                            continue;
                        }
                        item.visible = true;
                        var indexLabel = item['txt_game'];
                        var time = item['txt_time'];
                        var _list = item['list_1'];
                        indexLabel.text = "第" + data.roundId + "局";
                        ;
                        time.text = data.creatTime;
                        _list.dataSource = data.playerNum;
                        var huifang_btn = item['btn_huifang'];
                        if (huifang_btn) {
                            huifang_btn.visible = data.hasVideo;
                            huifang_btn['__roundId'] = data.roundId;
                        }
                    }
                    this._tips.visible = arr.length == 0;
                };
                ResultDetailPage.prototype.getPlayerInfo = function (pid, list) {
                    for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                        var pd = list_4[_i];
                        if (pd.playerPid == pid)
                            return pd;
                    }
                    return null;
                };
                ResultDetailPage.prototype.setData = function (data) {
                    this._data = data;
                };
                ResultDetailPage.prototype.show = function () {
                    this._page.show();
                    for (var i = 0; i < this._items.length; i++) {
                        var item = this._items[i];
                        var huifang_btn = item['btn_huifang'];
                        if (huifang_btn) {
                            huifang_btn.on(Laya.Event.CLICK, this, this.onClickReplay);
                        }
                    }
                    if (!this._data.bRequest) {
                        sendNetMsg(0x00F9, this._data.groupId);
                        return;
                    }
                    this.showPage(0);
                };
                ResultDetailPage.prototype.close = function () {
                    this._page.close();
                    for (var i = 0; i < this._items.length; i++) {
                        var item = this._items[i];
                        var huifang_btn = item['btn_huifang'];
                        if (huifang_btn) {
                            huifang_btn.on(Laya.Event.CLICK, this, this.onClickReplay);
                        }
                    }
                };
                ResultDetailPage.prototype.onClickReplay = function (evt) {
                    this._parent.close();
                    if (utils.tools.isQpqHall()) {
                        g_childGame.enterGameByClient(this._data.gz_id, true, null, { "groupId": this._data.groupId, "roundId": evt.currentTarget["__roundId"] });
                    }
                    else {
                        sendNetMsg(0x00FF, this._data.groupId, evt.currentTarget["__roundId"]);
                    }
                };
                return ResultDetailPage;
            }());
            qpq.ResultDetailPage = ResultDetailPage;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2017/9/5.
 */
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 战绩界面
             */
            var ResultHistroyUi = /** @class */ (function (_super) {
                __extends(ResultHistroyUi, _super);
                function ResultHistroyUi() {
                    return _super.call(this, "qpq/Art_Zhanji") || this;
                }
                ResultHistroyUi.prototype.init = function () {
                    this._list = this._res["list_zhanji"];
                    this._noticeOther = true;
                    this._list.selectEnable = true;
                    this._list.dataSource = [];
                    this._list.selectHandler = laya.utils.Handler.create(this, this.onSelect, null, false);
                };
                ResultHistroyUi.prototype.reciveNetMsg = function (msgId, data) {
                    if (msgId == 0x00FA) {
                        g_signal.dispatch("closeQpqLoadingUi");
                        this._data = data.recordNum;
                        this._list.dataSource = this._data;
                        this._res["txt_tips"].visible = this._data.length == 0;
                    }
                };
                ResultHistroyUi.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    this._list.on(laya.events.Event.RENDER, this, this.onItemUpdate);
                    if (this._data == null) {
                        sendNetMsg(0x00FA, 0, 0, 10, 0);
                        var temp = {
                            msg: getDesByLan("加载数据中"),
                            delay: 15,
                            alert: getDesByLan("网络繁忙，请稍后重试"),
                            callback: this.close,
                            thisobj: this
                        };
                        g_signal.dispatch("showQpqLoadingUi", temp);
                    }
                    else {
                        this._list.dataSource = this._data;
                        this._res["txt_tips"].visible = this._data.length == 0;
                    }
                };
                ResultHistroyUi.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    this._list.off(laya.events.Event.RENDER, this, this.onItemUpdate);
                    this._list.selectedIndex = -1;
                };
                ResultHistroyUi.prototype.onItemUpdate = function (item, index) {
                    var data = this._data[index];
                    var txt = item.getChildByName("txt_2");
                    txt.text = data.gameName;
                    var min = (data.timeCost / 60).toFixed(0);
                    txt = item.getChildByName("txt_5");
                    txt.text = getDesByLan("时间") + ":" + min + getDesByLan("分钟");
                    txt = item.getChildByName("txt_1");
                    txt.text = getDesByLan("房号") + ":" + data.roomId;
                    txt = item.getChildByName("txt_3");
                    txt.text = utils.StringUtility.getNameEx(data.homewnerName, 10);
                    txt = item.getChildByName("txt_4");
                    txt.text = data.creatTime;
                    txt = item.getChildByName("txt_6");
                    if (data.roundMax == 0) {
                        txt.text = data.roundTotal + "";
                    }
                    else {
                        txt.text = data.roundTotal + "/" + data.roundMax;
                    }
                    var players = data.playerNum;
                    var myPid = GameVar.pid;
                    var score = 0;
                    for (var i = 0; i < players.length; i++) {
                        if (players[i].playerPid == myPid) {
                            score = players[i].winOrLosePoints;
                            break;
                        }
                    }
                    txt = item.getChildByName("txt_7");
                    txt.text = score > 0 ? "+" + score : "" + score;
                };
                ResultHistroyUi.prototype.onSelect = function (index) {
                    if (index == -1)
                        return;
                    g_signal.dispatch("showQpqResultUi", this._data[index]);
                    this._noticeOther = false;
                    this.close();
                    this._noticeOther = true;
                    //console.log("onItemClick" + evt.currentTarget["__index"]);
                };
                return ResultHistroyUi;
            }(gamelib.core.Ui_NetHandle));
            qpq.ResultHistroyUi = ResultHistroyUi;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var common;
    (function (common) {
        var qpq;
        (function (qpq) {
            /**
             * 投票界面
             */
            var VoteUi = /** @class */ (function (_super) {
                __extends(VoteUi, _super);
                function VoteUi() {
                    return _super.call(this, "qpq/Art_Tips_Toupiao") || this;
                }
                VoteUi.prototype.init = function () {
                    this._list = this._res["list_1"];
                    this._tip1 = this._res["b_tips1"];
                    this._tip2 = this._res["b_tips2"];
                    this.addBtnToListener("btn_cancel");
                    this.addBtnToListener("btn_ok");
                    this.m_closeUiOnSide = false;
                    this._res['btn_cancel'].label = getDesByLan("拒绝");
                };
                VoteUi.prototype.onShow = function () {
                    _super.prototype.onShow.call(this);
                    Laya.timer.loop(1000, this, this.timer);
                    if (this._res['btn_close'])
                        this._res['btn_close'].visible = false;
                    this._list.on(laya.events.Event.RENDER, this, this.onItemUpdate);
                };
                VoteUi.prototype.onClose = function () {
                    _super.prototype.onClose.call(this);
                    Laya.timer.clear(this, this.timer);
                    this._list.off(laya.events.Event.RENDER, this, this.onItemUpdate);
                };
                VoteUi.prototype.onClickObjects = function (evt) {
                    if (evt.currentTarget.name == "btn_ok") {
                        sendNetMsg(0x2004, 1);
                    }
                    else {
                        sendNetMsg(0x2004, 2);
                    }
                    this._tip1.visible = false;
                    this._tip2.visible = true;
                    playButtonSound();
                };
                VoteUi.prototype.update = function (data) {
                    this._sec = data.time;
                    this._datasource = data.players;
                    this._list.dataSource = this._datasource;
                    this.timer();
                    var total = data.players.length;
                    var passed = 0;
                    var selfState = 0;
                    var juList = [];
                    var isPangGuan = true;
                    for (var i = 0; i < total; i++) {
                        if (data.players[i].status == 1)
                            passed++;
                        else if (data.players[i].status == 2) {
                            juList.push(gamelib.core.getPlayerData(data.players[i].id).m_name);
                        }
                        if (data.players[i].id == gamelib.data.UserInfo.s_self.m_id) {
                            selfState = data.players[i].status;
                            isPangGuan = false;
                            continue;
                        }
                    }
                    this.setVoteInfo(passed, total);
                    if (isPangGuan) {
                        this._tip1.visible = false;
                        this._tip2.visible = true;
                    }
                    else {
                        if (selfState != 0) {
                            this._tip1.visible = false;
                            this._tip2.visible = true;
                        }
                        else {
                            this._tip1.visible = true;
                            this._tip2.visible = false;
                        }
                    }
                    if (data.result == 2) //拒绝
                     {
                        this.delayClose(juList);
                    }
                };
                VoteUi.prototype.delayClose = function (juList) {
                    //var msg:string = "玩家:" + juList.join(",") +"拒绝解散,游戏继续!";
                    //g_uiMgr.showAlertUiByArgs({"msg":msg,type:5,autoCall:5,callBack:function(type:number)
                    //{
                    //    this.close();
                    //},thisObj:this});
                    Laya.timer.once(2000, this, this.close);
                };
                VoteUi.prototype.timer = function () {
                    if (this._sec >= 0) {
                        this._res["txt_time"].text = this._sec + "秒";
                    }
                    this._sec--;
                    if (this._sec == 0) {
                        this.close();
                    }
                };
                VoteUi.prototype.setVoteInfo = function (pass, total) {
                    this._res["txt_num"].text = getDesByLan("同意") + " " + pass + "/" + total + " " + getDesByLan("总数");
                };
                VoteUi.prototype.onItemUpdate = function (box, index) {
                    var data = this._datasource[index];
                    var txt = getChildByName(box, "txt_name");
                    txt.text = gamelib.core.getPlayerData(data.id).m_name_ex;
                    var img1 = getChildByName(box, "img_1"); //同意
                    var img2 = getChildByName(box, "img_2");
                    switch (data.status) //0 投票中 1 解散 2 继续
                     {
                        case 0:
                            img1.visible = img2.visible = false;
                            break;
                        case 1:
                            img1.visible = true;
                            img2.visible = false;
                            break;
                        case 2:
                            img1.visible = false;
                            img2.visible = true;
                            break;
                    }
                };
                return VoteUi;
            }(gamelib.core.BaseUi));
            qpq.VoteUi = VoteUi;
        })(qpq = common.qpq || (common.qpq = {}));
    })(common = gamelib.common || (gamelib.common = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/10/28.
 */
var gamelib;
(function (gamelib) {
    var record;
    (function (record) {
        /**
         * 录音播放控件
         */
        var RecordPlay = /** @class */ (function (_super) {
            __extends(RecordPlay, _super);
            function RecordPlay() {
                var _this = _super.call(this) || this;
                _this._size_head_width = 50;
                _this._size_head_height = 50;
                _this.init();
                return _this;
            }
            RecordPlay.prototype.setData = function (obj) {
                this._sound_url = obj.url;
                var head_url = obj.head_url;
                this._name.text = utils.StringUtility.getNameEx(obj.name);
                this._name.y = (this._size_head_height - this._name.height) * 0.5;
                console.log("播放声音文件" + this._size_head_width + "  " + this._size_head_height);
                this._head.graphics.clear();
                this._head.loadImage(head_url);
                var _length = obj.totalLength;
                if (isNaN(_length))
                    _length = 12000;
                g_signal.dispatch('play_audio');
                if (this._canPlay) {
                    console.log("播放声音文件1" + head_url);
                    if (obj.type == "weixin_audio") {
                        console.log("播放声音文件2");
                        if (window["application_weixin_audio_play"]) {
                            console.log("播放声音文件3");
                            window["application_weixin_audio_play"](this._sound_url, this.onSoundPlayEnd, this);
                            this._clip.autoPlay = true;
                        }
                    }
                    else {
                        console.log("开始加载声音文件");
                        this.playSound(this._sound_url);
                    }
                }
                Laya.timer.once(_length, this, this.onSoundPlayEnd);
                Laya.stage.addChild(this);
            };
            RecordPlay.prototype.stop = function () {
                if (this._playing_sound)
                    this._playing_sound.stop();
            };
            RecordPlay.prototype.isPlaying = function () {
                return this._playing_sound != null;
            };
            /**
             * 声音播放完成
             * @param evt
             */
            RecordPlay.prototype.onSoundPlayEnd = function () {
                console.log("playEnd............");
                Laya.timer.clearAll(this);
                this.removeSelf();
                this.stop();
                this._playing_sound = null;
                g_signal.dispatch("record_playEnd");
            };
            RecordPlay.prototype.init = function () {
                this._canPlay = true;
                var tw = 206;
                var th = this._size_head_height;
                this._bg = new laya.display.Sprite();
                this._bg.graphics.drawRect(0, 0, tw, th, "0x000000");
                this._bg.alpha = 0.6;
                this.addChild(this._bg);
                this._head = new laya.display.Sprite();
                this._head.width = this._size_head_width;
                this._head.height = this._size_head_height;
                this.addChild(this._head);
                this._head.mouseEnabled = false;
                this._clip = new laya.ui.Clip();
                this._clip.skin = "qpq/chat/clip_laba.png";
                this._clip.clipX = 1;
                this._clip.clipY = 4;
                this.addChild(this._clip);
                this._clip.mouseEnabled = true;
                this._clip.x = this._size_head_width - this._clip.width;
                this._clip.y = this._size_head_height - this._clip.height;
                this._name = new laya.display.Text();
                this._name.fontSize = 18;
                this._name.color = "#efebe5";
                this.addChild(this._name);
                this._name.mouseEnabled = false;
                this._name.x = this._size_head_width;
                this.mouseEnabled = true;
                this.on(laya.events.Event.CLICK, this, this.onClickIcon);
            };
            RecordPlay.prototype.onClickIcon = function (evt) {
                this._canPlay = !this._canPlay;
                if (!this._canPlay) {
                    this.stopClip();
                    this._clip.index = 3;
                    if (this._playing_sound) {
                        this._playing_sound.pause();
                        this.timer.once(1000, this, this.onSoundPlayEnd);
                    }
                }
                else {
                    this.timer.clear(this, this.onSoundPlayEnd);
                    if (this._playing_sound) {
                        this._playing_sound.resume();
                    }
                    else {
                        this.playSound(this._sound_url);
                    }
                }
            };
            RecordPlay.prototype.playSound = function (url) {
                if (utils.tools.isAndroid()) {
                    url = url.replace('.mp3', '.ogg');
                }
                try {
                    this._playing_sound = laya.media.SoundManager.playSound(url, 1, Laya.Handler.create(this, this.onSoundPlayEnd));
                    this.playClip();
                }
                catch (e) {
                    this.onSoundPlayEnd();
                }
            };
            RecordPlay.prototype.playClip = function () {
                var index = this._clip.index;
                if (index >= this._clip.clipY - 2) {
                    index = 0;
                }
                else {
                    index++;
                }
                this._clip.index = index;
                Laya.timer.once(300, this, this.playClip);
            };
            RecordPlay.prototype.stopClip = function () {
                this._clip.index = 0;
                Laya.timer.clear(this, this.playClip);
            };
            return RecordPlay;
        }(laya.display.Sprite));
        record.RecordPlay = RecordPlay;
    })(record = gamelib.record || (gamelib.record = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/10/27.
 *
 */
var gamelib;
(function (gamelib) {
    var chat;
    (function (chat) {
        /**
         * 语言系统
         * @class RecordSystem
         */
        var RecordSystem = /** @class */ (function () {
            function RecordSystem() {
                this._bVolume_record = false;
                this._bVolume_play = false;
                this._record_list = [];
                g_signal.add(this.onSignal, this);
                if (GameVar.g_platformData['recordPlayPos']) {
                    this._pos = {
                        pos_play: {
                            x: GameVar.g_platformData['recordPlayPos'].x,
                            y: GameVar.g_platformData['recordPlayPos'].y
                        }
                    };
                }
                else {
                    this._pos = {
                        pos_play: {
                            x: 1100,
                            y: 650
                        }
                    };
                }
            }
            Object.defineProperty(RecordSystem, "s_instance", {
                get: function () {
                    if (RecordSystem._instance == null)
                        RecordSystem._instance = new RecordSystem();
                    return RecordSystem._instance;
                },
                enumerable: true,
                configurable: true
            });
            RecordSystem.prototype.destroy = function () {
                if (this._recordView)
                    this._recordView.destroy();
                if (this._playingView)
                    this._playingView.destroy();
                this._recordView = null;
                this._playingView = null;
                if (this._enterBtn) {
                    this._enterBtn.off(laya.events.Event.MOUSE_DOWN, this, this.onBeginTalk);
                }
            };
            RecordSystem.prototype.setEnterBtn = function (btn) {
                this._enterBtn = btn;
                this._enterBtn.on(laya.events.Event.MOUSE_DOWN, this, this.onBeginTalk);
                var temp = GameVar.g_platformData['speek'];
                // var mode:number = GameVar.circleData.info['pay_mode'];
                if (temp == null || temp === false || GameVar.circleData.isGoldScoreModle() || GameVar.circleData.isMatch()) {
                    this._enterBtn.visible = false;
                }
            };
            RecordSystem.prototype.initEnterBtn = function () {
                if (this._enterBtn == null)
                    return;
                var temp = GameVar.g_platformData['speek'];
                if (GameVar.circleData.info == null || GameVar.circleData.info['extra_data'] == null)
                    return;
                var mode = GameVar.circleData.info['extra_data']['pay_mode'];
                if (temp == null || temp === false || temp[mode] === false) {
                    this._enterBtn.visible = false;
                }
            };
            RecordSystem.prototype.setPlayPos = function (x, y) {
                if (this._playingView) {
                    this._playingView.x = x;
                    this._playingView.y = y;
                }
                else {
                    this._pos.pos_play.x = x;
                    this._pos.pos_play.y = y;
                }
            };
            RecordSystem.prototype.onSignal = function (msg, obj) {
                switch (msg) {
                    case "initCircleData":
                        this.initEnterBtn();
                        break;
                    case "start_record": //开始录音                   
                        g_soundMgr.volume_small();
                        this._bVolume_record = true;
                        break;
                    case "stop_record": //结束录音
                        this._bVolume_record = false;
                        if (!this._bVolume_play)
                            g_soundMgr.volume_normal();
                        break;
                    case "play_audio": //开始播放
                        g_soundMgr.volume_small();
                        this._bVolume_play = true;
                        break;
                    case "get_record":
                        this._record_list.push(obj);
                        this.checkPlay();
                        break;
                    case "record_playEnd": //播放结束
                        this._bVolume_play = false;
                        if (!this._bVolume_record)
                            g_soundMgr.volume_normal();
                        this.checkPlay();
                        break;
                }
            };
            RecordSystem.prototype.checkPlay = function () {
                console.log("checkPlay:++++++++++++++" + (this._playingView != null && this._playingView.isPlaying()));
                if (this._record_list.length == 0 || (this._playingView != null && this._playingView.isPlaying()))
                    return;
                var temp = this._record_list.shift();
                if (temp == null)
                    return;
                if (this._playingView == null) {
                    this._playingView = new gamelib.record.RecordPlay();
                    this._playingView.x = this._pos.pos_play.x;
                    this._playingView.y = this._pos.pos_play.y;
                }
                this._playingView.setData(JSON.parse(temp.json_str));
            };
            RecordSystem.prototype.onBeginTalk = function (evt) {
                this._downTime = Laya.timer.currTimer;
                Laya.timer.once(500, this, this.startRecord);
            };
            RecordSystem.prototype.onEndTalk = function (evt) {
                Laya.timer.clear(this, this.startRecord);
                Laya.stage.off(laya.events.Event.MOUSE_UP, this, this.onEndTalk);
                var temp = Laya.timer.currTimer - this._downTime;
                if (temp > 200) {
                    this.stopRecord();
                }
                evt.stopPropagation();
            };
            RecordSystem.prototype.startRecord = function () {
                Laya.stage.on(laya.events.Event.MOUSE_UP, this, this.onEndTalk);
                this._recordView = this._recordView || new gamelib.record.RecordingUi();
                this._recordView.show();
            };
            RecordSystem.prototype.stopRecord = function () {
                if (this._recordView != null) {
                    this._recordView.close();
                }
            };
            return RecordSystem;
        }());
        chat.RecordSystem = RecordSystem;
    })(chat = gamelib.chat || (gamelib.chat = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2016/10/27.
 *
 */
var gamelib;
(function (gamelib) {
    var record;
    (function (record) {
        /**
         * 录音控件
         */
        var RecordingUi = /** @class */ (function (_super) {
            __extends(RecordingUi, _super);
            function RecordingUi() {
                var _this = _super.call(this) || this;
                _this._time = 0; //当前录音长度
                _this._bmp = new Laya.Sprite();
                _this.addChild(_this._bmp);
                _this.loadImage("qpq/chat/record_1.png");
                _this._bmp.loadImage("qpq/chat/record_2.png");
                _this._txt = new Laya.Text();
                _this._txt.color = "#FFFFFF";
                _this._txt.fontSize = 92;
                _this._txt.text = "00:00:00";
                _this._txt.y = 334;
                _this._txt.x = (_this.width - _this._txt.width) * 0.5;
                _this.addChild(_this._txt);
                _this._totalTime = 60;
                _this.zOrder = 1;
                return _this;
            }
            Object.defineProperty(RecordingUi.prototype, "totalTime", {
                set: function (value) {
                    this._totalTime = value;
                },
                enumerable: true,
                configurable: true
            });
            RecordingUi.prototype.show = function () {
                Laya.stage.addChild(this);
                this._bmp.pivotX = this._bmp.width / 2;
                this._bmp.pivotY = this._bmp.height / 2;
                this._bmp.x = 223;
                this._bmp.y = 183;
                var stageW = Laya.stage.width;
                var stageH = Laya.stage.height;
                this.x = (stageW - this.width) * 0.5;
                this.y = (stageH - this.height) * 0.5;
                this._bmp.rotation = 0;
                this.frameLoop(1, this, this.onUpdate);
                this.timerLoop(1000, this, this.onTimer);
                var fun = gamelib.Api.getFunction("audio_start_record");
                console.log("开始录音!!!audio_start_record");
                this._starRecordTime = this.timer.currTimer;
                fun("", this.recordEnd, this);
                if (gamelib.data.UserInfo.s_self.gameVipLevel == 0)
                    this._totalTime = 5;
                else
                    this._totalTime = 10 * gamelib.data.UserInfo.s_self.gameVipLevel;
                //棋牌圈的长度
                if (utils.tools.isQpq())
                    this._totalTime = 12;
                this._time = this._totalTime;
                this.onTimer();
                g_signal.dispatch("start_record");
            };
            RecordingUi.prototype.close = function () {
                this.removeSelf();
                this.clearTimer(this, this.onUpdate);
                this.clearTimer(this, this.onTimer);
                gamelib.Api.getFunction("audio_stop_record")();
                g_signal.dispatch("stop_record");
                console.log("结束录音!!!audio_stop_record");
            };
            RecordingUi.prototype.onUpdate = function () {
                this._bmp.rotation += 1;
            };
            RecordingUi.prototype.checkTime = function () {
                this._length = this.timer.currTimer - this._starRecordTime;
                if (this._length < 1000) {
                    return false;
                }
                return true;
            };
            /**
             * 录音录制完成,上传服务器
             * @param obj
             */
            RecordingUi.prototype.recordEnd = function (obj) {
                console.log("录音录制完成" + obj);
                if (obj == null)
                    return;
                if (!this.checkTime()) {
                    console.log("太短了，不播放");
                    g_uiMgr.showTip("语言太短了!", true, 1);
                    gamelib.Api.getFunction("audio_remove")(obj.data);
                    return;
                }
                console.log(obj.msg + " " + JSON.stringify(obj.data));
                console.log("开始上传");
                var params = {
                    pid: GameVar.pid + "",
                    gz_id: GameVar.gz_id + "",
                    gameid: GameVar.s_game_id + "",
                    file: obj.data,
                    callback: this.uploaderComplete,
                    thisobj: this
                };
                gamelib.Api.getFunction("file_upload")(params);
            };
            /**
             * 录音上传完成.需要发送协议
             * @param data
             */
            RecordingUi.prototype.uploaderComplete = function (obj) {
                console.log("上传完成" + JSON.stringify(obj));
                if (obj.result == 0) {
                    //上传成功
                    var url = obj.data.url;
                    var temp = {};
                    temp.url = url;
                    temp.name = GameVar.nickName;
                    temp.head_url = GameVar.playerHeadUrl;
                    temp.send_pid = GameVar.pid;
                    temp.type = obj.data.type;
                    temp.totalLength = this._length;
                    sendNetMsg(0x0094, 1, 0, JSON.stringify(temp));
                    url = gamelib.Api.getAtt("g_audio_record_over_url");
                    //Api.getFunction("audio_play_start")(url);
                    gamelib.Api.getFunction("audio_remove")(url);
                }
            };
            RecordingUi.prototype.onTimer = function () {
                var m = Math.floor(this._time / 60);
                var str = "00:";
                if (m >= 10)
                    str += m + "";
                else
                    str += "0" + m;
                var scend = this._time % 60;
                if (scend >= 10)
                    str += ":" + scend;
                else
                    str += ":0" + scend;
                this._txt.text = str;
                if (this._time <= 0) {
                    //时间到
                    this.close();
                    return;
                }
                this._time--;
            };
            return RecordingUi;
        }(laya.display.Sprite));
        record.RecordingUi = RecordingUi;
    })(record = gamelib.record || (gamelib.record = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var socket;
    (function (socket) {
        var BinaryPacket = /** @class */ (function (_super) {
            __extends(BinaryPacket, _super);
            /**
             * @param messageId 消息id。
             * @param size 消息大小。
             */
            function BinaryPacket(messageId, data) {
                if (messageId === void 0) { messageId = 0; }
                var _this = _super.call(this, data) || this;
                _this._msgId = 0;
                _this._size = 0;
                _this.endian = laya.utils.Byte.LITTLE_ENDIAN;
                _this._msgId = messageId;
                return _this;
            }
            Object.defineProperty(BinaryPacket.prototype, "messageId", {
                /**
                 * 消息id。
                 */
                get: function () {
                    return this._msgId;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 将报文体操作指针设置到到0。下一次调用读取方法时将在0位置开始读取，或者下一次调用写入方法时将在0位置开始写入。
             */
            BinaryPacket.prototype.reset = function () {
                this.pos = 0;
            };
            BinaryPacket.prototype.GetArrayBuffer = function () {
                return this.buffer;
            };
            return BinaryPacket;
        }(laya.utils.Byte));
        socket.BinaryPacket = BinaryPacket;
    })(socket = gamelib.socket || (gamelib.socket = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var socket;
    (function (socket) {
        /**
         * @class
         * _socket.readyState
         * CONNECTING(数值为0)：表示正在连接
         * OPEN(数字值为1)：表示已建立连接
         * CLOSING(数字值为2)：表示正在关闭
         * CLOSED(数字值为3)：表示已经关闭
         *
         */
        var NetSocket = /** @class */ (function (_super) {
            __extends(NetSocket, _super);
            /**
             *
             * @param protocols 协议配置文件
             * @param protocols_common  公共协议配置文件
             * @constructor
             */
            function NetSocket(protocols1, protocols_common, isXML) {
                var _this = _super.call(this) || this;
                _this.package_end_str = "\r\n\r\n";
                _this.package_str_buff = "";
                _this._cacheList = {};
                _this._bLogin = false;
                _this._cmd = 0;
                _this._length = 0;
                _this._tempPacket = new socket.BinaryPacket();
                _this._socket = null;
                if (isXML)
                    _this._pro = new socket.Protocols();
                else
                    _this._pro = new socket.Protocols_Json();
                _this._pro.init(protocols_common, protocols1);
                _this.m_name = "";
                return _this;
            }
            NetSocket.prototype.destroy = function () {
                this._pro.destroy();
                this.disconnect();
                this._pro = null;
                this._socket = null;
            };
            /**
             * 连接指定服务器
             * @param {string}[ip = gamelib.data.GameVar.serverIp]
             * @param {any} [port = gamelib.data.GameVar.serverPort]
             */
            NetSocket.prototype.connectServer = function (url) {
                if (this._socket != null && !this._socket.connected)
                    return;
                try {
                    //var url = type + "://" + ip + ":" + port;
                    this._socket = new laya.net.Socket();
                    this.addListeners();
                    this._socket.connectByUrl(url);
                    this._input = this._socket.input;
                    this._output = this._socket.output;
                    console.log(this.m_name + "连接服务器:" + url);
                }
                catch (e) {
                    console.log("连接失败!" + e);
                    this.event(NetSocket.SOCKET_SERVER_ERROR);
                }
            };
            NetSocket.prototype.addListeners = function () {
                this._socket.on(Laya.Event.OPEN, this, this.onOpen);
                this._socket.on(Laya.Event.CLOSE, this, this.onClose);
                this._socket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
                this._socket.on(Laya.Event.ERROR, this, this.onError);
            };
            NetSocket.prototype.removeListeners = function () {
                this._socket.off(Laya.Event.OPEN, this, this.onOpen);
                this._socket.off(Laya.Event.CLOSE, this, this.onClose);
                this._socket.off(Laya.Event.MESSAGE, this, this.onReceiveMessage);
                this._socket.off(Laya.Event.ERROR, this, this.onError);
            };
            /**
             * 断开与服务器的连接
             */
            NetSocket.prototype.disconnect = function () {
                if (this._socket == null)
                    return;
                this.removeListeners();
                if (this.getConnected() == false) {
                    this._socket = null;
                    return;
                }
                this._socket.close();
                this._socket = null;
            };
            /**
             * 当前是否处于连接状态
             * @returns {boolean}
             */
            NetSocket.prototype.getConnected = function () {
                return this._socket && this._socket.connected;
            };
            //发送消息
            NetSocket.prototype.send = function (packet) {
                var temp = new socket.BinaryPacket(packet.messageId);
                temp.writeInt16(packet.messageId);
                temp.writeInt16(packet.length + 4);
                if (packet.length > 0)
                    temp.writeArrayBuffer(packet.GetArrayBuffer(), 0, packet.length);
                if (NetSocket.SOCKET_TYPE == "string") {
                    var str = utils.Base64.fromArrayBuffer(temp.GetArrayBuffer()) + this.package_end_str;
                    // 发送字符串
                    this._socket.send(str);
                }
                else {
                    this._socket.send(temp.GetArrayBuffer());
                }
                //console.log(str);
                // 使用output.writeByte发送
                //for(var i:number = 0; i < str.length; i++)
                //{
                //    this._output.writeByte(str.charCodeAt(i));
                //}
                this._socket.flush();
            };
            NetSocket.prototype.sendDataById = function (msgId, content) {
                if (!this.getConnected())
                    return;
                content.id = msgId;
                this.send(this._pro.packetClientData(content, this.m_name));
            };
            /**
             * 发送协议
             * @param msgId
             * @param content
             */
            NetSocket.prototype.sendDataByArgs = function (msgId, args) {
                if (!this.getConnected()) {
                    return;
                }
                if (this.checkCanSend(msgId))
                    this.send(this._pro.packetClientArgs(msgId, args, this.m_name));
                else
                    this._cacheList[msgId] = args;
            };
            // public sendDataByMessage(message,content): void
            // {
            //     if(!this.getConnected())
            //         return;
            //     content.message = message;
            //     this.send(this._pro.packetClientData(content,this.m_name));
            // }
            // public sendMsgToServer(message): void
            // {
            //     if(!this.getConnected())
            //         return;            
            //     this._socket.send(message);
            //     this._socket.flush();
            // }
            /**
             * 登录成功了，。登录成功前，除开0x0003,0x00C2,0x0001外，其他的协议都不能发送.需要缓存起。
             * 在登录成功后再发送
             * @function
             * @DateTime 2019-06-29T15:46:32+0800
             */
            NetSocket.prototype.onLoginSuccess = function () {
                this._bLogin = true;
                for (var key in this._cacheList) {
                    this.sendDataByArgs(parseInt(key), this._cacheList[key]);
                    delete this._cacheList[key];
                }
            };
            NetSocket.prototype.checkCanSend = function (msgId) {
                if (msgId == 0x0003 || msgId == 0x00C2 || msgId == 0x0001 || msgId == 0x0010)
                    return true;
                return this._bLogin;
            };
            NetSocket.prototype.onClose = function (e) {
                console.log(this.m_name + "连接关闭!");
                this.removeListeners();
                this.event(NetSocket.SOCKET_CLOSE);
                this._bLogin = false;
            };
            NetSocket.prototype.onOpen = function (evt) {
                console.log(this.m_name + "连接成功!");
                this.event(NetSocket.SOCKET_CONNECTD);
            };
            NetSocket.prototype.onError = function (evt) {
                console.log(this.m_name + "连接错误!");
                this.removeListeners();
                this.event(NetSocket.SOCKET_CLOSE);
                this._bLogin = false;
            };
            NetSocket.prototype.onReceiveMessage = function (message) {
                var str;
                if (typeof message == "string") {
                    this.handleStringType(message);
                    return;
                }
                else if (message instanceof ArrayBuffer) {
                    this.handleBinaryType(message);
                }
            };
            NetSocket.prototype.handleBinaryType = function (ab) {
                this._socket.input.clear();
                this._tempPacket.writeArrayBuffer(ab);
                this._tempPacket.reset();
                while (this._tempPacket.bytesAvailable > 0) {
                    // 如果没有读取头部，则读取头部
                    if (this._cmd == 0) {
                        // 如果不足4字节，则跳出
                        if (this._tempPacket.bytesAvailable < 4)
                            break;
                        this._cmd = this._tempPacket.readInt16();
                        this._length = this._tempPacket.readInt16();
                    }
                    // 如果数据不足报文体大小，则跳出
                    if ((this._length - 4) > this._tempPacket.bytesAvailable)
                        break;
                    var msg;
                    // 如果只有报文头部，则发送
                    if (this._length == 4) {
                        msg = new socket.BinaryPacket(this._cmd);
                    }
                    else {
                        // 读取报文体
                        var arr = this._tempPacket.readArrayBuffer(this._length - 4);
                        msg = new socket.BinaryPacket(this._cmd);
                        msg.writeUint16(this._cmd);
                        msg.writeUint16(this._length);
                        msg.writeArrayBuffer(arr);
                        msg.reset();
                    }
                    this._cmd = 0;
                    this._length = 0;
                    var data = this._pro.unpacketServerData(msg, this.m_name);
                    if (data == null)
                        continue;
                    this.event(NetSocket.SOCKET_GETMSG, data);
                }
                if (this._tempPacket.bytesAvailable == 0)
                    this._tempPacket.clear();
            };
            NetSocket.prototype.handleStringType = function (str) {
                this._socket.input.clear();
                //console.log(this + "收到服务器消息了!" + str);
                this.package_str_buff += str;
                var index = -1;
                do {
                    index = this.package_str_buff.indexOf(this.package_end_str);
                    if (index != -1) {
                        str = this.package_str_buff.slice(0, index + this.package_str_buff.length);
                        this.package_str_buff = this.package_str_buff.slice(index + this.package_str_buff.length);
                        str = str.slice(0, str.length - 4);
                        var buffer = utils.Base64.toArrayBuffer(str);
                        var temp = new socket.BinaryPacket(0, buffer);
                        var data = this._pro.unpacketServerData(temp, this.m_name);
                        if (data == null)
                            continue;
                        this.event(NetSocket.SOCKET_GETMSG, data);
                    }
                } while (index != -1);
            };
            NetSocket.SOCKET_CLOSE = 'socket closed';
            NetSocket.SOCKET_CONNECTD = 'socket connectd';
            NetSocket.SOCKET_GETMSG = 'socket getmsg';
            NetSocket.SOCKET_SERVER_ERROR = "socket_server_error";
            NetSocket.SOCKET_TYPE = "string";
            return NetSocket;
        }(laya.events.EventDispatcher));
        socket.NetSocket = NetSocket;
    })(socket = gamelib.socket || (gamelib.socket = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var socket;
    (function (socket) {
        /**
         * @class Protocols
         * 协议文件
         */
        var Protocols = /** @class */ (function () {
            function Protocols() {
            }
            Protocols.prototype.init = function (root1, root2) {
                this.messageToId = {};
                this.idToMessage = {};
                this.formClientList = {};
                this.formServerList = {};
                this.debugList = {};
                if (root1.children)
                    this.parseRoot(root1);
                else
                    this.parseRoot1(root1);
                if (root2.children)
                    this.parseRoot(root2);
                else
                    this.parseRoot1(root2);
            };
            Protocols.prototype.destroy = function () {
                this.messageToId = null;
                this.idToMessage = null;
                this.formClientList = null;
                this.formServerList = null;
                this.debugList = null;
            };
            Protocols.prototype.parseRoot1 = function (root) {
                var info = root.ownerDocument.childNodes[1];
                var length = info.childNodes.length;
                for (var i = 0; i < length; i++) {
                    var item = info.childNodes[i];
                    if (item.childNodes == null)
                        continue;
                    var id = parseInt(item.getAttribute("id"));
                    var message = item.getAttribute("name");
                    this.idToMessage[id] = message;
                    this.messageToId[message] = id;
                    this.debugList[id] = 0;
                    for (var j = 0; j < item.childNodes.length; j++) {
                        var node = item.childNodes[j];
                        node.children = node.childNodes;
                        if (node.nodeName == "client") {
                            this.formClientList[id] = this.getNodeList(node);
                            this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0 : 0x1);
                        }
                        else {
                            this.formServerList[id] = this.getNodeList(node);
                            this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0 : 0x10);
                        }
                    }
                }
            };
            Protocols.prototype.parseRoot = function (root) {
                if (root == null)
                    return;
                //全局默认是否打印调试信息
                var length = root.children.length;
                for (var i = 0; i < length; i++) {
                    var proXmlNode = root.children[i];
                    var id = parseInt(proXmlNode.getAttribute("id"));
                    var message = proXmlNode.getAttribute("name");
                    this.idToMessage[id] = message;
                    this.messageToId[message] = id;
                    this.debugList[id] = 0;
                    for (var j = 0; j < proXmlNode.children.length; j++) {
                        var node = proXmlNode.children[j];
                        if (node.nodeName == "#comment")
                            continue;
                        if (node.nodeName == "client") {
                            this.formClientList[id] = this.getNodeList(node);
                            this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0 : 0x1);
                        }
                        else {
                            this.formServerList[id] = this.getNodeList(node);
                            this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0 : 0x10);
                        }
                    }
                }
            };
            Protocols.prototype.getNodeList = function (node) {
                var typeAry = [];
                var nameAry = [];
                var length = node.children ? node.children.length : 0;
                for (var i = 0; i < length; i++) {
                    var b = node.children[i];
                    if (b.nodeName == "loop") {
                        if (b.childNodes != null)
                            b.children = b.childNodes;
                        var o = this.getNodeList(b);
                        typeAry.push(o["typeAry"]);
                        nameAry.push(o["nameAry"]);
                    }
                    else if (b.nodeName == "#comment") {
                        continue;
                    }
                    else {
                        typeAry.push(b.nodeName);
                        nameAry.push(b.textContent);
                    }
                }
                return { "typeAry": typeAry, "nameAry": nameAry };
            };
            /**
             * 判断协议是否需要debug
             * @param packageId 协议号
             * @param type		1：client，2：sever
             *
             */
            Protocols.prototype.packageNeedDebug = function (packageId, type) {
                if (type === void 0) { type = 0; }
                //			var id:String = MathUtility.toHexString(packageId,4);
                if (this.debugList[packageId] == undefined)
                    return false;
                if (type == 1)
                    return (this.debugList[packageId] & 0x1);
                else if (type == 2)
                    return (this.debugList[packageId] & 0x10);
                return false;
            };
            /**
             * 打包客户端数据
             * @function
             * @DateTime 2018-03-17T15:47:23+0800
             * @param    {number}                 msgId [协议号]
             * @param    {Array<any>}             args  [该协议需要发送的参数列表]
             * @param    {string}                 name  [当前socke名]
             * @return   {socket.BinaryPacket}          [description]
             */
            Protocols.prototype.packetClientArgs = function (msgId, args, name) {
                var id = msgId;
                var typeArr = this.formClientList[id]["typeAry"];
                var nameArr = this.formClientList[id]["nameAry"];
                if (args.length != typeArr.length)
                    throw new Error("参数数量不对！" + utils.MathUtility.toHexString(id, 4));
                name = name || "";
                if (this.packageNeedDebug(msgId, 1)) {
                    console.log(name + "↑:" + utils.MathUtility.toHexString(id, 4) + this.idToMessage[id] + "	" + JSON.stringify(args));
                    // logStr += (name + "↑:"+ utils.MathUtility.toHexString(id,4) +this.idToMessage[id]+"	"+ JSON.stringify(args) + "\n");
                }
                var packet = new socket.BinaryPacket(msgId);
                this.writeArgs(packet, typeArr, nameArr, args);
                return packet;
            };
            /**
             *打包客户端数据
             * {id:0x33,message:"下注",content:{...}}
             */
            Protocols.prototype.packetClientData = function (data, name) {
                name = name || "";
                if (data.id) {
                    //				id = MathUtility.toHexString(data.id,4);
                }
                else if (data.message) {
                    data.id = this.messageToId[data.message];
                }
                else {
                    throw new Error("至少定义一个id 或 message");
                }
                if (this.packageNeedDebug(data.id, 1)) {
                    console.log(name + "↑:" + utils.MathUtility.toHexString(data.id, 4) + this.idToMessage[data.id] + "	" + JSON.stringify(data.content));
                    // logStr += (name + "↑:"+utils.MathUtility.toHexString(data.id,4) + this.idToMessage[data.id]+"	"+ JSON.stringify(data.content) + "\n");
                }
                var packet = new socket.BinaryPacket(data.id);
                this.write(packet, this.formClientList[data.id]["typeAry"], this.formClientList[data.id]["nameAry"], data.content);
                return packet;
            };
            /**
             *解包服务器数据 生成形如:{id:0x33,message:"下注",content:{...}}
             * type:  false.多维数组格式 true.循环嵌套格式
             */
            Protocols.prototype.unpacketServerData = function (packet, name) {
                name = name || "";
                var id = packet.getInt16();
                var len = packet.getInt16();
                if (this.idToMessage[id] == null) {
                    console.log(name + " 截获了一个未定义报文：id=" + utils.MathUtility.toHexString(id, 4));
                    // logStr += (name + " 截获了一个未定义报文：id="+ utils.MathUtility.toHexString(id,4) + "\n");
                    return null;
                }
                var id_msg = utils.MathUtility.toHexString(id, 4);
                try {
                    //按循环结构取出数据
                    var temp = {};
                    var obj = this.read(packet, this.formServerList[id]["typeAry"], this.formServerList[id]["nameAry"], temp);
                }
                catch (e) {
                    console.log(name + " 读取报文错误！" + id_msg + this.idToMessage[id] + "" + e.message + "  " + temp.name);
                    // logStr += (name + " 读取报文错误！" + id_msg + this.idToMessage[id]+""+e.message +"  " + temp.name + "\n");
                }
                if (this.packageNeedDebug(id, 2)) {
                    var msg = "↓:" + id_msg + this.idToMessage[id] + "\t" + JSON.stringify(obj);
                    var tmsg = "";
                    var len = Math.ceil(msg.length / 130);
                    for (var i = 0; i < len; i++) {
                        tmsg += msg.slice(i * 130, (i + 1) * 130);
                        if (i != len - 1)
                            tmsg += "\n";
                    }
                    console.log(name + tmsg);
                    // logStr += (name + tmsg + "\n");
                }
                return { "content": obj, "msgId": id, "message": this.idToMessage[id] };
            };
            Protocols.prototype.read = function (packet, typeAry, NameAry, debugObj) {
                var obj = {};
                var data;
                for (var flag = 0; flag < typeAry.length; flag++) {
                    debugObj.name = NameAry[flag];
                    if (typeAry[flag] instanceof Array) {
                        obj[NameAry[flag - 1]] = new Array(obj[NameAry[flag - 1]]);
                        for (var i = 0; i < obj[NameAry[flag - 1]].length; i++) {
                            obj[NameAry[flag - 1]][i] = this.read(packet, typeAry[flag], NameAry[flag], debugObj);
                        }
                        continue;
                    }
                    switch (typeAry[flag]) {
                        case "ubyte": {
                            data = packet.getUint8();
                            break;
                        }
                        case "byte": {
                            data = packet.readByte();
                            break;
                        }
                        case "str": {
                            data = packet.readUTFBytes(packet.getUint8());
                            break;
                        }
                        case "lstr": {
                            data = packet.readUTFBytes(packet.getUint16());
                            break;
                        }
                        case "short": {
                            data = packet.getInt16();
                            break;
                        }
                        case "ushort": {
                            data = packet.getUint16();
                            break;
                        }
                        case "int": {
                            data = packet.getInt32();
                            break;
                        }
                        case "uint": {
                            data = packet.getUint32();
                            break;
                        }
                        case "float":
                            {
                                data = packet.getFloat32();
                                break;
                            }
                        case "double":
                            {
                                data = packet.getFloat64();
                                break;
                            }
                        default: {
                            throw new Error("unknown packet type to read:" + typeAry[flag]);
                            //break;
                        }
                    }
                    obj[NameAry[flag]] = data;
                }
                return obj;
            };
            Protocols.prototype.write = function (packet, typeAry, nameAry, content) {
                for (var flag = 0; flag < typeAry.length; flag++) {
                    if (typeAry[flag] instanceof Array) {
                        var length = content[nameAry[flag - 1]].length;
                        for (var i = 0; i < length; i++) {
                            var it = content[nameAry[flag - 1]][i];
                            this.write(packet, typeAry[flag], nameAry[flag], it);
                        }
                        continue;
                    }
                    var value = content[nameAry[flag]];
                    if (value instanceof Array) {
                        value = value.length;
                    }
                    switch (typeAry[flag]) {
                        case "byte": {
                            packet.writeByte(value);
                            break;
                        }
                        case "ubyte": {
                            packet.writeByte(value);
                            break;
                        }
                        case "ushort": {
                            packet.writeUint16(value);
                            break;
                        }
                        case "short": {
                            packet.writeInt16(value);
                            break;
                        }
                        case "uint": {
                            packet.writeUint32(value);
                            break;
                        }
                        case "int": {
                            packet.writeInt32(value);
                            break;
                        }
                        case "str": {
                            packet.writeUint8(utils.MathUtility.UTFLen(value));
                            packet.writeUTFBytes(value);
                            break;
                        }
                        case "lstr": {
                            packet.writeUint16(utils.MathUtility.UTFLen(value));
                            packet.writeUTFBytes(value);
                            break;
                        }
                        case "float": {
                            packet.writeFloat32(value);
                            break;
                        }
                        case "double":
                            packet.writeFloat64(value);
                            break;
                        default: {
                            throw new Error("unknown packet type to read:" + typeAry[flag]);
                            //	break;
                        }
                    }
                }
            };
            Protocols.prototype.writeArgs = function (packet, typeAry, nameAry, args) {
                for (var i = 0; i < typeAry.length; i++) {
                    if (typeAry[i] instanceof Array) {
                        var temp = args[i];
                        for (var j = 0; j < temp.length; j++) {
                            this.writeArgs(packet, typeAry[i], nameAry[i], temp[j]);
                        }
                        continue;
                    }
                    var value = args[i];
                    switch (typeAry[i]) {
                        case "byte": {
                            packet.writeByte(value);
                            break;
                        }
                        case "ubyte": {
                            packet.writeByte(value);
                            break;
                        }
                        case "ushort": {
                            packet.writeUint16(value);
                            break;
                        }
                        case "short": {
                            packet.writeInt16(value);
                            break;
                        }
                        case "uint": {
                            packet.writeUint32(value);
                            break;
                        }
                        case "int": {
                            packet.writeInt32(value);
                            break;
                        }
                        case "str": {
                            packet.writeUint8(utils.MathUtility.UTFLen(value));
                            packet.writeUTFBytes(value);
                            break;
                        }
                        case "lstr": {
                            packet.writeUint16(utils.MathUtility.UTFLen(value));
                            packet.writeUTFBytes(value);
                            break;
                        }
                        case "float": {
                            packet.writeFloat32(value);
                            break;
                        }
                        case "double":
                            packet.writeFloat64(value);
                            break;
                        default: {
                            throw new Error("unknown packet type to read:" + typeAry[i]);
                            //break;
                        }
                    }
                }
            };
            return Protocols;
        }());
        socket.Protocols = Protocols;
    })(socket = gamelib.socket || (gamelib.socket = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var socket;
    (function (socket) {
        /**
         * @class Protocols 数据源是json格式
         * 协议文件
         */
        var Protocols_Json = /** @class */ (function (_super) {
            __extends(Protocols_Json, _super);
            function Protocols_Json() {
                return _super.call(this) || this;
            }
            Protocols_Json.prototype.parseRoot = function (root) {
                if (root == null)
                    return;
                //全局默认是否打印调试信息
                var length = root.length;
                for (var i = 0; i < length; i++) {
                    var item = root[i];
                    var id = parseInt(item.id);
                    var message = item.name;
                    this.idToMessage[id] = message;
                    this.messageToId[message] = id;
                    this.debugList[id] = 0;
                    var node = item.client;
                    if (node) {
                        this.formClientList[id] = this.parseNode(node);
                        this.debugList[id] |= (parseInt(item.client_debug) == 0 ? 0 : 0x1);
                    }
                    node = item.server;
                    if (node) {
                        this.formServerList[id] = this.parseNode(node);
                        this.debugList[id] |= (parseInt(item.server_debug) == 0 ? 0 : 0x10);
                    }
                }
            };
            Protocols_Json.prototype.parseNode = function (node) {
                var typeAry = [];
                var nameAry = [];
                var length = node.length;
                for (var i = 0; i < length; i++) {
                    var b = node[i];
                    if (b.type == "loop") {
                        var o = this.parseNode(b.list);
                        typeAry.push(o["typeAry"]);
                        nameAry.push(o["nameAry"]);
                    }
                    else {
                        typeAry.push(b.type);
                        nameAry.push(b.name);
                    }
                }
                return { "typeAry": typeAry, "nameAry": nameAry };
            };
            return Protocols_Json;
        }(socket.Protocols));
        socket.Protocols_Json = Protocols_Json;
    })(socket = gamelib.socket || (gamelib.socket = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var socket;
    (function (socket) {
        var SocketEvent = /** @class */ (function (_super) {
            __extends(SocketEvent, _super);
            function SocketEvent(type, data) {
                var _this = _super.call(this) || this;
                _this.type = type;
                _this.m_data = data;
                return _this;
            }
            return SocketEvent;
        }(laya.events.Event));
        socket.SocketEvent = SocketEvent;
    })(socket = gamelib.socket || (gamelib.socket = {}));
})(gamelib || (gamelib = {}));
/**
 * Created by wxlan on 2015/6/26.
 */
var utils;
(function (utils) {
    var Base64 = /** @class */ (function () {
        function Base64() {
        }
        Base64.base64encode = function (str) {
            var out, i, len;
            var c1, c2, c3;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += Base64.base64EncodeChars.charAt(c1 >> 2);
                    out += Base64.base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += Base64.base64EncodeChars.charAt(c1 >> 2);
                    out += Base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += Base64.base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += Base64.base64EncodeChars.charAt(c1 >> 2);
                out += Base64.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += Base64.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += Base64.base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        };
        Base64.base64decode = function (str) {
            var c1, c2, c3, c4;
            var i, len, out;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                /* c1 */
                do {
                    c1 = Base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1)
                    break;
                /* c2 */
                do {
                    c2 = Base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1)
                    break;
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                /* c3 */
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                        return out;
                    c3 = Base64.base64DecodeChars[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1)
                    break;
                out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                /* c4 */
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61)
                        return out;
                    c4 = Base64.base64DecodeChars[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1)
                    break;
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out;
        };
        Base64.utf16to8 = function (str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                }
                else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
                else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        };
        Base64.utf8to16 = function (str) {
            var out, i, len, c;
            var char2, char3;
            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        // 0xxxxxxx
                        out += str.charAt(i - 1);
                        break;
                    case 12:
                    case 13:
                        // 110x xxxx   10xx xxxx
                        char2 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0F) << 12) |
                            ((char2 & 0x3F) << 6) |
                            ((char3 & 0x3F) << 0));
                        break;
                }
            }
            return out;
        };
        Base64.CharToHex = function (str) {
            var out, i, len, c, h;
            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                h = c.toString(16);
                if (h.length < 2)
                    h = "0" + h;
                out += "\\x" + h + " ";
                if (i > 0 && i % 8 == 0)
                    out += "\r\n";
            }
            return out;
        };
        Base64.encode = function (data) {
            // Convert string to ByteArray
            var bytes = new laya.utils.Byte();
            bytes.writeUTFBytes(data);
            // Return encoded ByteArray
            return Base64.encodeByteArray(bytes);
        };
        Base64.encodeByteArray = function (data) {
            // Initialise output
            var output = "";
            // Create data and output buffers
            var dataBuffer;
            var outputBuffer = new Array(4);
            // Rewind ByteArray
            data.pos = 0;
            // while there are still bytes to be processed
            while (data.bytesAvailable > 0) {
                // Create new data buffer and populate next 3 bytes from data
                dataBuffer = new Array();
                for (var i = 0; i < 3 && data.bytesAvailable > 0; i++) {
                    dataBuffer[i] = data.getUint8();
                }
                // Convert to data buffer Base64 character positions and
                // store in output buffer
                outputBuffer[0] = (dataBuffer[0] & 0xfc) >> 2;
                outputBuffer[1] = ((dataBuffer[0] & 0x03) << 4) | ((dataBuffer[1]) >> 4);
                outputBuffer[2] = ((dataBuffer[1] & 0x0f) << 2) | ((dataBuffer[2]) >> 6);
                outputBuffer[3] = dataBuffer[2] & 0x3f;
                // If data buffer was short (i.e not 3 characters) then set
                // end character indexes in data buffer to index of '=' symbol.
                // This is necessary because Base64 data is always a multiple of
                // 4 bytes and is basses with '=' symbols.
                for (var j = dataBuffer.length; j < 3; j++) {
                    outputBuffer[j + 1] = 64;
                }
                // Loop through output buffer and add Base64 characters to
                // encoded data string for each character.
                for (var k = 0; k < outputBuffer.length; k++) {
                    output += Base64.base64String.charAt(outputBuffer[k]);
                }
            }
            // Return encoded data
            return output;
        };
        Base64.decode = function (data) {
            // Decode data to ByteArray
            var bytes = Base64.decodeToByteArray(data);
            // Convert to string and return
            return bytes.readUTFBytes(bytes.length);
        };
        Base64.decodeToByteArray = function (data) {
            // Initialise output ByteArray for decoded data
            var output = new laya.utils.Byte();
            // Create data and output buffers
            var dataBuffer = new Array(4);
            var outputBuffer = new Array(3);
            // While there are data bytes left to be processed
            for (var i = 0; i < data.length; i += 4) {
                // Populate data buffer with position of Base64 characters for
                // next 4 bytes from encoded data
                for (var j = 0; j < 4 && i + j < data.length; j++) {
                    dataBuffer[j] = Base64.base64String.indexOf(data.charAt(i + j));
                }
                // Decode data buffer back into bytes
                outputBuffer[0] = (dataBuffer[0] << 2) + ((dataBuffer[1] & 0x30) >> 4);
                outputBuffer[1] = ((dataBuffer[1] & 0x0f) << 4) + ((dataBuffer[2] & 0x3c) >> 2);
                outputBuffer[2] = ((dataBuffer[2] & 0x03) << 6) + dataBuffer[3];
                // Add all non-padded bytes in output buffer to decoded data
                for (var k = 0; k < outputBuffer.length; k++) {
                    if (dataBuffer[k + 1] == 64)
                        break;
                    output.writeByte(outputBuffer[k]);
                }
            }
            // Rewind decoded data ByteArray
            output.pos = 0;
            // Return decoded data
            return output;
        };
        Base64.fromArrayBuffer = function (arraybuffer) {
            var bytes = new Uint8Array(arraybuffer), i, len = bytes.buffer.byteLength, base64 = "";
            for (i = 0; i < len; i += 3) {
                base64 += Base64.base64String[bytes[i] >> 2];
                base64 += Base64.base64String[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += Base64.base64String[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += Base64.base64String[bytes[i + 2] & 63];
            }
            if ((len % 3) === 2) {
                base64 = base64.substring(0, base64.length - 1) + "=";
            }
            else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + "==";
            }
            return base64;
        };
        Base64.base64ToIndexNew = function (index) {
            var test = {};
            for (var i = 0; i < Base64.base64String.length; i++) {
                test[Base64.base64String[i]] = i;
            }
            return test[index];
        };
        Base64.toArrayBuffer = function (base64) {
            var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
            if (base64[base64.length - 1] === "=") {
                bufferLength--;
                if (base64[base64.length - 2] === "=") {
                    bufferLength--;
                }
            }
            var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
            for (i = 0; i < len; i += 4) {
                encoded1 = this.base64ToIndexNew(base64[i]);
                encoded2 = this.base64ToIndexNew(base64[i + 1]);
                encoded3 = this.base64ToIndexNew(base64[i + 2]);
                encoded4 = this.base64ToIndexNew(base64[i + 3]);
                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }
            return arraybuffer;
        };
        Base64.base64String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        Base64.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        Base64.base64DecodeChars = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
        return Base64;
    }());
    utils.Base64 = Base64;
})(utils || (utils = {}));
/**
 * Created by wxlan on 2016/5/5.
 */
var logStr = "";
window.onerror = function (msg, path, line) {
    gamelib.Log.error(msg);
    gamelib.Log.error("    at " + path + ":" + line);
};
/**
 * 快捷的打印消息到控制台
 * @param message {any} 要打印的数据
 */
function trace(message) {
    var msg = message;
    // if(msg instanceof egret.Rectangle)
    // {
    //     msg = "{ x=" + msg.x + ",y=" + msg.y + ",width=" + msg.width + ",height=" + msg.height + " }";
    // }
    // else if(msg instanceof egret.Point)
    // {
    //     msg = "{ x=" + msg.x + ",y=" + msg.y + " }";
    // }
    // else if(Array.isArray(msg))
    // {
    //     console.log(msg);
    //     gamelib.Log.trace(msg);
    // }
    // else if(typeof (message) == "object")
    // {
    //     try
    //     {
    //         console.log(JSON.stringify(msg));
    //         gamelib.Log.trace(msg);
    //     }
    //     catch(e)
    //     {
    //         console.log(msg);
    //         gamelib.Log.trace(msg);
    //     }
    // }
    // else
    // {
    //     console.log(msg);
    //     gamelib.Log.trace(msg);
    // }
    return msg;
}
/**
 * 快捷的抛错误消息到控制台
 * @param error {any} 要抛出的错误
 */
function error(error) {
    console.error(error);
    gamelib.Log.error(error);
    return error;
}
/**
 * 快捷的抛出警告消息到控制台
 */
function warn(warn) {
    console.warn(warn);
    gamelib.Log.warn(warn);
    return warn;
}
var gamelib;
(function (gamelib) {
    /**
     * 日志界面
     */
    var Log = /** @class */ (function (_super) {
        __extends(Log, _super);
        function Log() {
            var _this = _super.call(this) || this;
            _this._htmlText = "";
            /**
             * HtmlTextParser解析最大行数
             */
            _this.maxLength = 40;
            _this.mouseEnabled = false;
            _this.initChild();
            return _this;
        }
        Object.defineProperty(Log.prototype, "label", {
            /**
             * 日志普通文本
             */
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._label = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Log.prototype, "htmlText", {
            /**
             * 日志当前的html文本
             */
            get: function () {
                return this._htmlText;
            },
            enumerable: true,
            configurable: true
        });
        Log.prototype.initChild = function () {
            this._label = new laya.ui.Label();
            //this._label.wordWrap = true;
            this._label.bottom = 0;
            this.addChild(this._label);
        };
        Object.defineProperty(Log, "useLog", {
            get: function () {
                return this._useLog;
            },
            /**
             * 隐藏/显示日志
             */
            set: function (value) {
                this._useLog = value;
                this.init();
                if (!value && this.log.stage) {
                    this.log.parent.removeChild(this.log);
                }
                else if (value) {
                    //egret.MainContext.instance.stage.addChild(this.log);
                }
            },
            enumerable: true,
            configurable: true
        });
        Log.init = function () {
            this.log = this.log || new Log();
            if (this.log.parent) {
                this.log.parent.setChildIndex(this.log, this.log.parent.numChildren);
            }
        };
        Log.trace = function (message) {
            this.init();
            // this.log.htmlText += '<font color="#000000" size="18">' + message + '\n</font>';
        };
        Log.warn = function (message) {
            this.init();
            // this.log.htmlText += '<font  color="#ffff00" size="18">' + message + '\n</font>';
        };
        Log.error = function (message) {
            this.init();
            // this.log.htmlText += '<font  color="#ff0000" size="18">' + message + '\n</font>';
        };
        return Log;
    }(laya.display.Sprite));
    gamelib.Log = Log;
})(gamelib || (gamelib = {}));
/*
* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
* Digest Algorithm, as defined in RFC 1321.
* Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*/
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var md5 = /** @class */ (function () {
    function md5() {
        this.hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
        this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    }
    /*
     * These are the privates you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    md5.prototype.hex_md5 = function (s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
    md5.prototype.b64_md5 = function (s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
    md5.prototype.any_md5 = function (s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
    md5.prototype.hex_hmac_md5 = function (k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    md5.prototype.b64_hmac_md5 = function (k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
    md5.prototype.any_hmac_md5 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
    /*
     * Perform a simple self-test to see if the VM is working
     */
    md5.prototype.md5_vm_test = function () {
        return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    };
    /*
     * Calculate the MD5 of a raw string
     */
    md5.prototype.rstr_md5 = function (s) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    };
    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    md5.prototype.rstr_hmac_md5 = function (key, data) {
        var bkey = this.rstr2binl(key);
        if (bkey.length > 16)
            bkey = this.binl_md5(bkey, key.length * 8);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };
    /*
     * Convert a raw string to a hex string
     */
    md5.prototype.rstr2hex = function (input) {
        try {
            this.hexcase;
        }
        catch (e) {
            this.hexcase = 0;
        }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
    /*
     * Convert a raw string to a base-64 string
     */
    md5.prototype.rstr2b64 = function (input) {
        try {
            this.b64pad;
        }
        catch (e) {
            this.b64pad = '';
        }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8)
                    output += this.b64pad;
                else
                    output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    };
    /*
     * Convert a raw string to an arbitrary string encoding
     */
    md5.prototype.rstr2any = function (input, encoding) {
        var divisor = encoding.length;
        var i, j, q, x, quotient;
        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }
        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. All remainders are stored for later
         * use.
         */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)));
        var remainders = Array(full_length);
        for (j = 0; j < full_length; j++) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }
        /* Convert the remainders to the output string */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);
        return output;
    };
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    md5.prototype.str2rstr_utf8 = function (input) {
        var output = "";
        var i = -1;
        var x, y;
        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }
            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        }
        return output;
    };
    /*
     * Encode a string as utf-16
     */
    md5.prototype.str2rstr_utf16le = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    };
    md5.prototype.str2rstr_utf16be = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
        return output;
    };
    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    md5.prototype.rstr2binl = function (input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        return output;
    };
    /*
     * Convert an array of little-endian words to a string
     */
    md5.prototype.binl2rstr = function (input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        return output;
    };
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    md5.prototype.binl_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    };
    /*
     * These privates implement the four basic operations the algorithm uses.
     */
    md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    md5.prototype.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    md5.prototype.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    return md5;
}());
var utils;
(function (utils) {
    var MathUtility = /** @class */ (function () {
        function MathUtility() {
        }
        //打开n中的bit位   常用于状态添加
        //n|=bit     
        //		#define ADD_BIT(n,bit) ((n)|=(bit)) 
        //切换n中的bit位   常用于状态切换
        //n^=bit;
        //		#define CHANGE_BIT(n,bit) ((n)^=(bit))
        //关闭n中的bit位   常用于状态删除
        //n&=~bit;
        //		#define DEL_BIT(n,bit) ((n)&=~(bit))
        //测试位值是否为1     常用于状态判断
        //n&bit==bit 或 n&bit
        //		#define isOPEN(n,bit) ((n)&(bit))
        /**
         * @method
         * 产生一个low,high之间包含low,high的随机整数
         * @static
         * @param low
         * @param high
         * @returns {number}
         */
        MathUtility.random = function (low, high) {
            if (high === void 0) { high = 0; }
            return Math.round(Math.random() * (high - low) + low);
        };
        MathUtility.UTFLen = function (str) {
            var tmp = new laya.utils.Byte();
            tmp.writeUTFBytes(str);
            tmp.pos = 0;
            return tmp.bytesAvailable;
        };
        /**
         * @method
         * @static
         * 取符号运算符
         * @param value
         * @returns {number}
         */
        MathUtility.sign = function (value) {
            if (value === void 0) { value = 0; }
            return value > 0 ? 1 : (value < 0 ? -1 : 0);
        };
        /**
         * @method
         * @static
         * 夹取值 Keep a number between a low and a high.
         * @param {number}val
         * @param {number}low
         * @param {number}high
         * @returns {number}
         */
        MathUtility.clamp = function (val, low, high) {
            if (low === void 0) { low = 0; }
            if (high === void 0) { high = 1; }
            return Math.min(high, Math.max(val, low));
        };
        /**
         * 在字符串中获取数字
         * @function
         * @DateTime 2018-03-17T15:18:01+0800
         * @param    {string}                 str [description]
         * @return   {number}                     [description]
         */
        MathUtility.GetNumInString = function (str) {
            return parseInt(str.replace(/[^0-9]/ig, ""));
        };
        MathUtility.GetAllNumberInString = function (str, isFloat) {
            if (isFloat === void 0) { isFloat = false; }
            var arr;
            var result = [];
            if (isFloat) {
                arr = str.match(/\d+\.\d+/g);
            }
            else {
                arr = str.match(/\d+/g);
            }
            arr = arr || [];
            arr.forEach(function (value, index, arr1) {
                result.push(parseInt(value));
            });
            return result;
        };
        /**
         * 在字符串中获取浮点数
         * @function
         * @DateTime 2018-03-17T15:18:01+0800
         * @param    {string}                 str [description]
         * @return   {number}                     [description]
         */
        MathUtility.GetFloatNumInString = function (str) {
            return parseFloat(str.replace(/[^0-9.-]/ig, ""));
        };
        /**
         * @method
         * @static
         * 插值
         * @param {number}v1
         * @param {number}v2
         * @param {number}factor
         * @returns {number}
         */
        MathUtility.lerp = function (v1, v2, factor) {
            return (v1 * (1.0 - factor)) + (v2 * factor);
        };
        /**
         * @method
         * @static
         * @param {Array<any>} ary
         * 乱序一个数组
         */
        MathUtility.randomShuffle = function (ary) {
            for (var i = 0; i < ary.length; i++) {
                var index = MathUtility.random(0, ary.length - 1);
                var temp = ary[index];
                ary[index] = ary[0];
                ary[0] = temp;
            }
        };
        MathUtility.isNumber = function (str) {
            return !isNaN(str);
        };
        MathUtility.isInt = function (str) {
            return !(parseInt(str) == 0 && str != "0");
        };
        MathUtility.toInt = function (str) {
            if (!MathUtility.isInt(str))
                throw new Error(str + " is not a int");
            return parseInt(str);
        };
        MathUtility.toNumber = function (str) {
            return str;
        };
        //		public static function isArray(str:String):Boolean
        //		{
        //			
        //			return !(int(str)==0 && str!="0");
        //		}
        MathUtility.toBoolean = function (str) {
            return str != "0" && str != "false" && str != "";
        };
        /**
         *判断value 在 数轴上的区间位置序号
         * 如 3 在数轴[2,5,10]的第1个区间上
         * type ：区间类型   1.true: 每个区间是前闭后开 2.false:前开后闭
         *
         */
        MathUtility.getInRange = function (value, rangeAry, type) {
            //			rangeAry.sort(Array<any>.NUMERIC);
            if (type === void 0) { type = false; }
            var i = 0;
            if (type) {
                for (; i < rangeAry.length; i++) {
                    if (value < rangeAry[i])
                        return i;
                }
            }
            else {
                for (; i < rangeAry.length; i++) {
                    if (value <= rangeAry[i])
                        return i;
                }
            }
            return i;
        };
        /**
         * 判断value 在 数轴上的区间位置序号
         * 如 3 在数轴[2,5,10]的第1个区间上
         * @param value
         * @param rangeAry
         * @param type：区间类型   1.true: 每个区间是前闭后开 2.false:前开后闭
         * @return 区间号
         *
         */
        MathUtility.getPosInRange = function (value, rangeAry, type) {
            //			rangeAry.sort(Array<any>.NUMERIC);
            if (type === void 0) { type = false; }
            var i = 0;
            if (type) {
                for (; i < rangeAry.length; i++) {
                    if (value < rangeAry[i])
                        return i;
                }
            }
            else {
                for (; i < rangeAry.length; i++) {
                    if (value <= rangeAry[i])
                        return i;
                }
            }
            return i;
        };
        /**
         * @method
         * @static
         * 将16进制数值转成16进制字符串 length为数据部分的长度
         *
         */
        MathUtility.toHexString = function (value, length) {
            if (length === void 0) { length = 0; }
            var temp = value.toString(16);
            var s = temp.toLocaleUpperCase();
            for (var i = 0; i < length - temp.length; i++) {
                s = "0".concat(s);
            }
            return "0x".concat(s);
        };
        /**
         *讲指定的秒转换成x天y小时z分钟的形式
         * @param second
         * @returns {any}
         */
        MathUtility.secToTimeString = function (second) {
            if (second === void 0) { second = 0; }
            if (second <= 0)
                return "";
            var day = second / 60 / 60 / 24;
            var hour = second / 60 / 60 - day * 24;
            var mins = second / 60 - day * 24 * 60 - hour * 60;
            var timeStr = "";
            if (day)
                timeStr = timeStr.concat(day + "天");
            if (hour)
                timeStr = timeStr.concat(hour + "小时");
            if (mins)
                timeStr = timeStr.concat(mins + "分钟");
            return timeStr;
        };
        /**
         *
         * 基于余弦定理求两经纬度距离
         * @method
         * @static
         * @param lon1 第一点的精度
         * @param lat1 第一点的纬度
         * @param lon2 第二点的精度
         * @param lat3 第二点的纬度
         * @return 返回的距离，单位m
         * */
        MathUtility.LantitudeLongitudeDist = function (lon1, lat1, lon2, lat2) {
            var EARTH_RADIUS = 6378137; //赤道半径(单位m)
            if (isNaN(lon1) || isNaN(lat1) || isNaN(lon2) || isNaN(lat2))
                return -1;
            //纬度
            var radLat1 = Math.PI / 180 * lat1;
            var radLat2 = Math.PI / 180 * lat2;
            //经度
            var radLon1 = Math.PI / 180 * lon1;
            var radLon2 = Math.PI / 180 * lon2;
            var a = radLat1 - radLat2; //两点纬度之差
            var b = radLon1 - radLon2; //经度之差
            var dist = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))); //计算两点距离的公式
            dist = dist * EARTH_RADIUS; //弧长乘地球半径（半径为米）
            dist = Math.round(dist * 10000) / 10000; //精确距离的数值
            return dist;
        };
        return MathUtility;
    }());
    utils.MathUtility = MathUtility;
})(utils || (utils = {}));
var utils;
(function (utils) {
    var Random = /** @class */ (function () {
        function Random(seed) {
            seed = seed || new Date().getTime();
        }
        Random.prototype.nextInt = function (min, max) {
            max = max || 1;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280.0;
            return Math.round(min + rnd * (max - min));
        };
        Random.prototype.next = function (min, max) {
            max = max || 1;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280.0;
            return min + rnd * (max - min);
        };
        return Random;
    }());
    utils.Random = Random;
})(utils || (utils = {}));
var utils;
(function (utils) {
    /**
     * 检查输入的Email信箱格式是否正确
     * @function
     * @DateTime 2018-03-17T15:19:32+0800
     * @param    {string}                 strEmail [description]
     * @return   {boolean}                         [description]
     */
    function checkEmail(strEmail) {
        //var emailReg = /^[_a-z0-9]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/; 
        var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        if (emailReg.test(strEmail)) {
            return true;
        }
        else {
            alert("您输入的Email地址格式不正确！");
            return false;
        }
    }
    utils.checkEmail = checkEmail;
    ;
    /**
     *校验ip地址的格式
     * @function
     * @DateTime 2018-03-17T15:41:17+0800
     * @param    {string}                 strIP [description]
     * @return   {boolean}                      [description]
     */
    function isIP(strIP) {
        if (isNull(strIP)) {
            return false;
        }
        var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g; //匹配IP地址的正则表达式 
        if (re.test(strIP)) {
            if (Number(RegExp.$1) < 256 && Number(RegExp.$2) < 256 && Number(RegExp.$3) < 256 && Number(RegExp.$4) < 256) {
                return true;
            }
        }
        return false;
    }
    utils.isIP = isIP;
    ;
    /**
     * 检查输入手机号码是否正确
     * @function
     * @DateTime 2018-03-17T15:41:38+0800
     * @param    {string}                 strMobile [description]
     * @return   {boolean}                          [description]
     */
    function checkMobile(strMobile) {
        var regu = /^1[2|3|5|6|7|8|9][0-9]\d{4,8}$/;
        if (regu.test(strMobile)) {
            return true;
        }
        else {
            return false;
        }
    }
    utils.checkMobile = checkMobile;
    ;
    /**
     * 检查输入的电话号码格式是否正确
     * @function
     * @DateTime 2018-03-17T15:41:53+0800
     * @param    {string}                 strPhone [description]
     * @return   {boolean}                         [description]
     */
    function checkPhone(strPhone) {
        var phoneRegWithArea = /^[0][1-9]{2,3}-[0-9]{5,10}$/;
        var phoneRegNoArea = /^[1-9]{1}[0-9]{5,8}$/;
        var prompt = "您输入的电话号码不正确!";
        if (strPhone.length > 9) {
            if (phoneRegWithArea.test(strPhone)) {
                return true;
            }
            else {
                alert(prompt);
                return false;
            }
        }
        else {
            if (phoneRegNoArea.test(strPhone)) {
                return true;
            }
            else {
                alert(prompt);
                return false;
            }
        }
    }
    utils.checkPhone = checkPhone;
    ;
    /**
     * 检查输入字符串是否为空或者全部都是空格
     * @function
     * @DateTime 2018-03-17T15:42:09+0800
     * @param    {string}                 str [description]
     * @return   {boolean}                    [description]
     */
    function isNull(str) {
        if (str == "") {
            return true;
        }
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
    utils.isNull = isNull;
    ;
    /**
     * 检查输入对象的值是否符合整数格式
     * @function
     * @DateTime 2018-03-17T15:42:37+0800
     * @param    {string}                 str [description]
     * @return   {boolean}                    [description]
     */
    function isInteger(str) {
        var regu = /^[-]{0,1}[0-9]{1,}$/;
        return regu.test(str);
    }
    utils.isInteger = isInteger;
    ;
    /**
     * 检查输入字符串是否符合正整数格式
     * @function
     * @DateTime 2018-03-17T15:42:57+0800
     * @param    {string}                 s [description]
     * @return   {boolean}                  [description]
     */
    function isNumber(s) {
        var regu = "^[0-9]+$";
        var re = new RegExp(regu);
        if (s.search(re) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    utils.isNumber = isNumber;
    ;
    /*
    用途：检查输入字符串是否符合金额格式,格式定义为带小数的正数，小数点后最多三位
    输入：s：字符串
    返回：如果通过验证返回true,否则返回false
    */
    function isMoney(s) {
        var regu = "^[0-9]+[\.][0-9]{0,3}$";
        var re = new RegExp(regu);
        if (re.test(s)) {
            return true;
        }
        else {
            return false;
        }
    }
    utils.isMoney = isMoney;
    ;
    /*
    function:cTrim(sInputString,iType)
    description:字符串去空格的函数
    parameters:iType：1=去掉字符串左边的空格;2=去掉字符串左边的空格;0=去掉字符串左边和右边的空格
    return value:去掉空格的字符串
    */
    function cTrim(sInputString, iType) {
        var sTmpStr = ' ';
        var i = -1;
        if (iType == 0 || iType == 1) {
            while (sTmpStr == ' ') {
                ++i;
                sTmpStr = sInputString.substr(i, 1);
            }
            sInputString = sInputString.substring(i);
        }
        if (iType == 0 || iType == 2) {
            sTmpStr = ' ';
            i = sInputString.length;
            while (sTmpStr == ' ') {
                --i;
                sTmpStr = sInputString.substr(i, 1);
            }
            sInputString = sInputString.substring(0, i + 1);
        }
        return sInputString;
    }
    utils.cTrim = cTrim;
})(utils || (utils = {}));
/**
 * Created by wxlan on 2017/1/10.
 */
var utils;
(function (utils) {
    var StringUtility = /** @class */ (function () {
        function StringUtility() {
        }
        /**
         * 获得字符串的长度,中文算2个长度
         * @method
         * @static
         * @param {string} str
         * @returns {number}
         *
         */
        StringUtility.GetStrLen = function (str) {
            var length = str.length;
            var re = /[\u4e00-\u9fa5]{1,}/g; //用正则读取字符串中有多个少个中文
            var temp = str.match(re);
            if (temp != null) {
                length += temp.join("").length; //在长度上增加一次中文的个数，这样中文就被当做2个字符计算长度了
            }
            return length;
        };
        /**
         * 获取子字符串。中文算2个长度。
         *  @method
         * @static
         * @param str
         * @param length
         * @returns {string}
         *
         */
        StringUtility.GetSubstr = function (str, length) {
            var re = /[\u4e00-\u9fa5]{1,}/g; //用正则读取字符串中有多个少个中文
            var resulet = "";
            var len = length;
            var i = 0;
            var b = len > 0;
            while (b) //len > 0 && i > str.length-1)
             {
                var c = str.charAt(i);
                resulet += c;
                var temp = c.match(re);
                if (temp != null) {
                    len -= 2; //在长度上增加一次中文的个数，这样中文就被当做2个字符计算长度了
                }
                else {
                    len -= 1;
                }
                i++;
                if (len <= 0 || i > str.length - 1)
                    b = false;
            }
            return resulet;
        };
        /**
         * @method
         * @static
         * 获取时间串
         * @param time 指定时间的time值
         * @returns {string}
         */
        StringUtility.GetTimeString = function (time) {
            var date = new Date();
            date.setTime(time);
            var result = date.getFullYear() + "-";
            var temp = (date.getMonth() + 1);
            result += temp < 10 ? "0" + temp : temp;
            result += "-";
            temp = date.getDate();
            result += temp < 10 ? "0" + temp : temp;
            result += " ";
            temp = date.getHours();
            result += temp < 10 ? "0" + temp : temp;
            result += ":";
            temp = date.getMinutes();
            result += temp < 10 ? "0" + temp : temp;
            result += ":";
            temp = date.getSeconds();
            result += temp < 10 ? "0" + temp : temp;
            return result;
        };
        /**
         * 把指定的秒数转换成 x天x小时x分钟的格式
         * @param second
         * @returns {any}
         */
        StringUtility.secToTimeString = function (second, format) {
            if (format === void 0) { format = ["天", ":", ":", ""]; }
            if (second <= 0)
                return "";
            var temp = 3600 * 24;
            var day = Math.floor(second / temp);
            second = second % temp;
            temp = 3600;
            var hour = Math.floor(second / temp);
            second = second % temp;
            temp = 60;
            var mins = Math.floor(second / temp);
            second = second % temp;
            second = Math.floor(second);
            var timeStr = "";
            if (day)
                timeStr += timeStr.concat(day + format[0]);
            timeStr = timeStr.concat((hour < 10 ? "0" + hour : hour) + format[1]); //"小时");
            timeStr = timeStr.concat((mins < 10 ? "0" + mins : mins) + format[2]); //"分钟");
            timeStr = timeStr.concat((second < 10 ? "0" + second : second) + format[3]);
            return timeStr;
        };
        /**
         * 获得两个时间的间隔。几天前，几小时前，几分钟前
         * @function
         * @DateTime 2018-10-22T10:51:20+0800
         * @param    {number|string}          now  [description]
         * @param    {number|string}          last [description]
         * @return   {string}                      [description]
         */
        StringUtility.getTimeGrapStr = function (now, last) {
            var now_date = new Date(now);
            var last_date = new Date(last);
            var grap = now_date.getTime() - last_date.getTime();
            grap = Math.floor(grap / 1000);
            var temp = Math.floor(grap / (24 * 3600));
            if (temp >= 1) {
                return temp + "天前";
            }
            temp = Math.floor(grap / (3600));
            if (temp >= 1)
                return temp + "小时前";
            temp = Math.floor(grap / (60));
            if (temp >= 1)
                return temp + "分钟前";
            return "1分钟前";
        };
        StringUtility.getNameEx = function (name, len) {
            if (len === void 0) { len = 5; }
            if (utils.StringUtility.GetStrLen(name) > len) {
                return utils.StringUtility.GetSubstr(name, len - 1) + "...";
            }
            else {
                return name;
            }
        };
        /**
         * 去掉所有的换行符
         * @param str
         */
        StringUtility.cleanEnter = function (str) {
            return str.replace(/[\n\t\r]/ig, "");
        };
        /**
         * input字符串是否是以prefix开头
         */
        StringUtility.beginsWith = function (input, prefix) {
            return (prefix == input.substring(0, prefix.length));
        };
        /**
         * 去除所有的空格
         * @param {string} str [description]
         */
        StringUtility.Trim = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        };
        /**
 * input字符串是否以suffix结束
 * @param input
 * @param suffix
 * @returns {boolean}
 */
        StringUtility.endsWith = function (input, suffix) {
            return (suffix == input.substring(input.length - suffix.length));
        };
        /**
         * 把input中所有的replace替换成replaceWith，
         * @param input
         * @param replace
         * @param replaceWith
         * @returns {string}
         */
        StringUtility.replace = function (input, replace, replaceWith) {
            return input.split(replace).join(replaceWith);
        };
        /**
         *  删除input中所有的remove；
         * @param input
         * @param remove
         * @returns {string}
         */
        StringUtility.remove = function (input, remove) {
            return utils.StringUtility.replace(input, remove, "");
        };
        /**
         * 格式化字符串
         * @param  {string}     input "abc{0}你好{1}"
         * @param  {Array<any>} args  [1,"大家的"]
         * @return {string}           [abc1你好大家的]
         */
        StringUtility.format = function (input, args) {
            var result = input;
            if (args.length == 1) {
                if (args[0] != undefined) {
                    var reg = new RegExp("\\{0\\}", "g");
                    result = result.replace(reg, args[0]);
                }
            }
            else {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != undefined) {
                        var reg = new RegExp("\\{" + i + "\\}", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
            return result;
        };
        return StringUtility;
    }());
    utils.StringUtility = StringUtility;
})(utils || (utils = {}));
var utils;
(function (utils) {
    var tools;
    (function (tools) {
        function getRemoteUrl(url) {
            if (url == undefined)
                return "";
            if (url.indexOf("http") >= 0)
                return url;
            return GameVar.urlParam["request_host"] + url;
        }
        tools.getRemoteUrl = getRemoteUrl;
        /**
         * 拷贝字符串到剪切板
         * @function
         * @DateTime 2018-07-24T16:56:45+0800
         * @param    {string}                 str [description]
         */
        function copyStrToClipboard(str) {
            var oInput = document.createElement('input');
            oInput.value = str;
            oInput.type = "text";
            document.body.appendChild(oInput);
            oInput.focus();
            oInput.setSelectionRange(0, oInput.value.length);
            console.log(document.execCommand("Copy"));
            oInput.style.display = 'none';
            document.body.removeChild(oInput);
        }
        tools.copyStrToClipboard = copyStrToClipboard;
        function getMoneyByExchangeRate(money) {
            var bl = GameVar.g_platformData['exchangeRate'];
            if (bl == 0 || isNaN(bl))
                bl = 1;
            if (bl == 1)
                return utils.tools.getMoneyDes(money);
            money = money / bl;
            var op = money < 0 ? "-" : "";
            money = Math.abs(money);
            if (money < 100000) {
                return op + money.toFixed(2);
            }
            if (money < 100000000) {
                if ((money % 10000) == 0)
                    return op + (money / 10000) + getDesByLan("万");
                if (money < 1000000)
                    return op + (money / 10000).toFixed(2) + getDesByLan("万");
                else if (money < 10000000)
                    return op + (money / 10000).toFixed(1) + getDesByLan("万");
                else
                    return op + parseInt((money / 10000) + "") + getDesByLan("万");
            }
            else {
                return op + (money / 100000000).toFixed(2) + getDesByLan("亿");
            }
        }
        tools.getMoneyByExchangeRate = getMoneyByExchangeRate;
        function getExchangeRate() {
            var bl = GameVar.g_platformData['exchangeRate'];
            if (bl == 0 || isNaN(bl))
                bl = 1;
            return bl;
        }
        tools.getExchangeRate = getExchangeRate;
        /**
         * 截屏处理
         * @param {laya.display.Sprite} target [description]
         */
        function snapshotShare(target, callBack, thisobj) {
            var htmlC;
            if (target != null) {
                htmlC = target.drawToCanvas(target.width, target.height, target.x || 0, target.y || 0);
            }
            else {
                htmlC = g_layerMgr.drawToCanvas(Laya.stage.width, Laya.stage.height, 0, 0);
            }
            var base64Data = htmlC.toBase64('image/jpeg', 0.9);
            if (Laya.Browser.onWeiXin) {
                if (window["application_weixin_data_share"]) {
                    window["application_weixin_data_share"](base64Data, callBack, thisobj);
                }
            }
            else {
                if (window["application_snapshot_share"]) {
                    if (GameVar.g_platformData['share_friend']) {
                        window["application_snapshot_share"](base64Data, callBack, thisobj, 0, true);
                    }
                    else {
                        window["application_snapshot_share"](base64Data, callBack, thisobj);
                    }
                }
            }
            //toBase64Async要报错
            // htmlC.toBase64Async("image/png",0.9,function(base64Data:String)
            // {
            //     if(Laya.Browser.onWeiXin)
            //     {
            //         if(window["application_weixin_data_share"])
            //         {
            //             window["application_weixin_data_share"](base64Data,callBack,thisobj);
            //         }
            //     }
            //     else
            //     {
            //         if(window["application_snapshot_share"])
            //         {
            //             if(GameVar.g_platformData['share_friend'])
            //             {
            //                 window["application_snapshot_share"](base64Data,callBack,thisobj,0,true);
            //             }
            //             else
            //             {
            //                 window["application_snapshot_share"](base64Data,callBack,thisobj);    
            //             }
            //         }    
            //     }
            // })        
        }
        tools.snapshotShare = snapshotShare;
        /**
         * 超出文本部分用...表示.注意，label一般是由美术提供的文本，宽度不能为0
         * @function
         * @DateTime 2018-11-05T17:24:16+0800
         * @param    {Laya.Label}             label [description]
         * @param    {number              =     0}           width [description]
         */
        function setLabelDisplayValue(label, str, width) {
            if (width === void 0) { width = 0; }
            var txt = new Laya.Text();
            txt.fontSize = label.fontSize;
            txt.overflow = Laya.Text.HIDDEN;
            txt.wordWrap = false;
            txt.text = str;
            if (txt.width > label.width) {
                txt.width = label.width - txt['_getTextWidth']("...");
                Laya.timer.callLater(this, function () {
                    if (label == null || !label.getStyle())
                        return;
                    label.text = txt['_lines'][0] + "...";
                });
            }
            else {
                label.text = txt.text;
            }
            // if(width == 0)
            //     txt.width = label.width - txt['_getTextWidth']("...");
            // else
            //     txt.width = width;
            // txt.text = label.text = str;
            // Laya.timer.callLater(this,function()
            // {
            //      if(txt['_lines'][0] != label.text)
            //          label.text = txt['_lines'][0] + "...";
            // })         
        }
        tools.setLabelDisplayValue = setLabelDisplayValue;
        /**
         * 屏蔽关键字
         * @param  {string} str [description]
         * @return {string}     [description]
         */
        function getBanWord(str) {
            if (gamelib.data.ShopData.s_shopDb == null)
                return str;
            var arr = gamelib.data.ShopData.s_shopDb.ban_word;
            if (arr == null)
                return str;
            for (var _i = 0, arr_10 = arr; _i < arr_10.length; _i++) {
                var key = arr_10[_i];
                if (str.indexOf(key) != -1) {
                    var reg = new RegExp(key, "gm");
                    str = str.replace(reg, "**");
                }
            }
            return str;
        }
        tools.getBanWord = getBanWord;
        function clone(source) {
            var sourceCopy = source instanceof Array ? [] : {};
            for (var item in source) {
                sourceCopy[item] = typeof source[item] === 'object' ? clone(source[item]) : source[item];
            }
            return sourceCopy;
        }
        tools.clone = clone;
        function copyTo(from, to) {
            if (from == null || to == null)
                return;
            for (var key in from)
                to[key] = from[key];
        }
        tools.copyTo = copyTo;
        /**
         * @method
         * @static
         * 请求网页并返回
         * @param url 网页地址
         * @param postData 网页参数
         * @param method    方法
         * @param callback  回调
         */
        function http_request(url, postData, method, callback, errorCallBack) {
            var postdata = "";
            var first = true;
            for (var key in postData) {
                if (first)
                    first = false;
                else
                    postdata += '&';
                if (typeof postData[key] == "object") {
                    postdata += key + "=" + JSON.stringify(postData[key]);
                }
                else {
                    postdata += key + "=" + encodeURIComponent(postData[key]);
                }
            }
            var xhr = new laya.net.HttpRequest();
            xhr.http.timeout = 100000; //设置超时时间；
            xhr.on(laya.events.Event.COMPLETE, this, onLoaded);
            xhr.on(laya.events.Event.ERROR, this, onError);
            xhr.on(laya.events.Event.PROGRESS, this, onProgress);
            if (method == "get") {
                console.log("http_request:" + url + "?" + postdata);
                xhr.send(url + "?" + postdata, null, "get", "text");
            }
            else {
                xhr.send(url, postdata, "post", "text");
            }
            function onLoaded(e) {
                var jsonObj;
                try {
                    jsonObj = JSON.parse(xhr.data);
                }
                catch (e) {
                    console.log(url + " 返回的数据不对是json格式");
                }
                close();
                if (callback)
                    callback(jsonObj);
            }
            function onError(e) {
                console.log("HttpRequest error" + url);
                close();
                if (errorCallBack)
                    errorCallBack();
            }
            function onProgress(e) {
                // console.log("HttpRequest onProgress" + xhr);
                // close();
            }
            function close() {
                xhr.off(laya.events.Event.COMPLETE, this, onLoaded);
                xhr.off(laya.events.Event.ERROR, this, onError);
                xhr.off(laya.events.Event.PROGRESS, this, onProgress);
            }
        }
        tools.http_request = http_request;
        /**
         * @method
         * @static
         * 获取铜钱描述
         * @param money
         * @returns {string} 例如1.11万，100.1万,
         */
        function getMoneyDes(money) {
            var op = money < 0 ? "-" : "";
            money = Math.abs(money);
            if (money < 100000)
                return op + money;
            if (money < 100000000) {
                if ((money % 10000) == 0)
                    return op + (money / 10000) + getDesByLan("万");
                if (money < 1000000)
                    return op + (money / 10000).toFixed(2) + getDesByLan("万");
                else if (money < 10000000)
                    return op + (money / 10000).toFixed(1) + getDesByLan("万");
                else
                    return op + parseInt((money / 10000) + "") + getDesByLan("万");
            }
            else {
                return op + (money / 100000000).toFixed(2) + getDesByLan("亿");
            }
        }
        tools.getMoneyDes = getMoneyDes;
        function isTestPid() {
            //var testpIds = gamelib.data.ShopData.s_shopDb.testPid;
            //if (testpIds == null)
            //    return false;
            //return (testpIds.indexOf(GameVar.pid) != -1)
            return false;
        }
        tools.isTestPid = isTestPid;
        /**
         * 是否是组局模式
         * @returns {boolean}
         */
        function isQpq() {
            console.log("isQpq  " + GameVar.circle_args + "   " + GameVar.validation + "  " + GameVar.circleData.validation);
            if (GameVar.circle_args && GameVar.validation || (gamelib.data.UserInfo.s_self && gamelib.data.UserInfo.s_self.m_roomId >= 200 && gamelib.data.UserInfo.s_self.m_roomId <= 250))
                return true;
            return false;
        }
        tools.isQpq = isQpq;
        function isMatch() {
            console.log("isMatch  matchId:" + GameVar.game_args.matchId);
            if (!isNaN(GameVar.game_args.matchId))
                return true;
            return false;
        }
        tools.isMatch = isMatch;
        function isGuanZhan() {
            if (GameVar.game_args.gzInfo)
                return true;
            return false;
        }
        tools.isGuanZhan = isGuanZhan;
        function isWx() {
            return GameVar.platform.indexOf("wx") != -1;
        }
        tools.isWx = isWx;
        function isWxgame() {
            return Laya.Browser.onMiniGame || window["GameGlobal"];
        }
        tools.isWxgame = isWxgame;
        /**
         * 当前游戏是否是棋牌圈大厅
         * @returns {boolean}
         */
        function isQpqHall() {
            return !GameVar.urlParam['isChildGame'];
        }
        tools.isQpqHall = isQpqHall;
        function is(instance, typeName) {
            if (!instance || typeof instance != "object") {
                return false;
            }
            var cl = gamelib.getDefinitionByName(typeName);
            return cl.prototype.isPrototypeOf(instance);
            // var prototype = Object.getPrototypeOf(instance);
            // var types = prototype ? prototype.__types__ : null;
            // if (!types) {
            //     return false;
            // }
            // return (types.indexOf(typeName) !== -1);
        }
        tools.is = is;
        /**
        **
        ** 生成二维码
        */
        function createQRCode(url, spr) {
            spr = spr || new laya.display.Sprite();
            var twidth = spr.width || 100;
            var theight = spr.height || 100;
            var div = Laya.Browser.document.createElement("div");
            var qrcode = new Laya.Browser.window.QRCode(div, {
                text: url,
                width: twidth,
                height: theight,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: 1
            });
            qrcode.makeCode(url);
            Laya.timer.once(1000, this, function () {
                spr.loadImage(qrcode._oDrawing._elImage.src);
            });
            return spr;
        }
        tools.createQRCode = createQRCode;
        function isApp() {
            return window["plus"] || window['conch'];
        }
        tools.isApp = isApp;
        function isRuntime() {
            return window['conch'];
        }
        tools.isRuntime = isRuntime;
        function isAndroid() {
            return Laya.Browser.onAndroid;
        }
        tools.isAndroid = isAndroid;
        //抖动对象特效
        // 1：抖动  2：震动
        function shakeScreen(effectType) {
            if (effectType === void 0) { effectType = 1; }
            var panel = Laya.stage;
            if (panel["shakeScreen_old_x"] == undefined) {
                panel["shakeScreen_old_x"] = panel.x;
                panel["shakeScreen_old_y"] = panel.y;
            }
            var shakeNum = 40;
            //        egret.Tween.removeTweens(panel);
            var oldX = panel["shakeScreen_old_x"];
            var oldY = panel["shakeScreen_old_y"];
            var timeLine = new Laya.TimeLine();
            if (effectType == 1) {
                timeLine.addLabel("show1", 0).to(panel, { x: oldX - 10 }, shakeNum);
                timeLine.addLabel("show2", 0).to(panel, { x: oldX + 20 }, shakeNum, null, shakeNum);
                timeLine.addLabel("show3", 0).to(panel, { x: oldX - 20 }, shakeNum, null, shakeNum);
                timeLine.addLabel("show4", 0).to(panel, { x: oldX + 20 }, shakeNum, null, shakeNum);
                timeLine.addLabel("show5", 0).to(panel, { x: oldX }, shakeNum);
            }
            else {
                timeLine.addLabel("show1", 0).to(panel, { x: oldX - 10, y: oldY }, shakeNum);
                timeLine.addLabel("show2", 0).to(panel, { x: oldX + 20, y: oldY + 10 }, shakeNum, null, shakeNum);
                timeLine.addLabel("show3", 0).to(panel, { x: oldX, y: oldY - 20 }, shakeNum, null, shakeNum);
                timeLine.addLabel("show4", 0).to(panel, { x: oldX, y: oldY + 10 }, shakeNum, null, shakeNum);
                timeLine.addLabel("show5", 0).to(panel, { x: oldX, y: oldY }, shakeNum);
            }
            timeLine.play("show1", false);
        }
        tools.shakeScreen = shakeScreen;
        function shakeObj(obj) {
            if (obj.__shakeObjVar)
                return;
            obj.__shakeObjVar = true;
            var shakeNum = 40;
            var s = 0.8;
            var timeLine = new Laya.TimeLine();
            timeLine.addLabel("show1", 0).to(obj, { scaleX: s, scaleY: s }, shakeNum);
            timeLine.addLabel("show2", 0).to(obj, { scaleX: 1, scaleY: 1 }, shakeNum, null, shakeNum);
            timeLine.addLabel("show3", 0).to(obj, { scaleX: s, scaleY: s }, shakeNum, null, shakeNum);
            timeLine.addLabel("show4", 0).to(obj, { scaleX: 1, scaleY: 1 }, shakeNum, null, shakeNum);
            timeLine.addLabel("show5", 0).to(obj, { scaleX: s, scaleY: s }, shakeNum, null, shakeNum);
            timeLine.addLabel("show6", 0).to(obj, { scaleX: 1, scaleY: 1 }, shakeNum, null, shakeNum);
            timeLine.once(Laya.Event.COMPLETE, this, function () {
                obj.__shakeObjVar = false;
            });
            timeLine.play("show1", false);
        }
        tools.shakeObj = shakeObj;
        function quickSort(arr, key) {
            if (key === void 0) { key = null; }
            function partition(a, st, en) {
                var s = st;
                var e = en + 1;
                var temp = a[s];
                while (1) {
                    if (key) {
                        while (a[++s][key] < temp[key])
                            ;
                        while (a[--e][key] > temp[key])
                            ;
                    }
                    else {
                        while (a[++s] < temp)
                            ;
                        while (a[--e] > temp)
                            ;
                    }
                    if (s > e)
                        break;
                    var tem = a[s];
                    a[s] = a[e];
                    a[e] = tem;
                }
                a[st] = a[e];
                a[e] = temp;
                return e;
            }
            function doSort(a, s, e) {
                if (s < e) {
                    var pos = partition(a, s, e);
                    doSort(a, s, pos - 1);
                    doSort(a, pos + 1, e);
                }
            }
            doSort(arr, 0, arr.length - 1);
        }
        tools.quickSort = quickSort;
        /**
         * 检测当前时间是否是在指定的时间段内
         * @function
         * @DateTime 2018-09-28T10:46:26+0800
         * string:可以为2018-09-27 17:00:00  或 2018/09/27 17:00:00的格式
         * @param    {string|number|Date}     startTime [description]
         * @param    {string|number|Date}     endTime   [description]
         * @return   {boolean}                          [description]
         */
        function checkInTimeSlot(startTime, endTime) {
            var start_ms;
            var end_ms;
            var now_ms;
            var start_date;
            var end_date;
            if (startTime instanceof Date) {
                start_date = startTime;
            }
            else {
                if (typeof startTime == "string") {
                    startTime = startTime.replace(/-/g, "/");
                }
                start_date = new Date(startTime + "");
            }
            if (endTime instanceof Date) {
                end_date = endTime;
            }
            else {
                if (typeof endTime == "string") {
                    endTime = endTime.replace(/-/g, "/");
                }
                end_date = new Date(endTime + "");
            }
            start_ms = start_date.getTime();
            end_ms = end_date.getTime();
            now_ms = GameVar.s_loginSeverTime * 1000 + (Laya.timer.currTimer - GameVar.s_loginClientTime);
            return now_ms >= start_ms && now_ms <= end_ms;
        }
        tools.checkInTimeSlot = checkInTimeSlot;
        function createSceneByViewObj(resname) {
            if (resname.indexOf(".scene") >= 0)
                resname = resname.replace(".scene", "");
            var uiView = Laya.View.uiMap[resname];
            if (uiView == null) {
                console.log(resname + "界面不存在");
                return new Laya.Scene();
            }
            var temp = null;
            switch (uiView.type) {
                case "View":
                    temp = new Laya.View();
                    break;
                case "Dialog":
                    temp = new Laya.Dialog();
                    break;
                default:
                    temp = new Laya.Scene();
                    break;
            }
            temp.createView(uiView);
            return temp;
        }
        tools.createSceneByViewObj = createSceneByViewObj;
        function debugLoaderMap(url) {
            for (var key in Laya.Loader.loadedMap) {
                if (key.indexOf(url) >= 0)
                    console.log(key);
            }
        }
        tools.debugLoaderMap = debugLoaderMap;
    })(tools = utils.tools || (utils.tools = {}));
})(utils || (utils = {}));
window['utils'] = utils;
var gamelib;
(function (gamelib) {
    /**
     * @private
     */
    var getDefinitionByNameCache = {};
    /**
     * @function gamelib.getDefinitionByName
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @language zh_CN
     */
    function getDefinitionByName(name) {
        if (!name)
            return null;
        var definition = getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        var paths = name.split(".");
        var length = paths.length;
        definition = __global;
        for (var i = 0; i < length; i++) {
            var path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        getDefinitionByNameCache[name] = definition;
        return definition;
    }
    gamelib.getDefinitionByName = getDefinitionByName;
})(gamelib || (gamelib = {}));
var __global = this.__global || this;
