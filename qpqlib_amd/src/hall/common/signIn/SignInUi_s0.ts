namespace qpq.hall
{
	export class SignInUi_s0 extends gamelib.core.Ui_NetHandle
	{
		private _today:number;
		constructor() {
			super("qpq/Art_Signin");
		}
		protected init():void
		{
			var arr:Array<string> = [getDesByLan("周一"),getDesByLan("周二"),getDesByLan("周三"),getDesByLan("周四"),getDesByLan("周五"),getDesByLan("周六"),getDesByLan("周日")];
			for(var i:number = 1; i <= 7; i++)
			{
				var btn:Laya.Button = this._res['UI_' + i]['btn_ok1'];
				var label:Laya.Label = this._res['UI_' + i]['txt_1'];
				label.text = arr[i-1];
				btn.label = getDesByLan("签到");
			}
			this.addBtnToListener('btn_ok8');
			this.addBtnToListener('btn_ok9');
			this.addBtnToListener('btn_ok10');
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
			
			for(var i:number = 1; i <= 7; i++)
			{
				var btn:Laya.Button = this._res['UI_' + i]['btn_ok1'];
				btn.on(Laya.Event.CLICK,this,this.onClickQd);
			}
			var temp = new Date();
			temp.setTime(GameVar.s_loginSeverTime * 1000);
			console.log(temp.getFullYear());
			this._today = temp.getDay();
			this.update();
		}
		private update():void
		{
			var list:Array<any> = g_qpqData.m_siginData.list;
			for(var item of list)
			{
				this.setItem(item);
			}
			list = g_qpqData.m_siginData.list_lj;
			for(var i:number = 0; i < list.length ;i ++)
			{
				this.setLeiJi(list[i],i);
			}
			this._res['txt_day'].text = getDesByLan("累计天数")+":" + g_qpqData.m_siginData.day_lj;
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			var day:number = evt.currentTarget['__day'];

			sendNetMsg(0x2034,3,day)
		}
		private onClickQd(evt:laya.events.Event):void
		{
			console.log("签到");
			sendNetMsg(0x2034,1,evt.currentTarget['__index']);
		}
		private setItem(itemData:any):void
		{
			var index:number = itemData.index;
			var res:any = this._res['UI_' + index];
			res['btn_ok1']['__index'] = index;
			var gd:Laya.Image = res['img_goods1'];
			var ylq:Laya.Image = res['img_ylq1'];
			var btn:Laya.Button = res['btn_ok1'];
			var num:Laya.Label = res['txt_2'];
			
			if(itemData.awards[0].msId == GameVar.g_platformData.gold_type)
				gd.skin = "window/signin_gift_1.png";

			num.text = "x" + itemData.awards[0].num;

			if(itemData.statue == 0)
			{
				ylq.visible = btn.visible = false;
				res.disabled = this._today >= index;
				
			}
			else if(itemData.statue == 1)
			{
				ylq.visible = false;
				btn.visible = true;
			}
			else if(itemData.statue == 2)
			{
				ylq.visible = true;
				btn.visible = false;
			}

		}

		private setLeiJi(itemdata:any,index:number):void
		{
			var day:Laya.Label = this._res['txt_ts' + (1 + index)];
			var btn:Laya.Button = this._res['btn_ok' + (8 + index)];
			var num:Laya.Label = this._res['txt_sl' + (1 + index)];
			btn['__day'] = itemdata.days;

			day.text = getDesByLan("累计") + " itemdata.days " + getDesByLan("天");
			num.text = itemdata.awards[0].num;
			if(itemdata.statue == 0)
			{
				btn.disabled = true;
				btn.label = getDesByLan("领取");
			}
			else if(itemdata.statue == 1)
			{
				btn.disabled = false;
				btn.label = getDesByLan("领取");
			}
			else
			{
				btn.disabled = true;
				btn.label = getDesByLan("已领取");
			}
		}
	}
}