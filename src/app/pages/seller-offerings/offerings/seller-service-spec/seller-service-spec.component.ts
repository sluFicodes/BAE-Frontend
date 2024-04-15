import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {faIdCard, faSort, faSwatchbook} from "@fortawesome/pro-solid-svg-icons";
import {components} from "src/app/models/product-catalog";
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ServiceSpecServiceService } from 'src/app/services/service-spec-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { LoginInfo } from 'src/app/models/interfaces';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'seller-service-spec',
  templateUrl: './seller-service-spec.component.html',
  styleUrl: './seller-service-spec.component.css'
})
export class SellerServiceSpecComponent implements OnInit {
  protected readonly faIdCard = faIdCard;
  protected readonly faSort = faSort;
  protected readonly faSwatchbook = faSwatchbook;

  searchField = new FormControl();

  servSpecs:any[]=[];
  page:number=0;
  SERV_SPEC_LIMIT: number = environment.SERV_SPEC_LIMIT;
  loading: boolean = false;
  loading_more: boolean = false;
  page_check:boolean = true;
  filter:any=undefined;
  status:any[]=['Active','Launched'];
  partyId:any;

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private servSpecService: ServiceSpecServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this.loading=true;
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(aux.logged_as==aux.id){
      this.partyId = aux.partyId;
    } else {
      let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
      this.partyId = loggedOrg.partyId
    }

    this.getServSpecs();
    let input = document.querySelector('[type=search]')
    if(input!=undefined){
      input.addEventListener('input', e => {
        // Easy way to get the value of the element who trigger the current `e` event
        console.log(`Input updated`)
        if(this.searchField.value==''){
          this.filter=undefined;
          this.getServSpecs();
        }
      });
    }
    initFlowbite();
  }

  ngAfterViewInit(){
    initFlowbite();
  }

  getServSpecs(){
    this.servSpecs=[];
    this.servSpecService.getServiceSpecByUser(this.page,this.status,this.partyId).then(data => {
      if(data.length<this.SERV_SPEC_LIMIT){
        this.page_check=false;
        this.cdr.detectChanges();
      }else{
        this.page_check=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.servSpecs.push(data[i])
      }
      this.loading=false;
      console.log('--- servSpecs')
      console.log(this.servSpecs)
    })
  }

  filterInventoryByKeywords(){

  }

  onStateFilterChange(filter:string){

  }

}
