/**
* name 
*/
namespace qpq.hall
{
	export class HuoDongUi extends gamelib.core.BaseUi
	{		
		private _ok_btn:laya.ui.Button;
		private _tab:laya.ui.Tab;
		private _img:laya.ui.Image;

		private _huodongData:any;
		constructor()
		{
			super("qpq/Art_Huodong");
		}
		protected init():void
		{
			this._ok_btn = this._res["btn_ok"];
			this._tab = this._res["tab_1"]	;
			this._img = this._res["img_hd"]	;
			this.addBtnToListener("btn_ok");
			this._noticeOther = true;
			this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);

			var vScrollBar:Laya.ScrollBar = this._res['p_1'].vScrollBar;
			if(vScrollBar)
				vScrollBar.autoHide = true;

		}

		protected onShow():void
		{
			super.onShow();
			
			var arr:Array<string> = [];

			for(var i:number = 0; i < qpq.g_qpqData.huodong_list.length; i++)
			{
				arr.push(qpq.g_qpqData.huodong_list[i].name);				
			}
			this._tab.labels = arr.join(",");
			this._tab.selectedIndex = 0;
			this.onTabChange(0);
		}
		protected onClose():void
		{
			super.onClose();
		}
		protected onClickObjects(evt:laya.events.Event):void
		{
			this.close();
			playButtonSound();
			if(this._huodongData == null || this._huodongData.callback == null)
			{
				return;
			}
			eval(this._huodongData.callback);
		}
		private onTabChange(index:number):void
		{
			this._huodongData = qpq.g_qpqData.huodong_list[index];
			if(this._huodongData == null)
			{
				this._ok_btn.visible = false;
				return;
			}
			if(g_commonFuncs)
			{
				g_commonFuncs.eventTongJi("exercise","活动" + (index + 1));
			}
			if(this._huodongData.buttonLabel == getDesByLan("隐藏"))
			{
				this._ok_btn.visible = false;
			}
			else
			{
				this._ok_btn.visible = true;
				this._ok_btn.label = this._huodongData.buttonLabel ? this._huodongData.buttonLabel : getDesByLan("确定");
			}
			if(this._huodongData.img_url.indexOf("http") == -1)
				this._img.skin = GameVar.urlParam['request_host'] + this._huodongData.img_url;
			else	
				this._img.skin = this._huodongData.img_url;
		}
	}
}