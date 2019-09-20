namespace qpq.creator.parser
{
    export class PointListGroup extends Group
    {
        public constructor(config:any)
        {
            super(config)
        }
        protected build():void
        {
            this._config.items = [this._config];
            super.build();
            this._items[0].x = this._config.x || 0;
            this._items[0].y = this._config.y || 0;
            this.timer.callLater(this,this.updateBgSize);
        }
        public setValue(node_name:string,value:any):void
        {
            this._items[0].value = value;
        }
        public get value():number
        {
            return this._items[0].value;
        }
    }

}