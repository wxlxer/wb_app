namespace gamelib.chat
{
	export class Input
	{
		private _faceG:Laya.Image;
		private _quickG:Laya.Image;

		private _faceList:Laya.List;
		private _quickTalkList:Laya.List;
		private _quickTalkIndex:number = -1;
		private _faceBtn:Laya.Button;
		private _quickTalkBtn:Laya.CheckBox;
		private _sendBtn:Laya.Button;
		private _input_txt:Laya.TextInput;

		private _cd:number = 5000;
		private _lastSendTime:number = 0;
		public constructor(res:any)
		{
			this._faceList = res['list_face'];
			this._quickTalkList = res['list_talk'];
			this._faceG = res['bg_face'];
			this._quickG = res['bg_talk'];

			this._faceBtn = res['btn_face'];
			this._sendBtn = res['btn_send'];
			this._input_txt = res['txt_input'];
			this._quickTalkBtn = res['checkBox_chat'];

			this._faceList.selectEnable = true;
			this._quickTalkList.selectEnable = true;
			this._faceList.selectHandler = Laya.Handler.create(this,this.onFaceSelected,null,false);
			this._quickTalkList.selectHandler = Laya.Handler.create(this,this.onQuickSelected,null,false);
			this._faceList.renderHandler = Laya.Handler.create(this,this.onFaceRender,null,false);
			this._quickTalkList.renderHandler = Laya.Handler.create(this,this.onQuickRender,null,false);
			var arr:Array<any> = [];
			for(var i:number = 1; i <= 17; i++)
			{
				var obj:any = {};
				obj.skin = "face/btn_face_"+i+".png";
				obj.alias = "/" + s_face_alias.charAt(i - 1);
				arr.push(obj);
			}
			this._faceList.dataSource = arr;

			var arr1:Array<string>;
            if(GameVar.g_platformData["quick_talk"])
            {
                var temp = GameVar.g_platformData["quick_talk"];
                if(temp instanceof Array)
                {
                    arr1 = GameVar.g_platformData["quick_talk"]
                }
                else
                {
                    arr1 = temp[GameVar.gz_id];
                    if(arr1 == null)
                        arr1 = temp["default"];
                }
            }
            else
            {
                arr1 = [];
                arr1.push("哎呀，又冲动了", "全押了，你敢跟吗!");
                arr1.push("今天就凭这把翻身了", "小意思，来把大的！", "朋友，玩的不赖呀", "无敌真是寂寞啊");
                arr1.push("催什么催我在想下什么好", "好多钱啊！", "不要羡慕我哦");
            }
            this._quickTalkList.dataSource = arr1;
            this._faceG.visible = this._quickG.visible = false;
            this._quickTalkBtn.selected = this._quickG.visible;
            this._input_txt.maxChars = 30;
            this._input_txt.text = "";
		}
		public destroy():void
		{
			this.close();
			this._quickTalkList = null;
			this._quickG = null;
			this._quickTalkBtn = null;
			this._faceG = null;
			this._faceBtn = null;
			this._faceList = null;
			this._input_txt = null;
		}
		public show():void
		{
			this._quickTalkBtn.on(Laya.Event.CLICK,this,this.onClickQuickBtn);
			this._faceBtn.on(Laya.Event.CLICK,this,this.onClickFaceBtn);
			this._sendBtn.on(Laya.Event.CLICK,this,this.onClickSendBtn);
			Laya.stage.on(Laya.Event.CLICK,this,this.onClickStage);
			this._input_txt.on(Laya.Event.INPUT,this,this.onTextInput);
		}
		public close():void
		{
			this._quickTalkBtn.off(Laya.Event.CLICK,this,this.onClickQuickBtn);
			this._faceBtn.off(Laya.Event.CLICK,this,this.onClickFaceBtn);
			this._sendBtn.off(Laya.Event.CLICK,this,this.onClickSendBtn);
			Laya.stage.off(Laya.Event.CLICK,this,this.onClickStage);
			this._input_txt.off(Laya.Event.INPUT,this,this.onTextInput);
		}
		private onTextInput(evt:Laya.Event):void
		{
			this._quickTalkIndex = -1;
			for(var i = 0; i < this._quickTalkList.dataSource.length; i++)
			{
				var obj:any = this._quickTalkList.dataSource[i];
				var msg:string = "";
				if(typeof obj == "string")
				{
					msg = obj;
				}
				else
				{
					msg = obj.msg;
				}
				if(msg == this._input_txt.text)
				{
					this._quickTalkIndex = i;
					return;
				}
			}
		}
		private onFaceRender(box:Laya.Box,index:number):void
		{
			var btn:Laya.Button = <Laya.Button>box.getChildAt(0);
			btn.skin = this._faceList.dataSource[index].skin;
		}
		private onQuickRender(cell:Laya.Box,index:number):void
		{
			var txt:laya.ui.Label = getChildByName(cell,'txt_txt');
            var obj:any = this._quickTalkList.dataSource[index];
            if(typeof obj == "string")
            {
                txt.text = obj;    
            }
            else
            {
                txt.text = obj.msg;    
            }
		}
		//选择表情
		private onFaceSelected(index:number):void
		{
			if(this._faceList.selectedIndex == -1)
				return;
			var obj:any = this._faceList.dataSource[this._faceList.selectedIndex];
			this._input_txt.text += obj.alias;
			this._faceList.selectedIndex = -1;
		}	
		//选择快捷聊天
		private onQuickSelected(index:number):void
		{
			if(this._quickTalkList.selectedIndex == -1)
				return;
			this._quickTalkIndex = this._quickTalkList.selectedIndex;
			var obj:any = this._quickTalkList.dataSource[this._quickTalkList.selectedIndex];			
			var str:string = "";
			if(typeof obj == "string")
            {
                str = obj;    
            }
            else
            {
                str = obj.msg;    
            }
            if(this.checkCD())
            {
            	sendNetMsg(0x0074,4,0,"",this._quickTalkList.selectedIndex +"");	            	
            }
            else
			{
				g_uiMgr.showTip(getDesByLan("请稍后再发送"),true);
			}		
            this._quickTalkIndex = -1;
            this._quickTalkList.selectedIndex = -1;
		}
		
		private onClickQuickBtn(evt:Laya.Event):void
		{
			evt.stopPropagation();
			this._quickG.visible = !this._quickG.visible;
			this._quickTalkBtn.selected = this._quickG.visible;
		}

		private onClickFaceBtn(evt:Laya.Event):void
		{
			evt.stopPropagation();
			this._faceG.visible = !this._faceG.visible;
		}
		private onClickSendBtn(evt:Laya.Event):void
		{
			evt.stopPropagation();	
			if(this._input_txt.text == "")		
				return;
			if(this.checkCD())
			{
				if(this._quickTalkIndex >= 0)
				{
					sendNetMsg(0x0074,4,0,"",this._quickTalkIndex +"");	
				}
				else
				{
					sendNetMsg(0x0074,2,0,"",this._input_txt.text +"");	
				}
				
				this._lastSendTime = Laya.timer.currTimer;
				this._input_txt.text = "";	
				this._quickTalkIndex = -1;
			}
			else
			{
				g_uiMgr.showTip(getDesByLan("请稍后再发送"),true);
			}			
		}
		private checkCD():boolean
		{
			return Laya.timer.currTimer - this._lastSendTime > this._cd;			
		}
		private onClickStage(evt:Laya.Event):void
		{
			if(evt.target == this._faceList || evt.target.parent == this._faceList)
				return;
			this._faceG.visible = this._quickG.visible = false;
		}
	}
}