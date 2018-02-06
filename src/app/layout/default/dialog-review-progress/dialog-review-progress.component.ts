import { Component, OnInit, Input } from '@angular/core';

/**
 *显示新闻等的附件pdf/png
 */
@Component({
  selector: 'app-dialog-review-progress',
  templateUrl: './dialog-review-progress.component.html',
  inputs: ['modal', 'id', 'randNum'],
  styleUrls: ['./dialog-review-progress.component.css']
})
export class DialogReviewProgressComponent implements OnInit {

    modal: any;
    id: any;
    randNum: any;
	attachs: any;
    isExpd = false;

    constructor() {
    }

    ngOnInit() {
    }

    getData() {
        if(this.modal.infor != ''){
            this.attachs = this.modal.infor.url.split(',')
            let i = '#' + this.id
            const targetElement = document.querySelector(i);
            if(targetElement != null){
                this.show(this.attachs[0])
            }
        }
    }

    ngOnChanges() {
        this.getData();
    }

    show(url) {
        let i = '#' + this.id
    	const targetElement = document.querySelector(i);
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '100%';
        targetElement.innerHTML = '';
        targetElement.appendChild(iframe);
    }

    handleClose() {
    	this.modal.status = false;
    }

    isExpand() {
        this.isExpd = true;
    }

    noExpand() {
        this.isExpd = false;
    }

}
