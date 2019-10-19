/**
 * Created by wxlan on 2016/1/9.
 */

module gamelib
{
    /**
     * @class
     */
    export class GameMsg
    {
        /**
         * @property
         * 登录
         * @type {string}
         * @static
         */
        public static Login:string = "/AppApi/NotLoggedInApi/login";

        /**
         * @property
         * 注册
         * @type {string}
         * @static
         */
        public static Register:string = "/AppApi/NotLoggedInApi/register";

        /**
         * @property
         * 获取公告
         * @type {string}
         * @static
         */
        public static GongGao:string = "/AppApi/NotLoggedInApi/gonggao";

        /**
         * @property
         * 获取客服链接等
         * @type {string}
         * @static
         */
        public static Systemseting:string = "/AppApi/NotLoggedInApi/systemseting";

        /**
         * @property
         * 获取弹出框页面
         * @type {string}
         * @static
         */
        public static Indexhot:string = "/AppApi/NotLoggedInApi/indexhot";

        /**
         * @property
         * 游戏接口列表
         * @type {string}
         * @static
         */
        public static Getapi:string = "/AppApi/NotLoggedInApi/getapi";

        /**
         * @property
         * 7.	接口分类列表
         * @type {string}
         * @static
         */
        public static Getapiassort:string = "/AppApi/NotLoggedInApi/getapiassort";

        /**
         * @property
         * 8.	接口捕鱼分类列表 
         * @type {string}
         * @static
         */
        public static Getapifish:string = "/AppApi/NotLoggedInApi/getapifish";

        /**
         * @property
         * 9.	接口电子分类列表   
         * @type {string}
         * @static
         */
        public static Getapitypegame:string = "/AppApi/NotLoggedInApi/getapitypegame";
        /**
         * @property
         * 10.	接口电子列表
         * @type {string}
         * @static
         */
        public static Getapigame:string = "/AppApi/NotLoggedInApi/getapigame";

        /** @type {11.	优惠活动} [description] */
        public static Gethotall:string = "/AppApi/NotLoggedInApi/gethotall";
        
        /**
         * 12.	登出
         */
        public static Logout:string = "/AppApi/MemberApi/logout";

        /**
         * 13.	实时余额获取   
         */
        public static Readmoney:string = "/AppApi/MemberApi/readmoney";

        /**
         * 14.	用户信息   
         */
        public static MemberInfo:string = "/AppApi/MemberApi/memberInfo";

        /**
         * 15.	修改密码   
         */
        public static Updatepwd:string = "/AppApi/MemberApi/updatepwd";

        /**
         * 16.	获取绑定信息   
         */
        public static Bindbank:string = "/AppApi/MemberApi/bindbank";

        /**
         * 17.	绑定银行卡   
         */
        public static Bindbankadd:string = "/AppApi/MemberApi/bindbankadd";

        /**
         *18.	获取红包还能领取的次数   
         */
        public static rednum:string = "/AppApi/MemberApi/rednum";
        /**
         * 	19.	领红包   
         */
        public static Receivingenvelope:string = "/AppApi/MemberApi/receivingenvelope";
        
        /**
        * 20.	领取实时返水金额   
        */
       public static Rreceivereturn:string = "/AppApi/MemberApi/rreceivereturn";

       /**
         * 21.	申请代理   
         */
        public static Subagent:string = "/AppApi/MemberApi/subagent";
        /**
         * 22.	登陆游戏   
         */
        public static login_game:string = "/AppApi/GameLoginApi/login";

         /**
         * 23.	交易记录   
         */
        public static moneyinfo:string = "/AppApi/RecordingApi/moneyinfo";

        /**
         *24.	交易明细   
         */
        public static Mconvertrecord:string = "/AppApi/RecordingApi/mconvertrecord";

        /**
         *25.	下注记录   
         */
        public static Betinfodata:string = "/AppApi/RecordingApi/betinfodata";

        /**
         * 26.	获取实时返水金额   
         */
        public static Realtimereturn:string = "/AppApi/RecordingApi/realtimereturn";

        /**
         * 27.	取款   
         */
        public static Moneyout:string = "/AppApi/RecordingApi/moneyout";

        /**
         * 28.	银行卡,二维码收款信息   
         */
        public static Bankinfo:string = "/AppApi/RecordingApi/bankinfo";

        /**
         * 29.	支付银行列表   
         */
        public static Payinfolist:string = "/AppApi/RecordingApi/payinfolist";

        /**
         * 30.	取款银行列表选择款   
         */
        public static Bankinfolist:string = "/AppApi/RecordingApi/bankinfolist";

        /**
         * 31.	老带新基本信息   
         */
        public static Oldwithnewinfo:string = "/AppApi/RecordingApi/oldwithnewinfo";

        /**
         * 32.	老带新 列表   
         */
        public static Oldwithnewinfolist:string = "/AppApi/RecordingApi/oldwithnewinfolist";

        /**
         * 33.	站内信   
         */
        public static Websitemaillist:string = "/AppApi/RecordingApi/websitemaillist";

        /**
         * 34.	删除站内信   
         */
        public static Websitemaildelete:string = "/AppApi/RecordingApi/websitemaildelete";

        /**
         * 35.	阅读站内信   
         */
        public static Readwebsitemail:string = "/AppApi/RecordingApi/readwebsitemail";

        /**
         * 36.	转账操作   
         */
        public static Convertmoney:string = "/AppApi/CashOperationApi/convertmoney";

         /**
         * 37.	一键转出   
         */
        public static Onetouchtransfer:string = "/AppApi/CashOperationApi/onetouchtransfer";

         /**
         * 38.	查询所有余额   
         */
        public static Getuserplatform:string = "/AppApi/CashOperationApi/getuserplatform";
         /**
         * 39.	查询单个平台余额   
         */
        public static Ref_ed:string = "/AppApi/CashOperationApi/ref_ed";
         /**
         * 40.	银行卡存款   
         */
        public static Moneyinhk:string = "/AppApi/CashOperationApi/moneyinhk";
         /**
         * 41.	二维码存款   
         */
        public static Moneyinqr:string = "/AppApi/CashOperationApi/moneyinqr";
         /**
         *42.	在线支付   
         */
        public static Payapi:string = "/AppApi/CashOperationApi/payapi";
         /**
         * 43.	申请优惠活动   
         */
        public static Applicationhot:string = "/AppApi/CashOperationApi/applicationhot";
         /**
         * 44.	验证取款密码   
         */
        public static Getqkpwd:string = "/AppApi/CashOperationApi/getqkpwd";

         /**
         * 44.	验证取款密码   
         */
        public static Qkpassword:string = "/AppApi/MemberApi/qkpassword";

        /**
         * 获得进入游戏的地址
         */
        public static GetApilogin:string = "/AppApi/GameLoginApi/GetApilogin"

        /**
         * 修改绑定信息
         */
        public static Basicxingxi:string = "/AppApi/MemberApi/basicxingxi";
    }
}
