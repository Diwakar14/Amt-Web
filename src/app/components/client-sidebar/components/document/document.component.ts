import { environment } from './../../../../../environments/environment';
import { DocumentService } from '../../../../services/document.service';
import { FolderService } from '../../../../services/folder.service';
import { NgForm } from '@angular/forms';
import { Folder } from '../../../../models/folderModel';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
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
  userId: any;
  documentFileList = [];
  @Input() clientData;
  @ViewChild('documentFile', {static: false}) documentFile:ElementRef;
  @ViewChild('downloadFile', {static: false}) download:ElementRef<HTMLAnchorElement>;
  

  constructor(private folderService: FolderService, 
    private uiService: UIService,
    private documentService: DocumentService) {
    Notiflix.Notify.Init({
      cssAnimationStyle: 'from-top',
      timeout:3000,
    });
  }

  ngOnInit(): void {
    this.userId = this.clientData.clientId;
    this.getFolders(this.userId);
  }

  getFolders(userId){
    this.folderService.getAllFolders(userId).subscribe((item:any) =>{
      this.foldersAndDocs.folders = item.folders;
      this.folderId = item.folders[0].id;
      this.foldersAndDocs.orphan_docs = item.orphan_docs;
    });
  }
  showCreateFolderDialog(){
    $("#createFolder_" + this.clientData.clientId).modal('show');
  }
  createFolder(f:NgForm){
    this.submitFolder = true;
    this.folderService.createNewFolder(this.folderM, this.userId).subscribe(
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
  showFilesFolder(folderId, i){
    let files = this.foldersAndDocs.folders.find(f => f.id == folderId);
    this.filesInFolder = files;
    this.folderId = folderId;
    this.addActiveClass(folderId);
  }

  viewFolder(folderId, i){
    $('#showFolder_' + this.clientData.clientId).modal('show');
    let files = this.foldersAndDocs.folders.find(f => f.id == folderId);
    this.folderService.getAllFolders(this.userId, folderId).subscribe((res: any) => {
      this.filesInFolder = res.folders[i]
    })
    // this.filesInFolder = files;
    this.addActiveClass(folderId);
  }

  showfiles(){
    let file = this.documentFile.nativeElement.files;
    this.documentFileList = file;
  }

  uploadDocumentDialog(){
    $('#uploadDocuments_' + this.clientData.clientId).modal('show');
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
            $("#uploadDocuments_" + this.clientData.clientId).modal('hide');
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
          // console.log(event.body);  
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
           this.showFilesFolder(document.folder_id, 1);
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
           this.showFilesFolder(this.folderId, 1);
        }, 1000);
      },
      err => {
        console.log(err);
      }
    )
  }

  downloadDoc(file){
    console.log(file);
    const link = this.download.nativeElement;
    link.href = environment.apiEndPoint + "document/" + file.id;
    link.download = file.name;
    link.click();
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
  
}
