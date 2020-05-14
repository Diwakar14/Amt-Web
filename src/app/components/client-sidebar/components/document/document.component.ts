import { DocumentService } from '../../../../services/document.service';
import { FolderService } from '../../../../services/folder.service';
import { NgForm } from '@angular/forms';
import { Folder } from '../../../../models/folderModel';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { HttpEventType } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
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

  constructor(private folderService: FolderService, private documentService: DocumentService) {
    Notiflix.Notify.Init({
      cssAnimationStyle: 'from-top',
      timeout:3000,
    });
  }

  ngOnInit(): void {
    this.folderService.getAllFolders(1).subscribe((item:any) =>{
      this.foldersAndDocs = item;
    });
  }

  createFolder(f:NgForm){
    this.folderService.createNewFolder(this.folderM, 1).subscribe(
      res =>{
        f.reset();
        $("#createFolder").modal('hide');
        this.ngOnInit();
      }
    );
  }
  showFilesFolder(folderId){
    this.addActiveClass(folderId);
    let files = this.foldersAndDocs.folders.find(f => f.id == folderId);
    this.filesInFolder = files;
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
    let file = this.documentFile.nativeElement.files;
    var formdata = new FormData();
    for (let i = 0; i < file.length; i++) {
      formdata.append('documents['+i+']', file[i]);
    }
    formdata.append('folder', this.folderId);
    formdata.append('chat_id', '1234');
    this.documentService.uploadDocument(formdata, 1).pipe(
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
            Notiflix.Notify.Success('File Uploaded !');
            return event;
        }
      }),
      catchError((error => {
        this.isProgress = false;
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

  deleteDocument(folderId){
    this.documentService.deleteDocument(folderId).subscribe(
      res => {
        Notiflix.Notify.Success('File Deleted !');
        this.ngOnInit();
        this.showFilesFolder(folderId);
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
        this.showFilesFolder(folderId);
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
