/**
 * Created by wxlan on 2017/9/4.
 */
namespace gamelib.core
{
    import IDestroy = gamelib.core.IDestroy;
    export class Scene extends laya.display.Sprite implements gamelib.core.IDestroy
    {
        private _containerList:Array<laya.display.Sprite>;
        public constructor()
        {
            super();
            this._containerList = [];
        }
        public onEnter():void
        {
            g_signal.dispatch(GameMsg.SCENECHANGE,0);
        }
        public onExit():void
        {

        }
        public destroy():void
        {
            while(this.numChildren)
            {
                var obj:any = this.removeChildAt(0);

                if(utils.tools.is(obj,"gamelib.core.IDestroy"))
                {
                    var temp:IDestroy = obj;
                    temp.destroy();
                }
            }
        }
    }
}
