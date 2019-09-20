namespace gamelib.data
{
	export class MathData extends gamelib.data.GameData {
		public type:number;
		constructor() {
			super();
		}

		public static s_list:Array<MathData> = [];
		public static ParseList(data:any):void
		{
			MathData.s_list.length = 0;
			var type:number = data.type;
			var arr:Array<any> = data.list;
			for(var obj of arr)
			{
				var md:MathData = new MathData();
				md.type = type;
				utils.tools.copyTo(obj,md);
				MathData.s_list.push(md);
			}
		}
		public static GetMatchDataById(id:number,type?:number):MathData
		{
			for(var md of MathData.s_list)
			{
				if(md['id'] == id)
				{
					if(isNaN(type))
						return md;
					if(md['type'] == type)
						return md;
					continue;
				}
			}
			return null;
		}
	}
}