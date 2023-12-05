import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesFilterComponent} from "../../shared/categories-filter/categories-filter.component";

@Component({
  selector: 'bae-search',
  standalone: true,
  imports: [CommonModule, CategoriesFilterComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

}
