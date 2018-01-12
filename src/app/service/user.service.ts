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
                        .subscribe(res2 => {
                            res.data[0].modelId = res2.data[0].modelId;
                            resolve(res.data[0]);
                        })
                });
        });
    }
}
