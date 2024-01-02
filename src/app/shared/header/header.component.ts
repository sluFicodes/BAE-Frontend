import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  faCartShopping,
  faHandHoldingBox,
  faAddressCard,
  faArrowRightFromBracket
} from "@fortawesome/sharp-solid-svg-icons";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'bae-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

  @ViewChild('theme_toggle_dark_icon') themeToggleDarkIcon: ElementRef;
  @ViewChild('theme_toggle_light_icon') themeToggleLightIcon: ElementRef;

  constructor(themeToggleDarkIcon: ElementRef,
              themeToggleLightIcon: ElementRef,
              private localStorage: LocalStorageService) {

    this.themeToggleDarkIcon = themeToggleDarkIcon;
    this.themeToggleLightIcon = themeToggleLightIcon;

  }

  ngAfterViewInit() {
    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.themeToggleLightIcon.nativeElement.classList.remove('hidden');
    } else {
      this.themeToggleDarkIcon.nativeElement.classList.remove('hidden');
    }
  }
  toggleDarkMode() {
    // toggle icons inside button
    this.themeToggleDarkIcon.nativeElement.classList.toggle('hidden');
    this.themeToggleLightIcon.nativeElement.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  }

  protected readonly faCartShopping = faCartShopping;
  protected readonly faHandHoldingBox = faHandHoldingBox;
  protected readonly faAddressCard = faAddressCard;
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;
}
