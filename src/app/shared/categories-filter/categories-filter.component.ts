import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCircle } from "@fortawesome/pro-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {CategoryItemComponent} from "../category-item/category-item.component";

@Component({
  selector: 'bae-categories-filter',
  standalone: true,
  imports: [CommonModule, FaIconComponent, FormsModule, CategoryItemComponent],
  templateUrl: './categories-filter.component.html',
  styleUrl: './categories-filter.component.css'
})
export class CategoriesFilterComponent {

  classListFirst = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3';
  classListLast  = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3';
  classList      = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3';
  categories:{
    "id"?: String,
    "href"?: String,
    "description"?: String,
    "isRoot"?: Boolean,
    "lastUpdate"?: String,
    "lifecycleStatus"?: String,
    "name": String,
    "version"?: String,
    "validFor"?: Object
  }[] = [];

  constructor() {
    this.categories = [
      {
        "id": "urn:ngsi-ld:category:8c76c67f-411a-4779-b4dd-c3d8becabffb",
        "href": "urn:ngsi-ld:category:8c76c67f-411a-4779-b4dd-c3d8becabffb",
        "description": "",
        "isRoot": true,
        "lastUpdate": "2023-11-15T15:47:01.820395551Z",
        "lifecycleStatus": "Launched",
        "name": "Cloud Services",
        "version": "1.0",
        "validFor": {
          "startDateTime": "2023-11-15T15:47:01.789Z"
        }
      },
      {
        "id": "urn:ngsi-ld:category:e010e769-bf5f-4d25-b61f-6994da15ee9b",
        "href": "urn:ngsi-ld:category:e010e769-bf5f-4d25-b61f-6994da15ee9b",
        "description": "",
        "isRoot": true,
        "lastUpdate": "2023-11-15T17:16:38.438835476Z",
        "lifecycleStatus": "Launched",
        "name": "Data",
        "version": "1.0",
        "validFor": {
          "startDateTime": "2023-11-15T17:16:38.412Z"
        }
      },
      {
        "id": "urn:ngsi-ld:category:2767aaee-3dda-4a29-908b-3b20a9071f5a",
        "href": "urn:ngsi-ld:category:2767aaee-3dda-4a29-908b-3b20a9071f5a",
        "description": "",
        "isRoot": true,
        "lastUpdate": "2023-11-30T16:12:44.638954741Z",
        "lifecycleStatus": "Launched",
        "name": "Process Management",
        "version": "1.0",
        "validFor": {
          "startDateTime": "2023-11-30T16:12:44.607Z"
        }
      },
      {
        "id": "urn:ngsi-ld:category:505c1169-ae46-42c0-b746-dbb4c32175e0",
        "href": "urn:ngsi-ld:category:505c1169-ae46-42c0-b746-dbb4c32175e0",
        "description": "",
        "isRoot": true,
        "lastUpdate": "2023-11-30T18:22:24.256206727Z",
        "lifecycleStatus": "Launched",
        "name": "Smart Domains",
        "version": "1.0",
        "validFor": {
          "startDateTime": "2023-11-30T18:22:24.229Z"
        }
      },
      {
        "id": "urn:ngsi-ld:category:4d0140ec-4efb-4266-bb3a-acb4e9c6bb7b",
        "href": "urn:ngsi-ld:category:4d0140ec-4efb-4266-bb3a-acb4e9c6bb7b",
        "description": "",
        "isRoot": true,
        "lastUpdate": "2023-11-30T18:22:34.236194104Z",
        "lifecycleStatus": "Launched",
        "name": "Smart Ports",
        "version": "1.0",
        "validFor": {
          "startDateTime": "2023-11-30T18:22:34.205Z"
        }
      }
    ];
  }
  getId(id: String) {
    return id.split(':').pop()?.replace(/-/g, "");
  }
}
