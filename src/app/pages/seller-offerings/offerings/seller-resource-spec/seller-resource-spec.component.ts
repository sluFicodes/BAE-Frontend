import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {faIdCard, faSort, faSwatchbook} from "@fortawesome/pro-solid-svg-icons";
import {components} from "src/app/models/product-catalog";
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ResourceSpecServiceService } from 'src/app/services/resource-spec-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { LoginInfo } from 'src/app/models/interfaces';
import {EventMessageService} from "src/app/services/event-message.service";
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'seller-resource-spec',
  templateUrl: './seller-resource-spec.component.html',
  styleUrl: './seller-resource-spec.component.css'
})
export class SellerResourceSpecComponent implements OnInit {
  protected readonly faIdCard = faIdCard;
  protected readonly faSort = faSort;
  protected readonly faSwatchbook = faSwatchbook;

  searchField = new FormControl();

  resSpecs:any[]=[];
  page:number=0;
  RES_SPEC_LIMIT: number = environment.RES_SPEC_LIMIT;
  loading: boolean = false;
  loading_more: boolean = false;
  page_check:boolean = true;
  filter:any=undefined;
  status:any[]=['Active','Launched'];
  partyId:any;
  sort:any=undefined;

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private resSpecService: ResourceSpecServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService
  ) {
  }

  ngOnInit() {
    this.loading=true;
    this.resSpecs=[];
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(aux.logged_as==aux.id){
      this.partyId = aux.partyId;
    } else {
      let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
      this.partyId = loggedOrg.partyId
    }

    this.getResSpecs();
    let input = document.querySelector('[type=search]')
    if(input!=undefined){
      input.addEventListener('input', e => {
        // Easy way to get the value of the element who trigger the current `e` event
        console.log(`Input updated`)
        if(this.searchField.value==''){
          this.filter=undefined;
          this.getResSpecs();
        }
      });
    }
    initFlowbite();
  }

  ngAfterViewInit(){
    initFlowbite();
  }


  goToCreate(){
    this.eventMessage.emitSellerCreateResourceSpec(true);
  }

  getResSpecs(){    
    this.resSpecService.getResourceSpecByUser(this.page,this.status,this.partyId,this.sort).then(data => {
      if(data.length<this.RES_SPEC_LIMIT){
        this.page_check=false;
        this.cdr.detectChanges();
      }else{
        this.page_check=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.resSpecs.push(data[i])
      }
      this.loading=false;
      this.loading_more=false;
      console.log('--- resSpecs')
      console.log(this.resSpecs)
    })
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.RES_SPEC_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.getResSpecs();
  }

  filterInventoryByKeywords(){

  }

  onStateFilterChange(filter:string){
    const index = this.status.findIndex(item => item === filter);
    if (index !== -1) {
      this.status.splice(index, 1);
      console.log('elimina filtro')
      console.log(this.status)
    } else {
      console.log('añade filtro')
      console.log(this.status)
      this.status.push(filter)
    }
    this.loading=true;
    this.page=0;
    this.resSpecs=[];
    this.getResSpecs();
  }

  onSortChange(event: any) {
    if(event.target.value=='name'){
      this.sort='name'
    }else{
      this.sort=undefined
    }
    this.loading=true;
    this.page=0;
    this.resSpecs=[];
    this.getResSpecs();
  }
}
