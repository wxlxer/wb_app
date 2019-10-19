console.log("进来了");

//1、下载配置文件
//2、检测登录
//3、进入游戏

//登录模块
//调整游戏模块
// globData.g_hall = plus.webview.create('hall1.html', 'hall', {
// 		scrollIndicator: 'none',
// 		scalable: false,
// 		popGesture: 'close',
// 		backButtonAutoControl: 'close'
// 		
// 	});
	// g_hall.addEventListener('close', function(){
	// 	console.log("大厅关闭");
	// }, false);
	// console.log("11111111111111111111"); 
	// g_hall.show('zoom-fade-out');
var app = null;
var g_hall = null;
var g_game = null;
	
document.addEventListener('plusready', function(){
	start();
	plus.navigator.setFullscreen(true);  
});

function start(){
	g_hall = app = plus.webview.getWebviewById(plus.runtime.appid);
	loadLib('index.js');
	loadLib('js/control_bar.js');
}


function enterGame(args)
{
	console.log(args.url);
	g_hall.hide();
	// g_game = plus.webview.create(args.url,"game_scene");
	// g_game.show('zoom-fade-out');
	// g_game.addEventListener('close', function(){
	// 	console.log("游戏关闭");
	// 	g_game = null;
	// }, false);	
	plus.storage.setItem('gameUrl',args.url);
	g_game = plus.webview.create('game.html',"game_scene");	
	g_game.show('zoom-fade-out');
	
	createControlView();	
}

function exitGame(args){
	g_hall.show();
	g_game.close();
	g_game = null;
}

function application_set_clipboard(str,callBack)
{
	if(plus.os.name == "Android")
	{
		var Context = plus.android.importClass("android.content.Context");
		var main = plus.android.runtimeMainActivity();  
		var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);  
		plus.android.invoke(clip,"setText",str);  
		callBack({result:0});
		// return plus.android.invoke(clip,"getText");  
	}
	else if(plus.os.name == "iOS")
	{
		var UIPasteboard  = plus.ios.importClass("UIPasteboard");  
		var generalPasteboard = UIPasteboard.generalPasteboard();  
		// 设置/获取文本内容:  
		generalPasteboard.setValueforPasteboardType(str, "public.utf8-plain-text");  
		callBack({result:0});
		// var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");  
	}
}

/**
 * 打开支付宝
 */
function application_open_alpay()
{
	// 判断平台  
	if (plus.os.name == 'Android') {  
		plus.runtime.launchApplication(  
			{  
				pname: 'com.taobao.taobao'  
			},  
			function(e) {  
				console.log('Open system default browser failed: ' + e.message);  
			}  
		);  
	} else if (plus.os.name == 'iOS') {  
		plus.runtime.launchApplication({ action: 'taobao://' }, function(e) {  
			console.log('Open system default browser failed: ' + e.message);  
		});  
	}  

}
/**
 * 打开微信
 */
function application_open_wx()
{
	// 判断平台  
	if (plus.os.name == 'Android') {  
		plus.runtime.launchApplication(  
			{  
				pname: 'com.tencent.mm'  
			},  
			function(e) {  
				console.log('Open system default browser failed: ' + e.message);  
			}  
		);  
	} else if (plus.os.name == 'iOS') {  
		plus.runtime.launchApplication({ action: 'weixin://' }, function(e) {  
			console.log('Open system default browser failed: ' + e.message);  
		});  
	}  
}

/*
	打开一个弹窗
	content 内容，可以为HTML文本
	title 标题，默认空
	style	样式控制，如果为null,或者不填写，为默认样式
*/
function application_layer_show(content,title,style)
{
	if(typeof(content) == 'undefined'|| content == null)
		return;
	var t;
	
	if(typeof(title) == 'undefined'|| title == null)
		t = false;
	else
		t = title;
		
	if(typeof(style) != 'object'|| style == null)
	{
		layer.open({
		  type: 2,
		  title: t,
		  shadeClose: true,
		  shade: 0.8,
		  area: ['90%', '90%'],
		  anim: 2,
		  content: content  //url
		});
		return;
	}
	
	var s = style;	
	s.content = content;	
	layer.open(s);
}

	