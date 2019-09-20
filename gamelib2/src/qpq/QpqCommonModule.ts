/**
 * Created by wxlan on 2017/9/5.
 */
namespace gamelib.common
{
    /**
     * 棋牌圈公告模块。包含战绩界面。总结算界面，详细结算界面，同ip提示，解散界面，历史信息,退出游戏，分享
     * 不要实例次类。请用g_qpqCommon
     * @class QpqCommonModule
     * @implements gamelib.core.INet
     */
    export class QpqCommonModule implements gamelib.core.INet
    {
        public priority: number;
        private _zhanji:gamelib.common.qpq.ResultHistroyUi;
        private _resultUi:gamelib.common.qpq.QPQResultUi;
        private _detailUi:gamelib.common.qpq.ResultDetail;
        private _vote:gamelib.common.qpq.VoteUi;
        private _tipUi:gamelib.common.qpq.QpqTip;
        private _tip_ip:gamelib.common.qpq.QpqTip_IP;
        private _histroy_person:gamelib.common.qpq.QppHistroy_Person;
        private _histroy_zj:gamelib.common.qpq.QppHistroy_ZuJu;
        public constructor()
        {
            g_signal.add(this.onLocalSignal,this);            
        }
        /**
         * 棋牌圈请求结果信息
         * @function requestResult
         * @DateTime 2018-03-17T15:08:42+0800
         * @param    {number}                 groupId [description]
         * @param    {number}      [page = 0]   [description]
         * @param    {number}      [number = 0]           number [description]
         */
        public requestResult(groupId:number,page:number = 0,number:number = 0):void
        {
           sendNetMsg(0x00FA,groupId,page,number,0);
        }

