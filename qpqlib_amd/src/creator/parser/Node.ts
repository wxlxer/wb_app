/**
 * Created by wxlan on 2017/8/8.
 */
namespace qpq.creator.parser
{
    export function getNode(config:any):any
    {
        switch (config.parent_config.type)
        {
            case "label":
                return new LabelNode(config);
            case "input":
                return new TextInputNode(config);
            case "slider":
                return new SliderNode(config);
            case "stepping":
                return new SteppingNode(config);
            case "attribute":
                return new AttributeNode(config);
            case "timepicker":
                return new TimePickerNode(config);
            case "pointlist":
                 return new PointListNode(config);
            default:
                return new NodeItem(config);

        }
    }
    export class NodeItem extends laya.display.Sprite
    {
        protected _config:any;
        protected _button:laya.ui.CheckBox;
        protected _side_label:laya.ui.Label;

        private _label_padding:string = "20,0,0,0";
        private _enabled:boolean;

        protected _offX:number = 0;
        public constructor(config:any)
        {
            super();
            this._config = config;
            this._offX = g_groupStartX;
            this.build();
        }
        public destroy():void
        {
            this._config = null;
            this._button = null;
            this._side_label = null;
        }
        protected build():void
        {
            switch (this._config.parent_config.type)
            {
                case "chooser": //单选按钮
                case "order_chooser":
                    this._button = new laya.ui.CheckBox("qpq/comp/checkbox_1.png");
                    
                    break;
                case "selector": //checkbox
                case "order_selector":
                    this._button = new laya.ui.CheckBox("qpq/comp/checkBox_2.png");
                    break;
            }
            if(this._button)
            {
                this._button.stateNum = 3;
                var label_colors:string = colors.button +"," +colors.button + "," + colors.button ;
                this._button.labelColors = label_colors;
                this._button.labelSize = sizes.font_size;
                this._button.labelPadding = this._label_padding;
                this.addChild(this._button);
            }
        }
        public setConfig(config:any):void
        {
            this.name = config.name;
            this._config = config;
            this.label = config.label;
            this.side_label = config.side_label;
            this._enabled = true;
            this.position = config.pos;
        }
        public set position(value:string)
        {
            if(value)
            {
                var temp =  this.getPos(value);
                this.x = temp.x;
                this.y = temp.y;
            }
        }
        public get config():any{
            return this._config;
        }

        private getPos(pos:string):{x:number,y:number}
        {
            var arr:Array<string>;
            if(pos.indexOf(",") != -1)
            {
                arr = pos.split(",");
                return {x:parseFloat(arr[0]),y:parseFloat(arr[1])};
            }
            arr = pos.split("_");
            var rows:number = this._config.parent_config["rows"];
            var cols:number = this._config.parent_config["cols"];
            if(isNaN(rows) && isNaN(cols))
            {
                var type:number = parseInt(arr[0]);
                var index:number = parseInt(arr[1]);
                var yIndex:number = parseInt(arr[2]);
                if(isNaN(yIndex))
                    yIndex = 0;
                return {x:g_posList[type][index],y:yIndex * groupHeight};
            }

            var row_index:number = parseInt(arr[0]);
            var col_index:number = parseInt(arr[1]);

            var itemWidth:number = (g_groupWidth - this._offX) / cols;

            var ret:any = {};
            ret.x = this._offX + col_index * itemWidth;
            ret.y = 0 + row_index * rowHeight;
            return ret;            
        }
        public get value():any 
        {
            if (this._button == null)
                return 0;
            if(this._button.selected)
            {
                if(this._config.parent_config.type == "selector" || this._config.parent_config.type == "order_selector")
                    return 1;
                return this._config.value;
            }
            return 0;
        }
        public set value(args:any)
        {
            //this.config.value = args;
        }
        public set selected(value:any)
        {
           value = Boolean(value);
           if(this._button == null)
                return;
           this._button.selected = value;
        }
        public get selected():any
        {
            if(this._button)
                return  this._button.selected
            return false;
        }


        public set enabled(value:any)
        {
            this._enabled = value = Boolean(value);
            if(this._button == null)
                return;
            if(this._button.disabled == !value)
                return;
            this._button.disabled = !value;
            this._button.gray = false;
            if(this._button.disabled)
            {
                this._button.selected = false;
                this._button["state"] = 1;
            }
            else
            {
                this._button["state"] = this._button.selected ? 2: 0;
            }
        }
        public get enabled():any
        {
            return  this._enabled;
        }
        public set label(value:string)
        {
            this._button.label = value;
        }
        public set side_label(value:string)
        {
            if(value != null)
            {
                if(this._side_label == null)
                    this.addSideLabel();
                this._side_label.text = value;
                if(this._button)
                {
                    this._side_label.x = this._button.x + this._button.width + 5;
                    this._side_label.y = this._button.y + this._button.height - this._side_label.height;
                }
            }
            else{
                if(this._side_label != null)
                    this._side_label.text = "";
            }
        }

