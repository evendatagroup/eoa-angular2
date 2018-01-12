import { Component, OnInit, Input } from '@angular/core';

import { ListService } from '../../../../service/list.service';
import { List } from '../../../../class/list';
import { Reader } from '../../../../class/Reader';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list: List[];
  readerList: Reader[]; 
  isVisible = false;
  @Input() parames: any;

  constructor(private listService: ListService) { }

  getList() {
    this.listService
        .getList(this.parames)
        .then(res => {
          this.list = res.data
        });
  }

  ngOnInit() {
    this.getList()
  }

  showPdf(url) {
    url = 'http://192.168.0.10/eoa/file/' + url;
    window.open(url);
  }

  showModal(inforId) {
    // console.log("sid:" + sid);
    this.isVisible = true;
    this.listService
        .getReaderList(inforId)
        .then(data => {
          if(data.length > 0){
            // this.readerList = data;
            this.readerList = data.filter(item => item.status == '1');
          }else{
            this.readerList = [];
          }
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
