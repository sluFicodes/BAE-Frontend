import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  faCartShopping,
  faHandHoldingBox,
  faAddressCard,
  faArrowRightFromBracket
} from "@fortawesome/sharp-solid-svg-icons";
import { Router } from '@angular/router';

@Component({
  selector: 'bae-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {


  constructor(private router: Router,) {

  }

  goTo(path:string) {
    this.router.navigate([path]);
  }
}
