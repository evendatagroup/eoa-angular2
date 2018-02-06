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
    providers: [DatePipe]
})
export class ListComponent implements OnInit {
    list: List[];
    readerList: any[];
    modalTitle:string;
    isVisible = false;
    progressUser: ProgressUser[];
    role = ["", "发起", "审核", "会签", "批准", "执行"];
    // progress: Progress;
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
        // console.log(l.url.substring(l.url.length - 3, l.url.length))
        // if(!!l.url&&l.url.substring(l.url.length - 3, l.url.length) == 'pdf'){
        //     window.open(environment.FILE_URL + l.url, "", "width=600, height=600");
        //     if(l.readStatus == 0){
        //         this.editRead(l);
        //     }
        // }else{
        //     this.getPdf(l);
        // }
    }

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
