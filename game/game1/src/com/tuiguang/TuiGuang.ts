
import BasePanel from "../BasePanel";
import { g_uiMgr } from "../UiMainager";
import TabList from "../control/TabList";
import { g_playerData } from "../data/PlayerData";
import TuiGuangHistroy from "./TuiGuangHistroy";
import TuiGuangRule from "./TuiGUangRule";

export default class TuiGuang extends BasePanel
{
    private _myInfo:Laya.Box;
    private _zsList:Laya.Box;
    private _tab:TabList;
    private _qrc:gamelib.control.QRCodeImg;

    private _rule:TuiGuangRule;
    private _histroy:TuiGuangHistroy;

    private _boxs:Array<Laya.Box>;

    private _info:any;
    private _tongji:any;
    private _request:boolean = false;
    public constructor()
    {
        super('ui.TuiGuangUI');
    }
    protected init()
    {
        this.addBtnToListener('btn_gz');
        this.addBtnToListener('btn_sq');
        this.addBtnToListener('btn_xq');
        this.addBtnToListener('btn_fx_hy');
        this.addBtnToListener('btn_fx_qq');
        this.addBtnToListener('btn_copy');        
        
        this._qrc = new gamelib.control.QRCodeImg(this._res['img_ewm']);

        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {skins:["btns/tg_tab1_2.png","btns/tg_tab1_1.png"]},      //老带新
            {skins:["btns/tg_tab2_2.png","btns/tg_tab2_1.png"]}       //申请代理 
        ]        
    }
    public reciveNetMsg(msg:string,requestData:any,data:any):void
    {
        switch(msg)
        {
            case gamelib.GameMsg.Subagent:
                g_uiMgr.closeMiniLoading();
                if(data.retCode == 0)
                {
                    g_uiMgr.showTip("申请成功!");
                }
                else
                {
                    g_uiMgr.showTip("申请失败!" + data.retMsg);
                }
                break;
            case gamelib.GameMsg.Oldwithnewinfo:
                this._info = data.retData;
                this.check();
                break;  
            case gamelib.GameMsg.Oldstatisticalinformation:
                this._tongji = data.retMsg.split(",");
                
                this.check();
                break;
        }
    }
    protected onShow():void
    {
        super.onShow();
        this._res['txt_id'].text = g_playerData.m_userName;
        this._res['txt_info'].text = "";
        this._tab.selectedIndex = 0 ;
        this.onTabChange(0);
        this.check();
    }
    protected onClose():void
    {
        super.onClose();
        this._info = null;
        this._tongji = null;
        this._request = false;
    }
    private check():void{
        if(this._info == null || this._tongji == null){
            if(this._request == false){
                this._request = true;
                g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Oldstatisticalinformation,{});
                g_net.requestWithToken(gamelib.GameMsg.Oldwithnewinfo,{});
            }
        }
        else{
            g_uiMgr.closeMiniLoading();
            this.onTabChange(0);
            this.check();
        }
    }
    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showMyTuiGuang();
        else
            this.showShenQingDaiLi();
      
    }
    /**
     * 显示我的推广
     */
    private showMyTuiGuang():void
    {
       
        this._res['b_1'].visible = true;
        this._res['b_2'].visible = false;
        if(this._tongji == null)
            return;
        this._res['txt_tg_jr'].text = this._tongji[0];
        this._res['txt_tg_wl'].text = this._tongji[1];
        this._res['txt_tg_yj'].text = this._tongji[2];
        this._res['txt_tg_hy'].text = this._tongji[3];

        utils.tools.setLabelDisplayValue(this._res['txt_web'],this._info.TuiRul);
        this._qrc.setUrl(GameVar.s_domain +  this._info.QrUrl);
    }
    /**
     * 
     */
    private showShenQingDaiLi():void
    {
        this._res['b_1'].visible = false;
        this._res['b_2'].visible = true;
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_gz":
                this._rule = this._rule || new TuiGuangRule();
                this._rule.show();
                break;
            case "btn_xq":
                this._histroy = this._histroy || new TuiGuangHistroy();
                this._histroy.show();
                break;
            case "btn_sq":
                if(this._res['txt_info'].text == "")
                {
                    g_uiMgr.showTip("请输入备注信息",true);
                    return;
                }
                g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Subagent,{subcontent:this._res['txt_info'].text});
                break;
            case "btn_copy":
                utils.tools.copyToClipboard(this._info.TuiRul,function()
                {
                    g_uiMgr.showTip("拷贝成功");
                })
                break;
           
        }
    }
    private doShare(name:string):void
    {

    }
}