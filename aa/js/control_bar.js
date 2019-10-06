let g_control_bar = null;
let g_control_bar_data = {
	id:"control_bar_id",
	itemWidth : 80,
	itemHeight : 80,
	gapWidth : 80,
	clientWidth : document.documentElement.clientWidth,     
	clientHeight : document.documentElement.clientHeight,  
	_left : 10,
	_top : 10
};		
// 创建原生View控件
function createControlView(){
	if(g_control_bar == null)		
	{
		g_control_bar = new plus.nativeObj.View(g_control_bar_data.id,
			{top:g_control_bar_data._top + 'px',left:g_control_bar_data._left + 'px',height:g_control_bar_data.itemHeight + 'px',width:g_control_bar_data.itemWidth + 'px'},
		);
		g_control_bar.drawBitmap('img/ic_back_home.png');
		
		g_control_bar.addEventListener("click", onClick, false);
		g_control_bar.addEventListener("touchend", onTouchEnd, false);
		g_control_bar.addEventListener("touchmove", onTouchMove, false);
		
	}
	g_control_bar_data.clientWidth =  document.documentElement.clientWidth;     
	g_control_bar_data.clientWidth =  document.documentElement.clientWidth;     
	g_control_bar_data._top = g_control_bar_data._left = 10;
	g_control_bar.setStyle({top: g_control_bar_data._top + 'px',left:g_control_bar_data._left + 'px'});
	g_control_bar.show();
}

// 监听事件函数
function onClick(e){
	// console.log("点击原生控件："+JSON.stringify(e));
	// var clientX = e.clientX;	// 在View控件中的X坐标
	// var clientY = e.clientY;	// 在View控件中的Y坐标
	// var pageX = e.pageX;		// 在当前Webview窗口（运行此脚本的窗口）中的X坐标
	// var pageY = e.pageY;		// 在当前Webview窗口（运行此脚本的窗口）中的Y坐标
	// var screenX = e.screenX;	// 在屏幕中的X坐标
	// var screenY = e.screenY;	// 在屏幕中的Y坐标
	// var target = e.target;		// View控件对象
	let app = plus.webview.getWebviewById(plus.runtime.appid);
	plus.nativeUI.confirm("返回游戏大厅?",function(e){
		g_control_bar.hide();
		if(e.index == 0)
		{
			app.evalJS("exitGame();");	
		}
	},{
		"title":"提示",
		"buttons":["确定","取消"]		
	})
	
	
	
}
function onTouchEnd(evt){
	if (g_control_bar_data._left > g_control_bar_data.clientWidth/2) {
		 g_control_bar_data._left = g_control_bar_data.clientWidth - g_control_bar_data.itemWidth - g_control_bar_data.gapWidth;
	 } else {          
		 g_control_bar_data._left = g_control_bar_data.gapWidth;        
	 }  					
	g_control_bar.setStyle({top: g_control_bar_data._top + 'px',left:g_control_bar_data._left + 'px'});
}
function onTouchMove(evt){
	console.log("onTouchMove："+JSON.stringify(evt));
	g_control_bar_data._left = evt.screenX - g_control_bar_data.itemWidth / 2;
	g_control_bar_data._top = evt.screenY - g_control_bar_data.itemHeight / 2;
	if(g_control_bar_data._left < 0)
		_left = 0;
	else if(g_control_bar_data._left > g_control_bar_data.clientWidth - g_control_bar_data.itemWidth)
		g_control_bar_data._left = g_control_bar_data.clientWidth - g_control_bar_data.itemWidth;
	if(g_control_bar_data._top < 0)
		g_control_bar_data._top = 0;
	else if(g_control_bar_data._top > g_control_bar_data.clientHeight - g_control_bar_data.itemHeight)
		g_control_bar_data._top = g_control_bar_data.clientHeight - g_control_bar_data.itemHeight;
	g_control_bar.setStyle({top: g_control_bar_data._top + 'px',left:g_control_bar_data._left + 'px'});
}