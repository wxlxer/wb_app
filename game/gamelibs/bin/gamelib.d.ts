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
    class BaseUi {
        private static s_instanceList;
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
        constructor(classname: string);
        setData(params: any): void;
        show(): void;
        close(): void;
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
         * ui关闭后的回掉
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
    class Pmd extends Laya.Sprite {
        private _msgList;
        private _txt;
        private _container;
        private _scrolling;
        private _res;
        private _rec;
        private _speed;
        private _totalWidth;
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
         * 当前游戏的顶层
         * @type {laya.display.Sprite}
         * @access private
         */
        private _topLayer;
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
         * 设置游戏本身需要载入的文件,
         * @function setPreLoadingResList
         * @author wx
         * @DateTime 2018-03-16T12:03:52+0800
         * @param    {Array<any>}             arr [description]
         * @access protected
         */
        protected setPreLoadingResList(arr: Array<any>): void;
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
         * 登录
         * @type {string}
         * @static
         */
        static Login: string;
        /**
         * @property
         * 注册
         * @type {string}
         * @static
         */
        static Register: string;
        /**
         * @property
         * 获取公告
         * @type {string}
         * @static
         */
        static GongGao: string;
        /**
         * @property
         * 获取客服链接等
         * @type {string}
         * @static
         */
        static Systemseting: string;
        /**
         * @property
         * 获取弹出框页面
         * @type {string}
         * @static
         */
        static Indexhot: string;
        /**
         * @property
         * 游戏接口列表
         * @type {string}
         * @static
         */
        static Getapi: string;
        /**
         * @property
         * 7.	接口分类列表
         * @type {string}
         * @static
         */
        static Getapiassort: string;
        /**
         * @property
         * 8.	接口捕鱼分类列表
         * @type {string}
         * @static
         */
        static Getapifish: string;
        /**
         * @property
         * 9.	接口电子分类列表
         * @type {string}
         * @static
         */
        static Getapitypegame: string;
        /**
         * @property
         * 10.	接口电子列表
         * @type {string}
         * @static
         */
        static Getapigame: string;
        /** @type {11.	优惠活动} [description] */
        static Gethotall: string;
        /**
         * 12.	登出
         */
        static Logout: string;
        /**
         * 13.	实时余额获取
         */
        static Readmoney: string;
        /**
         * 14.	用户信息
         */
        static MemberInfo: string;
        /**
         * 15.	修改密码
         */
        static Updatepwd: string;
        /**
         * 16.	获取绑定信息
         */
        static Bindbank: string;
        /**
         * 17.	绑定银行卡
         */
        static Bindbankadd: string;
        /**
         *18.	获取红包还能领取的次数
         */
        static rednum: string;
        /**
         * 	19.	领红包
         */
        static Receivingenvelope: string;
        /**
        * 20.	领取实时返水金额
        */
        static Rreceivereturn: string;
        /**
          * 21.	申请代理
          */
        static Subagent: string;
        /**
         * 22.	登陆游戏
         */
        static login_game: string;
        /**
        * 23.	交易记录
        */
        static moneyinfo: string;
        /**
         *24.	交易明细
         */
        static Mconvertrecord: string;
        /**
         *25.	下注记录
         */
        static Betinfodata: string;
        /**
         * 26.	获取实时返水金额
         */
        static Realtimereturn: string;
        /**
         * 27.	取款
         */
        static Moneyout: string;
        /**
         * 28.	银行卡,二维码收款信息
         */
        static Bankinfo: string;
        /**
         * 29.	支付银行列表
         */
        static Payinfolist: string;
        /**
         * 30.	取款银行列表选择款
         */
        static Bankinfolist: string;
        /**
         * 31.	老带新基本信息
         */
        static Oldwithnewinfo: string;
        /**
         * 32.	老带新 列表
         */
        static Oldwithnewinfolist: string;
        /**
         * 33.	站内信
         */
        static Websitemaillist: string;
        /**
         * 34.	删除站内信
         */
        static Websitemaildelete: string;
        /**
         * 35.	阅读站内信
         */
        static Readwebsitemail: string;
        /**
         * 36.	转账操作
         */
        static Convertmoney: string;
        /**
        * 37.	一键转出
        */
        static Onetouchtransfer: string;
        /**
        * 38.	查询所有余额
        */
        static Getuserplatform: string;
        /**
        * 39.	查询单个平台余额
        */
        static Ref_ed: string;
        /**
        * 40.	银行卡存款
        */
        static Moneyinhk: string;
        /**
        * 41.	二维码存款
        */
        static Moneyinqr: string;
        /**
        *42.	在线支付
        */
        static Payapi: string;
        /**
        * 43.	申请优惠活动
        */
        static Applicationhot: string;
        /**
        * 44.	验证取款密码
        */
        static Getqkpwd: string;
    }
}
declare namespace gamelib.core {
    class GameNet {
        m_domain: string;
        private _signal;
        private _listeners;
        constructor();
        request(url: string, data: any): void;
        private onReciveNetMsg(api, data);
        addListener(target: INet): void;
        removeListener(target: INet): void;
    }
    /**
     * @interface INet
     * 可以接受网络数据的接口
     */
    interface INet {
        priority: number;
        reciveNetMsg(api: string, data: any): void;
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
declare var g_net: gamelib.core.GameNet;
/**
 * ui管理器
 * @global
 * @type {gamelib.core.UiMainager}
 */
declare var g_uiMgr: gamelib.core.UiMainager;
/**
 * 主游戏入口实例
 * @type {gamelib.core.GameMain}
 * @global
 */
declare var g_gameMain: gamelib.core.GameMain;
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
 * 播放按钮音效
 * @global
 * @function playButtonSound
 * @DateTime 2018-03-16T12:28:12+0800
 */
declare function playButtonSound(): void;
declare function playCloseSound(): void;
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
declare function navigateToURL(url: string): void;
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
        private _index;
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
        private _shopUi;
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
        reciveNetMsg(api: string, data: any): void;
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
/**
 * @class
 * 登录数据相关
 * @author wx
 *
 */
declare class GameVar {
    static s_version: string;
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
    static readonly s_bActivate: boolean;
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
    static urlParam: Object;
    constructor();
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
         * @param    {number}  type  0：sound,1:music,2:sub_sound,方言,3:guide
         * @return   {any}   [description]
         */
        getConfigByType(type: number): any;
        /**
         * 通过类型来保存配置
         * @function addConfigByType
         * @DateTime 2018-03-17T14:51:42+0800
         * @param    {number}  type  type  0：sound,1:music,2:sub_sound,方言,3:guide
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
        static GetAllNumberInString(str: string, isFloat?: boolean): Array<number>;
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
        static getTimeGrapStr(now: any, last: any): string;
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
    function getLocalStorage(key: string): any;
    function saveLocalStorage(key: string, value: string): void;
    function copyToClipboard(str: any, callBack?: Function): void;
    /**
     * 拷贝字符串到剪切板
     * @function
     * @DateTime 2018-07-24T16:56:45+0800
     * @param    {string}                 str [description]
     */
    function copyStrToClipboard(str: string): void;
    /**
     * 截屏处理
     * @param {laya.display.Sprite} target [description]
     */
    function snapshotShare(target: laya.display.Sprite, callBack?: Function, thisobj?: any): void;
    /**
     * 超出文本部分用...表示.注意，label一般是由美术提供的文本，宽度不能为0
     * @function
     * @DateTime 2018-11-05T17:24:16+0800
     * @param    {Laya.Label}             label [description]
     * @param    {number              =     0}           width [description]
     */
    function setLabelDisplayValue(label: Laya.Label, str: string, width?: number): void;
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
    function http_request(url: string, postData: Object, method: string, callback: Laya.Handler): void;
    /**
    **
    ** 生成二维码
    */
    function createQRCode(url: string, spr: laya.display.Sprite): laya.display.Sprite;
    function isAndroid(): boolean;
    function shakeScreen(effectType?: number): void;
    function shakeObj(obj: any): void;
    function quickSort(arr: Array<any>, key?: string): void;
    function debugLoaderMap(url: string): void;
}
