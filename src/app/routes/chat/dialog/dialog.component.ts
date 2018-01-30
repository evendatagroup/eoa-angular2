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

import { TreeData } from '../../component/tree/tree-model';

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
    },
    {
        active: false,
        name  : '',
        icon  : 'fa fa-history',
        index: 3
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

  isVisible = false;
  isVisible2 = false;
  isHistory = 1;      // 1:聊天内容，2:历史纪录

  page = 1;
  rows = 5;
  total = 1;

  historyList = [];

  names = '';
  input_name = '';
  input_content = '';
  begin_date = '';
  end_date = '';

  search = '';
  treelist:any = {
    signs:{show:false,required:0}
  }
  nodes: Array<TreeData> = [];
  checkedList = [];

  constructor(private clusterService: ClusterService,
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
    this.userService.getUserAddress().then(res=>{
      this.nodes = res;
    });
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

  closeTree() {
    this.isVisible2 = false;
  }
  selectedTree() {
    let myNames = '';
    for(let i in this.nodes[0].children){
      let item = this.nodes[0].children[i];
      if(item.isChecked == true){
        myNames += item.name + ",";
      }
    }
    if(this.input_name == ''){
      this.input_name = myNames.substring(0, myNames.length - 1);
    }else{
      this.input_name += "," + myNames.substring(0, myNames.length - 1);
    }  
    this.isVisible2 = false;
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
    this.isHistory = 1;
  	this.getMsgByCluster(item);
  }

  // 根据群组打开对话框
  getMsgByCluster(i) {
    this.clusterList.forEach(item=>{
    	if(item.clusterVid == i.clusterVid){
    		item.noReadCount = 0;
        this.msgService
            .editRead(i.clusterVid)
            .then((res: any) => {
              // console.log(res)
            })
    	}
    })

    this.getMsgByToVid(i.clusterVid);
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
    this.isHistory = 1;
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
          this.checkCluster(clusterVid);
          this.getCluster(clusterVid);
          this.getClusterMember(clusterVid);
          this.msgList = res.data.reverse();
        })
  }

  // 检查群组是否存在，不存在则加入群组列表clusterList
  checkCluster(clusterVid) {
    let have = false;
    this.clusterList.forEach(item=>{
        if(item.clusterVid == clusterVid){
          have = true;
          return;
        }
    })
    if(!have){
      this.clusterService
          .getList(clusterVid)
          .then(data => {
            this.clusterList.push(data)
          })
    }else{
      console.log('already have')
    }
  }

  // 获取群组信息
  getCluster(clusterVid) {
    this.clusterService
        .getList(clusterVid)
        .then(data => {
          this.toName = data.clusterName;
          this.toVid = data.clusterVid;
          this.roomJoin();
        })
  }

  // 获取群组成员
  getClusterMember(clusterVid){
    this.clustermemberService
        .getList(clusterVid)
        .then(data => {
          this.list = [];
          this.list = data;
          console.log(data)
          let l = {
            avatar: '../../../../assets/img/add_member.png',
            value: 'add_member'
          }
          this.list.push(l);
          this.toNum = data.length - 1;
        })
  }

  // 增加新的群组成员
  addNewMember() {
    console.log('add new member')
    this.isVisible = true;
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
    // console.log('send message')
    this.editMsg(this.message);
    this.chatService.sendMsg(this.message);
    this.message = '';
  }

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }

  onSearch(event: string): void {
    console.log(event);
  }

  // 查询历史记录
  getList(reset = false) {
    if(reset){
      this.page = 1;
    }
    let begin = parseInt(this.begin_date.valueOf()) / 1000
    let end = parseInt(this.end_date.valueOf()) / 1000
    this.input_name = this.input_name.replace(/，/g,",")
    let names2 = this.input_name.split(',');
    for(let i in names2){
      if(names2[i] != ""){
        this.names += names2[i] + ",";
      }
    }
    // 去掉最后一个逗号
    this.names = this.names.substring(0, this.names.length - 1);
    // console.log(this.names)
    let parames = {
      page: this.page,
      rows: this.rows,
      userName: this.names,
      content: this.input_content,
      beginTimestamp: this.begin_date == '' ? '' : Math.round(begin),
      endTimestamp: this.end_date == '' ? '' : Math.round(end)
    }
    this.msgService
      .getHistory(parames)
      .then(res => {
        console.log(res.data)
        this.historyList = [];
        this.historyList = res.data;
        this.total = parseInt(res.msg)
        console.log('getList()')
      })
    this.isHistory = 2;
  }

  //tree
  treeoc(key) {
    this.treelist[key].show = !this.treelist[key].show
    this.search = ''
  }

  reset(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    this.page = 1
    this.rows = 5
    this.input_name = ''
    this.input_content = ''
    this.begin_date = ''
    this.end_date = ''
    this.historyList = [];
    this.isHistory = 2;
  }

  getHistoryMsg(data) {
    this.msgService
        .getHistoryMsg(data.msgId)
        .then(res => {
          console.log(res);
        });
  }

  showModal() {
    this.isVisible2 = true;
  }
}