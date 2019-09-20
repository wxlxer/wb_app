
namespace gamelib.platform {

    /**
     * 检测平台货币
     * @function gamelib.platform.checkPlatfromMoney
     * @DateTime 2018-03-17T14:58:30+0800
     * @param    {function}               callback [description]
     */
    export function checkPlatfromMoney(callback:()=>void):void {
        if (!gamelib.data.ShopData.s_bShowPlatformMoney) {
            if (callback) {
                callback.call(null);
            }
            return;
        }
        window["application_query_diamond"](queryCallBack);
        //nest.qqhall2.iap.checkbalance(queryCallBack);
        function queryCallBack(data:any):void {
            console.log("检查钻石结果:" + JSON.stringify(data));
            GameVar.platfromMoney = data.balance;
            g_signal.dispatch(gamelib.GameMsg.UPDATEPLATFORMICON, 0);
            if (callback) {
                callback.call(null);
            }
        }
    }
    /**
     * 微信分享回掉
     * @function gamelib.platform.onWxShareCallBack
     * @DateTime 2018-03-17T14:58:53+0800
     * @param    {any}                    ret [description]
     */
    export function onWxShareCallBack(ret:any):void
    {
        console.log("微信分享回掉:" + JSON.stringify(ret));
        if(ret.result == 0)
        {
            if(ret.data.link.indexOf("circle_args") == -1)
            {
                g_uiMgr.showAlertUiByArgs({msg:getDesByLan("分享成功")});
                sendNetMsg(0x001A);    
            }            
        }
    }

    /**
     * 支付.
     * @function gamelib.platform.pay
     * @DateTime 2018-03-17T14:59:20+0800
     * @param    {number}                 itemId  物品id
     * @param    {number}                 itemNum 充值数量
     * @param    {string}                 itemDes 物品描述
     */
    export function pay(itemId:number, itemNum:number, itemDes:string):void {
        var payInfo = {
            "gz_id": GameVar.gz_id,
            "goods_id": itemId + "",
            "item_num": 1,
            "desc": itemDes,
            "amount": itemNum + "",
            "pay_type": 0,
            "callback": payCallBack
        }
        window["application_buy"](payInfo);

        function payCallBack(data:any):void {
            if (data.result == 0)    //支付成功
            {
                GameVar.platfromMoney = data.balance;
                g_signal.dispatch(gamelib.GameMsg.UPDATEPLATFORMICON, 0);
                g_uiMgr.showTip(getDesByLan("充值成功!"), false);
                console.log("充值成功!")

            }
            else if(data.result == 2)    //不提示
            {

            }
            else {
                g_uiMgr.showTip(getDesByLan("充值失败!"), true);
                console.log("充值失败!")
            }
        }

    }


