import { Component } from '@angular/core';
import { Router, NavigationEnd, RouteConfigLoadStart, NavigationError } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';

import { ChatService } from '../../service/chat.service';

@Component({
    selector: 'layout-default',
    templateUrl: './default.component.html'
})
export class LayoutDefaultComponent {
    isFetching = false;
    _userVid = JSON.parse(window.localStorage._token).userVid;

    constructor(
        router: Router,
        scroll: ScrollService,
        private _message: NzMessageService,
        public menuSrv: MenuService,
        public settings: SettingsService,
        public chatService: ChatService) {
        // scroll to top in change page
        router.events.subscribe(evt => {
            if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
                this.isFetching = true;
            }
            if (evt instanceof NavigationError) {
                this.isFetching = false;
                _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
                return;
            }
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            setTimeout(() => {
                scroll.scrollToTop();
                this.isFetching = false;
            }, 100);
        });
        // console.log('start')
        this.logined();
    }

    logined() {
        this.chatService
            .login(this._userVid);
    }
}
