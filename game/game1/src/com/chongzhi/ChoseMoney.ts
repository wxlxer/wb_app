import Plug from "../Plug";
import ChongZhi from "./ChongZhi";
import { ui } from "../../ui/layaMaxUI";
import TabList from "../control/TabList";
import { EwmInfo } from "../data/ChongZhiData";
import { g_uiMgr } from "../UiMainager";

export default class ChoseMoney extends Plug
{
    private _chongzi:ChongZhi;
    private _res:ui.Cz_xx_chooseMoneyUI;

    private _tab:TabList;
    private _list:Laya.List;

    private _data:EwmInfo;
    
    private _dataList:Array<EwmInfo>;
    public constructor(res:any,chongzi:ChongZhi)
    {
        super(res["b_zf"]);
        this._chongzi = chongzi;
        this._res = this._box.getChildAt(0) as ui.Cz_xx_chooseMoneyUI;

        this._tab = new TabList(this._res.list_2)
        this._tab.setItemRender(Laya.Handler.create(this,this.onTabItemRender,null,false));
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._list = this._res.list_3;

        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);
        this._list.selectEnable = true;
        this._list.selectHandler = Laya.Handler.create(this,this.onSelecte,null,false);

        this._list.dataSource = [{value:10},{value:50},{value:100},{value:200},
                                {value:500},{value:1000},{value:2000},{value:3000},
                                {value:4000},{value:5000},{value:10000}
            ]
        
        this._list.selectedIndex = -1;

        this.addBtnToList("btn_clear",this._res);
        this.addBtnToList("btn_ok",this._res);
    }
    public setData(arr:Array<EwmInfo>):void
    {
        var dataSource:Array<any> = [];
        for(var info of arr)
        {
            dataSource.push({
                label:info['payname'],
                title:info['typeName'],
                id:info['id'],
                colors:["#DDB47A","#503215"]
            })
        }
        this._dataList = arr;
        this._tab.dataSource = dataSource;
        this._tab.selectedIndex = 0;
        this._list.selectedIndex = -1;
        this.onTabChange(0);
    }
    private onTabItemRender(box:Laya.Box,index:number,data:any):void
    {
        var info:Laya.Label = getChildByName(box,"txt_info");
        var label:Laya.Label = getChildByName(box,"txt_label");
        info.text = data.title;
        info.color = label.color;
    }
    private onTabChange(index:number):void
    {
        this._data = this._dataList[index];
    }
    private onListItemRender(box:Laya.Box,index:number):void
    {
        var selected:Laya.Image = getChildByName(box,"img_selected");
        var info:Laya.Label = getChildByName(box,"txt_value");
        var data:any = this._list.dataSource[index];
        info.text = data.value +"元";        
        selected.visible = index == this._list.selectedIndex;
    }
    private onSelecte():void
    {
        if(this._list.selectedIndex == -1)
            return;
        var temp:any = this._list.dataSource[this._list.selectedIndex];
        this._res.txt_oldPwd.text = temp.value ;
    }


    protected onClickBtn(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_clear":
                this._list.selectedIndex = -1;
                this._res.txt_oldPwd.text = "";
                break;
            case "btn_ok":
                var money:number = parseInt(this._res.txt_oldPwd.text);
                if(money == 0)
                {
                    g_uiMgr.showTip("请输入正确的金额!",true);
                    return;
                }
                this._chongzi.showEwm_xx(this._data,money);
                break;

        }
    }
    

}