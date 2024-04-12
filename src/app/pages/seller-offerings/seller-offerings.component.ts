import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {faIdCard, faSort, faSwatchbook} from "@fortawesome/pro-solid-svg-icons";

@Component({
  selector: 'app-seller-offerings',
  templateUrl: './seller-offerings.component.html',
  styleUrl: './seller-offerings.component.css'
})
export class SellerOfferingsComponent implements OnInit {

  protected readonly faIdCard = faIdCard;
  protected readonly faSort = faSort;
  protected readonly faSwatchbook = faSwatchbook;

  searchField = new FormControl();

  constructor(
  ) {}

  ngOnInit() {
    console.log('init')
  }

  filterInventoryByKeywords(){

  }

  onStateFilterChange(filter:string){

  }

}
