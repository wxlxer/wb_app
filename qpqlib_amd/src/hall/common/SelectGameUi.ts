namespace qpq.hall
{
	export class SelectGameUi extends gamelib.core.BaseUi {
		
		private _list:laya.ui.List;
		constructor() {
			super('qpq/Art_MoreGame');
		}

		protected init():void
		{
			this._list = this._res['list_1'];
			this._list.selectEnable = true;
			this._list.selectHandler = Laya.Handler.create(this,this.onSelected,null,false);
			this._list.renderHandler = Laya.Handler.create(this,this.onUpdateItem,null,false);
			this._res['img_2'].visible = false;
			this.m_closeUiOnSide = false;
		}

		protected onShow():void
		{
			super.onShow();
			this._list.selectedIndex = -1;
			this._list.dataSource = qpq.g_configCenter.game_configs;
		}
		protected onClose():void
		{
			super.onClose();
			//g_signal.dispatch('showCreateUi',0);
			g_signal.dispatch(SignalMsg.showCreateUi,0);
		}

		private onUpdateItem(box:laya.ui.Box,index:number):void
		{
			var gd:any = this._list.dataSource[index];
			var img_game:laya.ui.Image = getChildByName(box,'img_game');
			var txt_jd:laya.ui.Label = getChildByName(box,'txt_jd');
			var txt_game:laya.ui.Label = getChildByName(box,'txt_game');
			var img_icon:laya.ui.Image = getChildByName(box,'img_icon');
			var img_mask:laya.ui.Image = getChildByName(box,'img_mask');
			var img_jisu:laya.ui.Image = getChildByName(box,'img_jisu');
			img_game.skin = GameVar.common_ftp + 'hall/icons_2/' + gd.icon;
			txt_game.text = gd.name;
			img_jisu.visible = (gd.isLaya == "true" || gd.isLaya == true);

			txt_jd.visible = img_mask.visible = img_icon.visible = false

		}

		private onSelected(index:number):void
		{
			if(index == -1)
				return;
			qpq.g_configCenter.creator_default = this._list.dataSource[index];
			// console.log(JSON.stringify(qpq.g_configCenter.creator_default));
			playButtonSound();
			this.close();			
		}
	}
}