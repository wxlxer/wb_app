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

var g_net:gamelib.core.GameNet;

/**
 * 主游戏入口实例
 * @type {gamelib.core.GameMain}
 * @global
 */
var g_gameMain:gamelib.core.GameMain;
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

// function getGameResourceUrl(res:string,game_code?:string):string
// {
//     game_code = game_code || GameVar.s_namespace;
//     return g_gamesInfo.getUrlContainVersionInfo(GameVar.resource_path + "resource/" + game_code +"/"+ res);
//     // return GameVar.resource_path + "resource/" + game_code +"/"+ res + g_game_ver_str;
// }
// if(Laya.Browser.onMiniGame || window["GameGlobal"]){
//     window['getGameResourceUrl'] = getGameResourceUrl;
// }

// function getCommonResourceUrl(res:string):string
// {
//     return g_gamesInfo.getUrlContainVersionInfo(GameVar.common_ftp + res);
//     // return GameVar.common_ftp + res + g_game_ver_str_qpq;
// }
// if(Laya.Browser.onMiniGame || window["GameGlobal"])
// {
//     window['getCommonResourceUrl'] = getCommonResourceUrl;
// }

function navigateToURL(url:string):void
{
    if(window['application_open_url'])
    {
        window['application_open_url'](url);
    }
    else
    {
        Laya.Browser.window.location.href = url;
    }
}