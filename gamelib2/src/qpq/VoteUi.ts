module gamelib.common.qpq
{
    /**
     * 投票界面
     */
    export class VoteUi extends gamelib.core.BaseUi
    {
        private _list:laya.ui.List;
        private _tip1:laya.ui.Box;        //选择投票
        private _tip2:laya.ui.Box;        //等待其他玩家投票

        private _sec:number;
		private _datasource:Array<any>;
        public constructor() {
            super("qpq/Art_Tips_Toupiao");
        }
        protected init():void {
            this._list = this._res["list_1"];
            this._tip1 = this._res["b_tips1"];
            this._tip2 = this._res["b_tips2"];

            this.addBtnToListener("btn_cancel");
            this.addBtnToListener("btn_ok");
            this.m_closeUiOnSide = false;
            this._res['btn_cancel'].label = getDesByLan("拒绝");
        }
        public onShow():void {
            super.onShow();
            Laya.timer.loop(1000,this,this.timer);
            if(this._res['btn_close'])
                this._res['btn_close'].visible = false;
            this._list.on(laya.events.Event.RENDER,this,this.onItemUpdate);
        }
        public onClose():void{
            super.onClose();
            Laya.timer.clear(this,this.timer);
            this._list.off(laya.events.Event.RENDER,this,this.onItemUpdate);
        }
        protected onClickObjects(evt:laya.events.Event):void
        {
            if(evt.currentTarget.name == "btn_ok")
            {
                sendNetMsg(0x2004,1);
            }
            else
            {
                sendNetMsg(0x2004,2);
            }
            this._tip1.visible = false;
            this._tip2.visible = true;
            playButtonSound();
        }
        public update(data:any):void
        {
            this._sec = data.time;
			this._datasource = data.players;
			this._list.dataSource = this._datasource;
            this.timer();
            var total:number = data.players.length;
            var passed:number = 0;
            var selfState:number = 0;
            var juList:Array<string> = [];
            var isPangGuan:boolean = true;
            for(var i:number = 0;i < total; i++)
            {
                if(data.players[i].status == 1)
                    passed ++;
                else if(data.players[i].status == 2)
                {
                    juList.push(gamelib.core.getPlayerData(data.players[i].id).m_name);
                }
                if(data.players[i].id == gamelib.data.UserInfo.s_self.m_id)
                {
                    selfState = data.players[i].status;
                    isPangGuan = false;
                    continue;
                }
            }
            this.setVoteInfo(passed,total);

            if(isPangGuan)
            {
                this._tip1.visible = false;
                this._tip2.visible = true;
            }
            else
            {
                 if(selfState != 0)
                {
                    this._tip1.visible = false;
                    this._tip2.visible = true;
                }
                else
                {
                    this._tip1.visible = true;
                    this._tip2.visible = false;
                }                
            }
            if(data.result == 2) //拒绝
            {
                this.delayClose(juList)
            }

           
        }
        private delayClose(juList:Array<string>):void
        {
            //var msg:string = "玩家:" + juList.join(",") +"拒绝解散,游戏继续!";
            //g_uiMgr.showAlertUiByArgs({"msg":msg,type:5,autoCall:5,callBack:function(type:number)
            //{
            //    this.close();
            //},thisObj:this});
            Laya.timer.once(2000,this,this.close);

        }
        private timer():void
        {
            if(this._sec >= 0)
            {
                this._res["txt_time"].text =  this._sec+"秒";
            }
            this._sec--;
            if(this._sec == 0)
            {
                this.close();
            }
        }
        private setVoteInfo(pass:number,total:number):void
        {
            this._res["txt_num"].text= getDesByLan("同意") + " "+pass+"/"+total+" "+getDesByLan("总数");
        }

        private onItemUpdate(box:laya.ui.Box,index:number):void
        {
			var data:any = this._datasource[index];
			var txt:laya.ui.Label = getChildByName(box,"txt_name");
			txt.text = gamelib.core.getPlayerData(data.id).m_name_ex;
			
			var img1:laya.ui.Image = getChildByName(box,"img_1");	//同意
			var img2:laya.ui.Image = getChildByName(box,"img_2");
			switch (data.status) //0 投票中 1 解散 2 继续
			{
                case 0:
                    img1.visible = img2.visible = false;
                    break;
                case 1:
                    img1.visible = true;
                    img2.visible = false;

                    break;
                case 2:
                    img1.visible = false;
                    img2.visible = true;
                    break;
            }
        }
    }    
}