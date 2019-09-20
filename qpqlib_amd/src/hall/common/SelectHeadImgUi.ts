namespace qpq.hall
{
    export class SelectHeadImgUi extends gamelib.core.BaseUi
    {
        private _callBack:Laya.Handler;
        public m_parentUi:gamelib.core.BaseUi;
        constructor(callBack:Laya.Handler) {
            super('qpq/Art_XGTX1');
            this._callBack = callBack;
        }

        protected init():void
        {
            this.addBtnToListener('btn_ps');
            this.addBtnToListener('btn_sc');
            this.addBtnToListener('btn_qx');
            this._noticeOther = false;
        }
        public onShow():void
        {
            playSound_qipai("open");
        }
        protected onClose():void
        {
            super.onClose();
            if(this.m_parentUi)
                this.m_parentUi.show();
        }
        protected onClickObjects(evt:Laya.Event):void
        {
            playButtonSound();
            switch(evt.currentTarget.name)
            {
                case "btn_ps":
                    if(window['application_camera_thumb'])				
                    {
                        window['application_camera_thumb'](true,false,this.onSelectCallBack,this);
                    }	
                    break;
                case "btn_sc":
                    if(window['application_modify_thumb'])				
                    {
                        window['application_modify_thumb'](true,this.onSelectCallBack,this);
                    }
                    break;
                case "btn_qx":	
                    this.close();
                    break;		
            }
        }
        private _url:string;
        private onSelectCallBack(ret:any):void
        {
            if(ret.result != 0)
            {
                g_uiMgr.showTip("选择失败！" + ret.msg);
                playSound_qipai("warning");
                return;
            }
            this._url = ret.url;
            qpq.g_commonFuncs.saveSelfInfo({icon:this._url},Laya.Handler.create(this,this.onSaveCallBack));
        }
        private onSaveCallBack(ret:any):void
        {
            ret['__url'] = this._url;
            this._callBack.runWith(ret);
            this.close();
        }
    }
}