module qpq.hall
{
    export class EffortUi extends gamelib.core.Ui_NetHandle
    { 
        private _list_1:laya.ui.List;
        public listdata:Array<any>;
        constructor(){
            super("qpq/Art_Effort");
        }

        protected init():void
        {             
             this._list_1 = this._res["list_1"];    
             this._list_1.dataSource = [];                    
             this._list_1.renderHandler = new laya.utils.Handler(this, this.onItemUpdate,null,false);              
             this._noticeOther = true;
             
        }
        public reciveNetMsg(msgId: number,data: any):void
        {
           switch (msgId)
           {
             case 0x00D3:
               g_uiMgr.closeMiniLoading();
               qpq.data.EffortData.PaseData(data);
               this.update();
               break;
             case 0x00D5:
               if(data.effort_Result == 1)
               {
                   qpq.data.EffortData.UpdateStatus(data.effort_Id,3);
                   this.update();
               }
               break;          
             default:
               
               break;
           }
        }
    
        protected onShow():void
        {
           super.onShow();
           if(qpq.data.EffortData.s_list == null)
           {
               sendNetMsg(0x00D3);
               g_uiMgr.showMiniLoading();
               return;
           }
           this.update();
        }

        protected update():void
        {
          this.listdata = qpq.data.EffortData.s_list;         
          this._list_1.dataSource = this.listdata;
        }
        
       // 渲染方式
        protected onItemUpdate(item:laya.ui.Box,index:any):void
        {
           
             var data: qpq.data.EffortData = this.listdata[index];
             var btn=item.getChildByName("btn_ok");
             // 获取该单元格的数据
             var name:laya.ui.Label = <laya.ui.Label>getChildByName(item,"txt_1");
             var num:laya.ui.Label = <laya.ui.Label>getChildByName(item,"txt_2");
             var jd:laya.ui.Label = <laya.ui.Label>getChildByName(item,"txt_3");
             var goods:laya.ui.Image = <laya.ui.Image>getChildByName(item,"img_goods");
             var btn_ok:laya.ui.Button = <laya.ui.Button>getChildByName(item,"btn_ok");
             var img_ywc:laya.ui.Image = <laya.ui.Image>getChildByName(item,"img_ywc");
             
             name.text = data.m_name;
             num.text = "X" + data.m_money;
             jd.text = data.m_finishNumber + "/" + data.m_totalNumber;
            
             switch(data.m_status)
             {
                 case 1: 
                   btn_ok.visible = false; 
                   img_ywc.visible = false;
                   jd.visible = true;
                   break;
                 case 2: 
                   btn_ok.visible = true;
                   img_ywc.visible = false;
                   jd.visible = false;
                   break;
                 case 3: 
                   btn_ok.visible = false; 
                   img_ywc.visible = true;
                   jd.visible = false;
                   break;
             }
             btn.off(Laya.Event.CLICK,this,this.onclick);
             btn.on(Laya.Event.CLICK,this,this.onclick,[index]);
        }
       
        private onclick(index):void
        {
           var id = this.listdata[index].m_id;
           sendNetMsg(0x00D5,id,0);             //棋牌圈本身发0
          
        }
     
       
    }
    
    
}
