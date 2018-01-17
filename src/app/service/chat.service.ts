import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
 
export class ChatService {
 private url = 'http://localhost:3000'; 
 private socket;

 initSocket(){
 	this.socket = io(this.url);
 }

 sendRoomMsg(roomMsgJson) {
 	this.socket.emit('room', roomMsgJson);
 }

 sendMsg(sendMsgJson) {
 	this.socket.emit('message', sendMsgJson);
 }
  
 sendMessage(sendMsgJson){
    this.socket.emit('add-message', sendMsgJson);  
 }

 sendMessageTo(sendMsgJson){
    this.socket.emit('to-message', sendMsgJson);  
 }
  
 getMessages() {
  let observable = new Observable(observer => {
   this.socket.on('room-message', (data) => {
   	// console.log(data)
    observer.next(data);  
   });
  })   
  return observable;
 }

 loginOut() {
 	this.socket.disconnect();
 }

 leave() {
 	this.socket.leave();
 }
}