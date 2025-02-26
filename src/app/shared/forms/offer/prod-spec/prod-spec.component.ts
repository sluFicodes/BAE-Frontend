import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {DatePipe, NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ProductSpecServiceService} from "../../../../services/product-spec-service.service";
import {PaginationService} from "../../../../services/pagination.service";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-prod-spec-form',
  standalone: true,
  imports: [
    DatePipe,
    TranslateModule,
    NgClass
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProdSpecComponent),
      multi: true
    }
  ],
  templateUrl: './prod-spec.component.html',
  styleUrl: './prod-spec.component.css'
})
export class ProdSpecComponent implements ControlValueAccessor, OnInit {

  @Input() formType!: string;
  @Input() data: any;
  @Input() partyId: any;
  @Input() bundleChecked: boolean = false;

  selectedProdSpecInternal: any = null;

  //PAGE SIZES:
  PROD_SPEC_LIMIT: number = environment.PROD_SPEC_LIMIT;

  prodSpecPage=0;
  prodSpecPageCheck:boolean=false;
  loadingProdSpec:boolean=false;
  loadingProdSpec_more:boolean=false;
  prodSpecs:any[]=[];
  nextProdSpecs:any[]=[];

  protected readonly FormControl = FormControl;

  constructor(private prodSpecService: ProductSpecServiceService,
              private paginationService: PaginationService) {
  }

  async ngOnInit() {
    await this.getSellerProdSpecs(false);
  }

  async getSellerProdSpecs(next:boolean){
    if(!next){
      this.loadingProdSpec=true;
    }

    let options = {
      "filters": ['Active','Launched'],
      "partyId": this.partyId
    }

    this.paginationService.getItemsPaginated(this.prodSpecPage, this.PROD_SPEC_LIMIT, next, this.prodSpecs,this.nextProdSpecs, options,
      this.prodSpecService.getProdSpecByUser.bind(this.prodSpecService)).then(data => {
        this.prodSpecPageCheck=data.page_check;
        this.prodSpecs=data.items;
        this.nextProdSpecs=data.nextItems;
        this.prodSpecPage=data.page;
        this.loadingProdSpec=false;
        this.loadingProdSpec_more=false;
      })
  }

  async nextProdSpec() {
    await this.getSellerProdSpecs(true);
  }

  getStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      "Active": "text-blue-600 border-blue-400",
      "Launched": "text-green-500 border-green-500",
      "Retired": "text-yellow-500 border-yellow-500",
      "Obsolete": "text-red-500 border-red-500"
    };
    return statusClasses[status] || "text-gray-500 border-gray-400";
  }

  getBundleClass(isBundle: boolean): string {
    return isBundle ? "text-green-500 border-green-500" : "text-blue-600 border-blue-400";
  }

  // As ControlValueAccessor
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(prodSpec: any): void {
    this.selectedProdSpecInternal = prodSpec;
    this.onChange(prodSpec);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  isSelected(prodId: string): boolean {
    return this.selectedProdSpecInternal?.id === prodId;
  }

  toggleSelection(prod: any): void {
    // Si el producto ya está seleccionado, lo deseleccionamos. Si no, lo seleccionamos.
    this.selectedProdSpecInternal = this.selectedProdSpecInternal?.id === prod.id ? null : prod;
    this.onChange(this.selectedProdSpecInternal);
    this.onTouched();
  }

  getRowClass(prodId: string): string {
    return prodId === this.selectedProdSpecInternal?.id
      ? "bg-white dark:bg-secondary-100"
      : "bg-white dark:bg-secondary-300";
  }
}

