/**
 * Created by wxlan on 2017/1/14.
 *
 */
module gamelib.chat
{
    
    /**
     * 显示表情.需要把美术资源提供的表情图标传过来
     * @class Face
     */
    export class Face
    {
        private static _instance:Face;
        public static get s_instance():Face
        {
            if(Face._instance == null)
                Face._instance = new gamelib.chat.Face();
            return Face._instance;
        }
        private _pos_list:Array<any>;

        public constructor()
        {
        }
        /**
         * 设置表情图标列表
         * @function initPos
         * @DateTime 2018-03-17T13:54:45+0800
         * @param    {Array<any>}             arr [description]
         */
        public initPos(arr:Array<any>):void
        {
            this._pos_list = arr;
            for(var key in arr)
            {
                arr[key].visible = false;
            }
        }
        /**
         * 显示指定id的表情到指定的容器里面
         * @function showFaceToPos
         * @DateTime 2018-03-17T13:55:07+0800
         * @param    {number}                 id     [description]
         * @param    {Laya.Box}               parent [description]
         */
        public showFaceToPos(id:number,parent:Laya.Box):void
        {
            if(id < 0) id = 1;
            var face = this.getFaceRes(id);
            parent.addChild(face);
            
            var ani1:Laya.FrameAnimation = face.ani1;
            ani1.play(0,false);
            ani1.once(laya.events.Event.COMPLETE,this,this.onPlayEnd,[face]);
        }
        /**
         * 在指定座位号处显示表情
         * @function
         * @DateTime 2018-03-17T13:55:36+0800
         * @param    {number}                 id        [description]
         * @param    {number}                 localSeat [description]
         */
        public showFace(id:number,localSeat:number):void
        {
            if(localSeat == -1)
                return;
            var temp = this._pos_list[localSeat];
            if(temp == null)
                return;
            var pos:any;
            var b:boolean = false;
            if(temp instanceof Laya.UIComponent)
            {
                b = true;
            }
            else
            {
                pos = {x:temp.x,y:temp.y}
            }
            if(id < 0) id = 1;
            var face = this.getFaceRes(id);
            // else if(id > 17) id = 17;
            
            if(b)
            {
                var tParent:Laya.UIComponent = <Laya.UIComponent>((<Laya.UIComponent>temp).parent);
                face.x = temp.x;
                face.y = temp.y;
                tParent.addChild(face);
            }
            else
            {
                face.x = pos.x;
                face.y = pos.y;
                g_layerMgr.addChild(face);
            }
            
            var ani1:Laya.FrameAnimation = face.ani1;
            ani1.play(0,false);
            ani1.once(laya.events.Event.COMPLETE,this,this.onPlayEnd,[face]);
        }
        private getFaceRes(id:number):any
        {
            var url:string = "qpq/face/Art_face_" + (id+1);        
            var face = utils.tools.createSceneByViewObj(url);           
            face.zOrder = 10;
            return face;
        }
        private onPlayEnd(face:any):void
        {
            console.log("播放完成");
            face.removeSelf();
        }
    }
}
