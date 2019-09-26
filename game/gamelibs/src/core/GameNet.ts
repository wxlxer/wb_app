namespace gamelib.core
{
    export class GameNet
    {
        private _signal:gamelib.core.Signal;
        private _listeners:Array<INet>;
        public constructor()
        {
            this._listeners  = [];
            this._signal = new gamelib.core.Signal();
        }

        public request(url:string,data:any):void
        {
			data.devices = data.devices || "HTML5";
			
            utils.tools.http_request(GameVar.s_domain + url,data,"post",Laya.Handler.create(this,this.onReciveNetMsg,[url,data]))
		}
		public requestWithToken(url:string,data:any):void
		{
			data.devices = data.devices || "HTML5";
			utils.tools.http_request(GameVar.s_domain + url+ "/" + GameVar.s_token,data,"post",Laya.Handler.create(this,this.onReciveNetMsg,[url,data]))
		}
        private onReciveNetMsg(api:string,requestData:any,data:any):void
        {
            if(this._listeners == null)			
				return;
			var len:number =  this._listeners.length;
			for(var i:number = 0; i < len; i++)
			{
				if(this._listeners == null || this._listeners[i] == null)
					continue;
				this._listeners[i].reciveNetMsg(api,requestData,data);
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
        reciveNetMsg(api:string,requestData:any,data:any):void;
    }

}