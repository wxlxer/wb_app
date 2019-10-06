export default class TabList
{
    private _list:Laya.List;

    private _itemRender:Laya.Handler;
    private _tabChangerHandler:Laya.Handler;
    public constructor(list:Laya.List)
    {
        this._list = list;
        this._list.selectEnable = true;
        this._list.renderHandler = Laya.Handler.create(this,this.onItemRender,null,false);
        if(this._list.scrollBar)
            this._list.scrollBar.visible = false;
        //this._list.selectHandler = Laya.Handler.create(this,this.onTabChanger,null,false)
    }
    public set selectedIndex(value:number)
    {
        this._list.selectedIndex = value;
    }
    public get selectedIndex():number
    {
        return this._list.selectedIndex;
    }

    public setItemRender(handler:Laya.Handler):void
    {
        this._itemRender = handler;
    }
    public set tabChangeHander(handler:Laya.Handler)
    {
        this._list.selectHandler = handler;
    }
    public set dataSource(dataSource:Array<any>)
    {
        this._list.dataSource = dataSource;
    }
    public get dataSource():Array<any>
    {
        return this._list.dataSource;
    }

    private onItemRender(box:Laya.Box,index:number):void
    {
        var data:any = this._list.dataSource[index];
        var skins:Array<string> = data.skins;
        
        var img_normal:Laya.Image = <Laya.Image>box.getChildByName('bg_normal');
        var img_selected:Laya.Image = <Laya.Image>box.getChildByName('bg_selected');
        img_selected.visible = index == this._list.selectedIndex;
        img_normal.visible = !img_selected.visible;
        if(skins)
        {
            img_normal.skin = skins[0];
            img_selected.skin = skins[1];
        }

        var colors:Array<string> = data.colors;
        var label:Laya.Label = <Laya.Label> box.getChildByName('txt_label');
        if(colors)
        {
            label.color =  index == this._list.selectedIndex ? colors[1]:colors[0];
        }
        if(label && data.label)
            label.text = data.label;
        
        if(this._itemRender)
        {
            this._itemRender.runWith([box,index,data]);
        }
    }
    
}