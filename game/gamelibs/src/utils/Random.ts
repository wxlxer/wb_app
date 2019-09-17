module utils {
	export class Random{
		
		public seed:number;
		constructor(seed?:number)
		{
			seed = seed || new Date().getTime();
		}

		public nextInt(min?:number,max?:number):number
		{
			max = max || 1;
			min = min || 0; 
			this.seed = (this.seed * 9301 + 49297) % 233280; 
			var rnd = this.seed / 233280.0; 
			return Math.round(min + rnd * (max - min));			
		}

		public next(min?:number,max?:number):number
		{
			max = max || 1;
			min = min || 0; 
			this.seed = (this.seed * 9301 + 49297) % 233280; 
			var rnd = this.seed / 233280.0; 
			return min + rnd * (max - min);
			
		}
	}
}