        /**
         * 解散逻辑
         * @function doJieSan
         * @DateTime 2018-03-17T15:09:35+0800
         * @param    {boolean}           [checkFz = true] checkFz [是否检测房主]
         */
        public doJieSan(checkFz:boolean = true):void
        {
            var isFz:boolean = GameVar.circleData.selfIsFz();
            var isBegin:boolean = GameVar.circleData.round_current >= 1;
            var canJieSan:boolean = isFz;
            if(checkFz)
                canJieSan = isFz;
            else
                canJieSan = true;
            if(canJieSan)
            {
                if(isBegin)
                {
                    g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请求解散牌局")+"?",callBack:function(type:number)
                    {
                        if(type == 0)
                             sendNetMsg(0x2003);
                    },okLabel:getDesByLan("确定"),cancelLabel:getDesByLan("取消"),type:1});

                    // this.showTip(1);
                }
                else
                {
                    g_uiMgr.showAlertUiByArgs({msg:getDesByLan("确定要解散牌局吗")+"?",callBack:function(type:number)
                    {
                        if(type == 0)
                            sendNetMsg(0x00F6,GameVar.pid,4,GameVar.circleData.groupId,0,0);
                    },okLabel:getDesByLan("确定"),cancelLabel:getDesByLan("取消"),type:1});
                }
            }
            else
            {
                if(isBegin) 
                {
                        // this.showTip(1);
                    g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请求解散牌局")+"?",callBack:function(type:number)
                    {
                        if(type == 0)
                             sendNetMsg(0x2003);
                    },okLabel:getDesByLan("确定"),cancelLabel:getDesByLan("取消"),type:1});
                }
                else g_uiMgr.showAlertUiByArgs({msg:getDesByLan("游戏未开始,只能由房主解散游戏")});
            }
        }
        private _needToQuitGame:boolean;
      
        /**
         * 退出逻辑
         * 如果不是组局模式，发送0x0018协议。收到后在退出游戏
         * 如果是金币模式，直接退出子游戏
         * 如果是组局，进入退出组局的流程
         * @function doQuit
         * @DateTime 2018-03-17T15:10:24+0800
         */
        public doQuit():void
        {
            if(!utils.tools.isQpq())
            {
                if(GameVar.game_args.groupId && GameVar.game_args.roundId)
                {
                    //回放
                    g_childGame.toCircle();
                    return;
                }
                this._needToQuitGame = true;
                sendNetMsg(0x0018);
                return;
            }
            var circle_data:gamelib.data.CircleData = GameVar.circleData;

            if(circle_data.isGoldScoreModle())    //金币模式
            {
            //     this._needToQuitGame = true;
            //     sendNetMsg(0x0018);
                 g_childGame.toCircle();
                 return;
            }
            if(circle_data.selfIsFz() && circle_data.round_current < 1)
            {
                //组局金币场不需要提示
                if(GameVar.g_platformData['exitRoomNoAlert'])
                {
                    g_childGame.toCircle();
                }
                else
                {
                    g_uiMgr.showAlertUiByArgs({msg:getDesByLan("返回大厅您的房间仍会保留哦，您可以在房间列表中查看")+"!",callBack:function(type:number)
                    {
                        if(type == 0)
                            g_childGame.toCircle();
                    },okLabel:"确定",type:1});
                }                
            }
            else if(circle_data.round_current >= circle_data.round_max && circle_data.round_current != 0)
            {
                //牌局结束了
                //收到0x2005在处理
                //g_childGame.toCircle({groupId:circle_data.groupId});
            }
            else
            {
                g_childGame.toCircle();
            }
        }

        /**
         * 分享
         * @function doShare
         * @param {boolean}  [wxTips = true] 是否显示微信的提示框
         */
        public doShare(wxTips:boolean = true):void
        {
            var circle_data:gamelib.data.CircleData = GameVar.circleData;
            if(circle_data.validation == "")
            {
                gamelib.platform.shareApp();
                return;
            }

            var  temp = {
                gz_id: GameVar.gz_id,
                gameId: GameVar.s_game_id,
                validation: circle_data.validation,
                groupId: circle_data.groupId +"",
                callBack: null,
                wxTips: wxTips,
                fd: circle_data.info && circle_data.info.extra_data ?circle_data.info.extra_data.limit : 0,
                js: circle_data.round_max,
                addDatas: circle_data.info && circle_data.info.extra_data ?circle_data.info.extra_data : {}
            }
            if(circle_data.info && circle_data.info.extra_data && circle_data.info.extra_data.club_name)
            {
                //如果是俱乐部，加上俱乐部名字
                temp['club_name'] = circle_data.info.extra_data.club_name;
            }
            gamelib.platform.share_circleByArgs(temp);
        }

        /**
         * 游戏中返回棋牌圈
         * @function toCircle
         * @DateTime 2018-03-17T15:12:59+0800
         * @param    {boolean}  bRequestResult [是否请求结算信息]
         */
        public toCircle(bRequestResult?:boolean,groupId?:number):void
        {
            g_uiMgr.showTip(getDesByLan('系统结算中')+'...');
            if(bRequestResult)
                sendNetMsg(0x00FA,groupId,0,0,0);
            if(this._tipUi)
                this._tipUi.close();

            if(this._vote)
                this._vote.close();
        }
        /**
         * 请求指定游戏的规制
         * @function requestRule
         * @DateTime 2018-03-17T15:13:33+0800
         * @param    {any}                    info [description]
         */
        public requestRule(info:any,callBack?:Laya.Handler):void
        {
            var postdata:any = { }
            postdata.action = "circle_rule";
            postdata.addDatas = JSON.stringify(info);
            postdata.platform = GameVar.platform;
            postdata.game_path = GameVar.common_ftp;
            utils.tools.http_request(GameVar.urlParam['ftp'] +"scripts/circle_config.php",postdata,"get",function(rep:any)
            {
                GameVar.circleData.ruleData = rep;
                if(callBack)
                {
                    callBack.runWith(rep);
                }
            });
        }

        /**
         *
         * @param type 2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局，8：同ip拒绝游戏
         * @param kickedUserName
         */
        /**
         * 显示提示框
         * @function showTip
         * @DateTime 2018-03-17T15:13:48+0800
         * @param    {number}  type 1-确定请求投票，2-投票未通过，3-投票通过，4-踢出玩家，5-房间已满，6-自己被踢，7-房主解散牌局，8：同ip拒绝游戏
         * @param    {string}  [kickedUserName=""] 相关操作的玩家
         */
        public showTip(type:number,kickedUserName:string = ""):void
        {
            this._tipUi = this._tipUi || new gamelib.common.qpq.QpqTip();
            this._tipUi.showTip(type,kickedUserName);
            this._tipUi.show();
        }
        public show():void
        {
            g_net.addListener(this);
        }
        public close():void
        {
            g_net.removeListener(this);
        }
        protected  onLocalSignal(msg:string,data:any):void
        {
            switch (msg)
            {
                // case GameMsg.GAMERESOURCELOADED:                
                //     if(GameVar.urlParam["isChildGame"])
                //     {
                //         return;
                //     }
                //     this._resultUi = this._resultUi || new gamelib.common.qpq.QPQResultUi();
                //     this._detailUi = this._detailUi || new gamelib.common.qpq.ResultDetail();
                //     this._tipUi = this._tipUi || new gamelib.common.qpq.QpqTip();
                //     this._tip_ip = this._tip_ip || new gamelib.common.qpq.QpqTip_IP();
                //     this._vote = this._vote || new gamelib.common.qpq.VoteUi();
                    // break;
                case "showZhanjiUi":    //显示战绩
                    if(GameVar.g_platformData['histroy_type'] == 0 || isNaN(GameVar.g_platformData['histroy_type']))
                    {
                        this._zhanji = this._zhanji || new gamelib.common.qpq.ResultHistroyUi();
                        this._zhanji.show();    
                    }
                    else if(GameVar.g_platformData['histroy_type'] == 1)
                    {
                        this._histroy_person = this._histroy_person || new gamelib.common.qpq.QppHistroy_Person();
                        this._histroy_person.show();
                    }
                    else if(GameVar.g_platformData['histroy_type'] == 2)
                    {
                        this._histroy_zj = this._histroy_zj || new gamelib.common.qpq.QppHistroy_ZuJu();
                        this._histroy_zj.show();
                    }
                    break;
                case "showQpqResultUi": //显示结算界面   
                    if(data.add_data != null  && data.add_data.pay_mode == 3)//如果是金币场，直接显示每轮结算
                    {
                        this.onLocalSignal("showDetailUi",data);
                        return;
                    }
                    this._resultUi = this._resultUi || new gamelib.common.qpq.QPQResultUi();
                    this._resultUi.setData(data);
                    this._resultUi.show();
                    break;
                case "showDetailUi":
                    this._detailUi = this._detailUi || new gamelib.common.qpq.ResultDetail();
                    this._detailUi.showDetail(data);
                    this._detailUi.show();
                    break;
            }
        }
        public reciveNetMsg(msgId:number,data):void
        {
            switch (msgId)
            {
                case 0x0018:
                    if(this._needToQuitGame)
                    {
                        if(data.bDisconnect == 1)
                        {
                            g_net.close();
                            g_childGame.toCircle();
                        }   
                        this._needToQuitGame = true;
                    }                    
                    break;
                case 0x00E2:    //评价结果
                    break;
                case 0x00E4:    //评价结果确认
                    break;
                case 0x00EB:    //同意或拒绝进行游戏
                    if(data.result == 0)
                        return;
                    if(data.roleId != gamelib.data.UserInfo.s_self.m_id)
                    {
                        if(data.operation == 2)
                        {
                            var pdd = gamelib.core.getPlayerData(data.roleId);
                            if(this._tip_ip)
                                this._tip_ip.close();
                            this.showTip(8,pdd.m_name_ex);                            
                        }
                    }
                    break;
                case 0x00EA:    //同ip玩家提示
                    this.checkIp(data);
                    
                    break;
                case 0x00FA:       //组局完整记录
                    if(data.groupId != 0 && !isNaN(data.groupId))
                    {
                        var list1:Array<any> = data.recordNum;
                        for(var obj of list1)
                        {
                            if(obj.addData)
                                obj.add_data = JSON.parse(obj.addData);
                        }
                        if(data.recordNum.length > 0 )
                        {
                            this.onLocalSignal("showQpqResultUi",data.recordNum[0]);
                        }
                        else
                        {
                            //返回棋牌圈
                            g_childGame.toCircle();
                        }
                    }
                    break;
                case 0x00FB:    //实时成绩
                    //if(GameVar.s_game_id != 5)
                    //{
                    //    var temp:RealTimeScoreUi = <RealTimeScoreUi>g_uiMgr.showUiByClass(RealTimeScoreUi);
                    //    temp.setData(data);
                    //}
                    //break;
                case 0x2002:
                    break;
                case 0x2003:
                    if(data.result == 3)
                    {
                         g_uiMgr.showAlertUiByArgs({msg:getDesByLan("未参与游戏，不能发起投票")+"！"});
                    }
                    break;    
                case 0x2004:        //投票玩家列表
                    this._vote = this._vote || new gamelib.common.qpq.VoteUi();
                    this._vote.show();
                    this._vote.update(data);
                    break;
                case 0x2005:
                    //<!--1 投票解散 2 房主解散 5 超时 7 达到指定局数-->
                    switch (data.reason)
                    {
                        case 1:
                            if(this._vote)
                                this._vote.close();
                            if(GameVar.circleData.isGoldScoreModle())
                            {
                                 g_childGame.toCircle();
                                 return;
                            }
                            this.showTip(3);
                            
                            break;
                        case 2:
                            if(GameVar.circleData.selfIsFz())
                            {
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("解散牌局成功")+"!",callBack:function()
                                {
                                    g_childGame.toCircle();
                                },type:0});
                            }
                            else
                            {
                                this.showTip(7);
                            }
                            break;
                        case 5:
                        case 6:
                            if(GameVar.circleData.isGoldScoreModle())
                            {
                                g_childGame.toCircle();
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("牌桌超时关闭，自动返回大厅")});
                            }
                            else
                            {
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("牌桌超时关闭，自动返回大厅"),callBack:function()
                                {
                                    this.requestResult(GameVar.circleData.groupId);
                                },thisObj:this});    
                            }
                            break;
                        case 7://正常結束
                            // this.toCircle();
                            this.requestResult(GameVar.circleData.groupId);
                            break;
                        case  9:    //货币不足，退回大厅
                            //流程:直接退出牌桌，在大厅中弹出铜钱不足的提示
                            g_childGame.toCircle();
                            var goodName:string = "";
                            // if(GameVar.circleData.isGoldScoreModle())
                            // {
                            //     goodName = GameVar.g_platformData['gold_name_gold'];
                            //     if(goodName == null)
                            //         goodName = GameVar.g_platformData['gold_name'];
                            // }
                            // else
                            // {
                            //     goodName = GameVar.g_platformData['gold_name'];                                
                            // }
                            goodName = "游戏币";
                            g_uiMgr.showAlertUiByArgs({msg:"您的" + goodName + getDesByLan("不足")+"！"})
                            break; 
                        case 10:        //您长时间未准备
                            g_childGame.toCircle();
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("您长时间未准备，自动返回大厅")});
                            break;   
                        case 11:
                            g_childGame.toCircle();
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("无人抢地主，房间解散")});
                            break;    
                        case 12:
                            g_childGame.toCircle();
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("您被提出俱乐部")});
                            break;  
                        case 13://俱乐部牌桌超时                            
                            g_uiMgr.showAlertUiByArgs({
                                msg:getDesByLan("牌桌超时关闭，自动返回大厅"),
                                callBack:function(type):void
                                {
                                    g_childGame.toCircle(GameVar.circleData.info);
                                },
                                thisObj:this
                            });
                            break;  
                        case 14:    //你已被管理员强制退分
                            g_uiMgr.showAlertUiByArgs({
                                msg:"你已被管理员强制退分!",
                                callBack:function(type):void
                                {
                                    g_childGame.toCircle(GameVar.circleData.info);
                                },
                                thisObj:this
                            });
                            break; 
                        case 15:
                             g_uiMgr.showAlertUiByArgs({
                                msg:"比赛已经结束!",
                                callBack:function(type):void
                                {
                                    g_childGame.toCircle(GameVar.circleData.info);
                                },
                                thisObj:this
                            });
                            break;      
                        case 17:
                            g_childGame.toCircle();
                            g_uiMgr.showAlertUiByArgs({msg:"观战牌桌结束!"});
                            break; 
                        case 18:
                            g_childGame.toCircle();
                            g_uiMgr.showAlertUiByArgs({msg:"赛区已结束!"});
                            break; 
                        case 19:
                            g_childGame.toCircle();
                            g_uiMgr.showAlertUiByArgs({msg:"比赛人数不足，比赛结束!"});
                            break;                    
                    }
                    break;
            }

        }


        private checkIp(data:any):void
        {
            var ipStr:string = "";
            if(data.num.length)
            {
                ipStr += getDesByLan("玩家");
                for(var i:number = 0;i < data.num.length; i++)
                {
                    var obJ = data.num[i];
                    for(var j:number = 0;j < obJ.withId.length; j++) {
                        ipStr += "【"+obJ.withId[j].nickName+"】";
                    }
                    ipStr += "同IP";
                    if(i < data.num.length - 1) {
                        ipStr += "、";
                    }
                }
                ipStr += "!";
            }
            // var addStr:string = this.checkDis();
            if(ipStr != "")
            {
                this._tip_ip = this._tip_ip || new gamelib.common.qpq.QpqTip_IP();
                this._tip_ip.show();
                this._tip_ip.showSameIp(ipStr,"",data.times);
            }
            else
            {
                sendNetMsg(0x00EB,1);
            }
        }
    }
}
