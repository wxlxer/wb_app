/**
 * Created by wxlan on 2017/8/29.
 */
namespace gamelib.loading
{
    export class LoadingUi extends gamelib.core.BaseUi
    {
        public constructor()
        {
            super("qpq/Art_Loading.scene");
        }

        protected init():void
        {
            if(this._res == null || this._res["bar"] == null)
                return;
            this._res["bar"].value = 0;
                
        }
        protected onClose():void
        {
            
        }
        protected onShow():void
        {
            this.showCopyright();
        }
        public showCopyright():void
        {
            if(this._res["txt_info"])
                this._res["txt_info"].text = GameVar.g_platformData['copyright'] || '';
        }

        public showProgress(pro:number):void
        {
             this.showCopyright();
            if(this._res == null || this._res["bar"] == null)
                return;            
            this._res["bar"].value = pro;
            pro = Math.floor(pro * 100);
            if(this._res["txt_jd"])
                this._res["txt_jd"].text = pro +"%";
        }

    }
}
