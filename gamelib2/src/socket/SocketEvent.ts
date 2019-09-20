module gamelib.socket {
	export class SocketEvent extends laya.events.Event
     {
        public m_data: any;
		public constructor(type:string,data?:any) {
            super();
            this.type = type;
            this.m_data = data;
		}
	}
}
