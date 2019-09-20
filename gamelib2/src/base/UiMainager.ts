/**
 * Created by wxlan on 2017/8/29.
 */
namespace gamelib.core
{
    /**
     * ui管理器。管理 pmd,邮件，设置，商城，miniloading，聊天界面，提示框，提示文本等界面
     * 要打开这些界面,可以调用g_singnal.dispatch("msgName",data)或者直接调用对应的方法
     * 常用的msgName有:
     * showSetUi,showShopUi,showHelpUi,showChatUi,showQpqLoadingUi,closeQpqLoadingUi
     * closeEnterGameLoading,showBugleUi
     * 
     * @class UiMainager
     */
    export class UiMainager
    {
        public m_pmd:gamelib.alert.Pmd;
        private _mailUi:gamelib.core.BaseUi;
        private _setUi:gamelib.control.SetUi;
        private _shopUi:gamelib.core.BaseUi;
        // private _miniLoading:gamelib.loading.MiniLoading;
        // private _miniLoading_child:gamelib.loading.MiniLoading;
        // private _maskLoading:gamelib.loading.MaskLoading;
        private _chat:gamelib.chat.ChatPanel;
        public m_temp_ui:gamelib.core.BaseUi;
        private _alertList:Array<gamelib.alert.AlertUi>;
        private _tip_list:Array<any>;
        private _waring_tip_list:Array<any>;

        public set showUi(value:gamelib.core.BaseUi)
        {
            this._shopUi = value;
        }
        public constructor()
        {
            this.m_pmd = new gamelib.alert.Pmd();
            this._alertList = [];
            this._tip_list = [];
            this._waring_tip_list = [];
            //this._setUi = new gamelib.control.SetUi();  //需要开始就初始化。进入子游戏可能要显示
            g_signal.add(this.onSignal,this);
        }
        public showMaskLoading():loading.MaskLoading
        {
            return g_loading.showMaskLoading();
        }
        public closeMaskLoading():void
        {
            g_loading.closeMaskLoading();
        }
        private onDialogOpen(evt:laya.events.Event):void
        {
            console.log(laya.ui.Dialog.manager)
            g_signal.dispatch("onDailogOpen");
        }
        private onDialogClose(evt:laya.events.Event):void
        {
            console.log("有界面关闭了" + this.m_temp_ui);
            g_signal.dispatch("onDailogClose",0);
        }
        private onSignal(msg:string,data:any)
        {
            switch (msg)
            {
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
                    var temp:gamelib.common.BugleUi = new gamelib.common.BugleUi();
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
        }
        /**
         * 打开帮助ui
         * @function showHelpUi
         * @DateTime 2018-03-16T14:25:07+0800
         * @param    {number}  index [要显示的帮助文件在平台配置中的序号]
         */
        public showHelpUi(index:any):void
        {
            console.log("showHelpUi" + index);            
            if(window['application_layer_show'] == null)
            {
                return;
            }
            var url:string = GameVar.common_ftp;
            var temp:any = GameVar.g_platformData["help_file_name"];
            if(typeof index == "number")
            {
                index = isNaN(index) ? 0: index; 
                if(temp instanceof Array)
                {
                    url += temp[index];
                }
                else
                {
                     url += temp;
                }
            }
            else if(typeof index == "string")
            {
                var type:string  = index.split("_")[0];
                url += temp[type];
            }
            else
            {
                url += temp;
            }
            window['application_layer_show'](url);
        }
        /**
         * 打开设置界面
         * @function openSetUi
         * @DateTime 2018-03-16T14:28:26+0800
         */
        public openSetUi():void {
            this._setUi = this._setUi || new gamelib.control.SetUi();
            this._setUi.show();
        }
        /**
        * 打开商城
        *  @type:0:钻石，1金币，2vip
        */
        public openShop(type:number = 0):void
        {
            console.log("打开商城!");
            if(this._shopUi == null)
            {
                this._shopUi = new gamelib.common.ShopUi();        
            }
            
            this._shopUi["m_openType"] = type;
            this._shopUi.show();
        }
        /**
         * 打开邮件
         * @function openMail
         * @DateTime 2018-03-16T14:29:11+0800
         */
        public openMail():void
        {
            console.log("打开邮件!");
            if(GameVar.g_platformData['mail_type'] == 2)
            {
                this._mailUi = this._mailUi || new gamelib.common.MailUi2();
            }
            else
            {
                this._mailUi = this._mailUi || new gamelib.common.MailUi();
            }
            
            this._mailUi.show();
        }
        /**
         * 关闭小loading
         * @function closeMiniLoading
         * @DateTime 2018-03-16T14:29:22+0800
         */
        public closeMiniLoading():void
        {
            g_loading.closeMiniLoading();
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
            g_loading.showMiniLoading(args);
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
        }):gamelib.alert.AlertUi
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
            args.okLabel || (args.okLabel = getDesByLan("确定"));
            args.cancelLabel || (args.cancelLabel = getDesByLan("取消"));
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
         * 显示提示文本。通常是在屏幕中浮起一个文本，几秒后自动消失，可以指定要显示的位置，文本的颜色，尺寸
         * @function showTip_ex
         * @DateTime 2018-03-16T14:36:30+0800
         * @param    {number} arg msg:提示文本 
         *                        x，y:左边
         *                        color:文本的颜色
         *                        size:文本的尺寸
         *                        time:文本的显示时间
         */
        public showTip_ex(arg:{msg:string,x?:number,y?:number,color?:string,size?:number,time?:number}):void
        {
            arg.color = arg.color || "#09ff88"; 
            arg.size = arg.size || 24;
            arg.time = arg.time || 1000;
            arg.x = isNaN(arg.x) ? (g_gameMain.m_gameWidth) / 2 : arg.x;
            arg.y = isNaN(arg.y) ? (g_gameMain.m_gameHeight) / 2 : arg.y;
            var txt:laya.ui.Label = new laya.ui.Label();
            txt.fontSize = arg.size;
            
            txt.color = arg.color
            txt.align = "center";
            txt.name = "_txt";
            txt.text = arg.msg;            
            g_topLayaer.addChild(txt);


            var  timeLine:Laya.TimeLine = new Laya.TimeLine();
            txt.x = arg.x;
            txt.y = arg.y + 100;
            timeLine.addLabel("toShow",0).to(txt,{y:arg.y,alpha:1},300,Laya.Ease.backIn);
            timeLine.addLabel("toHide",0).to(txt,{y:arg.y - 100,alpha:0.3},300,Laya.Ease.backIn,arg.time);

            timeLine.play(0,false);
            timeLine.on(laya.events.Event.COMPLETE,this,function(evt:Laya.Event):void
            {
                timeLine.offAll(laya.events.Event.COMPLETE);
                txt.removeSelf();
            });
        }

