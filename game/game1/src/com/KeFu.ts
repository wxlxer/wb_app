import BasePanel from "./BasePanel";
import TabList from "./control/TabList";
import { g_systemData } from "./Global";

export default class KeFu extends BasePanel
{
    private _tab:TabList;
    public constructor()
    {
        super("ui.KeFuUiUI");
    }
    protected init():void
    {
        this.addBtnToListener("btn_lx");
        
        this._tab = new TabList(this._res['list_tab']);
        this._tab.dataSource = [
            {skins:["btns/ic_cus_online.png","btns/ic_cus_online_pressed.png"]},
            {skins:["btns/ic_cus_fqc.png","btns/ic_cus_fqc_pressed.png"]}
        ];
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);

        this.addBtnToListener("btn_zx");
        this.addBtnToListener("btn_qq");
        this.addBtnToListener("btn_wx");
    }
    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    }
    private onTabChange(index:number):void
    {
        this._res['b_kf'].visible = index == 0;
        this._res['b_wt'].visible = index == 1;

        // if(index == 1)
        // {
        //    window['application_layer_show'](g_systemData.web_grawhelp);
        // }

        this._res['txt_info'].text = g_systemData.web_grawhelp;
    }
    protected onClickObjects(evt:Laya.Event):void{
        var url:string = "";
        switch(evt.currentTarget.name){
            case "btn_zx":
            url = g_systemData.kf_link;
                window['application_layer_show'](url);
                break;
            case "btn_qq":                
                url = 'http://wpa.qq.com/msgrd?v=3&uin=' + g_systemData.kf_qq + '&site=qq&menu=yes';
                window.open(url);
                break;
            case "btn_wx":
                utils.tools.copyStrToClipboard(g_systemData.kf_wx);
                break;
        }
    }
    
}