/**
* name 
*/
module qpq.hall
{
	export class ShengMing extends gamelib.core.BaseUi
	{
		constructor(){
			super("qpq/Art_Shengming");
		}
		protected init():void
		{
			
		}

		protected onShow():void
		{
			super.onShow();
			
		}

		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			
		}
		
	}
}