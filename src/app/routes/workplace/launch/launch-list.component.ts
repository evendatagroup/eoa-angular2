import { Component, OnInit } from '@angular/core';

// import { UserService } from '../../../service/user.service';
import { ProgressService } from '../../../service/progress.service';

@Component({
    selector: 'launch-list',
    template: `
    <div style="height: 24px;"></div>
        <nz-card [nzBordered]="false">
            <form nz-form (ngSubmit)="getList()" [nzLayout]="'inline'" >
                <div nz-row [nzGutter]="24">
                    <div nz-col [nzSpan]="6" class="mb-md">
                        <div nz-form-item class="d-flex">
                            <div nz-form-label><label for="status">标题</label></div>
                            <div nz-form-control class="flex-1">
                                <nz-input [(ngModel)]="input_title" name="input_title" ></nz-input>
                            </div>
                        </div>
                    </div>
                    <div nz-col [nzSpan]="8" class="mb-md">
                        <div nz-form-item class="d-flex">
                            <div nz-form-label><label for="status">状态</label></div>
                            <div nz-form-control class="flex-1">
                                <nz-select [(ngModel)]="selectStatus" name="status" [nzPlaceHolder]="'请选择'">
                                    <nz-option *ngFor="let i of status;" [nzLabel]="i.label" [nzValue]="i.value"></nz-option>
                                </nz-select>
                            </div>
                        </div>
                    </div>
                    <div nz-col [nzSpan]="8" class="mb-md">
                        <button nz-button type="submit" [nzType]="'primary'" [nzSize]="'large'">查询</button>
                        <button nz-button (click)="reset()" [nzSize]="'large'" class="mx-sm">重置</button>
                    </div>
                </div>
            </form>
        </nz-card>
        <nz-card [nzBordered]="false">
            <nz-table #nzTable
                [nzAjaxData]="data"
                nzShowSizeChanger
                [nzTotal]="total"
                [nzPageSizeSelectorValues]=[5,10,20,50]
                [(nzPageIndex)]="page"
                (nzPageIndexChange)="getList()"
                [(nzPageSize)]="rows"
                (nzPageSizeChange)="getList(true)">
                <thead nz-thead>
                    <tr>
                        <th nz-th><span>标题</span></th>
                        <th nz-th><span>状态</span></th>
                        <th nz-th><span>操作</span></th>
                    </tr>
                </thead>
                <tbody nz-tbody>
                    <tr nz-tbody-tr *ngFor="let i of nzTable.data">
                        <td nz-td>{{i.affairTitle}}</td>
                        <td nz-td>{{statusShow[i.progressStatus]}}</td>
                        <td nz-td>
                            <a (click)="showMsg2(i)">查阅进度</a>
                            <span nz-table-divider *ngIf="i.progressStatus==1"></span>
                            <a (click)="reLaunch()" *ngIf="i.progressStatus==1">重新发起</a>
                        </td>
                    </tr>
                </tbody>
            </nz-table>
        </nz-card>

        <nz-modal [nzFooter]="modalFooter" [nzClosable]="false" [nzWidth]="'1024'" [nzWrapClassName]="'vertical-center-modal'" [nzContent]="modalContent3" [nzVisible]="modal2.status" [nzTitle]="modal2.title">
          <ng-template #modalContent3>
            <app-review-progress [progress]="modal2.progress" [randNum]="randNum"></app-review-progress>
          </ng-template>
          <ng-template #modalFooter>
            <button nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="handleClose($event)">
              关 闭
            </button>
          </ng-template>
        </nz-modal>`,
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
    providers: [ ProgressService ]
})

export class LaunchListComponent {
  randNum: any;

  role = 1

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
  statusShow = [ "", "待处理", "通过", "未通过"];
  status2 = { role: 2 };

  data = [];

  modal = { title: '', status: false, progress: '', option: 1};
  modal2 = {title:'',status:false,pgId:'',ofId:'', progress: ''};

  constructor(private progressService: ProgressService) {}

  getList(reset = false) {
    if(reset){
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

  showMsg2(i) {
    this.randNum = Math.random();
    this.modal2.title = '查阅进度'
    this.modal2.progress = i
    this.modal2.status = true
  }

  handleClose(e) {
    console.log('点击了关闭')
    this.modal2.status = false;
  }

  reLaunch() {
    console.log('点击了重新发起')
  }
}
