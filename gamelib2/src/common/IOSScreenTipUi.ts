namespace gamelib.control
{
	export class IOSScreenTipUi extends gamelib.core.BaseUi
	{
		constructor() {
			super("qpq.ui.common_Art_ComTips1UI");
		}


		protected onShow():void
		{
			super.onShow();
			this._res['ani1'].play(0,true);
		}
		protected onClose():void
		{
			this._res['ani1'].stop();	
		}
	}
}