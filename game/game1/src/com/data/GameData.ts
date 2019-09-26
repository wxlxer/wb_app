export default class GameData
{
    private _allList:any;

    public constructor()
    {
        window['g_gameData'] = this;
        this._allList = {};
    }
    private init():void
    {
        this._allList = {};
        for(var key in GameType)
        {
            this._allList[GameType[key]] = [];            
        }
    }
    public getTypeData(type:GameType):Array<any>
    {
        return this._allList[type];
    }
    public addTypeData(type:GameType,data:Array<any>):void
    {
        var arr:Array<GameItemData> = this._allList[type];
        if(arr == null)
        {
            arr = [];
            this._allList[type] = arr;
        }
        for(var obj of data)
        {
            var item:GameItemData = new GameItemData();
            item.parse(obj);
            arr.push(item);
        }
    }
    public parse(list:Array<any>):void
    {
        this.init();
        for(var obj of list)
        {
            if(!obj.is_open)
                continue;
            var item:GameItemData = new GameItemData();
            item.res = this.getIconUrl(obj.onlyImg);
            item.name = obj.name;

            var plattypes:Array<string> = obj.plattype.split(",");
            var type:GameType;
            for(var str of plattypes)
            {
                switch(str) //类型(game:电子,live:真人,sport:体育,lottery:彩票,fish:捕鱼,chess:棋牌,liuhecai:六合彩)
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
                        var str1:string = str.split("|")[0];
                        if(str1 == "sport")
                        {
                            type = GameType.Sport;
                        }
                        break;    
                }
                this._allList[type].push(item);
            }

            if(obj.ifhot)
            {
                this._allList[GameType.Hot].push(item);
            }
            
        }
    }   
    public getSubTypes(type:GameType):{titles:{key:string,value:string},list:Array<GameItemData>}
    {
        var result:{titles:{key:string,value:string},list:Array<GameItemData>} = {
            titles : {key: "",value:""},
            list :[]
        }
        var arr:Array<GameItemData> = this._allList[type];
        

        return result;
    }
    private getIconUrl(onlyImg:string) :string
    {
        var platform:string = "";
        var url:string = GameVar.s_domain + "/img/imgPC/" + platform +"/" + onlyImg +".png";
        return url;
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

export enum GameType
{
    Hot = 0,
    QiPai = 1,
    Fish = 2,
    DianZi = 3,
    ZhenRen = 4,
    Sport = 5
}