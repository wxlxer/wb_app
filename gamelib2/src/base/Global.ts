/**
 * @global
 * loading界面
 * @type {gamelib.loading.LoadingModule}
 */
var g_loading:gamelib.loading.LoadingModule;
/**
 * 全局信号对象
 * @global 
 * @type {gamelib.core.Signal}
 */
var g_signal:gamelib.core.Signal;
/**
 * 网络模块
 * @global
 * @type {gamelib.core.GameNet}
 */
var g_net:gamelib.core.GameNet;
/**
 * ui管理器
 * @global
 * @type {gamelib.core.UiMainager}
 */
var g_uiMgr:gamelib.core.UiMainager;
/**
 * 子游戏模块，控制子游戏的进入与退出
 * @type {gamelib.childGame.ChildGame}
 * @global
 */
var g_childGame:gamelib.childGame.ChildGame;
/**
 * 主游戏入口实例
 * @type {gamelib.core.GameMain}
 * @global
 */
var g_gameMain:gamelib.core.GameMain;
/**
 * 棋牌圈公共模块
 * @type {gamelib.common.QpqCommonModule}
 * @global
 */
var g_qpqCommon:gamelib.common.QpqCommonModule;
/**
 * 层级管理
 * @type {gamelib.core.LayerManager}
 * @global
 */
var g_layerMgr:gamelib.core.LayerManager;
/**
 * 顶层容器
 * @type {laya.display.Sprite}
 * @global
 */
var g_topLayaer:laya.display.Sprite;
/**
 * 网络数据配置文件数据
 * @type {gamelib.data.NetConfigDatas}
 * @global
 */
var g_net_configData:gamelib.data.NetConfigDatas;
/**
 * 声音管理器
 * @type {gamelib.core.SoundManager}
 * @global
 */
var g_soundMgr:gamelib.core.SoundManager;
/**
 * 自定义弹框管理器
 * @type {gamelib.core.DialogManager}
 * @global
 */
var g_dialogMgr:Laya.DialogManager;//gamelib.core.DialogManager;
/**
 * 资源载入器
 * @type {gamelib.core.MyLoaderManager}
 * @global
 */
var g_loaderMgr:gamelib.core.MyLoaderManager;
/**
 * 动画控制器
 * @type {gamelib.control.Animation}
 * @global
 */
var g_animation:gamelib.control.Animation;
/**
 * @global
 * 屏幕适配用到的缩放比例
 * 根据屏幕尺寸和游戏设计尺寸，算出最小的缩放比例，就是g_scaleRatio；
 * 然后把g_layerMgr，和dialogManager缩放g_scaleRatio；
 * 最后在具体的ui界面中。x或者y方向扩展剩下的尺寸
 * 如屏幕尺寸为1668 1334。则对应的xScale= 1668 / 1280 = 1.30，yScale= 1334 / 720 = 1.85;
 * g_scaleRatio = min(xScale,yScale) = 1.30;
 * 具体ui.size(1280,Laya.stage.height/g_scaleRatio);
 * 
 * @type {number}
 */
var g_scaleRatio:number = 1;    //
/**
 * 缩放是以哪个方向为标准，如果是x则x，y方向的保持缩放比缩放，y方向要拉伸剩余的尺寸
 * @type {string}
 */
var g_scaleXY:string = "x";  
/**
 * 按钮音效
 * @global
 * @type {string} 
 * @default "button"
 */
var g_buttonSoundName:string = "button";
/**
 * 关闭按钮音效
 * @type {string}
 * @global
 * @default "close"
 */
var g_closeUiSoundName:string = "close";

var g_gamesInfo:gamelib.base.GamesInfo;
// /**
//  * 当前游戏的资源版本号
//  * @global
//  * @type {string}
//  */
// var g_game_ver_str:string;
// /**
//  * 主游戏的资源版本号
//  * @type {string}
//  */
// var g_game_ver_str_qpq:string;


/**
 * 协议文件类型
 * @type {string}
 */
var g_protocols_type:string = "xml";
/**
 * 平台数据
 * @type {any}
 * @global
 */
var g_platformData:any;

/**
 * @function
 * 获取当前游戏对应的样式id
 * @return {number} [description]
 */
function getStyleIndex():number
{
    return 0;
}

/**
 * @function
 * 获得当前游戏样式的前缀路径
 * @return {string} [description]
 */
function getStylePath():string
{
    return '';
}
/**
 * 发送协议
 * @function sendNetMsg
 * @DateTime 2018-03-16T12:27:54+0800
 * @param    {number}                 msgId   [description]
 * @param    {type}                 ...args [description]
 */
