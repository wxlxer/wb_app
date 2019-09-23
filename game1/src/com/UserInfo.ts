import BasePanel from "./BasePanel";
import TabList from "./control/TabList";

export default class UserInfo extends BasePanel
{
    private _tab:TabList;

    private _tab1:Laya.Tab;
    private _info:Info;
    private _touzu:TouZuHistroy
    private _baobiao:Laya.Box;
    private _vip:Laya.Box;

    private _list:Laya.List;

    public constructor()
    {
        super("ui.UserInfoUI");
    }

    protected init():void
    {
        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
                                    {skins:["btns/ic_pc_grxx.png","btns/ic_pc_grxx_pressed.png"]},
                                    {skins:["btns/ic_pc_tzjl.png","btns/ic_pc_tzjl_pressed.png"]},
                                    {skins:["btns/ic_pc_zhmx.png","btns/ic_pc_zhmx_pressed.png"]},
                                    {skins:["btns/ic_pc_grbb.png","btns/ic_pc_grbb_pressed.png"]},
                                    {skins:["btns/ic_pc_vipxq.png","btns/ic_pc_vipxq_pressed.png"]}
                                ];
        this._info = new Info(this._res);
        this._touzu = new TouZuHistroy(this._res);
        this._baobiao = this._res['b_baoBiao'];
        this._vip = this._res['b_vipInfo']                        ;
        // this._tab1 = this._res['tab_2'];    
        // this._tab1.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
        // // this._tab1.on(Laya.Event.CHANGE,this,this.onTabChange);
        // // this._tab.selectHandler
        // this.addBtnToListener('btn_modify');

        // this._info = this._res['b_info']
        // this._touzu = this._res['b_touZhu'];
        

        // this._list = this._res['list_1'];
        // this._list.dataSource = [];
        // this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);

        
    }

    protected onShow():void
    {
        super.onShow();
        this._tab.selectedIndex = 0;
        this.onTabChange(0);
    }
    private onTabChange(index:number):void
    {
        console.log("选中的“：" + index);

        
        if(index == 0)
            this.showInfo();
        else if(index == 1)
            this.showTZJL();
        else if(index == 2)
            this.showGRBB();
        else 
            this.showVIP();
    }
   
    protected showInfo():void
    {
        this._info.show();
        this._touzu.close();
        this._vip.visible = this._baobiao.visible = false;
    }
    protected showTZJL():void
    {
        this._info.close();
        this._touzu.show();
        this._vip.visible = this._baobiao.visible = false;
    }
    protected showGRBB():void
    {
        this._info.close();
        this._touzu.close();
        this._baobiao.visible = true;
        this._vip.visible = false;
    }
    private showVIP():void
    {
        this._info.close();
        this._touzu.close();
        this._baobiao.visible = false;
        this._vip.visible = true;
    }
}

export class Info 
{
    private _box:Laya.Box;
    public constructor(res:any)
    {
        this._box = res['b_info'];
        this._box.visible = false;
    }
    
    public show() :void{
        this._box.visible = true;
    }
    public close() :void{
        this._box.visible = false;
    }
}
export class TouZuHistroy 
{
    private _box:Laya.Box;
    private _tab:TabList;
    private _list:Laya.List;
    public constructor(res:any)
    {
        this._box = res['b_touZhu'];
        this._box.visible = false;
        
        this._tab = new TabList(res['list_tab1']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.dataSource = [
            {label:"棋牌投注记录",colors:["#FFFFFF","#FF00FF"]},
            {label:"视讯投注记录",colors:["#FFFFFF","#FF00FF"]},
            {label:"体育投注记录",colors:["#FFFFFF","#FF00FF"]},
            {label:"电子投注记录",colors:["#FFFFFF","#FF00FF"]},
            {label:"捕鱼投注记录",colors:["#FFFFFF","#FF00FF"]}
        ]

        this._list = res['list_1'];
        this._list.renderHandler = Laya.Handler.create(this,this.onListItemRender,null,false);
    }

    private onTabChange(index:number):void
    {
        console.log(index);
    }
    private onListItemRender(box:Laya.Box,index:number):void
    {

    }
    public show() :void{
        this._box.visible = true;
    }
    public close() :void{
        this._box.visible = false;
    }
}