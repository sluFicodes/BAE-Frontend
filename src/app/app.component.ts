import {Component, OnInit} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from "./services/local-storage.service";
import {Category} from "./models/interfaces";
import {EventMessageService} from "./services/event-message.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DOME Marketplace';
  showPanel = false;

  constructor(private translate: TranslateService,
              private localStorage: LocalStorageService,
              private eventMessage: EventMessageService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    if(!this.localStorage.getObject('selected_categories'))
      this.localStorage.setObject('selected_categories', []);

    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'AddedFilter' || ev.type === 'RemovedFilter') {
        this.checkPanel();
      }
    })
  }
  ngOnInit(): void {
    initFlowbite();
    this.checkPanel();
  }

  checkPanel() {
    const filters = this.localStorage.getObject('selected_categories') as Category[] || [] ;
    const oldState = this.showPanel;
    this.showPanel = filters.length > 0;
    if(this.showPanel != oldState) {
      this.eventMessage.emitFilterShown(this.showPanel);
      this.localStorage.setItem('is_filter_panel_shown', this.showPanel.toString())
    }
  }
}
