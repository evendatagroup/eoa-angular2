import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-review-progress',
  templateUrl: './dialog-review-progress.component.html',
  inputs: ['modal'],
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
	attachs: any;

    constructor() { }

    ngOnInit() {
    	console.log(this.modal)
    	this.attachs = this.modal.infor.imgs.split(',');
    	this.attachs.push(this.modal.infor.url)
    	// console.log(this.attachs)
    }

    show(url) {
    	console.log(url)
    	const targetElement = document.querySelector('#show1');
    	console.log(targetElement)
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '100%';
        targetElement.innerHTML = '';
        targetElement.appendChild(iframe);
    }

    handleClose() {
    	// console.log(this.modal)
    	this.modal.status = false;
    }

}
