///<reference path="./PlatformConfigs.ts" />
/**
 * @class
 * 登录数据相关
 * @author wx
 *
 */
class GameVar {

    public static s_version:string = "0";

    /**
     * 平台配置相关的数据
     * @type {gamelib.data.PlatformConfigs}
     * @static
     */
    public static g_platformData:gamelib.data.PlatformConfigs = new gamelib.data.PlatformConfigs();

    public static s_pochanData:any;                //破产礼包数据
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
    /**
     * 当前游戏的游戏id，自动获取
     * @type {number}
     */
    private static _game_id:number;
    public static get s_game_id():number {
        return GameVar.getValyeByKey("gameid");
    }


    public static set s_game_id(value:number) {
        GameVar._game_id = value;
    }

    /**
     * @property {number} s_netDelay
     * 网络延时
     * @static
     */
    public static s_netDelay:number = 0;
    /**
     * @property {number} s_loginSeverTime
     * 登录服务器时间 秒
     * @static
     */
    public static s_loginSeverTime:number = 0;

   /**
    * 登录服务器时，客服端本地的时间。Laya.timer.currTimer的值
    * @type {number}
    */
    public static s_loginClientTime:number = 0;

    public static s_namespace:string = "qpq";
    /**
     * @property {string} s_gameName
     * 当前游戏名，例如为erddz，ddz，nn,
     * 这个值是通过
     *
     */
    public static s_gameName:string = "";
    public static dir:string = "c";                //当前方向
    public static mainGameGz_id:number;

    public static s_firstBuy:boolean = false;       //首充是否可用
    public static s_firstBuyGift:boolean = false;   //首充礼包是否可用

    /**
     * 周卡和月卡。state:0没购买，1：未领取，2：已领取，endTime：到期时间
     * @type {number}
     */
    public static s_item_zhou:{endTime:number,state:number} = {endTime:0,state:0};           //周卡
    public static s_item_yue:{endTime:number,state:number} = {endTime:0,state:0};            //月卡
    //是否激活状态
    public static get s_bActivate():boolean
    {
        return Laya.stage.isFocused;
    }

    public static destroy():void
    {
        GameVar.s_game_args = null;
        GameVar.s_circleData = null;
        GameVar.s_circle_args = null;

    }

    /**
     * 游戏返回棋牌圈的参数
     * @type {null}
     */
    private static s_game_args:any = null;

    public static get game_args():any {
        if (GameVar.s_game_args == null) {
            var str:string = GameVar._urlParams["game_args"];
            if (str == null || str == "") {
                GameVar.s_game_args = {};
            }
            else {
                GameVar.s_game_args = JSON.parse(str);
            }
        }
        return GameVar.s_game_args;
    }
    public static set game_args(value:any)
    {

    }

    /**
     * 棋牌圈参数
     * @type {null}
     */
    private static s_circle_args:any = null;

    //棋牌圈数据
    private static s_circleData:gamelib.data.CircleData;

    /**
     * 组局验证码
     * @returns {any}
     */
    public static get validation():string {
        return GameVar.circle_args["validation"];
    }
    public static set validation(value:string)
    {
        throw new Error("只读属性");
    }
    public static get groupId():string {
        return GameVar.circle_args["groupId"];
    }
    public static set groupId(value:string)
    {
        throw new Error("只读属性");
    }

    public static get circleData():gamelib.data.CircleData {
        GameVar.s_circleData = GameVar.s_circleData || new gamelib.data.CircleData()
        return GameVar.s_circleData;
    }
    public static set circleData(value:gamelib.data.CircleData)
    {
        GameVar.s_circleData = value;
    }

    public static get circle_args():any
    {
        if (GameVar.s_circle_args == null) {
            if (GameVar._urlParams["circle_args"] == null || GameVar._urlParams["circle_args"] == "")
            {
                GameVar.s_circle_args = {};
            }
            else {
                var str:string = decodeURIComponent(GameVar._urlParams["circle_args"]);
                GameVar.s_circle_args = JSON.parse(str);
                GameVar.circleData.validation = GameVar.s_circle_args["validation"];
            }
        }
        return GameVar.s_circle_args;
    }


    /**
     * @property {number} appid
     * @static
     */
    public static appid:string = "";
    /**
     * @property {number} urlParam
     * 登录相关的参数
     * @static
     */
    private static _urlParams:Object;               //登录相关的参数

    //平台货币数量，因为获取的时候userinfo可能还没创建
    public static platfromMoney:number = 0;

    public static set urlParam(value:Object)
    {
        GameVar.s_circle_args = null;
        GameVar.s_circleData = null;
        GameVar.s_game_args = null;
        GameVar._urlParams = value;
    }

    public static get urlParam():Object {
        return GameVar._urlParams || {};
    }

    public static clearCircleData():void {
        GameVar.circle_args["validation"] = null;
    }

    /**
     * @method
     * @private
     * 通过可以获得对应的值
     * @param value
     * @static
     * @returns {any}
     */
    private static getValyeByKey(value:string):any {
        return GameVar._urlParams[value];
    }

    public static get ip_addr():string {
        return GameVar.getValyeByKey("ip_addr");
    }
    public static get common_ftp():string {
        if(GameVar.getValyeByKey("ftp"))
            return GameVar.getValyeByKey("ftp") +"common/";
        return GameVar.getValyeByKey("game_path") +"common/";
    }    

    public static set common_ftp(value:string)
    {
        throw new Error("只读属性");
    }

    public static get game_ver():string
    {
        return GameVar.getValyeByKey("game_ver");
    }

