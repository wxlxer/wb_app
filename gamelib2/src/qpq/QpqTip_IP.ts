/**
 * Created by Administrator on 2017/5/3.
 */
module gamelib.common.qpq {
    export class  QpqTip_IP extends gamelib.core.BaseUi
    {
        private _tip_txt:laya.ui.TextArea;
        private _btn_ok:laya.ui.Button;
        private _sec:number;
        public constructor()
        {
            super("qpq/Art_CustomTips");
        }
        protected  init():void
        {
            this.addBtnToListener("btn_cancel");
            this.addBtnToListener("btn_ok");
            this._btn_ok = this._res["btn_ok"];
            this._tip_txt = this._res["txt_txt"];
            this._res["btn_cancel"].label = "拒绝";
            this.m_closeUiOnSide = false;
        }

        public showSameIp(ipStr:string,addStr:string,time:number):void
        {
            var setStr:string = getDesByLan("注意")+"：\n";
            if(this.checkValid(ipStr))
            {
                setStr += "    "+ipStr;
            }
            if(this.checkValid(addStr)) {
                setStr += "    "+addStr;
            }
            setStr += getDesByLan("您确定要和他们一起游戏")+"？";
            this._tip_txt.text = setStr;
            this._sec = time;
            this.onCount();
        }
        private checkValid(str:string):boolean {
            if(str == null) {
                return false;
            } else if(str == "") {
                return false;
            } else {
                return true;
            }
        }
        public onShow():void {
            super.onShow();
            Laya.timer.loop(1000,this,this.onCount);
        }
        public onClose():void {
            super.onClose();
            Laya.timer.clear(this,this.onCount);
        }
        private onCount():void
        {
            this._btn_ok.label = "(" + getDesByLan("同意")+this._sec+"s)";
            if(this._sec <= 0)
            {
                sendNetMsg(0x00EB,1);
                this.close();
            }
            this._sec --;
        }

        protected onClickObjects(evt:laya.events.Event):void
        {
            if(evt.currentTarget.name == "btn_ok")    //同意
            {
                sendNetMsg(0x00EB,1);
            }
            else
            {
                sendNetMsg(0x00EB,2);
            }
            this.close();
        }
    }
}