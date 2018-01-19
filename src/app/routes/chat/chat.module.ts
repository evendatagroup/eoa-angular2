import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { DialogComponent } from './dialog/dialog.component';
// import { ChatingComponent } from './dialog/chating/chating.component';
// import { ListComponent } from './dialog/list/list.component';
// import { RecordComponent } from './dialog/record/record.component';

@NgModule({
  imports: [
    SharedModule,
    ChatRoutingModule
  ],
  declarations: [DialogComponent]
})
export class ChatModule { }
