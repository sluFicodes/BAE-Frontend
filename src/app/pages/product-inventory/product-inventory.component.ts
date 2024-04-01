import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LoginInfo } from 'src/app/models/interfaces';
import { ProductInventoryServiceService } from 'src/app/services/product-inventory-service.service';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { PriceServiceService } from 'src/app/services/price-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import { FastAverageColor } from 'fast-average-color';
import {components} from "../../models/product-catalog";
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment';
type ProductOffering = components["schemas"]["ProductOffering"];
import * as moment from 'moment';

@Component({
  selector: 'app-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrl: './product-inventory.component.css'
})
export class ProductInventoryComponent implements OnInit, AfterViewInit {
  partyId:any='';
  inventory:any[]=[];
  loading: boolean = false;
  bgColor: string[] = [];
  products: ProductOffering[]=[];
  orders:any[]=[];
  show_prods:boolean = true;
  show_serv:boolean = false;
  show_res:boolean = false;
  show_orders:boolean = false;
  prices: any[]=[];
  filters: any[]=['active','created'];
  loading_more: boolean = false;
  page_check:boolean = true;
  page: number=0;
  INVENTORY_LIMIT: number = environment.INVENTORY_LIMIT;

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
      this.partyId=aux.partyId;
      this.getInventory();
    }
    initFlowbite();
  }

  ngAfterViewInit() {
    const fac = new FastAverageColor();
    for(let i=0; i< this.products.length; i++){
      let img = document.getElementById('img'+i) as HTMLImageElement;
      fac.getColorAsync(img)
      .then(color => {
        this.bgColor.push(color.rgba);
      })
      .catch(e => {
        console.error(e);
      });
    }
    initFlowbite();
  }

  goToOffers(){
    initFlowbite();
    this.page=0;
    this.inventory=[];
    this.products=[];
    this.prices=[];
    this.getInventory();
  }

  getOffers(size:number){
    //this.products=[];
    //this.prices=[];
    for(let i=size; i<this.inventory.length; i++){
      this.api.getProductById(this.inventory[i].productOffering.id).then(prod=> {           
        let attachment: any[]= []
        this.api.getProductSpecification(prod.productSpecification.id).then(spec => {
          attachment = spec.attachment
          this.products.push(
            {
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
            }
          )
          this.prices.push({
            "price": this.inventory[i].productPrice[0].price.taxIncludedAmount.value,
            "unit": this.inventory[i].productPrice[0].price.taxIncludedAmount.unit,
            "priceType": this.inventory[i].productPrice[0].priceType,
            "text": this.inventory[i].productPrice[0].unitOfMeasure != undefined ? '/'+this.inventory[i].productPrice[0].unitOfMeasure : this.inventory[i].productPrice[0].recurringChargePeriodType
          })
          this.selectProd();       
          this.show_serv=false;
          this.show_res=false;
          this.show_orders=false;
          this.show_prods=true;
          this.loading=false;
          this.cdr.detectChanges();
          initFlowbite();  

        })

      })
    }
  }

  getServices(){    
    this.selectServ();
    this.show_orders=false;    
    this.show_prods=false;
    this.show_res=false;
    this.show_serv=true;  
    this.loading=false;
    this.cdr.detectChanges();
    initFlowbite();
  }

  getResources(){  
    this.selectRes();  
    this.show_orders=false;    
    this.show_prods=false;    
    this.show_serv=false;  
    this.show_res=true;
    this.loading=false;
    this.cdr.detectChanges();
    initFlowbite();
  }

  getProductImage(prod:ProductOffering) {
    let images = prod.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
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

  removeClass(elem: HTMLElement, cls:string) {
    var str = " " + elem.className + " ";
    elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
  }

  addClass(elem: HTMLElement, cls:string) {
      elem.className += (" " + cls);
  }

  unselectMenu(elem:HTMLElement | null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        this.removeClass(elem,cls)
      } else {
        console.log('already unselected')
      }
    }
  }

  selectMenu(elem:HTMLElement| null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        console.log('already selected')
      } else {
        this.addClass(elem,cls)
      }
    }
  }

  selectProd(){
    let prod_button = document.getElementById('prod-button')
    let serv_button = document.getElementById('serv-button')
    let res_button = document.getElementById('res-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(prod_button,'text-white bg-primary-100');
    this.unselectMenu(serv_button,'text-white bg-primary-100');
    this.unselectMenu(res_button,'text-white bg-primary-100');
    this.unselectMenu(order_button,'text-white bg-primary-100');
  }

  selectServ(){
    let prod_button = document.getElementById('prod-button')
    let serv_button = document.getElementById('serv-button')
    let res_button = document.getElementById('res-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(serv_button,'text-white bg-primary-100');
    this.unselectMenu(prod_button,'text-white bg-primary-100');
    this.unselectMenu(res_button,'text-white bg-primary-100');
    this.unselectMenu(order_button,'text-white bg-primary-100');
  }

  selectRes(){
    let prod_button = document.getElementById('prod-button')
    let serv_button = document.getElementById('serv-button')
    let res_button = document.getElementById('res-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(res_button,'text-white bg-primary-100');
    this.unselectMenu(prod_button,'text-white bg-primary-100');
    this.unselectMenu(serv_button,'text-white bg-primary-100');
    this.unselectMenu(order_button,'text-white bg-primary-100');
  }

  getInventory(){
    let existingInventorySize=this.inventory.length;
    this.inventoryService.getInventory(this.page,this.partyId,this.filters).then(data => {
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

      this.loading=false;
      this.loading_more=false;
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
    this.page=0;
    this.inventory=[];
    this.products=[];
    this.prices=[];
    this.getInventory();
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.INVENTORY_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.getInventory();
  }



}
