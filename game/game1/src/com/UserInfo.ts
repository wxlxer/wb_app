import BasePanel from "./BasePanel";
import TabList from "./control/TabList";
import Plug from "./Plug";
import { g_playerData } from "./data/PlayerData";
import { UiConfig, getDate } from "./Global";
import TimePicker from "./control/TimePicker";
import { PlatformData, g_gameData } from "./data/GameData";
import { g_uiMgr } from "./UiMainager";

export default class UserInfo extends BasePanel
{
    private _tab:TabList;

    private _tab1:Laya.Tab;
    private _info:Info;
    private _touzu:TouZuHistroy
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
                                    {skins:["btns/ic_pc_zhmx.png","btns/ic_pc_zhmx_pressed.png"]}       //账户明细 
                                                  
                                ];
        this._info = new Info(this._res);
        this._touzu = new TouZuHistroy(this._res);
        this._mingXi = new ZhangHuMingXi(this._res);
    }
    public reciveNetMsg(msg:string,requestData:any,data:any):void
    {
        switch(msg)
        {
            case gamelib.GameMsg.Betinfodata:
                this._touzu.updateData(data);
                break;
            case gamelib.GameMsg.moneyinfo:
                this._mingXi.updateData(data);
                break;
        }
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
    }
    protected showTZJL():void
    {
        this._touzu.show();
        this._info.close();        
        this._mingXi.close();
    }
    protected showGRBB():void
    {
        this._touzu.close();
        this._info.close();        
        this._mingXi.close();
        
    }
    private showMingXi():void
    {
        this._mingXi.show();
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

        this._res['txt_account'].text = g_playerData.m_userName;
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
    private _list:Laya.List;
    private _tips:Laya.Label;
    private _timer_start:TimePicker;
    private _timer_end:TimePicker;
    private _cb_pt:Laya.ComboBox;
    private _allPlarfrom:Array<PlatformData>;
    public constructor(res:any)
    {
        super(res['b_touzujilv']);        
        this._tips = res['txt_tips1']
        this._timer_start = new TimePicker(res['time_start']);
        this._timer_start.setOffsize(-24*3600 * 1000);
        this._timer_end = new TimePicker(res['time_end']);
        this._cb_pt = res['cb_pt'];
        this.addBtnToList('btn_time',res);
        this.addBtnToList('btn_pt',res);
        this._list = res['list_1'];
        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);

        this._timer_start.on(Laya.Event.CHANGE,this,this.check);
        this._timer_end.on(Laya.Event.CHANGE,this,this.check);
        this._cb_pt.on(Laya.Event.CHANGE,this,this.check);
    }
    public updateData(data:any):void
    {
        g_uiMgr.closeMiniLoading();
        if(data.retCode != 0)
            return;    
        this._list.dataSource = data.retData;
        this._tips.visible = data.retData == null || data.retData.length == 0;
    }
    private check():void
    {
        var start_time:string = this._timer_start.time;
        var end_time:string = this._timer_end.time;
        if(this._cb_pt.selectedIndex == -1 || isNaN(this._cb_pt.selectedIndex) || start_time == ""||end_time == "")
        {
            return;
        }
        var pt:string = this._allPlarfrom[this._cb_pt.selectedIndex]['api_name'];
        
        g_uiMgr.showMiniLoading();
        start_time += " 00:00:00";
        end_time += " 00:00:00";
        g_net.requestWithToken(gamelib.GameMsg.Betinfodata,{gametype:pt,bettime1:start_time,bettime2:end_time,page:1,pagesize:200});
    }
    private onListItemRender(box:Laya.Box,index:number):void
    {
        var bg:Laya.Image = getChildByName(box,'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_itembg1.png" : "comp/list_itembg2.png";
        var obj:any = this._list.dataSource[index]
        var keys:Array<string> = ['BillNo',"GameType","BetAmount","ValidBetAmount","BetTime","NetAmount"]
        for(var i:number = 0; i < keys.length; i++)
        {
            var label:Laya.Label = getChildByName(box,'txt_' + (i + 1));
            if(keys[i] == "BetTime")
            {
                label.text = getDate(obj[keys[i]]);
            }
            else  if(keys[i] == "NetAmount")
            {
                if(parseInt(obj[keys[i]]) > 0)
                {
                    label.text = "+" + obj[keys[i]];
                    label.color = "#00F4C";
                }
                else
                {
                    label.text = obj[keys[i]];
                    label.color = "#EB0112";
                }
            }
            else
            {
                label.text = obj[keys[i]];
            }
        }

    }
    public show():void
    {
        super.show();
        this._list.dataSource = [];
        var arr:Array<PlatformData> = g_gameData.getAllPlatformNames();        
        this._allPlarfrom = arr;   
        
        this._cb_pt.labels = this.getDataSource(arr);    
        this._cb_pt.selectedIndex = 0;
        this._timer_start.clear();
        this._timer_end.clear();

    }
    private getDataSource(arr:Array<PlatformData>):string
    {
        var arr1:Array<string> = [];
        for(var temp of arr)
        {
            arr1.push(temp['api_mainname']);
        }
        return arr1.join(",");
    }
    public setData(arr:Array<any>):void
    {

    }
    
}
//账户明细
export class ZhangHuMingXi extends Plug
{    
    private _tab:TabList;
    private _list:Laya.List;
    private _timer_start:TimePicker;
    private _timer_end:TimePicker;
    private _txt_tips:Laya.Label;
    public constructor(res:any)
    {
        super(res['b_mingxi']);
        this._list = res['list_mx'];
        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);
        this._tab = new TabList(res['list_tab1']);

