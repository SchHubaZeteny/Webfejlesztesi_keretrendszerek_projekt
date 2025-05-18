import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>();
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {
    console.log("constructor called");
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit called");
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  logout() {
    this.authService.signOut().then(() => {
      this.logoutEvent.emit();
      this.closeMenu();
    });
  }

}
