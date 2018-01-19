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
    toVid = '';
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
      this.getUser();
    }

    ngOnInit() {
      // 将新消息加入消息列表
      let msg = this.chatService.chatMsg()
                                .subscribe((msg: any) => {
                                  let m = {
                                    msgCreateUserVid: msg.user.userVid,
                                    msgCreateUserName: msg.user.userName,
                                    msgCreateUserAvatar: msg.user.avatar,
                                    msgContent: msg.msg,
                                    time: msg.time
                                  }
                                  this.msgList.push(m);
                                  
                                  setTimeout(() => {
                                      const div = document.querySelector('#scrollDiv');
                                      let height = div.scrollHeight;
                                      div.scrollTo(0, height)
                                  }, 10);

                                  console.log(this.msgList.length)
                                })

      let msg2 = this.chatService.leave()
                                .subscribe((msg: any) => {
                                  console.log(msg);
                                })  
    }

    editMsg(message) {
      let parames = {
        toVid: this.toVid,
        content: message
      }
      this.msgService.edit(parames);
    }

    ngOnDestroy() {
      // this.chatService.leaveOff();  
    }

    // 根据用户获取对话框
    getMsgByUser(page, rows, i) {
      let toVid = i.userVid;
      this.anyService
          .getMsgListByUserToUser(page, rows, toVid)
          .then(res => {
            this.msgList = [];
            let clusterVid = res.msg;
            this.getCluster(clusterVid);
            this.getClusterMember(clusterVid);
            this.msgList = res.data;
            this.msgList.reverse()
          })
    }

    // 获取群组信息
    getCluster(clusterVid) {
      this.clusterService
          .getList(clusterVid)
          .then(data => {
            this.toName = data.clusterName;
            this.toVid = data.clusterVid;
          })
    }

    // 获取群组成员
    getClusterMember(clusterVid){
      this.clustermemberService
          .getList(clusterVid)
          .then(data => {
            this.list = data;
            this.toNum = data.length;
          })
    }

    // 根据群组打开对话框
    getMsgByCluster(i) {
      if(this.toVid != '' && this.toVid != i.clusterVid){
        let leaveJson = {
          oldVid: this.toVid,
          newVid: i.clusterVid
        }
        this.chatService.leaveOff(leaveJson); 
      }
      this.msgList = [];
      this.msgList = i.children;
      this.toName = i.clusterName;
      this.toVid = i.clusterVid;

      this.roomJoin();
      this.getCluster(this.toVid);
      this.getClusterMember(this.toVid);
    }

    // 加入某个群组
    roomJoin() {
      let roomJson = {
        toVid: this.toVid,
        user: this.user,
      }
      this.chatService.roomJoin(roomJson);
    }

    // 获取当前用户信息
    getUser() {
      this.userService
          .getListById(this._userVid)
          .then(data => {
            this.user = data;
          })
    }

    // 发送新消息
    sendMessage() {
      // console.log('sendMsg')
      this.editMsg(this.message);
      this.chatService.sendMsg(this.message); 
      this.message = '';
    }

}
