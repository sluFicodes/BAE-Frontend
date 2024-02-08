import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Router } from '@angular/router';
import {components} from "../../models/product-catalog";
type Catalog = components["schemas"]["Catalog"];

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.css'
})
export class CatalogsComponent implements OnInit{
  catalogs:Catalog[]=[];
  constructor(
    private router: Router,
    private api: ApiServiceService
  ) {
  }

  ngOnInit() {
    this.api.getCatalogs().then(data => {
      this.catalogs=data;
    })
  }

  goToCatalogSearch(id:any) {
    this.router.navigate(['/search/catalog', id]);
  }

}
