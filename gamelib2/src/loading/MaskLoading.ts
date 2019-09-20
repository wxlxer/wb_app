namespace gamelib.loading
{
	export class MaskLoading extends Laya.Sprite
	{
		public constructor()
		{
			super();
			this.mouseEnabled = true;
			this.mouseThrough = true;
		}
		public show():void
		{
			this.graphics.clear();
			this.graphics.drawRect(0,0,Laya.stage.width,Laya.stage.height,"#FFFFFF");
			this.alpha = 0.1;
			this.zOrder = 200;
			Laya.stage.addChild(this);

		}
		public close():void
		{
			this.removeSelf();
		}
	}
}