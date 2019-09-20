module gamelib.common.moregame 
{
    export var loaders:any;

    export var _watchers:any;

    export var _loading:PreLoad;

    export const UPDATE:string = "on_update";
    export const COMPLETE:string = "on_complete";
    /**
     * 检查缓存组件是否可用
     * */         
    export function checkLoaderValid():boolean
    {
        return window['application_check_game_cache'] != null;
    }


    /**
     * 开始缓存指定游戏
     * @param {number} gz_id [description]
     */
    export function startLoad(gz_id:number):void 
    {
        console.log("init loader "+gz_id+"...");
        if(s_debug || checkLoaderValid()) 
        {
            loaders = loaders || {};
            if(_loading)
            {
                _loading.stopUpdate = true;
            }
            if(!loaders[gz_id]) 
            {
                _loading = new PreLoad(gz_id);
                loaders[gz_id] = _loading;
                _loading.onCacheUpdate();
                console.log("    success:new loader started");
             } 
             else
             {
                _loading = loaders[gz_id];
                _loading.stopUpdate = false;
                console.log("    success:game loader exist");
             }
         } else {
             console.log("    fail:loader not available");
         }
     }

     export function addWatch(type:string,onHandle:Function,thisArg:any):void
     {
         _watchers = _watchers || {};
         _watchers[type] = _watchers[type] || [];
         _watchers[type].push({onHandle:onHandle,thisArg:thisArg});
     }

    export function removeWatch(type:string,onHandle:Function,thisArg:any):void
    {
        if(!_watchers) {
             return;
         }
         if(!_watchers[type]) {
             return;
         }
         var watchers:any[] = this._watchers[type];
         for(var i:number = 0;i < watchers.length; i++) {
             if(watchers[i].onHandle == onHandle) {
                 watchers.splice(i,1);
                 break;
             }
         }
    }

    export function updateProcess(loader:PreLoad) :void
    {
        dispatch(UPDATE,loader);
    }
    export function onLoaded(loader:PreLoad):void
    {
        dispatch(COMPLETE,loader);
        loaders[loader.gz_id] = null;
        delete  loaders[loader.gz_id];
     }
    export function dispatch(type:string,loader:PreLoad):void
    {
        if(_watchers && _watchers[type]) {
            var watchers:any[] = _watchers[type];
            for(var i:number = 0;i < watchers.length; i++) {
                watchers[i].onHandle.call(watchers[i].thisArg,loader);
            }
        }
    }

    export class PreLoad 
    {
        public loaded:boolean=false;
        public gz_id:number;
        private _load:any;
        private intervalIndex:number;
        private _stop:boolean = false;
        private _lastCheck:number;
        public constructor(id:number) 
        {
             this.gz_id = id;
             this._lastCheck = 0;
             this._load = window['application_check_game_cache'](id, this.onCacheComplete,this);
             this.intervalIndex = setInterval(this.onCacheUpdate.bind(this), 100);
         }
         private onCacheComplete():void 
         {
             this.loaded = true;
             this._lastCheck = 100;
             clearInterval(this.intervalIndex);
             if(!this._stop)
             {
                 onLoaded(this);
             }
         }
         get curValue():number {
             return this._lastCheck/100;
         }
         toPercent():string {
             if(this._lastCheck == 0)
                 return "";
             var back:string = this._lastCheck+"";
             return back;
         }
         
         get stopUpdate():boolean {
             return this._stop;
         }
         set stopUpdate(value:boolean) {
             if(this._stop != value) {
                 this._stop = value;
                 if(value) {
                     clearInterval(this.intervalIndex);
                 } else {
                     this.intervalIndex = setInterval(this.onCacheUpdate.bind(this), 100);
                 }
             }
         }
         
         onCacheUpdate():void {
             if(!this._load || !window['application_check_game_cache'] || this.stopUpdate) {
                 return;
             }
             var curPercent:number = this._load.get_download_percent();
             this._lastCheck = curPercent;
             updateProcess(this);
             // if(this.loaded) {
             //     this.onCacheComplete();
             // }
         }
     }
 }
