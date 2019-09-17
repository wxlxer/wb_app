//拷贝2.0的库文件
const fs = require("fs");
const path = require("path");
var args = process.argv.splice(2);
console.log(args);

var url = "F:\\LayaProjects\\client\\laya2.0\\";
var src = "";
var fileName = "";

fileName = "gamelib.d.ts";
src = path.join(__dirname,"./gamelibs/bin/",fileName);
fs.copyFileSync(src,path.join(__dirname,"game/libs/",fileName));

fileName = "gamelib.js";
src = path.join(__dirname,"./gamelibs/bin/",fileName);
fs.copyFileSync(src,path.join(__dirname,"game/bin/libs/",fileName));
console.log(path.join(__dirname,"game/bin/libs/",fileName));