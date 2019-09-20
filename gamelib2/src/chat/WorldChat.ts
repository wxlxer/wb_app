/*
* name;
*/

namespace gamelib.chat {

    /**
     *    世界聊天数据(所有游戏通用)
     */
    export class WorldChatData {

        private static _instance:WorldChatData;

        public static get s_instance():WorldChatData
        {
            if(WorldChatData._instance == null)
                WorldChatData._instance = new WorldChatData();
            return WorldChatData._instance;
        }

        public m_worldTakeData:Array<any> = [];       // 世界聊天数据
        public m_roomTakeData:Array<any> = [];        // 房间聊天数据
        
        public m_maxRoomDataNum:number = 50;          // 最多保存房间聊天数据条数
        public m_maxWorldDataNum:number = 50;          // 最多保存世界聊天数据条数

        /**
         *    解析数据
         */ 
        public onAnalysisData(data:any):void {

            if(data.result != 1) {  // 没有成功
                this.sendResult(data.result);
                return ;
            }

            switch (data.type) {
                case 1:    // 游戏(房间)
                    if(this.m_roomTakeData.length > this.m_maxRoomDataNum) {
                        this.m_roomTakeData.shift();
                    }
                    this.m_roomTakeData.push(data);
                    break;
                
                case 2:    // 世界
                    if(this.m_worldTakeData.length > this.m_maxWorldDataNum) {
                        this.m_roomTakeData.shift();
                    }
                    this.m_worldTakeData.push(data);

                    // 跑马灯
                    g_uiMgr.showPMD(data.nickName +":" + data.content);
                    break;

                case 3:    // 游戏公告
                case 4:    // 系统公告
                    if(this.m_worldTakeData.length > this.m_maxWorldDataNum) {
                        this.m_roomTakeData.shift();
                    }
                    data.headUrl = GameVar.common_ftp + "qpq_config/" + GameVar.platform +"/gameIcon.png";
                    data.nickName = "系统"
                    this.m_worldTakeData.push(data);
                    // 跑马灯
                    g_uiMgr.showPMD(data.content);
                    break;
            }
        }

        /**
         *    添加跑马灯信息
         *   data.PID        // PID（玩家PID(系统是0)）
         *   data.headUrl    // 头像
         *   data.nickName   // 昵称
         *   data.sign       // 标志(0表示文字 1表示表情)
         *   data.content    // 消息内容
         *   data.level      // 等级
         */
        public addPMDData(msg:string):void {

            var data:any = {};
            data.level = data.PID = 0;
            data.headUrl = GameVar.common_ftp + "qpq_config/" + GameVar.platform +"/gameIcon.png";
            data.nickName = getDesByLan("系统")
            data.sign = "";
            data.content = msg;
            if(this.m_worldTakeData.length > this.m_maxWorldDataNum) {
                this.m_roomTakeData.shift();
            }
            this.m_worldTakeData.push(data);
        }

        /**
         *    清理房间聊天数据
         */
        public clearRoomTakeData():void {
    
            this.m_roomTakeData.length = 0;
        }

        /**
         * 发送消息失败结果
         * @param reult 
         */
        private sendResult(reult:number):void {
            switch(reult) {
                case 0: // 失败
                    g_uiMgr.showTip(getDesByLan("失败"));
                    break;

                case 2: // 禁言
                    g_uiMgr.showTip("禁言中！");
                    break;

                case 3: // 喇叭不足
                    g_uiMgr.showTip("喇叭不足！");
                    break;
                    
                case 4: // 等级不足
                    g_uiMgr.showTip("等级不足！");
                    break;
            }
        }
    }


    /**
     *    世界聊天(公共)
     */
    export class WorldChat extends gamelib.core.Ui_NetHandle {

        private _tab:Laya.Tab;                // 世界聊天  房间聊天
        private _takeList:Laya.Panel;         // 聊天记录列表
        private _btnSend:Laya.Button;         // 发送按钮

