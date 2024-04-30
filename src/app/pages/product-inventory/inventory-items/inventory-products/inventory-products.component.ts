import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, HostListener, Input } from '@angular/core';
import { LoginInfo } from 'src/app/models/interfaces';
import { ProductInventoryServiceService } from 'src/app/services/product-inventory-service.service';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { PriceServiceService } from 'src/app/services/price-service.service';
import { FastAverageColor } from 'fast-average-color';
import {components} from "src/app/models/product-catalog";
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment';
type ProductOffering = components["schemas"]["ProductOffering"];
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'inventory-products',
  templateUrl: './inventory-products.component.html',
  styleUrl: './inventory-products.component.css'
})
export class InventoryProductsComponent implements OnInit {
  inventory:any[] = [];
  partyId:any='';
  loading: boolean = false;
  bgColor: string[] = [];
  products: ProductOffering[]=[];
  unsubscribeModal:boolean=false;
  renewModal:boolean=false;
  prodToRenew:any;
  prodToUnsubscribe:any;
  prices: any[]=[];
  filters: any[]=['active','created'];
  loading_more: boolean = false;
  page_check:boolean = true;
  page: number=0;
  INVENTORY_LIMIT: number = environment.INVENTORY_LIMIT;
  searchField = new FormControl();
  keywordFilter:any=undefined;

  constructor(
    private inventoryService: ProductInventoryServiceService,
    private localStorage: LocalStorageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private priceService: PriceServiceService,
    private router: Router,
    private orderService: ProductOrderService
  ) {}

  ngOnInit() {
    this.loading=true;

    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      if(aux.logged_as==aux.id){
        this.partyId = aux.partyId;
      } else {
        let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
        this.partyId = loggedOrg.partyId
      }
      this.getInventory();
    }
    let input = document.querySelector('[type=search]')
    if(input!=undefined){
      input.addEventListener('input', e => {
        // Easy way to get the value of the element who trigger the current `e` event
        console.log(`Input updated`)
        if(this.searchField.value==''){
          this.keywordFilter=undefined;
          this.getInventory();
        }
      });
    }
    initFlowbite();
  }

  @HostListener('document:click')
  onClick() {
    if(this.unsubscribeModal==true){
      this.unsubscribeModal=false;
      this.cdr.detectChanges();
    }
    if(this.prodToRenew==true){
      this.prodToRenew=false;
      this.cdr.detectChanges();
    }
  }

  getOffers(size:number){
    for(let i=size; i<this.inventory.length; i++){
      this.api.getProductById(this.inventory[i].productOffering.id).then(prod=> {           
        let attachment: any[]= []
        this.api.getProductSpecification(prod.productSpecification.id).then(spec => {
          attachment = spec.attachment
          this.inventory[i]['product'] = {
            id: prod.id,
            name: prod.name,
            category: prod.category,
            description: prod.description,
            lastUpdate: prod.lastUpdate,
            attachment: attachment,
            //productOfferingPrice: data[i].productPrice[0],
            productSpecification: prod.productSpecification,
            productOfferingTerm: prod.productOfferingTerm,
            version: prod.version
          };
          this.inventory[i]['price']={
            "price": this.inventory[i].productPrice[0].price.taxIncludedAmount.value,
            "unit": this.inventory[i].productPrice[0].price.taxIncludedAmount.unit,
            "priceType": this.inventory[i].productPrice[0].priceType,
            "text": this.inventory[i].productPrice[0].unitOfMeasure != undefined ? '/'+this.inventory[i].productPrice[0].unitOfMeasure : this.inventory[i].productPrice[0].recurringChargePeriodType
          }
          this.loading=false;
          this.loading_more=false;
          this.cdr.detectChanges();
          initFlowbite();
        })

      })
    }
  }


  getProductImage(prod:ProductOffering) {
    let profile = prod?.attachment?.filter(item => item.name === 'Profile Picture') ?? [];
    let images = prod.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    if(profile.length!=0){
      images = profile;
    } 
    return images.length > 0 ? images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }

  getPrice(prod:ProductOffering){
    console.log('producto')
    console.log(prod)
    let result:any = this.priceService.formatCheapestPricePlan(prod);
    console.log('price')
    console.log(result)
    return {
      "price": result.price,
      "unit": result.unit,
      "priceType": result.priceType,
      "text": result.text
    }
  }

  goToProductDetails(productOff:ProductOffering| undefined) {
    document.querySelector("body > div[modal-backdrop]")?.remove()
    this.router.navigate(['/search', productOff?.id]);
  }

  getInventory(){
    let existingInventorySize=this.inventory.length;
    this.inventoryService.getInventory(this.page,this.partyId,this.filters,this.keywordFilter).then(data => {
      if(data.length<this.INVENTORY_LIMIT){
        this.page_check=false;
        this.cdr.detectChanges();
      }else{
        this.page_check=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i<data.length;i++){
        this.inventory.push(data[i])
      }
      //this.inventory=data;
      console.log('inv')
      console.log(this.inventory)
      this.getOffers(existingInventorySize);
      this.cdr.detectChanges();

      //this.loading=false;
      //this.loading_more=false;
      this.cdr.detectChanges();
    })
  }

  onStateFilterChange(filter:string){
    const index = this.filters.findIndex(item => item === filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
      console.log('elimina filtro')
      console.log(this.filters)
    } else {
      console.log('añade filtro')
      console.log(this.filters)
      this.filters.push(filter)
    }
    this.loading=true;
    this.page=0;
    this.inventory=[];
    this.getInventory();
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.INVENTORY_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.getInventory();
  }

  filterInventoryByKeywords(){
    this.keywordFilter=this.searchField.value;
    this.page=0;
    this.getInventory();
  }

  unsubscribeProduct(id:any){
    this.inventoryService.updateProduct({status: "suspended"},id).subscribe({
      next: data => {
        this.page=0;
        this.inventory=[];
        this.unsubscribeModal=false;
        this.getInventory();              
      },
      error: error => {
          console.error('There was an error while updating!', error);
      }
    });
  }

  showUnsubscribeModal(inv:any){
    this.unsubscribeModal=true;
    this.prodToUnsubscribe=inv;
  }

  showRenewModal(inv:any){
    this.renewModal=true;
    this.prodToRenew=inv;
  }
  
  renewProduct(id:any){
    console.log(id)
  }

}
