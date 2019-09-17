namespace gamelib.core
{
    export class GameNet
    {
        public m_domain:string = "";
        private _signal:gamelib.core.Signal;
        private _listeners:Array<INet>;
        public constructor()
        {
            this._listeners  = [];
            this._signal = new gamelib.core.Signal();
        }

        public request(url:string,data:any):void
        {
            utils.tools.http_request(this.m_domain + url,data,"post",Laya.Handler.create(this,this.onReciveNetMsg,[url]))

        }
        private onReciveNetMsg(api:string,data:any):void
        {
            if(this._listeners == null)			
				return;
			var len:number =  this._listeners.length;
			for(var i:number = 0; i < len; i++)
			{
				if(this._listeners == null || this._listeners[i] == null)
					continue;
				this._listeners[i].reciveNetMsg(api,data);
			}
        }
        public addListener(target:INet):void
		{
			if(this._listeners.indexOf(target) == -1)
			{
				this._listeners.push(target);

				//从大到小
				this._listeners.sort(function(a:INet,b:INet):number
				{
					return b.priority - a.priority;
				})
			}

		}
		public removeListener(target:INet):void
		{
			if(this._listeners == null)			
				return;
			var index:number = this._listeners.indexOf(target);
			if(index != -1)
				this._listeners.splice(index,1);
			console.log(this._listeners);
		}
    }

    /**
	 * @interface INet
	 * 可以接受网络数据的接口
	 */
    export interface  INet
    {
        priority:number;
        reciveNetMsg(api:string,data:any):void;
    }

}