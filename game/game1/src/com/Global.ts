import { g_uiMgr } from "./UiMainager";

export default function login(username:string,pwd:string):void
{
    g_net.request(gamelib.GameMsg.Login,{un:username,pw:pwd});

    
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