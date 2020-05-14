import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-create-broadcast',
  templateUrl: './create-broadcast.component.html',
  styleUrls: ['./create-broadcast.component.scss']
})
export class CreateBroadcastComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(document).ready(function() {
      $('.js-example-basic-single').select2();
  });
  }

}
