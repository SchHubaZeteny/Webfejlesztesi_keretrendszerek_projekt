import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MoneyFormatterPipe } from '../../shared/pipes/money.pipe';
import { Show } from '../../shared/models/Show';
import { ShowService } from '../../shared/services/show.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-addshow',
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
     MatCardModule, 
     MatInputModule,
     MatDatepickerModule,
    MatNativeDateModule,
     MatTableModule, 
     MatButtonModule, 
     DateFormatterPipe,
     MoneyFormatterPipe],
  templateUrl: './addshow.component.html',
  styleUrl: './addshow.component.scss'
})
export class AddshowComponent {
  @Input() title: string = 'Műsor hozzáadás';
  @Output() showAdded = new EventEmitter<Show>();
  
  displayedColumns: string[] = ['title', 'price', 'date'];
  specialDisplayedColumns: string[] = ['title', 'price', 'date'];
  showForm!: FormGroup;
  shows: Show[] = [];
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
    
    const allShows$ = this.showService.getAllShows();
    
    const combined$ = combineLatest([
      allShows$
    ]);
    
    const subscription = combined$.subscribe({
      next: ([allShows]) => {
        this.shows = allShows;
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

  addShow(): void {
    if (this.showForm.valid) {
      this.isLoading = true;
      const formValue = this.showForm.value;
      const newShow: Omit<Show, 'id'> = {
        title: formValue.title,
        price: formValue.price,
        date: formValue.date
      };
      
      this.showService.addShow(newShow)
        .then(() => {
          this.loadAllShowData();
          this.showNotification('Show added successfully', 'success');
          this.showForm.reset({
            date: new Date()
          });
        })
        .catch(error => {
          console.error('Error adding show:', error);
          this.showNotification('Failed to add show', 'error');
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      Object.keys(this.showForm.controls).forEach(key => {
        const control = this.showForm.get(key);
        control?.markAsTouched();
      });
      this.showNotification('Please fill in all required fields correctly', 'warning');
    }
  }

  deleteShow(showId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isLoading = true;
      this.showService.deleteShow(showId)
        .then(() => {
          this.loadAllShowData();
          this.showNotification('Task deleted successfully', 'success');
        })
        .catch(error => {
          console.error('Error deleting task:', error);
          this.showNotification('Failed to delete task', 'error');
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
