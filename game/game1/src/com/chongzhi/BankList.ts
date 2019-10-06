import Plug from "../Plug";
import ChongZhi from "./ChongZhi";
import { g_chongZhiData } from "../data/ChongZhiData";

export default class BankList extends Plug
{
    private _list:Laya.List;
    private _chongzi:ChongZhi;
    public constructor(res:any,chongzi:ChongZhi)
    {
        super(res["b_banklist"]);
        this._chongzi = chongzi;
        this._list = res['list_banklist'];
        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);
    }
    public show():void
    {
        super.show();
        this._list.dataSource = g_chongZhiData.m_xx_bankList;
    }

    private onListItemRender(box:Laya.Box,index:number):void
    {
        var icon:Laya.Image = getChildByName(box,"img_bank");
        var info:Laya.Label = getChildByName(box,"txt_info");
        var id:Laya.Label = getChildByName(box,"txt_id");
        var btn_ok:Laya.Button = getChildByName(box,"btn_ok");

        var data:any = this._list.dataSource[index];

        id.text = data.bankid;
        info.text = data.bankinfo;
        icon.skin = GameVar.s_domain + "/img/appImage/bank/" + data.bankCode + ".jpg";

        btn_ok.offAll(Laya.Event.CLICK);
        btn_ok.on(Laya.Event.CLICK,this,this.onClickCz,[data]);
    }
    private onClickCz(bd:any):void
    {
        console.log("打开银行充值");
        this._chongzi.showBankChongZhi_XX(bd);
    }

}