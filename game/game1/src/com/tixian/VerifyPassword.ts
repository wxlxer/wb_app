import { g_uiMgr } from "../UiMainager";

export default class VerifyPassword extends gamelib.core.Ui_NetHandle
{
    private _txt_input1:Laya.TextInput;
    private _inputValue1:string;
    private _money:number;
    public constructor()
    {
        super('ui.VerifyBankPasswordUI');
    }
    protected init():void
    {
        this._txt_input1 = this._res['txt_input'];
        this.addBtnToListener("btn_ok");
        this.m_closeUiOnSide = false;
    }
    public reciveNetMsg(msg:string,rd:any,data:any):void
    {
        if(msg == gamelib.GameMsg.Moneyout)
        {
            g_uiMgr.closeMiniLoading();
            if(data.retCode == 0)
            {
                this.close();
            }

        }
    }
    public setData(value:number):void
    {
        this._money = value;
    }
    protected onShow():void
    {
        super.onShow();
        this._txt_input1.text = "";
        this._inputValue1 = "";
        this._txt_input1.on(Laya.Event.INPUT,this,this.onInput1);
        
        Laya.stage.on(Laya.Event.KEY_DOWN,this,this.onKeyDown);
        for(var i:number = 0; i < 6; i++)
        {
           this._res['b_input1'].getChildAt(i).getChildAt(0).text = "";
        }
    }
    protected onClose():void
    {
        super.onClose();
        this._txt_input1.off(Laya.Event.INPUT,this,this.onInput1);
        
        Laya.stage.off(Laya.Event.KEY_DOWN,this,this.onKeyDown);
    }
    private onKeyDown(evt:Laya.Event):void
    {
        console.log(evt.keyCode);
        if(evt.keyCode == 8)
        {
            this._inputValue1 = this._inputValue1.slice(0,this._inputValue1.length - 1);
            this.update(this._inputValue1,this._res['b_input1']);
        }
    }
    private onInput1(evt:Laya.Event):void
    {
        this._inputValue1 += this._txt_input1.text
        this._txt_input1.text = "";
        this.update(this._inputValue1,this._res['b_input1']);
    }

    protected onClickObjects(evt:Laya.Event):void
    {
        if(this._money == 0 || isNaN(this._money))
        {
            g_uiMgr.showTip("请输入金额",true);
            return;
        }
        if(this._inputValue1 == "" )
        {
            g_uiMgr.showTip("请输入密码",true);
            return;
        }
        g_uiMgr.showMiniLoading();
       // g_net.requestWithToken(gamelib.GameMsg.Getqkpwd,{qkpwd:this._inputValue1});

       g_net.requestWithToken(gamelib.GameMsg.Moneyout,{qkmoney:this._money,qkpwd:this._inputValue1});
        
    }

    private update(value:string,box:Laya.Box):void
    {
        for(var i:number = 0; i < 6; i++)
        {
            var label:Laya.Label = box.getChildAt(i).getChildAt(0) as Laya.Label;
            label.text =  i >= value.length ? "" : value.charAt(i);
        }
    }
}
