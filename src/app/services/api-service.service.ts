import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  getProducts() {
    let url = `http://localhost:8632/productOffering`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductsByCategory(id:any) {
    let url = `http://localhost:8632/productOffering?category=${id}`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductSpecification(id:any) {
    let url = `http://localhost:8632/productSpecification/${id}`;

    return lastValueFrom(this.http.get<any>(url));
  }

  getProductPrice(id:any) {
    let url = `http://localhost:8632/productOfferingPrice/${id}`
    
    return lastValueFrom(this.http.get<any>(url));
  }

  getCategories(){
    let url = `http://localhost:8632/category`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

}
