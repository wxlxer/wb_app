/**
 * Created by liuyi_000 on 2016/9/28.
 */
module gamelib.control
{
    /**
     * 扇形遮罩
     * @class
     */
    export class ArcMask extends Laya.Sprite
    {
        private _r:number;
        private _color:string
        private _pre:number = 0;
        private _angle:number = 0;
        public constructor(r:number) {
            super();
            this._r = r;
            this._color = '#FF0000';
            this.mouseEnabled = false;
        }

        public set pre(value:number)
        {
            if(value > 1)
                value = 1;
            this._pre = value;
            this._angle = 270 + value * 360;
            // this._angle = this._angle % 360;
            this.graphics.clear();
            if(value != 0)
            {
                //this.graphics.drawLine(0,0,this._r,0,this._color);
                this.graphics.drawPie(0,0,this._r,270, this._angle,this._color);    
            }
        }
        public get pre():number
        {
            return this._pre;
        }
    }
}