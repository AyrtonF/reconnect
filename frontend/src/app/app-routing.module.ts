import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
   {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
 {
    path: 'challenge',
    loadChildren: () => import('./pages/challenge/challenge.module').then(m => m.ChallengePageModule)
  },
  {
    path: 'challenge-details/:id',
    loadChildren: () => import('./pages/challenge-details/challenge-details.module').then(m => m.ChallengeDetailsPageModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses/courses.module').then( m => m.CoursesPageModule)
  },
  {
    path: 'course-details/:id',
    loadChildren: () => import('./pages/course-details/course-details.module').then( m => m.CourseDetailsPageModule)
  },
  {
    path: 'family-details',
    loadChildren: () => import('./pages/family-details/family-details.module').then( m => m.FamilyDetailsPageModule)
  },
  
  {
    path: 'partners',
    loadChildren: () => import('./pages/partners/partners.module').then( m => m.PartnersPageModule)
  },
  {
    path: 'partner-details',
    loadChildren: () => import('./pages/partner-details/partner-details.module').then( m => m.PartnerDetailsPageModule)
  },
  {
    path: 'my-coupons',
    loadChildren: () => import('./pages/my-coupons/my-coupons.module').then( m => m.MyCouponsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