        /******世界聊天*******/
        private _boxWorld:Laya.Box;             // 世界聊天组
        private _textInputWorld:Laya.TextInput; // 世界聊天文本输入框
        private _txtLaBa:Laya.Label;            // 喇叭数量

        /*******房间聊天******/
        private _boxRoom:Laya.Box;              // 房间聊天组
        private _textInputRoom:Laya.TextInput;  // 房间聊天文本输入框
        private _btnFace1:Laya.Button;          // 表情按钮
        private _btnFace2:Laya.Button;          // 表情按钮

        private _imgFace:Laya.Image;            // 表情列表组
        private _faceList:Laya.List;            // 表情列表

        private _curFaceType:number;            // 当前表情类型(1通用表情 2动物乐园表情)

        private _selectIndex1:number;           // 通用表情当前选择的表情下标
        private _selectIndex2:number;           // 动物表情当前选择的表情下标

        private _lastSendTime_world:number;
        private _lastSendTime_face:number;
        
        private _curMsgPosY:number = 0;        // 当前聊天信息显示的坐标Y
        private _maxShowData:number = 50;      // 最多显示聊天记录条数

        private _typeNumber:number;            //聊天房间数量
        constructor(){
            super(GameVar.s_namespace +"/Art_WorldChat");
        }

        /**
         * 初始化
         */ 
        protected init(): void {
            super.init();

            this._tab = this._res["tab_pingdao"];    // 世界聊天  房间聊天
            this._takeList = this._res["l_talk"];    // 聊天记录列表
            this._btnSend = this._res["btn_send"];   // 发送按钮

            this._boxWorld = this._res["b_chat_world"];      // 世界聊天组
            this._textInputWorld = this._res["txt_input2"];  // 世界聊天文本输入框
            this._txtLaBa = this._res["txt_number"];         // 喇叭数量

            this._boxRoom = this._res["b_chat_room"];      // 房间聊天组
            this._textInputRoom = this._res["txt_input1"]; // 房间聊天文本输入框
            this._btnFace1 = this._res["btn_face2"];       // 表情按钮1
            this._btnFace1["name"] = "btn_face1";
            if(this._res["btn_face3"]) {
                this._btnFace2 = this._res["btn_face3"];   // 表情按钮2
                this._btnFace2["name"] = "btn_face2";
            }
            
            this._imgFace = this._res["img_biaoqing"];     // 表情列表组
            this._faceList = this._res["list_biaoqing"];   // 表情列表

            this._boxWorld.visible = false;
            this._boxRoom.visible = false;
            this._imgFace.visible = false;
            
            // 世界聊天  房间聊天
            this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
            if(GameVar.g_platformData["chat_config"]&&GameVar.g_platformData["chat_config"]["tabs"])
            {
                this._tab.labels = GameVar.g_platformData["chat_config"]["tabs"];
                //this._typeNumber = this._tab.items.length;
            }
            this._typeNumber = this._tab.items.length;
            // 聊天内容列表
            this._takeList.vScrollBar.autoHide = true;
            this._takeList.vScrollBar.elasticBackTime = 100;
            this._takeList.vScrollBar.elasticDistance = 100;

            var str:string = utils.StringUtility.format(getDesByLan("最多输入{0}个字"),[50]);
            // 世界聊天文本输入框
            this._textInputWorld.maxChars = 50;
            this._textInputWorld.prompt = str;
            this._txtLaBa.text = "0";

            // 房间聊天文本输入框
            this._textInputRoom.maxChars = 50;
            this._textInputRoom.prompt = str;

            // 表情列表
            this._faceList.selectedIndex = 0;
            this._faceList.selectEnable  = true;
            this._faceList.renderHandler = Laya.Handler.create(this,this.onFaceListRender,null,false);

            // 当前表情类型(1通用表情 2动物乐园表情)
            this._curFaceType = 0;

            this._selectIndex1 = 0;           // 通用表情当前选择的表情下标
            this._selectIndex2 = 0;           // 动物表情当前选择的表情下标

            this._lastSendTime_face = this._lastSendTime_world = 0;

        }

