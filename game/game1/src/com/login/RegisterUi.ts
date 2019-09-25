import { g_uiMgr } from "../UiMainager";
import login from "../Global";

export default class RegisterUi extends gamelib.core.Ui_NetHandle
{
    public constructor()
    {
        super("ui.RegisterUiUI");
    }
    protected init():void
    {
        super.init();
        this.addBtnToListener('btn_ok');
    }
    public reciveNetMsg(msg:string,requestData:any,data:any):void
    {
        if(msg == gamelib.GameMsg.Register)
        {
            g_uiMgr.showMiniLoading();
            if(data.retCode == 0)
            {
                login(this._res['txt_name'].text,this._res["txt_pwd1"].text);
                this.close();                
            }
            else
            {
                g_uiMgr.showTip(data.retMsg);
            }
            
        }
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        var _id:string = this._res['txt_name'].text;
        var _pw1:string = this._res['txt_pwd1'].text;
        var _pw2:string = this._res['txt_pwd2'].text;

        if(_id == "")
        {
            g_uiMgr.showTip("请输入您的账户!");
            return;
        }
        if(_pw1 == ""||_pw2 == "")
        {
            g_uiMgr.showTip("请输入您的密码!");
            return;
        }
        if(_pw1 != _pw2)
        {
            g_uiMgr.showTip("2次密码不一致!");
            return;
        }
        g_uiMgr.showMiniLoading();
        g_net.request(gamelib.GameMsg.Register,{
            gusername:_id,
            gpassword:_pw1
        });
    }
}
