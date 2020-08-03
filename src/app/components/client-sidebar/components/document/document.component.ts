import { DocumentService } from '../../../../services/document.service';
import { FolderService } from '../../../../services/folder.service';
import { NgForm } from '@angular/forms';
import { Folder } from '../../../../models/folderModel';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix:any;
declare var $:any;
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  folderM:Folder = new Folder();
  foldersAndDocs = {
    folders:[],
    orphan_docs:[]
  };
  folderId;

  submitFolder = false;
  submitDoc = false;

  isProgress:boolean = false;
  progress = {
    width:'',
    complete: false
  };

  filesInFolder = {
    folder:'',
    documents: []
  };

  documentFileList = [];
  @ViewChild('documentFile', {static: false}) documentFile:ElementRef;
  userId: any;

  constructor(private folderService: FolderService, 
    private uiService: UIService,
    private documentService: DocumentService) {
    Notiflix.Notify.Init({
      cssAnimationStyle: 'from-top',
      timeout:3000,
    });
  }

  ngOnInit(): void {
    this.uiService.currentApprovalStageMessage.subscribe(
      (res: any) => {
        let data = JSON.parse(res);
        for (let i = 0; i < data.users.length; i++) { 
          if(data.users[i].windowState === true){
            this.userId = data.users[i].userId;
            this.getFolders(data.users[i].userId);
          }
        }
      },
      err => {
        console.log("Error Occured: ", err);
      }
    )
  }

  getFolders(userId){
    this.folderService.getAllFolders(userId).subscribe((item:any) =>{
      this.foldersAndDocs.folders = item.folders;
      this.folderId = item.folders[0].id;
      this.foldersAndDocs.orphan_docs = item.orphan_docs;
    });
  }

  createFolder(f:NgForm){
    this.submitFolder = true;
    this.folderService.createNewFolder(this.folderM, this.userId).subscribe(
      res =>{
        f.reset();
        $("#createFolder").modal('hide');
        this.submitFolder = false;
        this.ngOnInit();
      },
      err => {
        this.submitFolder = false;
      }
    );
  }
  showFilesFolder(folderId){
    let files = this.foldersAndDocs.folders.find(f => f.id == folderId);
    this.filesInFolder = files;
    this.folderId = folderId;
    this.addActiveClass(folderId);
  }

  viewFolder(folderId){
    $('#showFolder').modal('show');
    let files = this.foldersAndDocs.folders.find(f => f.id == folderId);
    this.filesInFolder = files;
    this.addActiveClass(folderId);
  }

  showfiles(){
    let file = this.documentFile.nativeElement.files;
    this.documentFileList = file;
  }

  uploadDocuments(f:NgForm){
    this.isProgress = true;
    this.submitDoc = true;
    let file = this.documentFile.nativeElement.files;
    var formdata = new FormData();
    for (let i = 0; i < file.length; i++) {
      formdata.append('documents['+i+']', file[i]);
    }
    formdata.append('folder', this.folderId);
    formdata.append('user', this.userId);
    // formdata.append('chat_id', '1234');
    this.documentService.uploadDocument(formdata, this.userId).pipe(
      map(event => {
        switch(event.type){
          case HttpEventType.UploadProgress:
            let progress = Math.round(event.loaded * 100 / event.total);
            this.progress.width = progress+'%';
            this.progress.complete = true;
            break;
          case HttpEventType.Response:
            this.documentFileList = [];
            f.reset()
            this.ngOnInit();
            this.progress.complete = false;
            this.submitDoc = false;
            $("#uploadDocuments").modal('hide');
            Notiflix.Notify.Success('File Uploaded !');
            return event;
        }
      }),
      catchError((error => {
        this.isProgress = false;
        this.submitDoc = false;
        return 'Upload Failed!!!';
      }))
    ).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body);  
          f.reset();
          this.isProgress = false;
        }  
      }
    )
  }

  deleteDocument(document){
    let httpParams = new HttpParams().set('documents', '[' + document.id + ']');
    this.documentService.deleteDocument(httpParams).subscribe(
      res => {
        Notiflix.Notify.Success('File Deleted !');
        this.getFolders(this.userId);

        setTimeout(() => {
           this.showFilesFolder(document.folder_id);
        }, 1000);
       
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
      }
    )
  }

  draggable = {
    data: "myDragData",
    effectAllowed: "all",
    disable: false,
    handle: false,
    class: 'dragging'
  };
  
  onDrop(event:DndDropEvent, folderId) {
    let payload = {
      documents:[event.data],
      folder: folderId
    }
    this.folderService.moveFileToFolder(payload).subscribe(
      res => {
        Notiflix.Notify.Success('File Moved !!!');
        this.ngOnInit();
        this.getFolders(this.userId);

        setTimeout(() => {
           this.showFilesFolder(this.folderId);
        }, 1000);
      },
      err => {
        console.log(err);
      }
    )
  }

  downloadFile(documentId){
    this.documentService.downloadDoc(documentId).subscribe((res: any) => {
      if(res.success == 1){
        console.log(res);
      }
    },
    err => {
      console.log(err);
    }
    )
  }

  addActiveClass(folderId){
    let listItem = document.querySelectorAll('#fileList .list-group-item');
    listItem.forEach(item => item.classList.remove('FolderActive'));

    let folderActive = document.querySelector('#fol_'+folderId);
    folderActive.className += ' FolderActive';
  }
  
}
