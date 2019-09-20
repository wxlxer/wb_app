/**
 * Created by wxlan on 2016/9/21.
 */
module gamelib.control
{
    /**
     * 微信分享
     * @class ShareTip_wxUi
     */
    export class ShareTip_wxUi extends gamelib.core.BaseUi
    {
        private _tab:laya.ui.Tab;
        private _img_game:laya.ui.Image;
        private _msg_txt:laya.ui.TextArea;
        private _web:gamelib.childGame.WebDataHander;
        private _args:any;

        private _qrcodeImg:gamelib.control.QRCodeImg;

        private _url:string = "";
        public constructor()
        {
            super("qpq/Art_Share1");
        }
        /**
         * 分享牌局
         * @function setData
         * @DateTime 2018-03-17T14:42:37+0800
         * @param    {any}     args     [description]
         * @param    {Function}               callBack [description]
         * @param    {any}                    thisObj  [description]
         */
        public setData(args:{gz_id:number,gameId:number,validation:string,groupId:string,wxTips?:boolean,fd?:number,js?:number,addDatas?:any,title?:string,desc?:string},callBack?:Function,thisObj?:any):void
        {
            this._args = args;
            //请求分享内容
            gamelib.platform.get_share_circleByArgs(args,this.onGetShartArgsEnd,this);
            //请求二维码
            //this._web.getGameInfo(args.gz_id,this.onGetGameInfoEnd,this);

            var circle_args:any = {"validation":args.validation};
            if(args.groupId != null && args.groupId != "")
            {
                circle_args.groupId = args.groupId;
            }
            var str:string = JSON.stringify(circle_args);
            str = "&circle_args=" + encodeURIComponent(str);
            var url:string = window["application_share_url"]();
            if(url.indexOf("?") == -1)
            {
                url += "?" + str;
            }
            else
            {
                url += "&" + str;
            }
            this._qrcodeImg.setUrl(url);
            this._url = url;
        }
        /**
         * 分享app信息
         * @function setAppData
         * @DateTime 2018-03-17T14:43:23+0800
         * @param    {string}                 appName [description]
         * @param    {string}                 info    [description]
         * @param    {string}                 imgUrl  [description]
         */
        public setAppData(appName:string,info:string,imgUrl:string):void
        {
            if(GameVar.m_QRCodeUrl)
            {
                this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl);
            }
            var str:string = appName +"\n" + info;
            this._msg_txt.text = str;
            if(imgUrl.indexOf("http") == -1)
            {
                imgUrl = GameVar.common_ftp + imgUrl;
            }
            this._img_game.skin = imgUrl;            
            this._url = GameVar.m_QRCodeUrl;


        }
        private onGetShartArgsEnd(rep:any):void
        {
            var str = rep.title +"\n";
            str += rep.desc;
            this._msg_txt.text = str;
            this._img_game.skin = rep.img_url;
            gamelib.platform.share_circle(this._args.gz_id,this._args.validation,this._args.gameId,this._args.groupId,rep.title,rep.desc,rep.img_url);
            this._url = GameVar.g_platformData['name']  +" " + rep.title + " 房间链接:" + this._url;
        }
        private onGetGameInfoEnd(rep:any):void
        {
            console.log(JSON.stringify(rep));
        }
        protected init():void
        {
            this._web = g_childGame.m_web;           
            this._img_game = this._res["img_name"];
            this._tab = this._res["tab_1"];
            this._msg_txt = this._res["txt_1"];
            this._msg_txt.mouseEnabled = this._msg_txt.editable = false;
            this._res["img_1"].visible = false;
            this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
            this._noticeOther = true;
            this.addBtnToListener("img_QRCode");
            this.addBtnToListener("btn_fuzhi");
        }
        public onShow():void
        {
            super.onShow();
            this._tab.on(laya.events.Event.CHANGE,this,this.onTabChange);
            this._tab.selectedIndex = 0;
            this.onTabChange();

            
        }
        public onClose():void
        {
            super.onClose();
            this._tab.off(laya.events.Event.CHANGE,this,this.onTabChange);
        }
        private onTabChange(evt?:laya.events.Event):void
        {
            if(this._tab.selectedIndex == 0)
            {
                this._res["b_1"].visible = true;
                this._res["b_2"].visible = false;
            }
            else {
                this._res["b_1"].visible = false;
                this._res["b_2"].visible = true;
            }

        }
        protected onClickObjects(evt:Laya.Event):void
        {
            if(evt.currentTarget.name == "img_QRCode")
            {
                utils.tools.snapshotShare(this._res["img_QRCode"]);
            }
            else if(evt.currentTarget.name == "btn_fuzhi")
            {
                this,gamelib.Api.copyToClipboard(this._url,function(ret:any)
                {
                    if(ret.result == 0)
                    {
                        g_uiMgr.showTip("复制成功");
                    }
                });
                // Laya.timer.once(100,this,gamelib.Api.copyToClipboard,[this._url,function(ret:any)
                // {
                //     if(ret.result == 0)
                //     {
                //         g_uiMgr.showTip("复制成功");
                //     }
                // }]);
                // Laya.timer.once(200,this,function()
                // {
                //     eval("gamelib.Api.copyToClipboard('www.baidu.com');")    
                // })
                // var input = document.createElement("input");
                // input.width = 100;
                // input.height = 30;
                // input.style.opacity = "0";
                // input.style.position = "absolute";
                // input.type = "text";
                // input.innerHTML = "www.qq.com";
                // input.select();
                // document.execCommand("Copy");
                // gamelib.Api.copyToClipboard(this._url,function(ret:any)
                // {
                //     if(ret.result == 0)
                //     {
                //         g_uiMgr.showTip("复制成功");
                //     }
                // })
            }
        }
    }
}
