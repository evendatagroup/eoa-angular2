import { Component, ViewChild, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';

import { UserService } from '../../../service/user.service';
import { AnyService } from '../../../service/any.service';
import { SettingsService } from '@delon/theme';
import { TreeData } from '../../component/tree/tree-model'
import { SearchTreeComponent } from '../../component/tree/search-tree.component'

@Component({
    selector: 'app-createflow',
    templateUrl: './createflow.component.html',
    styleUrls: ['./createflow.component.less'],
    providers: [AnyService, UserService]
})
export class CreateflowComponent {

    current = 0;
    validateForm: FormGroup;
    controlArray = [];
    templetList = [{ templetId: 0, templetName: '正在加载' }];
    checkedList = [];
    path = { id: '', name: '' };
    // tree
    nodes: Array<TreeData> = []
    newnodes: string
    menu = [
      {label:'全公司',value:'0'},
      {label:'发起人',value:'1'},
      {label:'发起人部门全员',value:'2'},
    ]
    readmenu = [
      {label:'全公司',value:'0'},
    ]
    showread = false;
    search = '';
    treelist:any = {
      launchs:{show:false},
      approvals:{show:false},
      exes:{show:false},
      readers:{show:false}
    }
    flowType = [
      {label:'公司新闻动态',value:11},
      {label:'公司通知公告',value:12},
      {label:'公司公文管理',value:13},
      {label:'公司制度流程',value:14},
      {label:'公司专栏',value:15},
      {label:'部门新闻动态',value:21},
      {label:'部门通知公告',value:22},
      {label:'部门公文管理',value:23},
      {label:'部门制度流程',value:24},
      {label:'部门风采展示',value:25},
      {label:'其它',value:31},
    ]

    index = 'First-content';

    isVisible = false;

    constructor(
        private _message: NzMessageService,
        private _notification: NzNotificationService,
        private fb: FormBuilder,
        private userService: UserService,
        private settingsService: SettingsService,
        private anyService: AnyService
    ) {
        this.validateForm = this.fb.group({
            flowName: [null, [Validators.required]],
            launchs: [null, [Validators.required]],
            launchNames: [null,],
            templetId: [null,],
            isSign: [0, [Validators.required]],
            approvals: [null,],
            approvalNames: [null,],
            exes: [null, [Validators.required]],
            exeNames: [null,],
            readers: [null, [Validators.required]],
            readerNames: [null,],
            flowType: [null, [Validators.required]]
        });
    }



    ngOnInit() {
        this.addField();
        this.userService.getRoleAddress().then(res=>{
          this.nodes = res
          this.newnodes = JSON.stringify(res);
        });
        this.anyService.getList({ url: 'Templet' }).then(list => {
            this.templetList = list;
            // console.log(list)
        });
    }

    pre() {
        this.current -= 1;
        this.changeContent();
    }

    next() {
        this.current += 1;
        this.changeContent();
    }

    done() {
        this._message.success('done');
    }

    changeContent() {
        switch (this.current) {
            case 0: {
                this.index = 'First-content';
                break;
            }
            case 1: {
                this.index = 'Second-content';
                break;
            }
            case 2: {
                this.index = 'third-content';
                break;
            }
            case 3: {
                this.index = 'third-content';
                break;
            }
            case 4: {
                this.index = 'third-content';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }

    submit() {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
        // console.log(this.validateForm.value);
        let data = this.validateForm.value;
        let i = 0;
        let reviewIds = '';
        while (data[`review${i}Ids`]) {
            reviewIds += data[`review${i}Ids`] + '&';
            i++;
        }
        if (reviewIds !== '') {
            data.reviews = reviewIds.substring(0, reviewIds.length - 1);
        }
        // if(data.collatorIds || data.auditorIds) {
        //   data.feedback = 1
        // }
        for (let key in data) {
            if (!data[key] || data[key] == null) {
                data[key] = ''
            }
        }
        // console.log(data);
        this.anyService.edit({ url: 'Flow', data: data })
            .then(res => {
                this._notification.create('success', '建模', `"${this.getFormControl('flowName').value}":创建成功`,{nzDuration: 20000});
                this.resetForm();
                this.current=0;
                this.changeContent();
            })
    };

    resetForm() {
        //$event.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }

    addField(e?: MouseEvent) {
        if (e) {
            e.preventDefault();
        }
        const id = (this.controlArray.length > 0) ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;

        const control = {
            id,
            controlInstance: `review${id}Ids`,
            controlInstanceN: `review${id}Names`,
        };
        const index = this.controlArray.push(control);
        //console.log(this.controlArray[this.controlArray.length - 1]);
        this.treelist[control.controlInstance] = {show:false};
        this.validateForm.addControl(this.controlArray[index - 1].controlInstance, new FormControl(null));
        this.validateForm.addControl(this.controlArray[index - 1].controlInstanceN, new FormControl(null));

    }

    removeField(i, e: MouseEvent) {
        e.preventDefault();
        if (this.controlArray.length > 1) {
            const index = this.controlArray.indexOf(i);
            this.controlArray.splice(index, 1);
            //console.log(this.controlArray);
            this.validateForm.removeControl(i.controlInstance);
            this.validateForm.removeControl(i.controlInstanceN);
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    selectFlowType(e) {
      if(!e && !!this.getFormControl("flowType").value) {
        this.showread = true;
        let flowType = this.getFormControl("flowType").value;
        if(flowType>20 && flowType<30){
          //部门
          this.readmenu = [
            {label:'发起人',value:'1'},
            {label:'发起人部门全员',value:'2'},
          ]
          this.getFormControl("readers").setValue('2');
          this.getFormControl("readerNames").setValue('发起人部门全员');
        }else {
          this.readmenu = [
            {label:'全公司',value:'0'},
            {label:'发起人',value:'1'},
            {label:'发起人部门全员',value:'2'},
          ]
          this.getFormControl("readers").setValue('0');
          this.getFormControl("readerNames").setValue('全公司');
        }
      }
    }

    // cleanUserAddress(path) {
    //     this.checkedList = [];
    //     this.getFormControl(path.id).setValue('');
    //     this.getFormControl(path.name).setValue('');
    // }

    // tree
    treeoc(key) {
      this.treelist[key].show = !this.treelist[key].show
      this.search = ''
      this.nodes = JSON.parse(this.newnodes)
    }
    closeTree(path) {
      this.treelist[path.id].show = false
      this.search = ''
    }
    selectedTree(path) {
      this.checkedList = [];
      this.find(this.nodes, '');
      let ids = [];
      let names = [];
      this.checkedList.forEach(item => {
          names.push(item.name.replace(/\(\S+\)/g, ''))
          ids.push(item.id)
      })
      this.getFormControl(path.id).setValue(ids.join(','));
      this.getFormControl(path.name).setValue(names.join(','));
      this.treelist[path.id].show = false;
      this.search = ''
    }
    selectmenu(menu,path) {
      this.getFormControl(path.id).setValue(menu.value);
      this.getFormControl(path.name).setValue(menu.label);
      this.treelist[path.id].show = false
      this.search = ''
    }
    selectall(path) {
      this.getFormControl(path.id).setValue('0');
      this.getFormControl(path.name).setValue('全公司');
      this.treelist[path.id].show = false
      this.search = ''
    }
    find(arr, fname) {
        if (arr.length == 0) return false;
        arr.forEach(item => {
            if (!item.isMenu && item.isChecked) {
                this.checkedList.push({ id: item.id, name: fname + '-' + item.name })
            }
            if (item.isMenu) {
                this.find(item.children, item.name)
            }
        })
    }

    // // 获取模板样式
    // getCaptcha() {
    //     let v = this.getFormControl('templetId').value;
    //     if(v == null){
    //         this._message.create('warning', '请选择一个样式模板！');
    //     }else{
    //         this.showPdfModal(v);
    //     }
    // }
    //
    // // 显示样式模板
    // showPdfModal(v) {
    //     this.isVisible = true;
    //     let dds;
    //     if(v == 1){
    //         dds = {
    //             content: [
    //                 { text: '新闻模板样式', style: 'header', alignment: 'center' },
    //                 {
    //                     style: 'tableExample',
    //                     table: {
    //                         widths: [200, '*'],
    //                         body: [
    //                             ['申请人', { text: '', italics: true, color: 'gray', style: 'title' }],
    //                             ['附件上传', { text: '', italics: true, color: 'gray', style: 'title' }],
    //                             ['图片上传', { text: '', italics: true, color: 'gray', style: 'title' }]
    //                         ]
    //                     }
    //                 }
    //             ],
    //             styles: {
    //                 title: {
    //                     fontSize: 22,
    //                     bold: true
    //                 },
    //                 header: {
    //                     fontSize: 25,
    //                     bold: true
    //                 }
    //             },
    //             defaultStyle: {
    //                 font: 'fzytk'
    //             }
    //         };
    //     }else if(v == 2){
    //         dds = {
    //             content: [
    //                 { text: '请假单模板样式', style: 'header', alignment: 'center' },
    //                 {
    //                     style: 'tableExample',
    //                     table: {
    //                         widths: [200, '*'],
    //                         body: [
    //                             ['申请人', { text: '', italics: true, color: 'gray', style: 'title' }],
    //                             ['请假事由', { text: '', italics: true, color: 'gray', style: 'title' }],
    //                             ['请假时间', { text: '', italics: true, color: 'gray', style: 'title' }]
    //                         ]
    //                     }
    //                 }
    //             ],
    //             styles: {
    //                 title: {
    //                     fontSize: 22,
    //                     bold: true
    //                 },
    //                 header: {
    //                     fontSize: 25,
    //                     bold: true
    //                 }
    //             },
    //             defaultStyle: {
    //                 font: 'fzytk'
    //             }
    //         };
    //     }
    //
    //     const pdfDocGenerator = pdfMake.createPdf(dds);
    //     pdfDocGenerator.getDataUrl((dataUrl) => {
    //         const targetElement = document.querySelector('#pdfDiv3');
    //         const iframe = document.createElement('iframe');
    //         iframe.src = dataUrl;
    //         iframe.width = '100%';
    //         iframe.height = '100%';
    //         iframe.style.marginTop = "-24px";
    //         targetElement.innerHTML = '';
    //         targetElement.appendChild(iframe);
    //     });
    // }

    handleCancel = (e) => {
      console.log(e);
      this.isVisible = false;
    }
}
