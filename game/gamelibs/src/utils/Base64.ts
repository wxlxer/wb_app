/**
 * Created by wxlan on 2015/6/26.
 */
module utils {

    export class Base64 {
        constructor() {

        }
        private static base64String:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        private static base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        private static base64DecodeChars:Array<number> = [
             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
        public static base64encode(str:string):string
        {
            var out:string, i:number, len:number;
            var c1:number, c2:number, c3:number;

            len = str.length;
            i = 0;
            out = "";
            while(i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if(i == len)
                {
                    out += Base64.base64EncodeChars.charAt(c1 >> 2);
                    out += Base64.base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if(i == len)
                {
                    out += Base64.base64EncodeChars.charAt(c1 >> 2);
                    out += Base64.base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += Base64.base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += Base64.base64EncodeChars.charAt(c1 >> 2);
                out += Base64.base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += Base64.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
                out += Base64.base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        }

        public static base64decode(str:string):string
        {
            var c1, c2, c3, c4;
            var i, len, out;

            len = str.length;
            i = 0;
            out = "";
            while(i < len) {
            /* c1 */
            do {
                c1 = Base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c1 == -1);
            if(c1 == -1)
                break;

            /* c2 */
            do {
                c2 = Base64.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c2 == -1);
            if(c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if(c3 == 61)
                return out;
                c3 = Base64.base64DecodeChars[c3];
            } while(i < len && c3 == -1);
            if(c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if(c4 == 61)
                return out;
                c4 = Base64.base64DecodeChars[c4];
            } while(i < len && c4 == -1);
            if(c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out;
        }

        public static utf16to8(str:string):string
        {
            var out, i, len, c;
            out = "";
            len = str.length;
            for(i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
            }
            return out;
        }

        public static utf8to16(str:string):string
        {
            var out, i, len, c;
            var char2, char3;

            out = "";
            len = str.length;
            i = 0;
            while(i < len) {
            c = str.charCodeAt(i++);
            switch(c >> 4)
            { 
              case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += str.charAt(i-1);
                break;
              case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
              case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                               ((char2 & 0x3F) << 6) |
                               ((char3 & 0x3F) << 0));
                break;
            }
            }

            return out;
        }

        public static CharToHex(str:string) :string
        {
            var out, i, len, c, h;
            out = "";
            len = str.length;
            i = 0;
            while(i < len) 
            {
                c = str.charCodeAt(i++);
                h = c.toString(16);
                if(h.length < 2)
                    h = "0" + h;
                
                out += "\\x" + h + " ";
                if(i > 0 && i % 8 == 0)
                    out += "\r\n";
            }

            return out;
        }

        public static encode(data:string):string{
            // Convert string to ByteArray
            var bytes:laya.utils.Byte = new laya.utils.Byte();
            bytes.writeUTFBytes(data);
            // Return encoded ByteArray
            return Base64.encodeByteArray(bytes);
        }

        public static encodeByteArray(data:laya.utils.Byte):string{
            // Initialise output
            var output:string = "";

            // Create data and output buffers
            var dataBuffer:Array<any>;
            var outputBuffer:Array<any> = new Array<any>(4);

            // Rewind ByteArray
            data.pos = 0;

            // while there are still bytes to be processed
            while (data.bytesAvailable > 0){
                // Create new data buffer and populate next 3 bytes from data
                dataBuffer = new Array<any>();

                for (var i:number = 0; i < 3 && data.bytesAvailable > 0; i++){
                    dataBuffer[i] = data.getUint8();
                }

                // Convert to data buffer Base64 character positions and
                // store in output buffer
                outputBuffer[0] = ( dataBuffer[0] & 0xfc ) >> 2 ;
                outputBuffer[1] = (( dataBuffer[0] & 0x03 ) << 4 ) | (( dataBuffer[1]) >> 4 );
                outputBuffer[2] = (( dataBuffer[1] & 0x0f ) << 2 ) | (( dataBuffer[2]) >> 6 );
                outputBuffer[3] = dataBuffer [2] & 0x3f ;

                // If data buffer was short (i.e not 3 characters) then set
                // end character indexes in data buffer to index of '=' symbol.
                // This is necessary because Base64 data is always a multiple of
                // 4 bytes and is basses with '=' symbols.
                for ( var j:number = dataBuffer.length; j < 3; j++){
                    outputBuffer[j + 1] = 64;
                }

                // Loop through output buffer and add Base64 characters to
                // encoded data string for each character.
                for ( var k:number = 0; k < outputBuffer.length; k++){
                    output += Base64.base64String.charAt(outputBuffer[k]);
                }
            }

            // Return encoded data
            return output;
        }

        public static decode(data:string ):string{
            // Decode data to ByteArray
            var bytes:laya.utils.Byte = Base64.decodeToByteArray(data);

            // Convert to string and return
            return bytes.readUTFBytes(bytes.length);
        }

        public static decodeToByteArray(data:string):laya.utils.Byte{
            // Initialise output ByteArray for decoded data
            var output:laya.utils.Byte = new laya.utils.Byte();

            // Create data and output buffers
            var dataBuffer:Array<any> = new Array<any>(4);
            var outputBuffer:Array<any> = new Array<any>(3);

            // While there are data bytes left to be processed
            for (var i:number = 0; i < data.length; i += 4){
                // Populate data buffer with position of Base64 characters for
                // next 4 bytes from encoded data
                for (var j:number = 0; j < 4 && i + j < data.length; j++){
                    dataBuffer[j] = Base64.base64String.indexOf(data.charAt( i + j ));
                }

                // Decode data buffer back into bytes
                outputBuffer[0] = ( dataBuffer[0] << 2 ) + (( dataBuffer[1] & 0x30 ) >> 4 );
                outputBuffer[1] = (( dataBuffer[1] & 0x0f ) << 4 ) + (( dataBuffer[2] & 0x3c ) >> 2 );
                outputBuffer[2] = (( dataBuffer[2] & 0x03 ) << 6 ) + dataBuffer[3];

                // Add all non-padded bytes in output buffer to decoded data
                for (var k:number = 0; k < outputBuffer.length; k++){
                    if (dataBuffer[k + 1] == 64) break;
                    output.writeByte(outputBuffer [k]);
                }
            }

            // Rewind decoded data ByteArray
            output.pos = 0;

            // Return decoded data
            return output;
        }

        static  fromArrayBuffer(arraybuffer:ArrayBuffer):string {
            var bytes:Uint8Array = new Uint8Array(arraybuffer),
                i:number, len:number = bytes.buffer.byteLength, base64:string = "";

            for (i = 0; i < len; i += 3) {
                base64 += Base64.base64String[bytes[i] >> 2];
                base64 += Base64.base64String[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += Base64.base64String[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += Base64.base64String[bytes[i + 2] & 63];
            }

            if ((len % 3) === 2) {
                base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + "==";
            }

            return base64;
        }

        static base64ToIndexNew(index:string):number {
            var test = {};
            for (var i = 0; i < Base64.base64String.length; i++) {
                test[Base64.base64String[i]] = i;
            }
            return test[index];
        }

        static toArrayBuffer(base64:string):ArrayBuffer {
            var bufferLength:number = base64.length * 0.75,
                len:number = base64.length, i:number, p:number = 0,
                encoded1:number, encoded2:number, encoded3:number, encoded4:number;

            if (base64[base64.length - 1] === "=") {
                bufferLength--;
                if (base64[base64.length - 2] === "=") {
                    bufferLength--;
                }
            }

            var arraybuffer = new ArrayBuffer(bufferLength),
                bytes = new Uint8Array(arraybuffer);
            for (i = 0; i < len; i += 4) {
                encoded1 = this.base64ToIndexNew(base64[i]);
                encoded2 = this.base64ToIndexNew(base64[i + 1]);
                encoded3 = this.base64ToIndexNew(base64[i + 2]);
                encoded4 = this.base64ToIndexNew(base64[i + 3]);

                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }

            return arraybuffer;
        }
    }
}
