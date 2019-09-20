/**
* name 
*/
module qpq.data
{
	export class QpqData
	{
		public m_bgms:Array<string>;
		public m_groupList:any;			//牌桌列表
		public m_groupList_public:any;			//牌桌列表
		public m_bigSaleList:any;		//折扣数据
		public m_habitRecord:Array<any>;	//用户习惯记录
		public habit_store_max:number = 100;	//保存玩家建房数据（习惯）的列表长度上限        
		public new_table:boolean = false;		//是否显示牌桌红点
		public notice_config:any;		//大厅公告牌配置{visible:true,txt:"hello world!"}
		public pmd_config:any;			//跑马灯配置
		public day_notice_config:any;	//每日一次的弹窗公告
		public huodong_list:Array<any>;				//活动数据
		private _huodongData:any;
		public m_lastGameGroupId:number;		//上一次游戏的组句id，
		public m_reshowData:any;

		public m_siginData:any;	//签到数据

		public checkSiginIcon():boolean
		{
			if(this.m_siginData == null)
				return;
			for(var temp of this.m_siginData.list)
			{
				if(temp.statue == 1)
				{
					return true;
				}
			}
			if(this.m_siginData.list_lx)
			{
				for(var temp of this.m_siginData.list_lx)
				{
					if(temp.statue == 1)
					{
						return true;
					}
				}
			}
			
			if(this.m_siginData.list_lj)
			{
				for(var temp of this.m_siginData.list_lj)
				{
					if(temp.statue == 1)
					{
						return true;
					}
				}			
			}
			return false;
		}

		public constructor()
		{
			this.huodong_list = [];
			this.m_habitRecord = [];
		}
		/**
		 * 0x00F3获得组局信息
		 * @param data 
		 */
		public onGetGroupInfo(data:any):void
		{
			this.m_groupList = this.m_groupList || [];
			for(var i:number = 0; i < this.m_groupList.length; i++)
			{
				if(this.m_groupList[i].groupId == data.groupId)
				{
					this.m_groupList[i] = data;
					return;
				}
			}
			this.m_groupList.push(data);
		}
		public getGroupInfoByGroupId(groupId:number):any
		{
			for(var info of this.m_groupList)
			{
				if(info.groupId == groupId)
					return info;
			}
			return null;
		}
		public getGroupInfoByGz_id(gz_id:number,validation:string):any
		{
			for(var info of this.m_groupList)
			{
				if(info.gz_id == gz_id && info.validation == validation)
					return info;
			}
			return null;			
		}
		/**
		 * 操作组局
		 * @param data 
		 */
		public onHandleGroup(data:any):void
		{
			if(data.result != 1)
			{
				console.log("0x00F6操作失败!");
				return;
			}
			if(data.handle == 4)	//解散s
			{
				for(var i:number = 0; i <this.m_groupList.length; i++)
				{
					var item = this.m_groupList[i];
					if(item.groupId == data.groupId)
					{
						this.m_groupList.splice(i,1);
						return;
					}
				}
			}
		}

		private _test_time1:number;
		private _test_time2:number;
		/**
		 * 请求网络配置
		 */
		public requestWebConfig():void
		{			
			console.time("requestWebConfig");
			// var url:string = GameVar.urlParam['ftp'] + "/scripts/circle_config.php";
			// utils.tools.http_request(url,
			// 	{
			// 		platform:GameVar.platform,
			// 		pid:GameVar.pid,
			// 		action:"circle_config"
			// 	},
			// 	"get",this.onWebConfigLoade.bind(this));	
			window["application_circle_info"](GameVar.platform,GameVar.pid,this.onWebConfigLoade,this);
		}

