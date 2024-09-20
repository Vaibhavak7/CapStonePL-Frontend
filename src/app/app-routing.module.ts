import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PropertylistingComponent } from './components/propertylisting/propertylisting.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { HelppComponent } from './components/helpp/helpp.component';
import { BookingsComponent } from './components/bookings/bookings.component';

const routes: Routes = [
  {
    path: "",
    component:HomeComponent
  },
  {
    path: "signin",
    component:SignInComponent
  },
  {
    path: "signup",
    component:SignUpComponent
  },
  {
    path: 'properties',
    component: PropertylistingComponent
  },
  { path: 'property/:propertyId', component: PropertyDetailsComponent }
  ,{
    path: 'profile',
    component: ProfileComponent
  }
  ,{
    path: 'wishlist',
    component: WishlistComponent
  }
  ,{
    path: 'feedbacks',
    component: FeedbacksComponent
  }
  ,{
    path: 'booking',
    component: BookingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {
  
 }
