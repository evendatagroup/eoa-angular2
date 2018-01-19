import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../service/list.service';
import { UserService } from '../../../service/user.service';
import { environment } from '@env/environment';
import { Reader } from '../../../class/Reader';
import { Group } from '../../../class/Group';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styles: []
})
export class DocComponent implements OnInit {
  title = "公文管理";

  inforType = 23
  page = 1
  rows = 5

  total = 1

  input_title = ''
  begin_date = ''
  end_date = ''
  
  list = [];
  readerList = [];
  isVisible = false;
  userVid = JSON.parse(window.localStorage._token).userVid

  constructor(private listService: ListService,
              private userService: UserService) { 
    
  }

  getList(reset = false) {
    if(reset){
      this.page = 1;
    }
    let begin = parseInt(this.begin_date.valueOf()) / 1000
    let end = parseInt(this.end_date.valueOf()) / 1000

    let parames = {
      inforType: this.inforType,
      page: this.page,
      rows: this.rows,
      inforTitle: this.input_title,
      beginTimestamp: this.begin_date == '' ? '' : Math.round(begin),
      endTimestamp: this.end_date == '' ? '' : Math.round(end)
    }
    this.listService
        .getList(parames)
        .then(res => {
          this.list = res.data
          this.total = parseInt(res.msg)
        });
  }

  ngOnInit(){
    this.getList();
  }

  // 重置
  reset() {
    this.page = 1
    this.rows = 5
    this.input_title = ''
    this.begin_date = ''
    this.end_date = ''
    this.getList()
  }

  showPdf(l) {
        window.open(environment.FILE_URL + l.url);
        this.userService.editRead({ inforId: l.inforId, userVid: this.userVid, readStatus: 1 })
            .then(res => {
                this.getList()
            })
    }

  // 查阅情况
  showModal(inforId) {
      this.readerList = [];
      this.isVisible = true;
      this.listService
          .getReaderList({inforId,readStatus:1})
          .then(data => {
              this.readerList = data;
              // console.log(this.readerList);
          })
  }

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }

}
