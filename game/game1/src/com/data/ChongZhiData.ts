export default class ChongZhiData
{
    

    public m_xianshangData:Array<any>;
    public m_xx_bankList:Array<any>;
    public m_xx_ewmList: any ;//<{title:string,type:string,list:Array<any>}>;
    public constructor(){

    }
    //解析线下交易的银行列表
    public parseBankerListXX(list:Array<any>):void
    {
        this.m_xx_bankList = [];
        for(var temp of list)
            this.m_xx_bankList.push(temp);
    }
    //解析线下交易二维码列表
    public parseEwmListXX(list:Array<any>):void
    {
        this.m_xx_ewmList = {};
        for(var temp of list)
        {
            var info:EwmInfo = new EwmInfo();
            info.parse(temp);

            var arr:Array<EwmInfo> = this.m_xx_ewmList[info.type];
            if(arr == null)
            {
                this.m_xx_ewmList[info.type] = arr = [];
            }
            arr.push(info);
        }
    }
    public getTitles():Array<{label:string,icon:string,type:string}>
    {
        var result:Array<{label:string,icon:string,type:string}> = [];
        if(this.m_xx_bankList && this.m_xx_bankList.length != 0)
        {
            var temp = {
                label:'银行卡转账',
                icon:'icons/dgetcharge_tixianyinliankatubiao.png',
                type:"bank",
                colors:["#DDB47A","#503215"],

            }
            result.push(temp)
        }
        for(var key in this.m_xx_ewmList)
        {
            var item:any = {                
                type:key,
                colors:["#DDB47A","#503215"]
            }
            item.label = this.m_xx_ewmList[key][0].typeName + "转账";
            item.icon = this.m_xx_ewmList[key][0].icon;
            result.push(item)
        }
        //在线存款
        var item:any = {                
            type:"xianshang",
            colors:["#DDB47A","#503215"]
        }
        item.label = "在线支付";
        item.icon = "";
        result.push(item)
        return result;
    }
    public getEwmInfoByType(type:number):Array<EwmInfo>
    {
        return this.m_xx_ewmList[type];
    }
}
export class EwmInfo
{
    private static s_id:number = 0;
    public m_id:number;
    public icon:string;
    public type:string;
    public constructor()
    {
        this.m_id =   EwmInfo.s_id ++;
    }
    public parse(temp:any):void
    {
        switch(temp.type)
        {
            case "wx":
                this.icon = "icons/ic_wechat.png";
                break;
            case "zfb":
                this.icon = "icons/ic_alipay.png";
                break;
            case "ysf":
                this.icon = "icons/nfc_icon.png";
                break;
            case "qqpay":
                this.icon = "icons/ic_QQ.png";
                break;
        }
        for(var key in temp)
        {
            this[key] = temp[key];
        }

    }


}
export var g_chongZhiData:ChongZhiData = new ChongZhiData();