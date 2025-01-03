import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CharacteristicComponent} from "../characteristic/characteristic.component";
import {MarkdownComponent} from "ngx-markdown";
import {components} from "../../models/product-catalog";
import {CurrencyPipe, NgClass} from "@angular/common";
import {PriceServiceService} from "../../services/price-service.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ShoppingCartServiceService } from 'src/app/services/shopping-cart-service.service';
import {EventMessageService} from "../../services/event-message.service";
import { cartProduct } from 'src/app/models/interfaces';
type Product = components["schemas"]["ProductOffering"];
type ProductSpecification = components["schemas"]["ProductSpecification"];
type ProductOfferingTerm = components["schemas"]["ProductOfferingTerm"];
type ProductSpecificationCharacteristic = components["schemas"]["ProductSpecificationCharacteristic"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];


@Component({
  selector: 'app-price-plan-drawer',
  standalone: true,
  imports: [
    CharacteristicComponent,
    MarkdownComponent,
    NgClass,
    CurrencyPipe,
    ReactiveFormsModule
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

  form: FormGroup;

  selectedPricePlan:any = null;
  isLoading = false; // Loading prices or not
  price: Record<string, number> | null = null; // Object with multiple types of prices (MOCK)
  tsAndCs: ProductOfferingTerm;
  hasProfile: boolean = false;
  isCustom: boolean = false;
  images: AttachmentRefOrValue[]  = [];
  toastVisibility: boolean = false;

  characteristics: ProductSpecificationCharacteristic[] = []; // Características dinámicas

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  constructor(private fb: FormBuilder, private priceService: PriceServiceService,private cartService: ShoppingCartServiceService,private eventMessage: EventMessageService,) {
    // Crear el formulario padre
    this.form = this.fb.group({
      selectedPricePlan: [null, Validators.required], // Plan de precios seleccionado
      characteristics: this.fb.group({}), // Características seleccionadas
      tsAccepted: [false, Validators.requiredTrue] // Checkbox de aceptación de Ts&Cs
    });
  }


  ngOnInit(): void {
    // Escuchar eventos de teclado (por si necesitas otros)
    document.addEventListener('keydown', this.handleEscape.bind(this));

    // Configurar los términos y condiciones
    this.tsAndCs = this.productOff?.productOfferingTerm?.[0] || { description: '' };
    let profile = this.productOff?.attachment?.filter(item => item.name === 'Profile Picture') ?? [];
    console.log('profile...')
    console.log(profile)
    if(profile.length==0){
      this.images = this.productOff?.attachment?.filter(item => item.attachmentType === 'Picture') ?? [];
    } else {
      this.images = profile;
    }
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

  // Handle price plan selection
  onPricePlanSelected(pricePlan: any): void {
    this.form.get('selectedPricePlan')?.setValue(pricePlan);

    // Set chars based on selected price plan
    this.isCustom = pricePlan.priceType === 'custom';
    if (pricePlan.prodSpecCharValueUse) {
      this.characteristics = pricePlan.prodSpecCharValueUse;
      this.hasProfile = true;
    } else {
      this.characteristics = this.prodSpec.productSpecCharacteristic || [];
      this.hasProfile = false;
    }

    // Reconfigurar el grupo de características en el formulario
    const characteristicsGroup = this.fb.group({});
    this.characteristics.forEach((characteristic) => {
      if (characteristic.id != null) {
        const defaultValue = characteristic.productSpecCharacteristicValue?.find(
          (val) => val.isDefault
        )?.value || characteristic.productSpecCharacteristicValue?.find(
          (val) => val.isDefault
        )?.valueFrom;

        characteristicsGroup.addControl(
          characteristic.id,
          this.fb.control(defaultValue || null, Validators.required)
        );
      }
    });
    this.form.setControl('characteristics', characteristicsGroup);

    this.selectedPricePlan = pricePlan;
    console.log(this.selectedPricePlan);
    this.calculatePrice();
  }

  // Handle characteristic value changes
  onValueChange(event: { characteristicId: string; selectedValue: any }): void {
    const characteristicsGroup = this.form.get('characteristics') as FormGroup;
    characteristicsGroup.get(event.characteristicId)?.setValue(event.selectedValue);
    this.calculatePrice();
  }

  // Validate if the form is ready to submit
  isFormValid(): boolean {
    return this.form.valid;
  }

  get objectKeys() {
    return Object.keys;
  }
  // Método para calcular el precio usando el servicio
  calculatePrice(): void {
    const selectedPricePlan = this.form.get('selectedPricePlan')?.value;
    const selectedCharacteristics = this.form.get('characteristics')?.value;

    if (!selectedPricePlan) return;

    this.isLoading = true;
    this.priceService.calculatePrice(selectedPricePlan, selectedCharacteristics).subscribe({
      next: (response) => {
        this.price = response; // Updates the price
        this.isLoading = false; // Hides spinner
      },
      error: () => {
        this.isLoading = false; // Manejo de errores
        console.error('Error al calcular el precio');
      },
    });
  }

  getProductImage() {
    return this.images.length > 0 ? this.images?.at(0)?.url : 'https://placehold.co/600x400/svg';
  }

  async createOrder() { 
    if (this.form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const formValues = this.form.value;
    const orderPayload = {
      productId: this.productOff?.id,
      pricePlan: formValues.selectedPricePlan,
      characteristics: formValues.characteristics,
      tsAccepted: formValues.tsAccepted,
      priceSummary: this.price
    };

    let prodOptions = {
      "id": this.productOff?.id,
      "name":  this.productOff?.name,
      "image": this.getProductImage(),
      "href": this.productOff?.href,
      "options": {
        "characteristics": formValues.characteristics,
        "pricing": this.price
      },
      "termsAccepted": formValues.tsAccepted
    }

    await this.cartService.addItemShoppingCart(prodOptions).subscribe({
      next: data => {
          console.log(data)
          console.log('Update successful');
      },
      error: error => {
          console.error('There was an error while updating!', error);
      }
    });
    this.eventMessage.emitAddedCartItem(this.productOff as cartProduct);

    console.log('Order Payload:', orderPayload);
    this.onClose();
    // Llamar al servicio para crear el pedido
    /*this.productOrderService.createOrder(orderPayload).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.onClose(); // Cerrar el drawer tras crear el pedido
      },
      error: (error) => {
        console.error('Error creating order:', error);
      }
    });*/
  }
}
