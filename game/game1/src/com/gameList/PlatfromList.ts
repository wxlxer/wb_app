import BasePanel from "../BasePanel";
import TabList from "../control/TabList";
import { GameType, PlatformData, GameItemData, g_gameData, BigTypeData } from "../data/GameData";
import { g_uiMgr } from "../UiMainager";
import { GameIcon } from "./GameList";

export default class PlatfromList extends BasePanel
{
    private _tab:TabList;

    private _box:Laya.Box;

    private _panel:Laya.Panel;

    private _title:Laya.Image;      //bgs/ic_dz_title.png;

    private _txt:Laya.Label;

    private _txt_input:Laya.Label;

    private _pfds:Array<PlatformData>;

    private _tweens:Array<Laya.Tween>;
    public constructor()
    {
        super("ui.SubGameListUI");
    }
    protected init():void
    {
        this._tab = new TabList(this._res['list_tab']);
        this._tab.tabChangeHander = Laya.Handler.create(this,this.onTabChange,null,false);
        this._tab.setItemRender(Laya.Handler.create(this,this.onTabItemRender,null,false));
        
        this._title = this._res['img_title'];
        this._panel = this._res['p_1'];
        this._box = <Laya.Box>this._panel.content;
        this._txt = this._res['txt_info'];
        this._txt_input = this._res['txt_input']
        this.addBtnToListener("btn_search");

        this._tweens = [];
    }
    
    public setData(data:any):void
    {
        if(data.type == GameType.QiPai)
        {
            this._title.skin = "bgs/ic_qipai_title/png";
        }
        else
        {
            this._title.skin = "bgs/ic_dz_title/png";
        }

        var big:BigTypeData = g_gameData.getTypeData(data.type);
        var list:Array<PlatformData> = <Array<PlatformData>>big.list;
        var ds:Array<any> = [];
        this._pfds = [];
        for(var pfd of list)
        {
            ds.push({
                label:pfd['api_mainname'],
                "colors":["#DDB47A","#503215"],
                icon:pfd.icon
            })
            this._pfds.push(pfd);
        }
        this._tab.dataSource = ds;

        var index:number = list.indexOf(data.pd);
        if(index == -1)
            index = 0;
        this._tab.selectedIndex = index;

    }
    private onTabItemRender(box:Laya.Box,index:number,data:any):void
    {
        var icon:Laya.Image = getChildByName(box,'game_icon');
        icon.skin = data.icon;
    }
    private _isFirst:boolean = true
    private onTabChange(index:number):void
    {
        console.log("选中的“：" + index);
        var pfd:PlatformData = this._pfds[index];
        if(pfd.games.length == 0)
        {
            //请求平台对应的游戏;
            g_net.requestWithToken(gamelib.GameMsg.Getapigame,{game:pfd['api_name'],gametype:0,pageSize:50,pageIndex:0});
            return;
        }
        this.showGames(pfd.games,index == 0 && this._isFirst);
        this._isFirst = false;
        g_uiMgr.closeMiniLoading();

    }
    private showGames(arr:Array<GameItemData>,isAnimation:boolean):void
    {
        this._box.removeChildren();

        var num:number = Math.floor(arr.length / 2);
        var size:number = 3;
        var len:number = arr.length;
        for(var i:number = 0; i < len; i++)
        {
            var icon:GameIcon = new GameIcon();            
            this._box.addChild(icon);
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

   
}