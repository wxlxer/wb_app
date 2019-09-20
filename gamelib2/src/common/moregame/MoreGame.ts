module  gamelib.common.moregame
{
    export var s_debug:boolean = false;
   
    /**
     * 金币场ui。微棋牌圈的界面
     * @class MoreGame
     */
    export class MoreGame extends gamelib.core.BaseUi
    {
        private _list:laya.ui.List;

        private _selected_game:any;
        private _selected_box:laya.ui.Box;
        public constructor()
        {
            super("qpq.ui.Art_MoreGameUI");
        }
        public init():void
        {            
            this._res['img_2'].visible = false;
            var list:Array<any> = [];
            // var temp:any = Laya.loader.getRes(GameVar.common_ftp + "hall/moregame.json" + g_game_ver_str);
            // var temp:any = Laya.loader.getRes(GameVar.common_ftp + "hall/moregame.json" + g_game_ver_str);
            // temp = temp[GameVar.platform];
            var temp = {games:[]};
            var base:string = "";
            if(GameVar.s_game_id == 5)     //棋牌圈
                base = "icons_2";
            else
                base = "icons_1";
            base = base || "";

            this._list = this._res["list_1"];

            if(temp != null)
            {
                for(var i:number = 0; i < temp.games.length; i++)
                {
                    var obj:any = temp.games[i];
                    if(obj.gameId == GameVar.s_game_id)
                        continue;
                    g_childGame.addGameIdConfig(obj.gz_id,obj.gameId,obj.isLaya);
                    obj.url = GameVar.common_ftp + "hall/" + base +"/"  + obj.res;
                    list.push(obj);
                }
            }
            this._list.selectEnable = true;
            this._list.selectHandler = Laya.Handler.create(this,this.onListSelecet,null,false);
            this._list.renderHandler = Laya.Handler.create(this,this.onListRender,null,false);
            this._list.dataSource = list;
            this._list.scrollBar.autoHide = true;
            // this._list.itemRenderer = MoreGameItem
            // this._list.dataProvider = new eui.ArrayCollection(list);
        }

        protected onListRender(cell:laya.ui.Box,index:number):void
        {
            var game:laya.ui.Image = getChildByName(cell,'img_game');
            var iMask:laya.ui.Image = getChildByName(cell,'img_mask');
            var iIcon:laya.ui.Image = getChildByName(cell,'img_icon');
            var jd:laya.ui.Label = getChildByName(cell,'txt_jd');
            var name_txt:laya.ui.Label = getChildByName(cell,'txt_game');
            cell['txt_jd'] = jd;
            
            var gamedata:any = this._list.dataSource[index];
            game.skin = gamedata.url;
            name_txt.text = gamedata.name;
            jd.text = "";
            iIcon.visible = false;
            jd.visible = iMask.visible = false;
            getChildByName(cell,'img_jisu').visible = false;

            var arcMask:control.ArcMask = cell['arcmask'];
            arcMask = arcMask || new control.ArcMask(iMask.width * 1.4);
            arcMask.pre = 0;
            arcMask.y = arcMask.x = iMask.width / 2;
            cell['arcmask'] = arcMask;
            iIcon.mask = arcMask;
        }

        private onListSelecet(index:number):void
        {
            if(index == -1)
              return;
            this._selected_game = this._list.dataSource[index];

            if(s_debug || utils.tools.isApp() && checkLoaderValid())
            {
                addWatch(COMPLETE,this.onGameCached,this);
                addWatch(UPDATE,this.onLoaderProcess,this);
                startLoad(this._selected_game.gz_id);
            }
            else
            {
                this.enterGame();
            }


        }
        private enterGame():void 
        {
            if(this._selected_game == null)
               return;
            g_childGame.enterGameByClient(this._selected_game.gz_id);
            this.close();
        }

        private onGameCached(loader:PreLoad):void
        {
            for(var i:number = 0; i < this._list.dataSource.length; i++)
            {
                if(loader.gz_id == this._list.dataSource[i].gz_id)
                {
                    var box:Laya.Box = this._list.cells[i];
                    var iMask:laya.ui.Image = getChildByName(box,'img_mask');
                    var iIcon:laya.ui.Image = getChildByName(box,'img_icon');
                     var jd = getChildByName(box, 'txt_jd');
                    iMask.visible = iIcon.visible = false;
                    jd.text = "";
                    break;
                }
            }
            if(loader.gz_id == this._selected_game.gz_id) 
            {
                this.enterGame();
            }
        }
        private onLoaderProcess(loader:PreLoad):void 
        {
            for(var i:number = 0; i < this._list.dataSource.length; i++)
            {
                if(loader.gz_id == this._list.dataSource[i].gz_id)
                {
                    var box:Laya.Box = this._list.cells[i];
                    var iMask:laya.ui.Image = getChildByName(box,'img_mask');
                    var iIcon:laya.ui.Image = getChildByName(box,'img_icon');
                    iMask.visible = iIcon.visible = true;

                    box['arcmask'].pre = loader.curValue;
                    box["txt_jd"].text = loader.toPercent();
                    box["txt_jd"].visible = true;
                    return;
                }
            }
            
        }
    }
}
//     export class MoreGameItem extends eui.ItemRenderer {
//         private _mask:control.ArcMask;
//         public constructor() {
//             super();
//             this.skinName = "GameHall_itemSkin";
//         }
//         public dataChanged():void
//         {
//             this["txt_txt"].text = this.data["name"];
//             this["gameicon"].source = this.data["url"];
//             this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickItem,this);
//             this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickItem,this);
//             if(this["barG"]) {
//                 this["barG"].visible = false;
//                 this._mask = new gamelib.control.ArcMask(64);
//                 this["bar_mask"].source = this._mask;
//                 this._mask.x = this['bg'].width / 2;
//                 this._mask.y = this['bg'].height / 2;
//                 this["barG"].addChild(this._mask);
//                 this["bar"].mask = this._mask;
//             }
//         }
//         private onClickItem(evt:egret.TouchEvent):void
//         {
//             if(PreLoad.checkCacheValid(this.data.gz_id)) {
//                 this.enterGame();
//             } else {
//                 PreLoad.addWatch(PreLoad.COMPLETE,this.onLoaded,this);
//                 PreLoad.addWatch(PreLoad.UPDATE,this.onLoaderProcess,this);
//                 PreLoad.startLoad(this.data.gz_id);
//                 if(this["barG"]) {
//                     this["barG"].visible = true;
//                 }
//             }
//         }
//         private onLoaderProcess(loader:PreLoad):void {
//             if(loader.gz_id == this.data.gz_id) {
//                 if(this._mask) {
//                     this._mask.pre = loader.curValue;
//                     this["txt_jd"].text = loader.toPercent();
//                 }
//             }
//         }
//         private onLoaded(loader:PreLoad):void {
//             if(loader.gz_id == this.data.gz_id) {
//                 this.enterGame();
//             }
//         }
//         private enterGame():void {
//             g_uiMgr.showMiniLoading();
//             g_child.enterGameByClient(this.data.gz_id);
//         }
//     }
// }

