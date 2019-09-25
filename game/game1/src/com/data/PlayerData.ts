export default class PlayerData
{
    public constructor()
    {

    }
    public m_id:number;
    public m_name:string;
    public m_nickName:string;
    public m_phone:string;
    public m_money:number;
    public m_isOldWithNew:boolean;
}
export var g_playerData:PlayerData = new PlayerData();