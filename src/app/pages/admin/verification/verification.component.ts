import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventMessageService } from 'src/app/services/event-message.service';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'verification',
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {

  showError: boolean = false;
  errorMessage: string = '';

  verificationForm = new FormGroup({
    productId: new FormControl('', [Validators.required]),
    vc: new FormControl('', [Validators.required]),
  });

  constructor(
    private eventMessage: EventMessageService,
    private productService: ApiServiceService,
    private http: HttpClient
  ) {}

  goBack() {
    this.eventMessage.emitAdminCategories(true);
  }

  verifyCredential() {
    // Get the product specification
    this.productService.getProductSpecification(this.verificationForm.value.productId).then((spec) => {
      let body = {
        productSpecCharacteristic: spec.productSpecCharacteristic != null ? spec.productSpecCharacteristic.filter((char: any) => {
          return char.name != 'Compliance:VC'
        }) : []
      }
      // Add the credential as a characteristic
      body.productSpecCharacteristic.push({
        id: `urn:ngsi-ld:characteristic:${uuidv4()}`,
        name: `Compliance:VC`,
        productSpecCharacteristicValue: [{
          isDefault: true,
          value: this.verificationForm.value.vc
        }]
      })

      // Patch the product specification
      let url = `${environment.BASE_URL}/admin${environment.PRODUCT_CATALOG}${environment.PRODUCT_SPEC}/${spec.id}`;
      return this.http.patch<any>(url, body).subscribe({
        next: data => {
          this.goBack();
        },
        error: error => {
          console.error('There was an error while updating!', error);
          if(error.error.error){
            console.log(error)
            this.errorMessage = 'Error: ' + error.error.error;
          } else {
            this.errorMessage = 'There was an error while uploading the product!';
          }
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        }
      })
    }).catch(() => {
      // Show the error window
      this.errorMessage = 'There was an error reading the product!';

      this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
    })
  }
}
