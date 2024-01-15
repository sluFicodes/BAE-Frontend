import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category } from '../models/interfaces';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;

  constructor(private http: HttpClient) { }

  getProducts() {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/productOffering`;    

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductsByCategory(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/productOffering?category=${id}`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductById(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/productOffering/${id}`;

    return lastValueFrom(this.http.get<any>(url));
  }

  getProductSpecification(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/productSpecification/${id}`;

    return lastValueFrom(this.http.get<any>(url));
  }

  getProductPrice(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/productOfferingPrice/${id}`
    
    return lastValueFrom(this.http.get<any>(url));
  }

  getCategories(){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/category`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

}
