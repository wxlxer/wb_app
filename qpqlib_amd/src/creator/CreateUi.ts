
module qpq.creator 
{
   export class CreateUi extends gamelib.core.Ui_NetHandle
   {
	   protected _page:creator.parser.Page;
	   public netMsgStr:string;
	   protected _consume:number;
	   protected _isFree:boolean = false;    
	   constructor()
	   {
		   super("qpq/Art_CreateUi_Custom_1");
	   }
	   protected init():void {
		   this.addBtnToListener("btn_shop");
		   if(this._res["btn_roomList"])
			 	this.addBtnToListener("btn_roomList");
		   this.addBtnToListener("btn_creat");

			var box:laya.ui.Box = this._res["b_area"];

		   this._page = new creator.parser.Page(box.height);
		   box.addChild(this._page);

			var area:laya.ui.Image = this._res["img_area"];
			var arr:Array<number> = [2,3,4,5,6];
			creator.parser.g_groupWidth = area.parent['width'];
		    creator.parser.g_groupStartX = area.x;
			area.removeSelf();
			
			creator.parser.g_posList = {};
			for(var num of arr)
		    {
			   var poss:Array<number> = [];
			   var grap:number = area.width / num;
			   for(var i:number = 0; i < num; i ++)
			   {
				   poss.push(area.x + i * grap);
			   }
			   creator.parser.g_posList[num] = poss;
		   }
		   

		   this._noticeOther = true;

		   if(this._res["btn_shop"])
		   		this._res["btn_shop"].visible = GameVar.g_platformData['show_shop'];
		   if(this._res['txt_name'])
			 this._res['txt_name'].text = "";

		   if(this._res['img_diamond'])
		   {
			  if(GameVar.g_platformData["gold_res_name"])
			  {
				  this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
			  }
		   }
		   if(this._res["txt_xh"])
		   		this._res["txt_xh"].text = "";
	   }
	   public reciveNetMsg(msgId:number,data:any):void
	   {
		   if(msgId == 0x00F4)
		   {
			   this._res["btn_creat"].mouseEnabled = true;
			   this.updateMoney();           
			   this.setNewGame(qpq.g_qpqData.new_table);
		   }
		   else if(msgId == 0x00F1)
		   {
			   this._res["btn_creat"].mouseEnabled = true;
		   }
	   }
	   protected onLocalSignal(msg:string,data:any):void
	   {
		   switch (msg)
		   {
			   case creator.parser.evt_UpdateRoundCost:
				   this._consume = data;
				   this.updateConsume(this._consume);
				   break;
		   }
	   }
	   protected onClickObjects(evt:laya.events.Event):void
	   {
		   playButtonSound();
		   switch(evt.currentTarget.name)          
		   {
			   case "btn_shop":
					 g_signal.dispatch("showShopUi",0);
					 this._noticeOther = false;
					this.close();
					this._noticeOther = true;
					break;  
				case "btn_roomList":
					g_signal.dispatch(SignalMsg.showTableListUi,0);
					this._noticeOther = false;
					this.close();
					this._noticeOther = true;
					break;  
				case "btn_creat":                    
					this.onCreate(evt)
					break;
		   }
	   }
	   protected onCreate(evt:Laya.Event):void
	   {
	   		if(this._page.getConfig().isWait)     
            {
              g_uiMgr.showAlertUiByArgs({"msg":"即将开放"});
              return;
            }

	   		var money:number = qpq.data.PlayerData.s_self.getGold_num(true);
			if(isNaN(this._consume))
			   this._consume = 0;                       
			if(money >= this._consume || this._isFree)
			{
				evt.currentTarget.mouseEnabled = false;
				sendNetMsg(0x00F1,JSON.stringify(this._page.netData));
				playButtonSound();
				g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("创建牌局中")+"..."});
				qpq.g_qpqData.onCreateGame(this._page.netData);                        
			} else {                        
				if(GameVar.g_platformData['create_tip'])
					g_uiMgr.showAlertUiByArgs(GameVar.g_platformData['create_tip']);
				else
					g_uiMgr.showAlertUiByArgs({"msg":GameVar.g_platformData.gold_name_zj + getDesByLan("不够") + "!"});
				playSound_qipai("warn");
			}
	   }
	   public onShow():void
	   {
		   super.onShow();
		   g_signal.add(this.onLocalSignal,this);
		   var config:any = qpq.g_configCenter.creator_default;          

		   if(this._res['txt_name'])
			 	this._res['txt_name'].text = config.name;

     //    this.gameName = creator_default.name;
		   this._page.setConfig(config);
		   this._page.show();

		   if(this._res["img_xianmian"])
		   {
				var temp = qpq.g_qpqData.getSaleConfig(config.game_id,config.mode_id);
				if(temp && qpq.g_qpqData.checkValid(temp))
				{
					this._res["img_xianmian"].visible = this._res["z"].visible = true;
					this._isFree = true;
				}
				else
				{
						this._res["img_xianmian"].visible = this._res["img_line"].visible = false;
					this._isFree = false;
				}
		   }
		   this.updateMoney();           
		   this.setNewGame(qpq.g_qpqData.new_table);
		   this._res["btn_creat"].mouseEnabled = true;
		   
	   }
	   protected updateMoney():void
	   {
		   var money:number = qpq.data.PlayerData.s_self.getGold_num(true);           
		   this._res["txt_diamond"].text = utils.tools.getMoneyDes(money);
	   }
	   public onClose():void {
		   super.onClose();
		   this._page.close();
		   g_signal.remove(this.onLocalSignal);
			playSound_qipai("close");
	   }

	   public setNewGame(value:boolean):void
	   {
		 if(this._res["newIcon_roomlist"])
		   this._res["newIcon_roomlist"].visible = value;
	   }

	   public updateConsume(cur:number):void
	   {
		 if(this._res["txt_xh"])
		  {
			this._res["txt_xh"].text = getDesByLan("每次消耗") + cur + GameVar.g_platformData.gold_name_zj;
			if(cur == 0 || isNaN(cur))
			{
			  this._res["txt_xh"].visible = false;
			}
			else
			{
			  this._res["txt_xh"].visible = true;
			}
		  }  
	   }
	   
   }
}
