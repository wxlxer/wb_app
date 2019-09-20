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
         * 更新玩家信息
         * @type {string}
         * @static
         */
        public static UPDATEUSERINFODATA:string = "update_userinfo_data";

        /**
         * @property
         * 更新平台货币，(qqgame:钻石);
         * @type {string}
         * @static
         */
        public static UPDATEPLATFORMICON:string = "update_platformIcon_data";

        /**
         * @property
         * 添加到桌面
         * @type {string}
         * @static
         */
        public static SENDTODESKMSG:string = "sendToDesk";

        /**
         * @property
         * 场景切换
         * @type {string}
         * @static
         */
        public static SCENECHANGE:string = "scene_change";

        /**
         * @property
         * 开始游戏
         * @type {string}
         * @static
         */
        public static STARPLAY:string = "start_play";

        /**
         * @property
         * 结束游戏
         * @type {string}
         * @static
         */
        public static ENDPLAY:string = "end_play";

        /**
         * @property
         * 更新首冲按钮
         * @type {string}
         * @static
         */
        public static UPDATE_ITEMBTN_VISIBLE:string = "update_itembtn_visible";

        /**
         * @property
         * 游戏所有资源载入完成
         * @type {string}
         * @static
         */
        public static GAMERESOURCELOADED:string = "game_resource_loaded";

        /**
         * @property
         * 游戏重连
         * @type {string}
         * @static
         */
        public static RECONNECT:string = "game_reconnect";
        /**
         * @property
         * 切换语言版本
         * @type {string}
         * @static
         */
        public static CHANGELAN:string = "change_lan";

        /** @type {物品模式数据载入完成} [description] */
        public static GOODSMSIDDATALOADED:string = "goods_msId_data_loaded";
        
        /**
         * 播放获得道具的特效
         */
        public static PLAYGETITEMEFFECT:string = "showGetItemEffect";

        /**
         * 刷新平台数据
         */
        public static REFRESHPLATFORMDATA:string = "refreshPlatformData";
    }
}
