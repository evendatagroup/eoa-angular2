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

    getUserAddress() {
      // 机构-人-角色
      return new Promise((resolve,reject)=> {
        this.http.get('oaUserList/getList')
        .subscribe((res:any)=>{
          let arr = res.data
          let result = arr.splice(0)
          result.forEach(item=>{
            this.find1(result,item);
          })
          resolve(result.filter(item => item.deptParentId==0))
        })
      })
    }
    getRoleAddress() {
      // 机构-角色（多人）
      return new Promise((resolve,reject)=> {
        this.http.get('oaUserList/getList')
        .subscribe((res:any)=>{
          let arr = res.data
          let result = arr.splice(0)
          result.forEach(item=>{
            this.find2(result,item);
          })
          resolve(result.filter(item => item.deptParentId==0))
        })
      })
    }
    find1(arr,item){
      if(arr.length>0){
        arr.forEach(i=>{
          if(i.deptId==item.deptParentId){
            if(!i.children){
              i.children = []
            }
            i.children.push(item);
          }else if(i.children){
            this.find1(i,item)
          }
        })
      }
    }
    find2(arr,item){
      if(arr.length>0){
        arr.forEach(i=>{
          if(i.deptId==item.deptParentId){
            if(!i.children){
              i.children = []
            }
            let role = false;
            i.children.forEach(child=>{
              if(child.roleId==item.roleId){
                // 同角色
                child.userVid += ','+item.userVid;
                child.userName += ','+item.userName;
                role = true;
              }
            })
            if(!role){
              i.children.push(item);
            }
          }else if(i.children){
            this.find2(i,item)
          }
        })
      }
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
}
