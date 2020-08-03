import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
import { PaginationInstance } from 'ngx-pagination/dist/pagination-instance';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  clients = [];
  loader = false;
  p:number = 1;
  public config: PaginationInstance = {
    id: 'server',
    itemsPerPage: 20,
    currentPage: 1  
  };
  constructor(
      private activatedRoute: ActivatedRoute,
      private uiService: UIService,
      private userService: UserService
    ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });


  }

  ngOnInit(): void {
    this.getPage(1);
  }

  getPage(page: number) {
    this.loader = true;
    this.clients = [];
    this.userService.getPage(page).subscribe(
      (res: any) => {
        this.config.totalItems = res.clients.total;
        this.config.itemsPerPage = res.clients.per_page;
        this.p = page;
        this.loader = false;
        this.clients = res.clients.data;
      },
      err => {
        this.loader = false;
      }
    );
  }
  search(searchData){
    this.loader = true;
    this.clients = [];
    let data = searchData.target.value.toLowerCase();
    this.userService.AllClients(data).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.clients = res.clients.data;
        this.loader = false;
      },
      err => {
        console.log('Error ', err);
        this.loader = false;
      }
    );
  }

}
