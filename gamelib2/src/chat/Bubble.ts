namespace gamelib.chat
{
	export class Bubble
	{		
		private _bg:Laya.Image;
		private _align:string;
		private _boder:number;
		private _spr:Laya.Sprite;
		private _color:string;
		private _res:any;

		private _oldY:number;
		private _timeLine:Laya.TimeLine;
		constructor(res) 
		{
			this._bg = res['img_bg'];
			if(this._bg == null)
				this._bg = res.getChildAt(0);
			var txt:Laya.Label = res['txt_txt'];
			this._color = txt.color;
			txt.removeSelf();
			if(!isNaN(txt.left))
			{
				this._align = 'left';
				this._boder = txt.left;
			}
			else if(!isNaN(txt.right))
			{
				this._align = 'right';
				this._boder = txt.right;
			}		
			this._spr = new Laya.Sprite();
			res.addChild(this._spr);
			this._oldY = res.y;
			this._res = res;
			this._res.visible = false;

		}
		public destroy():void
		{
			if(this._timeLine)
			{
				this._timeLine.destroy();
			}
			this._timeLine = null;
		}
		public setMsg(netData:any):void
		{
			var msg:string = netData.msg;
			if(netData.type == 4)
			{
				var index:number = parseInt(msg);
				var obj:any = gamelib.chat.ChatPanel.s_instance.getQuickTalkByIndex(index);
				if(typeof obj == "object")
				{
					msg = obj.msg;
				}
				else
				{
					msg = obj;
				}
			}
			this.clearSpr();
			this._res.y = this._oldY;
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
					label.color = this._color;
					label.x = ox;
					ox += label.width;
					this._spr.addChild(label);
				}
				else if(typeof m == "number")
				{
           			var face = this.getFaceRes(m+1);
           			if(face == null)
           				continue;
           			face.x = ox;
           			face.y = (size - face.height) / 2;
           			if(face.ani1)
           				face.ani1.play(0,false);
           			ox += face.width;
           			this._spr.addChild(face);
				}
			}
			this._res.width = ox + 2 * this._boder;
			this._spr.width = ox;
			this._spr.height = size;

			// if(this._align == "left")
			// 	this._spr.x = this._boder;
			// else
			// 	this._spr.x = this._bg.width - this._spr.width - this._boder;
			// 	
			this._spr.x = this._boder;			
			this._spr.y = (this._bg.height - this._spr.height) / 2;
			var timeLine:Laya.TimeLine = new Laya.TimeLine();
            timeLine.addLabel("show",0).to(this._res,{y:this._oldY,alpha:1},400,null,0);
            timeLine.addLabel("close",0).to(this._res,{y:this._oldY - 100,alpha:0},400,null,3000);
            timeLine.play(0,false);
            timeLine.once(laya.events.Event.COMPLETE,this,this.onShowEnd,[timeLine]);
            this._res.visible = true;
            this._timeLine = timeLine;
		}
		 private getFaceRes(id:number):any
        {
            var url:string = "qpq/face/Art_face_" + (id+1);        
            var face = utils.tools.createSceneByViewObj(url);           
            face.zOrder = 10;
            return face;
        }
		private onShowEnd(timeLine:Laya.TimeLine):void
		{
			timeLine.destroy();
			this._res.y = this._oldY;
			this._res.visible = false;
			this._timeLine = null;
		}
		private clearSpr():void
		{
			while(this._spr.numChildren)
			{
				var temp:any = this._spr.removeChildAt(0);
				if(temp.ani1)
				{
					temp.ani1.stop();
				}
			}

		}
	}
}