import { Injectable } from '@angular/core';
import { Infor } from '../class/infor';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class ChatDbService {
    constructor(private http: _HttpClient) { }

    getList(params): Promise<Infor[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaInfor/getList',params)
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }
    
    getListByPageWithUser(params): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaInfor/getListByPageWithUser',params)
                .subscribe((res: any) => {
                    resolve(res);
                });
        });
    }
}
