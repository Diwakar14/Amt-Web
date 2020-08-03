import { UserService } from './../../services/user.service';
import { UIService } from './../../services/ui.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  isExpanded = false;
  clients = [];
  filteredClients = [];
  userOnlinelist = [];
  loader = true;
  usersList;
  constructor(private uiService: UIService, private userService: UserService) {
    this.uiService.currentApprovalStageMessage.subscribe(
      (res:any) => {
        this.usersList = res;
      }
    )
  }
  ngAfterViewInit(): void {
    $(".chatList-item").click(function(){
      $(".chatList-item").removeClass("chatActive");
      $(this).addClass("chatActive");
    });
  }
  
  ngOnInit(): void {
    this.loader = true;
    
    this.userService.AllClients('').subscribe(
      (res:any) => {
        if(res.success == 1){
          this.filteredClients = res.clients.data;
          this.loader = false;
        }
      },
      err => {
        console.log('Error ', err);
        this.loader = false;
      }
    );
  }

  search(searchData){
    this.loader = true;
    this.filteredClients = [];
    let data = searchData.target.value.toLowerCase();
    this.userService.AllClients(data).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.filteredClients = res.clients.data;
        this.loader = false;
      },
      err => {
        console.log('Error ', err);
        this.loader = false;
      }
    );
  }

  userDetails(user){
    let userObj = {
      userId:''+user.id+'',
      windowState: true,
      name:''+user.name+'',
      email: '' + user.email + '',
      phone: '' + user.phone + ''
    }
    let parsedList = JSON.parse(this.usersList);   
    this.userOnlinelist = parsedList.users;

    let finduser = parsedList.users.find(m => parseInt(m.userId) === parseInt(userObj.userId));
    this.closeAllboxes();

    if(!finduser){
      this.userOnlinelist.push(userObj);
      this.uiService.updateApprovalMessage({
        users: this.userOnlinelist
      });
    }else{
      this.closeAllboxes();
      this.uiService.updateApprovalMessage({
        users: this.userOnlinelist
      });
    }
  }

  closeAllboxes(){
    if(this.userOnlinelist.length > 0) {
      this.userOnlinelist.forEach(ele => {
        ele.windowState = false
      });
    }
  }

}
