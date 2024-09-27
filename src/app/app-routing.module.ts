import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductInventoryComponent } from './pages/product-inventory/product-inventory.component';
import { ProductInvDetailComponent } from './pages/product-inventory/inventory-items/product-inv-detail/product-inv-detail.component';
import { SearchComponent } from "./pages/search/search.component";
import { ProductDetailsComponent } from "./pages/product-details/product-details.component";
import { SearchCatalogComponent } from "./pages/search-catalog/search-catalog.component";
import { CatalogsComponent } from "./pages/catalogs/catalogs.component";
import { ShoppingCartComponent } from "./pages/shopping-cart/shopping-cart.component";
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { SellerOfferingsComponent } from "./pages/seller-offerings/seller-offerings.component";
import { AdminComponent } from "./pages/admin/admin.component";
import { AuthGuard } from './guard/auth.guard';
import { OrganizationDetailsComponent } from "./pages/organization-details/organization-details.component"

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
  { path: 'org-details/:id',
    component: OrganizationDetailsComponent
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
  { path: 'product-inventory/:id',
  component: ProductInvDetailComponent
  },
  { path: 'profile',
  component: UserProfileComponent,
  canActivate: [AuthGuard], data: { roles: ['individual','orgAdmin'] }
  },
  { path: 'my-offerings',
  component: SellerOfferingsComponent,
  canActivate: [AuthGuard], data: { roles: ['seller'] }
  },
  { path: 'admin',
  component: AdminComponent,
  canActivate: [AuthGuard], data: { roles: ['admin'] }
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

