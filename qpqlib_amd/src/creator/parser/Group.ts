/**
 * Created by wxlan on 2017/8/8.
 */
namespace qpq.creator.parser
{
    export var g_groupWidth:number = 0;
    export var g_groupStartX:number = 0;
    export var g_posList:any;
    export var groupHeight:number = 50;
    export var rowHeight:number = 50;
    export var side_label_style_default:any = {
        "textColor":"#C1E2FE",
        "height":30,
        "size":17.5,
        "verticalAlign":"bottom",
        "name":"side_label"
    };
    export var colors:{title:string,button:string,label:string} =
    {
        "title":"#694121",
        "button":"#694121",
        "label":"#ca3e08"
    }
    export var sizes:{font_size:number,title_size:number} =
    {
        "font_size":24,
        "title_size":24
    }
    export var g_evtDispatcher:gamelib.core.Signal;
    export var evt_ItemClick:string = "evt_ItemClick";
    export var evt_UpdateRoundCost:string = "evt_UpdateRoundCost";
    export class Group extends laya.display.Sprite
    {
        protected _title:laya.display.Text;
        protected _items:Array<NodeItem>;
        protected _type:string;
        protected _config:any;
        protected _bg:Laya.Image;

        protected _currentClickItem:qpq.creator.parser.NodeItem;
        public m_page:Page;
        public constructor(config:any)
        {
            super();
            
            this._config = config;
            if(this._config.bgSkin)
            {
                this.createBackGround();
            }
            if(this._config.title)
            {
                this._title = new laya.display.Text();
                this.addChild(this._title);
                this._title.fontSize = sizes.title_size;
                this._title.color = colors.title;
                this._title.text = this._config.title ? this._config.title:"";
                this._title.y = (groupHeight - this._title.height) / 2;
                this._title.x = 42;
            }
            
            this._items = [];
            this.name = this._config.name;
            this._type = this._config.type;
            this.build();

        }
        protected setDefaultValue():void
        {

        }
        /**
         * 设置数据值，仅用于应用用户习惯
         **/
        public setValue(node_name:string,value:number):void
        {

        }
        public toControl(node_name:string,value:number):void
        {
            var controls:Array<any> = this._config.toControl;
            if(controls == null)
                return;
            for(var item of controls)
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
                            var node:NodeItem|Group = this.m_page.getNodeByName(other_name);
                            if(node && node.value == temp.value)
                                others = true;
                        }
                    }
                    if(!others)
                        continue;
                    for(var key in item)
                    {
                        this[key] = item[key];
                    }

                }
            }

        }
        public set enabled(value:boolean)
        {
            for(var item of this._items)
            {
                item.enabled = value;
            }
        }
        public set value(args:number)
        {
            for(var item of this._items)
            {
                item.value = args;
            }
        }
        public get value():number
        {
            return 0;
        }
        public set label(value:string)
        {

        }

        protected build():void
        {
            var node:NodeItem;
            for(var i:number = 0; i < this._config.items.length; i++)
            {
                var config:any = this._config.items[i];
                config.parent_config = this._config;
                node = getNode(config);
                if(config.name == null)
                {
                    config.name = this._config.name;
                }
                config.valueIndex = i;
                node.setConfig(config);
                this.addChild(node);
                this._items.push(node);
            }
            this.timer.callLater(this,this.updateBgSize);
        }
        protected updateBgSize():void
        {
            if(this._bg)
            {
                var rec:Laya.Rectangle = this.getBounds();
                this._bg.height = rec.height;
            }
        }
        public getConfig():any
        {
            return this._config;
        }
        public getNodes():any
        {
            return this._items;
        }
        public show():void
        {
            for(var temp of this._items)
            {
                temp.on(laya.events.Event.CLICK,this,this.onItemChange);
            }
            this.setDefaultValue();
        }
        public close():void
        {
          //  this._currentClickItem = null;
            for(var temp of this._items)
            {
                temp.selected = false;
                temp.off(laya.events.Event.CLICK,this,this.onItemChange);
            }
        }
        public destroy():void
        {
            for(var temp of this._items)
            {
                temp.destroy();
            }
            this._items.length = 0;
            this._items = null;
            this.m_page = null;
        }
        public get type():string
        {
            return this._type;
        }
        public hasChild(name:string):boolean
        {
            for(var node of this._items)
            {
                if(node.name == name)
                    return true;
            }
            return false;
        }
        public getChild(name:string):NodeItem
        {
            for(var node of this._items)
            {
                if(node.name == name)
                    return node;
            }
            return null;
        }
        protected onItemChange(evt:laya.events.Event):void
        {
            this._currentClickItem = <NodeItem>evt.currentTarget;
            playButtonSound();
            this.onValueChange();
        }
        protected onValueChange():void
        {
            g_evtDispatcher.dispatch(evt_ItemClick,this._currentClickItem.config);
        }
        private createBackGround():void
        {
            var bg:Laya.Image = new Laya.Image();
            bg.width = g_groupWidth;
            bg.skin = this._config.bgSkin;
            bg.sizeGrid = "9,9,9,9"
            this.addChild(bg);
            this._bg = bg;
        }
    }
}
