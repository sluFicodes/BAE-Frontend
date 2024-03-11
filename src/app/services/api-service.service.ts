import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category, LoginInfo } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import {components} from "../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import {LocalStorageService} from "./local-storage.service";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  public static API_PRODUCT: String = environment.PRODUCT_CATALOG;
  public static API_ACCOUNT: String = environment.ACCOUNT;
  public static PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;
  public static CATALOG_LIMIT: number= environment.CATALOG_LIMIT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getProducts(page:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/productOffering?limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}&lifecycleStatus=Launched`;    

    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }

  getProductsByCategory(ids:Category[],page:any) {
    let id_str='';
    for(let i = 0; i < ids.length; i++){
      if(i == 0){
        id_str = 'category.id=' + ids[i].id
      } else {
        id_str = id_str + ',' + ids[i].id
      }
    }

    const baseUrl = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/productOffering`;
    const query = `limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}&lifecycleStatus=Launched`;

    // Add the ID string only when some categories are selected
    let url;
    if (id_str !== '') {
      url = `${baseUrl}?${id_str}&${query}`;
    } else {
      url = `${baseUrl}?${query}`
    }

    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }

  getProductsByCatalog(catalogId:any,page:any){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/catalog/${catalogId}/productOffering?lifecycleStatus=Launched&limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}`
    console.log(url)
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }

  getProductsByCategoryAndCatalog(ids:Category[],catalogId:any,page:any) {
    let id_str='';
    for(let i=0; i<ids.length;i++){
      if(i==0){
        id_str = 'category.id='+ids[i].id
      } else {
        id_str = id_str+','+ids[i].id
      }
    }    
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/catalog/${catalogId}/productOffering?lifecycleStatus=Launched&${id_str}&limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}`;

    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }

  getProductById(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/productOffering/${id}`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    }
  }

  getProductSpecification(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/productSpecification/${id}`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    }
  }

  getProductPrice(id:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/productOfferingPrice/${id}`
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    }
  }

  getCategories(){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/category?limit=100`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }

  getCatalogs(page:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/catalog?limit=${ApiServiceService.CATALOG_LIMIT}&offset=${page}`;    
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    }
  }

  getCatalog(id:any){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_PRODUCT}/catalog/${id}`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    } 
  }

  getLogin(token:any){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/logintoken`;
    //let response = this.http.get<any>(url)
    //console.log(response)
    //this.http.get<any>("http://localhost:8004/logintoken", { withCredentials: true })
    //this.http.get(url, { withCredentials: true }).subscribe(resp => console.log(resp))

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer `+token)
    }

    return lastValueFrom(this.http.get<any>(url, header));
  }

  doLogin(){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/login`;
    console.log('-- login --')
    this.http
    .get<any>(url,{observe:"response"})
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
  })
    //return this.http.get<any>(url, {observe: 'response', withCredentials: true });

  }

  getShoppingCart(){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/shoppingCart/item/`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      console.log('--- get shopping cart ---')
      console.log(header)
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }
  addItemShoppingCart(item:any){
    console.log('adding to cart')
    console.log(item)
    //POST - El item va en el body de la petición
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/shoppingCart/item/`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      console.log('logged')
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.post<any>(url, item, header);
    } else {
      return this.http.post<any>(url, item);
    }    
  }

  removeItemShoppingCart(id:any){
    //DELETE
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/shoppingCart/item/${id}`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      console.log('logged')
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.delete<any>(url, header);
    } else {
      return this.http.delete<any>(url);
    }
  }

  getBillingAccount(){
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_ACCOUNT}/billingAccount/`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      console.log('--- get shopping cart ---')
      console.log(header)
      return lastValueFrom(this.http.get<any[]>(url,header));
    } else {
      return lastValueFrom(this.http.get<any[]>(url));
    }
  }

  emptyShoppingCart(){
    console.log('removing cart')
    //POST - El item va en el body de la petición
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/shoppingCart/empty/`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    console.log(aux)
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      console.log('logged')
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.post<any>(url, {}, header);
    } else {
      return this.http.post<any>(url, {});
    }    
  }

  postProductOrder(prod:any){
    //POST - El item va en el body de la petición
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/ordering/productOrder`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.post<any>(url, prod, header);
    } else {
      return this.http.post<any>(url, prod);
    }    
  }

  getServiceSpec(id:any){    
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/service/serviceSpecification/${id}`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    } 
  }

  getResourceSpec(id:any){    
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}/resource/resourceSpecification/${id}`;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return lastValueFrom(this.http.get<any>(url,header));
    } else {
      return lastValueFrom(this.http.get<any>(url));
    } 
  }
}
