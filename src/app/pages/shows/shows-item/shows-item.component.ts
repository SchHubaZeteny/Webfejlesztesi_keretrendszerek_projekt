import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Show } from '../shows.component';

@Component({
  selector: 'app-shows-item',
  imports: [CommonModule],
  templateUrl: './shows-item.component.html',
  styleUrl: './shows-item.component.scss'
})
export class ShowsItemComponent {
  @Input() show!: Show;
  @Output() complete = new EventEmitter<Show>();

  toggleComplete(): void {
    this.complete.emit(this.show);
  }
}
