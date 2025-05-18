import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MoneyFormatterPipe } from '../../shared/pipes/money.pipe';
import { Show } from '../../shared/models/Show';
import { ShowService } from '../../shared/services/show.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule, MoneyFormatterPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  @Input() title: string = 'Kosár';

  displayedColumns: string[] = ['title', 'price', 'date'];
  specialDisplayedColumns: string[] = ['title', 'price', 'date'];
  showForm!: FormGroup;
  tickets: Show[] = [];
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private showService: ShowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAllShowData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initializeForm(): void {
    this.showForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  loadAllShowData(): void {
    this.isLoading = true;
    
    const allShows$ = this.showService.getAllTickets();
    
    const combined$ = combineLatest([
      allShows$
    ]);
    
    const subscription = combined$.subscribe({
      next: ([allShows]) => {
        this.tickets = allShows;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading shows:', error);
        this.isLoading = false;
        this.showNotification('Error loading shows', 'error');
      }
    });
    
    this.subscriptions.push(subscription);
  }

  deleteTicket(showId: string): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.isLoading = true;
      this.showService.deleteTicket(showId)
        .then(() => {
          this.loadAllShowData();
          this.showNotification('Ticket deleted successfully', 'success');
        })
        .catch(error => {
          console.error('Error deleting ticket:', error);
          this.showNotification('Failed to delete ticket', 'error');
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }

}

