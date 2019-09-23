import ChongZhiHistroy from "./ChongZhiHistroy";
import BasePanel from "../BasePanel";


export default class ChongZhi extends BasePanel
{
    private _tab:Laya.Tab;


    private _histroy:ChongZhiHistroy;


    private _btn:Laya.Button;
    public constructor()
    {
        super("ui.ChongZhiUiUI");
    }

    protected init():void
    {
        this._tab = this._res['tab_1'];
        this._tab.selectHandler = Laya.Handler.create(this,this.onTabChange,null,false);
        

        this.addBtnToListener("btn_sx");
        this.addBtnToListener("btn_histroy");
        this.addBtnToListener("btn_clear");
        this.addBtnToListener("btn_goCz");
        this.addBtnToListener("btn_prev");
        this.addBtnToListener("btn_tjcz");

        // this._list = this._res['list_1'];
        // this._list.dataSource = [];
        // this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);

        for(var i:number = 1; i <= 8 ;i ++)
        {
            var btn:Laya.Button = this._res['btn_' + i];
            btn.name = 'btn_' + i;
            btn.on(Laya.Event.CLICK,this,this.onClickBtns);
        }

        this._btn = null;
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
            this.showBank();
        else if(index == 1)
            this.showChongZhi("zfb");
        else
            this.showChongZhi("wx");
    }

    // private onItemRender(box:Laya.Box,index:number):void
    // {

    // }
    protected showBank():void
    {
        this._res['b_bank'].visible = true;
        this._res['b_zfb'].visible = false;

        this._res['b_tips'].visible = true;
        this._res['b_input'].visible = false;
    }
    protected showChongZhi(value:string):void
    {
        this._res['b_zfb'].visible = true;
        this._res['b_bank'].visible = false;
        if(this._btn)
        {
            this._btn.selected = false;            
        }
        this._res['txt_input'].text = "";
    }
    protected onClickObjects(evt:Laya.Event):void
    {
        switch(evt.currentTarget.name)
        {
            case "btn_sx"://刷新
                
                break;
            case "btn_histroy": //充值历史
                this._histroy = this._histroy || new ChongZhiHistroy();
                this._histroy.show();
                break;
            case "btn_clear":
                this._res['txt_input'].text = "";
                break;
            case "btn_goCz": 
                this._res['b_tips'].visible = false;
                this._res['b_input'].visible = true;
                break;    
            case "btn_prev":
                this._res['b_tips'].visible = true;
                this._res['b_input'].visible = false;
                break;
            case "btn_tjcz":
                this.goChongZhi(this._tab.selectedIndex,parseInt(this._res['txt_input'].text))
                break;
        }
    }
    private goChongZhi(type:number,money:number):void
    {
        console.log("前去充值" + (this._tab.selectedIndex == 1? "支付宝" : "微信充值") +" " + money);
    }

    private onClickBtns(evt:Laya.Event):void
    {
        if(this._btn)
        {
            this._btn.selected = false;
        }
        this._btn = <Laya.Button>evt.currentTarget;
        this._res['txt_input'].text = (<Laya.Label>this._btn.getChildAt(0)).text;
    }

}