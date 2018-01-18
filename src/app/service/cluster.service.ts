import { Injectable } from '@angular/core';
import { Cluster } from '../class/cluster';
import { _HttpClient } from '@delon/theme';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClusterService {
    constructor(private http: _HttpClient,private http2: HttpClient) { }

    // 获取公司所有人（通讯录）
    getLisWithUser(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get('oaCluster/getListWithUser')
                .subscribe((res: any) => {
                  let result = [];
                  result = res.data.reduce((previous, current) => {
                    let findcurrent = false;
                    for(let i=0;i<previous.length;i++){
                      if(previous[i].clusterVid==current.clusterVid){
                        findcurrent = true;
                        previous[i].children.push(current)
                      }
                    }
                    if(!findcurrent) {
                      let c = {}
                      for(let key in current){
                        c[key]=current[key];
                      }
                      current.children = [c];
                      previous.push(current);
                    }
                    return previous
                  }, [])
                    resolve(result)
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
