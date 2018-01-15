import { Injectable } from '@angular/core';
//import { Progress } from './progress.class';
import { ProgressUser } from '../class/ProgressUser';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class ProgressService {
    constructor(private http: _HttpClient) { }

    // getList(params): Promise<Progress[]> {
    //     return new Promise((resolve, reject) => {
    //         this.http.get('oaProgress/getList', params)
    //             .subscribe((res: any) => {
    //                 resolve(res.data);
    //             });
    //     });
    // }
    getListByPage(params): Promise<any> {
        console.log(params)
        return new Promise((resolve, reject) => {
            this.http.get('oaProgress/getListByPage', params)
                .subscribe((res: any) => {
                    console.log(res)
                    resolve(res);
                });
        });
    }

    // 上传审核意见
    edit(Progress): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get('oaProgress/edit', Progress)
                .subscribe((res: any) => {
                    resolve(res.data);
                });
        });
    }
    upAffair(data): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('oaAffair/edit', {}, data)
                .subscribe((res: any) => {
                    res.data.progressStatus = 2;
                    this.http.post('oaProgress/edit', {}, res.data)
                        .subscribe((res:any) => {
                            resolve(res.data);
                        })
                });
        });
    }

    getAffairById(affairId): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get('oaAffair/getListByPage?page=1&rows=1', { affairId })
                .subscribe((res: any) => {
                    resolve(res.data[0])
                })
        })
    }

    getListAndUser(parames): Promise<ProgressUser[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaProgress/getListAndUser', parames)
                .subscribe((res: any) => {
                    resolve(res.data)
                })
        })
    }
    getCountDoing(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaProgress/getCountDoing')
                .subscribe((res: any) => {
                    resolve(res.data)
                })
        })
    }
}
