import { Component, OnInit, ElementRef, ViewChild,ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/product-service.service';
import {components} from "src/app/models/product-catalog";
import { initFlowbite } from 'flowbite';
import { PriceServiceService } from 'src/app/services/price-service.service';
import {faScaleBalanced, faArrowProgress, faArrowRightArrowLeft, faObjectExclude, faSwap, faGlobe, faBook, faShieldHalved, faAtom, faDownload} from "@fortawesome/pro-solid-svg-icons";
type Product = components["schemas"]["ProductOffering"];
type ProductSpecification = components["schemas"]["ProductSpecification"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];
//type CharacteristicValueSpecification = components["schemas"]["CharacteristicValueSpecification"];
import { certifications } from 'src/app/models/certification-standards.const'
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoginInfo, cartProduct,productSpecCharacteristicValueCart } from 'src/app/models/interfaces';
import { ProductInventoryServiceService } from 'src/app/services/product-inventory-service.service'
import {EventMessageService} from "src/app/services/event-message.service";
import { jwtDecode } from "jwt-decode";
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-inv-detail',
  templateUrl: './product-inv-detail.component.html',
  styleUrl: './product-inv-detail.component.css'
})
export class ProductInvDetailComponent implements OnInit {

  id:any;
  productOff: Product | undefined;
  check_logged:boolean=false;
  images: AttachmentRefOrValue[]  = [];
  attatchments: AttachmentRefOrValue[]  = [];
  serviceSpecs:any[] = [];
  resourceSpecs:any[]=[];
  prod:any = {};
  prodSpec:ProductSpecification = {};
  checkCustom:boolean=false;

  protected readonly faScaleBalanced = faScaleBalanced;
  protected readonly faArrowProgress = faArrowProgress;
  protected readonly faArrowRightArrowLeft = faArrowRightArrowLeft;
  protected readonly faObjectExclude = faObjectExclude;
  protected readonly faSwap = faSwap;
  protected readonly faGlobe = faGlobe;
  protected readonly faBook = faBook;
  protected readonly faShieldHalved = faShieldHalved;
  protected readonly faAtom = faAtom;
  protected readonly faDownload = faDownload;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private api: ApiServiceService,
    private priceService: PriceServiceService,
    private router: Router,
    private elementRef: ElementRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private inventoryServ: ProductInventoryServiceService,
    private location: Location
  ) {
  }

  ngOnInit() {
    initFlowbite();
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      this.check_logged=true;
      this.cdr.detectChanges();
    } else {
      this.check_logged=false,
      this.cdr.detectChanges();
    }

    this.id = this.route.snapshot.paramMap.get('id');
    this.inventoryServ.getProduct(this.id).then(data => {
      console.log(data)
      this.prod=data;
      for(let i=0; i<this.prod.prodPrices?.length;i++){
        if(this.prod.productPrice[i].priceType == 'custom'){
          this.checkCustom=true;
        }
      }

      this.api.getProductById(this.prod.productOffering.id).then(prod => {
        this.api.getProductSpecification(prod.productSpecification.id).then(spec => {
          this.prodSpec=spec;
          
          let attachment = spec.attachment
          
          this.productOff={
            id: prod.id,
            name: prod.name,
            category: prod.category,
            description: prod.description,
            lastUpdate: prod.lastUpdate,
            attachment: attachment,
            productOfferingPrice: this.prod.productPrice,
            productSpecification: prod.productSpecification,
            productOfferingTerm: prod.productOfferingTerm,
            serviceLevelAgreement: prod.serviceLevelAgreement,
            version: prod.version
          }
          let profile = this.productOff?.attachment?.filter(item => item.name === 'Profile Picture') ?? [];
          if(profile.length==0){
            this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
            this.attatchments = this.productOff?.attachment?.filter(item => item.attachmentType != 'Picture') ?? [];
          } else {
            this.images = profile;
            this.attatchments = this.productOff?.attachment?.filter(item => item.name != 'Profile Picture') ?? [];
          }

          if(spec.serviceSpecification != undefined){
            for(let j=0; j < spec.serviceSpecification.length; j++){
              this.api.getServiceSpec(spec.serviceSpecification[j].id).then(serv => {
                this.serviceSpecs.push(serv);
              })
            }
          }
          if(spec.resourceSpecification != undefined){
            for(let j=0; j < spec.resourceSpecification.length; j++){
              this.api.getResourceSpec(spec.resourceSpecification[j].id).then(res => {
                this.resourceSpecs.push(res);
              })
            }
          }
  
        })
      })
    })
    this.cdr.detectChanges();
    
  }

  back(){
    this.location.back();
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }

}
