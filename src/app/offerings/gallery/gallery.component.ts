import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'bae-off-gallery',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

}
