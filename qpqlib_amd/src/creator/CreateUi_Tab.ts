
module qpq.creator 
{
   export class CreateUi_Tab extends gamelib.core.Ui_NetHandle
   {
       protected _page:creator.parser.Page;
       public netMsgStr:string;
       private _consume:number;
       private _isFree:boolean = false;   
       protected _tab:laya.ui.Tab;
       protected _marklist:Array<laya.ui.Image>;
       protected _games:Array<any>;
       protected _currentGame:any;
       
       constructor(res:string = "qpq/Art_CreateUi")
       {
           super(res);
       }
       protected init():void {
           this.addBtnToListener("btn_shop");
           this.addBtnToListener("btn_roomList");
           this.addBtnToListener("btn_creat");

           var box:laya.ui.Box = this._res["b_area"];
           this._page = new creator.parser.Page(box.height);
           box.addChild(this._page);

            var area:laya.ui.Image = this._res["img_area"];
            var arr:Array<number> = [2,3,4,5];
            
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
           creator.parser.g_groupWidth = area.parent['width'];
           creator.parser.g_groupStartX = area.x;

           area.removeSelf();
			    this._noticeOther = true;

          this._tab = this._res["tab_1"];
          this._games = [];
          for(var tgame of qpq.g_configCenter.game_configs)
          {
               // if(tgame.isWait)
               //  {  
               //      if(GameVar.common_ftp.indexOf('open.dev.8z') == -1)
               //      {
               //          continue;
               //      }
               //  }
              this._games.push(tgame);
          }
          this._marklist = [];
          var len = this._tab.numChildren;
          for(var i:number = len - 1; i >= 0;i--)
          {
            if(i >= this._games.length)
            {
              this._tab.removeChildAt(i);
              this._res["img_" +(i+1)].removeSelf();
              continue;
            }
            //this._tab.getChildAt(i)["label"] = this._games[i].name;
            if(this._res["img_" +(i+1)])
              this._marklist.unshift(this._res["img_" +(i+1)]);
          }
          if(this._res["btn_shop"])
              this._res["btn_shop"].visible = GameVar.g_platformData['show_shop'];
          if(this._res['img_diamond'])
          {
              if(GameVar.g_platformData["gold_res_name"])
              {
                  this._res["img_diamond"].skin = GameVar.g_platformData["gold_res_name"];
              }
          }
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
                  if(this._page.getConfig().isWait && GameVar.common_ftp.indexOf('.dev.') == -1)     
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
                        g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("创建牌局中") + "..."});
                        qpq.g_qpqData.onCreateGame(this._page.netData);                        
                    } else {                        
                        g_uiMgr.showAlertUiByArgs({"msg":GameVar.g_platformData.gold_name_zj + getDesByLan("不够") + "!"});
                        playSound_qipai("warn");
                    }
                break;  
           }
       }
       public onShow():void
       {
           super.onShow();
           g_signal.add(this.onLocalSignal,this);
           this._tab.on(laya.events.Event.CHANGE,this,this.onTabChange);
           this.updateMoney();
           this.updateTabBigSale();
           this.setNewGame(qpq.g_qpqData.new_table);
           this._res["btn_creat"].mouseEnabled = true;
           if(this._res['txt_name'])
             this._res['txt_name'].text = "";
           this.setDatauletGame();           
           
       }
       protected setDatauletGame():void
       {           
           var lastGameIndex:number = 0;
           if(g_configCenter.creator_default)
           {
                for(var i:number = 0; i < this._games.length ;i++)
                {
                    if(this._games[i]['enter_index'] == g_configCenter.creator_default['enter_index'])
                    {
                        lastGameIndex = i;
                        break;
                    }
                }
               g_configCenter.creator_default = null;
           }
        //    else if(g_qpqData.m_habitRecord)
        //    {
        //       var lastGame = g_qpqData.m_habitRecord[0];
        //       if(lastGame && lastGame.game_id == 14)
        //       {
        //           for(var i:number = 0; i < this._games.length ;i++)
        //           {
        //               if(this._games[i].mode_id == lastGame.mode_id)
        //                   lastGameIndex = i;
        //           }
        //       }
        //    }
           this._tab.selectedIndex = lastGameIndex;
           this.onTabChange();
       }
       protected updateMoney():void
       {
           var money:number = qpq.data.PlayerData.s_self.getGold_num(true);
           this._res["txt_diamond"].text = money +"";
       }
       protected updateTabBigSale():void 
       {
            for(var i:number = 0; i < this._marklist.length; i++)
            {
                if(i >= this._games.length)
                {
                    this._marklist[i].visible = false;
                }
                else
                {
                    var temp = g_qpqData.getSaleConfig(this._games[i].game_id,this._games[i].mode_id);
                    this._marklist[i].visible = (temp && g_qpqData.checkValid(temp));
                }
            }
        }

        protected updateBigSale():void
        {
          if(this._marklist[this._tab.selectedIndex])
              this._res["img_line"].visible = this._res["img_xianmian"].visible = this._marklist[this._tab.selectedIndex].visible;
            else
              this._res["img_line"].visible = this._res["img_xianmian"].visible = false;
        }

       public onClose():void {
           super.onClose();
           this._page.close();
           g_signal.remove(this.onLocalSignal);
           playSound_qipai("close");
           this._tab.off(laya.events.Event.CHANGE,this,this.onTabChange);
       }
       protected onTabChange(evt?:laya.events.Event):void
       {          
           let index:number = this._tab.selectedIndex;
           this._currentGame = this._games[index];
           this.showGame();
       }
       protected showGame():void
       {
           this._page.close();
           this._page.setConfig(this._currentGame);
           this._page.show();
           this.updateBigSale();
       }


       public setNewGame(value:boolean)
       {
          if(this._res["newIcon_roomlist"])
             this._res["newIcon_roomlist"].visible = value;
       }

       public updateConsume(cur:number)
       {
         if(this._res["txt_xh"])
            this._res["txt_xh"].text = getDesByLan("每次消耗") + cur +GameVar.g_platformData.gold_name_zj;
       }
       
   }
}