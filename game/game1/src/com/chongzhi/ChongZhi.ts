import ChongZhiHistroy from "./ChongZhiHistroy";
import BasePanel from "../BasePanel";
import TabList from "../control/TabList";
import ErweimaCz from "./ErweimaCz";
import BankCzXX from "./BankCzXX";
import BankList from "./BankList";
import ChoseMoney from "./ChoseMoney";
import Plug from "../Plug";
import { g_chongZhiData, EwmInfo } from "../data/ChongZhiData";
import { g_uiMgr } from "../UiMainager";
import { g_playerData } from "../data/PlayerData";


export default class ChongZhi extends BasePanel
{
    private _tab:TabList;
    private _histroy:ChongZhiHistroy;
   
    private _xx_ewm:ErweimaCz;  //线下二维码充值
    private _xx_bank:BankCzXX;      //线下银行卡充值
    private _xx_bankList:BankList;     //线下银行卡列表
    private _xx_choseMoney:ChoseMoney;      //选择金额

    private _xxList:Array<Plug>;
     
    private _isRequesting:boolean;
    public constructor()
    {
        super("ui.ChongZhiUiUI");
    }

    protected init():void
    {
        this._tab = new TabList(this._res['list_1']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.setItemRender(Laya.Handler.create(this,this.onTabItemRender,null,false));       

        this._xx_bank = new BankCzXX(this._res,this);
        this._xx_bankList = new BankList(this._res,this);
        this._xx_choseMoney = new ChoseMoney(this._res,this);
        this._xx_ewm = new ErweimaCz(this._res,this);

        this._xxList = [];
        this._xxList.push(this._xx_ewm);
        this._xxList.push(this._xx_bank);
        this._xxList.push(this._xx_bankList);
        this._xxList.push(this._xx_choseMoney);

        this.addBtnToListener('btn_sx');
        this.addBtnToListener('btn_histroy');

        this._tab.dataSource = [];

    }
    public reciveNetMsg(msg:string,requesData:any,data:any):void
    {
        switch(msg)
        {
            case gamelib.GameMsg.Bankinfo:
                this.checkData();
                break;
            case gamelib.GameMsg.Moneyinhk:
            case gamelib.GameMsg.Moneyinqr:
                if(data.retCode == 0)
                {
                    g_uiMgr.showTip("提交成功");
                }
                break;  
            case gamelib.GameMsg.Readmoney:
                this._res['txt_money'].text = g_playerData.m_money;
                break;     
        }
    }

    protected onShow():void
    {
        super.onShow();

        for(var temp of this._xxList)
        {
            temp.close();
        }
        this._res['txt_money'].text = g_playerData.m_money;
        this.checkData();
    }
    private checkData():void
    {
        if(g_chongZhiData.m_xx_ewmList == null|| g_chongZhiData.m_xx_bankList == null)
        {
            if(!this._isRequesting)
            {
                g_uiMgr.showMiniLoading();
        
                this._isRequesting = true;
                g_net.requestWithToken(gamelib.GameMsg.Bankinfo,{payType:"bank"});
                g_net.requestWithToken(gamelib.GameMsg.Bankinfo,{payType:""});
            }
            
        }
        else
        {
            g_uiMgr.closeMiniLoading();
            this._tab.dataSource = g_chongZhiData.getTitles();
            this._tab.selectedIndex = 0;
            this.onTabChange(0);
        }
    }
    private initTabData():void
    {
        var arr:Array<any> = [];
        for(var i:number = 0; i < 3; i++)
        {
            arr.push({"label":"",icon:"",isHot:false});
        }
        this._tab.dataSource = arr;
    }
    
    
    private onTabItemRender(box:Laya.Box,index:number,data:any):void
    {
        var icon:Laya.Image = getChildByName(box,'img_type');
        var img_yh:Laya.Image = getChildByName(box,'img_yh');
        img_yh.visible = false;
        icon.skin = data.icon;
    }

    public onTabChange(index:number):void
    {       
        var data:any = this._tab.dataSource[index];
        if(data.type == "bank")       //显示银行列表
        {
            this.showBankList_xx();
        }
        else
        {
            this.showChoseMoney_XX(g_chongZhiData.getEwmInfoByType(data.type));
        }
    }

    // private onItemRender(box:Laya.Box,index:number):void
    // {

    // }、
    /*
     *显示银行卡充值 
     */
    public showBankChongZhi_XX(bd:any):void
    {
        for(var temp of this._xxList)
            temp.close();
        this._xx_bank.setData(bd);
        this._xx_bank.show(); 
    }
    public showBankList_xx():void
    {
        for(var temp of this._xxList)
            temp.close();
        this._xx_bankList.show();        
    }
    public showEwm_xx(ewm:EwmInfo,money:number):void
    {
        for(var temp of this._xxList)
            temp.close();
        this._xx_ewm.setData(ewm,money,this._tab.selectedIndex);
        this._xx_ewm.show();        
    }
    public showChoseMoney_XX(ewms:Array<EwmInfo>):void
    {
        for(var temp of this._xxList)
            temp.close();
        this._xx_choseMoney.setData(ewms);
        this._xx_choseMoney.show();    
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_sx"://刷新
                g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Readmoney,{})
                break;
            case "btn_histroy": //充值历史
                this._histroy = this._histroy || new ChongZhiHistroy();
                this._histroy.show();
                break;
            
        }
    }
    private goChongZhi(type:number,money:number):void
    {
        
    }


}