import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@env/environment';
import { ListService } from '../../../../service/list.service';
import { UserService } from '../../../../service/user.service';
import { ProgressService } from '../../../../service/progress.service';
import { List } from '../../../../class/list';
import { ProgressUser } from '../../../../class/ProgressUser';
import { Progress } from '../../../../class/progress.class';
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [DatePipe],
    inputs: ['id']
})
export class ListComponent implements OnInit {
    private id: any;
    list: List[];
    readerList: any[];
    modalTitle:string;
    isVisible = false;
    progressUser: ProgressUser[];
    role = ["", "发起", "审核", "会签", "批准", "执行"];
    userVid = JSON.parse(window.localStorage._token).userVid
    @Input() parames: any;
    isShowPdf = false;
    modal = {
        title: '',
        status: false,
        infor: ''
    }
    randNum: any;

    constructor(private progressService: ProgressService,
                private listService: ListService,
                private datePipe: DatePipe,
                private userService: UserService) { }

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

    showPdf(l) {
        this.modal = {infor:l,status:true,title:l.value}
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
                this.getList()
            })
    }

    showModal(inforId) {
        this.readerList = [];
        this.isVisible = true;
        this.listService
            .getReaderList({inforId,readStatus:1})
            .then(data => {
                this.readerList = data;
                this.modalTitle = '已读人员（' + data.length + '）人';
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
