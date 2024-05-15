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
  public static API_CART: String = environment.SHOPPING_CART;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }


  getShoppingCart(){
    let url = `${ShoppingCartServiceService.BASE_URL}${ShoppingCartServiceService.API_CART}/item/`;

    return lastValueFrom(this.http.get<any[]>(url));
  }
  addItemShoppingCart(item:any){
    console.log('adding to cart')
    console.log(item)
    //POST - El item va en el body de la petición
    let url = `${ShoppingCartServiceService.BASE_URL}${ShoppingCartServiceService.API_CART}/item/`;
   
    return this.http.post<any>(url, item);
  }

  removeItemShoppingCart(id:any){
    //DELETE
    let url = `${ShoppingCartServiceService.BASE_URL}${ShoppingCartServiceService.API_CART}/item/${id}`;

    return this.http.delete<any>(url);
  }

  emptyShoppingCart(){
    console.log('removing cart')
    //POST - El item va en el body de la petición
    let url = `${ShoppingCartServiceService.BASE_URL}${ShoppingCartServiceService.API_CART}/empty/`;
  
    return this.http.post<any>(url, {});  
  }
}
