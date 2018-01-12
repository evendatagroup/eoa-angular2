import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicComponent } from './basic/basic.component';
import { MessageComponent } from './message/message.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
	{ path: '', redirectTo: 'basic', pathMatch: 'full' },
	{ path: 'basic', component: BasicComponent },
	{ path: 'message', component: MessageComponent },
	{ path: 'todo', component: TodoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
