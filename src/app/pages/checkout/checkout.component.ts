import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {LocalStorageService} from "../../services/local-storage.service";
import {EventMessageService} from "../../services/event-message.service";
import {PriceServiceService} from "../../services/price-service.service";
import {ShoppingCartServiceService} from "../../services/shopping-cart-service.service";
import {ApiServiceService} from "../../services/product-service.service";
import {Router} from "@angular/router";
import {billingAccountCart, cartProduct, LoginInfo} from "../../models/interfaces";
import {faCartShopping} from "@fortawesome/sharp-solid-svg-icons";
import {environment} from "../../../environments/environment";
import {TYPES} from "../../models/types.const";
import {AccountServiceService} from "../../services/account-service.service";
import {NumberFormatStyle} from "@angular/common";
import * as moment from "moment/moment";
import {ProductOrderService} from "../../services/product-order-service.service";
import {BillingAddressComponent} from "./billing-address/billing-address.component";
import {BillingAccountFormComponent} from "../../shared/billing-account-form/billing-account-form.component";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  protected readonly faCartShopping = faCartShopping;
  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  TAX_RATE: number = environment.TAX_RATE;
  items: cartProduct[] = [];
  totalPrice: any;
  showBackDrop: boolean = true;
  billingAddresses: billingAccountCart[] = [];
  selectedBillingAddress: any;
  loading: boolean = false;
  loading_baddrs: boolean = false;
  addBill: boolean = false;
  relatedParty: string = '';
  contact = {email: '', username: ''};
  formatter: any;
  preferred:boolean=false;


  constructor(
    private localStorage: LocalStorageService,
    private account: AccountServiceService,
    private orderService: ProductOrderService,
    private eventMessage: EventMessageService,
    private priceService: PriceServiceService,
    private cartService: ShoppingCartServiceService,
    private api: ApiServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router,) {
      this.eventMessage.messages$.subscribe(ev => {
        if(ev.type === 'BillAccChanged') {
          this.getBilling();
        }
        if(ev.value == true){
          this.addBill=false;
        }
      })
  }

  @HostListener('document:click')
  onClick() {
    if(this.addBill==true){
      this.addBill=false;
      this.cdr.detectChanges();
    }
  }

  getPrice(item: any) {
    return {
      'priceType': item.options.pricing.priceType,
      'price': item.options.pricing.price?.value,
      'unit': item.options.pricing.price?.unit,
      'text': item.options.pricing.priceType?.toLocaleLowerCase() == TYPES.PRICE.RECURRING ? item.options.pricing.recurringChargePeriodType : item.options.pricing.priceType?.toLocaleLowerCase() == TYPES.PRICE.USAGE ? '/ ' + item.options.pricing?.unitOfMeasure?.units : ''
    }
  }

  getTotalPrice() {
    this.totalPrice = [];
    let insertCheck = false;
    let priceInfo: any = {};
    for (let i = 0; i < this.items.length; i++) {
      console.log('totalprice')
      console.log(this.items[i])
      insertCheck = false;
      if (this.totalPrice.length == 0) {
        priceInfo = this.getPrice(this.items[i]);
        this.totalPrice.push(priceInfo);
        console.log('Añade primero')
      } else {
        for (let j = 0; j < this.totalPrice.length; j++) {
          priceInfo = this.getPrice(this.items[i]);
          if (priceInfo.priceType == this.totalPrice[j].priceType && priceInfo.unit == this.totalPrice[j].unit && priceInfo.text == this.totalPrice[j].text) {
            this.totalPrice[j].price = this.totalPrice[j].price + priceInfo.price;
            insertCheck = true;
            console.log('suma')
          }
          console.log('precio segundo')
          console.log(priceInfo)
        }
        if (insertCheck == false) {
          this.totalPrice.push(priceInfo);
          insertCheck = true;
          console.log('añade segundo')
        }
      }
    }
    console.log(this.totalPrice)
  }

  goToInventory() {
    this.router.navigate(['/product-inventory']);
  }

  async orderProduct(){
    console.log('buying')
    console.log(moment().utc())
    let products = []
    for(let i = 0; i<this.items.length; i++){
      let char = [];
      let opChars = this.items[i].options.characteristics
      if(opChars != undefined){
        for(let j = 0; j< opChars.length; j++){
          char.push({
            "name": opChars[j].characteristic.name,
            "value": opChars[j].value?.value,
            "valueType": opChars[j].characteristic.valueType
          })
        }
      }

      products.push({
        "id": this.items[i].id,
        "action": "add",
        "state": "acknowledged",
        "productOffering": {
          "id": this.items[i].id,
          "href": this.items[i].id
        },
        "product": {
          "productCharacteristic": char,
          "productPrice": [
            {
              "description": this.items[i].options.pricing?.description,
              "name": this.items[i].options.pricing?.name,
              "price": {
                "taxIncludedAmount": {
                  "value": this.items[i].options.pricing?.price?.value,
                  "unit": this.items[i].options.pricing?.price?.unit
                },
                "taxRate": this.TAX_RATE
              },
              "priceType": this.items[i].options.pricing?.priceType,
              "recurringChargePeriod": this.items[i].options.pricing?.recurringChargePeriodType != undefined ? this.items[i].options.pricing?.recurringChargePeriodType : '',
              "unitOfMeasure": this.items[i].options.pricing?.unitOfMeasure != undefined ? this.items[i].options.pricing?.unitOfMeasure?.units : '',
              "id": this.items[i].options.pricing?.id,
              "productOfferingPrice": {
                "id": this.items[i].options.pricing?.id,
                "href": this.items[i].options.pricing?.href,
              }
            }
          ]
        }
      })
    }
    let productOrder = {
      "state": "acknowledged",
      "productOrderItem": products,
      "relatedParty": [
        {
          "id": this.relatedParty,
          "href": this.relatedParty,
          "role": "Customer"
        }
      ],
      //priority??
      "priority": '4',
      "billingAccount": {
        "id": this.selectedBillingAddress.id,
        "href": this.selectedBillingAddress.id
      },
      "orderDate": moment().utc(),
      "notificationContact": this.selectedBillingAddress.email,
    }
    await this.orderService.postProductOrder(productOrder).subscribe({
      next: data => {
        console.log(data)
        console.log('PROD ORDER DONE');
        this.cartService.emptyShoppingCart().subscribe({
          next: data => {
            console.log(data)
            console.log('EMPTY');
          },
          error: error => {
            console.error('There was an error while updating!', error);
          }
        });
        //window.location.href=`${ShoppingCartComponent.BASE_URL}:${ShoppingCartComponent.API_PORT}/#/inventory/product`;
        this.goToInventory();
      },
      error: error => {
        console.error('There was an error while updating!', error);
      }
    });
  }


  ngOnInit(): void {

    this.formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });


    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if (aux) {
      this.contact.email = aux.email;
      this.contact.username = aux.username;
    }
    if(aux.logged_as==aux.id){
      this.relatedParty = aux.partyId;
    } else {
      let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
      this.relatedParty = loggedOrg.partyId
    }
    
    console.log('--- Login Info ---')
    console.log(aux)

    this.cartService.getShoppingCart().then(data => {
      console.log('---CARRITO API---')
      console.log(data)
      this.items = data;
      this.cdr.detectChanges();
      this.getTotalPrice();
      console.log('------------------')
    })
    console.log('--- ITEMS ---')
    console.log(this.items)

    this.loading_baddrs = true;
    this.getBilling();

  }

  getBilling(){
    this.billingAddresses=[];
    this.account.getBillingAccount().then(data => {
      for (let i = 0; i < data.length; i++) {
        let email = ''
        let phone = ''
        let phoneType = ''
        let address = {
          "city": '',
          "country": '',
          "postCode": '',
          "stateOrProvince": '',
          "street": ''
        }
        if(data[i].contact) {
          for (let j = 0; j < data[i].contact[0].contactMedium.length; j++) {
            if (data[i].contact[0].contactMedium[j].mediumType == 'Email') {
              email = data[i].contact[0].contactMedium[j].characteristic.emailAddress
            } else if (data[i].contact[0].contactMedium[j].mediumType == 'PostalAddress') {
              address = {
                "city": data[i].contact[0].contactMedium[j].characteristic.city,
                "country": data[i].contact[0].contactMedium[j].characteristic.country,
                "postCode": data[i].contact[0].contactMedium[j].characteristic.postCode,
                "stateOrProvince": data[i].contact[0].contactMedium[j].characteristic.stateOrProvince,
                "street": data[i].contact[0].contactMedium[j].characteristic.street1
              }
            } else if (data[i].contact[0].contactMedium[j].mediumType == 'TelephoneNumber') {
              phone = data[i].contact[0].contactMedium[j].characteristic.phoneNumber
              phoneType = data[i].contact[0].contactMedium[j].characteristic.contactType
            }
          }
        }
        const baddr = {
          "id": data[i].id,
          "href": data[i].href,
          "name": data[i].name,
          "email": email ?? '',
          "postalAddress": address ?? {},
          "telephoneNumber": phone ?? '',
          "telephoneType": phoneType ?? '',
          "selected": i == 0
        }
        this.billingAddresses.push(baddr)
        if (i == 0) {
          this.selectedBillingAddress = baddr
        }
      }
      console.log('billing account...')
      console.log(this.billingAddresses)
      this.loading_baddrs = false;
      if(this.billingAddresses.length>0){
        this.preferred=false;
      }else{
        this.preferred=true;
      }
    })
  }

  onSelected(baddr:billingAccountCart){
    for(let ba of this.billingAddresses){
      ba.selected = false;
    }
    this.selectedBillingAddress = baddr;
  }

  onDeleted(baddr: billingAccountCart) {
    console.log('holi')
    this.account.deleteBillingAccount(baddr.id).subscribe({
        next: result => {
          console.log('--- DELETE BILLING ADDRESS ---')
          console.log(baddr.id)
          this.billingAddresses.filter(item => item.id != baddr.id)
        },
        error: error => {
          console.log('--- ERROR WHILE DELETING BILLING ADDRESS ---')
          console.log(error)
        }
      }
    )
  }
}
