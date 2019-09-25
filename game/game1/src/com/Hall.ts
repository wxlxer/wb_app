import UserInfo from "./UserInfo";
import SetUi from "./SetUi";
import TuiGuang from "./tuiguang/TuiGuang";
import HuoDong from "./HuoDong";
import XiMa from "./xima/XiMa";
import MailUi from "./mail/MailUi";
import KeFu from "./KeFu";
import TiXianUi from "./tixian/TiXianUi";
import ChongZhi from "./chongzhi/ChongZhi";
import NoticeMsg from "./notice/NoticeMsg";
import Notice from "./notice/Notice";
import LoginUi from "./login/LoginUi";
import { g_uiMgr } from "./UiMainager";
import RegisterUi from "./login/RegisterUi";
import TabList from "./control/TabList";
import { g_gameData } from "./data/GameData";
import { g_playerData } from "./data/PlayerData";
import login from "./Global";

export default class Hall extends gamelib.core.Ui_NetHandle
{
    private _pmd:gamelib.alert.Pmd;
    private _tab:TabList;
    private _notice:Notice;
    private _noticeMsg:NoticeMsg;
    private _info:UserInfo;
    private _set:SetUi;
    private _tuiGuang:TuiGuang;
    private _huodong:HuoDong;
    private _xima:XiMa;
    private _mail:MailUi;
    private _kefu:KeFu;
    private _tixian:TiXianUi;
    private _chongzhi:ChongZhi;
    private _login:LoginUi;
    private _register:RegisterUi;
    public constructor()
    {
        super("ui.HallUiUI");
    }
    protected init():void
    {
        this.addBtnToListener("img_head");
        this.addBtnToListener("btn_reload");
        this.addBtnToListener("img_web");
        this.addBtnToListener("btn_set");
        this.addBtnToListener("btn_tg");
        this.addBtnToListener("btn_huodong");
        this.addBtnToListener("btn_xm");
        this.addBtnToListener("btn_mail");
        this.addBtnToListener("btn_kf");
        this.addBtnToListener("btn_bank");
        this.addBtnToListener("btn_tixian");
        this.addBtnToListener("btn_cz");
        this.addBtnToListener("btn_login");
        this.addBtnToListener("btn_register");

        this._pmd = new gamelib.alert.Pmd();
        this._pmd.setRes(this._res.img_pmd);

        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {skins:["btns/ic_hot_game.png","btns/ic_hot_game_pressed.png"]},
            {skins:["btns/ic_qipai.png","btns/ic_qipai_pressed.png"]},
            {skins:["btns/ic_buyu.png","btns/ic_buyu_pressed.png"]},
            {skins:["btns/ic_dianzi.png","btns/ic_dianzi_pressed.png"]},
            {skins:["btns/ic_girl_online.png","btns/ic_girl_online_pressed.png"]},
            {skins:["btns/ic_sport.png","btns/ic_sport_pressed.png"]},
        ];
        this._tab.selectedIndex = 0;
        

        g_signal.add(this.onLocalMsg,this);

