module qpq.hall
{
	/**
	 * 修改个人信息，包括名字
	 * @type {[type]}
	 */
	export class SelfInfoModify extends gamelib.core.BaseUi
	{
		private _sex:Laya.RadioGroup;
		private _oldSex:number;
		constructor(res:string = "qpq/Art_GaiMing") {
			super(res)
		}

		protected init():void
		{
			this._res['img_head'].skin = GameVar.playerHeadUrl;
			this.addBtnToListener("btn_ok");
			this._noticeOther = true;
			this._sex = this._res['RG_sex'];
			this.m_closeUiOnSide = false;
		}

		protected onShow():void
		{
			if(this._sex)
			{
				this._oldSex = GameVar.sex == 1 ? 0 : 1;
				this._sex.selectedIndex = this._oldSex;

			}	

			this._res['txt_input1'].text = gamelib.data.UserInfo.s_self.m_name;
		}
		protected onClickObjects(evt:Laya.Event):void
		{
			if(evt.currentTarget.name == "btn_ok")
			{
				if(this._res['txt_input1'].text == "")
				{
					g_uiMgr.showAlertUiByArgs({msg:"昵称不能为空"});
					return;
				}
				var _name:string = this._res['txt_input1'].text;

				var isChange:boolean = _name != GameVar.nickName;
				if(this._sex)
				{
					isChange = isChange || (this._oldSex != this._sex.selectedIndex);
				}

				if(true)	//不需要检测是否修改过
				{
					if(g_commonFuncs)
					{
						if(this._sex)
						{
							var sex:number = this._sex.selectedIndex == 0 ? 1 : 2;
							gamelib.Api.updateUserInfo({nick:_name,gender:sex},Laya.Handler.create(this,this.onModifyNickName));
						}
						else
						{
							gamelib.Api.updateUserInfo({nick:_name},Laya.Handler.create(this,this.onModifyNickName));
						}
					}
					else
					{
						if(window['application_modify_nickname'])
	                	{
	                		g_uiMgr.showMiniLoading({delay:10,msg:"修改中",alertMsg:"修改失败"});
	                		window['application_modify_nickname'](_name,this.onModifyNickName,this);
	                	}
					}
				}
				// else
				// {
				// 	g_uiMgr.showAlertUiByArgs({msg:"无法保存"});
				// }
			}
		}
		private onModifyNickName(obj:any):void
		{
			g_uiMgr.closeMiniLoading();
			if(obj.ret == 1)
			{
				g_uiMgr.showTip("修改成功");
				GameVar.urlParam['nickname'] = this._res['txt_input1'].text;
				if(this._sex)
				{
					var sex:number = this._sex.selectedIndex == 0 ? 1 : 2;
					GameVar.urlParam['gender'] = sex;
				}	

				gamelib.data.UserInfo.s_self.m_name = GameVar.nickName;
				gamelib.data.UserInfo.s_self.m_sex = GameVar.sex;
				var temp:any = qpq.g_configCenter.getConfigByIndex(0);
				if(temp == null)
					temp = qpq.g_configCenter.getConfigByIndex(1);
				g_childGame.modifyGameInfo(temp.gz_id,"nickname",GameVar.urlParam['nickname']);
				g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA,0);
				sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
				this.close();
				try{
					sendNetMsg(0x2202,2,7);
				}
				catch(e)
				{

				}
			}
			else
			{
				g_uiMgr.showTip("修改失败" + obj.clientMsg);
			}
		}

	}
}