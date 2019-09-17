module gamelib.core
{
	/**
	 *
	 * 
	 * 信号，用于不同对象间的通信。
	 * m_signal.add(functionA,caller);
	 * m_signal.dispatch(eventname,eventdata);
	 * @class
	 * @author wx
	 *
	 */
	export class Signal 
    {
		private _listenerList:Array<any> = [];
		private _index:number = 0;
		public constructor() {
            
		}

		/**
		 * 添加监听
		 * @function add
		 * @param {function} listener
		 * @param {any} caller
		 */
        public add(listener: Function,caller: any): void
        {
            if(this.hasListener(listener,caller))
                return;
			var obj = {};
			obj["listener"] = listener;
			obj["caller"] = caller;
			obj["priority"] = 0;// this._index++;
			this._listenerList.push(obj);
			this._listenerList = this._listenerList.sort(function (a, b) {
				if (a.priority <= b.priority)
					return 1;
				return -1;

			});
        }

		/**
		 * 是否已经有监听了
		 * @function add
		 * @param {function} listener
		 * @param {any} caller
		 * @returns {boolean}
		 */
        public hasListener(listener: Function,caller: any):boolean
        {
            for(var i = 0;i < this._listenerList.length;i++)
            {
                var obj = this._listenerList[i];
                if(obj.caller == caller && obj.listener == listener)
                    return true;
            }
            return false;
        }

		/**
		 * 移除监听
		 * @function remove
		 * @param {function} listener
		 */
        public remove(listener:Function,caller?: any):void
		{
			for(var i = 0; i <this._listenerList.length;i++)
			{
				var obj = this._listenerList[i];
				if(caller == null)
				{
					if(obj.listener == listener)
					{
						this._listenerList.splice(i,1);
						break;
					}
				}
				else
				{
					if(obj.caller == caller && obj.listener == listener)
					{
						this._listenerList.splice(i,1);
						break;
					}
				}
			}
			this._listenerList = this._listenerList.sort(function (a, b) {
				if (a.priority < b.priority)
					return 1;
				return -1;

			});
		}

		/**
		 * 指定优先级来添加监听
		 * @function addWithPriority
		 * @param {function} listener
		 * @param {any} caller
		 * @param {number} priority值越大，越先调用
		 */
		public addWithPriority (listener:Function,caller:any,priority:number):void
		{
			var obj = {};
			obj["listener"] = listener;
			obj["caller"] = caller;
			obj["priority"] = priority;// + this._index++;
			this._listenerList.push(obj);
		}

		/**
		 * 发送事件	
		 * @function dispatch
		 * @param args
		 */
		public dispatch(...args):void {
			
			for (var i = 0; i < this._listenerList.length; i++)
			{
				var obj = this._listenerList[i];
				obj.listener.apply(obj.caller, arguments);
			}
		}
	}
    
}
