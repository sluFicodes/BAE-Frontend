import {Component, EventEmitter, OnInit, Output, ChangeDetectorRef, Input} from '@angular/core';
import {Category} from "../../models/interfaces";
import {Subject} from "rxjs";
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";
import { ApiServiceService } from 'src/app/services/product-service.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'bae-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrl: './categories-filter.component.css'
})
export class CategoriesFilterComponent implements OnInit {

  classListFirst = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3';
  classListLast  = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3';
  classList      = 'flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3';
  categories: Category[] = [];
  selected: Category[] = [];
  dismissSubject: Subject<any> = new Subject();
  catalog:any;
  @Output() selectedCategories = new EventEmitter<Category[]>();
  @Input() catalogId: any = undefined;

  constructor(
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef
    ) {
      this.categories = [];
    }

  async ngOnInit() {
    this.selected = this.localStorage.getObject('selected_categories') as Category[] || [] ;
    if(this.catalogId!=undefined){
      this.api.getCatalog(this.catalogId).then(data => {
        if(data.category){
          for (let i=0; i<data.category.length; i++){
            this.api.getCategoryById(data.category[i].id).then(categoryInfo => {
              this.findChildrenByParent(categoryInfo);
            })
          }
          initFlowbite();
        } else {
          this.api.getCategories().then(data => {
            for(let i=0; i < data.length; i++){
              this.findChildren(data[i],data)
            }
            this.cdr.detectChanges();
            initFlowbite();
          })           
        }
      })
    } else {
      await this.api.getCategories().then(data => {
        for(let i=0; i < data.length; i++){
          this.findChildren(data[i],data)
        }
        this.cdr.detectChanges();
        initFlowbite();

        console.log('--- CATEGORIES ---')
        console.log(this.categories)
        console.log('------------------')
      }) 
    }
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  findChildren(parent:any,data:any[]){
    let childs = data.filter((p => p.parentId === parent.id));
    parent["children"] = childs;
    if(parent.isRoot == true){
      this.categories.push(parent)
    } else {
      this.saveChildren(this.categories,parent)
    }
    if(childs.length != 0){
      for(let i=0; i < childs.length; i++){
        this.findChildren(childs[i],data)
      }
    }
  }

  findChildrenByParent(parent:any){
    let childs: any[] = []
    this.api.getCategoriesByParentId(parent.id).then(c => {
      childs=c;
      parent["children"] = childs;
      if(parent.isRoot == true){
        this.categories.push(parent)
      } else {
        this.saveChildren(this.categories,parent)
      }
      if(childs.length != 0){
        for(let i=0; i < childs.length; i++){
          this.findChildrenByParent(childs[i])
        }
      }
      initFlowbite();
    })

  }

  saveChildren(superCategories:any[],parent:any){
    for(let i=0; i < superCategories.length; i++){
      let children = superCategories[i].children;
      if (children != undefined){
        let check = children.find((element: { id: any; }) => element.id == parent.id) 
        if (check != undefined) {
          let idx = children.findIndex((element: { id: any; }) => element.id == parent.id)
          children[idx] = parent
          superCategories[i].children = children         
        }
        this.saveChildren(children,parent)
      }          
    }
  }

  notifyDismiss(cat: Category) {
    this.dismissSubject.next(cat);
    this.removeCategory(cat);
  }

  addCategory(cat: Category) {
    this.selected.push(cat);
    this.selectedCategories.emit(this.selected);
    this.localStorage.setObject('selected_categories', this.selected);
    this.eventMessage.emitAddedFilter(cat);
  }

  removeCategory(cat: Category) {
    const index = this.selected.indexOf(cat, 0);
    if(index > -1) {
      this.selected.splice(index,1);
      this.selectedCategories.emit(this.selected);
      this.localStorage.setObject('selected_categories', this.selected);
      this.eventMessage.emitRemovedFilter(cat);
    }
  }
  
  isRoot(cat: Category,idx:any){
    const index = this.categories.indexOf(cat, 0);
    let children = this.categories[index].children;
    let accordion = document.getElementById("accordion-collapse");

    if (children != undefined && children.length >0) {
      console.log('Es padre')
      return children
    } else {
      return []
    }

  }

}
