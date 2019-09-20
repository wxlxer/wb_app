/**
 * Created by wxlan on 2017/9/5.
 */
namespace gamelib.common.qpq
{
    /**
     * 结算界面
     */
    export class QPQResultUi extends gamelib.core.BaseUi
    {
        private _data:any;
        private _player_container:laya.ui.HBox;

        private _itemList:Array<QPQResultItem>;

        private _btn_return:laya.ui.Button;
        private _btn_info:laya.ui.Button;
        private _btn_share:Laya.Button;
        private _btn_container:Laya.Box;
        private _qrcodeImg:gamelib.control.QRCodeImg;
        private _grap:number;
        public constructor()
        {
            super("qpq/Art_JieSuan");
            
        }
        protected init():void
        {
            this.addBtnToListener("btn_pingjia");
            this.addBtnToListener("btn_info");
            this.addBtnToListener("btn_share");
            this.addBtnToListener("btn_back");
            //this.addBtnToListener("img_QRCode");

            this._btn_return = this._res["btn_back"];
            this._btn_info = this._res["btn_info"];
            this._btn_share = this._res["btn_share"];

            this._itemList = [];
            this._player_container = this._res["b_players"];
            this._noticeOther = true;

            if(this._res["img_QRCode"])
                this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
            
            //需要先把资源载入进来
            for(var i:number = 0; i < 6; i++)
            {
                var item:QPQResultItem = new QPQResultItem();
                this._itemList.push(item);
            }
            this._btn_container = new Laya.Box();
            this._res.addChild(this._btn_container);
            this._btn_container.x = this._btn_return.x;
            this._btn_container.y = this._btn_return.y;
            this._grap = this._btn_info.x - this._btn_return.x;

            this._btn_return.x = 0;
            this._btn_return.y = 0;

            this._btn_info.x = 0;
            this._btn_info.y = 0;

            this._btn_share.x = 0;
            this._btn_share.y = 0;

            this._btn_container.addChildren(this._btn_return,this._btn_info,this._btn_share);

            this._player_container.centerX = 0;
            this._btn_container.centerX = 0;
        }

