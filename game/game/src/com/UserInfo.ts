import BasePanel from "./BasePanel";

export default class UserInfo extends BasePanel
{
    private _tab:Laya.Tab;

    private _tab1:Laya.Tab;
    private _info:Laya.Box;
    private _touzu:Laya.Box;
    private _baobiao:Laya.Box;

    private _list:Laya.List;
    public constructor()
    {
        super("ui.UserInfoUI");
    }

    protected init():void
    {
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange1,null,false);
        
        this._tab1 = this._res['tab_2'];    
        this._tab1.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
        // this._tab1.on(Laya.Event.CHANGE,this,this.onTabChange);
        // this._tab.selectHandler
        this.addBtnToListener('btn_modify');

        this._info = this._res['b_info']
        this._touzu = this._res['b_touZhu'];
        this._baobiao = this._res['b_baoBiao'];

        this._list = this._res['list_1'];
        this._list.dataSource = [];
        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
    }

    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    }

    private onTabChange(index:number):void
    {
        if(index == 0)
            this.showInfo();
        else if(index == 1)
            this.showTZJL();
        else
            this.showGRBB();
    }
    private onTabChange1(index:number):void
    {

    }
    private onItemRender(box:Laya.Box,index:number):void
    {

    }
    protected showInfo():void
    {
        this._info.visible = true;
        this._baobiao.visible = false;
        this._touzu.visible = false;
    }
    protected showTZJL():void
    {
        this._info.visible = false;
        this._baobiao.visible = false;
        this._touzu.visible = true;
        
        this._res['txt_tips'].visible = this._list.dataSource.length == 0;
    }
    protected showGRBB():void
    {
        this._info.visible = false;
        this._baobiao.visible = true;
        this._touzu.visible = false;
    }
}