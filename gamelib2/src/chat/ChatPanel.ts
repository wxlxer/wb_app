module gamelib.chat
{
    /**
     * 聊天窗口，包含 快捷聊天，表情、聊天窗口
     * 快捷聊天的数据通过GameVar.g_platformData["quick_talk"]设置
     * 这个配置列表元素可以为字符串。也可以为obj对象
     * @class  ChatPanel
     * 
     */
    export class ChatPanel extends gamelib.core.BaseUi
    {
        private static _instance:ChatPanel;
        public static get s_instance():ChatPanel
        {
            if(ChatPanel._instance == null)
                ChatPanel._instance = new gamelib.chat.ChatPanel();
            return ChatPanel._instance;
        }
        public static destroy():void
        {
            if(ChatPanel._instance)
               ChatPanel._instance.destroy();
           ChatPanel._instance = null;
        }
        /**
         * 发送消息类型，0：普通，1：弹幕
         * @type {number}
         */
        public m_sendType:number = 0;       
        /**
         * 当前是否可发送，发送有个时间间隔
         * @type {boolean}
         * @access private
         */
        private _isSendCd:boolean = false;   
        private _tab:laya.ui.Tab;
        private _quickTalkList:laya.ui.List;
        private _face:laya.ui.Box;
        private _histroy:laya.ui.List;
        private _sendBox:laya.ui.Box;

        private _sendBtn:laya.ui.Button;
        private _input_txt:laya.ui.TextInput;
        private _inputEnabled:boolean;
        private _expressionEanbled:boolean;
        private _quiclEnabled:boolean;

        //private _histroy_ds:Array<any>;       //历史纪录
        /**
         * 消息历史记录的条数 默认为50条
         * @type {number}
         */
        private _histroy_ds_totalNum:number = 50;

        private _oldItems:Array<any>;

        private _configs:any;
        public constructor()
        {
            super(GameVar.s_namespace + "/Art_Chat");
        }
        protected init():void
        {
            this._tab = this._res["tab_1"];   
            this._tab.centerX = 0;
            this._oldItems = this._tab.items.concat();
            this._quickTalkList = this._res["list"];
            this._face = this._res["b_face"];
            this._histroy = this._res["list_record"];
            this._sendBox = this._res["b_send"];
            this._sendBtn = this._res["btn_send"];
            this._input_txt = this._res["txt_input"]; 
            this._input_txt.maxChars = 30;
            this._sendBox.visible = this._quickTalkList.visible = this._face.visible = this._histroy.visible = false;
            
            this._quickTalkList.renderHandler = Laya.Handler.create(this,this.onListRender,null,false);
            
            var arr:Array<string>;
            if(GameVar.g_platformData["quick_talk"])
            {
                var temp = GameVar.g_platformData["quick_talk"];
                if(temp instanceof Array)
                {
                    arr = GameVar.g_platformData["quick_talk"]
                }
                else
                {
                    arr = temp[GameVar.gz_id];
                    if(arr == null)
                        arr = temp["default"];
                }
            }
            else
            {
                arr = [];
                arr.push("哎呀，又冲动了", "全押了，你敢跟吗!");
                arr.push("今天就凭这把翻身了", "小意思，来把大的！", "朋友，玩的不赖呀", "无敌真是寂寞啊");
                arr.push("催什么催我在想下什么好", "好多钱啊！", "不要羡慕我哦");
            }
            this._configs = GameVar.g_platformData['chat_config'];
            if(this._configs == null)
            {
                this._configs = {
                    input_cd:3000,
                    face_cd:3000,
                    quick_cd:3000,
                    input_vipLevel:0,
                    face_vipLevel:0,
                    quick_vipLevel:0,
                    tips1:"",
                    tips2:"",
                    input_enabled:false,
                    face_enabled:true,
                    quick_enabled:true
                }
            }
            if(this._configs.quick_enabled == undefined)
                this._configs.quick_enabled = true;

            this._quickTalkList.dataSource = arr;
            this._histroy.itemRender = TalkItem;
            this._histroy.spaceY = 10;
            this._histroy.repeatX = 1;
            this._histroy.vScrollBarSkin = "";
            this._histroy.renderHandler = Laya.Handler.create(this,this.onHistroyListRender,null,false);
            if(this._res['b_face'])
            {
                for(var i:number = 0; i < 20; i++)
                {
                    if(this._res['btn_' + (i + 1)])
                    {
                        this._res['btn_' + (i + 1)].name = "btn_" +i; //注意name是从0开始
                    }
                }
            }

            this.setInputEnabled(this._configs.input_enabled);
            this.setExpressionEanbled(this._configs.face_enabled);
            this.setQuickTalkEnabled(this._configs.quick_enabled)
        }
        public onShow():void
        {
            super.onShow();
            this._input_txt.text = "";
            this._tab.on(laya.events.Event.CHANGE,this,this.onTabChange);
            this._sendBtn.on(laya.events.Event.CLICK,this,this.onSend);
            this._input_txt.on(laya.events.Event.INPUT,this,this.onTextInput);
            this._face.on(laya.events.Event.CLICK,this,this.onTouchFaceBtn);
            this._tab.selectedIndex = 0;
            this.onTabChange();

            var minVipLevel:number = GameVar.g_platformData['chat_vipLevel'];
            var minVipLevelTips:string = "";
            if(gamelib.data.UserInfo.s_self.vipLevel <= this._configs.input_vipLevel)
            {
                this._input_txt.prompt = this._configs.tips1;
                this._input_txt.editable = false;
                this._input_txt.mouseEnabled = false;
                this._sendBtn.disabled = true;

            }
            else
            {
                this._input_txt.prompt = this._configs.tips2;
                this._input_txt.editable = true;
                this._input_txt.mouseEnabled = true;
                this._sendBtn.disabled = false;
            }
        }
        public onClose():void
        {
            super.onClose();
            this._tab.off(laya.events.Event.CHANGE,this,this.onTabChange);
            this._sendBtn.off(laya.events.Event.CLICK,this,this.onSend);
            this._input_txt.off(laya.events.Event.INPUT,this,this.onTextInput);
            this._face.off(laya.events.Event.CLICK,this,this.onTouchFaceBtn);
        }
        private onTabChange(evt?:laya.events.Event):void
		{
            var index:number = this._tab.selectedIndex;            
            var temp:any = this._tab.items[index];
            index = this._oldItems.indexOf(temp);

            if(index == 0)        //表情
            {
                this._face.visible = true;
                this._sendBox.visible = this._inputEnabled;
                this._histroy.visible = false;
                this._quickTalkList.visible = false;                
            }
            else if(index == 1)        //快捷聊天
            {
                this._face.visible = false;
                this._sendBox.visible = this._inputEnabled;
                this._histroy.visible = false;
                this._quickTalkList.visible = true;  
            }
            else                //历史
            {
                this._face.visible = false;
                this._sendBox.visible = this._inputEnabled;
                this._histroy.visible = true;
                this._quickTalkList.visible = false; 
            }
        }
        /**
         * 输入框是否可用.默认是不可用
         * @function setInputEnabled
         * @param {boolean} value [description]
         */
        public setInputEnabled(value:boolean):void
        {
            value = GameVar.circleData.isMatch() ? false : value;
            this._inputEnabled = value;
            this.updateItems();
        }
        /**
         * 快捷聊天是否可用.默认是可用
         * @function setInputEnabled
         * @param {boolean} value [description]
         */
        public setQuickTalkEnabled(value:boolean):void
        {            
            this._quiclEnabled = value;
            this.updateItems();
        }
        /**
         * 设置 表情是否可用
         * @function
         * @DateTime 2018-05-08T15:43:28+0800
         * @param    {boolean}                value [description]
         */
        public setExpressionEanbled(value:boolean):void
        {
            this._expressionEanbled = value;
            this.updateItems();
            
        }
        private updateItems():void
        {
            var temp:Array<any> = this._tab.items.concat();
            for(var item of temp)
            {
                 this._tab.delItem(item);
            } 
            if(this._quiclEnabled)
                this._tab.addItem(this._oldItems[1],true);
            if(this._expressionEanbled)   
                this._tab.addItem(this._oldItems[0],true);
            if(this._inputEnabled)
               this._tab.addItem(this._oldItems[2],true);

        }
        
        private onListRender(cell:laya.ui.Box,index:number):void
		{
            var txt:laya.ui.Label;
            for(var i:number = 0; i < cell.numChildren; i++)
            {
                var temp = cell.getChildAt(i);
                if(temp instanceof Laya.Label)
                {
                    txt = temp;
                    break;
                }
            }
            var obj:any = this._quickTalkList.dataSource[index];
            if(typeof obj == "string")
            {
                txt.text = obj;    
            }
            else
            {
                txt.text = obj.msg;    
            }
            
            cell.off(laya.events.Event.CLICK,this,this.onSelectQuickTalk);
            cell.on(laya.events.Event.CLICK,this,this.onSelectQuickTalk);
            
        }
        private onHistroyListRender(cell:TalkItem,index:number):void
        {
            // console.log("onHistroyListRender:" + index);
            var temp = this._histroy.dataSource[index];
            cell.setData(temp[0],temp[1],this._histroy.width);
        }
        private onTextInput(evt:laya.events.Event):void
        {
            var msg:string = this._input_txt.text;
            if(msg.length > 20)
            {
                msg = msg.slice(20,msg.length-20);
                msg += "...";
            }
        }       
        /**
         * 
         * 发送消息
         * @param evt
         */
        private onSend(evt:laya.events.Event):void
        {
            playButtonSound();
            var msg:string = this._input_txt.text;
            if(!this.checkCanSend())
            {
                return;
            }
            if(msg == '')
            {
                g_uiMgr.showTip(getDesByLan("无法发送空内容"),true);
                return;
            }
            if(msg.length > 20)
            {
                msg = msg.slice(0,20);
                msg += "...";
            }
            switch (this.m_sendType)
            {
                case 0:
                    this.sendChatFunction(2,msg);
                    break;
                case 1:
                    this.sendDanmuFunction(0,msg);
                    break;
            }
            this._input_txt.text = '';
            this._isSendCd = true;
            Laya.timer.once(this._configs.input_cd,this,this.clearCd);
            this.close();
        }
        /**
         * 发送快捷聊天
         * @param evt
         */
        private onSelectQuickTalk(evt:laya.events.Event):void
        {
            if(!this.checkCanSend())
                return;
            var msg:string;
            var ds:any = evt.currentTarget["_dataSource"];
            if(typeof ds == 'string')
            {
                msg = ds;
            }
            else
            {
                msg = ds.msg;
            }
            var arr:Array<any> = this._quickTalkList.dataSource;
            var index:number = 0;
            for(var i:number = 0; i < arr.length ;i++)
            {
                if(typeof arr[i] == "string")
                {
                    if(arr[i] == msg)
                    {
                        index = i;
                        break;
                    }                    
                }
                else
                {
                    if(arr[i].msg == msg)
                    {
                        index = i;
                        break;
                    }    
                }
            }
            this._isSendCd = true;
            Laya.timer.once(this._configs.quick_cd,this,this.clearCd);
            this.sendChatFunction(4,index +"");
            playButtonSound();
            this._quickTalkList.selectedIndex = -1;
            this.close();
        }
        /**
         * 发送表情
         * @param evt
         */
        private onTouchFaceBtn(evt:laya.events.Event):void
        {
            var temp:string = evt.target.name;

            var index:number = parseInt(temp.split("_")[1]);
            if(isNaN(index))
                return;
            if(!this.checkCanSend())
                return;
            this.sendFaceFunction(index);
            this._isSendCd = true;
            Laya.timer.once(this._configs.face_cd,this,this.clearCd);
            this.close();
        }
        private clearCd():void
        {
            this._isSendCd = false;
        }
        //检测当前是否可以发送
        private checkCanSend():boolean
        {
            if(this._isSendCd)
            {
                g_uiMgr.showTip(getDesByLan("请稍候再发")+"...",true);
                return false;
            }
            return true;
        }
        /**
         * 发送表情函数
         * @param index
         */
        public sendFaceFunction(index:number):void
        {
            sendNetMsg(0x00C0,1,gamelib.data.UserInfo.s_self.m_id,index);
        }

        /**
         * 发送聊天函数
         * @param type:2:输入聊天，4：快捷聊天
         */
        public sendChatFunction(type:number,msg:string):void
        {
            sendNetMsg(0x0074,type,0,"",msg);
            // if(Math.random() * 10 < 5)
                // this.addMsg(gamelib.data.UserInfo.s_self,msg);
            // else
            //     this.addMsg(null,msg);
        }
        /**
         * 发送弹幕函数
         */
        public sendDanmuFunction(type:number,msg:string):void
        {
            sendNetMsg(0x0076,1,0,0,msg);
        }
        public getMsgByNetData(data:any):string
        {
            if(data.type == 4)
            {
                var arr:Array<any> = this._quickTalkList.dataSource;
                var index:number = parseInt(data.msg);
                var temp:any = arr[index];
                if(temp == null)
                    return "";
                if(typeof temp == "string")
                {
                    return temp;
                }
                return temp.msg; 
            }            
            return data.msg;
        }
        public addMsg(user:data.UserInfo,msg:string):void
        {
            if(GameVar.g_platformData['chat_histroy_disabled'])
                return;
           if(this._histroy.dataSource == null)
               this._histroy.dataSource = [];
           if(this._histroy.dataSource.length >= this._histroy_ds_totalNum)
            {
                this._histroy.deleteItem(0);
            }
            this._histroy.addItem([user,msg]);
            this._histroy.tweenTo(this._histroy.dataSource.length - 1);
        }
        /**
         * 通过序号获取快捷聊天消息
         * @function
         * @DateTime 2018-05-04T11:44:22+0800
         * @param    {number}                 index [description]
         * @return   {string}                       [description]
         */
        public getQuickTalkByIndex(index:number):string
        {
            var arr:Array<any> = this._quickTalkList.dataSource;
            return arr[index];
        }
        public onData0x0074(user:data.UserInfo,obj:any):any
        {
            if(user == null)
                 return;
            var str:string = obj.msg;
            switch(obj.type)
            {
                case 1://系统消失
                    if(obj.sendId == 0)
                        this.addMsg(null,"[" + getDesByLan("系统") + "]："+ str);
                    break;
                case 2: //输入聊天
                      this.addMsg(user,str);
                    break;
                case 4: //快捷聊天
                    var arr:Array<any> = this._quickTalkList.dataSource;
                    var index:number = parseInt(str);
                    var hz:string = user.m_sex  == 1 ? "_m" :"_w";                    
                    var temp:any = arr[index];
                    if(temp == null)
                        return;
                    if(typeof temp == "string")
                    {
                        str = temp;
                    }
                    else
                    {
                        if(temp.sound)
                        {
                            var isCommon:boolean = temp.isCommon;
                            if(temp.checkSex)
                                playSound_qipai(temp.sound + hz,1,null,isCommon);
                            else
                                playSound_qipai(temp.sound,1,null,isCommon);
                        }  
                        str = temp.msg; 
                    }
                    break;
            }
            return str
        }
        /**
         * 弹幕
         * @param obj 
         * @param user 
         */
        public onData0x0076(obj:any,user:data.UserInfo):void
        {
            this.addMsg(user,obj.msg);
        }
    }

    export class TalkItem extends laya.ui.Box
    {
        private _head:laya.ui.Image;
        private txt_name:laya.ui.Label;
        private txt_msg:laya.ui.Label;
        private _img_bg:laya.ui.Image;

        private _isSelf:boolean;
        private _isSystem:boolean;

        private _headSize:number = 64;
        private _systemHeight:number = 39;
        private _bgSizeGrid:string = "15,15,15,15";
        public constructor()
        {
            super();
          
            this.txt_msg = new laya.ui.Label();
            this.txt_msg.fontSize = 24;

            this._img_bg = new laya.ui.Image();            
            this.addChild(this._img_bg);
            this.addChild(this.txt_msg);
            this._img_bg.height = 39;
           

            this._head = new laya.ui.Image();
            this._head.size(this._headSize,this._headSize);
            this.txt_name = new laya.ui.Label();
            this.txt_name.color = "#EFEFEF";
            this.txt_name.fontSize = 18;
            this.addChild(this._head);
            this.addChild(this.txt_name);
            this._img_bg.sizeGrid = this._bgSizeGrid;

        }
        public setData(user:gamelib.data.UserInfo,msg:string,width:number):void
        {
            this.txt_msg.text = msg;
            var self_name:string = "#834f24";
            var self_msg:string = "#834f24";
            var other_name:string = "#272625";
            var other_msg:string = "#474747";
            var system_msg:string  = "#E44530"

            var temp :any = GameVar.g_platformData['chat_color'];
            if(temp)
            {    
                if(temp['self_name'])
                    self_name = temp['self_name'];
                if(temp['self_msg'])
                    self_msg = temp['self_msg'];
                if(temp['other_name'])
                    other_name = temp['other_name'];
                if(temp['other_msg'])
                    other_msg = temp['other_msg'];
                if(temp['system_msg'])
                    system_msg = temp['system_msg'];
            }


            if(user == null)
            {
                this.txt_msg.color = "#E44530";
                this._isSystem = true;
                this.width = width;  
                this.height = this._systemHeight;   
            }
            else
            {
                this._isSystem = false;
                this._isSelf = user.m_id == gamelib.data.UserInfo.s_self.m_id;
                this.width = width;
                this.height = this._headSize;
                
                if(user.m_pId == 0)
                {
                    this.txt_name.text = user.m_name_ex;
                }
                else
                {
                    this.txt_name.text = user.m_name_ex + "(ID:"+ user.m_pId +")"    
                }
                
                this._head.skin = user.m_headUrl;
                if(this._isSelf)
                {
                    this.txt_msg.color = self_msg;
                    this.txt_name.color = self_name;
                }
                else
                {
                    this.txt_msg.color = other_msg;
                    this.txt_name.color = other_name;
                }
            }

            this.build();
            this.updateSize();
        }
        private updateSize():void
        {                 
            this._img_bg.width = this.txt_msg.width + 40;
        }
        private build():void
        {            
            if(this._isSystem)
            {                
                this._img_bg.skin = "chat/chat_bg_1.png";        //确保有底，chat_bg_3可能不存在
                this._img_bg.skin = "chat/chat_bg_3.png";
                this._img_bg.sizeGrid = this._bgSizeGrid;
                this._head.visible = this.txt_name.visible = false;
                this._img_bg.top = this._img_bg.left = 0;                
                this._img_bg.bottom = 0;
                this.txt_msg.left = 10;
                this.txt_msg.bottom = this.txt_msg.top = 5;     
                
            }
            else
            {
                this._head.visible = this.txt_name.visible = true;
                this._img_bg.left = this._img_bg.top = this.txt_msg.left = this.txt_msg.top = parseInt("dd");

                if(!this._isSelf)
                {
                    this._img_bg.skin = "chat/chat_bg_2.png";
                    this.txt_msg.anchorX = this._img_bg.anchorX = this.txt_name.anchorX = 0;
                    this._head.top = 0;
                    this._head.x = 0;
                    this.txt_name.x = this._headSize + 5;
                    this.txt_name.top = 3;
                    
                    this._img_bg.x = this._headSize + 5;                
                    this._img_bg.bottom = 0;

                    this.txt_msg.x = this._headSize + 10;
                    this.txt_msg.bottom = 7.5;        
                }
                else
                {
                    this._img_bg.skin = "chat/chat_bg_1.png";
                    this._head.top = 0;
                    this._head.x = this.width - this._headSize;
                    this.txt_msg.anchorX = this._img_bg.anchorX = this.txt_name.anchorX = 1;

                    this.txt_name.x = this.width - this._headSize - 5;
                    this.txt_name.top = 3;
                    
                    this._img_bg.x = this.width - this._headSize - 5;                
                    this._img_bg.bottom = 0;

                    this.txt_msg.x = this.width - this._headSize - 25;
                    this.txt_msg.bottom = 7.5;        
                }
            }
        }
        
    }
}