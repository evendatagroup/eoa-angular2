import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../service/list.service';
import { UserService } from '../../../service/user.service';
import { environment } from '@env/environment';

import { Reader } from '../../../class/Reader';
import { Group } from '../../../class/Group';
import { ProgressUser } from '../../../class/ProgressUser';
import { ProgressService } from '../../../service/progress.service'
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styles: [],
    providers: [DatePipe]
})
export class NewsComponent implements OnInit {
    title = "新闻动态"

    inforType = 11
    page = 1
    rows = 5

    total = 1

    input_title = ''
    begin_date = ''
    end_date = ''

    list = [];
    selectedList: any;
    readerList = [];
    isVisible = false;
    userVid = JSON.parse(window.localStorage._token).userVid
    progressUser: ProgressUser[];
    role = ["", "发起", "审核", "会签", "批准", "执行"];
    isShowPdf = false;
    modal = {
        title: '',
        status: false,
        infor: ''
    }

    constructor(private progressService: ProgressService,
                private listService: ListService,
                private userService: UserService,
                private datePipe: DatePipe) {

    }

    getList(reset = false) {
        if (reset) {
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

    ngOnInit() {
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
        this.isShowPdf = true;
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

    // showPdf(l) {
    //     console.log(l.url.substring(l.url.length - 3, l.url.length))
    //     if(!!l.url&&l.url.substring(l.url.length - 3, l.url.length) == 'pdf'){
    //         window.open(environment.FILE_URL + l.url, "", "width=600, height=600");
    //         if(l.readStatus == 0){
    //             this.editRead(l);
    //         }
    //     }else{
    //         this.getPdf(l);
    //     }
    // }

    // getPdf(l) {
    //     console.log(l)
    //     this.progressService.getAffairById(l.affairId)
    //         .then(data => {
    //             for (let key in data.formjson) {
    //                 data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
    //             }
    //             let pdfjson = JSON.parse(data.templetJson)
    //             // console.log(pdfjson)
    //             this.getProgressUser(pdfjson, l)
    //         });
    // }

    // getProgressUser(pdfjson, l) {
    //     let parames = {
    //         affairId: l.affairId,
    //         order: 'oa_progress.create_timestamp asc,oa_progress.progress_role asc'
    //     }

    //     this.progressService.getListAndUser(parames)
    //         .then(data => {
    //             this.progressUser = data
    //             pdfjson.styles["right"] = { italics: true, alignment: 'right' }  // 斜体靠右
    //             pdfjson.styles["center"] = { italics: true, alignment: 'center', color: 'gray' }  // 斜体靠右
    //             pdfjson.styles["fontS"] = { fontSize: 15 }
    //             for (let d in this.progressUser) {
    //                 pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
    //                 pdfjson.content.push({
    //                     text: this.progressUser[d].userName + '(' +
    //                     this.progressUser[d].deptName + '-' +
    //                     this.progressUser[d].roleName + ') ：' +
    //                     this.role[this.progressUser[d].progressRole], style: ['fontS'], bold: true
    //                 });
    //                 pdfjson.content.push({ text: this.progressUser[d].progressMore, style: ['fontS', 'center'] });
    //                 pdfjson.content.push({
    //                     text: !this.progressUser[d].updateTimestamp?"待" + this.role[this.progressUser[d].progressRole]:this.datePipe.transform(
    //                         new Date(this.progressUser[d].updateTimestamp * 1000), "yyyy年MM月dd日 HH:mm:ss"),
    //                     style: ['fontS', 'right']
    //                 });
    //             }
    //             pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
    //             this.generatePdf(pdfjson, l);
    //         })
    // }

    // generatePdf(data, l) {
    //     // console.log(data)
    //     var win = window.open(environment.FILE_URL + l.url, "", "width=600, height=600");
    //     pdfMake.createPdf(data).open({}, win);
    //     if(l.readStatus == 0){
    //         this.editRead(l);
    //     }
    // }

    // editRead(l) {
    //     this.userService.editRead({ inforId: l.inforId, userVid: this.userVid, readStatus: 1 })
    //         .then(res => {
    //             this.getList()
    //         })
    // }

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
