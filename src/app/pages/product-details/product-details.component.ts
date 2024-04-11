import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/product-service.service';
import {components} from "../../models/product-catalog";
import { initFlowbite } from 'flowbite';
import { PriceServiceService } from 'src/app/services/price-service.service';
import {faScaleBalanced, faArrowProgress, faArrowRightArrowLeft, faObjectExclude, faSwap, faGlobe, faBook, faShieldHalved} from "@fortawesome/pro-solid-svg-icons";
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

  @ViewChild('detailsContent')
  detailsContent: ElementRef | undefined;
  @ViewChild('charsContent')
  charsContent: ElementRef | undefined;
  @ViewChild('attachContent')
  attachContent: ElementRef | undefined;
  @ViewChild('agreementsContent')
  agreementsContent: ElementRef | undefined;
  @ViewChild('relationshipsContent')
  relationshipsContent: ElementRef | undefined;

  id:any;
  productOff: Product | undefined;
  category: string = 'none';
  categories: any[] | undefined  = [];
  price: string = '';
  images: AttachmentRefOrValue[]  = [];
  attatchments: AttachmentRefOrValue[]  = [];
  prodSpec:ProductSpecification = {};
  complianceProf:any[] = [];
  serviceSpecs:any[] = [];
  resourceSpecs:any[]=[];
  protected readonly faScaleBalanced = faScaleBalanced;
  protected readonly faArrowProgress = faArrowProgress;
  protected readonly faArrowRightArrowLeft = faArrowRightArrowLeft;
  protected readonly faObjectExclude = faObjectExclude;
  protected readonly faSwap = faSwap;
  protected readonly faGlobe = faGlobe;
  protected readonly faBook = faBook;
  protected readonly faShieldHalved = faShieldHalved;

  constructor(
    private route: ActivatedRoute,
    private api: ApiServiceService,
    private priceService: PriceServiceService,
    private elementRef: ElementRef
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
          serviceLevelAgreement: prod.serviceLevelAgreement,
          version: prod.version
        }
        this.category = this.productOff?.category?.at(0)?.name ?? 'none';
        this.categories = this.productOff?.category;
        this.price = this.productOff?.productOfferingPrice?.at(0)?.price?.value + ' ' +
          this.productOff?.productOfferingPrice?.at(0)?.price?.unit ?? 'n/a';
        this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
        this.attatchments = this.productOff?.attachment?.filter(item => item.attachmentType != 'Picture') ?? [];
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

  goToDetails(){
    //const targetElement = this.elementRef.nativeElement.querySelector('#detailsContent');
    if (this.detailsContent!=undefined) {
      this.detailsContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let details_button = document.getElementById('details-button')
    let chars_button = document.getElementById('chars-button')
    let attach_button = document.getElementById('attach-button')
    let agreements_button = document.getElementById('agreements-button')
    let relationships_button = document.getElementById('relationships-button')

    this.selectMenu(details_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(chars_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(attach_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(agreements_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(relationships_button,'text-primary-100 border-b-2 border-primary-100');
  }

  goToChars(){
    if (this.charsContent != undefined) {
      this.charsContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let details_button = document.getElementById('details-button')
    let chars_button = document.getElementById('chars-button')
    let attach_button = document.getElementById('attach-button')
    let agreements_button = document.getElementById('agreements-button')
    let relationships_button = document.getElementById('relationships-button')

    this.unselectMenu(details_button,'text-primary-100 border-b-2 border-primary-100');
    this.selectMenu(chars_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(attach_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(agreements_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(relationships_button,'text-primary-100 border-b-2 border-primary-100');
  }

  goToAttach(){
    if (this.attachContent != undefined) {
      this.attachContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let details_button = document.getElementById('details-button')
    let chars_button = document.getElementById('chars-button')
    let attach_button = document.getElementById('attach-button')
    let agreements_button = document.getElementById('agreements-button')
    let relationships_button = document.getElementById('relationships-button')

    this.unselectMenu(details_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(chars_button,'text-primary-100 border-b-2 border-primary-100');
    this.selectMenu(attach_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(agreements_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(relationships_button,'text-primary-100 border-b-2 border-primary-100');
  }

  goToAgreements(){
    if (this.agreementsContent) {
      this.agreementsContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center'});
    }

    let details_button = document.getElementById('details-button')
    let chars_button = document.getElementById('chars-button')
    let attach_button = document.getElementById('attach-button')
    let agreements_button = document.getElementById('agreements-button')
    let relationships_button = document.getElementById('relationships-button')

    this.unselectMenu(details_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(chars_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(attach_button,'text-primary-100 border-b-2 border-primary-100');
    this.selectMenu(agreements_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(relationships_button,'text-primary-100 border-b-2 border-primary-100');
  }

  goToRelationships(){
    if (this.relationshipsContent != undefined) {
      this.relationshipsContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let details_button = document.getElementById('details-button')
    let chars_button = document.getElementById('chars-button')
    let attach_button = document.getElementById('attach-button')
    let agreements_button = document.getElementById('agreements-button')
    let relationships_button = document.getElementById('relationships-button')

    this.unselectMenu(details_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(chars_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(attach_button,'text-primary-100 border-b-2 border-primary-100');
    this.unselectMenu(agreements_button,'text-primary-100 border-b-2 border-primary-100');
    this.selectMenu(relationships_button,'text-primary-100 border-b-2 border-primary-100');
  }

}
