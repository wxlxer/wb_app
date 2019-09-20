namespace gamelib.common
{
	/**
	 * 发送喇叭界面
	 * @class
	 */
	export class BugleUi extends gamelib.core.Ui_NetHandle
	{		
		private _text_input:Laya.Input;
		private _histroy:Laya.TextArea;

		private _price:any;
		private _goods_name:string;;
		constructor() {	
			super("qpq.ui.Art_LabaWindowUI");
		}
		protected init():void
		{
			this.addBtnToListener("btn_ok");
			this._histroy = this._res['txt_2'];
			this._text_input = this._res['txt_input'];
			this._histroy.overflow = "scroll";
			this._histroy.editable = false;
			this._text_input.maxChars = 50;
			this._price = GameVar.g_platformData['bugle_price'];
			this._goods_name = gamelib.data.GoodsData.GetNameByMsId(this._price['msId']);
			this._text_input.prompt = getDesByLan("每次消耗") + this._price["num"] + this._goods_name;
		}
		protected onShow():void
		{
			super.onShow();
			this._histroy.text = "";
			for(var i:number = 0; i <gamelib.data.BugleData.s_list.length ;i++)
			{
				this.showData(gamelib.data.BugleData.s_list[i]);
			}
		}
		public reciveNetMsg(msgId: number,data: any):void
		{
			if(msgId == 0x00F0)
			{
				this.showData(gamelib.data.BugleData.s_list[gamelib.data.BugleData.s_list.length - 1]);
			}
		}

		private showData(bd:gamelib.data.BugleData):void
		{
			this._histroy.text += bd.m_sendName + ":" + bd.m_msg +"\n";
			this._histroy.scrollTo(this._histroy.maxScrollY);
			this._histroy["changeScroll"]();
		}
		protected onClickObjects(evt:Laya.Event):void
		{
			if(this._text_input.text == "")
				return;
			if(gamelib.data.UserInfo.s_self.getGooodsNumByMsId(this._price.msId) <= this._price.num)
			{
				g_uiMgr.showAlertUiByArgs({msg:this._goods_name + getDesByLan("不足") + this._price.num})
			}
			sendNetMsg(0x00F0,this._text_input.text);
			this._text_input.text = "";
		}
	}
}