import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'challenge',
    loadChildren: () =>
      import('./pages/challenge/challenge.module').then(
        (m) => m.ChallengePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'challenge-details/:id',
    loadChildren: () =>
      import('./pages/challenge-details/challenge-details.module').then(
        (m) => m.ChallengeDetailsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./pages/courses/courses.module').then((m) => m.CoursesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'course-details/:id',
    loadChildren: () =>
      import('./pages/course-details/course-details.module').then(
        (m) => m.CourseDetailsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'family-details',
    loadChildren: () =>
      import('./pages/family-details/family-details.module').then(
        (m) => m.FamilyDetailsPageModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'partners',
    loadChildren: () =>
      import('./pages/partners/partners.module').then(
        (m) => m.PartnersPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'partner-details',
    loadChildren: () =>
      import('./pages/partner-details/partner-details.module').then(
        (m) => m.PartnerDetailsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-coupons',
    loadChildren: () =>
      import('./pages/my-coupons/my-coupons.module').then(
        (m) => m.MyCouponsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'course-institution',
    loadChildren: () =>
      import('./pages/course-institution/course-institution.module').then(
        (m) => m.CourseInstitutionPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-course-institution',
    loadChildren: () =>
      import(
        './pages/add-course-institution/add-course-institution.module'
      ).then((m) => m.AddCourseInstitutionPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-company',
    loadChildren: () =>
      import('./pages/home-company/home-company.module').then(
        (m) => m.HomeCompanyPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-coupon',
    loadChildren: () =>
      import('./pages/add-coupon/add-coupon.module').then(
        (m) => m.AddCouponPageModule
      ),
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
