import { AdsComponent } from './shared/components/ads/ads.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CompanyCardComponent } from './shared/components/company-card/company-card.component';
import { AgenciesPageComponent } from './agencies-page/agencies-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AllAgenciesPageComponent } from './agencies-page/all-agencies-page/all-agencies-page.component';
import { CardAgenciesPageComponent } from './agencies-page/card-agencies-page/card-agencies-page.component';
import { RatingComponent } from './shared/components/rating/rating.component'; 
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginPageComponent } from './auth-page/login-page/login-page.component';
import { RegisterPageComponent } from './auth-page/register-page/register-page.component';
import { CommentTreeComponent } from './shared/components/comment-tree/comment-tree.component';
import { CabinetPageComponent } from './cabinet-page/cabinet-page.component';
import { PersonalDataPageComponent } from './cabinet-page/personal-data-page/personal-data-page.component';
import { PersonalCompaniesPageComponent } from './cabinet-page/personal-companies-page/personal-companies-page.component';
import { TokenInterceptor } from './shared/interseptors/token.interceptor';
import { ChipComponent } from './shared/components/chip/chip.component';
import { PersonalCompanyDataPageComponent } from './cabinet-page/personal-company-data-page/personal-company-data-page.component';
import { AddCompanyPageComponent } from './cabinet-page/add-company-page/add-company-page.component';
import { ExistsCompanyPageComponent } from './cabinet-page/add-company-page/exists-company-page/exists-company-page.component';
import { CreateCompanyPageComponent } from './cabinet-page/add-company-page/create-company-page/create-company-page.component';
import { ServerFilesPipe } from './shared/pipes/files/server-files.pipe';
import { ModerationPageComponent } from './cabinet-page/moderation-page/moderation-page.component';
import { AdminPageComponent } from './cabinet-page/admin-page/admin-page.component';
import { TabsComponent } from './shared/components/tabs/tabs.component';
import { RatingPipe } from './shared/pipes/rating/rating.pipe';
import { AdminUsersPageComponent } from './cabinet-page/admin-page/admin-users-page/admin-users-page.component';
import { AdminCompaniesPageComponent } from './cabinet-page/admin-page/admin-companies-page/admin-companies-page.component';
import { AdminAnalyticsPageComponent } from './cabinet-page/admin-page/admin-analytics-page/admin-analytics-page.component';
import { AdminHomePageComponent } from './cabinet-page/admin-page/admin-home-page/admin-home-page.component';
import { CheckMoodPipe } from './shared/pipes/comment/check-mood.pipe';
import { CompanyInfoCardComponent } from './shared/components/company-info-card/company-info-card.component'; 
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { NotificationService } from './shared/services/notification/notification.service';
import { CompaniesVerificationPageComponent } from './cabinet-page/moderation-page/companies-verification-page/companies-verification-page.component';
import { CommentsVerificationPageComponent } from './cabinet-page/moderation-page/comments-verification-page/comments-verification-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { ForumPageComponent } from './forum-page/forum-page.component';
import { CategoriesPageComponent } from './forum-page/categories-page/categories-page.component';
import { UsersVerificationPageComponent } from './cabinet-page/moderation-page/users-verification-page/users-verification-page.component';
import { SearchComponent } from './shared/components/search/search.component';

@NgModule({   
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    FooterComponent,
    CompanyCardComponent,
    AgenciesPageComponent,
    AllAgenciesPageComponent,
    CardAgenciesPageComponent,
    RatingComponent,
    AuthPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    CommentTreeComponent,
    CabinetPageComponent,
    PersonalDataPageComponent,
    PersonalCompaniesPageComponent,
    ChipComponent,
    PersonalCompanyDataPageComponent,
    AddCompanyPageComponent,
    ExistsCompanyPageComponent,
    CreateCompanyPageComponent,
    ServerFilesPipe,
    ModerationPageComponent,
    AdminPageComponent,
    TabsComponent,
    RatingPipe,
    AdminUsersPageComponent,
    AdminCompaniesPageComponent,
    AdminAnalyticsPageComponent,
    AdminHomePageComponent,
    CheckMoodPipe,
    CompanyInfoCardComponent,
    NotificationsComponent,
    CompaniesVerificationPageComponent,
    CommentsVerificationPageComponent,
    AdsComponent,
    PaginationComponent,
    ForumPageComponent,
    CategoriesPageComponent,
    UsersVerificationPageComponent,
    SearchComponent
  ],  
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule, 
    ReactiveFormsModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
