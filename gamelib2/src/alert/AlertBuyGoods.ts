///<reference path="../base/BaseUi.ts" />
module gamelib.alert
{
    /**
     * @class AlertBuyGoods
     * @author wx
     * @extends gamelib.core.BaseUi
     * 购买商品提示框提示框，不要主动实例化这个类
     * @uses TipManager
     *
     */
    export class AlertBuyGoods extends gamelib.core.BaseUi
    {
        private _buyIndex:number = 0;
        public constructor() 
        {
            super(GameVar.s_namespace + ".Art_JJK_Skin.exml");
        }
        protected init():void
        {
            this._clickEventObjects.push(this["btn_ok"]);
            this._clickEventObjects.push(this["btn_more"]);
        }
        /**
         * @function setMsg
         * 设置消息
         * @param {number}  buyIndex 商品的buyIndex
         * @param {string} 提示消息
         */
        public setMsg(buyIndex:number,msg:string): void
        {
            this["txt_tips"].text = msg;
            var gd = gamelib.data.ShopData.getGoodsInfoById(buyIndex);
            this["txt_0"].text = gd.info1;
            this["txt_1"].text = gd.info2;
            this["txt_2"].text = gd.price + " "+gd.pricetype;
            this["icon"].source = GameVar.common_ftp + "shop/" + gd.icon + ".png"
            this["btn_ok"].icon = GameVar.common_ftp + "shop/" + gd.platformIcon + ".png";
            this._buyIndex = buyIndex;
            this["txt_tips"].visible = !(buyIndex >= 55&&buyIndex <= 57);
        }
        protected onClickObjects(evt:laya.events.Event):void
        {
            playButtonSound();
            if(evt.currentTarget.name == "btn_ok")
            {
                // utils.tools.BuyItem(this._buyIndex);
            }
            else if(evt.currentTarget.name == "btn_more")
            {
                //openShop();
            }
        }
    }
}
