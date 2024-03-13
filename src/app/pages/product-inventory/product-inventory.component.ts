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
  filters: any[]=['active','launched'];

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
      this.inventoryService.getInventory(0,aux.partyId,this.filters).then(data => {
        this.inventory=data;        
        console.log('inv')
        console.log(this.inventory)
        this.getOffers();
        this.cdr.detectChanges();

        this.loading=false;
        this.cdr.detectChanges();
      })
    }
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

  }

  getOffers(){
    this.products=[];
    this.prices=[];
    for(let i=0; i<this.inventory.length; i++){
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

        })

      })
    }
  }

  getOrders(){
    this.selectOrder();
    this.orders=[];
    if(this.partyId!=''){
      this.orderService.getProductOrders(this.partyId,0).then(orders=> {
        for(let i=0;i<orders.length;i++){
          let items:any[] = [];
          this.orders.push(orders[i]);
          for(let j=0;j<orders[i].productOrderItem.length;j++){
            this.api.getProductById(orders[i].productOrderItem[j].id).then(item => {
              this.api.getProductSpecification(item.productSpecification.id).then(spec => {
                this.api.getProductPrice(item.productOfferingPrice[0].id).then(prodprice => {
                  items.push({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    description: item.description,
                    lastUpdate: item.lastUpdate,
                    attachment: spec.attachment,
                    productOfferingPrice: {
                      "price": prodprice.price.value,
                      "unit": prodprice.price.unit,
                      "priceType": prodprice.priceType,
                      "text": prodprice.unitOfMeasure != undefined ? '/'+prodprice.unitOfMeasure.units : prodprice.recurringChargePeriodType
                    },
                    productSpecification: item.productSpecification,
                    productOfferingTerm: item.productOfferingTerm,
                    version: item.version
                  }) 
                })   
              })
            })            
          }
          this.orders[i].productOrderItem=items;
        }
        console.log(this.orders)
      })
    }

    this.show_serv=false;
    this.show_prods=false;
    this.show_res=false;
    this.show_orders=true;   
    this.loading=false;
    this.cdr.detectChanges();
  }

  getServices(){    
    this.selectServ();
    this.show_orders=false;    
    this.show_prods=false;
    this.show_res=false;
    this.show_serv=true;  
    this.loading=false;
    this.cdr.detectChanges();
  }

  getResources(){  
    this.selectRes();  
    this.show_orders=false;    
    this.show_prods=false;    
    this.show_serv=false;  
    this.show_res=true;
    this.loading=false;
    this.cdr.detectChanges();
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

  selectOrder(){
    let prod_button = document.getElementById('prod-button')
    let serv_button = document.getElementById('serv-button')
    let res_button = document.getElementById('res-button')
    let order_button = document.getElementById('order-button')

    this.selectMenu(order_button,'text-white bg-primary-100');
    this.unselectMenu(prod_button,'text-white bg-primary-100');
    this.unselectMenu(serv_button,'text-white bg-primary-100');
    this.unselectMenu(res_button,'text-white bg-primary-100');
  }

}
