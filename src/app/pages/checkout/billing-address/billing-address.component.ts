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
    telephoneType: '',
    selected: false
  };
  @Output() selectedEvent= new EventEmitter<billingAccountCart>();
  @Output() deletedEvent= new EventEmitter<billingAccountCart>();

  selectBillingAddress($event:Event){
    this.selectedEvent.emit(this.data)
    this.data.selected = true;
  }

  deleteBAddr(){
    console.log("deleting " + this.data.id)
    this.deletedEvent.emit(this.data)
  }
}