        public reciveNetMsg(msgId:number,data:any)
        {
            switch (msgId)
            {
                case 0x00E2:
                    if(data.result != 1)
                        return;
                     var itemData:any = this.searchPropertyInList(this._data.playerNum,"playerPid",data.targetPid);
                    itemData.estimated = 1;
                    this.updateList();
                    if(data.targetPid == this._data.homewnerPid)
                    {
                        this._res["btn_pingjia"].visible = false;
                    }
                    break;
                case 0x00E4:
                    if(this._data.groupId != data.groupId)
                        return;
                    var players:any[] = this._data.playerNum;
                    var estimatedVec = data.list;
                    for(var i:number = 0; i < estimatedVec.length; i++)
                    {
                        var pd = this.searchPropertyInList(players,"playerPid",estimatedVec[i].pid);
                        if(pd == null)
                            continue;
                        pd.estimated = 1;
                        if(pd.playerPid == this._data.homewnerPid)
                        {
                             this._res["btn_pingjia"].visible = false;
                        }
                    }
                     this.updateList();
                    break;
            }
        }
        public setData(obj:any):void
        {
            this._data = obj;

            var list:any[] = this._data.playerNum;
            for(var i:number = 0;i < list.length; i++) {
                if(list[i].playerPid == this._data.playerPidOfWinMax) {
                    list[i].markType = 1;
                } else if(list[i].playerPid == this._data.playerPidOfLoseMax) {
                    list[i].markType = 2;
                } else {
                    list[i].markType = 0;
                }
                list[i].showType = 1;
                list[i].groupId = this._data.groupId;
                list[i].index = i;
                list[i].isFangzhu = list[i].playerPid == this._data.homewnerPid;
            }

            this._res["txt_wanfa"].text = obj.gameName;
            this._res["txt_fanghao"].text =getDesByLan("房号")+":" + obj.roomId;
            this._res["txt_fangzhu"].text = getDesByLan("房主")+":" + utils.StringUtility.getNameEx(obj.homewnerName,10);
            this._res["txt_date"].text = obj.creatTime;

            //先不做评论
            //this.checkEstimate();
            if(this._res["btn_pingjia"])
                this._res["btn_pingjia"].visible = false;
            if(this._res["img_ypj"])
                this._res["img_ypj"].visible = false;

            this.updateList();
            if(this._qrcodeImg){
                if(GameVar.isGameVip)
                {
                    this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl_Vip||window["application_share_url"]());
                }
                else
                {
                    this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl);
                }
            }
            
        }
        private _itemW:number;
        private updateList():void
        {
             var list:any[] = this._data.playerNum;
             while(this._player_container.numChildren)
             {
                 var temp:QPQResultItem = <QPQResultItem>this._player_container.removeChildAt(0);
                 temp.clear();
                 this._itemList.push(temp);
             }
             var len :number = list.length;
             switch (len)
            {
               case 4:
               case 5:
                   this._player_container.space = 10;
                   break;
               case 6:
                   this._player_container.space = 5;
                   break;
               default:
                   this._player_container.space = 20;
            }

             for(var i:number = 0; i < len;i++)
             {
                 var temp = this.getItem();
                 temp.setData(list[i]);
                 this._player_container.addChild(temp);
             }
             // Laya.timer.frameOnce(2,this,function()
             // {
             //    this._player_container.x = (Math.min(this._res.width,g_gameMain.m_gameWidth) - this._player_container.width) / 2;
             // })
             this._player_container["_getWidget"]().resetLayoutX();
             // this._player_container.resetLayoutX()


        }
        /**
         * 检测是否可以评价
         */
        private checkEstimate():void {
            var players:any[] = this._data.playerNum;
            var ownerEsd:boolean = false;       //能否对房主评价
            if(players.length && players[0].estimated == null)
            {
                sendNetMsg(0x00E4,this._data.groupId,1);
                for(var i:number = 0;i < players.length; i++) {
                    players[i].estimated = -1;
                    players[i].groupId = this._data.groupId;
                    players[i].showType = 1;
                }
            }
            else
            {
                if(this._data.homewnerPid == gamelib.data.UserInfo.s_self.m_pId)
                {
                    ownerEsd = false;
                }
                else
                {
                    ownerEsd = this.searchPropertyInList(players,"playerPid",this._data.homewnerPid).estimated < 0;
                }
            }
            this._res["btn_pingjia"].visible = ownerEsd;
        }
        
        protected onShow():void
        {
            super.onShow();
            var tw:number = 0;
            if(utils.tools.isQpqHall())
            {
                this._btn_return.removeSelf();
                this._res["btn_close"].visible = true;
                this._btn_info.x = this._grap * 0;
                this._btn_share.x = this._grap * 1;            
            }
            else
            {
                this._btn_container.addChild(this._btn_return);                
                this._res["btn_close"].visible = false; 
                this._btn_info.x = this._grap * 1;
                this._btn_share.x = this._grap * 2;                           
            }

            this._btn_container["_getWidget"]().resetLayoutX();

            if(this._res["ani1"])
                this._res["ani1"].play();
            //this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
        }
        protected onClose():void
        {
            super.onClose();
            if(this._res["ani1"])
               this._res["ani1"].stop();
            //this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
        }

        private getItem():QPQResultItem
        {
            if(this._itemList.length)
                return this._itemList.shift();
            return new QPQResultItem();
        }

        protected onClickObjects(evt:laya.events.Event):void
        {
            playButtonSound();
            switch (evt.currentTarget.name)
            {
                case "btn_pingjia":
                    break;
                case "btn_info":
                    g_signal.dispatch("showDetailUi",this._data);
                    this.close();
                    break;
                case "btn_back":
                    g_childGame.toCircle();
                    this.close();
                    break;
                case "img_QRCode":
                    utils.tools.snapshotShare(this._res["img_QRCode"]);
                    break;
                case "btn_share":
                    utils.tools.snapshotShare(this._res);
                    break;
            }
        }

         private searchPropertyInList(list:any[],key:string,value:any):any {
            for(var i:number = 0;i < list.length; i++) {
                if(list[i][key] == value) {
                    return list[i];
                }
            }
        }
    }

    export class QPQResultItem extends laya.ui.View
    {
        public constructor()
        {
            super();
        }
        createChildren():void {

            super.createChildren();
            this.loadUI("qpq/Art_JiesuanItem");
        }
        public clear():void
        {
            this["img_head"].skin = "";
        }
        public setData(obj:any):void
        {
            
            this["img_ypj1"].visible = false;
            this["btn_pingjia1"].visible = false;

            this["img_head"].skin = obj.playerHead;
            this["img_fangzhu"].visible = obj.isFangzhu;
            this["img_1"].visible = obj.playerPid == GameVar.pid;
            this["img_2"].visible = !this["img_1"].visible;
            this["txt_name"].text = utils.StringUtility.getNameEx(obj.playerName);

             this["txt_id"].text = "ID:" + obj.playerPid;
            if(obj.winOrLosePoints > 0)
            {
                this["txt_fen_2"].text = "+" + obj.winOrLosePoints;
                this["txt_fen_2"].visible = true;
            }
            else
            {
                this["txt_fen_1"].text = "" + obj.winOrLosePoints;
                this["txt_fen_2"].visible = false;
            }
            this["txt_fen_1"].visible = !this["txt_fen_2"].visible
            //0-无，1-赢，2-输
            if(obj.markType == 1)
            {
                this["img_biaoqian_1"].visible = true;
                this["img_biaoqian_2"].visible = false;
            }
            else if(obj.markType == 2)
            {
                 this["img_biaoqian_2"].visible = true;
                 this["img_biaoqian_1"].visible = false;
            }
            else
            {
                this["img_biaoqian_2"].visible = false;
                this["img_biaoqian_1"].visible = false;
            }

            var detail:any = obj.detailedRecord;
            if(typeof (detail) == "string") {
                if(detail == "")
                    detail = {};
                else
                    detail = JSON.parse(detail);
            }
            var tongji:Array<any> = detail.tongji;
            var tw:number = 0;
            for(var i:number = 0; i < 6; i++)
            {
                 var txt:laya.ui.Label = this["txt_" + (i+1)];

                if(tongji == null)
                {
                    txt.visible = false;
                    continue;
                }
                var tjd:any = tongji[i];
               
                if(tjd == null)
                {
                    txt.visible = false;
                    continue;
                }
                txt.visible = true;
                for(var key in tjd)
                {
                    txt.text = key+":" + tjd[key];
                }
                tw = Math.max(tw,txt.width);
            } 
            this["txt_1"].parent.width = tw;
        }

    }
}
