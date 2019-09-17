/**
 * Created by wxlan on 2016/9/20.
 */
module gamelib.core
{
    /**
     * 可以接收网络数据的协议
     * @class Ui_NetHandle
     * @extends  gamelib.core.BaseUi
     * @implements INet
     */
    export class Ui_NetHandle extends BaseUi implements INet
    {
        /**
         * 指定获得网络数据的优先级
         * @access public
         * @type {number}
         */
        public priority:number;
        public constructor(resname?:string)
        {
            super(resname)
        }
        public destroy():void
        {
            super.destroy();
        }
        /**
         * 接收到网络消息的处理
         * @function reciveNetMsg
         * @author wx
         * @access public
         * @DateTime 2018-03-15T20:59:01+0800
         * @param    {number}                 msgId 协议号，例如0x0001
         * @param    {any}                    data  [description]
         */
        public reciveNetMsg(api:string,data:any):void
        {

        }
        /**
         * 界面显示后会自动调用.不要主动都调用。同时会注册网络监听
         * @function onShow
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:15:32+0800
         */
        protected onShow():void
        {
            super.onShow();
            g_net.addListener(this);
        }
        /**
         * 界面关闭会自动调用。不要主动都调用 同时会移除网络监听
         * @function onClose
         * @author wx
         * @access protected
         * @DateTime 2018-03-16T10:16:12+0800
         */
        protected onClose():void
        {
            super.onClose();
            g_net.removeListener(this);
        }
    }
}
