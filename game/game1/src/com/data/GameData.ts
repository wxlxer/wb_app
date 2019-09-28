import { g_uiMgr } from "../UiMainager";

export default class GameData
{      


    private _allPlatform:any;
    private _bigData:Array<BigTypeData>;

    public constructor()
    {
        window['g_gameData'] = this;
        this._bigData = [];

        this._allPlatform = {};
    }

    public getTypeData(type:GameType):BigTypeData
    {
        return this._bigData[type];
    }
    /**
     * 
     * @param data 解析热门游戏
     */
    public parseHotGame(data:Array<any>):void
    {
        var bd : BigTypeData = this._bigData[GameType.Hot] || new BigTypeData();
        bd.type = GameType.Hot;
        var arr:Array<GameItemData> = [];
        for(var obj of data)
        {
            var item:GameItemData = new GameItemData();
            item.parse(obj);
            arr.push(item);
        }
        bd.addList(arr,true);
        this._bigData[GameType.Hot] = bd;
    }

    public parseDianZiGame(list:Array<any>,platformName:string):void
    {
        var bd : BigTypeData = this._bigData[GameType.DianZi];
        var pfd:PlatformData ;
        for(var pd of bd.list)
        {
            if(pd['api_name'] == platformName){
                pfd = <PlatformData> pd;
                break;
            }
        }
        if(pfd == null)
        {
            console.log(platformName +" 对应的平台数据不存在!" );
            return;
        }
        for(var gd of list)
        {
            var gameData:GameItemData = new GameItemData();
            gameData.parse(gd);
            pfd.games.push(gameData)
        }
       
    }
    public parseFishGame(data:Array<any>):void
    {
        var bd : BigTypeData = this._bigData[GameType.Fish] || new BigTypeData();
        bd.type = GameType.Fish;
        var arr:Array<GameItemData> = [];
        for(var obj of data)
        {
            var item:GameItemData = new GameItemData();
            item.parse(obj);
            arr.push(item);
        }
        bd.addList(arr,true);
        this._bigData[GameType.Fish] = bd;
    }
    /**
     * 
     * @param list 解析所有平台数据
     */
    public parseGetAip(list:Array<any>):void
    {
        for(var i :number = GameType.QiPai;i <= GameType.Sport ;i ++)
        {
            var bd : BigTypeData = this._bigData[i] || new BigTypeData();
            bd.type = i;
            this._bigData[i] = bd;
        }
        for(var obj of list)
        {
            if(!obj.is_open)
                continue;
            var item:PlatformData = new PlatformData();
            item.parse(obj);
            var plattypes:Array<string> = obj.plattype.split(",");
            
            for(var str of plattypes)
            {
                var types:Array<GameType> = this.getType(str);
                for(var type of types)
                {
                    this.addPlatform(item,type);
                }
            }
            for(var key in this._allPlatform)
            {
                var arr:Array<PlatformData> = this._allPlatform[key];
                var type1:number = parseInt(key);
                var big:BigTypeData = this._bigData[type1] || new BigTypeData();
                big.type = type1;
                big.addList(arr,false);
                this._bigData[type1] = big;
            }
        }
    }  
    private getType(str:string):Array<GameType>
    {
        var result:Array<GameType> = [];
        var type;
        if(str.indexOf("|") == -1)
        {
            switch(str)   //类型(game:电子,live:真人,sport:体育,lottery:彩票,fish:捕鱼,chess:棋牌,liuhecai:六合彩)
            {
                case "game":
                    type = GameType.DianZi;
                    break;
                case "live":
                    type = GameType.ZhenRen;
                    break;
                case "sport":
                    type = GameType.Sport;
                    break;
                case "fish":
                    type = GameType.Fish;
                    break;
                case "chess":
                    type = GameType.QiPai;
                    break;
                default:
                    console.log("unknow type " + str);
                    return result;
            }
            result.push(type);
        }
        else
        {
            var arr:Array<string> = str.split("|");
            for(var ts of arr)
            {
                result = result.concat(this.getType(ts));
            }
        }
        return result;
    } 


    /**
     * 
     * @param pfd 添加平台数据
     * @param type 
     */
    private addPlatform(pfd:PlatformData,type:GameType):void
    {
        console.log("addPlatform" + type);
        this._allPlatform = this._allPlatform || {};
        var arr:Array<PlatformData> = this._allPlatform[type] || [];
        arr.push(pfd);
        this._allPlatform[type] = arr;
    }
}
export var g_gameData:GameData = new GameData();

export class GameItemData
{
    public res:string;
    public gameUrl:string;
    public name:string;

    public parse(data:any):boolean
    {
        for(var key in data)
        {
            this[key] = data[key];
        }
        this.res =  GameVar.s_domain + "/img/imgPC/" + data.api_Name +"/" + data.onlyImg +".png";
        this.name = data.chineseName;
        return true;
    }
}
export class PlatformData
{
    public res:string;
    public icon:string;
    public games:Array<GameItemData> = [];
    public parse(data:any):boolean
    {
        for(var key in data)
        {
            this[key] = data[key];
        }
        this.res =  GameVar.s_domain + "/img/appimage/" + data.api_name + ".png";
        this.icon =  GameVar.s_domain + "/img/appimage/page/" + data.api_name + ".png";
        return true;
    }
}
/**
 * 大类。包含的是游戏列表或者平台列表
 */
export class BigTypeData
{
    public type:GameType;
    public list:Array<PlatformData|GameItemData>;

    public isGames:boolean;
    public addList(arr:Array<PlatformData> | Array<GameItemData>,isGames:boolean):void
    {
        this.list = [];
        this.isGames = isGames;
        for(var temp of arr)
            this.list.push(temp);
    }
}
export enum GameType
{
    Hot = 0,
    QiPai = 1,
    Fish = 2,
    DianZi = 3,
    ZhenRen = 4,
    Sport = 5
}

export function checkLogin():boolean
{
    if(GameVar.s_token == "" || GameVar.s_token == null)
    {
        g_signal.dispatch("showLoginUi",0);
        return false;
    }
    return true;
}