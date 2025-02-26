import {AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {environment} from "../../../../../environments/environment";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {PaginationService} from "../../../../services/pagination.service";
import {ApiServiceService} from "../../../../services/product-service.service";
import {AppModule} from "../../../../app.module";
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    TranslateModule,
    NgIf,
    NgTemplateOutlet,
    NgClass
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryComponent),
      multi: true
    }
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() formType!: string;
  @Input() data: any;
  @Input() partyId: any;

  //CATEGORIES
  loadingCategory:boolean=false;
  selectedCategories: any[] = [];
  unformattedCategories:any[]=[];
  categories:any[]=[];

  constructor(private api: ApiServiceService,
              private cdr: ChangeDetectorRef) {
  }

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  async ngOnInit() {
    // Si hay valores iniciales en el formulario, los cargamos
    await this.getCategories();
  }

  writeValue(categories: any[]): void {
    this.selectedCategories = categories || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  isCategorySelected(category: any): boolean {
    return this.selectedCategories.some(cat => cat.id === category.id);
  }

  async getCategories() {
    console.log('Obteniendo categorías...');
    this.loadingCategory = true;
    this.categories = []; // Asegurar que siempre es un array

    try {
      const data = await this.api.getLaunchedCategories();

      if (!Array.isArray(data) || data.length === 0) {
        console.error('No hay categorías disponibles.');
        this.loadingCategory = false;
        return;
      }

      console.log('Datos recibidos:', data);

      // Filtrar solo las categorías raíz
      this.categories = data
        .filter(category => category.isRoot)
        .map(category => ({
          ...category,
          expanded: false,
          childrenLoaded: false,
          children: []
        }));

      console.log('Categorías raíz:', this.categories);

      this.loadingCategory = false;
      setTimeout(() => this.cdr.detectChanges(), 0); // Forzar actualización de la vista

    } catch (error) {
      console.error('Error al obtener categorías:', error);
      this.loadingCategory = false;
    }
  }

  async loadChildren(category: any) {
    if (!category) return;

    if (category.childrenLoaded) {
      // 🟢 Si los hijos ya están cargados, solo alternamos `expanded`
      category.expanded = !category.expanded;
      return;
    }

    try {
      console.log(`Cargando hijos de ${category.name}...`);
      const children = await this.api.getCategoriesByParentId(category.id);

      // 🟢 Asignar hijos y marcar como cargados
      category.children = children.map(child => ({
        ...child,
        expanded: false,
        childrenLoaded: false,
        children: []
      }));

      category.childrenLoaded = true;
      category.expanded = true;

      setTimeout(() => this.cdr.detectChanges(), 0); // 🟢 Asegurar actualización de la vista

    } catch (error) {
      console.error(`Error al cargar hijos de ${category.name}:`, error);
    }
  }

  manageCategory(category: any): void {
    if (!category) return;

    const index = this.selectedCategories.findIndex(cat => cat.id === category.id);

    if (index > -1) {
      // 🟢 Si la categoría ya está seleccionada, deseleccionarla
      this.selectedCategories.splice(index, 1);

      // 🔄 Desmarcar todos los hijos recursivamente
      this.removeChildren(category);

    } else {
      // 🟢 Si no está seleccionada, agregarla
      this.selectedCategories.push(category);
      this.addParent(category.parentId);
    }

    this.onChange([...this.selectedCategories]); // Notificar al formulario padre
    this.onTouched();
  }

  removeChildren(category: any): void {
    if (!category.children || category.children.length === 0) return;

    for (let child of category.children) {
      const index = this.selectedCategories.findIndex(cat => cat.id === child.id);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
      // 🔄 Llamada recursiva para eliminar hijos en todos los niveles
      this.removeChildren(child);
    }
  }


  /**
   * Método que marca automáticamente los padres cuando se selecciona un hijo.
   */
  addParent(parentId: string): void {
    if (!parentId) return;

    // 🟢 Buscar el padre en la jerarquía
    const parent = this.findCategoryById(parentId, this.categories);

    if (parent) {
      const alreadySelected = this.selectedCategories.find(item => item.id === parent.id);

      if (!alreadySelected) {
        this.selectedCategories.push(parent);
        this.addParent(parent.parentId); // 🔄 Llamada recursiva para seleccionar toda la cadena ascendente
      }
    }
  }

  /**
   * Método recursivo que busca una categoría en toda la estructura.
   */
  findCategoryById(categoryId: string, categories: any[]): any {
    for (let category of categories) {
      if (category.id === categoryId) return category;
      if (category.children.length > 0) {
        const found = this.findCategoryById(categoryId, category.children);
        if (found) return found;
      }
    }
    return null;
  }

  protected readonly JSON = JSON;

  async toggleCategory(category: any) {
    if (!category) return;

    if (!category.childrenLoaded) {
      // 🔄 Si los hijos no están cargados, cargarlos antes de expandir
      await this.loadChildren(category);
    } else {
      // 🔄 Si ya están cargados, solo alternar la expansión
      category.expanded = !category.expanded;
    }
  }


  ngAfterViewInit() {
    setTimeout(() => this.cdr.detectChanges(), 0);
  }
}
