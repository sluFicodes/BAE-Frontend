import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesFilterComponent} from "../../shared/categories-filter/categories-filter.component";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import { ApiServiceService } from 'src/app/services/api-service.service';
import {LocalStorageService} from "../../services/local-storage.service";
import {Category} from "../../models/interfaces";
import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'bae-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  products: ProductOffering[]=[];
  loading: boolean = false;

  constructor(
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService) {
  }

  ngOnInit() {
    console.log('API RESPONSE:')
    this.getProducts(this.localStorage.getObject('selected_categories') as Category[] || []);

    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedFilter' || ev.type === 'RemovedFilter') {
        this.updateProducts();
      }
    })
    console.log('Productos...')
    console.log(this.products)

  }

  getProducts(filters:Category[]){
    this.products=[];
    console.log('Filtros...')
    console.log(filters)
    if(filters.length == 0){
      this.api.getProducts().then(data => {      
        for(let i=0; i < data.length; i++){
          console.log(data[i])
          let attachment: any[]= []
          console.log(data[i].productSpecification.id)
          this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
            attachment = spec.attachment
            console.log(spec.attachment)
            let prodPrices: any[] | undefined= data[i].productOfferingPrice;
            let prices: any[]=[];
            if(prodPrices!== undefined){            
              for(let j=0; j < prodPrices.length; j++){
                this.api.getProductPrice(prodPrices[j].id).then(price => {
                  prices.push(price);
                })
              }
            }
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
          })
        }
        this.loading=false;
      })
    } else {
      for(let f=0; f < filters.length; f++){
        this.api.getProductsByCategory(filters[f].id).then(data => {
          for(let i=0; i < data.length; i++){
            console.log(data[i])
            let attachment: any[]= []
            console.log(data[i].productSpecification.id)
            this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
              attachment = spec.attachment
              console.log(spec.attachment)
              let prodPrices: any[] | undefined= data[i].productOfferingPrice;
              let prices: any[]=[];
              if(prodPrices!== undefined){            
                for(let j=0; j < prodPrices.length; j++){
                  this.api.getProductPrice(prodPrices[j].id).then(price => {
                    prices.push(price);
                  })
                }
              }
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
            })
          }
          this.loading=false;
        })
      }
    }
  }

  updateProducts() {
    this.loading=true;
    let filters = this.localStorage.getObject('selected_categories') as Category[] || [] ;
    this.getProducts(filters);
  }

}
