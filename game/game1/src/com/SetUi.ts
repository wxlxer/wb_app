import { g_playerData } from "./data/PlayerData";
import { g_uiMgr } from "./UiMainager";

export default class SetUi extends gamelib.core.Ui_NetHandle
{
    private _tab:Laya.Tab;

    private _items:Array<any>;
    public constructor()
    {
        super("ui.SetUiUI");
    }
    protected init():void
    {
        this.addBtnToListener("btn_ok");
        this.addBtnToListener("btn_logout");
        this.addBtnToListener("btn_gx");
        
        this._tab = this._res['tab_1'];
        this._items = this._tab.items.concat();
        this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
    }
    protected onShow():void
    {
        super.onShow();
        var temp:Array<any> = this._tab.items.concat();
        for(var item of temp)
        {
            this._tab.delItem(item);
        }
        if(!GameVar.s_token)    //未登录
        {            
            this._tab.addItem(this._items[0],true);
            this._tab.addItem(this._items[2],true);
        }
        else
        {
            this._tab.addItem(this._items[0],true);
            this._tab.addItem(this._items[1],true);
            this._tab.addItem(this._items[2],true);
        }
        this._res['b_info'].visible = GameVar.s_token;
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_ok":  //修改
                this.onModify();
                break;
            case "btn_logout":  //退出登录
            var _self = this;
                g_uiMgr.showAlertUiByArgs({
                    msg:"确定要退出登录吗?",
                    callBack:function (type:number) {
                        if(type == 0)
                        {
                            g_uiMgr.showMiniLoading();
                            g_net.requestWithToken(gamelib.GameMsg.Logout,{username:g_playerData.m_userName});
                            _self.close();
                        }   
                    },
                    type:1
                })
               
                break;
            case "btn_gx":  //更新

                break;
        }
    }
    private onModify():void
    {
        var old:string = this._res['txt_oldPwd'].text;
        var new1:string = this._res['txt_newPwd'].text;
        var new2:string = this._res['txt_newPwd1'].text;
        if(old == ""){
            g_uiMgr.showTip("请输入旧密码",true);
            return;
        }
        if(new1 == ""){
            g_uiMgr.showTip("请输入您的新密码",true);
            return;
        }
        if(new1 != new2){
            g_uiMgr.showTip("您两次输入的密码不一样",true);
            return;
        }
        g_uiMgr.showMiniLoading();
        g_net.requestWithToken(gamelib.GameMsg.Updatepwd,{pass:old,npass:new1,par:"login"});
        this._res['txt_oldPwd'].text = this._res['txt_newPwd'].text = this._res['txt_newPwd1'].text = ""
            
    }
    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showSound();
        else if(index == 1)
        {
            if(GameVar.s_token)
                this.showPWD();
            else
                this.showAPP();
        }    
        else
        {
            this.showAPP();
        }
    }
    private showSound():void
    {
        this._res['b_sound'].visible = true;
        this._res['b_pwd'].visible = false;
        this._res['b_app'].visible = false;
    }
    private showPWD():void
    {
        this._res['b_sound'].visible = false;
        this._res['b_pwd'].visible = true;
        this._res['b_app'].visible = false;
    }
    private showAPP():void
    {
        this._res['b_sound'].visible = false;
        this._res['b_pwd'].visible = false;
        this._res['b_app'].visible = true;
        this._res['txt_app_version'].text = "当前已经是最新版本";
    }
}