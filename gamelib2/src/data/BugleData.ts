namespace gamelib.data
{
	/**
	 * @class 喇叭数据
	 */
	export class BugleData
	{
		public static s_list:Array<BugleData> = [];
		private static s_maxNum:number = 100;		//保存100条记录
		public static getData(data:any):BugleData
		{
			if(BugleData.s_list.length >= BugleData.s_maxNum)
			{
				BugleData.s_list.shift();
			}
			var temp:BugleData = new BugleData();
			temp.m_msg = data.msg;
			temp.m_sendId = data.sendId;
			temp.m_sendName = data.sendName;
			BugleData.s_list.push(temp);
			return temp;
		}
		public m_sendId:number;
		public m_sendName:string;
		public m_msg:string;
	}
}