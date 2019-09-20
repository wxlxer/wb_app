
/**
 * Created by code on 2017/8/2.
 */
module gamelib.common
{
    /**
     *  礼物赠送、接收显示管理
     *  @class GiftSystem
     */
    export class GiftSystem
    {

        private static _instance:GiftSystem;
        public static get s_instance():GiftSystem
        {
            if(GiftSystem._instance == null)
                GiftSystem._instance = new gamelib.common.GiftSystem();
            return GiftSystem._instance;
        }

        private _postions:Array<any>;
        private _labels:Array<laya.ui.Label>;
        private _area:{x:number,y:number};
        private _playerList:Array<gamelib.data.UserInfo>;  // 玩家列表
        private _sprite:Laya.Box;  // 动画显示层
        private _btns:Array<laya.ui.Button>;

        private _ui:GiftsUi;

        private _enabled:boolean;

        private _getPosFun:Function;
        public constructor()
        {
            
        }
        public destroy():void
        {
            if(this._ui)
               this._ui.destroy();   
           if(this._playerList)        
               this._playerList.length = 0;
           if(this._btns)
               this._btns.length = 0;
           this._btns = null;
           this._playerList = null;
           this._ui = null;
           GiftSystem._instance = null;
        }
        public set enable(value:boolean)
        {
            this._enabled = value;

        }
      
        /**
         * 初始化各个参数
         * @function 
         * @DateTime 2018-03-17T14:34:04+0800
         * @param    {Array<{any}>}         postions 需要显示礼物的位置。可以设置具体的x,y，也可以传入美术提供的资源对象
         * @param    {any}               tipArea  提示文本显示的位置
         * @param    {Array<laya.ui.Button>}  btns    礼物按钮列表。如果没有。传[];注意需要列表的第一个按钮为位置1的玩家，不是位置0的玩家
         */
        public init(postions:Array<{any}>,tipArea:{x:number,y:number},btns:Array<laya.ui.Button>):void
        {
            this._enabled = true;
            this._sprite = this._sprite || new Laya.Box();
            var p:any;
            if(this._btns)
            {
                for(var btn of this._btns)
                {
                    btn.offAll();
                }
            }
            this._btns = btns;
            this._labels = [];
            this._postions = postions;
            this._area = tipArea;

            for(var i:number = 0; i < this._btns.length; i++)
            {
                var btn:laya.ui.Button = this._btns[i];                
                btn['_localseat'] = (i + 1);
                btn.on("click",this,this.onClickBtn);
                p = btn.parent.parent;
            }
            if(p == null)
            {
                if(postions[0] && postions[0]['parent'])
                    p = postions[0]['parent']['parent'];
                else
                    p = g_layerMgr;

            }
            p.addChild(this._sprite);
            this._sprite.zOrder = 10;
        }
        public init_br(getpos:(index:number) => {x:number,y:number},tipArea?:{x:number,y:number})
        {
            this._getPosFun = getpos;
            this._area = tipArea ||  { x: 1066, y: 498 };
            this._sprite = this._sprite || new Laya.Box();
            Laya.stage.addChild(this._sprite);
        }
        /**
         * 很重要。需要在牌桌玩家数据确定后，传进来，否则找不到玩家，礼物不会正确显示
         * @function setPlayerList
         * @DateTime 2018-03-17T14:37:03+0800
         * @param    {Array<gamelib.data.UserInfo>} list 牌桌玩家列表
         */
        public setPlayerList(list:Array<gamelib.data.UserInfo>):void
        {
            this._playerList = list;
        }

        public close():void
        {
            Laya.Tween.clearAll(this);
            Laya.timer.clearAll(this);
        }

