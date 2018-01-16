import { Component, OnInit, ViewChild  } from '@angular/core';
import { ChatingComponent } from './chating/chating.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  // providers: [ChatService]
})

export class DialogComponent implements OnInit {
  @ViewChild(ChatingComponent)
  private chatingComponent: ChatingComponent
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

    constructor() {
    }

    ngOnInit() {
    }

    onVoted(i: string) {
	    // this.vid = toVid;
	    this.chatingComponent.getMsgByCluster(i);
    }

    onVoted2(i: string) {
	    // this.vid = toVid;
	    // console.log(i)
	    this.chatingComponent.getMsgByUser(1, 10, i);
    }
}
