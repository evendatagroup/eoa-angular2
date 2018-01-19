import { Component, OnInit, ViewChild  } from '@angular/core';
import { Cluster } from '../../../class/cluster';
import { ClusterService } from '../../../service/cluster.service';
import { UserService } from '../../../service/user.service';
import { ChatService } from '../../../service/chat.service';
import { AnyService } from '../../../service/any.service';
import { ClusterMemberService } from '../../../service/clustermember.service';
import { MsgService } from '../../../service/msg.service';
import { User } from '../../../class/user.class';
import { Msg } from '../../../class/msg';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
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

    clusterList: Cluster[];
    userList: User[];
    msgList: Msg[];
    messages = [];
    message;
    toVid = '';
    toName = '';
    toNum: number;
    list = [];
    noReadnum = 10;  

    user: User;
    _userVid = JSON.parse(window.localStorage._token).userVid;
    logo = 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png';

    constructor(private clusterService: ClusterService，
    			private userService: UserService,
    			private chatService: ChatService, 
                private clustermemberService: ClusterMemberService, 
                private anyService: AnyService, 
                private msgService: MsgService) {
    	this.getUser();
    }

    ngOnInit() {
    	this.getClusterList();
    	this.getUserList();
    	// 将新消息加入消息列表
        let msg = this.chatService.chatMsg()
                                  .subscribe((msg: any) => {
                                    let m = {
                                      createUserVid: msg.user.userVid,
                                      userName: msg.user.userName,
                                      avatar: msg.user.avatar,
                                      content: msg.msg,
                                      time: msg.time
                                    }
                                    if(this.toVid == msg.roomId){
                                    	this.msgList.push(m);
                                    }else{
                                    	// 群未读消息数加1
                                    	this.clusterList.forEach(item=>{
								          	if(item.clusterVid == msg.roomId){
								          		item.noReadCount++;
								          	}
								        })
                                    }
                                    
                                    setTimeout(() => {
                                        const div = document.querySelector('#scrollDiv');
                                        let height = div.scrollHeight;
                                        div.scrollTo(0, height)
                                    }, 10);
                                  })

        let msg2 = this.chatService.leave()
                                  .subscribe((msg: any) => {
                                    console.log(msg);
                                  })  
    }

    // 获取当前用户信息
    getUser() {
      this.userService
          .getListById(this._userVid)
          .then(data => {
            this.user = data;
          })
    }

    // 获取群组列表
    getClusterList() {
	    this.clusterService
	        .getLisWithUser()
	        .then(data => {
	          this.clusterList = data;
              this.clusterList = this.clusterList.filter(item => item.children.reverse());
	        })
	}

	// 获取联系人列表
	getUserList() {
      this.userService
        .getList()
        .then(data => {
          this.userList = data;
        })
    }

    setClusterVid(item) {
    	this.toVid = item.clusterVid;
    	this.getMsgByCluster(item);
    }

    // 根据群组打开对话框
    getMsgByCluster(i) {
      this.clusterList.forEach(item=>{
      	if(item.clusterVid == i.clusterVid){
      		item.noReadCount = 0;
      	}
      })

      this.getMsgByToVid(i.clusterVid);
      this.toName = i.clusterName;
      this.toVid = i.clusterVid;
      this.roomJoin();
      this.getCluster(this.toVid);
      this.getClusterMember(this.toVid);
    }

    getMsgByToVid(toVid) {
    	this.msgService
    		.getListByPage(toVid)
    		.then(data => {
    			this.msgList = [];
    			this.msgList = data.reverse();
    		})
    }

    setUserVid(item) {
    	this.getMsgByUser(1, 10, item);
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

    // 加入某个群组
    roomJoin() {
      let roomJson = {
        toVid: this.toVid,
        user: this.user,
      }
      this.chatService.roomJoin(roomJson);
    }

    // 上传添加的新消息
    editMsg(message) {
      let parames = {
        toVid: this.toVid,
        content: message
      }
      this.msgService.edit(parames);
    }

    // 发送新消息
    sendMessage() {
      this.editMsg(this.message);
      this.chatService.sendMsg(this.message); 
      this.message = '';
    }
}