         /**
         * 界面显示
         */
        protected onShow(): void {
            super.onShow();

            // 世界聊天  房间聊天
            if(this._tab.items.length > 1)
                this._tab.selectedIndex = 1;
            else
                this._tab.selectedIndex = 0;
            this.onTabChange();

            // 发送按钮
            this._btnSend.on(laya.events.Event.CLICK,this,this.onSend);
            // 表情按钮1
            this._btnFace1.on(laya.events.Event.CLICK,this,this.onFaceList);
            // 表情按钮2
            if(this._btnFace2) {
                this._btnFace2.on(laya.events.Event.CLICK,this,this.onFaceList);
            }
        }

        // 切换世界聊天 房间聊天
        protected onTabChange(evt?:laya.events.Event):void
        {
            var index:number = this._tab.selectedIndex;            
            // var temp:any = this._tab.items[index];

            if(index == 0)        // 世界聊天
            {
               if(this._typeNumber == 2)
                   this.showWorldChat();
               else
                   this.showRoomChat();
            }
            else if(index == 1)        // 房间聊天
            {
               this.showRoomChat();
            }
        }
        protected showWorldChat():void
        {
            console.log("世界聊天！！！！！！！！");
           this._boxWorld.visible = true;
           this._boxRoom.visible = false;
           // 显示世界聊天记录
           this.showTalkData(WorldChatData.s_instance.m_worldTakeData);
           // 喇叭数量
           this._txtLaBa.text = "" + gamelib.data.UserInfo.s_self.m_laba;
           // 表情列表
           this._imgFace.visible = false;
           this._textInputRoom.text = '';
        }
        protected showRoomChat():void
        {
            console.log("房间聊天！！！！！！！！");
           this._boxWorld.visible = false;
           this._boxRoom.visible = true;
           // 显示房间聊天记录
           this.showTalkData(WorldChatData.s_instance.m_roomTakeData);
           this._textInputWorld.text = '';
        }

        /**
         * 界面关闭
         */
        protected onClose(): void {
            super.onClose();

            // 发送按钮
            this._btnSend.off(laya.events.Event.CLICK,this,this.onSend);
            // 表情按钮
            this._btnFace1.off(laya.events.Event.CLICK,this,this.onFaceList);   
            // 表情按钮2
            if(this._btnFace2) {
                this._btnFace2.off(laya.events.Event.CLICK,this,this.onFaceList);
            }

            this._curFaceType = 0;
            this._imgFace.visible = false;
        }

        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();

        }

        public reciveNetMsg(msgId: number, data: any): void {
            super.reciveNetMsg(msgId,data);

           switch (msgId) {
                case 0x2215:
                    if(data.result != 1) {  // 没有成功  
                        return ;
                    }
                    if(data.type == 1)    //接到的消息是房间聊天
                    {
                        if(this._typeNumber == 1 || this._tab.selectedIndex == 1)
                            this.addTalkData(data);
                    }
                    else                   //接到的消息是世界聊天
                    {
                        if(this._typeNumber == 2 && this._tab.selectedIndex == 0)
                            this.addTalkData(data);
                    }
                    // if(this._tab.selectedIndex == 0 && data.type != 1) {    // 显示的是世界聊天  并且 接到的消息是世界聊天
                    //     this.addTalkData(data);
                    // } else if(this._tab.selectedIndex == 1 && data.type == 1){ //  显示的是房间聊天  并且 接到的消息是房间聊天
                    //     this.addTalkData(data);
                    // }
                    break;

                case 0x0036:
                    // 喇叭数量
                    this._txtLaBa.text = "" + gamelib.data.UserInfo.s_self.m_laba;
                    break;
            }
        }
        
