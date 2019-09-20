module gamelib.data {
	/**
	 * 邮件数据
	 * @class MailData
	 * @author wx
	 */
	export class MailData extends GameData {
		public static s_list:Array<MailData> = [];

		public static GetMail(id:number,forceCreate:Boolean = true):MailData
        {
            var md: MailData;
            for(var i: number = 0;i < MailData.s_list.length;i++)
            {
                md = MailData.s_list[i];
                if(md.m_id != id)
                {
                    md = null;
                }
                else
                {
                    break;
                }
               
            }			
            if (md == null && forceCreate)
             {
                md = new MailData();
                md.m_id = id;
                MailData.s_list.push(md);
            }
			return md
		}
		public static AllGet():void
		{
			for(var i: number = 0;i < MailData.s_list.length;i++)
			{
				var md:MailData = MailData.s_list[i];
				md.extraGetted = true;
				md.status = 4;
			}
			gamelib.data.UserInfo.s_self.m_unreadMailNum = 0;
			g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA,0);
		}
		/**
		 * 
		 * @param md 获得邮件的所有附件。如果指定的邮件已经被领取，则没有附件
		 */
		public static GetItems(md:MailData|Array<MailData>):Array<{msId:number,num:number}>
		{
			if(md == null)
				return null;
			var arr:Array<{msId:number,num:number}> = [];
			if(md instanceof MailData)
			{
				if(!md.extraGetted && md.hasExtra){
					for(var good of md.items)
					{
						getGoods(good[0],good[1]);
					}
				}
			}
			else if(md instanceof Array)
			{
				for(var mailD of md)
				{
					if(!mailD.extraGetted && mailD.hasExtra){
						for(var good of mailD.items)
						{
							getGoods(good[0],good[1]);
						}
					}
				}
			}

			function getGoods(msId:number,num:number):{msId:number,num:number}
			{
				var goods:{msId:number,num:number};
				for(var gd of arr)
				{
					if(gd.msId == msId)
					{
						gd.num += num;
						return gd;
					}	
				}
				goods = {'msId':msId,num:num}
				arr.push(goods);
				return goods;
			}
			return arr;
		}
		public static AllRead():void
		{
			for(var i: number = 0;i < MailData.s_list.length;i++)
			{
				var md:MailData = MailData.s_list[i];
				md.status = 4;
			}
			gamelib.data.UserInfo.s_self.m_unreadMailNum = 0;
			g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA,0);
		}



		/**
		 * 是否有未领取附件的邮件
		 */
		public static canGet():boolean
		{
			for(var i: number = 0;i < MailData.s_list.length;i++)
			{
				var md:MailData = MailData.s_list[i];
				if(md.hasExtra && !md.extraGetted)
				{
					return true;
				}
			}
			return false;
		}
		public static ReadMail(obj:any):MailData
		{
			var md:MailData = MailData.GetMail(obj.id, true);
			md.status = obj.status;
			md.title = obj.title;
			if(obj.info != null)
			{
				obj.content = obj.info;
			}
			var str:string = obj.content.trim();
			//trace("前:" +str);
			str = str.replace(/\r\n/g,"<br>");
			str = str.replace(/\n/g,"<br>");
			str = str.replace(/\t/g,"<tr>");
			//trace("后:" +str);
			var temp = JSON.parse(str);
			md.info = temp.content;
			md.info =  md.info.replace(/<br>/g,"\r\n");
			md.info = md.info.replace(/<tr>/g,"\t");

			temp = temp.items;
			if(temp != null)
			{
				md.items = [];
				for(var key in temp)
				{
					md.items.push([parseInt(key),temp[key]]);
				}
			}
			if(obj.recycleTime != null)
				md._leftTime = obj.recycleTime;
			md.setCreateTime(obj.time);
			md.setDes();
			md.hasExtra = obj.hasExtra != 0;
			md.extraGetted = obj.extraGetted != 0;
			return md;
		}
		public static RemoveMail(id:number):void
		{
			if(id == 0)//	删除所有的
			{
				MailData.s_list.length = 0;
				return;
			}
			for(var i:number = 0 ; i < MailData.s_list.length; i++)
			{
				var md:MailData = MailData.s_list[i];
				if(id == md.m_id)
				{
					MailData.s_list.splice(i,1);
					return;
				}
			}

		}
		public constructor()
		{
			super();
		}

		/**
		 *  状态 4:已读，3：未读
		 */
		public status:number = 0;

		/**
		 * 标题
		 */
		public title:string = '';

		/**
		 * 邮件内容
		 */
		public info:string = "";

		//附件是否被领取了
		public extraGetted:boolean = false;

		//是否有附件
		public hasExtra:boolean = false;

		//附件
		public items:Array<any> = null;

		//创建时间
		private _createTime:string = '';
		//剩余时间
		private _leftTime:number;
		//附件的描述
		private _items_des:string = "";

		/**
		 * 创建时间
		 */
		public get createTime():string
		{
			return this._createTime;
		}
		/**
		 * 创建日期
		 */
		public get createDate():string
		{
			return this._createTime.split(" ")[0];
		}
		public get itemsDes():string
		{
			return this._items_des;
		}

		public get leftTime():string
		{
			var temp:number = (this._leftTime - GameVar.s_loginSeverTime);
			var day:number = temp / (3600*24);
			day = parseInt(day+"");
			if(day < 0)
				day = 0;
			return getDesByLan("剩余") + day +  getDesByLan("天");
		}
		public setDes():void
		{
			this._items_des = "";
			if(this.items == null)
				return;
			for(var i:number = 0; i < this.items.length;i++)
			{
				this._items_des += gamelib.data.GoodsData.GetNameByMsId(this.items[i][0]) +":" + utils.tools.getMoneyByExchangeRate( this.items[i][1]) +" ";
			}
		}
		public  setCreateTime(value:number):void {
			var data:Date = new Date();
			data.setTime(value * 1000);
			var str:string = data.getFullYear() + "-";
			str += (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1);
			str += "-";
			str += data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
			str += " ";
			str += data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
			str += ":";
			str += data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
			str += ":";
			str += data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
			this._createTime = str;
		}

		public  toString():string {
			var str:string = this._createTime + " 创建的 标题为'" + this.title + "'状态是:" + status;
			return str;
		}
	}
}