        protected addSideLabel():void
        {
            var txt = new laya.ui.Label();
            for(var key in side_label_style_default) {/*设置默认风格*/
                txt[key] = side_label_style_default[key];
            }
            txt.color = colors.button;
            this.addChild(txt);
            this._side_label = txt;
        }
    }
    export class LabelNode extends NodeItem
    {
        protected _label:Laya.Label;
        public constructor(config)
        {
            super(config);
        }
        protected build()
        {
            this._label = new Laya.Label();
            this._label.fontSize = 24;
            this._label.color = colors.label;
            this.addChild(this._label);
        }        

        public set value(args:number)
        {
            this._config.value = args;            
        }
        public get value():number {
            return this._config.value;
        }
        public set label(value:string)
        {
            this._label.text = value;
            this._label.y = (groupHeight - this._label.height) / 2
        }
        public set side_label(value:string)
        {
            if(value != null)
            {
                if(this._side_label == null)
                    this.addSideLabel();
                this._side_label.text = value;
                this._side_label.x = this._label.x + this._label.width + 5;
                this._side_label.y = this._label.y + this._label.height - this._side_label.height - 10;
            }
            else
            {
                if(this._side_label != null)
                    this._side_label.text = "";
            }
        }
    }
    export class TextInputNode extends LabelNode {
        
         private _input_bg:Laya.Image;
        constructor(config)
        {
            super(config);
        }
        protected build()
        {
            this._input_bg = new Laya.Image();
            this._input_bg.skin = "qpq/hall/bg_create.png";
            this._input_bg.sizeGrid = "18,18,18,18";
            this.addChild(this._input_bg);

            var temp = this._label = new Laya.TextInput();
            this._label.fontSize = 24;
            this._label.height = 26;

            if(isNaN(this._config.width))
                this._label.width = 200;
            else
                this._label.width = this._config.width;

            this._label.color = colors.label;
            this._label.align = "center";
            this._label.y = 1;
            if(isNaN(this._config.maxChars))
                temp.maxChars = 10;
            else
                temp.maxChars = this._config.maxChars;
            temp.prompt = this.config.prompt;
            this.addChild(this._label);

            this._input_bg.height = this._label.height + 4;
            this._input_bg.width = this._label.width + 8;

            this._input_bg.y = 10;

            // this._label.y = this._input_bg.y + (this._input_bg.height - this._label.height) / 2


        }
        public get value():any {
            return this._label.text;
        }
        
    }
    export class SteppingNode extends NodeItem
    {
        private _title:Laya.Label;
        private _input:Laya.Label;
        private _input_bg:Laya.Image;
        private _input_btn:Laya.Button;

        private _label_width:number;

        private _value:number;
        private _step:number;
        private _value_min:number;
        private _value_max:number;

        private _callBack:Function;
        private _thisObj:any;
        constructor(config) {
            super(config);
        }

        protected build():void
        {
            this._title = new Laya.Label();            
            this._input = new Laya.Label();
            this._input_bg = new Laya.Image();
            this._input_btn = new Laya.Button();

            this._input_bg.skin = "qpq/hall/bg_create.png";
            this._input_bg.sizeGrid = "18,18,18,18";

            this._input_btn.skin = "qpq/hall/btn_keyboard.png";
            this._input_btn.stateNum = 2;
            this._label_width = 150;

            this._title.color = colors.button;
            this._input.color = colors.button;
            this._title.fontSize = this._input.fontSize = 24;
            this._input.mouseEnabled = false;

            this.addChild(this._title);            
            this.addChild(this._input_bg);
            this.addChild(this._input);
            this.addChild(this._input_btn);
            this.adjuest();

            this._input_btn.on(Laya.Event.CLICK,this,this.onClickInput);
            this._input_bg.on(Laya.Event.CLICK,this,this.onClickInput);
        }
        public setUpdateCallBack(callBack:Function,thisobj:any):void
        {
            this._callBack = callBack;
            this._thisObj = thisobj;
        }
        
