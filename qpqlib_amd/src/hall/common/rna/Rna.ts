module qpq.hall
{

	export class Rna extends gamelib.core.Ui_NetHandle
	{
		private sheng_fen:laya.ui.TextInput;
		private hao_ma:laya.ui.TextInput;
		// private xian_zhi:Array<any>;
		// private shuzi_number:number;
		// 
		private _bSet:boolean;
		public constructor()
		{
			super("qpq/Art_RNA")
		}
		protected init():void
		{
            this.addBtnToListener("btn_ok");
			this.sheng_fen = this._res["txt_input1"];
			this.hao_ma = this._res["txt_input2"];
            this.hao_ma.restrict ="0-9xX";
            this._noticeOther = true;
            
        }
		protected onShow():void
		{
			super.onShow();
			g_uiMgr.showMiniLoading();
			if(g_commonFuncs == null)
				sendNetMsg(0x2035,1,GameVar.pid,"");
			else
			{
				gamelib.Api.getUserIdentity(Laya.Handler.create(this,this.onGetCallBack));	
			}	 	
		}
		private _netData:any;
		public reciveNetMsg(msgId: number,data: any):void
		{
			if(msgId == 0x2035)
			{
				g_uiMgr.closeMiniLoading();
				try
				{
					var obj:any = JSON.parse(data.msg);
					this._netData = obj;
					var temp = obj["实名认证"];
					if(temp)
					{
						this.sheng_fen.text = temp['name'];
						this.hao_ma.text = temp['num'];	
						this.editable = false;
					}
					else
					{
						this.sheng_fen.text =  "";
						this.hao_ma.text =  "";
						this.editable = true;
					}
					
				}
				catch(e)
				{
					this.editable = true;
				}
			}
		}
		private set editable(value:boolean)
		{
			this._bSet = value;
			this.sheng_fen.editable = this.hao_ma.editable = value;
		}
		private get editable():boolean
		{
			return this._bSet;
		}
		protected onClickObjects(evt:laya.events.Event):void
		{    
			switch (evt.currentTarget.name)
			{
                //确定
				case "btn_ok":
					if(!this.editable)
					{
						this.close();
						return;
					}
					var shenf = this.sheng_fen.text+"";
					var haoma = this.hao_ma.text+"";
					if( shenf != "" && haoma != "" && /^.{18}$/.test(haoma))
					{
						if(g_commonFuncs != null)
						{
							gamelib.Api.updateUserIdentity({actual:shenf,idcard:haoma},Laya.Handler.create(this,this.onSaveCallBack));	
						}
						else
						{
							g_uiMgr.showTip(getDesByLan("实名成功") + "！");						
							if(this._netData == null)
								this._netData = {};
							var temp = this._netData["实名认证"];
							if(temp == null)
							{
								temp = {};
								this._netData["实名认证"] = temp;
							}
							temp['name'] = this.sheng_fen.text;
							temp['num'] = this.hao_ma.text;
							sendNetMsg(0x2035,0,GameVar.pid,JSON.stringify(this._netData));
							this.close();
						}
						
					}
					else 
					{
						g_uiMgr.showTip(getDesByLan("请输入正确的姓名和身份证号码") + "！");
					}
					shenf = "";
					haoma = "";
					break;
			}
		}

		protected onSaveCallBack(obj:any):void
		{
			if(obj.ret == 1)
			{
				g_uiMgr.showTip(getDesByLan("实名成功") + "！");
				this.close();	
				try
				{
					sendNetMsg(0x2202,2,5);
				}
				catch(e)
				{
					
				}
			}
			else
			{
				g_uiMgr.showTip(getDesByLan("实名失败") +"  " +obj.clientMsg);	
			}
		}
		protected onGetCallBack(obj:any):void
		{
			g_uiMgr.closeMiniLoading();
			if(obj.ret == 1)
			{
				this.sheng_fen.text = obj.data.actual;
				this.hao_ma.text = obj.data.idcard;	
				if(obj.data.actual != "" && obj.data.idcard != "")
				{
					this.editable = false;
					this._res['btn_ok'].visible = false;
				}	
				else
				{
					this.editable = true;
					this._res['btn_ok'].visible = true;
				}	
			}
			else
			{
				this.sheng_fen.text = "";
				this.hao_ma.text = "";
				this.editable = true;
			}
			
		}

    }
}