import { AdminCompaniesPageComponent } from './cabinet-page/admin-page/admin-companies-page/admin-companies-page.component';
import { ModerationPageComponent } from './cabinet-page/moderation-page/moderation-page.component';
import { AddCompanyPageComponent } from './cabinet-page/add-company-page/add-company-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgenciesPageComponent } from './agencies-page/agencies-page.component';
import { AllAgenciesPageComponent } from './agencies-page/all-agencies-page/all-agencies-page.component';
import { CardAgenciesPageComponent } from './agencies-page/card-agencies-page/card-agencies-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginPageComponent } from './auth-page/login-page/login-page.component';
import { RegisterPageComponent } from './auth-page/register-page/register-page.component';
import { CabinetPageComponent } from './cabinet-page/cabinet-page.component';
import { PersonalCompaniesPageComponent } from './cabinet-page/personal-companies-page/personal-companies-page.component';
import { PersonalCompanyDataPageComponent } from './cabinet-page/personal-company-data-page/personal-company-data-page.component';
import { PersonalDataPageComponent } from './cabinet-page/personal-data-page/personal-data-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ExistsCompanyPageComponent } from './cabinet-page/add-company-page/exists-company-page/exists-company-page.component';
import { CreateCompanyPageComponent } from './cabinet-page/add-company-page/create-company-page/create-company-page.component';
import { AdminPageComponent } from './cabinet-page/admin-page/admin-page.component';
import { CabinetGuard } from './shared/guards/cabinet/cabinet.guard';
import { AdminUsersPageComponent } from './cabinet-page/admin-page/admin-users-page/admin-users-page.component';
import { AdminAnalyticsPageComponent } from './cabinet-page/admin-page/admin-analytics-page/admin-analytics-page.component';
import { AdminHomePageComponent } from './cabinet-page/admin-page/admin-home-page/admin-home-page.component';
import { CompaniesVerificationPageComponent } from './cabinet-page/moderation-page/companies-verification-page/companies-verification-page.component';
import { CommentsVerificationPageComponent } from './cabinet-page/moderation-page/comments-verification-page/comments-verification-page.component';
import { ForumPageComponent } from './forum-page/forum-page.component';
import { UsersVerificationPageComponent } from './cabinet-page/moderation-page/users-verification-page/users-verification-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'agencies',
    component: AgenciesPageComponent,
    children: [
      { path: '', component: AllAgenciesPageComponent },
      { path: ':id', component: CardAgenciesPageComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: 'cabinet',
    component: CabinetPageComponent,
    canActivate: [CabinetGuard],
    children: [
      { path: '', redirectTo: '/cabinet/personal-data', pathMatch: 'full' },
      { path: 'personal-data', component: PersonalDataPageComponent },
      { path: 'personal-companies', component: PersonalCompaniesPageComponent },
      { path: 'moderation', component: ModerationPageComponent },
      { path: 'moderation/companies-verification', component: CompaniesVerificationPageComponent },
      { path: 'moderation/comments-verification', component: CommentsVerificationPageComponent },
      { path: 'moderation/users-verification', component: UsersVerificationPageComponent },
      { path: 'moderation', component: ModerationPageComponent },
      { path: 'admin', component: AdminPageComponent },
      { path: 'personal-companies/:id', component: PersonalCompanyDataPageComponent },
      { path: 'add-company', component: AddCompanyPageComponent },
      { path: 'add-company/create', component: CreateCompanyPageComponent },
      { path: 'add-company/exists', component: ExistsCompanyPageComponent }
    ]
  },
  {
    path: 'cabinet/admin',
    component: AdminPageComponent,
    canActivate: [CabinetGuard],
    children: [
      { path: 'home', component: AdminHomePageComponent, pathMatch: 'full' },
      { path: 'users', component: AdminUsersPageComponent },
      { path: 'companies', component: AdminCompaniesPageComponent },
      { path: 'analytics', component: AdminAnalyticsPageComponent }
    ]
  },
  {
    path: 'forum',
    component: ForumPageComponent
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    relativeLinkResolution: 'legacy', 
    anchorScrolling: 'enabled', 
    initialNavigation: 'enabled' 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
