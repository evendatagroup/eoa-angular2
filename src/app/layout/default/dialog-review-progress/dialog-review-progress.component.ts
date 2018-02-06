import { Component, OnInit, Input } from '@angular/core';

/**
 *显示新闻等的附件pdf/png
 */
@Component({
  selector: 'app-dialog-review-progress',
  templateUrl: './dialog-review-progress.component.html',
  inputs: ['modal', 'id', 'randNum'],
  styles: [`
  	.Absolute-Center {
	  margin: auto;
	  position: absolute;
	  top: 0; left: 0; bottom: 0; right: 0;
	}
  `]
})
export class DialogReviewProgressComponent implements OnInit {

    private modal: any;
    private id: any;
    private randNum: any;
	attachs: any;

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
        console.log('changes')
        this.getData();
    }

    show(url) {
        let i = '#' + this.id
    	const targetElement = document.querySelector(i);
    	// console.log(targetElement)
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

}