        var p:Laya.Panel = this._res['p_menu'];
        p.vScrollBar.autoHide = true;
    }
    public aniOut():void
    {
        var temp:any = {x:-this._res.width}
        Laya.Tween.to(this._res,temp,300,Laya.Ease.quartOut);
    }
    public aniIn():void
    {
        var temp:any = {x:0}
        Laya.Tween.to(this._res,temp,300,Laya.Ease.quartOut);
    }
    private onLocalMsg(msg:string,data:any):void
    {
        switch(msg)
        {
            case "onUiShow":
                this.aniOut();
                break;
            case "onUiClose":
                this.aniIn();
                break;
            case "openUi":
                this.handBtn(data[0],data[1]);
                break;    
        }
    }
    protected onShow():void
    {
        super.onShow();

        var userName:string = gamelib.Api.getLocalStorage("username");
        var pwd:string = gamelib.Api.getLocalStorage("password");
        if(userName && pwd) 
        {
            login(userName,pwd);
        }
        // g_net.request(gamelib.GameMsg.GongGao,{});
        // g_net.request(gamelib.GameMsg.Indexhot,{});

        // g_net.request(gamelib.GameMsg.Getapi,{});
        // g_net.request(gamelib.GameMsg.Systemseting,{});
        //请求热门游戏
        g_net.request(gamelib.GameMsg.Getapigame,{gametype:3});

        // g_net.request(gamelib.GameMsg.Getapiassort,{});
        // g_net.request(gamelib.GameMsg.Getapitypegame,{});
        // g_net.request(gamelib.GameMsg.Getapigame,{});

    }
    public reciveNetMsg(msg:string,requestData:any,data:any)
    {
        console.log(msg,requestData,data);
        switch(msg)
        {
            case gamelib.GameMsg.Login:
                g_uiMgr.closeMiniLoading();
                if(data.retCode == 0)
                {
                    GameVar.s_token = data.retMsg;
                    //请求用户信息
                    g_net.requestWithToken(gamelib.GameMsg.MemberInfo,{});

                    this._res['b_unlogin'].visible = false;

                }
                else
                {
                    g_uiMgr.showTip(data.retMsg);
                }
                break;
            case gamelib.GameMsg.MemberInfo:
                if(data.retCode == 0)
                {
                    var temp:any = JSON.parse(data.retMsg);
                    g_playerData.m_name = temp.Username;
                    g_playerData.m_isOldWithNew = temp.is_oldwithnew;
                    g_playerData.m_money = temp.Mymoney;
                    g_playerData.m_phone = temp.Myphone;
                    g_playerData.m_nickName = temp.Myname;

                    this._res['txt_name'].text = g_playerData.m_name;
                    this._res['txt_money'].text = g_playerData.m_money;
                }
                break;
            case gamelib.GameMsg.GongGao:
                this._noticeMsg = this._noticeMsg || new NoticeMsg();
                if(this._noticeMsg.setData(data))
                    this._noticeMsg.show();
                break;
            case gamelib.GameMsg.Indexhot:
                this._notice = this._notice || new Notice();
                this._notice.setData(data.retData);
                this._notice.show();
                break;
            case gamelib.GameMsg.Getapi:
                g_net.request(gamelib.GameMsg.Getapigame,{game:"AG",gametype:0});
                break;
        }
    }
    private onTabChange(index:number):void
    {
        console.log(index);
        // var arr:Array<any> = g_gameData.getSubTypes()
    }
    
    protected onClickObjects(evt:Laya.Event):void
    {
        this.handBtn(evt.currentTarget['name'],null);
    }
    private handBtn(btnName:string,data:any):void
    {
        switch(btnName)
        {
            case "img_head":
                this._info = this._info || new UserInfo();
                this._info.show();
                break;
            case "btn_reload":
                
                break;
            case "img_web":
                utils.tools.copyToClipboard("ddddd");
                break;
            case "btn_set":
                this._set = this._set || new SetUi();
                this._set.show();
                break;
            case "btn_tg":
                this._tuiGuang = this._tuiGuang || new TuiGuang();
                this._tuiGuang.show();
                break;
            case "btn_huodong":
                this._huodong = this._huodong || new HuoDong();
                this._huodong.show();
                break;
            case "btn_xm":
                this._xima = this._xima || new XiMa();
                this._xima.show();
                break;
            case "btn_mail":
                this._mail = this._mail || new MailUi();
                this._mail.show();
                break;
            case "btn_kf":
                this._kefu = this._kefu || new KeFu();
                this._kefu.show();
                break;
            case "btn_tixian":
                this._tixian = this._tixian || new TiXianUi();
                this._tixian.show();
                break;                
            case "btn_cz":
                this._chongzhi = this._chongzhi || new ChongZhi();
                this._chongzhi.show();
                break;
            case "btn_bank":
                    
                break;    
            case "btn_login":
                this._login = this._login || new LoginUi();
                this._login.show();
                break;
            case "btn_register":
                this._register = this._register  || new RegisterUi();
                this._register.show();
                break;
        }
    }
}