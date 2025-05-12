import { Component } from '@angular/core';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.page.html',
  styleUrls: ['./challenge-details.page.scss'],
  standalone:false
})
export class ChallengeDetailsPage {
  

  challenge = {
    title: 'Pedalada Recife',
    image: '../../../assets/images/pedalada-banner.png',
    description: '15km de corrida de bicicleta com familiares e amigos.',
    participants: [
      { avatar: '../../../assets/images/user1.png' },
      { avatar: '../../../assets/images/user1.png' },
      { avatar: '../../../assets/images/user1.png' },
      { avatar: '../../../assets/images/user1.png' },
    ],
  };
}
