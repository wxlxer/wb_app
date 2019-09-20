namespace gamelib.control
{
	/**
	 * 管理动画的。直接用g_animation来使用，不要实例化次类
	 * @class Animation
	 */
	export class ChilpInHeadEffect {
		private _list:Array<HeadEffect>;
		constructor() {
			this._list = [];
		}
		/**
		 * 注册头像，如果头像的位置如下
		 * 1  5
		 * 2  6
		 * 3  7
		 * 4  8
		 * registerHeads1([1,2,3,4],3,1);
		 * registerHeads1([5,6,7,8],2,5);
		 * 
		 * @function
		 * @DateTime 2019-03-28T10:32:45+0800
		 * @param    {any}                    heads          [description]
		 * @param    {number}                 type           移动的类型 0上 1下 2左  3右
		 * @param    {number}                 startLocalSeat [description]
		 */
		public registerHeads1(heads:any,type:number,startLocalSeat:number):void{
			if(heads instanceof Array){
				for(var i:number = 0; i < heads.length; i++){
					var effect:HeadEffect = new HeadEffect(heads[i],type);
					this._list[startLocalSeat + i] = effect;
				}
			}
			else{
				var effect:HeadEffect = new HeadEffect(heads,type);
					this._list[startLocalSeat] = effect;
				}
		}
		/**
		 * 注册头像，如果头像的位置如下
		 * 1  2
		 * 3  4
		 * 5  6
		 * 7  8
		 * registerHeads2([1,3,5,7],3,1);
		 * registerHeads2([2,4,6,8],2,2);
		 * 
		 * @function
		 * @DateTime 2019-03-28T10:32:45+0800
		 * @param    {any}                    heads          [description]
		 * @param    {number}                 type           移动的类型 0上 1下 2左  3右
		 * @param    {number}                 startLocalSeat [description]
		 */
		public registerHeads2(heads:any,type:number,startLocalSeat:number):void{
			if(heads instanceof Array){
				for(var i:number = 0; i < heads.length; i++){
					var effect:HeadEffect = new HeadEffect(heads[i],type);
					this._list[startLocalSeat + i*2] = effect;
				}
			}
			else{
				var effect:HeadEffect = new HeadEffect(heads,type);
					this._list[startLocalSeat] = effect;
				}
		}
		/**
		 * 注册头像，如果头像的位置是乱的,用以下方法
		 * @function
		 * @DateTime 2019-03-28T10:32:45+0800
		 * @param    {any}                    heads          [单个位置或者按位置排好的]
		 * @param    {number}                 type           移动的类型 0上 1下 2左  3右
		 * @param    {number}                 localSeat [description]
		 */
		public registerHeads3(heads:any,type:number,localSeat?:number):void{	
			var seat:number = isNaN(localSeat)? this._list.length : localSeat;
			if(heads instanceof Array){
				for(var i:number = 0; i < heads.length; i++){
					var effect:HeadEffect = new HeadEffect(heads[i],type);
					this._list[seat + i] = effect;
				}
			}
			else{
				var effect:HeadEffect = new HeadEffect(heads,type);
					this._list[seat] = effect;
				}
		}
		public destroy():void{
			for(var effect of this._list){
				if(effect == null)
					continue;
				effect.destroy();

			}
			this._list = null;
		}
		public play(localSeat:number):void{
			var effect:HeadEffect = this._list[localSeat];
			if(effect){
				effect.show();
			}
		}
	}
	export class HeadEffect {

        private _res: any;
        private _effceType: number;
        private _offset: number;
        private _delay: number
        private _targetPos: any;
        private _formerPos: any;

        /**
       * 头像容器移动类实例化
         * @param res 头像容器
         * @param effectType 移动的类型 0上 1下 2左  3右
         * @param offset 移动的偏移
         * @param delay 缓动时间
         */
        constructor(res: any, effectType: number, offset: number = 30, delay: number = 400) {
            this._res = res;
            this._effceType = effectType;
            this._offset = offset;
            this._delay = delay / 2;
            this.init();
        }

        public get offset(): number {
            return this.offset;
        }
        public set offset(value: number) {
            this._offset = value;
        }

        public get effectType(): number {
            return this._effceType;
        }
        public set effectType(value: number) {
            this._effceType = value;
            this.getTheTargetPos();
        }

        public get delay(): number {
            return this._delay;
        }
        public set delay(value: number) {
            this._delay = value / 2;
        }

        protected init(): void {
            this._targetPos = { x: 0, y: 0 };
            this._formerPos = { x: this._res.x, y: this._res.y };
            this.getTheTargetPos();
        }

        public show(): void {
        	this.close();
            Laya.Tween.to(this._res, { x: this._targetPos.x, y: this._targetPos.y }, this._delay, null, Laya.Handler.create(this, this.moveEnd), 0, false);
        }

        protected moveEnd(): void {

            Laya.Tween.to(this._res, { x: this._formerPos.x, y: this._formerPos.y }, this._delay, null, Laya.Handler.create(this, this.close), 0, false);
        }

        public close(): void {
            Laya.Tween.clearAll(this._res);
        }

        public destroy(): void {
            this.close();
            this._res = null;
            this._targetPos = null;
            this._effceType = null;
            this._offset = null;
            this._formerPos = null;
        }

        protected getTheTargetPos(): void {
            var effectX: number = 0;
            var effectY: number = 0;
            switch (this._effceType) {
                case 0:
                    effectY = -1;
                    break;
                case 1:
                    effectY = 1;
                    break;
                case 2:
                    effectX = -1;
                    break;
                case 3:
                    effectX = 1;
                    break;
            }

            this._targetPos.x = this._formerPos.x + this._offset * effectX;
            this._targetPos.y = this._formerPos.y + this._offset * effectY;

        }
    }
}