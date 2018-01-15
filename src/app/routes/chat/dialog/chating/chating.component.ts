import { Component, OnInit } from '@angular/core';
import { Msg } from '../../../../class/msg';
import { MsgService } from '../../../../service/msg.service';

@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.css']
})
export class ChatingComponent implements OnInit {

    msgList: Msg[];
    toVid = 'cluster_1';
    toName = '群组1单人';

    avatar = 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png';
    date = '10:22';
    ctt = 'hello world'

    userVid = JSON.parse(window.localStorage._token).userVid

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

    constructor(private msgService: MsgService) { }

    getMsgList() {
      this.msgService
          .getList(this.toVid)
          .then(data => {
            this.msgList = data;
            // console.log(data)
          })
    }

    ngOnInit() {
      this.getMsgList()
    }

}
