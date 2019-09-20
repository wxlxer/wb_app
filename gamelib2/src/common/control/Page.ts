module gamelib.control {

	/**
	 * 分页控件
	 * @class Page
	 */
	export class Page {
		
		private _prev:Laya.Button;
		private _next:Laya.Button;
		private _page:Laya.Label;

		private _total_page:number;
		private _current_page:number;
		private _change:Laya.Handler;

		/**
		 * @constructor
		 * @param {Laya.Button}  prev   [上一页按钮]
		 * @param {Laya.Button}  next   [下一页按钮]
		 * @param {Laya.Label}   page   [页面文本]
		 * @param {Laya.Handler} change [页码变化的回掉。参数为page，0-最大页面-1]
		 */
		constructor(prev:Laya.Button,next:Laya.Button,page:Laya.Label,change:Laya.Handler) {
			this._prev = prev;
			this._next = next;
			this._page = page;	
			this._change = change;
		}
		public show():void
		{
			this._prev.on(Laya.Event.CLICK,this,this.onPrev);
			this._next.on(Laya.Event.CLICK,this,this.onNext);
		}
		public close():void
		{
			this._prev.off(Laya.Event.CLICK,this,this.onPrev);
			this._next.off(Laya.Event.CLICK,this,this.onNext);
		}
		public get page():number
		{
			return this._current_page;
		}
		/**
		 * 设置页面
		 * @function setPage
		 * @param {number} page    [当前页码，从0开始]
		 * @param {number} maxPage [最大页码]
		 */
		public setPage(page:number,maxPage:number):void
		{
			this._current_page = page;
			this._total_page = maxPage == 0 ? 1 : maxPage;
			this.showPage();
		}

		private onPrev(evt:Laya.Event):void
		{
			playButtonSound();
			if(this._current_page == 0)
				return;
			this._current_page --;
			this.showPage();
		}
		private onNext(evt:Laya.Event):void
		{
			playButtonSound();
			if(this._current_page == this._total_page - 1)
				return;
			this._current_page ++;
			this.showPage();
		}

		private showPage():void{
			this._page.text = (this._current_page + 1) +"/" + this._total_page;
			this._change.runWith(this._current_page);
			this._prev.disabled = this._current_page == 0
			this._next.disabled = this._current_page == this._total_page - 1;
		}
	}
}