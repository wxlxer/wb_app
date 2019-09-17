
module utils {

	export class MathUtility{
		//打开n中的bit位   常用于状态添加
		//n|=bit     
		//		#define ADD_BIT(n,bit) ((n)|=(bit)) 
		
		//切换n中的bit位   常用于状态切换
		//n^=bit;
		//		#define CHANGE_BIT(n,bit) ((n)^=(bit))
		//关闭n中的bit位   常用于状态删除
		//n&=~bit;
		//		#define DEL_BIT(n,bit) ((n)&=~(bit))
		
		//测试位值是否为1     常用于状态判断
		//n&bit==bit 或 n&bit
		//		#define isOPEN(n,bit) ((n)&(bit))

		/**
		 * @method
		 * 产生一个low,high之间包含low,high的随机整数
		 * @static
		 * @param low
		 * @param high
		 * @returns {number}
		 */
		public static random(low:number,high:number = 0):number{

			return Math.round(Math.random()*(high-low)+low);

		}

		public static UTFLen(str:string):number{
			var tmp:laya.utils.Byte = new laya.utils.Byte();
			tmp.writeUTFBytes(str);
			tmp.pos = 0;
			return tmp.bytesAvailable;
		}

		/**
		 * @method
		 * @static
		 * 取符号运算符
		 * @param value
		 * @returns {number}
		 */
		public static sign(value:number = 0):number{
			return value>0?1:(value<0?-1:0);
		}

		/**
		 * @method
		 * @static
		 * 夹取值 Keep a number between a low and a high.
		 * @param {number}val
		 * @param {number}low
		 * @param {number}high
		 * @returns {number}
		 */
		public static clamp(val:number,low:number= 0,high:number= 1):number{
			return Math.min(high,Math.max(val,low));
		}
		/**
		 * 在字符串中获取数字
		 * @function 
		 * @DateTime 2018-03-17T15:18:01+0800
		 * @param    {string}                 str [description]
		 * @return   {number}                     [description]
		 */
		public static GetNumInString(str:string):number
		{
			return parseInt(str.replace(/[^0-9]/ig,""));
		}
		public static GetAllNumberInString(str:string,isFloat:boolean = false):Array<number>{
			var arr:Array<string>;
			var result:Array<number> = [];
			if(isFloat)
			{
				arr = str.match(/\d+\.\d+/g)
			}
			else
			{
				arr = str.match(/\d+/g);
			}
			arr = arr || [];
			arr.forEach(function(value:string,index:number,arr1)
			{
				result.push(parseInt(value));
			})
			return result;
		}
		/**
		 * 在字符串中获取浮点数
		 * @function 
		 * @DateTime 2018-03-17T15:18:01+0800
		 * @param    {string}                 str [description]
		 * @return   {number}                     [description]
		 */
		public static GetFloatNumInString(str:string):number
		{
			return parseFloat(str.replace(/[^0-9.-]/ig,""));
		}

		/**
		 * @method
		 * @static
		 * 插值
		 * @param {number}v1
		 * @param {number}v2
		 * @param {number}factor
		 * @returns {number}
		 */
		public static lerp(v1:number, v2:number, factor:number):number{
			return ( v1 * ( 1.0 - factor ) ) + ( v2 * factor );
		}

		/**
		 * @method
		 * @static
		 * @param {Array<any>} ary
		 * 乱序一个数组
		 */
		public static randomShuffle(ary:Array<any>):void{
			for (var i:number=0;i<ary.length;i++){
				var index:number=MathUtility.random(0,ary.length-1);
				var temp:any= ary[index];
				ary[index] = ary[0];
				ary[0]=temp;
			}
			
		}
		
		public static isNumber(str:string):boolean{
			return !isNaN(<number><any> str);
		}
		public static isInt(str:string):boolean{
			return !(parseInt(str)==0 && str!="0");
		}
		public static toInt(str:string):number{
			if(!MathUtility.isInt(str))throw new Error(str+" is not a int");
			
			return parseInt(str);
		}
		public static toNumber(str:string):number{
			return <number><any> str;
		}
//		public static function isArray(str:String):Boolean
//		{
//			
//			return !(int(str)==0 && str!="0");
//		}
		public static toBoolean(str:string):boolean{
			return str!="0" && str!="false" && str!="";
		}

