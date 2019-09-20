/**
 * Created by wxlan on 2016/3/15.
 */

module gamelib.control
{
    /**
     * 控制一些方法按顺序调用。
     * 先调用addStep，添加需要调用的回掉，
     * 最后调用start，开始顺序调用。
     * 
     */
    export class StepManager
    {
        private _list:Array<any>;
        public constructor()
        {
            this._list = [];
        }
        /**
         * 添加回调
         * @param    {Function}               callBack  [description]
         * @param    {any}                    thisObj   [description]
         * @param    {Array<any>}             args      [description]
         * @param    {number}                 delayTime [在此方法调用后延迟多少毫秒调用下一个方法]
         */
        public addStep(callBack:Function,thisObj:any,args:Array<any>,delayTime:number):void
        {
            var obj:any = {
                fun:callBack,
                args:args,
                thisObj:thisObj,
                delay:delayTime
            };
            this._list.push(obj);
        }
        public clear():void
        {
            this._list.length = 0;
            Laya.timer.clearAll(this);
        }
        /**
         * 开始调用列表中的方法
         * @function
         * @DateTime 2018-04-11T16:56:45+0800
         */
        public start():void
        {
            if(this._list.length == 0)
            {
                console.log("处理完成!");
                return;
            }
            var obj = this._list.shift();
            var callBack:Function = obj.fun;
            var thisObj:any = obj.thisObj;
            var args:Array<any> = obj.args;
            var delayTime:number = obj.delay;
            callBack.apply(thisObj,args);
            if(delayTime == 0)
                this.start();
            else
            {
               // egret.Tween.get(obj).wait(delayTime).call(this.start,this);
               Laya.timer.once(delayTime,this,this.start);
            }
        }

    }

}