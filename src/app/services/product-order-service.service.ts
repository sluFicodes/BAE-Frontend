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
export class ProductOrderService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  public static API_ORDERING: String = environment.PRODUCT_ORDER;
  public static ORDER_LIMIT: Number = environment.ORDER_LIMIT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  postProductOrder(prod:any){
    //POST - El item va en el body de la petición
    let url = `${ProductOrderService.BASE_URL}:${ProductOrderService.API_PORT}${ProductOrderService.API_ORDERING}/productOrder`;
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

  getProductOrders(partyId:any,page:any){
    let url = `${ProductOrderService.BASE_URL}:${ProductOrderService.API_PORT}${ProductOrderService.API_ORDERING}/productOrder?limit=${ProductOrderService.ORDER_LIMIT}&offset=${page}&relatedParty.id=${partyId}&relatedParty.role=Customer`;
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
}
