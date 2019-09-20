namespace qpq.hall
{
	export class Help extends gamelib.core.BaseUi
	{	
		private _tab:Laya.Tab;	
		private _url:string;
		private _datas:any;
		private _isLoading:boolean;
		private _text:Laya.TextArea;
		private _toShowIndex:number;

		private _page:Laya.HTMLIframeElement;
		private _slider:Laya.VSlider;
		constructor() {
			super("qpq/Art_Help");
		}

		protected init():void
		{
			this._tab = this._res['tab'];
			this._url = GameVar.g_platformData['help_file_name'];
			if(this._url == "" || this._url == null)
			{
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("先设置帮助文件") + "!"});
			}
			this._url = GameVar.common_ftp + this._url;
			
			this._isLoading = true;
			Laya.loader.load(this._url,Laya.Handler.create(this,this.onHelpFileLoaded),null,laya.net.Loader.JSON);

			this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
			this._toShowIndex = 0;
			this._res["txt_txt"].text = "";

			this._page = new Laya.HTMLIframeElement();
			this._res.addChild(this._page);
			this._page.x = this._res["txt_txt"].x;
			this._page.y = this._res["txt_txt"].y;

			// this._slider = new Laya.VSlider();
			// vs.skin = "../../res/ui/vslider.png";
			// vs.height = this._res["txt_txt"].height;
			// vs.pos(this._res["txt_txt"].x + this._res["txt_txt"].width - 50, 50);
			// vs.min = 0;
			// vs.max = 100;
			// vs.value = 50;
			// vs.tick = 1;
		}
		public setIndex(index:number):void
		{
			this._toShowIndex = index;
		}
		private onHelpFileLoaded(bSuccess:boolean):void
		{
			if(!bSuccess)
			{
				g_uiMgr.showAlertUiByArgs({msg:getDesByLan("帮助文件出错") + "!"});
				return;
			}
			this._isLoading = false;
			var data:any = Laya.loader.getRes(this._url);
			Laya.loader.clearRes(this._url);
			this._datas = [];
			var tabs:Array<string> = [];
			for(var obj of data.tabs)
			{
				tabs.push(obj.label);
				var url:string = GameVar.common_ftp + obj.href;
				this._datas.push(url);;
			}
			this._tab.labels = tabs.join(",");
			this._tab.selectedIndex = this._toShowIndex;
		}
		protected onShow():void
		{
			if(this._isLoading)
			{
				return;
			}
			this._tab.selectedIndex = this._toShowIndex;
		}

		private onTabChange():void
		{
			this.showData(this._tab.selectedIndex);
		}

		private showData(index:number):void
		{
			this._page.href = this._datas[index];

		}

	}
}