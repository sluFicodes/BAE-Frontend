import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import {components} from "../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  public static API_NAME: String = environment.PRODUCT_CATALOG;

  constructor(private http: HttpClient) { }

  getProducts() {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOffering`;    

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductsByCategory(ids:Category[]) {
    let id_str='';
    for(let i=0; i<ids.length;i++){
      if(i==ids.length-1){
        id_str = 'category.id='+ids[i].id
      } else {
        id_str = 'category.id='+ids[i].id+'&'
      }
    }
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOffering?${id_str}`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductsByCatalog(catalogId:any){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog/${catalogId}/productOffering?lifecycleStatus=Active,Launched&limit=12`

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductsByCategoryAndCatalog(ids:Category[],catalogId:any) {
    let id_str='';
    for(let i=0; i<ids.length;i++){
      if(i==ids.length-1){
        id_str = 'categoryId='+ids[i].id
      } else {
        id_str = 'categoryId='+ids[i].id+'&'
      }
    }    
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog/${catalogId}/productOffering?lifecycleStatus=Active,Launched&limit=12&${id_str}`;
    console.log(url)

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getProductById(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOffering/${id}`;

    return lastValueFrom(this.http.get<any>(url));
  }

  getProductSpecification(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productSpecification/${id}`;

    return lastValueFrom(this.http.get<any>(url));
  }

  getProductPrice(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOfferingPrice/${id}`
    
    return lastValueFrom(this.http.get<any>(url));
  }

  getCategories(){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/category?limit=100`;

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getCatalogs() {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog`;    

    return lastValueFrom(this.http.get<any[]>(url));
  }

  getCatalog(id:any){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog/${id}`;

    return lastValueFrom(this.http.get<any>(url));
  }

}
