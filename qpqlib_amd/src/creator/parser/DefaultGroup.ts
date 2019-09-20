/**
* 默认设置组
*/
namespace qpq.creator.parser{
	export class DefaultGroup extends Group{
		
		constructor(config:any){
			super(config)
		}
		public setValue(node_name:string,value:number):void
        {
        	var node:any = this.getChild(node_name);
        	node.value = value;
        }
		public toControl(node_name:string,value:number):void
		{
			var node:any = this.getChild(node_name);
			var arr:Array<any> = node.toControl;
			if(arr == null)
				return;
			for(var item of arr)
			{
				if(item.relate_value == value)
				{
					for(var key in item)
					{
						node[key] = item[key];
					}
					continue;
				}
			}
		}
		protected build():void
		{

		}
		public hasChild(name:string):boolean
        {
            for(var node of this._config.items)
            {
                if(node.name == name)
                    return true;
            }
            return false;
        }
        public getChild(name:string):NodeItem
        {
            for(var node of this._config.items)
            {
                if(node.name == name)
                    return node;
            }
            return null;
        }
		public getNodes():Array<NodeItem>
        {
            return this._config.items;
        }
		protected setDefaultValue()
		{
			for(var item of this._config.items)
			{
				g_evtDispatcher.dispatch(evt_ItemClick,item);
			}
		}

	}
}