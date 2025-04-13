import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';

export interface Show {
  id: number,
  title: string,
  date: string,
  price: string
}

@Component({
  selector: 'app-shows',
  imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, DateFormatterPipe],
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.scss'
})
export class ShowsComponent implements OnInit{
  @Input() title: string = 'Műsorok';
  @Output() showAdded = new EventEmitter<Show>();
  
  newShowTitle: string = '';
  newShowDate: string = '';
  newShowPrice: string = '';
  
  shows: Show[] = [
    {
      id: 1,
      title: 'Műsor1',
      date: new Date().toISOString(),
      price: '4000'
    },
    {
      id: 2,
      title: 'Műsor2',
      date: new Date().toISOString(),
      price: '4000'
    },
    {
      id: 3,
      title: 'Műsor3',
      date: new Date().toISOString(),
      price: '4000'
    }
  ];

  ngOnInit(): void {
    
  }

  addShow(): void {
    if (this.newShowTitle.trim()) {
      const date = new Date();
      
      const newShow: Show = {
        id: this.shows.length + 1,
        title: this.newShowTitle.trim(),
        date: this.newShowDate.trim(),
        price: this.newShowPrice
      };
      
      this.shows.push(newShow);
      this.showAdded.emit(newShow);
      this.newShowTitle = '';
      this.newShowPrice = '';
    }
  }

  trackById(index: number, item: Show): number {
    return item.id;
  }

}
