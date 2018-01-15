import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
 
export class ChatService {
 private url = 'http://localhost:3000'; 
 private socket;

 initSocket(userVid){
 	this.socket = io(this.url);
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
   this.socket.on('message', (data) => {
    observer.next(data);  
   });
  })   
  return observable;
 }

 loginOut() {
 	this.socket.disconnect();
 }
}