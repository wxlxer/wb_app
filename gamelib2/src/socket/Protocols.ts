
module gamelib.socket {

	/**
	 * @class Protocols
	 * 协议文件
	 */
	export class Protocols
    {
		protected messageToId:any;
		protected idToMessage:any;//{"xxx":33,}
		protected formClientList:any;//{1d:{typeAry:[...],nameAry:[...]}}
		protected formServerList:any;//{1d:{typeAry:[...],nameAry:[...]}}
		protected debugList:any;//{1d:true}
		
		public init(root1:any,root2:any):void
        {
			this.messageToId={};
			this.idToMessage={};
			this.formClientList={};
			this.formServerList={};
			this.debugList={};

			if(root1.children)
				this.parseRoot(root1);
			else
				this.parseRoot1(root1);
			if(root2.children)
				this.parseRoot(root2);
			else
				this.parseRoot1(root2);
		}
		public destroy():void
		{
			this.messageToId = null;
			this.idToMessage = null;
			this.formClientList = null;
			this.formServerList = null;
			this.debugList = null;

		}
		protected parseRoot1(root:any):void
		{
			var info:any = root.ownerDocument.childNodes[1];
			var length:number = info.childNodes.length;
			for(var i:number = 0; i < length; i++)
			{
				var item:any = info.childNodes[i];
				if(item.childNodes == null)
					continue;
				var id:number= parseInt(item.getAttribute("id"));
				var message:string = item.getAttribute("name");

				this.idToMessage[id] = message;
				this.messageToId[message] = id;
				this.debugList[id] = 0;
				for(var j: number = 0;j < item.childNodes.length;j++)
				{
					var node:any = item.childNodes[j];
					node.children = node.childNodes;
					if(node.nodeName == "client")
					{
						
						this.formClientList[id] = this.getNodeList(node);
						this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0: 0x1);
					}
					else
					{
						this.formServerList[id]=this.getNodeList(node);
						this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0: 0x10);
					}

				}
			}
		}
		protected parseRoot(root:any)
		{
			if(root == null)
				return;
			//全局默认是否打印调试信息
			var length:number = root.children.length;
			for(var i:number = 0;i < length;i++){
				var proXmlNode:any = root.children[i];

				var id:number= parseInt(proXmlNode.getAttribute("id"));
				var message:string = proXmlNode.getAttribute("name");

				this.idToMessage[id] = message;
				this.messageToId[message] = id;
				this.debugList[id] = 0;
				for(var j: number = 0;j < proXmlNode.children.length;j++)
				{
					var node:any = proXmlNode.children[j];
					if(node.nodeName == "#comment")
						continue;
					if(node.nodeName == "client")
					{
						this.formClientList[id] = this.getNodeList(node);
						this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0: 0x1);
					}
					else
					{
						this.formServerList[id]=this.getNodeList(node);
						this.debugList[id] |= (parseInt(node.getAttribute("isDebug")) == 0 ? 0: 0x10);
					}

				}
			}
		}
		protected getNodeList(node:any):any
		{
			var typeAry:Array<any>=[];
			var nameAry:Array<any>=[];			
            
			var length:number = node.children ? node.children.length:0;
			for(var i:number = 0;i < length;i++)
			{
				 var b:any = node.children[i];
				if(b.nodeName=="loop"){
					if(b.childNodes != null)
						b.children = b.childNodes;
					var o:any=this.getNodeList(b);
					typeAry.push( o["typeAry"] );
					nameAry.push( o["nameAry"] );

				}
				else if(b.nodeName == "#comment"){
					continue;
				}
				else{
					typeAry.push( b.nodeName );
					nameAry.push( b.textContent );
				}

			}
			return {"typeAry":typeAry,"nameAry":nameAry};
		}
		/**
		 * 判断协议是否需要debug 
		 * @param packageId 协议号
		 * @param type		1：client，2：sever
		 * 
		 */		
		private packageNeedDebug(packageId:number,type:number = 0):boolean{
//			var id:String = MathUtility.toHexString(packageId,4);
			if(this.debugList[packageId] == undefined)
				return false;
			if(type == 1)
				return <boolean><any> (this.debugList[packageId] & 0x1);
			else if(type == 2)
				return <boolean><any> (this.debugList[packageId] & 0x10);
			return false;
		}
		/**
		 * 打包客户端数据
		 * @function
		 * @DateTime 2018-03-17T15:47:23+0800
		 * @param    {number}                 msgId [协议号]
		 * @param    {Array<any>}             args  [该协议需要发送的参数列表]
		 * @param    {string}                 name  [当前socke名]
		 * @return   {socket.BinaryPacket}          [description]
		 */
		public packetClientArgs(msgId:number,args:Array<any>,name?:string):socket.BinaryPacket
        {
			var id:number = msgId;
			var typeArr:Array<any> = this.formClientList[id]["typeAry"];
			var nameArr:Array<any> = this.formClientList[id]["nameAry"];
			if(args.length != typeArr.length)
				throw new Error("参数数量不对！"+ utils.MathUtility.toHexString(id,4));

			name = name || "";
			if(this.packageNeedDebug(msgId,1))
			{
				console.log(name + "↑:"+ utils.MathUtility.toHexString(id,4) +this.idToMessage[id]+"	"+ JSON.stringify(args));
				// logStr += (name + "↑:"+ utils.MathUtility.toHexString(id,4) +this.idToMessage[id]+"	"+ JSON.stringify(args) + "\n");
			}
			var packet:BinaryPacket = new BinaryPacket( msgId);
			this.writeArgs(packet,typeArr,nameArr,args);
			return packet;
		}
		/**
		 *打包客户端数据
		 * {id:0x33,message:"下注",content:{...}}
		 */
		public packetClientData(data:any,name?:string):socket.BinaryPacket
        {
			name = name || "";
			if(data.id){
//				id = MathUtility.toHexString(data.id,4);
			}else if(data.message){
				data.id =this.messageToId[data.message];
			}else{
				throw new Error("至少定义一个id 或 message");
			}
			if(this.packageNeedDebug(data.id,1))
            {
            	console.log(name + "↑:"+utils.MathUtility.toHexString(data.id,4) + this.idToMessage[data.id]+"	"+ JSON.stringify(data.content));
            	// logStr += (name + "↑:"+utils.MathUtility.toHexString(data.id,4) + this.idToMessage[data.id]+"	"+ JSON.stringify(data.content) + "\n");
            }    
			var packet:BinaryPacket = new BinaryPacket( data.id );
			this.write(packet,this.formClientList[data.id]["typeAry"],this.formClientList[data.id]["nameAry"],data.content);
			return packet;
		}
		/**
		 *解包服务器数据 生成形如:{id:0x33,message:"下注",content:{...}}
		 * type:  false.多维数组格式 true.循环嵌套格式
		 */
		public unpacketServerData( packet:socket.BinaryPacket,name?:string):any{
			name = name || "";
            var id: number = packet.getInt16();
            var len: number = packet.getInt16();
			if(this.idToMessage[id] == null){
				console.log(name + " 截获了一个未定义报文：id="+ utils.MathUtility.toHexString(id,4));
				// logStr += (name + " 截获了一个未定义报文：id="+ utils.MathUtility.toHexString(id,4) + "\n");
				return null;
			}
			var id_msg:string = utils.MathUtility.toHexString(id,4);
			
			try{
				//按循环结构取出数据
				var temp:any = {};
				var obj:any= this.read(packet,this.formServerList[id]["typeAry"],this.formServerList[id]["nameAry"],temp);
			}
			catch (e){
				console.log(name + " 读取报文错误！" + id_msg + this.idToMessage[id]+""+e.message +"  " + temp.name);
				// logStr += (name + " 读取报文错误！" + id_msg + this.idToMessage[id]+""+e.message +"  " + temp.name + "\n");
			}
			if(this.packageNeedDebug(id,2))
			{
				var msg:string = "↓:"+ id_msg + this.idToMessage[id]+ "\t"+ JSON.stringify(obj);

				var tmsg:string = "";	
				var len:number = Math.ceil(msg.length / 130);			
				for (var i = 0; i < len; i++)
				{
					tmsg += msg.slice(i * 130, (i + 1) * 130);
					if(i != len -1)
						tmsg += "\n";
				}
				console.log(name + tmsg);
				// logStr += (name + tmsg + "\n");
			}
			return {"content":obj,"msgId":id,"message":this.idToMessage[id] };
		}

		private read(packet:socket.BinaryPacket, typeAry:Array<any>,NameAry:Array<any>,debugObj:any):any{
			var obj:any={};
			var data:any;
			for (var flag:number=0;flag<typeAry.length;flag++)
			{
				debugObj.name = NameAry[flag];
				if(typeAry[flag] instanceof Array){
					obj[NameAry[flag-1]]=new Array<any>(obj[NameAry[flag-1]]);
					for (var i:number=0;i<obj[NameAry[flag-1]].length;i++){
						obj[NameAry[flag-1]][i]=this.read(packet,typeAry[flag],NameAry[flag],debugObj);
					}
					continue;
				}
				switch( typeAry[flag] )
				{
					case "ubyte":{
						data = packet.getUint8();
						break;
					}
					case "byte":{
						data = packet.readByte();
						break;
					}
					case "str":{
						data = packet.readUTFBytes( packet.getUint8() );
						break;
					}
					case "lstr":{
						data = packet.readUTFBytes( packet.getUint16() );
						break;
					}
					case "short":{
						data = packet.getInt16();
						break;
					}
					case "ushort":{
						data = packet.getUint16();
						break;
					}
					case "int":{
						data = packet.getInt32();
						break;
					}
					case "uint":{
						data = packet.getUint32();
						break;
					}
					case "float":
					{
						data = packet.getFloat32();
						break;
					}
					case "double":
					{
						data = packet.getFloat64();
						break;

					}
					default:{
						throw new Error("unknown packet type to read:" + typeAry[flag]);
						//break;
					}
				}
				obj[NameAry[flag]] = data;
			}
			return obj;
		}

		private write(packet:BinaryPacket,typeAry:Array<any>,nameAry:Array<any>,content:any):void{
			for (var flag:number=0;flag< typeAry.length;flag++) {
				if(typeAry[flag] instanceof Array){
					var length:number = content[nameAry[flag-1]].length;
					for(var i:number = 0;i < length;i++){
						var it:any = content[nameAry[flag-1]][i];
						this.write(packet,typeAry[flag],nameAry[flag],it);
					}
					continue;
				}
				var value:any=content[nameAry[flag]];
				if(value instanceof Array){
					value=value.length;
				}
				switch(typeAry[flag]){
					case "byte":{
						packet.writeByte( value);
						break;
					}
					case "ubyte":{
						packet.writeByte(value);
						break;
					}
					case "ushort":{
						packet.writeUint16(value);
						break;
					}
					case "short":{
						packet.writeInt16(value);
						break;
					}
					case "uint":{
						packet.writeUint32(value);
						break;
					}
					case "int":{
						packet.writeInt32(value);
						break;
					}
					case "str":{
						packet.writeUint8( utils.MathUtility.UTFLen( value ) );
						packet.writeUTFBytes(value);
						break;
					}
					case "lstr":{
						packet.writeUint16( utils.MathUtility.UTFLen( value ) );
						packet.writeUTFBytes(value);
						break;
					}	
					case "float":{
						packet.writeFloat32(value);
						break;
					}
					case "double":
						packet.writeFloat64(value);
						break;
					default:{
						throw new Error("unknown packet type to read:" + typeAry[flag]);
					//	break;
					}
				}
			}
			
		}
		private writeArgs(packet:BinaryPacket,typeAry:Array<any>,nameAry:Array<any>,args:any):void{
			for (var i:number=0;i< typeAry.length;i++) {
				if(typeAry[i] instanceof Array){
					var temp:Array<any> = args[i];
					for (var j:number = 0 ;j < temp.length;j++){
						this.writeArgs(packet,typeAry[i],nameAry[i],temp[j]);
					}					
					continue;
				}
				var value:any = args[i];
				switch(typeAry[i]){
					case "byte":{
						packet.writeByte( value);
						break;
					}
					case "ubyte":{
						packet.writeByte(value);
						break;
					}
					case "ushort":{
						packet.writeUint16(value);
						break;
					}
					case "short":{
						packet.writeInt16(value);
						break;
					}
					case "uint":{
						packet.writeUint32(value);
						break;
					}
					case "int":{
						packet.writeInt32(value);
						break;
					}
					case "str":{
						packet.writeUint8( utils.MathUtility.UTFLen( value ) );
						packet.writeUTFBytes(value);
						break;
					}
					case "lstr":{
						packet.writeUint16( utils.MathUtility.UTFLen( value ) );
						packet.writeUTFBytes(value);
						break;
					}
					case "float":{
						packet.writeFloat32(value);
						break;
					}
					case "double":
						packet.writeFloat64(value);
						break;
					default:{
						throw new Error("unknown packet type to read:" + typeAry[i]);
						//break;
					}
				}
			}
		}
	}
}