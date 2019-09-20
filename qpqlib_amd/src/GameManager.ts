/**
 * Created by wxlan on 2017/9/4.
 */
namespace qpq
{
    export var g_qpqData:qpq.data.QpqData = null;    
    export var g_configCenter:qpq.data.ConfigCenter = null;
    
    export class GameManager extends gamelib.core.GameDataManager
    {

        public get m_hall():HallScene
        {
            return this._hall;
        }
        private _hall:HallScene;

        private _toGzId:{gz_id:number,gameMode:number};


        
        public constructor()
        {
            super();
            
            if(GameVar.g_platformData['hall_show_time'] == 0 || GameVar.g_platformData['hall_show_time'] == undefined)
            {
              Laya.timer.once(100,this,this.onEnterHall);  
            }
        }
            
        public reciveNetMsg(msgId:number,data:any):void
        {
            super.reciveNetMsg(msgId,data);
            switch (msgId)
            {
                case 0x0003:
                    // g_qpqData.checkHuoDong();
                    break;
                case 0x0040:
                    g_qpqData.checkNotice();
                    g_qpqData.checkHuoDong();
                   break;
                //case 0x0089:
                //    s_hall.updateMine(data);
                //    break;
                case 0x00E1://评价总体信息
                    //s_hall.updateMyEs(data);
                    break;
                case 0x00F1:
                   if(data.result != 1)
                   {
                       g_signal.dispatch("closeQpqLoadingUi",0);
                       switch (data.result)
                       {
                           case 2:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("创建局数超过上限") + "!"});
                               break;
                           case 8:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("创建数据失败") + "!"});
                               break;
                           case 13:
                               if(GameVar.g_platformData.gold_name_zj)
                                   g_uiMgr.showAlertUiByArgs({msg:GameVar.g_platformData.gold_name_zj + getDesByLan("不足") + "!"});
                               else
                                   g_uiMgr.showAlertUiByArgs({msg:GameVar.g_platformData.gold_name + getDesByLan("不足") + "!"});
                               break;
                           case 14:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("无效的局数") + "!"});
                                break;  
                            case 15:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("无效的玩法") + "!"});
                                break;
                            case 16:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("无效的俱乐部ID") + "!"});
                                break;
                            case 17:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("玩家俱乐部权限不足") + "!"});
                                break;
                            case 18:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("需要好友才能加入") + "!"});
                                break;
                            case 19:
                                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("超过最大创建数") + "!"});
                                break;    
                       }
                   }
                   break;

                case 0x00F2:
                   var old = g_qpqData.m_groupList;
                   g_qpqData.m_groupList = data.groupNum; 
                   for(var i:number = g_qpqData.m_groupList.length-1;i >= 0;i--) 
                   {
                       if(!qpq.g_configCenter.getConfigByGzIdAndModeId(g_qpqData.m_groupList[i].gz_id,g_qpqData.m_groupList[i].gameMode)) {
                          g_qpqData.m_groupList.splice(i,1);
                        }
                  }
                   if(old == null)
                        g_qpqData.new_table = g_qpqData.m_groupList.length != 0;
                    else
                        g_qpqData.new_table =  old.length != g_qpqData.m_groupList.length && g_qpqData.m_groupList.length != 0;                    
                   break;
                case 0x00F3:
                    this._toGzId = {gz_id:data.gz_id,gameMode:data.gameMode};
                    g_qpqData.onGetGroupInfo(data);
                   break;

                case 0x00F4:
                    g_signal.dispatch("closeQpqLoadingUi",0);
                    if (data.result == 0) 
                    {
                        g_uiMgr.showAlertUiByArgs({"msg":getDesByLan("游戏创建失败!请联系工作人员")});
                        return;
                    }
                    if(data.result == 5)
                    {
                        g_uiMgr.showAlertUiByArgs({"msg":getDesByLan("创建牌桌数据失败!")});
                        return;
                    }
                    if(data.result != 1)
                    {
                        g_uiMgr.showAlertUiByArgs({"msg":getDesByLan("创建失败!" + data.result)});
                        return;
                    }
                    var groupInfo:any = g_qpqData.getGroupInfoByGroupId(data.groupId);
                    groupInfo.validation = data.validation;
                    g_qpqData.new_table = true;
                    if(GameVar.g_platformData.autoEnterGame)
                    {
                        this.enterChildGame(groupInfo.gz_id,data.validation);
                    }
                    else
                    {
                        g_uiMgr.showConfirmUiByArgs({
                          msg:getDesByLan("房间创建成功，是否进入游戏") + "？",
                          callBack:function(type:number)
                          {
                              if(type == 0)   //进入子游戏
                              {
                                  this.enterChildGame(groupInfo.gz_id,data.validation);
                                  return;
                              }
                          },
                          thisObj:this,
                          okLabel:getDesByLan("进入游戏"),
                          cancelLabel:getDesByLan("取消")
                      });
                     }                    
                   playSound_qipai("news");
                   break;

                case 0x00F6:
                    qpq.g_qpqData.onHandleGroup(data);
                    g_signal.dispatch("closeQpqLoadingUi",0);
                    break;
                case 0x00F7:
                    qpq.g_qpqData.m_bigSaleList = data.games;
                    break;

                case 0x00F8:    //申请进入组局牌桌
                    if(data.result == 1 || data.result == 2) 
                    {
                        g_signal.dispatch("closeQpqLoadingUi",0);
                        this.enterChildGame(data.gz_id,data.validation);
                    } 
                    else
                     {
                        playSound_qipai("warn");
                        g_signal.dispatch("closeQpqLoadingUi",0);
                    }
                    break;

                case 0x0F01:
                    qpq.data.PlayerData.onData0x0F01(data);
                    if(GameVar.g_platformData['hall_show_time'] == 0 || GameVar.g_platformData['hall_show_time'] == undefined)
                    {
                        super.onEnterHall();
                        
                    }
                    else
                    {
                        if(this._hall == null)
                             this.onEnterHall();
                    }
                    this._hall.onReciveNetMsg();
                    qpq.g_qpqData.requestHabitData();
                    break;

                case 0x0F08:
                   qpq.g_qpqData.parseHabitData(data);
                   qpq.g_configCenter.onUpdateOrder();
                   break;

                case 0x2033:
                  qpq.g_qpqData.m_siginData = data;
                  break;  
                
                case 0x2704:
                    g_uiMgr.closeMiniLoading();
                    switch(data.result)
                    {
                        case 1:
                            g_uiMgr.showTip(getDesByLan("报名成功"));
                            break;
                        case 2:
                            // g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:报名已结束")});
                            break;    
                        case 3:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:报名被拒绝")});
                            break; 
                        case 4:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:报名费用不足")});
                            break;           
                        case 5:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:比赛不存在")});
                            break;
                        case 6:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:已加入其他比赛")});
                            break;   
                        case 7:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:已经加入该比赛")});
                            break;   
                        case 8:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:正在等待审核")});
                            break;   
                        case 9:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("报名失败:报名次数不足")});
                            break;  
                        case 12:
                            g_uiMgr.showAlertUiByArgs({msg:getDesByLan("比赛已经结束")});
                            break;                            
                    }
                    break;    
                case 0x2707:
                    g_uiMgr.closeMiniLoading();
                    switch(data.result)
                    {
                        case 1:
                            g_uiMgr.showTip(getDesByLan("创建成功"));
                            break;
                        case 3:
                            g_uiMgr.showTip(getDesByLan("创建失败,报名人数限制和时间限制不能同时为0"));
                            break;    
                        case 4:
                            g_uiMgr.showTip(getDesByLan("创建失败,最多只能选择同一种限制"));
                            break;    
                        case 7:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的游戏id"));
                            break;    
                        case 8:
                            g_uiMgr.showTip(getDesByLan("创建失败,创建数据失败"));
                            break; 
                        case 13:
                            g_uiMgr.showTip(getDesByLan("创建失败,"+GameVar.g_platformData.gold_name+"不足"));
                            break; 
                        case 14:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的局数"));
                            break;    
                        case 15:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的游戏玩法"));
                            break;     
                        case 100:
                            g_uiMgr.showTip(getDesByLan("创建失败,无效的玩家pid"));
                            break; 
                        case 106:
                            g_uiMgr.showTip(getDesByLan("创建失败,正在其他游戏中"));
                            break;                                   
                    }
                    break;
                case 0x2708:
                    if(data.result == 1)
                    {
                        // g_uiMgr.showTip(getDesByLan("比赛开始了"));
                        g_childGame.enterMatch(data.gz_id,data.id,false);  
                        this._hall.onExit();              
                    }
                    break;    
               

                case 0x270A:
                    switch(data.result)
                    {
                        case 1:
                            g_uiMgr.showTip(getDesByLan("退出比赛成功"));
                            break;
                        case 2:
                            g_uiMgr.showTip(getDesByLan("没找到该比赛"));
                            break;
                        case 3:
                            g_uiMgr.showTip(getDesByLan("不能退出未加入的比赛"));
                            break; 
                        case 4:
                            g_uiMgr.showTip(getDesByLan("比赛状态错误"));
                            break;
                        case 5:
                            g_uiMgr.showTip(getDesByLan("玩家状态错误"));
                            break;  
                        case 6:
                            g_uiMgr.showTip(getDesByLan("玩家尚未报名"));
                            break;         
                    }
                    break;   
            }
        }
        
        protected onEnterHall():void
        {
            this._hall = this._hall || new HallScene();
            this._hall.onEnter();
            g_loading.close();
        }

        private enterChildGame(gz_id:number,validation:string):void
        {
            g_signal.dispatch("closeCreateUi");
            var groupInfo:any = g_qpqData.getGroupInfoByGz_id(gz_id,validation);
            GameVar.g_platformData["groupInfo"] = groupInfo;
            g_childGame.enterGameByClient(gz_id,true,validation);
        }
    }
}
