import GetYongJin from "./GetYongJin";
import LingQuHistroy from "./LingQuHistroy";
import FanYongList from "./FanYongList";
import BasePanel from "../BasePanel";

export default class TuiGuang extends BasePanel
{
    private _myInfo:Laya.Box;
    private _zsList:Laya.Box;
    private _tab:Laya.Tab;
    private _list:Laya.List;
    private _qrc:gamelib.control.QRCodeImg;

    private _getYongJin:GetYongJin;
    private _lingQuHistroy:LingQuHistroy;
    private _fanYongList:FanYongList;

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

        this._tab = this._res["tab_1"];
        this._list = this._res["list_1"];

        this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
        this._list.selectHandler = Laya.Handler.create(this,this.onItemRender,null,false);

        this._list.dataSource = [];
    }
    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0 ;
        this.onTabChange(0);
    }
    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showMyTuiGuang();
        else
            this.showZSCX();
    }
    private onItemRender(box:Laya.Box,index:number):void
    {

    }   
    /**
     * 显示我的推广
     */
    private showMyTuiGuang():void
    {
        this._res['b_1'].visible = true;
        this._res['b_2'].visible = false;
    }
    /**
     * 显示直属查询
     */
    private showZSCX():void
    {
        this._res['b_1'].visible = false;
        this._res['b_2'].visible = true;
    }

        // this.addBtnToListener(this._res['btn_refresh']);
        // this.addBtnToListener(this._res['btn_search']);
        // this.addBtnToListener(this._res['btn_reset']);
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