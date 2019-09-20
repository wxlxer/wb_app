namespace qpq.hall
{
	export class RankUi extends gamelib.core.Ui_NetHandle
	{	
		protected _self_rank_icon:Laya.Image;
		protected _self_rank_txt:Laya.Label;

		private _list:Laya.List;
		protected _txt_money:Laya.Label;

		protected _data:Array<any> = null;

		constructor(url:string = "qpq/Art_Rank") 
		{
			super(url);
		}

		protected init():void
		{
			this.addBtnToListener("btn_shop2");

			this._self_rank_icon = this._res['img_rankIcon'];
			this._self_rank_txt = this._res['txt_rank'];
			this._txt_money = this._res['txt_diamond'];

			this._res['img_head'].skin = GameVar.playerHeadUrl;
			this._res['txt_name'].text = qpq.data.PlayerData.s_self.m_name_ex;
			this._res['txt_id'].text = "ID:" + GameVar.pid;
			this.initList();
			this._noticeOther = true;
		}
		protected initList():void
		{
			this._list = this._res['list_1'];
			this._list.renderHandler = Laya.Handler.create(this,this.updateItem,null,false);
			this._list.selectEnable = true;
			this._list.selectHandler = Laya.Handler.create(this,this.onSelecttList,null,false);
			this._list.dataSource = [];
		}
		public reciveNetMsg(msgId: number,data: any):void
		{
			if(msgId == 0x00D7)
			{
				this.pase0x00D7(data);
				this.update();
				g_uiMgr.closeMiniLoading();
			}
		}
		protected pase0x00D7(data:any):void
		{
			this._data = data.players;
			for(var i:number = 0; i < this._data.length; i++)
			{
				var obj:any = this._data[i];
				try{
					var name:string = utils.Base64.utf8to16(utils.Base64.base64decode(obj.name));
					// console.log(name);
					obj.name = name;
				}
				catch(e)
				{
					console.log("namenamenamename" + obj.name);
				}
				try{
					var sign:string = utils.Base64.utf8to16(utils.Base64.base64decode(obj.sign_name));
					sign = utils.StringUtility.Trim(sign);
					obj.sign = sign;
				}
				catch(e)
				{
					console.log("signsignsignsignsignsign" + obj.name + "   " + obj.sign_name);
				}
				
			}
		}
		protected onShow():void
		{
			super.onShow();
			g_uiMgr.showMiniLoading();
			sendNetMsg(0x00D7,1,0,50);			
			this._txt_money.text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
		}
		protected onClose():void
		{
			super.onClose();
		}
		protected update():void
		{
			this._list.dataSource = this._data;
			this.updateMyRank();
		}
		protected updateMyRank():void
		{
			var myOrder:number = -1;
			for(var i:number = 0; i < this._data.length; i++)
			{
				if(this._data[i].id == qpq.data.PlayerData.s_self.m_id)
				{
					myOrder = i + 1;
					break;
				}
			}

			if(myOrder == -1)
			{
				this._self_rank_icon.visible = false;
				this._self_rank_txt.visible = true;
				this._self_rank_txt.text = getDesByLan("未上榜");
			}
			else
			{
				if(myOrder <= 3)
				{
					this._self_rank_icon.visible = true;
					this._self_rank_icon.skin = "hall/rank_icon"+myOrder+".png";
					this._self_rank_txt.visible = false;
				}
				else
				{
					this._self_rank_icon.visible = false;
					this._self_rank_txt.visible = true;
					this._self_rank_txt.text = myOrder +"";
				}
			}
		}
		protected onSelecttList(index:number):void
		{
			if(index == -1)
				return;
			var temp:any = this._list.dataSource[index];
			g_signal.dispatch("showUserInfoUi",temp);
			this._list.selectedIndex = -1;

		}
		protected updateItem(box:Laya.Box,index:number):void
		{
			var obj:any = this._list.dataSource[index];
			var icon:Laya.Image = getChildByName(box,'img_rankIcon');
			var head:Laya.Image = getChildByName(box,'b_head.img_head');
			var name_txt:Laya.Label = getChildByName(box,'txt_2');
			var id_txt:Laya.Label = getChildByName(box,'txt_3');
			var value_txt:Laya.Label = getChildByName(box,'txt_4');
			var rank_txt:Laya.Label = getChildByName(box,'txt_1');

			if(index >= 3)
			{
				icon.visible = false;
				rank_txt.visible = true;
				rank_txt.text = (index + 1) +"";
			}
			else
			{
				icon.visible = true;
				rank_txt.visible = false;
				icon.skin = "hall/rank_icon"+(index + 1)+".png";
			}
			if(obj.headUrl)
				head.skin = obj.headUrl;
			else
				head.skin = "comp/icon_player.png";
			value_txt.text = obj.value +"";
			
			name_txt.text = utils.tools.getBanWord(obj.name);

			var sign:string = obj.sign;
			if(sign == "" || sign == null)
			{
				sign = getDesByLan("默认签名") + "...";//UserInfoUi1.getRandomSign();
				obj.sign = sign;
			}
			id_txt.text = utils.tools.getBanWord(sign);
		}

		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			g_uiMgr.openShop();
		}
	}
	export class RankUi_page extends gamelib.core.Ui_NetHandle
	{	
		private _page:gamelib.control.Page;
		private _lists:Array<Laya.UIComponent>;
		private _listBox:Laya.Box;

		protected _self_rank_icon:Laya.Image;
		protected _self_rank_txt:Laya.Label;

		protected _txt_money:Laya.Label;
		private _allDatas:Array<Array<any>>;
		private _numOfPage:number;
		private _totalNum:number;
		private _currentPage:number;
		constructor() 
		{
			super("qpq.ui.Art_RankUI");
		}
		protected init():void
		{
			this.addBtnToListener("btn_shop2");

			this._self_rank_icon = this._res['img_rankIcon'];
			this._self_rank_txt = this._res['txt_rank'];
			this._txt_money = this._res['txt_diamond'];

			this._res['img_head'].skin = GameVar.playerHeadUrl;
			this._res['txt_name'].text = qpq.data.PlayerData.s_self.m_name_ex;
			this._res['txt_id'].text = "ID:" + GameVar.pid;

			this.initList();
			this._allDatas = [];
		}

		protected initList():void
		{
			this._page = new gamelib.control.Page(this._res['btn_up'],this._res['btn_down'],this._res["txt_page"],Laya.Handler.create(this,this.onPageChange,null,false));
			this._numOfPage = 5;
			this._lists = [];
			for(var i:number = 0; i < this._numOfPage; i++)
			{
				this._lists.push(this._res['ui_list' + ( i + 1)]);
			}
			this._listBox = this._res['b_l'];
			this._listBox.visible = false;
		}

		private requestData(page:number):void
		{
			g_uiMgr.showMiniLoading();
			sendNetMsg(0x00D7,1,page * this._numOfPage,this._numOfPage);
			this._currentPage = page;
		}

		protected onShow():void
		{
			super.onShow();
			this.requestData(0);
			this._txt_money.text = utils.tools.getMoneyDes(qpq.data.PlayerData.s_self.getGold_num());
			for(var temp of this._lists)
			{
				temp.on(Laya.Event.CLICK,this,this.onClickItem);
			}
			this._page.show();
		}
		protected onClose():void
		{
			super.onClose();
			for(var temp of this._lists)
			{
				temp.on(Laya.Event.CLICK,this,this.onClickItem);
			}			
			this._page.close();
		}
		public reciveNetMsg(msgId:number,data:any):void
		{
			if(msgId != 0x00D7)
				return;
			g_uiMgr.closeMiniLoading();
			this._totalNum = data.totalNum;
			var totalPage:number = Math.ceil(this._totalNum / this._numOfPage);
			var page:number = data.offsize / this._numOfPage;
			this._listBox.visible = this._totalNum > 0;
            // this._allDatas[page] = data.players;
            this.showPage(page,data.players);
		}

		private showPage(page:number,arr:Array<any>):void
		{
			this.setDataSource(arr,page);    
            this._page.setPage(page,Math.ceil(this._totalNum / this._numOfPage));
		}

		private onPageChange(page:number):void
		{
			if(this._currentPage == page)
				return;
			this.requestData(page);
			// var arr:Array<any> = this._allDatas[page];
   //          if(arr == null)
   //          {
   //              this.requestData(page);
   //          }
   //          else
   //          {
   //              this.setDataSource(arr,page);    
   //          }
		}
		private setDataSource(arr:Array<any>,page:number):void
		{
			for(var i:number = 0; i < this._lists.length;i++)
			{
				var obj:any = arr[i];			
				if(obj == null)
				{
					this._lists[i].visible = false;
					continue;
				}
				obj.rank = page * this._numOfPage + i;
				this._lists[i].visible = true;
				this.updateItem1(this._lists[i],obj);
			}
		}
		protected onClickItem(evt:Laya.Event):void
		{
			var temp:any = evt.currentTarget;
			var data:any = temp['__data'];
			g_signal.dispatch("showUserInfoUi",data);
		}
		private updateItem1(box:Laya.UIComponent,obj:any):void
		{
			var index:number = obj.rank;
			var icon:Laya.Image = box['img_rankIcon'];
			var head:Laya.Image = box['img_head'];
			var name_txt:Laya.Label = box['txt_2'];
			var id_txt:Laya.Label = box['txt_3'];
			var value_txt:Laya.Label = box['txt_4'];
			var rank_txt:Laya.Label = box['txt_1'];
			box['__data'] = obj;

			if(index >= 3)
			{
				icon.visible = false;
				rank_txt.visible = true;
				rank_txt.text = (index + 1) +"";
			}
			else
			{
				icon.visible = true;
				rank_txt.visible = false;
				icon.skin = "hall/rank_icon"+(index + 1)+".png";
			}
			if(obj.headUrl)
				head.skin = obj.headUrl;
			else
				head.skin = "comp/icon_player.png";
			value_txt.text = obj.value +"";

			var name:string = decodeURIComponent(obj.name);
			obj.name = name;
			name_txt.text = utils.tools.getBanWord(name);
			var sign:string = decodeURIComponent(obj.sign_name);
			if(sign == "" || sign == null)
			{
				sign = getDesByLan("默认签名") + "...";//UserInfoUi1.getRandomSign();
			}
			obj.sign = sign;
			id_txt.text = utils.tools.getBanWord(sign);
		}

		protected onClickObjects(evt:laya.events.Event):void
		{
			playButtonSound();
			g_uiMgr.openShop();
		}
	}
}