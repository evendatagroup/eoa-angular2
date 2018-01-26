import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { DialogComponent } from './dialog/dialog.component';
import { HistoryComponent } from './dialog/history/history.component';

@NgModule({
  imports: [
    SharedModule,
    ChatRoutingModule
  ],
  declarations: [DialogComponent, HistoryComponent]
})
export class ChatModule { }
