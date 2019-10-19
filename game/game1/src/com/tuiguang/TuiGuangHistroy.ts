import BaseHistroy from "../BaseHistroy";
import { g_uiMgr } from "../UiMainager";

export default class TuiGuangHistroy extends BaseHistroy
{
    public constructor()
    {
        super('ui.TuiGuang_XQUI');
    }
    protected onShow():void
    {
        super.onShow();
        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Oldwithnewinfolist,{pageIndex:0,pageSize:200});
    }
    public reciveNetMsg(msg:string,requestData:any,data:any):void
    {
        if(msg == gamelib.GameMsg.Oldwithnewinfolist)
        {
            g_uiMgr.closeMiniLoading();
            this.setData(data.retData);
        }
    }
    protected onItemRender(box:Laya.Box,index:number):void
    {
        var obj:any = this._list.dataSource[index];
        var label:Laya.Label = getChildByName(box,"txt_1");
        label.text = obj.username;

        label = getChildByName(box,"txt_2");
        label.text = obj.addtime;

        label = getChildByName(box,"txt_3");
        if(obj.isRebate == 0)
        {
            label.text = "未返佣";
            label.color = "#EB0112";
        }
        else
        {
            label.text = "已返佣";
            label.color = "#00F41C";
        }

        label = getChildByName(box,"txt_4");
        label.text = obj.rebateamount;

    }
}