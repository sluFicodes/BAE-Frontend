import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {faCircleCheck} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-regular-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Category} from "../../models/interfaces";
import {Subject} from "rxjs";

@Component({
  selector: 'bae-category-item',
  standalone: true,
  imports: [CommonModule, FaIconComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent implements OnInit {

  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCircle = faCircle;
  checked: boolean = false;
  option: String | undefined;
  labelClass: string = "inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-primary-50 hover:text-gray-600 dark:peer-checked:bg-primary-50 dark:peer-checked:text-secondary-100 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-primary-50";
  @Input() data: Category | undefined;
  @Input() isParent = false;
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input('dismissSubject') dismissSubject: Subject<any> | undefined;
  @Output() checkedEvent = new EventEmitter<Category>();
  @Output() uncheckedEvent = new EventEmitter<Category>();


  ngOnInit() {

    this.dismissSubject?.subscribe(cat => {
      if(this.data?.id === cat.id)
        this.checked = false;
    })

    this.option = this.data?.id;
    if(this.isParent && this.isFirst)
      this.labelClass = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 peer-checked:border-primary-50 dark:peer-checked:bg-primary-50 dark:peer-checked:text-secondary-100 peer-checked:text-gray-600';
    else if(this.isParent && this.isLast)
      this.labelClass = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 peer-checked:border-primary-50 dark:peer-checked:bg-primary-50 dark:peer-checked:text-secondary-100 peer-checked:text-gray-600';
  }

  ngOnDestroy() {
    this.dismissSubject?.unsubscribe();
  }

  onClick(checked:boolean){
    if(!checked) {
      this.checkedEvent.emit(this.data);
      console.log("checked!")
    } else {
      this.uncheckedEvent.emit(this.data);
      console.log("unchecked!")
    }
  }
}
