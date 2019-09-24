import GetYongJin from "./GetYongJin";
import LingQuHistroy from "./LingQuHistroy";
import FanYongList from "./FanYongList";
import BasePanel from "../BasePanel";
import { g_uiMgr } from "../UiMainager";
import TabList from "../control/TabList";

export default class TuiGuang extends BasePanel
{
    private _myInfo:Laya.Box;
    private _zsList:Laya.Box;
    private _tab:TabList;
    private _list:Laya.List;
    private _qrc:gamelib.control.QRCodeImg;

    private _getYongJin:GetYongJin;
    private _lingQuHistroy:LingQuHistroy;
    private _fanYongList:FanYongList;

    private _boxs:Array<Laya.Box>;
    public constructor()
    {
        super('ui.TuiGuangUI');
    }
    protected init()
    {
        this.addBtnToListener('btn_get');
        this.addBtnToListener('btn_histroy');
        this.addBtnToListener('btn_fylist');
        this.addBtnToListener('btn_fx_hy');
        this.addBtnToListener('btn_fx_qq');
        this.addBtnToListener('btn_fx_pyq');
        this.addBtnToListener('btn_copy');
        this.addBtnToListener('btn_refresh');
        this.addBtnToListener('btn_search');
        this.addBtnToListener('btn_reset');
        
        
        this._qrc = new gamelib.control.QRCodeImg(this._res['img_ewm']);

        this._list = this._res["list_1"];
        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {label:"我的推广",colors:["#f9d6ab","#faf7f2"]},{label:"直属查询",colors:["#f9d6ab","#faf7f2"]},
            {label:"业绩查询",colors:["#f9d6ab","#faf7f2"]},{label:"推广教程",colors:["#f9d6ab","#faf7f2"]}];

        this._boxs = [];
        for(var i:number = 1; i <= 4; i++)
        {
            this._boxs.push(this._res['b_' + i]);
            this._res['b_' + i].visible = false;
        }
        this._list.selectHandler = Laya.Handler.create(this,this.onItemRender,null,false);

        this._list.dataSource = [];
    }
    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0 ;
        
    }
    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showMyTuiGuang();
        else if(index == 1)
            this.showZSCX();
        else if(index == 2)
            this.showYeJi();
        else
            this.showJiaoCheng();
        this.showBox(index);
    }
    private onItemRender(box:Laya.Box,index:number):void
    {

    }   
    /**
     * 显示我的推广
     */
    private showMyTuiGuang():void
    {
        
    }
    /**
     * 显示直属查询
     */
    private showZSCX():void
    {
    }
    //业绩查询
    private showYeJi():void
    {
    }
    private showJiaoCheng():void
    {
    }

    private showBox(index:number):void
    {
        for(var i:number = 0; i < this._boxs.length; i++)
        {
            this._boxs[i].visible = i == index;
        }
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_get":
                this._getYongJin = this._getYongJin || new GetYongJin();
                this._getYongJin.show();
                break;
            case "btn_histroy":
                this._lingQuHistroy = this._lingQuHistroy || new LingQuHistroy();
                this._lingQuHistroy.show();
                break;
            case "btn_fylist":
                this._fanYongList = this._fanYongList || new FanYongList();
                this._fanYongList.show();
                break;
            case "btn_fx_hy":
            case "btn_fx_qq":
            case "btn_fx_pyq":
                this.doShare(evt.currentTarget.name);
                break;
            case "btn_copy":
                utils.tools.copyToClipboard(this._res['txt_web'].text,function()
                {
                    g_uiMgr.showTip("拷贝成功");
                })
                break;
            case "btn_refresh":

                break;
            case "btn_search":
                break;
            case "btn_reset":
                this._res['txt_newPwd1'].text = "";
                break;
        }
    }
    private doShare(name:string):void
    {

    }
}