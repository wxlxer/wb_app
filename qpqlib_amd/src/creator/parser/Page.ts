/**
 * Created by wxlan on 2017/8/8.
 */
namespace qpq.creator.parser
{
    export class Page extends laya.display.Sprite
    {
        public static extraDatas:any;
        private _totalHeight:number;
        private _list:Array<Group>;

        private _config:any;
        private _net_data:any;
        private _common_data:Array<string>;
        public constructor(totalHeight:number)
        {
            super();
            this._totalHeight = totalHeight;
            this._list = [];
            g_evtDispatcher = new gamelib.core.Signal();
            this._common_data = ["gz_id","game_id","money_type","mode_id","room_name"];
        }
        public show():void
        {
            g_evtDispatcher.add(this.onLocalMsg,this);
            for(var g of this._list)
            {
                g.show();
            }
            var defaultConfig:any = qpq.g_qpqData.getHabitData(this._config);
            if(defaultConfig != null)
            {
                this.applyDefaultConfig(defaultConfig);
            }
        }


        public close():void
        {
            g_evtDispatcher.remove(this.onLocalMsg);
            for(var g of this._list)
            {
                g.close();
            }
        }
        public getConfig():any
        {
            return this._config;
        }
        public setConfig(config:any):void {
            var group:Group;
            this._config = config;

            groupHeight = config['groupHeight'] || 50;
            rowHeight = config['rowHeight'] || 50;

            if(this._config.roundCostName == null)
                this._config.roundCostName = "round_num";
            while (this.numChildren) {
                group = <Group>this.removeChildAt(0);
                group.close();
                group.destroy();
            }
            this._net_data = {};
            for(var key of this._common_data)
                this._net_data[key] = config[key];

            this._list.length = 0;
            var index:number = 0;
            var list:Array<any> = config.groups;
            var __colors:any = config.colors;
            if(__colors)
            {
                for(var key in qpq.creator.parser.colors)
                {
                    if(__colors[key])
                        qpq.creator.parser.colors[key] = __colors[key];
                }
            }
            var __size:any = config.sizes;
            if(__size){
                for(var key in qpq.creator.parser.sizes)
                {
                    if(__size[key])
                        qpq.creator.parser.sizes[key] = __size[key];
                }
            }
            var ty:number = 0;
            for (var item of list)
            {
                switch (item.type) {
                    case "chooser":
                    case "order_chooser":
                        group = new ChooserGroup(item);
                        break;
                    case "selector":
                    case "order_selector":
                        group = new SelectorGroup(item);
                        break;
                    case "label":
                        group = new LabelGroup(item);
                        break;
                    case "input":
                        group = new InputGroup(item);
                        break;
                    case "slider":
                        group = new SliderGroup(item);
                        break;
                    case "default":
                        group = new DefaultGroup(item);
                        break;
                    case "stepping" :
                        group = new SteppingGroup(item);
                        break;
                     case "attribute" :
                        group = new AttributeGroup(item);
                        break; 
                    case "timepicker":
                        group = new TimePickerGroup(item);
                        break;
                    case "pointlist":
                        group = new PointListGroup(item);
                        break;
                    default:
                        group = new Group(item);
                        continue;
                }
                group.m_page = this;
                this._list.push(group);
                group.y = ty;
                if(!item.yControl)
                {
                    if(item.linespacing)
                        ty += groupHeight + item.linespacing;
                    else
                        ty += groupHeight - 3;
                }
                this.addChild(group);
            }
           // this.frameOnce(2,this,this.layout);
           this.timer.callLater(this,this.layoutItems);
        }
        private layoutItems():void
        {
            var ty:number = 0;
            for(var i:number = 0; i < this.numChildren; i++)
            {
                var temp:Group = <Group>this.getChildAt(i);                
                temp['y'] = ty;
                var rec:Laya.Rectangle = temp['getBounds']();
                var linespacing:number = temp.getConfig().linespacing || 0;
                ty += Math.max(rec.height,groupHeight) + linespacing;
            }
        }
        public get netData():any
        {
            var result = {};
            for(var key of this._common_data)
                result[key] =  this._config[key];

            if(Page.extraDatas)
            {
                for(var key in Page.extraDatas)
                    result[key] =  Page.extraDatas[key];
            }

            for(var i:number = 0; i < this._list.length; i++)
            {
                var temp:Group = this._list[i];
                if(temp.name)
                {
                    if(this._config[temp.name])
                    {
                        result[temp.name] = this._config[temp.name];
                    }
                    else
                    {
                        result[temp.name] = temp.value;    
                    }
                    continue;
                }

                var arr:Array<NodeItem> = temp.getNodes();
                for(var node of arr)
                {
                    if(node.name)
                    {
                        if(node.name == "startTime")
                        {
                            console.log("dddd");
                        }
                        if(this._config[node.name])
                        {
                            result[node.name] = this._config[node.name];
                        }
                        else
                        {
                            result[node.name] = node.value;    
                        }
                        
                    }
                }
            }
            return result;
        }
        public getGroupByType(type:string):Array<Group>
        {
            var arr:Array<Group> = [];
            for(var g of this._list)
            {
                if(g.type == type)
                    arr.push(g);
            }
            return arr;
        }
        private _roundCost_index:number = 0;
        public onLocalMsg(msg:string,data:any):void
        {
            switch (msg)
            {
                case evt_ItemClick:
                    if(data.name)
                        this._net_data[data.name] = data.value;
                    var roundCostName:string |Array<string> = this._config.roundCostName;
                    if(roundCostName.indexOf(data.name) >= 0)
                    {
                        this.updateRoundCost(data.valueIndex);
                    }
                    // if(typeof roundCostName == "string")
                    // {
                    //     if(data.name == this._config.roundCostName)
                    //     {
                    //         this._roundCost_index = data.valueIndex;
                    //         g_signal.dispatch(evt_UpdateRoundCost,this._config.roundCost[data.valueIndex]);
                    //     }    
                    // }
                    // else
                    // {

                    // }
                    
                    var arr:Array<string>;
                    if(data.control)
                    {
                        arr = data.control.split(",");
                        for(var i:number = 0; i < arr.length; i++)
                        {
                            this.control(arr[i],data);
                        }
                    }
                    if(data.parent_config && data.parent_config.control)
                    {
                        arr = data.parent_config.control.split(",");
                        for(var i:number = 0; i < arr.length; i++)
                        {
                            this.control(arr[i],data);
                        }
                    }
                    if(data.changeAtt)
                    {
                        if(data.changeAtt instanceof Array)
                        {
                           for(var item of data.changeAtt)
                           {
                                this._config[item.name] = item.value;
                                if(roundCostName.indexOf(item.name) >= 0 || item.name == "roundCost")
                                {
                                    this.updateRoundCost();
                                }   
                           }
                        }
                        else
                        {
                            this._config[data.changeAtt.name] = data.changeAtt.value;
                            if(roundCostName.indexOf(data.name) >= 0 || data.name == "roundCost")
                            {
                                this.updateRoundCost();
                            }
                            // if(data.changeAtt.name == roundCostName)
                            // {
                            //    g_signal.dispatch(evt_UpdateRoundCost,this._config.roundCost[this._roundCost_index]);
                            // }     
                        }                        
                    }

                    if(data.config && data.config.changeAtt)
                    {
                        this.changeValue(data.config.changeAtt,data.value);
                    }

                    if(data.config && data.config.parent_config && data.config.parent_config.changeAtt)
                    {
                        this.changeValue(data.config.parent_config.changeAtt,data.value);
                    }

                    break
            }
        }
        private updateRoundCost(valueIndex?:number):void
        {
            var roundCostName:string |Array<string> = this._config.roundCostName;
            if(typeof roundCostName == "string")
            {
                if(!isNaN(valueIndex))
                    this._roundCost_index = valueIndex;
                g_signal.dispatch(evt_UpdateRoundCost,this._config.roundCost[this._roundCost_index]);                  
            }
            else
            {
                var values:Array<any> = [];
                for(var name of roundCostName)
                {
                    var g = this.getGroupByName(name);
                    if(g)
                        values.push(g.value);
                }
                var str:string = values.join(",");
                var num:number = this._config.roundCost[str] || 0;
                g_signal.dispatch(evt_UpdateRoundCost,this._config.roundCost[str]);                  
            }
        }

