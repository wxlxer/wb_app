import { g_uiMgr } from "./UiMainager";

export default function login(username:string,pwd:string):void
{
    g_net.request(gamelib.GameMsg.Login,{un:username,pw:pwd});

    
}
export var UiConfig = {
    list_item_1:"comp/list_itembg1.png",
    list_item_2:"comp/list_itembg2.png",
    txt_color_select:"#28100C",
    txt_color_normal:"#DFDFDF" 
}

export function copyStr(str:string):void
{
    utils.tools.copyToClipboard(str,function(obj:any)
    {
        if(obj.result == 0)
        {
            g_uiMgr.showTip("复制成功");
        }
    })
}
/**
 * 获得指定的日期 
 * @param str "/Date(1568794397000)/"
 * @param withTime 是否包含时间
 * @return 2012-12-14 02:03:00
 */
export function getDate(str:string,withTime:boolean = true):string
{
    var time:number = utils.MathUtility.GetNumInString(str);
    var date:Date = new Date(time);
    var str:string = date.toLocaleDateString();
    var date_str:string = str.replace(/\//g,"-");
    
    if(withTime)
    {
        str = date.toTimeString();
        date_str += " " + str.split(" ")[0];

    }
    return date_str;
}
/**
 * 保存图片到相册
 */
export function saveImageToGallery(img:Laya.Image):void
{
    var htmlC:Laya.HTMLCanvas;
    htmlC = img.drawToCanvas(img.width,img.height,img.x||0,img.y||0); 
    var base64Data:String = htmlC.toBase64('image/jpeg',0.9);
    if(window['plus'] == null)
    {
        return;
    }
    var bmp = new window['plus'].nativeObj.Bitmap();  

    bmp.loadBase64Data(base64Data,function(){  
        console.log("创建成功");  
    },function(){  
        console.log("创建失败");  
    });  
    bmp.save('_www/' + img.name,{overwrite:true},function(){  
        console.log("保存成功");  
    },function(){  
        console.log("保存失败");  
    });  

    window['plus'].gallery.save( '_www/'+ img.name, function () {  
            console.log( "保存图片到相册成功" );  
            g_uiMgr.showTip('二维码已保存至相册');
        },function(){  
            console.log( "保存图片到相册失败" );
            g_uiMgr.showTip('保存失败',true);
    });
}

export function saveSystemObj(obj:any):void
{
    g_systemData = obj;
}
export var g_systemData:any;