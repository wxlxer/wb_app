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


	