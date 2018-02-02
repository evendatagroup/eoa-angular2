import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';

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

    handleClose() {

    }

}
