namespace qpq.hall
{
	/**
	 * 没有累计领取
	 * @type {[type]}
	 */
	export class SignInUi_s1 extends gamelib.core.Ui_NetHandle
	{
		constructor() {
			super("qpq/Art_Signin");
		}
		protected init():void
		{
			var arr:Array<string> = [getDesByLan("周一"),getDesByLan("周二"),getDesByLan("周三"),getDesByLan("周四"),getDesByLan("周五"),getDesByLan("周六"),getDesByLan("周日")];
			for(var i:number = 1; i <= 7; i++)
			{
				var box:Laya.Box = this._res['b_' + i];
				var btn:Laya.Button = getChildByName(box,"btn_ok");
				var label:Laya.Label = getChildByName(box,"txt_1");
				label.text = arr[i-1];
				btn["__day"] = i;
				this._clickEventObjects.push(btn);
			}
		}
		public reciveNetMsg(msgId:number, data:any):void
		{
			switch (msgId)
			{
				case 0x2034:
					if(data.result != 1)
					{
						g_uiMgr.showTip(getDesByLan("签到失败") + "!" + data.result);
						return;
					}			
					g_uiMgr.showTip(getDesByLan("签到成功") + "!");
					break;
				case 0x2033:
					this.update();
					break;	
			}
		}
		protected onShow():void
		{
			super.onShow();
			this.update();
		}
		private update():void
		{
			var list:Array<any> = g_qpqData.m_siginData.list;
			for(var item of list)
			{
				this.setItem(item);
			}
			
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			var day:number = evt.currentTarget['__day'];
			console.log("签到");
			sendNetMsg(0x2034,1,day);
		}
		private setItem(itemData:any):void
		{
			var index:number = itemData.index;
			var box:Laya.Box = this._res["b_" + index];
			var gd:Laya.Image = getChildByName(box,'img_goods');
			var ylq:Laya.Image = getChildByName(box,'img_ylq');
			var btn:Laya.Image = getChildByName(box,'btn_ok');
			
			var num:Laya.Label = getChildByName(box,'txt_2');
			
			if(itemData.awards[0].msId == GameVar.g_platformData.gold_type)
				gd.skin = "window/signin_gift_1.png";

			num.text = "x" + itemData.awards[0].num;

			if(itemData.statue == 0)
			{
				ylq.visible = btn.visible = false;
				btn.disabled = true;
			}
			else if(itemData.statue == 1)
			{
				ylq.visible = false;
				btn.visible = true;
				btn.disabled = false;
			}
			else if(itemData.statue == 2)
			{
				ylq.visible = true;
				btn.visible = false;
			}

		}
	}
}