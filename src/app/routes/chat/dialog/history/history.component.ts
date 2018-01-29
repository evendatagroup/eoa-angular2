import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { MsgService } from '../../../../service/msg.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

	page = 1;
	rows = 5;
	total = 1;

	historyList = [];

	input_name = '';
	input_content = '';
	begin_date = '';
    end_date = '';

    constructor(private msgService: MsgService) {
    }

    getList(reset = false) {
    	if(reset){
    		this.page = 1;
    	}
    	let parames = {
    		page: this.page,
    		rows: this.rows
    	}
    	this.msgService
    		.getHistory(parames)
    		.then(res => {
    			this.historyList = res.data;
    			this.total = parseInt(res.msg)
    			console.log(this.total)
    			console.log(this.historyList)
    		})
    }

    // 重置
    reset() {
        this.page = 1
        this.rows = 5
        this.input_name = ''
        this.input_content = ''
        this.begin_date = ''
        this.end_date = ''
        this.getList()
    }

    // 查询
    query() {
    	
    }

    ngOnInit() {
    	this.getList();
    }
}
