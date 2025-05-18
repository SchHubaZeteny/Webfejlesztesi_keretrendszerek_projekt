import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MoneyFormatterPipe } from '../../shared/pipes/money.pipe';
import { Show } from '../../shared/models/Show';
import { ShowService } from '../../shared/services/show.service';
import { Subscription, combineLatest } from 'rxjs';


@Component({
  selector: 'app-shows',
  imports: [FormsModule, 
    CommonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    DateFormatterPipe,
    MoneyFormatterPipe],
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.scss'
})
export class ShowsComponent implements OnInit{
  @Input() title: string = 'Műsorok';
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

  addTicket(showId: string): void {
    if (confirm('Are you sure you want to add this ticket?')) {
      this.isLoading = true;
      this.showService.addTicket(showId)
        .then(() => {
          this.loadAllShowData();
          this.showNotification('Ticket added successfully', 'success');
        })
        .catch(error => {
          console.error('Error adding ticket:', error);
          this.showNotification('Failed to add ticket', 'error');
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
