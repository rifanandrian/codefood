import { Routes } from '@angular/router';
import { DetailPageComponent } from '../detail-page/detail-page.component';
import { MainPageComponent } from '../main-page/main-page.component';

export const MENU_ROOT: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: ':id',
    component: DetailPageComponent,
    data: {

    }
  }
];
