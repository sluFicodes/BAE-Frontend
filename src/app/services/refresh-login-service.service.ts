import { Injectable } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import * as moment from 'moment';
import {LocalStorageService} from "./local-storage.service";
import { LoginInfo } from '../models/interfaces';
import { LoginServiceService } from 'src/app/services/login-service.service';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RefreshLoginServiceService {
  private intervalObservable: Observable<number>;
  private intervalSubscription: Subscription | undefined;

  constructor(
    private localStorage: LocalStorageService,
    private api: LoginServiceService,
    private router: Router
    ) {
    //this.intervalObservable = interval(1000); // Default interval duration set to 1000 milliseconds (1 second)
  }

  startInterval(intervalDuration: number, data:any): void {
    this.intervalObservable = interval(intervalDuration);

    console.log('start interval')
    console.log(intervalDuration)

    this.intervalSubscription = this.intervalObservable.subscribe(() => {
      console.log('login subscription')
      console.log(data.expire - moment().unix())
      console.log(data.expire - moment().unix() <= 5)
      console.log((data.expire - moment().unix()) - 5)

      let aux = this.localStorage.getObject('login_items') as LoginInfo;

      console.log('usuario antes')
      console.log(aux)

      this.api.getLogin(aux['token']).then(refreshed => {
        this.stopInterval()

        this.localStorage.setObject('login_items', {
          "id": refreshed.id,
          "user": refreshed.username,
          "email": refreshed.email,
          "token": refreshed.accessToken,
          "expire": refreshed.expire,
          "partyId": aux['partyId'],
          "roles": refreshed.roles,
          "organizations": aux['organizations'],
          "logged_as": aux['logged_as']
        });

        console.log('usuario despues')
        console.log(this.localStorage.getObject('login_items') as LoginInfo)

        // Start the interval only if the token has been really refreshed
        // Otherwise close the session
        if (refreshed.expire > moment().unix() + 4) {
          this.startInterval(((refreshed.expire - moment().unix())-4)*1000, refreshed)
        } else {
          this.stopInterval();
          this.localStorage.setObject('login_items',{});
          this.api.logout().catch((err) => {
            console.log('Something happened')
            console.log(err)
          })

          this.router.navigate(['/dashboard']).then(() => {
            console.log('LOGOUT MADE')
            window.location.reload()
          }).catch((err) => {
            console.log('Something happened router')
            console.log(err)
          })
        }
      })
    });
  }

  stopInterval(): void {
    if (this.intervalSubscription) {
      console.log('stop interval')
      this.intervalSubscription.unsubscribe();
    }
  }
}