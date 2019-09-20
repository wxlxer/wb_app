/**
* 默认设置组
*/
namespace qpq.creator.parser{
	export class TimePickerGroup extends Group
	{		
		constructor(config:any){
			super(config)
		}
		protected build():void
		{
			super.build();
			for(var item of this._items)
            {
                (<TimePickerNode>item).setUpdateCallBack(this.onSliderChange,this);
            }
            
		}
        protected setDefaultValue():void
        {
         //   this.onSliderChange(this._items[0].config);

        }
		public toControl(node_name:string,value:number):void
        {
            super.toControl(node_name,value);
            for(var node of this._items)
            {
                var config:any = node.config;
                var arr:Array<any> = config.toControl;
                if(arr == null)
                    continue;
                for(var item of arr)
                {
                    if(item.relate_value == value)
                    {
                        var others:boolean = true;
                        if(item.others != null && item.others.length != 0)
                        {
                            others = false;
                            for(var temp of item.others)
                            {
                                var other_name = temp.name;
                                var target:NodeItem|Group = this.m_page.getNodeByName(other_name);
                                if(target && target.value == temp.value)
                                    others = true;
                            }
                        }
                        if(!others)
                            continue;
                        for(var key in item)
                        {
                        	if(key == 'value')
                        		continue;
                            node[key] = item[key];
                        }
                        if(item['value'])
                        	node.value = item['value']
                        config.value = item.value;
                        if(node.selected)
                        {
                            this.onSliderChange(node.config);
                        }

                    }
                }
            }
        }
		public onSliderChange(item:any):void
		{
			g_evtDispatcher.dispatch(evt_ItemClick,item);
		}
		public setValue(node_name:string,value:number):void
        {
            for(var i:number = 0; i < this._items.length; i++)
            {
                var node = this._items[i];
                if(node.name == node_name)
                {
                  //  node.config.value = node.value;
                  	node.value = value;
                    this._currentClickItem = node;
                  	g_evtDispatcher.dispatch(evt_ItemClick,node.config);
                    return;
                }
            }
        }
        

	}
}