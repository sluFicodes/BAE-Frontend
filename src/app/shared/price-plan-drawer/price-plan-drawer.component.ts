import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CharacteristicComponent} from "../characteristic/characteristic.component";
import {MarkdownComponent} from "ngx-markdown";
import {components} from "../../models/product-catalog";
import {NgClass} from "@angular/common";
type Product = components["schemas"]["ProductOffering"];
type ProductSpecification = components["schemas"]["ProductSpecification"];


@Component({
  selector: 'app-price-plan-drawer',
  standalone: true,
  imports: [
    CharacteristicComponent,
    MarkdownComponent,
    NgClass
  ],
  templateUrl: './price-plan-drawer.component.html',
  styleUrl: './price-plan-drawer.component.css'
})
export class PricePlanDrawerComponent implements OnInit, OnDestroy {
  @Input() drawerId: string = 'drawer-default'; // ID
  @Input() productOff: Product | undefined;
  @Input() prodSpec:ProductSpecification = {};
  @Input() isOpen: boolean = false; // drawer status
  @Input() width: string = 'w-80'; // manages width
  @Output() closeDrawer = new EventEmitter<void>(); // Event to notify the closing of the drawer

  selectedPricePlanId: string | null = null;
  selectedPricePlan:any = null;

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  ngOnInit(): void {
    // Escuchar eventos de teclado (por si necesitas otros)
    document.addEventListener('keydown', this.handleEscape.bind(this));
  }

  ngOnDestroy(): void {
    // Eliminar eventos de teclado al destruir el componente
    document.removeEventListener('keydown', this.handleEscape.bind(this));
  }

  // Método para cerrar el drawer
  onClose(): void {
    this.isOpen = false;
    this.closeDrawer.emit();
  }

  onPricePlanSelected(pricePlan:any) {
    console.log(pricePlan.id);
    this.selectedPricePlanId = pricePlan.id;
    this.selectedPricePlan = pricePlan;
  }

  onValueChange(event: { characteristicId: string; selectedValue: any }): void {
    //this.form.get(event.characteristicId)?.setValue(event.selectedValue);
    console.log('Selected Value:', event);
  }
}
