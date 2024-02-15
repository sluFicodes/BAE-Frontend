import { Component, OnInit, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesFilterComponent} from "../../shared/categories-filter/categories-filter.component";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import { ApiServiceService } from 'src/app/services/api-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import {Category} from "../../models/interfaces";
import {EventMessageService} from "../../services/event-message.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'bae-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  products: ProductOffering[]=[];
  loading: boolean = false;
  loading_more: boolean = false;
  page: number=0;
  PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;

  constructor(
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService) {
  }

  async ngOnInit() {
    this.products=[];
    this.loading=true;
    await this.getProducts(this.localStorage.getObject('selected_categories') as Category[] || []);

    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedFilter' || ev.type === 'RemovedFilter') {
        this.updateProducts();
      }
    })

  }

  getProducts(filters:Category[]){
    console.log('Filtros...')
    console.log(filters)
    if(filters.length == 0){
      this.api.getProducts(this.page).then(data => {      
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
        this.loading_more=false;
      })
    } else {
      this.api.getProductsByCategory(filters,this.page).then(data => {
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
        this.loading_more=false;
      })
    }
  }

  updateProducts() {
    this.loading=true;
    this.products=[];
    this.page=0;
    this.cdr.detectChanges();
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
