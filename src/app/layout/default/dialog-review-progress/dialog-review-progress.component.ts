import { Component, OnInit, Input } from '@angular/core';

/**
 *显示新闻等的附件pdf/png
 */
@Component({
  selector: 'app-dialog-review-progress',
  templateUrl: './dialog-review-progress.component.html',
  inputs: ['modal', 'id'],
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
	  attachs: any;

    constructor() { }

    ngOnInit() {
    	// if(this.modal.infor != ''){
     //        this.attachs = this.modal.infor.url.split(',')
     //  //       console.log(this.modal.infor.url)
    	// 	// console.log(this.modal.infor.url.split(','))
    	// 	// let urls = this.modal.infor.url.split(',');
    	// 	// for(let u in urls){
    	// 	// 	this.attachs.push(urls[u])
    	// 	// }
    	// 	// this.attachs = this.attachs.filter(item => item != "");
     //        // this.show(this.attachs[0]);
    	// }
    	// console.log(this.attachs)

    }

    getData() {
        console.log(2);
        if(this.modal.infor != ''){
            console.log(3);
            this.attachs = this.modal.infor.url.split(',')
            console.log(4);
            setTimeout(this.show(this.attachs[0]), 1000)
        }
    }

    ngOnChanges() {
        // console.log(this.modal)
        console.log(1);
        this.getData();
    }

    show(url) {
    	// console.log(url)
        let i = '#' + this.id
    	  const targetElement = document.querySelector(i);
    	// console.log(targetElement)
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '100%';
        console.log(5);
        console.log(targetElement);
        targetElement.innerHTML = '';
        console.log(6);
        targetElement.appendChild(iframe);
    }

    handleClose() {
    	// console.log(this.modal)
    	this.modal.status = false;
    }

}
