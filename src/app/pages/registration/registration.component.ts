import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-registration',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  });

  isLoading = false;
  showForm = true;
  signupError = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  signup(): void {
    if (this.signUpForm.invalid) {
      this.signupError = 'Kérlek javítsd ki minden hibát mielőtt regisztrálnál.';
      return;
    }

    const password = this.signUpForm.get('password')?.value;
    const rePassword = this.signUpForm.get('rePassword')?.value;
    
    if (password !== rePassword) {
      this.signupError = 'A két jelszó nem egyezik meg.';
      return;
    }

    this.isLoading = true;
    this.showForm = false;

    const userData: Partial<User> = {
      name: {
        firstname: this.signUpForm.value.name?.firstname || '',
        lastname: this.signUpForm.value.name?.lastname || ''
      },
      email: this.signUpForm.value.email || '',
      tickets: [],
      bought: [],
    };

    const email = this.signUpForm.value.email || '';
    const pw = this.signUpForm.value.password || '';

    this.authService.signUp(email, pw, userData)
      .then(userCredential => {
        console.log('Registration succesful:', userCredential.user);
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.error('Regisztrációs hiba:', error);
        this.isLoading = false;
        this.showForm = true;
        
        switch(error.code) {
          case 'auth/email-already-in-use':
            this.signupError = 'Ezt az emailt már használják.';
            break;
          case 'auth/invalid-email':
            this.signupError = 'Rossz email.';
            break;
          case 'auth/weak-password':
            this.signupError = 'A jelszó túl gyenge. Legalább 6 karaktert használj.';
            break;
          default:
            this.signupError = 'Valami hiba történt a regisztrációkor. Kérlek próbálkozz újra később.';
        }
      });
  }
}
