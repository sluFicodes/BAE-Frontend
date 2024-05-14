import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FeaturedComponent } from "./offerings/featured/featured.component";
import { GalleryComponent } from "./offerings/gallery/gallery.component";
import { ExploreDomeComponent } from "./offerings/explore-dome/explore-dome.component";
import { PlatformBenefitsComponent } from "./offerings/platform-benefits/platform-benefits.component";
import { HowItWorksComponent } from "./offerings/how-it-works/how-it-works.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SearchComponent } from "./pages/search/search.component";
import { ProductDetailsComponent } from "./pages/product-details/product-details.component";
import { ProductInventoryComponent } from "./pages/product-inventory/product-inventory.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { SellerOfferingsComponent } from "./pages/seller-offerings/seller-offerings.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';
import {CategoriesFilterComponent} from "./shared/categories-filter/categories-filter.component";
import {CardComponent} from "./shared/card/card.component";
import {BadgeComponent} from "./shared/badge/badge.component";
import {BillingAccountFormComponent} from "./shared/billing-account-form/billing-account-form.component";
import { NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryItemComponent} from "./shared/category-item/category-item.component";
import { CartDrawerComponent } from "./shared/cart-drawer/cart-drawer.component";
import {CategoriesPanelComponent} from "./shared/categories-panel/categories-panel.component";
import { SearchCatalogComponent } from "./pages/search-catalog/search-catalog.component";
import { ShoppingCartComponent } from "./pages/shopping-cart/shopping-cart.component";
import { BillingAddressComponent } from "./pages/checkout/billing-address/billing-address.component";
import { CatalogsComponent } from "./pages/catalogs/catalogs.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { RequestInterceptor } from './interceptors/requests-interceptor';
import { MarkdownModule } from 'ngx-markdown';
import { InventoryProductsComponent } from './pages/product-inventory/inventory-items/inventory-products/inventory-products.component';
import { UserInfoComponent } from './pages/user-profile/profile-sections/user-info/user-info.component';
import { BillingInfoComponent } from './pages/user-profile/profile-sections/billing-info/billing-info.component';
import { OrderInfoComponent } from './pages/user-profile/profile-sections/order-info/order-info.component';
import { SellerCatalogsComponent } from './pages/seller-offerings/offerings/seller-catalogs/seller-catalogs.component';
import { SellerProductSpecComponent } from './pages/seller-offerings/offerings/seller-product-spec/seller-product-spec.component';
import { SellerServiceSpecComponent } from './pages/seller-offerings/offerings/seller-service-spec/seller-service-spec.component';
import { SellerResourceSpecComponent } from './pages/seller-offerings/offerings/seller-resource-spec/seller-resource-spec.component';
import { SellerOfferComponent } from './pages/seller-offerings/offerings/seller-offer/seller-offer.component';
import { CreateProductSpecComponent } from './pages/seller-offerings/offerings/seller-product-spec/create-product-spec/create-product-spec.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CreateServiceSpecComponent } from './pages/seller-offerings/offerings/seller-service-spec/create-service-spec/create-service-spec.component';
import { CreateResourceSpecComponent } from './pages/seller-offerings/offerings/seller-resource-spec/create-resource-spec/create-resource-spec.component';
import { CreateOfferComponent } from './pages/seller-offerings/offerings/seller-offer/create-offer/create-offer.component';
import {CategoriesRecursionComponent} from "./shared/categories-recursion/categories-recursion.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SearchComponent,
    FeaturedComponent,
    GalleryComponent,
    PlatformBenefitsComponent,
    HowItWorksComponent,
    ExploreDomeComponent,
    CategoriesFilterComponent,
    CategoryItemComponent,
    CardComponent,
    BadgeComponent,
    //CartDrawerComponent,
    BillingAddressComponent,
    CheckoutComponent,
    ProductDetailsComponent,
    SearchCatalogComponent,
    CatalogsComponent,
    ShoppingCartComponent,
    ProductInventoryComponent,
    BillingAccountFormComponent,
    UserProfileComponent,
    SellerOfferingsComponent,
    InventoryProductsComponent,
    UserInfoComponent,
    BillingInfoComponent,
    OrderInfoComponent,
    SellerCatalogsComponent,
    SellerProductSpecComponent,
    SellerServiceSpecComponent,
    SellerResourceSpecComponent,
    SellerOfferComponent,
    CreateProductSpecComponent,
    CreateServiceSpecComponent,
    CreateResourceSpecComponent,
    CreateOfferComponent,
    CategoriesRecursionComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    SharedModule,
    AppRoutingModule,
    NgOptimizedImage,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    PickerComponent,
    NgxFileDropModule,
    MarkdownModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CategoriesPanelComponent,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    }
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

