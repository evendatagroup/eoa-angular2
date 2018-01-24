import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { FileUploadModule } from 'ng2-file-upload';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { ImageCropperModule } from 'ng2-img-cropper';

import { PersonalRoutingModule } from './personal-routing.module';
import { BasicComponent } from './basic/basic.component';
import { MessageComponent } from './message/message.component';
import { TodoComponent } from './todo/todo.component';
import { InfoComponent } from './basic/info/info.component';
import { PwdComponent } from './basic/pwd/pwd.component';
import { CropperComponent } from './basic/cropper/cropper.component';

import { ListService } from '../../service/list.service';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    SharedModule,
    ColorPickerModule,
    FileUploadModule,
    ImageCropperModule
  ],
  declarations: [BasicComponent, MessageComponent, TodoComponent, InfoComponent, PwdComponent, CropperComponent],
  providers: [ListService]
})
export class PersonalModule { }
