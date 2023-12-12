import {Component, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {LocalStorageService} from "../../services/local-storage.service";
import {Category} from "../../models/interfaces";
import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'bae-categories-panel',
  standalone: true,
    imports: [
        TranslateModule
    ],
  templateUrl: './categories-panel.component.html',
  styleUrl: './categories-panel.component.css'
})
export class CategoriesPanelComponent implements OnInit {
  selected: Category[] = [];

  constructor(private localStorage: LocalStorageService, private eventMessage: EventMessageService) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedFilter') {
        const index = this.selected.indexOf(ev.value as Category, 0);
        if(index === -1) {
          this.selected.push(ev.value as Category)
        }
      } else if(ev.type === 'RemovedFilter') {
        const index = this.selected.indexOf(ev.value as Category, 0);
        if(index > -1) {
          this.selected.splice(index,1);
        }
      }
    })
  }
  ngOnInit(): void {
    this.selected = this.localStorage.getObject('selected_categories') as Category[] || [] ;
  }

  notifyDismiss(cat: Category) {
    console.log('Category dismissed: '+ JSON.stringify(cat));
    this.localStorage.removeCategoryFilter(cat);
    this.eventMessage.emitRemovedFilter(cat);
  }

}
