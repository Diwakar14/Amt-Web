import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  addNotes(notes){
    return this.http.post(environment.apiEndPoint + 'notes', notes)
  }
  getNotes(ticketId){
    return this.http.get(environment.apiEndPoint + 'user_service/'+ticketId+'/notes')
  }
}
