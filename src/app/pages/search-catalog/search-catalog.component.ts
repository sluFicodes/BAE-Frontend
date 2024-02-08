import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { PriceServiceService } from 'src/app/services/price-service.service';
import { initFlowbite } from 'flowbite';
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import {EventMessageService} from "../../services/event-message.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {Category} from "../../models/interfaces";

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
    private localStorage: LocalStorageService
  ) {
  }

  id:any;
  catalog:any;
  products: ProductOffering[]=[];
  loading: boolean = false;

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

  getProducts(filters:Category[]){
    this.products=[];
    console.log('Filtros...')
    console.log(filters)
    if(filters.length == 0){
      console.log(this.id)
      this.api.getProductsByCatalog(this.id).then(data => {
        console.log('-- catalog products --')
        console.log(data)
        for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
              attachment = spec.attachment
              let prodPrices: any[] | undefined= data[i].productOfferingPrice;
              let prices: any[]=[];
              if(prodPrices!== undefined){            
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
                          version: data[i].version
                        }
                      )
                      this.cdr.detectChanges();
                    }                
                  })
                }
              }
            })
        }
        this.loading=false;
      })
    } else {
      this.api.getProductsByCategoryAndCatalog(filters,this.id).then(data => {
        for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
              attachment = spec.attachment
              let prodPrices: any[] | undefined= data[i].productOfferingPrice;
              let prices: any[]=[];
              if(prodPrices!== undefined){            
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
                          version: data[i].version
                        }
                      )
                      this.cdr.detectChanges();
                    }
                  })
                }
              }
            })
        }
        this.loading=false;
      })
    }
  }

  updateProducts() {
    this.loading=true;
    let filters = this.localStorage.getObject('selected_categories') as Category[] || [] ;
    this.getProducts(filters);
  }
}
