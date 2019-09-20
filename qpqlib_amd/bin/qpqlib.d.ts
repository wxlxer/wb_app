/**
 * Created by wxlan on 2017/9/4.
 */
declare namespace qpq {
    var g_qpqData: qpq.data.QpqData;
    var g_configCenter: qpq.data.ConfigCenter;
    class GameManager extends gamelib.core.GameDataManager {
        readonly m_hall: HallScene;
        private _hall;
        private _toGzId;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        protected onEnterHall(): void;
        private enterChildGame(gz_id, validation);
    }
}
/**
 * Created by wxlan on 2017/9/4.
 */
declare namespace qpq {
    var s_lastShowUi: gamelib.core.BaseUi;
    var s_lastShowData: any;
    var MainUiClass: any;
    var _signalMsgMap: any;
    var _signalUiObjMap: any;
    function registrerSignalHandle(msg: string, handleClass: any, needCreate?: boolean): any;
    function signleHandle(msg: any, data: any): any;
    enum SignalMsg {
        showKeypad = "showKeypad",
        showCreateUi = "showCreateUi",
        showKeypad_Input = "showKeypad_Input",
        showTimerPicker = "showTimerPicker",
        showTableListUi = "showTableListUi",
        showTableInfo = "showTableInfo",
        showNoticeUi = "showNoticeUi",
        showHuoDongUi = "showHuoDongUi",
        showGlodGameUi = "showGlodGameUi",
        showSelectedGameUi = "showSelectedGameUi",
        showMoreGameUi = "showMoreGameUi",
        showEffortUi = "showEffortUi",
        showSigninUi = "showSigninUi",
        showBankUi = "showBankUi",
        showRnaUi = "showRnaUi",
        showRankUi = "showRankUi",
        showQrcUi = "showQrcUi",
        showBindPhoneUi = "showBindPhoneUi",
        showTuiGuangUi = "showTuiGuangUi",
        showUserInfoUi_Self = "showUserInfoUi_Self",
    }
    class HallScene extends gamelib.core.Scene {
        private _ui;
        private _createUi;
        constructor();
        onEnter(): void;
        /**
         * 服务器连接成功，可以发送协议.
         * @function
         * @DateTime 2018-07-27T12:20:15+0800
         */
        onReciveNetMsg(): void;
        onExit(): void;
        private onSignal(msg, data);
        private getMainUi();
    }
    function appShare(bTips: boolean, callBack?: Function, thisObj?: any, wx_firendCircle?: boolean): void;
    function enterGameByValidation(validation: string): void;
    function enterGameByRoomId(gz_id: number, roomId: number, game_args?: any): void;
    function enterRoom(gz_id: number, rd: any): void;
    /**
     * 通过验证码加入比赛
     * @function
     * @DateTime 2018-05-28T17:30:19+0800
     * @param    {string}                 validation [description]
     */
    function joinMatchByValidation(validation: string): void;
    function openVipPage(ignoreCheckVip?: boolean): void;
}
declare module qpq.creator {
    class CreateUi extends gamelib.core.Ui_NetHandle {
        protected _page: creator.parser.Page;
        netMsgStr: string;
        protected _consume: number;
        protected _isFree: boolean;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onLocalSignal(msg: string, data: any): void;
        protected onClickObjects(evt: laya.events.Event): void;
        protected onCreate(evt: Laya.Event): void;
        onShow(): void;
        protected updateMoney(): void;
        onClose(): void;
        setNewGame(value: boolean): void;
        updateConsume(cur: number): void;
    }
}
declare namespace qpq.creator {
    class CreateUi_Change extends gamelib.core.Ui_NetHandle {
        private _game_btn;
        protected _page: creator.parser.Page;
        netMsgStr: string;
        private _consume;
        private _isFree;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        protected onClose(): void;
        protected onLocalSignal(msg: string, data: any): void;
        protected onClickObjects(evt: laya.events.Event): void;
        protected updateMoney(): void;
        private closeSelf();
        setNewGame(value: boolean): void;
        updateConsume(cur: number): void;
    }
}
declare module qpq.creator {
    class CreateUi_Tab extends gamelib.core.Ui_NetHandle {
        protected _page: creator.parser.Page;
        netMsgStr: string;
        private _consume;
        private _isFree;
        protected _tab: laya.ui.Tab;
        protected _marklist: Array<laya.ui.Image>;
        protected _games: Array<any>;
        protected _currentGame: any;
        constructor(res?: string);
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onLocalSignal(msg: string, data: any): void;
        protected onClickObjects(evt: laya.events.Event): void;
        onShow(): void;
        protected setDatauletGame(): void;
        protected updateMoney(): void;
        protected updateTabBigSale(): void;
        protected updateBigSale(): void;
        onClose(): void;
        protected onTabChange(evt?: laya.events.Event): void;
        protected showGame(): void;
        setNewGame(value: boolean): void;
        updateConsume(cur: number): void;
    }
}
/**
 * Created by wxlan on 2017/8/8.
 */
