import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }


  // category
  createServiceCategory(serviceCategory){
    return this.http.post(environment.apiEndPoint + 'category', serviceCategory);
  }
  getServiceCategory(){
    return this.http.get(environment.apiEndPoint + 'category');
  }
  updateServiceCategory(categoryId: number, serviceCategory){
    return this.http.put(environment.apiEndPoint + 'category/' + categoryId, serviceCategory);
  }
  deleteServiceCategory(categoryId: number){
    return this.http.delete(environment.apiEndPoint + 'category/' + categoryId);
  }

  // service
  createService(service){
    return this.http.post(environment.apiEndPoint + 'services', service);
  }

  getService(groupBy?:string){
    return this.http.get(environment.apiEndPoint + 'services?group_by=' + groupBy);
  }
  
  getServiceDetail(serviceId: number){
    return this.http.get(environment.apiEndPoint + 'services/' + serviceId);
  }
  updateService(serviceId: number, service){
    return this.http.put(environment.apiEndPoint + 'services/' + serviceId, service);
  }
  deleteService(serviceId: number,){
    return this.http.delete(environment.apiEndPoint + 'services/' + serviceId);
  }

  // Payment
  getPaymentList(userId: number){
    return this.http.get(environment.apiEndPoint + 'payments/' + userId)
  }

  createPayment(payment){
    return this.http.post(environment.apiEndPoint + 'payments', payment);
  }


}
