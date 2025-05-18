import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => 
      initializeApp({ projectId: "szinhazjegyprojekt", 
        appId: "1:995447022644:web:eedb295647fc9c73211661", 
        storageBucket: "szinhazjegyprojekt.firebasestorage.app", 
        apiKey: "AIzaSyCLmvZPxip445r7zMAsQw6SIo_xW69xLBs", 
        authDomain: "szinhazjegyprojekt.firebaseapp.com", 
        messagingSenderId: "995447022644" })), 
        provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