    /**
     * 购买商城道具
     * @function gamelib.platform.buyGoods
     * @DateTime 2018-03-17T14:59:56+0800
     * @param {any}        gd       商品对象
     * @param {function} callback [description]
     * @param {any}        thisobj  [description]
     * @param {boolean}    [tips = true] [是否显示等待信息]
     * @param {number}     [num = 1] [数量,默认1]
     */
    export function buyGoods(gd:any,callback?:(data:any)=>void, thisobj?:any, tips:boolean = true, num:number = 1):void
    {
        var isFirstBuy:boolean = GameVar.s_firstBuy;
        var isVip:boolean = GameVar.isGameVip;        
        var buyIndex:number = gd.buyindex;
        if(gd.buyIndexs)
        {
            if(isVip)
            {
                if(isFirstBuy)
                {
                    buyIndex = gd.buyIndexs.vip_firstbuy;
                }
                else
                {
                    buyIndex = gd.buyIndexs.vip;
                }
            }
            else
            {
                if(isFirstBuy)
                {
                    buyIndex = gd.buyIndexs.firsbuy;
                }
            }    
        }
        if(gd.isGood)
            buyItem(buyIndex,gd.price,gd.info1,callback,thisobj,tips,num);
        else
            pay(buyIndex,1,"");
    }
    /**
     * 购买商品
     * @function gamelib.platform.buyItem
     * @DateTime 2018-03-17T15:01:50+0800
     * @param    {number}                 buyIndex 物品buyIndex
     * @param    {number}                 price    充值数量 物品价格
     * @param    {string}                 itemDes  物品描述
     * @param    {function}             calback  [description]
     * @param    {any}                    [thisobj = null]         [description]
     * @param    {boolean}                [tips = true]        tips    是否显示转圈
     * @param    {number}                 [num= 1]           num     [商品数量]
     */
    export function buyItem(buyIndex:number, price:number, itemDes:string, calback?:(data:any)=>void, thisobj:any = null, tips:boolean = true, num:number = 1):void {
        if (tips)
            g_uiMgr.showMiniLoading();

        var payInfo = {
            "gz_id": GameVar.gz_id,
            "goods_id": buyIndex + "",
            "item_num": num,
            "desc": itemDes,
            "amount": price + "",
            "pay_type": 1,
            "callback": payCallBack
        }
        //utils.trace(JSON.stringify(payInfo));
        window["application_buy"](payInfo);
        function payCallBack(data:any) {
            if (tips)
                g_uiMgr.closeMiniLoading();
            if (data.result == 0) {
                GameVar.platfromMoney = data.balance;
                g_signal.dispatch(gamelib.GameMsg.UPDATEPLATFORMICON, 0);
                if (tips) {
                    g_uiMgr.showTip(getDesByLan("购买成功")+"!", false);
                }
                console.log("购买成功!")
            }
            else if(data.result == 2)     //不提示
            {

            }
            else
            {
                if (tips) {
                    g_uiMgr.showTip(getDesByLan("购买失败!"), true);
                }
                console.log("购买失败!")
            }
            if (calback != null) {
                calback.call(thisobj, data);
            }
        }
    }

    /**
     * 分享
     * @function gamelib.platform.share_circle
     * @DateTime 2018-03-17T15:03:51+0800
     * @param    {number}                 gz_id      [description]
     * @param    {string}                 validation [description]
     * @param    {number}                 gameId     [description]
     * @param    {string}                 groupId    [description]
     * @param    {string}                 title      [description]
     * @param    {string}                 desc       [description]
     * @param    {string}                 img_url    [description]
     * @param    {Function}               callBack   [description]
     * @param    {any}                    thisObj    [description]
     */
    export function share_circle(gz_id:number, validation:string, gameId:number,groupId?:string, title?:string, desc?:string, img_url?:string, callBack?:Function,thisObj?:any):void {
        var url:string = window["application_share_url"]();
        var obj:any =
        {
            "gz_id": gz_id,
            "validation": validation,
            "gameId": gameId,
            "groupId": groupId
        };
        var str:string = JSON.stringify(obj);
        str = encodeURIComponent(str);
        if (url.indexOf("?") != -1)
            url += "&circle_args=" + str;
        else
            url += "?circle_args=" + str;
        var share_params:any = {};
        share_params.title = title;
        share_params.description = share_params.summary = desc;
        share_params.url = url;
        share_params.img_title = "游戏图标" + GameVar.gz_id;
        share_params.icon_url = share_params.img_url = img_url;
        callBack = callBack ? callBack.bind(thisObj) : callBack;
        console.log("share_params.url:" + share_params.url);
        window["application_game_share"](share_params, callBack);
    }
    export var g_wxShareUi:gamelib.control.ShareTip_wxUi;

