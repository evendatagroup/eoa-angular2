import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogComponent } from './dialog/dialog.component';
import { HistoryComponent } from './dialog/history/history.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dialog', pathMatch: 'full'},
	{ path: 'dialog', component: DialogComponent},
	{ path: 'history', component: HistoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
