import { Component, OnInit } from '@angular/core';
import { Msg } from '../../../../class/msg';
import { User } from '../../../../class/user.class';
import { MsgService } from '../../../../service/msg.service';
import { AnyService } from '../../../../service/any.service';
import { ClusterService } from '../../../../service/cluster.service';
import { ChatService } from '../../../../service/chat.service';
import { UserService } from '../../../../service/user.service';
import { ClusterMemberService } from '../../../../service/clustermember.service';

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.css']
})
export class ChatingComponent implements OnInit {

    msgList: Msg[];
    toVid = 'cluster_1';
    toName = '';
    toNum: number;

    user: User;

    avatar = 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png';
    date = '10:22';
    ctt = 'hello world';

    _userVid = JSON.parse(window.localStorage._token).userVid;

    list = [];

    messages = [];
    connection;
    message;

    constructor(private userService: UserService,
                private chatService: ChatService, 
                private clustermemberService: ClusterMemberService, 
                private clusterService: ClusterService, 
                private anyService: AnyService, 
                private msgService: MsgService) {
      this.chatService.initSocket();
      this.getUser();
    }

    getMsgList() {
      this.msgService
          .getList(this.toVid)
          .then(data => {
            this.msgList = data;
            // console.log(data)
          })
    }

    ngOnInit() {
      // this.getMsgList()
      this.connection = this.chatService
                  .getMessages()
                    .subscribe(message => {
                    this.messages.push(message);
                  console.log(this.messages)
      })
    }

    ngOnDestroy() {
      this.connection.unsubscribe();
    }

    getMsgByUser(page, rows, i) {
      let toVid = i.userVid;
      // console.log(toVid)
      this.anyService
          .getMsgListByUserToUser(page, rows, toVid)
          .then(res => {
            this.msgList = [];
            let clusterVid = res.msg;
            console.log(clusterVid)
            this.getCluster(clusterVid);
            this.getClusterMember(clusterVid);
            this.msgList = res.data;
            this.msgList.reverse()
            // console.log(res.data)
          })
    }

    getCluster(clusterVid) {
      this.clusterService
          .getList(clusterVid)
          .then(data => {
            this.toName = data.clusterName;
            this.toVid = data.clusterVid;
          })
    }

    getClusterMember(clusterVid){
      this.clustermemberService
          .getList(clusterVid)
          .then(data => {
            this.list = data;
            this.toNum = data.length;
          })
    }

    getMsgByCluster(i) {
        this.msgService
            .getList(i.clusterVid)
            .then(data => {
              this.msgList = [];
              this.toName = i.clusterName;
              this.toVid = i.clusterVid;
              this.msgList = data;
              this.msgList.reverse();
              this.getCluster(i.clusterVid);
              this.getClusterMember(i.clusterVid);
            }) 
    }

    getUser() {
      this.userService
          .getListById(this._userVid)
          .then(data => {
            this.user = data;
            console.log(this.user)
          })
    }

    sendMessage() {
      console.log('sendMsg')
      let roomMsgJson = {
        toVid: this.toVid,
        content: this.message,
        createUserVid: this._userVid,
        avatar: this.user.avatar
      }
      this.chatService.sendRoomMsg(roomMsgJson);
      this.message = '';
    }

}
