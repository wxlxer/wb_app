/**
* name 
*/
namespace gamelib.control
{
	/**
	 * 公告界面
	 * @class NoticeUi
	 */
	export class NoticeUi extends gamelib.core.BaseUi{
		private txt_txt:laya.ui.TextArea;
		constructor()
		{
			super("qpq/Art_Notice");			
		}

		protected init():void
		{
			this.txt_txt = this._res["txt_txt"];
			this.txt_txt.editable = false;
			this.txt_txt.mouseEnabled = false;
			this.txt_txt.vScrollBarSkin = "qpq/comp/vscroll.png";
		}
		public setData(day_notice_config:any)
		{
			this.txt_txt.text = day_notice_config.txt;
			this.txt_txt.align = day_notice_config.align;
			this.txt_txt.valign = "middle";
			
		}

		protected onShow():void
		{
			super.onShow();			
			
			this.txt_txt["changeScroll"]();
		}
		protected onClose():void
		{
			super.onClose();
		}
	}
}