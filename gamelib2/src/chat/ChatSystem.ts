namespace gamelib.chat
{
	export var s_face_alias:string = "abcdefghijklmnopq";
	export function parseMsg(msg:string):Array<any>
	{
		var arr:Array<any> = [];
		var index:number = 0;
		var str:string = "";
		while(index <= msg.length)
		{
			var s:string = msg.charAt(index++);
			if(s == "/")
			{
				var s1:string = msg.charAt(index++);
				var i = s_face_alias.indexOf(s1);
				if(i == -1)
				{
					str += s;
				}
				else
				{
					if(str.length > 0)
						arr.push(str)
					str = "";
					arr.push(i);
				}
			}
			else
			{
				str += s;
			}
		}
		arr.push(str);
		return arr;
	}

	export function getQuickTalkByIndex(index:number):{msg:string,sound:string,checkSex:boolean}
	{
		var quick_talk: any = GameVar.g_platformData['quick_talk'];
		var arr:Array<any>;
        if(quick_talk != null)
        {
        	if(quick_talk instanceof Array)
            {
                arr = GameVar.g_platformData["quick_talk"]
            }
            else
            {
                arr = quick_talk[GameVar.gz_id];
                if(arr == null)
                    arr = quick_talk["default"];
            }
            
        	var obj:any = arr[index];
        	if(typeof obj == "string")
        	{
        		return {msg:obj,sound:'',checkSex:false};
        	}
        	return obj;
        }
        return null;
	}
	export class ChatSystem_BR implements gamelib.core.INet
	{
		private _res:any;

		private _input:Input;
		public priority:number;        
		private _danmu:DanMu;
		private _danmuToggle:Laya.CheckBox;
		public constructor(res:any)
		{
			this._res = res;
			this._input = new Input(res);
			this._danmu = new DanMu();
			this._danmuToggle = res.checkBox_danmu;

			//默认打开
			this._danmu.enable = true;
			this._danmuToggle.selected = false;
		}
		public get danMu():DanMu
		{
			return this._danmu;
		}
		public show():void
		{
			this._input.show();	
			if(this._danmuToggle)
				this._danmuToggle.on(Laya.Event.CHANGE,this,this.onDanMuToggle);
			g_net.addListener(this);
		}
		public close():void
		{
			this._input.close();
			if(this._danmuToggle)
				this._danmuToggle.off(Laya.Event.CHANGE,this,this.onDanMuToggle);
			g_net.removeListener(this);
		}
		public reciveNetMsg(msgId:number,data:any):void
        {
        	switch(msgId)
        	{
        		case 0x0074:
        			if (data.type == 1)
                    {
                        if(data.sendId == 0)    //系统公告
                            g_uiMgr.showPMD("["+getDesByLan("系统") + "]" + ":" + data.msg);
                        else    //喇叭
                            g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭")+ " [" + data.sendName+ "]:" + data.msg);
                        return;
                    }                    
                    var pd = gamelib.core.getPlayerData(data.sendId);
                    if(pd == null)
                        return;
                    var str:string = data.msg;
                    if(data.type == 4)
                    {
	                    var index:number = parseInt(data.msg);
	                    var hz:string = pd.m_sex  == 1 ? "_m" :"_w";                    
	                    var temp:any = getQuickTalkByIndex(index);
	                    if(temp != null)
	                    {
	                    	str = temp.msg;
	                    	if(temp.sound)
	                        {
	                        	str = temp.msg;
	                            if(temp.checkSex)
	                                playSound_qipai(temp.sound + hz);
	                            else
	                                playSound_qipai(temp.sound);
	                        }
	                    }
                    }
                    this._danmu.onGetMsgByUser(pd,str);
                    
                    // var str:string = gamelib.chat.ChatPanel.s_instance.onData0x0074(pd,data);
                    // gamelib.chat.ChatBubble.s_instance.showMsg(pd.m_seat_local,str);  
        			break;
        	}
        }

		public destroy():void
		{
			this.close();
			this._input.destroy();
			this._res = null;
		}
		public setBubbles(arr:Array<Laya.Component>):void
		{

		}
		private onDanMuToggle():void
		{
			this._danmu.enable = !this._danmuToggle.selected;
		}
	}
}