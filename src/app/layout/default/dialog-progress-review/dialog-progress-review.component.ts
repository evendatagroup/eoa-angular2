import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

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
