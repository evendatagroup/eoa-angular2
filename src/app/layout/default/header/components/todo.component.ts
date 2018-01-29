import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { map, groupBy, concatMap, mergeMap, flatMap, delay, tap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { NoticeItem } from '@delon/abc';
import { SettingsService } from '@delon/theme';
import { ListService } from '../../../../service/list.service';
import { ProgressService } from '../../../../service/progress.service';
import {DatePipe} from "@angular/common";

/**
 * 菜单通知
 */
@Component({
    selector: 'header-todo',
    template: `
    <notice-icon
        [data]="data"
        [count]="count"
        [loading]="loading"
        (select)="select($event)"
        (clear)="clear($event)"
        (popupVisibleChange)="loadData($event)"></notice-icon>
    `,
    providers: [ListService, ProgressService, DatePipe]
})
export class HeaderTodoComponent implements OnInit {

    data: NoticeItem[] = [
        { title: '通知', list: [], emptyText: '你已查看所有通知', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg' },
        { title: '待办', list: [], emptyText: '你已完成所有待办', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg' }
    ];
    count = 0;
    count1;
    count2;
    loading = false

    msgList = []
    todoList = []


    constructor(private msg: NzMessageService,
        private settings: SettingsService,
        private listService: ListService,
        private progressService: ProgressService,
        private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.getMsg();
        this.getTodo();
    }

    private parseGroup(data: Observable<any[]>) {
        console.log('parseGroup');
        data.pipe(
            concatMap((i: any) => i),
            map((i: any) => {
                if (i.datetime) i.datetime = moment(i.datetime).fromNow();
                // change to color
                if (i.status) {
                    i.color = ({
                        todo: '',
                        processing: 'blue',
                        urgent: 'red',
                        doing: 'gold',
                    })[i.status];
                }
                return i;
            }),
            groupBy((x: any) => x.type),
            mergeMap(g => g.pipe(toArray())),
            tap((ls: any) => {
                this.data.find(w => w.title === ls[0].type).list = ls;
            })
        ).subscribe(res => this.loading = false);
    }

    loadData(res) {
        if (!res || this.loading) return;
        let data = [];
        let list1 = [];
        let id = '';
        let avatar = 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png';
        let title = '';
        let datetime = '';
        let type1 = '通知';
        let type2 = '待办';
        let description = '';
        let extra = '未开始';
        let status = 'todo';
        for (let msg in this.msgList) {
            let m = this.msgList[msg];
            datetime = this.datePipe.transform(new Date(m.createTimestamp * 1000), "yyyy-MM-dd");
            let item = {
                id: m.inforId,
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
                title: m.inforTitle,
                datetime: datetime,
                type: '通知'
            }
            data.push(item);
        }
        for (let todo in this.todoList) {
            let t = this.todoList[todo];
            let item = {
                id: t.affairId,
                title: t.affairTitle,
                description: '待处理的进度事项',
                extra: '待处理',
                status: 'todo',
                type: '待办'
            }
            data.push(item)
        }
        this.loading = true;
        this.parseGroup(ArrayObservable.of(data).pipe(delay(1000)));
    }

    // 获取通知列表
    getMsg() {
        let parames = {
            page: 1,
            rows: 5,
            readStatus: 0
        }
        this.listService
            .getList(parames)
            .then(res => {
                // console.log('1', res.msg)
                this.msgList = res.data
                this.count1 = parseInt(res.msg)
                if (this.count2 != undefined) {
                    this.count += this.count1 + this.count2;
                }
                // console.log('2', this.count2)
            });
    }

    // 获取待办列表
    getTodo() {
        let parames = {
            page: 1,
            rows: 5,
            progressUserVid: this.settings.user.userVid,
            progressStatus: 1,
            order: 'oa_progress.create_timestamp asc'
        }
        this.progressService
            .getListByPage(parames)
            .then(res => {
                this.todoList = res.data;
                // console.log('2', res.msg)
                this.count2 = parseInt(res.msg)
                if (this.count1 != undefined) {
                    this.count += this.count1 + this.count2;
                }
                // console.log('1', this.count1)
            });
    }

    clear(type: string) {
        this.msg.success(`清空了 ${type}`);
    }

    select(res: any) {
        this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
    }
}
