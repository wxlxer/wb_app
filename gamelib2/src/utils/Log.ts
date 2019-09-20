
/**
 * Created by wxlan on 2016/5/5.
 */

var logStr:string = "";

window.onerror = function(msg,path,line)
{
    gamelib.Log.error(msg);
    gamelib.Log.error("    at " + path + ":" + line);
}
/**
 * 快捷的打印消息到控制台
 * @param message {any} 要打印的数据
 */
function trace(message: any): string
{
    var msg: any = message;
    // if(msg instanceof egret.Rectangle)
    // {
    //     msg = "{ x=" + msg.x + ",y=" + msg.y + ",width=" + msg.width + ",height=" + msg.height + " }";
    // }
    // else if(msg instanceof egret.Point)
    // {
    //     msg = "{ x=" + msg.x + ",y=" + msg.y + " }";
    // }
    // else if(Array.isArray(msg))
    // {
    //     console.log(msg);
    //     gamelib.Log.trace(msg);
    // }
    // else if(typeof (message) == "object")
    // {
    //     try
    //     {
    //         console.log(JSON.stringify(msg));
    //         gamelib.Log.trace(msg);
    //     }
    //     catch(e)
    //     {
    //         console.log(msg);
    //         gamelib.Log.trace(msg);
    //     }
    // }
    // else
    // {
    //     console.log(msg);
    //     gamelib.Log.trace(msg);
    // }
    return msg;
}
/**
 * 快捷的抛错误消息到控制台
 * @param error {any} 要抛出的错误
 */
function error(error: any): string
{
    console.error(error);
    gamelib.Log.error(error);
    return error;
}
/**
 * 快捷的抛出警告消息到控制台
 */
function warn(warn: any): string
{
    console.warn(warn);
    gamelib.Log.warn(warn);
    return warn;
}


module gamelib
{
    /**
     * 日志界面
     */
    export class Log extends laya.display.Sprite
    {
        private _label: laya.ui.Label;
        /**
         * 日志普通文本
         */
        public get label(): laya.ui.Label {
            return this._label;
        }
        public set label(value: laya.ui.Label) {
            this._label = value;
        }
        private _htmlText: string = "";
        /**
         * 日志当前的html文本
         */
        public get htmlText(): string {
            return this._htmlText;
        }
        /**
         * HtmlTextParser解析最大行数
         */
        public maxLength:number = 40;
        public constructor() {
            super();
            this.mouseEnabled = false;
            this.initChild();
        }
        private initChild(): void 
        {            
            this._label = new laya.ui.Label();
            //this._label.wordWrap = true;
            this._label.bottom = 0;
            this.addChild(this._label);
        }

        private static _useLog: boolean;
        public static get useLog(): boolean {
            return this._useLog;
        }
        /**
         * 隐藏/显示日志
         */
        public static set useLog(value: boolean) {
            this._useLog = value;
            this.init();
            if(!value && this.log.stage) {
                this.log.parent.removeChild(this.log);
            }
            else if(value)
            {
                //egret.MainContext.instance.stage.addChild(this.log);
            }
        }
        private static log: Log;
        private static init(): void {
            this.log = this.log || new Log();
            if(this.log.parent) {
                this.log.parent.setChildIndex(this.log,this.log.parent.numChildren);
            }
        }
        public static trace(message: any): void {
            this.init();
           // this.log.htmlText += '<font color="#000000" size="18">' + message + '\n</font>';
        }
        public static warn(message: any): void {
            this.init();
           // this.log.htmlText += '<font  color="#ffff00" size="18">' + message + '\n</font>';
        }
        public static error(message: any): void {
            this.init();
           // this.log.htmlText += '<font  color="#ff0000" size="18">' + message + '\n</font>';
        }
    }
}