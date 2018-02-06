import { Component, OnInit, Input } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";

import { ProgressService } from '../../../../service/progress.service';
import { Progress } from '../../../../class/progress.class';
import { ProgressUser } from '../../../../class/ProgressUser';

@Component({
    selector: 'app-review-progress',
    templateUrl: './review-progress.component.html',
    styles: [`
    .pdfV {
		width: inherit;
		background-color: #0f0;
	}
  ` ],
    providers: [DatePipe],
    inputs: ['progress', 'randNum']
})
export class ReviewProgressComponent implements OnInit {
    data = [];
    role = ["", "发起", "审核", "会签", "批准", "执行"];
    statusShow = ["", "待处理", "通过", "未通过"];
    progressUser: ProgressUser[];
    private progress: Progress;
    private randNum: any;


    constructor(private datePipe: DatePipe, private progressService: ProgressService, private msg: NzMessageService) {
    }

    ngOnInit() {
    }

    getData() {
        if(this.progress.affairId != undefined){
            let parames = {
                affairId: this.progress.affairId,
                order: 'oa_progress.create_timestamp asc,oa_progress.progress_role asc'
            }
            this.progressService.getListAndUser(parames)
                .then(data => {
                    console.log(data)
                    this.data = data
                })
        }
            
    }

    ngOnChanges() {
        this.getData();
    }
}