    public static set game_ver(value:string)
    {
        throw new Error("只读属性");
    }
    //当前是否是审核版本
    public static get s_app_verify():number
    {
        if(window['application_app_verify'])
            return window['application_app_verify']();
        return  0;
    }
    public static get gz_id():number {
        return parseInt(GameVar.getValyeByKey("gz_id"));
    }
    public static set gz_id(value:number)
    {
        throw new Error("只读属性");
    }
    public static get main_gz_id():number {
        return parseInt(GameVar.getValyeByKey("maingz_id"));
    }

    public static get src_gz_id():number {
        return parseInt(GameVar.getValyeByKey("src_gz_id"));
    }

    //0：主游戏 1:子游戏
    public static get gameMode():number {
        var temp:number = parseInt(GameVar.getValyeByKey("gameMode"));
        if (temp == null || temp == undefined)
            temp = 0;
        return temp;
    }

    public static get resource_path():string {
        if (GameVar.getValyeByKey("game_path") != null)
            return GameVar.getValyeByKey("game_path");
        return "";
    }
    public static set resource_path(value:string) {
        throw new Error("只读属性");
    }
    public static get game_code():string {
        if (GameVar.getValyeByKey("game_code") != null)
            return GameVar.getValyeByKey("game_code");
        return "";
    }
    public static set game_code(value:string) {
        throw new Error("只读属性");
    }

    public static get ts():number {
        return parseInt(GameVar.getValyeByKey("ts"));
    }

    public static get target_gz_id():number {
        return parseInt(GameVar.getValyeByKey("target_gz_id"));
    }

    public static get pid():number 
    {
        return parseInt(GameVar.getValyeByKey("pid"));
    }
    public static set pid(value:number)
    {
        throw new Error("只读属性");
    }
    public static get platform():string {
        return (GameVar.getValyeByKey("platform"));
    }
    public static set platform(value:string)
    {
        throw new Error("只读属性");
    }
    public static get session():string {
        return (GameVar.getValyeByKey("username"))||GameVar.getValyeByKey("loginkey");
    }

    public static get serverIp():string {
        return (GameVar.getValyeByKey("GameNetCore")).split(":")[0];
    }

    public static get wss_host():string {
        return GameVar.getValyeByKey("wss_host");
    }

    public static get ws_host():string {
        var url:string = GameVar.getValyeByKey("ws_host");

        if (url == "" || url == null) {
            url = GameVar.getValyeByKey("GameNetCore");
        }
        return url;
    }

    /**
     * 返回 http 或者https
     *
     * @returns {string}
     */
    public static get protocol():string {
        var str:string = GameVar.getValyeByKey("protocol");
        if (str == "" || str == null || typeof (str) == "undefined")
            str = "http://";
        return str;
    }

    public static get serverPort():string {
        return (GameVar.getValyeByKey("GameNetCore")).split(":")[1];
    }

    public static get platformVipLevel():number {
        return parseInt(GameVar.getValyeByKey("level"));
    }

    public static get isGameVip():boolean
    {
        return parseInt(GameVar.getValyeByKey("shop_id")) > 0;
    }

    public static get sex():number {
        var sex:number = parseInt(GameVar.getValyeByKey("gender"));
        if (sex == 1)
            sex = 1;
        else if (sex == 2)
            sex = 0;
        else
            sex = 0;//utils.MathUtility.random(0, 1);
        return sex;
    }
    public static set playerHeadUrl(value:string)
    {
        throw new Error("只读属性");
    }
    public static get playerHeadUrl():string {
        var urlReg1 = /\|/g;
        var str:string = GameVar.getValyeByKey("icon_url");
        if (str == null)
            str = "https://open.8z.net/m/icons/default.png";
        str = str.replace(urlReg1, "&");
        str = str.replace("http://", GameVar.protocol);
        //if(egret.Capabilities.renderMode == "webgl")
        //{
        //    str = "getimage.php?url=" + encodeURIComponent(str);
        //}
        return str;
    }

    public static get playerHeadUrl_ex():string {
        // var urlReg1 = /\|/g;
        // var str:string = GameVar.getValyeByKey("icon_url");
        // if (str == null)
        //     return "http://open.8z.net/m/icons/default.png";
        // return str.replace(urlReg1, "&");
        return GameVar.playerHeadUrl;
    }

    public static get payurl():string {
        var urlReg = /\|\|/g;
        return GameVar.getValyeByKey("pay_url").replace(urlReg, "&");

    }

    public static get nickName():string {
        var nickname:string = GameVar.getValyeByKey("nickname");
        if (nickname == null || nickname == "null") {
            nickname = "";
        }
        else {
            var arr:Array<string> = ["天天德州", "金币收售", "收售金币", "官方客服"];
            for (var i:number; i < arr.length; i++) {
                nickname = nickname.replace(arr[i], "****");
            }

            var characters = nickname.split("");
            var strLen = characters.length;
            for (var i = strLen - 1; i >= 0; i--) {
                if (characters[i] == ";" ||
                    characters[i] == " " ||
                    characters[i] == "\\" ||
                    characters[i] == "'" ||
                    characters[i] == '"' ||
                    characters[i] == ",")
                    characters.splice(i, 1);
            }
            nickname = characters.join("");

            if (utils.StringUtility.GetStrLen(nickname) > 16)
                nickname = utils.StringUtility.GetSubstr(nickname, 16);
        }
        
        return utils.tools.getBanWord(nickname);
    }
    public static set nickName(value:string)
    {
        throw new Error("只读属性");
    }

    public constructor() {
    }
}



window["GameVar"] = GameVar;