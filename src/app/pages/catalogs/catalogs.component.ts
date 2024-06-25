import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { Router } from '@angular/router';
import {components} from "../../models/product-catalog";
type Catalog = components["schemas"]["Catalog"];
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';

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
  filter:any=undefined;
  searchField = new FormControl();
  
  constructor(
    private router: Router,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loading=true;
    this.getCatalogs();
    let input = document.querySelector('[type=search]')
    if(input!=undefined){
      input.addEventListener('input', e => {
        // Easy way to get the value of the element who trigger the current `e` event
        console.log(`Input updated`)
        if(this.searchField.value==''){
          this.filter=undefined;
          this.getCatalogs();
        }
      });
    }

  }

  getCatalogs(){
    this.catalogs=[];
    this.api.getCatalogs(this.page,this.filter).then(data => {
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
      console.log('--- CATALOGS')
      console.log(this.catalogs)
    })
  }

  filterCatalogs(){
    this.filter=this.searchField.value;
    this.page=0;
    this.getCatalogs();
  }

  goToCatalogSearch(id:any) {
    this.router.navigate(['/search/catalogue', id]);
  }

  async next(){
    this.loading_more=true;
    this.page=this.page+this.CATALOG_LIMIT;
    this.cdr.detectChanges;
    console.log(this.page)
    await this.api.getCatalogs(this.page,this.filter).then(data => {
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
    console.log(this.catalogs)
  }

}
