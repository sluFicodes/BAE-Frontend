import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrVerifierService {

  constructor() { }
  pollServer(thePopup:Window, router:Router, state:string):void {
          fetch(`${environment.BASE_URL}${environment.pollURL}?state=${state}`).then(
            (response) =>{
            
              if (response.status === 400 || response.status === 500) {
                router.navigate(['/'])
                return
              } else if (response.status === 401) {
                return
              }
              thePopup.close()
              router.navigate(['/token=local'])
            }
          ).catch((error) => {alert(error)})
  }
  
}
