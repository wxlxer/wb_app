/**
 * Created by wxlan on 2017/8/28.
 */
namespace gamelib.core
{
    /**
     * 游戏中美术提供资源，程序使用美术提供资源的基类。
     * 美术资源的对象为_res;
     * 逻辑包括：自动生成界面，显示、关闭、消耗、自适应屏幕
     * 美术资源中，把所有静态的图层放到组里面，命名为s_bgxx(xx为数字);
     * 会把这些静态图当成一张图片来渲染，提升效率
     * @class BaseUi
     * @author wx
     */
    export class BaseUi 
    {
        
        private static s_instanceList:Array<BaseUi> = [];
        protected _isModal:boolean = true;
        /**
         * 是否是弹窗样式ui
         * @type {boolean}
         * @access protected
         */
        protected _isDialog:boolean;

        /**
         * 资源对象
         * @type {any}
         * @access protected
         */
        protected _res:any;//laya.ui.Component;

        /**
         * 按钮列表
         * @type {Array<any>}
         * @access protected
         */
        protected _clickEventObjects:Array<any>;
        /**
         * 关闭按钮
         * @access protected
         * @type {laya.ui.Button}
         */
        protected btn_close:laya.ui.Button;

        protected _isDestroyed:boolean;

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

        /** 
         * @type {number} 当前的层级 
         * @access public
         */
        public m_layer:number;

        /**
         * 点击背景的时候是否关闭此界面. 默认为true
         * @access public
         * @type {boolean}
         */
        public m_closeUiOnSide:boolean;       

        public isClosedByCloseBtn:boolean;

        protected _scene:Laya.Scene;

        protected _autoDestroy:boolean;
        public constructor(classname:string)
        {
            this.m_layer = 0;
            this.m_closeUiOnSide = true;
            this._autoDestroy = classname == null;
            if(classname)
            {
                var cl = Laya.ClassUtils.getClass(classname);
                this._scene = new cl();
                this._scene.name = classname;
                this.__init();
            }
            BaseUi.s_instanceList.push(this) ;
        }

        public setData(params:any):void
        {

        }
        public show():void
        {
            if(this._scene.parent == null)
                this._scene.open(false);
            this._res.zOrder = this.m_layer;
            this.onResize();
            if(this._isDialog)
            {
                
                // this._res["popup"]();
                this._closeByMaskBg = true;
                if(this._noticeOther)
                    g_signal.dispatch("onDailogOpen",this);

                var arr:Array<any> = g_dialogMgr.maskLayer["__listenerList"] || [];
                arr.push(this);
                g_dialogMgr.maskLayer["__listenerList"] = arr;
                g_dialogMgr.maskLayer.offAll(Laya.Event.CLICK);
                g_dialogMgr.maskLayer.on(Laya.Event.CLICK,this,this.onClickBg);
            }
            for(var item of this._clickEventObjects)
            {
                item.on(laya.events.Event.CLICK,this,this.onClickObjects);
            }
            this.isClosedByCloseBtn = false;
            Laya.stage.on(laya.events.Event.RESIZE,this,this.onResize);
            Laya.stage.on(laya.events.Event.FOCUS,this,this.onFocus);
            if(this.btn_close)
                this.btn_close.on(laya.events.Event.CLICK,this,this.onClickCloseBtn);
            this.onShow();
        }
        public close():void
        {
            if(this._scene.parent != null)
            {
                this._scene.close();
                if(this._isDialog)
                {
                    if(this._noticeOther && this._closeByMaskBg)
                        g_signal.dispatch("onDailogClose",this);
                }
            }     
            if(this._isDialog)
            {
                this._closeByMaskBg = false;
                g_dialogMgr.maskLayer.off(Laya.Event.CLICK,this,this.onClickBg);
                var arr:Array<any> = g_dialogMgr.maskLayer["__listenerList"] || [];
                var index:number = arr.indexOf(this);
                if(index >= 0)
                    arr.splice(index,1);
                for(var temp of arr)
                {
                    g_dialogMgr.maskLayer.on(Laya.Event.CLICK,temp,temp.onClickBg);    
                }
            }
            else
            {
                // this._res.removeSelf();

            }

            for(var item of this._clickEventObjects)
            {
                item.off(laya.events.Event.CLICK,this,this.onClickObjects);
            }
            if(this.btn_close)
                this.btn_close.off(laya.events.Event.CLICK,this,this.onClickCloseBtn);
            Laya.stage.off(laya.events.Event.RESIZE,this,this.onResize);
            Laya.stage.off(laya.events.Event.FOCUS,this,this.onFocus);
            this.onClose();
        }
        private __init():void
        {
            this._res = this._scene;
            this._isDialog = (this._res instanceof laya.ui.Dialog);

            if(this._isDialog)
            {
                this._res["closeHandler"] = Laya.Handler.create(this,this.onDialogClosed,null,false);                    
                this._noticeOther = false;
                //this._res["onOpened"] = this.onOpened;
            }
            this._clickEventObjects = [];
            this.btn_close = this._res["btn_close"];

            if(this._res["s_bg"])
            {
                this._res["s_bg"].cacheAsBitmap = true;
            }
            var i = 0;
            while(i >= 0)
            {
                if(this._res["s_bg" + i])
                {
                    this._res["s_bg" + i].cacheAsBitmap = true;
                    i++;
                }
                else
                {
                    i = -1;
                }
            }
            this.init();            
            if(this._isDialog)
                this._res['isModal'] = this._isModal;
        }
        
