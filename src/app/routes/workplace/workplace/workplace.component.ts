import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-workplace',
    templateUrl: './workplace.component.html'
})
export class WorkplaceComponent {
  list = [
    {url:'/workplace/launch', name:'发起', numb: 0},
    {url:'/workplace/review', name:'审核', numb: 4},
    {url:'/workplace/sign', name:'会签', numb: 3},
    {url:'/workplace/approval', name:'批准', numb: 2},
    {url:'/workplace/exe', name:'执行', numb: 4},
    {url:'/workplace/createflow', name:'建模', numb: 0},
  ]
}