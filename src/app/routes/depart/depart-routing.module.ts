import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NotifyComponent } from './notify/notify.component';
import { DocComponent } from './doc/doc.component';
import { SysComponent } from './sys/sys.component';
import { ShowComponent } from './show/show.component';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'news', component: NewsComponent },
	{ path: 'notify', component: NotifyComponent },
	{ path: 'doc', component: DocComponent },
	{ path: 'sys', component: SysComponent },
	{ path: 'show', component: ShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartRoutingModule { }
