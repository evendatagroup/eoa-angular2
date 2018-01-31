import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TreeData } from './tree-model'
import { TreeComponent } from './tree.component';

/**
 * 树
 */
@Component({
    selector: 's-tree',
    templateUrl: './search-tree.component.html',
    styles: []
})
export class SearchTreeComponent implements OnInit {

    @ViewChild('tree') selectTree: TreeComponent;

    //输入数据
    @Input() data: Array<TreeData>;

    //快捷菜单
    @Input() menu: any = [];

    //快捷菜单
    @Input() showall: boolean = false;

    //单击事件
    @Output()
    onClick = new EventEmitter();

    //改变事件
    @Output()
    onCheckChanged = new EventEmitter();

    //确认事件
    @Output()
    onApprove = new EventEmitter();

    //确认事件
    @Output()
    onClose = new EventEmitter();

    //快捷菜单事件
    @Output()
    onSelectMenu = new EventEmitter();

    //全选事件
    @Output()
    onSelectAll = new EventEmitter();

    //所有数据
    private allData: Array<TreeData>;

    //搜索隐藏
    searchMsgHidden: boolean = true;

    //搜索
    search: string = '';


    /**
     * 构造方法
     */
    constructor() { }

    /**
     * 初始化
     */
    ngOnInit() {
        this.allData = this.data;
    }

    /**
     * 点击
     * @param item
     */
    itemClicked(item: TreeData) {

    }

    /**
     * 选择框改变
     */
    onCheckboxChanged(item: TreeData) {
        this.onCheckChanged.emit(item);
    }

    /**
     * 查询树
     */
    searchTree(){
        this.selectTree.searchTree(this.search);
    }

    /**
     * 选择框改变
     */
    approve() {
        this.onApprove.emit();
    }

    /**
     * 选择框改变
     */
    close() {
        this.onClose.emit();
    }

    /**
     * 快捷键选择
     */
    selectmenu(option) {
        this.onSelectMenu.emit(option);
    }

    /**
     * 全选键选择
     */
    selectall() {
        this.onSelectAll.emit();
    }


}
