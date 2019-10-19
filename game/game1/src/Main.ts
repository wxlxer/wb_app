import GameConfig from "./GameConfig";
import { ui } from "./ui/layaMaxUI";
import Hall from "./com/Hall";
import MiniLoadingUi from "./com/MiniLoadingUi";
import { g_gameData } from "./com/data/GameData";
class Main  extends gamelib.core.GameMain
{
	constructor() {
		super();
		var arr:Array<any> = [];
		arr.push({url:"atlas/comp.atlas",type:Laya.Loader.ATLAS});
		arr.push({url:"atlas/bgs.atlas",type:Laya.Loader.ATLAS});
		arr.push({url:"atlas/btns.atlas",type:Laya.Loader.ATLAS});
		arr.push({url:"atlas/icons.atlas",type:Laya.Loader.ATLAS});
		Laya.loader.load(arr,Laya.Handler.create(this,this.onResloaded));


	}

    protected onResloaded(): void {
		super.onResloaded();

		GameVar.s_domain = "http://show2.bodemo.vip";
		//加载IDE指定的场景
		//GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);

		// var main:ui.HallUiUI = new ui.HallUiUI();
		// main.width = Laya.stage.width;
		// main.height = Laya.stage.height;
		// Laya.stage.addChild(main);
		ui.ChongZhiHistroyUI;

		var main:Hall = new Hall();
		main.show();


		window['g_gameData'] = g_gameData;
	}
}
//激活启动类
new Main();
