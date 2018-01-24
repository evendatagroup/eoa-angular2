import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeData } from './tree-model'
/**
 * 树节点组件
 */
@Component({
  selector: 'c-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls:['./tree-node.component.less']
})

export class treeNodeComponent implements OnInit {


  list:Array<TreeData>;
  menu:Array<TreeData>;

  //输入数据
  @Input() data: TreeData;

  //单击事件
  @Output()
  onClick = new EventEmitter();

  //改变事件
  @Output()
  onCheckChanged = new EventEmitter();

  constructor() { }

  ngOnInit(){
    if(this.data.children){
      this.list = this.data.children.filter(item => !item.isMenu)
      this.menu = this.data.children.filter(item => item.isMenu)
    }
  }

  /**
   * 是否有子节点
   * @param item
   */
  isLeaf(item: TreeData) {
    return !item.children || !item.children.length;
  }

  /**
   * 展开节点
   */
  nodeExpended(item: TreeData) {
    //if (!this.isLeaf(item)) {
      item.isExpend = !item.isExpend;
    //}
  }

  /**
   * 点击
   * @param item
   */
  itemClicked(item: TreeData) {
    if(!item.isMenu) {
      item.isChecked = !item.isChecked;
      this.onCheckboxChanged(item);
    }else {
      this.nodeExpended(item);
      this.onClick.emit(item);
    }

  }

  /**
   * 选择框改变
   */
  onCheckboxChanged(item: TreeData) {
    this.onCheckChanged.emit(item);
  }

  /**
   * 全选子项isMenu=false
   * @param item
   */
  checkAll(item: TreeData) {
    if(item.children && item.children.length>0){
      let n: TreeData
      item.children.forEach(child=>{
        if(!child.isMenu){
          child.isChecked = true;
          n = child;
        }
      })
      this.onCheckboxChanged(n);
    }
  }



}
