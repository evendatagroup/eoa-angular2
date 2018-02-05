import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

/**
 *显示审核等处理事项的进度
 */
@Component({
  selector: 'app-dialog-progress-review',
  templateUrl: './dialog-progress-review.component.html',
})
export class DialogProgressReviewComponent implements OnInit {

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
