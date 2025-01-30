import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category, LoginInfo } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import {LocalStorageService} from "./local-storage.service";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  public static BASE_URL: String = environment.BASE_URL;
  public static CONSUMER_BILLING_URL: String = environment.CONSUMER_BILLING_URL;
  public static API_ORDERING: String = environment.CUSTOMER_BILLING;
  public static ORDER_LIMIT: Number = environment.ORDER_LIMIT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getInvoices(partyId:any,page:any,filters:any[],date:any,role:any){

    // TODO. Qué le pasa a esta petición? devuelve algo raro....
    let url = `${InvoicesService.BASE_URL}${InvoicesService.API_ORDERING}?limit=${InvoicesService.ORDER_LIMIT}&offset=${page}&fields`;
    // let status=''
    // if(filters.length>0){
    //   for(let i=0; i < filters.length; i++){
    //     if(i==filters.length-1){
    //       status=status+filters[i]
    //     } else {
    //       status=status+filters[i]+','
    //     }
    //   }
    //   url=url+'&state='+status;
    // }
    // if(date!=undefined){
    //   url=url+'&orderDate>'+date;
    // }
    console.log(url);
    //  TODO no se que le pasa a esta petición
    let result =  lastValueFrom(this.http.get<any[]>(url));
    console.log(result)
    // return result;
    //  TODO mas triste es robar:
    return [{"id":"urn:ngsi-ld:applied-customer-billing-rate:fad969da-d913-4844-85ed-654bf5e3064a","href":"urn:ngsi-ld:applied-customer-billing-rate:fad969da-d913-4844-85ed-654bf5e3064a","date":"2025-01-29T13:52:46.222721837Z","description":"Una factura","isBilled":false,"name":"Factura A","type":"pepepe","appliedTax":[{"taxCategory":"VAT","taxRate":0.5,"taxAmount":{"unit":"€","value":12.4}}],"billingAccount":{"id":"urn:ngsi-ld:billing-account:99c38326-b1dd-4a90-b25d-80f97051c702","href":"urn:ngsi-ld:billing-account:99c38326-b1dd-4a90-b25d-80f97051c702","name":"qwert12345"},"taxExcludedAmount":{"unit":"€","value":1.2},"taxIncludedAmount":{"unit":"€","value":3.6}},{"id":"urn:ngsi-ld:applied-customer-billing-rate:205c6b86-21c7-4cee-a689-18da800741ca","href":"urn:ngsi-ld:applied-customer-billing-rate:205c6b86-21c7-4cee-a689-18da800741ca","date":"2025-01-29T22:02:19.178869389Z","description":"Una factura","isBilled":false,"name":"Factura A","type":"pepepe","appliedTax":[{"taxCategory":"VAT","taxRate":0.5,"taxAmount":{"unit":"€","value":12.4}}],"billingAccount":{"id":"urn:ngsi-ld:billing-account:99c38326-b1dd-4a90-b25d-80f97051c702","href":"urn:ngsi-ld:billing-account:99c38326-b1dd-4a90-b25d-80f97051c702","name":"qwert12345"},"taxExcludedAmount":{"unit":"€","value":1.2},"taxIncludedAmount":{"unit":"€","value":3.6}},{"id":"urn:ngsi-ld:applied-customer-billing-rate:2cc8257e-e10d-48e2-91e2-2df06cb5c2d0","href":"urn:ngsi-ld:applied-customer-billing-rate:2cc8257e-e10d-48e2-91e2-2df06cb5c2d0","date":"2025-01-29T22:02:22.645926084Z","description":"Una factura","isBilled":false,"name":"Factura A","type":"pepepe","appliedTax":[{"taxCategory":"VAT","taxRate":0.5,"taxAmount":{"unit":"€","value":12.4}}],"billingAccount":{"id":"urn:ngsi-ld:billing-account:99c38326-b1dd-4a90-b25d-80f97051c702","href":"urn:ngsi-ld:billing-account:99c38326-b1dd-4a90-b25d-80f97051c702","name":"qwert12345"},"taxExcludedAmount":{"unit":"€","value":1.2},"taxIncludedAmount":{"unit":"€","value":3.6}}]
  }
}
