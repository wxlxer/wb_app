/**
 * Created by code on 2017/7/24.
 */
module gamelib.control
{
    /**
     * 规则界面
     * @class Qpq_RuleUi
     */
    export class Qpq_RuleUi extends gamelib.core.BaseUi
    {
        private _ruleData:Array<any>; // 规则数据
        private _list:laya.ui.List;

        public constructor()
        {
            super(GameVar.s_namespace + "/Art_Rule");
            
        }
        public init():void
        {
            this._list = this._res["list_1"];
            if(this._list.scrollBar)
                this._list.scrollBar.autoHide = true;
        }
        protected onShow():void
        {
            super.onShow();
            this._ruleData = [];
            if(!GameVar.circleData.ruleData || !GameVar.circleData.ruleData["list"])
            {                
                
            }
            else
            {
                var rule_:any = GameVar.circleData.ruleData["list"];
                for(var key in rule_)
                {
                    this._ruleData.push({name:key, value:rule_[key]});
                }
            }

            this._list.on(laya.events.Event.RENDER,this,this.set_listItemData);
            this._list.dataSource = this._ruleData;
        }
        protected onClose():void
        {
            super.onClose();
            this._list.off(laya.events.Event.RENDER,this,this.set_listItemData);
        }
        public destroy():void
        {
            super.destroy();
        }
       
        // 设置规则数据
        private setRuleData():void
        {
            if(!GameVar.circleData.ruleData || !GameVar.circleData.ruleData["list"])
            {
                this._ruleData = [];
                return;
            }

            this._ruleData = [];
            var rule_:any = GameVar.circleData.ruleData["list"];
            for(var key in rule_)
            {
                this._ruleData.push({name:key, value:rule_[key]});
            }
        }

        protected set_listItemData(item:laya.ui.Box,index:number):void
        {
            var data = this._ruleData[index];
			var txt = <laya.ui.Label>getChildByName(item,"txt_1");
			txt.text = data["name"];      
        }

    }
}