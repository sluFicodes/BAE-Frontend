import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  faCartShopping,
  faHandHoldingBox,
  faAddressCard,
  faArrowRightFromBracket,  
} from "@fortawesome/sharp-solid-svg-icons";
import { faLinkedin, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'bae-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  protected readonly faLinkedin = faLinkedin;
  protected readonly faYoutube = faYoutube;
  protected readonly faXTwitter = faXTwitter;
  protected readonly DOME_LINKEDIN = environment.DOME_LINKEDIN;
  protected readonly DOME_YOUTUBE = environment.DOME_YOUTUBE;
  protected readonly DOME_X = environment.DOME_X;

  constructor(private router: Router,) {

  }

  goTo(path:string) {
    this.router.navigate([path]);
  }

  open(path:string){
    window.open(path, '_blank');
  }
}
