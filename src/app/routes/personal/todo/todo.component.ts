import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { UserService } from '../../../service/user.service';
import { environment } from '@env/environment';

import { ListService } from '../../../service/list.service';
import { ProgressService } from '../../../service/progress.service';

import { ProgressComponent } from '../../workplace/launch/progress/progress.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styles: []
})
export class TodoComponent implements OnInit {
  @ViewChild(ProgressComponent)
  private progressComponent: ProgressComponent;

  page = 1
  rows = 5
  readStatus = 0;

  total = 1

  page2 = 1
  rows2 = 5
  total2 = 1
	

  status = { progressStatus: 2 };
  // 事务中担任的角色 1:发起，2:审核，3:会签，4:批准，5:执行
  role = [ "", "发起", "审核", "会签", "批准", "执行"];
  todoList = [];
  progressList = [];
  // statusShow = ["", "待处理", "通过", "未通过"];
  modal = { title: '', status: false, progress: '', option: 1 };
  // progressRole
  // roleShow = ["", "", "#/workplace/review", "#/workplace/sign", "#/workplace/approval", "#/workplace/exe"]
  title1 = ''
  title2 = ''
  isShowPdf = false;
  modal2 = {
      title: '',
      status: false,
      infor: ''
  }
  userVid = JSON.parse(window.localStorage._token).userVid

  constructor(private listService: ListService,
              private userService: UserService,
              private settingService: SettingsService,
              private progressService: ProgressService) { }

  getList(reset = false) {
    if (reset) {
      this.page = 1;
    }
    let parames = {
      page: this.page,
      rows: this.rows,
      readStatus: this.readStatus
    }
    this.listService
        .getList(parames)
        .then(res => {
          // console.log(res)
          this.todoList = res.data
          this.total = parseInt(res.msg)
          this.title1 = "未读信息（" + this.total + "）条";
        });
  }

  getList2(reset = false) {
    if (reset) {
        this.page2 = 1
    }
    let parames = {
        progressUserVid: this.settingService.user.userVid,
        page: this.page2,
        rows: this.rows2,
        progressStatus: 1,
        order: 'oa_progress.create_timestamp asc'
    }
    // console.log(parames)
    this.progressService
        .getListByPage(parames)
        .then(res => {
            this.progressList = res.data;
            // console.log(res.data)
            this.total2 = parseInt(res.msg)
            this.title2 = "未办事项（" + this.total2 + "）项";
        });
  }

  ngOnInit() {
    this.getList();
  	this.getList2();
    // console.log('user',this.settingService.user)
  }

  showPdf(l) {
    this.isShowPdf = true;
    this.modal2.infor = l;
    // console.log(l)
    this.modal2.status = true;
    this.modal2.title = l.value;
    if(l.readStatus == 0){
      // this.editRead(l);
    }
  }

  editRead(l) {
    this.userService.editRead({ inforId: l.inforId, userVid: this.userVid, readStatus: 1 })
        .then(res => {
          console.log(res)
        })
  }


  // showPdf(l) {
  //   window.open(environment.FILE_URL + l.url);
  //   this.userService.editRead({ inforId: l.inforId, userVid: this.settingService.user.userVid, readStatus: 1 })
  //       .then(res => {
  //           this.getList()
  //       })
  // }

  showMsg(i) {
    console.log(i.progressStatus)
    this.modal.title = this.role[i.progressRole]
    this.modal.progress = i
    this.modal.status = true
  }

  handleClose(e) {
    console.log('点击了关闭')
    this.modal.status = false;
  }

  handleSubmit(e) {
    console.log('点击了提交')
    this.progressComponent.submit()
  }

  onSuccess(res) {
    console.log('res',res);
    if(res == '操作成功'){
      this.refresh();
    }
  }

  refresh() {
    this.getList2();
    this.modal.status = false;
  }
}
