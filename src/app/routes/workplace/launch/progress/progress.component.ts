import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import { MenuService } from '@delon/theme';
import { environment } from '../../../../../environments/environment';

import { ProgressService } from '../../../../service/progress.service';
import { Progress } from '../../../../class/progress.class';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styles: [`
    .pdfV {
		width: inherit;
		background-color: #0f0;
	}
  ` ],
    inputs: ['progressId', 'officeId', 'progress', 'randNum', 'id']
})
export class ProgressComponent implements OnInit {
    data = [];
    attachs: any;
    divId = '';
    more = '同意';
    radioValue = '2';
    private progressId;
    private officeId;
    private randNum: any;
    private id: string;
    progress: Progress;
    pdfSrc = '';
    page = 1;
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

    @Output()
    onSuccessF = new EventEmitter();

    constructor(private progressService: ProgressService,
                private msg: NzMessageService,
                private menuService: MenuService) {
    }

    ngOnInit() {
        // console.log(JSON.stringify(this.dds))   // 有用：根据dds产生字符串形成模板，放数据库里
        
    }

    getData() {
        if(this.progress.affairId != undefined){
            this.progressService.getAffairById(this.progress.affairId)
                .then(data => {
                    console.log(data)
                    this.data = [];
                    this.attachs = data.urls.split(',');
                    this.show(this.attachs[0]);
                    this.data.push({title: '标题', content: data.formjson.affairTitle})
                    this.data.push({title: '发起人', content: data.formjson.exe})
                    if(data.formjson.question_3 != undefined){
                        this.data.push({title: '请假事由', content: data.formjson.question_3})
                    }
                    if(data.formjson.question_4 != undefined){
                        this.data.push({title: '开始时间', content: data.formjson.question_4})
                    }
                    if(data.formjson.question_4 != undefined){
                        this.data.push({title: '结束时间', content: data.formjson.question_5})
                    }
                    if(data.formjson.question_img != undefined){
                        this.data.push({title: '图片', content: data.formjson.question_img})
                    }
                    if(data.formjson.question_pdf != undefined){
                        this.data.push({title: '附件', content: data.formjson.question_pdf})
                    }
                })
        }
            
    }

    show(url) {
        // console.log('url',url)
        let i = '#' + this.id
        console.log(i)
        const targetElement = document.querySelector(i);
        console.log(targetElement)
        const iframe = document.createElement('iframe');
        iframe.src = url;
        // iframe.src = 'https://www.baidu.com/?qq-pf-to=pcqq.c2c';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.tabIndex = 100
        targetElement.innerHTML = '';
        targetElement.appendChild(iframe);
    }


    ngOnChanges() {
        this.getData();
        // let i = '#' + this.id
        // const targetElement = document.querySelector(i);
        // if (targetElement != null) {
        //     if (targetElement.children != null) {
        //         if (targetElement.children.length != 0) {
        //             this.getPdf();
        //         }
        //     }
        // }
    }

    submit() {
        this.progress.progressStatus = parseInt(this.radioValue);
        this.progress.progressMore = this.more;
        this.progressService.edit(this.progress)
            .then(res => {
                if(res == '操作成功'){
                    this.editMenuBadge();
                    this.msg.success('提交成功！');
                    this.onSuccessF.emit(res);
                }else{
                    this.msg.success('提交失败！');
                }
            });
    }

    // 修改办事大厅的未办事项数
    editMenuBadge() {
        this.progressService
            .getCountDoing()
            .then(countDoing => {
                let numb = 0;
                countDoing.forEach(item => {
                    numb += item.count;
                })
                this.menuService.menus[0].children.forEach(item=>{
                    if(item.menuId == 27){
                        item.badge = numb;
                        this.menuService.resume();
                        return;
                    }
                })
            })
    }

    // getPdf() {
    //     // console.log(this.progress.affairId)
    //     if(this.progress.affairId != undefined){
    //         this.progressService.getAffairById(this.progress.affairId)
    //             .then(data => {
    //                 console.log(data.formjson)
    //                 for (let key in data.formjson) {
    //                     data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
    //                 }
    //                 let pdfjson = JSON.parse(data.templetJson)
    //                 this.generatePdf(pdfjson);
    //             });
    //     }else{
    //         // console.log('affairId:', this.progress.affairId);
    //     }            
    // }

    // generatePdf(data) {
    //     const pdfDocGenerator = pdfMake.createPdf(data);

    //     pdfDocGenerator.getDataUrl((dataUrl) => {
    //         let i = '#' + this.id
    //         const targetElement = document.querySelector(i);
    //         const iframe = document.createElement('iframe');
    //         iframe.src = dataUrl;
    //         iframe.width = '100%';
    //         iframe.height = '100%';
    //         iframe.style.marginTop = "-24px";
    //         targetElement.innerHTML = '';
    //         targetElement.appendChild(iframe);
    //     });
    // }
}
