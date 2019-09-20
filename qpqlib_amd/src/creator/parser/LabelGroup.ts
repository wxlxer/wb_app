/**
 * Created by wxlan on 2017/8/21.
 */
namespace qpq.creator.parser
{
    export class LabelGroup extends Group
    {
        public constructor(config:any)
        {
            super(config);
        }
        protected setDefaultValue():void
        {
            console.log("LabelGroup setDefaultValue");
            if(this._config.name)
            {
                 this._currentClickItem = this._items[0];
                 this.onValueChange();
            }
            else
            {
                for(var i:number = 0; i < this._items.length; i++)
                {
                    this._currentClickItem = this._items[i];
                    this.onValueChange();
                }
            }
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
                        for(var key in item)
                        {
                            node[key] = item[key];
                        }
                        if(!isNaN(item.value))
                            config.value = item.value;
                        continue;
                    }
                }
            }
        }
    }
}
