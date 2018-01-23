import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

import { ListService } from '../../../service/list.service';
import { List } from '../../../class/list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
    rows: 4
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

  constructor(public msg: NzMessageService,private listService: ListService) { }

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

}
