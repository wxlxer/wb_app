namespace qpq.hall
{
    export class ChangeHeadUi extends gamelib.core.BaseUi
    {	
        private _list:Laya.List;
        private _gougou:Laya.Image;
        private _lastSelectIndex:number;
        private _selecteImg:SelectHeadImgUi;
        
        private _callBack:Laya.Handler;
        public m_parentUi:gamelib.core.BaseUi;
        constructor() {
            super("qpq/Art_XGTX");
        }
        
        protected init():void
        {
            this._noticeOther = false;
            var arr:Array<string> = [];
            var list:Array<string> = Laya.loader.getRes("qpq/config/config.json").head_list;
            for(var str of list)
            {
                var head:string = "";
				if(str.indexOf("http") == -1)
				{
					head = GameVar.common_ftp + str;
				}
				else
				{
					head = str;
				}
				arr.push(head);
            }
            this._list = this._res['list_1'];
            this._list.dataSource = arr;
            this._list.selectEnable = true;
            this._list.selectHandler = Laya.Handler.create(this,this.onSelect,null,false);
            this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
            
            this.addBtnToListener('btn_add');
            this.addBtnToListener('btn_ok');
            this._callBack = Laya.Handler.create(this,this.onSaveCallBack,null,false);

           
        }
        private onSelect(index:number):void
        {
            if(index == -1)
				return;
            this._res["img_head"].skin = this._list.dataSource[index];	
        }
        private onItemRender(box:Laya.Box,index:number):void
        {
            var head:Laya.Image = getChildByName(box,"b_playerhead.img_head");
            var gg:Laya.Image = getChildByName(box,"img_gg");
            gg.visible = index == this._list.selectedIndex;
            head.skin = this._list.dataSource[index];
        }
        protected onShow():void
        {
            super.onShow();
            this._res['img_head'].skin = GameVar.playerHeadUrl;	
			var index:number = this._list.dataSource.indexOf(GameVar.playerHeadUrl);
			this._list.selectedIndex = index;
			playSound_qipai("open");
            this.updateOther();
        }
        protected updateOther():void
        {

        }
        protected onClose():void
        {
            super.onClose();
            this._lastSelectIndex = -1;
            if(this.m_parentUi)
                this.m_parentUi.show();
        }
        protected onClickObjects(evt:Laya.Event):void
        {
            playButtonSound();
            switch (evt.currentTarget.name) 
            {
                case "btn_add":
                    //通知app打开是手机相册
                    this._selecteImg = this._selecteImg || new SelectHeadImgUi(this._callBack);
                    this._selecteImg.show();			
                    break;
                case "btn_ok":
                    //修改头像
                    g_commonFuncs.saveSelfInfo({icon:this._res['img_head'].skin},this._callBack);                    
                    break;
                default:
                    break;
            }
        }
        
        private onSaveCallBack(ret:any):void
        {
            if(ret.ret == 1)
            {
                g_net_configData.addConfig("modifyHead",1);
                g_net_configData.saveConfig();
                var url:string = ret['__url'];
                if(url != undefined)
                    this._res['img_head'].skin = url;
                else
                    url = this._res['img_head'].skin;
                GameVar.urlParam['icon_url'] =  url;
                gamelib.data.UserInfo.s_self.m_headUrl = GameVar.playerHeadUrl;
                gamelib.Api.saveAppUserInfo({icon:url});
                for(var i:number = 1; i <= 5; i++)
                {
                    var temp:any = qpq.g_configCenter.getConfigByIndex(i);
                    if(temp)
                        g_childGame.modifyGameInfo(temp.gz_id,"icon_url",GameVar.urlParam['icon_url']);	
                }                
                g_signal.dispatch(gamelib.GameMsg.UPDATEUSERINFODATA,0);
                sendNetMsg(0x005D, GameVar.nickName, GameVar.playerHeadUrl_ex, GameVar.sex);
            }
            else
            {
                playSound_qipai("warning");
            }
            g_uiMgr.showTip(ret.clientMsg);
        }
    }
}