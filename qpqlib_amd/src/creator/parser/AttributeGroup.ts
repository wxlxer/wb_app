///<reference path="Group.ts" />
namespace qpq.creator.parser
{
	export class AttributeGroup extends Group
	{		
		public constructor(config:any)
        {
            super(config);
        }

        public setValue(node_name:string,value:number):void
        {
            for(var node of this._items)
            {
                if(node.name == node_name)
                {
                    node.value = value;
                }
            }
        }
	}
}