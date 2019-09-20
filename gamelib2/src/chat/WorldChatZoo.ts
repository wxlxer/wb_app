namespace gamelib.chat {

    export class WorldChatZoo  implements gamelib.core.INet
    {
          private _res: any;
          private _textInput: Laya.TextInput;    // 文本输入框
          private _btnSend: Laya.Button;         // 发送按钮

          private _takeList: Laya.Panel;         // 聊天记录列表

          private _needClose:boolean;
		  
		private _curMsgPosY:number = 0;      // 当前聊天信息显示的坐标Y
		 private _maxShowData:number = 50;    // 最多显示聊天记录条数

          private _msgMaxWidth:number = 360;    // 文字最多显示的宽度
		
          constructor(res: any,needClose:boolean = true) {
            this._res = res["ui_chat"];
            this.init();
            this._needClose = needClose;
          }
          priority:number;

              /**
               * 初始化
               */
          protected init(): void {
            this._textInput = this._res["txt_input"];// 文本输入框
            this._btnSend = this._res["btn_send"];   // 发送按钮
            this._takeList = this._res["l_talk"];    // 聊天记录列表
            this._res.visible = false;

            // 最多输入50个字符
            this._textInput.maxChars = 50;

            // 聊天内容列表
            this._takeList.vScrollBar.autoHide = true;
            this._takeList.vScrollBar.elasticBackTime = 100;
            this._takeList.vScrollBar.elasticDistance = 100;
          }

          /**
           * 设置文字显示的最大宽度
          */
          public setMsgMaxWidth(width:number):void {
            this._msgMaxWidth = width;
          }

          /**
           * 获取文字显示的最大宽度
          */
          public getMsgMaxWidth(width:number):number {
            return this._msgMaxWidth;
          }

          /**
          * 界面显示
          */
          public show(): void
          {

            this._res.visible = true;
            // 发送按钮
            this._btnSend.on(laya.events.Event.CLICK, this, this.onSend);
            // 聊天内容
			// 显示世界聊天记录
            this.showTalkData(WorldChatData.s_instance.m_roomTakeData);
            if(this._needClose)
                Laya.stage.on(Laya.Event.CLICK,this,this.onClickStage);
            g_net.addListener(this);

          }
          
              /**
               * 界面关闭
               */
          public close(): void {
            this._res.visible = false;
            // 发送按钮
            this._btnSend.off(laya.events.Event.CLICK, this, this.onSend);
            if(this._needClose)
                Laya.stage.off(Laya.Event.CLICK,this,this.onClickStage);
            g_net.removeListener(this);

            g_signal.dispatch("WorldChatZooClose",0);
          }
          public onClickStage(evt:Laya.Event):void
          {
              evt.stopPropagation();
              if(this.isChild(evt.target,this._res))
              {
                  return;
              }
              this.close();
              
          }
          private isChild(target:any,container:Laya.Node):boolean
          {
              if(target == container)
                  return true;
              for(var i:number = 0; i < container.numChildren; i++)
              {
                  if(this.isChild(target,container.getChildAt(i)))
                      return true;
              }
              return false;
          }
          /**
           * 销毁
           */
          public destroy(): void {
            this._textInput = null;
            this._btnSend = null;
            this._takeList = null;
          }

              /**
               *    接受网络协议
               */
          public reciveNetMsg(msgId: number, data: any): void {

            switch (msgId) {
              case 0x2215:
                if (data.type == 1 && data.result == 1) 	// 房间聊天
                {     
					this.addTalkData(data);
                }
                break;
            }
          }

              /**
               * 
               * 发送消息
               * @param evt
               */
          private onSend(evt: laya.events.Event): void {
            playButtonSound();
			
          if(gamelib.data.UserInfo.s_self.m_level < GameVar.g_platformData['chat_config']['input_level'] ) {    // 玩家等级限制
            var str:string = utils.StringUtility.format(getDesByLan("等级不足{0}级"),[GameVar.g_platformData['chat_config']['input_level']]);
            g_uiMgr.showTip(str,true);
            return;
          }

            var msg: string = this._textInput.text;
            if (msg == '') {
              g_uiMgr.showTip(getDesByLan("无法发送空内容"), true);
              return;
            }

            if (msg.length > 50) {
              msg = msg.slice(0, 50);
              msg += "...";
            }

            // 发送聊天内容
            sendNetMsg(0x2215, 1, 0, msg);

            this._textInput.text = '';
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
                var item:gamelib.chat.TalkItem_World = new gamelib.chat.TalkItem_World();
                item.setData(data[i],this._takeList.width,this._msgMaxWidth);
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
            var item:gamelib.chat.TalkItem_World = new gamelib.chat.TalkItem_World();
            item.setData(data,this._takeList.width,this._msgMaxWidth);
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
    }
}