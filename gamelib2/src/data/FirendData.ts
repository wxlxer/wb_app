///<reference path="./GameData.ts" />
namespace gamelib.data
{
	/**
	 * 好友数据
	 * @class FirendData
	 */
	export class FirendData extends GameData
	{
		public static s_list:any = {};
		public static getFirendById(id:number,forceCreate:boolean = true):FirendData
		{
			var pd:FirendData = FirendData.s_list[id];
			if(pd == null && forceCreate)
			{
				pd = new FirendData();
				pd.m_id = id;
				FirendData.s_list[id]=pd;
			}
			return pd;
		}

		public static parseFirendData(obj:any):void
		{
			for (var i = obj.list.length - 1; i >= 0; i--) {
				var pd:FirendData = FirendData.getFirendById(obj.list[i].id);
				for(var key in obj.list[i])
				{
					pd['m_' + key] = obj.list[i][key];
				}				
			}
			
		}

		public static getFirendByPID(pid:number):FirendData
		{
			for(var key in FirendData.s_list)
			{
				if(FirendData.s_list[key].m_pid == pid)
					return FirendData.s_list[key];
			}
			return;
		}
		public m_nickName:string;
		public m_flag:number;
		public m_statue:number;			
		public m_type:number;			//1 平台 2 游戏
		public m_group:number;
		public m_gz_id:number;
		public m_pId:number;
		public m_creatTime:number;
		public m_loginTime:number;
		public m_headUrl:string;
		public m_data:any;
		constructor() {
			super();
		}
	}
}