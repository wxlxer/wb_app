/**
 * Created by wxlan on 2017/9/14.
 */
namespace gamelib.core
{
    /**
     * 弹出框管理器。laya.ui.DialogManager在Laya.stage.scaleMode = "full"模式下有bug。不能使弹出框剧中对齐
     * 不要主动调用这个类里面的任何方法。
     * @class DialogManager
     * @extends laya.ui.DialogManager  
     */
    export class DialogManager extends laya.ui.DialogManager
    {
        public constructor()
        {
            super();
            this.closeEffectHandler = new Laya.Handler(this,this.closeEffect1);
            this.popupEffectHandler = new Laya.Handler(this,this.popupEffect1);    
            Laya.stage.on(Laya.Event.FOCUS,this,this._onResize); 
            var self:any = this;
            window.onresize = function()
            {
                
                Laya.timer.once(500,this,function()
                {   
                     self._onResize();
                    // console.log("延时输出:" + Laya.stage.width +" " + Laya.stage.height)
                })
            }  
                 
        }
        public open(dialog: laya.ui.Dialog, closeOther?: boolean, showEffect?: boolean):void
        {
            super.open(dialog,closeOther,showEffect);
            this._onResize(null);
        }
        private popupEffect1(dialog):void
        {
            dialog.scale(1,1);
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
            Laya.Tween.from(dialog,{x:centerX,y:centerY,scaleX:0,scaleY:0},300,Laya.Ease.backOut,Laya.Handler.create(this,this.doOpen,[dialog]));    
        }
        private closeEffect1(dialog,type):void
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
            Laya.Tween.to(dialog,{x:centerX,y:centerY,scaleX:0,scaleY:0},300,Laya.Ease.strongOut,Laya.Handler.create(this,this.doClose,[dialog,type]));
        }
        
        private _onResize(e):void
        {
            // console.log(Laya.stage.width,Laya.stage.height);
            var width = this.maskLayer.width = Laya.stage.width / g_scaleRatio;
            var height = this.maskLayer.height = Laya.stage.height / g_scaleRatio;
            if (this.lockLayer) this.lockLayer.size(width,height);
            this.maskLayer.graphics.clear();
            this.maskLayer.graphics.drawRect(0,0,width,height,UIConfig.popupBgColor);
            this.maskLayer.alpha=UIConfig.popupBgAlpha;
            for (var i=this.numChildren-1;i >-1;i--){
                var item = this.getChildAt(i);
                if (item["popupCenter"])this._centerDialog(item);
            }
        }

        private _centerDialog(dialog:any):void
        {
            // Laya.stage.width/g_scaleRatio,Laya.stage.height/g_scaleRatio
            if(g_scaleXY == "x")
            {
                dialog.x = Math.round(((g_gameMain.m_gameWidth - dialog.width)>> 1)+dialog.pivotX);
                dialog.y = Math.round(((g_gameMain.m_gameHeight - dialog.height)>> 1)+dialog.pivotY + (Laya.stage.height - g_gameMain.m_gameHeight *g_scaleRatio ) / 2 / g_scaleRatio);
            }
            else
            {
                dialog.x = Math.round(((g_gameMain.m_gameWidth - dialog.width)>> 1)+dialog.pivotX+ (Laya.stage.width - g_gameMain.m_gameWidth * g_scaleRatio ) / 2 / g_scaleRatio);
                dialog.y = Math.round(((g_gameMain.m_gameHeight - dialog.height)>> 1)+dialog.pivotY);            
            }
            // dialog.x = (Laya.stage.width - dialog.width) / 2 - dialog.pivotX;
            // dialog.y = (Laya.stage.height - dialog.height) / 2 - dialog.pivotY;
            //console.log(dialog.x,dialog.y);
        }
        
    }
}
