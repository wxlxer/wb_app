namespace qpq.hall
{
	/**
	 * 没有累计领取
	 * @type {[type]}
	 */
	export class SignInUi_s2 extends gamelib.core.Ui_NetHandle
	{
		constructor() {
			super("qpq/Art_Signin");
		}
		protected init():void
		{
			var arr:Array<string> = [getDesByLan("周一"),getDesByLan("周二"),getDesByLan("周三"),getDesByLan("周四"),getDesByLan("周五"),getDesByLan("周六"),getDesByLan("周日")];
			for(var i:number = 1; i <= 7; i++)
			{
				var box:Laya.Component = this._res['ui_' + i];
				var label:Laya.Label = box["txt_1"];
				label.text = arr[i-1];
				box["__day"] = i;
				this._clickEventObjects.push(box);
			}
			this._res['btn_lingqu'].visible = false;
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
			var isGuoqi:boolean = true
			for(var item of list)
			{
				if(isGuoqi && item.statue >= 1)
				{
					isGuoqi = false;
				}
				item.isGuoqi = isGuoqi;
				this.setItem(item);
			}
			
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			var day:number = evt.currentTarget['__day'];
			console.log("签到");
			sendNetMsg(0x2034,1,evt.currentTarget['__index']);
		}
		private setItem(itemData:any):void
		{
			var index:number = itemData.index;
			var box:Laya.Box = this._res["ui_" + index];
			var gd:Laya.Image = box['img_goods'];
			var ylq:Laya.Image = box['img_ylq1'];
			var num:Laya.Label = box['txt_2'];
			var ygq:Laya.Image = box['b_guoqi'];
			
			if(itemData.awards[0].msId == GameVar.g_platformData.gold_type)
				gd.skin = "window/signin_gift_1.png";
			num.text = "x" + itemData.awards[0].num;

			if(itemData.statue == 0)
			{
				ylq.visible = false;
				box.mouseEnabled = false;
			}
			else if(itemData.statue == 1)
			{
				ylq.visible = false;
				box.mouseEnabled = true;
			}
			else if(itemData.statue == 2)
			{
				ylq.visible = true;
				box.mouseEnabled = false;
			}
			ygq.visible = itemData.isGuoqi;
		}
	}
}