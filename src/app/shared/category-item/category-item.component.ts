import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faCircleCheck} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-regular-svg-icons";
import {Category} from "../../models/interfaces";
import {Subject} from "rxjs";
import {EventMessageService} from "../../services/event-message.service";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'bae-category-item',
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent implements OnInit {

  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCircle = faCircle;
  checked: boolean = false;
  option: String | undefined;
  labelClass: string = "inline-flex items-center justify-between w-full px-5 py-3 text-gray-500 bg-white border-2 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-primary-50 hover:text-gray-600 dark:peer-checked:bg-primary-50 dark:peer-checked:text-secondary-100 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-primary-50";
  @Input() data: Category | undefined;
  @Input() isParent = false;
  @Input() isFirst = false;
  @Input() isLast = false;

  constructor(private localStorage: LocalStorageService, private eventMessage: EventMessageService) {
    this.eventMessage.messages$.subscribe(ev => {
      const cat = ev.value as Category;
      if(ev.type === 'AddedFilter' && cat?.id === this.data?.id) {
          this.checked = true;
      } else if(ev.type === 'RemovedFilter' && cat?.id === this.data?.id) {
        this.checked = false;
      }
    })
  }

  ngOnInit() {

    const categories = this.localStorage.getObject('selected_categories') as Category[] || [] ;
    if(categories.length >0){
      const index = categories.findIndex((item:Category) => item.id === this.data?.id);
      if(index > -1) {
        this.checked = true;
      }
    }
    this.option = this.data?.id;
    if(this.isParent && this.isFirst)
      this.labelClass = 'flex items-center justify-between w-full px-5 py-3 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 peer-checked:border-primary-50 dark:peer-checked:bg-primary-50 dark:peer-checked:text-secondary-100 peer-checked:text-gray-600';
    else if(this.isParent && this.isLast)
      this.labelClass = 'flex items-center justify-between w-full px-5 py-3 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 peer-checked:border-primary-50 dark:peer-checked:bg-primary-50 dark:peer-checked:text-secondary-100 peer-checked:text-gray-600';
  }

  onClick(checked:boolean){
    if(!checked) {
      this.localStorage.addCategoryFilter(this.data as Category);
      this.eventMessage.emitAddedFilter(this.data as Category);
    } else {
      this.localStorage.removeCategoryFilter(this.data as Category);
      this.eventMessage.emitRemovedFilter(this.data as Category);
    }
    this.checked = !this.checked;
  }
}
