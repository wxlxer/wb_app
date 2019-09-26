console.log("进来了");

//1、下载配置文件
//2、检测登录
//3、进入游戏


//登录模块
//调整游戏模块
let g_hall = plus.webview.create('hall1.html', 'hall', {
		scrollIndicator: 'none',
		scalable: false,
		popGesture: 'close',
		backButtonAutoControl: 'close'
		
	});
	g_hall.addEventListener('close', function(){
		console.log("大厅关闭");
	}, false);
	
	console.log("11111111111111111111"); 
	g_hall.show('zoom-fade-out');

let g_game = null;

function enterGame(args)
{
	console.log(args);
	g_hall.hide();
	g_game = plus.webview.create("game.html","game");
	g_game.show('zoom-fade-out');
	g_game.addEventListener('close', function(){
		console.log("游戏关闭");
		g_game = null;
	}, false);	
}

function exitGame(args){
	console.log(args);
	g_hall.show();
	g_game.close();
}


	