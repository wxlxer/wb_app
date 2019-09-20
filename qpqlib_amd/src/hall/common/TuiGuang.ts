namespace qpq.hall
{
	export class TuiGuang extends gamelib.core.BaseUi
	{
		
		constructor() {
			super('qpq/Art_Tuiguang');			
		}
		protected init():void
		{
			this._res['txt_2'].text = GameVar.g_platformData['txt_kf'];
		}
	}
}