        private onClickInput(evt:Laya.Event):void
        {
            g_signal.dispatch(qpq.SignalMsg.showKeypad_Input,[
                Laya.Handler.create(this,this.onInputValue),
                this._config.title,
                this._value_max+"",
            ]);
        }
        private onInputValue(value:number):void
        {
            this.value = value;
        }
        public setConfig(config:any):void
        {
            this.name = config.name;
            this._config = config;
            this._title.text = config.title ? config.title : "";
            
            this.adjuest();
            this.position = config.pos;

            this._step = config.step;
            this._value_min = config.value_min;
            this._value_max = config.value_max;
            this.value = config.value;       
        }

        public get value():number 
        {
           //return parseInt(this._input.text);
           return this._value;
        }
        public set value(args:number)
        {
            if(this._value_max && args >= this._value_max)
                args = this._value_max;
            if(args < this._value_min)
                args = this._value_min;
            if(args == this._value)
                return;
            this._value = args;
            // this._input.text = args +"";
            this._input.text = utils.tools.getMoneyByExchangeRate(args);
            this._input.y =  (this._input_bg.height - this._input.height) / 2;
            this._input.x =  this._input_bg.x + (this._input_bg.width - this._input.width) / 2;

            if(this._callBack)
            {
                this._callBack.call(this._thisObj,this);
            }
        }
        public set value_min(value:number)
        {
            this._value_min = value;
        }
        public set value_max(value:number)
        {
            this._value_max = value;
        }
        private adjuest():void
        {
            var temp:number = 0;
            this._title.x = temp;
            temp += this._title.width + 5;

            this._label_width = Math.max(150,this._input.width);
            this._input_bg.x = temp;
            this._input_bg.width = this._label_width + 4;

            this._input.x = temp + 2;
            temp += this._label_width + 4;

            this._input_btn.x = temp;
            this._title.y = (this._input_bg.height - this._title.height) / 2;
        }
    }
    export class TimePickerNode extends NodeItem
    {
        private _title:Laya.Label;
        private _input:Laya.Label;
        private _input_bg:Laya.Image;
        private _input_btn:Laya.Button;

        private _label_width:number;

        private _value:string;

        private _callBack:Function;
        private _thisObj:any;
        constructor(config) {
            super(config);
        }

        protected build():void
        {
            this._title = new Laya.Label();            
            this._input = new Laya.Label();
            this._input_bg = new Laya.Image();
            this._input_btn = new Laya.Button();

            this._input_bg.skin = "qpq/hall/bg_create.png";
            this._input_bg.sizeGrid = "18,18,18,18";

            this._input_btn.skin = "qpq/hall/btn_keyboard.png";
            this._input_btn.stateNum = 2;
            this._label_width = 150;

            this._title.color = colors.button;
            this._input.color = colors.button;
            this._title.fontSize = this._input.fontSize = 24;
            this._input.mouseEnabled = false;

            this.addChild(this._title);            
            this.addChild(this._input_bg);
            this.addChild(this._input);
            this.addChild(this._input_btn);
            this.adjuest();

            this._input_btn.on(Laya.Event.CLICK,this,this.onClickInput);
            this._input_bg.on(Laya.Event.CLICK,this,this.onClickInput);
        }
        public setUpdateCallBack(callBack:Function,thisobj:any):void
        {
            this._callBack = callBack;
            this._thisObj = thisobj;
        }
        
        private onClickInput(evt:Laya.Event):void
        {
            g_signal.dispatch(SignalMsg.showTimerPicker,[Laya.Handler.create(this,this.onInputValue),this._config.default_value,this._config.offsize]);
        }
        private onInputValue(value:string):void
        {
            this.value = value;
        }
        public setConfig(config:any):void
        {
            this.name = config.name;
            this._config = config;
            this._title.text = config.title ? config.title : "";
            
            this.adjuest();
            this.position = config.pos;
            this.value = config.value;       
        }
        public set default_value(value:string)
        {
            this.config.default_value = value;
            this.value = "";
        }

