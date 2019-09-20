/**
 * Created by wxlan on 2017/1/10.
 */
module utils
{
    export class StringUtility
    {
        /**
         * 获得字符串的长度,中文算2个长度
         * @method
         * @static
         * @param {string} str
         * @returns {number}
         *
         */
        public static GetStrLen(str:String):number
        {
            var length:number = str.length;
            var re:RegExp = /[\u4e00-\u9fa5]{1,}/g; //用正则读取字符串中有多个少个中文
            var temp: any = str.match(re);
            if(temp != null)
            {
                length += temp.join("").length; //在长度上增加一次中文的个数，这样中文就被当做2个字符计算长度了
            }
            return length;
        }
        /**
         * 获取子字符串。中文算2个长度。
         *  @method
         * @static
         * @param str
         * @param length
         * @returns {string}
         *
         */
        public static GetSubstr(str:string,length:number):string
        {
            var re:RegExp = /[\u4e00-\u9fa5]{1,}/g; //用正则读取字符串中有多个少个中文
            var resulet: string = "";
            var len: number = length;
            var i: number = 0;
            var b: boolean = len > 0;
            while(b)//len > 0 && i > str.length-1)
            {
                var c:string = str.charAt(i);
                resulet += c
                var temp: any = c.match(re);
                if(temp != null)
                {
                    len -= 2; //在长度上增加一次中文的个数，这样中文就被当做2个字符计算长度了
                }
                else
                {
                    len -= 1;
                }
                i++;
                if(len <= 0 || i > str.length - 1)
                    b = false;
            }
            return resulet;
        }

        /**
         * @method
         * @static
         * 获取时间串
         * @param time 指定时间的time值
         * @returns {string}
         */
        public static GetTimeString(time:number):string
        {
            var date:Date = new Date();
            date.setTime(time);
            var result: string = date.getFullYear() +"-";
            var temp: number = (date.getMonth() + 1);
            result += temp < 10 ? "0" + temp : temp;
            result += "-";
            temp = date.getDate();
            result +=  temp < 10 ? "0" + temp : temp;
            result += " ";

            temp = date.getHours();
            result +=  temp < 10 ? "0" + temp : temp;
            result += ":";

            temp = date.getMinutes();
            result +=  temp < 10 ? "0" + temp : temp;
            result += ":";

            temp = date.getSeconds();
            result +=  temp < 10 ? "0" + temp : temp;

            return result;
        }

        /**
         * 把指定的秒数转换成 x天x小时x分钟的格式
         * @param second
         * @returns {any}
         */
        public static secToTimeString(second:number,format:Array<string> = ["天",":",":",""]):string
        {
            if(second<=0)return "";
            var temp  = 3600 * 24;
            var day:number = Math.floor(second/temp);
            second = second % temp;

            temp = 3600;
            var hour:number = Math.floor(second/temp);
            second = second % temp;

            temp = 60;
            var mins:number = Math.floor(second/temp);
            second = second % temp;
            second = Math.floor(second);

            var timeStr:string="";
            if(day)
                timeStr += timeStr.concat(day + format[0]);
            timeStr = timeStr.concat((hour < 10 ? "0" + hour : hour) + format[1]);//"小时");
            timeStr = timeStr.concat((mins < 10 ? "0" + mins : mins) + format[2]);//"分钟");
            timeStr = timeStr.concat((second < 10 ? "0" + second : second) + format[3]);
            return timeStr;
        }

        /**
         * 获得两个时间的间隔。几天前，几小时前，几分钟前
         * @function
         * @DateTime 2018-10-22T10:51:20+0800
         * @param    {number|string}          now  [description]
         * @param    {number|string}          last [description]
         * @return   {string}                      [description]
         */
        public static getTimeGrapStr(now:any,last:any):string
        {
            var now_date:Date = new Date(now);
            var last_date:Date = new Date(last);
            var grap:number = now_date.getTime() - last_date.getTime();
            grap = Math.floor(grap / 1000);
            var temp:number = Math.floor(grap / (24 * 3600))
            if(temp >= 1)
            {
                return temp +"天前";
            }
            temp = Math.floor(grap / (3600))
            if(temp >= 1)
                return temp + "小时前";
            temp = Math.floor(grap / (60))
            if(temp >= 1)
                return temp + "分钟前";
            return "1分钟前";
            
        }
        public static getNameEx(name:string,len:number = 5):string
        {
            if(utils.StringUtility.GetStrLen(name) > len)
            {
                return utils.StringUtility.GetSubstr(name,len  - 1) +"...";
            }
            else
            {
                return name;
            }
        }
        /**
         * 去掉所有的换行符
         * @param str
         */
        public static  cleanEnter(str:string):string
        {
            return str.replace(/[\n\t\r]/ig,"");
        }

        /**
         * input字符串是否是以prefix开头
         */
        public static beginsWith(input:string, prefix:string):boolean
        {
            return (prefix == input.substring(0, prefix.length));
        }
        /**
         * 去除所有的空格
         * @param {string} str [description]
         */
        public static Trim(str:string)
        { 
          return str.replace(/(^\s*)|(\s*$)/g, ""); 
        }
                /**
         * input字符串是否以suffix结束
         * @param input
         * @param suffix
         * @returns {boolean}
         */
        public static endsWith(input:string, suffix:string):boolean
        {
            return (suffix == input.substring(input.length - suffix.length));
        }

        /**
         * 把input中所有的replace替换成replaceWith，
         * @param input
         * @param replace
         * @param replaceWith
         * @returns {string}
         */
        public static replace(input:string, replace:string, replaceWith:string):string
        {
            return input.split(replace).join(replaceWith);
        }

        /**
         *  删除input中所有的remove；
         * @param input
         * @param remove
         * @returns {string}
         */
        public static remove(input:string,remove:string):string
        {
            return utils.StringUtility.replace(input,remove,"");
        }
        /**
         * 格式化字符串
         * @param  {string}     input "abc{0}你好{1}"
         * @param  {Array<any>} args  [1,"大家的"]
         * @return {string}           [abc1你好大家的]
         */
        public static format(input:string,args:Array<any>):string
        {
            var result:string = input;
            if(args.length == 1)
            {
                if(args[0]!= undefined)
                {
                    var reg = new RegExp("\\{0\\}", "g");
                    result = result.replace(reg,args[0]);
                }
            }
            else
            {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != undefined)
                    {
                        var reg = new RegExp("\\{" + i + "\\}", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
            return result;
        }
    }
}
