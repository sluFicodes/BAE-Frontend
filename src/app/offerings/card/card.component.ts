import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BadgeComponent} from "../../commons/badge/badge.component";

@Component({
  selector: 'bae-off-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

}
