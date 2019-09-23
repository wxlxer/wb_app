var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
        var BaseUi = /** @class */ (function () {
            function BaseUi(classname) {
                this._isModal = true;
                this.m_layer = 0;
                this.m_closeUiOnSide = true;
                this._autoDestroy = classname == null;
                if (classname) {
                    var cl = Laya.ClassUtils.getClass(classname);
                    this._scene = new cl();
                    this._scene.name = classname;
                    this.__init();
                }
                BaseUi.s_instanceList.push(this);
            }
            BaseUi.prototype.setData = function (params) {
            };
            BaseUi.prototype.show = function () {
                if (this._scene.parent == null)
                    this._scene.open(false);
                this._res.zOrder = this.m_layer;
                this.onResize();
                if (this._isDialog) {
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
            };
            BaseUi.prototype.close = function () {
                if (this._scene.parent != null) {
                    this._scene.close();
                    if (this._isDialog) {
                        if (this._noticeOther && this._closeByMaskBg)
                            g_signal.dispatch("onDailogClose", this);
                    }
                }
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
            };
            BaseUi.prototype.__init = function () {
                this._res = this._scene;
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
                this.init();
                if (this._isDialog)
                    this._res['isModal'] = this._isModal;
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
                temp.mouseEnabled = true;
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
                this._isDestroyed = true;
                this._res = null;
                this._clickEventObjects.length = 0;
                this._clickEventObjects = null;
                this.btn_close = null;
                this._scene = null;
                this.onDestroy();
            };
            /**
             * 在scene销毁的时候会掉次方法
             * @function
             * @DateTime 2019-01-04T16:50:32+0800
             */
            BaseUi.prototype.onDestroy = function () {
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
                    this._res.size(Laya.stage.width, Laya.stage.height);
                }
                else {
                    // this._res.scale(g_scaleRatio);
                }
            };
            BaseUi.prototype.onFocus = function (evt) {
                if (!this._isDialog) {
                    this._res.size(Laya.stage.width, Laya.stage.height);
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
            BaseUi.s_instanceList = [];
            return BaseUi;
        }());
        core.BaseUi = BaseUi;
    })(core = gamelib.core || (gamelib.core = {}));
})(gamelib || (gamelib = {}));
///<reference path="../core/BaseUi.ts"/>
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
                params = params || window["_pf_datas"] || window["urlParam"] || {};
                this.initLaya(params);
                this.onParamsLoaded(params);
            }
            GameMain.prototype.onParamsLoaded = function (params) {
                GameVar.urlParam = params;
                this.initGame(GameVar.urlParam);
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
                if (!Laya['_isinit']) {
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
                    Laya.init(this.m_gameWidth, this.m_gameHeight, Laya.WebGL);
                }
                UIConfig.closeDialogOnSide = false;
                Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;
                Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
                if (bLandscape) {
                    Laya.stage.screenMode = laya.display.Stage.SCREEN_HORIZONTAL;
                }
                else {
                    Laya.stage.screenMode = laya.display.Stage.SCREEN_VERTICAL;
                }
                Laya.stage.bgColor = "#232628";
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
                this.game_name = params.game_code;
                var arr = [];
                this._topLayer = new laya.display.Sprite();
                Laya.stage.addChild(this._topLayer);
                g_signal = g_signal || new gamelib.core.Signal();
                g_loading = g_loading || new gamelib.loading.LoadingModule();
                g_soundMgr = g_soundMgr || new gamelib.core.SoundManager();
                g_dialogMgr = g_dialogMgr || new gamelib.core.DialogManager();
                g_net = new gamelib.core.GameNet();
                laya.ui.Dialog.manager = g_dialogMgr;
                g_dialogMgr = Laya.Dialog.manager;
                g_gameMain = g_gameMain || this;
                g_net_configData = g_net_configData || new gamelib.data.NetConfigDatas();
                this._topLayer.zOrder = Laya.Dialog.manager.zOrder + 10;
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
                this._topLayer.scaleX = tscale;
                this._topLayer.scaleY = tscale;
                laya.ui.Dialog.manager.scaleX = tscale;
                laya.ui.Dialog.manager.scaleY = tscale;
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
                this._topLayer.removeSelf();
                Laya.stage.off(laya.events.Event.RESIZE, this, this.onResize);
                g_signal.remove(this.onSignal, this);
                g_dialogMgr.maskLayer.removeSelf();
                this._net = null;
                this._topLayer = null;
            };
            /**
             * 从主游戏进入子游戏，需要关闭主游戏的公共模块，断开主游戏的服务器，
             * 关闭主游戏的ui
             * @function close
             * @author wx
             * @DateTime 2018-03-16T11:59:23+0800
             * @access public
             */
            GameMain.prototype.close = function () {
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
                Laya.stage.addChild(this._topLayer);
                this.playBgm();
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
            /**
             * 所有资源载入完成后的回掉
             * 需要创建网络模块，连接服务器
             * @function onResloaded
             * @DateTime 2018-03-16T12:04:28+0800
             * @access protected
             */
            GameMain.prototype.onResloaded = function () {
                this.playBgm();
            };
            GameMain.prototype.playBgm = function () {
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
                }
            };
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
         * 登录
         * @type {string}
         * @static
         */
        GameMsg.Login = "/AppApi/NotLoggedInApi/login";
        /**
         * @property
         * 注册
         * @type {string}
         * @static
         */
        GameMsg.Register = "/AppApi/NotLoggedInApi/register";
        /**
         * @property
         * 获取公告
         * @type {string}
         * @static
         */
        GameMsg.GongGao = "/AppApi/NotLoggedInApi/gonggao";
        /**
         * @property
         * 获取客服链接等
         * @type {string}
         * @static
         */
        GameMsg.Systemseting = "/AppApi/NotLoggedInApi/systemseting";
        /**
         * @property
         * 获取弹出框页面
         * @type {string}
         * @static
         */
        GameMsg.Indexhot = "/AppApi/NotLoggedInApi/indexhot";
        /**
         * @property
         * 游戏接口列表
         * @type {string}
         * @static
         */
        GameMsg.Getapi = "/AppApi/NotLoggedInApi/getapi";
        /**
         * @property
         * 7.	接口分类列表
         * @type {string}
         * @static
         */
        GameMsg.Getapiassort = "/AppApi/NotLoggedInApi/getapiassort";
        /**
         * @property
         * 8.	接口捕鱼分类列表
         * @type {string}
         * @static
         */
        GameMsg.Getapifish = "/AppApi/NotLoggedInApi/getapifish";
        /**
         * @property
         * 9.	接口电子分类列表
         * @type {string}
         * @static
         */
        GameMsg.Getapitypegame = "/AppApi/NotLoggedInApi/getapitypegame";
        /**
         * @property
         * 10.	接口电子列表
         * @type {string}
         * @static
         */
        GameMsg.Getapigame = "/AppApi/NotLoggedInApi/getapigame";
        /** @type {11.	优惠活动} [description] */
        GameMsg.Gethotall = "/AppApi/NotLoggedInApi/gethotall";
        /**
         * 12.	登出
         */
        GameMsg.Logout = "/AppApi/MemberApi/logout";
        /**
         * 13.	实时余额获取
         */
        GameMsg.Readmoney = "/AppApi/MemberApi/readmoney";
        /**
         * 14.	用户信息
         */
        GameMsg.MemberInfo = "/AppApi/MemberApi/memberInfo";
        /**
         * 15.	修改密码
         */
        GameMsg.Updatepwd = "/AppApi/MemberApi/updatepwd";
        /**
         * 16.	获取绑定信息
         */
        GameMsg.Bindbank = "/AppApi/MemberApi/bindbank";
        /**
         * 17.	绑定银行卡
         */
        GameMsg.Bindbankadd = "/AppApi/MemberApi/bindbankadd";
        /**
         *18.	获取红包还能领取的次数
         */
        GameMsg.rednum = "/AppApi/MemberApi/rednum";
        /**
         * 	19.	领红包
         */
        GameMsg.Receivingenvelope = "/AppApi/MemberApi/receivingenvelope";
        /**
        * 20.	领取实时返水金额
        */
        GameMsg.Rreceivereturn = "/AppApi/MemberApi/rreceivereturn";
        /**
          * 21.	申请代理
          */
        GameMsg.Subagent = "/AppApi/MemberApi/subagent";
        /**
         * 22.	登陆游戏
         */
        GameMsg.login_game = "/AppApi/GameLoginApi/login";
        /**
        * 23.	交易记录
        */
        GameMsg.moneyinfo = "/AppApi/RecordingApi/moneyinfo";
        /**
         *24.	交易明细
         */
        GameMsg.Mconvertrecord = "/AppApi/RecordingApi/mconvertrecord";
        /**
         *25.	下注记录
         */
        GameMsg.Betinfodata = "/AppApi/RecordingApi/betinfodata";
        /**
         * 26.	获取实时返水金额
         */
        GameMsg.Realtimereturn = "/AppApi/RecordingApi/realtimereturn";
        /**
         * 27.	取款
         */
        GameMsg.Moneyout = "/AppApi/RecordingApi/moneyout";
        /**
         * 28.	银行卡,二维码收款信息
         */
        GameMsg.Bankinfo = "/AppApi/RecordingApi/bankinfo";
        /**
         * 29.	支付银行列表
         */
        GameMsg.Payinfolist = "/AppApi/RecordingApi/payinfolist";
        /**
         * 30.	取款银行列表选择款
         */
        GameMsg.Bankinfolist = "/AppApi/RecordingApi/bankinfolist";
        /**
         * 31.	老带新基本信息
         */
        GameMsg.Oldwithnewinfo = "/AppApi/RecordingApi/oldwithnewinfo";
        /**
         * 32.	老带新 列表
         */
        GameMsg.Oldwithnewinfolist = "/AppApi/RecordingApi/oldwithnewinfolist";
        /**
         * 33.	站内信
         */
        GameMsg.Websitemaillist = "/AppApi/RecordingApi/websitemaillist";
        /**
         * 34.	删除站内信
         */
        GameMsg.Websitemaildelete = "/AppApi/RecordingApi/websitemaildelete";
        /**
         * 35.	阅读站内信
         */
        GameMsg.Readwebsitemail = "/AppApi/RecordingApi/readwebsitemail";
        /**
         * 36.	转账操作
         */
        GameMsg.Convertmoney = "/AppApi/CashOperationApi/convertmoney";
        /**
        * 37.	一键转出
        */
        GameMsg.Onetouchtransfer = "/AppApi/CashOperationApi/onetouchtransfer";
        /**
        * 38.	查询所有余额
        */
        GameMsg.Getuserplatform = "/AppApi/CashOperationApi/getuserplatform";
        /**
        * 39.	查询单个平台余额
        */
        GameMsg.Ref_ed = "/AppApi/CashOperationApi/ref_ed";
        /**
        * 40.	银行卡存款
        */
        GameMsg.Moneyinhk = "/AppApi/CashOperationApi/moneyinhk";
        /**
        * 41.	二维码存款
        */
        GameMsg.Moneyinqr = "/AppApi/CashOperationApi/moneyinqr";
        /**
        *42.	在线支付
        */
        GameMsg.Payapi = "/AppApi/CashOperationApi/payapi";
        /**
        * 43.	申请优惠活动
        */
        GameMsg.Applicationhot = "/AppApi/CashOperationApi/applicationhot";
        /**
        * 44.	验证取款密码
        */
        GameMsg.Getqkpwd = "/AppApi/CashOperationApi/getqkpwd";
        return GameMsg;
    }());
    gamelib.GameMsg = GameMsg;
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var core;
    (function (core) {
        var GameNet = /** @class */ (function () {
            function GameNet() {
                this._listeners = [];
                this._signal = new gamelib.core.Signal();
            }
            GameNet.prototype.request = function (url, data) {
                utils.tools.http_request(GameVar.s_domain + url, data, "post", Laya.Handler.create(this, this.onReciveNetMsg, [url]));
            };
            GameNet.prototype.onReciveNetMsg = function (api, data) {
                if (this._listeners == null)
                    return;
                var len = this._listeners.length;
                for (var i = 0; i < len; i++) {
                    if (this._listeners == null || this._listeners[i] == null)
                        continue;
                    this._listeners[i].reciveNetMsg(api, data);
                }
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
            return GameNet;
        }());
        core.GameNet = GameNet;
    })(core = gamelib.core || (gamelib.core = {}));
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
var g_net;
/**
 * 主游戏入口实例
 * @type {gamelib.core.GameMain}
 * @global
 */
var g_gameMain;
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
// function getGameResourceUrl(res:string,game_code?:string):string
// {
//     game_code = game_code || GameVar.s_namespace;
//     return g_gamesInfo.getUrlContainVersionInfo(GameVar.resource_path + "resource/" + game_code +"/"+ res);
//     // return GameVar.resource_path + "resource/" + game_code +"/"+ res + g_game_ver_str;
// }
// if(Laya.Browser.onMiniGame || window["GameGlobal"]){
//     window['getGameResourceUrl'] = getGameResourceUrl;
// }
// function getCommonResourceUrl(res:string):string
// {
//     return g_gamesInfo.getUrlContainVersionInfo(GameVar.common_ftp + res);
//     // return GameVar.common_ftp + res + g_game_ver_str_qpq;
// }
// if(Laya.Browser.onMiniGame || window["GameGlobal"])
// {
//     window['getCommonResourceUrl'] = getCommonResourceUrl;
// }
function navigateToURL(url) {
    if (window['application_open_url']) {
        window['application_open_url'](url);
    }
    else {
        Laya.Browser.window.location.href = url;
    }
}
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
                // if(utils.tools.isAndroid() || utils.tools.isRuntime())
                // {
                //     this._type = '.ogg';
                // }
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
                        laya.media.SoundManager.musicVolume = 0.8;
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
                // var url:string = GameVar.resource_path +"resource";
                // if(isCommon)
                // {
                //     url += "/qpq/sound/";
                // }
                // else
                // {
                //     url += "/" + GameVar.s_namespace + "/sound/";
                // }
                // // url += name + this._type + g_game_ver_str;            
                // url = g_gamesInfo.getUrlContainVersionInfo(url + name + this._type);
                // laya.media.SoundManager.playSound(url,loops,complete);
            };
            /**
             * 停止播放
             * @function
             * @DateTime 2018-03-16T14:13:41+0800
             * @param    {string}                 name [description]
             */
            SoundManager.prototype.stopSound = function (name, isCommon) {
                if (isCommon === void 0) { isCommon = false; }
                // var url:string = GameVar.resource_path +"resource";
                // if(isCommon)
                // {
                //     url += "/qpq/sound/";
                // }
                // else
                // {
                //     url += "/" + GameVar.s_namespace + "/sound/";
                // }
                // // url += name + this._type + g_game_ver_str;   
                // url = g_gamesInfo.getUrlContainVersionInfo(url + name + this._type);
                // laya.media.SoundManager.stopSound(url);
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
                // if(typeof this._bgmList === "string")
                // {
                //     return GameVar.resource_path + "resource/" + GameVar.s_namespace + "/sound/" + this._bgmList + this._type;
                // }
                // if(index < 0 || index >= this._bgmList.length) index = 0;
                // return GameVar.resource_path  + "resource/" + GameVar.s_namespace + "/sound/" +  this._bgmList[index] + this._type;
                return "";
            };
            return SoundManager;
        }());
        core.SoundManager = SoundManager;
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
            Ui_NetHandle.prototype.reciveNetMsg = function (api, data) {
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
/**
 * @class
 * 登录数据相关
 * @author wx
 *
 */
var GameVar = /** @class */ (function () {
    function GameVar() {
    }
    Object.defineProperty(GameVar, "s_bActivate", {
        //是否激活状态
        get: function () {
            return Laya.stage.isFocused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameVar, "urlParam", {
        get: function () {
            return GameVar._urlParams || {};
        },
        set: function (value) {
            GameVar._urlParams = value;
        },
        enumerable: true,
        configurable: true
    });
    GameVar.s_version = "0";
    GameVar.s_token = "";
    /**
     * @property {number} appid
     * @static
     */
    GameVar.appid = "";
    GameVar.s_domain = "";
    return GameVar;
}());
window["GameVar"] = GameVar;
/**
 * Created by wxlan on 2017/9/4.
 */
var gamelib;
(function (gamelib) {
    var data;
    (function (data_1) {
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
                // sendNetMsg(0x0040,JSON.stringify(this));
                // if(utils.tools.isWxgame()){
                //     window['wx'].setStorage({
                //         key:"config",
                //         data:JSON.stringify(this)
                //     })    
                // }
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
                // if(GameVar.s_loginSeverTime != time)
                // {
                //     this.addConfig("lastLoginTime",GameVar.s_loginSeverTime);
                //     this.saveConfig();
                //     var date1:Date = new Date(GameVar.s_loginSeverTime * 1000);
                //     var date2:Date = new Date(time * 1000);
                //     this.m_bFirstLoginDay = date1.getDate() != date2.getDate();                
                // } 
            };
            return NetConfigDatas;
        }());
        data_1.NetConfigDatas = NetConfigDatas;
    })(data = gamelib.data || (gamelib.data = {}));
})(gamelib || (gamelib = {}));
var gamelib;
(function (gamelib) {
    var loading;
    (function (loading) {
        var LoadingModule = /** @class */ (function () {
            function LoadingModule() {
            }
            /**
             * 更新游戏资源的进度
             * @function
             * @DateTime 2018-11-16T14:46:15+0800
             * @param    {number}                 progress [description]
             */
            LoadingModule.prototype.updateResLoadingProgress = function (progress) {
                // if(GameVar.urlParam['isChildGame'] && (GameVar.g_platformData['childgame_loading_type'] != 1))
                // {
                //     if(this._miniLoading_child)
                //     {
                //         if(progress == 1)
                //         {
                //             this._miniLoading_child.updateMsg(getDesByLan("同步中")+"...");
                //         }
                //         else
                //         {
                //             var num:number = Math.floor(progress * 100);
                //             if(num <= 1)
                //             {
                //             	this._miniLoading_child.updateMsg("");
                //             }
                //             else
                //             {
                //                 this._miniLoading_child.updateMsg(getDesByLan("资源载入中")+"..." + num + "%" );    
                //             }
                //         }
                //     }
                //     return;
                // }
                // if(utils.tools.isApp())
                // {                 
                //     if(window["application_loading_info"])
                //         window["application_loading_info"](getDesByLan("资源载入中")+"...",Math.floor(progress * 100) );                
                //     // console.log("。。。" +Math.floor(progress * 100));
                // }
                // else
                // {
                //     if(this._loadingUi != null)
                //         this._loadingUi.showProgress(progress);                
                // }    
            };
            /**
             * 缓存包的加载进度
             * @function
             * @DateTime 2018-11-16T14:37:47+0800
             */
            LoadingModule.prototype.onCacheProgress = function (progress) {
                // if(utils.tools.isApp() && GameVar.g_platformData['childgame_loading_type'] == 1)
                // {
                //     var title:string = "";
                //     var info:string = "";
                //     //下载cache包和加载资源一样
                //     if(progress == "")
                //     {
                //         title = "检测游戏...";
                //         info = "0";
                //     }
                //     else
                //     {
                //         title = "资源下载中..."
                //         info = "" + progress;
                //     }
                //     if(window["application_loading_info"])
                //         window["application_loading_info"](title,info);
                //     console.log(title + "  " + info);
                //     return;
                // }
                // if(this._miniLoading_child)
                // {
                //     var str:string = "...";
                //     if(progress == "")
                //     {
                //         if(isNaN(this._point))
                //             this._point = 0;
                //         else
                //             this._point ++;
                //         this._point = this._point % 3;
                //         str = "";
                //         if(this._point == 0)
                //         {
                //             str = ".  ";
                //         }
                //         else if(this._point == 1)
                //         {
                //             str = ".. ";
                //         }
                //         else
                //         {
                //             str = "...";
                //         }
                //     }
                //     this._miniLoading_child.updateMsg(getDesByLan("加载中") + str + progress);                    
                // }
            };
            /**
             *	显示主loading界面
             *
             */
            LoadingModule.prototype.showLoadingUi = function () {
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
                //     if(this._res["txt_info"])
                //         this._res["txt_info"].text = GameVar.g_platformData['copyright'] || '';
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
        //保存在app本地的数据
        function getLocalStorage(key) {
            var storage;
            if (window['plus']) {
                storage = window['plus'].storage;
            }
            else {
                storage = window['localStorage'];
            }
            return storage.getItem(key);
        }
        tools.getLocalStorage = getLocalStorage;
        function saveLocalStorage(key, value) {
            var storage;
            if (window['plus']) {
                storage = window['plus'].storage;
            }
            else {
                storage = window['localStorage'];
            }
            storage.setItem(key, value);
        }
        tools.saveLocalStorage = saveLocalStorage;
        function copyToClipboard(str, callBack) {
            if (window['application_set_clipboard']) {
                return window['application_set_clipboard'](str, callBack);
            }
            utils.tools.copyStrToClipboard(str);
            if (callBack)
                callBack({ result: 0 });
        }
        tools.copyToClipboard = copyToClipboard;
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
                htmlC = Laya.stage.drawToCanvas(Laya.stage.width, Laya.stage.height, 0, 0);
            }
            var base64Data = htmlC.toBase64('image/jpeg', 0.9);
            if (Laya.Browser.onWeiXin) {
                if (window["application_weixin_data_share"]) {
                    window["application_weixin_data_share"](base64Data, callBack, thisobj);
                }
            }
            else {
                if (window["application_snapshot_share"]) {
                    window["application_snapshot_share"](base64Data, callBack, thisobj);
                }
            }
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
                    label.text = txt['_lines'][0] + "...";
                });
            }
            else {
                label.text = txt.text;
            }
        }
        tools.setLabelDisplayValue = setLabelDisplayValue;
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
        function http_request(url, postData, method, callback) {
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
            //var arr:Array<string>=["contentType","application/x-www-form-urlencoded"];
            if (method == "get") {
                console.log("http_request:" + url + "?" + postdata);
                xhr.send(url + "?" + postdata, null, "get", "json");
            }
            else {
                xhr.send(url, postdata, "post", "json");
            }
            function onLoaded(e) {
                var jsonObj = xhr.data;
                close();
                if (callback)
                    callback.runWith(jsonObj);
            }
            function onError(e) {
                console.log("HttpRequest error" + url);
                close();
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
        // /**
        //  * 检测当前时间是否是在指定的时间段内
        //  * @function
        //  * @DateTime 2018-09-28T10:46:26+0800
        //  * string:可以为2018-09-27 17:00:00  或 2018/09/27 17:00:00的格式
        //  * @param    {string|number|Date}     startTime [description]
        //  * @param    {string|number|Date}     endTime   [description]
        //  * @return   {boolean}                          [description]
        //  */
        // export function checkInTimeSlot(startTime:string|number|Date,endTime:string|number|Date):boolean
        // {
        //     var start_ms:number;
        //     var end_ms:number;
        //     var now_ms:number;
        //     var start_date:Date
        //     var end_date:Date;
        //     if(startTime instanceof Date)
        //     {
        //         start_date = <Date>startTime;
        //     }
        //     else
        //     {
        //         if(typeof startTime == "string")
        //         {
        //             startTime = startTime.replace(/-/g, "/");
        //         }
        //         start_date = new Date(startTime+"");            
        //     }
        //     if(endTime instanceof Date)
        //     {
        //         end_date = <Date>endTime;
        //     }
        //     else
        //     {
        //         if(typeof endTime == "string")
        //         {
        //             endTime = endTime.replace(/-/g, "/");
        //         }
        //         end_date = new Date(endTime+"");            
        //     }  
        //     start_ms = start_date.getTime();
        //     end_ms = end_date.getTime();
        //     now_ms = GameVar.s_loginSeverTime * 1000 + (Laya.timer.currTimer - GameVar.s_loginClientTime);
        //     return now_ms >= start_ms && now_ms <= end_ms;
        // }
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
