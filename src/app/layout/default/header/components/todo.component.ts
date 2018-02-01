import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { map, groupBy, concatMap, mergeMap, flatMap, delay, tap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { NoticeItem } from '@delon/abc';
import { SettingsService } from '@delon/theme';
import { ListService } from '../../../../service/list.service';
import { UserService } from '../../../../service/user.service';
import { MsgService } from '../../../../service/msg.service';
import { ProgressService } from '../../../../service/progress.service';
import {DatePipe} from "@angular/common";
import { environment } from '@env/environment';
import { ProgressComponent } from '../../../../routes/workplace/launch/progress/progress.component';

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
    <nz-modal [nzFooter]="modalFooter4" [nzClosable]="false" [nzWidth]="'1024'" [nzWrapClassName]="'vertical-center-modal'" [nzContent]="modalContent4" [nzVisible]="modal.status" [nzTitle]="modal.title">
      <ng-template #modalContent4>
        <app-progress [progress]="modal.progress" (onSuccessF)="onSuccess($event)" [id]="'pdfDiv2'"></app-progress>
      </ng-template>
      <ng-template #modalFooter4>
        <button nz-button [nzType]="'default'" [nzSize]="'large'" (click)="handleClose($event)">
          返 回
        </button>
        <button nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="handleSubmit($event)">
          发 布
        </button>
      </ng-template>
    </nz-modal>
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

    userVid = JSON.parse(window.localStorage._token).userVid

    modal = { title: '', status: false, progress: '', option: 1 };
    @ViewChild(ProgressComponent)
    private progressComponent: ProgressComponent;

    role = ["", "发起", "审核", "会签", "批准", "执行"];

    constructor(private msg: NzMessageService,
                private settings: SettingsService,
                private listService: ListService,
                private progressService: ProgressService,
                private datePipe: DatePipe,
                private userService: UserService,
                private msgService: MsgService) {
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
        ).subscribe(res => {
            this.loading = false
        });
    }

    loadData(res) {
        // console.log('outside:', res, this.loading)
        // if (!res || this.loading){
        //     console.log('inside:', res, this.loading)
        //     // return;
        // } 
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
        // console.log(this.msgList)
        // console.log(this.data)
        if(this.msgList.length > 0){
            for (let msg in this.msgList) {
                let m = this.msgList[msg];
                datetime = this.datePipe.transform(new Date(m.createTimestamp * 1000), "yyyy-MM-dd");
                let item = {
                    id: m.inforId,
                    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
                    title: m.inforTitle,
                    datetime: datetime,
                    url: m.url,
                    readStatus: m.readStatus,
                    type: '通知'
                }
                data.push(item);
            }
        }else{
            this.data[0].list = [];
        }
        if(this.todoList.length > 0){
            for (let todo in this.todoList) {
                let t = this.todoList[todo];
                let item = {
                    id: t.affairId,
                    title: t.affairTitle,
                    description: '待处理的进度事项',
                    extra: '待' + this.role[t.progressRole],
                    status: 'todo',
                    progress: t,
                    type: '待办'
                }
                data.push(item)
            }
        }else{
            this.data[1].list = [];
        }
        // console.log(data)
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
                // console.log('1', res)
                this.msgList = res.data
                // console.log(res)
                if(this.count1 > 0 && this.count >= this.count1){
                    this.count -= this.count1;
                }
                this.count1 = parseInt(res.msg)

                if (this.count2 != undefined) {
                    this.count = this.count1 + this.count2;
                }
                // console.log('2', this.count2)
                this.loadData(res);
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
                if(this.count2 > 0 && this.count >= this.count2){
                    this.count -= this.count2;
                }
                this.count2 = parseInt(res.msg)
                if (this.count1 != undefined) {
                    this.count = this.count1 + this.count2;
                }
                // console.log('1', this.count1)
                this.loadData(res);
            });
    }

    clear(type: string) {
        if(type == '通知'){
            this.loading = false;
            this.clearMsgRead();
            this.msg.success(`清空了 ${type}`);
            //this.data[0].list = [];
        }else if(type == '待办'){
            this.msg.warning('无法清空，请速处理！');
        }
    }

    select(res: any) {
        // console.log(res)
        if(res.title == '通知'){
            window.open(environment.FILE_URL + res.item.url, "", "width=600, height=600");
            if(res.item.readStatus == 0){
                this.editRead(res);
            }
        }else if(res.title == '待办'){
            this.randNum = Math.random();
            // console.log(res)
            this.modal.title = this.role[res.item.progress.progressRole]
            this.modal.progress = res.item.progress
            // console.log(this.modal.progress)
            this.modal.status = true
        }
        // this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
    }

    handleClose(e) {
        console.log('点击了关闭')
        this.modal.status = false;
    }

    handleSubmit(e) {
        console.log('点击了提交')
        this.progressComponent.submit();
        this.modal.status = false;
    }

    onSuccess(res) {
        // console.log('res',res);
        if(res == '操作成功'){
          this.getTodo();
        }
    }


    editRead(l) {
        this.userService.editRead({ inforId: l.item.id, userVid: this.userVid, readStatus: 1 })
            .then(res => {
                // console.log(res)
                this.getMsg();
            })
    }

    clearMsgRead() {
        this.msgService
                .clearMsgRead()
                .then(res => {
                    // console.log(res)
                    this.getMsg();
                })
    }

    // 修改办事大厅的未办事项数
    // editMenuBadge() {
    //     this.progressService
    //         .getCountDoing()
    //         .then(countDoing => {
    //             let numb = 0;
    //             countDoing.forEach(item => {
    //                 numb += item.count;
    //             })
    //             this.menuService.menus[0].children.forEach(item=>{
    //                 if(item.menuId == 27){
    //                     item.badge = numb;
    //                     this.menuService.resume();
    //                     return;
    //                 }
    //             })
    //         })
    // }
}
