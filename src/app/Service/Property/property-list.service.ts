import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookMark } from 'src/app/components/models/BookMark';
import { PropertyDTO } from 'src/app/components/models/Property';

@Injectable({
  providedIn: 'root'
})
export class PropertyListService {

  properties: PropertyDTO[];
  cities: any

  property: PropertyDTO = new PropertyDTO();

  constructor(public http: HttpClient) {
    this.properties = [];
  }

  getPropertiesLikeSearch(string1:string)
  {
    return this.http.get<any>(`http://localhost:8080/api/properties/search/${string1}`);
  }

  getPropertyById(id: number) {
    return this.http.get<any>(`http://localhost:8080/api/properties/${id}`);
  }

  getPropertiesAll() {

    return this.http.get<any[]>("http://localhost:8080/api/properties");
  }
  getFeatuers()
  {
    return this.http.get<any[]>("http://localhost:8080/api/properties/featuers");
  }

 
  sortProperties(id : string)
  {
    console.log('Inside property',id);
  }

  addToWishlist(bookmarkData: BookMark): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://localhost:8080/api/properties/bookmarks/create', bookmarkData, {
        observe: 'response',  // This allows you to get the full response
        responseType: 'json'
    });
}



  
  removeFromWishlist(propertyId: number) {
    return this.http.delete(`/api/wishlist/remove/${propertyId}`);
  }
  

  getPropertiesByLocation(locationId: number) {
    return this.http.get<any[]>("http://localhost:8080/propertybylocation/" + locationId);
  }

  getPropertiesByFeatuers(categoryId: number) {
    return this.http.get<any[]>("http://localhost:8080/propertybycategory/" + categoryId);
  }

  getPropertiesByName(name: string) {
    return this.http.get<any[]>("http://localhost:8080/propertybyname/" + name);
  }

  getPropertiesByFiltering(formData: any) {
    let locationId = formData.cities;
    let categoryId = formData.categories;
    let sortBy = formData.sortBy;
    let listFor = formData.listFor;

    let params = new HttpParams()
                .set("locationId", locationId)
                .set("categoryId", categoryId)
                .set("listFor", listFor)
                .set("sortBy", sortBy);

    return this.http.get<any[]>("http://localhost:8080/propertybyfiltering", {params} );
  }

  getPropertyReviews(id: number) {
    return this.http.get<any[]>("http://localhost:8080/feedbacks/property/" + id);
  }

  fetchAverageRating(propertyId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/feedbacks/movie/${propertyId}/avg`);
}

}
