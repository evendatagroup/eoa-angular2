import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@env/environment';
import { ListService } from '../../../../service/list.service';
import { UserService } from '../../../../service/user.service';
import { List } from '../../../../class/list';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    list: List[];
    readerList: any[];
    isVisible = false;
    userVid = JSON.parse(window.localStorage._token).userVid
    @Input() parames: any;

    constructor(
        private listService: ListService,
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
        window.open(environment.FILE_URL + l.url);
        this.userService.editRead({ inforId: l.inforId, userVid: this.userVid, readStatus: 1 })
            .then(res => {
                this.getList()
            })
    }

    showModal(inforId) {
        // console.log("sid:" + sid);
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
