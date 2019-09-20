namespace qpq.hall
{
    export class ModifyNickName extends gamelib.core.BaseUi {
        private _txt_input:Laya.TextInput;
        public m_parentUi:gamelib.core.BaseUi;
        private _name:Laya.Label;
        constructor() {
            super("qpq/Art_XGNC");
        }
        protected init():void
        {
            this.addBtnToListener("btn_ok");
            this._txt_input = this._res['txt_name'];
            this._txt_input.text = "";
            
            this._txt_input.maxChars = 14;
            this._noticeOther = false;
            this._name = this._res['txt_name1'];
        }
        
        protected onShow():void
        {
            this._name.text = GameVar.nickName;
            this._txt_input.prompt = getDesByLan("修改昵称默认文本");
            this._txt_input.on(Laya.Event.CHANGE,this,this.onTextChange);
        }
        protected onClose():void
        {
            this._txt_input.off(Laya.Event.CHANGE,this,this.onTextChange);
            if(this.m_parentUi)
                this.m_parentUi.show();
        }
        private onTextChange(evt:Laya.Event):void
        {
            var len:number = utils.StringUtility.GetStrLen(this._txt_input.text);
            if(len >= 14)
            {
                this._txt_input.text = utils.StringUtility.GetSubstr(this._txt_input.text,14);
            }
        }
        protected onClickObjects(evt:Laya.Event):void
        {
            playButtonSound();
            var str:string = this._txt_input.text;
            if(str == "" || str == GameVar.nickName)
            {
                g_uiMgr.showAlertUiByArgs({msg:"请输入新昵称"});
                playSound_qipai("warn");
                return;
            }
            var newStr:string = utils.StringUtility.Trim(str);
            if(newStr == "")
            {
                g_uiMgr.showAlertUiByArgs({msg:"昵称不能全是空格"});
                playSound_qipai("warn");
                return;
            }
            qpq.g_commonFuncs.saveSelfInfo({nick:str},Laya.Handler.create(this,this.onSaveCallBack))
            
        }
        private onSaveCallBack(ret):void
        {
            if(ret.ret == 1)
            {
                g_net_configData.addConfig("modifyNickName",1);
                g_net_configData.saveConfig();
                GameVar.urlParam['nickname'] = this._txt_input.text;
                gamelib.data.UserInfo.s_self.m_name = GameVar.nickName;
                gamelib.Api.saveAppUserInfo({nick:GameVar.urlParam['nickname']});
                for(var i:number = 1; i <= 6; i++)
                {
                    var temp:any = qpq.g_configCenter.getConfigByIndex(i);
                    if(temp)
                        g_childGame.modifyGameInfo(temp.gz_id,"nickname",GameVar.urlParam['nickname']);	
                }				
                g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA,0);
                sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
                g_uiMgr.showTip(getDesByLan("修改成功"));
                this.close();
            }
            else
            {
                playSound_qipai("warn");
                g_uiMgr.showAlertUiByArgs({msg:ret.clientMsg});
            }			
        }
    }
}