import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
 
export class ChatService {
    private url = 'http://localhost:3000'; 
    private socket;

	login(userVid) {
		this.initSocket();
	 	this.socket.emit('addUser', userVid);
	}

	initSocket(){
	 	this.socket = io(this.url);
	}

	roomJoin(roomJson) {
	 	this.socket.emit('room-join', roomJson);
	}

	// 监听系统消息
	sysMsg() {
	 	let observable = new Observable(observer => {
		   this.socket.on('sys', function(sysMsg, users) {
		 		observer.next(users.length);
		 	});
		  })   
		  return observable;
	}

	// 聊天消息
	chatMsg() {
		let observable = new Observable(observer => {
			this.socket.on('msg', function(user, msg, time, roomId) {
				let json = {
					user: user,
					msg: msg,
					time: time,
					roomId: roomId
				}
				observer.next(json);
			})
		})
		return observable;
	}

	// 发送消息
	sendMsg(msg) {
		this.socket.send(msg);
	}

	// 断开连接
	leave() {
		let observable = new Observable(observer => {
			this.socket.on('leave', function(msg) {
				observer.next(msg);
			})
		})
		return observable;
	}	

	leaveOff(leaveJson) {
		this.socket.emit('leave-room', leaveJson);
	} 	
}

 // sendRoomMsg(roomMsgJson) {
 // 	this.socket.emit('room', roomMsgJson);
 // }

 // sendMsg(sendMsgJson) {
 // 	this.socket.emit('message', sendMsgJson);
 // }
  
 // sendMessage(sendMsgJson){
 //    this.socket.emit('add-message', sendMsgJson);  
 // }

 // sendMessageTo(sendMsgJson){
 //    this.socket.emit('to-message', sendMsgJson);  
 // }
  
 // getMessages() {
 //  let observable = new Observable(observer => {
 //   this.socket.on('room-message', (data) => {
 //   	// console.log(data)
 //    observer.next(data);  
 //   });
 //  })   
 //  return observable;
 // }

 // loginOut() {
 // 	this.socket.disconnect();
 // }

 // leave() {
 // 	this.socket.leave();
 // }
