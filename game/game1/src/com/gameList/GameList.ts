import GameData, { GameType, GameItemData, g_gameData } from "../data/GameData";
import { g_uiMgr } from "../UiMainager";

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
export class GameListMgr extends Laya.Sprite
{    
    private _panel:Laya.Panel;
    
    private _num:number = 5;        //一行最少个数

    private _tweens:Array<Laya.Tween>;
    public constructor(panel:Laya.Panel)
    {
        super();
        this._panel = panel;
        this._tweens = [];
    }

    public updateList(type:GameType,isAnimation:boolean):void
    {
        var content:Laya.Sprite = this._panel.content;
        
        for(var tw of this._tweens)
        {
            Laya.Tween.clear(tw);
        }
        this._tweens.length = 0;        
        content.removeChildren();

        var arr:Array<GameItemData> = g_gameData.getTypeData(type);
        if(arr == null)
        {
            g_uiMgr.showMiniLoading();

            return;
        }
        g_uiMgr.closeMiniLoading();
        
        var num:number = Math.floor(arr.length / 2);
        var size:number = Math.max(num,this._num);
        var len:number = arr.length;
        for(var i:number = 0; i < len; i++)
        {
            var icon:GameIcon = new GameIcon();            
            content.addChild(icon);
            icon.setData(arr[i]);
            var col:number = i % size;
            var row:number = Math.floor(i / size);
            icon.y = row * (icon.height + 10);
            var tx:number = col * (icon.width + 50);
            if(!isAnimation)
            {
                icon.x = tx;
            }
            else
            {
                icon.x = Laya.stage.width - this._panel.left;
                this._tweens.push(Laya.Tween.to(icon,{x:tx},100));
            }
        }
    
    }
}

export class GameIcon extends Laya.Image
{
    private _gameData:GameItemData;
    public constructor()
    {
        super();
        this.width = this.height = 140;
    }   
    public setData(gameData:GameItemData):void
    {
        
        this._gameData = gameData;
        var source = Laya.Loader.getRes(gameData.res);
        if(source != null)
        {
            this.source = source;
        }
        else
        {
            this.skin = "icons/placeholder.png";
            Laya.loader.load(gameData.res,Laya.Handler.create(this,this.onResLoaded))
        }
        this.mouseEnabled = true;
        this.on(Laya.Event.CLICK,this,this.onClickGame);
    }
    private onResLoaded():void
    {
        this.skin = this._gameData.res;
    }
    private onClickGame(evt:Laya.Event):void
    {
        console.log("enterGame" + this._gameData.name);

        g_signal.dispatch("enterGame",this._gameData);
    }
}