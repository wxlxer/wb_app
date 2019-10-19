import XiMaHistroy from "./XiMaHistroy";
import BasePanel from "../BasePanel";
import TabList from "../control/TabList";
import { g_uiMgr } from "../UiMainager";

export default class XiMa extends BasePanel
{
    private _list:Laya.List;
    public constructor()
    {
        super("ui.XiMaUI");
    }

    protected init():void
    {
        this.addBtnToListener("btn_get");
        this._list = this._res["list_1"];
        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        this._list.dataSource = [];
    }
    public reciveNetMsg(msg:string,rd:any,data:any):void{
        switch(msg){
            case gamelib.GameMsg.Realtimereturn:
                g_uiMgr.closeMiniLoading();
                if(data.retCode != 0)
                {
                    return;
                }
                var total:number = 0;
                for(var temp of data.retData)
                {
                    var num:number = parseFloat(temp.fs);
                    temp.fs = (num * 100).toFixed(2) + "%";
                    total += parseFloat(temp.fs_money);
                }
                this._res['txt_money'].text = total.toFixed(2) +"元";
                this._list.dataSource = data.retData;

                this._res['txt_tips1'].visible = data.retData == null || data.retData.length == 0;
                break;
            case gamelib.GameMsg.Rreceivereturn:
                g_uiMgr.closeMiniLoading();
                g_uiMgr.showTip(data.retMsg,data.retMsg != 0);
                break;
        }

    }
    protected onShow():void
    {
        super.onShow();
        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Realtimereturn,{});
    }
    private onItemRender(box:Laya.Box,i:number):void
    {
        var data:any = this._list.dataSource[i];
        var keys:Array<string> = ["typename","BetAmount","ValidBetAmount","NetAmount","fs","fs_money"];
        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            var label:Laya.Label = getChildByName(box,'txt_'+ index);
            label.text = data[element];
        }
        var bg:Laya.Image = getChildByName(box,'item_bg');
        bg.skin = i % 2 == 0 ? "comp/list_itembg1.png" : "comp/list_itembg2.png";      
    }   
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_get":
                g_uiMgr.showMiniLoading();
                g_net.requestWithToken(gamelib.GameMsg.Rreceivereturn,{});
                break;
        }
    }
}