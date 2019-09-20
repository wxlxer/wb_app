/**
* name 
*/
module qpq.hall
{
	export class QRCUi extends gamelib.core.BaseUi
	{
		private _qrcodeImg:gamelib.control.QRCodeImg
		constructor(){
			super("qpq/Art_QRC");
		}
		protected init():void
		{
			this.addBtnToListener("btn_share");
			this.addBtnToListener("img_QRCode");
			this._qrcodeImg = new gamelib.control.QRCodeImg(this._res["img_QRCode"]);
		}

		protected onShow():void
		{
			super.onShow();
			if(GameVar.isGameVip)
			{
				this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl_Vip||GameVar.m_QRCodeUrl||window["application_share_url"]());
			}
			else
			{
				this._qrcodeImg.setUrl(GameVar.m_QRCodeUrl);
			}
		}

		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			if(evt.currentTarget.name == "img_QRCode")
				utils.tools.snapshotShare(this._res["img_QRCode"]);
			else
				 appShare(true);
		}
		
	}
}