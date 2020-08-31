import { NotificationService } from './../../services/notification.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix:any;
declare var $:any;
@Component({
  selector: 'app-create-notify',
  templateUrl: './create-notify.component.html',
  styleUrls: ['./create-notify.component.scss']
})
export class CreateNotifyComponent implements OnInit {

  notification = {
    title: '',
    message: '',
    type: 'Article',
    url:'',
    imageUrl:''
  }
  submit = false;

  @ViewChild('photo') photo: ElementRef<HTMLInputElement>;
  originalImage: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private uiService: UIService,
    private router: Router,
    private notificationSer: NotificationService
  ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }

  ngOnInit(): void {
    $.uploadPreview({
      input_field: "#image-upload",   // Default: .image-upload
      preview_box: "#image-preview",  // Default: .image-preview
      label_field: "#image-label",    // Default: .image-label
      label_default: "Choose File",   // Default: Choose File
      label_selected: "Change File",  // Default: Change File
      no_label: false                 // Default: false
    });
  }
  showPreview(file){
    var reader = new FileReader();
    reader.readAsDataURL(file.files[0]); 
    reader.onload = (_event) => { 
      this.originalImage = reader.result.toString(); 
    }
  }
  showPreviewForImageurl(){
    this.originalImage = this.notification.imageUrl;
  }
  createNotif(f: NgForm){
    this.submit = true;
    let formdata = new FormData();
    let file = this.photo.nativeElement.files;

    if(file.length > 0){
      formdata.append("photo", file[0])
    }

    if(this.notification.url){
      formdata.append("url", this.notification.url);
    }

    if(this.notification.imageUrl){
      formdata.append("photo", this.notification.imageUrl);
    }

    console.log(this.notification);

    formdata.append('title', this.notification.title);
    formdata.append('body', this.notification.message || '-');
    formdata.append('type', this.notification.type);

    this.notificationSer.createNotifications(formdata).subscribe((res: any) => {
      if(res.success == 1){
        Notiflix.Notify.Success(res.message);
        this.submit = false;
        f.reset(this.notification);
        this.router.navigateByUrl('/dashboard/notifications');
      }
    }, err =>{
      Notiflix.Notify.Failure(err.error.message);
      this.submit = false;
    });
  }

}
