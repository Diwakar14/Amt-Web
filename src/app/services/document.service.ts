import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  uploadDocument(payload, userId){
    return this.http.post(environment.apiEndPoint + "document", payload, {
      reportProgress: true, observe: 'events'
    });
  }

  downloadDoc(documentId){
    return this.http.get(environment.apiEndPoint + "document/" + documentId, {responseType:'arraybuffer'});
  }

  deleteDocument(folderIds){
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: header, body: folderIds}; // unusual code. try not to send body delete method. 
    return this.http.delete(environment.apiEndPoint + "document", options);
  }
}
