/**
 * Created by wxlan on 2017/9/13.
 */
namespace gamelib.childGame
{
    /**
     * 退出游戏逻辑
     * @class QuitGame
     * @deprecated 
     */
    export class QuitGame
    {
        private _net:ServerDataHander;
        private _callBack:Function;
        private _web:WebDataHander;
        public constructor(web:WebDataHander)
        {
            this._web = web;
            this._net = new gamelib.childGame.ServerDataHander();
        }
        public quitGame(gz_id:number,callBack?:(bSucces:boolean)=>void):void
        {
            console.log("quitGame" + gz_id);
            this._callBack = callBack;
            if(gz_id == GameVar.gz_id)
            {
                var pid:number = GameVar.pid;
                var tgz_id:number = GameVar.gz_id;
                var ts:number = GameVar.ts;
                if(isNaN(ts))
                {
                    ts = Laya.timer.currTimer;
                }
                var url:string = new md5().hex_md5(tgz_id + "762ff77aa3f33ebdc57401b2a31eb88d" + pid + ts)
                sendNetMsg(0x0015,pid,tgz_id,ts,url);
                return;
            }
            this._web.getGameInfo(gz_id,this.onGetGame_zone_info,this);
        }
        private onGetGame_zone_info(ret:any):void
        {
            var obj: any = ret.data;
            if(obj.status != 1)
            {
                console.log("目标分区的登陆信息获取失败!");
                return;
            }
            var host: string;
            host = obj.data["h5s_gamehost"];
            var type:string = "wss";
            if(host == null || host == "" || typeof host == "undefined")
            {
                host = obj.data["h5_gamehost"];
                type = "ws";
            }
            var arr: Array<string> = host.split(":");
            this._net.quitServer(arr[0],arr[1],GameVar.pid,this.quitGameStep3,this,obj.gz_id,type);
        }
        private quitGameStep3(result:any,gz_id:number):void
        {
            console.log("quitGameStep3  " + result);
            if(result == 1)
            {
                if(this._callBack != null)
                    this._callBack.apply(null,[true]);
                if(gz_id == GameVar.gz_id)
                {
                    sendNetMsg(0x0014,1,GameVar.gz_id);
                }
                return;
            }
            if(this._callBack != null)
                this._callBack.apply(null,[false]);
            if(gz_id == GameVar.gz_id)
            {
                console.log("拷贝数据失败,数据异常");
                return;
            }
            console.log("拷贝数据失败,数据异常");
            //this.enterGame(gz_id);
        }
    }
}

