/* Copyright (c) 2022 Future Internet Consulting and Development Solutions S.L. */

import {NgModule} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const imports: any[] = [
  CommonModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  FontAwesomeModule
];

const declarations: any[] = [
  HeaderComponent,
  FooterComponent
];


@NgModule({
  imports: [...imports],
  exports: [...imports, ...declarations],
  declarations: [...declarations],
  providers:[DatePipe]
})
export class SharedModule { }
