/**
 * Created by wxlan on 2016/9/26.
 */
module gamelib.data
{
    /**
     * 棋牌圈相关信息
     * @class CircleData
     */
    export class CircleData
    {
        /**
         * 房主pid
         * @type {number}
         */
        public fzPid:number = 0;           //创建牌局玩家id

        /**
         * 牌局验证码
         * @type {string}
         */
        public validation:string = "";             //

        /**
         * 组局id
         * @type {number}
         */
        public groupId:number = 0;

        /**
         * 最大轮数
         */
        public round_max:number;

        /**
         * 当前轮数
         */
        public round_current:number;

        public info:any;                            //牌桌信息

        public isReplay:boolean;

        public ruleData:any;
        public selfIsFz():boolean
        {
            return GameVar.pid == this.fzPid;
        }

        /**
         * 是否是金币积分模式
         * @return {boolean} [description]
         */
        public isGoldScoreModle():boolean
        {
            if(GameVar.g_platformData["groupInfo"])
            {
                try{
                    var obj :any = JSON.parse(GameVar.g_platformData["groupInfo"].gamePlayJson)    
                    if(obj.pay_mode == 3 && (isNaN(obj.isPublic) || obj.isPublic != 0))
                        return true;
                    else
                        return false;
                }
                catch{

                }                
            }
             if(this.info && this.info.extra_data && this.info.extra_data.pay_mode == 3)  
                 return true;
             return false;
        }

        public isMatch():boolean
        {
            return GameVar.game_args && GameVar.game_args["matchId"];
        }
    }
}
