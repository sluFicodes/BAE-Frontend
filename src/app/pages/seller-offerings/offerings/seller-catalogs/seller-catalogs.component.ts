import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {faIdCard, faSort, faSwatchbook} from "@fortawesome/pro-solid-svg-icons";
import {components} from "src/app/models/product-catalog";
type Catalog = components["schemas"]["Catalog"];
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { LoginInfo } from 'src/app/models/interfaces';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'seller-catalogs',
  templateUrl: './seller-catalogs.component.html',
  styleUrl: './seller-catalogs.component.css'
})
export class SellerCatalogsComponent {

  protected readonly faIdCard = faIdCard;
  protected readonly faSort = faSort;
  protected readonly faSwatchbook = faSwatchbook;

  searchField = new FormControl();
  catalogs:Catalog[]=[];
  page:number=0;
  CATALOG_LIMIT: number = environment.CATALOG_LIMIT;
  loading: boolean = false;
  loading_more: boolean = false;
  page_check:boolean = true;
  filter:any=undefined;
  partyId:any;

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this.loading=true;
    this.catalogs=[];
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(aux.logged_as==aux.id){
      this.partyId = aux.partyId;
    } else {
      let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
      this.partyId = loggedOrg.partyId
    }

    this.getCatalogs();
    let input = document.querySelector('[type=search]')
    if(input!=undefined){
      input.addEventListener('input', e => {
        // Easy way to get the value of the element who trigger the current `e` event
        console.log(`Input updated`)
        if(this.searchField.value==''){
          this.filter=undefined;
          this.getCatalogs();
        }
      });
    }
    initFlowbite();
  }

  ngAfterViewInit(){
    initFlowbite();
  }

  getCatalogs(){    
    this.api.getCatalogsByUser(this.page,this.filter,this.partyId).then(data => {
      if(data.length<this.CATALOG_LIMIT){
        this.page_check=false;
        this.cdr.detectChanges();
      }else{
        this.page_check=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.catalogs.push(data[i])
      }
      this.loading=false;
      this.loading_more=false;
      console.log('--- CATALOGS')
      console.log(this.catalogs)
    })
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.CATALOG_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.getCatalogs();
  }

  filterInventoryByKeywords(){

  }

  onStateFilterChange(filter:string){

  }
}
