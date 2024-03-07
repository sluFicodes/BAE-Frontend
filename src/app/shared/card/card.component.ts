import {Component, Input, OnInit, ChangeDetectorRef, HostListener, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BadgeComponent} from "../badge/badge.component";
import {components} from "../../models/product-catalog";
type Product = components["schemas"]["ProductOffering"];
type ProductSpecification = components["schemas"]["ProductSpecification"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Modal } from 'flowbite';
import { Router } from '@angular/router';
import { PriceServiceService } from 'src/app/services/price-service.service';
import { initFlowbite } from 'flowbite';
import { cartProduct,productSpecCharacteristicValueCart } from '../../models/interfaces';
import { TYPES } from 'src/app/models/types.const';

@Component({
  selector: 'bae-off-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input() productOff: Product | undefined;
  category: string = 'none';
  categories: any[] | undefined  = [];
  price: any = {price:0,priceType:'X'};
  images: AttachmentRefOrValue[]  = [];
  toastVisibility: boolean = false;
  detailsModalVisibility: boolean = false;
  lastAddedProd:cartProduct | undefined;
  targetModal: any;
  modal: Modal;
  prodSpec:ProductSpecification = {};
  complianceProf:any[] = [];
  showModal:boolean=false;
  cartSelection:boolean=false;
  check_prices:boolean=false;
  selected_price:any;
  check_char:boolean=false;
  check_terms:boolean=false;
  selected_terms:boolean=false;
  selected_chars:productSpecCharacteristicValueCart[]=[];
  formattedPrices:any[]=[];

  constructor(
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private api: ApiServiceService,
    private priceService: PriceServiceService,
    private router: Router
    ) {
      this.targetModal = document.getElementById('details-modal');
      this.modal = new Modal(this.targetModal);
      this.complianceProf.push({id: 'cloudRulebook', name: 'EU Cloud Rulebook', value: 'Not achieved yet', href:'#'})
      this.complianceProf.push({id: 'cloudSecurity', name: 'EU Cloud Security', value: 'Not achieved yet', href:'#'})    
      this.complianceProf.push({id: 'iso27001', name: 'ISO 27001', value: 'Not achieved yet', href:'#'})
      this.complianceProf.push({id: 'iso27017', name: 'ISO 27017', value: 'Not achieved yet', href:'#'})
      this.complianceProf.push({id: 'iso17025', name: 'ISO 17025', value: 'Not achieved yet', href:'#'})
    }

  @HostListener('document:click')
  onClick() {
    if(this.showModal==true){
      this.showModal=false;
      this.cdr.detectChanges(); 
    }
    if(this.cartSelection==true){
      this.cartSelection=false;
      this.check_char=false;
      this.check_terms=false;
      this.check_prices=false;
      this.selected_chars=[];
      this.selected_price={};
      this.selected_terms=false;
      this.cdr.detectChanges();
    }   
  }


  ngOnInit() {
    initFlowbite();
    this.category = this.productOff?.category?.at(0)?.name ?? 'none';
    this.categories = this.productOff?.category;
    //this.price = this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
    //  this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a';
    this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    let specId:any|undefined=this.productOff?.productSpecification?.id;
    if(specId != undefined){
      this.api.getProductSpecification(specId).then(spec => {
        this.prodSpec=spec;
        for(let z=0; z < this.complianceProf.length; z++){
          if(this.prodSpec.productSpecCharacteristic != undefined){
            let compProf = this.prodSpec.productSpecCharacteristic.find((p => p.name === this.complianceProf[z].id));
            if(compProf != undefined){
              this.complianceProf[z].href = compProf.productSpecCharacteristicValue?.at(0)?.value
              this.complianceProf[z].value = 'Yes'
            }
          }
        }
      })
    }
    let result:any = this.priceService.formatCheapestPricePlan(this.productOff);
    this.price = {
      "price": result.price,
      "unit": result.unit,
      "priceType": result.priceType,
      "text": result.text
    }
    this.cdr.detectChanges();
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }

  async addProductToCart(productOff:Product| undefined,options:boolean){
    //this.localStorage.addCartItem(productOff as Product);
    if(options==true){
      console.log('termschecked:')
      console.log(this.selected_terms)
      if(productOff!= undefined && productOff?.productOfferingPrice != undefined){
        let prodOptions = {
          "id": productOff?.id,
          "name": productOff?.name,
          "image": this.getProductImage(),
          "href": productOff.href,
          "options": {
            "characteristics": this.selected_chars,
            "pricing": this.selected_price
          },
          "termsAccepted": this.selected_terms
        }
        this.lastAddedProd=prodOptions;
      await this.api.addItemShoppingCart(prodOptions).subscribe({
        next: data => {
            console.log(data)
            console.log('Update successful');
        },
        error: error => {
            console.error('There was an error while updating!', error);
        }
      });
    }
    } else {
      if(productOff!= undefined && productOff?.productOfferingPrice != undefined){
        let prodOptions = {
          "id": productOff?.id,
          "name": productOff?.name,
          "image": this.getProductImage(),
          "href": productOff.href,
          "options": {
            "characteristics": this.selected_chars,
            "pricing": this.selected_price
          },
          "termsAccepted": true
        }
        this.lastAddedProd=prodOptions;
      await this.api.addItemShoppingCart(prodOptions).subscribe({
        next: data => {
            console.log(data)
            console.log('Update successful');
        },
        error: error => {
            console.error('There was an error while updating!', error);
        }
      });
    }
    }
    if(productOff!== undefined){
      this.eventMessage.emitAddedCartItem(productOff as cartProduct);
    }
    //TOGGLE TOAST
    this.toastVisibility=true;
    
    this.cdr.detectChanges();
    //document.getElementById("progress-bar")?.classList.toggle("hover:w-100");
    let element = document.getElementById("progress-bar")
    let parent = document.getElementById("toast-add-cart")
    if (element != null && parent != null) {
      element.style.width = '0%'
      element.offsetWidth
      element.style.width = '100%'
      setTimeout(() => {   
        this.toastVisibility=false
      }, 3500);
    }

    if(this.cartSelection==true){
      this.cartSelection=false;
      this.check_char=false;
      this.check_terms=false;
      this.check_prices=false;
      this.selected_chars=[];
      this.selected_price={};
      this.selected_terms=false;
      this.cdr.detectChanges();
    }    
    this.cdr.detectChanges();
  }

  deleteProduct(product: Product | undefined){
    if(product !== undefined) {
      //this.localStorage.removeCartItem(product);
      this.api.removeItemShoppingCart(product.id).subscribe(() => console.log('deleted'));
      this.eventMessage.emitRemovedCartItem(product as Product);
    }
    this.toastVisibility=false;
  }

  toggleDetailsModal(){
    this.showModal=true;
    this.cdr.detectChanges();
    /*initFlowbite();
    this.targetModal = document.getElementById('details-modal');
    this.modal = new Modal(this.targetModal);
    this.cdr.detectChanges();
    this.modal.toggle();
    this.cdr.detectChanges();
    initFlowbite();*/
  }

  toggleCartSelection(productOff:Product| undefined){
    //this.formattedPrices = this.priceService.getFormattedPriceList(productOff);
    console.log(productOff)
    if (this.productOff?.productOfferingPrice != undefined){
      if(this.productOff?.productOfferingPrice.length > 1){
        this.check_prices=true;
        this.selected_price=this.productOff?.productOfferingPrice[this.productOff?.productOfferingPrice.length-1]
      } else {
        this.selected_price=this.productOff?.productOfferingPrice[0]
      }  
      
      this.cdr.detectChanges();
    }

    if(productOff?.productOfferingTerm != undefined){
      if(productOff.productOfferingTerm.length == 1 && productOff.productOfferingTerm[0].name != undefined){
        this.check_terms=true;
      } else {
        this.check_terms=true;
      }
      
    }

    if(this.prodSpec.productSpecCharacteristic != undefined){
      for(let i=0; i<this.prodSpec.productSpecCharacteristic.length; i++){
        let charvalue = this.prodSpec.productSpecCharacteristic[i].productSpecCharacteristicValue;        
        if(charvalue != undefined){
          if(charvalue?.length>1){
            this.check_char = true;
          }
          for(let j=0; j<charvalue.length;j++){
            if(charvalue[j]?.isDefault == true){
              this.selected_chars.push(
                {
                "characteristic": this.prodSpec.productSpecCharacteristic[i],
                "value": charvalue[j]
              });
            }
          }
        }
      }      
      console.log(this.selected_chars)
    }
    
    if (this.check_prices==true || this.check_char == true || this.check_terms == true){
      this.cartSelection=true;
      this.cdr.detectChanges();
    }else {
      this.addProductToCart(productOff,false)
    }

  }

  hideCartSelection(){
    this.cartSelection=false;
    this.check_char=false;
    this.check_terms=false;
    this.check_prices=false;
    this.formattedPrices=[];
    this.selected_chars=[];
    this.selected_price={};
    this.selected_terms=false;
    this.cdr.detectChanges();
  }

  hideModal() {
    this.showModal=false;
    this.cdr.detectChanges();
    /*this.targetModal = document.getElementById('details-modal');
    this.modal = new Modal(this.targetModal);
    this.modal.hide();*/
  }

  goToProductDetails(productOff:Product| undefined) {
    document.querySelector("body > div[modal-backdrop]")?.remove()
    this.router.navigate(['/search', productOff?.id]);
  }

  onPriceChange(price:any){
    this.selected_price=price;
    console.log('change price')
    console.log(this.selected_price)
    this.cdr.detectChanges;
  }

  onCharChange(idx:number,validx:number,char:any){
    let defaultChar = { "isDefault": true, "value": char.value}
    this.selected_chars[idx].value=defaultChar;
    let prodcharval = this.selected_chars[idx]['characteristic'].productSpecCharacteristicValue
    if( prodcharval != undefined){
      for(let i=0; i<prodcharval.length; i++){
        if(i==validx){
          prodcharval[i].isDefault=true;
        } else {
          prodcharval[i].isDefault=false;
        }
      }
    }

    console.log('change char')
    console.log(this.selected_chars)
    this.cdr.detectChanges();
  }


}
