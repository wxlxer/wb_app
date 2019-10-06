import Plug from "../Plug";
import ChongZhi from "./ChongZhi";
import { ui } from "../../ui/layaMaxUI";
import { g_uiMgr } from "../UiMainager";
import { copyStr } from "../Global";

export default class BankCzXX extends Plug
{
    private _chongzi:ChongZhi;
    private _res:ui.Cz_xx_BankUI;
    public constructor(res:any,chongzi:ChongZhi)
    {
        super(res["b_input"]);
        this._chongzi = chongzi;
        this._res = this._box.getChildAt(0) as ui.Cz_xx_BankUI;
        this.addBtnToList("btn_copy1",this._res);
        this.addBtnToList("btn_copy2",this._res);
        this.addBtnToList("btn_copy3",this._res);
        this.addBtnToList("btn_prev",this._res);
        this.addBtnToList("btn_tjcz",this._res);

    }

    public setData(bd:any):void
    {
        this._res.txt_bankName.text = bd.banktype;        
        this._res.txt_name.text = bd.bankinfo;
        this._res.txt_zh.text = bd.bankid;
        this._res.txt_ckrxm.text = "";
        this._res.txt_ckje.text = "";
    }
    protected onClickBtn(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_copy1":
                copyStr(this._res.txt_bankName.text);
                break;
            case "btn_copy2":
                copyStr(this._res.txt_name.text);
                break;
            case "btn_copy3":
                copyStr(this._res.txt_zh.text);
                break;
            case "btn_tjcz":
                var money:number = parseInt(this._res.txt_ckje.text);
                var name:string = this._res.txt_ckrxm.text;
                if(this._res.txt_ckje.text == "" || name == "")
                {
                    g_uiMgr.showTip("转账信息不能为空!",true)
                    return;
                }
                if(money < 10 || money > 100000)
                {
                    g_uiMgr.showTip("充值金额必须在10-100000之间!",true);
                    return;
                }
                g_net.requestWithToken(gamelib.GameMsg.Moneyinhk,{moneynum:money,moneyinname:name});
                break;
            case "btn_prev":
                this.close();
                this._chongzi.showBankList_xx();
                break;

        }
    }

}