import { Component, OnInit } from '@angular/core';

import { ListService } from '../../../service/list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ListService]
})
export class HomeComponent implements OnInit {
	title = "部门首页";
  imglist = [];
	imgs: any;
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

  constructor(private listService: ListService) { }

  getImg() {
    this.listService
        .getList(this.parames21)
        .then(res => {
          // 最多取五张图片
          if(res.data.length > 5){
            this.imglist = res.data.filter(item => !!item.imgs).splice(0,5);
          }else{
            this.imglist = res.data.filter(item => !!item.imgs);
          }
          this.imglist = res.data.filter(item => !!item.imgs);
          this.imglist.map(item => item.imgs = item.imgs.split(',')[0]);
        });
  }

  ngOnInit() {
    this.getImg();
  }

}
