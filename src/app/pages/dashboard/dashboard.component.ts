import {Component, OnInit} from '@angular/core';
import {EventMessageService} from "../../services/event-message.service";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  isFilterPanelShown = false;
  constructor(private localStorage: LocalStorageService,
              private eventMessage: EventMessageService) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'FilterShown') {
        this.isFilterPanelShown = ev.value as boolean;
      }
    })
  }

  ngOnInit() {
    this.isFilterPanelShown = JSON.parse(this.localStorage.getItem('is_filter_panel_shown') as string);
  }
}
