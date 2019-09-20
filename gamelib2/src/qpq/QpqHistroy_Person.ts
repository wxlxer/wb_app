namespace gamelib.common.qpq
{
    /**
     * 战绩历史---金币场 请求0x2021
     * @type {[type]}
     */
	export class QppHistroy_Person extends gamelib.core.Ui_NetHandle
	{
		private _page:gamelib.control.Page;

        private _list:Array<any>;
        private _cd:number = 5000;
        private _lastTime:number = 0;

        private _data:any;

        private _allDatas:Array<Array<any>>;
        private _numOfPage:number = 4;
        private _totalNum:number;
        private _maxHistroyNum:number;

        public constructor() {            
            super("qpq/Art_Record1");
        }
        public reciveNetMsg(msgId:number,data:any):void
        {
            if(msgId != 0x2021) return;
            g_uiMgr.closeMiniLoading();

            var page:number = data.offsize / this._numOfPage;
            this._allDatas[page] = data.list;
            this._totalNum = data.totalNum;
            this._totalNum = Math.min(this._totalNum,this._maxHistroyNum);
            this.showPage(page);
        }

        protected init() 
        {
            this._maxHistroyNum = GameVar.g_platformData['histroy_num'];
            if(isNaN(this._maxHistroyNum))
            {
                this._maxHistroyNum = 200;
            }
            this._page = new gamelib.control.Page(this._res['btn_up'],this._res['btn_down'],this._res['txt_page'],Laya.Handler.create(this,this.onPageChange,null,false));
            this._list = [];
            this._numOfPage = 4;
            for(var i:number = 1; i <= this._numOfPage; i++)
            {
               this._list.push(this._res['ui_' + i]); 
               this._res['ui_' + i].visible = false;
            }
            this._noticeOther = true;
            this._allDatas = [];

        }

        private onPageChange(page:number):void
        {
            var arr:Array<any> = this._allDatas[page];
            if(arr == null)
            {
                this.requestData(page);
            }
            else
            {
                this.setDataSource(arr);    
            }
        }
        private showPage(page:number):void
        {
            this.onPageChange(page);
            this._page.setPage(page,Math.ceil(this._totalNum / this._numOfPage));
        }
        private requestData(page:number):void
        {
        	sendNetMsg(0x2021,page * this._numOfPage,this._numOfPage);
        	g_uiMgr.showMiniLoading();

        }
        protected onShow():void
        {
            super.onShow();
            if(Laya.timer.currTimer - this._lastTime > this._cd)
            {
                this._allDatas.length;
            	this.requestData(0);	
            	this._lastTime = Laya.timer.currTimer;
            }
            else
            {
            	this.showPage(0);
            }
            this._page.show();
        }
        private setDataSource(datasource:Array<any>):void
        {
            this._res['txt_tips'].visible = datasource.length == 0;
            for(var i:number = 0; i < this._list.length;i++)
            {
                var item:any = this._list[i];
                if(datasource[i] == null)
                {
                   item.visible = false;
                    continue;
                } 
                var obj = JSON.parse(datasource[i].json_str);
                if(obj == null)
                {
                    item.visible = false;
                    continue;
                }
                item.visible = true;
                var game_name:laya.ui.Label = item['txt_2'];
                var time:Laya.Label = item['txt_4'];
                var list:Laya.List = item['list_1'];
                if(list.scrollBar)
                    list.scrollBar.autoHide = true;
                list.visible = true;

                list.renderHandler = Laya.Handler.create(this,this.onItemUpdate,[obj.players],false);
                list.dataSource = obj.players ? obj.players : [];
                game_name.text = obj.game_name;
                time.text = obj.create_time;
            }
        }
        protected onClose():void
        {
            super.onClose();
            this._page.close();
        }
        
        private onItemUpdate(list:Array<any>,item:laya.ui.Box,index:any):void
        {
            var pd:any = list[index];

            var txt:Laya.Label = getChildByName(item,"txt_1");
            try
            {
                txt.text = utils.StringUtility.getNameEx(decodeURIComponent(pd.name),10);    
            }
            catch(e)
            {
                txt.text = "????";
            }

            txt = getChildByName(item,"txt_3");            
            var money:string = utils.tools.getMoneyByExchangeRate(pd.winlose);
            txt.text = pd.winlose > 0 ? "+" + money: money + "" ;

            txt = getChildByName(item,"txt_2");   
            txt.text = "";
            var banker:laya.ui.Image = getChildByName(item,"img_icon");
            banker.visible = false;
            var temp :any;
            try
            {
                temp = JSON.parse(pd.extra_data);    
            }
            catch(e)
            {
                return ;
            }
            if(temp['isBanker'] != undefined )
                banker.visible = temp.isBanker == 1;
            else if(temp['isbanker'] != undefined )
                banker.visible = temp.isbanker == 1;
            if(temp.card_type_name == null || temp.card_type_name == "")
            {
                 txt.visible = false;
                return ;
            }   
            txt.text = temp.card_type_name ;
            txt.visible = true;
        }
	}
}