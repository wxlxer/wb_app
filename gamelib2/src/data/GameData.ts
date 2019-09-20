module gamelib.data
{
	/**
	 * @class
	 * 数据基类
	 */
	export class GameData{
		public _id:number = 0;		
        public _name:string;
        public _resId:number = 0;
		/**
		 * @property {number} m_id
		 * 序列号
		 */
		public get m_id():number{
			return this._id;
		}
		public set m_id(value:number)
		{
			this._id = value;
		}
		/**
		 * @property {number} m_resId
		 * 资源id
		 *
		 */
		public set m_resId(value:number)
		{
			this._resId = value;
		}
		public get m_resId():number{
			return this._resId;
		}		
		
		/**
		 * @property {string} m_name
		 * 对象名
		 */		
		public get m_name():string{
			return this._name;
		}
		public set m_name(value:string){
			this._name = value;
		}		

		public constructor(){
		}
		/**
		 * @method
		 * 清理数据
		 */
		public clear():void{			
			this._resId = 0;
			this._name = '';
		}

		/**
		 * @method
		 * 销毁数据
		 */
		public destroy():void{
            this._id = 0;
			this.clear();
		}

		/**
		 * 输出对象
		 * @returns {string}
		 */
		public toString():string{
			return "name: "+this._name +" id:" + this.m_id;
		}
	}
}