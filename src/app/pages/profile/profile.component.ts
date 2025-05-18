import { Component, OnInit, OnDestroy} from '@angular/core';
import { ProfileObject } from '../../shared/profiles';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { Show } from '../../shared/models/Show';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  tickets: Show[] = [];
  bought: Show[] = [];
  stats = {
    vasarolt: 0,
    points: 0
  };
  isLoading = true;
  
  private subscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.subscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.tickets = data.tickets;
        this.bought = data.bought;
        this.stats = data.stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Hiba a felhasználói profil betöltésekor:', error);
        this.isLoading = false;
      }
    });
  }

  getUserInitials(): string {
    if (!this.user || !this.user.name) return '?';
    
    const firstInitial = this.user.name.firstname ? this.user.name.firstname.charAt(0).toUpperCase() : '';
    const lastInitial = this.user.name.lastname ? this.user.name.lastname.charAt(0).toUpperCase() : '';
    
    return firstInitial + (lastInitial ? lastInitial : '');
  }
}
