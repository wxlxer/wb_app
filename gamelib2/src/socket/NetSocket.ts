module gamelib.socket
{
	/**
     * @class
	 * _socket.readyState
	 * CONNECTING(数值为0)：表示正在连接
	 * OPEN(数字值为1)：表示已建立连接
	 * CLOSING(数字值为2)：表示正在关闭
	 * CLOSED(数字值为3)：表示已经关闭 
	 * 
	 */
    export class NetSocket extends laya.events.EventDispatcher
    {
        private _socket: laya.net.Socket;
        private _pro: Protocols;
        private package_end_str = "\r\n\r\n";
        private package_str_buff = "";

        public static SOCKET_CLOSE: string = 'socket closed';
        public static SOCKET_CONNECTD: string = 'socket connectd';
        public static SOCKET_GETMSG: string = 'socket getmsg';
        public static SOCKET_SERVER_ERROR:string = "socket_server_error";

        private _output: Laya.Byte;
        private _input: Laya.Byte;
        public m_name:string;

        public static SOCKET_TYPE:string = "string";

        /**
         *
         * @param protocols 协议配置文件
         * @param protocols_common  公共协议配置文件
         * @constructor
         */
        public constructor(protocols1:any,protocols_common:any,isXML:boolean)
        {
            super();
            this._socket = null;
            if(isXML)
                this._pro = new Protocols();
            else
                this._pro = new Protocols_Json();
            this._pro.init(protocols_common,protocols1);
            this.m_name = "";
        }

        public destroy():void
        {
            this._pro.destroy();
            this.disconnect();

            this._pro = null;
            this._socket = null;
        }
        /**
         * 连接指定服务器
         * @param {string}[ip = gamelib.data.GameVar.serverIp]
         * @param {any} [port = gamelib.data.GameVar.serverPort]
         */
        public connectServer(url):void
        {
            if(this._socket != null && !this._socket.connected)
                return;
            try
            {
                //var url = type + "://" + ip + ":" + port;
                this._socket = new laya.net.Socket()
                this.addListeners();
                this._socket.connectByUrl(url);
                this._input = this._socket.input;
                this._output = this._socket.output;
                console.log(this.m_name + "连接服务器:" + url);
            }
            catch(e)
            {
                console.log("连接失败!" + e);
                this.event(NetSocket.SOCKET_SERVER_ERROR);
            }
        }
        private addListeners(): void
        {
            this._socket.on(Laya.Event.OPEN, this, this.onOpen);
            this._socket.on(Laya.Event.CLOSE, this, this.onClose);
            this._socket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
            this._socket.on(Laya.Event.ERROR, this, this.onError);
        }

        private removeListeners(): void
        {
            this._socket.off(Laya.Event.OPEN, this, this.onOpen);
            this._socket.off(Laya.Event.CLOSE, this, this.onClose);
            this._socket.off(Laya.Event.MESSAGE, this, this.onReceiveMessage);
            this._socket.off(Laya.Event.ERROR, this, this.onError);
        }

        /**
         * 断开与服务器的连接
         */
        public disconnect()
        {
            if(this._socket == null)
                return;
            this.removeListeners();
            if(this.getConnected() == false)
            {
                this._socket = null;
                return;      
            }          
            this._socket.close();
            this._socket = null;
        }

        /**
         * 当前是否处于连接状态
         * @returns {boolean}
         */
        public getConnected()
        {
            return this._socket && this._socket.connected;
        }
        //发送消息
        private send(packet: BinaryPacket): void
        {
            var temp: BinaryPacket = new BinaryPacket(packet.messageId);
            temp.writeInt16(packet.messageId);
            temp.writeInt16(packet.length + 4);
            if(packet.length > 0)
                temp.writeArrayBuffer(packet.GetArrayBuffer(),0,packet.length);
            

            if(NetSocket.SOCKET_TYPE == "string")
            {
                var str = utils.Base64.fromArrayBuffer(temp.GetArrayBuffer()) + this.package_end_str;
                // 发送字符串
                this._socket.send(str);    
            }
            else
            {

                this._socket.send(temp.GetArrayBuffer());    
            }            
            //console.log(str);
            // 使用output.writeByte发送
            //for(var i:number = 0; i < str.length; i++)
            //{
            //    this._output.writeByte(str.charCodeAt(i));
            //}
            this._socket.flush();
        }


        public sendDataById(msgId:number,content)
        {
            if(!this.getConnected())
                return;
            content.id = msgId;
            this.send(this._pro.packetClientData(content,this.m_name));
        }
        /**
         * 发送协议
         * @param msgId
         * @param content
         */
        public sendDataByArgs(msgId:number,args:Array<any>)
        {
            if(!this.getConnected())
            {
                return;
            }
            if(this.checkCanSend(msgId))    
                this.send(this._pro.packetClientArgs(msgId,args,this.m_name));
            else
                this._cacheList[msgId] = args;
        }
       
        // public sendDataByMessage(message,content): void
        // {
        //     if(!this.getConnected())
        //         return;
        //     content.message = message;
        //     this.send(this._pro.packetClientData(content,this.m_name));
            
        // }
        // public sendMsgToServer(message): void
        // {
        //     if(!this.getConnected())
        //         return;            
        //     this._socket.send(message);
        //     this._socket.flush();
        // }
        /**
         * 登录成功了，。登录成功前，除开0x0003,0x00C2,0x0001外，其他的协议都不能发送.需要缓存起。
         * 在登录成功后再发送
         * @function
         * @DateTime 2019-06-29T15:46:32+0800
         */
        public onLoginSuccess():void
        {
            this._bLogin = true;
            for(var key in this._cacheList){
                this.sendDataByArgs(parseInt(key),this._cacheList[key]);
                delete this._cacheList[key];
            }
        }
        private _cacheList:any = {};
        private _bLogin:boolean = false;
        private checkCanSend(msgId:number):boolean
        {
            if(msgId == 0x0003 || msgId == 0x00C2 || msgId == 0x0001 || msgId == 0x0010 )
                return true;

            return this._bLogin;
        }

        private onClose(e: Laya.Event): void
        {
            console.log(this.m_name + "连接关闭!");
            this.removeListeners();
            this.event(NetSocket.SOCKET_CLOSE);   
            this._bLogin = false;    
        }

        private onOpen(evt): void
        {
            console.log(this.m_name + "连接成功!");
            this.event(NetSocket.SOCKET_CONNECTD);
        }
        private onError(evt): void
        {
            console.log(this.m_name + "连接错误!");
            this.removeListeners();
            this.event(NetSocket.SOCKET_CLOSE);    
            this._bLogin = false;        
        }
        private onReceiveMessage(message:any)
        {

            var str:string;
            if(typeof message == "string")
            {
                this.handleStringType(message);
                return;
            }
            else if(message instanceof ArrayBuffer)
            {
                this.handleBinaryType(message);
            }
            
        }
        private _cmd:number = 0;
        private _length:number = 0;
        private _tempPacket:socket.BinaryPacket = new socket.BinaryPacket();
        protected handleBinaryType(ab:ArrayBuffer):void
        {
            this._socket.input.clear();
            this._tempPacket.writeArrayBuffer(ab);
            this._tempPacket.reset();
            while(this._tempPacket.bytesAvailable > 0)
            {
                // 如果没有读取头部，则读取头部
                if (this._cmd == 0)
                {
                    // 如果不足4字节，则跳出
                    if (this._tempPacket.bytesAvailable < 4)
                        break;
                    
                    this._cmd = this._tempPacket.readInt16();
                    this._length = this._tempPacket.readInt16();
                }
            
                // 如果数据不足报文体大小，则跳出
                if ((this._length - 4) > this._tempPacket.bytesAvailable)
                    break;
                var msg:BinaryPacket;
                // 如果只有报文头部，则发送
                if (this._length == 4)
                {
                    msg = new BinaryPacket(this._cmd);
                }
                else
                {
                    // 读取报文体
                    var arr = this._tempPacket.readArrayBuffer(this._length - 4);
                    msg = new BinaryPacket(this._cmd);  
                    msg.writeUint16(this._cmd);
                    msg.writeUint16(this._length);
                    msg.writeArrayBuffer(arr);
                    msg.reset();
                    
                }                
                this._cmd = 0;
                this._length = 0;

                var data = this._pro.unpacketServerData(msg,this.m_name);
                if(data == null)
                    continue;
                this.event(NetSocket.SOCKET_GETMSG,data);
            }
            if(this._tempPacket.bytesAvailable == 0)
                this._tempPacket.clear();
        }
        protected handleStringType(str:string):void
        {
            this._socket.input.clear();
            //console.log(this + "收到服务器消息了!" + str);
            this.package_str_buff += str;
            var index = -1;
            do
            {
                index = this.package_str_buff.indexOf(this.package_end_str);
                if(index != -1)
                {
                    str = this.package_str_buff.slice(0,index + this.package_str_buff.length);
                    this.package_str_buff = this.package_str_buff.slice(index + this.package_str_buff.length);

                    str = str.slice(0,str.length - 4);
                    var buffer:ArrayBuffer = utils.Base64.toArrayBuffer(str);
                    var temp:BinaryPacket = new BinaryPacket(0,buffer);
                    var data = this._pro.unpacketServerData(temp,this.m_name);
                    if(data == null)
                        continue;
                    this.event(NetSocket.SOCKET_GETMSG,data);
                }
            }
            while(index != -1);
        }
    }
}
