import BasePanel from "./BasePanel";
import TabList from "./control/TabList";
import Plug from "./Plug";
import { g_playerData } from "./data/PlayerData";

export default class UserInfo extends BasePanel
{
    private _tab:TabList;

    private _tab1:Laya.Tab;
    private _info:Info;
    private _touzu:TouZuHistroy
    private _baobiao:GeRenBapBiao;
    private _mingXi:ZhangHuMingXi;

    public constructor()
    {
        super("ui.UserInfoUI");
    }

    protected init():void
    {
        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
                                    {skins:["btns/ic_pc_grxx.png","btns/ic_pc_grxx_pressed.png"]},      //个人信息
                                    {skins:["btns/ic_pc_tzjl.png","btns/ic_pc_tzjl_pressed.png"]},       //投注记录 
                                    {skins:["btns/ic_pc_zhmx.png","btns/ic_pc_zhmx_pressed.png"]},       //账户明细 
                                    {skins:["btns/ic_pc_grbb.png","btns/ic_pc_grbb_pressed.png"]},      //个人报表
                                                  
                                ];
        this._info = new Info(this._res);
        this._touzu = new TouZuHistroy(this._res);
        this._baobiao = new GeRenBapBiao(this._res);
        this._mingXi = new ZhangHuMingXi(this._res);
    }

    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    }
    private onTabChange(index:number):void
    {
        console.log("选中的“：" + index);
        if(index == 0)
            this.showInfo();
        else if(index == 1)
            this.showTZJL();
        else if(index == 2)
            this.showMingXi();
        else 
            this.showGRBB();
    }
   
    protected showInfo():void
    {
        this._info.show();
        this._touzu.close();
        this._mingXi.close();
        this._baobiao.close();
    }
    protected showTZJL():void
    {
        this._touzu.show();
        this._info.close();        
        this._mingXi.close();
        this._baobiao.close();
    }
    protected showGRBB():void
    {
        this._baobiao.show();
        this._touzu.close();
        this._info.close();        
        this._mingXi.close();
        
    }
    private showMingXi():void
    {
        this._mingXi.show();
        this._baobiao.close();
        this._touzu.close();
        this._info.close();       
        
    }
}
//个人信息
export class Info extends Plug
{
    private _edt1:Laya.Box;

    private _inputs_1:Array<Laya.Input>;
    private _inputs_2:Array<Laya.Input>;

    private _res:any;
    public constructor(res:any)
    {
        
        super(res['b_info'])
        this._res = res;
        this._edt1 = res['btn_xg1'];

        this._inputs_1 = [];
        this._inputs_1.push(getChildByName(this._box,"b_info.txt_nickName"))
        this._inputs_1.push(getChildByName(this._box,"b_info.txt_name"))
        this._inputs_1.push(getChildByName(this._box,"b_info.txt_nickName"))

    }    
    public show() :void{
        super.show();
        this._edt1.on(Laya.Event.CLICK,this,this.onClick);
        // this._edt1['__status'] = 0;
        // this.setStatue(this._edt1,0);

        this._res['txt_account'].text = g_playerData.m_name;
        this._res['txt_level'].text = g_playerData.m_isOldWithNew ? "推广账号":"普通会员";
        this._res['txt_name'].text = g_playerData.m_nickName;
        this._res['txt_mail'].text = g_playerData.m_mail;
        this._res['txt_tel'].text = g_playerData.m_phone;
        this._res['txt_wx'].text = g_playerData.m_wx;
    }
    public close() :void{
        super.close();
        this._edt1.off(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        var box:Laya.Box = evt.currentTarget as Laya.Box;

        //提交修改
        g_net.requestWithToken(gamelib.GameMsg.Basicxingxi,{
            gmyname:this._res['txt_name'].text,
            gmyphone:this._res['txt_tel'].text,
            WeChat:this._res['txt_wx'].text,
            mailbox:this._res['txt_mail'].text,

        })
        
    }
    private setStatue(box:Laya.Box,status:number):void
    {
        box['__status'] = status;
        var img:Laya.Image = <Laya.Image>box.getChildAt(0);
        var txt:Laya.Label = <Laya.Label>box.getChildAt(1);
        if(status == 0)
        {
            img.skin = "btns/ic_edit.png";
            txt.text = "编辑";
        }
        else
        {
            img.skin = "btns/edit_done.png";
            txt.text = "完成";
        }
    }
}
//投注历史
export class TouZuHistroy extends Plug
{
    private _tab:TabList;
    private _list:Laya.List;
    private _tips:Laya.Label;
    private cb_time:Laya.ComboBox;
    private cb_pt:Laya.ComboBox;
    public constructor(res:any)
    {
        super(res['b_touzujilv']);        
        this._tab = new TabList(res['list_tab1']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {label:"棋牌投注记录",colors:["#919196","#33200B"]},
            {label:"视讯投注记录",colors:["#919196","#33200B"]},
            {label:"体育投注记录",colors:["#919196","#33200B"]},
            {label:"电子投注记录",colors:["#919196","#33200B"]},
            {label:"捕鱼投注记录",colors:["#919196","#33200B"]}
        ]
        this._tips = res['txt_tips1']
        this.cb_time = res['cb_time'];
        this.cb_pt = res['cb_pt'];
        this.addBtnToList('btn_time',res);
        this.addBtnToList('btn_pt',res);
        this._list = res['list_1'];
        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);

