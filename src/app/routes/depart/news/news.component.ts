import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../service/list.service';

import { Reader } from '../../../class/Reader';
import { Group } from '../../../class/Group';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styles: []
})
export class NewsComponent implements OnInit {
	title = "新闻动态";
  inforType = 21
  page = 1
  rows = 5

  total = 1

  input_title = ''
  begin_date = ''
  end_date = ''

	list = [];
	readerList = [];
  reader = [];
  groupList = [];
  groups = [];
	isVisible = false;
	data = [];

  constructor(private listService: ListService) { 
    
  }

  getList(reset = false) {
    if(reset){
      this.page = 1;
    }
    let begin = parseInt(this.begin_date.valueOf())/1000
    let end = parseInt(this.end_date.valueOf())/1000

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

  showPdf(url) {
    url = 'http://192.168.0.10/eoa/file/' + url;
    window.open(url);
  }

  getReader(sid): void {
  	this.listService
  		.getReaderList(sid)
  		.then(data => {
  			if(data.length > 0){
          // this.reader = data.filter(item => item.status == '0');
          this.reader = data;
        }else{
          this.reader = [];
        }
        this.getGroup();
        // console.log(this.groups);
        // console.log(this.readerList);
  		});
  }

  // 统计查阅情况
  countReader(){
    // 初始化
    // console.log(this.groups);
    // console.log(reader);
    for(var i = 0;i < this.groups.length;i++){
      this.readerList.push({depart: this.groups[i].text, id: this.groups[i].id, readed: "", noread: "", rate: 0});
      // console.log(this.readerList);
    }
    // 统计已读和未读
    for(var j = 0;j < this.reader.length;j++){
      let r = this.reader[j];
      // console.log(r)
      for(var k = 0;k < this.readerList.length;k++){
        let rl = this.readerList[k];
        // console.log(rl.id)
        if(r.groupPath == rl.id){
          if(r.status == 1){
            rl.readed += r.realName + ",";
          }else{
            rl.noread += r.realName + ",";
          }
        }
      }
    }

    // 统计占比
    for(var k = 0;k < this.readerList.length;k++){
      let rl = this.readerList[k];
      let num1 = rl.readed.split(",").length - 1;  // 已读人数
      let num2 = rl.noread.split(",").length - 1;  // 未读人数
      // console.log("readed:" + rl.readed + ",noread:" + rl.noread)
      let sum = num1 + num2;
      rl.rate = num1 * 100 / sum;
      // console.log(Object.is(rl.rate, NaN))
      // if(num1 > 0 && num2 > 0){
        
      // }else{
      //   rl.rate = 0;
      // }
    }

    this.readerList = this.readerList.filter(item => !Object.is(item.rate, NaN));
  }

  getGroup(): void {
    this.listService
        .getGroup()
        .then(data => {
          this.groups = [];
          this.readerList = [];
          this.getChildren(data[0],"");
          this.countReader();
          // console.log(this.reader);
        });
  }

  getChildren(g,id) {
    if(g != undefined){
      this.groups.push({text:g.text,id:id + g.id + ","});
    }
    let id2 = id + g.id + ",";
    if(g.children != undefined){
      for(var i = 0;i < g.children.length;i++){
        this.getChildren(g.children[i],id2);
      }
    }
  }

  // 查阅情况
  showModal = (sid) => {
    this.isVisible = true;
    this.readerList = [];
    this.getReader(sid);
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
