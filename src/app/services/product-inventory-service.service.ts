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
export class ProductInventoryServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_INVENTORY: String = environment.INVENTORY;
  public static INVENTORY_LIMIT: number = environment.INVENTORY_LIMIT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getInventory(page:any,id:any,filters:any[],keywords:any) {
    let url = `${ProductInventoryServiceService.BASE_URL}${ProductInventoryServiceService.API_INVENTORY}/product?limit=${ProductInventoryServiceService.INVENTORY_LIMIT}&offset=${page}&relatedParty.id=${id}`
    let status=''
    if(filters.length>0){
      for(let i=0; i < filters.length; i++){
        if(i==filters.length-1){
          status=status+filters[i]
        } else {
          status=status+filters[i]+','
        }    
      }
      url=url+'&status='+status;
    }
    if(keywords!=undefined){
      url=url+'&body='+keywords
    }
    return lastValueFrom(this.http.get<any[]>(url));
  }

  updateProduct(product:any,id:any){
    let url = `${ProductInventoryServiceService.BASE_URL}${ProductInventoryServiceService.API_INVENTORY}/product/${id}`;   
    return this.http.patch<any>(url, product);
  }
  
}
