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
    this.getProducts(this.localStorage.getObject('selected_categories') as Category[] || []);

    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedFilter' || ev.type === 'RemovedFilter') {
        this.updateProducts();
      }
    })

  }

  getProducts(filters:Category[]){
    this.products=[];
    console.log('Filtros...')
    console.log(filters)
    if(filters.length == 0){
      this.api.getProducts().then(data => {      
        for(let i=0; i < data.length; i++){
          let check = this.products.find((p => p.id == data[i].id));
          if(check == undefined){
            let attachment: any[]= []
            this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
              attachment = spec.attachment
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
              this.cdr.detectChanges();
            })
          }
        }
        this.loading=false;
      })
    } else {
      for(let f=0; f < filters.length; f++){
        console.log('-- filtro --')
        console.log(filters[f])
        this.api.getProductsByCategory(filters[f].id).then(data => {
          for(let i=0; i < data.length; i++){
            let check = this.products.find((p => p.id == data[i].id));
            console.log('------')
            console.log(check)
            console.log(data[i].name)
            console.log('------')
            if(check == undefined){
              let attachment: any[]= []
              this.api.getProductSpecification(data[i].productSpecification.id).then(spec => {
                attachment = spec.attachment
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
                this.cdr.detectChanges();
              })
            }
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
