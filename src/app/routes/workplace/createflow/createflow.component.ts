import { Component, ViewChild, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { NzMessageService } from 'ng-zorro-antd';

import { UserService } from '../../../service/user.service';
import { AnyService } from '../../../service/any.service';
import { SettingsService } from '@delon/theme';
import { NzTreeComponent } from 'ng-tree-antd';

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
    nodes = []
    options = {
        allowDrag: false
    };
    search = '';
    treelist:any = {
      launchs:{show:false},
      approvals:{show:false},
      exes:{show:false}
    }
    @ViewChild(NzTreeComponent) tree: NzTreeComponent;

    index = 'First-content';

    constructor(
        private _message: NzMessageService,
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
            search:[null,]
        });
    }

    ngOnInit() {
        this.addField();
        this.userService.getRoleAddress().then(res=>{
          this.nodes = res
        });
        this.anyService.getList({ url: 'Templet' }).then(list => this.templetList = list);
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

    // cleanUserAddress(path) {
    //     this.checkedList = [];
    //     this.getFormControl(path.id).setValue('');
    //     this.getFormControl(path.name).setValue('');
    // }

    // tree
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
        this.tree.treeModel.filterNodes(this.search);
        if (!this.search) {
            this.tree.treeModel.collapseAll();
        }
    }
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
}
