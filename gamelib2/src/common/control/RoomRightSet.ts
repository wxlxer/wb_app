namespace gamelib.control
{
	/**
	 * 牌桌右侧公共面板
	 * @class RoomRightSet
	 */
	export class RoomRightSet
	{
		private _style:any;
		private _panel:laya.ui.Box;
		private _clip:laya.ui.Clip;
		private _help:laya.ui.Button;
		private _posList:Array<number>;
		private _sub_btns:Array<Laya.Button>;
		private _checkFz:boolean;//解散的时候是否检测是房主
		/**
		 * [constructor description]
		 * @param {any}        res [description]
		 * @param {boolean}    [checkFz= true]   解散的时候是否检测是房主。五子棋不需要检测
		 */
		constructor(res:any,checkFz:boolean = true) 
		{
			if(res['b_function'])
			{
				this._style = new RoomRightSetStyle1(res,checkFz);

			}
			else
			{
				this._style = new RoomRightSetStyle2(res,checkFz);
			}
			g_signal.add(this.onLocalMsg,this)
		}
		public show():void
		{		
			this._style.show();

		}
		public close():void
		{
			this._style.close();
		}

		public destroy():void
		{
			g_signal.remove(this.onLocalMsg,this)
			this._style.destroy();
			this._style = null;
		}
		private onLocalMsg(msg:string,data:any):void
		{
			if(msg == "initCircleData")
			{
				this._style.update();
			}
		}
	}
	export class RoomRightSetStyle1
	{
		private _panel:laya.ui.Box;
		private _clip:laya.ui.Clip;
		private _help:laya.ui.Button;
		private _click_list:Array<laya.ui.UIComponent>;
		private _posList:Array<number>;
		private _sub_btns:Array<Laya.Button>;
		private _checkFz:boolean;//解散的时候是否检测是房主
		constructor(res:any,checkFz:boolean = true)
		{this._checkFz = checkFz;
			this._panel = res['b_function'];
			this._panel.parent["mouseThrough"] = true;
			this._panel.visible = false;
			this._clip = res['clip_back'];

			var arr:Array<string> = [];
			arr.push('btn_rule');
			arr.push('clip_back');
			arr.push('btn_set');
			arr.push('btn_record');
			arr.push('btn_deskInfo');
			arr.push('btn_jiesan');
			arr.push('btn_shop');

			this._click_list = [];
			for(var str of arr)
			{
				var temp = res[str];
				if(temp == null)
				{
					continue;
				}
				temp.name = str;
				this._click_list.push(temp);
			}
			this._sub_btns = [];
			if(res['btn_set'])
				this._sub_btns.push(res['btn_set']);
			if(res['btn_deskInfo'])
				this._sub_btns.push(res['btn_deskInfo']);
			if(res['btn_record'])
				this._sub_btns.push(res['btn_record']);
			if(res['btn_jiesan'])
				this._sub_btns.push(res['btn_jiesan']);

			this._posList = [];
			for(var i:number = 0; i < this._sub_btns.length ;i++)
			{
				this._posList.push(this._sub_btns[i].y);
			}
			this._posList.sort();
		}

		public update():void
		{

		}

		public show():void
		{			
			for(var temp of this._click_list)
			{
				temp.on(Laya.Event.CLICK,this,this.onClick);	
			}
			//
			this.setPanelVisible(false);			
		}
		public close():void
		{
            for(var temp of this._click_list)
			{
				temp.off(Laya.Event.CLICK,this,this.onClick);
			}			
		}

		public destroy():void
		{
			if(this._click_list == null)
				return;
			this.close();
			this._click_list.length = 0;
			this._click_list = null;
		}
		private setPanelVisible(value:boolean):void
		{
			this._panel.visible = value;
			if(value)
			{
				this._clip.index = 0;
				Laya.stage.on(Laya.Event.CLICK,this,this.onClickStage);
				
				for(var temp of this._click_list)
				{
					if(temp.name == "btn_record" || temp.name == "btn_deskInfo")
					{
						if(GameVar.circleData.isGoldScoreModle() || !utils.tools.isQpq())
							temp.removeSelf();
					}
					if(temp.name == "btn_jiesan")			
					{
						if(!utils.tools.isQpq())
							temp.removeSelf();
					}
				}
				var index:number = 0;
				for(var btn of this._sub_btns)
				{
					if(btn.parent)
						btn.y = this._posList[index++];
				}
			}
			else
			{
				this._clip.index = 1;
				Laya.stage.off(Laya.Event.CLICK,this,this.onClickStage);
			}
		}
		private onClickStage(evt?:laya.events.Event):void
		{
			this.setPanelVisible(!this._panel.visible)			
		}

		private onClick(evt:laya.events.Event):void
		{
			evt.stopPropagation();
			playButtonSound();
			switch (evt.currentTarget.name) {
				case "btn_rule":
					g_signal.dispatch('showRuleUi',0);
					break;
				case "clip_back"	:
					this.onClickStage();
					break;
				case "btn_set":
					g_signal.dispatch('showSetUi',0);
					break;
				case "btn_record":
					g_signal.dispatch('showShangJuUi',0);
					break;
				case "btn_deskInfo":
					g_signal.dispatch('showDeskInfoUi',0);
					break;
				case "btn_jiesan":					
					g_qpqCommon.doJieSan(this._checkFz);						
					break;
				case "btn_shop":
					g_uiMgr.openShop();
					break;
				default:
					// code...
					break;
			}
		}
	}
	export class RoomRightSetStyle2
	{
		private _btnList:Array<any>;
		private _box:Laya.HBox
		private _checkFz:boolean;
		private _res:any;
		constructor(res:any,checkFz:boolean = true)
		{
			this._res = res;
			this._checkFz = checkFz;
			this._btnList = [];
			this._box = res['b_gongneng'];
			var arr:Array<string> = [];
			arr.push('btn_rule');
			arr.push('btn_set');
			arr.push('btn_shop');
			if(res['btn_jiesan'])
			{
				arr.push('btn_jiesan');
				if(GameVar.game_code.indexOf("wzq_") == -1)		//多玩五子棋可以解散
				{
					res['btn_jiesan'].removeSelf();
				}	
			}
			if(utils.tools.isMatch())
			{

			}
			else
			{
				if(!utils.tools.isQpq())
				{
					if(res['btn_rule'])
						res['btn_rule'].removeSelf();
				}	
			}
			

			for(var key of arr)
			{
				var btn:Laya.Button = res[key];
				if(btn == null)
					continue;
				btn.name = key;
				this._btnList.push(btn);
			}
			if(res['btn_shop'])
			{
				if(GameVar.g_platformData['hideShopInRoom'])
				{
					res['btn_shop'].removeSelf();
				}
			}
		}
		public update():void
		{
			if(utils.tools.isMatch())
			{
				return;
			}
			if(!utils.tools.isQpq())
			{
				if(this._res['btn_rule'])
					this._res['btn_rule'].removeSelf();
			}
			if(GameVar.circleData.isGoldScoreModle())
			{
				if(this._res['btn_rule'])
				{
					if(GameVar.g_platformData['showHelpInGoldMode'])
					{

					}	
					else
					{
						this._res['btn_rule'].removeSelf();
					}
				}	
			}
		}
		public show():void
		{
			for(var btn of this._btnList)
			{
				btn.on(Laya.Event.CLICK,this,this.onClickBtn);
			}
		}
		public close():void
		{
			for(var btn of this._btnList)
			{
				btn.off(Laya.Event.CLICK,this,this.onClickBtn);
			}
		}
		public destroy():void
		{
			this.close();
			this._res = null;
			this._btnList.length = 0;
			this._btnList = null;
		}
		private onClickBtn(evt:Laya.Event):void
		{
			playButtonSound();
			switch (evt.currentTarget.name)
			{
				case "btn_set":
					g_signal.dispatch('showSetUi',0);
					break;
				case "btn_rule":
					if(GameVar.circleData.isGoldScoreModle())
					{
						var index:number = 0;
						var helpInfo:any = GameVar.g_platformData['helpInfo'];
						if(helpInfo)
						{
							var name:string = GameVar.game_code.split('_')[0];
							index = helpInfo[name];
						}
						g_signal.dispatch('showHelpUi',index);	
					}
					else
					{
						g_signal.dispatch('showRuleUi',0);	
					}					
					break;
				case "btn_jiesan":
					// if(GameVar.circleData.isGoldScoreModle())
					// {
					// 	g_childGame.toCircle();
					// }
					// else
					{
						g_qpqCommon.doJieSan(this._checkFz);	
					}
					break;		
				case "btn_shop":
					g_uiMgr.openShop();
					break;
				default:
					// code...
					break;
			}
		}
	}

}