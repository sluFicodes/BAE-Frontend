import { Injectable } from '@angular/core';
import {Category} from "../models/interfaces";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Set a value in local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Set an object in local storage
  setObject(key: string, value: object): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Get an object from local storage
  getObject(key: string): object | null {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }

  addCategoryFilter(value: Category): void {
    const filters = JSON.parse(localStorage.getItem('selected_categories') || '[]');
    const index = filters.findIndex((item:Category) => item.id === value.id);
    if(index === -1) {
      filters.push(value);
      localStorage.setItem('selected_categories', JSON.stringify(filters));
    }
  }

  removeCategoryFilter(value: Category): void {
    const filters = JSON.parse(localStorage.getItem('selected_categories') || '[]') as Category[];
    const index = filters.findIndex((item:Category) => item.id === value.id);
    if(index > -1) {
      filters.splice(index,1);
      localStorage.setItem('selected_categories', JSON.stringify(filters));
    }
  }
}