        /**
         *    显示聊天内容
         */
        private showTalkData(data:Array<any>):void {
            // 检查参数
            if(data == null) {
                console.log("WorldChat::showTalkData 参数data为空！！！");
                return;
            }
            
            // 移除旧的聊天记录
            this._takeList.removeChildren();
            // 位置重新计算
            this._curMsgPosY = 0;
            
            // 聊天记录添加到显示容器里
            for(var i:number = 0; i < data.length; i++) {
                var item:TalkItem_World = new TalkItem_World();
                item.setData(data[i],this._takeList.width,740);
                item.y = this._curMsgPosY;
                this._takeList.addChild(item);
                
                this._curMsgPosY += item.height;
            }
            
            // 刷新位置
            this._takeList.refresh();
            if(this._takeList.height < this._curMsgPosY) {
                this._takeList.scrollTo(0,this._curMsgPosY - this._takeList.height);
            }
        }
        
        /**
         *    添加聊天记录
         */
        private addTalkData(data:any):void {
            // 检查参数
            if(data == null) {
                console.log("WorldChat::addTalkData 参数data为空！！！");
                return;
            }
            
            // 添加聊天记录
            var item:TalkItem_World = new TalkItem_World();
            item.setData(data,this._takeList.width,740);
            item.y = this._curMsgPosY;
            this._takeList.addChild(item);
            
            this._curMsgPosY += item.height;
            
            // 刷新位置
            this._takeList.refresh();
            if(this._takeList.height < this._curMsgPosY) {
                this._takeList.scrollTo(0,this._curMsgPosY - this._takeList.height);
            }
            
            // 显示聊天记录达到上限
            if(this._takeList.numChildren > this._maxShowData) {
                // 删除第一条
                this._takeList.removeChildAt(0);
                // 重新排版
                this.recountChildrenPosY();
            }
            
        } 

        /**
         *    重新计算聊天记录的位置
         */
        private recountChildrenPosY():void {
            this._curMsgPosY = 0;
            for(var i:number = 0; i < this._takeList.numChildren; i++) {
                var item:any = this._takeList.getChildAt(i);
                if(item) {
                    item.y = this._curMsgPosY;

                    this._curMsgPosY += item.height;
                }
            }
        }

