import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { Show } from '../models/Show';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  private readonly SHOWS_COLLECTION = 'Shows';
  private readonly USERS_COLLECTION = 'Users';

  constructor(
    private authService: AuthService,
    private firestore: Firestore      
  ) { }

  private formatDateToString(date: Date | string): string {
    if (typeof date === 'string') {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.includes('T') ? date.split('T')[0] : date;
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  // CREATE
  async addShow(show: Omit<Show, 'id'>): Promise<Show> {
    try {

      const showsCollection = collection(this.firestore, this.SHOWS_COLLECTION);
      
      const showToSave = {
        ...show,
        date: this.formatDateToString(show.date as string)
      };
      
      const docRef = await addDoc(showsCollection, showToSave);
      const showId = docRef.id;
      
      await updateDoc(docRef, { id: showId });
      
      const newShow = {
        ...showToSave,
        id: showId
      } as Show;

      return newShow;
    } catch (error) {
      console.error('Error adding show:', error);
      throw error;
    }
  }

  // CREATE
  async addTicket(showId: string): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }


      // Felhasználó tasks tömbjének frissítése
      const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const tickets = userData.tickets || [];
        tickets.push(showId);
        return await updateDoc(userDocRef, { tickets });
      }

    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  

  // READ
  async getAllShows(): Promise<Show[]> {
        try {
          const showsCollection = collection(this.firestore, this.SHOWS_COLLECTION);
          const shows: Show[] = [];

            const q = query(showsCollection);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
              shows.push({ ...doc.data(), id: doc.id } as Show);
            });

          return shows;
        } catch (error) {
          console.error('Error fetching shows:', error);
          return [];
        }
  }

  // READ
  getAllTickets(): Observable<Show[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) {
          return of([]);
        }
        try {
          const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            return of([]);
          }
          const userData = userDoc.data() as User;
          const showIds = userData.tickets || [];
          if (showIds.length === 0) {
            return of([]);
          }

          const showsCollection = collection(this.firestore, this.SHOWS_COLLECTION);
          const tickets: Show[] = [];
          const batchSize = 10;

          for (let i = 0; i < showIds.length; i += batchSize) {
            const batch = showIds.slice(i, i + batchSize);
            const q = query(showsCollection, where('__name__', 'in', batch));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
              tickets.push({ ...doc.data(), id: doc.id } as Show);
            });
          }

          return of(tickets.sort((a, b) => {
            return a.date.localeCompare(b.date);
          }));
        } catch (error) {
          console.error('Error fetching tickets:', error);
          return of([]);
        }
      }),
      switchMap(tickets => tickets)
    );
  }


  async getShowById(showId: string): Promise<Show | null> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        return null;
      }
      const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        return null;
      }
      const userData = userDoc.data() as User;
      if (!userData.tickets || !userData.tickets.includes(showId)) {
        return null;
      }

      const showDocRef = doc(this.firestore, this.SHOWS_COLLECTION, showId);
      const showSnapshot = await getDoc(showDocRef);
      if (showSnapshot.exists()) {
        return { ...showSnapshot.data(), id: showId } as Show;
      }
      return null;
    } catch (error) {
      console.error('Error fetching show:', error);
      return null;
    }
  }


  async updateShow(showId: string, updatedData: Partial<Show>): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }
      const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      const userData = userDoc.data() as User;
      if (!userData.tickets || !userData.tickets.includes(showId)) {
        throw new Error('Show does not belong to the user');
      }

      const dataToUpdate: any = { ...updatedData };
      if (dataToUpdate.dueDate) {
        dataToUpdate.dueDate = this.formatDateToString(dataToUpdate.dueDate as any);
      }

      const showDocRef = doc(this.firestore, this.SHOWS_COLLECTION, showId);
      return updateDoc(showDocRef, dataToUpdate);
    } catch (error) {
      console.error('Error updating show:', error);
      throw error;
    }
  }


   // DELETE
   async deleteShow(showId: string): Promise<void> {
    try {

      const showDocRef = doc(this.firestore, this.SHOWS_COLLECTION, showId);
      await deleteDoc(showDocRef);

    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // DELETE
  async deleteTicket(showId: string): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }
      const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      const userData = userDoc.data() as User;
      if (!userData.tickets || !userData.tickets.includes(showId)) {
        throw new Error('Ticket does not belong to the user');
      }

      const updatedShows = userData.tickets.filter(id => id !== showId);
      return updateDoc(userDocRef, { tickets: updatedShows });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }




}
