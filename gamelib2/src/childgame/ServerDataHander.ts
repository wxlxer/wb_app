module gamelib.childGame {
	/**
	 * @class
	 * @author wx 
	 * 负责向目标服务器发送0x0015协议,并检测数据拷贝是否成功
	 * @deprecated
	 * 
	 */
	export class ServerDataHander
	{
		private _socket: gamelib.socket.NetSocket;

		//当前状态, 1:0x0015,  2:0x00F4
		private _status:number;
		private _pid:number;
		private _callback:Function;
		private _thisobj:any;
		private _gz_id:number;
		private _cjid:number;
		private _groupId:number;
		private _args:Array<any>;
		public constructor()
		{

		}
		private initSocket():void
		{
			//var p: any = egret.XML.parse("<root/>");
			var common:any;
			// var url:string = GameVar.common_ftp + "protocols_common." +g_protocols_type;
			var url:string = GameVar.common_ftp + "protocols_common." + g_protocols_type +"?ver=" + GameVar.game_ver;
			if(g_protocols_type == "xml")
			{
				common = Laya.Utils.parseXMLFromString(Laya.loader.getRes(url)).firstChild;
			}
			else
			{
				common = Laya.loader.getRes(url).protocols;
			}			
			this._socket = new gamelib.socket.NetSocket(common,null,g_protocols_type == "xml");
			this._socket.on(gamelib.socket.NetSocket.SOCKET_CLOSE,this,this.onClose);
			this._socket.on(gamelib.socket.NetSocket.SOCKET_CONNECTD,this,this.onConnectd);
			this._socket.on(gamelib.socket.NetSocket.SOCKET_GETMSG,this,this.onGetMsg);
		}
		private disconnect():void
		{
			this._socket.disconnect();
			this._socket.off(gamelib.socket.NetSocket.SOCKET_CLOSE,this,this.onClose);
			this._socket.off(gamelib.socket.NetSocket.SOCKET_CONNECTD,this,this.onConnectd);
			this._socket.off(gamelib.socket.NetSocket.SOCKET_GETMSG,this,this.onGetMsg);
		}
		/**
		 * 退出服务器
		 * @param ip
		 * @param port
		 * @param pid
		 * @param callback
		 * @param thisobj
		 * @param gz_id
		 */
		public quitServer(ip:string,port:string,pid:number,callback:Function,thisobj:any,gz_id:number,type:string="ws"):void
		{
			this._status = 1;
			this._callback = callback;
			this._thisobj = thisobj;
			this._pid = pid;
			this._gz_id = gz_id;
			this.initSocket();
			var url:string = type+"://" + ip+":" + port;
			this._socket.connectServer(url);
		}

		/**
		 * 通知服务器创建牌桌
		 * @param ip
		 * @param port
		 * @param pid
		 * @param zjid 创建id
		 * @param callback
		 * @param thisobj
		 * @param gz_id
		 */
		public noticeServerCreateGame(ip:string,port:string,pid:number,args:Array<any>,callback:Function,thisobj:any):void
		{
			this._status = 2;
			this._callback = callback;
			this._thisobj = thisobj;
			this._pid = pid;
			this._args = args;
			this.initSocket();
			var url:string = "ws://" + ip+":" + port;
			this._socket.connectServer(url);
		}
		public noticeServerOpGame(ip:string,port:string,args:Array<any>,callback:Function,thisobj:any):void
		{
			console.log("开始连接目标服务器!")
			this._status = 3;
			this._callback = callback;
			this._thisobj = thisobj;
			this._args = args;
			this.initSocket();
			var url:string = "ws://" + ip+":" + port;
			this._socket.connectServer(url);
		}
		private onClose(): void
		{
			console.log("目标服务器链接关闭!")
		}
		private onConnectd(): void
		{
			console.log("目标服务器连接成功!");
			if(this._status == 1)
			{
				var ts:number = GameVar.ts;
				var url:string = new md5().hex_md5(this._gz_id + "762ff77aa3f33ebdc57401b2a31eb88d" + this._pid + ts);
				this._socket.sendDataByArgs(0x0015,[this._pid,this._gz_id,ts,new md5().hex_md5(this._gz_id + "762ff77aa3f33ebdc57401b2a31eb88d" + this._pid + ts)]);
			}
			else if(this._status == 2)
			{
				this._socket.sendDataByArgs(0x00F4,this._args);
			}
			else if(this._status == 3)
			{
				this._socket.sendDataByArgs(0x00F6,this._args);
			}

		}
		private onGetMsg(evt: gamelib.socket.SocketEvent): void
		{
			var data: any = evt.m_data;
			switch(data.msgId)
			{
				case 0x0015:
					//数据拷贝完成
					this._callback.call(this._thisobj,data.content.result,this._gz_id);
					//this.quitGameResult(data.content.result);
					this.disconnect();
					break;
				//case 0x0F3:
				//	if(this._callback != null)
				//		this._callback.call(this._thisobj,data.msgId,data.content);
				//	break;
				case 0x00F4:
					if(this._callback != null)
						this._callback.call(this._thisobj,data.content);
					this.disconnect();
					break;
				case 0x00F6:
					if(this._callback != null)
						this._callback.call(this._thisobj,data.content);
					this.disconnect();
					break;
			}
		}
	}

}
