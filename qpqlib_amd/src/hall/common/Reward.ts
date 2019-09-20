/**
* name  奖励动画
*/
module qpq.hall{
	export class Reward extends gamelib.core.BaseUi{

		private _list:Array<any>;
		private _goods:any;
		constructor(){
			super("qpq/Art_GetItems");
		}
		protected init():void
        {
			super.init();
			this.addBtnToListener('btn_ok');		
		}
		/**
		 * 播放获得单个个物品动画
		 * 推荐使用playGetItemsAni方法
		 * @param url 图片资源
		 * @param num 道具的数量
		 * @param msId 道具msid
		 * 
		 */
		public rewardAni(url:string,num:number,msId:number)
		{
			this._res.visible = true;
			this._res["img_daoju"].skin = url;
			this._res["txt_2"].text = "" + gamelib.data.GoodsData.GetNameByMsId(msId) + "X" + num;			
			// this._res['txt_3'].visible = !(name == gamelib.data.GoodsData.MSID_TQ ||gamelib.data.GoodsData.MSID_PLATFORMCOIN ||gamelib.data.GoodsData.MSID_ZUANSHI)
			this.show();
			this._res["ani1"].play(0,false);
			playSound_qipai('get',1,null,true);
		}
		/**
		 * 播放获得道具的动画
		 * @param list Array<{msId:number,num:number}>|{items:Array<{msId:number,num:number}>,goods:any}
		 */
		public playGetItemsAni(list:Array<{msId:number,num:number}>|{items:Array<{msId:number,num:number}>,goods:any}):void
		{
			if(list instanceof Array){
				this._list = list;				
			}
			else{
				this._list = list.items;
				this._goods = list.goods;
			}
			
			if(this._list == null || this._list.length == 0)
			{
				this.close();
				return;
			}	
			var obj:any = this._list.shift();
			var msId:number = obj.msId;
			if(isNaN(msId))
				msId = obj.msid;
			this.playAni(msId,obj.num);
			playSound_qipai('get',1,null,true);
		}
		private playAni(msId:number,num:number):void
		{
			var url:string = gamelib.data.GoodsData.GetGoodsIconByMsId(msId);
			this._res["img_daoju"].skin = url;
			this._res["txt_2"].text = "" + gamelib.data.GoodsData.GetNameByMsId(msId) + "X" + num;
			this.show();
			this._res["ani1"].play(0,false);
		}
		protected onShow():void
		{
			super.onShow();
		}
		protected onClose():void
		{
			super.onClose();
			this._res["ani1"].stop();
			this._list = null;
			if(this._goods)
			{
				if(!utils.tools.isQpqHall())
					return;
				if(this._goods.group_id == 1)
				{
					// g_uiMgr.showAlertUiByArgs({
					// 	msg:"您已获得1次抽奖机会,是否现在去抽奖",
					// 	type:4,
					// 	okLabel:"试试手气",
					// 	cancelLabel:"关闭",
					// 	callBack:function(type:number){
					// 		if(type == 0)
					// 		{
					// 			g_signal.dispatch("showFanFanLe",0);
					// 		}
					// 	}
					// });
				}
			}
			this._goods = null;
		}
		protected onClickObjects(evt:laya.events.Event):void
        {
            switch(evt.currentTarget.name)
            {
				case "btn_ok":
					if(this._list == null)
						this.close();
					else
						this.playGetItemsAni(this._list);
					break;
			}
		}

	}

}