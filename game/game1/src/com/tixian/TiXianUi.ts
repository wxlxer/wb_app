import TiXianHistroy from "./TiXianHistroy";
import BasePanel from "../BasePanel";
import TabList from "../control/TabList";
import { g_playerData } from "../data/PlayerData";
import { g_uiMgr } from "../UiMainager";
import SetPassword from "./SetPassword";
import VerifyPassword from "./VerifyPassword";

export default class TiXianUi extends BasePanel
{
    private _tab:TabList;


    private _histroy:TiXianHistroy;

    private _bankInfo:any;

    private _needSetPassword:boolean;
    private _needAddBank:boolean;
    private _setPwd:SetPassword;
    private _verifyPwd:VerifyPassword;
    public constructor()
    {
        super("ui.TiXianUI");
    }

    protected init():void
    {
        this._tab = this._res['tab_1'];
        this._tab = new TabList(this._res["list_tab"]);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {skins:["btns/ic_withdraw_bank.png","btns/ic_withdraw_bank_pressed.png"]},
            // {skins:["btns/ic_withdraw_card.png","btns/ic_withdraw_card_pressed.png"]}
        ];
        
        this.addBtnToListener("btn_tx");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_bangding");
        this.addBtnToListener("btn_bd");
    }
    public reciveNetMsg(msg:string,rd:any,data:any):void
    {
        switch(msg)
        {
            case gamelib.GameMsg.Bindbank:
                g_uiMgr.closeMiniLoading();
                if(data.retCode != 0)
                {
                    return;
                }
                var obj:any = JSON.parse(data.retMsg);
                this.updateData(obj);
                break;
            case gamelib.GameMsg.Bindbankadd:
                g_net.requestWithToken(gamelib.GameMsg.Bindbank,{});
                break;
            case gamelib.GameMsg.Readmoney:
                this._needSetPassword = data.retCode == 1;
                break;
            // case gamelib.GameMsg.Getqkpwd:
            //     var money:number
            //     if(data.retCode == 0)
            //     {
                    
            //     }
            //     break;
        }
    }

    protected onShow():void
    {
        super.onShow();
        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Bindbank,{});    //请求绑定银行信息
        g_net.requestWithToken(gamelib.GameMsg.Readmoney,{});   //获取是否设置绑定密码

        
        this._tab.selectedIndex = 0;
        this.onTabChange(0);

    }
    private updateData(data:any):void
    {
        if(data.mybanknum == "")
        {
            this._tab.dataSource = [
                {skins:["btns/ic_withdraw_bank.png","btns/ic_withdraw_bank_pressed.png"]},
                {skins:["btns/ic_withdraw_card.png","btns/ic_withdraw_card_pressed.png"]}
            ];
            this._res['b_unlock'].visible = true;
            this._res['b_myBank'].visible = false;
            this._needAddBank = true;
        }
        else
        {
            this._tab.dataSource = [
                {skins:["btns/ic_withdraw_bank.png","btns/ic_withdraw_bank_pressed.png"]}
            ];
            this._res['b_unlock'].visible = false;
            this._res['b_myBank'].visible = true;
            this._res['txt_name'].text = data.mybankname;
            this._res['txt_id'].text = data.mybanknum;
            this._needAddBank = false;
            this._bankInfo = data;
        }
    }

    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showTiXian();
        else if(index == 1)
            this.showAddBank();
       
    }
    protected showTiXian():void
    {
        this._res['b_tx'].visible = true;
        this._res['b_add'].visible = false;
    }
    protected showAddBank():void
    {
        this._res['b_tx'].visible = false;
        this._res['b_add'].visible = true;
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_clear":
                this._res['txt_input'].text = "0";
                break;
            case "btn_bangding":
                this._tab.selectedIndex = 1;
                break;
            case "btn_addBank":
                this.showAddBank();
                break;
            case "btn_bd":
                this.onBind();
                break;
            case "btn_tx":  //确认体现
                if(this._needAddBank)
                {
                    g_uiMgr.showTip("请先绑定您的银行卡",true);
                    return;
                }
                if(this._needSetPassword)
                {
                    this._setPwd = this._setPwd ||new SetPassword();
                    this._setPwd.show();
                }
                else
                {
                    var money:number = parseInt(this._res['txt_input'].text);
                    this._verifyPwd = this._verifyPwd ||new VerifyPassword();
                    this._verifyPwd.setData(money);
                    this._verifyPwd.show();
                }
                break;    
        }
    }
    private onBind():void
    {        
        var userName:string = this._res['txt_name'].text;
        var bankName:string = this._res['txt_bankName'].text;
        var mybanknum:string = this._res['txt_bankId'].text;
        var mybankaddress:string = this._res['txt_bankAddress'].text;
        if(userName == "")
        {
            g_uiMgr.showTip("请输入持卡人姓名",true);
            return;
        }
        if(bankName == "")
        {
            g_uiMgr.showTip("请输入银行名",true);
            return;
        }
        if(mybanknum == "")
        {
            g_uiMgr.showTip("请输入银行卡号",true);
            return;
        }
        if(mybankaddress == "")
        {
            g_uiMgr.showTip("请输入银行卡开户地址",true);
            return;
        }

        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Basicxingxi,{
            gmyname:userName,
            gmyphone:g_playerData.m_phone || "",
            WeChat:g_playerData.m_wx || "",
            mailbox:g_playerData.m_mail || ""

        });
        g_net.requestWithToken(gamelib.GameMsg.Bindbankadd,{
            mybankname:bankName,
            mybanknum:mybanknum,
            mybankaddress:mybankaddress
        })
    }
}