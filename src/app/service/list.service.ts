import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { List } from '../class/list';
import { Reader } from '../class/Reader';
import { Group } from '../class/Group';

// 获取新闻等列表
@Injectable()
export class ListService {

  constructor(private http: _HttpClient) { }

  getList(parames): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('oaInfor/getListByPageWithUser?order=oa_infor.create_timestamp desc', parames)
          .subscribe((res: any) => {
            resolve(res)
          });
    });
  }

  getListByPage(id, page, rows): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = 'oaInfor/getListByPageWithUser?order=oa_infor.create_timestamp desc&rows=' + rows + '&inforType=' + id + '&page=' + page;
      this.http.get(url)
          .subscribe((res: any) => {
            resolve(res);
          });
    });
  }

  getReaderList(params): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get('oaRead/getList',params)
          .subscribe((res: any) => {
            resolve(res.data);
          });
    });
  }

  getGroup(): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      let url = 'user_group/getUserGroupList';
      this.http.get(url)
          .subscribe((res: any) => {
            resolve(res.data);
          });
    });
  }
}
