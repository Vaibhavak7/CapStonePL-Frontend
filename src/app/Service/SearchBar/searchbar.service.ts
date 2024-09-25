import { Injectable } from '@angular/core';
import { PropertyListService } from '../Property/property-list.service';

@Injectable({
  providedIn: 'root'
})
export class SearchbarService {

  properties: any
  cities: any
  constructor(private prop : PropertyListService) { 
    this.properties=this.prop.properties;
    this.cities=this.prop.cities;
  }
  
}
