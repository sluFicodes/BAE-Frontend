import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductInventoryComponent } from './pages/product-inventory/product-inventory.component';
import { SearchComponent } from "./pages/search/search.component";
import { ProductDetailsComponent } from "./pages/product-details/product-details.component";
import { SearchCatalogComponent } from "./pages/search-catalog/search-catalog.component";
import { CatalogsComponent } from "./pages/catalogs/catalogs.component";
import { ShoppingCartComponent } from "./pages/shopping-cart/shopping-cart.component";
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { SellerOfferingsComponent } from "./pages/seller-offerings/seller-offerings.component";
import { AdminComponent } from "./pages/admin/admin.component";


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  { path: 'search/:id',
    component: ProductDetailsComponent
  },
  { path: 'search/catalogue/:id',
  component: SearchCatalogComponent
  },
  { path: 'catalogues',
  component: CatalogsComponent
  },
  { path: 'shopping-cart',
  component: ShoppingCartComponent
  },
  { path: 'checkout',
    component: CheckoutComponent
  },
  { path: 'product-inventory',
  component: ProductInventoryComponent
  },
  { path: 'profile',
  component: UserProfileComponent
  },
  { path: 'my-offerings',
  component: SellerOfferingsComponent
  },
  { path: 'admin',
  component: AdminComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

