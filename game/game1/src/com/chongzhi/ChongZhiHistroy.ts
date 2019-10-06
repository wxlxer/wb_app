import BaseHistroy from "../BaseHistroy";
import { g_uiMgr } from "../UiMainager";

export default class ChongZhiHistroy extends BaseHistroy
{
    private _dataList1:Array<any>;
    private _dataList2:Array<any>;

    private _bRequesting1:boolean;
    private _bRequesting2:boolean;
    public constructor()
    {
        super('ui.ChongZhiHistroyUI');
    }
    protected onShow():void
    {
        super.onShow();
        this._list.dataSource = [];
        //一个月内的充值记录
        var now:Date = new Date();
        var end:Date = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

        var start_date:string = this.getDate(end,true);
        var end_date:string = this.getDate(now,true);
        g_uiMgr.showMiniLoading();

        this._bRequesting1 = this._bRequesting2 = true;
        //1线上 2线下
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo,{
            moneytype:1,            
            page:0,
            pagesize:100,
            inputtime1:start_date,
            inputtime2:end_date
        })
        g_net.requestWithToken(gamelib.GameMsg.moneyinfo,{
            moneytype:2,            
            page:0,
            pagesize:100,
            inputtime1:start_date,
            inputtime2:end_date
        })
    }
    public reciveNetMsg(msg:string,requestData:any,data:any)
    {
        if(msg == gamelib.GameMsg.moneyinfo)
        {
            g_uiMgr.closeMiniLoading();
            if(data.retCode == 0)
            {
                if(requestData.moneytype == 1)
                {
                    this._dataList1 = data.retData;
                    this._bRequesting1 = false;
                }    
                else
                {
                    this._dataList2 = data.retData;
                    this._bRequesting2 = false;
                }
                this.checkData();
            }
                
        }
    }
    private checkData():void
    {
        if(this._bRequesting1 || this._bRequesting2)
            return;
        g_uiMgr.closeMiniLoading();
        var arr:Array<any> = [];
        if(this._dataList1)
            arr =  arr.concat( this._dataList1);
        if(this._dataList2)
            arr = arr.concat(this._dataList2);
        this._list.dataSource = arr;
        this._tips.visible = arr.length == 0;
    }

    //yyyy-MM-dd HH:mm:ss
    private  getDate(date:Date,only:boolean = false):string {
        var seperator1:string = "-";
        var seperator2:string = ":";
        var month:number = date.getMonth() + 1;
        var dd:number = date.getDate();
        var str_month:string = "";
        var str_date:string = "";
        if (month >= 1 && month <= 9) {
            str_month = "0" + month;
        }
        else
        {
            str_month = month +'';
        }
        if (dd >= 0 && dd <= 9) {
            str_date = "0" + dd;
        }
        else
        {
            str_date = dd +"";
        }
        if(only)
        {
            return  date.getFullYear() + seperator1 + str_month  + seperator1 + str_date
        }
        var currentdate = date.getFullYear() + seperator1 + str_month + seperator1 + str_date
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    }
    protected onItemRender(box:Laya.Box,index:number):void
    {
        var data:any = this._list.dataSource[index];
        var label:Laya.Label = getChildByName(box,'txt_1');
        label.text = data['inputtime'];

        label = getChildByName(box,'txt_2');
        label.text = data['bankcode'];

        label = getChildByName(box,'txt_3');
        if(data['moneystatus'] == 0)
            label.text = "审核中";
        else if(data['moneystatus'] == 1)
            label.text = "成功";
        else 
            label.text = "失败";


        label = getChildByName(box,'txt_4');
        label.text = data['moneynum'] + "元";
    }

}