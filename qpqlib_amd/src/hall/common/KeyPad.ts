module qpq.hall
{
    export class KeyPad extends gamelib.core.BaseUi
    {
        protected _defaultInput:string
        protected _inputVec:Array<number|string>;
        protected _checkLength:number;
        protected _text_input:laya.ui.Label;
        public constructor(str:string = "qpq/Art_Keyboard")
        {
            super(str);
        }
        protected init():void
        {
            this._defaultInput =  getDesByLan("输入房号");
            this._checkLength = 6;
            this._text_input = this._res["txt_input"];
            this._text_input.text = this._defaultInput;
            for(var i:number = 0; i < 10;i++)
            {
                var btn = this._res["btn_" + i];
                btn.name = i;
                this._clickEventObjects.push(btn);
            }
            this.addBtnToListener("btn_back");
            this.addBtnToListener("btn_clear");
            this._noticeOther = true;
        }
        protected onShow():void
        {
            this.clearInput();
        }
        public onClose():void {
            //this.visible = false;
            //this.btnEnabled = false;
        }
        protected onClickCloseBtn(evt:laya.events.Event):void
        {
            this.close();
            playSound_qipai("close");
        }
        protected onClickObjects(evt:laya.events.Event):void {
            var keyName:string = evt.target.name;
            switch (keyName) {
                case "btn_back":
                    this.deleteNum();
                    playSound_qipai("turn");
                    break;
                case "btn_ok":
                    this.checkValid();
                    break;
                case "btn_clear":
                    this.clearInput();
                    playSound_qipai("num");
                    break;
                default:
                    this.checkInput(keyName);
                    playSound_qipai("num");
            }
        }
        public clearInput():void {
            this._inputVec = [];
            this.updateInput();
        }

        protected addNum(value:number|string):void {
            this._inputVec.push(value);
            this.updateInput();
            if(this._inputVec.length == this._checkLength) {
                this.checkValid();
            }
        }
        protected deleteNum():void {
            if(this._inputVec.length)
            {
                this._inputVec.pop();
                this.updateInput();
            }
        }
        protected updateInput():void
        {
            if(this._inputVec && this._inputVec.length) {
                var input:string = this._inputVec.join("");
                this._text_input.text = input;
            } else {
                this._text_input.text = this._defaultInput;
            }
        }
        protected checkValid():void
        {
            if(this._text_input.text == "")
                return;
           enterGameByValidation(this._text_input.text);
            //s_hall.showLoading("等待加入...");
            this.close();
        }
        protected checkInput(key:string):void
        {
            var index:number = parseInt(key);
            if(isNaN(index) || index >= 10)
                return;
            this.addNum(index);
        }
    }
}