        this.cb_time.on(Laya.Event.CHANGE,this,this.onTimeChange);
        this.cb_pt.on(Laya.Event.CHANGE,this,this.onPtChange);
    }

    private onTabChange(index:number):void
    {
        console.log(index);
    }

    private onTimeChange():void
    {
        console.log(this.cb_time.selectedIndex);
    }
    private onPtChange():void
    {
        console.log(this.cb_pt.selectedIndex);
    }
    private onListItemRender(box:Laya.Box,index:number):void
    {
        var bg:Laya.Image = getChildByName(box,'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_item_bg1.png" : "comp/list_item_bg2.png";

    }
    public show():void
    {
        super.show();
        this.cb_time.selectedIndex = 0;
        this.cb_pt.selectedIndex = 0;
    }
    public setData(arr:Array<any>):void
    {

    }
    
}
//个人报表
export class GeRenBapBiao extends Plug
{
    private _tab:TabList;
    
    private _time:Laya.Label;
    private _ylze:Laya.Label;
    private txt_yxtzze:Laya.Label;
    private txt_pcze:Laya.Label;
    private txt_fdze:Laya.Label;

    public constructor(res:any)
    {
        super(res['b_baoBiao']);
        this._tab = new TabList(res['list_tab2']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {label:"棋牌报表",colors:["#919196","#33200B"]},
            {label:"电子报表",colors:["#919196","#33200B"]},
            {label:"捕鱼报表",colors:["#919196","#33200B"]},
            {label:"视讯报表",colors:["#919196","#33200B"]},
            {label:"体育报表",colors:["#919196","#33200B"]}
        ]

        this._time = res['txt_time3'];
        this._ylze = res['txt_ylze'];
        this.txt_yxtzze = res['txt_yxtzze'];
        this.txt_pcze = res['txt_pcze'];
        this.txt_fdze = res['txt_fdze'];
    }
    private onTabChange(index:number):void
    {
        console.log(index);
    }
}
//账户明细
export class ZhangHuMingXi extends Plug
{    
    
    private _list:Laya.List;
    private _txt_time:Laya.Label;
    private _txt_status:Laya.Label;

    private _txt_cz:Laya.Label;
    private _txt_tx:Laya.Label;
    private _txt_yh:Laya.Label;
    private _txt_fs:Laya.Label;
    private _txt_ye:Laya.Label;

    private _txt_tips:Laya.Label;
    public constructor(res:any)
    {
        super(res['b_mingxi']);
        this._list = res['list_mx'];
        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);

        this.addBtnToList('btn_time1',res);
        this.addBtnToList('btn_status',res);

        this._txt_time = res['txt_time1'];
        this._txt_status = res['txt_status'];
        this._txt_cz = res['txt_cz'];
        this._txt_tx = res['txt_tx'];
        this._txt_yh = res['txt_yh'];
        this._txt_fs = res['txt_fs'];
        this._txt_ye = res['txt_ye'];

        this._txt_tips = res['txt_tips2'];
    }
    private onListItemRender(box:Laya.Box,index:number):void
    {
        var bg:Laya.Image = getChildByName(box,'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_item_bg1.png" : "comp/list_item_bg2.png";

    }
}