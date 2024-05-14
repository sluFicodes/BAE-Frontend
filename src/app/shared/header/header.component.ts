import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, HostListener} from '@angular/core';
import {
  faCartShopping,
  faHandHoldingBox,
  faAddressCard,
  faArrowRightFromBracket,
  faBoxesStacked,
  faClipboardCheck,
  faBrain,
  faAnglesLeft,
  faUser,
  faUsers
} from "@fortawesome/sharp-solid-svg-icons";
import {LocalStorageService} from "../../services/local-storage.service";
import { ApiServiceService } from 'src/app/services/product-service.service';
import { LoginServiceService } from 'src/app/services/login-service.service';
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
              private loginService: LoginServiceService,
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
  loggedAsOrg:boolean=false;
  loginInfo:any;
  orgs:any[]=[];
  username:string='';
  email:string='';
  usercharacters:string='';
  loginSubscription: Subscription = new Subscription();
  loginUrl:string = `${environment.BASE_URL}:${environment.API_PORT}` + (environment.SIOP ? '/login/vc' : '/login');
  roles:string[]=[];
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;

  @HostListener('document:click')
  onClick() {
    if(this.showCart==true){
      this.showCart=false;
      this.cdr.detectChanges();
    }     
  }

  async ngOnInit(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    console.log(aux)
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      this.loginInfo=aux;
      this.is_logged=true;
      this.orgs=aux.organizations;
      if(aux.logged_as == aux.id){
        this.username=aux.user;
        this.usercharacters=(aux.user.slice(0, 2)).toUpperCase();
        this.email=aux.email;
        for(let i=0;i<aux.roles.length;i++){
          this.roles.push(aux.roles[i].name)
        }
      } else {
        let loggedOrg = this.orgs.find((element: { id: any; }) => element.id == aux.logged_as)
        console.log('loggedOrg')
        console.log(loggedOrg)
        this.loggedAsOrg=true;
        this.username=loggedOrg.name;
        this.usercharacters=(loggedOrg.name.slice(0, 2)).toUpperCase();
        this.email=loggedOrg.description;
        for(let i=0;i<loggedOrg.roles.length;i++){
          this.roles.push(loggedOrg.roles[i].name)
        }
      }
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
          this.loginInfo=aux;
          this.is_logged=true;
          this.cdr.detectChanges();
          this.orgs=aux.organizations;
          if(aux.logged_as == aux.id){
            this.username=aux.user;
            this.usercharacters=(aux.user.slice(0, 2)).toUpperCase();
            this.email=aux.email;
            for(let i=0;i<aux.roles.length;i++){
              this.roles.push(aux.roles[i].name)
            }
          } else {
            let loggedOrg = this.orgs.find((element: { id: any; }) => element.id == aux.logged_as)
            console.log('loggedOrg')
            console.log(loggedOrg)
            this.loggedAsOrg=true;
            this.username=loggedOrg.name;
            this.usercharacters=(loggedOrg.name.slice(0, 2)).toUpperCase();
            this.email=loggedOrg.description;
            for(let i=0;i<loggedOrg.roles.length;i++){
              this.roles.push(loggedOrg.roles[i].name)
            }
          }
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

  goToMyOfferings(){
    window.location.href=`${HeaderComponent.BASE_URL}:${HeaderComponent.API_PORT}/#/stock/offering?status=Active,Launched`;
  }

  async toggleLogin(){
    console.log('login')
    this.showLogin=true;
    //this.api.getLogin()
    //await (window.location.href='http://localhost:8004/login');
    
    this.loginService.doLogin();
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

  changeSession(idx:number,exitOrgLogin:boolean){
    if(exitOrgLogin){
      this.loginInfo = {"id": this.loginInfo.id,
      "user": this.loginInfo.user,
      "email": this.loginInfo.email,
      "token": this.loginInfo.token,
      "expire": this.loginInfo.expire,
      "partyId": this.loginInfo.partyId,
      "roles": this.loginInfo.roles,
      "organizations": this.loginInfo.organizations,
      "logged_as": this.loginInfo.id};
      this.localStorage.setObject('login_items',this.loginInfo);
      this.loggedAsOrg=false;
      this.username=this.loginInfo.user;
      this.usercharacters=(this.loginInfo.user.slice(0, 2)).toUpperCase();
      this.email=this.loginInfo.email;
      this.roles=[];
      for(let i=0;i<this.loginInfo.roles.length;i++){
        this.roles.push(this.loginInfo.roles[i].name)
      }
      this.eventMessage.emitChangedSession(this.loginInfo)
      this.cdr.detectChanges();
    } else {
      this.loginInfo = {"id": this.loginInfo.id,
      "user": this.loginInfo.user,
      "email": this.loginInfo.email,
      "token": this.loginInfo.token,
      "expire": this.loginInfo.expire,
      "partyId": this.loginInfo.partyId,
      "roles": this.loginInfo.roles,
      "organizations": this.loginInfo.organizations,
      "logged_as": this.orgs[idx].id };
      this.localStorage.setObject('login_items',this.loginInfo);
      this.loggedAsOrg=true;
      this.username=this.orgs[idx].name;
      this.usercharacters=(this.orgs[idx].name.slice(0, 2)).toUpperCase();
      this.email=this.orgs[idx].description;
      this.roles=[];
      for(let i=0;i<this.orgs[idx].roles.length;i++){
        this.roles.push(this.orgs[idx].roles[i].name)
      }
      this.eventMessage.emitChangedSession(this.loginInfo)
      this.cdr.detectChanges();
    }
    initFlowbite();
  }

  hideDropdown(dropdownId:any){
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  }

  protected readonly faCartShopping = faCartShopping;
  protected readonly faHandHoldingBox = faHandHoldingBox;
  protected readonly faAddressCard = faAddressCard;
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;
  protected readonly faBoxesStacked = faBoxesStacked;
  protected readonly faClipboardCheck = faClipboardCheck;
  protected readonly faBrain = faBrain;
  protected readonly faAnglesLeft = faAnglesLeft;
  protected readonly faUser = faUser;
  protected  readonly faUsers = faUsers;
}
