import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  uploadDocument(payload, userId){
    return this.http.post("http://54.186.217.203:5009/documents/"+userId, payload, {
      reportProgress: true, observe: 'events'
    });
  }

  deleteDocument(folderId){
    return this.http.delete("http://54.186.217.203:5009/documents/" + folderId);
  }
}
