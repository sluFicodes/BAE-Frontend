import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrVerifierService {

  constructor() { }
  private _intervalId: number | undefined;
  public get intervalId(): number | undefined {
    return this._intervalId;
  }
  private set intervalId(value: number | undefined) {
    this._intervalId = value;
  }
  private fetchServer(thePopup:Window, state:string):void {
          fetch(`${environment.BASE_URL}${environment.pollURL}?state=${state}`).then(
            (response) =>{
            
              if (response.status === 400 || response.status === 500) {
                this.stopChecking(thePopup)
                return
              } else if (response.status === 401) {
                return
              }

              thePopup.close()
              window.location.replace('/dashboard?token=local')
            }
          ).catch((error) => {alert(error)})
  }

  pollServer(qrWindow: Window | null, state:string):void {
    if (qrWindow ==null)
      return
    this.intervalId = window.setInterval(()=>{this.fetchServer(qrWindow, state)}, 1000, qrWindow, state);
    window.setTimeout((popup:Window)=>{this.stopChecking(popup)}, 45000, qrWindow)
  }
  stopChecking(thePopup:Window){
    if(this.intervalId !=undefined){
      if(!thePopup.closed){
        thePopup.close()
      }
      clearInterval(this.intervalId)
      this.intervalId=undefined
    }
  }
  
}
