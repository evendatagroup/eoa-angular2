import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';

/**
 *审核等处理意见
 */
@Component({
  selector: 'app-dialog-progress',
  templateUrl: './dialog-progress.component.html',
  inputs: ['modal']
})
export class DialogProgressComponent implements OnInit {
	private modal: any;

	more = '同意';
    radioValue = '2';

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

    openPdf() {
    	const targetElement = document.querySelector('#show2');
    	console.log(targetElement)
        const iframe = document.createElement('iframe');
        // iframe.src = url;
        iframe.width = '100%';
        iframe.height = '100%';
        targetElement.innerHTML = '';
        targetElement.appendChild(iframe);
    }

    handleClose() {
    	this.modal.status = false;
    }

}
