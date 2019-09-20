module qpq.data {
	/**
	 *
	 * @author 
	 *
	 */
	export class EffortData extends gamelib.data.GameData
	{
		public static s_list:Array<EffortData> = null;
		public static PaseData(data:any):void
		{
			EffortData.s_list = EffortData.s_list || [];
            EffortData.s_list.length = 0;
            for(var i: number = 0;i < data.effort_Num.length;i++)
            {
                var eff: EffortData = new qpq.data.EffortData(data.effort_Num[i])
                EffortData.s_list.push(eff);
            }
            EffortData.Order();
		}
        public static UpdateEffortData(data:any):void
        {
            var ed: EffortData = EffortData.getEffortDataById(data.effort_Id);
            if(ed == null)
            {
                console.log("更新成数据出错" + data.effort_Id);
                return;
            }
            ed.m_status = data.effort_Status;
            ed.m_finishNumber = data.effort_FinishNumber;
            ed.m_totalNumber = data.effort_TotalNumber;
            EffortData.Order();
        }
        public static UpdateStatus(id: number,type: number = 3): EffortData
		{
    		var ed:EffortData;
            for(var i: number = 0,len: number = EffortData.s_list.length;i < len;i++)
            {
                if(EffortData.s_list[i].m_id == id)
                {
                    EffortData.s_list[i].m_status = type;
                    ed = EffortData.s_list[i];
                    break;
                }
            }
            EffortData.Order();
            return ed
        }
        public static get s_getNum():number
        {
            var temp:number = 0;
            for(var i: number = 0,len: number = EffortData.s_list.length;i < len;i++)
            {
                if(EffortData.s_list[i].m_status == 3)
                {
                    temp += 1;
                }
            }
            return temp;
        }
        public static Order(): void
        {
            EffortData.s_list.sort(EffortData.SortFun);
        }
        public static getEffortDataById(id:number):EffortData
        {
            for(var i: number = 0;i < EffortData.s_list.length; i++)
            {
                if(EffortData.s_list[i].m_id == id)
                {
                    return EffortData.s_list[i];
                }
            }
            return new EffortData();
        }
        private static SortFun(a: EffortData, b: EffortData): number
        {
            if (a.m_status == 2 && b.m_status != 2)
            {
                return -1;
            }
            if (a.m_status != 2 && b.m_status == 2) {
                return 1;
            }
            if (a.m_status > b.m_status)
                return -1
            return a.m_id - b.m_id;
        }
		public constructor(data:any = null)
		{
			super();
            if(data)
			    this.update(data);
		}
		public update(data:any)
		{
            this.m_id = data.effort_Id;
            this.m_type = data.type;
            this.m_status = data.effort_Status;                        
            this.m_des = data.effort_Description;
            this.m_money = data.effort_RewardsMoney;           
            this.m_finishNumber = data.effort_FinishNumber;
            this.m_totalNumber = data.effort_TotalNumber;
            this.setFinishTime(data.effort_FinishTime * 1000);
            this.m_name = data.effort_Name;
		}

        /**
         * 类型
         * @type {number}
         */
		public m_type:number = 0;
        /**
         * 描述
         * @type {string}
         */
		public m_des:string = "";
        /**
         * 当前完成数量
         * @type {number}
         */
		public m_finishNumber:number = 0;
        /**
         * 当前完成数量
         * @type {number}
         */
		public m_totalNumber:number = 0;		//当前完成数量
		private _fisnishTime:string = "";
		public setFinishTime(value:number)				//完成时间
		{
            this._fisnishTime = utils.StringUtility.GetTimeString(value);
		}
		public get m_finishTime():string
		{
			return this._fisnishTime;
		}

        /**
         * 1进行中 2完成未领取 3已领取
         * @type {number}
         */
        public m_status: number = 0;
		public m_money:number = 0;
	}
}
