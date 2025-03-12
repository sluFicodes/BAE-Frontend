import {Component, EventEmitter, HostListener, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MarkdownTextareaComponent} from "../../../markdown-textarea/markdown-textarea.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass} from "@angular/common";
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-price-component-drawer',
  standalone: true,
  templateUrl: './price-component-drawer.component.html',
  imports: [
    ReactiveFormsModule,
    MarkdownTextareaComponent,
    TranslateModule,
    NgClass
  ],
  styleUrl: './price-component-drawer.component.css'
})
export class PriceComponentDrawerComponent implements OnInit {
  @Input() component: any | null = null;
  @Input() prodChars: any[] | [] = [];
  @Input() profileData: boolean = false;
  @Output() close = new EventEmitter<any | null>();
  @Output() save = new EventEmitter<any>();

  isOpen = false;
  initialized = false;

  priceComponentForm!: FormGroup;
  showValueSelect:boolean=false;
  hideStringCharOption:boolean=true;
  selectedCharacteristic:any=undefined;
  touchedCharCheck:boolean=false;
  selectedCharacteristicVal:any;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,) {}

  ngOnInit() {
    this.initialized = false;
    setTimeout(() => {
      this.isOpen = true;
      this.initialized = true;
    }, 50);

    this.priceComponentForm = this.fb.group({
      name: ['', Validators.required],
      price:['', Validators.required],
      description: [''],
      priceType: ['one time', Validators.required],
      discountValue: [null],
      discountUnit: ['percentage'],
      discountDuration: [null],
      discountDurationUnit: ['days'],
      recurringPeriod: ['monthly'],
      usageUnit: [''],
      selectedCharacteristic:[undefined]
    });

    if (this.component) {
      this.priceComponentForm.patchValue(this.component);
      /*console.log(this.priceComponentForm.get('selectedCharacteristic')?.value[0].productSpecCharacteristicValue)
      if(this.priceComponentForm.get('selectedCharacteristic')?.value[0].productSpecCharacteristicValue){
        console.log('---hola')
        this.showValueSelect=true
      }*/
    }
  }

  submitForm() {
    if (this.priceComponentForm.valid) {
      this.save.emit(this.priceComponentForm.value);
      this.closeDrawer();
    }
  }

  changePriceComponentChar(event: any){
    if(event.target.value==''){
      this.showValueSelect=false;
    } else {      

      let charValue = this.prodChars.find(
        (char: { id: any; }) => char.id === event.target.value
      );
      
      this.selectedCharacteristic = charValue;
      this.cdr.detectChanges();

      if('valueFrom' in this.selectedCharacteristic.productSpecCharacteristicValue[0]){
        this.showValueSelect=false;
      } else if('unitOfMeasure' in this.selectedCharacteristic.productSpecCharacteristicValue[0]){
        this.selectedCharacteristicVal=this.selectedCharacteristic.productSpecCharacteristicValue[0].value;
        this.showValueSelect=true;
      } else {
        this.selectedCharacteristicVal=this.selectedCharacteristic.productSpecCharacteristicValue[0].value;
        this.showValueSelect=true;
        this.hideStringCharOption=false;
      }

      this.priceComponentForm.patchValue({
        selectedCharacteristic: this.mapChars(this.selectedCharacteristicVal)
      });
    }
  }

  private mapChars(charValue:any): any {
    console.log(this.selectedCharacteristic)
    return {
      id: this.selectedCharacteristic.id,
      name: this.selectedCharacteristic.name,
      description: this.selectedCharacteristic.description || '',
      productSpecCharacteristicValue: this.selectedCharacteristic.productSpecCharacteristicValue.map((opt: any) => { 
        return {
          ...opt,
          isDefault: String(opt.value) === String(charValue),
        };
      })
    }
  }

  changePriceComponentCharValue(event: any){
    this.selectedCharacteristicVal=event.target.value;
    this.priceComponentForm.patchValue({
      selectedCharacteristic: this.mapChars(event.target.value)
    });
  }

  closeDrawer() {
    this.isOpen = false;
    // If editing, do nothing; if creating, clear form
    setTimeout(() => this.close.emit(null), 500);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    event.stopPropagation();  // Prevent closing parent drawer
    this.closeDrawer();
  }

  hasKey(obj: any, key: string): boolean {
    return key in obj;
  }
}
