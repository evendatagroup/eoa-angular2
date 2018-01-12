import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { map, delay, debounceTime } from 'rxjs/operators';

import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-pwd',
  templateUrl: './pwd.component.html',
  styles: []
})
export class PwdComponent implements OnInit {

  user: any;
  back: any;
  form: FormGroup;

  constructor(private userService: UserService,private fb: FormBuilder, private msg: NzMessageService) { }

  getUser(): void {
      this.userService
          .getUser()
          .then(data => {
              this.user = data;
              let password = this.user.password;
              this.user.password = null;
              this.form.reset(this.user);
              // this.form.value.password = null;
              // console.log(this.form.value.password)
              // console.log(this.user)
          });
  }

  editPassword(): void {
      this.userService
          .editPassword(this.form.value.password,this.form.value.newpassword)
          .then(data => {
              this.back = data;
              console.log(this.back)
          });
  }

  ngOnInit() {
    this.getUser();
  	this.form = this.fb.group({
            userId: [null],
            password: [null, [Validators.required]],
            newpassword: [null, [Validators.required]],
            checkPassword: [null, Validators.compose([Validators.required, this.confirmationValidator])]
        }, );
  }

    _submitForm() {
        // tslint:disable-next-line:forin
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
        }
        console.log('log', this.form.value);
        if (this.form.valid) {
            this.editPassword();
            this.msg.success('Successed!');
        } else {
            this.msg.error('Fail!');
        }
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.form.controls['newpassword'].value) {
            return { confirm: true, error: true };
        }
    }

    getFormControl(name: string) {
        return this.form.controls[name];
    }

    //#region get form fields
    get userId() { return this.form.controls.userId; }
    get password() { return this.form.controls.password; }
    get newpassword() { return this.form.controls.newpassword; }
    get checkPassword() { return this.form.controls.checkPassword; }
    //#endregion
}
