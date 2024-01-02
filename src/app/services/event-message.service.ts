import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Category} from "../models/interfaces";

export interface EventMessage {
  type: 'AddedFilter' | 'RemovedFilter' | 'AddedCartItem' | 'RemovedCartItem' | 'FilterShown';
  text?: string,
  value?: object | boolean
}


@Injectable({
  providedIn: 'root'
})
export class EventMessageService {

  // Tip: never expose the Subject itself.
  private eventMessageSubject = new Subject<EventMessage>();

  /** Observable of all messages */
  messages$ = this.eventMessageSubject.asObservable();

  /** Emit an event to notify the addition of a filter to the Subject */
  emitAddedFilter(filter: object) {
    this.eventMessageSubject.next({ type: 'AddedFilter', value: filter });
  }
  /** Emit an event to notify the removal of a filter to the Subject */
  emitRemovedFilter(filter: object) {
    this.eventMessageSubject.next({ type: 'RemovedFilter', value: filter });
  }

  /** Emit an event to notify the addition of a filter to the Subject */
  emitAddedCartItem(productOff: object) {
    this.eventMessageSubject.next({ type: 'AddedCartItem', value: productOff });
  }
  /** Emit an event to notify the removal of a filter to the Subject */
  emitRemovedCartItem(productOff: object) {
    this.eventMessageSubject.next({ type: 'RemovedCartItem', value: productOff });
  }
  /** Emit an event to notify if the filter panel is shown or hidden */
  emitFilterShown(shown: boolean) {
    this.eventMessageSubject.next({ type: 'FilterShown', value: shown });
  }
}
