import { Component } from '@angular/core';
import {faCircleNodes} from "@fortawesome/pro-solid-svg-icons";
import {faCloudArrowDown} from "@fortawesome/pro-regular-svg-icons";

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  protected readonly faCircleNodes = faCircleNodes;
  protected readonly faCloudArrowDown = faCloudArrowDown;
}
