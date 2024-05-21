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
                window.location.replace('/')
                return
              } else if (response.status === 401) {
                return
              }
              this.stopChecking()
              thePopup.close()
              window.location.replace('/dashboard?token=local')
            }
          ).catch((error) => {alert(error)})
  }

  pollServer(qrWindow: Window | null, state:string):void{
    if (qrWindow ==null)
      return
    this.intervalId = window.setInterval(this.fetchServer, 1000, qrWindow, state);
    window.setTimeout(this.stopChecking, 450000)
  }
  private stopChecking(){
    
    if(this.intervalId !=undefined){
      clearInterval(this.intervalId)
      this.intervalId=undefined
    }
  }
  
}