		private onWebConfigLoade(data:any):void
		{
			data = data.data;
			console.timeEnd("requestWebConfig");
			// g_uiMgr.showAlertUiByArgs({"msg":"消耗时间:" +(Laya.timer.currTimer - this._test_time)});
			this.notice_config = data.hallBulletin;
			this.pmd_config = data.Pmd;

			var temp:Array<string> = ["<left>","<right>","<center>"];
			this.day_notice_config = data.greenGameBulletin;
			this.day_notice_config.align = "left";
			var gg:string = this.day_notice_config.txt;
			if(gg != null ){
				for(var i:number = 0; i < temp.length; i++)
				{
					var str = temp[i];
					var index:number = gg.indexOf(str);
					if(index != -1)
					{
						if(i == 0)
							this.day_notice_config.align = "left";
						else if(i == 1)
							this.day_notice_config.align = "right";
						else
							this.day_notice_config.align = "center";						
						gg = gg.slice(index+ str.length);
					}		
				}
			}
			this.day_notice_config.txt = gg;			
			this.huodong_list.length = 0;
			var temp1:any = null;
			if(typeof data.huodong == "string")
			{
				if(data.huodong != "")
					this._huodongData = JSON.parse(data.huodong);
			}
			else
			{
				this._huodongData = data.huodong;	
			}
			this.checkHuoDong();
			
			if(data.promots)
			{
				if(data.owner_promots)
				{
					GameVar.m_QRCodeUrl_Vip = data.owner_promots.promot1;
					GameVar.m_QRCodeUrl_Vip = GameVar.m_QRCodeUrl_Vip || data.owner_promots.promot2;
				}
				GameVar.m_QRCodeUrl = GameVar.m_QRCodeUrl || data.promots.promot1;
				GameVar.m_QRCodeUrl = GameVar.m_QRCodeUrl || data.promots.promot2;				
			}
			GameVar.m_QRCodeUrl = GameVar.m_QRCodeUrl || window['application_share_url']();
			g_signal.dispatch("updateHuoDongData",0);
			this.showPmd();
			this.checkNotice();
		}
		private showPmd():void
		{
			g_uiMgr.showPMD(g_qpqData.pmd_config.txt);
			var time_grap:number = g_qpqData.pmd_config.timer;
			if(!isNaN(time_grap) && time_grap != 0)
			{
				Laya.timer.once(time_grap,this,this.showPmd);
			}
		}
		/**
		 * 检测活动是否可以显示
		 */
		public checkHuoDong():void
		{
			if(this._huodongData == null || GameVar.s_loginSeverTime == 0 || isNaN(GameVar.s_loginSeverTime))
				return;
			if(g_net_configData.m_waitConfig)
				return ;
			this.huodong_list.length = 0;
			var bShowHuoDong:boolean = false;
			for(var i:number = 0; i < this._huodongData.length; i++)				
			{
				if(this.isHuoDongTime(this._huodongData[i]))
				{
					this.huodong_list.push(this._huodongData[i]);
					var login_show:any = this._huodongData[i].login_show
					if(login_show && login_show != "false")
					{
						bShowHuoDong = true;
					}
				}
			}
			if(bShowHuoDong)
			{
				var cur:number = GameVar.s_loginSeverTime;
				var lastShow:number = g_net_configData.getConfig("lastShowTime_Notice");
				if(isNaN(lastShow))
					lastShow = 0;
	            var past:number = cur - lastShow;	
	            if(past >= 3600*24)      	
				{
					g_signal.dispatch('showHuoDongUi',0);
					g_net_configData.addConfig("lastShowTime_Notice",cur);
					g_net_configData.saveConfig();
				}
			}
		}
		/**
		 * 检测是否可以显示公告
		 * @return {boolean} 
		 */
		public checkNotice():boolean
        {
        	if(this.day_notice_config == null || GameVar.s_loginSeverTime == 0 || isNaN(GameVar.s_loginSeverTime))
				return false;

			if(g_net_configData.m_waitConfig)
				return false;

            if(this.day_notice_config.show) {
                var cur:number = GameVar.s_loginSeverTime;
				var lastShow:number = g_net_configData.getConfig("lastShowTime");
				if(isNaN(lastShow))
					lastShow = 0;
                var past:number = cur - lastShow;	
                if(past >= 3600*24)		
				{
					g_signal.dispatch("showNoticeUi",qpq.g_qpqData.day_notice_config);
					g_net_configData.addConfig("lastShowTime",cur);
					g_net_configData.saveConfig();
				}        
            }
			return false;
        }

