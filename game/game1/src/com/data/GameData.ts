export default class GameData
{
    private _allList:any;

    private init():void
    {
        this._allList = {};
        for(var key in GameType)
        {
            this._allList[GameType[key]] = [];            
        }
    }
    public getTypeData(type:number):Array<any>
    {
        return this._allList[type];
    }
    
    public parse(list:Array<any>):void
    {
        this.init();
        for(var obj of list)
        {
            if(!obj.is_open)
                continue;
            var item:GameItem = new GameItem();
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
    public getSubTypes(type:GameType):{titles:{key:string,value:string},list:Array<GameItem>}
    {
        var result:{titles:{key:string,value:string},list:Array<GameItem>} = {
            titles : {key: "",value:""},
            list :[]
        }
        var arr:Array<GameItem> = this._allList[type];
        

        return result;
    }
    private getIconUrl(onlyImg:string) :string
    {
        var platform:string = "";
        var url:string = GameVar.s_domain + "img/imgPC/" + platform +"/" + onlyImg +".png";
        return url;
    }
    
}
export var g_gameData:GameData = new GameData();

export class GameItem
{
    public res:string;
    public gameUrl:string;
    public name:string;
}

export enum GameType
{
    Hot = "hot",
    QiPai = "qipai",
    Fish = "fish",
    DianZi = "dianzi",
    ZhenRen = "zhenren",
    Sport = "sport"
}