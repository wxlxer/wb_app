/**
 * Created by wxlan on 2016/10/24.
 */
module gamelib.Api
{
    //保存在app本地的数据
    export function getLocalStorage(key:string):any
    {
        var storage:any;
        if(utils.tools.isApp())
        {
            storage = window['plus'].storage;            
        }
        else
        {
            storage = window['localStorage']       
        }
        return storage.getItem(key);
    }
    export function saveLocalStorage(key:string ,value:string):void
    {
        var storage:any;
        if(utils.tools.isApp())
        {
            storage = window['plus'].storage;            
        }
        else
        {
            storage = window['localStorage']       
        }
        storage.setItem(key,value);
    }
    /**
     * 检测平台货币
     * @param callback
     */
    export function checkPlatfromMoney(callback?:Laya.Handler):void
    {
        console.log("checkPlatfromMoney:::" + gamelib.data.ShopData.s_bShowPlatformMoney);   
        if(window["application_query_diamond"])     
            window["application_query_diamond"](queryCallBack);
        else if(callback)
        {
            callback.runWith(0);
        }

        function queryCallBack(data:any):void
        {
            console.log("检查钻石结果:" + JSON.stringify(data));
            GameVar.platfromMoney = data.balance;
            if(callback)
            {
                callback.runWith(GameVar.platfromMoney);
            }
        }
    }
    /**
     * 更新玩家信息
     * @function
     * @DateTime 2018-08-10T12:07:51+0800
     * @param    {number}} obj [description]
     * @param    {Laya.Handler}           callBack [description]
     */
    export function updateUserInfo(obj:{
        nick?:string,
        icon?:string,
        gender?:number,
        phone?:number 
    },callBack?:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Updateuser");
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
            //修改app数据
            if(data.ret == 1 && window['application_set_userinfo'])
            {
                var dd:any = {};
                if(obj.nick)
                    dd.nickname = obj.nick;
                if(obj.icon)
                    dd.icon_url = obj.icon;
                if(obj.gender)
                    dd.gender = obj.gender;
                if(obj.phone)
                    dd.bind_phone = obj.phone;
                window['application_set_userinfo'](dd);
            }
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     *  玩家联系方式(快递
     * @function
     * @DateTime 2018-07-13T10:23:01+0800
     * @param    {string,                }} obj [description]
     */
    export function updateUserContacts(obj:{
        phone ?:string,
        idcard ?:string,
        street_address ?:string,
        actual ?:string,
    },callBack?:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Updateusercontacts");
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     *  玩家实名信息(实名
     * @function
     * @DateTime 2018-07-18T19:12:19+0800
     * @param    {string,                                     }} obj [description]
     * @param    {Laya.Handler}           callBack [description]
     */
    export function updateUserIdentity(obj:{
        phone ?:string,
        idcard ?:string,
        street_address ?:string,
        actual ?:string,
    },callBack?:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Updateuseridentify");
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 修改游戏的某些属性。通过接口来修改
     * @function
     * @DateTime 2018-10-15T15:56:44+0800
     * @param    {string}                 interfaceName [description]
     * @param    {any}                    obj           [description]
     * @param    {Laya.Handler}           callBack      [description]
     */
    export function modfiyAttByInterface(interfaceName:string,obj:any,callBack:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl(interfaceName);
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 更新玩家的登录相关的信息
     * @function
     * @DateTime 2018-10-12T17:09:40+0800
     * @param    {string,                                     }} obj [description]
     * @param    {Laya.Handler}           callBack [description]
     */
    export function updateUserLoginInfo(obj:{
        nick ?:string,
        icon ?:string,
        gender?:number,
        phone?:string,
        email ?:string
    },callBack?:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Updateuser");
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    
    /**
     * 手机注册
     * @function
     * @DateTime 2018-10-12T17:12:51+0800
     * @param    {{}}                   obj [description]
     */
    export function registerByPhone(obj:{
        phone ?:string,
        code?:string,
        passwd?:string},callBack?:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Bindphone");
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 通过指定接口获取信息
     * @function
     * @DateTime 2018-10-15T16:04:54+0800
     * @param    {string}                 interfaceName [description]
     * @param    {any}                    obj           [description]
     * @param    {Laya.Handler}           callBack      [description]
     */
    export function getInfoByInterface(interfaceName:string,obj:any,callBack:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl(interfaceName);
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 获取短信验证码
     * @function
     * @DateTime 2018-10-12T17:28:32+0800
     */
    export function GetPhoneVerifyCode(obj:{phone :string,type:number},callBack?:Laya.Handler):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Sendsms");
        var sig = getSig(obj,access_key);        
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    export function getSig(obj:any,access_key:string):string
    {
        var keys:Array<string> = Object.keys(obj).sort();
        var sig:string = "";
        for(var i:number = 0;i< keys.length;i++)
        {
            sig += obj[keys[i]];
        }
        sig += access_key;
        console.log(sig);
        sig = new md5().hex_md5(sig);
        return sig;
    }
    /** 
     * 获得玩家实名信息
     */
    export function getUserIdentity(callBack:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/Getuseridentify");
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token},'post',function(data:any)
        {
            console.log(JSON.stringify(data));
            callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 获取玩家联系信息
     * @function
     * @DateTime 2018-07-18T19:12:41+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    export function getUserContacts(callBack:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/Getusercontacts");
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token},'post',function(data:any)
        {
            console.log(JSON.stringify(data));
            callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 获得玩家登录相关的信息。包括登录账号，
     * @function
     * @DateTime 2018-10-12T11:19:53+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    export function getUserLoginInfo(callBack:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/Getuser");
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token},'post',function(data:any)
        {
            console.log(JSON.stringify(data));
            callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }


    /** 获取代理列表
     */
    export function getDailiList(callBack:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/Getweekrebateriseranking");
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token},'post',function(data:any)
        {
            callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 获得兑换物品列表
     * @function
     * @DateTime 2018-07-16T14:32:43+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    export function getExchangeGoodsList(callBack:Laya.Handler):void
    {
        var url:string = GameVar.urlParam['request_host'] + "/platform/getPrizes";
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token},'post',function(data:any)
        {
            callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 兑换商品
     */
    export function exchangeGoods(id:number,num:number = 1,callBack:Laya.Handler = null):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Exchangeprize");

        var obj:any = {
            prize_id:id,
            num:num,
            gz_id:GameVar.gz_id
        };
        var sig:string = getSig(obj,access_key);
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 兑换商品
     */
    export function exchangeCDKey(cdkey:string,callBack:Laya.Handler = null):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Exchangecdkey");

        var obj:any = {            
            key:cdkey,
            gz_id:GameVar.gz_id
        };
        var sig:string = getSig(obj,access_key);
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 上传事件日志 
     */
    export function ApplicationEventNotify(evt:string,value:string,addData?:any,callBack:Laya.Handler = null):void
    {
        if(!GameVar.g_platformData['eventTongJi'])
            return;
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/Applicationeventnotify");

        var obj:any = 
        {
            event:evt,
            value:value
        };
        if(addData)
        {
            obj.addData = addData;
        }
        var sig:string = getSig(obj,access_key);
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    export function buyItem(buyindex:number,callBack:Laya.Handler = null,num:number = 1,extra_data?:any):void
    {
        var access_token:string = GameVar.urlParam['client_access_token'];
        var access_key:string = GameVar.urlParam['client_access_key'];
        var url:string = utils.tools.getRemoteUrl("/platform/buy");
        var platform:string = laya.utils.Browser.onIOS ? "ios":laya.utils.Browser.onAndroid ? "android":"default";

        var obj:any = {
            "platform":platform,
            "goods_id":buyindex,
            "gz_id":GameVar.gz_id,
            "num":num
        };
        if(extra_data)
        {
            utils.tools.copyTo(extra_data,obj);
        }
        var sig:string = getSig(obj,access_key);
        obj['access_token'] = access_token;
        obj['sig'] = sig;
        utils.tools.http_request(url,obj,'post',function(data:any)
        {
            if(data.ret == 1)
            {
                if(data.data)
                {
                    if(Laya.Browser.onWeiXin)
                    {
                        if(window['open_h5_payment'])
                        {
                            window['open_h5_payment'](data.data.payUrl); 
                        }    
                        else if(window['application_layer_show'])
                        {
                            window['application_layer_show'](data.data.payUrl);
                        }
                        else
                        {
                            window.location.href = data.data.payUrl;
                        }

                    }
                     else
                     {
                         window['open_h5_payment'](data.data.payUrl); 
                     }
                }
                else
                {
                    //购买或兑换成功
                    if(callBack) 
                    {
                        callBack.runWith(data);
                    }
                }
                
            }
            else
            {
                g_uiMgr.showTip("购买商品失败:" + data.clientMsg);
                if(callBack) 
                {
                    callBack.runWith(data);
                }
            }
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }

    /**
     * 获得商城道具
     * @function
     * @DateTime 2018-07-19T12:07:02+0800
     * @param    {Laya.Handler}           callBack [description]
     */
    export function getShopData(callBack?:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/Getshop");
        var access_token:string = GameVar.urlParam['client_access_token'];

        var platform:string = laya.utils.Browser.onIOS ? "ios":laya.utils.Browser.onAndroid ? "android":"default";

        utils.tools.http_request(url,{access_token:access_token,"platform":platform},'post',function(data:any)
        {
            // console.log(JSON.stringify(data));
            if(callBack)
                callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /** 
     * 获取平台道具
     */
    export function getPlatformMoneyMsId(callBack?:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/Getmsid");
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token,app:GameVar.platform},'get',function(data:any)
        {
            var list:Array<any> = data.data;
            if(list == null)
                return;
            for(var obj of list)
            {
                gamelib.data.GoodsData.s_goodsNames[obj.model_id] = obj.model_name;
                gamelib.data.GoodsData.s_goodsInfo[obj.model_id] = obj;
            }
            if(callBack)
                callBack.runWith(data);
            g_signal.dispatch(gamelib.GameMsg.GOODSMSIDDATALOADED,0);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /** 获得比赛相关信息 */
    export function getPublicMatchInfo(callBack:Laya.Handler):void
    {
        var url:string = utils.tools.getRemoteUrl("/platform/getPublicMatchInfo");
        var access_token:string = GameVar.urlParam['client_access_token'];
        utils.tools.http_request(url,{access_token:access_token,app_code:GameVar.platform},'post',function(data:any)
        {
            callBack.runWith(data);
        },
        function()
        {
           if(callBack)
                callBack.runWith({ret:0,clientMsg:"接口调用失败"});
        })
    }
    /**
     * 判断是否app是否已经登录
     * @function gamelib.Api.logined
     * @author wx
     * @DateTime 2018-03-15T20:50:20+0800
     * @return   {boolean}   [description]
     */
    export function logined():boolean
    {
        return getAtt("g_app_logined");
    }
    /**
     * 登录app
     * @function gamelib.Api.login
     * @author wx 
     * @DateTime 2018-03-15T20:52:08+0800
     * @param    {string}                 loginType 登录的类型，wx,qq
     * @param    {Function}               callBack  回掉
     * @param    {any}                    thisobj   [description]
     */
    export function login(loginType:string,callBack:Function,thisobj:any):void
    {
        if(logined())
            return;
        var fun:Function = getFunction("application_login");
        fun(loginType,callBack,thisobj);
    }
    /**
     * 登出app
     * @function gamelib.Api.logout
     * @author wx
     * @DateTime 2018-03-15T20:53:08+0800
     * @param    {Function}               callBack 操作的回掉
     * @param    {any}                    thisobj  [description]
     */
    export function logout(callBack:Function,thisobj:any):void
    {
        var fun:Function = getFunction("application_logout");
        fun("",callBack,thisobj);
    }
    /**
     * 获得剪切版的内容。只有在app下才能使用
     * @function
     * @DateTime 2018-11-05T10:53:24+0800
     * @param    {Function}               callBack [description]
     */
    export function getclipboard(callBack:Function):void
    {
       if(window['application_get_clipboard'])
       {
           return window['application_get_clipboard'](callBack);
       }
       callBack({result:1,data:""});
    }
    /**
     * 复制到剪贴版
     * @function
     * @DateTime 2018-11-05T10:55:04+0800
     * @param    {[type]}                 str      [description]
     * @param    {Function}               callBack [ callback
        result: 0 成功 ， 1 失败
        msg: 信息
        data:  设置的数据]
     */
    export function copyToClipboard(str,callBack?:Function):void
    {        
       if(window['application_set_clipboard'])
       {
           return window['application_set_clipboard'](str,callBack);
       }
       utils.tools.copyStrToClipboard(str);       
       if(callBack)
           callBack({result:0});       
    }
    export function enterGame(parms:any):boolean
    {
        if(!logined())
            return false;
        var temp:any = {};
        temp.gz_id = parms.gz_id;
        temp.orientation = parms.orientation;
        var fun:Function = getFunction("application_login_game");
        fun(parms.gz_id,parms.gameId,function(obj:any)
        {
            if(obj.status != 1)
            {
                console.log(obj.msg);
                return;
            }
            temp.url = obj.data.url;
            var fun:Function = getFunction("hall_open_game");
            fun(temp);
        })
        return true;
    }

    /** 保存app的玩家信息
     */
    export function saveAppUserInfo(info:{nick?:string,icon?:string,gender?:number}):void
    {
        if(info.nick)
            window['g_app_nickname'] = info.nick;
        if(info.icon)
            window['g_app_icon_url'] = info.icon;
        if(info.gender)
            window['g_app_gender'] = info.gender;
        if(window['hall_store_login_session'])
        {
            window['hall_store_login_session']();
        }
        if(window['hall_store_userinfo'])
        {
            window['hall_store_userinfo']();
        }
    }
    export function getAtt(attname:string):any
    {
        return window[attname]
    }
    export function getFunction(name:string):Function
    {
        return window[name];
    }
}
