import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { zip } from 'rxjs/observable/zip';
import { TranslateService } from '@ngx-translate/core';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { I18NService } from '../i18n/i18n.service';
import { UserService } from '../../service/user.service';
import { ProgressService } from '../../service/progress.service';


/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        private i18n: I18NService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private userService: UserService,
        private progressService: ProgressService,
        private httpClient: HttpClient,
        private injector: Injector) { }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
                this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`),
                this.httpClient.get('assets/app-data.json'),
                this.userService.getUser(),
                this.progressService.getCountDoing()
            ).subscribe(([langData, appData, userData, countDoing]) => {
                // setting language data
                this.translate.setTranslation(this.i18n.defaultLang, langData);
                this.translate.setDefaultLang(this.i18n.defaultLang);

                // application data
                const res: any = userData;
                // 应用信息：包括站点名、描述、年份
                this.settingService.setApp({
                    name: "Eoa",
                    description: "Even oa"
                });
                // 用户信息：包括姓名、头像、邮箱地址
                this.settingService.setUser({
                    name: res.userName,
                    avatar: res.avatar,
                    email: '',
                    userVid: res.userVid,
                });
                // ACL：设置权限为全量
                //this.aclService.setFull(true);
                // json转数组
                this.aclService.setRole(res.roles.map(item => item + ""));
                // 初始化菜单
                this.menuService.clear();
                let numb = 0;
                countDoing.forEach(item=>{numb += item.count})
                this.menuService.add(this.getMenu(res.menu,numb));
                // 设置页面标题的后缀
                this.titleService.suffix = 'Eoa';

                resolve(res);
            }, (err: HttpErrorResponse) => {
                resolve(null);
            });
        });
    }
    getMenu(arr,numb) {
        // 过滤不是侧边栏菜单，按父id排序
        arr = arr.filter(item => item.menuType == 1)
        // .sort((x, y) => {
        //     if (x.parentId > y.parentId) return 1;
        //     else if (x.parentId < y.parentId) return -1;
        //     else if (x.parentId == y.parentId) {
        //         return x.menuId > y.menuId ? 1 : -1;
        //     }
        // });
        // 添加字段 同步 框架的Menu
        arr.map(item => {
          if(item.menuName=='办事大厅'){
            item.badge = numb
          }
            item.group = item.isGroup == 1 ? true : false;
            item.menuId = item.menuId;
            item.parentId = item.parentId;
            item.text = item.menuName;
            item.translate = item.menuName;
            item.link = item.menuUrl;
            item.icon = item.menuLogo;
            item.reuse = false;
        });
        // 列表变json 增加children
        for (let i = arr.length - 1; i > -1; i--) {
            for (let j = i - 1; j > -1; j--) {
                if (arr[i].parentId == arr[j].menuId) {
                    arr[j].children = !arr[j].children ? [] : arr[j].children;
                    arr[j].children.unshift(arr[i]);
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        // console.log(arr)
        return arr;
    }

}
