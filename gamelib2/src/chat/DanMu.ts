module gamelib.chat
{
	/**
	 *@class DanMu
	 *
	 */
	export class DanMu
	{
		private _minY:number;
		private _maxY:number;

		private _list:Array<DanMuItem>;
		private _speed:number = 2.5;
		private _enable:boolean;

		private _height:number = 0;

		private _postions:Array<DanMuItem>;

		private _grap:number;
		public constructor() {
			this._list = [];
			this._postions = [];
			this._grap = g_gameMain.m_gameWidth - 100;
		}
		public initArea(minY:number,maxY:number):void
		{
			this._minY = minY;
			this._maxY = maxY;
		}
		public destroy():void
		{
			Laya.timer.clear(this,this.update);
			this._list.length = 0;
			
		}
		public set enable(value:boolean)
		{
			this._enable = value;
			if(!value)
			{
				this._postions.length = 0;
				Laya.timer.clear(this,this.update);
				for(var i:number =this._list.length-1; i >= 0 ;i--)
				{
					var label:Laya.Sprite = this._list[i];
					label.removeSelf();
				}
				this._list.length = 0;
			}
		}
		public onGetMsg(msg:string,isVip:boolean,isSelf:boolean):void
		{
			if(!this._enable)
				return;
			var ty = this.getY(0);
			if(ty >= 17)
				return;			
			var color:string = isVip ? "#fd4527":"#FFFFFF";
			var item:DanMuItem = new DanMuItem();
			item.createTextField(msg,color,isSelf);	
			this.addItem(item,ty);			
		}
		public onGetMsgByUser(user:gamelib.data.UserInfo,msg:string):void
		{
			if(!this._enable)
				return;
			var ty = this.getY(0);
			if(ty >= 17)
				return;
			console.log(ty);
			var item:DanMuItem = new DanMuItem();
			item.createByUser(msg,user);	
			this.addItem(item,ty);			
		}
		private addItem(item:DanMuItem,yIndex:number):void
		{
			this._height = item.height;
			item.x = Laya.stage.width;
			item.y = this._minY + yIndex * this._height;
			var tl:DanMuItem = this._postions[yIndex];
			if(tl != null && tl != undefined)
			{
				tl.m_index = - 1;
			}
			item.m_index = yIndex;
            this._postions[yIndex] = item;
            g_layerMgr.addChild(item);
			if(this._list.length == 0)
			{
				Laya.timer.frameLoop(1,this,this.update);
			}
			this._list.push(item);
		}

		private getY(index:number):number
		{
			var txt:Laya.Sprite = this._postions[index];
			if(txt == null)
				return index;
			if(txt.x + txt.width > this._grap)
				return this.getY(index + 1);
			return index;
		}
		private update(dt:number):boolean
		{
			for(var i:number = this._list.length-1; i >= 0 ;i--)
			{
				var label:DanMuItem = this._list[i];
				label.x -= this._speed;
				if(label.x <= - label.width)
				{
					this._list.splice(i,1);
					label.removeSelf();
					var index:number = label.m_index;
					if(index != -1 && !isNaN(index))
						this._postions[index] = null;
				}
			}
			if(this._list.length == 0)
			{
				Laya.timer.clear(this,this.update);
			}
			return false;
		}
	}
	export class DanMuItem extends Laya.Sprite
	{
		private _msg:Laya.Sprite | Laya.Text;
		private _bg:Laya.Image;
		public m_index:number;
		private _zOrders:{bg:number,head:number,head_bg:number,vip:number,msg:number};
		public constructor()
		{
			super();
			this._zOrders = {
				"bg":0,
				"head":1,
				"head_bg":2,
				"vip":3,
				"msg":4
			}
		}
		public createTextField(msg:string,color:string,isBorder:boolean = false):Laya.Text
		{
			//创建 TextField 对象
			var label:Laya.Text = new Laya.Text();
			if(isBorder)
			{
				////设置边框颜色
				label.borderColor = "#00ff00";	
			}
			label.stroke  = 1;
			label.strokeColor = "#000000";
			//设置字体
			label.font = "Arial";
			//设置文本颜色
			label.color = color;
			//设置字号
			label.fontSize = 34;
			//设置显示文本
			label.text = msg;
			label.wordWrap = false;
			label.mouseEnabled = false;
			this._msg = label;
			this.addChild(this._msg);
			return label;
		}
		public get width():number
		{
			if(this._bg != null)
				return this._bg.width;
			return this._msg.width;
		}
		public get height():number
		{
			if(this._bg != null)
				return this._bg.height;
			return this._msg.height;
		}
		public destroy():void
		{

		}
		/**
		 * vip:有背景、头像框背景、头像、vip图标
		 * 非vis:头像，
		 * @function
		 * @DateTime 2018-08-28T11:06:45+0800
		 * @param    {string}                 msg  [description]
		 * @param    {gamelib.data.UserInfo}  user [description]
		 */
		public createByUser(msg:string,user:gamelib.data.UserInfo):void
		{	
			var color:string;
			var url:string;
			var head_url:string;
			
			if(user.vipLevel <= 3)
			{
				url = "danmu/vipBg1.png";
				head_url = "danmu/vipKuang1.png";
			}
			else if(user.vipLevel <= 7)
			{
				url = "danmu/vipBg2.png";	
				head_url = "danmu/vipKuang2.png";
			}
			else
			{
				url = "danmu/vipBg3.png";
				head_url = "danmu/vipKuang3.png";
			}
			if(user.vipLevel >= 8)
			{
				color = "#ffe553";
			}
			else
			{
				color = "#fbfafa";
			}

			this._msg = this.buildMsg(user.m_name + ":" + msg,color);
			this.addChild(this._msg);

			var head:Laya.Image = new Laya.Image();
			head.skin = user.m_headUrl;
			head.width = head.height = 42;
			head.zOrder = this._zOrders.head;
			this.addChild(head);
			this._msg.x = 46;
			this._msg.y = (head.height - this._msg.height) / 2;

			if(user.vipLevel == 0)
			{
				return;
			}

			var bg:Laya.Image = new Laya.Image();
			bg.skin = url;
			bg.sizeGrid = "3,13,4,11";
			this.addChildAt(bg,0);
			bg.zOrder = this._zOrders.bg;
			this._bg = bg;

			var head_bg:Laya.Image = new Laya.Image();
			head_bg.skin = head_url;
			head_bg.width = head_bg.height = 50;
			head_bg.y = -4;
			head_bg.zOrder = this._zOrders.head_bg;
			this.addChild(head_bg);
			
			var vipIcon:Laya.Image = new Laya.Image();
			var vipIconUrl:string = window['qpq']['getVipIcon'](user.vipLevel,true);
			vipIcon.skin = vipIconUrl;
			vipIcon.width = vipIcon.height = 30;
			vipIcon.x = 30;
			vipIcon.y = 19;
			this.addChild(vipIcon);
			vipIcon.zOrder = this._zOrders.vip;
			
			bg.width = this._msg.width + head_bg.width;
			this.cacheAs = "bitmap";
		}

		private buildMsg(msg:string,color:string):Laya.Sprite
		{
			var spr:Laya.Sprite = new Laya.Sprite();
			spr.zOrder = this._zOrders.msg;
			var arr:Array<any> = parseMsg(msg);
			var ox:number = 0;
			var size:number = 24;
			for(var i:number = 0; i < arr.length ;i++)
			{
				var m:any = arr[i];
				if(typeof m == "string")
				{
					var label:Laya.Text = new Laya.Text();
					label.font = "Arial";	
					label.fontSize = size;
					label.text = m;					
					label.wordWrap = false;
					label.mouseEnabled = false;
					label.color = color;
					label.x = ox;
					ox += label.width;
					spr.addChild(label);
				}
				else if(typeof m == "number")
				{
					var classObj:any = gamelib.getDefinitionByName(GameVar.s_namespace + ".ui.face.Art_face_" + (m+1) +"UI");
					if(classObj == null)
						continue;
           			var face = new classObj();
           			face.x = ox;
           			face.y = (size - face.height) / 2;
           			if(face.ani1)
           				face.ani1.play(0,false);
           			ox += face.width;
           			spr.addChild(face);
				}
			}
			spr.width = ox;
			spr.height = size;
			return spr;
		}

	}
}
