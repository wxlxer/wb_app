/**
 * Created by wxlan on 2016/10/27.
 *
 */
module gamelib.record
{
    /**
     * 录音控件
     */
    export class RecordingUi extends laya.display.Sprite
    {
        private _bmp:Laya.Sprite;
        private _txt:Laya.Text;

        private _time:number = 0;           //当前录音长度
        private _totalTime:number;          //录音最大长度

        private _starRecordTime:number;

        private _length:number;        //当前长度
        public constructor()
        {
            super();
            this._bmp = new Laya.Sprite();
            this.addChild(this._bmp);
            this.loadImage("qpq/chat/record_1.png");
            this._bmp.loadImage("qpq/chat/record_2.png");
            

            this._txt = new Laya.Text();
            this._txt.color = "#FFFFFF";
            this._txt.fontSize = 92;
            this._txt.text = "00:00:00";
            this._txt.y = 334;
            this._txt.x = (this.width - this._txt.width) * 0.5;
            this.addChild(this._txt);
            this._totalTime = 60;
            this.zOrder = 1;
        }
        public set totalTime(value:number)
        {
            this._totalTime = value;
        }

        public show():void
        {
            Laya.stage.addChild(this);
            this._bmp.pivotX = this._bmp.width / 2;
            this._bmp.pivotY = this._bmp.height / 2;
            this._bmp.x = 223;
            this._bmp.y = 183;
            
            var stageW:number = Laya.stage.width;
            var stageH:number = Laya.stage.height;
            this.x = (stageW - this.width) * 0.5;
            this.y = (stageH - this.height) * 0.5;
            this._bmp.rotation = 0;
            this.frameLoop(1,this,this.onUpdate);
            this.timerLoop(1000,this,this.onTimer);
            var fun:Function = Api.getFunction("audio_start_record");

            console.log("开始录音!!!audio_start_record");
            this._starRecordTime = this.timer.currTimer;
            fun("",this.recordEnd,this);
            if(data.UserInfo.s_self.gameVipLevel == 0)
                this._totalTime = 5;
            else
                this._totalTime = 10 * data.UserInfo.s_self.gameVipLevel;
            //棋牌圈的长度
            if(utils.tools.isQpq())
                this._totalTime = 12;

            this._time = this._totalTime;
            this.onTimer();
            g_signal.dispatch("start_record");
        }
        public close():void
        {
            this.removeSelf();
            this.clearTimer(this,this.onUpdate);
            this.clearTimer(this,this.onTimer);
            Api.getFunction("audio_stop_record")();
            g_signal.dispatch("stop_record");
            console.log("结束录音!!!audio_stop_record");
        }
        private onUpdate():void
        {
            this._bmp.rotation += 1;
        }

        private checkTime():boolean
        {
          this._length = this.timer.currTimer - this._starRecordTime;
          if(this._length < 1000)
          {
              return false;
          }
          return true;
        }
        /**
         * 录音录制完成,上传服务器
         * @param obj
         */
        private recordEnd(obj:any):void
        {
            console.log("录音录制完成" + obj);
            if(obj == null)
               return ;
            if(!this.checkTime())
            {
                console.log("太短了，不播放");
                g_uiMgr.showTip("语言太短了!",true,1);
                Api.getFunction("audio_remove")(obj.data);
                return;
            }
            console.log(obj.msg +" " + JSON.stringify(obj.data));
            console.log("开始上传");
            var params =
            {
                pid:GameVar.pid + "",
                gz_id:GameVar.gz_id + "",
                gameid:GameVar.s_game_id  +"" ,
                file:obj.data,
                callback:this.uploaderComplete,
                thisobj:this
            };
            Api.getFunction("file_upload")(params);
        }

        /**
         * 录音上传完成.需要发送协议
         * @param data
         */
        private uploaderComplete(obj:any):void
        {
            console.log("上传完成" + JSON.stringify(obj));

            if(obj.result == 0)
            {
                //上传成功
                var url:string = obj.data.url;
                var temp:any = {};
                temp.url = url;
                temp.name = GameVar.nickName;
                temp.head_url = GameVar.playerHeadUrl;
                temp.send_pid = GameVar.pid;
                temp.type = obj.data.type;
                temp.totalLength = this._length;
                sendNetMsg(0x0094,1,0,JSON.stringify(temp));
                url = Api.getAtt("g_audio_record_over_url");
                //Api.getFunction("audio_play_start")(url);
                Api.getFunction("audio_remove")(url);
            }
        }
        private onTimer():void
        {
            var m:number = Math.floor(this._time / 60);
            var str:string = "00:";
            if(m >= 10)
                str += m+"";
            else
                str += "0" + m;
            var scend:number = this._time % 60;
            if(scend >= 10)
                str+= ":" + scend;
            else
                str += ":0" + scend;
            this._txt.text = str;

            if(this._time <= 0)
            {
                //时间到
                this.close();
                return;
            }
            this._time--;
        }

    }
}
