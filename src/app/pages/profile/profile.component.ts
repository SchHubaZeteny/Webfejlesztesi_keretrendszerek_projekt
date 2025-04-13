import { Component, OnInit } from '@angular/core';
import { ProfileObject } from '../../shared/profiles';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  ProfileObject = ProfileObject;

  selectedIndex: number = 0;

  ngOnInit(): void {
    this.selectedIndex = 0;
  }

  reload (index: number): void {
    this.selectedIndex = index;
  }
}
