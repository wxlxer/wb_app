
/**
 * @class
 * 登录数据相关
 * @author wx
 *
 */
class GameVar {

    public static s_version:string = "0";

    /**
     * 当前游戏的二维码地址
     * @type {string}
     * @static
     */
    public static m_QRCodeUrl:string;

    /**
     * 当前游戏包含vip信息的二维码地址
     * @type {string}
     * @static
     */
    public static m_QRCodeUrl_Vip:string;
    //是否激活状态
    public static get s_bActivate():boolean
    {
        return Laya.stage.isFocused;
    }

    /**
     * @property {number} appid
     * @static
     */
    public static appid:string = "";

    public static s_domain:string = "";
    /**
     * @property {number} urlParam
     * 登录相关的参数
     * @static
     */
    private static _urlParams:Object;               //登录相关的参数

    public static set urlParam(value:Object)
    {
        GameVar._urlParams = value;
    }

    public static get urlParam():Object {
        return GameVar._urlParams || {};
    }

    public constructor() {
    }
}



window["GameVar"] = GameVar;