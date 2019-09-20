/**
 * Created by wxlan on 2016/10/27.
 *
 */
    namespace gamelib.chat
    {
        /**
         * 语言系统
         * @class RecordSystem
         */
        export class RecordSystem
        {
            private static _instance:RecordSystem;
            public static get s_instance():RecordSystem
            {
                if(RecordSystem._instance == null)
                    RecordSystem._instance = new RecordSystem();
                return RecordSystem._instance;

            }

            private _support:boolean;
            private _enterBtn:any;
            private _recordView:gamelib.record.RecordingUi;
            private _playingView:gamelib.record.RecordPlay;
            private _record_list:Array<any>;

            private _pos:any;

            private _downTime:number;
            public constructor()
            {
                this._record_list = [];
                g_signal.add(this.onSignal,this);

                if(GameVar.g_platformData['recordPlayPos'])
                {
                    this._pos = {
                        pos_play:{
                            x:GameVar.g_platformData['recordPlayPos'].x,
                            y:GameVar.g_platformData['recordPlayPos'].y
                        }
                    }
                }
                else
                {
                    this._pos = {
                        pos_play:{
                            x:1100,
                            y:650
                        }
                    }    
                }
                
            }
            public destroy():void
            {
                if(this._recordView)
                     this._recordView.destroy();
                 if(this._playingView)
                     this._playingView.destroy();

                 this._recordView = null;
                 this._playingView = null;

                 if(this._enterBtn)
                 {
                     this._enterBtn.off(laya.events.Event.MOUSE_DOWN,this,this.onBeginTalk);
                 }
            }
            public setEnterBtn(btn:any):void
            {
                this._enterBtn = btn;
                this._enterBtn.on(laya.events.Event.MOUSE_DOWN,this,this.onBeginTalk);
                var temp:any = GameVar.g_platformData['speek'];
                // var mode:number = GameVar.circleData.info['pay_mode'];
                if(temp == null || temp === false || GameVar.circleData.isGoldScoreModle() || GameVar.circleData.isMatch())
                {
                    this._enterBtn.visible = false;
                }               
            }
            private initEnterBtn():void
            {
                if(this._enterBtn == null)
                    return;
                var temp:any = GameVar.g_platformData['speek'];
                if(GameVar.circleData.info == null || GameVar.circleData.info['extra_data'] == null)
                    return;
                var mode:number = GameVar.circleData.info['extra_data']['pay_mode'];
                if(temp == null || temp === false || temp[mode] === false)
                {
                    this._enterBtn.visible = false;
                }                
            }


            public setPlayPos(x:number,y:number):void
            {
                if(this._playingView)
                {
                    this._playingView.x = x;
                    this._playingView.y = y;
                }
                else
                {
                    this._pos.pos_play.x = x;
                    this._pos.pos_play.y = y;
                }
            }

            private _bVolume_record:boolean = false;
            private _bVolume_play:boolean = false;
            private onSignal(msg:string,obj:any):void
            {
                switch (msg)
                {
                    case "initCircleData":
                        this.initEnterBtn();
                        break;
                    case "start_record":       //开始录音                   
                        g_soundMgr.volume_small();
                        this._bVolume_record = true;
                        break;
                    case "stop_record":        //结束录音
                        this._bVolume_record = false;
                        if(!this._bVolume_play)
                            g_soundMgr.volume_normal();
                        break;   
                    case "play_audio":         //开始播放
                         g_soundMgr.volume_small();
                        this._bVolume_play = true;
                        break;
                    case "get_record":
                        this._record_list.push(obj);
                        this.checkPlay();
                        break;
                    case "record_playEnd":    //播放结束
                        this._bVolume_play = false;
                        if(!this._bVolume_record)
                            g_soundMgr.volume_normal();
                        this.checkPlay();
                        break;
                }
            }
            private checkPlay():void
            {
                console.log("checkPlay:++++++++++++++" + (this._playingView!= null && this._playingView.isPlaying()));
                if(this._record_list.length == 0 || (this._playingView!= null && this._playingView.isPlaying()))
                    return;
                var temp:any = this._record_list.shift();
                if(temp == null)
                    return;
                if(this._playingView == null)
                {
                    this._playingView = new gamelib.record.RecordPlay();
                    this._playingView.x = this._pos.pos_play.x;
                    this._playingView.y = this._pos.pos_play.y;
                }
                this._playingView.setData(JSON.parse(temp.json_str));

            }
            private onBeginTalk(evt:laya.events.Event):void
            {
                this._downTime = Laya.timer.currTimer;
                
                Laya.timer.once(500,this,this.startRecord);
            }
            private onEndTalk(evt:laya.events.Event):void
            {
                Laya.timer.clear(this,this.startRecord);
                Laya.stage.off(laya.events.Event.MOUSE_UP,this,this.onEndTalk);
                var temp:number =  Laya.timer.currTimer - this._downTime;
                if(temp > 200)
                {
                    this.stopRecord();
                }
                evt.stopPropagation();
            }

            private startRecord():void
            {
                Laya.stage.on(laya.events.Event.MOUSE_UP,this,this.onEndTalk);
                this._recordView = this._recordView || new gamelib.record.RecordingUi();
                this._recordView.show();
            }
            private stopRecord():void
            {
                if(this._recordView != null)
                {
                    this._recordView.close();
                }
            }

        }

    }
