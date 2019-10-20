import Plug from "../Plug";
import ChongZhi from "./ChongZhi";
import { ui } from "../../ui/layaMaxUI";
import TabList from "../control/TabList";
import { g_uiMgr } from "../UiMainager";

export default class XianShang extends Plug
{
    private _chongzi:ChongZhi;
    private _res:ui.Cz_xsUI;
    private _tab:TabList;
    private _list:Laya.List;
    private _datas:Array<any>;
    private _bankInfo:any;
    public constructor(res:any,chongzi:ChongZhi)
    {
        super(res['b_xs']);
        this._chongzi = chongzi; 
        this._res = this._box.getChildAt(0) as ui.Cz_xsUI;
        this.addBtnToList("btn_clear",this._res);
        this.addBtnToList("btn_ok",this._res);

        this._tab = new TabList(this._res.list_2);
        this._list = this._res.list_1;
        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.selectEnable = true;

        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.setItemRender(Laya.Handler.create(this,this.onTabItemRender,null,false));       
    }
    private onItemRender(box:Laya.Box,index:number):void
    {
        var info:any = this._list.dataSource[index];
        var img:Laya.Image = getChildByName(box,"img_icon");
        var choose:Laya.Image = getChildByName(box,"img_choose");
        img.skin = GameVar.s_domain + "/img/bank/" + info.bankImg ;
        choose.skin = index == this._list.selectedIndex ? "comp/radio_chose.png" : "comp/radio_unchose.png"
    }
    private onTabItemRender(box:Laya.Box,index:number,data:any):void
    {
        var icon:Laya.Image = getChildByName(box,'img_icon');
        var label:Laya.Label = getChildByName(box,'txt_label');
        icon.skin = data.icon;        
    }

    public onTabChange(index:number):void
    {       
        var data:any = this._tab.dataSource[index];
        this._list.dataSource =  this.getBankListByBankType(data.bankType);
        this._list.selectedIndex = 0;
    }
    public setData(list:Array<any>):void
    {
        this._datas = list;
        var tabList:Array<any> = [];
        for(var obj of list)
        {
            var tab:any = {
                colors:["#DDB47A","#503215"],
                bankType:obj.bankType
            }
            switch(obj.bankType)
            {
                case "1":
                    tab.label = "网银支付";
                    tab.icon = GameVar.s_domain + "/img/bank/online.png";
                    break;
                case "2":
                    tab.label = "支付宝支付";
                    tab.icon = GameVar.s_domain + "/img/bank/alipay.png";
                    break;
                case "3":
                    tab.label = "微信支付";
                    tab.icon = GameVar.s_domain + "/img/bank/wechat.png";
                    break;
                case "4":
                    tab.label = "银联支付";
                    tab.icon = GameVar.s_domain + "/img/bank/union_scan.png";
                    break;
            }
            tabList[parseInt(obj.bankType) - 1] = tab;
        }
        this._tab.dataSource = tabList;
        this._tab.selectedIndex = 0;
    }
    private getBankListByBankType(bankType:string):Array<any>
    {
        var back:Array<any> = [];
        for(var obj of this._datas){
            if(obj.bankType == bankType)
                back.push(obj);
        }
        return back;
    }

    protected onClickBtn(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_clear":
                // copyStr(this._res.txt_bankName.text);
                break;
            case "btn_ok":
                var money:number = parseInt(this._res.txt_oldPwd.text);
                if(money < 1 || money > 100000)
                {
                    g_uiMgr.showTip("充值金额必须在1-100000之间!",true);
                    return;
                }
                var info:any = this._list.dataSource[this._list.selectedIndex];
                g_net.requestWithToken(gamelib.GameMsg.Payapi,{money:money,paytype:info.id});
                break;

        }
    }

}