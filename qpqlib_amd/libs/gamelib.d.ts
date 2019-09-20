/// <reference path="../libs/LayaAir.d.ts" />
/**
 * Created by wxlan on 2017/8/28.
 */
declare namespace gamelib.core {
    /**
     * 游戏中美术提供资源，程序使用美术提供资源的基类。
     * 美术资源的对象为_res;
     * 逻辑包括：自动生成界面，显示、关闭、消耗、自适应屏幕
     * 美术资源中，把所有静态的图层放到组里面，命名为s_bgxx(xx为数字);
     * 会把这些静态图当成一张图片来渲染，提升效率
     * @class BaseUi
     * @author wx
     */
    class BaseUi extends Laya.Script {
        protected _isModal: boolean;
        /**
         * 是否是弹窗样式ui
         * @type {boolean}
         * @access protected
         */
        protected _isDialog: boolean;
        /**
         * 资源对象
         * @type {any}
         * @access protected
         */
        protected _res: any;
        /**
         * 按钮列表
         * @type {Array<any>}
         * @access protected
         */
        protected _clickEventObjects: Array<any>;
        /**
         * 关闭按钮
         * @access protected
         * @type {laya.ui.Button}
         */
        protected btn_close: laya.ui.Button;
        protected _isDestroyed: boolean;
        /**
         * 是否通知其他ui此界面的打开和关闭，主要用于大厅中关闭和显示的时候播放大厅的动画
         * @type {boolean}
         * @access protected
         */
        protected _noticeOther: boolean;
        /**
         * 点击背景的时候是否关闭此界面
         * @type {boolean}
         * @access protected
         */
        protected _closeByMaskBg: boolean;
        /**
         * @type {number} 当前的层级
         * @access public
         */
        m_layer: number;
        /**
         * 点击背景的时候是否关闭此界面. 默认为true
         * @access public
         * @type {boolean}
         */
        m_closeUiOnSide: boolean;
        isClosedByCloseBtn: boolean;
        protected _scene: Laya.Scene;
        protected _autoDestroy: boolean;
        constructor(resname: string);
        setData(params: any): void;
        onAwake(): void;
        /**
         * 解决子页面嵌套获取不到var的情况
         * @function
         * @DateTime 2019-01-05T17:02:31+0800
         * @param    {[type]}                 var child of this._res._children [description]
         */
        private initProps(view, root);
        /**
         * 子页面不能再嵌套子页面了
         * @function
         * @DateTime 2019-01-07T10:11:04+0800
         * @param    {Laya.Node}              view [description]
         * @param    {any}                    root [description]
         */
        private initViewProps(view, root);
        /**
         * 修复页面嵌套
         * @function
         * @DateTime 2019-01-05T15:11:40+0800
         */
        private initUiViewProps();
        onEnable(): void;
        onDisable(): void;
        private onSceneLoaded(scene);
        private __init();
        /**
        * 将按钮添加到事件监听列表中。
        * 需要重写onClickObjects方法来实现点击逻辑
        * @function addBtnToListener
        * @author wx
        * @DateTime 2018-03-15T20:57:24+0800
        * @param    {string}   name 按钮对象的var。注意是var，不是name
        * @access public
        */
        addBtnToListener(name: string): void;
        removeBtnToListener(name: string): void;
        /**
         * 初始化的工作放到这个函数里面，需要重写。不要主动都调用
         * @function init
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:14:55+0800
         */
        protected init(): void;
        /**
         * 界面显示后会自动调用.不要主动都调用
         * @function onShow
         * @author wx
         * @DateTime 2018-03-16T10:15:32+0800
         * @access protected
         */
        protected onShow(): void;
        /**
         * 界面关闭会自动调用。不要主动都调用
         * @function onClose
         * @author wx
         * @DateTime 2018-03-16T10:16:12+0800
         * @access protected
         */
        protected onClose(): void;
        /**
         * 销毁界面。需要重写
         * @function destroy
         * @author wx
         * @DateTime 2018-03-16T10:16:29+0800
         * @access public
         */
        destroy(): void;
        /**
         * 在scene销毁的时候会掉次方法
         * @function
         * @DateTime 2019-01-04T16:50:32+0800
         */
        onDestroy(): void;
        /**
         * 把界面显示到舞台上。不要重写。
         * 会根据 m_layer 来设置层级;会自动给_clickEventObjects的每个对象添加监听
         * 回自动调用this.onShow();
         * @function show
         * @author wx
         * @DateTime 2018-03-16T10:17:08+0800
         * @access public
         */
        show(): void;
        /**
         * 从舞台上移除界面.回自动调用this.onClose();
         * @function close
         * @author wx
         * @DateTime 2018-03-16T10:18:48+0800
         * @access public
         */
        close(): void;
        /**
         * 舞台尺寸改变的时候的回掉。不要重写
         * @function onResize
         * @author wx
         * @DateTime 2018-03-16T10:19:12+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onResize(evt?: laya.events.Event): void;
        protected onFocus(evt?: Laya.Event): void;
        /**
         * 点击背景的回掉
         * @function onClickBg
         * @author wx
         * @DateTime 2018-03-16T10:29:29+0800
         * @param    {laya.events.Event}      evt [description]
         * @access private
         */
        private onClickBg(evt?);
        /**
         * 按钮点击事件的回掉
         * @function onClickObjects
         * @author wx
         * @DateTime 2018-03-16T10:19:39+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onClickObjects(evt: laya.events.Event): void;
        /**
         * 关闭按钮的回掉.会调用this.close();
         * @function onClickCloseBtn
         * @author wx
         * @DateTime 2018-03-16T10:20:15+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onClickCloseBtn(evt: laya.events.Event): void;
        /**
         * ui关闭后的回掉.如果是dialog样式，并且_noticeOther && _closeByMaskBg。则会发送onDailogClose消息
         * @function onDialogClosed
         * @author wx
         * @DateTime 2018-03-16T10:30:11+0800
         * @access protected
         */
        protected onDialogClosed(): void;
        /**
         * 界面关闭特效
         * @function onDialogCloseEffect
         * @author wx
         * @DateTime 2018-03-16T10:31:35+0800
         * @access protected
         */
        protected onDialogCloseEffect(): void;
        /**
         * 界面显示特效
         * @function onDialogShowEffect
         * @author wx
         * @DateTime 2018-03-16T10:31:56+0800
         * @access protected
         */
        protected onDialogShowEffect(): void;
    }
}
declare module gamelib.alert {
    /**
     * @class AlertBuyGoods
     * @author wx
     * @extends gamelib.core.BaseUi
     * 购买商品提示框提示框，不要主动实例化这个类
     * @uses TipManager
     *
     */
    class AlertBuyGoods extends gamelib.core.BaseUi {
        private _buyIndex;
        constructor();
        protected init(): void;
        /**
         * @function setMsg
         * 设置消息
         * @param {number}  buyIndex 商品的buyIndex
         * @param {string} 提示消息
         */
        setMsg(buyIndex: number, msg: string): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
 * Created by wxlan on 2017/8/29.
 */
declare namespace gamelib.alert {
    /**
     * @class AlertUi
     * 游戏通用提示框。资源是用的ui.common.Art_CustomTipsUI如果游戏没有，则使用的是qpq中资源
     * @author wx
     * @extends gamelib.core.BaseUi
     * @uses TipManager
     */
    class AlertUi extends gamelib.core.BaseUi {
        protected btn_cancel: laya.ui.Button;
        protected btn_ok: laya.ui.Button;
        protected txt_tips: laya.ui.TextArea;
        protected txt_title: laya.ui.Label;
        protected _callBack: Function;
        protected _thisObj: any;
        private _oldAtts;
        private width;
        constructor();
        protected init(): void;
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
        setData(params: any): void;
        private timer(label, time);
        onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        protected onClickCloseBtn(evt: laya.events.Event): void;
    }
}
declare module gamelib.alert {
    /**
     * @class Pmd
     * @author wx
     * 游戏跑马灯.需要主动设置资源。
     */
    class Pmd extends laya.display.Sprite {
        private _msgList;
        private _txt;
        private _container;
        private _scrolling;
        private _res;
        private _rec;
        private _speed;
        constructor();
        /**
         * 设置跑马灯的资源，目前主要是在qpq大厅里面设置
         * @function setRes
         * @author wx
         * @DateTime 2018-03-15
         * @param    {laya.display.Sprite} res [跑马灯会放在res上面运行]
         */
        setRes(res: laya.display.Sprite, speed?: number): void;
        destroy(): void;
        setSpeed(value: number): void;
        resize(): void;
        /**
         * 添加消息到跑马灯队列中
         * @function add
         * @author wx
         * @DateTime 2018-03-15T20:49:00+0800
         * @param    {string}     msg [description]
         */
        add(msg: string): void;
        private checkShow();
        private onScroll();
    }
    /**
     * @class Pmd_Laba
     * @ignore
     */
    class Pmd_Laba extends gamelib.core.BaseUi {
        private _container;
        private _msgList;
        private _txt;
        private _scrolling;
        constructor();
        init(): void;
        add(msg: string): void;
        private checkShow();
        private scrollText(msg);
        private scrollEnd();
    }
}
/**
 * Created by wxlan on 2016/10/24.
 */
declare module gamelib.Api {
    /**
     * 更新玩家信息
     * @function
     * @DateTime 2018-08-10T12:07:51+0800
     * @param    {number                                       }} obj [description]
     * @param    {Laya.Handler}           callBack [description]
     */
    function updateUserInfo(obj: {
        nick?: string;
        icon?: string;
        gender?: number;
        phone?: number;
    }, callBack?: Laya.Handler): void;
    /**
     *  玩家联系方式(快递
     * @function
     * @DateTime 2018-07-13T10:23:01+0800
     * @param    {string,                }} obj [description]
     */
    function updateUserContacts(obj: {
        phone?: string;
        idcard?: string;
        street_address?: string;
        actual?: string;
    }, callBack?: Laya.Handler): void;
    /**
     *  玩家实名信息(实名
     * @function
     * @DateTime 2018-07-18T19:12:19+0800
     * @param    {string,                                     }} obj [description]
     * @param    {Laya.Handler}           callBack [description]
     */
    function updateUserIdentity(obj: {
        phone?: string;
        idcard?: string;
        street_address?: string;
        actual?: string;
    }, callBack?: Laya.Handler): void;
    /**
     * 修改游戏的某些属性。通过接口来修改
     * @function
     * @DateTime 2018-10-15T15:56:44+0800
     * @param    {string}                 interfaceName [description]
     * @param    {any}                    obj           [description]
     * @param    {Laya.Handler}           callBack      [description]
     */
    function modfiyAttByInterface(interfaceName: string, obj: any, callBack: Laya.Handler): void;
    /**
     * 更新玩家的登录相关的信息
     * @function
     * @DateTime 2018-10-12T17:09:40+0800
     * @param    {string,                                     }} obj [description]
     * @param    {Laya.Handler}           callBack [description]
     */
    function updateUserLoginInfo(obj: {
        nick?: string;
        icon?: string;
        gender?: number;
        phone?: string;
        email?: string;
    }, callBack?: Laya.Handler): void;
    /**
     * 手机注册
     * @function
     * @DateTime 2018-10-12T17:12:51+0800
     * @param    {{}}                   obj [description]
     */
    function registerByPhone(obj: {
        phone?: string;
        code?: string;
        passwd?: string;
    }, callBack?: Laya.Handler): void;
    /**
     * 通过指定接口获取信息
     * @function
     * @DateTime 2018-10-15T16:04:54+0800
     * @param    {string}                 interfaceName [description]
     * @param    {any}                    obj           [description]
     * @param    {Laya.Handler}           callBack      [description]
     */
    function getInfoByInterface(interfaceName: string, obj: any, callBack: Laya.Handler): void;
    /**
     * 获取短信验证码
     * @function
     * @DateTime 2018-10-12T17:28:32+0800
     */
    function GetPhoneVerifyCode(obj: {
        phone: string;
        type: number;
    }, callBack?: Laya.Handler): void;
    function getSig(obj: any, access_key: string): string;
    /**
     * 获得玩家实名信息
     */
    function getUserIdentity(callBack: Laya.Handler): void;
    /**
     * 获取玩家联系信息
     * @function
     * @DateTime 2018-07-18T19:12:41+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    function getUserContacts(callBack: Laya.Handler): void;
    /**
     * 获得玩家登录相关的信息。包括登录账号，
     * @function
     * @DateTime 2018-10-12T11:19:53+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    function getUserLoginInfo(callBack: Laya.Handler): void;
    /** 获取代理列表
     */
    function getDailiList(callBack: Laya.Handler): void;
    /**
     * 获得兑换物品列表
     * @function
     * @DateTime 2018-07-16T14:32:43+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    function getExchangeGoodsList(callBack: Laya.Handler): void;
    /**
     * 兑换商品
     */
    function exchangeGoods(id: number, num?: number, callBack?: Laya.Handler): void;
    /**
     * 兑换商品
     */
    function exchangeCDKey(cdkey: string, callBack?: Laya.Handler): void;
    /**
     * 上传事件日志
     */
    function ApplicationEventNotify(evt: string, value: string, addData?: any, callBack?: Laya.Handler): void;
    function buyItem(buyindex: number, callBack?: Laya.Handler, num?: number): void;
    /**
     * 获得商城道具
     * @function
     * @DateTime 2018-07-19T12:07:02+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    function getShopData(callBack?: Laya.Handler): void;
    /**
     * 获取平台道具
     */
    function getPlatformMoneyMsId(callBack: Laya.Handler): void;
    /** 获得比赛相关信息 */
    function getPublicMatchInfo(callBack: Laya.Handler): void;
    /**
     * 判断是否app是否已经登录
     * @function gamelib.Api.logined
     * @author wx
     * @DateTime 2018-03-15T20:50:20+0800
     * @return   {boolean}   [description]
     */
    function logined(): boolean;
    /**
     * 登录app
     * @function gamelib.Api.login
     * @author wx
     * @DateTime 2018-03-15T20:52:08+0800
     * @param    {string}                 loginType 登录的类型，wx,qq
     * @param    {Function}               callBack  回掉
     * @param    {any}                    thisobj   [description]
     */
    function login(loginType: string, callBack: Function, thisobj: any): void;
    /**
     * 登出app
     * @function gamelib.Api.logout
     * @author wx
     * @DateTime 2018-03-15T20:53:08+0800
     * @param    {Function}               callBack 操作的回掉
     * @param    {any}                    thisobj  [description]
     */
    function logout(callBack: Function, thisobj: any): void;
    /**
     * 获得剪切版的内容。只有在app下才能使用
     * @function
     * @DateTime 2018-11-05T10:53:24+0800
     * @param    {Function}               callBack [description]
     */
    function getclipboard(callBack: Function): void;
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
    function copyToClipboard(str: any, callBack?: Function): void;
    function enterGame(parms: any): boolean;
    /** 保存app的玩家信息
     */
    function saveAppUserInfo(info: {
        nick?: string;
        icon?: string;
        gender?: number;
    }): void;
    function getAtt(attname: string): any;
    function getFunction(name: string): Function;
}
/**
 * Created by wxlan on 2017/8/28.
 */
declare namespace gamelib.core {
    /**
     * @class BaseUi_ex
     * @author wx
     * 非dialog界面.用动画的形式打开和关闭。游戏牌桌中结算用弹出框的形式，
     * 屏幕适配的时候会出问题
     *
     */
    class BaseUi_ex implements IDestroy, INet {
        /**
         * 指定获得网络数据的优先级
         * @access public
         * @type {number}
         */
        priority: number;
        /**
         * 资源的引用。
         * @access protected
         * @type {any}
         */
        protected _res: any;
        protected _clickEventObjects: Array<any>;
        /**
         * 关闭按钮
         * @access protected
         * @type {laya.ui.Button}
         */
        protected btn_close: laya.ui.Button;
        /**
         * 是否被销毁
         * @access protected
         * @type {boolean}
         */
        protected _isDestroyed: boolean;
        /**
         * @type {number} 当前的层级
         * @access public
        */
        m_layer: number;
        /**
         * 是否通知其他ui此界面的打开和关闭，主要用于大厅中关闭和显示的时候播放大厅的动画
         * @type {boolean}
         * @access protected
         */
        protected _noticeOther: boolean;
        /**
         * 点击背景的时候是否关闭此界面
         * @type {boolean}
         * @access protected
         */
        protected _closeByMaskBg: boolean;
        isClosedByCloseBtn: boolean;
        private __oldWidth;
        private __oldHeight;
        private __oldX;
        private __oldY;
        constructor(resname: string);
        /**
         * 将按钮添加到事件监听列表中。
         * 需要重写onClickObjects方法来实现点击逻辑
         * @function addBtnToListener
         * @author wx
         * @access protected
         * @DateTime 2018-03-15T20:57:24+0800
         * @param    {string}   name 按钮对象的var。注意是var，不是name
         */
        addBtnToListener(name: string): void;
        removeBtnToListener(name: string): void;
        /**
         * 接收到网络消息的处理
         * @function reciveNetMsg
         * @author wx
         * @access public
         * @DateTime 2018-03-15T20:59:01+0800
         * @param    {number}                 msgId 协议号，例如0x0001
         * @param    {any}                    data  [description]
         */
        reciveNetMsg(msgId: number, data: any): void;
        /**
         * 初始化的工作放到这个函数里面，需要重写。不要主动都调用
         * @function init
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:14:55+0800
         */
        protected init(): void;
        /**
         * 界面显示后会自动调用.不要主动都调用
         * @function onShow
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:15:32+0800
         */
        protected onShow(): void;
        /**
         * 界面关闭会自动调用。不要主动都调用
         * @function onClose
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:16:12+0800
         */
        protected onClose(): void;
        /**
         * 销毁界面。需要重写
         * @function destroy
         * @author wx
         * @access public
         * @DateTime 2018-03-16T10:16:29+0800
         */
        destroy(): void;
        /**
         * 把界面显示到舞台上。不要重写。
         * 会根据 m_layer 来设置层级;会自动给_clickEventObjects的每个对象添加监听
         * 回自动调用this.onShow();
         * @function show
         * @author wx
         * @access public
         * @DateTime 2018-03-16T10:17:08+0800
         */
        show(): void;
        /**
         * 从舞台上移除界面.回自动调用this.onClose();
         * @function close
         * @author wx
         * @access public
         * @DateTime 2018-03-16T10:18:48+0800
         */
        close(): void;
        /**
         * 舞台尺寸改变的时候的回掉。不要重写
         * @function onResize
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:19:12+0800
         * @param    {laya.events.Event}      evt [description]
         */
        protected onResize(evt?: laya.events.Event): void;
        /**
         * 按钮点击事件的回掉
         * @function onClickObjects
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:19:39+0800
         * @param    {laya.events.Event}      evt [description]
         */
        protected onClickObjects(evt: laya.events.Event): void;
        /**
         * 关闭按钮的回掉.会调用this.close();
         * @function onClickCloseBtn
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:20:15+0800
         * @param    {laya.events.Event}      evt [description]
         */
        protected onClickCloseBtn(evt: laya.events.Event): void;
        protected onDialogCloseEffect(): void;
        private doClose();
        protected onDialogShowEffect(): void;
    }
}
/**
 * Created by wxlan on 2017/9/14.
 */
declare namespace gamelib.core {
    /**
     * 弹出框管理器。laya.ui.DialogManager在Laya.stage.scaleMode = "full"模式下有bug。不能使弹出框剧中对齐
     * 不要主动调用这个类里面的任何方法。
     * @class DialogManager
     * @extends laya.ui.DialogManager
     */
    class DialogManager extends laya.ui.DialogManager {
        constructor();
        open(dialog: laya.ui.Dialog, closeOther?: boolean, showEffect?: boolean): void;
        private popupEffect1(dialog);
        private closeEffect1(dialog, type);
        private _onResize(e);
        private _centerDialog(dialog);
    }
}
/**
 * Created by wxlan on 2017/2/13.
 */
declare module gamelib.core {
    /**
     * 通过id获取玩家数据的方法。需要每个游戏单独设置一下这个方法，以确保能获取玩家数据
     * @function gamelib.core.getPlayerData
     * @author wx
     * @DateTime 2018-03-16T10:34:05+0800
     * @param    {number}   playerId 玩家的id
     * @return   {gamelib.data.UserInfo}          玩家数据
     * @access public
     */
    function getPlayerData(playerId: number): gamelib.data.UserInfo;
    /**
     * 游戏接收网络数据的管理器。游戏需要继承此类
     * @class GameDataManager
     * @author wx
     * @implements gamelib.core.INet
     *
     */
    class GameDataManager implements gamelib.core.INet {
        priority: number;
        private _bRequesCircleData;
        constructor();
        /**
         * 销毁
         * @function destroy
         * @author wx
         * @DateTime 2018-03-16T10:48:34+0800
         */
        destroy(): void;
        /**
         * 接收到网络消息
         * @function reciveNetMsg
         * @author wx
         * @DateTime 2018-03-16T10:48:14+0800
         * @param    {number}                 msgId 协议号
         * @param    {any}                    data  协议数据
         * @access public
         */
        reciveNetMsg(msgId: number, data: any): void;
        /**
         * [onShowReplay description]
         * @function
         * @DateTime 2018-04-20T15:48:49+0800
         * @param    {any}                    data [description]
         */
        protected onShowReplay(data: any): void;
        /**
         * 进入大厅。大厅场景类：game.hall.HallScene
         * @function onEnterHall
         * @author wx
         * @DateTime 2018-03-16T10:49:19+0800
         * @deprecated  目前很多游戏没有大厅了
         * @access protected
         */
        protected onEnterHall(): void;
        /**
         * 进入牌卓。大厅场景类：game.room.RoomScene
         * @function onEnterRoom
         * @author wx
         * @DateTime 2018-03-16T11:04:14+0800
         * @param    {number}                 roomId 房间号。不能为0
         * @access protected
         */
        protected onEnterRoom(roomId: number): void;
        private onGet0x007F(data);
    }
}
declare namespace gamelib.core {
    /**
     * 所有游戏入口的基类
     * 1、根据初始参数，初始舞台
     * 2、初始化游戏的各个模块
     * 3、载入游戏资源
     *
     * @class GameMain
     * @author wx
     */
    class GameMain {
        /**
         * 舞台的设计宽度
         * @type {number}
         * @default 1280
         * @access public
         */
        m_gameWidth: number;
        /**
         * 舞台的设计高度
         * @type {number}
         * @default 720
         * @access public
         */
        m_gameHeight: number;
        /**
         * 当前是否是子游戏
         * @type {boolean}
         * @access private
         */
        private _isChildGame;
        /**
         * 资源路径
         * @type {string}
         * @access private
         */
        private _ftp;
        /**
         * 游戏明，更具game_code来获取
         * @type {string}
         * @access private
         */
        private game_code;
        private game_name;
        /**
         * 当前使用的网路模块
         * @type {gamelib.core.GameNet}
         * @access private
         */
        private _net;
        /**
         * 当前使用的层级管理器
         * @type {gamelib.core.LayerManager}
         * @access private
         */
        private _layerManager;
        /**
         * 当前游戏的顶层
         * @type {laya.display.Sprite}
         * @access private
         */
        private _topLayer;
        /**
         * 资源加载器
         * @type {Resources}
         * @access private
         */
        private _resource;
        /**
         * 网络数据接收管理器,需要子类自己初始化
         * @access protected
         * @type {gamelib.core.GameDataManager}
         */
        protected _gdm: gamelib.core.GameDataManager;
        constructor();
        protected onParamsLoaded(params: any): any;
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
        protected initLaya(param: any): void;
        /**
         * 初始化游戏模块
         * @function initGame
         * @author wx
         * @DateTime 2018-03-16T11:13:08+0800
         * @param    {any}                    params [description]
         * @access protected
         */
        protected initGame(params: any): void;
        /**
         * 解决加载模式下页面嵌套子页面，子页面不显示的bug
         * @function
         * @DateTime 2019-01-09T11:16:26+0800
         * @param    {any}                    obj  [description]
         * @param    {string}                 root [description]
         * @return   {any}                         [description]
         */
        protected registerClass(obj: any, root: string, needCacheResList?: Array<string>): any;
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
        protected onResize(evt?: laya.events.Event): void;
        /**
         * 销毁游戏.由childgame调用。不要主动调用次方法
         * @function destroy
         * @author wx
         * @DateTime 2018-03-16T11:18:58+0800
         * @access public
         */
        destroy(): void;
        private static s_catchList;
        readonly resource: Resources;
        /**
         * 从主游戏进入子游戏，需要关闭主游戏的公共模块，断开主游戏的服务器，
         * 关闭主游戏的ui
         * @function close
         * @author wx
         * @DateTime 2018-03-16T11:59:23+0800
         * @access public
         */
        close(): void;
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
        reshow(jsonData?: any): void;
        /**
         * 载入游戏本身的配置文件，棋牌圈
         * @function loadGamesConfigs
         * @author wx
         * @DateTime 2018-03-16T12:03:05+0800
         * @access public
         */
        loadGamesConfigs(): void;
        /**
         * 设置游戏本身需要载入的文件,
         * @function setPreLoadingResList
         * @author wx
         * @DateTime 2018-03-16T12:03:52+0800
         * @param    {Array<any>}             arr [description]
         * @access protected
         */
        protected setPreLoadingResList(arr: Array<any>): void;
        protected onProtocolLoaded(): void;
        /**
         * 所有资源载入完成后的回掉
         * 需要创建网络模块，连接服务器
         * @function onResloaded
         * @DateTime 2018-03-16T12:04:28+0800
         * @access protected
         */
        protected onResloaded(): void;
        private playBgm();
        /**
         * 全局信号处理方法
         * @function onSignal
         * @DateTime 2018-03-16T12:05:43+0800
         * @param    {string}                 msg  [description]
         * @param    {any}                    data [description]
         */
        protected onSignal(msg: string, data: any): void;
    }
}
/**
 * Created by wxlan on 2016/1/9.
 */
declare module gamelib {
    /**
     * @class
     */
    class GameMsg {
        /**
         * @property
         * 更新玩家信息
         * @type {string}
         * @static
         */
        static UPDATEUSERINFODATA: string;
        /**
         * @property
         * 更新平台货币，(qqgame:钻石);
         * @type {string}
         * @static
         */
        static UPDATEPLATFORMICON: string;
        /**
         * @property
         * 添加到桌面
         * @type {string}
         * @static
         */
        static SENDTODESKMSG: string;
        /**
         * @property
         * 场景切换
         * @type {string}
         * @static
         */
        static SCENECHANGE: string;
        /**
         * @property
         * 开始游戏
         * @type {string}
         * @static
         */
        static STARPLAY: string;
        /**
         * @property
         * 结束游戏
         * @type {string}
         * @static
         */
        static ENDPLAY: string;
        /**
         * @property
         * 更新首冲按钮
         * @type {string}
         * @static
         */
        static UPDATE_ITEMBTN_VISIBLE: string;
        /**
         * @property
         * 游戏所有资源载入完成
         * @type {string}
         * @static
         */
        static GAMERESOURCELOADED: string;
        /**
         * @property
         * 游戏重连
         * @type {string}
         * @static
         */
        static RECONNECT: string;
    }
}
declare module gamelib.core {
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
    class GameNet {
        private _currentIp;
        private _otherIp;
        private _otherGz_id;
        private _mainIp;
        private _bC2;
        _needConnectOther: boolean;
        private _listeners;
        private _socket;
        private _reconnect_count;
        private _bReconnecting;
        m_reconnectPolicy: number;
        private _lastPingTime;
        private _ping_grap;
        private server_url;
        m_signal: gamelib.core.Signal;
        private _name;
        private _send0x00B6;
        private _isChild;
        constructor(name: string, isChild: boolean);
        private createSocket();
        destroy(): void;
        show(): void;
        close(): void;
        private reconnect();
        addListener(target: INet): void;
        removeListener(target: INet): void;
        readonly socket: gamelib.socket.NetSocket;
        readonly name: string;
        private onConnected(evt);
        private onServerError(evt);
        private onServerClose(evt);
        private ping();
        /**
         * 重新连接，需要重新获取分区信息
         * @function
         * @DateTime 2018-05-08T10:28:22+0800
         */
        private reconnectByInof();
        private onGetGame_zone_info(ret);
        onLoginServer(): void;
        private connectOther(bc3);
        /**
         * @function connectSever
         * 连接服务器
         * @param type 0:按照正常登陆，1:主服务器，2：其他服务器
         *
         */
        connectSever(type: number): void;
        updatePlayerInfoToServer(): void;
        private onGetNetMsg(data);
        private reciveNetMsg(msgId, data);
        private onLoginResult(data);
    }
}
declare namespace gamelib.base {
    class GamesInfo {
        private _versionInfo;
        constructor();
        setGameVersion(game_code: string, ver: string): void;
        getGameVersion(game_code: string): string;
        getUrlContainVersionInfo(url: string): string;
    }
}
/**
 * @global
 * loading界面
 * @type {gamelib.loading.LoadingModule}
 */
declare var g_loading: gamelib.loading.LoadingModule;
/**
 * 全局信号对象
 * @global
 * @type {gamelib.core.Signal}
 */
declare var g_signal: gamelib.core.Signal;
/**
 * 网络模块
 * @global
 * @type {gamelib.core.GameNet}
 */
declare var g_net: gamelib.core.GameNet;
/**
 * ui管理器
 * @global
 * @type {gamelib.core.UiMainager}
 */
declare var g_uiMgr: gamelib.core.UiMainager;
/**
 * 子游戏模块，控制子游戏的进入与退出
 * @type {gamelib.childGame.ChildGame}
 * @global
 */
declare var g_childGame: gamelib.childGame.ChildGame;
/**
 * 主游戏入口实例
 * @type {gamelib.core.GameMain}
 * @global
 */
declare var g_gameMain: gamelib.core.GameMain;
/**
 * 棋牌圈公共模块
 * @type {gamelib.common.QpqCommonModule}
 * @global
 */
declare var g_qpqCommon: gamelib.common.QpqCommonModule;
/**
 * 层级管理
 * @type {gamelib.core.LayerManager}
 * @global
 */
declare var g_layerMgr: gamelib.core.LayerManager;
/**
 * 顶层容器
 * @type {laya.display.Sprite}
 * @global
 */
declare var g_topLayaer: laya.display.Sprite;
/**
 * 网络数据配置文件数据
 * @type {gamelib.data.NetConfigDatas}
 * @global
 */
declare var g_net_configData: gamelib.data.NetConfigDatas;
/**
 * 声音管理器
 * @type {gamelib.core.SoundManager}
 * @global
 */
declare var g_soundMgr: gamelib.core.SoundManager;
/**
 * 自定义弹框管理器
 * @type {gamelib.core.DialogManager}
 * @global
 */
declare var g_dialogMgr: Laya.DialogManager;
/**
 * 资源载入器
 * @type {gamelib.core.MyLoaderManager}
 * @global
 */
declare var g_loaderMgr: gamelib.core.MyLoaderManager;
/**
 * 动画控制器
 * @type {gamelib.control.Animation}
 * @global
 */
declare var g_animation: gamelib.control.Animation;
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
declare var g_scaleRatio: number;
/**
 * 缩放是以哪个方向为标准，如果是x则x，y方向的保持缩放比缩放，y方向要拉伸剩余的尺寸
 * @type {string}
 */
declare var g_scaleXY: string;
/**
 * 按钮音效
 * @global
 * @type {string}
 * @default "button"
 */
declare var g_buttonSoundName: string;
/**
 * 关闭按钮音效
 * @type {string}
 * @global
 * @default "close"
 */
declare var g_closeUiSoundName: string;
declare var g_gamesInfo: gamelib.base.GamesInfo;
/**
 * 协议文件类型
 * @type {string}
 */
declare var g_protocols_type: string;
/**
 * 平台数据
 * @type {any}
 * @global
 */
declare var g_platformData: any;
/**
 * @function
 * 获取当前游戏对应的样式id
 * @return {number} [description]
 */
declare function getStyleIndex(): number;
/**
 * @function
 * 获得当前游戏样式的前缀路径
 * @return {string} [description]
 */
declare function getStylePath(): string;
/**
 * 发送协议
 * @function sendNetMsg
 * @DateTime 2018-03-16T12:27:54+0800
 * @param    {number}                 msgId   [description]
 * @param    {type}                 ...args [description]
 */
declare function sendNetMsg(msgId: number, ...args: any[]): void;
/**
 * 播放按钮音效
 * @global
 * @function playButtonSound
 * @DateTime 2018-03-16T12:28:12+0800
 */
declare function playButtonSound(): void;
/**
 * 获取服务器登录后到当前调用时消耗的时间
 * @function
 * @DateTime 2018-04-23T15:35:53+0800
 * @return   {number}                 [description]
 */
declare function getTimer(): number;
/**
 * 播放游戏音效
 * @global
 * @function playSound_qipai
 * @DateTime 2018-03-16T12:28:35+0800
 * @param    {string}                 name     音效名
 * @param    {number} [loops= 1]     播放次数
 * @param    {laya.utils.Handler}     complete 播放完成的回掉
 */
declare function playSound_qipai(name: string, loops?: number, complete?: laya.utils.Handler, isCommon?: boolean): void;
/**
 * 停止音效
 * @global
 * @function stopSound_qipai
 * @DateTime 2018-03-16T12:29:47+0800
 * @param    {string}                 name [description]
 */
declare function stopSound_qipai(name: string): void;
/**
 * @global
 * @function getChildByName
 * 获取容器中的指定名字的节点
 * @param target
 * @param name  "box.box1.txt_id"
 * @returns {any}
 */
declare function getChildByName(target: laya.display.Node, name: string): any;
declare var s_lanConif: any;
declare function getDesByLan(des: string): string;
declare function getGameResourceUrl(res: string, game_code?: string): string;
declare function getCommonResourceUrl(res: string): string;
declare function getGame_zone_info(game_code: string | number): any;
declare function navigateToURL(url: string): void;
/**
 * Created by wxlan on 2017/9/4.
 */
declare namespace gamelib.core {
    /**
     * @interface INet
     * 可以接受网络数据的接口
     */
    interface INet {
        priority: number;
        reciveNetMsg(msgId: number, data: any): void;
    }
    /**
     * @interface IDestroy
     * 可以消耗的接口
     */
    interface IDestroy {
        destroy(): void;
    }
}
/**
 * Created by wxlan on 2017/9/2.
 */
declare namespace gamelib.core {
    /**
     * 层级管理器
     * @class
     * @extends    laya.display.Sprite
     */
    class LayerManager extends laya.display.Sprite {
        private _layers;
        constructor();
        /**
         * 获得指定层级的容器
         * @function getContainerByLayer
         * @DateTime 2018-03-16T13:42:45+0800
         * @param    {number}                 layer [description]
         * @return   {laya.display.Sprite}          [description]
         * @deprecated 用对象的zOrder来替代
         */
        getContainerByLayer(layer: number): laya.display.Sprite;
        debug(): void;
    }
}
declare namespace gamelib.core {
    /**
     * 游戏资源载入管理.
     * html模式下，或有版本号。app模式下，没有版本号
     *
     * @class MyLoaderManager
     */
    class MyLoaderManager {
        constructor();
        /**
         * 设置游戏的版本信息
         * @function setGameVer
         * @DateTime 2018-03-16T13:45:54+0800
         */
        setGameVer(): void;
        load3DObjs(params: {
            url: any;
            group?: string;
            complete?: Laya.Handler;
            progress?: Laya.Handler;
            atlas_pngLoaded?: boolean;
        }): any;
        /**
         * 载入资源 load
         * @function
         * @DateTime 2018-03-16T13:46:37+0800
         * @param    {any}  params 包含以下属性:url:string|Array<any>,type:string,group:string,complete:Laya.Handler
         *                   progress:Laya.Handler
         * @return   {any}                           [description]
         * @access public
         */
        load(params: {
            url: any;
            type?: string;
            group?: string;
            complete?: Laya.Handler;
            progress?: Laya.Handler;
            atlas_pngLoaded?: boolean;
        }): any;
        /**
         * 载入字体文件
         * @function loadFonts
         * @param {Array<any>}   fonts    [description]
         * @param {Laya.Handler} complete [description]
         * @access public
         */
        loadFonts(fonts: Array<any>, complete?: Laya.Handler): void;
        /**
         * 卸载游戏中的字体
         * @function unregisterFont
         * @DateTime 2018-03-16T13:49:09+0800
         * @param    {Array<any>}             fonts [description]
         * @access public
         */
        unregisterFont(fonts: Array<any>): void;
    }
}
/**
 * Created by wxlan on 2017/9/5.
 */
declare namespace gamelib.core {
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
    class Resources {
        private _ftp;
        private game_code;
        private _complete;
        private _progress;
        private _preLoadingResList;
        private _fonts;
        private _gameMain;
        private _step;
        private _isChildGame;
        private _styleIndex;
        private _configResourceList;
        private _needCacheResList;
        private _pro_complete;
        constructor(complete: Laya.Handler, gameMain: GameMain, pro_complete: Laya.Handler);
        ftp: string;
        preLoadingResList: Array<any>;
        /**
         * 解决加载模式下页面嵌套子页面，子页面不显示的bug
         * @function
         * @DateTime 2019-01-09T11:16:26+0800
         * @param    {any}                    neewCacheResList  [description]
         */
        setCatcheResourceList(needCacheResList: Array<string>): void;
        start(isChildGame: boolean, game_code: string): void;
        /**
         * 从子游戏回到主游戏后，需要重新把主游戏的ui配置设置到laya里面
         * @function reshow
         * @DateTime 2018-03-16T13:50:39+0800
         * @access public
         */
        reshow(): void;
        /**
         * 注册游戏要用到的字体文件
         * @function
         * @DateTime 2018-03-16T13:56:41+0800
         * @access public
         */
        registrerFont(): void;
        destroy(): void;
        next(): void;
        /**
         * 载入ui.json文件
         * @function loadUiJson
         * @DateTime 2018-03-16T13:53:01+0800
         * @access private
         */
        private loadUiJson();
        /**
         * ui.json文件载入完成。
         * @function onUiConfigLoaded
         * @DateTime 2018-03-16T13:53:18+0800
         * @param    {any}                    data [description]
         * @access private
         */
        private onUiConfigLoaded(data);
        /**
         * 载入loading相关文件
         * @function loadLoadingRes
         * @DateTime 2018-03-16T13:53:43+0800
         * @access private
         */
        private loadLoadingRes();
        /**
         * loading载入完成
         * @function onLoadingLoaded
         * @DateTime 2018-03-16T13:57:18+0800
         * @access private
         */
        private onLoadingLoaded();
        /**
         * 载入公共配置文件
         * @function loadCommonConfigs
         * @DateTime 2018-03-16T13:57:40+0800
         * @access private;
         */
        private loadCommonConfigs();
        protected onCommonLoaded(): void;
        /**
         * 载入res.json文件
         * @function loadResJson
         * @DateTime 2018-03-16T13:58:27+0800
         * @access private;
         */
        private loadResJson();
        /**
         * res.json文件载入完成.
         * @function onUnpackLoaded
         * @DateTime 2018-03-16T13:58:45+0800
         * @param    {any}                    res [description]
         */
        private onUnpackLoaded(res);
        private loadeResources(arr);
        clearConfigResource(): void;
        /**
         * 载入字体
         * @function
         * @DateTime 2018-03-16T13:59:19+0800
         */
        private loadFont();
        /**
         * 载入shop.php文件
         * @function loadPhpInfos
         * @DateTime 2018-03-16T13:59:30+0800
         */
        protected loadPhpInfos(): void;
        private onShopLoaded(data);
        /**
         * 游戏资源加载进度
         * @function onProgress
         * @DateTime 2018-03-16T13:59:48+0800
         * @param    {number}                 progress [description]
         */
        onProgress(progress: number): void;
        private getVerStr();
    }
}
/**
 * Created by wxlan on 2017/9/4.
 */
declare namespace gamelib.core {
    class Scene extends laya.display.Sprite implements gamelib.core.IDestroy {
        private _containerList;
        constructor();
        onEnter(): void;
        onExit(): void;
        destroy(): void;
    }
}
declare module gamelib.core {
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
    class Signal {
        private _listenerList;
        constructor();
        /**
         * 添加监听
         * @function add
         * @param {function} listener
         * @param {any} caller
         */
        add(listener: Function, caller: any): void;
        /**
         * 是否已经有监听了
         * @function add
         * @param {function} listener
         * @param {any} caller
         * @returns {boolean}
         */
        hasListener(listener: Function, caller: any): boolean;
        /**
         * 移除监听
         * @function remove
         * @param {function} listener
         */
        remove(listener: Function, caller?: any): void;
        /**
         * 指定优先级来添加监听
         * @function addWithPriority
         * @param {function} listener
         * @param {any} caller
         * @param {number} priority值越大，越先调用
         */
        addWithPriority(listener: Function, caller: any, priority: number): void;
        /**
         * 发送事件
         * @function dispatch
         * @param args
         */
        dispatch(...args: any[]): void;
    }
}
/**
 * Created by wxlan on 2017/9/11.
 */
declare namespace gamelib.core {
    /**
     * @class
     * 声音管理器
     */
    class SoundManager {
        private _bgmList;
        m_lastBgmPlayTime: number;
        _waitConfig: boolean;
        private _bSound;
        private _bMusic;
        private _type;
        private _bgmSoundChannel;
        constructor();
        /**
         * 是否开启音效
         * @DateTime 2018-03-16T14:09:26+0800
         * @type    {boolean}
         */
        m_sound: boolean;
        /**
         * 是否开启背景音乐
         * @DateTime 2018-03-16T14:10:12+0800
         * @type    {boolean}
         */
        m_music: boolean;
        /**
         * 背景音乐音量小 在录音的时候会用
         * @function
         * @DateTime 2018-03-16T14:10:33+0800
         */
        volume_normal(): void;
        /**
         * 背景音乐音量恢复正常
         * @function
         * @DateTime 2018-03-16T14:11:22+0800
         */
        volume_small(): void;
        /**
         * 播放声音
         * @function
         * @DateTime 2018-03-16T14:11:59+0800
         * @param    {string}  name     声音文件名。如button
         * @param    {number}  loops    播放次数，默认播1次，0为循环播放
         * @param    {laya.utils.Handler}     complete 播放完成后的回掉
         */
        playSound(name: string, loops?: number, complete?: laya.utils.Handler, isCommon?: boolean): void;
        /**
         * 停止播放
         * @function
         * @DateTime 2018-03-16T14:13:41+0800
         * @param    {string}                 name [description]
         */
        stopSound(name: string, isCommon?: boolean): void;
        /**
         * 当前是否在等待配置文件
         * @DateTime 2018-03-16T14:14:09+0800
         * @type {boolean}
         */
        m_waitConfig: boolean;
        /**
         * 播放背景音乐
         * @function
         * @param {any} index 如果为number，播放指定的序号。如果为array,则循环播放列表中的
         */
        playBgm(name: any): void;
        /**
         * 暂停背景音乐
         * @function
         * @DateTime 2018-03-16T14:15:35+0800
         * @deprecated 使用laya.media.SoundManager.autoStopMusic 来代替了
         */
        pauseAll(): void;
        /**
         * 恢复背景音乐
         * @function
         * @DateTime 2018-03-16T14:15:55+0800
         * @deprecated 使用laya.media.SoundManager.autoStopMusic 来代替了
         */
        resumesAll(): void;
        /**
         * 背景音乐播放完成
         * @function
         * @DateTime 2018-03-16T14:19:04+0800
         * @param    {number}                 index [description]
         */
        private onBgmPlayEnd(index);
        /**
         * 获得背景音乐的资源地址
         * @function
         * @DateTime 2018-03-16T14:19:16+0800
         * @param    {number}                 index [description]
         * @return   {string}                       [description]
         */
        private getBgmUrl(index);
    }
}
/**
 * Created by wxlan on 2017/8/29.
 */
declare namespace gamelib.core {
    /**
     * ui管理器。管理 pmd,邮件，设置，商城，miniloading，聊天界面，提示框，提示文本等界面
     * 要打开这些界面,可以调用g_singnal.dispatch("msgName",data)或者直接调用对应的方法
     * 常用的msgName有:
     * showSetUi,showShopUi,showHelpUi,showChatUi,showQpqLoadingUi,closeQpqLoadingUi
     * closeEnterGameLoading,showBugleUi
     *
     * @class UiMainager
     */
    class UiMainager {
        m_pmd: gamelib.alert.Pmd;
        private _mailUi;
        private _setUi;
        private _shopUi;
        private _chat;
        m_temp_ui: gamelib.core.BaseUi;
        private _alertList;
        private _tip_list;
        private _waring_tip_list;
        showUi: gamelib.core.BaseUi;
        constructor();
        showMaskLoading(): loading.MaskLoading;
        closeMaskLoading(): void;
        private onDialogOpen(evt);
        private onDialogClose(evt);
        private onSignal(msg, data);
        /**
         * 打开帮助ui
         * @function showHelpUi
         * @DateTime 2018-03-16T14:25:07+0800
         * @param    {number}  index [要显示的帮助文件在平台配置中的序号]
         */
        showHelpUi(index: any): void;
        /**
         * 打开设置界面
         * @function openSetUi
         * @DateTime 2018-03-16T14:28:26+0800
         */
        openSetUi(): void;
        /**
        * 打开商城
        *  @type:0:钻石，1金币，2vip
        */
        openShop(type?: number): void;
        /**
         * 打开邮件
         * @function openMail
         * @DateTime 2018-03-16T14:29:11+0800
         */
        openMail(): void;
        /**
         * 关闭小loading
         * @function closeMiniLoading
         * @DateTime 2018-03-16T14:29:22+0800
         */
        closeMiniLoading(): void;
        /**
         * 打开小转圈
         * @function showMiniLoading
         * @DateTime 2018-03-16T14:29:38+0800
         * @param    {any}}    args [一个对象，msg:string,需要显示的文本
         *                           delay:number自动关闭的时间，秒为单位
         *                           alertMsg:string关闭时的提示文本，
         *                           callBack：function关闭时的回掉]
         */
        showMiniLoading(args?: {
            msg?: string;
            delay?: number;
            alertMsg?: string;
            callBack?: () => void;
            thisObj?: any;
        }): void;
        /**
         * 显示没有关闭按钮的提示框
         * @function showAlert_NoClose
         * @DateTime 2018-03-16T14:31:57+0800
         * @param    {string}                 msg [description]
         */
        showAlert_NoClose(msg: string): void;
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
        showAlertUiByArgs(args: {
            msg: string;
            callBack?: (type: number) => void;
            thisObj?: any;
            okLabel?: string;
            cancelLabel?: string;
            autoCall?: number;
            type?: number;
        }): gamelib.alert.AlertUi;
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
        showConfirmUiByArgs(args: {
            msg: string;
            callBack?: (type: number) => void;
            thisObj?: any;
            okLabel?: string;
            cancelLabel?: string;
        }): void;
        onAlertUiClose(alert: gamelib.alert.AlertUi): void;
        private _tip;
        /**
         * 显示提示文本。通常是在屏幕中间浮起一个文本，几秒后自动消失
         * @function showTip
         * @DateTime 2018-03-16T14:34:17+0800
         * @param    {string}                 msg []
         * @param    {boolean} [isWarning = false] [是否是警告，警告是红色]
         * @param    {number}  [effectType = 1]  [动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失]
         */
        showTip(msg: string, isWarning?: boolean, effectType?: number): void;
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
        showTip_ex(arg: {
            msg: string;
            x?: number;
            y?: number;
            color?: string;
            size?: number;
            time?: number;
        }): void;
        private getEffectTip(isWarning, create?);
        private showTipsEffect(str, effectType, isWarning);
        /**
         * 购买道具提示框
         * @function buyItemAlert
         * @param buyIndex
         * @param msg
         */
        buyItemAlert(buyIndex: number, msg?: string): void;
        /**
         * function showPMD
         * @param msg
         */
        showPMD(msg: string): void;
        pmd_LaBa(msg: string): void;
        private getAlertUi();
    }
}
/**
 * Created by wxlan on 2016/9/20.
 */
declare module gamelib.core {
    /**
     * 可以接收网络数据的协议
     * @class Ui_NetHandle
     * @extends  gamelib.core.BaseUi
     * @implements INet
     */
    class Ui_NetHandle extends BaseUi implements INet {
        /**
         * 指定获得网络数据的优先级
         * @access public
         * @type {number}
         */
        priority: number;
        constructor(resname?: string);
        destroy(): void;
        /**
         * 接收到网络消息的处理
         * @function reciveNetMsg
         * @author wx
         * @access public
         * @DateTime 2018-03-15T20:59:01+0800
         * @param    {number}                 msgId 协议号，例如0x0001
         * @param    {any}                    data  [description]
         */
        reciveNetMsg(msgId: number, data: any): void;
        /**
         * 界面显示后会自动调用.不要主动都调用。同时会注册网络监听
         * @function onShow
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:15:32+0800
         */
        protected onShow(): void;
        /**
         * 界面关闭会自动调用。不要主动都调用 同时会移除网络监听
         * @function onClose
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:16:12+0800
         */
        protected onClose(): void;
    }
}
declare namespace gamelib.chat {
    class Bubble {
        private _bg;
        private _align;
        private _boder;
        private _spr;
        private _color;
        private _res;
        private _oldY;
        private _timeLine;
        constructor(res: any);
        destroy(): void;
        setMsg(netData: any): void;
        private getFaceRes(id);
        private onShowEnd(timeLine);
        private clearSpr();
    }
}
/**
 * Created by wxlan on 2017/1/14.
 */
declare module gamelib.chat {
    /**
     * 聊天泡泡.需要把所有玩家的泡泡资源传过来
     * @class ChatBubble
     */
    class ChatBubble {
        private static _instance;
        /**
         * @static
         * @property s_instance
         */
        static readonly s_instance: ChatBubble;
        constructor();
        private _list;
        private _enabled;
        init(arr: Array<any>): void;
        enabled: boolean;
        /**
         * 显示消息，用指定的资源
         * @function
         * @DateTime 2018-03-17T13:48:32+0800
         * @param    {any}                    res [description]
         * @param    {string}                 msg [description]
         */
        showMsgByRes(res: any, msg: string): void;
        /**
         * 显示消息，通过传如的位置号
         * @function
         * @DateTime 2018-03-17T13:48:56+0800
         * @param    {number}                 localSeat [description]
         * @param    {string}                 msg       [description]
         */
        showMsg(localSeat: number, msg: string): void;
        private onShowEnd(res, timeLine);
    }
}
declare module gamelib.chat {
    /**
     * 聊天窗口，包含 快捷聊天，表情、聊天窗口
     * 快捷聊天的数据通过GameVar.g_platformData["quick_talk"]设置
     * 这个配置列表元素可以为字符串。也可以为obj对象
     * @class  ChatPanel
     *
     */
    class ChatPanel extends gamelib.core.BaseUi {
        private static _instance;
        static readonly s_instance: ChatPanel;
        static destroy(): void;
        /**
         * 发送消息类型，0：普通，1：弹幕
         * @type {number}
         */
        m_sendType: number;
        /**
         * 当前是否可发送，发送有个时间间隔
         * @type {boolean}
         * @access private
         */
        private _isSendCd;
        private _tab;
        private _quickTalkList;
        private _face;
        private _histroy;
        private _sendBox;
        private _sendBtn;
        private _input_txt;
        private _inputEnabled;
        private _expressionEanbled;
        /**
         * 消息历史记录的条数 默认为50条
         * @type {number}
         */
        private _histroy_ds_totalNum;
        private _oldItems;
        private _configs;
        constructor();
        protected init(): void;
        onShow(): void;
        onClose(): void;
        private onTabChange(evt?);
        /**
         * 输入框是否可用.默认是不可用
         * @function setInputEnabled
         * @param {boolean} value [description]
         */
        setInputEnabled(value: boolean): void;
        /**
         * 设置 表情是否可用
         * @function
         * @DateTime 2018-05-08T15:43:28+0800
         * @param    {boolean}                value [description]
         */
        setExpressionEanbled(value: boolean): void;
        private updateItems();
        private onListRender(cell, index);
        private onHistroyListRender(cell, index);
        private onTextInput(evt);
        /**
         *
         * 发送消息
         * @param evt
         */
        private onSend(evt);
        /**
         * 发送快捷聊天
         * @param evt
         */
        private onSelectQuickTalk(evt);
        /**
         * 发送表情
         * @param evt
         */
        private onTouchFaceBtn(evt);
        private clearCd();
        private checkCanSend();
        /**
         * 发送表情函数
         * @param index
         */
        sendFaceFunction(index: number): void;
        /**
         * 发送聊天函数
         * @param type:2:输入聊天，4：快捷聊天
         */
        sendChatFunction(type: number, msg: string): void;
        /**
         * 发送弹幕函数
         */
        sendDanmuFunction(type: number, msg: string): void;
        getMsgByNetData(data: any): string;
        addMsg(user: data.UserInfo, msg: string): void;
        /**
         * 通过序号获取快捷聊天消息
         * @function
         * @DateTime 2018-05-04T11:44:22+0800
         * @param    {number}                 index [description]
         * @return   {string}                       [description]
         */
        getQuickTalkByIndex(index: number): string;
        onData0x0074(user: data.UserInfo, obj: any): any;
        /**
         * 弹幕
         * @param obj
         * @param user
         */
        onData0x0076(obj: any, user: data.UserInfo): void;
    }
    class TalkItem extends laya.ui.Box {
        private _head;
        private txt_name;
        private txt_msg;
        private _img_bg;
        private _isSelf;
        private _isSystem;
        private _headSize;
        private _systemHeight;
        private _bgSizeGrid;
        constructor();
        setData(user: gamelib.data.UserInfo, msg: string, width: number): void;
        private updateSize();
        private build();
    }
}
declare namespace gamelib.chat {
    var s_face_alias: string;
    function parseMsg(msg: string): Array<any>;
    function getQuickTalkByIndex(index: number): {
        msg: string;
        sound: string;
        checkSex: boolean;
    };
    class ChatSystem_BR implements gamelib.core.INet {
        private _res;
        private _input;
        priority: number;
        private _danmu;
        private _danmuToggle;
        constructor(res: any);
        readonly danMu: DanMu;
        show(): void;
        close(): void;
        reciveNetMsg(msgId: number, data: any): void;
        destroy(): void;
        setBubbles(arr: Array<Laya.Component>): void;
        private onDanMuToggle();
    }
}
declare module gamelib.chat {
    /**
     *@class DanMu
     *
     */
    class DanMu {
        private _minY;
        private _maxY;
        private _list;
        private _speed;
        private _enable;
        private _height;
        private _postions;
        private _grap;
        constructor();
        initArea(minY: number, maxY: number): void;
        destroy(): void;
        enable: boolean;
        onGetMsg(msg: string, isVip: boolean, isSelf: boolean): void;
        onGetMsgByUser(user: gamelib.data.UserInfo, msg: string): void;
        private addItem(item, yIndex);
        private getY(index);
        private update(dt);
    }
    class DanMuItem extends Laya.Sprite {
        private _msg;
        private _bg;
        m_index: number;
        private _zOrders;
        constructor();
        createTextField(msg: string, color: string, isBorder?: boolean): Laya.Text;
        readonly width: number;
        readonly height: number;
        destroy(): void;
        /**
         * vip:有背景、头像框背景、头像、vip图标
         * 非vis:头像，
         * @function
         * @DateTime 2018-08-28T11:06:45+0800
         * @param    {string}                 msg  [description]
         * @param    {gamelib.data.UserInfo}  user [description]
         */
        createByUser(msg: string, user: gamelib.data.UserInfo): void;
        private buildMsg(msg, color);
    }
}
declare namespace gamelib.chat {
    class DanMuUi implements gamelib.core.INet {
        private _danmu;
        private _danmuToggle;
        priority: number;
        private _pmd;
        constructor(cb: Laya.CheckBox, pmdRes: any);
        enabled: boolean;
        addPmd(msg: string): void;
        destroy(): void;
        private onDanMuToggle();
        reciveNetMsg(msgId: number, data: any): void;
    }
}
/**
 * Created by wxlan on 2017/1/14.
 *
 */
declare module gamelib.chat {
    /**
     * 显示表情.需要把美术资源提供的表情图标传过来
     * @class Face
     */
    class Face {
        private static _instance;
        static readonly s_instance: Face;
        private _pos_list;
        constructor();
        /**
         * 设置表情图标列表
         * @function initPos
         * @DateTime 2018-03-17T13:54:45+0800
         * @param    {Array<any>}             arr [description]
         */
        initPos(arr: Array<any>): void;
        /**
         * 显示指定id的表情到指定的容器里面
         * @function showFaceToPos
         * @DateTime 2018-03-17T13:55:07+0800
         * @param    {number}                 id     [description]
         * @param    {Laya.Box}               parent [description]
         */
        showFaceToPos(id: number, parent: Laya.Box): void;
        /**
         * 在指定座位号处显示表情
         * @function
         * @DateTime 2018-03-17T13:55:36+0800
         * @param    {number}                 id        [description]
         * @param    {number}                 localSeat [description]
         */
        showFace(id: number, localSeat: number): void;
        private getFaceRes(id);
        private onPlayEnd(face);
    }
}
declare namespace gamelib.chat {
    class Input {
        private _faceG;
        private _quickG;
        private _faceList;
        private _quickTalkList;
        private _quickTalkIndex;
        private _faceBtn;
        private _quickTalkBtn;
        private _sendBtn;
        private _input_txt;
        private _cd;
        private _lastSendTime;
        constructor(res: any);
        destroy(): void;
        show(): void;
        close(): void;
        private onTextInput(evt);
        private onFaceRender(box, index);
        private onQuickRender(cell, index);
        private onFaceSelected(index);
        private onQuickSelected(index);
        private onClickQuickBtn(evt);
        private onClickFaceBtn(evt);
        private onClickSendBtn(evt);
        private checkCD();
        private onClickStage(evt);
    }
}
declare namespace gamelib.chat {
    /**
     *    世界聊天数据(所有游戏通用)
     */
    class WorldChatData {
        private static _instance;
        static readonly s_instance: WorldChatData;
        m_worldTakeData: Array<any>;
        m_roomTakeData: Array<any>;
        m_maxRoomDataNum: number;
        m_maxWorldDataNum: number;
        /**
         *    解析数据
         */
        onAnalysisData(data: any): void;
        /**
         *    添加跑马灯信息
         *   data.PID        // PID（玩家PID(系统是0)）
         *   data.headUrl    // 头像
         *   data.nickName   // 昵称
         *   data.sign       // 标志(0表示文字 1表示表情)
         *   data.content    // 消息内容
         *   data.level      // 等级
         */
        addPMDData(msg: string): void;
        /**
         *    清理房间聊天数据
         */
        clearRoomTakeData(): void;
        /**
         * 发送消息失败结果
         * @param reult
         */
        private sendResult(reult);
    }
    /**
     *    世界聊天(公共)
     */
    class WorldChat extends gamelib.core.Ui_NetHandle {
        private _tab;
        private _takeList;
        private _btnSend;
        /******世界聊天*******/
        private _boxWorld;
        private _textInputWorld;
        private _txtLaBa;
        /*******房间聊天******/
        private _boxRoom;
        private _textInputRoom;
        private _btnFace1;
        private _btnFace2;
        private _imgFace;
        private _faceList;
        private _curFaceType;
        private _selectIndex1;
        private _selectIndex2;
        private _lastSendTime_world;
        private _lastSendTime_face;
        private _curMsgPosY;
        private _maxShowData;
        private _typeNumber;
        constructor();
        /**
         * 初始化
         */
        protected init(): void;
        /**
        * 界面显示
        */
        protected onShow(): void;
        protected onTabChange(evt?: laya.events.Event): void;
        protected showWorldChat(): void;
        protected showRoomChat(): void;
        /**
         * 界面关闭
         */
        protected onClose(): void;
        /**
         * 销毁
         */
        destroy(): void;
        reciveNetMsg(msgId: number, data: any): void;
        /**
         *    显示聊天内容
         */
        private showTalkData(data);
        /**
         *    添加聊天记录
         */
        private addTalkData(data);
        /**
         *    重新计算聊天记录的位置
         */
        private recountChildrenPosY();
        private onFaceListRender(item, index);
        /**
         *
         * 发送消息
         * @param evt
         */
        private onSend(evt);
        /**
         *
         * 显示表情列表
         * @param evt
         */
        private onFaceList(evt);
        /**
         * 发送表情函数
         * @param index
         */
        sendFaceFunction(index: number): void;
    }
    /**
     *    聊天内容
     */
    class TalkItem_World extends Laya.Box {
        private _head;
        private _militaryRank;
        private _name;
        private _msg;
        private _face;
        private _bg;
        private _isSelf;
        private _isSystem;
        private _headSize;
        private _MRWidth;
        private _MRHeight;
        private _msgMaxWidth;
        private _faceSize;
        private _showType;
        private _bgSizeGrid;
        constructor();
        /**
         * 设置要显示的内容
         * @ data 显示的内容数据
         * @ width 宽度
         * @ msgMaxWidth 消息字符最多显示的宽度
         */
        setData(data: any, width: number, msgMaxWidth: number): void;
        private getFaceRes(id);
        private updateSize();
        private build();
        private getMsgWidth(label);
        private getMsgHeight(label, width);
    }
}
declare namespace gamelib.chat {
    class WorldChatZoo implements gamelib.core.INet {
        private _res;
        private _textInput;
        private _btnSend;
        private _takeList;
        private _needClose;
        private _curMsgPosY;
        private _maxShowData;
        private _msgMaxWidth;
        constructor(res: any, needClose?: boolean);
        priority: number;
        /**
         * 初始化
         */
        protected init(): void;
        /**
         * 设置文字显示的最大宽度
        */
        setMsgMaxWidth(width: number): void;
        /**
         * 获取文字显示的最大宽度
        */
        getMsgMaxWidth(width: number): number;
        /**
        * 界面显示
        */
        show(): void;
        /**
         * 界面关闭
         */
        close(): void;
        onClickStage(evt: Laya.Event): void;
        private isChild(target, container);
        /**
         * 销毁
         */
        destroy(): void;
        /**
         *    接受网络协议
         */
        reciveNetMsg(msgId: number, data: any): void;
        /**
         *
         * 发送消息
         * @param evt
         */
        private onSend(evt);
        /**
        *    显示聊天内容
        */
        private showTalkData(data);
        /**
         *    添加聊天记录
         */
        private addTalkData(data);
        /**
         *    重新计算聊天记录的位置
         */
        private recountChildrenPosY();
    }
}
declare module gamelib.childGame {
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
    class ChildGame implements core.INet {
        priority: number;
        private _web;
        private _enterGameGz_idByClient;
        private _validation;
        private _game_args;
        private _selfIsMainGzid;
        private _gzIdToGameId;
        private _quitGame;
        private _enterGame;
        readonly m_web: WebDataHander;
        constructor();
        /**
         * @function quitChild
         * 返回棋牌圈
         * @param jsonData
         */
        toCircle(jsonData?: any): void;
        /**
         * @function quitChild
         * 退出子游戏。
         * 1、先销毁子游戏。
         * 2、销毁子游戏的数据
         * 3、重新显示主游戏
         *
         * @param {any} jsonData [description]
         */
        quitChild(jsonData?: any): void;
        /**
         * 指定分区游戏是否是laya开发
         * @function addGameIdConfig
         * @DateTime 2018-03-17T13:59:13+0800
         * @param    {number}                 gz_id      [description]
         * @param    {number}                 gameId     [description]
         * @param    {boolean}                isLayaGame [description]
         */
        addGameIdConfig(gz_id: number, gameId: number, isLayaGame: boolean): void;
        /**
         * 主要处理0x0014协议
         * data.type == 0 表示进入data.gameId的游戏
         * data.type == 1 表示退出data.gameId的游戏
         * @function
         * @DateTime 2018-03-17T13:59:56+0800
         * @param    {number}                 msgId [description]
         * @param    {any}                    data  [description]
         */
        reciveNetMsg(msgId: number, data: any): void;
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
        enterGameByClient(gz_id: number, selfIsMain?: boolean, validation?: string, game_args?: any): void;
        /**
         * 进入比赛
         * @function
         * @DateTime 2018-06-07T19:34:15+0800
         */
        enterMatch(gz_id: number, matchId: number, bSendNetMsg?: boolean): void;
        /**
         * 观战
         * @function
         * @DateTime 2018-06-07T19:34:10+0800
         */
        guanZhan(gz_id: number, matchId: number, deskId: number): void;
        /**
         * 清理游戏缓存的登录信息
         * @function
         * @DateTime 2018-06-28T11:40:58+0800
         * @param    {number}                 gz_id [description]
         */
        clearGameInfo(gz_id: number): void;
        /**
         * 修改指定游戏的缓存信息
         * @function
         * @DateTime 2018-06-28T11:43:37+0800
         * @param    {number}                 gz_id [description]
         * @param    {string}                 att   [description]
         * @param    {string}                 value [description]
         */
        modifyGameInfo(gz_id: number, att: string, value: string): void;
    }
}
/**
 * Created by wxlan on 2017/9/13.
 */
declare namespace gamelib.childGame {
    /**
     * 进入子游戏的逻辑
     * @class EnterGame
     */
    class EnterGame {
        private _web;
        private _game_args;
        private _validation;
        m_childGame: gamelib.core.GameMain;
        private _game_jsList;
        private _params;
        private _gz_id;
        private _gameLoaders;
        constructor(web: WebDataHander);
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
        enterGame(gz_id: number, validation?: string, game_args?: string): void;
        private onLoaderProcess(pro);
        private enterGame_1(gz_id);
        /**
         * 跳转到指定的游戏
         * @function enterNormalGame
         * @DateTime 2018-03-17T14:05:42+0800
         * @param    {any}                    obj [description]
         */
        private enterNormalGame(obj);
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
        private enterLayaGame(obj);
        private createGame();
        private loadScript(url);
    }
}
declare namespace gamelib.childGame {
    class GameLoaderMgr {
        private _loaders;
        constructor();
        checkLoaderValid(): boolean;
        /**
         * 载入游戏
         * @function
         * @DateTime 2019-06-14T17:38:07+0800
         * @param    {number}                 gz_id    [description]
         * @param    {Laya.Handler}           complete [description]
         * @param    {Laya.Handler}           progress [description]
         * @return   {boolean}                         [是否用的cache。如果是用的cache,不需要展示apploading]
         */
        loadGame(gz_id: number, complete: Laya.Handler, progress: Laya.Handler): boolean;
    }
    class GameLoader {
        private gz_id;
        private _completes;
        private _progresss;
        private _status;
        private _jd;
        private _loader;
        constructor(gz_id: number);
        load(complete?: Laya.Handler, progress?: Laya.Handler): void;
        stop(): void;
        private onLoaded();
        private checkProgress();
    }
}
/**
 * Created by wxlan on 2017/9/13.
 */
declare namespace gamelib.childGame {
    /**
     * 退出游戏逻辑
     * @class QuitGame
     * @deprecated
     */
    class QuitGame {
        private _net;
        private _callBack;
        private _web;
        constructor(web: WebDataHander);
        quitGame(gz_id: number, callBack?: (bSucces: boolean) => void): void;
        private onGetGame_zone_info(ret);
        private quitGameStep3(result, gz_id);
    }
}
declare module gamelib.childGame {
    /**
     * @class
     * @author wx
     * 负责向目标服务器发送0x0015协议,并检测数据拷贝是否成功
     * @deprecated
     *
     */
    class ServerDataHander {
        private _socket;
        private _status;
        private _pid;
        private _callback;
        private _thisobj;
        private _gz_id;
        private _cjid;
        private _groupId;
        private _args;
        constructor();
        private initSocket();
        private disconnect();
        /**
         * 退出服务器
         * @param ip
         * @param port
         * @param pid
         * @param callback
         * @param thisobj
         * @param gz_id
         */
        quitServer(ip: string, port: string, pid: number, callback: Function, thisobj: any, gz_id: number, type?: string): void;
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
        noticeServerCreateGame(ip: string, port: string, pid: number, args: Array<any>, callback: Function, thisobj: any): void;
        noticeServerOpGame(ip: string, port: string, args: Array<any>, callback: Function, thisobj: any): void;
        private onClose();
        private onConnectd();
        private onGetMsg(evt);
    }
}
declare module gamelib.childGame {
    /**
     * @class	WebDataHander
     * @author wx
     * 获取登录串相关
     *
     */
    class WebDataHander {
        private _callBack;
        private _thiObj;
        private _gameInfoList;
        private _gzIdToGameId;
        constructor(gzIdToGameId: any);
        checkGameIsLaya(gz_id: number): boolean;
        /**
         * 获得游戏的登录信息。跳转子游戏会使用
         * @function
         * @DateTime 2018-03-17T15:31:26+0800
         * @param    {number}                 gz_id    [description]
         * @param    {function}             callBack [description]
         * @param    {any}                    thisObj  [description]
         */
        getLoginInfo(gz_id: number, callBack: (obj: any) => void, thisObj: any): void;
        /**
         * 获取游戏分区信息，进入子游戏会使用
         * @function
         * @DateTime 2018-03-17T14:11:44+0800
         * @param    {number}                 gz_id    [description]
         * @param    {function}             callBack [description]
         * @param    {any}                    thisObj  [description]
         */
        getGameInfo(gz_id: number, callBack: (obj: any) => void, thisObj: any): void;
        /**
         * 清除指定游戏的信息缓存
         * @function
         * @DateTime 2018-06-28T11:41:58+0800
         * @param    {number}                 gz_id [description]
         */
        clearGameInfo(gz_id: number): void;
        /**
         * 修改指定游戏的信息缓存
         * @function
         * @DateTime 2018-06-28T11:45:15+0800
         * @param    {number}                 gz_id [description]
         * @param    {string}                 att   [description]
         * @param    {string}                 value [description]
         */
        modifyGameInfo(gz_id: number, att: string, value: string): void;
        private onGetGame_zone_info(ret);
    }
}
declare namespace gamelib.control {
    class IOSScreenTipUi extends gamelib.core.BaseUi {
        constructor();
        protected onShow(): void;
        protected onClose(): void;
    }
}
declare module gamelib.common {
    /**
     * 互动相关功能，包括聊天泡泡，表情，礼物，弹幕,跑马灯
     */
    class InteractiveSystem implements gamelib.core.INet {
        private _getBubble;
        private _getFacePos;
        private _getGiftPos;
        private _giftToggle;
        private _danmuToggle;
        private _pmd;
        private _gift;
        private _dm;
        priority: number;
        private _bubbleList;
        constructor();
        destroy(): void;
        initChatBubble(getBubble: (lseat: number) => Laya.UIComponent): void;
        initFace(getpos: (lseat: number) => {
            x: number;
            y: number;
        }): void;
        initGift(getpos: (lseat: number) => {
            x: number;
            y: number;
        }, tipArea?: {
            x: number;
            y: number;
        }): void;
        initPmd(res: any): void;
        initBtns(hddj: Laya.CheckBox, danMu: Laya.CheckBox): void;
        show(): void;
        close(): void;
        reciveNetMsg(msgId: number, data: any): void;
        private onGiftToggle(evt);
        private onDanMuToggle(evt);
        private showGift(data);
        /**
         * 显示表情
         * @function
         * @DateTime 2019-05-16T10:27:08+0800
         * @param    {any}                    data [description]
         */
        private showFace(data);
        /**
         * 显示聊天泡泡
         * @function
         * @DateTime 2019-05-16T10:26:38+0800
         * @param    {any}                    data [description]
         */
        private showChatBubble(data);
    }
    class Face {
        constructor();
        play(pos: {
            x: number;
            y: number;
        }, id: number): void;
        private getFaceRes(id);
        private onPlayEnd(face);
    }
}
/**
* name
*/
declare namespace gamelib.control {
    /**
     * 公告界面
     * @class NoticeUi
     */
    class NoticeUi extends gamelib.core.BaseUi {
        private txt_txt;
        constructor();
        protected init(): void;
        setData(day_notice_config: any): void;
        protected onShow(): void;
        protected onClose(): void;
    }
}
/**
 * Created by wxlan on 2016/6/22.
 */
declare module gamelib.control {
    /**
     * 设置界面
     * @class SetUi
     */
    class SetUi extends gamelib.core.BaseUi {
        private _help_btn;
        private _sound;
        private _music;
        private _logout;
        private _version_txt;
        private _saveFunction;
        private _hideHelpBtnInHall;
        private _version;
        private _houtai;
        private _radio;
        readonly help_btn: laya.ui.Button;
        constructor(saveFunction?: Function, hideHelpBtnInHall?: boolean, url?: string);
        init(): void;
        onShow(): void;
        private onChange(evt);
        protected onClickObjects(evt: laya.events.Event): void;
        private save();
    }
}
/**
 * Created by wxlan on 2016/9/21.
 */
declare module gamelib.control {
    /**
     * 微信分享
     * @class ShareTip_wxUi
     */
    class ShareTip_wxUi extends gamelib.core.BaseUi {
        private _tab;
        private _img_game;
        private _msg_txt;
        private _web;
        private _args;
        private _qrcodeImg;
        private _url;
        constructor();
        /**
         * 分享牌局
         * @function setData
         * @DateTime 2018-03-17T14:42:37+0800
         * @param    {any}     args     [description]
         * @param    {Function}               callBack [description]
         * @param    {any}                    thisObj  [description]
         */
        setData(args: {
            gz_id: number;
            gameId: number;
            validation: string;
            groupId: string;
            wxTips?: boolean;
            fd?: number;
            js?: number;
            addDatas?: any;
            title?: string;
            desc?: string;
        }, callBack?: Function, thisObj?: any): void;
        /**
         * 分享app信息
         * @function setAppData
         * @DateTime 2018-03-17T14:43:23+0800
         * @param    {string}                 appName [description]
         * @param    {string}                 info    [description]
         * @param    {string}                 imgUrl  [description]
         */
        setAppData(appName: string, info: string, imgUrl: string): void;
        private onGetShartArgsEnd(rep);
        private onGetGameInfoEnd(rep);
        protected init(): void;
        onShow(): void;
        onClose(): void;
        private onTabChange(evt?);
        protected onClickObjects(evt: Laya.Event): void;
    }
}
declare module gamelib.common {
    /**
     * 保险箱ui
     * @class Bankui
     */
    class BankUi extends gamelib.core.Ui_NetHandle {
        private cy_an;
        private btn1;
        private money_self;
        private money_bank;
        protected _moneyInBank: number;
        private _minMoney;
        private _input_txt;
        constructor();
        protected init(): void;
        minMoney: number;
        protected onShow(): void;
        private update();
        protected onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        reciveNetMsg(msgId: number, data: any): void;
    }
}
declare namespace gamelib.common {
    /**
     * 发送喇叭界面
     * @class
     */
    class BugleUi extends gamelib.core.Ui_NetHandle {
        private _text_input;
        private _histroy;
        private _price;
        private _goods_name;
        constructor();
        protected init(): void;
        protected onShow(): void;
        reciveNetMsg(msgId: number, data: any): void;
        private showData(bd);
        protected onClickObjects(evt: Laya.Event): void;
    }
}
declare namespace gamelib.control {
    /**
     * 管理动画的。直接用g_animation来使用，不要实例化次类
     * @class Animation
     */
    class Animation {
        constructor();
        /**
         * 播放动画
         * @function playAnimation
         * @param {string}   res "qpq.ui.FaceUI"
         * @param {number}} pos 0:(0,0)点，1：居中显示，{x,y}，显示到指定坐标
         * @param {autoRemove} 播放完成后是否自动删除
         */
        playAnimation(res: string, pos: number | {
            x: number;
            y: number;
        }, autoRemove: boolean, callBack?: Laya.Handler): Laya.Scene;
        private onPlayEnd(movie, callBack?);
    }
}
/**
 * Created by liuyi_000 on 2016/9/28.
 */
declare module gamelib.control {
    /**
     * 扇形遮罩
     * @class
     */
    class ArcMask extends Laya.Sprite {
        private _r;
        private _color;
        private _pre;
        private _angle;
        constructor(r: number);
        pre: number;
    }
}
declare namespace gamelib.control {
    /**
     * 管理动画的。直接用g_animation来使用，不要实例化次类
     * @class Animation
     */
    class ChilpInHeadEffect {
        private _list;
        constructor();
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
        registerHeads1(heads: any, type: number, startLocalSeat: number): void;
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
        registerHeads2(heads: any, type: number, startLocalSeat: number): void;
        /**
         * 注册头像，如果头像的位置是乱的,用以下方法
         * @function
         * @DateTime 2019-03-28T10:32:45+0800
         * @param    {any}                    heads          [单个位置或者按位置排好的]
         * @param    {number}                 type           移动的类型 0上 1下 2左  3右
         * @param    {number}                 localSeat [description]
         */
        registerHeads3(heads: any, type: number, localSeat?: number): void;
        destroy(): void;
        play(localSeat: number): void;
    }
    class HeadEffect {
        private _res;
        private _effceType;
        private _offset;
        private _delay;
        private _targetPos;
        private _formerPos;
        /**
       * 头像容器移动类实例化
         * @param res 头像容器
         * @param effectType 移动的类型 0上 1下 2左  3右
         * @param offset 移动的偏移
         * @param delay 缓动时间
         */
        constructor(res: any, effectType: number, offset?: number, delay?: number);
        offset: number;
        effectType: number;
        delay: number;
        protected init(): void;
        show(): void;
        protected moveEnd(): void;
        close(): void;
        destroy(): void;
        protected getTheTargetPos(): void;
    }
}
declare namespace gamelib.control {
    /**
     * 头像转圈时钟
     * @class Clock_Mask
     */
    class Clock_Mask {
        private _res;
        private _mask;
        private _localSeat;
        private _soundName;
        private _waringName;
        /**
         * 头像转圈时间。
         * @constructor Clock_Mask
         * @param {any}    res   对象必须为单独的一个皮肤。里面必须包含img_djs_2和img_djs_3两张图片
         * @param {number} localSeat [description]
         */
        constructor(res: any, localSeat: number);
        /**
         * 倒计时音效。默认为daojishi
         * @type {string} value [description]
         */
        soundName: string;
        /**
         * 刚到第5秒的时候的音效。默认不播放。
         * @type {string} value
         */
        waringName: string;
        destroy(): void;
        readonly localSeat: number;
        /**
         * 开始计时
         * @function startClock
         * @DateTime 2018-03-17T14:17:08+0800
         * @param    {number}                 time [description]
         */
        startClock(time: number): void;
        /**
         * 停止时间
         * @function stop
         * @DateTime 2018-03-17T14:17:23+0800
         */
        stop(): void;
        private changeColor1();
        private changeColor2();
        private voicePrompt();
        private voice();
        private complete();
    }
    class CubeMask extends Laya.Sprite {
        private _fillColor;
        private _radius;
        private _startAngle;
        private _endAngle;
        private _dalta;
        private _time;
        private _second;
        private _changeColor1;
        private _changeColor2;
        private _tempTime;
        private _bPlaySound;
        constructor(radius: number);
        destroy(): void;
        start(second: number): void;
        stop(): void;
        private changeGraphics();
    }
}
declare namespace gamelib.control {
    /**
     * 公共房间逻辑部分
     * @class CommonRoomUi
     * @deprecated 每个游戏的人数可能不一样。礼物按钮也不一样
     */
    class CommonRoomUi extends gamelib.core.Ui_NetHandle {
        protected _rightSetUi: gamelib.control.RoomRightSet;
        protected _ruleUi: gamelib.control.Qpq_RuleUi;
        protected _playerNum: number;
        constructor(url: string);
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        /**
         * 设置玩家列表和获取玩家信息的方法
         * @param {Array<gamelib.data.UserInfo>} list             [description]
         * @param {Function}                     getPlayerDataFun [description]
         */
        protected setPlayerList(list: Array<gamelib.data.UserInfo>, getPlayerDataFun: (id: number) => gamelib.data.UserInfo): void;
        protected onLocalSignal(msg: string): void;
    }
}
declare module gamelib.control {
    /**
     * 大厅公共按钮,包括商城，签到，游戏，喇叭，cdk，设置，帮助，发送到桌面，首充
     * 需要关注消息为: showSetUi,showHelpUi,showRankUi,showEffortUi,showTaskUi
     * @class HallCommonBtns
     */
    class HallCommonBtns {
        private _btns;
        private _mailIcon;
        private _signinIcon;
        private _signal;
        private _bSendToDesk;
        private _qpqEnter;
        constructor(res: any);
        private getVisible(data_source, key);
        private onGlobalSigna(msg, data);
        show(): void;
        close(): void;
        update(): void;
        private updateItemBtn();
        private onClickBtns(evt);
    }
}
declare module gamelib.control {
    /**
     * 点击头像后显示自己的玩家信息。包含签名，头像，昵称，id，铜钱，地址等
     * @class MyPersonalInfo
     */
    class MyPersonalInfo extends gamelib.core.Ui_NetHandle {
        private _head;
        private _nick;
        private _ID;
        private _money;
        private _address;
        private _signature;
        private _vip;
        private _netData;
        private _level_label;
        private _exp_bar;
        private _exp_label;
        private _pd;
        private _vip_txt;
        private _jx;
        constructor(resname: any);
        protected init(): void;
        /**
         * 设置玩家数据
         * @function setPlayerData
         * @DateTime 2018-03-17T14:23:04+0800
         * @param    {gamelib.data.UserInfo}  pd [description]
         */
        setPlayerData(pd: gamelib.data.UserInfo): void;
        destroy(): void;
        protected onShow(): void;
        protected onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        reciveNetMsg(msgId: number, data: any): void;
    }
}
declare module gamelib.control {
    /**
     * 点击头像后显示自己的玩家信息。包含签名，头像，昵称，id，铜钱，地址等
     * @class MyPersonalInfo
     */
    class OthersPersonalInfo extends gamelib.core.Ui_NetHandle {
        private _head;
        private _nick;
        private _ID;
        private _money;
        private _address;
        private _signature;
        private _distance;
        private _vip;
        private _level_label;
        private _exp_bar;
        private _exp_label;
        private _hint;
        private _pd;
        private _cd;
        private _lastSendTime;
        private _vip_txt;
        private _jx;
        private _checkbox_1;
        constructor(resname: any);
        protected init(): void;
        setPlayerData(pd: gamelib.data.UserInfo): void;
        destroy(): void;
        protected onShow(): void;
        protected onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        reciveNetMsg(msgId: number, data: any): void;
    }
}
declare module gamelib.control {
    /**
     * 分页控件
     * @class Page
     */
    class Page {
        private _prev;
        private _next;
        private _page;
        private _total_page;
        private _current_page;
        private _change;
        /**
         * @constructor
         * @param {Laya.Button}  prev   [上一页按钮]
         * @param {Laya.Button}  next   [下一页按钮]
         * @param {Laya.Label}   page   [页面文本]
         * @param {Laya.Handler} change [页码变化的回掉。参数为page，0-最大页面-1]
         */
        constructor(prev: Laya.Button, next: Laya.Button, page: Laya.Label, change: Laya.Handler);
        show(): void;
        close(): void;
        readonly page: number;
        /**
         * 设置页面
         * @function setPage
         * @param {number} page    [当前页码，从0开始]
         * @param {number} maxPage [最大页码]
         */
        setPage(page: number, maxPage: number): void;
        private onPrev(evt);
        private onNext(evt);
        private showPage();
    }
}
declare module gamelib.control {
    /**
     * 二维码图片
     * @class QRCodeImg
     */
    class QRCodeImg {
        private _spr_QRCode;
        private _img;
        private _url;
        constructor(img: laya.ui.Image);
        /**
         * 设置二维码内容
         * @function setUrl
         * @DateTime 2018-03-17T14:26:07+0800
         * @param    {string}                 url [description]
         */
        setUrl(url: string): void;
    }
}
/**
 * Created by code on 2017/7/24.
 */
declare module gamelib.control {
    /**
     * 规则界面
     * @class Qpq_RuleUi
     */
    class Qpq_RuleUi extends gamelib.core.BaseUi {
        private _ruleData;
        private _list;
        constructor();
        init(): void;
        protected onShow(): void;
        protected onClose(): void;
        destroy(): void;
        private setRuleData();
        protected set_listItemData(item: laya.ui.Box, index: number): void;
    }
}
declare namespace gamelib.control {
    /**
     * 牌桌右侧公共面板
     * @class RoomRightSet
     */
    class RoomRightSet {
        private _style;
        private _panel;
        private _clip;
        private _help;
        private _posList;
        private _sub_btns;
        private _checkFz;
        /**
         * [constructor description]
         * @param {any}        res [description]
         * @param {boolean}    [checkFz= true]   解散的时候是否检测是房主。五子棋不需要检测
         */
        constructor(res: any, checkFz?: boolean);
        show(): void;
        close(): void;
        destroy(): void;
        private onLocalMsg(msg, data);
    }
    class RoomRightSetStyle1 {
        private _panel;
        private _clip;
        private _help;
        private _click_list;
        private _posList;
        private _sub_btns;
        private _checkFz;
        constructor(res: any, checkFz?: boolean);
        update(): void;
        show(): void;
        close(): void;
        destroy(): void;
        private setPanelVisible(value);
        private onClickStage(evt?);
        private onClick(evt);
    }
    class RoomRightSetStyle2 {
        private _btnList;
        private _box;
        private _checkFz;
        private _res;
        constructor(res: any, checkFz?: boolean);
        update(): void;
        show(): void;
        close(): void;
        destroy(): void;
        private onClickBtn(evt);
    }
}
/**
 * Created by wxlan on 2017/8/17.
 */
declare namespace gamelib.control {
    /**
     * 拖动条控件
     * 需要传的res必须包含txt_0,txt_1,hslider
     * @class Slider
     */
    class Slider {
        private _label_txt;
        private _value_txt;
        private _slider;
        private _update_fun;
        private _update_thisobj;
        private _res;
        constructor(res: any);
        show(): void;
        close(): void;
        /**
         * 设置标题
         * @function setLabel
         * @DateTime 2018-03-17T14:28:49+0800
         * @param    {string}                 str [description]
         */
        setLabel(str: string): void;
        /**
         * 设置最大值和最小值
         * @function
         * @DateTime 2018-03-17T14:29:04+0800
         * @param    {number}                 minimum [description]
         * @param    {number}                 maximum [description]
         */
        setParams(minimum: number, maximum: number): void;
        /**
         * 设置每次拖动的回调
         * @function setUpdateCallBack
         * @DateTime 2018-03-17T14:29:26+0800
         * @param    {Function}               fun     [description]
         * @param    {any}                    thisobj [description]
         */
        setUpdateCallBack(fun: Function, thisobj: any): void;
        /**
         * 当前的值
         * @DateTime 2018-03-17T14:29:49+0800
         * @type   {number}
         */
        value: number;
        /**
         * 是否禁用
         * @DateTime 2018-03-17T14:29:49+0800
         * @type   {boolean}
         */
        enabled: boolean;
        /**
         * 是否显示
         * @DateTime 2018-03-17T14:29:49+0800
         * @type   {boolean}
         */
        visible: boolean;
        private onChange();
        private updateValues();
    }
}
/**
 * Created by wxlan on 2016/3/15.
 */
declare module gamelib.control {
    /**
     * 控制一些方法按顺序调用。
     * 先调用addStep，添加需要调用的回掉，
     * 最后调用start，开始顺序调用。
     *
     */
    class StepManager {
        private _list;
        constructor();
        /**
         * 添加回调
         * @param    {Function}               callBack  [description]
         * @param    {any}                    thisObj   [description]
         * @param    {Array<any>}             args      [description]
         * @param    {number}                 delayTime [在此方法调用后延迟多少毫秒调用下一个方法]
         */
        addStep(callBack: Function, thisObj: any, args: Array<any>, delayTime: number): void;
        clear(): void;
        /**
         * 开始调用列表中的方法
         * @function
         * @DateTime 2018-04-11T16:56:45+0800
         */
        start(): void;
    }
}
declare module gamelib.common {
    /**
     *  距离检测系统
     *  @class DistanceCheck
     */
    class DistanceCheck {
        private static _instance;
        static readonly s_instance: DistanceCheck;
        private _support;
        private _enterBtn;
        private _ui;
        private _playerList;
        setEnterBtn(btn: any): void;
        setPlayerList(arr: Array<gamelib.data.UserInfo>): void;
        destroy(): void;
        private onShowDisUi(evt);
    }
}
declare module gamelib.common {
    /**
     *  距离检测系统
     *  @class DistanceCheck
     */
    class DistanceCheckUi extends gamelib.core.BaseUi {
        private _headList;
        constructor();
        protected init(): void;
        setPlayerList(list: Array<gamelib.data.UserInfo>): void;
        private setDis(seat1, seat2, arr);
        protected onClickObjects(evt: Laya.Event): void;
    }
}
/**
 * Created by code on 2017/8/2.
 */
declare module gamelib.common {
    /**
     *  礼物赠送、接收显示管理
     *  @class GiftSystem
     */
    class GiftSystem {
        private static _instance;
        static readonly s_instance: GiftSystem;
        private _postions;
        private _labels;
        private _area;
        private _playerList;
        private _sprite;
        private _btns;
        private _ui;
        private _enabled;
        private _getPosFun;
        constructor();
        destroy(): void;
        enable: boolean;
        /**
         * 初始化各个参数
         * @function
         * @DateTime 2018-03-17T14:34:04+0800
         * @param    {Array<{any}>}         postions 需要显示礼物的位置。可以设置具体的x,y，也可以传入美术提供的资源对象
         * @param    {any}               tipArea  提示文本显示的位置
         * @param    {Array<laya.ui.Button>}  btns    礼物按钮列表。如果没有。传[];注意需要列表的第一个按钮为位置1的玩家，不是位置0的玩家
         */
        init(postions: Array<{
            any;
        }>, tipArea: {
            x: number;
            y: number;
        }, btns: Array<laya.ui.Button>): void;
        init_br(getpos: (index: number) => {
            x: number;
            y: number;
        }, tipArea?: {
            x: number;
            y: number;
        }): void;
        /**
         * 很重要。需要在牌桌玩家数据确定后，传进来，否则找不到玩家，礼物不会正确显示
         * @function setPlayerList
         * @DateTime 2018-03-17T14:37:03+0800
         * @param    {Array<gamelib.data.UserInfo>} list 牌桌玩家列表
         */
        setPlayerList(list: Array<gamelib.data.UserInfo>): void;
        close(): void;
        /**
         * 显示礼物
         * @function showGift
         * @DateTime 2018-03-17T14:38:16+0800
         * @param    {any}               data [description]
         * @param    {number}            [flyTime =    1000]
         */
        showGift(data: any, flyTime?: number): void;
        private onClickBtn(evt);
        private oneToOne(data, flyTime?);
        private oneToMore(data, flyTime?);
        private getUrls(type);
        private appendMsg(sendName, recName, type?);
        private removeOneLable(obj);
        private createTextField(sendName, recName, type);
    }
    class GiftItem extends Laya.Sprite {
        private _sound;
        private _flyTime;
        private _stageSize;
        private _animation;
        private _ani;
        private _type;
        constructor(type: number, sound: string);
        private getObjByType(type);
        private initData();
        init(): void;
        close(): void;
        setFlyTime(time_: number): void;
        flyTo(sendPos: any, recuvePos: any, delayTime?: number, bPlayeSound?: boolean): void;
        private giftSound();
        private moveEnd();
        private remove();
    }
}
/**
* name
*/
declare module gamelib.common {
    /**
     * @class
     * 赠送礼物界面。如果礼物面板不是在用户信息面板中，会打开这个界面
     */
    class GiftsUi extends gamelib.core.BaseUi {
        private _localSeat;
        private _tip;
        m_playerId: number;
        private _cd;
        private _lastSendTime;
        constructor();
        protected init(): void;
        protected initTip(): void;
        protected onShow(): void;
        destroy(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        /**
         * 打开的时候需要设置当前打开的是哪个玩家
         * @function
         * @DateTime 2018-03-17T14:31:52+0800
         * @param    {number}                 playerId [description]
         */
        setPlayerId(playerId: number): void;
    }
}
/**
* name
*/
declare module gamelib.common {
    class MailInfoUi extends gamelib.core.BaseUi {
        private _list;
        private _data;
        private _ok;
        private _ylq;
        private _title;
        private _info;
        private _time;
        private _name;
        constructor();
        protected init(): void;
        onShow(): void;
        onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        private onItemUpdate(item, index);
        private getItemUrl(msId);
        setData(data: gamelib.data.MailData): void;
    }
}
/**
* name
*/
declare namespace gamelib.common {
    /**
     * 邮件ui
     * @class MailUi
     */
    class MailUi extends gamelib.core.Ui_NetHandle {
        private _allGet;
        private _allRead;
        private _x1;
        private _x2;
        private _x3;
        private _dataSource;
        private _list;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        private deleteMaile(id);
        private update(data);
        private _mainInfo;
        private showInfo(data);
        private showMainUI();
        private updateBtns();
        protected init(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        protected onShow(): void;
        protected onClose(): void;
        private onSelect(index);
        private onItemUpdate(item, index);
        private onGetOnItem(evt);
    }
}
declare module gamelib.common.moregame {
    var s_debug: boolean;
    /**
     * 金币场ui。微棋牌圈的界面
     * @class MoreGame
     */
    class MoreGame extends gamelib.core.BaseUi {
        private _list;
        private _selected_game;
        private _selected_box;
        constructor();
        init(): void;
        protected onListRender(cell: laya.ui.Box, index: number): void;
        private onListSelecet(index);
        private enterGame();
        private onGameCached(loader);
        private onLoaderProcess(loader);
    }
}
declare module gamelib.common.moregame {
    var loaders: any;
    var _watchers: any;
    var _loading: PreLoad;
    const UPDATE: string;
    const COMPLETE: string;
    /**
     * 检查缓存组件是否可用
     * */
    function checkLoaderValid(): boolean;
    /**
     * 开始缓存指定游戏
     * @param {number} gz_id [description]
     */
    function startLoad(gz_id: number): void;
    function addWatch(type: string, onHandle: Function, thisArg: any): void;
    function removeWatch(type: string, onHandle: Function, thisArg: any): void;
    function updateProcess(loader: PreLoad): void;
    function onLoaded(loader: PreLoad): void;
    function dispatch(type: string, loader: PreLoad): void;
    class PreLoad {
        loaded: boolean;
        gz_id: number;
        private _load;
        private intervalIndex;
        private _stop;
        private _lastCheck;
        constructor(id: number);
        private onCacheComplete();
        readonly curValue: number;
        toPercent(): string;
        stopUpdate: boolean;
        onCacheUpdate(): void;
    }
}
/**
* name
*/
declare namespace gamelib.common {
    /**
     * 商城界面
     * @class ShopUi
     */
    class ShopUi extends gamelib.core.Ui_NetHandle {
        private _list;
        private _dataSource;
        m_openType: number;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        private onItemUpdate(item, index);
        /**
         * 购买单个道具
         * @param {laya.events.Event} evt [description]
         */
        private onSelect(index);
        private update();
    }
}
declare namespace gamelib.data {
    /**
     * @class 喇叭数据
     */
    class BugleData {
        static s_list: Array<BugleData>;
        private static s_maxNum;
        static getData(data: any): BugleData;
        m_sendId: number;
        m_sendName: string;
        m_msg: string;
    }
}
/**
 * Created by wxlan on 2016/9/26.
 */
declare module gamelib.data {
    /**
     * 棋牌圈相关信息
     * @class CircleData
     */
    class CircleData {
        /**
         * 房主pid
         * @type {number}
         */
        fzPid: number;
        /**
         * 牌局验证码
         * @type {string}
         */
        validation: string;
        /**
         * 组局id
         * @type {number}
         */
        groupId: number;
        /**
         * 最大轮数
         */
        round_max: number;
        /**
         * 当前轮数
         */
        round_current: number;
        info: any;
        isReplay: boolean;
        ruleData: any;
        selfIsFz(): boolean;
        /**
         * 是否是金币积分模式
         * @return {boolean} [description]
         */
        isGoldScoreModle(): boolean;
    }
}
declare module gamelib.data {
    /**
     * @class
     * 数据基类
     */
    class GameData {
        _id: number;
        _name: string;
        _resId: number;
        /**
         * @property {number} m_id
         * 序列号
         */
        m_id: number;
        /**
         * @property {number} m_resId
         * 资源id
         *
         */
        m_resId: number;
        /**
         * @property {string} m_name
         * 对象名
         */
        m_name: string;
        constructor();
        /**
         * @method
         * 清理数据
         */
        clear(): void;
        /**
         * @method
         * 销毁数据
         */
        destroy(): void;
        /**
         * 输出对象
         * @returns {string}
         */
        toString(): string;
    }
}
declare namespace gamelib.data {
    /**
     * 好友数据
     * @class FirendData
     */
    class FirendData extends GameData {
        static s_list: any;
        static getFirendById(id: number, forceCreate?: boolean): FirendData;
        static parseFirendData(obj: any): void;
        static getFirendByPID(pid: number): FirendData;
        m_nickName: string;
        m_flag: number;
        m_statue: number;
        m_type: number;
        m_group: number;
        m_gz_id: number;
        m_pId: number;
        m_creatTime: number;
        m_loginTime: number;
        m_headUrl: string;
        m_data: any;
        constructor();
    }
}
/**
* name
*/
declare module gamelib.data {
    /**
     * 平台配置数据相关
     * @class PlatformConfigs
     */
    class PlatformConfigs {
        /**
         * 是否显示铜钱
         * @type {boolean}
         * */
        show_money: boolean;
        /**
         * 界面类型【1-棋牌圈，2-牛牛大厅】
         * @type {number}
         * */
        hall_type: number;
        /**
         * 创建游戏后是否自动进入房间
         * @type {boolean}
         */
        autoEnterGame: boolean;
        /**
         * 金币名字
         * @type {string}
         */
        gold_name: string;
        /**
         * 金币物品的msid
         * @type {gold_type}
         */
        gold_type: number;
        /**
         * 金币名字
         * @type {string}
         */
        gold_name_zj: string;
        /**
         * 金币物品的msid
         * @type {gold_type}
         */
        gold_type_zj: number;
        /**
         * 棋牌圈的game_id
         * @type {number}
         */
        qpq_game_id: number;
        /**
         * 大厅bgm
         * @type {any}
         */
        bgm: any;
        /**
         * 平台名
         * @type {string}
         */
        name: string;
        /**
         * 分享内容
         * @type {string}
         */
        share_info: string;
        /**
         * 分享图片地址
         * @type {string}
         */
        share_url: string;
    }
}
/**
 * @class
 * 登录数据相关
 * @author wx
 *
 */
declare class GameVar {
    static s_version: string;
    /**
     * 平台配置相关的数据
     * @type {gamelib.data.PlatformConfigs}
     * @static
     */
    static g_platformData: gamelib.data.PlatformConfigs;
    /**
     * 当前游戏的二维码地址
     * @type {string}
     * @static
     */
    static m_QRCodeUrl: string;
    /**
     * 当前游戏包含vip信息的二维码地址
     * @type {string}
     * @static
     */
    static m_QRCodeUrl_Vip: string;
    /**
     * 当前游戏的游戏id，自动获取
     * @type {number}
     */
    private static _game_id;
    static s_game_id: number;
    /**
     * @property {number} s_netDelay
     * 网络延时
     * @static
     */
    static s_netDelay: number;
    /**
     * @property {number} s_loginSeverTime
     * 登录服务器时间 秒
     * @static
     */
    static s_loginSeverTime: number;
    /**
     * 登录服务器时，客服端本地的时间。Laya.timer.currTimer的值
     * @type {number}
     */
    static s_loginClientTime: number;
    static s_namespace: string;
    /**
     * @property {string} s_gameName
     * 当前游戏名，例如为erddz，ddz，nn,
     * 这个值是通过
     *
     */
    static s_gameName: string;
    static dir: string;
    static mainGameGz_id: number;
    static s_firstBuy: boolean;
    static s_firstBuyGift: boolean;
    /**
     * 周卡和月卡。state:0没购买，1：未领取，2：已领取，endTime：到期时间
     * @type {number}
     */
    static s_item_zhou: {
        endTime: number;
        state: number;
    };
    static s_item_yue: {
        endTime: number;
        state: number;
    };
    static readonly s_bActivate: boolean;
    static destroy(): void;
    /**
     * 游戏返回棋牌圈的参数
     * @type {null}
     */
    private static s_game_args;
    static game_args: any;
    /**
     * 棋牌圈参数
     * @type {null}
     */
    private static s_circle_args;
    private static s_circleData;
    /**
     * 组局验证码
     * @returns {any}
     */
    static validation: string;
    static groupId: string;
    static circleData: gamelib.data.CircleData;
    static readonly circle_args: any;
    /**
     * @property {number} appid
     * @static
     */
    static appid: string;
    /**
     * @property {number} urlParam
     * 登录相关的参数
     * @static
     */
    private static _urlParams;
    static platfromMoney: number;
    static urlParam: Object;
    static clearCircleData(): void;
    /**
     * @method
     * @private
     * 通过可以获得对应的值
     * @param value
     * @static
     * @returns {any}
     */
    private static getValyeByKey(value);
    static readonly ip_addr: string;
    static common_ftp: string;
    static game_ver: string;
    static readonly s_app_verify: number;
    static gz_id: number;
    static readonly main_gz_id: number;
    static readonly src_gz_id: number;
    static readonly gameMode: number;
    static resource_path: string;
    static game_code: string;
    static readonly ts: number;
    static readonly target_gz_id: number;
    static pid: number;
    static platform: string;
    static readonly session: string;
    static readonly serverIp: string;
    static readonly wss_host: string;
    static readonly ws_host: string;
    /**
     * 返回 http 或者https
     *
     * @returns {string}
     */
    static readonly protocol: string;
    static readonly serverPort: string;
    static readonly platformVipLevel: number;
    static readonly isGameVip: boolean;
    static readonly sex: number;
    static playerHeadUrl: string;
    static readonly playerHeadUrl_ex: string;
    static readonly payurl: string;
    static nickName: string;
    constructor();
}
declare module gamelib.data {
    /**
     * 商品信息
     * @class
     * @ignore 除了msID的定义外，其他的都不使用了
     */
    class GoodsData extends GameData {
        /**
         * 红包 1002
         */
        static MSID_HB: number;
        /**
         * 铜钱 1000；
         */
        static MSID_TQ: number;
        /**
         * 喇叭
         */
        static MSID_LB: number;
        /**
         * 财神卡
         */
        static MSID_CS: number;
        /**
         * 乐币
         */
        static MSID_LEBI: number;
        /**
         * 小游戏积分
         */
        static MSID_SMSCORE: number;
        /**
         * 平台货币
         */
        static MSID_PLATFORMCOIN: number;
        /**
         * 宝箱
         */
        static MSID_BOX: number;
        /**
         * 万能钥匙
         */
        static MSID_KEY: number;
        /**
         * 猜拳助手
         */
        static MSID_GUESSHELPERNUM: number;
        /**
         * 金券
         * @type {number}
         */
        static MSID_JINQUAN: number;
        /**
         * 钻石，棋牌圈使用，相当于金券
         * @type {number}
         */
        static MSID_ZUANSHI: number;
        /**
        * 补签卡
        */
        static MSID_BQK: number;
        static MSID_XYX1: number;
        static MSID_XYX2: number;
        static MSID_XYX3: number;
        static MSID_JJK: number;
        static MSID_HPK: number;
        static MSID_JBK: number;
        static MSID_FBK: number;
        static s_goodsNames: any;
        static s_goodsInfo: any;
        static GetGoodsInfoByMsId(msId: number): any;
        static GetGoodsIconByMsId(msId: number): string;
        static GetGoodsImageByMsId(msId: number): string;
        static checkGoodsCanUse(msId: number): boolean;
        static checkGoodsShowInBag(msId: number): boolean;
        static GetNameByMsId(msId: number): string;
        private static _goodsList;
        private static _shopGoodsList;
        static GetGoodsData(id: number, forceCreate?: boolean): GoodsData;
        static Clear(): void;
        static RemoveGoodsData(id: number): void;
        /**
         * 添加一个物品到商城物品列表中。
         * @param type
         * @param goods
         *
         */
        static AddShopGoods(type: number, goods: GoodsData): void;
        static GetShopGoodsByType(type: number): Array<any>;
        private _msId;
        private _num;
        private _price;
        private _priceType;
        private _priceOrg;
        _baseNum: number;
        _payType: number;
        _info: string;
        msId: number;
        readonly m_resId: number;
        num: number;
        /**
         * 价值
         * @param value
         *
         */
        m_price: number;
        /**
         * 价值类型 1000:铜钱 1002，红包
         *
         */
        m_price_type: number;
        readonly price_str: string;
        /**
         * 原价
         * @param value
         *
         */
        priceOrg: number;
        /**
         *  物品基数
         * @param value
         *
         */
        baseNum: number;
        /**
         *  支付方式 0x08元宝兑换 0x10 彩券兑换+
         * @param value
         *
         */
        payType: number;
        info: string;
        constructor();
    }
}
declare module gamelib.data {
    /**
     * 邮件数据
     * @class MailData
     * @author wx
     */
    class MailData extends GameData {
        static s_list: Array<MailData>;
        static GetMail(id: number, forceCreate?: Boolean): MailData;
        static AllGet(): void;
        static AllRead(): void;
        /**
         * 是否有未领取附件的邮件
         */
        static canGet(): boolean;
        static ReadMail(obj: any): MailData;
        static RemoveMail(id: number): void;
        constructor();
        /**
         *  状态 4:已读，3：未读
         */
        status: number;
        /**
         * 标题
         */
        title: string;
        /**
         * 邮件内容
         */
        info: string;
        extraGetted: boolean;
        hasExtra: boolean;
        items: Array<any>;
        private _createTime;
        private _leftTime;
        private _items_des;
        /**
         * 创建时间
         */
        readonly createTime: string;
        readonly itemsDes: string;
        readonly leftTime: string;
        setDes(): void;
        setCreateTime(value: number): void;
        toString(): string;
    }
}
/**
 * Created by wxlan on 2017/9/4.
 */
declare namespace gamelib.data {
    /**
     * 网络配置数据，包括音乐音效的开关，新手引导的开关.各种需要保存在服务器的配置
     * 不要实例化次类。调用请使用g_net_configData
     * @class NetConfigDatas
     */
    class NetConfigDatas {
        m_waitConfig: boolean;
        m_bFirstLoginDay: boolean;
        /**
         * 保存配置。
         * @function addConfig
         * @DateTime 2018-03-17T14:49:58+0800
         * @param    {string}                 key   保存和读取的键。
         * @param    {any}                    value [description]
         */
        addConfig(key: string, value: any): void;
        getConfig(key: string): any;
        /**
         * 通过类型来获取配置
         * @function getConfigByType
         * @DateTime 2018-03-17T14:50:51+0800
         * @param    {number}                 type  0：sound,1:music,2:sub_sound,方言,3:guide
         * @return   {any}                         [description]
         */
        getConfigByType(type: number): any;
        /**
         * 通过类型来保存配置
         * @function addConfigByType
         * @DateTime 2018-03-17T14:51:42+0800
         * @param    {number}                 type  type  0：sound,1:music,2:sub_sound,方言,3:guide
         * @param    {any}                 value [description]
         */
        addConfigByType(type: number, value: any): void;
        private getKey(type);
        /**
         * 向服务器发包，保存当前的配置
         * @function saveConfig
         * @DateTime 2018-03-17T14:52:17+0800
         */
        saveConfig(): void;
        /**
         * 解析网络配置数据
         * @function getNetConfog
         * @DateTime 2018-03-17T14:52:42+0800
         * @param    {any}                    data [description]
         */
        getNetConfog(data: any): void;
    }
}
declare module gamelib.data {
    /**
     * 商城数据
     * @class ShopData
     * @author wx
     *
     */
    class ShopData extends GameData {
        static SetGoods(indexs: Array<number>): void;
        /**
         * 解析商城数据
         * @function PaseDatas
         * @static
         * @DateTime 2018-03-17T14:55:22+0800
         * @param    {any}                    root [description]
         */
        static PaseDatas(root: any): void;
        /**
         * 获得物品数据
         * @param index
         * @returns {any}
         */
        private static getGoodsData(index);
        /**
         * 通过buyindex活动商品数据信息
         * @function getGoodsInfoById
         * @static
         * @DateTime 2018-03-17T14:55:44+0800
         * @param    {number}                 buyindex [description]
         * @return   {any}                             [description]
         */
        static getGoodsInfoById(buyindex: number): any;
        /**
         * 解析商城2.0数据
         * @function
         * @DateTime 2018-07-18T16:58:18+0800
         * @param    {any}                    root [description]
         */
        private static parseShopDataV2(root);
        static s_shopDb: any;
        static s_list: Array<any>;
        static s_platformMoney: Array<any>;
        static s_fangkaList: Array<any>;
        static s_vips: Array<any>;
        static s_tabs: Array<any>;
        static s_platformIcon: string;
        static s_bShowPlatformMoney: boolean;
        static s_moneyType: string;
        m_huodongId: number;
        res_url: string;
        buyindex: number;
        m_price: number;
        m_price_name: string;
        m_des: string;
        m_type: number;
        constructor();
    }
}
declare module gamelib.data {
    /**
     * @class
     * 游戏玩家数据
     * @extends GameData
     */
    class UserInfo extends GameData {
        /**
         * @property {UserInfo} s_self
         * 玩家自己的数据,这个对象需要游戏在接受玩家自身信息包的时候，赋值
         * @static
         */
        static s_self: UserInfo;
        /**
         * @property {number} m_pId
         */
        m_pId: number;
        /**
         * @property {string} m_headUrl
         * 头像资源
         */
        private _headUrl;
        m_headUrl: string;
        /**
         * @property {string} m_title
         * 称号
         */
        m_title: string;
        /**
         * @property {number} m_title
         * 游戏获胜次数
         */
        m_winNum: number;
        /**
         * @property {number} m_gameNum
         * 游戏次数
         */
        m_gameNum: number;
        /**
         * @property {number} m_winRate
         * 胜率
         */
        m_winRate: number;
        /**
         * 经度
         * @type {number}
         */
        m_lon: number;
        /**
         * 纬度
         * @type {number}
         */
        m_lat: number;
        /**
         * 高度
         */
        m_altitude: number;
        /**
         * 网络座位号
         * @type {number}
         */
        m_seat_local: number;
        /**
         * 本地座位号
         * @type {number}
         */
        m_seat_net: number;
        /**
         * ip地址
         */
        m_ip: string;
        private _sex;
        private m_goodsList;
        private _name_ex;
        m_name: string;
        /**
         * @property {string} m_name_ex
         * 昵称，取m_name的0-8位字符，如果超出用...代替
         * @readonly
         */
        readonly m_name_ex: string;
        /**
         * @property {number} m_sex
         * 性别，0是女，1是男
         */
        m_sex: number;
        private _roomId;
        /**
         * @property {number} m_roomId
         * 房间号，如果为0表示在大厅
         * @readonly
         */
        m_roomId: number;
        /**
         * @property {number} m_leBi
         * 乐币
         */
        m_leBi: number;
        /**
         * @property {number} m_smallGameScore
         * 小游戏积分
         */
        m_smallGameScore: number;
        /**
         * @property {number} m_guessHelperNum
         * 猜拳助手
         */
        m_guessHelperNum: number;
        /**
         * @property {number} m_guessNum
         * 猜拳次数
         */
        m_guessNum: number;
        /**
         * @property {number} m_money
         * 铜钱数量
         */
        m_money: number;
        /**
         * @property {number} m_hb
         * 红包数量
         */
        m_hb: number;
        /**
         * @property {string} m_address
         * 地址
         */
        m_address: string;
        /**
         * @property {number} m_jjk
         * 救济卡
         */
        m_jjk: number;
        /**
         * @property {number} m_cskNum
         * 财神卡
         */
        m_cskNum: number;
        /**
         * @property {number} m_laba
         * 喇叭
         */
        m_laba: number;
        /**
         * @property {number} m_luckstart1
         * 小幸运星
         */
        m_luckstart1: number;
        /**
         * @property {number} m_luckstart2
         * 中幸运星
         */
        m_luckstart2: number;
        /**
         * @property {number} m_luckstart3
         * 超级幸运星
         */
        m_luckstart3: number;
        /**
         * @property {number} m_itemLevel
         * 道具等级
         */
        m_itemLevel: number;
        /**
         * @property {number} m_itemExpPer
         * 道具经验
         */
        m_itemExpPer: number;
        /**
         * @property {number} m_boxNum
         * 宝箱数量
         */
        m_boxNum: number;
        /**
         * @property {number} m_keyNum
         * 钥匙数量
         */
        m_keyNum: number;
        /**
         * @property {number} m_platformCoin
         * 平台货币数量
         */
        m_platformCoin: number;
        /**
         * @property {number} m_unreadMailNum
         * 未读邮件数量
         */
        m_unreadMailNum: number;
        private _level;
        private _registerTime;
        private _lastLoginTime;
        /**
         * @property {number} m_bqk
         * 补签卡
         */
        m_bqk: number;
        /**
         * @property {boolean} m_bSignIn
         * 可签到吗
         */
        m_bSignIn: boolean;
        /**
         * 钻石，用于棋牌圈，相当于金券
         * @type {number}
         */
        m_diamond: number;
        /**
         * 金券，用于棋牌圈
         * @type {number}
         */
        m_jinQuan: number;
        /**
         * 获得当前平台对应的货币数据
         * @function  getGold_num
         * @DateTime 2018-03-17T14:57:22+0800
         * @return   {number}                 [description]
         */
        getGold_num(isZj?: boolean): number;
        constructor();
        /**
         * @property {number} m_level
         * 等级
         */
        m_level: number;
        /**
         * @property {number} m_currentExp
         * 当前经验
         */
        m_currentExp: number;
        /**
         * @property {number} m_nextExp
         * 下一次升级经验
         */
        m_nextExp: number;
        /**
         * @property {string} m_designation
         * 财富称号
         */
        m_designation: string;
        /**
         * @property {number} gameVipLevel
         * 游戏vip等级 1-6
         */
        private _gamevipLevel;
        readonly gameVipLevel: number;
        private _vipLevel;
        vipLevel: number;
        m_vipData: any;
        /**
         * @method
         * 获取玩家的所有vip数据
         * @returns {Array<VipDate>}
         */
        /**
         * @method
         * 添加一个vip勋章
         * @param {VipDate} vd
         *
         */
        /**
         * @method
         * 获取指定的vip数据
         * @param {number} id
         * @returns {VipDate}
         */
        /**
         * @method
         * 删除一个vip勋章
         * @param {VipDate} vd
         *
         */
        /**
         * @method
         * 清除所有vip数据
         *
         */
        /**
         * @method
         * 解析所有vip数据
         * @param {Array<any>} arr
         */
        /**
         * @method
         * 解析单个vip数据
         * @param {any} obj
         */
        paseVipData(obj: any): void;
        /**
         * 处理打开背包协议
         * @param data
         */
        openBag(data: any): void;
        /**
         * 处理单个物品更新协议
         * @param data
         */
        onItemUpte(data: any): void;
        /**
         * 获得指定msid的物品对象
         * @param msId
         * @returns {GoodsData}
         */
        getGoodsByMsId(msId: number): any;
        getGooodsNumByMsId(msId: number): number;
        getBagGoods(): Array<any>;
        /**
         * @method
         * 设置注册时间
         * @param value
         *
         */
        setRegisterTime(value: number): void;
        /**
         * 获取注册时间
         * @return 时间字符串
         *
         */
        getRegisterTime(): string;
        /**
         * 设置最后登录时间
         * @param value
         *
         */
        setLastLoginTime(value: number): void;
        /**
         * 获取最后登录时间字符串
         * @function
         * @DateTime 2018-03-17T15:37:33+0800
         * @return   {string}                 [description]
         */
        getLastLoginTime(): string;
        /**
         * 获得铜钱描述
         * @returns {string} 例如1.11万，1.11亿
         */
        getMoneyDes(): string;
        /**
         * 获取目标相对于自己的地理位置距离
         * @param user
         * @returns {number}返回的距离，单位km
         */
        getDistance(user: data.UserInfo): any;
    }
}
declare namespace gamelib.firend {
    class FirendSystem {
        constructor();
    }
}
declare namespace gamelib.firend {
    class FirendUi extends gamelib.core.Ui_NetHandle {
        private _list;
        private _ts_list;
        private _tab;
        private _tip_new;
        private _list_view;
        private _add_view;
        private _sq_view;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        private showListView();
        private updateFirendList();
        private showAddView();
        private showSqView();
        private onTabChange(ev?);
        private onItemUpdate(box, index);
    }
}
declare namespace gamelib.loading {
    class LoadingModule {
        private _loadingUi;
        private _miniLoading;
        private _miniLoading_child;
        private _maskLoading;
        constructor();
        private onSignal(msg, data);
        /**
         * 更新游戏资源的进度
         * @function
         * @DateTime 2018-11-16T14:46:15+0800
         * @param    {number}                 progress [description]
         */
        updateResLoadingProgress(progress: number): void;
        private _point;
        /**
         * 缓存包的加载进度
         * @function
         * @DateTime 2018-11-16T14:37:47+0800
         */
        onCacheProgress(progress: string): void;
        /**
         *	显示主loading界面
         *
         */
        showLoadingUi(): void;
        /**
         * 关闭主loading界面。
         * @function
         * @DateTime 2018-11-16T14:50:09+0800
         */
        closeLoadingUi(): void;
        setLoadingTitle(msg: string): void;
        /**
         * 关闭主loading界面。
         * @function
         * @DateTime 2018-11-16T14:50:09+0800
         */
        close(): void;
        showMaskLoading(): loading.MaskLoading;
        closeMaskLoading(): void;
        /**
         * 关闭小loading
         * @function closeMiniLoading
         * @DateTime 2018-03-16T14:29:22+0800
         */
        closeMiniLoading(): void;
        /**
         * 打开小转圈
         * @function showMiniLoading
         * @DateTime 2018-03-16T14:29:38+0800
         * @param    {any}}    args [一个对象，msg:string,需要显示的文本
         *                           delay:number自动关闭的时间，秒为单位
         *                           alertMsg:string关闭时的提示文本，
         *                           callBack：function关闭时的回掉]
         */
        showMiniLoading(args?: {
            msg?: string;
            delay?: number;
            alertMsg?: string;
            callBack?: () => void;
            thisObj?: any;
        }): void;
        /**
         * 进入子游戏显示的loading
         * @function
         * @DateTime 2018-11-16T14:51:52+0800
         * @data 1:从游戏中返回大厅，0：从大厅中进入游戏
         */
        showEnterGameLoading(data: any): void;
        closeEnterGameLoading(): void;
    }
}
/**
 * Created by wxlan on 2017/8/29.
 */
declare namespace gamelib.loading {
    class LoadingUi extends gamelib.core.BaseUi {
        constructor();
        protected init(): void;
        protected onClose(): void;
        protected onShow(): void;
        showCopyright(): void;
        showProgress(pro: number): void;
    }
}
declare namespace gamelib.loading {
    class MaskLoading extends Laya.Sprite {
        constructor();
        show(): void;
        close(): void;
    }
}
declare namespace gamelib.loading {
    class MiniLoading extends gamelib.core.BaseUi {
        private ani1;
        private _bg;
        constructor();
        protected init(): void;
        setMsg(args: {
            msg?: string;
            delay?: number;
            alertMsg?: string;
            callBack?: () => void;
            thisObj?: any;
        }): void;
        updateMsg(msg: string): void;
        protected onShow(): void;
        protected onClose(): void;
        private onDelayed(args);
        protected onResize(evt?: Laya.Event): void;
    }
}
declare namespace gamelib.platform {
    /**
     * 检测平台货币
     * @function gamelib.platform.checkPlatfromMoney
     * @DateTime 2018-03-17T14:58:30+0800
     * @param    {function}               callback [description]
     */
    function checkPlatfromMoney(callback: () => void): void;
    /**
     * 微信分享回掉
     * @function gamelib.platform.onWxShareCallBack
     * @DateTime 2018-03-17T14:58:53+0800
     * @param    {any}                    ret [description]
     */
    function onWxShareCallBack(ret: any): void;
    /**
     * 支付.
     * @function gamelib.platform.pay
     * @DateTime 2018-03-17T14:59:20+0800
     * @param    {number}                 itemId  物品id
     * @param    {number}                 itemNum 充值数量
     * @param    {string}                 itemDes 物品描述
     */
    function pay(itemId: number, itemNum: number, itemDes: string): void;
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
    function buyGoods(gd: any, callback?: (data: any) => void, thisobj?: any, tips?: boolean, num?: number): void;
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
    function buyItem(buyIndex: number, price: number, itemDes: string, calback?: (data: any) => void, thisobj?: any, tips?: boolean, num?: number): void;
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
    function share_circle(gz_id: number, validation: string, gameId: number, groupId?: string, title?: string, desc?: string, img_url?: string, callBack?: Function, thisObj?: any): void;
    var g_wxShareUi: gamelib.control.ShareTip_wxUi;
    /**
     * 棋牌圈分享
     * @function gamelib.platform.share_circleByArgs
     * @DateTime 2018-03-17T15:04:37+0800
     * @param    {string}}               args     [description]
     * @param    {Function}               callBack [description]
     * @param    {any}                    thisObj  [description]
     */
    function share_circleByArgs(args: {
        gz_id: number;
        gameId: number;
        validation: string;
        groupId: string;
        wxTips?: boolean;
        fd?: number;
        js?: number;
        addDatas?: any;
        title?: string;
        desc?: string;
    }, callBack?: Function, thisObj?: any): void;
    /**
     * 拷贝房间号url到剪切板
     * @function
     * @DateTime 2018-12-04T19:04:16+0800
     * @param    {Function}               args    [description]
     * @param    {any}                    thisObj [description]
     */
    function copyShareUrlToClipboard(args: {
        gz_id: number;
        gameId: number;
        validation: string;
        groupId: string;
    }, callBack: Function, thisObj: any): void;
    /**
     * 获得棋牌圈分享的参数
     * @function gamelib.platform.get_share_circleByArgs
     * @DateTime 2018-03-17T15:05:07+0800
     * @param    {any}                  args     [description]
     * @param    {Function}               callBack [description]
     * @param    {any}                    thiobj   [description]
     */
    function get_share_circleByArgs(args: {
        gz_id: number;
        gameId: number;
        validation: string;
        groupId: string;
        fd?: number;
        js?: number;
        addDatas?: any;
    }, callBack: Function, thisobj: any): void;
    /**
     * 自动分享,非wx平台不做处理
     * @function gamelib.platform.autoShare
     * @DateTime 2018-03-17T15:06:04+0800
     */
    function autoShare(): void;
    /**
     * 分享app
     * @function gamelib.platform.shareApp
     * @DateTime 2018-03-17T15:06:24+0800
     * @param wx_firendCircle 分享微信朋友圈
     */
    function shareApp(callBack?: Function, thisobj?: any, wx_firendCircle?: boolean): void;
}
declare module gamelib.wxgame {
    /**
     * 小游戏登录流程
     * 1、登录微信
     * 2、获取微信用户信息
     * 3、登录平台
     * 4、获取urlParam
     * @function
     * @DateTime 2019-03-26T17:18:20+0800
     */
    function startup(callBack: Laya.Handler): void;
}
/**
 * Created by wxlan on 2017/9/5.
 */
declare namespace gamelib.common.qpq {
    /**
     * 结算界面
     */
    class QPQResultUi extends gamelib.core.BaseUi {
        private _data;
        private _player_container;
        private _itemList;
        private _btn_return;
        private _btn_info;
        private _btn_share;
        private _qrcodeImg;
        private _grap;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        setData(obj: any): void;
        private _itemW;
        private updateList();
        /**
         * 检测是否可以评价
         */
        private checkEstimate();
        protected onShow(): void;
        protected onClose(): void;
        private getItem();
        protected onClickObjects(evt: laya.events.Event): void;
        private searchPropertyInList(list, key, value);
    }
    class QPQResultItem extends laya.ui.View {
        constructor();
        createChildren(): void;
        clear(): void;
        setData(obj: any): void;
    }
}
/**
 * Created by wxlan on 2017/9/5.
 */
declare namespace gamelib.common {
    /**
     * 棋牌圈公告模块。包含战绩界面。总结算界面，详细结算界面，同ip提示，解散界面，历史信息,退出游戏，分享
     * 不要实例次类。请用g_qpqCommon
     * @class QpqCommonModule
     * @implements gamelib.core.INet
     */
    class QpqCommonModule implements gamelib.core.INet {
        priority: number;
        private _zhanji;
        private _resultUi;
        private _detailUi;
        private _vote;
        private _tipUi;
        private _tip_ip;
        private _histroy_person;
        private _histroy_zj;
        constructor();
        /**
         * 棋牌圈请求结果信息
         * @function requestResult
         * @DateTime 2018-03-17T15:08:42+0800
         * @param    {number}                 groupId [description]
         * @param    {number}      [page = 0]   [description]
         * @param    {number}      [number = 0]           number [description]
         */
        requestResult(groupId: number, page?: number, number?: number): void;
        /**
         * 解散逻辑
         * @function doJieSan
         * @DateTime 2018-03-17T15:09:35+0800
         * @param    {boolean}           [checkFz = true] checkFz [是否检测房主]
         */
        doJieSan(checkFz?: boolean): void;
        private _needToQuitGame;
        /**
         * 退出逻辑
         * 如果不是组局模式，发送0x0018协议。收到后在退出游戏
         * 如果是金币模式，直接退出子游戏
         * 如果是组局，进入退出组局的流程
         * @function doQuit
         * @DateTime 2018-03-17T15:10:24+0800
         */
        doQuit(): void;
        /**
         * 分享
         * @function doShare
         * @param {boolean}  [wxTips = true] 是否显示微信的提示框
         */
        doShare(wxTips?: boolean): void;
        /**
         * 游戏中返回棋牌圈
         * @function toCircle
         * @DateTime 2018-03-17T15:12:59+0800
         * @param    {boolean}  bRequestResult [是否请求结算信息]
         */
        toCircle(bRequestResult?: boolean, groupId?: number): void;
        /**
         * 请求指定游戏的规制
         * @function requestRule
         * @DateTime 2018-03-17T15:13:33+0800
         * @param    {any}                    info [description]
         */
        requestRule(info: any, callBack?: Laya.Handler): void;
        /**
         *
         * @param type 1-确定请求投票，2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局，8：同ip拒绝游戏
         * @param kickedUserName
         */
        /**
         * 显示提示框
         * @function showTip
         * @DateTime 2018-03-17T15:13:48+0800
         * @param    {number}  type 1-确定请求投票，2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局，8：同ip拒绝游戏
         * @param    {string}  [kickedUserName=""] 相关操作的玩家
         */
        showTip(type: number, kickedUserName?: string): void;
        show(): void;
        close(): void;
        protected onLocalSignal(msg: string, data: any): void;
        reciveNetMsg(msgId: number, data: any): void;
        private checkIp(data);
    }
}
declare namespace gamelib.common.qpq {
    /**
     * 战绩历史---金币场 请求0x2021
     * @type {[type]}
     */
    class QppHistroy_Person extends gamelib.core.Ui_NetHandle {
        private _page;
        private _list;
        private _cd;
        private _lastTime;
        private _data;
        private _allDatas;
        private _numOfPage;
        private _totalNum;
        private _maxHistroyNum;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        protected init(): void;
        private onPageChange(page);
        private showPage(page);
        private requestData(page);
        protected onShow(): void;
        private setDataSource(datasource);
        protected onClose(): void;
        private onItemUpdate(list, item, index);
    }
}
declare namespace gamelib.common.qpq {
    /**
     * 战绩历史---组局场 请求0x00FA
     * @type {[type]}
     */
    class QppHistroy_ZuJu extends gamelib.core.Ui_NetHandle {
        private _page;
        private _list;
        private _cd;
        private _lastTime;
        private _data;
        private _allDatas;
        private _numOfPage;
        private _totalNum;
        private _maxHistroyNum;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        protected init(): void;
        private onPageChange(page);
        private showPage(page);
        private requestData(page);
        protected onShow(): void;
        private setDataSource(datasource);
        protected onClose(): void;
        private onItemUpdate(list, item, index);
    }
}
/**
 * Created by Administrator on 2017/4/26.
 */
declare module gamelib.common.qpq {
    /**
     * 投票确认框
     */
    class QpqTip extends gamelib.core.BaseUi {
        /**
         * 1-确定请求投票，2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局
         */
        private _type;
        private _groupId;
        private _pos;
        constructor();
        protected init(): void;
        /**
         * 设置按钮数量
         * @param {number} type [description]
         */
        private setBtns(type);
        /**
         * 显示提示
         * @function
         * @DateTime 2018-03-17T15:39:28+0800
         * @param    {number}                 type  1-确定请求投票，2-投票未通过，3-投票通过，
         *                                          4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局
         *                                          8-同ip拒绝游戏
         * @param    {string}                 extra [description]
         */
        showTip(type: number, extra: string): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
 * Created by Administrator on 2017/5/3.
 */
declare module gamelib.common.qpq {
    class QpqTip_IP extends gamelib.core.BaseUi {
        private _tip_txt;
        private _btn_ok;
        private _sec;
        constructor();
        protected init(): void;
        showSameIp(ipStr: string, addStr: string, time: number): void;
        private checkValid(str);
        onShow(): void;
        onClose(): void;
        private onCount();
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
 *
 */
declare namespace gamelib.common.qpq {
    /**
     * 对局详情信息
     */
    class ResultDetail extends gamelib.core.Ui_NetHandle {
        private static s_list;
        private _normal;
        private _pageView;
        private _bInHall;
        m_clickHuiFang: boolean;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        protected init(): void;
        close(): void;
        protected onShow(): void;
        protected onClose(): void;
        showDetail(data: any): void;
    }
    class ResultDetailNormal {
        private _parent;
        private _list;
        private _data;
        private _res;
        private _tips;
        constructor(parent: ResultDetail, res: any);
        reciveNetMsg(msgId: number, data: any): void;
        setData(data: any): void;
        show(): void;
        private setCommonData();
        close(): void;
        private getPlayerInfo(pid, list);
        private onItemUpdate(item, index);
        private onClickReplay(evt);
        private setPlayerInfo(res, pd, data);
    }
    class ResultDetailPage {
        private _parent;
        private _res;
        private _data;
        private _items;
        private _page;
        private _numOfPage;
        private _totalNum;
        private _tips;
        constructor(parent: ResultDetail, res: any);
        private getNum();
        reciveNetMsg(msgId: number, data: any): void;
        private showPage(page);
        private onItemUpdate(list, box, index);
        private onPageChange(page);
        private getPlayerInfo(pid, list);
        setData(data: any): void;
        show(): void;
        close(): void;
        private onClickReplay(evt);
    }
}
/**
 * Created by wxlan on 2017/9/5.
 */
declare namespace gamelib.common.qpq {
    /**
     * 战绩界面
     */
    class ResultHistroyUi extends gamelib.core.Ui_NetHandle {
        private _list;
        private _data;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        protected onClose(): void;
        private onItemUpdate(item, index);
        private onSelect(index);
    }
}
declare module gamelib.common.qpq {
    /**
     * 投票界面
     */
    class VoteUi extends gamelib.core.BaseUi {
        private _list;
        private _tip1;
        private _tip2;
        private _sec;
        private _datasource;
        constructor();
        protected init(): void;
        onShow(): void;
        onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        update(data: any): void;
        private delayClose(juList);
        private timer();
        private setVoteInfo(pass, total);
        private onItemUpdate(box, index);
    }
}
/**
 * Created by wxlan on 2016/10/28.
 */
declare module gamelib.record {
    /**
     * 录音播放控件
     */
    class RecordPlay extends laya.display.Sprite {
        private _head;
        private _clip;
        private _bg;
        private _name;
        private _canPlay;
        private _sound_url;
        private _playing_sound;
        private _size_head_width;
        private _size_head_height;
        constructor();
        setData(obj: any): void;
        stop(): void;
        isPlaying(): boolean;
        /**
         * 声音播放完成
         * @param evt
         */
        private onSoundPlayEnd();
        private init();
        private onClickIcon(evt);
        private playSound(url);
        private playClip();
        private stopClip();
    }
}
/**
 * Created by wxlan on 2016/10/27.
 *
 */
declare namespace gamelib.chat {
    /**
     * 语言系统
     * @class RecordSystem
     */
    class RecordSystem {
        private static _instance;
        static readonly s_instance: RecordSystem;
        private _support;
        private _enterBtn;
        private _recordView;
        private _playingView;
        private _record_list;
        private _pos;
        private _downTime;
        constructor();
        destroy(): void;
        setEnterBtn(btn: any): void;
        private initEnterBtn();
        setPlayPos(x: number, y: number): void;
        private _bVolume_record;
        private _bVolume_play;
        private onSignal(msg, obj);
        private checkPlay();
        private onBeginTalk(evt);
        private onEndTalk(evt);
        private startRecord();
        private stopRecord();
    }
}
/**
 * Created by wxlan on 2016/10/27.
 *
 */
declare module gamelib.record {
    /**
     * 录音控件
     */
    class RecordingUi extends laya.display.Sprite {
        private _bmp;
        private _txt;
        private _time;
        private _totalTime;
        private _starRecordTime;
        private _length;
        constructor();
        totalTime: number;
        show(): void;
        close(): void;
        private onUpdate();
        private checkTime();
        /**
         * 录音录制完成,上传服务器
         * @param obj
         */
        private recordEnd(obj);
        /**
         * 录音上传完成.需要发送协议
         * @param data
         */
        private uploaderComplete(obj);
        private onTimer();
    }
}
declare module gamelib.socket {
    class BinaryPacket extends laya.utils.Byte {
        private _msgId;
        private _size;
        /**
         * @param messageId 消息id。
         * @param size 消息大小。
         */
        constructor(messageId?: number, data?: any);
        /**
         * 消息id。
         */
        readonly messageId: number;
        /**
         * 将报文体操作指针设置到到0。下一次调用读取方法时将在0位置开始读取，或者下一次调用写入方法时将在0位置开始写入。
         */
        reset(): void;
        GetArrayBuffer(): ArrayBuffer;
    }
}
declare module gamelib.socket {
    /**
     * @class
     * _socket.readyState
     * CONNECTING(数值为0)：表示正在连接
     * OPEN(数字值为1)：表示已建立连接
     * CLOSING(数字值为2)：表示正在关闭
     * CLOSED(数字值为3)：表示已经关闭
     *
     */
    class NetSocket extends laya.events.EventDispatcher {
        private _socket;
        private _pro;
        private package_end_str;
        private package_str_buff;
        static SOCKET_CLOSE: string;
        static SOCKET_CONNECTD: string;
        static SOCKET_GETMSG: string;
        static SOCKET_SERVER_ERROR: string;
        private _output;
        private _input;
        m_name: string;
        static SOCKET_TYPE: string;
        /**
         *
         * @param protocols 协议配置文件
         * @param protocols_common  公共协议配置文件
         * @constructor
         */
        constructor(protocols1: any, protocols_common: any, isXML: boolean);
        destroy(): void;
        /**
         * 连接指定服务器
         * @param {string}[ip = gamelib.data.GameVar.serverIp]
         * @param {any} [port = gamelib.data.GameVar.serverPort]
         */
        connectServer(url: any): void;
        private addListeners();
        private removeListeners();
        /**
         * 断开与服务器的连接
         */
        disconnect(): void;
        /**
         * 当前是否处于连接状态
         * @returns {boolean}
         */
        getConnected(): boolean;
        private send(packet);
        sendDataById(msgId: number, content: any): void;
        /**
         * 发送协议
         * @param msgId
         * @param content
         */
        sendDataByArgs(msgId: number, args: Array<any>): void;
        sendDataByMessage(message: any, content: any): void;
        sendMsgToServer(message: any): void;
        private onClose(e);
        private onOpen(evt);
        private onError(evt);
        private onReceiveMessage(message);
        private _cmd;
        private _length;
        private _tempPacket;
        protected handleBinaryType(ab: ArrayBuffer): void;
        protected handleStringType(str: string): void;
    }
}
declare module gamelib.socket {
    /**
     * @class Protocols
     * 协议文件
     */
    class Protocols {
        protected messageToId: any;
        protected idToMessage: any;
        protected formClientList: any;
        protected formServerList: any;
        protected debugList: any;
        init(root1: any, root2: any): void;
        protected parseRoot1(root: any): void;
        protected parseRoot(root: any): void;
        protected getNodeList(node: any): any;
        /**
         * 判断协议是否需要debug
         * @param packageId 协议号
         * @param type		1：client，2：sever
         *
         */
        private packageNeedDebug(packageId, type?);
        /**
         * 打包客户端数据
         * @function
         * @DateTime 2018-03-17T15:47:23+0800
         * @param    {number}                 msgId [协议号]
         * @param    {Array<any>}             args  [该协议需要发送的参数列表]
         * @param    {string}                 name  [当前socke名]
         * @return   {socket.BinaryPacket}          [description]
         */
        packetClientArgs(msgId: number, args: Array<any>, name?: string): socket.BinaryPacket;
        /**
         *打包客户端数据
         * {id:0x33,message:"下注",content:{...}}
         */
        packetClientData(data: any, name?: string): socket.BinaryPacket;
        /**
         *解包服务器数据 生成形如:{id:0x33,message:"下注",content:{...}}
         * type:  false.多维数组格式 true.循环嵌套格式
         */
        unpacketServerData(packet: socket.BinaryPacket, name?: string): any;
        private read(packet, typeAry, NameAry, debugObj);
        private write(packet, typeAry, nameAry, content);
        private writeArgs(packet, typeAry, nameAry, args);
    }
}
declare module gamelib.socket {
    /**
     * @class Protocols 数据源是json格式
     * 协议文件
     */
    class Protocols_Json extends Protocols {
        constructor();
        protected parseRoot(root: any): void;
        private parseNode(node);
    }
}
declare module gamelib.socket {
    class SocketEvent extends laya.events.Event {
        m_data: any;
        constructor(type: string, data?: any);
    }
}
/**
 * Created by wxlan on 2015/6/26.
 */
declare module utils {
    class Base64 {
        constructor();
        private static base64String;
        private static base64EncodeChars;
        private static base64DecodeChars;
        static base64encode(str: string): string;
        static base64decode(str: string): string;
        static utf16to8(str: string): string;
        static utf8to16(str: string): string;
        static CharToHex(str: string): string;
        static encode(data: string): string;
        static encodeByteArray(data: laya.utils.Byte): string;
        static decode(data: string): string;
        static decodeToByteArray(data: string): laya.utils.Byte;
        static fromArrayBuffer(arraybuffer: ArrayBuffer): string;
        static base64ToIndexNew(index: string): number;
        static toArrayBuffer(base64: string): ArrayBuffer;
    }
}
/**
 * Created by wxlan on 2016/5/5.
 */
declare var logStr: string;
/**
 * 快捷的打印消息到控制台
 * @param message {any} 要打印的数据
 */
declare function trace(message: any): string;
/**
 * 快捷的抛错误消息到控制台
 * @param error {any} 要抛出的错误
 */
declare function error(error: any): string;
/**
 * 快捷的抛出警告消息到控制台
 */
declare function warn(warn: any): string;
declare module gamelib {
    /**
     * 日志界面
     */
    class Log extends laya.display.Sprite {
        private _label;
        /**
         * 日志普通文本
         */
        label: laya.ui.Label;
        private _htmlText;
        /**
         * 日志当前的html文本
         */
        readonly htmlText: string;
        /**
         * HtmlTextParser解析最大行数
         */
        maxLength: number;
        constructor();
        private initChild();
        private static _useLog;
        /**
         * 隐藏/显示日志
         */
        static useLog: boolean;
        private static log;
        private static init();
        static trace(message: any): void;
        static warn(message: any): void;
        static error(message: any): void;
    }
}
declare class md5 {
    constructor();
    private hexcase;
    private b64pad;
    hex_md5(s: any): string;
    private b64_md5(s);
    private any_md5(s, e);
    private hex_hmac_md5(k, d);
    private b64_hmac_md5(k, d);
    private any_hmac_md5(k, d, e);
    private md5_vm_test();
    private rstr_md5(s);
    private rstr_hmac_md5(key, data);
    private rstr2hex(input);
    private rstr2b64(input);
    private rstr2any(input, encoding);
    private str2rstr_utf8(input);
    private str2rstr_utf16le(input);
    private str2rstr_utf16be(input);
    private rstr2binl(input);
    private binl2rstr(input);
    private binl_md5(x, len);
    private md5_cmn(q, a, b, x, s, t);
    private md5_ff(a, b, c, d, x, s, t);
    private md5_gg(a, b, c, d, x, s, t);
    private md5_hh(a, b, c, d, x, s, t);
    private md5_ii(a, b, c, d, x, s, t);
    private safe_add(x, y);
    private bit_rol(num, cnt);
}
declare module utils {
    class MathUtility {
        /**
         * @method
         * 产生一个low,high之间包含low,high的随机整数
         * @static
         * @param low
         * @param high
         * @returns {number}
         */
        static random(low: number, high?: number): number;
        static UTFLen(str: string): number;
        /**
         * @method
         * @static
         * 取符号运算符
         * @param value
         * @returns {number}
         */
        static sign(value?: number): number;
        /**
         * @method
         * @static
         * 夹取值 Keep a number between a low and a high.
         * @param {number}val
         * @param {number}low
         * @param {number}high
         * @returns {number}
         */
        static clamp(val: number, low?: number, high?: number): number;
        /**
         * 在字符串中获取数字
         * @function
         * @DateTime 2018-03-17T15:18:01+0800
         * @param    {string}                 str [description]
         * @return   {number}                     [description]
         */
        static GetNumInString(str: string): number;
        /**
         * 在字符串中获取浮点数
         * @function
         * @DateTime 2018-03-17T15:18:01+0800
         * @param    {string}                 str [description]
         * @return   {number}                     [description]
         */
        static GetFloatNumInString(str: string): number;
        /**
         * @method
         * @static
         * 插值
         * @param {number}v1
         * @param {number}v2
         * @param {number}factor
         * @returns {number}
         */
        static lerp(v1: number, v2: number, factor: number): number;
        /**
         * @method
         * @static
         * @param {Array<any>} ary
         * 乱序一个数组
         */
        static randomShuffle(ary: Array<any>): void;
        static isNumber(str: string): boolean;
        static isInt(str: string): boolean;
        static toInt(str: string): number;
        static toNumber(str: string): number;
        static toBoolean(str: string): boolean;
        /**
         *判断value 在 数轴上的区间位置序号
         * 如 3 在数轴[2,5,10]的第1个区间上
         * type ：区间类型   1.true: 每个区间是前闭后开 2.false:前开后闭
         *
         */
        static getInRange(value: number, rangeAry: Array<any>, type?: boolean): number;
        /**
         * 判断value 在 数轴上的区间位置序号
         * 如 3 在数轴[2,5,10]的第1个区间上
         * @param value
         * @param rangeAry
         * @param type：区间类型   1.true: 每个区间是前闭后开 2.false:前开后闭
         * @return 区间号
         *
         */
        static getPosInRange(value: number, rangeAry: Array<any>, type?: boolean): number;
        /**
         * @method
         * @static
         * 将16进制数值转成16进制字符串 length为数据部分的长度
         *
         */
        static toHexString(value: number, length?: number): string;
        /**
         *讲指定的秒转换成x天y小时z分钟的形式
         * @param second
         * @returns {any}
         */
        static secToTimeString(second?: number): string;
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
        static LantitudeLongitudeDist(lon1: number, lat1: number, lon2: number, lat2: number): number;
    }
}
declare module utils {
    class Random {
        seed: number;
        constructor(seed?: number);
        nextInt(min?: number, max?: number): number;
        next(min?: number, max?: number): number;
    }
}
declare module utils {
    /**
     * 检查输入的Email信箱格式是否正确
     * @function
     * @DateTime 2018-03-17T15:19:32+0800
     * @param    {string}                 strEmail [description]
     * @return   {boolean}                         [description]
     */
    function checkEmail(strEmail: string): boolean;
    /**
     *校验ip地址的格式
     * @function
     * @DateTime 2018-03-17T15:41:17+0800
     * @param    {string}                 strIP [description]
     * @return   {boolean}                      [description]
     */
    function isIP(strIP: string): boolean;
    /**
     * 检查输入手机号码是否正确
     * @function
     * @DateTime 2018-03-17T15:41:38+0800
     * @param    {string}                 strMobile [description]
     * @return   {boolean}                          [description]
     */
    function checkMobile(strMobile: string): boolean;
    /**
     * 检查输入的电话号码格式是否正确
     * @function
     * @DateTime 2018-03-17T15:41:53+0800
     * @param    {string}                 strPhone [description]
     * @return   {boolean}                         [description]
     */
    function checkPhone(strPhone: string): boolean;
    /**
     * 检查输入字符串是否为空或者全部都是空格
     * @function
     * @DateTime 2018-03-17T15:42:09+0800
     * @param    {string}                 str [description]
     * @return   {boolean}                    [description]
     */
    function isNull(str: string): boolean;
    /**
     * 检查输入对象的值是否符合整数格式
     * @function
     * @DateTime 2018-03-17T15:42:37+0800
     * @param    {string}                 str [description]
     * @return   {boolean}                    [description]
     */
    function isInteger(str: string): boolean;
    /**
     * 检查输入字符串是否符合正整数格式
     * @function
     * @DateTime 2018-03-17T15:42:57+0800
     * @param    {string}                 s [description]
     * @return   {boolean}                  [description]
     */
    function isNumber(s: string): boolean;
    function isMoney(s: any): boolean;
    function cTrim(sInputString: any, iType: any): string;
}
/**
 * Created by wxlan on 2017/1/10.
 */
declare module utils {
    class StringUtility {
        /**
         * 获得字符串的长度,中文算2个长度
         * @method
         * @static
         * @param {string} str
         * @returns {number}
         *
         */
        static GetStrLen(str: String): number;
        /**
         * 获取子字符串。中文算2个长度。
         *  @method
         * @static
         * @param str
         * @param length
         * @returns {string}
         *
         */
        static GetSubstr(str: string, length: number): string;
        /**
         * @method
         * @static
         * 获取时间串
         * @param time 指定时间的time值
         * @returns {string}
         */
        static GetTimeString(time: number): string;
        /**
         * 把指定的秒数转换成 x天x小时x分钟的格式
         * @param second
         * @returns {any}
         */
        static secToTimeString(second: number, format?: Array<string>): string;
        /**
         * 获得两个时间的间隔。几天前，几小时前，几分钟前
         * @function
         * @DateTime 2018-10-22T10:51:20+0800
         * @param    {number|string}          now  [description]
         * @param    {number|string}          last [description]
         * @return   {string}                      [description]
         */
        static getTimeGrapStr(now: number | string, last: number | string): string;
        static getNameEx(name: string, len?: number): string;
        /**
         * 去掉所有的换行符
         * @param str
         */
        static cleanEnter(str: string): string;
        /**
         * input字符串是否是以prefix开头
         */
        static beginsWith(input: string, prefix: string): boolean;
        /**
         * 去除所有的空格
         * @param {string} str [description]
         */
        static Trim(str: string): string;
        /**
 * input字符串是否以suffix结束
 * @param input
 * @param suffix
 * @returns {boolean}
 */
        static endsWith(input: string, suffix: string): boolean;
        /**
         * 把input中所有的replace替换成replaceWith，
         * @param input
         * @param replace
         * @param replaceWith
         * @returns {string}
         */
        static replace(input: string, replace: string, replaceWith: string): string;
        /**
         *  删除input中所有的remove；
         * @param input
         * @param remove
         * @returns {string}
         */
        static remove(input: string, remove: string): string;
        /**
         * 格式化字符串
         * @param  {string}     input "abc{0}你好{1}"
         * @param  {Array<any>} args  [1,"大家的"]
         * @return {string}           [abc1你好大家的]
         */
        static format(input: string, args: Array<any>): string;
    }
}
declare module utils.tools {
    function getRemoteUrl(url: string): string;
    /**
     * 拷贝字符串到剪切板
     * @function
     * @DateTime 2018-07-24T16:56:45+0800
     * @param    {string}                 str [description]
     */
    function copyStrToClipboard(str: string): void;
    function getMoneyByExchangeRate(money: number): string;
    function getExchangeRate(): number;
    /**
     * 截屏处理
     * @param {laya.display.Sprite} target [description]
     */
    function snapshotShare(target?: laya.display.Sprite, callBack?: Function, thisobj?: any): void;
    /**
     * 超出文本部分用...表示.注意，label一般是由美术提供的文本，宽度不能为0
     * @function
     * @DateTime 2018-11-05T17:24:16+0800
     * @param    {Laya.Label}             label [description]
     * @param    {number              =     0}           width [description]
     */
    function setLabelDisplayValue(label: Laya.Label, str: string, width?: number): void;
    /**
     * 屏蔽关键字
     * @param  {string} str [description]
     * @return {string}     [description]
     */
    function getBanWord(str: string): string;
    function clone(source: any): any;
    function copyTo(from: any, to: any): void;
    /**
     * @method
     * @static
     * 请求网页并返回
     * @param url 网页地址
     * @param postData 网页参数
     * @param method    方法
     * @param callback  回调
     */
    function http_request(url: string, postData: Object, method: string, callback: Function, errorCallBack?: Function): void;
    /**
     * @method
     * @static
     * 获取铜钱描述
     * @param money
     * @returns {string} 例如1.11万，100.1万,
     */
    function getMoneyDes(money: number): string;
    function isTestPid(): boolean;
    /**
     * 是否是组局模式
     * @returns {boolean}
     */
    function isQpq(): boolean;
    function isMatch(): boolean;
    function isGuanZhan(): boolean;
    function isWx(): boolean;
    function isWxgame(): boolean;
    /**
     * 当前游戏是否是棋牌圈大厅
     * @returns {boolean}
     */
    function isQpqHall(): boolean;
    function is(instance: any, typeName: string): boolean;
    /**
    **
    ** 生成二维码
    */
    function createQRCode(url: string, spr: laya.display.Sprite): laya.display.Sprite;
    function isApp(): boolean;
    function isRuntime(): boolean;
    function isAndroid(): boolean;
    function shakeScreen(effectType?: number): void;
    function shakeObj(obj: any): void;
    function quickSort(arr: Array<any>, key?: string): void;
    /**
     * 检测当前时间是否是在指定的时间段内
     * @function
     * @DateTime 2018-09-28T10:46:26+0800
     * string:可以为2018-09-27 17:00:00  或 2018/09/27 17:00:00的格式
     * @param    {string|number|Date}     startTime [description]
     * @param    {string|number|Date}     endTime   [description]
     * @return   {boolean}                          [description]
     */
    function checkInTimeSlot(startTime: string | number | Date, endTime: string | number | Date): boolean;
    function createSceneByViewObj(resname: string): Laya.Scene;
    function debugLoaderMap(url: string): void;
}
declare namespace gamelib {
    /**
     * @function gamelib.getDefinitionByName
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @language zh_CN
     */
    function getDefinitionByName(name: string): any;
}
declare var __global: any;
