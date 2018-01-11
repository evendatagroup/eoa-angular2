import { Injectable } from '@angular/core';
import { User } from './user.class';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    constructor(private http: _HttpClient) { }

    // 获取用户信息
    getUser() {
        return new Promise((resolve, reject) => {
          console.log(1)
            this.http.get('oaUserList/getUser')
                .subscribe((res: any) => {
                  console.log(1)
                    resolve(res.data);
                });
        });
    }
}
