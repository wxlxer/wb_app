export default function login(username:string,pwd:string):void
{
    g_net.request(gamelib.GameMsg.Login,{un:username,pw:pwd});

    gamelib.Api.saveLocalStorage('username',username);
    gamelib.Api.saveLocalStorage('password',pwd);
}