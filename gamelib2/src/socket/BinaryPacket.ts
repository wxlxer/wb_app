
module gamelib.socket {

	export class BinaryPacket extends laya.utils.Byte{
		private _msgId:number = 0;
		private _size:number = 0;
		
		/**
		 * @param messageId 消息id。
		 * @param size 消息大小。
		 */
		public constructor(messageId:number = 0,data?:any){
			super(data);
			this.endian = laya.utils.Byte.LITTLE_ENDIAN;
			this._msgId = messageId;
		}
		
		/**
		 * 消息id。
		 */
		public get messageId():number{
			return this._msgId;
		}
		
		/**
		 * 将报文体操作指针设置到到0。下一次调用读取方法时将在0位置开始读取，或者下一次调用写入方法时将在0位置开始写入。
		 */
		public reset():void
		{
			this.pos = 0;
		}

		public GetArrayBuffer():ArrayBuffer
		{
			return this.buffer;
		}
		
	}
}