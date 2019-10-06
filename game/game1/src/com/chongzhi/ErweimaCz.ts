import Plug from "../Plug";
import { ui } from "../../ui/layaMaxUI";
import ChongZhi from "./ChongZhi";
import { EwmInfo } from "../data/ChongZhiData";
import { copyStr, saveImageToGallery } from "../Global";
import { g_uiMgr } from "../UiMainager";

/**
 * 二维码充值
 */
export default class ErweimaCz extends Plug
{
    private _res:ui.Cz_xx_ewmUI;
    private _chongzhi:ChongZhi;

    private _tabIndex:number;

    private _data:EwmInfo;

    private tips:Array<string> = ["以上{0}账号限本次存款使用,账户不定期更换!"]
    private _chaxunInfo:any = {
        'wx':'如何查询订单号:\n1.进入微信右下角"我"，点击钱包，点击右上角"+"。\n2.进入"账单",点击对应的转账信息即可查询转账订单。',
        "qqpay":'如何查询订单号:\n1.进入QQ点击左上角头像，点开"我的钱包"。\n2.进入"设置-交易记录",点击对应的转账信息即可查询转账订单。',
        "zfb":'如何查询订单号:\n1.打开支付宝，点击右下角"我的"。\n2.进入"账单",点击对应的转账信息即可查询转账订单。',
        "ysf":'如何查询订单号:\n1.打开云闪付，点击右下角"我的"。\n2.进入"账单",点击对应的转账信息即可查询转账订单。'
    }
    public constructor(res:any,chongzhi:ChongZhi)
    {
        super(res["b_erweima"]);
        this._chongzhi = chongzhi;
        this._res = this._box.getChildAt(0) as ui.Cz_xx_ewmUI;
        this.addBtnToList("btn_copy1",this._res);
        this.addBtnToList("btn_copy2",this._res);
        this.addBtnToList("btn_save",this._res);
        this.addBtnToList("btn_open",this._res);
        this.addBtnToList("btn_tjcz",this._res);
        this.addBtnToList("btn_prev",this._res);

    }
    public setData(data:EwmInfo,money:number,tabIndex:number):void
    {
        this._data = data;
        this._res.txt_bankName.text = data['payname'];
        this._res.txt_name.text = "";
        this._res.txt_zh.text = money +"";
        this._tabIndex = tabIndex;

        this._res.img_ewm.skin = GameVar.s_domain + data['img'];
        var url:string = data['img'];
        var arr = url.split("/");
        this._res.img_ewm.name = arr[arr.length - 1];

        this._res.txt_tips1.text = utils.StringUtility.format("以上{0}账号限本次存款使用,账户不定期更换!",data['typeName'])
        this._res.txt_tips0.text = utils.StringUtility.format("第一步:保存付款二维码,{0}扫码转账到指定{0}账号。",data['typeName'])
        this._res.txt_tip2.visible = data.type == 'wx';
        this._res.txt_cx.text = this._chaxunInfo[data.type];
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
            case "btn_save":
                saveImageToGallery(this._res.img_ewm);
                break;
            case "btn_open":
                break;
            case "btn_tjcz":
                if(this._res.txt_info.text == "")
                {
                    g_uiMgr.showTip("转账信息不能为空",true);
                    return;
                }
                g_net.requestWithToken(gamelib.GameMsg.Moneyinqr,{save:1,money:this._res.txt_zh.text,type:this._data['payname'],par:this._data["type"]});
                this._chongzhi.onTabChange(this._tabIndex);
                break;
            case "btn_prev":
                this._chongzhi.onTabChange(this._tabIndex);
                break;


        }
    }
}