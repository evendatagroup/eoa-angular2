import { Component, ViewChild, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NzMessageService } from 'ng-zorro-antd';

import { SInformation } from '../../../class/sInformation.class';
import { ListService } from '../../../service/list.service';
import { UserService } from '../../../service/user.service';
import { AnyService } from '../../../service/any.service';
import { SettingsService } from '@delon/theme';
import { NzTreeComponent } from 'ng-tree-antd';

@Component({
    selector: 'app-createflow',
    templateUrl: './createflow.component.html',
    styleUrls: ['./createflow.component.less'],
    providers: [ListService, AnyService, UserService]
})
export class CreateflowComponent {

    current = 0;
    validateForm: FormGroup;
    controlArray = [];
    sysList: SInformation[] = [{ sid: 0, stitle: '正在加载' }];
    stypeList = [{ typeId: 0, typeName: '正在加载' }];
    templetList = [{ templetId: 0, templetName: '正在加载' }];
    userAddressVisible = false;
    userAddressList = [{ id: 1, name: '杭州易闻', hasChildren: true }];
    checkedList = [];
    path = { id: '', name: '' };
    nodes = [{
        id: '1', name: '杭州易闻', children: [
            { id: '1-1', name: 'OA管理员(系统管理员)' },
            {
                id: '2', name: '地球', children: [
                    { id: '2-2', name: '角色1(朱一一)' },
                    {
                        id: '3', name: '中国', children: [
                            { id: '3-3', name: '角色2(朱一二)' }
                        ]
                    }
                ]
            },
            {
                id: '4', name: '欧洲', children: [
                    { id: '4-4', name: '角色3(朱二一)' }
                ]
            },

        ]
    }]
    q = '';
    options = {
        allowDrag: false
    };
    cardshow = false;
    @ViewChild(NzTreeComponent) tree: NzTreeComponent;

    index = 'First-content';

    constructor(
        private _message: NzMessageService,
        private fb: FormBuilder,
        private listService: ListService,
        private userService: UserService,
        private settingsService: SettingsService,
        private anyService: AnyService
    ) {
        this.validateForm = this.fb.group({
            flowName: [null, [Validators.required]],
            // inforId: [null, [Validators.required]],
            // flowType: [null, [Validators.required]],
            launchs: [null, [Validators.required]],
            launchNames: [null,],
            templetId: [null,],
            isSign: [0, [Validators.required]],
            // collatorIds: [null,],
            // collatorNames: [null,],
            // auditorIds: [null,],
            // auditorNames: [null,],
            approvals: [null,],
            approvalNames: [null,],
            exes: [null, [Validators.required]],
            exeNames: [null,],
            search:[null,]
        });
    }

    ngOnInit() {
        this.addField();
        this.userService.getUserAddress().then(res=>{
          this.nodes = res
        });
        // this.listService.getList({ stype: '13', page: 1, rows: 9 }).then(list => this.sysList = list);
        // this.listService.getSTypeList({}).then(list => this.stypeList = list);
        this.anyService.getList({ url: 'Templet' }).then(list => this.templetList = list);
    }

    filterNodes() {
        this.tree.treeModel.filterNodes(this.q);
        if (!this.q) {
            this.tree.treeModel.collapseAll();
        }
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
    //
    // submitForm($event, value) {
    //     $event.preventDefault();
    //     for (const key in this.validateForm.controls) {
    //         this.validateForm.controls[key].markAsDirty();
    //     }
    //     console.log(value);
    // };

    submit() {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
        console.log(this.validateForm.value);
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
        console.log(data);
        this.anyService.edit({ url: 'Flow', data: data })
            .then(res => {
                this._message.create('success', res);
                this.resetForm();
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




    // 花名册
    showUserAddress(path) {
        this.userAddressVisible = true;
        this.path = path;
        // this.userAddressList = [{ id: 1, name: '杭州易闻', hasChildren: true }];
    }
    // options = {
    //     getChildren: (node: any) => {
    //         return new Promise((resolve, reject) => {
    //             let arr = [];
    //             let ids = [];
    //             this.userService.getList({ treeId: node.id })
    //                 .then(list => {
    //                     list.forEach(item => {
    //                         if (item.userGroupId == node.id) {
    //                             arr.push({ id: item.userGroupId + '-' + item.roleId, name: item.roleName + '(' + item.userNames + ')' })
    //                         } else {
    //                             if (ids.indexOf(item.userGroupId) == -1) {
    //                                 arr.push({ id: item.userGroupId, name: item.groupName, hasChildren: true });
    //                                 ids.push(item.userGroupId)
    //                             }
    //                         }
    //                     })
    //                     console.log(arr)
    //                     resolve(arr);
    //                 })
    //         });
    //     }
    // }
    // onEvent(ev: any) {
    //     console.log('onEvent', ev);
    // }
    onFocus(ev: any) {
        console.log('onEvent', ev);
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
    handleOk = (e) => {
        this.checkedList = [];
        this.find(this.nodes, '');
        let ids = [];
        let names = [];
        this.checkedList.forEach(item => {
            names.push(item.name.replace(/\(\S+\)/g, ''))
            ids.push(item.id)
        })
        this.getFormControl(this.path.id).setValue(ids.join(','));
        this.getFormControl(this.path.name).setValue(names.join(','));
        this.userAddressVisible = false;
    }

    handleCancel = (e) => {
        this.userAddressVisible = false;
    }

    cleanUserAddress(path) {
        this.checkedList = [];
        this.getFormControl(path.id).setValue('');
        this.getFormControl(path.name).setValue('');
    }
    show(cardshow) {
      this.cardshow = !cardshow;
    }
}
