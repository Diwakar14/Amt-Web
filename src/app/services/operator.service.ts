import { Operator } from './../models/operatorModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(private http: HttpClient) { }

  createOperator(operator: Operator){
    return this.http.post("http://54.186.217.203:5009/users", operator);
  }
}
