module gamelib.wxgame
{
	var wx:any = window['wx'];
	var _wxGameInfo:any = window['wxGameInfo'];
	var _callBack:Laya.Handler;

	//微信登录用到的code	
	var _code:string;
	var _openid:string;
	var _access_token:string
	var _unionid:string;

	var _game_code:string = "fxq";
	/**
	 * 小游戏登录流程
	 * 1、登录微信
	 * 2、获取微信用户信息
	 * 3、登录平台
	 * 4、获取urlParam
	 * @function
	 * @DateTime 2019-03-26T17:18:20+0800
	 */
	export function startup(callBack:Laya.Handler):void
	{
		_callBack = callBack;
		wx.login({
			success:function(res){
				_code = res.code;
				console.log("_code:" + _code);
				//getOpenId();
				checkLoginScope();

			},
			fail:function(res){
				wx.showModal({ "title": "登录失败", "content": "登录失败", "showCancel": false });
			}
		});
		
	}
	/**
	 * 获得openid
	 * @function
	 * @DateTime 2019-03-29T11:08:38+0800
	 */
	function getOpenId():void
	{
		wx.request({
			url:""
		});
		var url:string = "https://api.weixin.qq.com/sns/jscode2session";//
		//?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code"
		var data:any = {
			appid : _wxGameInfo.appid,
			//secret :"cf2c2af4664f9c8e07a04585448baf1a",
			secret :_wxGameInfo.secret,
			js_code:_code,
			grant_type:"authorization_code"
		}
		utils.tools.http_request(url,data,"get",function(res)
		{
			console.log(res);
			if(!res.errcode)
			{
				_openid = res.openid;
				_unionid = res.unionid;
				return;
			}
			switch(res.errcode)
			{
				case -1:		//系统繁忙，此时请开发者稍候再试
					getOpenId();
					break;
				case 40029:		//code 无效
					wx.showModal({ "title": "请求失败", "content": "code 无效", "showCancel": false });
					break;	
				case 45011:		//频率限制，每个用户每分钟100次
					wx.showModal({ "title": "请求失败", "content": "频率限制,每个用户每分钟100次", "showCancel": false });
					break;
			}
		});
	}
	/**
	 * 检测登录授权
	 * @function
	 * @DateTime 2019-03-29T11:08:12+0800
	 */
	function checkLoginScope():void
	{
		wx.getSetting({
	      success(res) {
	        if (res.authSetting['scope.userInfo'] === true) {
	          //用户已授权，可以直接调用相关 API
	          getUserInfo();
	          //TODO: 调用wx.login, wx.getUserInfo 
	          //TODO: 调用自己的注册登录接口
	        } else if (res.authSetting['scope.userInfo'] === false) {
	          // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
	          console.log('授权：请点击右上角菜单->关于（'+_wxGameInfo.name+'）->右上角菜单->设置');
	          createUserInfoButton();
	        } else {
	          // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
	          createUserInfoButton();
	        }
	      },
	      fail: function () {
	        createUserInfoButton();
	      }
	    })
	}
	function onGetUserInfo(res:any):void
	{
		console.log(res)   ;
	    if (res.errMsg == "getUserInfo:ok"){	    	
	      //登录平台，获取分区数据
	      getPlatformUserInfo(res);
	    } 
	    else if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
	      // 处理用户拒绝授权的情况
	      wx.showModal({ "title": "授权失败", "content": "用户拒绝授权", "showCancel": false });
	    }
	}
	function createUserInfoButton():void
    {
    	var img = new Laya.Image();
    	img.skin = "resource/loading.jpg";
	    Laya.stage.addChild(img);
	    var button = createButton(140, 40);
	    button.onTap((res) => {
	      if (res.errMsg == "getUserInfo:ok"){
	        button.destroy();	
	        img.removeSelf();        
	      }
	      onGetUserInfo(res);
	    })

	    function createButton(width, height) {
	      var info = wx.getSystemInfoSync();
	      var button = wx.createUserInfoButton({
	         type: 'image',
             image: 'resource/wxLogin.png',
	        style: {
	          left: (info.windowWidth - width) / 1.5,
	          top: (info.windowHeight - height) / 1.5,
	          width: width,
	          height: height,
	          lineHeight: 40
	        }
	      })
	      return button;
	  }
    }
    /**
     * 获得微信用户信息
     * @function
     * @DateTime 2019-03-26T17:08:52+0800
     * @return   {Promise<any>}           [description]
     */
    function getUserInfo():void
    {
	    wx.getUserInfo({
          withCredentials: true,
          lang: '',
          success: function(res) {
            onGetUserInfo(res);
          },
          fail: function(res) {
            onGetUserInfo(res);
          },
          complete: function(res) {},
        })
    }
    function getPlatformUserInfo(res:any):void
    {
        var url:string = _wxGameInfo.loginUrl;
    	var postData:any = {
    		app:_wxGameInfo.app,
    		agent_id:_wxGameInfo.agent_id,
    		code:_code,    		
    		gender:res.userInfo.gender,
    		nickname:res.userInfo.nickName||"",
    		thumb_url:res.userInfo.avatarUrl||""
    	};
    	wx.request({
    		url:_wxGameInfo.loginUrl,
    		data: {
	    		app:_wxGameInfo.app,
	    		agent_id:_wxGameInfo.agent_id,
	    		code:_code,    		
	    		gender:res.userInfo.gender,
	    		nickname:res.userInfo.nickName,
	    		thumb_url:res.userInfo.avatarUrl
	    	},
	    	success(params){
	    		if(params.ret != 1){
	    			wx.showModal({ "title": "登录失败", "content": "平台登录失败", "showCancel": false });
	    			return;
	    		}
	    		GameVar.s_version = params.data.version;
	    		var urlParams:any = {};
	    		urlParams["game_ver"] = params.data.version; 
	    		utils.tools.copyTo(params.data.user,urlParams);
	    		window["game_zone_info"] = params.data.game_zone_info;
	    		utils.tools.copyTo(params.data.game_zone_info[_game_code],urlParams);
	    		_callBack.runWith(urlParams);    		
	    	}
    	});
    	// utils.tools.http_request(url, postData, "get",function(params){
    	// 	if(params.ret != 1){
    	// 		wx.showModal({ "title": "登录失败", "content": "平台登录失败", "showCancel": false });
    	// 		return;
    	// 	}
    	// 	GameVar.s_version = params.data.version;
    	// 	var urlParams:any = {};
    	// 	urlParams["game_ver"] = params.data.version; 
    	// 	utils.tools.copyTo(params.data.user,urlParams);
    	// 	window["game_zone_info"] = params.data.game_zone_info;
    	// 	utils.tools.copyTo(params.data.game_zone_info[_game_code],urlParams);
    	// 	_callBack.runWith(urlParams);    		
    	// },
    	// function(res){
    	// 	wx.showModal({ "title": "登录失败", "content": "平台登录失败", "showCancel": false });
    	// });

    }
}