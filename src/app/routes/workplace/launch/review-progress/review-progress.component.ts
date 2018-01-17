import { Component, OnInit, Input } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {DatePipe} from "@angular/common";

// import { UserService } from '../../../../service/user.service';
import { ProgressService } from '../../../../service/progress.service';
import { Progress } from '../../../../class/progress.class';

import { ProgressUser } from '../../../../class/ProgressUser';

@Component({
    selector: 'app-review-progress',
    templateUrl: './review-progress.component.html',
    // styleUrls: ['./progress.component.css']
    styles: [`
    .pdfV {
		width: inherit;
		background-color: #0f0;
	}
  ` ],
    providers: [DatePipe],
    inputs: ['progress']
})
export class ReviewProgressComponent implements OnInit {
    more: any
    radioValue: any;
    role = ["", "发起", "审核", "会签", "批准", "执行"];
    progressUser: ProgressUser[];
    private progress: Progress;

    constructor(private datePipe: DatePipe, private progressService: ProgressService, private msg: NzMessageService) {
    }

    ngOnInit() {
        // this.getPdf();
    }

    ngOnChanges() {
        // console.log(this.progress)
        const targetElement = document.querySelector('#pdfDiv');
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
        // console.log(this.progress.affairId)
        this.progressService.getAffairById(this.progress.affairId)
            .then(data => {
                // console.log(data)
                // console.log(data.templetJson)
                for (let key in data.formjson) {
                    data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
                }
                let pdfjson = JSON.parse(data.templetJson)
                this.getProgressUser(pdfjson)
            });
    }

    getProgressUser(pdfjson) {
        let parames = {
            affairId: this.progress.affairId,
            order: 'oa_progress.create_timestamp asc'
        }

        this.progressService.getListAndUser(parames)
            .then(data => {
                this.progressUser = data
                console.log(data)
                pdfjson.styles["right"] = { italics: true, alignment: 'right' }  // 斜体靠右
                pdfjson.styles["center"] = { italics: true, alignment: 'center', color: 'gray' }  // 斜体靠右
                // console.log(pdfjson)
                pdfjson.styles["fontS"] = { fontSize: 15 }
                // console.log(pdfjson)
                for (let d in this.progressUser) {
                    // pdfjson.content.push({ text: '------' + '进度'});
                    pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
                    // new Date(this.progressUser[d].updateTimestamp*1000)
                    // pdfjson.content.push({ text: '', fontSize: 15 });
                    // pdfjson.content.push({ text: (d) + '.' + this.role[this.progressUser[d].progressRole], fontSize: 15 });
                    pdfjson.content.push({
                        text: this.progressUser[d].userName + '(' +
                        this.progressUser[d].deptName + '-' +
                        this.progressUser[d].roleName + ') ：' +
                        this.role[this.progressUser[d].progressRole], style: ['fontS'], bold: true
                    });
                    // pdfjson.content.push({ text: '--------------------------------------------------', style: ['fontS', 'center'] });
                    pdfjson.content.push({ text: this.progressUser[d].progressMore, style: ['fontS', 'center'] });
                    // pdfjson.content.push({ text: '--------------------------------------------------', style: ['fontS', 'center'] });
                    pdfjson.content.push({
                        text: !this.progressUser[d].updateTimestamp?" 年 月 日":this.datePipe.transform(
                            new Date(this.progressUser[d].updateTimestamp * 1000), "yyyy年MM月dd日 hh:mm:ss"),
                        style: ['fontS', 'right']
                    });
                    // pdfjson.content.push({ text: '--------------------------------------------------', style: ['fontS', 'center'] });
                }
                pdfjson.content.push({ text: '-------------------------------------------------------------------------------------' });
                // console.log(pdfjson)
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
