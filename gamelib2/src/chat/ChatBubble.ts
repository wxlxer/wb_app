/**
 * Created by wxlan on 2017/1/14.
 */
module gamelib.chat
{
    /**
     * 聊天泡泡.需要把所有玩家的泡泡资源传过来
     * @class ChatBubble
     */
    export class ChatBubble
    {
        private static _instance:ChatBubble;
        /**
         * @static 
         * @property s_instance
         */
        public static get s_instance():ChatBubble
        {
            if(ChatBubble._instance == null)
                ChatBubble._instance = new gamelib.chat.ChatBubble();
            return ChatBubble._instance;
        }
        public constructor()
        {
            
        }
        private _list:Array<any>;
        private _enabled:boolean;
        public init(arr:Array<any>):void
        {
            this._list = arr;
            Laya.timer.once(100,this,function()
            {
                arr.forEach(function(ui:any,index:number,list:Array<any>):void
                {
                    ui.visible = false;
                    ui.mouseEnabled = false;
                    ui["__oldY"] = ui.y;
                    ui["__oldX"] = ui.x;
                })
            });
            this._enabled = true;
        }
        public set enabled(value:boolean)
        {
            this._enabled = value;
        }
        /**
         * 显示消息，用指定的资源
         * @function
         * @DateTime 2018-03-17T13:48:32+0800
         * @param    {any}                    res [description]
         * @param    {string}                 msg [description]
         */
        public showMsgByRes(res:any,msg:string):void
        {
            if(res == null || !this._enabled)
                return;
            var txt = res.getChildAt(1);
            txt.text = msg;
            var oldY:number = res["__oldY"];
            res.y = oldY + 100;
            res.alpha = 0.1;
            res.visible = true;

            var bg:any = res.getChildAt(0);
            if(txt.left)
            {
                res.width = txt.width + txt.left * 2;
            }
            else
            {                
                res.width = txt.width + txt.right * 2;

                if(res.anchorX != 1)
                    res.x = res["__oldX"] - res.width;
            }
            res.height = 60
            var timeLine:Laya.TimeLine = new Laya.TimeLine();
            timeLine.addLabel("show",0).to(res,{y:oldY,alpha:1},400,null,0);
            timeLine.addLabel("close",0).to(res,{y:oldY - 100,alpha:0},400,null,3000);
            timeLine.play(0,false);
            timeLine.once(laya.events.Event.COMPLETE,this,this.onShowEnd,[res,timeLine]);            
        }
        /**
         * 显示消息，通过传如的位置号
         * @function
         * @DateTime 2018-03-17T13:48:56+0800
         * @param    {number}                 localSeat [description]
         * @param    {string}                 msg       [description]
         */
        public showMsg(localSeat:number,msg:string):void
        {
            if(localSeat == -1|| !this._enabled)
                return;
            var res:any = this._list[localSeat];
            this.showMsgByRes(res,msg);
        }
        private onShowEnd(res:any,timeLine:Laya.TimeLine):void
        {
            res.visible = false;
            timeLine.destroy();
        }
    }
}
