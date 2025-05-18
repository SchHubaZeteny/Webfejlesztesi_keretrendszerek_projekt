import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Show } from '../models/Show';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<{
    user: User | null,
    tickets: Show[],
    bought: Show[],
    stats: {
      vasarolt: number,
      points: number
    }
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            tickets: [],
            bought: [],
            stats: { vasarolt: 0, points: 0}
          });
        }

        return from(this.fetchUserWithTasks(authUser.uid));
      })
    );
  }

  private async fetchUserWithTasks(userId: string): Promise<{
    user: User | null,
    tickets: Show[],
    bought: Show[],
    stats: {
      vasarolt: number,
      points: number
    }
  }> {
    try {
      // Felhasználó adatainak lekérése
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        return {
          user: null,
          tickets: [],
          bought: [],
          stats: { vasarolt: 0, points: 0}
        };
      }

      const userData = userSnapshot.data() as User;
      const user = { ...userData, id: userId };
      
      if (!user.tickets || user.tickets.length === 0) {
        return {
          user,
          tickets: [],
          bought: [],
          stats: { vasarolt: 0, points: 0}
        };
      }

      // Jegyek lekérése a Shows kollekcióból
      const ticketsCollection = collection(this.firestore, 'Shows');
      const q = query(ticketsCollection, where('id', 'in', user.tickets));
      const tasksSnapshot = await getDocs(q);
      
      const tickets: Show[] = [];
      tasksSnapshot.forEach(doc => {
        tickets.push({ ...doc.data(), id: doc.id } as Show);
      });

      // Megvásárolt jegyek lekérése
      const boughtCollection = collection(this.firestore, 'Shows');
      const bq = query(boughtCollection, where('id', 'in', user.bought));
      const boughtSnapshot = await getDocs(bq);
      
      const bought: Show[] = [];
      boughtSnapshot.forEach(doc => {
        bought.push({ ...doc.data(), id: doc.id } as Show);
      });

      // Statisztikák kiszámítása
      const vasarolt = bought.length;
      const points = bought.length*250;

      return {
        user,
        tickets,
        bought,
        stats: {
          vasarolt,
          points
        }
      };
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltése során:', error);
      return {
        user: null,
        tickets: [],
        bought: [],
        stats: { vasarolt: 0, points: 0}
      };
    }
  }
}