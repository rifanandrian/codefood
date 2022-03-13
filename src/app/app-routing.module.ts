import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RatePageComponent } from './rate-page/rate-page.component';
import { AuthGuardService } from './services/auth-guard.service';
import { StepPageComponent } from './step-page/step-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'history',
    component: HistoryPageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: ':id',
    component: DetailPageComponent
  },
  {
    path: ':id/step',
    component: StepPageComponent
  },
  {
    path: ':id/rate',
    component: RatePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
