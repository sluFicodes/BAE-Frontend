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
export class AccountServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  public static API_ACCOUNT: String = environment.ACCOUNT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getBillingAccount(){
    let url = `${AccountServiceService.BASE_URL}:${AccountServiceService.API_PORT}${AccountServiceService.API_ACCOUNT}/billingAccount/`;
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

  postBillingAccount(item:any){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    let url = `${AccountServiceService.BASE_URL}:${AccountServiceService.API_PORT}${AccountServiceService.API_ACCOUNT}/billingAccount/`;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.post<any>(url, item, header);
    } else {
      return this.http.post<any>(url, item);
    }
  }

  updateBillingAccount(id:any,item:any){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    let url = `${AccountServiceService.BASE_URL}:${AccountServiceService.API_PORT}${AccountServiceService.API_ACCOUNT}/billingAccount/${id}`;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.patch<any>(url, item, header);
    } else {
      return this.http.patch<any>(url, item);
    }
  }

  deleteBillingAccount(id:any){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    let url = `${AccountServiceService.BASE_URL}:${AccountServiceService.API_PORT}${AccountServiceService.API_ACCOUNT}/billingAccount/${id}`;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+aux.token)
      }
      return this.http.delete<any>(url, header);
    } else {
      return this.http.delete<any>(url);
    }
  }

  getUserInfo(partyId:any){
    let url = `${AccountServiceService.BASE_URL}:${AccountServiceService.API_PORT}/party/individual/${partyId}`;
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
