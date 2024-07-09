import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { PriceServiceService } from 'src/app/services/price-service.service';
import { initFlowbite } from 'flowbite';
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import {EventMessageService} from "../../services/event-message.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {Category} from "../../models/interfaces";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-catalog',
  templateUrl: './search-catalog.component.html',
  styleUrl: './search-catalog.component.css'
})
export class SearchCatalogComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private api: ApiServiceService,
    private priceService: PriceServiceService, 
    private cdr: ChangeDetectorRef,
    private eventMessage: EventMessageService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
  }

  id:any;
  catalog:any;
  products: ProductOffering[]=[];
  loading: boolean = false;
  loading_more: boolean = false;
  page_check:boolean = true;
  page: number=0;
  PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;
  showDrawer:boolean=false;
  searchEnabled = environment.SEARCH_ENABLED;

  async ngOnInit() {
    initFlowbite();
    this.id = this.route.snapshot.paramMap.get('id');
    this.api.getCatalog(this.id).then(catalog => {
      this.catalog=catalog;
      this.cdr.detectChanges();
    })
    await this.getProducts(this.localStorage.getObject('selected_categories') as Category[] || []);

    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedFilter' || ev.type === 'RemovedFilter') {
        this.updateProducts();
      }
    })
    console.log('Productos:')
    console.log(this.products)
  }

  @HostListener('document:click')
  onClick() {
    if(this.showDrawer==true){
      this.showDrawer=false;
      this.cdr.detectChanges();
    }
  }

  goTo(path:string) {
    this.router.navigate([path]);
  }

  getProducts(filters:Category[]){    
    console.log('Filtros...')
    console.log(filters)
    if(filters.length == 0){
      console.log(this.id)
      this.api.getProductsByCatalog(this.id,this.page).then(data => {
        if(data.length<this.PRODUCT_LIMIT){
          this.page_check=false;
          this.cdr.detectChanges();
        }else{
          this.page_check=true;
          this.cdr.detectChanges();
        }
        if(data.length==0){
          this.loading=false;
          this.loading_more=false;
        } else {
          for(let i=0; i < data.length; i++){
              let attachment: any[]= []
              this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
                attachment = spec.attachment
                let prodPrices: any[] | undefined= data[i].productOfferingPrice;
                let prices: any[]=[];
                if(prodPrices!== undefined){
                  if(prodPrices.length>0){          
                    for(let j=0; j < prodPrices.length; j++){
                      this.api.getProductPrice(prodPrices[j].id).then(price => {
                        prices.push(price);
                        if(j+1==prodPrices?.length){
                          this.products.push(
                            {
                              id: data[i].id,
                              name: data[i].name,
                              category: data[i].category,
                              description: data[i].description,
                              lastUpdate: data[i].lastUpdate,
                              attachment: attachment,
                              productOfferingPrice: prices,
                              productSpecification: data[i].productSpecification,
                              productOfferingTerm: data[i].productOfferingTerm,
                              version: data[i].version
                            }
                          )
                          this.cdr.detectChanges();
                        }                
                      })
                    }
                  } else {
                    this.products.push(
                      {
                        id: data[i].id,
                        name: data[i].name,
                        category: data[i].category,
                        description: data[i].description,
                        lastUpdate: data[i].lastUpdate,
                        attachment: attachment,
                        productOfferingPrice: prices,
                        productSpecification: data[i].productSpecification,
                        productOfferingTerm: data[i].productOfferingTerm,
                        version: data[i].version
                      })                    
                  }
                } else {
                  this.products.push(
                    {
                      id: data[i].id,
                      name: data[i].name,
                      category: data[i].category,
                      description: data[i].description,
                      lastUpdate: data[i].lastUpdate,
                      attachment: attachment,
                      productOfferingPrice: prices,
                      productSpecification: data[i].productSpecification,
                      productOfferingTerm: data[i].productOfferingTerm,
                      version: data[i].version
                    }
                  )
                }
                this.loading=false;
                this.loading_more=false;
            })
          }
        }
      })
    } else {
      this.api.getProductsByCategoryAndCatalog(filters,this.id,this.page).then(data => {
        if(data.length<this.PRODUCT_LIMIT){
          this.page_check=false;
          this.cdr.detectChanges();
        }else{
          this.page_check=true;
          this.cdr.detectChanges();
        }
        if(data.length==0){
          this.loading=false;
          this.loading_more=false;
        } else {
          for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
              attachment = spec.attachment
              let prodPrices: any[] | undefined= data[i].productOfferingPrice;
              let prices: any[]=[];
              if(prodPrices!== undefined){   
                if(prodPrices.length>0){         
                  for(let j=0; j < prodPrices.length; j++){
                    this.api.getProductPrice(prodPrices[j].id).then(price => {
                      prices.push(price);
                      if(j+1==prodPrices?.length){
                        this.products.push(
                          {
                            id: data[i].id,
                            name: data[i].name,
                            category: data[i].category,
                            description: data[i].description,
                            lastUpdate: data[i].lastUpdate,
                            attachment: attachment,
                            productOfferingPrice: prices,
                            productSpecification: data[i].productSpecification,
                            productOfferingTerm: data[i].productOfferingTerm,
                            version: data[i].version
                          }
                        )
                        this.cdr.detectChanges();
                      }
                    })
                  }
                } else {
                  this.products.push(
                    {
                      id: data[i].id,
                      name: data[i].name,
                      category: data[i].category,
                      description: data[i].description,
                      lastUpdate: data[i].lastUpdate,
                      attachment: attachment,
                      productOfferingPrice: prices,
                      productSpecification: data[i].productSpecification,
                      productOfferingTerm: data[i].productOfferingTerm,
                      version: data[i].version
                    }
                  )                  
                }
              } else {
                this.products.push(
                  {
                    id: data[i].id,
                    name: data[i].name,
                    category: data[i].category,
                    description: data[i].description,
                    lastUpdate: data[i].lastUpdate,
                    attachment: attachment,
                    productOfferingPrice: prices,
                    productSpecification: data[i].productSpecification,
                    productOfferingTerm: data[i].productOfferingTerm,
                    version: data[i].version
                  }
                )
              }
              this.loading=false;
              this.loading_more=false;
            })
          }
        }
      })
    }
  }

  updateProducts() {
    this.products=[];
    this.page=0;
    this.loading=true;
    let filters = this.localStorage.getObject('selected_categories') as Category[] || [] ;
    this.getProducts(filters);
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.PRODUCT_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.getProducts(this.localStorage.getObject('selected_categories') as Category[] || []);
  }
}
