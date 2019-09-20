// namespace gamelib.firend
// {
// 	export class FirendUi extends gamelib.core.Ui_NetHandle
// 	{
// 		private _list:laya.ui.List;
// 		private _ts_list:laya.ui.List;
// 		private _tab:laya.ui.Tab;
// 		private _tip_new:laya.ui.Image;
// 		private _list_view:laya.ui.Box;		//好友列表
// 		private _add_view:laya.ui.Box;		//添加列表
// 		private _sq_view:laya.ui.Box;		//申请列表

// 		constructor()
// 		{
// 			super(GameVar.s_namespace + ".ui.Art_FrindsUI");
// 		}

// 		protected init():void
// 		{
// 			this._tab = this._res["tab_1"];
// 			this._list = this._res['list_1'];
// 			this._list_view = this._res["b_1"];
// 			this._add_view = this._res["b_2"];
// 			this._sq_view = this._res["b_1"];
// 			this._list_view.visible = this._add_view.visible = true;

// 			this._list.renderHandler = new laya.utils.Handler(this, this.onItemUpdate);
// 			this.addBtnToListener("btn_refresh");
// 			this.addBtnToListener("btn_apply");
// 		}
// 		public reciveNetMsg(msgId: number,data: any):void
// 		{
// 			switch (msgId) {
// 				case 0x2041:
// 					this.updateFirendList();
// 					break;				
// 				default:
// 					// code...
// 					break;
// 			}
// 		}
// 		protected onShow():void
// 		{
// 			super.onShow();

// 			this._tab.selectedIndex = 0;
// 			this._tab.on(laya.events.Event.CHANGE,this,this.onTabChange);
// 			this.showListView();

// 			if(gamelib.data.FirendData.s_list.values.length == 0)
// 			{
// 				sendNetMsg(0x2041);	
// 			}
// 			this.updateFirendList();
			
// 		}
// 		protected onClickObjects(evt:laya.events.Event):void
// 		{
// 			switch (evt.currentTarget.name)
// 			{
// 				case "btn_refresh":
// 					sendNetMsg(0x2041);
// 					evt.currentTarget.mouseEnabled = false;
// 					Laya.timer.once(5000,this,function()
// 					{
// 						evt.currentTarget.mouseEnabled = true;
// 					})
// 					break;
// 				case "btn_apply":
					
// 					break;
// 				default:
// 					// code...
// 					break;
// 			}
// 		}

// 		private showListView():void
// 		{
// 			this._add_view.visible = false;
// 			this._sq_view.visible = false;
// 			this._list_view.visible = true;
// 		}
// 		private updateFirendList():void
// 		{
// 			this._list.dataSource = gamelib.data.FirendData.s_list.values;
// 			this._res["txt_frinds"].text = this._list.dataSource.length + "/50";
// 		}
// 		private showAddView():void
// 		{
// 			this._list_view.visible = false;			
// 			this._sq_view.visible = false;
// 			this._add_view.visible = true;

// 			this._res['img_head'].skin = GameVar.playerHeadUrl;			
// 			this._res['txt_id'].text = "PID:" + GameVar.pid;
// 			this._res['txt_name'].text = "PID:" + GameVar.nickName;
			

// 		}
// 		private showSqView():void
// 		{
// 			this._list_view.visible = false;			
// 			this._add_view.visible = false;
// 			this._sq_view.visible = true;
// 		}
// 		private onTabChange(ev?:laya.events.Event):void
// 		{
// 			switch (this._tab.selectedIndex) {
// 				case 0:
// 					this.showListView()	;
// 					break;
// 				case 1:
// 					this.showAddView();
// 					break;	
// 				case 2:
// 					this.showSqView();
// 					break;	
				
// 				default:
// 					// code...
// 					break;
// 			}
// 		}
// 		private onItemUpdate(box:laya.ui.Box,index:number):void
// 		{
// 			var fd:gamelib.data.FirendData = this._list.dataSource[index];

// 			var head:Laya.Image = getChildByName(box,'');
// 			head.skin = fd.m_headUrl;

// 			getChildByName(box,"txt_1").text = fd.m_pId +"";
// 			getChildByName(box,"txt_2").text = fd.m_name +"";
// 			getChildByName(box,"txt_3").text = fd.m_statue +"";

// 			var yaoqing_btn:laya.ui.Button = getChildByName(box,'btn_1');
// 			var del_btn:laya.ui.Button = getChildByName(box,'btn_2');

// 			yaoqing_btn.offAll();
// 			del_btn.offAll();

// 			yaoqing_btn.on('click',this,function(evt)
// 			{
// 				//邀请组队
// 			});
// 			del_btn.on('click',this,function(evt)
// 			{
// 				//删除
// 				g_uiMgr.showAlertUiByArgs({msg:"确定要删除"+fd.m_name+"吗?",callBack:function(type)
// 				{
// 					if(type == 0)
// 					{
// 						sendNetMsg(0x2043,4,fd.m_pId);
// 					}
// 				}})
// 			});

// 		}


// 	}
// }