function sendNetMsg(msgId:number,...args)
{
    g_net.socket.sendDataByArgs(msgId,args);
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['sendNetMsg'] = sendNetMsg;
}
/**
 * 播放按钮音效
 * @global
 * @function playButtonSound
 * @DateTime 2018-03-16T12:28:12+0800
 */
function playButtonSound():void
{
    playSound_qipai(g_buttonSoundName,1,null,true);
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['playButtonSound'] = playButtonSound;
}

/* 播放关闭音效
* @global
* @function playButtonSound
* @DateTime 2018-03-16T12:28:12+0800
*/
function playCloseSound():void
{
   playSound_qipai(g_closeUiSoundName,1,null,true);
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
   window['playCloseSound'] = playCloseSound;
}
/**
 * 获取服务器登录后到当前调用时消耗的时间
 * @function
 * @DateTime 2018-04-23T15:35:53+0800
 * @return   {number}                 [description]
 */
function getTimer():number
{
    return Laya.timer.currTimer - GameVar.s_loginClientTime;
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['getTimer'] = getTimer;
}
/**
 * 播放游戏音效
 * @global
 * @function playSound_qipai
 * @DateTime 2018-03-16T12:28:35+0800
 * @param    {string}                 name     音效名
 * @param    {number} [loops= 1]     播放次数
 * @param    {laya.utils.Handler}     complete 播放完成的回掉
 */
function playSound_qipai(name:string,loops:number = 1,complete?:laya.utils.Handler,isCommon:boolean = false):void
{
    g_soundMgr.playSound(name,loops,complete,isCommon);
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['playSound_qipai'] = playSound_qipai;
}
/**
 * 停止音效
 * @global
 * @function stopSound_qipai
 * @DateTime 2018-03-16T12:29:47+0800
 * @param    {string}                 name [description]
 */
function stopSound_qipai(name:string):void
{
    g_soundMgr.stopSound(name);
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['stopSound_qipai'] = stopSound_qipai;
}
/**
 * @global
 * @function getChildByName
 * 获取容器中的指定名字的节点
 * @param target 
 * @param name  "box.box1.txt_id"
 * @returns {any}
 */
function getChildByName(target:laya.display.Node,name:string):any
{
    var arr:Array<string> = name.split(".");
    for(var i:number = 0; i < arr.length; i++)
    {
        target = target.getChildByName(arr[i]);
        if(target == null)
        {
            return null;
        }
    }
    return target;
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['getChildByName'] = getChildByName;
}

var s_lanConif:any;
function getDesByLan(des:string):string
{
    if(s_lanConif == null)
        return des;
    console.log("des:" + des);
    return s_lanConif[des] || des;
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['getDesByLan'] = getDesByLan;
}
function isMultipleLans():boolean
{
    var arr:Array<string> = GameVar.g_platformData['multiple_lans'];
    return arr != null
}
function getGameResourceUrl(res:string,game_code?:string):string
{
    game_code = game_code || GameVar.s_namespace;
    return g_gamesInfo.getUrlContainVersionInfo(GameVar.resource_path + "resource/" + game_code +"/"+ res);
    // return GameVar.resource_path + "resource/" + game_code +"/"+ res + g_game_ver_str;
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['getGameResourceUrl'] = getGameResourceUrl;
}

function getCommonResourceUrl(res:string):string
{
    return g_gamesInfo.getUrlContainVersionInfo(GameVar.common_ftp + res);
    // return GameVar.common_ftp + res + g_game_ver_str_qpq;
}
if(Laya.Browser.onMiniGame || window["GameGlobal"])
{
    window['getCommonResourceUrl'] = getCommonResourceUrl;
}

function getGame_zone_info(game_code:string|number):any
{
    if(typeof game_code == "number")
    {
        for(var key in window['game_zone_info'])
        {
            if(window['game_zone_info'][key].gz_id == game_code)
                return window['game_zone_info'][key];
        }
        return null;
    }
    else
    {
        if(window['game_zone_info'][game_code] == null)
        {
            console.log(game_code +" 分区信息不存在!");
        }
       return window['game_zone_info'][game_code];    
    }
}
if(Laya.Browser.onMiniGame || window["GameGlobal"]){
    window['getGame_zone_info'] = getGame_zone_info;
}

function navigateToURL(url:string):void
{
    if(window['application_open_url'])
    {
        window['application_open_url'](url);
    }
    else if(window['application_layer_show'])
    {
        window['application_layer_show'](url);
    }
    else
    {
         Laya.Browser.window.location.href = url;
    }
}