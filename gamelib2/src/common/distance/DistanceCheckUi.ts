module gamelib.common
{
    /**
     *  距离检测系统
     *  @class DistanceCheck
     */
    export class DistanceCheckUi extends gamelib.core.BaseUi
    {
		private _headList:Array<Laya.Box>;
		private _okHandler:Laya.Handler;
		private _bTips:boolean;
    	public constructor()
    	{
    		super(GameVar.s_namespace + "/Art_AnQuanJC");
    	}
    	protected init():void
    	{
    		this.addBtnToListener("btn_likai");
    		this.addBtnToListener("btn_ok");
    		this._res['txt_juli12'].text = "";
    		this._res['txt_juli13'].text = "";
    		this._res['txt_juli14'].text = "";

    		this._res['txt_juli23'].text = "";
    		this._res['txt_juli23'].text = "";

    		this._res['txt_juli34'].text = "";

    	}
    	public setPlayerList(list:Array<gamelib.data.UserInfo>,okHandler?:Laya.Handler):void
    	{
    		if(list == null){
    			console.log("须要设置要检测玩家的列表");
    			return;
			}
			this._okHandler = okHandler;
    		var arr:Array<gamelib.data.UserInfo> = [];
    		for(var pd of list)
    		{
    			if(pd == null)
    				continue;
    			arr.push(pd)
    		}
    		//设置头像
    		for(var i:number = 0 ;i < 4; i++)
    		{
    			var box:Laya.Box = this._res['b_p' + (i + 1)];
    			var head:Laya.Image = this._res['img_player' + (i + 1)];
    			if(i >= arr.length){
    				box.visible = false;
    				continue;
    			}
    			box.visible = true;
    			head.skin = arr[i].m_headUrl;
    		}
    		this._res['txt_juli12'].text = "";
    		this._res['txt_juli13'].text = "";
    		this._res['txt_juli14'].text = "";

    		this._res['txt_juli23'].text = "";
    		this._res['txt_juli24'].text = "";

    		this._res['txt_juli34'].text = "";

    		if(arr.length  == 4)
    		{
    			this.setDis(0,1,arr);
    			this.setDis(0,2,arr);
    			this.setDis(0,3,arr);
    			this.setDis(1,2,arr);
    			this.setDis(1,3,arr);
    			this.setDis(2,3,arr);

    		}
    		else if(arr.length == 3)
    		{
    			this.setDis(0,1,arr);
    			this.setDis(0,2,arr);
    			this.setDis(1,2,arr);
    		}
    		else if(arr.length == 2)
    		{
    			this.setDis(0,1,arr);
			}
			var names:Array<string> = [];
			for(var i:number = 0; i < arr.length - 1; i++)
            {
                for(var j:number = 1; j < arr.length;j++)
                {
                    var dis:number = arr[i].getDistanceNum(arr[j]);
                    if(dis == -1)
                        continue;
                    if(dis < 100)
                    {
						if(names.indexOf(arr[i].m_name) == -1)
							names.push(arr[i].m_name)
						if(names.indexOf(arr[j].m_name) == -1)
							names.push(arr[j].m_name)
							
                    }   

                }
			}
			if(names.length > 1 && !this._bTips)
			{
				this._bTips = true;//同一局只提示一次
				var str:string = "玩家" + names.join(",") +"距离低于100米,请注意";
				g_uiMgr.showTip(str);
			}
    	}
    	private setDis(seat1:number,seat2:number,arr:Array<gamelib.data.UserInfo>):void
    	{
    		var txt:Laya.Label = this._res['txt_juli' + (seat1 + 1) + (seat2 + 1)];
    		var user1:gamelib.data.UserInfo = arr[seat1];
    		var user2:gamelib.data.UserInfo = arr[seat2];
    		txt.text = user1.getDistance(user2);
    	}
    	protected onClickObjects(evt:Laya.Event):void
    	{
    		playButtonSound();
    		if(evt.currentTarget.name == "btn_likai")
    		{
    			g_qpqCommon.doJieSan();
    			this.close();
    		}
    		else
    		{
				if(this._okHandler)
					this._okHandler.run();
    			this.close();
    		}
    	}
    }
}