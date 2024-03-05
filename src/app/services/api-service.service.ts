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
  public static API_NAME: String = environment.PRODUCT_CATALOG;
  public static PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;
  public static CATALOG_LIMIT: number= environment.CATALOG_LIMIT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getProducts(page:any) {
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOffering?limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}`;    

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
    for(let i=0; i<ids.length;i++){
      if(i==0){
        id_str = 'category.id='+ids[i].id
      } else {
        id_str = id_str+','+ids[i].id
      }
    }
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOffering?${id_str}&limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}`;

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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog/${catalogId}/productOffering?lifecycleStatus=Active,Launched&limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}`
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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog/${catalogId}/productOffering?lifecycleStatus=Active,Launched&${id_str}&limit=${ApiServiceService.PRODUCT_LIMIT}&offset=${page}`;

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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOffering/${id}`;
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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productSpecification/${id}`;
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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/productOfferingPrice/${id}`
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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/category?limit=100`;
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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog?limit=${ApiServiceService.CATALOG_LIMIT}&offset=${page}`;    
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
    let url = `${ApiServiceService.BASE_URL}:${ApiServiceService.API_PORT}${ApiServiceService.API_NAME}/catalog/${id}`;
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
/*
app.get(config.shoppingCartPath + '/item/', shoppingCart.getCart);
app.post(config.shoppingCartPath + '/item/', shoppingCart.add);
app.get(config.shoppingCartPath + '/item/:id', shoppingCart.getItem);
app.delete(config.shoppingCartPath + '/item/:id', shoppingCart.remove);
app.post(config.shoppingCartPath + '/empty', shoppingCart.empty);
*/
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
}
