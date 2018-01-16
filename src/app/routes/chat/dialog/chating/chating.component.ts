import { Component, OnInit } from '@angular/core';
import { Msg } from '../../../../class/msg';
import { MsgService } from '../../../../service/msg.service';
import { AnyService } from '../../../../service/any.service';

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

    avatar = 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png';
    date = '10:22';
    ctt = 'hello world';

    _userVid = JSON.parse(window.localStorage._token).userVid;

    list = [
    	{ avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'},
    	{ avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'},
    	{ avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'},
    	{ avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'},
    	{ avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'},
    	{ avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'},
    ]

    content = [
      { avatar: this.avatar, toVid: this.toVid, date: this.date, content: this.ctt},
      { avatar: this.avatar, toVid: this.toVid, date: this.date, content: this.ctt},
    ]

    constructor(private anyService: AnyService, private msgService: MsgService) { }

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
    }

    getMsgByUser(page, rows, toVid) {
      this.anyService
          .getMsgListByUserToUser(page, rows, toVid)
          .then(data => {
            console.log(data)
          })
    }

    getMsgByCluster(i) {
        this.msgService
            .getList(i.clusterVid)
            .then(data => {
              // console.log(data)
              this.msgList = [];
              this.toName = i.clusterName;
              this.msgList = data;
              this.toNum = data.length;
            }) 
    }

    show(vid) {
      console.log('vv'+vid)
    }

}
