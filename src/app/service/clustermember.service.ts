import { Injectable } from '@angular/core';
import { ClusterMember } from '../class/clustermember';
import { _HttpClient } from '@delon/theme';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClusterMemberService {
    constructor(private http: _HttpClient,private http2: HttpClient) { }

    getList(clusterVid): Promise<ClusterMember[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaClusterMember/getList', { clusterVid })
                .subscribe((res: any) => {
                    resolve(res.data)
                }) 
        })
    }
}
