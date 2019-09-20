/**
* name 
*/
namespace gamelib.common
{
    /**
     * 邮件ui
     * @class MailUi
     */
	export class MailUi extends gamelib.core.Ui_NetHandle
	{
		private _allGet:laya.ui.Button;
		private _allRead:laya.ui.Button;
	
	 	private _x1:number;
        private _x2:number;
        private _x3:number;

		private _dataSource:Array<gamelib.data.MailData>;

		private _list:laya.ui.List;
		constructor(){			
			super("qpq/Art_Mail.scene");
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
                    this.showMainUI();
                    break;
                case 0x0054:		//操作邮件
                    md = gamelib.data.MailData.GetMail(data.id,false);
                    if(data.result == 1)
                    {
                        if(data.op == 1)
                        {
                            md.status = 4;
                            this.update(md);
                        }
                        else if(data.op == 2)
                        {

                            this.deleteMaile(data.id);
                        }
                        else if(data.op == 3)
                        {
                            g_uiMgr.showTip(getDesByLan("领取成功"));
                            md.extraGetted = true;
                            this.update(md);
                        }
                        else if(data.op == 4)
                        {
                            g_uiMgr.showTip(getDesByLan("领取成功"));
                            gamelib.data.MailData.AllGet();
                            this.update(null);
                        }
                        else if(data.op == 5)
                        {
                            g_uiMgr.showTip(getDesByLan("操作成功"));
                            gamelib.data.MailData.AllRead();
                            this.update(null);
                        }
                    }
                    else
                    {
                        g_uiMgr.showTip(getDesByLan("操作失败"));
                    }
                    break;
                case 0x0056:
                    this.updateBtns();
                    break;

            }
        }
        private deleteMaile(id:number):void
        {
            var len:number = gamelib.data.MailData.s_list.length;
            for(var i:number = 0; i < len; i++)
            {
                if(gamelib.data.MailData.s_list[i].m_id == id)
                {
                    gamelib.data.MailData.s_list.splice(i,1);
                    break;
                }
            }
            this.update(null);
        }
		private update(data:gamelib.data.MailData):void
        {
            if(data == null)
            {
                this._list.refresh();
                var txt:any = this._res["txt_txt"];
                if(txt != null)
                {
                    txt.visible = this._dataSource.length == 0;
                }        
            }
            else
            {
                var index:number = this._dataSource.indexOf(data);
                this._list.changeItem(index,data);    
            }
			
            this.updateBtns();
        }
        private _mainInfo:MailInfoUi;
        private showInfo(data:gamelib.data.MailData):void
        {
            this._mainInfo = this._mainInfo || new MailInfoUi();
            this._mainInfo.setData(data)            ;
            this._mainInfo.show();
        }
        private showMainUI():void
        {
			this._dataSource = gamelib.data.MailData.s_list;
            this._list.dataSource = this._dataSource;
            var txt:any = this._res["txt_txt"];
            if(txt != null)
            {
                txt.visible = this._dataSource.length == 0;
            }           
            this.updateBtns();
        }
        private updateBtns():void
        {
            this._allGet.visible = gamelib.data.MailData.canGet();
            this._allRead.visible = gamelib.data.UserInfo.s_self.m_unreadMailNum != 0;
            if(this._allGet.visible == this._allRead.visible)
            {
                this._allGet.x = this._x2;
                this._allRead.x = this._x1;
            }
            else
            {
                if(this._allGet.visible)
                    this._allGet.x = this._x3;
                else
                    this._allRead.x = this._x3;
            }
        }

