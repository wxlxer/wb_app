import { g_uiMgr } from "../UiMainager";

export default class LoginUi extends gamelib.core.Ui_NetHandle
{
    public constructor()
    {
        super('ui.LoginUiUI')
    }
    protected init():void
    {
        this.addBtnToListener('btn_login');
        this.addBtnToListener('btn_zc');
    }

    protected onClickObjects(evt:laya.events.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_login":
                if(this._res['txt_name'].text == "" || this._res["txt_pwd"].text == "")
                {
                    g_uiMgr.showTip("请输入账户和密码");
                    return
                }
                g_uiMgr.showMiniLoading();
                g_net.request(gamelib.GameMsg.Login,{un:this._res['txt_name'].text,pw:this._res["txt_pwd"].text});
                this.close();
                break;
            case "btn_zc":
                g_signal.dispatch("openUi",["btn_register"]);
                break;
        }
    }
}