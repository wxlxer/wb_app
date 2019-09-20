/**
 * Created by wxlan on 2017/9/2.
 */
namespace gamelib.core
{
    /**
     * 层级管理器
     * @class  
     * @extends    laya.display.Sprite
     */
    export class LayerManager extends laya.display.Sprite
    {
        private _layers:Array<laya.display.Sprite>;
        public constructor()
        {
            super();
            this._layers = [];
        }
        /**
         * 获得指定层级的容器
         * @function getContainerByLayer
         * @DateTime 2018-03-16T13:42:45+0800
         * @param    {number}                 layer [description]
         * @return   {laya.display.Sprite}          [description]
         * @deprecated 用对象的zOrder来替代
         */
        public getContainerByLayer(layer:number):laya.display.Sprite
        {
            if(isNaN(layer))
                layer = 0;
            var temp:laya.display.Sprite;
            for(var i:number = 0; i < this._layers.length; i++)
            {
                if(this._layers[i].zOrder == layer)
                {
                    temp = this._layers[i];
                    return temp;
                }
            }
            temp = new laya.display.Sprite();
            this.addChild(temp);
            this._layers.push(temp);
            this._layers[i].zOrder = layer;
            this.updateZOrder();
            //this._layers.sort(function(g1:laya.display.Sprite,g2:laya.display.Sprite):number
            //{
            //    if(g1["layer"] < g2["layer"])
            //        return -1;
            //    return 1;
            //});
            //for(var i:number = 0; i < this._layers.length; i++)
            //{
            //    this.addChildAt(this._layers[i],i);
            //}
            return temp;
        }

        public debug():void
        {
            this.graphics.clear();
            this.graphics.drawRect(0,0,g_gameMain.m_gameWidth,g_gameMain.m_gameHeight,"#FF0000");
        }
    }
}
