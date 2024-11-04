import {Component, HostListener, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrl: './contact-us-form.component.css'
})

export class ContactUsFormComponent implements OnInit {
  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    name: new FormControl(''),
    lastname: new FormControl(''),
    organization: new FormControl(''),
    role: new FormControl(''),
    message: new FormControl('', [Validators.required]),
  });
  
  ngOnInit() {
  }

}
