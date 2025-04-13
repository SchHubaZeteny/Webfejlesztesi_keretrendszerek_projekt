import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AddshowComponent } from './pages/addshow/addshow.component';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'shows',
        loadComponent: () => import('./pages/shows/shows.component').then(m => m.ShowsComponent),
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    },
    {
        path: 'addshow',
        loadComponent: () => import('./pages/addshow/addshow.component').then(m => m.AddshowComponent),
    },
    {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'registration',
        loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent),
    },

    { path: '', redirectTo: 'home', pathMatch: 'full' },

    
    { path: '**', component: HomeComponent }
];
