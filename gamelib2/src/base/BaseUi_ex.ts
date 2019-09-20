/**
 * Created by wxlan on 2017/8/28.
 */
namespace gamelib.core
{
    /**
     * @class BaseUi_ex
     * @author wx
     * 非dialog界面.用动画的形式打开和关闭。游戏牌桌中结算用弹出框的形式，
     * 屏幕适配的时候会出问题
     * 
     */
    export class BaseUi_ex implements IDestroy,INet
    {
        /**
         * 指定获得网络数据的优先级
         * @access public
         * @type {number}
         */
        public priority:number;
        /**
         * 资源的引用。
         * @access protected
         * @type {any}
         */
        protected  _res:any;
        protected _clickEventObjects:Array<any>;
        /**
         * 关闭按钮
         * @access protected
         * @type {laya.ui.Button}
         */
        protected btn_close:laya.ui.Button;
        /**
         * 是否被销毁
         * @access protected
         * @type {boolean}
         */
        protected _isDestroyed:boolean;

        /** 
         * @type {number} 当前的层级 
         * @access public
        */

        public m_layer:number;

        /**
         * 是否通知其他ui此界面的打开和关闭，主要用于大厅中关闭和显示的时候播放大厅的动画
         * @type {boolean}
         * @access protected
         */
        protected _noticeOther:boolean;
        /**
         * 点击背景的时候是否关闭此界面
         * @type {boolean}
         * @access protected
         */
        protected _closeByMaskBg:boolean;

