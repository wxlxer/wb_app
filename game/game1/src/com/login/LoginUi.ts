import { g_uiMgr } from "../UiMainager";
import login from "../Global";

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
    protected onShow():void
    {
        super.onShow();
        this._res['txt_name'].text = gamelib.Api.getLocalStorage("username") || "";
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
                login(this._res['txt_name'].text,this._res["txt_pwd"].text);
                this.close();
                break;
            case "btn_zc":
                g_signal.dispatch("openUi",["btn_register"]);
                break;
        }
    }
}