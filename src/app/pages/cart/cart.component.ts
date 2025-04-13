import { Component, Input, OnInit } from '@angular/core';
import { ProfileObject } from '../../shared/profiles';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, MatIconModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  ProfileObject = ProfileObject;
  @Input() title: string = 'Kosár';

  selectedIndex: number = 0;

  ngOnInit(): void {
    this.selectedIndex = 0;
  }

  reload (index: number): void {
    this.selectedIndex = index;
  }
}
