import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {FeaturedComponent} from "./offerings/featured/featured.component";
import {GalleryComponent} from "./offerings/gallery/gallery.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FeaturedComponent,
    GalleryComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