    /**
     * 棋牌圈分享
     * @function gamelib.platform.share_circleByArgs
     * @DateTime 2018-03-17T15:04:37+0800
     * @param    {string}}               args     [description]
     * @param    {Function}               callBack [description]
     * @param    {any}                    thisObj  [description]
     */
    export function share_circleByArgs(args:{gz_id:number,gameId:number,validation:string,groupId:string,wxTips?:boolean,fd?:number,js?:number,addDatas?:any,title?:string,desc?:string},callBack?:Function,thisObj?:any):void {
        if(args.wxTips && Laya.Browser.onWeiXin)
        {                                
            g_wxShareUi.setData(args,callBack,thisObj);
            g_wxShareUi.show();
            return;
        }
        var url:string = GameVar.urlParam["ftp"] +"scripts/circle_config.php";
        var temp:any = {};
        for(var key in args)
        {
            temp[key] = args[key];
        }
        temp.platform = GameVar.platform;
        temp.action = "circle_share";
        temp.game_path = GameVar.urlParam['game_path'];
        utils.tools.http_request(url,temp,"get",function(rep:any)
        {
            console.log("请求结束了!" + JSON.stringify(rep));
            share_circle(args.gz_id,args.validation,args.gameId,args.groupId,rep.title,rep.desc,rep.img_url,callBack,thisObj);
            
        }.bind(this));
    }
    /**
     * 拷贝房间号url到剪切板
     * @function
     * @DateTime 2018-12-04T19:04:16+0800
     * @param    {Function}               args    [description]
     * @param    {any}                    thisObj [description]
     */
    export function copyShareUrlToClipboard(args:{gz_id:number,gameId:number,validation:string,groupId:string},callBack:Function,thisObj:any):void
    {
        var url:string = window["application_share_url"]();
        var obj:any =
        {
            "gz_id": args.gz_id,
            "validation": args.validation,
            "gameId": args.gameId,
            "groupId": args.groupId
        };
        var str:string = JSON.stringify(obj);
        str = encodeURIComponent(str);
        if (url.indexOf("?") != -1)
            url += "&circle_args=" + str;
        else
            url += "?circle_args=" + str;
        if(GameVar.circleData.info && GameVar.circleData.info.extra_data )
        {
            url = GameVar.g_platformData['name'] + " " + GameVar.circleData.info.extra_data['roomName'] +  " 房号[" + args.validation + "] 房间链接:" +  url;    
        }
        else
        {

        }
        Api.copyToClipboard(url,callBack.bind(thisObj));
    }
    /**
     * 获得棋牌圈分享的参数
     * @function gamelib.platform.get_share_circleByArgs
     * @DateTime 2018-03-17T15:05:07+0800
     * @param    {any}                  args     [description]
     * @param    {Function}               callBack [description]
     * @param    {any}                    thiobj   [description]
     */
    export function get_share_circleByArgs(args:{
        gz_id:number,
        gameId:number,
        validation:string,
        groupId:string,
        fd?:number,
        js?:number,
        addDatas?:any},callBack:Function,
        thisobj:any):void
    {
        var url:string = GameVar.urlParam["ftp"] +"scripts/circle_config.php";
        var temp:any = {};
        for(var key in args)
        {
            temp[key] = args[key];
        }
        temp.platform = GameVar.platform;
        temp.action = "circle_share";
        temp.game_path = GameVar.urlParam['game_path'];
        utils.tools.http_request(url,temp,"get",function(rep:any)
        {
            callBack.call(thisobj,rep);
            console.log("请求结束了!" + JSON.stringify(rep));            
        }.bind(this));
    } 

    /**
     * 自动分享,非wx平台不做处理
     * @function gamelib.platform.autoShare
     * @DateTime 2018-03-17T15:06:04+0800
     */
    export function autoShare():void
    {
        //app不做处理
        // var isWx:boolean = GameVar.platform.indexOf("wx") != -1;
        // if(!isWx) return;
        // 
        if(utils.tools.isApp())
            return;

        if(utils.tools.isQpqHall())
        {
            shareApp();
        }
        else    //分享组局信息
        {
            g_qpqCommon.doShare(false);
        }
    }
    /**
     * 分享app
     * @function gamelib.platform.shareApp
     * @DateTime 2018-03-17T15:06:24+0800
     * @param wx_firendCircle 分享微信朋友圈
     */
    export function shareApp(callBack?:Function,thisobj?:any,wx_firendCircle?:boolean,extra_data?:any):void
    {
        var args = 
        {
            title:GameVar.g_platformData.name,
            url:window["application_share_url"](),
            summary:GameVar.g_platformData.share_info,
            icon_url:GameVar.g_platformData.share_url,
            wx_timeline:wx_firendCircle           
        }
        if(extra_data)
        {
            var ts:string = "&";
            if(args.url.indexOf("?") == -1)
                ts = "?"
            for(var key in extra_data)
            {
                args.url += (ts + key +"=" + extra_data[key]);
                ts = "&";
            }
            
        }
        if(args.icon_url && args.icon_url.indexOf("http") == -1)
        {
            args.icon_url = GameVar.common_ftp + args.icon_url;
        }
        if(window["application_game_share"])
        {
            window["application_game_share"](args,callBack,thisobj);
        }
    }

}