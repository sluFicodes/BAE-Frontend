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
export class LoginServiceService {
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getLogin(token:any){
    let url = `${LoginServiceService.BASE_URL}:${LoginServiceService.API_PORT}/logintoken`;

    let header = {}

    // Adding the local token options for reading the profile
    // from session when the portal is served from proxy nodejs
    if (token != 'local') {
      header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer `+ token)
      }
    }

    return lastValueFrom(this.http.get<any>(url, header));
  }

  doLogin(){
    let url = `${LoginServiceService.BASE_URL}:${LoginServiceService.API_PORT}/login`;
    console.log('-- login --')
    this.http
    .get<any>(url,{observe:"response"})
    .subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
    })

  }
}