declare namespace qpq.creator.parser {
    var g_groupWidth: number;
    var g_groupStartX: number;
    var g_posList: any;
    var groupHeight: number;
    var rowHeight: number;
    var side_label_style_default: any;
    var colors: {
        title: string;
        button: string;
        label: string;
    };
    var sizes: {
        font_size: number;
        title_size: number;
    };
    var g_evtDispatcher: gamelib.core.Signal;
    var evt_ItemClick: string;
    var evt_UpdateRoundCost: string;
    class Group extends laya.display.Sprite {
        protected _title: laya.display.Text;
        protected _items: Array<NodeItem>;
        protected _type: string;
        protected _config: any;
        protected _bg: Laya.Image;
        protected _currentClickItem: qpq.creator.parser.NodeItem;
        m_page: Page;
        constructor(config: any);
        protected setDefaultValue(): void;
        /**
         * 设置数据值，仅用于应用用户习惯
         **/
        setValue(node_name: string, value: number): void;
        toControl(node_name: string, value: number): void;
        enabled: boolean;
        value: number;
        label: string;
        protected build(): void;
        protected updateBgSize(): void;
        getConfig(): any;
        getNodes(): any;
        show(): void;
        close(): void;
        destroy(): void;
        readonly type: string;
        hasChild(name: string): boolean;
        getChild(name: string): NodeItem;
        protected onItemChange(evt: laya.events.Event): void;
        protected onValueChange(): void;
        private createBackGround();
    }
}
declare namespace qpq.creator.parser {
    class AttributeGroup extends Group {
        constructor(config: any);
        setValue(node_name: string, value: number): void;
    }
}
/**
 * Created by wxlan on 2017/8/8.
 */
declare namespace qpq.creator.parser {
    /**
     * 单选框
     */
    class ChooserGroup extends Group {
        constructor(config: any);
        toControl(node_name: string, value: number): void;
        readonly value: number;
        setValue(node_name: string, value: any): void;
        protected setDefaultValue(): void;
        protected onItemChange(evt: laya.events.Event): void;
        protected chooseAt(index: number): void;
    }
}
/**
* 默认设置组
*/
declare namespace qpq.creator.parser {
    class DefaultGroup extends Group {
        constructor(config: any);
        setValue(node_name: string, value: number): void;
        toControl(node_name: string, value: number): void;
        protected build(): void;
        hasChild(name: string): boolean;
        getChild(name: string): NodeItem;
        getNodes(): Array<NodeItem>;
        protected setDefaultValue(): void;
    }
}
/**
 * Created by wxlan on 2017/8/21.
 */
declare namespace qpq.creator.parser {
    class InputGroup extends Group {
        constructor(config: any);
        protected setDefaultValue(): void;
        toControl(node_name: string, value: number): void;
    }
}
/**
 * Created by wxlan on 2017/8/21.
 */
declare namespace qpq.creator.parser {
    class LabelGroup extends Group {
        constructor(config: any);
        protected setDefaultValue(): void;
        toControl(node_name: string, value: number): void;
    }
}
/**
 * Created by wxlan on 2017/8/8.
 */
declare namespace qpq.creator.parser {
    function getNode(config: any): any;
    class NodeItem extends laya.display.Sprite {
        protected _config: any;
        protected _button: laya.ui.CheckBox;
        protected _side_label: laya.ui.Label;
        private _label_padding;
        private _enabled;
        protected _offX: number;
        constructor(config: any);
        destroy(): void;
        protected build(): void;
        setConfig(config: any): void;
        position: string;
        readonly config: any;
        private getPos(pos);
        value: any;
        selected: any;
        enabled: any;
        label: string;
        side_label: string;
        protected addSideLabel(): void;
    }
    class LabelNode extends NodeItem {
        protected _label: Laya.Label;
        constructor(config: any);
        protected build(): void;
        value: number;
        label: string;
        side_label: string;
    }
    class TextInputNode extends LabelNode {
        private _input_bg;
        constructor(config: any);
        protected build(): void;
        readonly value: any;
    }
    class SteppingNode extends NodeItem {
        private _title;
        private _input;
        private _input_bg;
        private _input_btn;
        private _label_width;
        private _value;
        private _step;
        private _value_min;
        private _value_max;
        private _callBack;
        private _thisObj;
        constructor(config: any);
        protected build(): void;
        setUpdateCallBack(callBack: Function, thisobj: any): void;
        private onClickInput(evt);
        private onInputValue(value);
        setConfig(config: any): void;
        value: number;
        value_min: number;
        value_max: number;
        private adjuest();
    }
    class TimePickerNode extends NodeItem {
        private _title;
        private _input;
        private _input_bg;
        private _input_btn;
        private _label_width;
        private _value;
        private _callBack;
        private _thisObj;
        constructor(config: any);
        protected build(): void;
        setUpdateCallBack(callBack: Function, thisobj: any): void;
        private onClickInput(evt);
        private onInputValue(value);
        setConfig(config: any): void;
        default_value: string;
        value: string;
        private adjuest();
    }
    class AttributeNode extends NodeItem {
        private _title;
        private _input;
        private _input_bg;
        private _label_width;
        private _value;
        constructor(config: any);
        setConfig(config: any): void;
        value: number;
        protected build(): void;
        private adjuest();
    }
    class SliderNode extends NodeItem {
        protected _res: laya.ui.UIComponent;
        protected _slider: gamelib.control.Slider;
        constructor(config: any);
        readonly slider: gamelib.control.Slider;
        protected build(): void;
        setConfig(config: any): void;
        value: number;
        selected: boolean;
        enabled: boolean;
        label: string;
        side_label: string;
    }
}
/**
 * Created by wxlan on 2017/8/8.
 */