		protected init():void
		{
			this._allGet = this._res["btn_lingqu"];
            this._allRead = this._res["btn_yidu"];
			this._list = this._res["list_1"];
            this._list.dataSource = [];
            this._list.scrollBar.autoHide = true;

			this._x1 = Math.min(this._allRead.x,this._allGet.x);
            this._x2 = Math.max(this._allRead.x,this._allGet.x);
            this._x3 = this._x1 + (this._x2 - this._x1) / 2;

			this.addBtnToListener("btn_yidu");
			this.addBtnToListener("btn_lingqu");
            this._noticeOther = true;
            this._list.selectEnable = true;
            this._list.selectHandler = new laya.utils.Handler(this, this.onSelect);
            this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
		}
		protected onClickObjects(evt:laya.events.Event):void
        {
            playButtonSound();
            switch (evt.currentTarget)
            {
                case this._allGet:
                    sendNetMsg(0x0054,0,4);
                    gamelib.Api.ApplicationEventNotify('mail_click','全部领取');
                    break;
                case this._allRead:
                    sendNetMsg(0x0054,0,5);
                    gamelib.Api.ApplicationEventNotify('mail_click','全部已读');
                    break;
            }
        }
		protected onShow():void
		{

			super.onShow();
			sendNetMsg(0x0053, 1, 0, 20);      //需要每次请求，有新邮件需要更新
            this._allGet.visible = this._allRead.visible = false;
            
			// this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);

		}
		protected onClose():void
		{
			super.onClose();
			// this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
		}
        private onSelect(index:number):void
        {
            if(index == -1)
                return;
            var md:gamelib.data.MailData = this._list.dataSource[index];
            if(md.status == 3)
            {
                md.status = 4;
                sendNetMsg(0x0054,md.m_id,1);
            }
            this.showInfo(md);
            this._list.selectedIndex = -1;
        }
		private onItemUpdate(item:laya.ui.Box,index:any):void
        {
			var sd: gamelib.data.MailData = this._dataSource[index];
            getChildByName(item,"txt_1").text = sd.title;
            getChildByName(item,"txt_2").text = sd.itemsDes;
            getChildByName(item,"txt_3").text = sd.createTime;
            getChildByName(item,"txt_4").text = sd.leftTime;

            var lq:laya.ui.Button = getChildByName(item,"btn_lingqu");
            // lq.visible = sd.hasExtra && !sd.extraGetted;
            lq.off(laya.events.Event.CLICK,this, this.onGetOnItem);
            lq.on(laya.events.Event.CLICK,this, this.onGetOnItem);

            // item.off(laya.events.Event.CLICK,this, this.onClickItem);
            // item.on(laya.events.Event.CLICK,this, this.onClickItem);

            if(sd.status == 4)
            {
                if(sd.hasExtra )
                {
                    if(sd.extraGetted)
                    {
                        //已读，已领取 显示删除
                        lq.visible = true;
                        lq.label = getDesByLan("删除");    
                    }
                    
                } 
                else
                {
                    lq.visible = true;
                    lq.label = getDesByLan("删除");    
                }      
            }
            else
            {
                if(sd.hasExtra && !sd.extraGetted)
                    lq.label = getDesByLan("领取");
                else
                    lq.label = getDesByLan("查看");
            }

			var img = getChildByName(item,"img_mail");
            if (sd.status == 4)
            {
                img.skin = "qpq/comp/mail_2.png";
            }
            else
            {
				img.skin = "qpq/comp/mail_1.png";
            }
            item["__mail"] = sd;
		}
		private onGetOnItem(evt:laya.events.Event):void
		{
            evt.stopPropagation();
            var index:number = evt.currentTarget.parent["__mail"].m_id;
            if(evt.currentTarget["label"] == getDesByLan("删除"))
            {
                sendNetMsg(0x0054,index,2);
                gamelib.Api.ApplicationEventNotify('mail_click','删除');
            }
            else if(evt.currentTarget["label"] == getDesByLan("查看"))
            {
                var md:gamelib.data.MailData = evt.currentTarget.parent["__mail"];
                if(md.status == 3)
                {
                    md.status = 4;
                    sendNetMsg(0x0054,md.m_id,1);
                }
                this.showInfo(md);
            }
            else
            {
                sendNetMsg(0x0054,index,3);
                gamelib.Api.ApplicationEventNotify('mail_click','领取');
            }
            
		}
	}
}