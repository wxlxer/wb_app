/**
 * Created by wxlan on 2016/10/24.
 */
module gamelib.Api
{
    //保存在app本地的数据
    export function getLocalStorage(key:string):any
    {
        var storage:any;
        if(window['plus'])
        {
            storage = window['plus'].storage;            
        }
        else
        {
            storage = window['localStorage']       
        }
        return storage.getItem(key);
    }
    export function saveLocalStorage(key:string ,value:string):void
    {
        var storage:any;
        if(window['plus'])
        {
            storage = window['plus'].storage;            
        }
        else
        {
            storage = window['localStorage']       
        }
        storage.setItem(key,value);
    }
    
}
