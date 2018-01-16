import { Injectable } from '@angular/core';
import { User } from '../class/user.class';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    constructor(private http: _HttpClient) { }

    // 登录
    login(username, password): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('oaUserList/loginoa',{},{username,password})
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }

    // 获取公司所有人（通讯录）
    getList(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaUserList/getList')
                .subscribe((res: any) => {
                    resolve(res.data)
                })
        })
    }

    // 根据Id获取某个人
    getListById(userVid): Promise<User> {
        return new Promise((resolve, reject) => {
            this.http.get('oaUserList/getList', { userVid })
                .subscribe((res: any) => {
                    resolve(res.data[0])
                })
        })
    }

    getUserAddress(): Promise<any[]> {
      // 机构-人-角色
      return new Promise((resolve,reject)=> {
        this.http.get('oaUserList/getList')
        .subscribe((res:any)=>{
          let result = this.nodeListUser(res.data)
          result.forEach(item=>{
            this.list2Json(result,item);
          })
          resolve(result.filter(item => item.parentId==0))
        })
      })
    }
    getRoleAddress(): Promise<any[]> {
      // 机构-角色（多人）
      return new Promise((resolve,reject)=> {
        this.http.get('oaUserList/getList')
        .subscribe((res:any)=>{
          let result = this.nodeList(res.data)
          result.forEach(item=>{
            this.list2Json(result,item);
          })
          resolve(result.filter(item => item.parentId==0))
        })
      })
    }

    // 获取用户信息
    getUser() {
        return new Promise((resolve, reject) => {
            this.http.get('oaUserList/getUser')
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }

    // 修改用户信息
    editUser(data) {
        return new Promise((resolve, reject) => {
            this.http.post('user/editUser', {}, data)
                .subscribe((res: any) => {
                    resolve(res);
                });
        });
    }

    // 修改用户密码
    editPassword(password, newpassword) {
        return new Promise((resolve, reject) => {
            this.http.post('user/editPassword', {}, { password, newpassword })
                .subscribe((res: any) => {
                    resolve(res);
                });
        });
    }

    // 获取待办事项
    getTodoList(role): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.post('progress_info/getList?page=1&rows=10', {}, { role })
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }

    // 上传审核意见
    uploadReview(data) {
        return new Promise((resolve, reject) => {
            this.http.post('progress_info/edit', {}, data)
                .subscribe((res: any) => {
                    resolve(res);
                });
        });
    }

    // 获取新闻/请假详细信息
    getOffice(officeId) {
        return new Promise((resolve, reject) => {
            this.http.post('office_info/getOfficeInfoList?page=1&rows=4', {}, { officeId })
                .subscribe((res: any) => {
                    this.http.get('flow/getFlowList?page=1&rows=1&flowId=' + res.data[0].flowId)
                        .subscribe((res2:any) => {
                            res.data[0].modelId = res2.data[0].modelId;
                            resolve(res.data[0]);
                        })
                });
        });
    }

    // 更新阅读状态
    editRead(params):Promise<any> {
      console.log(params)
        return new Promise((resolve, reject) => {
            this.http.get('oaRead/edit', params)
                .subscribe((res: any) => {
                    resolve(res);
                });
        });
    }
    
    //机构-人列表
    nodeListUser(list){
      let groupList = this.nodeGroupList(list);
      list.forEach(item=>{
        for(let i=0;i<groupList.length;i++){
          if(groupList[i].id==item.deptId){
            groupList[i].children = groupList[i].children || [];
            item.id = item.userVid;
            item.name = `${item.userName}(${item.roleName})`
            groupList[i].children.push(item);
            break;
          }
        }
      })
      return groupList
    }
    //机构-角色列表
    nodeList(list){
      let groupList = this.nodeGroupList(list);
      list.forEach(item=>{
        for(let i=0;i<groupList.length;i++){
          if(groupList[i].id==item.deptId){
            groupList[i].children = groupList[i].children || [];
            let find = false;
            groupList[i].children.forEach(role=>{
              if(!find && role.roleId==item.roleId){
                role.userVid += ','+item.userVid;
                role.userName += ','+item.userName;
                role.name = `${role.roleName}(${role.userName})`
                find = true
              }
            })
            if(!find){
              item.id = groupList[i].id+'-'+item.roleId;
              item.name = `${item.roleName}(${item.userName})`
              groupList[i].children.push(item);
            }
            break;
          }
        }
      })
      return groupList
    }
    // 获取组织机构列表
    nodeGroupList(list){
      return list.reduce((previous, current) => {
        if(!previous.some(item=>item.id==current.deptId)){
          // 不存在
          previous.push({id:current.deptId,name:current.deptName,parentId:current.deptParentId});
        }
        return previous;
      }, [])
    }
    list2Json(arr,item){
      if(arr.length>0){
        arr.forEach(i=>{
          if(i.id==item.parentId){
            if(!i.children){
              i.children = []
            }
            i.children.push(item);
          }else if(i.children){
            this.list2Json(i,item)
          }
        })
      }
    }
}
