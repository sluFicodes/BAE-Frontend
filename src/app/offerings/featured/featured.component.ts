import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventMessageService} from "../../services/event-message.service";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Category} from "../../models/interfaces";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'bae-off-featured',
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css'
})
export class FeaturedComponent {
  constructor(
    private eventMessage: EventMessageService,
    private localStorage: LocalStorageService,
    private router: Router
    ) {
    }
  searchByCategory(){
    //MOCKED CATEGORY
    //TO-DO CHANGE THIS TO MATCH ALL THE CATEGORIES ON THE LIST
    const cat = {
      "id": "urn:ngsi-ld:category:b6d7450f-3da7-4a90-9655-32e6d342ee4a",
      "href": "urn:ngsi-ld:category:b6d7450f-3da7-4a90-9655-32e6d342ee4a",
      "description": "",
      "isRoot": true,
      "lastUpdate": "2024-11-04T08:26:58.683281084Z",
      "lifecycleStatus": "Launched",
      "name": "Software as a Service (SaaS)",
      "validFor": {
          "startDateTime": "2024-11-04T08:26:53.558Z"
      },
      "children": []
    } as Category;
    this.localStorage.addCategoryFilter(cat);
    this.eventMessage.emitAddedFilter(cat);
    this.router.navigate(['/search']);
    
  }
}