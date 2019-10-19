export default class TuiGuangRule extends gamelib.core.BaseUi
{
    public constructor()
    {
        super('ui.TuiGuang_GZUI');
    }
    protected init():void
    {
        var str:string = 
        `1、每个推荐人只可享受一次奖励
2、成为老用户后才能推荐新用户
3、邀请的新用户达到条件后，老用户才能返佣,佣金达到流水即可提款
4、佣金会在系统规定时间发放
5、如有疑问请联系客服`;
        this._res['txt_info'].text = str;
    }
}