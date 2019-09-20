/**
 * Created by wxlan on 2017/9/4.
 */
namespace gamelib.core
{
	/**
	 * @interface INet
	 * 可以接受网络数据的接口
	 */
    export interface  INet
    {
        priority:number;
        reciveNetMsg(msgId:number,data:any):void;
    }

    /**
     * @interface IDestroy
	 * 可以消耗的接口
     */
    export interface IDestroy
    {
        destroy():void;
    }

}