        private getEffectTip(isWarning,create?:boolean):laya.ui.Image
        {
            var list:Array<laya.ui.Image> = isWarning ? this._waring_tip_list : this._tip_list;

            if(!create)
            {
                if(list.length > 0)
                   return list.shift();
            }

            var spr:laya.ui.Image = new laya.ui.Image();
            spr.skin = "qpq/comp/tips_bg_1.png";
            spr.sizeGrid = "16,50,16,50";
            spr.sizeGrid = "24,255,25,256";

            var txt:laya.ui.Label = new laya.ui.Label();
            txt.fontSize = 24;
            if(isWarning)
            {
                txt.color = "#ff2323";    
            }
            else
            {
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

            if(create)
            {
                list.push(spr)
            }
            return spr;
        }

        private showTipsEffect(str:string,effectType:number,isWarning:boolean):void
        {
            var spr:laya.ui.Image = this.getEffectTip(isWarning);
            var txt:laya.ui.Label = <laya.ui.Label>spr.getChildByName("_txt");
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

            var tx:number = (g_gameMain.m_gameWidth) / 2;
            var ty:number = (g_gameMain.m_gameHeight) / 2;
            var  timeLine:Laya.TimeLine = new Laya.TimeLine();
            spr.alpha = 0.3;
            switch (effectType)
            {
                case 1:
                    spr.x = (Laya.stage.width) / 2;
                    spr.y = ty + 100;
                    timeLine.addLabel("toShow",0).to(spr,{y:ty,alpha:1},300,Laya.Ease.backIn);
                    timeLine.addLabel("toHide",0).to(spr,{y:ty-100,alpha:0.3},300,Laya.Ease.backIn,3000);
                    break;
                case 2:
                    spr.x =  - spr.width - 50;
                    spr.y = ty;
                    timeLine.addLabel("toShow",0).to(spr,{x:tx,alpha:1},300,Laya.Ease.backIn);
                    timeLine.addLabel("toHide",0).to(spr,{x:g_gameMain.m_gameWidth + spr.pivotX,alpha:0.3},300,Laya.Ease.backIn,3000);
                    break;
                case 3:
                    spr.x = Laya.stage.width;
                    spr.y = ty;
                    timeLine.addLabel("toShow",0).to(spr,{x:tx,alpha:1},300,Laya.Ease.backIn);
                    timeLine.addLabel("toHide",0).to(spr,{x:-spr.width - spr.pivotX,alpha:0.3},300,Laya.Ease.backIn,3000);
                    break;
                case 4:
                    spr.x = tx;
                    spr.y = ty;
                    spr.scaleX = spr.scaleY = 0.1;
                    timeLine.addLabel("toShow",0).to(spr,{scaleX:1,alpha:1},300,Laya.Ease.backIn);
                    timeLine.addLabel("toHide",0).to(spr,{scaleX:0.1,alpha:0.3},300,Laya.Ease.backIn,3000);
                    break;

            }
            timeLine.play(0,false);
            var list:Array<laya.ui.Image> = isWarning ? this._waring_tip_list : this._tip_list;
            timeLine.on(laya.events.Event.COMPLETE,this,function(evt:Laya.Event):void
            {
                timeLine.offAll(laya.events.Event.COMPLETE);
                spr.removeSelf();
                list.push(spr);
            });
        }


        /**
         * 购买道具提示框
         * @function buyItemAlert
         * @param buyIndex
         * @param msg
         */
        public buyItemAlert(buyIndex:number,msg:string="你的铜钱太少了,充点小钱补补吧!"):void
        {
            var temp:gamelib.alert.AlertBuyGoods = new gamelib.alert.AlertBuyGoods();
            temp.setMsg(buyIndex,msg);
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

        private getAlertUi():gamelib.alert.AlertUi
        {
            var temp = this._alertList.shift();
            if(temp == null)
                temp = new gamelib.alert.AlertUi();
            return temp;
        }
    }
    class TipEffect{
        private _bg:Laya.Image;
        private _label:Laya.Label;        
        constructor() {
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
        public setMsg(msg:string,isWarning:boolean):void{
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
            Laya.Tween.to(this._bg,{scaleY:1},300);
            Laya.timer.once(3000,this,this.remove);
            
        }
        private remove():void{
            this._bg.removeSelf();
        }

    }

}