        /**
         * 显示礼物
         * @function showGift
         * @DateTime 2018-03-17T14:38:16+0800
         * @param    {any}               data [description]
         * @param    {number}            [flyTime =    1000]
         */
        public showGift(data:any, flyTime:number = 1000):void
        {
            if(!data || !data.playerNum || !data.playerNum.length || !this._enabled || data.result == 0)
                return;
            // if(this._playerList == null)
            // {
            //     console.log("GiftSystem 未设置玩家列表");
            //     return;
            // }
            if(data.playerNum.length > 1)
            {
                this.oneToMore(data, flyTime);
            }
            else
            {
                this.oneToOne(data, flyTime);
            }
        }
        private onClickBtn(evt:laya.events.Event):void
        {
            this._ui = this._ui || new GiftsUi();
            var lc:number = evt.currentTarget['_localseat'];
            console.log("__lc:" + lc);
            for(var pd of this._playerList)
            {
                if(pd == null)
                    continue;
                if(pd.m_seat_local == lc)
                {
                    this._ui.setPlayerId(pd.m_id);
                    // console.log("__lc:" + pd.m_seat_local +" "  + pd.m_name);
                    return;        
                }
            }
            
        }
        // 一对一 赠送
        private oneToOne(data:any, flyTime:number = 1000):void
        {            
            var item:GiftItem;
            var sendPos:any,recuvePos:any;

            var temp = this.getUrls(data.type);
            if(temp == null)
                return;
            // 找到赠送者、接收者
            var sendPd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.sendId);
            if(data.sendId && !sendPd)
                return;
            var recivePd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.playerNum[0].reciveId);
            if(!recivePd)
                return;

            var sendseat:number =  sendPd.m_seat_local;
            var reciveSeat:number = recivePd.m_seat_local;

