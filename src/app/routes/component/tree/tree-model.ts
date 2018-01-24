/**
 * 菜单数据
 */
export class TreeData{

   //ID
   id:string;

   //父ID
   parentId:string;

   //名称
   name:string;

   //关键字
   keyWord:string;

   //图标
   icon:string;

   //是否展开
   isExpend?:boolean=false;

   //是否选中
   isChecked?:boolean=false;

   //是否全部子节点选中
   isIndeterminate?:boolean=false;

   //是否菜单
   isMenu:boolean;

   //属性
   attr?:any;

   //子节点
   children?:Array<TreeData>;

}
