import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from "@angular/common";

interface CharacteristicValue {
  isDefault: boolean;
  value: any;
  valueFrom?: number;
  valueTo?: number;
  unitOfMeasure?: string;
}

interface Characteristic {
  id: string;
  name: string;
  description: string;
  productSpecCharacteristicValue: CharacteristicValue[];
}

@Component({
  selector: 'app-characteristic',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './characteristic.component.html',
  styleUrl: './characteristic.component.css'
})
export class CharacteristicComponent implements OnInit {
  @Input() characteristic!: Characteristic;
  @Output() valueChange = new EventEmitter<any>();

  control = new FormControl();

  ngOnInit(): void {
    const defaultValue = this.characteristic.productSpecCharacteristicValue.find(
      (val) => val.isDefault
    )?.value;
    if (defaultValue !== undefined) {
      this.control.setValue(defaultValue);
    }

    // Emit initial value
    this.control.valueChanges.subscribe((value) => {
      this.valueChange.emit({
        characteristicId: this.characteristic.id,
        selectedValue: value,
      });
    });
  }

  isSlider(): boolean {
    const values = this.characteristic.productSpecCharacteristicValue;
    return values.some((val) => val.valueFrom !== undefined && val.valueTo !== undefined);
  }

  getSliderRange(): { min: number; max: number } | null {
    const range = this.characteristic.productSpecCharacteristicValue.find(
      (val) => val.valueFrom !== undefined && val.valueTo !== undefined
    );
    if (range) {
      return { min: range.valueFrom!, max: range.valueTo! };
    }
    return null;
  }

  getUnit(): string | undefined {
    return this.characteristic.productSpecCharacteristicValue[0]?.unitOfMeasure;
  }
}
