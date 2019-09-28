import GameData, { GameType, GameItemData, g_gameData, BigTypeData, PlatformData } from "../data/GameData";
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
    }
}
export class GameListMgr extends Laya.Sprite
{    
    private _panel:Laya.Panel;

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

        var bigType:BigTypeData = g_gameData.getTypeData(type);
        if(bigType == null)
        {
            this.requestDataByType(type);
            return;
        }
        g_uiMgr.closeMiniLoading();
        var arr:Array<any> = bigType.list;
        if(bigType.isGames)
        {
            this.showGames(arr,isAnimation);
        }
        else
        {
            this.showPlatforms(arr,isAnimation);
        }
    }
    private showGames(arr:Array<GameItemData>,isAnimation:boolean):void
    {
        var content:Laya.Sprite = this._panel.content;
        var num:number = Math.floor(arr.length / 2);
        var size:number = 3;
        var len:number = arr.length;
        for(var i:number = 0; i < len; i++)
        {
            var icon:GameIcon = new GameIcon();            
            content.addChild(icon);
            icon.setData(arr[i]);

            var col:number = i % size;
            var row:number = Math.floor(i / size);
            icon.y = col * (icon.height + 10);
            var tx:number = row * (icon.width + 50);
            if(!isAnimation || tx > Laya.stage.width)
            {
                icon.x = tx;
            }
            else
            {
                icon.x = Laya.stage.width - this._panel.left;
                this._tweens.push(Laya.Tween.to(icon,{x:tx},100));
            }
        }
        this._panel.refresh();
    }
    private showPlatforms(arr:Array<PlatformData>,isAnimation:boolean):void
    {
        var content:Laya.Sprite = this._panel.content;
        var num:number = Math.floor(arr.length / 2);
        var size:number = 2;
        var len:number = arr.length;
        for(var i:number = 0; i < len; i++)
        {
            var icon:PlatformIcon = new PlatformIcon();            
            content.addChild(icon);
            icon.setPlatformData(arr[i]);

            var col:number = i % size;
            var row:number = Math.floor(i / size);
            icon.y = col * (icon.height + 10);
            var tx:number = row * (icon.width + 50);
            if(!isAnimation || tx > Laya.stage.width)
            {
                icon.x = tx;
            }
            else
            {
                icon.x = Laya.stage.width - this._panel.left;
                this._tweens.push(Laya.Tween.to(icon,{x:tx},100));
            }
        }

        this._panel.refresh();
    }
    private requestDataByType(type:GameType):void
    {
        g_uiMgr.showMiniLoading();
        switch(type)
        {
            case GameType.Hot:
                g_net.request(gamelib.GameMsg.Getapigame,{gametype:-3,pageSize:100,pageIndex:1});
                break;
            case GameType.Fish:
                g_net.request(gamelib.GameMsg.Getapifish,{});
                break;    
            case GameType.ZhenRen:
                g_net.request(gamelib.GameMsg.Getapifish,{});
                break;        
            default:
                g_net.request(gamelib.GameMsg.Getapi,{})    
        }
        // if(type == GameType.QiPai)
        // {
        //     g_net.request(gamelib.GameMsg.Getapi,{})
        // }
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
       this.setRes(gameData.res);
        this.mouseEnabled = true;
        this.on(Laya.Event.CLICK,this,this.onClickGame);
    }
    protected setRes(res:string):void
    {
        var source = Laya.Loader.getRes(res);
        if(source != null)
        {
            this.source = source;
        }
        else
        {
            this.skin = "icons/placeholder.png";
            Laya.loader.load(res,Laya.Handler.create(this,this.onResLoaded,[res]))
        }
    }
    private onResLoaded(res:string):void
    {
        this.skin = res;
    }
    protected onClickGame(evt:Laya.Event):void
    {
        console.log("enterGame" + this._gameData.name);
        g_signal.dispatch("enterGame",this._gameData);
    }
}
export class PlatformIcon extends GameIcon
{
    private _pfd:PlatformData;
    public constructor()
    {
        super();
        this.width = this.height = 140;
    }
    public setPlatformData(pd:PlatformData):void
    {
        this._pfd = pd;
        this.setRes(pd.res);
        this.mouseEnabled = true;
        this.on(Laya.Event.CLICK,this,this.onClickGame);
    }
    protected onClickGame(evt:Laya.Event):void
    {
        console.log("enterPlatform" + this._pfd);
        g_signal.dispatch("enterPlatform",this._pfd);
    }
}