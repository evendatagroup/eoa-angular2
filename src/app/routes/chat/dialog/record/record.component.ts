import { Component, OnInit } from '@angular/core';
import { Cluster } from '../../../../class/cluster';
import { ClusterService } from '../../../../service/cluster.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
})
export class RecordComponent implements OnInit {

	  clusterList: Cluster[];

    logo = 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png';

    data = [
  		{ title: 'recd1', subDescription: 'hello', date: '09:22', logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'},
	  	{ title: 'recd2', subDescription: 'hello', date: '09:22', logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'},
	  	{ title: 'recd3', subDescription: 'hello', date: '09:22', logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'},
	  	{ title: 'recd4', subDescription: 'hello', date: '09:22', logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'},
    ]

    constructor(private clusterService: ClusterService) { }

    getMsgList() {
	    this.clusterService
	        .getLisWithUser()
	        .then(data => {
	          this.clusterList = data;
	        })
	  }

    ngOnInit() {
    	this.getMsgList()
    }

    show() {
      console.log('showing.....')
    }

}
