import UserInfo from "./UserInfo";
import SetUi from "./SetUi";
import TuiGuang from "./tuiguang/TuiGuang";
import HuoDong from "./HuoDong";
import XiMa from "./xima/XiMa";
import MailUi from "./mail/MailUi";
import KeFu from "./KeFu";
import TiXianUi from "./tixian/TiXianUi";
import ChongZhi from "./chongzhi/ChongZhi";

export default class Hall extends gamelib.core.Ui_NetHandle
{
    private _pmd:gamelib.alert.Pmd;
    private _tab:Laya.Tab;
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
        this.addBtnToListener("btn_tixian");
        this.addBtnToListener("btn_cz");

        this._pmd = new gamelib.alert.Pmd();
        this._pmd.setRes(this._res.img_pmd);

        this._tab = this._res['tab_1'];

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
        }
    }
    protected onShow():void
    {
        super.onShow();
        g_net.request(gamelib.GameMsg.GongGao,0);
    }
    private onTabChange(index:number):void
    {
        console.log(index);
    }
    private _info:UserInfo;
    private _set:SetUi;
    private _tuiGuang:TuiGuang;
    private _huodong:HuoDong;
    private _xima:XiMa;
    private _mail:MailUi;
    private _kefu:KeFu;
    private _tixian:TiXianUi;
    private _chongzhi:ChongZhi;
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
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
        }
    }
}