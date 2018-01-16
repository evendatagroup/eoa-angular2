import { Injectable } from '@angular/core';
import { Cluster } from '../class/cluster';
import { _HttpClient } from '@delon/theme';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClusterService {
    constructor(private http: _HttpClient,private http2: HttpClient) { }

    // 获取公司所有人（通讯录）
    getLisWithUser(): Promise<Cluster[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaCluster/getListWithUser')
                .subscribe((res: any) => {
                    resolve(res.data)
                })
        })
    }

    getList(clusterVid): Promise<Cluster> {
        return new Promise((resolve, reject) => {
            this.http.get('oaCluster/getList', { clusterVid })
                .subscribe((res: any) => {
                    resolve(res.data[0])
                }) 
        })
    }
}
