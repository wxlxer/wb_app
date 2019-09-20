namespace qpq
{
	export class Banner{
		
		private _box:Laya.Box;
		private _list:Array<any>;
		private _grap:number = 3000;		//3秒切换一次
		private _index:number = 0;
		private _image_list:Array<Laya.Image>;
		constructor(res:any) {
			this._box = res['img_guanggao'].parent;	
			var image1:Laya.Image = res['img_guanggao'];
			var image2:Laya.Image = new Laya.Image();
			image2.width = image1.width;
			image2.height = image1.height;

			this._box.addChild(image2);
			image2.x = image1.x + image1.width;
			image2.y = image1.y;
			// image1.skin = "";

			this._image_list = [];
			this._image_list.push(image1,image2);
			
			image1.mouseEnabled = image2.mouseEnabled = true;		//on不会对mouseEnabled = false的对象处理
            image1.on(Laya.Event.CLICK, this, this.onClick);
            image2.on(Laya.Event.CLICK, this, this.onClick);
            image1.mouseEnabled = image2.mouseEnabled = false;
		}
		private onClick(evt:Laya.Event):void
		{
			if (this._list == null)
                return;
            var hd = evt.currentTarget['__hd'];
            if (hd && hd.callback) {
                try {
                    eval(hd.callback);
                }
                catch (e) {
                }
            }
		}
		public setData():void
		{
			if(this._list != null)
				return;
			this._list = g_qpqData.huodong_list;
			
			// this._list = this._list.concat(this._list).concat(this._list);
			// this._list.push({img_url:"huodong/huodong_2_1.jpg"},{img_url:"huodong/huodong_3_1.jpg"});
			if(this._list.length == 0)
			{
				this._list = null;
				this._image_list[0].mouseEnabled = this._image_list[1].mouseEnabled = false;
				return;
			}
			if(this._list.length == 1)
			{
				// this._image_list[0].x = 0;				
				this.setUrl(this._list[0],this._image_list[0]);	
				this._image_list[0].mouseEnabled = true;	
				this._image_list[1].mouseEnabled = false;			
			}
			else
			{
				this._image_list[0].mouseEnabled = this._image_list[1].mouseEnabled = true;
				this._index = 0;
				this.setUrl(this._list[0],this._image_list[0]);	
				this.setUrl(this._list[1],this._image_list[1]);	
				Laya.timer.once(this._grap,this,this.showImage);
			}
		}
		private showImage():void
		{
			var hd:any = this._list[this._index++];
			if(this._index >= this._list.length)
				this._index = 0;

			var image1:Laya.Image = this._image_list.shift();
			var image2:Laya.Image = this._image_list.shift();
			// console.log(image1.x,image2.x);
			image1.x = 0;
			image2.x = image1.width;
			Laya.Tween.to(image1,{x:-image1.width},200)
			Laya.Tween.to(image2,{x:0},200);
			this._image_list.push(image2,image1);
			this.setUrl(hd,image2);
			Laya.timer.once(this._grap,this,this.showImage);
		}
		private setUrl(hd:any,image:Laya.Image):void
		{
			if(hd.img_url.indexOf("http") == -1)
				image.skin = GameVar.urlParam['request_host'] + hd.img_url;
			else	
				image.skin = hd.img_url;	
			image['__hd'] = hd;
		}
	}
}