import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FakeLoadingService } from '../../shared/services/fake-loading.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = new FormControl('');
  password = new FormControl('');
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  loadingSubscription?: Subscription;

  constructor(private loadingService: FakeLoadingService, private router: Router) {}

  login() {
    this.loginError = '';
    
    if (this.email.value === 'test@gmail.com' && this.password.value === 'test') {
      this.isLoading = true;
      this.showLoginForm = false;
      
      localStorage.setItem('isLoggedIn', 'true');
      
      this.loadingService.loadingWithPromise().then((data: number) => {
        if (data === 3) {
          window.location.href = '/home';
        }
      }).catch(error => {
        console.error(error);
        this.isLoading = false;
        this.showLoginForm = true;
        this.loginError = 'Betöltési hiba történt!';
      }).finally(() => {
        console.log("Befejeződött!")
      });
    } else {
      this.loginError = 'Helytelen email cím vagy jelszó!';
    }
  }

  login2() {
    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';

    this.isLoading = true;
    this.showLoginForm = false;
    this.loginError = '';


    this.loadingService.loadingWithPromise2(emailValue, passwordValue).then((_: boolean) => {
      console.log("Ez fejeződött be másodjára!");
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigateByUrl('/home');
    }).catch(error => {
      this.isLoading = false;
      this.showLoginForm = true;
      this.loginError = 'Helytelen email vagy jelszó!';
      console.error(error);
    }).finally(() => {
      console.log("Befejeződött!");
    });

    console.log("Ez fejeződött be először!");
  }

  async login3() {
    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    try {
      const bool = await this.loadingService.loadingWithPromise3(emailValue, passwordValue);
      console.log(bool, "Ez fejeződött be másodjára!");
      this.isLoading = true;
      this.showLoginForm = false;
      this.router.navigateByUrl('/home');
      localStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error(error)
    }
    console.log("Ez fejeződött be végül!");
  }

  login4() {
    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    this.loadingSubscription = this.loadingService.loadingWithObservable2(emailValue, passwordValue).subscribe((data: boolean)=>{
      console.log(data);
    });
  }

  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe;
  }
}
