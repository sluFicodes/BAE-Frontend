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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';
import {CategoriesFilterComponent} from "./shared/categories-filter/categories-filter.component";
import {CardComponent} from "./shared/card/card.component";
import {BadgeComponent} from "./shared/badge/badge.component";
import { NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryItemComponent} from "./shared/category-item/category-item.component";
import { CartDrawerComponent } from "./shared/cart-drawer/cart-drawer.component";
import {CategoriesPanelComponent} from "./shared/categories-panel/categories-panel.component";
import { SearchCatalogComponent } from "./pages/search-catalog/search-catalog.component";
import { ShoppingCartComponent } from "./pages/shopping-cart/shopping-cart.component";
import { CatalogsComponent } from "./pages/catalogs/catalogs.component";
import { AuthInterceptor } from '../interceptors/auth';

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
    ProductDetailsComponent,
    SearchCatalogComponent,
    CatalogsComponent,
    ShoppingCartComponent
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
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

