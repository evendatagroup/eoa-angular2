import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeData } from './tree-model'

/**
 * 树
 */
@Component({
    selector: 'c-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {

    //输入数据
    @Input() data: Array<TreeData>;

    //单击事件
    @Output()
    onClick = new EventEmitter();

    //改变事件
    @Output()
    onCheckChanged = new EventEmitter();

    //所有数据
    private allData: Array<TreeData>;

    //搜索隐藏
    searchMsgHidden: boolean = true;


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
        item.isIndeterminate = false;
        this.checkedChildrenNodes(item, item.id, item.isChecked);
        this.checkedParentNode(item);
    }

    /**
     * 选中所有子节点
     */
    private checkedChildrenNodes(item: TreeData, id: string, checkedState: boolean) {

        if (!!item.children) {
            item.children.forEach(child => {
                if (child.parentId == item.id) {
                    child.isIndeterminate = false;
                    child.isChecked = checkedState;
                }
                if (child.children) {
                    this.checkedChildrenNodes(child, child.id, checkedState);
                }
            })
        }
    }

    /**
   * 选择父节点
   * @param item
   */
    private checkedParentNode(item: TreeData) {
        let nodeList = new Array<TreeData>();
        //查询到当前节点的父节点
        for (let i = 0; i < this.data.length; i++) {
            this.searchParentNode(this.data[i], item.parentId, nodeList);
        }

        if (nodeList && nodeList.length > 0) {
            let parentNode = nodeList[0];
            let checkedCount = 0;
            let checkedIndeterminate = 0;
            for (let j = 0; j < parentNode.children.length; j++) {
                if (parentNode.children[j].isChecked) {
                    checkedCount += 1;
                }
                if (parentNode.children[j].isIndeterminate) {
                    checkedIndeterminate += 1;
                }
            }

            //子节点选择的数量与父节点一样时，父节点选中，不一样时父节点取消选中
            if (parentNode.children.length == checkedCount) {
                parentNode.isChecked = true;
                parentNode.isIndeterminate = false;
            } else if (checkedCount > 0 || checkedIndeterminate > 0) {
                parentNode.isChecked = false;
                parentNode.isIndeterminate = true;
            } else {
                parentNode.isIndeterminate = false;
                parentNode.isChecked = false;
            }

            //选择自己的父节点
            this.checkedParentNode(parentNode);
        }
    }

    /**
     * 查询父节点
     * @param item
     * @param parentId
     * @param nodeList
     */
    private searchParentNode(item: TreeData, parentId: string, nodeList: Array<TreeData>) { //查找父节点
        if (item.id == parentId) {
            nodeList.push(item);
            return;
        }

        let nodes = item.children;
        if (nodes && null != nodes && undefined != nodes) {
            for (let i = 0; i < nodes.length; i++) {
                this.searchParentNode(nodes[i], parentId, nodeList);
            }
        }
    }

    /**
   * 查询树
   */
  searchTree(searchTxt: string = '') {
    let tempData = this.allData;
    searchTxt = searchTxt.trim();
    this.searchMsgHidden = true;
    if ('' != searchTxt) {
      let keyWord = new RegExp(searchTxt);
      let nodeList = new Array<TreeData>();
      let nodeIdList = new Array<string>();

      for (let item of tempData) {
        this.searchItem(item, nodeList, nodeIdList, keyWord);
      }
      if (nodeList.length > 0) {
        this.data = nodeList;
      } else {
        this.searchMsgHidden = false;
      }

    } else {
      this.data = this.allData;
    }
  }

  /**
  * 查询子菜单
  * @param item
  * @param nodeIdList
  */
  private searchItem(item: TreeData, nodeList: Array<TreeData>, nodeIdList: Array<string>, keyWord: RegExp) {
    item.isExpend = false;
    //关键字匹配，并且不在列表中的
    if ((item.name.match(keyWord) || item.keyWord.match(keyWord)) && !this.checkSearchTreeIdExists(item.id, nodeIdList)) {
      nodeList.push(item);
      this.pushSearchTree(item, nodeIdList);
    }

    //存在子菜单的，递归子菜单
    let itemChildren = item.children;
    if (itemChildren && itemChildren.length > 0) {
      for (let subItem of itemChildren) {
        this.searchItem(subItem, nodeList, nodeIdList, keyWord);
      }
    }
  }

  /**
   *
   * @param id 检查菜单id是否存在
   * @param nodeIdList
   */
  private checkSearchTreeIdExists(id, nodeIdList: Array<string>) {
    for (let nodeId of nodeIdList) {
      if (nodeId == id) {
        return true;
      }
    }

    return false;
  }

  /**
    * 添加查询的菜单
    * @param item
    * @param nodeIdList
    */
  private pushSearchTree(item: TreeData, nodeIdList: Array<string>) {
    nodeIdList.push(item.id);
    let itemChildren = item.children;
    if (itemChildren && itemChildren.length > 0) {
      for (let subItem of itemChildren) {
        this.pushSearchTree(subItem, nodeIdList);
      }
    }
  }

}
