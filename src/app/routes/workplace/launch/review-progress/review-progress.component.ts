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
    more: any
    radioValue: any;
    role = ["", "发起", "审核", "会签", "批准", "执行"];
    progressUser: ProgressUser[];
    private progress: Progress;
    private randNum: any;


    constructor(private datePipe: DatePipe, private progressService: ProgressService, private msg: NzMessageService) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        const targetElement = document.querySelector('#pdfDiv1');
        if (targetElement != null) {
            if (targetElement.children != null) {
                if (targetElement.children.length != 0) {
                    if (this.progress.affairId) {
                        this.getPdf();
                    }
                }
            }
        }
    }

    getPdf() {
        this.progressService.getAffairById(this.progress.affairId)
            .then(data => {
                for (let key in data.formjson) {
                    data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
                }
                let pdfjson = JSON.parse(data.templetJson)
                console.log(pdfjson)
                this.getProgressUser(pdfjson)
            });
    }

    getProgressUser(pdfjson) {
        let parames = {
            affairId: this.progress.affairId,
            order: 'oa_progress.create_timestamp asc,oa_progress.progress_role asc'
        }

        this.progressService.getListAndUser(parames)
            .then(data => {
                this.progressUser = data
                pdfjson.styles["right"] = { italics: true, alignment: 'right' }  // 斜体靠右
                pdfjson.styles["center"] = { italics: true, alignment: 'center', color: 'gray' }  // 斜体靠右
                pdfjson.styles["fontS"] = { fontSize: 15 }
                for (let d in this.progressUser) {
                    pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
                    pdfjson.content.push({
                        text: this.progressUser[d].userName + '(' +
                        this.progressUser[d].deptName + '-' +
                        this.progressUser[d].roleName + ') ：' +
                        this.role[this.progressUser[d].progressRole], style: ['fontS'], bold: true
                    });
                    pdfjson.content.push({ text: this.progressUser[d].progressMore, style: ['fontS', 'center'] });
                    pdfjson.content.push({
                        text: !this.progressUser[d].updateTimestamp?"待" + this.role[this.progressUser[d].progressRole]:this.datePipe.transform(
                            new Date(this.progressUser[d].updateTimestamp * 1000), "yyyy年MM月dd日 HH:mm:ss"),
                        style: ['fontS', 'right']
                    });
                }
                pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
                this.generatePdf(pdfjson);
            })
    }

    generatePdf(data) {
        // console.log(data)
        const pdfDocGenerator = pdfMake.createPdf(data);
        pdfDocGenerator.getDataUrl((dataUrl) => {
            const targetElement = document.querySelector('#pdfDiv1');
            const iframe = document.createElement('iframe');
            iframe.src = dataUrl;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.marginTop = "-24px";
            targetElement.innerHTML = '';
            targetElement.appendChild(iframe);
        });
    }
}
