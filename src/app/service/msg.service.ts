import { Injectable } from '@angular/core';
import { Msg } from '../class/msg';
import { _HttpClient } from '@delon/theme';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MsgService {
    constructor(private http: _HttpClient,private http2: HttpClient) { }

    // 获取公司所有人（通讯录）
    getList(toVid): Promise<Msg[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaMsg/getList?order=oa_msg.create_timestamp desc', { toVid })
                .subscribe((res: any) => {
                    resolve(res.data)
                })
        })
    }

    getListByPage(toVid): Promise<Msg[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaMsg/getListByPage?page=1&rows=10&order=oa_msg.create_timestamp desc', { toVid })
                .subscribe((res: any) => {
                    resolve(res.data)
                })
        })
    }

    edit(parames): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('oaMsg/edit', {}, parames)
                .subscribe((res: any) => {
                    resolve(res);
                })
        })
    }
}
