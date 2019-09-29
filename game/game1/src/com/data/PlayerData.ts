export default class PlayerData
{
    public constructor()
    {

    }
    public m_id:number;
    public m_userName:string = "";
    public m_nickName:string = "";
    public m_phone:string = "";
    public m_money:number = 0;
    public m_isOldWithNew:boolean = false;
    public m_wx:string = "";
    public m_mail:string = "";
}
export var g_playerData:PlayerData = new PlayerData();