        public isClosedByCloseBtn:boolean;
        private __oldWidth:number;
        private __oldHeight:number;
        private __oldX:number;
        private __oldY:number;
        public constructor(resname:string)
        {
            this.m_layer = 0;
            var classObj = gamelib.getDefinitionByName(resname);
            if(classObj == null)
            {
                console.log(resname +" 不存在");
            }
            else
            {
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
        public addBtnToListener(name:string):void
        {
            var temp = this._res[name];
            if(temp == null)
            {
                console.log("addBtnToListener 失败" + name);
                return;
            }
            this._clickEventObjects.push(temp);
            temp.name = name;
        }
        public removeBtnToListener(name:string):void
        {
            for(var i:number = 0; i < this._clickEventObjects.length; i++)
            {
                if(this._clickEventObjects[i].name == name)
                {
                    this._clickEventObjects.splice(i,1);
                    return;
                }

            }
        }
        /**
         * 接收到网络消息的处理
         * @function reciveNetMsg
         * @author wx
         * @access public
         * @DateTime 2018-03-15T20:59:01+0800
         * @param    {number}                 msgId 协议号，例如0x0001
         * @param    {any}                    data  [description]
         */
        public reciveNetMsg(msgId:number,data:any):void
        {

        }
        /**
         * 初始化的工作放到这个函数里面，需要重写。不要主动都调用
         * @function init
         * @author wx 
         * @access protected
         * @DateTime 2018-03-16T10:14:55+0800
         */
        protected init():void
        {

        }
        /**
         * 界面显示后会自动调用.不要主动都调用
         * @function onShow
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:15:32+0800
         */
        protected onShow():void
        {

        }
        /**
         * 界面关闭会自动调用。不要主动都调用
         * @function onClose
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:16:12+0800
         */
        protected onClose():void
        {

        }
        /**
         * 销毁界面。需要重写
         * @function destroy
         * @author wx
         * @access public
         * @DateTime 2018-03-16T10:16:29+0800
         */
        public destroy():void
        {
            if(this._isDestroyed)
                return;
            this._isDestroyed = true;
            this.close();
            Laya.Tween.clearAll(this._res);
            this._res = null;
            this._clickEventObjects.length = 0;
            this._clickEventObjects = null;
            this.btn_close = null;
        }
        /**
         * 把界面显示到舞台上。不要重写。
         * 会根据 m_layer 来设置层级;会自动给_clickEventObjects的每个对象添加监听
         * 回自动调用this.onShow();
         * @function show
         * @author wx
         * @access public
         * @DateTime 2018-03-16T10:17:08+0800
         */
        public show():void
        {
            if(this._res.parent)
                return;
            this._res.zOrder = this.m_layer;
            this.onResize();
            g_layerMgr.addChild(this._res);
            this.onDialogShowEffect();
            this.isClosedByCloseBtn = false;
            for(var item of this._clickEventObjects)
            {
                item.on(laya.events.Event.CLICK,this,this.onClickObjects);
            }
            if(this._noticeOther)
                g_signal.dispatch("onDailogOpen",this);            
            Laya.stage.on(laya.events.Event.RESIZE,this,this.onResize);
            if(this.btn_close)
                this.btn_close.on(laya.events.Event.CLICK,this,this.onClickCloseBtn);
            g_net.addListener(this);
            this.onShow();

        }
        /**
         * 从舞台上移除界面.回自动调用this.onClose();
         * @function close
         * @author wx
         * @access public
         * @DateTime 2018-03-16T10:18:48+0800
         */
        public close():void
        {
            if(!this._res.parent)
                return;
            // this._res.removeSelf();
            this.onDialogCloseEffect();
            for(var item of this._clickEventObjects)
            {
                item.off(laya.events.Event.CLICK,this,this.onClickObjects);
            }
            if(this._noticeOther)
                g_signal.dispatch("onDailogClose",this);
            if(this.btn_close)
                this.btn_close.off(laya.events.Event.CLICK,this,this.onClickCloseBtn);
            Laya.stage.off(laya.events.Event.RESIZE,this,this.onResize);
             g_net.removeListener(this);
            this.onClose();
        }
        /**
         * 舞台尺寸改变的时候的回掉。不要重写
         * @function onResize
         * @author wx 
         * @access protected
         * @DateTime 2018-03-16T10:19:12+0800
         * @param    {laya.events.Event}      evt [description]
         */
        protected onResize(evt?:laya.events.Event):void
        {
            this._res.size(Laya.stage.width/g_scaleRatio,Laya.stage.height/g_scaleRatio);         
        }
        /**
         * 按钮点击事件的回掉
         * @function onClickObjects
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:19:39+0800
         * @param    {laya.events.Event}      evt [description]
         */
        protected onClickObjects(evt:laya.events.Event):void
        {

        }
        /**
         * 关闭按钮的回掉.会调用this.close();
         * @function onClickCloseBtn
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:20:15+0800
         * @param    {laya.events.Event}      evt [description]
         */
        protected onClickCloseBtn(evt:laya.events.Event):void
        {
            playSound_qipai(g_closeUiSoundName);
            this.isClosedByCloseBtn = true;
            this.close();
        }


        protected onDialogCloseEffect():void
        {
            var centerX:number,centerY:number;
            if(g_scaleXY == "x")
            {
                centerX = g_gameMain.m_gameWidth / 2;
                centerY = g_gameMain.m_gameHeight / 2 + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio ) / 2 / g_scaleRatio;
            }
            else
            {
                centerX = g_gameMain.m_gameWidth / 2 + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio ) / 2 / g_scaleRatio;
                centerY = g_gameMain.m_gameHeight / 2;
            }
            Laya.Tween.to(this._res,{x:centerX,y:centerY,scaleX:0,scaleY:0},300,Laya.Ease.strongOut,Laya.Handler.create(this,this.doClose));
        }
        private doClose():void
        {

            this._res.removeSelf();
        }
        protected onDialogShowEffect():void
        {
            this._res.scale(1,1);
            this._res.x = this.__oldX;
            this._res.y = this.__oldY;
            var centerX:number,centerY:number;
            if(g_scaleXY == "x")
            {
                centerX = g_gameMain.m_gameWidth / 2;
                centerY = g_gameMain.m_gameHeight / 2 + (Laya.stage.height - g_gameMain.m_gameHeight * g_scaleRatio ) / 2 / g_scaleRatio;
            }
            else
            {
                centerX = g_gameMain.m_gameWidth / 2 + (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio ) / 2 / g_scaleRatio;
                centerY = g_gameMain.m_gameHeight / 2;
            }
            Laya.Tween.from(this._res,{x:centerX,y:centerY,scaleX:0,scaleY:0},300,Laya.Ease.backOut);                
        }

    }
}
