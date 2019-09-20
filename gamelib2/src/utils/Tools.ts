module utils.tools {
    export function getRemoteUrl(url:string):string
    {
        if(url == undefined)
            return "";
        if(url.indexOf("http") >= 0)
            return url;
        return GameVar.urlParam["request_host"] + url;
    }
    /**
     * 拷贝字符串到剪切板
     * @function
     * @DateTime 2018-07-24T16:56:45+0800
     * @param    {string}                 str [description]
     */
    export function copyStrToClipboard(str:string):void
    {
        var oInput = document.createElement('input');
        oInput.value = str;
        oInput.type = "text";
        document.body.appendChild(oInput);
        oInput.focus();
        oInput.setSelectionRange(0, oInput.value.length);
        console.log(document.execCommand("Copy"));
        oInput.style.display='none';
        document.body.removeChild(oInput);
    }
    export function getMoneyByExchangeRate(money:number):string
    {
        var bl:number = GameVar.g_platformData['exchangeRate'];
        if(bl == 0 || isNaN(bl))
            bl = 1;
        if(bl == 1)
            return utils.tools.getMoneyDes(money);
        money = money / bl;

        var op:string = money < 0 ? "-" : "";
        money = Math.abs(money);
        if (money < 100000)
        {
            return op + money.toFixed(2);
        }    
        if (money < 100000000) {
            if ((money % 10000) == 0)
                return op + (money / 10000) + getDesByLan("万");
            if (money < 1000000)
                return op + (money / 10000).toFixed(2) + getDesByLan("万");
            else if (money < 10000000)
                return op + (money / 10000).toFixed(1) + getDesByLan("万");
            else
                return op + parseInt((money / 10000) + "") + getDesByLan("万");
        }
        else {
            return op + (money / 100000000).toFixed(2) + getDesByLan("亿");
        }
    }
    export function getExchangeRate():number
    {        
        var bl:number = GameVar.g_platformData['exchangeRate'];
        if(bl == 0 || isNaN(bl))
            bl = 1;
        return bl;
    }

    /**
     * 截屏处理
     * @param {laya.display.Sprite} target [description]
     */
    export function snapshotShare(target:laya.display.Sprite,callBack?:Function,thisobj?:any):void
    {
        var htmlC:Laya.HTMLCanvas;
        if(target != null)
        {
            htmlC = target.drawToCanvas(target.width,target.height,target.x||0,target.y||0);                
        }
        else
        {
            htmlC = g_layerMgr.drawToCanvas(Laya.stage.width,Laya.stage.height,0,0);    
        }
        
        var base64Data:String = htmlC.toBase64('image/jpeg',0.9);
        if(Laya.Browser.onWeiXin)
        {
            if(window["application_weixin_data_share"])
            {
                window["application_weixin_data_share"](base64Data,callBack,thisobj);
            }
        }
        else
        {
            if(window["application_snapshot_share"])
            {
                if(GameVar.g_platformData['share_friend'])
                {
                    window["application_snapshot_share"](base64Data,callBack,thisobj,0,true);
                }
                else
                {
                    window["application_snapshot_share"](base64Data,callBack,thisobj);    
                }
                
            }    
        }

        //toBase64Async要报错
        // htmlC.toBase64Async("image/png",0.9,function(base64Data:String)
        // {
        //     if(Laya.Browser.onWeiXin)
        //     {
        //         if(window["application_weixin_data_share"])
        //         {
        //             window["application_weixin_data_share"](base64Data,callBack,thisobj);
        //         }
        //     }
        //     else
        //     {
        //         if(window["application_snapshot_share"])
        //         {
        //             if(GameVar.g_platformData['share_friend'])
        //             {
        //                 window["application_snapshot_share"](base64Data,callBack,thisobj,0,true);
        //             }
        //             else
        //             {
        //                 window["application_snapshot_share"](base64Data,callBack,thisobj);    
        //             }
                    
        //         }    
        //     }
        // })        
    }

    /**
     * 超出文本部分用...表示.注意，label一般是由美术提供的文本，宽度不能为0
     * @function
     * @DateTime 2018-11-05T17:24:16+0800
     * @param    {Laya.Label}             label [description]
     * @param    {number              =     0}           width [description]
     */
    export function setLabelDisplayValue(label:Laya.Label,str:string,width:number = 0):void
    {
        var txt:Laya.Text = new Laya.Text();
        txt.fontSize = label.fontSize;
        txt.overflow = Laya.Text.HIDDEN;
        txt.wordWrap = false;
        txt.text = str;
        if(txt.width > label.width)
        {
            txt.width = label.width - txt['_getTextWidth']("...");
            Laya.timer.callLater(this,function()
            {
                if(label == null || !label.getStyle())
                    return;
                label.text = txt['_lines'][0] + "...";                     
            }) 
        }
        else{
            label.text = txt.text;
        }
        // if(width == 0)
        //     txt.width = label.width - txt['_getTextWidth']("...");
        // else
        //     txt.width = width;
        // txt.text = label.text = str;
        // Laya.timer.callLater(this,function()
        // {
        //      if(txt['_lines'][0] != label.text)
        //          label.text = txt['_lines'][0] + "...";
        // })         
    }
    /**
     * 屏蔽关键字
     * @param  {string} str [description]
     * @return {string}     [description]
     */
    export function getBanWord(str:string):string
    {
        if(gamelib.data.ShopData.s_shopDb == null)
            return str;
        var arr:Array<string> = gamelib.data.ShopData.s_shopDb.ban_word;
        if(arr == null)
            return str;
        for(var key of arr)
        {
            if(str.indexOf(key) != -1)
            {
                var reg = new RegExp(key,"gm");
                str = str.replace(reg,"**");
            }
        }
        return str;
    }
    export function clone(source:any):any 
    {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? clone(source[item]) : source[item];
        }
        return sourceCopy;

    }

    export function copyTo(from:any,to:any):void
    {
        if(from == null || to== null)
            return;
        for(var key in from)
            to[key] = from[key];
    }

    /**
     * @method
     * @static
     * 请求网页并返回
     * @param url 网页地址
     * @param postData 网页参数
     * @param method    方法
     * @param callback  回调
     */
    export function http_request(url:string, postData:Object, method:string, callback:Function,errorCallBack?:Function):void {
        var postdata = "";
        var first:boolean = true;
        for (var key in postData)
        {
            if(first)
                first = false;
            else
                 postdata += '&';  

            if(typeof postData[key] == "object")
            {
                postdata += key + "=" + JSON.stringify(postData[key]);
            }
            else
            {
                postdata += key + "=" + encodeURIComponent(postData[key]);
            }
        }

        var xhr:laya.net.HttpRequest = new laya.net.HttpRequest();
        xhr.http.timeout = 100000;//设置超时时间；
        xhr.on(laya.events.Event.COMPLETE,this,onLoaded);
        xhr.on(laya.events.Event.ERROR,this,onError);
        xhr.on(laya.events.Event.PROGRESS,this,onProgress);
        
        if(method == "get")
        {
            console.log("http_request:" + url + "?" + postdata);
            xhr.send(url + "?" + postdata,null,"get","text");
        }
        else
        {
            xhr.send(url,postdata,"post","text");
        }

        function onLoaded(e):void
        {
            var jsonObj;
            try
            {
                jsonObj = JSON.parse(xhr.data);       
            }
            catch(e)
            {
                console.log(url + " 返回的数据不对是json格式")
            }
            
            close();
            if(callback)
                callback(jsonObj);
           
        }
        function onError(e):void
        {
            console.log("HttpRequest error" + url);
            close();
            if(errorCallBack )
                errorCallBack()
        }

        function onProgress(e):void
        {
             // console.log("HttpRequest onProgress" + xhr);
             // close();
        }

        function close():void
        {
            xhr.off(laya.events.Event.COMPLETE,this,onLoaded);
            xhr.off(laya.events.Event.ERROR,this,onError);
            xhr.off(laya.events.Event.PROGRESS,this,onProgress);
        }
    }

    
    /**
     * @method
     * @static
     * 获取铜钱描述
     * @param money
     * @returns {string} 例如1.11万，100.1万,
     */
    export function getMoneyDes(money:number):string {
        var op:string = money < 0 ? "-" : "";
        money = Math.abs(money);
        if (money < 100000)
            return op + money;
        if (money < 100000000) {
            if ((money % 10000) == 0)
                return op + (money / 10000) + getDesByLan("万");
            if (money < 1000000)
                return op + (money / 10000).toFixed(2) + getDesByLan("万");
            else if (money < 10000000)
                return op + (money / 10000).toFixed(1) + getDesByLan("万");
            else
                return op + parseInt((money / 10000) + "") + getDesByLan("万");
        }
        else {
            return op + (money / 100000000).toFixed(2) + getDesByLan("亿");
        }
    }
    
    export function isTestPid():boolean {
        //var testpIds = gamelib.data.ShopData.s_shopDb.testPid;
        //if (testpIds == null)
        //    return false;
        //return (testpIds.indexOf(GameVar.pid) != -1)
        return false;
    }

    /**
     * 是否是组局模式
     * @returns {boolean}
     */
    export function isQpq():boolean {
        console.log("isQpq  " + GameVar.circle_args + "   " + GameVar.validation + "  " + GameVar.circleData.validation);
        if (GameVar.circle_args && GameVar.validation || (gamelib.data.UserInfo.s_self && gamelib.data.UserInfo.s_self.m_roomId >= 200 && gamelib.data.UserInfo.s_self.m_roomId <= 250))
            return true;
        return false;
    }

    export function isMatch():boolean
    {        
        console.log("isMatch  matchId:" + GameVar.game_args.matchId);
        if (!isNaN(GameVar.game_args.matchId))
            return true;
        return false;
    }
    export function isGuanZhan():boolean
    {
        
        if (GameVar.game_args.gzInfo)
            return true;
        return false;
    }
    export function isWx():boolean
    {
        return GameVar.platform.indexOf("wx") != -1;
    }
    export function isWxgame():boolean
    {
        return Laya.Browser.onMiniGame || window["GameGlobal"];
    }
    /**
     * 当前游戏是否是棋牌圈大厅
     * @returns {boolean}
     */
    export function isQpqHall():boolean
    {
        return !GameVar.urlParam['isChildGame'];
    }
    export function is(instance:any, typeName:string):boolean {
        if (!instance || typeof instance != "object") {
            return false;
        }
        var cl = gamelib.getDefinitionByName(typeName);
        return cl.prototype.isPrototypeOf(instance);
        // var prototype = Object.getPrototypeOf(instance);
        // var types = prototype ? prototype.__types__ : null;
        // if (!types) {
        //     return false;
        // }
        // return (types.indexOf(typeName) !== -1);
    }
    /**
    **
    ** 生成二维码
    */
    export function createQRCode(url:string,spr:laya.display.Sprite):laya.display.Sprite
    {
        spr = spr || new laya.display.Sprite();
        var twidth:number = spr.width || 100;
        var theight:number = spr.height || 100;
        var div:Object = Laya.Browser.document.createElement("div");
        var qrcode = new Laya.Browser.window.QRCode(div,{
            text:url,
            width: twidth,
            height: theight,
            colorDark : '#000000',
            colorLight : '#ffffff',
            correctLevel : 1
        });
        qrcode.makeCode(url);
        Laya.timer.once(1000,this,function()
        {
            spr.loadImage(qrcode._oDrawing._elImage.src);
        })
        return spr;
    }

    export function isApp():boolean
    {
        return window["plus"] || window['conch'];
    }

    export function isRuntime():boolean
    {
        return window['conch'];
    }

    export function isAndroid():boolean
    {
        return Laya.Browser.onAndroid;
    }

    //抖动对象特效
    // 1：抖动  2：震动
    export function shakeScreen(effectType:number = 1):void
    {
        var panel = Laya.stage;
        if(panel["shakeScreen_old_x"] == undefined)
        {
            panel["shakeScreen_old_x"] = panel.x;
            panel["shakeScreen_old_y"] = panel.y;
        }
        var shakeNum = 40;        
//        egret.Tween.removeTweens(panel);
        var oldX:number = panel["shakeScreen_old_x"];
        var oldY:number = panel["shakeScreen_old_y"];

        var timeLine:Laya.TimeLine = new Laya.TimeLine();
        if(effectType == 1)
        {
            timeLine.addLabel("show1",0).to(panel,{x: oldX - 10 },shakeNum);
            timeLine.addLabel("show2",0).to(panel,{x: oldX + 20 },shakeNum,null,shakeNum);
            timeLine.addLabel("show3",0).to(panel,{x: oldX - 20 },shakeNum,null,shakeNum);
            timeLine.addLabel("show4",0).to(panel,{x: oldX + 20 },shakeNum,null,shakeNum);
            timeLine.addLabel("show5",0).to(panel,{x: oldX},shakeNum); 
        }else{
            timeLine.addLabel("show1",0).to(panel,{x: oldX - 10,y:oldY},shakeNum);
            timeLine.addLabel("show2",0).to(panel,{x: oldX + 20,y:oldY+10},shakeNum,null,shakeNum);
            timeLine.addLabel("show3",0).to(panel,{x: oldX,y:oldY-20},shakeNum,null,shakeNum);
            timeLine.addLabel("show4",0).to(panel,{x: oldX,y:oldY+10 },shakeNum,null,shakeNum);
            timeLine.addLabel("show5",0).to(panel,{x: oldX,y:oldY},shakeNum);                 
        }
        timeLine.play("show1",false);
    }

    export function shakeObj(obj):void
    {
        if(obj.__shakeObjVar)
            return;
        obj.__shakeObjVar = true;
        var shakeNum = 40;
        var s:number = 0.8;
        var timeLine:Laya.TimeLine = new Laya.TimeLine();
        timeLine.addLabel("show1",0).to(obj,{scaleX:s,scaleY:s},shakeNum);
        timeLine.addLabel("show2",0).to(obj,{scaleX:1,scaleY:1},shakeNum,null,shakeNum);
        timeLine.addLabel("show3",0).to(obj,{scaleX:s,scaleY:s},shakeNum,null,shakeNum);
        timeLine.addLabel("show4",0).to(obj,{scaleX:1,scaleY:1},shakeNum,null,shakeNum);
        timeLine.addLabel("show5",0).to(obj,{scaleX:s,scaleY:s},shakeNum,null,shakeNum);
        timeLine.addLabel("show6",0).to(obj,{scaleX:1,scaleY:1},shakeNum,null,shakeNum);
        timeLine.once(Laya.Event.COMPLETE,this,function()
        {
            obj.__shakeObjVar = false;
        })
        timeLine.play("show1",false);
    }

    export function quickSort(arr:Array<any>,key:string = null):void
    {
        function partition(a,st,en) 
        { 
            var s = st; 
            var e = en+1; 
            var temp = a[s];
            while(1) 
            {
                if(key)
                {
                    while(a[++s][key] < temp[key]); 
                    while(a[--e][key] > temp[key]); 
                }
                else
                {
                    while(a[++s]<temp); 
                    while(a[--e]>temp);     
                }
                
                if(s>e)break; 
                var tem = a[s]; 
                a[s] = a[e]; 
                a[e] = tem; 
            } 
            a[st] = a[e]; 
            a[e] = temp; 
            return e; 
        } 


        function doSort(a,s,e) 
        { 
            if(s<e) 
            { 
                var pos = partition(a,s,e); 
                doSort(a,s,pos-1); 
                doSort(a,pos+1,e); 
            } 
        } 
        doSort(arr,0,arr.length -1);
    }

    /**
     * 检测当前时间是否是在指定的时间段内
     * @function
     * @DateTime 2018-09-28T10:46:26+0800
     * string:可以为2018-09-27 17:00:00  或 2018/09/27 17:00:00的格式
     * @param    {string|number|Date}     startTime [description]
     * @param    {string|number|Date}     endTime   [description]
     * @return   {boolean}                          [description]
     */
    export function checkInTimeSlot(startTime:string|number|Date,endTime:string|number|Date):boolean
    {
        var start_ms:number;
        var end_ms:number;
        var now_ms:number;

        var start_date:Date
        var end_date:Date;
        if(startTime instanceof Date)
        {
            start_date = <Date>startTime;
        }
        else
        {
            if(typeof startTime == "string")
            {
                startTime = startTime.replace(/-/g, "/");
            }
            start_date = new Date(startTime+"");            
        }
        if(endTime instanceof Date)
        {
            end_date = <Date>endTime;
        }
        else
        {
            if(typeof endTime == "string")
            {
                endTime = endTime.replace(/-/g, "/");
            }
            end_date = new Date(endTime+"");            
        }  
        start_ms = start_date.getTime();
        end_ms = end_date.getTime();
        now_ms = GameVar.s_loginSeverTime * 1000 + (Laya.timer.currTimer - GameVar.s_loginClientTime);
        return now_ms >= start_ms && now_ms <= end_ms;
    }

    export function createSceneByViewObj(resname:string):Laya.Scene
    {
        if(resname.indexOf(".scene") >= 0)
            resname = resname.replace(".scene","");
        var uiView:any = Laya.View.uiMap[resname];
        if(uiView == null)
        {
            console.log(resname + "界面不存在");
            return new Laya.Scene();
        }
        var temp:Laya.Scene = null;
        switch(uiView.type)
        {
            case "View":    
                temp = new Laya.View();
                break;
            case "Dialog":
                temp = new Laya.Dialog();    
                break;
            default:
                temp = new Laya.Scene();
                break;
        }
        temp.createView(uiView);
        return temp;
    }

    export function debugLoaderMap(url:string):void
    {
        for(var key in Laya.Loader.loadedMap)
        {
            if(key.indexOf(url) >= 0)
                console.log(key);
        }
    }

}
window['utils'] = utils;