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
export class ShoppingCartServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  public static API_CART: String = environment.SHOPPING_CART;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }


  getShoppingCart(){
    let url = `${ShoppingCartServiceService.BASE_URL}:${ShoppingCartServiceService.API_PORT}${ShoppingCartServiceService.API_CART}/item/`;
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
    let url = `${ShoppingCartServiceService.BASE_URL}:${ShoppingCartServiceService.API_PORT}${ShoppingCartServiceService.API_CART}/item/`;
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
    let url = `${ShoppingCartServiceService.BASE_URL}:${ShoppingCartServiceService.API_PORT}${ShoppingCartServiceService.API_CART}/item/${id}`;
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

  emptyShoppingCart(){
    console.log('removing cart')
    //POST - El item va en el body de la petición
    let url = `${ShoppingCartServiceService.BASE_URL}:${ShoppingCartServiceService.API_PORT}${ShoppingCartServiceService.API_CART}/empty/`;
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
}
