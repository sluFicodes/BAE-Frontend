import {Component, EventEmitter, Input, Output} from '@angular/core';
import {billingAccountCart} from "../../../models/interfaces";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-billing-address',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './billing-address.component.html',
  styleUrl: './billing-address.component.css'
})
export class BillingAddressComponent {
  @Input() data: billingAccountCart = {
    id: '',
    href: '',
    name: '',
    email: '',
    postalAddress: {
      city: '',
      country: '',
      postCode: '',
      stateOrProvince: '',
      street: ''
    },
    telephoneNumber: '',
    selected: false
  };
  @Output() selectedEvent= new EventEmitter<billingAccountCart>();

  selectBillingAddress(){
    this.selectedEvent.emit(this.data)
    this.data.selected = true;
  }
}
