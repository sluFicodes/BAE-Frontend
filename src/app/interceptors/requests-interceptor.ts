import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {LocalStorageService} from "../services/local-storage.service";
import { LoginInfo } from '../models/interfaces';
import * as moment from 'moment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private localStorage: LocalStorageService) { }
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let aux = this.localStorage.getObject('login_items') as LoginInfo;
        if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
            if(aux.logged_as != aux.id){
                const modifiedRequest = request.clone({
                    setHeaders: {
                    'Authorization': 'Bearer '+aux.token,
                    'X-Organization': aux.logged_as
                    },
                });
                return next.handle(modifiedRequest);
            } else {
                const modifiedRequest = request.clone({
                    setHeaders: {
                    'Authorization': 'Bearer '+aux.token,
                    },
                });
                return next.handle(modifiedRequest);
            }            
        } else {
            console.log('not logged')
            return next.handle(request);
        }    
    }
}