/**
* name 
*/
module gamelib.data
{
    /**
     * 平台配置数据相关
     * @class PlatformConfigs
     */
	export class PlatformConfigs
	{
		/**
         * 是否显示铜钱
         * @type {boolean}
         * */
        public show_money:boolean = false;

        /**
         * 界面类型【1-棋牌圈，2-牛牛大厅】
         * @type {number}
         * */
        public hall_type:number = 1;

        /**
         * 创建游戏后是否自动进入房间
         * @type {boolean}
         */
        public autoEnterGame:boolean = false;


        /**
         * 金币名字
         * @type {string}
         */
        public gold_name:string = "铜钱";

        /**
         * 金币物品的msid
         * @type {gold_type}
         */
        public gold_type:number = 1000;

        /**
         * 金币名字
         * @type {string}
         */
        public gold_name_zj:string = "房卡";

        /**
         * 金币物品的msid
         * @type {gold_type}
         */
        public gold_type_zj:number = 1024;

        /**
         * 棋牌圈的game_id
         * @type {number}
         */
        public qpq_game_id:number = 5;

        /**
         * 大厅bgm
         * @type {any}
         */
        public bgm:any;

        /**
         * 平台名
         * @type {string}
         */
        public name:string;

        /**
         * 分享内容
         * @type {string}
         */
        public share_info:string;

        /**
         * 分享图片地址
         * @type {string}
         */
        public share_url:string;
	}
}