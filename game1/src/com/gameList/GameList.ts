import { GameType, GameItem, g_gameData } from "../data/GameData";

export default class GameList extends Laya.Sprite
{
    private _list:Array<Laya.Image>;
    private _type:GameType;
    public constructor(type:GameType)
    {
        super();
        this._list = []
        this._type = type;

        //var arr:Array<GameItem> = g_gameData
    }


}