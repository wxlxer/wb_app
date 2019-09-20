/**
 * Created by wxlan on 2016/10/28.
 */
module gamelib.record
{
    /**
     * 录音播放控件
     */
    export class RecordPlay extends laya.display.Sprite
    {
        private _head:laya.display.Sprite
        private _clip:laya.ui.Clip;
        private _bg:laya.display.Sprite
        private _name:laya.display.Text
        private _canPlay:boolean;
        private _sound_url:string;
        private _playing_sound:laya.media.SoundChannel;
        private _size_head_width:number = 50;
        private _size_head_height:number = 50;

        public constructor()
        {
            super();
            this.init();
        }

        public setData(obj:any):void
        {
            this._sound_url = obj.url;
            var head_url:string = obj.head_url;
            this._name.text = utils.StringUtility.getNameEx(obj.name);
            this._name.y = (this._size_head_height - this._name.height) * 0.5;
            console.log("播放声音文件" + this._size_head_width +"  "+ this._size_head_height);
            this._head.graphics.clear();
            this._head.loadImage(head_url);
            var _length:number = obj.totalLength;
            if(isNaN(_length))           
                _length = 12000;
            g_signal.dispatch('play_audio');
            if(this._canPlay)
            {
                 console.log("播放声音文件1" + head_url);
                if(obj.type == "weixin_audio")
                {
                    console.log("播放声音文件2");
                    if(window["application_weixin_audio_play"])
                    {
                        console.log("播放声音文件3");
                        window["application_weixin_audio_play"](this._sound_url,this.onSoundPlayEnd,this); 
                        this._clip.autoPlay = true;
                    }

                }
                else
                {
                     console.log("开始加载声音文件");
                    this.playSound(this._sound_url);    
                }
            }
            Laya.timer.once(_length,this,this.onSoundPlayEnd);
            Laya.stage.addChild(this);
        }
        public stop():void
        {
            if(this._playing_sound)
                this._playing_sound.stop();
        }
        public isPlaying():boolean
        {
            return this._playing_sound != null;
        }

        /**
         * 声音播放完成
         * @param evt
         */
        private onSoundPlayEnd():void
        {
            console.log("playEnd............");
            Laya.timer.clearAll(this);
            this.removeSelf();
            this.stop();
            this._playing_sound = null;
            g_signal.dispatch("record_playEnd");
            
        }
        private init():void
        {
            this._canPlay = true;
            var tw:number = 206;
            var th:number = this._size_head_height;
            this._bg = new laya.display.Sprite();
            this._bg.graphics.drawRect(0,0,tw,th,"0x000000");
            this._bg.alpha = 0.6;
            this.addChild(this._bg);

            this._head = new laya.display.Sprite();
            this._head.width = this._size_head_width;
            this._head.height = this._size_head_height;
            this.addChild(this._head);
            this._head.mouseEnabled = false;

            this._clip = new laya.ui.Clip();
            this._clip.skin = "qpq/chat/clip_laba.png";
            this._clip.clipX = 1;
            this._clip.clipY = 4;
            this.addChild(this._clip);
            this._clip.mouseEnabled = true;
            this._clip.x = this._size_head_width - this._clip.width;
            this._clip.y = this._size_head_height - this._clip.height;

            this._name = new laya.display.Text();
            this._name.fontSize = 18;
            this._name.color = "#efebe5";
            this.addChild(this._name);
            this._name.mouseEnabled = false;
            this._name.x = this._size_head_width;

            this.mouseEnabled = true;

            this.on(laya.events.Event.CLICK,this,this.onClickIcon);
        }
        private onClickIcon(evt:laya.events.Event):void
        {
            this._canPlay = !this._canPlay;
            if(!this._canPlay)
            {
                this.stopClip();
                this._clip.index = 3;
                if(this._playing_sound)
                {
                    this._playing_sound.pause();
                    this.timer.once(1000,this,this.onSoundPlayEnd);
                }

            }
            else
            {
                this.timer.clear(this,this.onSoundPlayEnd);
                if(this._playing_sound)
                {
                    this._playing_sound.resume();
                }
                else
                {
                    this.playSound(this._sound_url);
                }
            }
        }

        private playSound(url:string):void
        {
            if(utils.tools.isAndroid())
            {
                url = url.replace('.mp3','.ogg');
            }
            try
            {
                this._playing_sound = laya.media.SoundManager.playSound(url,1,Laya.Handler.create(this,this.onSoundPlayEnd));
                this.playClip();
            }
            catch(e)
            {                
                this.onSoundPlayEnd();
            }
        }
        private playClip():void
        {
            var index:number = this._clip.index;
            if(index >= this._clip.clipY - 2)
            {
                index = 0;
            }
            else
            {
                index ++;
            }
            this._clip.index = index;
            Laya.timer.once(300,this,this.playClip);
        }
        private stopClip():void
        {
            this._clip.index = 0;
            Laya.timer.clear(this,this.playClip);
        }

    }
}
