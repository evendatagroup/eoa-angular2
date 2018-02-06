import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../service/list.service';
import { UserService } from '../../../service/user.service';
import { environment } from '@env/environment';
import { Reader } from '../../../class/Reader';
import { Group } from '../../../class/Group';
import { ProgressUser } from '../../../class/ProgressUser';
import { ProgressService } from '../../../service/progress.service';
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-special',
    templateUrl: './special.component.html',
    styles: [],
    providers: [DatePipe]
})
export class SpecialComponent implements OnInit {
    title = "专栏模块"

    inforType = 15
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
    randNum: any;

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

    // 查阅情况
    showModal(inforId) {
        this.readerList = [];
        this.isVisible = true;
        this.listService
            .getReaderList({inforId,readStatus:1})
            .then(data => {
                this.readerList = data;
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
