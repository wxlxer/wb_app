module gamelib.core {
	/**
	 * @class GameNet
	 * @author wx
	 * 网络模块
	 * 流程入下:
	 * 1、gameMain中配置文件加载成功后，设置协议配置文件
	 * 2、连接服务器
	 * 3、成功后发送0x0003
	 * 4、接收到0x0003后发送0x00C2
	 * 5、服务器会主动发送0x0010，接收到后更新玩家数据，包括玩家名，玩家头像
	 * 6、解析公共协议，包括 ping pong,0x0003,0x0010,0x002D,0x0036,0x0074,0x007A,0x0056,0x00254
	 * 
	 */
	export class GameNet
	{
		private _currentIp:string = "";
		private _otherIp:string = "";
		private _otherGz_id:number = 0;

		private _mainIp:string = "";
		private _bC2:boolean = false;
		public _needConnectOther:boolean = false;
		private _listeners:Array<INet>;
		private _socket:gamelib.socket.NetSocket;

		private _reconnect_count:number;
		private _bReconnecting:boolean;
		//牌桌重连策略，1：刷新，2：重连
		public m_reconnectPolicy:number = 2;
		private _lastPingTime:number;
		private _ping_grap:number = 2000;
		private server_url:string = "";

		public m_signal:gamelib.core.Signal;
		private _name:string;

		private _send0x00B6:boolean;
		private _isChild:boolean;
		private _gameProtocols:any;
		public constructor(name:string,isChild:boolean)
		{
			this._name = name;
			this._isChild = isChild;
			this._listeners = [];
			this._reconnect_count = 10;
			this._bReconnecting = false;
			this.m_signal = new gamelib.core.Signal();
		}
		public setGameProtocols(protocols:any):void
		{
			if(protocols == null)
				return;
			this._gameProtocols = protocols;
		}
		private createSocket():void
		{
			var common:any;
			var protocols:any;
			var url:string;
			if(this._gameProtocols == null)
			{
				url = getGameResourceUrl("config/protocols." + g_protocols_type);
			}
			else
			{
				url = getGameResourceUrl("config/" + this._gameProtocols + "." + g_protocols_type);
			}
			var url_common:string = getCommonResourceUrl("protocols_common." + g_protocols_type);
			if(g_protocols_type == 'xml')
			{
				protocols = Laya.Utils.parseXMLFromString(Laya.loader.getRes(url)).firstChild;
				common = Laya.Utils.parseXMLFromString(Laya.loader.getRes(url_common)).firstChild;	
			}
			else
			{
				protocols = Laya.loader.getRes(url).protocols;
				common = Laya.loader.getRes(url_common).protocols;		
			}
			
			
			if(this._socket)
			{
				this.close();
				this._socket.destroy();
			}
			this._socket = new gamelib.socket.NetSocket(protocols,common,g_protocols_type == 'xml');
			this._socket.m_name = this._name;
			this._socket.on(gamelib.socket.NetSocket.SOCKET_CONNECTD, this, this.onConnected);
			this._socket.on(gamelib.socket.NetSocket.SOCKET_CLOSE, this, this.onServerClose);
			this._socket.on(gamelib.socket.NetSocket.SOCKET_GETMSG, this,this.onGetNetMsg);
			this._socket.on(gamelib.socket.NetSocket.SOCKET_SERVER_ERROR, this,this.onServerError);
		}
		public destroy():void{
			this.close();
			Laya.timer.clearAll(this);
			this._socket.destroy();
			this._listeners.length = 0;
			this._listeners = null;
		}
		public show():void
		{
			if(!GameVar.urlParam['isChildGame'])
				g_uiMgr.showMiniLoading({msg:""});
			this.createSocket();
			this.connectSever(0);
		}
		public close():void
		{
			this._socket.off(gamelib.socket.NetSocket.SOCKET_CONNECTD, this, this.onConnected);
			this._socket.off(gamelib.socket.NetSocket.SOCKET_CLOSE, this, this.onServerClose);
			this._socket.off(gamelib.socket.NetSocket.SOCKET_GETMSG, this,this.onGetNetMsg);
			this._socket.off(gamelib.socket.NetSocket.SOCKET_SERVER_ERROR, this,this.onServerError);
			this._socket.disconnect();

		}
		private reconnect():void
		{
			this.close();
			this.createSocket();
			console.log("重新连接服务器:" + this._name +" " + this.server_url);
			this._socket.connectServer(this.server_url);
		}

		public addListener(target:INet):void
		{
			if(this._listeners.indexOf(target) == -1)
			{
				this._listeners.push(target);

				//从大到小
				this._listeners.sort(function(a:INet,b:INet):number
				{
					return b.priority - a.priority;
				})
			}

		}
		public removeListener(target:INet):void
		{
			if(this._listeners == null)			
				return;
			var index:number = this._listeners.indexOf(target);
			if(index != -1)
				this._listeners.splice(index,1);
			console.log(this._listeners);
		}

		public get socket():gamelib.socket.NetSocket
		{
			return this._socket;
		}

		public get name():string
		{
			return this._name;
		}
		private onConnected(evt:laya.events.Event):void
		{
			console.timeEnd(this._name + " connectServer");
			g_uiMgr.closeMiniLoading();
			console.log(  this._name +" 连接成功了，发送0x0003");
			this._send0x00B6 = false;
			sendNetMsg(0x0003);

			this._lastPingTime = new Date().getTime();
			this.ping();
			Laya.timer.loop(this._ping_grap,this,this.ping,[0x0001,this._lastPingTime]);
			this._bReconnecting = false;

		}
		private onServerError(evt:laya.events.Event):void
		{
			console.log("server error!" + this.server_url);
			g_uiMgr.closeMiniLoading();
			if(this._bReconnecting)
			{
				g_uiMgr.showAlert_NoClose(this._name + getDesByLan("重连失败!请检测网络状况"));
			}
			else
			{
				//TipManager.Alert_noClose("服务器维护中，请稍后在试");
				g_uiMgr.showAlertUiByArgs({msg:this._name + getDesByLan("服务器连接失败，点击重新连接"),callBack:function()
				{
					this.reconnectByInof();
					// window.location.reload();
				},thisObj:this});
			}
		}
		private onServerClose(evt:laya.events.Event):void
		{
			console.log(this._name +" 连接断开");
			g_uiMgr.closeMiniLoading();
			Laya.timer.clear(this,this.ping);
			
			//1：直接重连，重连次数为0，弹提示框
			//2：弹提示框，点击确认，重新连接
			//3：弹提示框，点击确认，重载页面
			var connect_status:number = 0;
			if(gamelib.data.UserInfo.s_self == null)
			{
				connect_status = 1;					
			}
			else
			{
				if(gamelib.data.UserInfo.s_self.m_roomId == 0)
				{
					connect_status = 2;
				}
				else
				{
					//当前在牌桌里面，如果是大厅的socket断了，则不处理
					if(!this._isChild)
						return;
					if(GameVar.g_platformData['reconnect'] == 1)
					{
						connect_status = 1
					}	
					else
					{
						if(this.m_reconnectPolicy == 1)
							connect_status = 3;
						else
							connect_status = 2;	
					}					
				}
			}
			switch (connect_status)		
			{
				case 1://没连接成功。需要重新连接
					if(this._reconnect_count > 0)
					{
						// this.reconnect();
						this.reconnectByInof();
						this._reconnect_count--;
						this._bC2 = false;
					}
					else
					{
						var str:string = getDesByLan("服务器连接失败，点击重新连接");
						if(GameVar.g_platformData['disconnectInHallTip'] && GameVar.g_platformData['disconnectInHallTip']['noLogin'])
							str = GameVar.g_platformData['disconnectInHallTip']['noLogin'];
						g_uiMgr.showAlertUiByArgs({msg:str,callBack:function()
						{
							window.location.reload();
						}});
					}
					break;
				case 2://在大厅中。。。
					// g_uiMgr.showMiniLoading({msg:"与服务器连接断开,重连中..."});
					var str:string = getDesByLan("长时间未操作或网络断开了，点击确定重新连接");
					if(GameVar.g_platformData['disconnectInHallTip'] && GameVar.g_platformData['disconnectInHallTip']['hall'])
						str = GameVar.g_platformData['disconnectInHallTip']['hall'];
					g_uiMgr.showAlertUiByArgs({msg:str,
						callBack:function(){
							this.reconnect();
							this._bReconnecting = true;
							this._bC2 = false;
							g_uiMgr.showMiniLoading();},
						thisObj:this
					});
					// this.reconnect();
					// this._bReconnecting = true;
					// this._bC2 = false;
					break;
				case 3://在牌桌中
					if(!this._isChild)
						return;
					var str:string = getDesByLan("长时间未操作或网络断开了，点击确定重新连接");
					if(GameVar.g_platformData['disconnectInHallTip'] && GameVar.g_platformData['disconnectInHallTip']['hall'])
						str = GameVar.g_platformData['disconnectInHallTip']['hall'];
					g_uiMgr.showAlertUiByArgs({msg:str,callBack:function()
					{
						window.location.reload();
					}});					
					break;
			}
		}
		private ping():void
		{
			var temp:number = new Date().getTime();
			if(GameVar.urlParam['isChildGame'] && GameVar.s_bActivate)
			{				
				if(temp - this._lastPingTime > this._ping_grap * 2)		//进入自动连接游戏
				{
					console.log("超过ping时长，重新获取连接信息，并重新连接服务器");
					//已经掉线了
					if(!Laya.Browser.onPC)
						this.reconnectByInof();
					else
						this._lastPingTime = temp;
					return;
				}	
			}
			
			this._lastPingTime = temp;
			sendNetMsg(0x0001,this._lastPingTime);
		}
		/**
		 * 重新连接，需要重新获取分区信息
		 * @function
		 * @DateTime 2018-05-08T10:28:22+0800
		 */
		private reconnectByInof():void
		{
			g_uiMgr.showMiniLoading({msg:getDesByLan("资源载入中") +"..."})
			var data :any = getGame_zone_info(GameVar.gz_id);
			if(data)
			{
				var pars:any = {};
				pars.result = 0;
				pars.data = data;
				this.onGetGame_zone_info(pars);
			}
			else
			{
				window["application_game_zone_info"](GameVar.gz_id,this.onGetGame_zone_info.bind(this));	
			}
			
			
		}
		private onGetGame_zone_info(ret:any):void
		{
			var obj: any = ret.data;
			g_uiMgr.closeMiniLoading()
			if(ret.result != 0)
			{
				console.log("目标分区的登陆信息获取失败!");
				return;
			}
			GameVar.urlParam['wss_host'] = obj['wss_host'];
			GameVar.urlParam['ws_host'] = obj['ws_host'];
			var url:string = "";
			if(GameVar.wss_host != null && GameVar.wss_host != "")
				this.server_url = "wss://" + GameVar.wss_host;
			else
				this.server_url = "ws://" + GameVar.ws_host;
			this.reconnect();
		}

		public onLoginServer():void
		{			
            sendNetMsg(0x0010, 1,
                GameVar.gameMode, GameVar.session +":" +0x20+":" + 2,    //20html5版本
                GameVar.pid);
		}
		private connectOther(bc3: boolean): void
		{
			if(bc3)
				sendNetMsg(0x00C3,2);
			else
				this.connectSever(2);
		}
		/**
		 * @function connectSever
		 * 连接服务器
		 * @param type 0:按照正常登陆，1:主服务器，2：其他服务器
		 *
		 */
		public connectSever(type: number): void
		{
			console.time(this._name + " connectServer");
			console.time(this._name + " start");
			var ip,port;
			var url:string = "";
			if(type == 0)
			{
				if(GameVar.wss_host != null && GameVar.wss_host != "")
					url = "wss://" + GameVar.wss_host;
				else
					url = "ws://" + GameVar.ws_host;
			}
			else if(type == 1)
			{
				ip = this._mainIp.split(":")[0];
				port = this._mainIp.split(":")[1];
				GameVar.mainGameGz_id = GameVar.gz_id;
				url = "ws://" + ip + ":" + port;
			}
			else
			{
				ip = this._otherIp.split(":")[0];
				port = this._otherIp.split(":")[1];
				this._currentIp = this._otherIp;
				GameVar.mainGameGz_id = this._otherGz_id;
				url = "ws://" + ip + ":" + port;
			}
			this._socket.disconnect();
			this._socket.connectServer(url);
			this.server_url = url;
			console.log("connectSever " + this.server_url);
		}

		public updatePlayerInfoToServer():void
		{
            // sendNetMsg(0x005F, GameVar.platformVipLevel, new md5().hex_md5(GameVar.pid + "" + GameVar.platformVipLevel + "E82494FD36167386332fA1DE11908578"));
			sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
			if(isMultipleLans())
			{
				var lan:string = gamelib.Api.getLocalStorage("lan");
				sendNetMsg(0x001D,2,lan);
				gamelib.Api.modfiyAttByInterface("/platform/setlanguage",{"language":lan},null);
			}
		}
		private onGetNetMsg(data:any):void
		{
			this.m_signal.dispatch(data.msgId,data.content);
			this.reciveNetMsg(data.msgId,data.content);
			if(this._listeners == null)			
				return;
			var len:number =  this._listeners.length;
			for(var i:number = 0; i < len; i++)
			{
				if(this._listeners == null || this._listeners[i] == null)
					continue;
				this._listeners[i].reciveNetMsg(data.msgId,data.content);
			}
		}
		private reciveNetMsg(msgId:number, data:any):void
		{
			switch (msgId) {
				case 0x0002:
					var temp:number = Laya.timer.currTimer;
					GameVar.s_netDelay = temp - data.time;
					break;
				case 0x0003:
					GameVar.s_loginSeverTime = data.ms;	
					GameVar.s_loginClientTime = Laya.timer.currTimer;
                    this._bReconnecting = false;
					//
					if(!this._bC2)
					{
						sendNetMsg(0x00C2,0,GameVar.session + ":" + 0x20 + ":" + 1,GameVar.pid);
						this._bC2 = true;
					}
					else
					{
						sendNetMsg(0x00C2,0,GameVar.session + ":" + 0x20 + ":" + 1,GameVar.pid);
						// sendNetMsg(0x00C4,1,1,GameVar.session + ":" + 0x20 + ":" + 1,GameVar.pid);
					}
					break;
				case 0x00C2:
					var ip = data.ip;
					var port = data.port + 1;		//+1：wss，+2：ws，port是flash的端口
					//做测试，先屏蔽
                    if(ip + ":" + port == this._currentIp)
                        return;
					this._otherIp = ip + ":" + port;
					this._otherGz_id = data.gz_id;
					if(gamelib.data.UserInfo.s_self && gamelib.data.UserInfo.s_self.m_roomId != 0)
					{
						this._needConnectOther = true;
					}
					else
					{
						this.connectOther(data.bC3 == 1);
						this._needConnectOther = false;
					}
					break;
				case 0x00C3:
					if(data.result == 0)
						return;
					this.connectSever(data.actionId);
					break;
				case 0x0010:
					this.onLoginResult(data);
					break;
				case 0x00F8:
					if(data.result == 1) {
						if(GameVar.validation == undefined)
						{
							GameVar.circle_args["validation"] = data.validation;
						}
						sendNetMsg(0x00B6);
						this._send0x00B6 = true;
						return;
					}
					if(data.result == 2)	//需要进入其他服务器
					{
						return;
					}
					var bQuit:boolean;
					var str:string = "";

					switch (data.result) {
						case 0:
							str = getDesByLan("进入牌桌失败");
							break;
						case 3:	//
							str = getDesByLan("无效的验证码");
							break;
						case 4:	//
							str = getDesByLan("错误状态");
							break;
						case 5:
							str = getDesByLan("请求进入的牌桌不存在");
							break;
						case 6:
							str = getDesByLan("牌桌人数已满");
							break;
						case 7:
							str = getDesByLan("重复进入");
							break;
						case 8:
							str = getDesByLan("您正在其他游戏中");
							break;
						case 9:
							str = getDesByLan("数据更新失败");
							break;
						case 10:
							str = getDesByLan("牌桌已经开始")
							break;
						case 11:
							str = getDesByLan("您已经被踢出此牌桌,不能加入")
							break;
						case 12:
							str = getDesByLan("游戏已开始!")
							break;
						case 13:
							str = GameVar.g_platformData.gold_name + getDesByLan("不足")+"!";
							break;
						case 14:
							str = getDesByLan("牌桌已经结束");//请求打开列表
							break;	
						case 15:
							str = getDesByLan("密码错误");
							break;
						case 16:
							str = getDesByLan("该位置已被占用");
							break;	
						case 18:
							str = getDesByLan("只有好友才能加入");
							break;	
						default :
							str = getDesByLan("未知错误") + data.result;
							break;
					}
					if(utils.tools.isQpqHall())
					{
						if(!this._send0x00B6)
						{
							this.updatePlayerInfoToServer();
							sendNetMsg(0x00B6);
							this._send0x00B6 = true;
						}
						g_uiMgr.showAlertUiByArgs({msg:str});
						g_uiMgr.closeMiniLoading();
					}
					else
					{
						g_signal.dispatch("closeEnterGameLoading",0);
						g_uiMgr.showAlertUiByArgs({msg:str,callBack:g_childGame.toCircle,thisObj:g_childGame});
					}
					break;
				case 0x00FD:		//玩家组局最后行踪信息
					if(data.bGameing == 1)
					{
						GameVar.circleData.validation = data.validation;
						GameVar.circle_args["validation"] = data.validation;
					}
					this.updatePlayerInfoToServer();
					sendNetMsg(0x00B6);
					this._send0x00B6 = true;
					break;
			}
		}
		private onLoginResult(data:any):void
		{	
			if (data.status == 1)
			{
				this._socket.onLoginSuccess();
				g_uiMgr.closeMiniLoading();
				if(GameVar.ip_addr != undefined && GameVar.ip_addr != "")
				{
					sendNetMsg(0x0019,GameVar.ip_addr);
				}
				console.log("circle_args:" + GameVar.circle_args + " " + GameVar.urlParam["circle_args"] );
				console.log("validation:" + GameVar.validation);
				if(GameVar.game_args.roundId && GameVar.game_args.groupId)
				{
					//请求录像
					sendNetMsg(0x00FF, GameVar.game_args.groupId,GameVar.game_args.roundId);
					return;
				}
				else if(!isNaN(GameVar.game_args.roomId))	//请求进入房间
				{
					this.updatePlayerInfoToServer();
					sendNetMsg(0x00B6);
					this._send0x00B6 = true;
					// if(GameVar.urlParam["game_code"].indexOf("zjh") != -1)
					// {
					// 	sendNetMsg(0x0110,GameVar.game_args.roomId,1);
					// }
					// else 
					// {
						sendNetMsg(0x0011,GameVar.game_args.roomId);
					// }
					return;
				}
				else if(!isNaN(GameVar.game_args.matchId))
				{
					this.updatePlayerInfoToServer();
					sendNetMsg(0x00B6);
					this._send0x00B6 = true;
					sendNetMsg(0x2708,GameVar.game_args.matchId);
				}
				else if(GameVar.game_args.gzInfo)		//观战
				{
					this.updatePlayerInfoToServer();
					sendNetMsg(0x00B6);
					this._send0x00B6 = true;
					sendNetMsg(0x270C,GameVar.game_args.gzInfo.matchId,GameVar.game_args.gzInfo.deskId);	
				}
				else if(GameVar.urlParam["circle_args"] == undefined || GameVar.urlParam["circle_args"] == "")
				{
					this.updatePlayerInfoToServer();
					sendNetMsg(0x00B6);
					this._send0x00B6 = true;							
					return;
				}
				//检测是否需要跳转游戏
				if(GameVar.validation != "" && GameVar.validation != null && GameVar.validation != undefined)
				{
					if(GameVar.g_platformData['showEnterGameTipInUrl'] && !GameVar.urlParam['isChildGame'])
					{
						this.updatePlayerInfoToServer();
                        sendNetMsg(0x00B6);
                        this._send0x00B6 = true;

						if(GameVar.groupId != "" && GameVar.groupId != null && parseInt(GameVar.groupId)>100000)
						{
							g_signal.dispatch("showEnterGameTipUi",[GameVar.validation,GameVar.groupId])
							// sendNetMsg(0x00F8,GameVar.validation +","+GameVar.groupId);
						}
						else
						{
							// sendNetMsg(0x00F8,GameVar.validation);	
							g_signal.dispatch("showEnterGameTipUi",[GameVar.validation])
						}
					}
					else
					{
						if(GameVar.groupId != "" && GameVar.groupId != null && parseInt(GameVar.groupId)>100000)
						{
							sendNetMsg(0x00F8,GameVar.validation +","+GameVar.groupId);
						}
						else
						{
							sendNetMsg(0x00F8,GameVar.validation);	
						}
					}
					this.updatePlayerInfoToServer();
				}

				else
				{
					sendNetMsg(0x00FD);
				}
			}
		}
	}

}