         /**
         * 将按钮添加到事件监听列表中。
         * 需要重写onClickObjects方法来实现点击逻辑
         * @function addBtnToListener
         * @author wx
         * @DateTime 2018-03-15T20:57:24+0800
         * @param    {string}   name 按钮对象的var。注意是var，不是name
         * @access public
         */
        public addBtnToListener(name:string):void
        {
            var temp = this._res[name];
            if(temp == null)
            {
                console.log("addBtnToListener 失败" + name);
                return;
            }
            temp.mouseEnabled = true;
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
         * @DateTime 2018-03-16T10:15:32+0800
         * @access protected
         */
        protected onShow():void
        {

        }
        /**
         * 界面关闭会自动调用。不要主动都调用
         * @function onClose
         * @author wx
         * @DateTime 2018-03-16T10:16:12+0800
         * @access protected
         */
        protected onClose():void
        {

        }
        /**
         * 销毁界面。需要重写
         * @function destroy
         * @author wx
         * @DateTime 2018-03-16T10:16:29+0800
         * @access public
         */
        public destroy():void
        {
            if(this._scene)
            {
                this.close();
                this._scene.destroy();
            }    
            var index = BaseUi.s_instanceList.indexOf(this) ;
            if(index >= 0)
                BaseUi.s_instanceList.splice(index,1);
            this._isDestroyed = true;
            this._res = null;
            this._clickEventObjects.length = 0;
            this._clickEventObjects = null;
            this.btn_close = null;
            this._scene = null;
            this.onDestroy();
        }
        /**
         * 在scene销毁的时候会掉次方法
         * @function
         * @DateTime 2019-01-04T16:50:32+0800
         */
        public onDestroy():void
        {
        }
        
        /**
         * 舞台尺寸改变的时候的回掉。不要重写
         * @function onResize
         * @author wx 
         * @DateTime 2018-03-16T10:19:12+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onResize(evt?:laya.events.Event):void
        {
            if(!this._isDialog)
            {
                this._res.size(Laya.stage.width,Laya.stage.height);
            }
            else
            {
                // this._res.scale(g_scaleRatio);
            }            
        }
        protected onFocus(evt?:Laya.Event):void
        {
            if(!this._isDialog)
            {
                this._res.size(Laya.stage.width,Laya.stage.height);
            }
        }
        /**
         * 点击背景的回掉
         * @function onClickBg
         * @author wx
         * @DateTime 2018-03-16T10:29:29+0800
         * @param    {laya.events.Event}      evt [description]
         * @access private
         */
        private onClickBg(evt?:laya.events.Event):void
        {
            if(evt)
                evt.stopPropagation();
            playButtonSound();
            if(this.m_closeUiOnSide)
            {
                this.close();
            }
        }
        /**
         * 按钮点击事件的回掉
         * @function onClickObjects
         * @author wx
         * @DateTime 2018-03-16T10:19:39+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onClickObjects(evt:laya.events.Event):void
        {

        }
        /**
         * 关闭按钮的回掉.会调用this.close();
         * @function onClickCloseBtn
         * @author wx
         * @DateTime 2018-03-16T10:20:15+0800
         * @param    {laya.events.Event}      evt [description]
         * @access protected
         */
        protected onClickCloseBtn(evt:laya.events.Event):void
        {
            evt.stopPropagation();
            playSound_qipai(g_closeUiSoundName,1,null,true);
            this.isClosedByCloseBtn = true;
            this.close();
        }
        /**
         * ui关闭后的回掉
         * @function onDialogClosed
         * @author wx
         * @DateTime 2018-03-16T10:30:11+0800
         * @access protected
         */
        protected onDialogClosed():void
        {            
            if(this._autoDestroy)
            {
                this.destroy();
            }

        }
        /**
         * 界面关闭特效
         * @function onDialogCloseEffect
         * @author wx
         * @DateTime 2018-03-16T10:31:35+0800
         * @access protected
         */
        protected onDialogCloseEffect():void
        {
            this._res.manager.doClose(this._res);
        }
        /**
         * 界面显示特效
         * @function onDialogShowEffect
         * @author wx
         * @DateTime 2018-03-16T10:31:56+0800
         * @access protected
         */
        protected onDialogShowEffect():void{
            this._res.manager.doOpen(this._res);
        }
    }
}

