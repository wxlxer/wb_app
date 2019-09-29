import MiniLoadingUi from "./MiniLoadingUi";
import AlertUi from "./AlertUi";

    /**
     * ui管理器。管理 pmd,邮件，设置，商城，miniloading，聊天界面，提示框，提示文本等界面
     * 要打开这些界面,可以调用g_singnal.dispatch("msgName",data)或者直接调用对应的方法
     * 常用的msgName有:
     * showSetUi,showShopUi,showHelpUi,showChatUi,showQpqLoadingUi,closeQpqLoadingUi
     * closeEnterGameLoading,showBugleUi
     * 
     * @class UiMainager
     */
    export default class UiMainager
    {
        public m_pmd:gamelib.alert.Pmd;
        private _mailUi:gamelib.core.BaseUi;
        private _shopUi:gamelib.core.BaseUi;
        public m_temp_ui:gamelib.core.BaseUi;
        private _alertList:Array<gamelib.alert.AlertUi>;
        private _tip_list:Array<any>;
        private _waring_tip_list:Array<any>;
        
        private _miniLoading:MiniLoadingUi;
        public constructor()
        {
            this.m_pmd = new gamelib.alert.Pmd();
            this._alertList = [];
            this._tip_list = [];
            this._waring_tip_list = [];
           
        }
        
       
        /**
         * 关闭小loading
         * @function closeMiniLoading
         * @DateTime 2018-03-16T14:29:22+0800
         */
        public closeMiniLoading():void
        {
            if(this._miniLoading)
                this._miniLoading.close();
        }
        /**
         * 打开小转圈
         * @function showMiniLoading
         * @DateTime 2018-03-16T14:29:38+0800
         * @param    {any}}    args [一个对象，msg:string,需要显示的文本
         *                           delay:number自动关闭的时间，秒为单位
         *                           alertMsg:string关闭时的提示文本，
         *                           callBack：function关闭时的回掉]
         */
        public showMiniLoading(args?:{msg?:string,delay?:number,alertMsg?:string,callBack?:()=>void,thisObj?:any}):void
        {
            this._miniLoading = this._miniLoading || new MiniLoadingUi();
		    this._miniLoading.show();
        }
        /**
         * 显示没有关闭按钮的提示框
         * @function showAlert_NoClose
         * @DateTime 2018-03-16T14:31:57+0800
         * @param    {string}                 msg [description]
         */
        public showAlert_NoClose(msg:string):void
        {
            var alert = this.getAlertUi();
            alert.setData({msg:msg,type:3});
            alert.show();
        }
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
        public showAlertUiByArgs(args:{
            msg:string,
            callBack?:(type:number) => void,
            thisObj?:any,
            okLabel?:string,
            cancelLabel?:string,
            autoCall?:number,
            type?:number
        }):AlertUi
        {
            if(isNaN(args.autoCall))
                args.autoCall = 0;
            if(isNaN(args.type))
                args.type = 0;

            var alert = this.getAlertUi();
            if(alert == null)
            {
                window['alert'](args.msg);
                return null;
            }
            args.okLabel || (args.okLabel = "确定");
            args.cancelLabel || (args.cancelLabel = "取消");
            alert.setData(args);
            alert.show();
            return alert;
        }

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
        public showConfirmUiByArgs(args :{
            msg:string,
            callBack?:(type:number) => void,
            thisObj?:any,
            okLabel?:string,
            cancelLabel?:string
        }):void
        {
            var temp_args:any = args;
            if(isNaN(temp_args.autoCall))
                temp_args.autoCall = 0;
            if(isNaN(temp_args.type))
                temp_args.type = 1;
            var alert = this.getAlertUi();
            alert.show();
            alert.setData(temp_args);
        }

        public onAlertUiClose(alert:gamelib.alert.AlertUi):void
        {
            this._alertList.push(alert);
        }

        private _tip:TipEffect;
        /**
         * 显示提示文本。通常是在屏幕中间浮起一个文本，几秒后自动消失
         * @function showTip
         * @DateTime 2018-03-16T14:34:17+0800
         * @param    {string}                 msg []
         * @param    {boolean} [isWarning = false] [是否是警告，警告是红色]
         * @param    {number}  [effectType = 1]  [动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失]
         */
        public showTip(msg:string,isWarning:boolean = false, effectType:number = 1):void
        {
            this._tip = this._tip || new TipEffect();
            this._tip.setMsg(msg,isWarning);
            // this.showTipsEffect(msg,effectType,isWarning);
        }

        /**
         * function showPMD
         * @param msg
         */
        public showPMD(msg:string):void
        {
            this.m_pmd.add(msg);
        }
        public pmd_LaBa(msg:string):void
        {
            // var temp:gamelib.alert.Pmd_Laba = new gamelib.alert.Pmd_Laba();
            // temp.add(msg);
            // temp.show();
            this.m_pmd.add(msg);
        }

        private getAlertUi():AlertUi
        {
            // var temp = this._alertList.shift();
            // if(temp == null)
            //     temp = new gamelib.alert.AlertUi();
            // return temp;
            return new AlertUi()
        }
    }
    export  class TipEffect{
        private _bg:Laya.Image;
        private _label:Laya.Label;    
        private _icon:Laya.Image;    
        constructor() {
            this._bg = new Laya.Image();
            this._bg.skin = "bgs/ic_alert_long_bg.png";
            this._bg.height = 100;

            this._icon = new Laya.Image();
            this._icon.width = this._icon.height = 60;
            this._bg.addChild(this._icon);
            this._icon.centerY = 0;
            this._icon.x = 60;

            this._label = new laya.ui.Label();
            this._label.fontSize = 28;   
            this._label.color = "#FFFFFF";
            this._label.align = "center";
            this._label.name = "_txt";
            this._label.centerY = 0;
            this._bg.addChild(this._label);


            this._bg.x = Laya.stage.width / 2;
            this._bg.y = Laya.stage.height / 2;
        }
        public setMsg(msg:string,isWarning:boolean):void{
            this._label.text = msg;
            this._bg.width = this._label.width < 512 ? 512 : this._label.width + 100;
            this._bg.pivotX = this._bg.width / 2;
            this._bg.pivotY = this._bg.height / 2;
            this._label.x = this._icon.x + this._icon.width + 20;//(this._bg.width - this._label.width) / 2;
            // this._label.y = (this._bg.height - this._label.height) / 2;
            if(isWarning)
                this._icon.skin = "icons/ic_alert_error.png";
            else
                this._icon.skin = "icons/ic_toast_success.png";
            this._bg.zOrder = 1100;
            Laya.stage.addChild(this._bg);
            this._bg.scaleY = 0;
            Laya.Tween.clearAll(this._bg);
            Laya.timer.clearAll(this);
            Laya.Tween.to(this._bg,{scaleY:1},300);
            Laya.timer.once(3000,this,this.remove);
            
        }
        private remove():void{
            this._bg.removeSelf();
        }

    }
export var g_uiMgr:UiMainager = new UiMainager();