        public get value():string 
        {
           return this._input.text;
        }
        public set value(args:string)
        {
            
            if((args == "" || args == undefined) && this.config.default_value == "server_time")
            {
                var date:Date = new Date();
                var tmc:number = Laya.timer.currTimer - GameVar.s_loginClientTime + GameVar.s_loginSeverTime*1000;
                if(this.config.offsize)
                {
                    tmc += this.config.offsize * 1000;
                }
                date.setTime(tmc);
                var temp:number = date.getHours();
                args = temp < 10 ? "0" + temp : "" + temp;
                args += ":";

                temp = date.getMinutes();
                args += (temp < 10 ? "0" + temp : "" + temp);
            }
            this._value = args;
            this._input.text = args +"";
            this._input.y =  (this._input_bg.height - this._input.height) / 2;
            this._input.x =  this._input_bg.x + (this._input_bg.width - this._input.width) / 2;
            if(this._config.changeAtt)
                this._config.changeAtt.value = args;
            if(this._callBack)
            {
                this._callBack.call(this._thisObj,this.config);
            }
        }
        private adjuest():void
        {
            var temp:number = 0;
            this._title.x = temp;
            temp += this._title.width + 5;

            this._label_width = Math.max(150,this._input.width);
            this._input_bg.x = temp;
            this._input_bg.width = this._label_width + 4;

            this._input.x = temp + 2;
            temp += this._label_width + 4;

            this._input_btn.x = temp;
            this._title.y = (this._input_bg.height - this._title.height) / 2;
        }


    }
    export class AttributeNode extends NodeItem
    {
        private _title:Laya.Label;
        private _input:Laya.Label;
        private _input_bg:Laya.Image;

        private _label_width:number;

        private _value:number;
        public constructor(config)
        {
            super(config);
        }
        public setConfig(config:any):void
        {
            this.name = config.name;
            this._config = config;
            this._title.text = config.title ? config.title : "";
            
            this.adjuest();
            this.position = config.pos;
            this.value = config.value;       
        }
        public get value():number 
        {
           //return parseInt(this._input.text);
           return this._value;
        }
        public set value(args:number)
        {
            this._value = args;
            // this._input.text = args +"";
            this._input.text = utils.tools.getMoneyByExchangeRate(args);
            this._input.y =  (this._input_bg.height - this._input.height) / 2;
            this._input.x =  this._input_bg.x + (this._input_bg.width - this._input.width) / 2;
        }

        protected build():void
        {
            this._title = new Laya.Label();            
            this._input = new Laya.Label();
            this._input_bg = new Laya.Image();

            this._input_bg.skin = "qpq/hall/bg_create.png";
            this._input_bg.sizeGrid = "18,18,18,18";
            this._label_width = 150;

            this._title.color = colors.button;
            this._input.color = colors.button;
            this._title.fontSize = this._input.fontSize = 24;
            this._input.mouseEnabled = false;

            this.addChild(this._title);            
            this.addChild(this._input_bg);
            this.addChild(this._input);
            this.adjuest();
        }
        private adjuest():void
        {
            var temp:number = 0;
            this._title.x = temp;
            temp += this._title.width + 5;

            this._label_width = Math.max(150,this._input.width);
            this._input_bg.x = temp;
            this._input_bg.width = this._label_width + 4;

            this._input.x = temp + 2;
            temp += this._label_width + 4;

            this._title.y = (this._input_bg.height - this._title.height) / 2;
        }
    }
    export class SliderNode extends NodeItem
    {
        protected _res:laya.ui.UIComponent;
        protected _slider:gamelib.control.Slider;

        public constructor(config)
        {
            super(config);
        }
        public get slider():gamelib.control.Slider
        {
            return this._slider;
        }

        protected build()
        {
            var className:string = this._config.skinname ? this._config.skinname : "qpq/Art_Bar";
            this._res = new (gamelib.getDefinitionByName(className))();
            this.addChild(this._res);
            this._slider = new gamelib.control.Slider(this._res);
        }
        public setConfig(config:any):void
        {
            this.name = config.name;
            this._config = config;
            this._slider.setLabel(config.label);
            this._slider.setParams(config.minimum,config.maximum);
            this.side_label = config.side_label;
            this.position = config.pos;
        }
        public set value(args:number)
        {
            this._slider.value = args;
        }
        public get value():number
        {
            return this._slider.value;
        }
        public set selected(value:boolean)
        {

        }
        public set enabled(value:boolean)
        {
            if(value)
            {
                this._slider.show();
                this._slider.value = this.config.minimum;
            }
            else
            {
                this._slider.close();

            }
            this._slider.enabled = value;
        }
        public set label(value:string)
        {
            this._slider.setLabel(value);
        }
        public set side_label(value:string)
        {
            if(value != null)
            {
                if(this._side_label == null)
                    this.addSideLabel();
                this._side_label.text = value;
                this._side_label.x = this._res.x + this._res.width + 5;
                this._side_label.y = this._res.y + this._res.height - this._side_label.height - 10;
            }
            else
            {
                if(this._side_label != null)
                    this._side_label.text = "";
            }
        }
    }

}
