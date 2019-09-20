/**
 *
 */
namespace gamelib.common.qpq
 {
    /**
     * 对局详情信息
     */
    export class ResultDetail extends gamelib.core.Ui_NetHandle
     {
        private static s_list:any = {};

        private _normal:ResultDetailNormal;
        private _pageView:ResultDetailPage;

        private _bInHall:boolean = false;
        public m_clickHuiFang:boolean = false;
        public constructor() 
        {            
            super("qpq/Art_Record");
        }
        public reciveNetMsg(msgId:number,data:any):void
        {
            if(this._normal)
                this._normal.reciveNetMsg(msgId,data);
            if(this._pageView)
                this._pageView.reciveNetMsg(msgId,data);
        }
        protected init() 
        {
            if(this._res['b_page'])
            {
                this._pageView = new ResultDetailPage(this,this._res);
            }
            else
            {
                this._normal = new ResultDetailNormal(this,this._res);
            }
            this._noticeOther = false;
        }
        public close():void
        {
            this._bInHall = utils.tools.isQpqHall();
            super.close();
        }
        protected onShow():void
        {
            super.onShow();
            if(this._normal)
                this._normal.show();
            if(this._pageView)
                this._pageView.show();
            this._noticeOther = true;
            this.m_clickHuiFang = false;
        }
        protected onClose():void
        {
            super.onClose();
            if(this._normal)
                this._normal.close();
            if(this._pageView)
                this._pageView.close();
            if(!this._bInHall && !this.m_clickHuiFang)
                g_childGame.toCircle();        //在牌桌中也会出现这个界面
            this._noticeOther = false;
        }
        public showDetail(data:any):void 
        {
            var temp = ResultDetail.s_list[data.groupId];
            if(temp == null)
            {
                temp = {
                    "roomId":data.roomId,
                    "gameID":data.gameID,
                    "gameMode":data.gameMode,
                    "groupId":data.groupId,
                    "bRequest":false
                }
                ResultDetail.s_list[data.groupId] = temp;
            }
            if(this._normal)
                this._normal.setData(temp);
            if(this._pageView)
                this._pageView.setData(temp);
        }
    }
    export class ResultDetailNormal
    {
        private _parent:ResultDetail;
        private _list:laya.ui.List;
        private _data:any;
        private _res:any;
        private _tips:Laya.Label;
        public constructor(parent:ResultDetail,res:any)
        {
            this._parent = parent;
            this._res = res;
            this._tips = res['txt_tips'];
            this._list = this._res["list_1"];
            this._list.dataSource = [];
            this._list.renderHandler = Laya.Handler.create(this,this.onItemUpdate,null,false);
            this._res["txt_11"].text = "";
            this._res["txt_12"].text = "";
            this._res["txt_13"].text = "";
            
        }
        public reciveNetMsg(msgId:number,data:any):void
        {
            if(msgId != 0x00F9 || data.groupId != this._data.groupId) return;
            this._data.bRequest = true;
            for(var key in data)
            {
                this._data[key] = data[key];
            }
            var list:any[] = this._data.recordNum;
            for(var i:number = 0;i < list.length; i++)
            {
                list[i].roomId = this._data.roomId;
                list[i].gameID = this._data.gameID;
                list[i].gameMode = this._data.gameMode;
                list[i].parentData = data;
                list[i].gz_id = data.gz_id;
                list[i].groupId = data.groupId;
                for(var pd of list[i].playerNum)
                {
                    pd.playerInfo = this.getPlayerInfo(pd.playerPid,this._data.playerList);
                }
            }
            this._list.dataSource = this._data.recordNum;
            this._tips.visible = this._data.recordNum.length == 0;
            this.setCommonData();
        }

        public setData(data:any):void
        {
            this._data = data;
            this._list.dataSource = [];
        }
        public show():void
        {
            if(!this._data.bRequest)
            {
                sendNetMsg(0x00F9,this._data.groupId);
                return;
            }
            this._list.dataSource = this._data.recordNum;
            this._tips.visible = this._data.recordNum.length == 0;
            this.setCommonData();
        }
        private setCommonData():void
        {
            this._res["txt_11"].text = this._data.roomName;
            this._res["txt_12"].text = "总局数:" + this._data.roundMax;
            this._res["txt_13"].text = "房号:" + this._data.roomId;

        }
        public close():void
        {

        }
        private getPlayerInfo(pid:number,list:Array<any>):any
        {
            for(var pd of list)
            {
                if(pd.playerPid == pid)
                    return pd;
            }
            return null;
        }

        private onItemUpdate(item:laya.ui.Box,index:any):void
        {
            var data:any = this._data.recordNum[index];
            var txt:laya.ui.Label = <laya.ui.Label>getChildByName(item,"txt_1");
            txt.text = "第" + data.roundId + "局";
            
            // txt = <laya.ui.Label>getChildByName(item,"txt_2");
            // txt.text = data.parentData.roomName;

            // txt = <laya.ui.Label>getChildByName(item,"txt_3");
            // txt.text = getDesByLan("房号")+":" + data.roomId;

            txt = <laya.ui.Label>getChildByName(item,"txt_4");
            txt.text = "" + data.creatTime;

            var btn:laya.ui.Button = <laya.ui.Button>getChildByName(item,"btn_huifang");
            if(btn != null)
            {
                btn["__roundId"] = data.roundId;
                if(data.hasVideo > 0) 
                {
                    btn.visible = true;
                    btn.off(laya.events.Event.CLICK,this,this.onClickReplay);
                    btn.on(laya.events.Event.CLICK,this,this.onClickReplay);                
                }
                 else 
                {
                    btn.visible = false;
                    btn.off(laya.events.Event.CLICK,this,this.onClickReplay);
                }
            }
            
            var showing_items = [];
            var playerList:Array<any> = data.playerNum;
            var itemheight:number = 0;

            //是否需要进行排序,把显示的人数居中显示。默认都排序
            //斗地主不需要排序 
            //如果所有显示的人数x值都相同，则不排序
            var isORder:boolean = true;   
            var oldX:number,allSame:boolean;  
            for(var i:number = 0; i < 6; i++)
            {
                var item1:laya.ui.Box = <laya.ui.Box>getChildByName(item,"b_" + (i+1));
                if(item1 == null)
                {
                    break;
                }    
                if(i >= playerList.length)
                {
                    item1.visible = false;                   
                    continue;
                }
                if(isNaN(oldX))
                {
                    oldX = item1.x;
                    allSame = true;
                }    
                else if(oldX == item1.x)
                {
                    allSame = allSame && true;
                }
                else
                {
                     allSame = false;   
                }
                var obj = playerList[i];
                item1.visible = true;
                showing_items.push(item1);
                this.setPlayerInfo(item1,obj,data);
                itemheight = item1.height + 2;
            }
            isORder = !allSame;
            if(isORder)
            {
                var row:number = Math.ceil(showing_items.length  / 2);
                var ty:number = (item.height - row * itemheight) / 2;
                for(var i:number = 0; i < showing_items.length; i++)
                {
                    var item1:laya.ui.Box = showing_items[i];
                    item1.y = ty + Math.floor(i / 2) * itemheight;
                }
            }            
        }
        private onClickReplay(evt:laya.events.Event):void
        {
           this._parent.close();
           this._parent.m_clickHuiFang = true;
           if(utils.tools.isQpqHall())
           {
                g_childGame.enterGameByClient(this._data.gz_id,true,null,{"groupId":this._data.groupId,"roundId":evt.currentTarget["__roundId"]});
           }   
           else
           {
               sendNetMsg(0x00FF, this._data.groupId,evt.currentTarget["__roundId"]);
           }    
        }
        private setPlayerInfo(res:laya.ui.Box,pd:any,data:any):void
        {
            var txt = <laya.ui.Label>getChildByName(res,"txt_1");
            utils.tools.setLabelDisplayValue(txt,pd.playerInfo.playerName);// utils.StringUtility.getNameEx(pd.playerInfo.playerName,10);

            txt = <laya.ui.Label>getChildByName(res,"txt_3");            
            txt.text = pd.winOrLosePoints > 0 ? "+" + pd.winOrLosePoints: pd.winOrLosePoints+"" ;

            txt = <laya.ui.Label>getChildByName(res,"txt_2");   
            txt.text = "";
            var banker:laya.ui.Image = <laya.ui.Image>getChildByName(res,"img_icon");
            banker.visible = false;
            var temp :any;
            if(pd.detailedRecord == "")
            {
                return ;
            }   
            
            temp = JSON.parse(pd.detailedRecord);
            banker.visible = temp.isBanker == 1;
            if(temp.card_type_name)
            {                      
                txt.text = temp.card_type_name ;
                txt.visible = true;
            }
            else
            {
                txt.visible = false;
            }
            
        }
    }
    export class ResultDetailPage
    {
        private _parent:ResultDetail;
        private _res:any;
        private _data:any;
        
        private _items:Array<Laya.UIComponent>;
        private _page:gamelib.control.Page;
        private _numOfPage:number = 3;
        private _totalNum:number = 0;
        private _tips:Laya.Label;
        public constructor(parent:ResultDetail,res:any)
        {
            this._parent = parent;
            this._res = res;

            this._tips = res['txt_tips'];

            this._items = [];
            this._numOfPage = this.getNum();
            for(var i:number = 0; i < this._numOfPage; i++)
            {
                var item:Laya.UIComponent = res['ui_' + (i + 1)]
                this._items.push(item);
                var list:Laya.List = item['list_1'];
                list.dataSource = [];
                list.renderHandler = Laya.Handler.create(this,this.onItemUpdate,[list],false);
            }

            this._page = new gamelib.control.Page(res['btn_page_1'],res['btn_page_2'],res['txt_page'],Laya.Handler.create(this,this.onPageChange,null,false));
        }
        private getNum():number
        {
            var i:number = 0;
            while(true)
            {
                if(this._res['ui_' + (i + 1)])
                    i++;
                else
                    break;
            }
            return i;
        }
        public reciveNetMsg(msgId:number,data:any):void
        {
            if(msgId != 0x00F9 || data.groupId != this._data.groupId) return;
            this._data.bRequest = true;
            for(var key in data)
            {
                this._data[key] = data[key];
            }
            var list:any[] = this._data.recordNum;
            for(var i:number = 0;i < list.length; i++)
            {
                list[i].roomId = this._data.roomId;
                list[i].gameID = this._data.gameID;
                list[i].gameMode = this._data.gameMode;
                list[i].parentData = data;
                list[i].gz_id = data.gz_id;
                list[i].groupId = data.groupId;
                for(var pd of list[i].playerNum)
                {
                    pd.playerInfo = this.getPlayerInfo(pd.playerPid,this._data.playerList);
                }
            }
            this._totalNum = list.length;
            this.showPage(0);
        }
        private showPage(page:number):void
        {
            this.onPageChange(page);
            this._page.setPage(page,Math.ceil(this._totalNum / this._numOfPage));
        }
        private onItemUpdate(list:Laya.List,box:Laya.Box,index:number):void
        {
            var pd:any = list.dataSource[index];
            var txt_name:Laya.Label = getChildByName(box,'txt_player');
            var txt_value:Laya.Label = getChildByName(box,'txt_defen');
            var banker:Laya.Image = getChildByName(box,'img_dizhu');

            txt_name.text = utils.StringUtility.getNameEx(pd.playerInfo.playerName,10);
         
            txt_value.text = pd.winOrLosePoints > 0 ? "+" + pd.winOrLosePoints: pd.winOrLosePoints+"" ;
            
            banker.visible = false;
            var temp :any;
            if(pd.detailedRecord == "")
            {
                return ;
            }   
            temp = JSON.parse(pd.detailedRecord);

            if(temp['isBanker'] != undefined )
                banker.visible = temp.isBanker == 1;
            else if(temp['isbanker'] != undefined )
                banker.visible = temp.isbanker == 1;
            
            // banker.visible = temp.isBanker == 1;
        }
        private onPageChange(page:number):void
        {
            var list:Array<any> = this._data.recordNum; 
            var arr:Array<any> = list.slice(page * this._numOfPage,(page + 1) * this._numOfPage);
            for(var i:number = 0; i < this._items.length ; i++)
            {
                var item:Laya.UIComponent = this._items[i];
                var data:any = arr[i];
                if(data == null)
                {
                    item.visible = false;
                    continue;
                }
                item.visible = true;

                var indexLabel:Laya.Label = item['txt_game'];
                var time:Laya.Label = item['txt_time'];
                var _list:Laya.List = item['list_1'];
                indexLabel.text = "第" + data.roundId + "局";;
                time.text = data.creatTime;
                _list.dataSource =  data.playerNum;

                var huifang_btn:Laya.Button = item['btn_huifang'];
                if(huifang_btn)
                {
                    huifang_btn.visible = data.hasVideo;
                    huifang_btn['__roundId'] = data.roundId;
                }
            }
            this._tips.visible = arr.length == 0;
        }
        private getPlayerInfo(pid:number,list:Array<any>):any
        {
            for(var pd of list)
            {
                if(pd.playerPid == pid)
                    return pd;
            }
            return null;
        }

        public setData(data:any):void
        {
            this._data = data;
        }
        public show():void
        {
            this._page.show();
            for(var i:number = 0; i < this._items.length ; i++)
            {
                var item:Laya.UIComponent = this._items[i];
                var huifang_btn:Laya.Button = item['btn_huifang'];
                if(huifang_btn)
                {
                    huifang_btn.on(Laya.Event.CLICK,this,this.onClickReplay);
                }
            }
            if(!this._data.bRequest)
            {
                sendNetMsg(0x00F9,this._data.groupId);
                return;
            }
            this.showPage(0);
        }
        public close():void
        {
            this._page.close();
            for(var i:number = 0; i < this._items.length ; i++)
            {
                var item:Laya.UIComponent = this._items[i];
                var huifang_btn:Laya.Button = item['btn_huifang'];
                if(huifang_btn)
                {
                    huifang_btn.on(Laya.Event.CLICK,this,this.onClickReplay);
                }
            }
        }
        private onClickReplay(evt:laya.events.Event):void
        {
           this._parent.close();
           if(utils.tools.isQpqHall())
           {
                g_childGame.enterGameByClient(this._data.gz_id,true,null,{"groupId":this._data.groupId,"roundId":evt.currentTarget["__roundId"]});
           }   
           else
           {
               sendNetMsg(0x00FF, this._data.groupId,evt.currentTarget["__roundId"]);
           }    
        }
    }
}