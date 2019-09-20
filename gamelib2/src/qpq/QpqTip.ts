/**
 * Created by Administrator on 2017/4/26.
 */
module gamelib.common.qpq {
    /**
     * 投票确认框
     */
    export class QpqTip extends gamelib.core.BaseUi
    {
        /**
         * 1-确定请求投票，2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局
         */
        private _type:number;
        private _groupId:number;        //当前牌桌id
        private _pos:any;
        public constructor()
        {
            super("qpq/Art_CustomTips1");
        }
        protected init():void
        {
            this._res["txt_2"].align = "center";
            this._res["txt_2"].valign = "middle";
            this._res["txt_2"].editable = false;
            this.addBtnToListener("btn_cancel");
            this.addBtnToListener("btn_ok");
            this._res.isModal = true;
            if(this._res['btn_close'])
                this._res['btn_close'].visible = false;

            this._pos = 
            {
                okX: this._res["btn_ok"].x,
                cancelX: this._res["btn_cancel"].x,
                centerX: this._res["btn_ok"].x + (this._res["btn_cancel"].x - this._res["btn_ok"].x) / 2
            }
            this._res["btn_cancel"].label = "取消";
            this._res["btn_ok"].label = "确定";
            this.m_closeUiOnSide = false;
        }
        /**
         * 设置按钮数量
         * @param {number} type [description]
         */
        private setBtns(type:number):void
        {
            if(type == 1)
            {
                 this._res["btn_cancel"].x = this._pos.cancelX;
                 this._res["btn_ok"].x = this._pos.okX;
                 this._res["btn_ok"].visible = this._res["btn_cancel"].visible = true
            }
            else
            {
                 this._res["btn_ok"].x = this._pos.centerX;
                 this._res["btn_cancel"].visible = false
            }
        }
         /**
          * 显示提示
          * @function
          * @DateTime 2018-03-17T15:39:28+0800
          * @param    {number}                 type  2-投票未通过，3-投票通过，
          *                                          4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局
          *                                          8-同ip拒绝游戏
          * @param    {string}                 extra [description]
          */
        public showTip(type:number,extra:string):void
        {
            this._type = type;
            var msg:string = "";
            var title:string = "";
            switch (type)
            {                
                case 2:
                case 8:
                    title = getDesByLan("投票未通过");
                    msg = "【"+extra+"】"+getDesByLan("拒绝了投票")+"!";
                    break;
                case 3:
                    title = getDesByLan("一致通过，牌局解散");
                    msg = getDesByLan("本局游戏结束");
                    break;
                case 4:
                    msg = utils.StringUtility.format(getDesByLan("玩家{0}已被房主踢出房间"),[extra]);
                    break;
                case 5:
                    msg = getDesByLan("房间人数已满");
                    break;
                case 6:
                    msg = getDesByLan("您已被房主踢出房间");
                    break;
                case 7:
                    title = getDesByLan("房主已将牌局解散");
                    msg = getDesByLan("本局游戏结束")+"！";
                    break;               
            }
            this._res["txt_1"].text = title;
            this._res["txt_2"].text = msg;
            this.setBtns(type);
            this._groupId = GameVar.circleData.groupId;
        }

        protected onClickObjects(evt:laya.events.Event):void
        {
            playButtonSound();
            switch (evt.currentTarget.name)
            {
                case "btn_ok":
                    switch (this._type)
                    {
                        case 3:
                            g_qpqCommon.toCircle(true,this._groupId);
                            break; 
                        case 7:
                            g_childGame.toCircle();
                            break;  
                        case 8:
                            break;      
                        default:
                            g_qpqCommon.toCircle();
                            break;
                    }
                    break;
            }
            this.close();
        }
    }
}