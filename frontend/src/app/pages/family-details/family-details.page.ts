import { Component } from '@angular/core';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.page.html',
  styleUrls: ['./family-details.page.scss'],
  standalone:false
})
export class FamilyDetailsPage {
  posts = [
    {
      name: 'Marcos Rocha',
      time: '08:39 am',
      caption: 'Corrida no parque, nem pensa só vai!!!',
      image: '../../../assets/images/marcos-corrida.png',
      avatar: '../../../assets/images/marcos.png',
      likes: 10,
    },
    {
      name: 'Ana Rocha',
      time: '08:39 am',
      caption: 'Praticando crochê pela primeira vez! 🧶',
      image: '../../../assets/images/ana-crochet.png',
      avatar: '../../../assets/images/ana.png',
      likes: 3,
    },
  ];
}
