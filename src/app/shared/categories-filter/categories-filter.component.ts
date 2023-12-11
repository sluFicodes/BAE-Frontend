import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCircle } from "@fortawesome/pro-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {CategoryItemComponent} from "../category-item/category-item.component";
import {Category} from "../../models/interfaces";
import {Subject} from "rxjs";

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
  categories: Category[] = [];
  selected: Category[] = [];
  dismissSubject: Subject<any> = new Subject();

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
        },
        "children": [
          {
            "id": "urn:ngsi-ld:category:b5a00873-b1ed-4c2a-8ed6-bfb4ec5dfacf",
            "href": "urn:ngsi-ld:category:b5a00873-b1ed-4c2a-8ed6-bfb4ec5dfacf",
            "description": "",
            "isRoot": false,
            "lastUpdate": "2023-11-15T15:47:19.713369999Z",
            "lifecycleStatus": "Launched",
            "name": "Computing",
            "parentId": "urn:ngsi-ld:category:8c76c67f-411a-4779-b4dd-c3d8becabffb",
            "version": "1.0",
            "validFor": {
              "startDateTime": "2023-11-15T15:47:19.670Z"
            }
          },
          {
            "id": "urn:ngsi-ld:category:eed13132-41da-4a9e-b64c-996d0f9e4ad4",
            "href": "urn:ngsi-ld:category:eed13132-41da-4a9e-b64c-996d0f9e4ad4",
            "description": "",
            "isRoot": false,
            "lastUpdate": "2023-11-15T15:47:36.968937286Z",
            "lifecycleStatus": "Launched",
            "name": "Storage",
            "parentId": "urn:ngsi-ld:category:8c76c67f-411a-4779-b4dd-c3d8becabffb",
            "version": "1.0",
            "validFor": {
              "startDateTime": "2023-11-15T15:47:36.920Z"
            }
          }
        ]
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
        },
        "children": [
          {
            "id": "urn:ngsi-ld:category:34ed079b-c861-4143-bda3-35a7de3fa8e4",
            "href": "urn:ngsi-ld:category:34ed079b-c861-4143-bda3-35a7de3fa8e4",
            "description": "",
            "isRoot": false,
            "lastUpdate": "2023-11-15T17:17:19.966296751Z",
            "lifecycleStatus": "Launched",
            "name": "Data Procesing",
            "parentId": "urn:ngsi-ld:category:e010e769-bf5f-4d25-b61f-6994da15ee9b",
            "version": "1.0",
            "validFor": {
              "startDateTime": "2023-11-15T17:17:19.921Z"
            }
          }
        ]
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
        },
        "children": [
          {
            "id": "urn:ngsi-ld:category:d2b1501f-a9fd-4a36-a106-2ba4cc3c04fd",
            "href": "urn:ngsi-ld:category:d2b1501f-a9fd-4a36-a106-2ba4cc3c04fd",
            "description": "",
            "isRoot": false,
            "lastUpdate": "2023-11-30T16:12:57.971390294Z",
            "lifecycleStatus": "Launched",
            "name": "BPMN",
            "parentId": "urn:ngsi-ld:category:2767aaee-3dda-4a29-908b-3b20a9071f5a",
            "version": "1.0",
            "validFor": {
              "startDateTime": "2023-11-30T16:12:57.927Z"
            }
          }
        ]
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
        },
        "children": [
          {
            "id": "urn:ngsi-ld:category:fa5552f3-1df7-4151-abba-57e38ec66f75",
            "href": "urn:ngsi-ld:category:fa5552f3-1df7-4151-abba-57e38ec66f75",
            "description": "",
            "isRoot": false,
            "lastUpdate": "2023-11-30T18:25:47.232272234Z",
            "lifecycleStatus": "Launched",
            "name": "Smart Agrifood",
            "parentId": "urn:ngsi-ld:category:505c1169-ae46-42c0-b746-dbb4c32175e0",
            "version": "1.0",
            "validFor": {
              "startDateTime": "2023-11-30T18:25:47.182Z"
            }
          },
          {
            "id": "urn:ngsi-ld:category:94969300-d9fd-4e52-854a-1382d2cdde37",
            "href": "urn:ngsi-ld:category:94969300-d9fd-4e52-854a-1382d2cdde37",
            "description": "",
            "isRoot": false,
            "lastUpdate": "2023-11-30T18:26:47.089203875Z",
            "lifecycleStatus": "Launched",
            "name": "Smart City",
            "parentId": "urn:ngsi-ld:category:505c1169-ae46-42c0-b746-dbb4c32175e0",
            "version": "1.0",
            "validFor": {
              "startDateTime": "2023-11-30T18:26:47.033Z"
            }
          }
        ]
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

  notifyDismiss(cat: Category) {
    this.dismissSubject.next(cat);
    this.removeCategory(cat);
  }

  addCategory(cat: Category) {
    this.selected.push(cat);
  }

  removeCategory(cat: Category) {
    const index = this.selected.indexOf(cat, 0);
    if(index > -1) {
      this.selected.splice(index,1);
    }
  }
}
