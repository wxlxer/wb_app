module gamelib.control {
	/**
	 * 二维码图片
	 * @class QRCodeImg
	 */
	export class QRCodeImg {
		
		private _spr_QRCode:laya.display.Sprite;
		private _img:laya.ui.Image;
		private _url:string;
		constructor(img:laya.ui.Image)
		{
			this._spr_QRCode = new laya.display.Sprite();
			this._spr_QRCode.width = img.width;
			this._spr_QRCode.height = img.height;
			this._spr_QRCode.mouseEnabled = false;
			this._img = img;
		}
		/**
		 * 设置二维码内容 
		 * @function setUrl
		 * @DateTime 2018-03-17T14:26:07+0800
		 * @param    {string}                 url [description]
		 */
		public setUrl(url:string):void
		{
			if(url == this._url)
				return;
			this._url = url;
			if(url.indexOf('.png') == -1 && url.indexOf('.jpg') == -1 )
			{
				//生成二维码
				utils.tools.createQRCode(url,this._spr_QRCode);
				this._img.addChild(this._spr_QRCode);
			}
			else
			{
				this._spr_QRCode.removeSelf();
				this._img.skin = url;
			}
		}


	}
}