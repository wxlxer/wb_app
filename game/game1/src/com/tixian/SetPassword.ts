import { g_uiMgr } from "../UiMainager";

export default class SetPassword extends gamelib.core.BaseUi
{
    private _txt_input1:Laya.TextInput;
    private _txt_input2:Laya.TextInput;
    private _inputValue1:string;
    private _inputValue2:string;
    private _currentIndex:number = 0;
    public constructor()
    {
        super('ui.SetBankPasswordUI');
    }
    protected init():void
    {
        this._txt_input1 = this._res['txt_input1'];
        this._txt_input2 = this._res['txt_input2'];
        this.addBtnToListener("btn_ok");
        this.m_closeUiOnSide = false;
    }

    protected onShow():void
    {
        super.onShow();
        this._txt_input1.text = this._txt_input2.text = "";
        this._inputValue1 = this._inputValue2 = "";
        this._txt_input1.on(Laya.Event.INPUT,this,this.onInput1);
        this._txt_input2.on(Laya.Event.INPUT,this,this.onInput2);
        this._txt_input1.on(Laya.Event.FOCUS,this,this.onFocusChange);
        this._txt_input2.on(Laya.Event.FOCUS,this,this.onFocusChange);
        
        Laya.stage.on(Laya.Event.KEY_DOWN,this,this.onKeyDown);
        for(var i:number = 0; i < 6; i++)
        {
           this._res['b_input1'].getChildAt(i).getChildAt(0).text = "";
           this._res['b_input2'].getChildAt(i).getChildAt(0).text = "";
        }
    }
    protected onClose():void
    {
        super.onClose();
        this._txt_input1.off(Laya.Event.INPUT,this,this.onInput1);
        this._txt_input2.off(Laya.Event.INPUT,this,this.onInput2);
        this._txt_input1.off(Laya.Event.FOCUS,this,this.onFocusChange);
        this._txt_input2.off(Laya.Event.FOCUS,this,this.onFocusChange);
        
        Laya.stage.off(Laya.Event.KEY_DOWN,this,this.onKeyDown);
    }
    private onKeyDown(evt:Laya.Event):void
    {
        console.log(evt.keyCode);
        if(evt.keyCode == 8)
        {
            if(this._currentIndex == 0)
                return;
            var str:string = this['_inputValue' + this._currentIndex] ;
            str = str.slice(0,str.length - 1);
            this['_inputValue' + this._currentIndex] = str;
            this.update(str,this._res['b_input' + this._currentIndex]);
        }
    }
    private onFocusChange(txt:Laya.TextInput):void
    {
        this._currentIndex = txt == this._txt_input1 ? 1 : 2;
    }
    private onInput1(evt:Laya.Event):void
    {
        this._currentIndex = 1;
        this._inputValue1 += this._txt_input1.text
        this._txt_input1.text = "";
        this.update(this._inputValue1,this._res['b_input1']);
    }
    private onInput2(evt:Laya.Event):void
    {
        this._currentIndex = 2;
        this._inputValue2 += this._txt_input2.text
        this._txt_input2.text = "";
        this.update(this._inputValue2,this._res['b_input2']);
    }

    protected onClickObjects(evt:Laya.Event):void
    {
        if(this._inputValue1 == "" || this._inputValue2 == "")
        {
            g_uiMgr.showTip("请输入密码",true);
            return;
        }
        if(this._inputValue1 != this._inputValue2)
        {
            g_uiMgr.showTip("两次的密码必须一样",true);
            return;
        }
        g_net.requestWithToken(gamelib.GameMsg.Qkpassword,{qkpassword:this._inputValue1});
        this.close();
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
