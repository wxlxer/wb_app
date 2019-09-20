module gamelib.common
{
    /**
     * 保险箱ui
     * @class Bankui
     */
	export class BankUi extends gamelib.core.Ui_NetHandle
	{
         private cy_an:number;
         private btn1:laya.ui.Button;
         private money_self:laya.ui.Label;
         private money_bank:laya.ui.Label;
         //保存金币数量
         protected _moneyInBank:number;
         private _minMoney:number;

        private _input_txt:Laya.Label;
		public constructor()
		{
			super("qpq/Art_Bank.scene");
		}

		protected init():void
		{
            this.addBtnToListener("btn_cr");
            this.addBtnToListener("btn_qc");
            this.addBtnToListener("btn_clear");
            this.addBtnToListener("btn_del");
            for(var i:number = 0; i <= 9; i++)
            {
                this.addBtnToListener("btn_" + i);
            }
            this._input_txt = this._res['txt_input'];
            this.money_self = this._res["txt_money1"];
            this.money_bank = this._res["txt_money2"];
            this._moneyInBank = 0;
            this._minMoney = 5000;
            this._input_txt.text = "";
            this._noticeOther = true;
            
        }
        public set minMoney(value:number)
        {
            this._minMoney = value;
        }
		protected onShow():void
		{
            super.onShow();
            this.update();
            sendNetMsg(0x023E);
            this._input_txt.text = "";
            this._res['txt_tips'].text = utils.StringUtility.format(getDesByLan('资产{0}{1}以上可存入保险箱'),[this._minMoney,GameVar.g_platformData.gold_name]);
            this._res['txt_tips'].visible = this._minMoney > 0;
        }
        private update():void
        {
             this.money_self.text = gamelib.data.UserInfo.s_self.m_money +"";
             this.money_bank.text = this._moneyInBank+"";
        }
		protected onClose():void
		{
			 super.onClose();
		}
        
        protected onClickObjects(evt:laya.events.Event):void
		{      
			switch (evt.currentTarget.name)
			{
                //存入
				case "btn_cr":
                    if(this._input_txt.text == "")
                    {
                        g_uiMgr.showTip(getDesByLan("请输入金额"),true);
                        return;
                    }
                    var opMoney:number = parseInt(this._input_txt.text);
                    var playermoney:any = gamelib.data.UserInfo.s_self.m_money ;

                    //自身资金少于20000不能存！
                    if(playermoney - opMoney < this._minMoney)
                    {
                        g_uiMgr.showAlertUiByArgs({msg:GameVar.g_platformData['gold_name'] + getDesByLan("不足")+"，" + getDesByLan("请重新输入")});
                        return;
                    }
                    
                    sendNetMsg(0x023F,1, parseInt(this._input_txt.text));
                    this._input_txt.text = "";
                break;
                //取出
				case "btn_qc":
                    var num:number = parseInt(this._input_txt.text);
                    if(this._input_txt.text == ""||num == 0)
                    {
                        g_uiMgr.showTip(getDesByLan("请输入金额"),true);
                        return;
                    }
                    
                    if(num > 4000000000)
                    {
                        g_uiMgr.showTip(getDesByLan("每次最多取40亿"),true);
                        return;
                    }
                    //sendNetMsg(0x0240,1, parseInt(this._input_txt.text),"");
                    sendNetMsg(0x0240,1, num,new md5().hex_md5("888888"));
                    this._input_txt.text = "";
					break;
                case "btn_del":    
                    var str:string = this._input_txt.text;
                    if(str == "")
                        return;
                    str = str.substring(0,str.length - 1);
                    this._input_txt.text = str;
                    break;
                case "btn_clear":
                    this._input_txt.text = "";
                    break;    
                default:
                    if(evt.currentTarget.name.indexOf("btn_") == -1)
                        return;
                    var num:number = parseInt(evt.currentTarget.name.charAt(4));
                    var str:string = this._input_txt.text;
                    if(str.length >= 10)
                        return;
                    str += num+"";
                    this._input_txt.text = str;
                    break;
			}
		}
        //网络消息
        public reciveNetMsg(msgId:number,data:any):void
        {
            switch(msgId)
            {
                case 0x0036://更新
                       this.update();
                    break;
          
                case 0x023E://银行信息
                    this._moneyInBank = parseInt(data.money);                     
                    this.update();                     
                    break;
                case 0x023F://存入
                        if(data.result != 1)
                        {
                            g_uiMgr.showTip(getDesByLan("存入失败")+"！");
                            return;
                        }
                        this._moneyInBank += parseInt(data.number);
                        this.update();
                        g_uiMgr.showTip(getDesByLan("存入成功")+"！");
                    break;
                case 0x0240://取出
                    //this.money_bank.text = this._moneyInBank - data.number;
                    if(data.result != 1)
                    {
                        g_uiMgr.showTip(getDesByLan("存款不足")+"！");
                        return;
                    }
                    this._moneyInBank -= parseInt(data.number);
                    this.update();
                    g_uiMgr.showTip(getDesByLan("取款成功")+"！");
                    break;
            }
        }
    }
}