            this.appendMsg(sendPd.m_name,recivePd.m_name,temp.img);
            if(this._getPosFun)
            {
                sendPos = this._getPosFun(sendseat);
                recuvePos = this._getPosFun(reciveSeat);    
            }
            else
            {
                sendPos = this._postions[sendseat];
                recuvePos = this._postions[reciveSeat];    
            }            
            if(sendPos == null || recuvePos == null)
                return;
            item = new GiftItem(data.type, temp.sound);
            item.setFlyTime(flyTime);
            item.flyTo(sendPos,recuvePos);
            this._sprite.addChild(item);

        }
        // 一对多 赠送
        private oneToMore(data:any, flyTime:number = 1000):void
        {
            var item:GiftItem;
            var sendPos:any,recuvePos:any;

            var temp = this.getUrls(data.type);
            if(temp == null)
                return;
            // 找到赠送者、接收者
            var sendPd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.sendId);
            if(data.sendId && !sendPd)
                return;
            var sendseat:number =  sendPd.m_seat_local;
            // sendPos = this._postions[sendseat];
            if(this._getPosFun)
            {
                sendPos = this._getPosFun(sendseat);   
            }
            else
            {
                sendPos = this._postions[sendseat];
            }        
            for(var i:number = 0; i < data.playerNum.length; i++)
            {
                var recivePd:gamelib.data.UserInfo = gamelib.core.getPlayerData(data.playerNum[i].reciveId);
                if(!recivePd || recivePd.m_id == sendPd.m_id)
                    continue;
                var reciveSeat:number = recivePd.m_seat_local;
                // recuvePos = this._postions[reciveSeat];
                if(this._getPosFun){
                    recuvePos = this._getPosFun(reciveSeat);   
                }
                else{
                    recuvePos = this._postions[reciveSeat];
                }     
                if(recuvePos == null) 
                    continue;
                item = new GiftItem(data.type, temp.sound);
                item.setFlyTime(flyTime);
                item.flyTo(sendPos,recuvePos);
                this._sprite.addChild(item);

            }
            this.appendMsg(sendPd.m_name,getDesByLan("全桌玩家"),temp.img);
        }

        // 获取道具
        private getUrls(type:number):any
        {
            var temp:any = {};
            var url:string = "qpq/daoju/Art_Hddj_";
            var img:string = "qpq/daoju/daoju_icon_";
            var sound:string = "";
            
            console.log(type);
            switch (type)
            {
                case 1:
                    url += "xh";   // 鲜花
                    img += "1.png";
                    sound = "flower";
                    break;
                case 2:
                    url += "fq";   // 番茄
                    img += "2.png";
                    sound = "egg";
                    break;
                case 3:
                    url += "jd";   // 鸡蛋
                    img += "3.png";
                    sound = "egg";
                    break;
                case 4:
                    url += "pd";   // 干杯
                    img += "4.png";
                    sound = "cheers";
                    break;
                case 6:
                    url += "gou";   // 狗
                    img += "5.png";
                    sound = "dog";
                    break;
                case 5:
                    url += "zj";   // 鸡
                    img += "6.png";
                    sound = "chiken";
                    break;

                default:
                    return null;
            }
            temp.sound = sound;
            temp.url = url;
            temp.img = img;
            return temp;
        }
        // 设置消息
        private appendMsg(sendName:string,recName:string, type:string =""):void
        {
            if(GameVar.g_platformData['gift_tips'] === false)
            {
                return;
            }
            var label:Laya.Sprite = this.createTextField(sendName,recName,type);
            label.x = Laya.stage.width - label.width;
            label.y = this._area.y;
            this._sprite.addChild(label);
            if(GameVar.s_bActivate)
            {
                laya.utils.Tween.to(label, {y:label.y - 100}, 4000, null, laya.utils.Handler.create(this, this.removeOneLable, [label]));
            }
            else
            {
                this.removeOneLable(label);
            }
        }
        private removeOneLable(obj:any):void
        {
            if(obj)
            {
                obj.parent.removeChild(obj);
                obj = null;
            }
        }
        private createTextField(sendName:string,recName:string,type:string):Laya.Sprite
        {
            // 1 
            var spr:Laya.Sprite = new Laya.Sprite();
            // 2 文本
            //创建 TextField 对象
            var label_1:laya.ui.Label = new laya.ui.Label(); // sendName
            var label_2:laya.ui.Label = new laya.ui.Label(); // "送给"
            var label_3:laya.ui.Label = new laya.ui.Label(); // recName
             // 道具图片
            var icon:laya.ui.Image = new laya.ui.Image();
            icon.skin = type;
            // var bmp:laya.ui.Image = new laya.ui.Image();
            // bmp.skin = "bg_tips_fddj";
            // spr.addChild(bmp);
            spr.addChild(icon);
            spr.addChild(label_1);
            spr.addChild(label_2);
            spr.addChild(label_3);

            // 文本
            // 是否自动换行
            label_1.wordWrap = label_2.wordWrap = label_3.wordWrap = false;
            // //设置字体 字号
            label_1.font = label_2.font = label_3.font = "Arial";
            label_1.fontSize = label_2.fontSize = label_3.fontSize = 24;
            // //设置文本颜色
            label_1.strokeColor = label_2.strokeColor = label_3.strokeColor = "#000000"; // 描边颜色
            label_1.stroke = label_2.stroke = label_3.stroke = 2; // 描边
            label_1.color = "#ff3000";
            label_2.color = "#FFFFFF";
            label_3.color = "#ff9000";
            // //设置显示文本
            var temp_str:string = utils.StringUtility.GetSubstr(sendName, 8);
            sendName = temp_str == sendName ? sendName : temp_str +"...";

            temp_str = utils.StringUtility.GetSubstr(recName, 8);
            recName = temp_str == recName ? recName : temp_str +"...";

            label_1.text = sendName;
            label_2.text = getDesByLan( "送给" );
            label_3.text = recName;
            // 设置文本位置
            label_2.y = label_3.y = label_1.y;
            label_2.x = label_1.x + label_1.width;
            label_3.x = label_2.x + label_2.width;
            
            // 图片
            icon.x = label_3.x + label_3.width;
            icon.y = (label_1.height - icon.height) * 0.5;
            spr.width = icon.x + 30;

            // bmp.width = label_1.width + label_2.width + label_3.width + icon.width + 14;
            // bmp.height = label_1.height + 14;
            // bmp.x = -7;
            // bmp.y = -7;
            // spr.cacheAsBitmap = true;
            return spr;
        }
    }

    export class GiftItem extends Laya.Sprite
    {
    
        private _sound:string;
        private _flyTime:number;  // 动画 飞行时间
        private _stageSize:any;   // 舞台 尺寸
        private _animation:any; // 动画
        private _ani:Laya.FrameAnimation;
        private _type:number;  // 道具类型

        public constructor(type:number, sound:string)
        {
            super();
            this._type = type;
            this._animation = this.getObjByType(type);
            // this._animation.visible = false;
            if(this._animation["ani1"])
            {
                this._ani = (<Laya.FrameAnimation>this._animation["ani1"]);
            }
            this.addChild(this._animation);
            this._animation.anchorX = this._animation.anchorY =  0.5;

            this._sound = sound;
            this._flyTime = 1000;

            this.initData();
        }
        // 获取道具
        private getObjByType(type:number):any
        {
            var resname:string = "qpq/";
            switch (type)
            {
                case 1:// 鲜花
                    resname += 'daoju/Art_Hddj_xh';
                    break;
                case 2:// 番茄
                    resname += 'daoju/Art_Hddj_fq';
                    break;
                case 3: // 鸡蛋
                    resname += 'daoju/Art_Hddj_jd';
                    break;
                case 4:// 干杯
                    resname += 'daoju/Art_Hddj_pb';
                    break;
                case 6: // 狗
                    resname += 'daoju/Art_Hddj_gou';
                    break;
                case 5:// 鸡
                    resname += 'daoju/Art_Hddj_zj';
                    break;
                default:
                    return null;
            }
            // this._scene = utils.tools.createSceneByViewObj(resname);
            // var classObj = gamelib.getDefinitionByName(resname);
            return utils.tools.createSceneByViewObj(resname);
        }
        private initData():void
        {
            this._stageSize = {};
            this._stageSize.width = g_gameMain.m_gameWidth;
            this._stageSize.height = g_gameMain.m_gameHeight;
            this.zOrder = 100;
        }
        public init():void
        {
            
        }
        public close():void
        {
            if(this._ani)
            {
                this._ani.loop = false;
                this._ani.stop();
            }
         
            this.visible = false;
            this.destroy();
        }
        
        // 设置 飞行时间
        public setFlyTime(time_:number):void
        {
            if(time_ != null)
                this._flyTime = time_;
        }
        public flyTo(sendPos:any, recuvePos:any, delayTime:number = 0, bPlayeSound:boolean = true):void
        {
            if(bPlayeSound)
                playSound_qipai("throw",1,null,true);

            var send_pos:{x:number,y:number};
            var recive_pos:{x:number,y:number};
            send_pos = {x:sendPos.x,y:sendPos.y};
            recive_pos = {x:recuvePos.x,y:recuvePos.y};
            if(sendPos instanceof Laya.UIComponent)
            {
                //x:要取到顶层的坐标
                send_pos = 
                {
                    x:sendPos.parent['x'] + sendPos.x + sendPos.width / 2,
                    y:sendPos.parent['y'] + sendPos.y + sendPos.height / 2
                }
            }
            else
            {
                send_pos = {x:sendPos.x,y:sendPos.y}
            }
            if(recuvePos instanceof Laya.UIComponent)
            {
                recive_pos = {
                    x:recuvePos.parent['x'] + recuvePos.x + recuvePos.width / 2,
                    y:recuvePos.parent['y'] + recuvePos.y + recuvePos.height / 2
                }
            }
            else
            {
                recive_pos = {x:recuvePos.x,y:recuvePos.y};
            }
            if(this._animation && this._ani)
            {
                this.visible = true;
                this._animation.visible = true;
                this._ani.loop = true;
                this._animation.x = send_pos.x;
                this._animation.y = send_pos.y;
                this._ani.gotoAndStop(1);  // 初始到第一帧

                var isPlayAtOnce:boolean = false; // 是否直接播放动画
                var showTime:number = 1000;  // 动画完成后的保留显示时长
                var aniTime:number = this._ani.count * this._ani.interval;  // 动画本身的时长
                var totalTime:number = 0;  // 总时长
                
                totalTime += aniTime;
                if(this._type != 2 && this._type != 3 && this._type != 6)  // 番茄 鸡蛋 狗
                {
                    isPlayAtOnce = true;
                    this._ani.play();
                }
                if(this._type == 5 || this._type == 4) // 鸡 干杯
                {
                    this._animation.x = recive_pos.x;
                    this._animation.y = recive_pos.y;
                    this._flyTime = 0; // 动画飞行时间
                    this.giftSound();
                }
                else
                {   
                    this._flyTime = 1000;
                    laya.utils.Tween.to(this._animation, {x:recive_pos.x, y:recive_pos.y, scaleX:1, scaleY:1, rotation:0}, this._flyTime, 
                                            laya.utils.Ease.quartIn, null, delayTime, false);
                    Laya.timer.once(this._flyTime, this, this.giftSound);
                }
                totalTime += (isPlayAtOnce?0:this._flyTime); // 直接播放则不增加额外时间， 否则增加额外的飞行时间
                if(!isPlayAtOnce)
                {
                    Laya.timer.once(this._flyTime, this._ani, this._ani.play);
                }
                Laya.timer.once(totalTime, this, this.moveEnd);
                if(this._type == 5 || this._type == 6 ) // 狗
                {
                    showTime = 0;
                }
                totalTime += showTime;
                Laya.timer.once(totalTime, this, this.remove);
            }   

        }
        private giftSound():void
        {
            playSound_qipai(this._sound,1,null,true);
        }
        private moveEnd():void
        {
            if(this._ani)
            {
                this._ani.loop = false;
                this._ani.stop();
            }
        }
        private remove():void
        {
            this.close();
        }

    }

}