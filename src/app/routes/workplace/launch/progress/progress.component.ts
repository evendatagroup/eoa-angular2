import { Component, OnInit, Input } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';

// import { UserService } from '../../../../service/user.service';
import { ProgressService } from '../../../../service/progress.service';
import { Progress } from '../../../../class/progress.class';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    // styleUrls: ['./progress.component.css']
    styles: [`
    .pdfV {
		width: inherit;
		background-color: #0f0;
	}
  ` ],
    inputs: ['progressId', 'officeId', 'progress']
})
export class ProgressComponent implements OnInit {
    more: any
    radioValue: any;
    private progressId;
    private officeId;
    private progress: Progress;
    dds = {
        content: [
            { text: 'Title', style: 'header', alignment: 'center' },
            {
                style: 'tableExample',
                table: {
                    widths: [200, '*'],
                    body: [
                        ['申请人', { text: '$#Affair#$', italics: true, color: 'gray', style: '' }],
                        ['附件上传', { text: '$#templet1#$', italics: true, color: 'gray', style: '' }],
                        ['图片上传', { text: '$#templet2#$', italics: true, color: 'gray', style: '' }]
                    ]
                }
            }
        ],
        styles: {
            title: {
                fontSize: 22,
                bold: true
            }
        },
        defaultStyle: {
            font: 'fzytk'
        }
    };

    constructor(private progressService: ProgressService, private msg: NzMessageService) {
    }

    ngOnInit() {
        // console.log(JSON.stringify(this.dds))   // 有用：根据dds产生字符串形成模板，放数据库里
    }

    ngOnChanges() {
        const targetElement = document.querySelector('#pdfDiv');
        if (targetElement != null) {
            if (targetElement.children != null) {
                if (targetElement.children.length != 0) {
                    this.getPdf();
                }
            }
        }
    }

    submit() {
        this.progress.progressStatus = this.radioValue
        this.progress.progressMore = this.more
        // console.log(this.progress)
        this.progressService.edit(this.progress)
            .then(res => {
                this.msg.success('提交成功！');
            });
    }

    getPdf() {
        console.log(this.progress.affairTitle)
        this.progressService.getAffairById(this.progress.affairId)
            .then(data => {
                // console.log(data)
                // console.log(data.templetJson)
                for (let key in data.formjson) {
                    data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
                }
                let pdfjson = JSON.parse(data.templetJson)
                this.generatePdf(pdfjson);
            });

    }

    generatePdf(data) {
        pdfMake.fonts = {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-Italic.ttf'
            },
            fzytk: {
                normal: 'FZYTK.TTF',
                bold: 'FZYTK.TTF',
                italics: 'FZYTK.TTF',
                bolditalics: 'FZYTK.TTF',
            }
        }
        //  	var dd = {
        //  		content: [
        //     	{text: 'Title', style: 'header', alignment: 'center'},
        // 	    {
        // 			style: 'tableExample',
        // 			table: {
        // 				widths: [200, '*'],
        // 				body: [
        // 					['申请人', {text: '$#Affair#$', italics: true, color: 'gray', style: ''}],
        // 					['申请事由', {text: '$#templet3#$', italics: true, color: 'gray', style: ''}],
        // 					['开始时间', {text: '$#templet4#$', italics: true, color: 'gray', style: ''}],
        // 					['结束时间', {text: '$#templet5#$', italics: true, color: 'gray', style: ''}]
        // 				]
        // 			}
        // 		}
        // 	],
        // 	styles: {
        // 		title: {
        // 			fontSize: 22,
        // 			bold: true
        // 		}
        // 	},
        // 	defaultStyle: {
        // 		font: 'fzytk'
        // 	}
        // };
        // let mBody;
        // let mTitle;
        // if(data.modelId == 1){           // 新闻
        // 	mBody = [
        // 		['附件上传', {text: data.formjson.model1, italics: true, color: 'gray', style: ''}],
        // 		['图片上传', {text: data.formjson.model2, italics: true, color: 'gray', style: ''}]
        // 	];
        // 	mTitle = '新闻';
        // }else if(data.modelId == 2){     // 请假单
        // 	mBody = [
        // 		['申请人', {text: data.officeTitle, italics: true, color: 'gray', style: ''}],
        // 		['申请事由', {text: data.formjson.model3, italics: true, color: 'gray', style: ''}],
        // 		['开始时间', {text: data.formjson.model4, italics: true, color: 'gray', style: ''}],
        // 		['结束时间', {text: data.formjson.model5, italics: true, color: 'gray', style: ''}]
        // 	];
        // 	mTitle = '请假单';
        // }

        // dd.content[1].table.body = mBody;
        // dd.content[0].text = mTitle;
        // // console.log(dd.content[1].table.body)
        // // console.log(mBody)

        const pdfDocGenerator = pdfMake.createPdf(data);
        pdfDocGenerator.getDataUrl((dataUrl) => {
            const targetElement = document.querySelector('#pdfDiv');
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
