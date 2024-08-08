import { Injectable } from '@angular/core';
import { Category } from '../models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { environment } from 'src/environments/environment';
import {components} from "../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;
  CATALOG_LIMIT: number = environment.CATALOG_LIMIT;

  constructor(
    private api: ApiServiceService
  ) { }

  /*
  let options = {
    keywords:any,
    filters:any[],
    partyId:any,
    sort:any,
    isBundle:any
  }
  */

  async getItemsPaginated(page:number, pageSize:any, next:boolean, items:any[], nextItems:any[], options:any,
    handler: (...params: any[]) => Promise<any>): Promise<any> {
    //handler: (page:any,keyword?:any,filters?:any[],partyId?:any) => Promise<any>): Promise<any> {

    try {
      let params: any[] = [page];
      console.log('options')
      console.log(options)
      console.log('page')
      console.log(page)
      if("keywords" in options){
        console.log('key')
        params.push(options.keywords)
        console.log(options.keywords)        
      }
      
      if("filters" in options){
        console.log('filters')
        console.log(options.filters)
        params.push(options.filters)
      }
      if("partyId" in options){
        console.log(options.partyId)
        params.push(options.partyId.toString())
      }
      if("catalogId" in options){
        console.log(options.catalogId)
        params.push(options.catalogId.toString())
      }
      if("sort" in options){
        console.log(options.sort)
        params.push(options.sort)
      }
      if("isBundle" in options){
        console.log(options.isBundle)
        params.push(options.isBundle)
      }

      if(next == false){
        items=[];
        nextItems=[];
        page=0;
        params[0]=page;

        console.log(params)
        //await handler.apply(this, params).then(data => {
        await handler(...params).then(data => {
          console.log('pagination')
          items = data;
          console.log(items)
        }).catch(err => {
          console.log(err)
        });
        page=page+pageSize;

      } else {
        for(let i=0; i<nextItems.length; i++){
          items.push(nextItems[i])
        }
      }
      
      params[0]=page;
      await handler(...params).then(data => {
        nextItems = data;
      })
      page=page+pageSize;

    } catch(err) {
      console.log(err)
    } finally {
      let page_check=true;
      if(nextItems.length>0){
        page_check=true;
      } else {
        page_check=false;
      }

      let info = {
        "page": page,
        "items": items,
        "nextItems": nextItems,
        "page_check": page_check
      }

      return info
    }
  }

  async getProducts(page:number,keywords:any,filters?:Category[]): Promise<ProductOffering[]> {
    let products:ProductOffering[]=[];
    try{
      if(filters)
      if(filters.length == 0){
        await this.api.getProducts(page,keywords).then(async data => {
          //GET PRODUCT INNER INFO
          for(let i=0; i < data.length; i++){
              let attachment: any[]= []
              await this.api.getProductSpecification(data[i].productSpecification.id).then(async spec => {
                attachment = spec.attachment
                let prodPrices: any[] | undefined= data[i].productOfferingPrice;
                let prices: any[]=[];
                if(prodPrices!== undefined){      
                  if(prodPrices.length>0){
                    for(let j=0; j < prodPrices.length; j++){
                      await this.api.getProductPrice(prodPrices[j].id).then(price => {
                        prices.push(price);
                        if(j+1==prodPrices?.length){
                          products.push(
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
                      })
                    }
                  } else {
                    products.push(
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
                  products.push(
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
              })
            }
        })      
      } else {
        await this.api.getProductsByCategory(filters,page,keywords).then(async data => {
            for(let i=0; i < data.length; i++){
              let attachment: any[]= []
              await this.api.getProductSpecification(data[i].productSpecification.id).then(async spec => {
                attachment = spec.attachment
                let prodPrices: any[] | undefined= data[i].productOfferingPrice;
                let prices: any[]=[];
                if(prodPrices!== undefined){
                  if(prodPrices.length>0){        
                    for(let j=0; j < prodPrices.length; j++){
                      await this.api.getProductPrice(prodPrices[j].id).then(price => {
                        prices.push(price);
                        if(j+1==prodPrices?.length){
                          products.push(
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
                      })
                    }
                  } else {
                    products.push(
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
                  products.push(
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
              })
          }
        })
      }
    } finally {
      return products
    }    
  }

  async getProductsByCatalog(page:number,keywords:any,filters?:Category[],id?:any): Promise<ProductOffering[]> {
    let products:ProductOffering[]=[];
    try{
      if(filters)
      if(filters.length == 0){
        await this.api.getProductsByCatalog(id,page).then(async data => {
          for(let i=0; i < data.length; i++){
              let attachment: any[]= []
              await this.api.getProductSpecification(data[i].productSpecification.id).then(async spec => {
                attachment = spec.attachment
                let prodPrices: any[] | undefined= data[i].productOfferingPrice;
                let prices: any[]=[];
                if(prodPrices!== undefined){
                  if(prodPrices.length>0){          
                    for(let j=0; j < prodPrices.length; j++){
                      await this.api.getProductPrice(prodPrices[j].id).then(price => {
                        prices.push(price);
                        if(j+1==prodPrices?.length){
                          products.push(
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
                      })
                    }
                  } else {
                    products.push(
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
                  products.push(
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
            })
          }
        })
      } else {
        await  this.api.getProductsByCategoryAndCatalog(filters,id,page).then(async data => {
          for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            await this.api.getProductSpecification(data[i].productSpecification.id).then(async spec => {
              attachment = spec.attachment
              let prodPrices: any[] | undefined= data[i].productOfferingPrice;
              let prices: any[]=[];
              if(prodPrices!== undefined){   
                if(prodPrices.length>0){         
                  for(let j=0; j < prodPrices.length; j++){
                    await this.api.getProductPrice(prodPrices[j].id).then(price => {
                      prices.push(price);
                      if(j+1==prodPrices?.length){
                        products.push(
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
                    })
                  }
                } else {
                  products.push(
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
                products.push(
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
            })
          }
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      return products
    }
  }

  
}
