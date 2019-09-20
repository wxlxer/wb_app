/**
* name 
*/
module gamelib.common
{
	export class MailInfoUi extends gamelib.core.BaseUi
	{
		private _list:laya.ui.List;

		private _data:gamelib.data.MailData;
		private _ok:laya.ui.Button;
		private _ylq:laya.ui.Image;
		private _title:laya.ui.Label;
		private _info:laya.ui.TextArea;
		private _time:laya.ui.Label;
		private _name:laya.ui.Label;
		constructor()
		{
			super("qpq/Art_MailTips.scene");
		}

		protected init():void
		{
			this._list = this._res["list_1"];
			this._ylq = this._res["img_ylq"];
			this._name = this._res["txt_1"];
			this._title = this._res["txt_2"];
			this._info = this._res["txt_3"];
			this._time = this._res["txt_4"];
			this._ok = this._res["btn_ok"];

			this._info.editable = false;
			this.addBtnToListener("btn_ok");
		}
		public onShow():void
		{
			super.onShow();
			this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
			this._list.dataSource = this._data.items||[];
		}
		public onClose():void
		{
			this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
            if(this._data.items)
            {
                sendNetMsg(0x0054,this._data.m_id,3);
            }
            this.close();
		}
		private onItemUpdate(item:laya.ui.Box,index:any):void
        {
			var msId = this._data.items[index][0];
			var num:number = this._data.items[index][1];
			var url:string = this.getItemUrl(msId);
			getChildByName(item,"img_goods").skin = url;
			var txt_num:laya.ui.Label = getChildByName(item,"txt_num");
			if(num < 1)
				txt_num.visible = false;
			else
			{
				txt_num.visible = true;
				txt_num.text =  utils.tools.getMoneyByExchangeRate(num);
			}
		}
		private getItemUrl(msId:number):string
		{
			var temp :any = gamelib.data.GoodsData.s_goodsInfo[msId];
			if(temp)
			{
				return utils.tools.getRemoteUrl(temp.model_icon);
			}
			return GameVar.common_ftp + "shop/item_" + msId +".png";
		}
		public setData(data:gamelib.data.MailData):void
        {
            this._data = data;
            this._ok.visible = !this._data.extraGetted && this._data.hasExtra;
            this._ylq.visible = this._data.extraGetted  && this._data.hasExtra;
            this._name.text = getDesByLan("发件人")+":"+getDesByLan("系统邮件");
            this._title.text = data.title;
            this._info.text = data.info;
            this._time.text = data.createTime;

            gamelib.Api.ApplicationEventNotify("mail",data.title);
        }
	}
}