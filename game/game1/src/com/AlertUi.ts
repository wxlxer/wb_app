
/**
 * @class AlertUi
 * 游戏通用提示框。资源是用的ui.common.Art_CustomTipsUI如果游戏没有，则使用的是qpq中资源
 * @author wx
 * @extends gamelib.core.BaseUi
 * @uses TipManager
 */
export default class AlertUi extends gamelib.core.BaseUi
{
    protected btn_cancel:laya.ui.Button;		//取消
    protected btn_ok:laya.ui.Button;		//确定
    protected txt_tips:laya.ui.TextArea;
    protected _callBack:Function;
    protected _thisObj:any;
    private _oldAtts:any;
    private width:number;
    public constructor()
    {
        super("ui.AlertUI");
    }
    protected init():void
    {
        super.init();
        this.btn_ok = this._res["btn_ok"];
        this.btn_cancel = this._res["btn_cancel"];
        this.txt_tips = this._res["txt_txt"];
        this.width = this._res.width;
        this._oldAtts = {};
        this._oldAtts.okPos = this.btn_ok.x;
        this._oldAtts.cancelPos = this.btn_cancel.x;

        this._clickEventObjects.push(this.btn_ok);
        this._clickEventObjects.push(this.btn_cancel);
        this._noticeOther = false;
        this.m_closeUiOnSide = false;
        this.m_layer = 10;
        this._isModal = true;
    }

    /**
     * @function setData
     * @author wx
     * @DateTime 2018-03-15
     * @param  {any}  params 一个对象。包含
     * msg：提示文本
     * type : 0：只有确定按钮，1：确定和取消按钮,2:确定，取消，关闭按钮都有 3，三个按钮都没有 4:确定按钮和关闭按钮
     * callBack : 回掉方法 callback(type:number); ,0:确定，1:关闭按钮，2：取消按钮
     * autoCall:自动关闭的时间（秒），0：不自动关闭,否则会在确定按钮上显示倒计时
     * okLabel:确定按钮文本
     * cancelLabel：取消按钮的文本
     */
    public setData(params:any)
    {
        this.txt_tips.text = params.msg;
        this.txt_tips.align = "center";
        this.txt_tips.valign = "middle";
        this.txt_tips.editable = false;
        this.txt_tips.mouseEnabled = false;
        //this.txt_title.text = "";
        this._callBack = params.callBack;
        this._thisObj = params.thisObj;
        var autoCall:number = params.autoCall;

        if(params.type == 0)
        {
            
            this.btn_ok.visible = true;
            this.btn_ok.x = (this.width - this.btn_ok.width) / 2;
            this.btn_cancel.visible = this.btn_close.visible = false;
        }
        else if(params.type == 1)
        {
            this.btn_cancel.visible = this.btn_ok.visible = true;
            this.btn_ok.x = this._oldAtts.okPos;
            this.btn_cancel.x = this._oldAtts.cancelPos;
            this.btn_close.visible = false;
        }
        else if(params.type == 2)
        {
            this.btn_cancel.visible =this.btn_close.visible = this.btn_ok.visible = true;
            this.btn_ok.x = this._oldAtts.okPos;
            this.btn_cancel.x = this._oldAtts.cancelPos;
        }
        else if(params.type == 3)
        {
            this.btn_cancel.visible = this.btn_ok.visible = this.btn_close.visible = false;
        }
        else if(params.type == 4)
        {
            this.btn_cancel.visible = false;
            this.btn_ok.x = (this.width - this.btn_ok.width) / 2;
        }
        this.btn_ok.mouseEnabled = this.btn_ok.visible;
    }
   
    public onClose():void
    {
        super.onClose();
    }
    protected onClickObjects(evt:laya.events.Event):void
    {
        playButtonSound();
        if(evt.currentTarget == this.btn_ok)
        {
            if(this._callBack)
            {
                this._callBack.call(this._thisObj,0);
            }

        }
        else if(evt.currentTarget == this.btn_cancel)
        {
            if(this._callBack)
                this._callBack.call(this._thisObj,2);
        }
        this.close();
    }
    protected onClickCloseBtn(evt:laya.events.Event):void
    {
        super.onClickCloseBtn(evt);
        if(this._callBack)
        {
            this._callBack.call(this._thisObj,1);
        }
    }
}