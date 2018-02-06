import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ListService } from '../../../service/list.service';
import { ProgressUser } from '../../../class/ProgressUser';
import { ProgressService } from '../../../service/progress.service';
import { DatePipe } from "@angular/common";
import { UserService } from '../../../service/user.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ListService, DatePipe]
})
export class HomeComponent implements OnInit {
	title = "部门首页";
  imglist = [];
	imgs: any;
  parames21imgs = {
    inforType: 21,
    page: 1,
    rows: 5,
    imgs: 'nonull'
  }
  parames21 = {
    inforType: 21,
    page: 1,
    rows: 8
  }
  parames22 = {
    inforType: 22,
    page: 1,
    rows: 8
  }
  parames23 = {
    inforType: 23,
    page: 1,
    rows: 8
  }
  parames24 = {
    inforType: 24,
    page: 1,
    rows: 8
  }
  parames25 = {
    inforType: 25,
    page: 1,
    rows: 8
  }

  progressUser: ProgressUser[];
  role = ["", "发起", "审核", "会签", "批准", "执行"];
  userVid = JSON.parse(window.localStorage._token).userVid
  isShowPdf = false;
  modal = {
    title: '',
    status: false,
    infor: ''
  }
  randNum: any;

  constructor(public msg: NzMessageService,
              private listService: ListService,
              private progressService: ProgressService,
              private datePipe: DatePipe,
              private userService: UserService) { }

  getImg() {
    this.listService
        .getList(this.parames21imgs)
        .then(res => {
          this.imglist = res.data
          this.imglist.map(item => item.imgs = item.imgs.split(',')[0]);
          console.log(this.imglist)
        });
  }

  ngOnInit() {
    this.getImg();
  }

  showPdf(l) {
    this.isShowPdf = true;
    this.randNum = Math.random();
    this.modal.infor = l;
    this.modal.status = true;
    this.modal.title = l.value;
    if(l.readStatus == 0){
      this.editRead(l);
    }
  }

  editRead(l) {
    this.userService.editRead({ inforId: l.inforId, userVid: this.userVid, readStatus: 1 })
        .then(res => {
          console.log(res)
        })
  }
}