declare namespace qpq.creator.parser {
    class Page extends laya.display.Sprite {
        static extraDatas: any;
        private _totalHeight;
        private _list;
        private _config;
        private _net_data;
        private _common_data;
        constructor(totalHeight: number);
        show(): void;
        close(): void;
        getConfig(): any;
        setConfig(config: any): void;
        private layoutItems();
        readonly netData: any;
        getGroupByType(type: string): Array<Group>;
        private _roundCost_index;
        onLocalMsg(msg: string, data: any): void;
        private updateRoundCost(valueIndex?);
        /**
         * 应用默认配置
         * */
        applyDefaultConfig(data: any): void;
        private changeValue(targetList, value);
        private parseGongShi(gongshi, variables);
        /**
         * 控制其他元件
         * @param controlName
         * @param data
         */
        private control(controlName, data);
        getNodeByName(name: string): NodeItem | Group;
        private getGroupByName(name);
        private layout();
    }
}
declare namespace qpq.creator.parser {
    class PointListGroup extends Group {
        constructor(config: any);
        protected build(): void;
        setValue(node_name: string, value: any): void;
        readonly value: number;
    }
}
declare namespace qpq.creator.parser {
    class PointListNode extends NodeItem {
        private _bg;
        private _point;
        private _label;
        private _add;
        private _sub;
        private _value;
        private _maxValue;
        private _minValue;
        private _tick;
        constructor(config: any);
        protected build(): void;
        setConfig(config: any): void;
        private setPos();
        private updateValue();
        value: any;
        private onAdd(evt);
        private onSub(evt);
    }
}
/**
 * Created by wxlan on 2017/8/8.
 */
declare namespace qpq.creator.parser {
    /**
     * 复选框
     */
    class SelectorGroup extends Group {
        constructor(config: any);
        show(): void;
        setValue(node_name: string, value: number): void;
        toControl(node_name: string, value: number): void;
        protected setDefaultValue(): void;
        protected onItemChange(evt: laya.events.Event): void;
    }
}
/**
 * Created by wxlan on 2017/8/22.
 */