		/**
		 * 请求用户习惯数据
		 */
		public requestHabitData():void
		{
			sendNetMsg(0x0F08,1,"");
		}
		/**
		 * 解析用户习惯数据
		 * @param data 
		 */
		public parseHabitData(data:any):void
		{
			if(data.config)
			{
				try {
					this.m_habitRecord = JSON.parse(data.config).groupHabits;
					for(var i:number = this.m_habitRecord.length-1;i >=0;i --) {
						if(this.m_habitRecord[i].gz_id == null) {
							if(this.m_habitRecord[i].length == 15) {
								this.m_habitRecord[i] = this.transfer(this.m_habitRecord[i]);
							} else {
								this.m_habitRecord.splice(i,1);
							}
						}
					}
				} catch (e) {
					this.m_habitRecord = [];
				}
			} else {
				this.m_habitRecord = [];
			}
			for(var i:number = 0;i < this.m_habitRecord.length; i++) {
				if(typeof this.m_habitRecord[i] == "string") {
					this.m_habitRecord[i] = JSON.parse(this.m_habitRecord[i]);
				}
			}
		}
		private transfer(dataVec:any[]):any {
            var back:any = JSON.parse(dataVec[13]);
            back.mode_id = dataVec[14];
            if(back.mode_id > 100) {
                back.mode_id = back.mode_id%100;
                back.money_type = 1024;
            } else {
                back.money_type = 1023;
            }
            back.gz_id = dataVec[0];
            back.game_id = dataVec[1];
            back.room_name = dataVec[12];
            return back;
        }
		/**
		 * 创建游戏，保存用户习惯
		 * @param data 
		 */
		public onCreateGame(data:any):void
		{
            var toRemove:boolean=(this.m_habitRecord.length >= this.habit_store_max);
            for(var i:number = 0;i < this.m_habitRecord.length; i++) {
                var record:any = this.m_habitRecord[i];
                if(record.gz_id == data.gz_id && record.mode_id == data.mode_id) {
                    this.m_habitRecord.splice(i,1);
                    toRemove = false;
                    break;
                }
            }
            this.m_habitRecord.unshift(data);
            if(toRemove) {
                this.m_habitRecord.pop();
            }
            sendNetMsg(0x0F08,0,JSON.stringify({groupHabits:this.m_habitRecord}));
        }
        public getHabitData(config:any):any 
		{
            if(this.m_habitRecord && this.m_habitRecord.length) {
                for(var i:number = 0;i < this.m_habitRecord.length; i++)
                {
                    if(this.m_habitRecord[i].gz_id == config.gz_id && this.inSameMode(this.m_habitRecord[i].mode_id,config.mode_id)) {
                        return this.m_habitRecord[i];
                    }
                }
            }
        }
        private inSameMode(a:number,b:number):boolean {
        	if(isNaN(a) || isNaN(b))
        		return true;
            return a%100 == b%100;
        }


		/**
		 * 获得指定游戏和局数的折扣信息
		 * @param config 
		 * @param roundNum 
		 */
 		public getGameSale(config:any,roundNum:number):any {
            var back = this.getSaleConfig(config.game_id,config.mode_id,roundNum);
            if(back && this.checkValid(back)) {
                return back;
            }
            return null;
        }
		/**
		 * 检测是否是在折扣时间内
		 * @param data 
		 */
        public checkValid(data:any):boolean {
            var curSeverTime:number = GameVar.s_loginSeverTime;
            if(curSeverTime > data.startTime && curSeverTime < data.endTime) {
                return true;
            }
            return false;
        }
		/**
		 * 获得指定游戏和模式的折扣信息
		 * @param gameId 
		 * @param modeId 
		 * @param roundNum 
		 */
        public  getSaleConfig(gameId:number,modeId:number,roundNum:number=0):any 
        {
        	if(this.m_bigSaleList == null)
        		return;
            for(var i:number = 0;i < this.m_bigSaleList.length; i++) {
                if(this.m_bigSaleList[i].gameId == gameId) {
                    var list:any[] = this.m_bigSaleList[i].configs;
                    for(var j:number = 0;j < list.length; j++) {
                        if(list[j].modeId % 100 == modeId && (roundNum==0 || list[j].roundNum == roundNum)) {
                            return list[j];
                        }
                    }
                    break;
                }
            }
			return null;
        }
        /**
         * 获取一个游戏是否打折中
         * @game_id 分区id
         * @modeId 模式id，
         * @returns {boolean}
         */
        public getGameSaleById(game_id:number,modeId:number=0):boolean {
            for(var i:number = 0;i < this.m_bigSaleList.length; i++) {
                if(this.m_bigSaleList[i].gameId == game_id) {
                    var list:any[] = this.m_bigSaleList[i].configs;
                    for(var j:number = 0;j < list.length; j++) {
                        if(modeId) {
                            if(list[j].modeId%100 == modeId && this.checkValid(list[j])) {
                                return true;
                            }
                        } else {
                            if(this.checkValid(list[j])) {
                                return true;
                            }
                        }
                    }
                    break;
                }
            }
        }

