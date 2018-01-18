import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd';

import { AnyService } from '../../../service/any.service';
import { ProgressService } from '../../../service/progress.service';
import { UserService } from '../../../service/user.service';
import { NzTreeComponent } from 'ng-tree-antd';


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
    //tree
    path = { id: '', name: '' };
    checkedList = [];
    nodes = []
    treeoptions = {
        allowDrag: false,
        animateExpand: false,
        animateSpeed: 0
    };
    search = '';
    treelist:any = {
      signs:{show:false,required:0}
    }
    @ViewChild(NzTreeComponent) treeinput: NzTreeComponent;

    constructor(
        private _message: NzMessageService,
        private fb: FormBuilder,
        private anyService: AnyService,
        private userService: UserService,
        private progressService: ProgressService) {
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            select: [null, [Validators.required]],
            affairTitle: [null, [Validators.required]],
            //tree
            signs: [null,],
            signNames: [null,],
            search: [null,],
            q: [null]
        })
        this.getFlowList();
        this.userService.getUserAddress().then(res=>{
          this.nodes = res
        });
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
            })
    }

    resetForm() {
        let s = this.validateForm.value.select;
        this.validateForm.reset({ select: s });
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }

    submitForm($event, value) {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
        if (this.validateForm.valid) {
            console.log(value);
            let data = {}
            let reviews = ''
            for (let key in value) {
                if (value[key] && value[key] != null) {
                    if (isNaN(parseInt(key, 10))) {
                        data[key] = value[key]
                        if (key.startsWith('review')) {
                            reviews += data[key] + ','
                        }
                    } else {
                        data['templet' + key] = value[key]
                    }
                }
            }
            data['formjson'] = JSON.stringify(data);
            data['flowId'] = this.flowList[this.index].flowId;
            if (reviews.length > 0) {
                data['reviews'] = reviews.substring(0, reviews.length - 1);
            }
            console.log(data);
            this.progressService.upAffair(data)
                .then(res => {
                    console.log(res)
                    this._message.create('success', res);
                    this.resetForm();
                })
        }
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
                .then(res => {
                    this.data = res;
                    this.data.forEach(item => {
                        this.validateForm.addControl(item.key, new FormControl(null))
                    })
                })
        }
        console.log('op',this.options)
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

    //tree
    treeoc(key) {
      this.treelist[key].show = !this.treelist[key].show
      this.search = ''
    }
    treeopen(path) {
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
    }
    treeclose(path) {
      this.treelist[path.id].show = false
      this.search = ''
    }
    filterNodes() {
      if(this.search.length>0){
        this.treeinput.treeModel.filterNodes(this.search);
      }else if(this.treeinput){
        this.treeinput.treeModel.collapseAll();
      }
    }
    onFocus(ev: any) {
        //console.log('onEvent', ev , 'node', ev.node, 'model', ev.treeModel);
    }
    onEvent(ev: any) {
        //console.log('basic', 'onEvent', ev);

    }

    find(arr, fname) {
        if (arr.length == 0) return false;
        arr.forEach(item => {
            if (!item.children && item.checked && typeof (item.id) == 'string') {
                this.checkedList.push({ id: item.id, name: fname + '-' + item.name })
            }
            if (item.children) {
                this.find(item.children, item.name)
            }
        })
    }
}
