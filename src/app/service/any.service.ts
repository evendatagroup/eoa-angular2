import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class AnyService {
    constructor(private http: _HttpClient) { }

    getList(params): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oa' + params.url + '/getList', params)
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }
    getListWithUser(params): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oa' + params.url + '/getListWithUser', params)
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }
    edit(params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('oa' + params.url + '/edit', {}, params.data)
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }
    getUserListByGroupRole(groupRoles): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaUserList/getListByGroupRole', { groupRoles })
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }

}
