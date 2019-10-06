//拷贝2.0的库文件
const fs = require("fs");
const path = require("path");
var args = process.argv.splice(2);


// fileName = "gamelib.d.ts";
// src = path.join(__dirname,"./game/game1/bin/");
// fs.copyFileSync(src,path.join(__dirname,"game1/libs/",fileName));

// fileName = "gamelib.js";
// src = path.join(__dirname,"./gamelibs/bin/",fileName);
// fs.copyFileSync(src,path.join(__dirname,"game1/bin/libs/",fileName));
// console.log(path.join(__dirname,"game1/bin/libs/",fileName));




var copy=function(src,dst){
    let paths = fs.readdirSync(src); //同步读取当前目录
    var arr = [".laya","libs","sound","sound","aa.json","fileconfig.json","index.html","index.js","ui.json","unpack.json"]
    paths.forEach(function(path){
        if(arr.indexOf(path) >= 0 )
            return;
        var _src=src+'/'+path;
        var _dst=dst+'/'+path;
        fs.stat(_src,function(err,stats){  //stats  该对象 包含文件属性
            if(err)throw err;
            if(stats.isFile()){ //如果是个文件则拷贝 
                let  readable=fs.createReadStream(_src);//创建读取流
                let  writable=fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            }else if(stats.isDirectory()){ //是目录则 递归 
                checkDirectory(_src,_dst,copy);
            }
        });
    });
}
var checkDirectory=function(src,dst,callback){
    fs.access(dst, fs.constants.F_OK, (err) => {
        if(err){
            fs.mkdirSync(dst);
            callback(src,dst);
        }else{
            callback(src,dst);
        }
      });
};
copy(path.join(__dirname,"./game/game1/bin/"),path.join(__dirname,"./app/"));