        // res['list_tab1'].scrollBar.hide = true;
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {label:"存款",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]},
            {label:"汇款",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]},
            {label:"提款",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]},
            {label:"返水",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]},
            {label:"优惠活动",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]},
            {label:"其他",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]},
            {label:"抢红包",colors:[UiConfig.txt_color_normal,UiConfig.txt_color_select]}            
        ]

        this._txt_tips = res['txt_tips2'];
        this._timer_start = new TimePicker(res['time_start1']);
        this._timer_start.setOffsize(-24*3600 * 1000);
        this._timer_end = new TimePicker(res['time_end1']);
        this._timer_start.on(Laya.Event.CHANGE,this,this.check);
        this._timer_end.on(Laya.Event.CHANGE,this,this.check);

    }
    public show():void
    {
        super.show();
        this._list.dataSource = [];
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
        this._timer_start.clear();
        this._timer_end.clear();
    }

    public updateData(data:any):void
    {
        g_uiMgr.closeMiniLoading();
        if(data.retCode != 0)
            return;    
        this._list.dataSource = data.retData;
        this._txt_tips.visible = data.retData == null || data.retData.length == 0;
    }
    private onTabChange(index:number):void
    {
        this.check();
    }
    private check():void
    {
        var type:number = this._tab.selectedIndex;
        var start_time:string = this._timer_start.time;
        var end_time:string = this._timer_end.time;
        if(start_time == "" || end_time == "")
        {
            return;
        }
        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo,{moneytype:type + 1,inputtime1:start_time,inputtime2:end_time,page:1,pagesize:200});
    }
    private onListItemRender(box:Laya.Box,index:number):void
    {
        var bg:Laya.Image = getChildByName(box,'item_bg');
        bg.skin = index % 2 == 0 ? "comp/list_itembg1.png" : "comp/list_itembg2.png";

        var obj:any = this._list.dataSource[index];

        var status:Laya.Label = getChildByName(box,'txt_1');
        if(obj.moneystatus == 0)
        {
            status.text = "审核中"
            status.color = "#A1A1A1";
        }
        else if(obj.moneystatus == 1)
        {
            status.text = "成功"
            status.color = "#00F41C"; 
        }
        else(obj.moneystatus == 2)
        {
            status.text = "失败"
            status.color = "#EB0112"; 
        }
        var label:Laya.Label = getChildByName(box,'txt_2');
        label.text = obj.moneynum;

        label = getChildByName(box,'txt_3');
        label.text = obj.inputtime;
        
        label = getChildByName(box,'txt_4');
        label.text = obj.beizhu;        
    }
}