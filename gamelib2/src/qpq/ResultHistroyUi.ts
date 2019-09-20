/**
 * Created by wxlan on 2017/9/5.
 */
namespace gamelib.common.qpq
{
    /**
     * 战绩界面
     */
    export class ResultHistroyUi extends gamelib.core.Ui_NetHandle
    {
        private _list:laya.ui.List;
        private _data:any;
        public constructor()
        {
            super("qpq/Art_Zhanji");
        }
        protected init():void
        {
            this._list = this._res["list_zhanji"];
            
			this._noticeOther = true;
            this._list.selectEnable = true;
            this._list.dataSource = [];
            this._list.selectHandler = laya.utils.Handler.create(this,this.onSelect,null,false);
            
        }
        public reciveNetMsg(msgId:number,data:any):void
        {
            if(msgId == 0x00FA)
            {
                g_signal.dispatch("closeQpqLoadingUi");
                this._data = data.recordNum;
                this._list.dataSource = this._data;
                this._res["txt_tips"].visible = this._data.length == 0;
            }
        }
        protected onShow():void
        {
            super.onShow();
            this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
            if(this._data == null)
            {
                sendNetMsg(0x00FA,0,0,10,0);
                var temp:any = {
                    msg:getDesByLan("加载数据中"),
                    delay:15,
                    alert:getDesByLan("网络繁忙，请稍后重试"),
                    callback:this.close,
                    thisobj:this
                }
                g_signal.dispatch("showQpqLoadingUi",temp);
            }
            else
            {
                this._list.dataSource = this._data;
                this._res["txt_tips"].visible = this._data.length == 0;
            }
        }
        protected onClose():void
        {
            super.onClose();            
            this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
            this._list.selectedIndex = -1;

        }
        private onItemUpdate(item:laya.ui.Box,index:any):void
        {

            var data:any = this._data[index];
            var txt:laya.ui.Label = <laya.ui.Label>item.getChildByName("txt_2");
            txt.text = data.gameName;

            var min:string = (data.timeCost/60).toFixed(0);
            txt = <laya.ui.Label>item.getChildByName("txt_5");
            txt.text = getDesByLan("时间")+":" + min +  getDesByLan("分钟");

            txt = <laya.ui.Label>item.getChildByName("txt_1");
            txt.text = getDesByLan("房号") + ":" + data.roomId;

            txt = <laya.ui.Label>item.getChildByName("txt_3");
            txt.text = utils.StringUtility.getNameEx(data.homewnerName,10);
            
            txt = <laya.ui.Label>item.getChildByName("txt_4");
            txt.text = data.creatTime;

            txt = <laya.ui.Label>item.getChildByName("txt_6");

            if(data.roundMax == 0)
            {
                txt.text = data.roundTotal +"";
            }
            else
            {
                txt.text = data.roundTotal +"/"+data.roundMax;
            }
            var players:any[] = data.playerNum;
            var myPid:number = GameVar.pid;
            var score:number = 0;
            for(var i:number = 0;i < players.length; i++) {
                if(players[i].playerPid == myPid) {
                    score = players[i].winOrLosePoints;
                    break;
                }
            }
            txt = <laya.ui.Label>item.getChildByName("txt_7");
            txt.text = score > 0 ? "+" + score : "" + score;
        }
        private onSelect(index:number):void
        {
            if(index == -1)
                return;
            g_signal.dispatch("showQpqResultUi",this._data[index]);
            this._noticeOther = false;
            this.close();
            this._noticeOther = true;
            //console.log("onItemClick" + evt.currentTarget["__index"]);
        }
    }
}
