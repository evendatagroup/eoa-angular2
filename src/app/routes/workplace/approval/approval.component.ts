import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

import { ProgressService } from '../../../service/progress.service';

@Component({
    selector: 'app-approval',
    templateUrl: './approval.component.html',
    styles: [`
    :host ::ng-deep .vertical-center-modal {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host ::ng-deep .vertical-center-modal .ant-modal {
      top: 0;
    }
  ` ],
    providers: [ProgressService]
})
export class ApprovalComponent implements OnInit {

    role = 4

    page = 1
    rows = 5

    total = 1

    input_title = ''
    selectStatus = 1

    userVid = JSON.parse(window.localStorage._token).userVid

    status = [
        { label: '待处理', value: 1 },
        { label: '通过', value: 2 },
        { label: '未通过', value: 3 }
    ];
    statusShow = ["", "待处理", "通过", "未通过"];
    status2 = { role: 2 };

    data = [];

    modal = { title: '', status: false, progress: '', option: 1 };
    modal2 = { title: '', status: false, pgId: '', ofId: '', progress: '' };

    constructor(private progressService: ProgressService, public msg: NzMessageService) { }

    getList(reset = false) {
        if (reset) {
            this.page = 1
        }
        let parames = {
            progressUserVid: this.userVid,
            progressRole: this.role,
            page: this.page,
            rows: this.rows,
            affairTitle: this.input_title,
            progressStatus: this.selectStatus,
            order: 'oa_progress.create_timestamp desc'
        }
        // console.log(parames)
        this.progressService
            .getListByPage(parames)
            .then(res => {
                this.data = res.data;
                this.total = parseInt(res.msg)
            });
    }

    // 重置
    reset() {
        this.page = 1
        this.rows = 5
        this.input_title = ''
        this.selectStatus = 2
        this.getList()
    }

    ngOnInit() {
        this.getList();
    }

    showMsg(i) {
        this.modal.title = '批准'
        this.modal.progress = i
        this.modal.status = true
    }

    handleOkMiddle(e) {
        console.log('点击了确定');
        this.modal.status = false;
    }

    handleCancelMiddle(e) {
        console.log(e);
        this.modal.status = false;
    }

    showMsg2(i) {
        this.modal2.title = '查阅进度'
        this.modal2.progress = i
        this.modal2.status = true
    }

    handleOkMiddle2(e) {
        console.log('点击了确定')
        this.modal2.status = false
    }

    handleCancelMiddle2(e) {
        console.log(e)
        this.modal2.status = false
    }

}
