import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { DepartRoutingModule } from './depart-routing.module';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NotifyComponent } from './notify/notify.component';
import { DocComponent } from './doc/doc.component';
import { SysComponent } from './sys/sys.component';
import { ShowComponent } from './show/show.component';
import { ListComponent } from './home/list/list.component';

import { ListService } from '../../service/list.service';

@NgModule({
  imports: [
    CommonModule,
    DepartRoutingModule,
    SharedModule
  ],
  declarations: [HomeComponent, NewsComponent, NotifyComponent, DocComponent, SysComponent, ShowComponent, ListComponent],
  providers: [ListService]
})
export class DepartModule { }
