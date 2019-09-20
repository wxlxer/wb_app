module gamelib.common
{
    /**
     *  距离检测系统
     *  @class DistanceCheck
     */
    export class DistanceCheck
    {
    	private static _instance:DistanceCheck;
        public static get s_instance():DistanceCheck
        {
            if(DistanceCheck._instance == null)
                DistanceCheck._instance = new gamelib.common.DistanceCheck();
            return DistanceCheck._instance;
        }
        private _support:boolean;
        private _enterBtn:any;
        private _ui:DistanceCheckUi;
        private _playerList:Array<gamelib.data.UserInfo>;
        public setEnterBtn(btn:any):void
        {
            if(btn == null)
                return;
        	this._enterBtn = btn;
        	var temp:any = GameVar.g_platformData['distanceCheck'];
            if(temp == null || temp === false || GameVar.circleData.isGoldScoreModle() || GameVar.circleData.isMatch())
            {
                this._enterBtn.visible = false;
                return;
            }
            this._enterBtn.on(laya.events.Event.CLICK,this,this.onShowDisUi);
        }
        public setPlayerList(arr:Array<gamelib.data.UserInfo>):void
        {
        	this._playerList = arr;
        	if(this._ui)
        		this._ui.setPlayerList(arr);
        }
        public destroy():void
        {
        	if(this._enterBtn)
                this._enterBtn.off(laya.events.Event.CLICK,this,this.onShowDisUi);
            if(this._ui)
                this._ui.destroy();
            this._ui = null;
        	this._enterBtn = null;
        	DistanceCheck._instance = null;
        }
        /**
         * 在开始的时候检测。如果有距离低于100米的，弹出提示框
         * @return 有距离低于100米的 true,否则false
         */
        public checkInStart(okCallBack:Laya.Handler):boolean
        {
            if(this._enterBtn == null || this._playerList == null)
                return false;
            var b:boolean = false;
            for(var i:number = 0; i < this._playerList.length - 1; i++)
            {
                if(this._playerList[i] == null)
                    continue;
                for(var j:number = 1; j < this._playerList.length;j++)
                {
                    if(this._playerList[j] == null)
                        continue;
                    var dis:number = this._playerList[i].getDistanceNum(this._playerList[j]);
                    if(dis == -1)
                        continue;
                    if(dis < 100)
                    {
                        b = true;
                        break;
                    }   

                }
            }
            if(b)
            {
                this._ui = this._ui || new DistanceCheckUi();
                this._ui.setPlayerList(this._playerList,okCallBack);
                this._ui.show();
            }
            return b;
        }
        private onShowDisUi(evt:Laya.Event):void
        {
        	playButtonSound();
        	this._ui = this._ui || new DistanceCheckUi();
        	this._ui.setPlayerList(this._playerList);
        	this._ui.show();
        }


    }
}