import { Component, OnInit } from '@angular/core';

import { ProgressService } from '../../../service/progress.service';

@Component({
    selector: 'app-workplace',
    templateUrl: './workplace.component.html',
    providers: [ProgressService]
})
export class WorkplaceComponent {
  list = [
    {url:'/workplace/launch', name:'发起', numb: 0},
    {url:'/workplace/review', name:'审核', numb: 0},
    {url:'/workplace/sign', name:'会签', numb: 0},
    {url:'/workplace/approval', name:'批准', numb: 0},
    {url:'/workplace/exe', name:'执行', numb: 0},
    {url:'/workplace/createflow', name:'建模', numb: 0},
  ]
  constructor(
      private progressService: ProgressService
  ) {}
  
  ngOnInit() {
      this.progressService.getCountDoing()
      .then(res=>{
        res.forEach(item=>{
          // console.log('item', item)
          this.list[item.progressRole-1].numb = item.count;
        })
      })
  }
}
