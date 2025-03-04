import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-price-plans-table',
  standalone: true,
  imports: [
    NgIf,
    TranslateModule
  ],
  templateUrl: './price-plans-table.component.html',
  styleUrl: './price-plans-table.component.css'
})
export class PricePlansTableComponent {
  private _pricePlans: any[] = [];

  @Input() set pricePlans(value: any) {
    this._pricePlans = Array.isArray(value) ? value : [];
  }

  get pricePlans(): any[] {
    return this._pricePlans;
  }
  @Output() edit = new EventEmitter<any>(); // Emitir evento al editar
  @Output() delete = new EventEmitter<string>(); // Emitir evento al eliminar

  showDeleteModal = false;
  pricePlanToDelete: any | null = null;

  editPricePlan(plan: any) {
    this.edit.emit(plan); // Emitir el evento con el plan a editar
  }

  confirmDelete(plan: any) {
    this.pricePlanToDelete = plan;
    this.showDeleteModal = true;
  }

  deletePricePlan() {
    if (this.pricePlanToDelete) {
      this.delete.emit(this.pricePlanToDelete.id);
      this.showDeleteModal = false;
      this.pricePlanToDelete = null;
    }
  }
}
