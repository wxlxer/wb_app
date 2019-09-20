namespace gamelib.loading {
    export class MiniLoading extends gamelib.core.BaseUi
    {
        private ani1:Laya.FrameAnimation;

        private _bg:Laya.Sprite;
        constructor() 
        {
            super("qpq/Art_ZhuanQuan.scene");
        }
        protected init():void {
            this.ani1 = this._res["ani1"];
            this._noticeOther = false;
            this._res.removeChildAt(0) ;
           
            this._res.mouseThrough = false;
            this._res.mouseEnabled = true;
            this._bg = new Laya.Sprite();

        }
        public setMsg(args:{msg?:string,delay?:number,alertMsg?:string,callBack?:()=>void,thisObj?:any}):void
        {
            if(this._res == null || this._res["txt_txt"] == null)
                return;
            Laya.timer.clear(this,this.onDelayed);
            if(args == null)
            {
                this._res["txt_txt"].text = "";
            }
            else
            {
                this._res["txt_txt"].text = args.msg || "";
                var delay:number = args.delay || 0;
                if(delay)
                {
                    Laya.timer.once(delay*1000,this,this.onDelayed,[args]);
                }
            }
        }
        public updateMsg(msg:string):void
        {
            if(this._res == null || this._res['txt_txt'] == null)
                return;
            this._res['txt_txt'].text = msg;
        }
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
        protected onShow():void {
            super.onShow();
            Laya.stage.on(laya.events.Event.RESIZE,this,this.onResize);
            this.ani1.play();
        }
        protected onClose():void {
            super.onClose();
            Laya.stage.off(laya.events.Event.RESIZE,this,this.onResize);
            Laya.timer.clear(this,this.onDelayed);
            this.ani1.stop();
        }
        private onDelayed(args:{msg:string,delay?:number,alertMsg?:string,callBack?:()=>void,thisObj?:any}):void {
            g_uiMgr.showAlertUiByArgs({msg:args.alertMsg});
            if(args.callBack)
            {
                args.callBack.call(args.thisObj);
            }
            this.close();
        }

        protected onResize(evt?:Laya.Event):void
        {
            if(g_scaleXY == "x")
            {
                this._res.x = Math.round(((g_gameMain.m_gameWidth - this._res.width)>> 1)+this._res.pivotX);
                this._res.y = Math.round(((g_gameMain.m_gameHeight - this._res.height)>> 1)+this._res.pivotY + (Laya.stage.height - g_gameMain.m_gameHeight *g_scaleRatio ) / 2 / g_scaleRatio);
            }
            else
            {
                this._res.x = Math.round(((g_gameMain.m_gameWidth - this._res.width)>> 1)+this._res.pivotX+ (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio ) / 2 / g_scaleRatio);
                this._res.y = Math.round(((g_gameMain.m_gameHeight - this._res.height)>> 1)+this._res.pivotY);            
            }
            this._bg.graphics.clear();
            this._bg.graphics.drawRect(0,0,g_gameMain.m_gameWidth,g_gameMain.m_gameHeight,"#FF0000");
            this._bg.alpha = 0.3;
            this._bg.x = this._bg.y = 0;
            this._bg.scaleX = Math.max(1,Laya.stage.width / g_gameMain.m_gameWidth);
            this._bg.scaleY = Math.max(1,Laya.stage.width / g_gameMain.m_gameHeight);
        }
    }
}