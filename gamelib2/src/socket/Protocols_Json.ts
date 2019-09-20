
module gamelib.socket {

	/**
	 * @class Protocols 数据源是json格式
	 * 协议文件
	 */
	export class Protocols_Json extends Protocols
    {
		public constructor()
		{
			super()
		}
		protected parseRoot(root:any)
		{
			if(root == null)
				return;
			//全局默认是否打印调试信息
			var length:number = root.length;
			for(var i:number = 0;i < length;i++)
			{
				var item:any = root[i];

				var id:number= parseInt(item.id);
				var message:string = item.name;
				this.idToMessage[id] = message;
				this.messageToId[message] = id;
				this.debugList[id] = 0;
				var node:Array<any> = item.client;
				if(node)
				{
					this.formClientList[id] = this.parseNode(node);
					this.debugList[id] |= (parseInt(item.client_debug) == 0 ? 0: 0x1);
				}
				node = item.server;
				if(node)
				{
					this.formServerList[id] = this.parseNode(node);
					this.debugList[id] |= (parseInt(item.server_debug) == 0 ? 0: 0x10);
				}
			}
		}
		private parseNode(node:Array<any>):any
		{
			var typeAry:Array<any>=[];
			var nameAry:Array<any>=[];			
            
			var length:number = node.length;
			for(var i:number = 0;i < length;i++)
			{
				 var b:any = node[i];
				if(b.type == "loop")
				{
					var o:any = this.parseNode(b.list);
					typeAry.push( o["typeAry"] );
					nameAry.push( o["nameAry"] );

				}else{
					typeAry.push( b.type );
					nameAry.push( b.name );
				}

			}
			return {"typeAry":typeAry,"nameAry":nameAry};
		}

	}
}