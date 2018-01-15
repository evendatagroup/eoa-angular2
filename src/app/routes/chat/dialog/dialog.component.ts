import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../service/chat.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  // providers: [ChatService]
})
export class DialogComponent implements OnInit {

	tabs = [
	    {
	    	active: true,
	        name  : '',
	        icon  : 'icon-speech',
	        index: 1
	    },
	    {
	        active: false,
	        name  : '',
	        icon  : 'icon-list',
	        index: 2
	    }
    ];

	messages = [];
    connection;
    message;

    userVid = '';

    constructor(private chatService: ChatService) { 
    	this.userVid = JSON.parse(window.localStorage._token).userVid;
    	this.chatService.initSocket(this.userVid);
    }

    sendMessage(who){
		let sendMsgJson = {
			name: this.userVid,
			text: this.message,
			to: who
		}
	 	this.chatService.sendMsg(sendMsgJson);
	    this.message = '';
	}

    ngOnInit() {
    	this.connection = this.chatService
	    					  .getMessages()
	    				      .subscribe(message => {
						    	  this.messages.push(message);
								  console.log(this.messages)
	    })
    }

    loginOut() {
		this.chatService
			.loginOut()
	}
	  
	ngOnDestroy() {
		this.connection.unsubscribe();
	}

}
