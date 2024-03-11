import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, HostListener} from '@angular/core';
import {
  faCartShopping,
  faHandHoldingBox,
  faAddressCard,
  faArrowRightFromBracket
} from "@fortawesome/sharp-solid-svg-icons";
import {LocalStorageService} from "../../services/local-storage.service";
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Router } from '@angular/router';
import {EventMessageService} from "../../services/event-message.service";
import { environment } from 'src/environments/environment';
import { LoginInfo } from 'src/app/models/interfaces';
import { interval, Subscription} from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'bae-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('theme_toggle_dark_icon') themeToggleDarkIcon: ElementRef;
  @ViewChild('theme_toggle_light_icon') themeToggleLightIcon: ElementRef;

  constructor(themeToggleDarkIcon: ElementRef,
              themeToggleLightIcon: ElementRef,
              private localStorage: LocalStorageService,
              private api: ApiServiceService,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private eventMessage: EventMessageService,
              private router: Router) {

    this.themeToggleDarkIcon = themeToggleDarkIcon;
    this.themeToggleLightIcon = themeToggleLightIcon;
  }

  catalogs: any[] | undefined  = [];
  showCart:boolean=false;
  is_logged:boolean=false;
  showLogin:boolean=false;
  username:string='';
  email:string='';
  usercharacters:string='';
  loginSubscription: Subscription = new Subscription();
  loginUrl:string = `${environment.BASE_URL}:${environment.API_PORT}` + (environment.SIOP ? '/login/vc' : '/login');

  @HostListener('document:click')
  onClick() {
    if(this.showCart==true){
      this.showCart=false;
      this.cdr.detectChanges();
    }     
  }

  async ngOnInit(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      this.is_logged=true;
      this.username=aux.user;
      this.usercharacters=(aux.user.slice(0, 2)).toUpperCase();
      this.email=aux.email;
      this.cdr.detectChanges();
    }
    
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'ToggleCartDrawer') {
        this.showCart=false;
        this.cdr.detectChanges();
      }
    })

    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'LoginProcess') {
        let aux = this.localStorage.getObject('login_items') as LoginInfo;
        if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
          this.is_logged=true;
          this.username=aux.user;
          this.usercharacters=(aux.user.slice(0, 2)).toUpperCase();
          this.email=aux.email;          
          this.cdr.detectChanges();
        }
      }
    })
  }

  ngAfterViewInit() {
    initFlowbite();
    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.themeToggleLightIcon.nativeElement.classList.remove('hidden');
    } else {
      this.themeToggleDarkIcon.nativeElement.classList.remove('hidden');
    }

  }
  toggleDarkMode() {
    // toggle icons inside button
    this.themeToggleDarkIcon.nativeElement.classList.toggle('hidden');
    this.themeToggleLightIcon.nativeElement.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  }

  goToCatalogSearch(id:any) {
    this.router.navigate(['/search/catalog', id]);
  }

  goTo(path:string) {
    this.router.navigate([path]);
  }

  toggleCartDrawer(){
    this.showCart=!this.showCart;
    this.cdr.detectChanges();    
  }

  async toggleLogin(){
    console.log('login')
    this.showLogin=true;
    //this.api.getLogin()
    //await (window.location.href='http://localhost:8004/login');
    
    this.api.doLogin();
    this.cdr.detectChanges();
  }

  logout(){
    this.localStorage.setObject('login_items',{});
    this.is_logged=false;
    this.username='';
    this.email='';
    this.usercharacters='';
    this.cdr.detectChanges();
  }

  protected readonly faCartShopping = faCartShopping;
  protected readonly faHandHoldingBox = faHandHoldingBox;
  protected readonly faAddressCard = faAddressCard;
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;
}
