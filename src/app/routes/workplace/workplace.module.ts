import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from '@shared/shared.module';

import { NzTreeModule } from 'ng-tree-antd';

import { ReactiveFormsModule } from '@angular/forms';

import { WorkplaceRoutingModule } from './workplace-routing.module';

import { WorkplaceComponent } from './workplace/workplace.component';
import { CreateflowComponent } from './createflow/createflow.component';
import { LaunchComponent } from './launch/launch.component';
import { LaunchFormComponent } from './launch/launch-form.component';
import { LaunchListComponent } from './launch/launch-list.component';

import { UserService } from '../../service/user.service';

import { HttpModule } from '@angular/http';
import { ReviewComponent } from './review/review.component';
import { SignComponent } from './sign/sign.component';
import { ApprovalComponent } from './approval/approval.component';
import { ExeComponent } from './exe/exe.component';
// import { ProgressComponent } from './launch/progress/progress.component';
// import { ReviewProgressComponent } from './launch/review-progress/review-progress.component';

@NgModule({
    imports: [
        SharedModule,
        WorkplaceRoutingModule,
        ReactiveFormsModule,
        HttpModule,
        FileUploadModule,
        NzTreeModule
    ],
    declarations: [
        WorkplaceComponent,
        CreateflowComponent,
        LaunchComponent,
        LaunchFormComponent,
        LaunchListComponent,
        ReviewComponent,
        SignComponent,
        ApprovalComponent,
        ExeComponent,
        // ProgressComponent,
        // ReviewProgressComponent,
    ],
    providers: [UserService]
})
export class WorkplaceModule { }