        /**
         * 应用默认配置
         * */
        public applyDefaultConfig(data:any):void
        {
            var ignoreVec:string[] = ["gz_id","game_id","money_type","mode_id","room_name","pay_mode"];
            var failVec:string[] = [];
            for(var key in data) {/*为在JSON对象中的所有属性寻找适配器并赋值*/
                if(ignoreVec.indexOf(key) != -1)
                    continue;
                var group = this.getGroupByName(key);
                if(group)
                {
                   group.setValue(key,data[key]);
                }
            }
        }
        private changeValue(targetList:Array<any>,value:number):void
        {
            for(var i:number = 0; i < targetList.length; i++)
            {
                var temp = this.getGroupByName(targetList[i].name);
                if(temp == null)
                    return;
                //需要修改的值，可以为原始值，+-*/的数据。+30表示在value基础上+30
                var tv:string = targetList[i].value;    
                var target_value:any = 0;  
    
                if(tv == "value")
                {
                    target_value = value;
                }
                else
                {
                    var first:string = tv.charAt(0);     
                    var change_value:number = parseInt(tv.slice(1));
                    
                    switch (first) 
                    {
                        case "+":
                            target_value = value + change_value;
                            break;
                        case "-":
                            target_value = value - change_value;
                            break;
                        case "*":
                            target_value = value * change_value;
                            break;
                        case "/":
                            target_value = value / change_value;
                            break; 
                        case "=":
                            target_value = this.parseGongShi(tv,targetList[i].variables);
                            break;
                        default:
                            target_value = tv;
                            break;
                    }     
                }
                           
               
                switch (targetList[i].att) {
                    case "value":
                        temp.setValue(targetList[i].name,target_value);
                        break;
                    case "selectedIndex":
                        var items:Array<any> = temp.getNodes();
                        for(var j:number = 0; j < items.length ;j++)
                        {
                            items[j].selected = (j == parseInt(target_value))
                        }
                        break;
                    default:
                        // code...
                        break;
                }
            }
        }
        //公式格式为 =a+b*c;
        private parseGongShi(gongshi:string,variables:Array<string>):number
        {
            gongshi = gongshi.slice(1,gongshi.length);    //去掉=;

            for(var i:number = 0; i < variables.length; i++)
            {
                var value:number = this.getNodeByName(variables[i]).value;
                var reg = new RegExp(variables[i],"g");
                gongshi = gongshi.replace(reg,value+"");
            }            
            return eval(gongshi);
        }
        /**
         * 控制其他元件
         * @param controlName
         * @param data
         */
        private control(controlName:string,data:any):void
        {
            var group = this.getGroupByName(controlName);
            group.toControl(controlName,data.value);
        }
        public getNodeByName(name:string):NodeItem|Group
        {
            for(var g of this._list)
            {
                if(g.name == name)
                    return g;
                if(g.hasChild(name))
                {
                    return g.getChild(name);
                }
            }
            return null;
        }
        private getGroupByName(name:string):Group
        {
            for(var g of this._list)
            {
                if(g.type == "selector" || g.type == "timepicker" || g.type == "label" || g.type == "stepping" ||  g.type == "attribute"||  g.type == "default")
                {
                    if(g.hasChild(name))
                        return g;
                }
                else
                {
                    if(g.name == name)
                        return g;
                }
            }
            return null;
        }

        private layout():void
        {
            this.y = (this._totalHeight - this.height) * 0.5;
        }
    }
}
