import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false
})
export class HomePage {
  username = 'Ayrton';
  points = 850;
  progress = 5; // 5%
  pointsAwarded = 100;
}
