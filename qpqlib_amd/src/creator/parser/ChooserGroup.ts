/**
 * Created by wxlan on 2017/8/8.
 */
namespace qpq.creator.parser
{
    /**
     * 单选框
     */
    export class ChooserGroup extends Group
    {
        public constructor(config:any)
        {
            super(config);

            //这里执行，只会选中默认配置中的值，toControl是不会执行的
            this.setDefaultValue();
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
                            node[key] = item[key];
                        }
                        config.value = item.value;
                        if(node.selected)
                        {
                            this._currentClickItem = node;
                            this.onValueChange();
                        }

                    }
                }
            }
        }
        public get value():number
        {
            return this._currentClickItem.value;
        }
        //public show():void
        //{
        //    super.show();
        //    this.setDefaultValue();
        //}
        public setValue(node_name:string,value:any):void
        {
            this._currentClickItem.value = value;
            for(var i:number = 0; i < this._items.length; i++)
            {
                var node = this._items[i];
                if(node.config.value == value)
                {
                    this.chooseAt(i)
                    return;
                }
            }
        }
        protected setDefaultValue():void
        {
            var index:number = 0;
            for(var i:number = 0; i < this._items.length; i++)
            {
                var node = this._items[i];
                if(node.config.selected == true)
                {
                    index = i;
                }
            }
            if(this._items[index].enabled != false)
                this.chooseAt(index);
        }
        protected onItemChange(evt:laya.events.Event):void
        {
            if(this._currentClickItem == evt.currentTarget)
            {
                this._currentClickItem.selected = true;
                return;
            }
            if(this._currentClickItem != null)
                this._currentClickItem.selected = false;
            this._currentClickItem = <NodeItem>evt.currentTarget;
            playButtonSound();
            this.onValueChange();
        }
        protected chooseAt(index:number):void
        {
            if(this._currentClickItem != null)
                this._currentClickItem.selected = false;
            this._currentClickItem = this._items[index];
            this._currentClickItem.selected = true;
            this.onValueChange();
        }
    }

}
