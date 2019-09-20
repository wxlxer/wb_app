namespace gamelib.common
{
    export class MailUi2 extends gamelib.core.Ui_NetHandle
    {
        private _list:Laya.List;
        private _itemList:Laya.List;
        private _time:Laya.Label;
        private _sender:Laya.Label;
        private _info:Laya.TextArea;

        private _ok:Laya.Button;
        private _ylq:Laya.Image;

        private _tips:Laya.Label;

        private _currentMail:gamelib.data.MailData;
        public constructor()
        {
            super("qpq/Art_Mail");
        }
        
        public reciveNetMsg(msgId: number, data: any):void
        {
            var md:gamelib.data.MailData;
            switch (msgId)
            {
                case 0x0053:		//获取邮件列表
                    gamelib.data.MailData.s_list.length = 0;
                    for(var i:number = 0; i < data.num.length;i++)
                    {
                        md = gamelib.data.MailData.ReadMail(data.num[i]);
                    }
                    this.refreshList(true);
                    
                    break;
                case 0x0054:		//操作邮件
                    md = gamelib.data.MailData.GetMail(data.id,false);
                    var getItemList:Array<any> 
                    if(data.result == 1)
                    {
                        if(data.op == 1){
                            md.status = 4;
                        }
                        else if(data.op == 2||data.op == 6)   //删除。如果有附件，自动领取
                        {
                            if(data.id == 0){    //删除所有
                                getItemList = gamelib.data.MailData.GetItems(gamelib.data.MailData.s_list);
                            }
                            else
                            {
                                getItemList = gamelib.data.MailData.GetItems(md);
                            }
                            gamelib.data.MailData.RemoveMail(data.id);
                        }
                        else if(data.op == 3)   //单个领取
                        {
                            g_uiMgr.showTip(getDesByLan("领取成功"));
                            getItemList = gamelib.data.MailData.GetItems(md);
                            md.extraGetted = true;
                        }
                        else if(data.op == 4)
                        {
                            g_uiMgr.showTip(getDesByLan("领取成功"));   //全部领取
                            getItemList = gamelib.data.MailData.GetItems(gamelib.data.MailData.s_list);
                            gamelib.data.MailData.AllGet();
                        }
                        else if(data.op == 5)       //全部已读
                        {
                            g_uiMgr.showTip(getDesByLan("操作成功"));
                            gamelib.data.MailData.AllRead();
                        }
                        if(getItemList && getItemList.length > 0)
                            g_signal.dispatch(gamelib.GameMsg.PLAYGETITEMEFFECT,getItemList);
                        this.refreshList();
                    }
                    else
                    {
                        g_uiMgr.showTip(getDesByLan("操作失败"));
                    }
                    break;
            }
        }
        protected onShow():void
		{
            super.onShow();
            sendNetMsg(0x0053, 1, 0, 50);      //需要每次请求，有新邮件需要更新     
            this._tips.text = getDesByLan("空邮件提示");   
            this._sender.text = getDesByLan("发件人")+":"+getDesByLan("系统邮件");   
		}
        protected refreshList(changeIndexToZero:boolean = false):void
        {
            this._list.dataSource = gamelib.data.MailData.s_list;            
            this.onSelecteChange();
            this._tips.visible = gamelib.data.MailData.s_list.length == 0;
            this._res['btn_sc'].visible = !this._tips.visible ;
            if(changeIndexToZero)
                this._list.selectedIndex = 0;
        }
        protected onClickObjects(evt:Laya.Event):void
        {
            switch(evt.currentTarget.name)
            {
                case "btn_lq":
                    evt.currentTarget['visible'] = false;
                    sendNetMsg(0x0054,this._currentMail.m_id,3);
                    break;
                case "btn_sc":  //全部删除
                    sendNetMsg(0x0054,0,6);
                    break
            }
        }
        protected init():void
        {
            this._list = this._res['list_1'];
            this._time = this._res['txt_time'];
            this._sender = this._res['txt_name'];
            this._info = this._res['txt_txt'];
            this._itemList = this._res['list_2'];

            this._sender.text = this._time.text = this._info.text = "";
            this._info.editable = false;

            this.addBtnToListener("btn_lq");
            this.addBtnToListener("btn_sc");
            this._ok = this._res['btn_lq'];
            this._ylq = this._res['img_ylq'];
            this._tips = this._res['txt_tips'];

            this._list.dataSource = [];
            this.onSelecteChange();
            
            this._list.renderHandler = Laya.Handler.create(this,this.onMailListRender,null,false);
            this._list.selectEnable = true;
            this._list.selectHandler = Laya.Handler.create(this,this.onSelecteChange,null,false);
            
            this._itemList.renderHandler = Laya.Handler.create(this,this.onItemListRender,null,false);
        }
        private onMailListRender(box:Laya.Box,index:number)
        {
            var icon_img:Laya.Image = getChildByName(box,"img_lq");
            var title_txt:Laya.Label = getChildByName(box,"txt_1");
            var status_img:Laya.Image = getChildByName(box,"img_icon");
            var time_txt:Laya.Label = getChildByName(box,"txt_2");
            var md:gamelib.data.MailData = this._list.dataSource[index];
            var delete_btn:Laya.Button = getChildByName(box,'btn_close');
            var select_img:Laya.Image = getChildByName(box,"img_2");
            select_img.visible = index == this._list.selectedIndex;

            title_txt.text = md.title;
            time_txt.text = md.createDate;
            status_img.skin = md.status == 3 ? "qpq/comp/mail_1.png":"qpq/comp/mail_2.png";
            icon_img.visible = md.hasExtra;
            if(icon_img.visible)
            {
                if(md.extraGetted)  //已领取
                {
                    icon_img.skin = "qpq/window/img_fujian1.png";
                }
                else
                {
                    icon_img.skin = "qpq/window/img_fujian.png";
                }
            }

            delete_btn.offAll(Laya.Event.CLICK);
            delete_btn.on(Laya.Event.CLICK,this,this.removeMaile,[md]);
        }
        private removeMaile(md:gamelib.data.MailData):void
        {
            sendNetMsg(0x0054,md.m_id,2);
        }
        private onItemListRender(box:Laya.Box,index:number):void
        {
            var icon_img:Laya.Image = getChildByName(box,"img_goods");
            var txt_num:Laya.Label = getChildByName(box,"txt_num");
            var data:any = this._itemList.dataSource[index];

			var num:number = data[1];
			var url:string = gamelib.data.GoodsData.GetGoodsIconByMsId(data[0]);
			icon_img.skin = url;
			if(num < 1)
				txt_num.visible = false;
			else
			{
				txt_num.visible = true;
				txt_num.text = utils.tools.getMoneyByExchangeRate(num);
			}
        }
        private onSelecteChange():void
        {
            var selectIndex:number = this._list.selectedIndex;
            var md:gamelib.data.MailData = this._list.dataSource[selectIndex];

            if(md == null)
            {
                this._ok.visible = this._ylq.visible = false;
                this._itemList.dataSource = [];
                this._info.text = "";
                this._sender.text = this._time.text = "";
                return;
            }
           
            if(md.status == 3)
            {
                md.status = 4;
                sendNetMsg(0x0054,md.m_id,1);
            }
            this._time.text = md.createTime;
            this._info.text = md.info;
            this._ok.visible = !md.extraGetted && md.hasExtra;
            this._ylq.visible = md.extraGetted  && md.hasExtra;
            this._currentMail = md;
            this._itemList.dataSource = md.items || [];
        }
    }
}