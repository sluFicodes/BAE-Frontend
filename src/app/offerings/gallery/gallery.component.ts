import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardComponent} from "../../shared/card/card.component";
import {components} from "../../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];

@Component({
  selector: 'bae-off-gallery',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

  p1: ProductOffering;
  p2: ProductOffering;
  p3: ProductOffering;

  constructor() {
    this.p1 = {
      id: '1',
      name: 'ETABox Vessel (IDOM)',
      description: 'Advanced cloud-based solution utilizing AI-driven predictive models to estimate vessel arrivals and departures, tailored for port authorities and shipping companies. Features real-time ETA/ETD dashboards and precise algorithmic accuracy statistics.',
      productOfferingPrice: [
        { priceType: 'per 100 requests',
          price: {
          dutyFreeAmount: {
            unit: 'EUR',
            value: 200
          },
          taxIncludedAmount: {
            unit: 'EUR',
            value: 242 }
          }
        }
      ],
      category: [{ id: '1', name: 'IaaS' }],
      attachment: [{url: 'assets/images/ETABoxVessel_IDOM-Transparent.png', attachmentType: 'image'}]
    }
    this.p2 = {
      id: '2',
      name: 'ETABox Container (IDOM)',
      description: 'AI-enhanced cloud service offering dynamic container arrival predictions, synchronizing transport services. Integrates multi-source data for accurate terminal operations, intuitive interface and comprehensive API support.',
      productOfferingPrice: [{ priceType: 'per 100 requests', price: {dutyFreeAmount: {unit: 'EUR', value: 200}, taxIncludedAmount: {unit: 'EUR', value: 242 }}}],
      category: [{ id: '1', name: 'IaaS' }],
      attachment: [{url: 'assets/images/ETABoxCN_IDOM-Transparent.png', attachmentType: 'image'}]
    }
    this.p3 = {
      id: '3',
      name: 'PaaSPort 4.0 (IDOM)',
      description: 'A cutting-edge Open Innovation Sandbox platform for port and maritime data. Empowers creation of digital solutions through AI, Blockchain, and Big Data within a cloud framework, fostering a community-driven innovation ecosystem, ideal for innovators seeking to develop transformative digital solutions with powerful insights.',
      productOfferingPrice: [{ priceType: 'per session', price: {dutyFreeAmount: {unit: 'EUR', value: 10}, taxIncludedAmount: {unit: 'EUR', value: 12.10 }}}],
      category: [{ id: '1', name: 'IaaS' }],
      attachment: [{url: 'assets/images/PaaSPort_IDOM-Transparent.png', attachmentType: 'image'}]
    }
  }

}
