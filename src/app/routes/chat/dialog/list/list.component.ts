import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../service/user.service';
import { ClusterService } from '../../../../service/cluster.service';
import { User } from '../../../../class/user.class';
import { Cluster } from '../../../../class/cluster';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

    userList: User[];
    clusterList: Cluster[];

    logo = 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png';


    constructor(private userService: UserService, private clusterService: ClusterService) { }

    getUserList() {
      this.userService
        .getList()
        .then(data => {
          this.userList = data;
        })
    }

    getClusterList() {
      this.clusterService
        .getLisWithUser()
        .then(data => {
          this.clusterList = data;
        })
    }

    ngOnInit() {
      this.getUserList();
      this.getClusterList();
    }

}
