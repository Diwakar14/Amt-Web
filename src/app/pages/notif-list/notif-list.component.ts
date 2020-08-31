import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix: any;
@Component({
  selector: 'app-notif-list',
  templateUrl: './notif-list.component.html',
  styleUrls: ['./notif-list.component.scss']
})
export class NotifListComponent implements OnInit {

  notifList = [];
  notification = {
    type: 'Article'
  }
  loading = false;
  constructor(private notificationSer: NotificationService,
    private activatedRoute: ActivatedRoute,
    private uiService: UIService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
    this.getNotif('Article');
  }

  getNotif(type){
    this.loading = true;
    this.notificationSer.getNotifications(type).subscribe((res: any) => {
      if(res.success == 1){
        this.loading = false;
        this.notifList = res.notifications;
      }
    }, err => {
      this.loading = false;
      this.notifList = [];
    });
  }

  deleteNotification(id, i){
    this.delLoading(i);
    this.notificationSer.deleteNotifications(id).subscribe((res: any) => {
      if(res.success == 1){
        Notiflix.Notify.Success(res.message);
        this.ngOnInit();
      }
    }, err => {
      Notiflix.Notify.Failure(err.error.message);
    });
  }

  delLoading(i){
    document.querySelector('#del_notif_' + i).setAttribute('style', 'display:none');
    document.querySelector('#del_notif_load_' + i).setAttribute('style', 'display:initial;filter:invert(1)');
  }

  changeType(type){
    this.getNotif(type);
  }

}
