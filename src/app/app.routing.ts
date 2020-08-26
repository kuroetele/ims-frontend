import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
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

import {LoginComponent} from './login/login.component';
import {AuthGuard} from './_guards';
import {TopProductReportComponent} from './report/top-product-report/top-product-report.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Dashboard'
    },
    children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Home'}},
      {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], data: {title: 'Manage Customer'}},
      {path: 'user', component: UserComponent, canActivate: [AuthGuard], data: {title: 'Manage User'}},
      {path: 'category', component: CategoryComponent, canActivate: [AuthGuard], data: {title: 'Manage Category'}},
      {path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: {title: 'Manage Product'}},
      {path: 'sales', component: SalesComponent, canActivate: [AuthGuard], data: {title: 'Manage Sales'}},
      {path: 'sales-history', component: SalesHistoryComponent, canActivate: [AuthGuard], data: {title: 'Sales History'}},
      {path: 'sales-invoice-details/:id', component: InvoiceDetailsComponent, canActivate: [AuthGuard], data: {title: 'Invoice Details'}},
      {path: 'setting', component: SettingComponent, canActivate: [AuthGuard], data: {title: 'Manage Setting'}},
      {path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [AuthGuard], data: {title: 'Manage Profile Settings'}},
      {path: 'sales-report', component: SalesReportComponent, canActivate: [AuthGuard], data: {title: 'Sales Report'}},
      {
        path: 'top-product-report',
        component: TopProductReportComponent,
        canActivate: [AuthGuard],
        data: {title: 'Top Selling Products Report'}
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'login'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
