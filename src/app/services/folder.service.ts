import { environment } from './../../environments/environment';
import { Folder } from './../models/folderModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  getAllFolders(userId, folderId?: any){
    return this.http.get(environment.apiEndPoint + "document?user="+userId+"&group_by=folder&folder=" + folderId);
  }
  createNewFolder(folder:Folder, userId){
    return this.http.post(environment.apiEndPoint + "folders/" + userId, folder);
  }

  moveFileToFolder(payload){
    return this.http.put(environment.apiEndPoint + "document/folder", payload);
  }
}
