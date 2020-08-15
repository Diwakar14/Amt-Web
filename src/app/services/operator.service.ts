import { Operator } from './../models/operatorModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(private http: HttpClient) { }

  AllOperator(){
    return this.http.get(environment.apiEndPoint + "users");
  }
  createOperator(operator: Operator){
    return this.http.post(environment.apiEndPoint + "users", operator);
  }
  updateOperator(operator: any, id){
    return this.http.put(environment.apiEndPoint + "users/" + id, operator);
  }
}
