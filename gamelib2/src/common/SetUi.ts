/**
 * Created by wxlan on 2016/6/22.
 */
module gamelib.control {
    
    /**
     * 设置界面
     * @class SetUi
     */
    export class SetUi extends gamelib.core.BaseUi
    {
        private _help_btn:laya.ui.Button;
        private _sound:laya.ui.CheckBox;
        private _music: laya.ui.CheckBox;
        private _logout:Laya.Button;
        private _version_txt:laya.ui.Label;
        private _saveFunction:Function;
        private _hideHelpBtnInHall:boolean;         //在大厅是否隐藏帮助按钮
        private _version:number = -1;
        private _houtai:Laya.Button;            //后台按钮
        private _lan:Laya.ComboBox;               //语言按钮

        private _radio:Laya.RadioGroup;         //语音组;

        private _oldLan:number;
        public get help_btn():laya.ui.Button
        {
            return this._help_btn;
        }

        public constructor(saveFunction?:Function,hideHelpBtnInHall:boolean = false,url:string ="qpq/Art_CustomSet")
        {
            super(url);
            this._saveFunction = saveFunction;
            this._hideHelpBtnInHall = hideHelpBtnInHall;
        }
        public init():void
        {
            this._res.isModal = true;
            this._help_btn = this._res["btn_2"];
            this._logout = this._res['btn_logout']
            this._sound = this._res["checkBox_1"];
            this._music = this._res["checkBox_2"];
            this._radio = this._res['radio'];
            this._houtai = this._res['btn_houtai'];
            this._lan  = this._res["btn_lan"];
            this._version_txt = this._res["txt_version"];
            if(this._help_btn)
            {
                this._clickEventObjects.push(this._help_btn);
                this._help_btn.visible = false;
            }
            if(this._lan)
            {
                this._lan.itemSize = 36;
                this._lan.labelSize = 34;
                this._lan.labelColors = "#ffffff,#9a9a9a,#9a9a9a,#9a9a9a";
                this._lan.itemColors = "#373735,#9a9a9a,#ffffff,#232321,#c3c3c3";
                this._lan.labelPadding = "0,0,0,10";
                
                this._excepts.push(this._lan);
            }
            if(this._logout)
                this._clickEventObjects.push(this._logout);
            this._clickEventObjects.push(this._sound);
            this._clickEventObjects.push(this._music);
            this.addBtnToListener("btn_gonggao");
            
            if(this._houtai)
                this._clickEventObjects.push(this._houtai);
                    
            this._noticeOther = true;

            if(this._res["txt_tips1"] && this._res["txt_tips2"])
            {
                this._res["txt_tips1"].text = this._res["txt_tips2"].text = "";   
                
            }
            
        }
        protected onShow():void
        {
            super.onShow();
            var ver:any = g_gamesInfo.getGameVersion(GameVar.game_code);
            if(typeof (ver) == "number"){                
                this._version = ver / 100;
                this._version_txt.text = getDesByLan("版本") + ":" + this._version.toFixed(2);
            }
            else
                this._version_txt.text = getDesByLan("版本") + ":" + ver;            
            this._sound.selected = g_net_configData.getConfig("sound");
            this._music.selected = g_net_configData.getConfig("music");
            if(this._radio)
            {
                this._radio.on(Laya.Event.CHANGE,this,this.onChange);

                var sub_sound:number = g_net_configData.getConfig("sub_sound");
                if(isNaN(sub_sound))
                    sub_sound = 1;
                this._radio.selectedIndex = sub_sound;

                this._radio.disabled = !this._sound.selected
            }
            if(this._lan)
            {
                this._lan.on(Laya.Event.CHANGE,this,this.onChangeLan);
                var lan:string = gamelib.Api.getLocalStorage("lan") || GameVar.g_platformData["multiple_lans"][0];
                
                this._lan.selectedIndex = lan == "zh" ? 0 : 1;
                //this._lan.selectedLabel = this._lan.labels.split(",")[this._lan.selectedIndex];
                this._lan.button.label = this._lan.labels.split(",")[this._lan.selectedIndex];
                this._oldLan = this._lan.selectedIndex;
            }
            
        }
        protected onClose():void
        {
            super.onClose();
            if(this._radio)
            {
                this._radio.off(Laya.Event.CHANGE,this,this.onChange);
            }
            if(this._lan)
            {
                this._lan.off(Laya.Event.CHANGE,this,this.onChangeLan);
                
                if(this._oldLan != this._lan.selectedIndex)
                {
                    var lan:string = this._lan.selectedIndex == 0 ? "zh":"en";
                    gamelib.Api.saveLocalStorage("lan",lan);
                    //通知服务器和平台
                    sendNetMsg(0x001D,2,lan);
                    g_signal.dispatch(gamelib.GameMsg.CHANGELAN,lan);
                    gamelib.Api.modfiyAttByInterface("/platform/setlanguage",{"language":lan},Laya.Handler.create(this,function()
                    {
                        g_signal.dispatch(gamelib.GameMsg.REFRESHPLATFORMDATA,0);
                    }));
                    
                }
            }
        }
        private onChange(evt:laya.events.Event):void
        {
            this.save();

        }
        private onChangeLan(evt:laya.events.Event):void
        {
            //g_net_configData.addConfig("lan",this._lan.selectedIndex == 0 ? "zh":"en");

        }
        protected onClickObjects(evt:laya.events.Event):void{
            playButtonSound();
            switch (evt.currentTarget)
            {
                case this._sound:
                case this._music:
                    if(this._radio)
                        this._radio.disabled = !this._sound.selected
                    this.save();
                    if(evt.currentTarget == this._sound)
                    {
                        gamelib.Api.ApplicationEventNotify('set_sound',this._sound.selected ? "打开" : "关闭");
                    }
                    else
                    {
                         gamelib.Api.ApplicationEventNotify('set_music',this._music.selected ? "打开" : "关闭");   
                    }
                    break;
                case this._help_btn:
                    g_signal.dispatch("showHelpUi",0);
                    this.close();
                    break;
                case this._logout:
                    if(gamelib.data.UserInfo.s_self.m_roomId != 0)
                    {
                        g_uiMgr.showAlertUiByArgs({msg:getDesByLan("请退回大厅后再操作")})
                        return;
                    }
                    if(window['application_logout'])
                    {
                        window['application_logout']();
                    }
                    break; 
                case this._houtai:    //打开后台
                    if(window['qpq'] && window['qpq']['openVipPage'])
                    {
                         window['qpq']['openVipPage'](GameVar.g_platformData['ignoreCheckVip']);
                    }
                    break;

            }
            if(evt.currentTarget.name == "btn_gonggao")
            {
                g_signal.dispatch("showNoticeUi",0);
            }
        }
        private save():void
        {
            g_net_configData.addConfigByType(0,this._sound.selected);
            g_net_configData.addConfigByType(1,this._music.selected);
            if(this._radio)
            {
                 var sub_sound:number = this._radio.selectedIndex;
                 g_net_configData.addConfigByType(2,sub_sound);
            }
            else
            {
                g_net_configData.addConfigByType(2,0);
            }
            
            g_net_configData.saveConfig();
            if(this._saveFunction)
                this._saveFunction.call(this);;
        }
    }
}