namespace qpq.hall
{
	export class LevelUpUi extends gamelib.core.BaseUi
	{		
		constructor() {
			super("qpq/Art_Ani_VipUpgrade");
		}
		protected init():void
		{
			super.init();
			// this.addBtnToListener("")

			this.m_closeUiOnSide = false;
		}
		/**
		 * [setType description]
		 * @function
		 * @DateTime 2018-11-05T17:38:04+0800
		 * @param    {Array}       arr[0] 1:等级 2：vip等级.arr[1]变化的值
		 */
		public setType(arr:Array<number>):void
		{
			var url:string = "";
			if(arr[0] == 1 )
				url = getGameResourceUrl("animation/ani_djts.png","qpq"); 
			else
				url = getGameResourceUrl("animation/ani_vip.png","qpq");
			this._res['tips_bankerwin'].skin = url;

			var ani:Laya.FrameAnimation = this._res['ani1'];
			ani.play(0,false);
			this.show();
			Laya.timer.once(2500,this,this.close);

		}
	}
}