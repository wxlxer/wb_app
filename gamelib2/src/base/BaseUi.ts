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
    export class BaseUi extends Laya.Script
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

        private _vars:Array<any>;

        protected _excepts:Array<any>;    //不需要自动切换语言的对象列表
        public constructor(resname:string)
        {
            super();
            this.m_layer = 0;
            this.m_closeUiOnSide = true;
            this._autoDestroy = resname == null;
            if(resname)
            {
                this._scene = utils.tools.createSceneByViewObj(resname);
                this._scene.name = resname;
                this.onSceneLoaded(this._scene);
            }
            BaseUi.s_instanceList.push(this) ;
        }

        public setData(params:any):void
        {

        }
        public onAwake():void
        {
            if(this._autoDestroy)
                this.__init();
        }
        /**
         * 解决子页面嵌套获取不到var的情况(2.1之前)
         * @function
         * @DateTime 2019-01-05T17:02:31+0800
         * @param    {[type]}                 var child of this._res._children [description]
         */
        private initProps(view:Laya.Node,root:any):void
        {
            if(view instanceof Laya.View)
            {
                if(view['var'])
                {
                    root[view['var']] = view;
                }
                this.initViewProps(view,view);
            }
            else
            {
                for(var child of view._children)
                {
                    this.initProps(child,root);
                }
            }       
        }
        /**
         * 子页面不能再嵌套子页面了
         * @function
         * @DateTime 2019-01-07T10:11:04+0800
         * @param    {Laya.Node}              view [description]
         * @param    {any}                    root [description]
         */
        private initViewProps(view:Laya.Node,root:any):void
        {
            if(view['var'])
            {
                root[view['var']] = view;
            }
            var len:number = view._children.length;
            for(var i:number = 0; i < len; i++)
            {
                this.initViewProps(view._children[i],root);
            }
        }


        /**
         * 修复页面嵌套
         * @function
         * @DateTime 2019-01-05T15:11:40+0800
         */
        private initUiViewProps():void
        {

        }
        public onEnable():void
        {
            this._res.zOrder = this.m_layer;
            this.onResize();
            if(this._isDialog)
            {
                
                g_uiMgr.m_temp_ui = this;
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
            // else
            // {
            //     g_layerMgr.addChild(this._scene);
            // }
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
            g_signal.add(this.onBaseLocalMsg,this);
            if(isMultipleLans())
            {
                this.changeResourceByLan();
            }
        }
        public onDisable():void
        {
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
            g_signal.remove(this.onBaseLocalMsg,this);
        }
        private onSceneLoaded(scene:Laya.Scene):void
        {
            scene.addComponentIntance(this);
            this._scene = scene;
            this.__init();
        }
        private __init():void
        {
            this._res = this.owner;
            this._scene = this._res;
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
            if(isMultipleLans())
            {
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
            if(this._isDialog)
                this._res['isModal'] = this._isModal;
        }
        private initVars(obj:Laya.Scene):void
        {
            var arr:Array<string> = Object.getOwnPropertyNames(obj);
            for(var key of arr)
            {
                if(key == "_scene" || key == "_parent")
                    continue;
                var varObj:any = obj[key];
                if(varObj == null || varObj instanceof Array || typeof varObj == "string" ||typeof varObj == "number"||typeof varObj == "boolean" || varObj == obj)
                    continue;
                if(varObj instanceof Laya.UIComponent)
                {
                    this._vars.push(varObj);
                }
                if(varObj instanceof Laya.Scene)
                {
                    if(varObj['runtime'])
                    {
                        this.initVars(varObj);
                    }
                }
            }
        }
        /**
         * 设置对象不自动切换语言
         * @param item 
         */
        protected addItemToExceptsList(item:any):void
        {
            if(!isMultipleLans())
                return;
            this._excepts = this._excepts || [];
            this._excepts.push(item);
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
        protected onBaseLocalMsg(msg:string,data:any):void
        {
            switch(msg)
            {
                case gamelib.GameMsg.CHANGELAN:
                    this.changeResourceByLan();
                    break;
            }
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
            
            if(this._vars)
                this._vars.length = 0;
            if(this._excepts)
                this._excepts.length = 0;
            this._vars = this._excepts = null;
        }
        /**
         * 在scene销毁的时候会掉次方法
         * @function
         * @DateTime 2019-01-04T16:50:32+0800
         */
        public onDestroy():void
        {
            if(g_uiMgr.m_temp_ui == this)
                g_uiMgr.m_temp_ui = null;
            this._isDestroyed = true;
            this._res = null;
            this._clickEventObjects.length = 0;
            this._clickEventObjects = null;
            this.btn_close = null;
            this._scene = null;
        }
        /**
         * 把界面显示到舞台上。不要重写。
         * 会根据 m_layer 来设置层级;会自动给_clickEventObjects的每个对象添加监听
         * 回自动调用this.onShow();
         * @function show
         * @author wx
         * @DateTime 2018-03-16T10:17:08+0800
         * @access public
         */
        public show():void
        {
            if(this._scene.parent == null)
                this._scene.open(false);
        }
        /**
         * 从舞台上移除界面.回自动调用this.onClose();
         * .如果是dialog样式，并且_noticeOther && _closeByMaskBg。则会发送onDailogClose消息
         * @function close
         * @author wx
         * @DateTime 2018-03-16T10:18:48+0800
         * @access public
         */
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
                this._res.size(Laya.stage.width/g_scaleRatio,Laya.stage.height/g_scaleRatio);
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
                this._res.size(Laya.stage.width/g_scaleRatio,Laya.stage.height/g_scaleRatio);
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
        protected changeResourceByLan():void
        {
            if(gamelib.Api.getLocalStorage("lan") == null)
                return;
            this.changeResource(this._res);
        }
        private changeResource(temp:Laya.UIComponent):void
        {
            if(this._excepts.indexOf(temp)!= -1)
                return;
            
            for(var i:number = 0;i < temp.numChildren;i++)
            {
                this.changeResource(temp.getChildAt(i) as Laya.UIComponent);
            }
            if(this._excepts.indexOf(temp)!= -1)
                return;
            if(temp instanceof Laya.Label && this._vars.indexOf(temp) == -1)
            {
                if(temp.text)
                {
                    if(temp["__lanKey"] == null)
                    {
                        temp["__lanKey"] = temp.text;
                    }
                    temp.text = getDesByLan(temp["__lanKey"]);
                }    
                return;
            }
            else if(temp instanceof Laya.Button)
            {
                if(temp.label)
                {
                    if(temp["__lanKey"] == null)
                    {
                        temp["__lanKey"] = temp.label;
                    }
                    temp.label = getDesByLan(temp["__lanKey"]);
                }
            }
            var skin:string = temp['skin'];
            skin = this.getNewSkin(skin);
            
            temp['skin'] = skin;
        }
        private getNewSkin(url:string):string
        {
            var currentLan:string = gamelib.Api.getLocalStorage("lan");
            var newHz:string = currentLan == "zh"?"en":"zh";
            if(url == null || (url.indexOf("_zh.") == -1 && url.indexOf("_en.") == -1))
                return url;
            if(url.indexOf("_" + currentLan+".") >= 0)      //如果已经是当前的语言版本，不需要替换。否则会出错。a_zhuang_en.png替换成英文版本会出错
                return url;
            if(currentLan == "zh")
                url = url.replace(/(.*)_en/,"$1_zh");
            else
                url = url.replace(/(.*)_zh/,"$1_en");
            return url;
        }
    }
}

