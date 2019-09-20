/**
 * Created by wxlan on 2017/8/8.
 */
namespace qpq.creator.parser
{
    /**
     * 复选框
     */
    export class SelectorGroup extends Group
    {
        public constructor(config:any)
        {
            super(config);
            this.setDefaultValue();
        }

        public show():void
        {
            super.show();
            this.setDefaultValue();
        }
        public setValue(node_name:string,value:number):void
        {
            for(var i:number = 0; i < this._items.length; i++)
            {
                var node = this._items[i];
                if(node.name == node_name)
                {
                    node.selected = value != 0;
                    node.config.value = node.value;
                    this._currentClickItem = node;
                    this.onValueChange();
                    return;
                }
            }
        }
        public toControl(node_name:string,value:number):void
        {
            super.toControl(node_name,value);

            for(var node of this._items)
            {
                if(node.config.name != node_name || node.config.toControl == null)
                    continue;
                for(var item of node.config.toControl)
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
                            node[key] = item[key];
                        }
                    }
                }
            }
        }
        protected setDefaultValue():void
        {
            for(var i:number = 0; i < this._items.length; i++)
            {
                var node = this._items[i];
                node.selected = node.config.selected;
                node.config.value = node.value;
                this._currentClickItem = node;
                this.onValueChange();
            }

        }
        protected onItemChange(evt:laya.events.Event):void
        {
            this._currentClickItem = <NodeItem>evt.currentTarget;
            this._currentClickItem["config"].value = this._currentClickItem.value;
            playButtonSound();
            this.onValueChange();
        }

    }
}