        // 表情 
        private onFaceListRender(item:laya.ui.Box,index:number):void {

            if(this._curFaceType == 1) {
                getChildByName(item,"btn_face1").skin = "qpq/face/btn_face_" + this._faceList.dataSource[index] + ".png"

                var imgFace:Laya.Image = getChildByName(item,"img_face1");
                if(index == this._faceList.selectedIndex) {
                    imgFace.visible = true;
                    this._selectIndex1 = index;
                } else {
                    imgFace.visible = false;
                }
                

            } else if(this._curFaceType == 2) {

                getChildByName(item,"btn_face1").skin = GameVar.s_namespace + "/face/btn_face_" + this._faceList.dataSource[index] + ".png"

                var imgFace:Laya.Image = getChildByName(item,"img_face1");
                if(index == this._faceList.selectedIndex) {
                    imgFace.visible = true;
                    this._selectIndex2 = index;
                } else {
                    imgFace.visible = false;
                }

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

            

            var time:number = Laya.timer.currTimer;
            if(this._imgFace.visible) {    // 发送表情

                // 发送表情的等级限制
                if(gamelib.data.UserInfo.s_self.m_level < GameVar.g_platformData['chat_config']['face_level'])
                {    
                    var str:string = utils.StringUtility.format(getDesByLan("等级不足{0}级"),[GameVar.g_platformData['chat_config']['face_level']]);
                    g_uiMgr.showAlertUiByArgs({msg:str})
                    return;
                }

                if(time - this._lastSendTime_face < GameVar.g_platformData["chat_config"].face_cd)
                {
                    g_uiMgr.showTip(getDesByLan("请稍候再发"));
                    return;
                }

                this._lastSendTime_face = time;
                if(this._curFaceType == 1) {      // 通用表情
                    var content:string = "" + (this._selectIndex1 + 1);
                    sendNetMsg(0x2215,1,1,content);

                    this.sendFaceFunction(this._selectIndex1);

                } else {    // 动物表情
                    var content:string = "" + (this._selectIndex2 + 31);
                    sendNetMsg(0x2215,1,1,content);

                    this.sendFaceFunction(this._selectIndex2+30);
                }
                this._imgFace.visible = false;

            } else {    // 发送文字
                
                if(gamelib.data.UserInfo.s_self.m_level < GameVar.g_platformData['chat_config']['input_level'] ) {    // 玩家等级限制
                    var str:string = utils.StringUtility.format(getDesByLan("等级不足{0}级"),[GameVar.g_platformData['chat_config']['input_level']]);
                    g_uiMgr.showTip(str,true);
                    return;
                }

                var msg:string = "";
                switch (this._tab.selectedIndex)
                {
                    case 0:    // 世界聊天
                        if(this._typeNumber == 2)
                        {
                            msg = this._textInputWorld.text;
                            if(gamelib.data.UserInfo.s_self.m_laba <= 0)
                            {
                                g_uiMgr.showAlertUiByArgs({msg:"您的喇叭不足，请先补充道具后再发送!"})
                                return;
                            }                        
                        }
                        else
                        {
                            msg = this._textInputRoom.text;
                        }
                        break;
                    case 1:    // 房间聊天
                        msg = this._textInputRoom.text;
                        break;
                }

                if(msg == '')
                {
                    g_uiMgr.showTip(getDesByLan("无法发送空内容"),true);
                    return;
                }

                if(time - this._lastSendTime_world < GameVar.g_platformData["chat_config"].input_cd)
                {
                    g_uiMgr.showTip(getDesByLan("请稍候再发"));
                    return;
                }
                this._lastSendTime_world = time;
                if(msg.length > 50)
                {
                    msg = msg.slice(0,50);
                    msg += "...";
                }

                switch (this._tab.selectedIndex)
                {
                    case 0:    // 世界聊天
                        if(this._typeNumber == 2){
                            sendNetMsg(0x2215,2,0,msg);
                            this._textInputWorld.text = '';
                        }
                        else{
                            sendNetMsg(0x2215,1,0,msg);
                            this._textInputRoom.text = '';
                        }
                        
                        break;
                    case 1:    // 房间聊天
                        sendNetMsg(0x2215,1,0,msg);
                        this._textInputRoom.text = '';
                        break;
                }

            }
        }

        
        /**
         * 
         * 显示表情列表
         * @param evt
         */
        private onFaceList(evt:laya.events.Event):void
        {
            playButtonSound();

            switch (evt.currentTarget.name) {
                case "btn_face1":   // 表情1

                    if(this._curFaceType != 1) {

                        this._curFaceType = 1;
                        this._faceList.dataSource = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
                        this._imgFace.visible = true;

                    } else {

                        this._imgFace.visible = !this._imgFace.visible;
                    }
                    
                    break;
                
                case "btn_face2":   // 表情2

                    if(this._curFaceType != 2) {
                        this._curFaceType = 2;
                        this._faceList.dataSource = [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
                        this._imgFace.visible = true;
                    } else {
                        this._imgFace.visible = !this._imgFace.visible;
                    }
                    
                    break;
            }
        }

        /**
         * 发送表情函数
         * @param index
         */
        public sendFaceFunction(index:number):void
        {
            sendNetMsg(0x00C0,1,gamelib.data.UserInfo.s_self.m_id,index);
        }

    }


    /**
     *    聊天内容
     */
    export class TalkItem_World extends Laya.Box {
    
        private _head:Laya.Image;            // 头像
        private _militaryRank:Laya.Image;    // 军衔
        private _name:Laya.Label;            // 名字
        private _msg:Laya.Label;            // 消息
        private _face:Laya.Image;            // 表情
        private _bg:Laya.Image;                // 背景图片

        private _isSelf:boolean;            // 是否为自己信息
        private _isSystem:boolean;          // 是否为系统信息

        private _headSize:number = 64;      // 头像尺寸
        private _MRWidth:number = 44;       // 军衔宽度
        private _MRHeight:number = 39;      // 军衔高度
        
        private _msgMaxWidth:number = 740;    // 显示消息的最大宽度
        private _faceSize:number = 39;        // 表情的最大尺寸
        
        private _showType:number = 0;        // 显示的类型(0文字消息 1表情)
        
        private _bgSizeGrid:string = "15,15,15,15";

        constructor() {
            super();

            // 头像
            this._head = new Laya.Image();
            this._head.size(this._headSize,this._headSize);
            this.addChild(this._head);

            // 军衔
            this._militaryRank = new Laya.Image;
            this._militaryRank.size(this._MRWidth,this._MRHeight);
            this.addChild(this._militaryRank);
        
            // 昵称
            this._name = new Laya.Label();
            this._name.color = "#EFEFEF";
            this._name.fontSize = 18;
            this.addChild(this._name);

            // 背景
            this._bg = new Laya.Image();
            this._bg.sizeGrid = this._bgSizeGrid;
            this.addChild(this._bg);

            // 消息
            this._msg = new Laya.Label();
            this._msg.fontSize = 24;
            this.addChild(this._msg);

            // 表情
            this._face = new Laya.Image();
            this._face.size(this._headSize,this._headSize);
            this.addChild(this._face);
        }

        /**
         * 设置要显示的内容
         * @ data 显示的内容数据
         * @ width 宽度
         * @ msgMaxWidth 消息字符最多显示的宽度
         */
        public setData(data:any,width:number,msgMaxWidth:number):void {
            
            // 参数判断
            if(data == null) {
                console.log("TalkItem_World::setData 参数data为空！！！")
                return;
            }
            
            this.width = width;
            this._msgMaxWidth = msgMaxWidth;
            
            var self_name:string = "#834f24";        // 玩家自己名字颜色
            var self_msg:string = "#834f24";         // 玩家自己信息颜色
            var other_name:string = "#272625";       // 其他玩家名字颜色
            var other_msg:string = "#474747";        // 其他玩家信息颜色
            var system_name:string = "#272625";      // 系统名字颜色
            var system_msg:string  = "#E44530"       // 系统信息颜色

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
                if(temp['system_name'])
                    system_name = temp['system_name'];
                if(temp['system_msg'])
                    system_msg = temp['system_msg'];
            }           

            this._isSystem = data.PID == 0;
            this._isSelf = data.PID == gamelib.data.UserInfo.s_self.m_pId;
            
            // 匹配颜色
            if(this._isSelf) {
                this._msg.color = self_msg;
                this._name.color = self_name;
            } else if(this._isSystem){
                this._msg.color = system_msg;
                this._name.color = system_name;
            } else {
                this._msg.color = other_msg;
                this._name.color = other_name;
            }
            
            // 头像
            this._head.skin = data.headUrl;
            // 军衔
            if(!this._isSystem && window['qpq']['getMilitaryRankIcon']) 
            {
                this._militaryRank.skin =  window['qpq']['getMilitaryRankIcon'](data.level);
            } else {
                this._militaryRank.visible = false;
            }
            // 名字
            if(this._isSystem) {
                this._name.text = data.nickName;
            } else {
                this._name.text = utils.StringUtility.getNameEx(data.nickName ,7)+ "(ID:" + data.PID + ")";
            }
            // 消息
            this._msg.text = data.content;
            
            // 显示的类型(0文字消息 1表情)
            this._showType = data.sign;        
            
            // 消息类型
            if(data.sign == 0) {    // 文字消息
                this._msg.visible = true;
                this._bg.visible = true;
                
                this._face.visible = false;

            } else {    // 表情消息
                this._msg.visible = false;
                this._bg.visible = false;
                
                this._face.visible = true;
                this._face.removeChildren();

                // var classObj:any = gamelib.getDefinitionByName(GameVar.s_namespace + ".ui.face.Art_face_" + data.content +"UI");
                // if(classObj == null)
                //     return;

                // var face = new classObj();
                var face = this.getFaceRes(parseInt(data.content));
                if(face == null)
                    return;
                if(face.ani1)
                   face.ani1.play();

                this._face.addChild(face);
                this._face.scaleX = 0.7;
                this._face.scaleY = 0.7;
            }
            
            this.build();
            this.updateSize();
        }
        private getFaceRes(id:number):any
        {
             var url:string = ""
            if(id <= 20)
            {
                url = "qpq/face/Art_face_" + (id);               
            }
            else
            {
                url = GameVar.s_namespace + "/face/Art_face_" + (id);
            }
            return utils.tools.createSceneByViewObj(url);
        }

        private updateSize():void {
            
            if(this._showType == 0) { // 文字内容
                // 消息的宽度
                var msgWidth:number = this.getMsgWidth(this._msg);
                if(msgWidth > this._msgMaxWidth) {
                    msgWidth = this._msgMaxWidth;
                }

                // 消息的高度
                var msgHeight:number = this.getMsgHeight(this._msg,msgWidth);

                this._msg.width = msgWidth;
                this._msg.height = msgHeight;
                this._msg.wordWrap = true;

                this._bg.width = msgWidth + 20;
                this._bg.height = msgHeight + 20;
                    
                this.height = this._headSize + this._bg.height;
                
            } else {
                
                this.height = this._headSize + 30;
            }
            
        }

        private build():void {

            if(this._isSystem || !this._isSelf) {    // 系统消息 其他玩家消息
                
                // 设置背景图片
                if(this._isSystem) {
                    this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_1.png";
                    this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_3.png";
                } else {
                    this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_2.png";
                }
                
                // 设置锚点
                this._head.anchorX = 0;
                this._militaryRank.anchorX = 0;
                this._name.anchorX = 0;
                this._msg.anchorX = 0;
                this._bg.anchorX = 0;
                this._face.anchorX = 0;
                
                // 头像
                this._head.top = 0;
                this._head.x = 0;
                
                // 军衔
                this._militaryRank.x = this._headSize - this._MRWidth/2;
                this._militaryRank.top = this._headSize - this._MRHeight;
                
                // 名字
                this._name.x = this._headSize + 5;
                this._name.top = 3;
                
                // 消息
                this._msg.x = this._headSize + 35;
                this._msg.top = this._headSize/2 + 8;
                
                // 背景
                this._bg.x = this._headSize + 25;
                this._bg.top = this._headSize/2;
                
                // 表情
                this._face.x = this._headSize + 30;
                this._face.top = this._headSize/2 - 15;
            }
            else 
            {
                // 设置背景图片
                this._bg.skin = GameVar.s_namespace + "/chat/chat_bg_1.png"
                
                // 设置锚点
                this._head.anchorX = 1;
                this._militaryRank.anchorX = 1;
                this._name.anchorX = 1;
                this._msg.anchorX = 1;
                this._bg.anchorX = 1;
                this._face.anchorX = 1;
                
                // 头像
                this._head.top = 0;
                this._head.x = this.width;
                
                // 军衔
                this._militaryRank.x = this.width - this._headSize + this._militaryRank.width/2;
                this._militaryRank.top = this._headSize - this._MRHeight;
                
                // 名字
                this._name.x = this.width - this._headSize - 5;
                this._name.top = 3;
                
                // 消息
                this._msg.x = this.width - this._headSize - 35;
                this._msg.top = this._headSize/2 + 8;
                
                // 背景
                this._bg.x = this.width - this._headSize - 25;
                this._bg.top = this._headSize/2;
                
                // 表情
                this._face.x = this.width - this._headSize - 50;
                this._face.top = this._headSize/2 - 15;
            }
        }
        
        // 获取文字消息的宽度
        private getMsgWidth(label:Laya.Label):number {
            var txt:Laya.Text = new Laya.Text();
            txt.fontSize = label.fontSize;
            txt.overflow = Laya.Text.HIDDEN;
            txt.text = label.text;

            return txt.width;
        }

        // 获取文字消息的高度
        private getMsgHeight(label:Laya.Label,width:number):number {
            var txt:Laya.Text = new Laya.Text();
            txt.fontSize = label.fontSize;
            txt.overflow = Laya.Text.HIDDEN;
            txt.text = label.text;
            txt.width = width;
            txt.wordWrap = true;

            return txt.height;
        }

    }
}
