import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Observable, tap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 // Inject dependencies as you need
  constructor(private route: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
        
    return next.handle(req).pipe(
      tap((resp) => {
        if (resp instanceof HttpResponse) {
          if (resp.status === 302) {
            // here you can implement your logic, or simply redirect as below
            //this.route.navigate(['/someroute']);
            console.log('FUNCIONA INTERCEPTOR')
          }
        }
      }),
       
    );
  }
}