		/**
		 * 获得分享数据
		 * @param data 
		 */
		public getShare(data:any):any 
		{
			var back:any = {};
			this.copyCommon(data,back);
			this.copyExtra(data,back);
			back.platform = GameVar.platform;
			return back;
		}

		/**
		 * 通过指定的配置文件来申请组局。不展示创建界面，五子棋
		 * @param config 
		 */
		public createGameByDefaultConfig(config:any):void
		{
			var obj:any = {};
			obj.gz_id = config.gz_id;
			obj.game_id = config.game_id;
			obj.money_type = config.money_type;
			obj.mode_id = config.mode_id;
			for(var i:number = 0; i < config.groups.length; i++)
			{
				if(config.groups[i].name)
				{
					obj[config.groups[i].name] = config.groups[i].value;
				}	
				else
				{
					for(var temp of config.groups[i].items)
					{
						if(temp.name == null)
							continue;
						obj[temp.name] = temp.value;	
					}
				}
				
			}



 			sendNetMsg(0x00F1,JSON.stringify(obj));
            playButtonSound();
            g_signal.dispatch("showQpqLoadingUi",{msg:getDesByLan("创建牌局中")+"..."});
            this.onCreateGame(obj);          
		}
		private copyCommon(data:any,back:any):void 
		{
			back.gz_id = data.gz_id;
			back.gameId = data.gameID;
			back.validation = data.validation;
			back.wxTips = false;
			back.fd = data.multipleMax;
			back.js = data.roundMax;		
			back.groupId = data.groupId;
		}
		private copyExtra(data:any,back:any):void
		{
			var extra:any = {};
			switch (data.gameID) {
				case 14:
				case 20:
				case 22:
				case 24:
				case 26:
					extra = JSON.parse(data.gamePlayJson);
					extra.playerSum = data.playerMaxNum;
					break;
				default:    //不知道有问题没wx
					extra = JSON.parse(data.gamePlayJson);
					extra.playerSum = data.playerMaxNum;
					break;

			}
			extra.mode_id = data.gameMode;
			back.addDatas = extra;
		}

		private isHuoDongTime(obj:any):boolean
		{
			//2017-12-21 00:00:00

            var loginTime: number = GameVar.s_loginSeverTime;
            // var huoDongTime: string = obj.time;
            // if(huoDongTime.length == 0)
            //     return true;
            // var arr: Array<string> = obj.start_time;//huoDongTime.split("-");
            var temp: string = obj.start_time;
            
            var year: number = parseInt(temp.substr(0,4));
            var month: number = parseInt(temp.substr(5,2));
            var day: number = parseInt(temp.substr(8,2));
            var hour: number = parseInt(temp.substr(11,2));
            var min: number = parseInt(temp.substr(14,2));

            var data: Date = new Date(year,month - 1,day,hour,min);
            var start: number = data.getTime();

            temp = obj.end_time;
            year = parseInt(temp.substr(0,4));
            month = parseInt(temp.substr(5,2));
            day = parseInt(temp.substr(8,2));
            hour = parseInt(temp.substr(11,2));
            min = parseInt(temp.substr(14,2));
            data = new Date(year,month - 1,day,hour,min);
            var end: number = data.getTime();
            
            var now: number = loginTime * 1000;
            var b: boolean = now >= start && now <= end;
            console.log("isHuoDongTime: start:" + start+" end:" + end+" now:"+now +getDesByLan("是否登陆显示")+":" + b);
            return b;
		}
	}
}