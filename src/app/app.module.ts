import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';

import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NAV_DROPDOWN_DIRECTIVES} from './components/shared/nav-dropdown.directive';

import {SIDEBAR_TOGGLE_DIRECTIVES} from './components/shared/sidebar.directive';
import {BreadcrumbsComponent} from './components/shared/breadcrumb.component';
// Routing Module
import {AppRoutingModule} from './app.routing';
// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {AlertComponent} from './components/alert';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CustomerComponent} from './customer/customer.component';
import {UserComponent} from './user/user.component';
import {CategoryComponent} from './category/category.component';
import {ProductComponent} from './product/product.component';
import {SalesComponent} from './sales/sales.component';
import {SalesHistoryComponent} from './sales/sales-history/sales-history.component';
import {InvoiceDetailsComponent} from './sales/invoice-details/invoice-details.component';
import {SettingComponent} from './setting/setting.component';
import {ProfileSettingsComponent} from './profile-settings/profile-settings.component';
import {SalesReportComponent} from './report/sales-report.component';

import {ErrorInterceptor, fakeBackendProvider, JwtInterceptor} from './_helpers';
import {ChartsModule} from 'ng2-charts';

import {NgSelectModule} from '@ng-select/ng-select';
import {
  HtmlEditorService,
  ImageService,
  LinkService,
  RichTextEditorAllModule,
  TableService,
  ToolbarService
} from '@syncfusion/ej2-angular-richtexteditor';


import {
  AlertService,
  AppService,
  AuthenticationService,
  CategoryService,
  CustomerService,
  DashboardService,
  InvoiceDetailsService,
  NotificationService,
  ProductService,
  ReportService,
  SalesHistoryService,
  SalesService,
  SettingService,
  UserService
} from './_services';
import {TopProductReportComponent} from './report/top-product-report/top-product-report.component';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    DataTablesModule,
    RichTextEditorAllModule,
    NgSelectModule,
    NgSelectModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    AlertComponent,
    LoginComponent,
    DashboardComponent,
    CustomerComponent,
    UserComponent,
    CategoryComponent,
    ProductComponent,
    SalesComponent,
    SalesHistoryComponent,
    SalesReportComponent,
    InvoiceDetailsComponent,
    SettingComponent,
    ProfileSettingsComponent,
    TopProductReportComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
  ],
  providers: [
    AlertService,
    AuthenticationService,
    AppService,
    CategoryService,
    CustomerService,
    DashboardService,
    ProductService,
    ReportService,
    SalesService,
    SalesHistoryService,
    SettingService,
    InvoiceDetailsService,
    UserService,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,
    NotificationService,
    Title,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
