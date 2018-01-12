import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkplaceComponent } from './workplace/workplace.component';
import { CreateflowComponent } from './createflow/createflow.component';
import { LaunchComponent } from './launch/launch.component';
import { ReviewComponent } from './review/review.component';
import { SignComponent } from './sign/sign.component';
import { ApprovalComponent } from './approval/approval.component';
import { ExeComponent } from './exe/exe.component';

const routes: Routes = [
    { path: '', redirectTo: 'workplace', pathMatch: 'full'},
    { path: 'workplace', component: WorkplaceComponent },
    { path: 'createflow', component: CreateflowComponent },
    { path: 'launch', component: LaunchComponent },
    { path: 'review', component: ReviewComponent },
    { path: 'sign', component: SignComponent },
    { path: 'approval', component: ApprovalComponent },
    { path: 'exe', component: ExeComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkplaceRoutingModule { }
