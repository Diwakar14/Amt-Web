import { LocalFolder } from './../../../../models/folderModel';
import { environment } from './../../../../../environments/environment';
import { DocumentService } from '../../../../services/document.service';
import { FolderService } from '../../../../services/folder.service';
import { NgForm } from '@angular/forms';
import { Folder } from '../../../../models/folderModel';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { map, catchError, delay } from 'rxjs/operators';
import { UIService } from 'src/app/services/ui.service';

import * as jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
declare var Notiflix:any;
declare var $:any;



@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  

  folderM:Folder = new Folder();
  foldersAndDocs: LocalFolder = new LocalFolder();
  folderId;

  submitFolder = false;
  submitDoc = false;
  loaderFiles = false;

  isProgress:boolean = false;
  progress = {
    width:'',
    complete: false
  };

  filesInFolder = {
    folder:'',
    documents: []
  };
  userId: any;
  documentFileList = [];
  multipleDocuments = [];
  folderToMoveIn: any;
  deleteDisable: boolean = false;
  role: any;
  @Input() clientData;
  @ViewChild('documentFile', {static: false}) documentFile:ElementRef;
  @ViewChild('downloadFile', {static: false}) download:ElementRef<HTMLAnchorElement>;
  disabledFileMove: boolean;
  disableFolderDelete: boolean;
  
  

  constructor(private folderService: FolderService, 
    private uiService: UIService,
    private cookie: CookieService,
    private documentService: DocumentService) {
    Notiflix.Notify.Init({
      cssAnimationStyle: 'from-top',
      timeout:3000,
    });
  }

  ngOnInit(): void {
    this.userId = this.clientData.clientId;
    this.getFolders(this.userId);
    this.role = jwt_decode(this.cookie.get('auth_token')).allowed[0];
  }

  getFolders(userId){
    this.folderService.getAllFolders(userId)
    .subscribe((item:any) =>{
      console.log(item);
      this.foldersAndDocs.folders = item.folders;
      this.folderId = item.folders[0].id;
      this.folderToMoveIn = this.folderId;
    });
  }
  showCreateFolderDialog(){
    $("#createFolder_" + this.clientData.clientId).modal('show');
  }
  createFolder(f:NgForm){
    this.submitFolder = true;
    this.folderM.user = this.userId;
    this.folderService.createNewFolder(this.folderM).subscribe(
      res =>{
        f.reset();
        $("#createFolder_" + this.clientData.clientId).modal('hide');
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
    console.log(files);
    this.filesInFolder = files;
    this.folderId = folderId;
    this.addActiveClass(folderId);
    this.multipleDocuments = [];
  }

  viewFolder(folderId, i){
    this.loaderFiles = true;
    $('#showFolder_' + this.clientData.clientId).modal('show');
    this.folderService.getAllFolders(this.userId, folderId).subscribe((res: any) => {
      this.filesInFolder = res.folders[i];
      this.folderId = res.folders[i].id;
      this.loaderFiles = false;
    }, err=>{
      this.loaderFiles = false;
    })
    this.addActiveClass(folderId);
  }

  showfiles(){
    this.documentFileList = [];
    let file = this.documentFile.nativeElement.files;
    this.documentFileList = file;
  }

  selectDocToDel(file, index){
    let findDoc = this.multipleDocuments.findIndex(item => item == file.id);
    if(findDoc >= 0){
      this.multipleDocuments.splice(findDoc, 1);
      document.querySelector("#file_"+ index).classList.remove('cardbg');
    }else{
      this.multipleDocuments.push(file.id);
      document.querySelector("#file_"+ index).classList.add('cardbg');
    }
  }
  
  uploadDocumentDialog(){
    $('#uploadDocuments_' + this.clientData.clientId).modal('show');
    this.documentFile.nativeElement.files = null;
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
    this.documentService.uploadDocument(formdata, this.userId).pipe(
      map((event: any) => {
        switch(event.type){
          case HttpEventType.UploadProgress:
            let progress = Math.round(event.loaded * 100 / event.total);
            this.progress.width = progress+'%';
            this.progress.complete = true;
            break;
          case HttpEventType.Response:
            for (let i = 0; i < this.documentFileList.length; i++) {
              let index = this.foldersAndDocs.folders.findIndex(ele => ele.id == this.folderId);
              this.foldersAndDocs.folders[index].documents.push(event.body.documents[i]);
              this.filesInFolder.documents.push(event.body.documents[i]);
            }
            this.documentFileList = [];
            this.progress.complete = false;
            this.submitDoc = false;
            Notiflix.Notify.Success('File Uploaded.');
            $("#uploadDocuments_" + this.clientData.clientId).modal('hide');
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
          this.isProgress = false;
        }  
      }
    )
  }

  confirmDelete(folderId){
    $("#confirmDeleteFolder_" + this.clientData.clientId).modal('show');
    this.folderId = folderId;
  }

  deleteFolder(){
    this.disableFolderDelete = true;
    this.folderService.deleteFolder(this.folderId).subscribe((res: any) => {
      Notiflix.Notify.Success('Folder Deleted.');
      this.disableFolderDelete = false;
      let deletedID = this.foldersAndDocs.folders.findIndex(item => item.id == this.folderId);
      this.foldersAndDocs.folders.splice(deletedID, 1);
      $("#confirmDeleteFolder_" + this.clientData.clientId).modal('hide');
    }, err => {
      Notiflix.Notify.Failure('Folder Delete Failed.');
      this.disableFolderDelete = false;
    })
  }

  deleteDocuments(document?: any, i?: any){
    
    let data:any = {};
    if(document && document.id){
      data.documents = [document.id]
    }else{
      this.deleteDisable = true;
      data.documents = this.multipleDocuments
    }
    
    this.documentService.deleteDocument(data).subscribe(
      res => {
        Notiflix.Notify.Success('File Deleted.');
        this.deleteDisable = false;
        if(document.id){
          let folIndex = this.foldersAndDocs.folders.findIndex(item => item.id == this.folderId);
          this.foldersAndDocs.folders[folIndex].documents.splice(i, 1);

          // this.filesInFolder.documents.splice(i, 1);
          console.log('Delete Single', this.multipleDocuments);
        }else{
          this.multipleDocuments.map(item => {
            let index = this.filesInFolder.documents.findIndex(doc => doc.id == item);
            this.filesInFolder.documents.splice(index, 1);
  
            let folIndex = this.foldersAndDocs.folders.findIndex(item => item.id == this.folderId);
            this.foldersAndDocs.folders[folIndex].documents.splice(index, 1);
          });
          console.log("Deleteing multiple", this.multipleDocuments);
        }
        
        this.multipleDocuments = [];
        this.reset();
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.deleteDisable = false;
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
        Notiflix.Notify.Success('File Moved.');
        let index = this.filesInFolder.documents.findIndex(doc => doc.id == event.data);
        let document = this.filesInFolder.documents.find(doc => doc.id == event.data);
        this.filesInFolder.documents.splice(index, 1);

        let targetFolderIndex = this.foldersAndDocs.folders.findIndex(item => item.id == folderId);
        this.foldersAndDocs.folders[targetFolderIndex].documents.push(document);

      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
      }
    )
  }
  moveMultiple(){
    this.disabledFileMove = true;
    let payload = {
      documents: this.multipleDocuments,
      folder: this.folderToMoveIn
    }
    this.folderService.moveFileToFolder(payload).subscribe(
      res => {
        Notiflix.Notify.Success('File Moved.');
        this.disabledFileMove = false;

        this.multipleDocuments.map(item => {
          let index = this.filesInFolder.documents.findIndex(doc => doc.id == item);
          let document = this.filesInFolder.documents.find(doc => doc.id == item);
          this.filesInFolder.documents.splice(index, 1);

          let targetFolderIndex = this.foldersAndDocs.folders.findIndex(item => item.id == this.folderToMoveIn);
          this.foldersAndDocs.folders[targetFolderIndex].documents.push(document);
        });
        this.multipleDocuments = [];
        this.reset();
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.disabledFileMove = false;
      }
    )
  }
  downloadDoc(file){
    this.documentService.downloadDoc(file.id).subscribe((res: any) => {
      this.downLoadFile(res, file.type, file.name);
    });
  }
  private downLoadFile(data: any, type: string, filename: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);

    const link = this.download.nativeElement;
    link.href = url;
    link.download = filename;
    link.click();
  }
  reload(){
    this.ngOnInit();
  }

  addActiveClass(folderId){
    let listItem = document.querySelectorAll('#fileList .list-group-item');
    listItem.forEach(item => item.classList.remove('FolderActive'));

    let folderActive = document.querySelector('#fol_'+folderId);
    folderActive.className += ' FolderActive';
  }
  reset(){
    let listItem = document.querySelectorAll('.card');
    let checkbox = document.querySelectorAll('input[name=multipleSelectCardCheckbox]');

    listItem.forEach(item => item.classList.remove('cardbg'));
    checkbox.forEach((item: any) => item.checked = false);
  }
}
