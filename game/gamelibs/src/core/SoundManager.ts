/**
 * Created by wxlan on 2017/9/11.
 */
namespace gamelib.core
{
    /**
     * @class
     * 声音管理器
     */
    export class SoundManager
    {
        private _bgmList:any;

        public m_lastBgmPlayTime:number;
        public _waitConfig:boolean = true;
        private _bSound:boolean;
        private _bMusic:boolean;
        private _type:string = "";
        private _bgmSoundChannel:Laya.SoundChannel;
        public constructor()
        {
            this._type = '.mp3';
            // if(utils.tools.isAndroid() || utils.tools.isRuntime())
            // {
            //     this._type = '.ogg';
            // }
            laya.media.SoundManager.autoStopMusic = true;
        }
        /**
         * 是否开启音效
         * @DateTime 2018-03-16T14:09:26+0800
         * @type    {boolean}
         */
        public set m_sound(value:boolean)
        {
            this._bSound = value;
        }
        public get m_sound():boolean
        {
            return this._bSound;
        }
        /**
         * 是否开启背景音乐
         * @DateTime 2018-03-16T14:10:12+0800
         * @type    {boolean} 
         */
        public set m_music(value:boolean)
        {
            this._bMusic = value;
            if(value)
            {
                if(laya.media.SoundManager.musicMuted)
                    laya.media.SoundManager.musicMuted = false;
                if(!this._waitConfig){
                    if(this._bgmSoundChannel)
                        this._bgmSoundChannel.resume();
                    else if(this._bgmList) 
                        this.playBgm(this._bgmList)
                }
                 
            }
            else
            {
                if(!laya.media.SoundManager.musicMuted)
                    laya.media.SoundManager.musicMuted = true;
                laya.media.SoundManager.musicVolume = 0.8;
            }
        }
        public get m_music():boolean
        {
            return this._bMusic;
        }
        /**
         * 背景音乐音量小 在录音的时候会用
         * @function
         * @DateTime 2018-03-16T14:10:33+0800
         */
        public volume_normal():void
        {
            laya.media.SoundManager.setMusicVolume(0.8);
            // laya.media.SoundManager.musicVolume = 0.8;
        }
        /**
         * 背景音乐音量恢复正常
         * @function
         * @DateTime 2018-03-16T14:11:22+0800
         */
        public volume_small():void
        {
            laya.media.SoundManager.setMusicVolume(0);
            // laya.media.SoundManager.musicVolume = 0;
        }
        
        /**
         * 播放声音
         * @function
         * @DateTime 2018-03-16T14:11:59+0800
         * @param    {string}  name     声音文件名。如button
         * @param    {number}  loops    播放次数，默认播1次，0为循环播放
         * @param    {laya.utils.Handler}     complete 播放完成后的回掉
         */
        public playSound(name:string,loops:number = 1,complete?:laya.utils.Handler,isCommon:boolean  = false):void
        {
            if(!this._bSound)    return;
            // var url:string = GameVar.resource_path +"resource";
            // if(isCommon)
            // {
            //     url += "/qpq/sound/";
            // }
            // else
            // {
            //     url += "/" + GameVar.s_namespace + "/sound/";
            // }
            // // url += name + this._type + g_game_ver_str;            
            // url = g_gamesInfo.getUrlContainVersionInfo(url + name + this._type);
            // laya.media.SoundManager.playSound(url,loops,complete);
        }
        /**
         * 停止播放
         * @function
         * @DateTime 2018-03-16T14:13:41+0800
         * @param    {string}                 name [description]
         */
        public stopSound(name:string,isCommon:boolean  = false):void
        {
            // var url:string = GameVar.resource_path +"resource";
            // if(isCommon)
            // {
            //     url += "/qpq/sound/";
            // }
            // else
            // {
            //     url += "/" + GameVar.s_namespace + "/sound/";
            // }
            // // url += name + this._type + g_game_ver_str;   
            // url = g_gamesInfo.getUrlContainVersionInfo(url + name + this._type);
            // laya.media.SoundManager.stopSound(url);
        }
        /**
         * 当前是否在等待配置文件
         * @DateTime 2018-03-16T14:14:09+0800
         * @type {boolean}
         */
        public get m_waitConfig():boolean{
            return this._waitConfig;
        }
        public set m_waitConfig(value:boolean)
        {
            // if(this._waitConfig && !value)
            // {
            //     this._waitConfig = value;
            //     if(this._bgmList != null)
            //     {
            //         this.playBgm(this._bgmList);
            //     }
            // }
            this._waitConfig = value;
        }

        /**
         * 播放背景音乐
         * @function
         * @param {any} index 如果为number，播放指定的序号。如果为array,则循环播放列表中的
         */
        public playBgm(name:any):void
        {
            if(this.m_waitConfig)
            {
                this._bgmList = name;
                return;
            }
            this._bgmList = name;
            if(name == "")
            {
                laya.media.SoundManager.stopMusic();
                return;
            }
            this.m_lastBgmPlayTime = Laya.timer.currTimer;
            if(this._bgmSoundChannel)
                this._bgmSoundChannel.completeHandler = null;
            this._bgmSoundChannel = laya.media.SoundManager.playMusic(this.getBgmUrl(0),1,Laya.Handler.create(this,this.onBgmPlayEnd,[0]));
            //  return;
            // if(typeof name === 'string')
            // {
            //     laya.media.SoundManager.playMusic(this.getBgmUrl(0),0);
                
            // }            
            // else
            // {
            //     laya.media.SoundManager.playMusic(this.getBgmUrl(0),1,Laya.Handler.create(this,this.onBgmPlayEnd,[0]));
            // }

        }
        /**
         * 暂停背景音乐
         * @function
         * @DateTime 2018-03-16T14:15:35+0800
         * @deprecated 使用laya.media.SoundManager.autoStopMusic 来代替了
         */
        public pauseAll():void
        {
            if(this.m_music)
                laya.media.SoundManager.musicMuted = true;
        }
        /**
         * 恢复背景音乐
         * @function
         * @DateTime 2018-03-16T14:15:55+0800
         * @deprecated 使用laya.media.SoundManager.autoStopMusic 来代替了
         */
        public resumesAll():void
        {
            if(this.m_music)
                laya.media.SoundManager.musicMuted = false;
        }

        /**
         * 背景音乐播放完成
         * @function
         * @DateTime 2018-03-16T14:19:04+0800
         * @param    {number}                 index [description]
         */
        private onBgmPlayEnd(index:number):void
        {
            console.log("播放背景音乐");
            index ++;
            if(this._bgmSoundChannel)
                this._bgmSoundChannel.completeHandler = null;
            this._bgmSoundChannel = laya.media.SoundManager.playMusic(this.getBgmUrl(index),1,Laya.Handler.create(this,this.onBgmPlayEnd,[index]));
            
            this.m_lastBgmPlayTime = Laya.timer.currTimer;
        }
        /**
         * 获得背景音乐的资源地址
         * @function
         * @DateTime 2018-03-16T14:19:16+0800
         * @param    {number}                 index [description]
         * @return   {string}                       [description]
         */
        private getBgmUrl(index:number):string
        {
            // if(typeof this._bgmList === "string")
            // {
            //     return GameVar.resource_path + "resource/" + GameVar.s_namespace + "/sound/" + this._bgmList + this._type;
            // }
            // if(index < 0 || index >= this._bgmList.length) index = 0;
            // return GameVar.resource_path  + "resource/" + GameVar.s_namespace + "/sound/" +  this._bgmList[index] + this._type;
            return "";

        }
    }
}