declare namespace qpq.creator.parser {
    class SliderGroup extends Group {
        private _slider;
        constructor(config: any);
        protected build(): void;
        show(): void;
        value: number;
        private onSliderChange(value);
        /**
         * 设置数据值，仅用于应用用户习惯
         **/
        setValue(node_name: string, value: number): void;
        label: string;
        protected onValueChange(): void;
    }
}
/**
* 默认设置组
*/
declare namespace qpq.creator.parser {
    class SteppingGroup extends Group {
        constructor(config: any);
        show(): void;
        protected build(): void;
        toControl(node_name: string, value: number): void;
        onSliderChange(item: SteppingNode): void;
        setValue(node_name: string, value: number): void;
    }
}
/**
* 默认设置组
*/
declare namespace qpq.creator.parser {
    class TimePickerGroup extends Group {
        constructor(config: any);
        protected build(): void;
        protected setDefaultValue(): void;
        toControl(node_name: string, value: number): void;
        onSliderChange(item: any): void;
        setValue(node_name: string, value: number): void;
    }
}
declare namespace qpq {
    var g_commonFuncs: CommonFuncs;
    class CommonFuncs {
        private _selfInfo;
        private _selfContactsInfo;
        private _selfLoginInfo;
        constructor();
        getSelfLoginInfo(callBack?: Laya.Handler): any;
        saveSelfLoginInfo(key: string, data: any): void;
        /**
         * 获得玩家信息
         * @function
         * @DateTime 2018-08-20T16:12:15+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        getSelfInfo(callBack?: Laya.Handler): any;
        /**
         * 获得玩家联系方式信息
         * @function
         * @DateTime 2018-08-20T16:12:25+0800
         * @param    {Laya.Handler}           callBack [description]
         */
        getSelfContactsInfo(callBack: Laya.Handler): void;
        /**
         * 保存玩家联系信息
         * @function
         * @DateTime 2018-08-20T16:12:45+0800
         * @param    {string;							                              }} obj [description]
         * @param    {Laya.Handler}           callBack [description]
         */
        saveSelfContactsInfo(obj: {
            phone?: string;
            idcard?: string;
            street_address?: string;
            actual?: string;
        }, callBack?: Laya.Handler): void;
        saveSelfInfo(obj: {
            nick?: string;
            icon?: string;
            sign_name?: string;
            gender?: number;
            phone?: number;
        }, callBack?: Laya.Handler): void;
        /**
         * 点击事件统计
         * @function
         * @DateTime 2018-07-30T09:51:11+0800
         */
        eventTongJi(evt: string, value: string, addData?: any): void;
    }
}
declare namespace qpq.data {
    /**
     * 所有游戏的配置文件
     */
    class ConfigCenter {
        creator_default: any;
        private _callBack;
        private _thisArg;
        private _params;
        private _loadedGames;
        private _gamesToLoad;
        private _games;
        private _gamesObj;
        private _statistics;
        private _statisticsObJ;
        s_cur_config: any;
        private _version;
        private _platform_config_url;
        private _goldGames;
        private _smallGames;
        m_help_file: string;
        m_platformData: any;
        init(call: Function, thisArg: any, args?: any[]): void;
        private onPlatformLoaded(bSuccess);
        private initGamesConfig(config);
        private onGameLoaded(bSuccess);
        private onAllLoaded();
        /**
         * 设置焦点游戏config_id，设置后可直接调用焦点游戏配置s_cur_config（仅当选择的游戏在game_lf配置中时有效）
         * */
        config_id: number;
        /**
         * 收到玩家组局习惯后更新游戏顺序
         * */
        onUpdateOrder(): void;
        private sortGame(a, b);
        /**
         * 所有游戏配置列表
         * */
        readonly game_configs: any[];
        readonly goldGames: any;
        readonly smallGames: any;
        getStatistics(id: number): any;
        /**
         * 根据configId获取游戏配置
         * */
        getGameByConfigId(configId: number): any;
        getConfigByGameCode(game_code: string, bInGoldGame?: boolean): any;
        getConfigByGzIdAndModeId(gz_id: number, modeId: number): any;
        getConfigByGzId(gz_id: number): any;
        /** 通过enter_index获得配置文件
         */
        getConfigByIndex(enter_index: number): any;
        /**
         * 通过enter_index获得金币游戏的配置文件
         * @param  {number} enter_index [description]
         * @return {any}                [description]
         */
        getConfigInGoldGamesByIndex(enter_index: number): any;
        /**
         * 根据game_id和mode_id来获取游戏config
         * */
        getConfigGM(gameId: number, modeId: number): number;
        private onStatisticsLoaded(data);
    }
}
declare module qpq.data {
    /**
     *
     * @author
     *
     */
    class EffortData extends gamelib.data.GameData {
        static s_list: Array<EffortData>;
        static PaseData(data: any): void;
        static UpdateEffortData(data: any): void;
        static UpdateStatus(id: number, type?: number): EffortData;
        static readonly s_getNum: number;
        static Order(): void;
        static getEffortDataById(id: number): EffortData;
        private static SortFun(a, b);
        constructor(data?: any);
        update(data: any): void;
        /**
         * 类型
         * @type {number}
         */
        m_type: number;
        /**
         * 描述
         * @type {string}
         */
        m_des: string;
        /**
         * 当前完成数量
         * @type {number}
         */
        m_finishNumber: number;
        /**
         * 当前完成数量
         * @type {number}
         */
        m_totalNumber: number;
        private _fisnishTime;
        setFinishTime(value: number): void;
        readonly m_finishTime: string;
        /**
         * 1进行中 2完成未领取 3已领取
         * @type {number}
         */
        m_status: number;
        m_money: number;
    }
}
declare namespace qpq.data {
    /**
     * 组局信息
     */
    class GroupInfoData {
        static addGroupInfo(info: any): void;
        static getInfoByGroupId(groupId: number): any;
        static getInfoByGz_id(gz_id: number, validation: number): any;
        static removeGameInfo(groupId: number): void;
        private static s_list;
        constructor();
    }
}
declare namespace qpq.data {
    class PlayerData extends gamelib.data.UserInfo {
        static s_self: PlayerData;
        private static s_list;
        static onData0x0F01(data: any): void;
        static getPlayerData(id: number): qpq.data.PlayerData;
        m_signaName: string;
        m_zhanNum: number;
        m_clubVipLevel: number;
        private read0x0F01(data);
    }
}
/**
* name
*/
declare module qpq.data {
    class QpqData {
        m_bgms: Array<string>;
        m_groupList: any;
        m_groupList_public: any;
        m_bigSaleList: any;
        m_habitRecord: Array<any>;
        habit_store_max: number;
        new_table: boolean;
        notice_config: any;
        pmd_config: any;
        day_notice_config: any;
        huodong_list: Array<any>;
        private _huodongData;
        m_lastGameGroupId: number;
        m_reshowData: any;
        m_siginData: any;
        checkSiginIcon(): boolean;
        constructor();
        /**
         * 0x00F3获得组局信息
         * @param data
         */
        onGetGroupInfo(data: any): void;
        getGroupInfoByGroupId(groupId: number): any;
        getGroupInfoByGz_id(gz_id: number, validation: string): any;
        /**
         * 操作组局
         * @param data
         */
        onHandleGroup(data: any): void;
        private _test_time1;
        private _test_time2;
        /**
         * 请求网络配置
         */
        requestWebConfig(): void;
        private onWebConfigLoade(data);
        private showPmd();
        /**
         * 检测活动是否可以显示
         */
        checkHuoDong(): void;
        /**
         * 检测是否可以显示公告
         * @return {boolean}
         */
        checkNotice(): boolean;
        /**
         * 请求用户习惯数据
         */
        requestHabitData(): void;
        /**
         * 解析用户习惯数据
         * @param data
         */
        parseHabitData(data: any): void;
        private transfer(dataVec);
        /**
         * 创建游戏，保存用户习惯
         * @param data
         */
        onCreateGame(data: any): void;
        getHabitData(config: any): any;
        private inSameMode(a, b);
        /**
         * 获得指定游戏和局数的折扣信息
         * @param config
         * @param roundNum
         */
        getGameSale(config: any, roundNum: number): any;
        /**
         * 检测是否是在折扣时间内
         * @param data
         */
        checkValid(data: any): boolean;
        /**
         * 获得指定游戏和模式的折扣信息
         * @param gameId
         * @param modeId
         * @param roundNum
         */
        getSaleConfig(gameId: number, modeId: number, roundNum?: number): any;
        /**
         * 获取一个游戏是否打折中
         * @game_id 分区id
         * @modeId 模式id，
         * @returns {boolean}
         */
        getGameSaleById(game_id: number, modeId?: number): boolean;
        /**
         * 获得分享数据
         * @param data
         */
        getShare(data: any): any;
        /**
         * 通过指定的配置文件来申请组局。不展示创建界面，五子棋
         * @param config
         */
        createGameByDefaultConfig(config: any): void;
        private copyCommon(data, back);
        private copyExtra(data, back);
        private isHuoDongTime(obj);
    }
}
declare namespace qpq.hall {
    class BaseHall extends gamelib.core.Ui_NetHandle {
        protected _commonBtn: qpq.HallCommonBtns;
        protected _ani_out: Laya.FrameAnimation;
        protected _ani_in: Laya.FrameAnimation;
        private _currentAni;
        protected _houdong_box: Laya.Box;
        private _uiClassMap;
        protected _bFirstLoginDayLogic: boolean;
        constructor(url?: string);
        /**
         * 如果点击按钮需要打开其他界面，或者调用方法,可以在这里处理
         * 需要修改默认的处理方法，也可以通过这里处理
         * @function
         * @DateTime 2019-01-10T15:35:59+0800
         * @param    {string}                 btn       [description]
         * @param    {string}                    signalMsg [description]
         * @param    {class|Laya.Handler}                    handle    [description]
         */
        protected registrerBtnHandle(signalMsg: string, btn?: string, handle?: any, needCreate?: boolean): any;
        onReciveNetMsg(): void;
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        /**
         * 显示公告板
         */
        protected showCallBoard(): void;
        protected updateHuoDongIcon(): void;
        protected checkOpen(id: number): boolean;
        protected checkOpenInGoldGame(id: number): boolean;
        protected checkOpenByPid(): boolean;
        protected onLocalSignal(msg: string, data: any): void;
        protected updateNewIcons(data?: any): void;
        reciveNetMsg(msgId: number, data: any): void;
        /**
         * 第一次登录游戏、需要做的处理。每个游戏自己实现
         */
        protected onFirstLogin(): void;
        /**
         * 每天第一次登录
         */
        protected onFirstLoginDay(): void;
        protected updateMoney(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        protected onBtnHandle(btn: string, data: any): void;
    }
}
declare namespace qpq {
    class Banner {
        private _box;
        private _list;
        private _grap;
        private _index;
        private _image_list;
        constructor(res: any);
        private onClick(evt);
        setData(): void;
        private showImage();
        private setUrl(hd, image);
    }
}
declare namespace qpq.hall {
    class BindPhoneUi extends gamelib.core.Ui_NetHandle {
        private _get;
        private _phone_verify_vid;
        private _netData;
        constructor();
        protected init(): void;
        protected onShow(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onClose(): void;
        protected onClickObjects(evt: Laya.Event): void;
        private timer(time);
        /**
         * 返回验证玛
         * @param {any} ret [description]
         */
        private onGetVerifyCallBack(ret);
        /**
         * 绑定回掉
         * @param {any} ret [description]
         */
        private onBindCallBack(ret);
    }
}
declare namespace qpq.hall {
    /**
     * 绑定推荐人
     * @type {[type]}
     */
    class BindRefer {
        private _input;
        private _btn;
        private _label;
        private _box;
        constructor(res: any);
        show(): void;
        close(): void;
        private onInputValue(value);
        private onClickInput(evt);
        private onClickBtn();
    }
}
declare namespace qpq.hall {
    class ChangeHeadUi extends gamelib.core.BaseUi {
        private _list;
        private _gougou;
        private _lastSelectIndex;
        private _selecteImg;
        private _callBack;
        m_parentUi: gamelib.core.BaseUi;
        constructor();
        protected init(): void;
        private onSelect(index);
        private onItemRender(box, index);
        protected onShow(): void;
        protected updateOther(): void;
        protected onClose(): void;
        protected onClickObjects(evt: Laya.Event): void;
        private onSaveCallBack(ret);
    }
}
declare module qpq.hall {
    class EffortUi extends gamelib.core.Ui_NetHandle {
        private _list_1;
        listdata: Array<any>;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        protected update(): void;
        protected onItemUpdate(item: laya.ui.Box, index: any): void;
        private onclick(index);
    }
}
/**
* name
*/
declare namespace qpq.hall {
    class GoldGameUi extends gamelib.core.BaseUi {
        private _games;
        private _grap;
        private _items;
        private _enterUi;
        private _container;
        constructor();
        protected init(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        private adjues();
    }
    class GoldGameRoomListUi extends gamelib.core.BaseUi {
        private _items;
        private _games;
        private _grap;
        private _pools;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onCloe(): void;
        private onClickItem(evt);
        setData(data: any): void;
        private getItem();
        private adjues();
    }
}
declare module qpq {
    /**
     * 大厅公共按钮,包括商城，签到，游戏，喇叭，cdk，设置，帮助，发送到桌面，首充
     * 需要关注消息为: showSetUi,showHelpUi,showRankUi,showEffortUi,showTaskUi
     * @class HallCommonBtns
     */
    class HallCommonBtns {
        private _btns;
        private _mailIcon;
        private _signinIcon;
        private _signal;
        private _bSendToDesk;
        private _qpqEnter;
        constructor(res: any);
        removeBtn(btn: string): void;
        private onGlobalSigna(msg, data);
        show(): void;
        close(): void;
        update(): void;
        private updateItemBtn();
        private onClickBtns(evt);
    }
}
declare namespace qpq.hall {
    class Help extends gamelib.core.BaseUi {
        private _tab;
        private _url;
        private _datas;
        private _isLoading;
        private _text;
        private _toShowIndex;
        private _page;
        private _slider;
        constructor();
        protected init(): void;
        setIndex(index: number): void;
        private onHelpFileLoaded(bSuccess);
        protected onShow(): void;
        private onTabChange();
        private showData(index);
    }
}
/**
* name
*/
declare namespace qpq.hall {
    class HuoDongUi extends gamelib.core.BaseUi {
        private _ok_btn;
        private _tab;
        private _img;
        private _huodongData;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
        private onTabChange(index);
    }
}
declare module qpq.hall {
    class KeyPad extends gamelib.core.BaseUi {
        protected _defaultInput: string;
        protected _inputVec: Array<number | string>;
        protected _checkLength: number;
        protected _text_input: laya.ui.Label;
        constructor(str?: string);
        protected init(): void;
        protected onShow(): void;
        onClose(): void;
        protected onClickCloseBtn(evt: laya.events.Event): void;
        protected onClickObjects(evt: laya.events.Event): void;
        clearInput(): void;
        protected addNum(value: number | string): void;
        protected deleteNum(): void;
        protected updateInput(): void;
        protected checkValid(): void;
        protected checkInput(key: string): void;
    }
}
declare module qpq.hall {
    class KeyPad_Input extends KeyPad {
        private _handle;
        private _maxChars;
        private _maxValue;
        protected _btn_dian: Laya.Button;
        constructor();
        protected init(): void;
        setData(data: any): void;
        protected onClickObjects(evt: laya.events.Event): void;
        protected checkInput(key: string): void;
    }
}
declare namespace qpq.hall {
    class LevelUpUi extends gamelib.core.BaseUi {
        constructor();
        protected init(): void;
        /**
         * [setType description]
         * @function
         * @DateTime 2018-11-05T17:38:04+0800
         * @param    {Array}       arr[0] 1:等级 2：vip等级.arr[1]变化的值
         */
        setType(arr: Array<number>): void;
    }
}
declare namespace qpq.hall {
    class ModifyNickName extends gamelib.core.BaseUi {
        private _txt_input;
        m_parentUi: gamelib.core.BaseUi;
        private _name;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        private onTextChange(evt);
        protected onClickObjects(evt: Laya.Event): void;
        private onSaveCallBack(ret);
    }
}
/**
* name
*/
declare module qpq.hall {
    class QRCUi extends gamelib.core.BaseUi {
        private _qrcodeImg;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
declare namespace qpq.hall {
    class RankUi extends gamelib.core.Ui_NetHandle {
        protected _self_rank_icon: Laya.Image;
        protected _self_rank_txt: Laya.Label;
        private _list;
        protected _txt_money: Laya.Label;
        protected _data: Array<any>;
        constructor(url?: string);
        protected init(): void;
        protected initList(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected pase0x00D7(data: any): void;
        protected onShow(): void;
        protected onClose(): void;
        protected update(): void;
        protected updateMyRank(): void;
        protected onSelecttList(index: number): void;
        protected updateItem(box: Laya.Box, index: number): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
    class RankUi_page extends gamelib.core.Ui_NetHandle {
        private _page;
        private _lists;
        private _listBox;
        protected _self_rank_icon: Laya.Image;
        protected _self_rank_txt: Laya.Label;
        protected _txt_money: Laya.Label;
        private _allDatas;
        private _numOfPage;
        private _totalNum;
        private _currentPage;
        constructor();
        protected init(): void;
        protected initList(): void;
        private requestData(page);
        protected onShow(): void;
        protected onClose(): void;
        reciveNetMsg(msgId: number, data: any): void;
        private showPage(page, arr);
        private onPageChange(page);
        private setDataSource(arr, page);
        protected onClickItem(evt: Laya.Event): void;
        private updateItem1(box, obj);
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
* name  奖励动画
*/
declare module qpq.hall {
    class Reward extends gamelib.core.BaseUi {
        private _list;
        private _goods;
        constructor();
        protected init(): void;
        /**
         * 播放获得单个个物品动画
         * 推荐使用playGetItemsAni方法
         * @param url 图片资源
         * @param num 道具的数量
         * @param msId 道具msid
         *
         */
        rewardAni(url: string, num: number, msId: number): void;
        /**
         * 播放获得道具的动画
         * @param list Array<{msId:number,num:number}>|{items:Array<{msId:number,num:number}>,goods:any}
         */
        playGetItemsAni(list: Array<{
            msId: number;
            num: number;
        }> | {
            items: Array<{
                msId: number;
                num: number;
            }>;
            goods: any;
        }): void;
        private playAni(msId, num);
        protected onShow(): void;
        protected onClose(): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
declare namespace qpq.hall {
    class SelectGameUi extends gamelib.core.BaseUi {
        private _list;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        private onUpdateItem(box, index);
        private onSelected(index);
    }
}
declare namespace qpq.hall {
    class SelectHeadImgUi extends gamelib.core.BaseUi {
        private _callBack;
        m_parentUi: gamelib.core.BaseUi;
        constructor(callBack: Laya.Handler);
        protected init(): void;
        onShow(): void;
        protected onClose(): void;
        protected onClickObjects(evt: Laya.Event): void;
        private _url;
        private onSelectCallBack(ret);
        private onSaveCallBack(ret);
    }
}
declare module qpq.hall {
    /**
     * 修改个人信息，包括名字
     * @type {[type]}
     */
    class SelfInfoModify extends gamelib.core.BaseUi {
        private _sex;
        private _oldSex;
        constructor(res?: string);
        protected init(): void;
        protected onShow(): void;
        protected onClickObjects(evt: Laya.Event): void;
        private onModifyNickName(obj);
    }
}
/**
* name
*/
declare module qpq.hall {
    class ShengMing extends gamelib.core.BaseUi {
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
* name
*/
declare module qpq.hall {
    /**
     * 牌桌详细信息
     */
    class TableInfo extends gamelib.core.Ui_NetHandle {
        private _list;
        private _data;
        private _list_data;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        protected init(): void;
        setData(data: any): void;
        protected onShow(): void;
        protected onClose(): void;
        private onItemUpdate(item, index);
    }
}
declare module qpq.hall {
    /**
     * 牌桌列表
     */
    class TableList extends gamelib.core.Ui_NetHandle {
        private _list;
        private _data;
        private _lastRequestTime;
        private _requestGrap;
        constructor();
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        private showList();
        protected onClose(): void;
        protected init(): void;
        /**
         * @param {laya.events.Event}
         * @author
         */
        protected onClickObjects(evt: laya.events.Event): void;
        private onItemUpdate(item, index);
        private _item_data;
        private onTouchDismiss(evt);
        private confirmDismiss(type);
        private onDismissed(data);
        private onTouchEnter(evt);
        private onTouchInvite(evt);
        private onTouchBg(evt);
    }
}
declare namespace qpq.hall {
    class TimerPicker extends gamelib.core.BaseUi {
        private _handle;
        private _hour_txt;
        private _minute_txt;
        private _hour;
        private _minute;
        private _minHour;
        private _minMinute;
        private _btns;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        private _dowTime;
        protected onMouseDown1(evt: Laya.Event): void;
        private btnTimer(target, isLoop);
        protected onMouseUp1(target: Laya.Button, evt: Laya.Event): void;
        setData(data: any): void;
        protected onClickObjects(evt: Laya.Event): void;
        private setHour(value);
        private setMin(value);
    }
}
declare namespace qpq.hall {
    class TuiGuang extends gamelib.core.BaseUi {
        constructor();
        protected init(): void;
    }
}
/**
* name
*/
declare namespace qpq.hall {
    class UserInfoUi extends gamelib.core.BaseUi {
        private _qrcodeImg;
        private _vip_introduce_url;
        private _bindRefer;
        constructor();
        protected init(): void;
        protected onClose(): void;
        protected onShow(): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
* name
*/
declare namespace qpq.hall {
    /**
     * 有签名
     * @type {[type]}
     */
    class UserInfoUi1 extends gamelib.core.Ui_NetHandle {
        static getRandomSign(): string;
        private _txt_input;
        private _pd;
        private _str;
        private _shop_btn;
        private _bindRefer;
        constructor();
        protected init(): void;
        setData(pd: any): void;
        protected onClose(): void;
        protected onShow(): void;
        private _netData;
        reciveNetMsg(msgId: number, data: any): void;
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
/**
* name
*/
declare namespace qpq.hall {
    /**
     * 有统计信息和签名
     * @type {[type]}
     */
    class UserInfoUi2 extends gamelib.core.Ui_NetHandle {
        private _txt_input;
        private _pd;
        private _str;
        private _tjList;
        private _tjStrings;
        private _bindRefer;
        constructor();
        protected init(): void;
        protected onShow(): void;
        protected onClose(): void;
        private _netData;
        reciveNetMsg(msgId: number, data: any): void;
        private initValues();
        protected onClickObjects(evt: laya.events.Event): void;
    }
}
declare module qpq.hall {
    class Rna extends gamelib.core.Ui_NetHandle {
        private sheng_fen;
        private hao_ma;
        private _bSet;
        constructor();
        protected init(): void;
        protected onShow(): void;
        private _netData;
        reciveNetMsg(msgId: number, data: any): void;
        private editable;
        protected onClickObjects(evt: laya.events.Event): void;
        protected onSaveCallBack(obj: any): void;
        protected onGetCallBack(obj: any): void;
    }
}
declare namespace qpq.hall {
    class SignInUi_s0 extends gamelib.core.Ui_NetHandle {
        private _today;
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        private update();
        protected onClickObjects(evt: laya.events.Event): void;
        private onClickQd(evt);
        private setItem(itemData);
        private setLeiJi(itemdata, index);
    }
}
declare namespace qpq.hall {
    /**
     * 没有累计领取
     * @type {[type]}
     */
    class SignInUi_s1 extends gamelib.core.Ui_NetHandle {
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        private update();
        protected onClickObjects(evt: laya.events.Event): void;
        private setItem(itemData);
    }
}
declare namespace qpq.hall {
    /**
     * 没有累计领取
     * @type {[type]}
     */
    class SignInUi_s2 extends gamelib.core.Ui_NetHandle {
        constructor();
        protected init(): void;
        reciveNetMsg(msgId: number, data: any): void;
        protected onShow(): void;
        private update();
        protected onClickObjects(evt: laya.events.Event): void;
        private setItem(itemData);
    }
}
