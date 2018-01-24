import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import { MenuService } from '@delon/theme';
import { environment } from '../../../../../environments/environment';

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
    more = '同意';
    radioValue = '2';
    private progressId;
    private officeId;
    private progress: Progress;
    pdfSrc = '';
    page = 1;
    pdfStatus = 1;    // 1:没有附件，需要生成pdf；2：有附件，直接显示
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

    getPdf() {
        // console.log(this.progress.affairTitle)
        this.progressService.getAffairById(this.progress.affairId)
            .then(data => {
                console.log(data.urls)
                // let src = environment.FILE_URL + data.urls;
                // this.pdfSrc = src;

                if(data.urls != "" && data.urls.substring(data.urls.length-3, data.urls.length) == 'pdf'){
                    this.pdfStatus = 2;
                    let src = environment.FILE_URL + data.urls;
                    this.pdfSrc = src;
                    console.log('pdfviewer', this.pdfStatus)
                }else{
                    this.pdfStatus = 1;
                    for (let key in data.formjson) {
                        data.templetJson = data.templetJson.replace(`$#${key}#$`, data.formjson[key])
                    }
                    let pdfjson = JSON.parse(data.templetJson)
                    this.generatePdf(pdfjson);
                    console.log('iframe', this.pdfStatus)
                }
            });

    }

    generatePdf(data) {
        const pdfDocGenerator = pdfMake.createPdf(data);
        pdfDocGenerator.getDataUrl((dataUrl) => {
            const targetElement = document.querySelector('#pdfDiv');
            const iframe = document.createElement('iframe');
            // iframe.id = 'pdfIframe';
            iframe.src = dataUrl;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.marginTop = "-24px";
            targetElement.innerHTML = '';
            targetElement.appendChild(iframe);
        });
    }
}