		/**
		 *判断value 在 数轴上的区间位置序号
		 * 如 3 在数轴[2,5,10]的第1个区间上
		 * type ：区间类型   1.true: 每个区间是前闭后开 2.false:前开后闭
		 * 
		 */
		public static getInRange(value:number,rangeAry:Array<any>,type:boolean=false):number{
//			rangeAry.sort(Array<any>.NUMERIC);
			
			var i:number=0;
			if(type){
				for(;i<rangeAry.length;i++){
					if(value<rangeAry[i])return i;
				}
			}else{
				for(;i<rangeAry.length;i++){
					if(value<=rangeAry[i])return i;
				}
			}
			
			return i;
		}
		/**
		 * 判断value 在 数轴上的区间位置序号
		 * 如 3 在数轴[2,5,10]的第1个区间上
		 * @param value
		 * @param rangeAry
		 * @param type：区间类型   1.true: 每个区间是前闭后开 2.false:前开后闭
		 * @return 区间号
		 * 
		 */
		public static getPosInRange(value:number,rangeAry:Array<any>,type:boolean=false):number{
//			rangeAry.sort(Array<any>.NUMERIC);
			
			var i:number=0;
			if(type){
				for(;i<rangeAry.length;i++){
					if(value<rangeAry[i])return i;
				}
			}else{
				for(;i<rangeAry.length;i++){
					if(value<=rangeAry[i])return i;
				}
			}
			
			return i;
		}
		/**
		 * @method
		 * @static
		 * 将16进制数值转成16进制字符串 length为数据部分的长度
		 * 
		 */
		public static toHexString(value:number,length:number=0):string{
			var temp:string=value.toString(16);
			var s:string=temp.toLocaleUpperCase();
			for (var i:number = 0; i < length-temp.length; i++) {
				s="0".concat(s);
			}
			return "0x".concat(s);
		}

		/**
		 *讲指定的秒转换成x天y小时z分钟的形式
		 * @param second
		 * @returns {any}
		 */
		public static secToTimeString(second:number = 0):string{
			if(second<=0)return "";
			
			var day:number=second/60/60/24;
			var hour:number=second/60/60-day*24;
			var mins:number=second/60-day*24*60-hour*60;
			
			var timeStr:string="";
			if(day)timeStr=timeStr.concat(day+"天");
			if(hour)timeStr=timeStr.concat(hour+"小时");
			if(mins)timeStr=timeStr.concat(mins+"分钟");
			
			return timeStr;
		}

		/**
		 * 
		 * 基于余弦定理求两经纬度距离
		 * @method
		 * @static
		 * @param lon1 第一点的精度
		 * @param lat1 第一点的纬度
		 * @param lon2 第二点的精度
		 * @param lat3 第二点的纬度
		 * @return 返回的距离，单位m
		 * */
		public static LantitudeLongitudeDist(lon1:number, lat1:number,lon2:number, lat2:number) :number
		{
			var EARTH_RADIUS:number = 6378137;//赤道半径(单位m)
			if(isNaN(lon1) || isNaN(lat1) || isNaN(lon2) || isNaN(lat2))
				return -1;
			//纬度
			var radLat1:number = Math.PI / 180 * lat1;		
			var radLat2:number = Math.PI / 180 * lat2;

			//经度
			var radLon1:number = Math.PI / 180 * lon1;
			var radLon2:number = Math.PI / 180 * lon2;
			
			var a = radLat1 - radLat2;//两点纬度之差
            var b = radLon1 - radLon2; //经度之差

            var dist = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));//计算两点距离的公式
            dist = dist * EARTH_RADIUS;//弧长乘地球半径（半径为米）
            dist = Math.round(dist * 10000) / 10000;//精确距离的数值
			return dist;
		}
	}
}