namespace qpq.data
{
	/**
	 * 组局信息
	 */
	export class GroupInfoData{
		
		public static addGroupInfo(info:any):void
		{
			GroupInfoData.s_list[info.groupId] = info;
		}
		public static getInfoByGroupId(groupId:number):any
		{
			return GroupInfoData.s_list[groupId];
		}
		public static getInfoByGz_id(gz_id:number,validation:number):any
		{
			for(var key in GroupInfoData.s_list)
			{
				if(GroupInfoData.s_list[key].gz_id == gz_id && GroupInfoData.s_list[key].gz_id == gz_id && GroupInfoData.s_list[key].validation == validation)
					return  GroupInfoData.s_list[key];
				return null;
			}
		}
		public static removeGameInfo(groupId:number):void
		{
			delete GroupInfoData.s_list[groupId]
		}

		private static s_list:any = {};
		constructor() {
			
		}
	}
}
