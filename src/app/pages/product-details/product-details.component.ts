import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import {components} from "../../models/product-catalog";
import { initFlowbite } from 'flowbite';
import { PriceServiceService } from 'src/app/services/price-service.service';
type Product = components["schemas"]["ProductOffering"];
type ProductSpecification = components["schemas"]["ProductSpecification"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];
//type CharacteristicValueSpecification = components["schemas"]["CharacteristicValueSpecification"];

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  id:any;
  productOff: Product | undefined;
  category: string = 'none';
  categories: any[] | undefined  = [];
  price: string = '';
  images: AttachmentRefOrValue[]  = [];
  prodSpec:ProductSpecification = {};
  complianceProf:any[] = [];
  serviceSpecs:any[] = [];
  resourceSpecs:any[]=[];

  constructor(
    private route: ActivatedRoute,
    private api: ApiServiceService,
    private priceService: PriceServiceService,
    private router: Router
  ) {
    this.complianceProf.push({id: 'cloudRulebook', name: 'EU Cloud Rulebook', value: 'Not achieved yet', href:'#'})
    this.complianceProf.push({id: 'cloudSecurity', name: 'EU Cloud Security', value: 'Not achieved yet', href:'#'})
    this.complianceProf.push({id: 'iso27001', name: 'ISO 27001', value: 'Not achieved yet', href:'#'})
    this.complianceProf.push({id: 'iso27017', name: 'ISO 27017', value: 'Not achieved yet', href:'#'})
    this.complianceProf.push({id: 'iso17025', name: 'ISO 17025', value: 'Not achieved yet', href:'#'})
  }

  ngOnInit() {
    initFlowbite();
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('--- Details ID:')
    console.log(this.id)    
    this.api.getProductById(this.id).then(prod => {
      console.log('prod')
      console.log(prod)
      this.api.getProductSpecification(prod.productSpecification.id).then(spec => {
        this.prodSpec=spec;
        console.log('--- Prod spec ---')
        console.log(this.prodSpec)
        console.log('------')
        let attachment = spec.attachment
        console.log(spec.attachment)
        let prodPrices: any[] | undefined= prod.productOfferingPrice;
        let prices: any[]=[];
        if(prodPrices!== undefined){
          for(let j=0; j < prodPrices.length; j++){
            this.api.getProductPrice(prodPrices[j].id).then(price => {
              prices.push(price);
            })
          }
        }
        if(this.prodSpec.serviceSpecification != undefined){
          for(let j=0; j < this.prodSpec.serviceSpecification.length; j++){
            this.api.getServiceSpec(this.prodSpec.serviceSpecification[j].id).then(serv => {
              this.serviceSpecs.push(serv);
            })
          }
        }
        if(this.prodSpec.resourceSpecification != undefined){
          for(let j=0; j < this.prodSpec.resourceSpecification.length; j++){
            this.api.getResourceSpec(this.prodSpec.resourceSpecification[j].id).then(res => {
              this.resourceSpecs.push(res);
            })
          }
        }
        console.log('serv specs')
        console.log(this.serviceSpecs)
        this.productOff={
          id: prod.id,
          name: prod.name,
          category: prod.category,
          description: prod.description,
          lastUpdate: prod.lastUpdate,
          attachment: attachment,
          productOfferingPrice: prices,
          productSpecification: prod.productSpecification,
          productOfferingTerm: prod.productOfferingTerm,
          version: prod.version
        }
        this.category = this.productOff?.category?.at(0)?.name ?? 'none';
        this.categories = this.productOff?.category;
        this.price = this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
          this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a';
        this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
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
    })

  }

  goTo(path:string) {
    this.router.navigate([path]);
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }
  getPrice() {
    let result:any= this.priceService.formatCheapestPricePlan(this.productOff);
    return {
      "price": result.price,
      "unit": result.unit,
      "priceType": result.priceType,
      "text": result.text
    }
    /*
    let priceType = this.productOff?.productOfferingPrice?.at(0)?.priceType
    if(priceType == 'recurring'){
      priceType= this.productOff?.productOfferingPrice?.at(0)?.recurringChargePeriodType
    }
    if(priceType == 'usage'){
      priceType= '/ '+this.productOff?.productOfferingPrice?.at(0)?.unitOfMeasure?.units
    }
    return {
      price: this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
        this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a',
      priceType: priceType
    }*/
  }
}
