import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {faAddressCard} from "@fortawesome/sharp-solid-svg-icons";
import {faCloud} from "@fortawesome/pro-solid-svg-icons";

@Component({
  selector: 'bae-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input() category = 'Default'
    protected readonly faAddressCard = faAddressCard;
  protected readonly faCloud = faCloud;
}
