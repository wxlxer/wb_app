/**
 * Created by wxlan on 2017/2/13.
 */
module gamelib.core
{
    /**
     * 通过id获取玩家数据的方法。需要每个游戏单独设置一下这个方法，以确保能获取玩家数据
     * @function gamelib.core.getPlayerData
     * @author wx
     * @DateTime 2018-03-16T10:34:05+0800
     * @param    {number}   playerId 玩家的id
     * @return   {gamelib.data.UserInfo}          玩家数据
     * @access public
     */
    export function getPlayerData(playerId:number):gamelib.data.UserInfo
    {
        return null;
    }
    /**
     * 游戏接收网络数据的管理器。游戏需要继承此类
     * @class GameDataManager
     * @author wx
     * @implements gamelib.core.INet
     * 
     */
    export class GameDataManager implements gamelib.core.INet
    {
        priority: number;
        private _bRequesCircleData:boolean;

        private _enterMatchData:any = null;
        public constructor()
        {
        }
        /**
         * 销毁
         * @function destroy
         * @author wx
         * @DateTime 2018-03-16T10:48:34+0800
         */
        public destroy():void
        {
            
        }
        /**
         * 接收到网络消息
         * @function reciveNetMsg
         * @author wx
         * @DateTime 2018-03-16T10:48:14+0800
         * @param    {number}                 msgId 协议号
         * @param    {any}                    data  协议数据
         * @access public
         */
        public reciveNetMsg(msgId:number, data:any):void
        {
            switch (msgId)
            {
                case 0x0040:
                    g_net_configData.getNetConfog(data);
                    break;
                case 0x0074:
                    if (data.type == 1)
                    {
                        if(data.sendId == 0)    //系统公告
                            g_uiMgr.showPMD("["+getDesByLan("系统") + "]" + ":" + data.msg);
                        else    //喇叭
                            g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭")+ " [" + data.sendName+ "]:" + data.msg);
                        return;
                    }
                    // var pd = gamelib.core.getPlayerData(data.sendId);
                    // if(pd == null)
                    //     return;
                    // var str:string = gamelib.chat.ChatPanel.s_instance.onData0x0074(pd,data);
                    // gamelib.chat.ChatBubble.s_instance.showMsg(pd.m_seat_local,str);                    
                    break;
                // case 0x00C0:
                //     var lSeat:number = gamelib.core.getPlayerData(data.playerId).m_seat_local;
                //     gamelib.chat.Face.s_instance.showFace(data.addData2,lSeat);
                //     break;
                // case 0x2010:    
                    
                //     gamelib.common.GiftSystem.s_instance.showGift(data);
                //     break;
                case 0x00F0:
                    gamelib.data.BugleData.getData(data);
                    g_uiMgr.pmd_LaBa(getDesByLan("玩家喇叭")+ " [" + data.sendName+ "]:" + data.msg);
                    break;
                case 0x00F3:
                    if(GameVar.urlParam["isChildGame"]){
                        GameVar.g_platformData["groupInfo"] = data;
                    }
                    break;    
                case 0x00FF:
                    this.onShowReplay(data);
                    break;    
                case 0x0011:
                    gamelib.data.UserInfo.s_self.m_roomId = data.roomId;
                    break;
                case 0x0016:
                    var getted:boolean = false;
                    var _today:number = new Date(GameVar.s_loginSeverTime*1000).getDate();
                    for(var i: number = 0;i < data.list.length;i++)
                    {
                        if(data.list[i].day == _today)
                        {
                            getted = true;
                            break;
                        }
                    }
                    
                    gamelib.data.UserInfo.s_self.m_bSignIn = !getted;
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA,0);
                    //gamelib.data.g_signData = data;
                    break;
                case 0x0018:
                    gamelib.data.UserInfo.s_self.m_roomId = 0;
                    break;
                case 0x002D:
                    gamelib.data.UserInfo.s_self.openBag(data);
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA);
                    if(!GameVar.urlParam['isChildGame'])
                    {
                        g_loading.closeEnterGameLoading();
                        // g_signal.dispatch('closeEnterGameLoading',0);
                    }
                    break;
                case 0x002F:
                    if(data.type == 3)
                    {
                        data.type = 0;
                        g_uiMgr.showAlertUiByArgs(data)
                    }
                    else if(data.type == 1)
                    {
                        g_uiMgr.showPMD(data.msg);
                    }
                    else if(data.type == 6)
                    {
                         g_uiMgr.showTip(data.msg);   
                    }
                    break;
                case 0x0036:
                    gamelib.data.UserInfo.s_self.onItemUpte(data);
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA);
                    break;  
                case 0x007F:
                    this.onGet0x007F(data);
                    break;
                case 0x007B:
                    switch (data.opr)
                    {
                        case 5:
                            GameVar.s_firstBuy = false;
                            g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                            break;
                        case 7:
                            if(GameVar.g_platformData['first_buy'] == true)
                            {
                                GameVar.s_firstBuy = true;
                                g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);    
                            }
                            break;
                        case 14:
                            GameVar.s_firstBuyGift = false;
                            g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);   
                            break;    
                        case 15:
                            GameVar.s_firstBuyGift = true;
                            g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                            break;    
                        case 20:
                            GameVar.s_item_zhou.endTime = data.data1 * 1000;
                            GameVar.s_item_zhou.state = data.data2;
                            g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                            break;
                        case 21:
                            GameVar.s_item_yue.endTime = data.data1 * 1000;
                            GameVar.s_item_yue.state = data.data2;
                            g_signal.dispatch(gamelib.GameMsg.UPDATE_ITEMBTN_VISIBLE);
                            break;
                        case 9:
                            //var tempUi:gamelib.alert.SystemJiujiUi = <gamelib.alert.SystemJiujiUi>g_uiMgr.showUiByClass(gamelib.alert.SystemJiujiUi);
                            //if(data.data3)
                            //    tempUi.showSysAid(data.data3,data.data2,data.data4)
                            //else
                            //    tempUi.showSysAid(data.data1,data.data2);
                            break;
                    }
                    break;
                case 0x00B5:
                    g_uiMgr.showTip("游戏已成功保存到桌面, 获得3000铜钱",false);
                    break;
                case 0x0056:
                    if(gamelib.data.UserInfo.s_self != null)
                        gamelib.data.UserInfo.s_self.m_unreadMailNum = data.num;
                    g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA);
                    break;
                case 0x0094:    //获取语音
                    g_signal.dispatch("get_record",data);
                    break;
                case 0x2001:
                    GameVar.circleData.info = JSON.parse(data.info);
                    GameVar.circleData.validation = GameVar.circleData.info.join_code;
                    GameVar.circleData.groupId = GameVar.circleData.info.cb_id;
                    GameVar.circleData.fzPid = GameVar.circleData.info.fz_pid;
                    GameVar.circleData.round_current = GameVar.circleData.info.curr_loop;
                    GameVar.circleData.round_max = GameVar.circleData.info.limit_loop;
                    GameVar.circleData.isReplay = false;
                    g_signal.dispatch("initCircleData",data);
                    if(!this._bRequesCircleData)
                    {
                        var info:any = GameVar.circleData.info.extra_data;
                        g_qpqCommon.requestRule(info);                        
                        gamelib.platform.autoShare();
                        this._bRequesCircleData = true;
                    }
                    if(GameVar.circleData.info.extra_data.pay_mode == 2)
                    {
                        if(GameVar.circleData.round_current == 0)
                        {
                            //提示aa制扣费
                            var msg:string = getDesByLan("AA制付费") +" "+ GameVar.circleData.info["pay_num"] +  GameVar.g_platformData.gold_name;
                            g_uiMgr.showTip(msg,true);
                        }
                    }                    
                    break; 
                case 0x2700:
                    gamelib.data.MathData.ParseList(data);
                    if(this._enterMatchData != null)
                    {
                        this.reciveNetMsg(0x2708,this._enterMatchData);
                        this._enterMatchData = null;
                    }
                    break;    
                case 0x2708:    //进入比赛
                    if(data.result == 1)
                    {
                        // var md:gamelib.data.MathData = gamelib.data.MathData.GetMatchDataById(data.id);
                        // if(md == null)
                        // {
                        //     this._enterMatchData = data;
                        //     sendNetMsg(0x2700,1);
                        //     return;
                        // }
                        // GameVar.g_platformData["groupInfo"] = GameVar.g_platformData["groupInfo"] ||{}
                        // GameVar.g_platformData["groupInfo"].gamePlayJson = JSON.stringify({"playerSum":md['maxPlayerNum']})
                        GameVar.game_args.matchId = data.id;
                    }
                    break;
                    
                case 0x270C:    //观战比赛
                    if(data.result == 2)        //跳转
                    {
                        g_childGame.guanZhan(data.gz_id,data.id,data.deskId);
                    }
                    else 
                    {
                        switch(data.result)
                        {
                            case 1:
                                g_uiMgr.showTip(getDesByLan("观战成功,当前观看的牌桌为") +":" + data.deskId);
                                break;
                            case 3:
                                g_uiMgr.showTip(getDesByLan("观战失败,未找到牌桌"));
                                if(!utils.tools.isQpqHall())
                                    g_childGame.toCircle();
                                break;    
                            case 4:
                                g_uiMgr.showTip(getDesByLan("观战失败,进入失败"));
                                if(!utils.tools.isQpqHall())
                                    g_childGame.toCircle();    
                                break;   
                            case 5:
                                g_uiMgr.showTip(getDesByLan("观战失败,比赛未开始"));
                                if(!utils.tools.isQpqHall())
                                    g_childGame.toCircle();
                                break; 
                            case 6:
                                g_uiMgr.showTip(getDesByLan("观战失败,没找到指定的比赛"));
                                if(!utils.tools.isQpqHall())
                                    g_childGame.toCircle();
                                break;            
                            case 0:
                                if(!utils.tools.isQpqHall())
                                    g_childGame.toCircle();
                                break;    
                        }
                    }
                    break;
                case 0x2212:
                    var pd = gamelib.core.getPlayerData(data.id);
                    if(pd == null)
                        return;

                    if(pd.m_id == gamelib.data.UserInfo.s_self.m_id)
                    {
                        if(!isNaN(pd.vipLevel))
                        {
                            if(pd.vipLevel < data.vip_level)
                            {
                                g_signal.dispatch("vipLevelUp",data.vip_level);
                            }
                        }
                    }
                    pd.m_vipData = data;
                    pd.vipLevel = data.vip_level;
                    break;
                case 0x2213:
                    var rd:any = JSON.parse(data.json_str);                  
                    if(!isNaN(rd.shop_id))
                        GameVar.urlParam["shop_id"] = rd.shop_id;
                    if(rd.wx_service_openid)
                        GameVar.urlParam["wx_service_openid"] = rd.wx_service_openid;
                     if(GameVar.s_pochanData && rd.goods_id && rd.goods_id == GameVar.s_pochanData["goods_id"])//购买破产礼包成功
                     {
                         sendNetMsg(0x221E,GameVar.s_pochanData["gift_type"]);
                     }
                     if(rd.goods_id == 9999)    //至尊宝购买
                     {
                         g_signal.dispatch("zzbBuySuccess",rd.num);
                         return;
                     }
                    if(rd.items == null)
                        return;
                    var arr:Array<any> = [];
                    for(var item of rd.items)
                    {
                        arr.push({msId:item.msid,num:item.num});
                    }
                    g_signal.dispatch(gamelib.GameMsg.PLAYGETITEMEFFECT,arr);
 
                    if(gamelib.data.ShopData.s_shopDb != null && gamelib.data.ShopData.s_shopDb.goods != null)
                    {
                         var arr:Array<any> = gamelib.data.ShopData.s_shopDb.goods;
                         for(var temp of arr)
                         {
                             if(temp.goods_id == rd.goods_id)
                             {
                                 var num:number = temp.purchase_num;
                                 if(isNaN(num))
                                     num = 0;
                                 num += parseInt(rd.num);
                                 temp.purchase_num = num;
                                 break;
                             }
                         }
                     }
                   break; 
                case 0x2215:
                    gamelib.chat.WorldChatData.s_instance.onAnalysisData(data);
                    break;   
                case 0x2216:
                    var obj:any = JSON.parse(data.json_str);
                    var lvchange:number = obj['lvUp'];
                    var vipLvchange:number = obj['vipLvUp'];
                    if(lvchange)
                        g_signal.dispatch("showLevelUpEffect",[1,lvchange]);
                    if(vipLvchange)
                        g_signal.dispatch("showLevelUpEffect",[2,vipLvchange]);
                    break;   
                case 0x221E:
                    GameVar.s_pochanData = JSON.parse(data.json_str);
                    break;               
                case 0x3005:
                    if(data.type == 23)
                    {
                        GameVar.circleData.round_current = data.addData;
                    }
                    break;    
            }
        }
        /**
         * [onShowReplay description]
         * @function
         * @DateTime 2018-04-20T15:48:49+0800
         * @param    {any}                    data [description]
         */
        protected onShowReplay(data:any):void
        {

        }
        /**
         * 进入大厅。大厅场景类：game.hall.HallScene
         * @function onEnterHall
         * @author wx
         * @DateTime 2018-03-16T10:49:19+0800
         * @deprecated  目前很多游戏没有大厅了
         * @access protected
         */
        protected onEnterHall():void
        {
            gamelib.data.UserInfo.s_self.m_roomId = 0;
            //g_director.runWithSceneName("game.hall.HallScene",true);
        }
        /**
         * 进入牌卓。大厅场景类：game.room.RoomScene
         * @function onEnterRoom
         * @author wx
         * @DateTime 2018-03-16T11:04:14+0800
         * @param    {number}                 roomId 房间号。不能为0
         * @access protected
         */
        protected onEnterRoom(roomId:number):void
        {
            gamelib.data.UserInfo.s_self.m_roomId = roomId;
            //g_director.runWithSceneName("game.room.RoomScene",true);
            //
             g_signal.dispatch(GameMsg.GAMERESOURCELOADED,GameVar.urlParam['game_code']);
        }

        private onGet0x007F(data:any):void
        {
            switch (data.type)
            {
                case 11:
                    //if(!utils.tools.isIos() && GameVar.platform == GameVar.pf_QQBrowser)
                    //{
                    //    g_signal.dispatch(gamelib.GameMsg.SENDTODESKMSG,0);
                    //}
                    break;
                case 12:
                    g_uiMgr.showTip("您获得了" + data.addNum1 +"铜钱,救济卡剩余" + gamelib.data.UserInfo.s_self.m_jjk +"次");
                    break;
                case 20:
                case 21:
                    g_uiMgr.showTip('领取成功!!获得'+ data.addNum2 + gamelib.data.GoodsData.GetNameByMsId(data.addNum1));
                    break;
            }

        }
    }
}