import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MenuService } from '@delon/theme';

import { NzMessageService } from 'ng-zorro-antd';

import { AnyService } from '../../../service/any.service';
import { ProgressService } from '../../../service/progress.service';
import { UserService } from '../../../service/user.service';

import { environment } from '@env/environment';
import { TreeData } from '../../component/tree/tree-model'
import { SearchTreeComponent } from '../../component/tree/search-tree.component'


@Component({
    selector: 'launch-form',
    templateUrl: './launch-form.component.html',
    styles:[`
    .tree {
        width: 100%;
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        float: left;
        min-width: 10rem;
        padding: 0 0;
        margin: .125rem 0 0;
        font-size: .92rem;
        color: #212529;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
    }`],
    providers: [AnyService, ProgressService, UserService]
})

export class LaunchFormComponent {
    validateForm: FormGroup;
    data: any[];
    flowList: any[];
    index: 0;
    loading = false;
    selectedOption = '';
    users = { collatorIds: [], auditorIds: [], signerIds: [], publisherIds: [] }
    options = [];
    approveIds = [];
    //FileUploader
    uploadurl = environment.HTTP_URL+'fileAction/uploadFile'
    uploadsize = 51200
    uploadlist:any = []
    uploadlistZ:any = []
    imglist:any = []
    // tree
    nodes: Array<TreeData> = []
    search = '';
    path = { id: '', name: '' };
    checkedList = [];
    treelist:any = {
      signs:{show:false,required:0}
    }
    //确认框
    isVisibleMiddle:boolean= false;
    more=''

    constructor(
        private _message: NzMessageService,
        private fb: FormBuilder,
        private anyService: AnyService,
        private userService: UserService,
        private progressService: ProgressService,
        private menuService: MenuService) {
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            select: [null, [Validators.required]],
            affairTitle: [null, [Validators.required]],
            signs: [null,],
            signNames: [null,]
        })
        this.getFlowList();
        this.userService.getUserAddress().then(res=>{
          this.nodes = res
        });
    }

    uploadAction(e,key) {
      if(e && e.file && e.file.status){
        switch(e.file.status) {
          case 'uploading':
            //this._message.info("正在上传...")
            break;
          case 'done':
            this._message.success("上传成功")
            this.uploadlistZ = [e.file];
            console.log(e.file,key)
            this.getFormControl(key).setValue(e.file.response.data)
            break;
          case 'error':
            this._message.error("上传失败")
            break;
          case 'removed':
            this._message.info("移除文件")
            break;
          default:
            this._message.error("操作错误")
            break;
        }
      }
    }
    imgAction(e,key) {
      if(e && e.file && e.file.status){
        switch(e.file.status) {
          case 'uploading':
            //this._message.info("正在上传...")
            break;
          case 'done':
            this._message.success("上传成功")
            this.imglist = [e.file];
            this.getFormControl(key).setValue(e.file.response.data)
            break;
          case 'error':
            this._message.error("上传失败")
            break;
          case 'removed':
            this._message.info("移除文件")
            break;
          default:
            this._message.error("操作错误")
            break;
        }
        console.log(this.validateForm)
      }
    }

    getFlowList() {
        this.anyService.getListWithUser({ url: 'Flow' })
            .then(res => {
                res.forEach(item => {
                    item.options = []
                    if (item.reviews && item.reviews.length > 0) {
                        item.reviews.split('&').forEach((review, index) => {
                            item.options.push({ id: 'review' + index, data: review, name: `第${index + 1}级审核人` });
                        })
                    }
                    if (item.approvals && item.approvals.length > 0) {
                        item.options.push({ id: 'approval', data: item.approvals, name: `批准人` })
                    }
                    if (item.exes && item.exes.length > 0) {
                        item.options.push({ id: 'exe', data: item.exes, name: `执行人` })
                    }
                })
                this.flowList = res;
                console.log(res)
            })
    }

    resetForm() {
        let s = this.validateForm.value.select;
        this.validateForm.reset({ select: s });
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }

    open() {
      this.isVisibleMiddle = true;
    }

    handleCancelMiddle() {
      this.isVisibleMiddle = false;
    }
    submitForm(value) {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
        if (this.validateForm.valid) {
            // console.log(value);
            let data:any = {}
            let reviews = ''
            for (let key in value) {
                if (value[key] && value[key] != null) {
                    if (isNaN(parseInt(key, 10))) {
                        data[key] = value[key]
                        if (key.startsWith('review')) {
                            reviews += data[key] + ','
                        }
                    } else {
                        data[key] = value[key]
                    }
                }
            }
            data['formjson'] = JSON.stringify(data);
            data['flowId'] = this.flowList[this.index].flowId;
            if (reviews.length > 0) {
                data['reviews'] = reviews.substring(0, reviews.length - 1);
            }
            if(data['question_pdf']){
              data['urls'] = data['question_pdf']
            }
            if(data['question_img']){
              data['affairVid'] = data['question_img']
            }
            data.more = this.more
            // if(this.uploadlistZ.length>0){
            //   let arr = this.uploadlistZ.filter(item => item.status=='done')
            //   if(arr.length>0){
            //     data['affairVid']=arr[0].response.data;
            //   }
            // }
            // console.log(data);
            this.progressService.upAffair(data)
                .then(res => {
                    this._message.create('success', res);
                    this.editMenuBadge();
                    this.resetForm();
                    this.more = '';
                    this.isVisibleMiddle = false;
                    this.imglist = [];
                    this.uploadlistZ = [];
                })
        }
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

    // 流程选择后
    selectFlow(select) {
        if (!select && (this.validateForm.value.select || this.validateForm.value.select == 0)) {
            // 流程单选框选择后
            this.index = this.validateForm.value.select;
            let flow = this.flowList[this.index];
            this.treelist.signs.required = flow.isSign;
            this.options = flow.options;
            this.resetForm();
            this.options.forEach(item => {
                this.validateForm.addControl(item.id, new FormControl(null))
            })

            // 获取动态表格模版
            this.anyService.getList({ url: 'Question', templetId: flow.templetId })
                .then((res:any) => {
                    this.data = res;
                    this.data.forEach(item => {
                        if(!!item.options){
                            let o = item.options.split(',')
                            let options:any = [];
                            o.forEach(ele=>{
                              options.push({label:ele.split('_')[0],value:ele.split('_')[1]})
                            })
                            item.children = options
                        }
                        if(item.isRequired==1){
                          this.validateForm.addControl(item.key, new FormControl(null,Validators.required))
                        }else{
                          this.validateForm.addControl(item.key, new FormControl(null))
                        }

                    })
                })
        }
    }

    loadUsers(ids) {
        let options = this.flowList[this.index].options
        options.forEach(item => {
            if (item.id == ids) {
                if (!item.list) {
                    this.loading = true;
                    this.anyService.getUserListByGroupRole(item.data)
                        .then(res => {
                            item.list = res;
                            this.loading = false;
                        })
                }
                this.options = options
            }
        })
    }


    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    // tree
    treeoc(key) {
      this.treelist[key].show = !this.treelist[key].show
      this.search = ''
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
}
