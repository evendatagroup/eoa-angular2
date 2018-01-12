import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-launch',
    template: `
    <nz-tabset [nzTabPosition]="'top'" [nzType]="'card'">
      <nz-tab *ngFor="let tab of tabs">
        <ng-template #nzTabHeading>
          {{tab.name}}
        </ng-template>
        <launch-form *ngIf="tab.index==1"></launch-form>
        <launch-list *ngIf="tab.index==2"></launch-list>
      </nz-tab>
    </nz-tabset>`
})
export class LaunchComponent {
  tabs = [
    {
      name: '新建发起',
      index: 1
    },
    {
      name: '发起列表',
      index: 2
    }
  ];
}
