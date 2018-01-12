import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { map, delay, debounceTime } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styles: []
})
export class InfoComponent implements OnInit {
  user: any;

  form: FormGroup;

  constructor(private userService: UserService,private fb: FormBuilder, private msg: NzMessageService) { }

  getUser(): void {
      this.userService
          .getUser()
          .then(data => {
              this.user = data;
              this.form.reset(this.user);
              console.log(this.user)
          });
  }

  editUser(): void {
    this.userService
        .editUser(this.form.value)
        .then(data => {
          // console.log(data);
          // 刷新数据
          this.getUser();
        });
  }


  ngOnInit() {
    this.getUser();
  	this.form = this.fb.group({
            userId: [null],
            EMail: [null, [Validators.email]],
            mobilephone: [null, [Validators.required]],
            realName: [null, Validators.compose([Validators.required])],
        }, );
  }

  

    _submitForm() {
        // tslint:disable-next-line:forin
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
        }
        this.editUser();
        // console.log('log', this.form.value);
        if (this.form.valid) {
            this.msg.success('Successed!');
        } else {
            this.msg.error('Fail!');
        }
    }

    getFormControl(name: string) {
        return this.form.controls[name];
    }

    //#region get form fields
    get EMail() { return this.form.controls.EMail; }
    get mobilephone() { return this.form.controls.mobilephone; }
    get realName() { return this.form.controls.realName; }
    get userId() { return this.form.controls.userId; }
    //#endregion

}
