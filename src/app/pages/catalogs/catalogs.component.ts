import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Router } from '@angular/router';
import {components} from "../../models/product-catalog";
type Catalog = components["schemas"]["Catalog"];
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.css'
})
export class CatalogsComponent implements OnInit{
  catalogs:Catalog[]=[];
  page:number=0;
  CATALOG_LIMIT: number = environment.CATALOG_LIMIT;
  loading: boolean = false;
  loading_more: boolean = false;
  page_check:boolean = true;
  constructor(
    private router: Router,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loading=true;
    this.api.getCatalogs(this.page).then(data => {
      if(data.length<this.CATALOG_LIMIT){
        this.page_check=false;
        this.cdr.detectChanges();
      }else{
        this.page_check=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.catalogs.push(data[i])
      }
      this.loading=false;
    })
  }

  goToCatalogSearch(id:any) {
    this.router.navigate(['/search/catalog', id]);
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.CATALOG_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.api.getCatalogs(this.page).then(data => {
      if(data.length<this.CATALOG_LIMIT){
        this.page_check=false;
        this.cdr.detectChanges();
      }else{
        this.page_check=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.catalogs.push(data[i])
      }
      this.loading_more=false;
    })
  }

}
