import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardComponent} from "../../shared/card/card.component";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'bae-off-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {

  products: ProductOffering[]=[];

  constructor(
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('API RESPONSE:')
    this.api.getProducts().then(data => {      
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
    })

    console.log('Productos...')
    console.log(this.products)
  }

}
