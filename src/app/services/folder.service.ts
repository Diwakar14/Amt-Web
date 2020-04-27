import { Folder } from './../models/folderModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  getAllFolders(userId){
    return this.http.get("http://54.186.217.203:5009/documents/"+userId+"?group_by=folder");
  }
  createNewFolder(folder:Folder, userId){
    return this.http.post("http://54.186.217.203:5009/folders/" + userId, folder);
  }

  moveFileToFolder(payload){
    return this.http.put("http://54.186.217.203:5009/documents/folder/move", payload);
  }
}
