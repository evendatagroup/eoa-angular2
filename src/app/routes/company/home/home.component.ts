import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { ListService } from '../../../service/list.service';
import { List } from '../../../class/list';
import { ProgressUser } from '../../../class/ProgressUser';
import { ProgressService } from '../../../service/progress.service';
import {DatePipe} from "@angular/common";
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  title = "公司首页";
  imglist : List[];
  parames11imgs = {
    inforType: 11,
    page: 1,
    rows: 5,
    imgs: 'nonull'
  }
  parames11 = {
    inforType: 11,
    page: 1,
    rows: 8
  }
  parames112 = {
    inforType: 11,
    page: 2,
    rows: 4
  }
  parames12 = {
    inforType: 12,
    page: 1,
    rows: 8
  }
  parames13 = {
    inforType: 13,
    page: 1,
    rows: 8
  }
  parames14 = {
    inforType: 14,
    page: 1,
    rows: 8
  }
  parames15 = {
    inforType: 15,
    page: 1,
    rows: 8
  }

  progressUser: ProgressUser[];
  role = ["", "发起", "审核", "会签", "批准", "执行"];
  userVid = JSON.parse(window.localStorage._token).userVid

  constructor(public msg: NzMessageService,
              private listService: ListService,
              private progressService: ProgressService,
              private datePipe: DatePipe,
              private userService: UserService) { }

  getImg() {
    this.listService
        .getList(this.parames11imgs)
        .then(res => {
          this.imglist = res.data
          this.imglist.map(item => item.imgs = item.imgs.split(',')[0]);
        });
  }

  ngOnInit() {
  	this.getImg();
  }

  showPdf(l) {
      console.log(l.url.substring(l.url.length - 3, l.url.length))
      if(!!l.url&&l.url.substring(l.url.length - 3, l.url.length) == 'pdf'){
          window.open(environment.FILE_URL + l.url, "", "width=600, height=600");
          if(l.readStatus == 0){
              this.editRead(l);
          }
      }else{
          this.getPdf(l);
      }
  }

  getPdf(l) {
      console.log(l)
      this.progressService.getAffairById(l.affairId)
          .then(data => {
              for (let key in data.formjson) {
                  data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
              }
              let pdfjson = JSON.parse(data.templetJson)
              // console.log(pdfjson)
              this.getProgressUser(pdfjson, l)
          });
  }

  getProgressUser(pdfjson, l) {
      let parames = {
          affairId: l.affairId,
          order: 'oa_progress.create_timestamp asc,oa_progress.progress_role asc'
      }

      this.progressService.getListAndUser(parames)
          .then(data => {
              this.progressUser = data
              pdfjson.styles["right"] = { italics: true, alignment: 'right' }  // 斜体靠右
              pdfjson.styles["center"] = { italics: true, alignment: 'center', color: 'gray' }  // 斜体靠右
              pdfjson.styles["fontS"] = { fontSize: 15 }
              for (let d in this.progressUser) {
                  pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
                  pdfjson.content.push({
                      text: this.progressUser[d].userName + '(' +
                      this.progressUser[d].deptName + '-' +
                      this.progressUser[d].roleName + ') ：' +
                      this.role[this.progressUser[d].progressRole], style: ['fontS'], bold: true
                  });
                  pdfjson.content.push({ text: this.progressUser[d].progressMore, style: ['fontS', 'center'] });
                  pdfjson.content.push({
                      text: !this.progressUser[d].updateTimestamp?"待" + this.role[this.progressUser[d].progressRole]:this.datePipe.transform(
                          new Date(this.progressUser[d].updateTimestamp * 1000), "yyyy年MM月dd日 HH:mm:ss"),
                      style: ['fontS', 'right']
                  });
              }
              pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
              this.generatePdf(pdfjson, l);
          })
  }

  generatePdf(data, l) {
      // console.log(data)
      var win = window.open(environment.FILE_URL + l.url, "", "width=600, height=600");
      pdfMake.createPdf(data).open({}, win);
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
