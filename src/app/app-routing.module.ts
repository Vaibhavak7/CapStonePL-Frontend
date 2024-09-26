import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
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
import { AuthService } from './Service/Authenticate/auth.service';


export const guard: CanActivateFn = (next, state) => {
  return inject(AuthService).canActivate();
}

const routes: Routes = [
  {
    path: "",
    component:HomeComponent
    
  },
  {
    path: "signin",
    component:SignInComponent,
    
  },
  {
    path: "signup",
    component:SignUpComponent
  },
  {
    path: 'properties',
    component: PropertylistingComponent,
    

  },
  { path: 'property/:propertyId',
    component: PropertyDetailsComponent }
  ,{
    path: 'profile',
    component: ProfileComponent
  }
  ,{
    path: 'wishlist',
    component: WishlistComponent,
    canActivate:[guard]
  }
  ,{
    path: 'feedbacks',
    component: FeedbacksComponent,
    canActivate:[guard]
  }
  ,{
    path: 'booking',
    component: BookingsComponent,
    canActivate:[guard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {
  
 }
