import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styles: []
})
export class TodoComponent implements OnInit {
	
	todoData: any[] = [
	    { completed: true, avatar: '1', name: '苏先生', content: `请告诉我，我应该说点什么好？` },
	    { completed: false, avatar: '2', name: 'はなさき', content: `ハルカソラトキヘダツヒカリ` },
	    { completed: false, avatar: '3', name: 'cipchk', content: `this world was never meant for one as beautiful as you.` },
	    { completed: false, avatar: '4', name: 'Kent', content: `my heart is beating with hers` },
	    { completed: false, avatar: '5', name: 'Are you', content: `They always said that I love beautiful girl than my friends` },
	    { completed: false, avatar: '6', name: 'Forever', content: `Walking through green fields ，sunshine in my eyes.` }
	];

  status = { progressStatus: 2 };
  // 事务中担任的角色 1:拟稿，2:审批，3:会签，4:整理，5:审核，6:签发，7:发布
  role = [ "", "发起", "审核", "会签", "批准", "执行"];
  todoList: any;

  constructor(private userService: UserService) { }

  getTodoList() {
  	this.userService
  		.getTodoList(status)
  		.then(data => {
              this.todoList = data;
              // console.log(this.todoList)
          });
  }

  ngOnInit() {
  	this.getTodoList();
  }

}
