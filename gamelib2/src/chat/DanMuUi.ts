namespace gamelib.chat
{
	export class DanMuUi implements gamelib.core.INet
	{		
		private _danmu:DanMu;
		private _danmuToggle:Laya.CheckBox;
		public priority:number;      
		private _pmd:gamelib.alert.Pmd;
		constructor(cb:Laya.CheckBox,pmdRes:any) {
			this._danmu = new DanMu();
			this._danmuToggle = cb;
			this._danmu.enable = true;
			this._danmuToggle.selected = false;
			this._danmu.initArea(100,600);
			this._danmuToggle.on(Laya.Event.CHANGE,this,this.onDanMuToggle);
			if(pmdRes)
			{
				this._pmd = new gamelib.alert.Pmd();
				this._pmd.setRes(pmdRes);
			}
			g_net.addListener(this);
		}
		public set enabled(value:boolean)
		{
			this._danmu.enable = value;
			this._danmuToggle.selected = !value;
		}
		public addPmd(msg:string):void
		{
			if(this._pmd)
			{
				this._pmd.add(msg);
			}
		}
		public destroy():void
		{
			if(this._danmuToggle)
				this._danmuToggle.off(Laya.Event.CHANGE,this,this.onDanMuToggle);
			if(this._pmd)
			{
				this._pmd.destroy();
			}
			g_net.removeListener(this);
		}
		private onDanMuToggle():void
		{
			this._danmu.enable = !this._danmuToggle.selected;
		}

		public reciveNetMsg(msgId:number,data:any):void
        {
        	switch(msgId)
        	{
        		case 0x002F:
        			if(data.type == 1)
        			{
        				if(this._pmd)
        					this._pmd.add(getDesByLan("系统") +":" + data.msg);	
        			}
        			break;
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
                    this._danmu.onGetMsgByUser(pd,str);
        			break;
        		case 0x2215:
        			if(data.result != 1 )
        				return;
        			switch(data.type)
        			{
        				case 1:	       
        					if(data.sign == 0) 				
	                    		this._danmu.onGetMsg(data.content,data.vip > 0,data.PID == gamelib.data.UserInfo.s_self.m_pId);
        					break;
        				case 2:    // 世界
		                    // 跑马灯
		                    if(this._pmd)
        						this._pmd.add(data.nickName +":" + data.content);
		                    break;
		                case 3:    // 游戏公告
		                case 4:    // 系统公告
		                    if(this._pmd)
        						this._pmd.add(getDesByLan("系统") +":" + data.content);
		                    break;
        			}
        	}
        }

	}
}