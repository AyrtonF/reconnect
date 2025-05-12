import { Component } from '@angular/core';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.page.html',
  styleUrls: ['./challenge.page.scss'],
  standalone: false
})
export class ChallengePage {
  userPoints = 850;

  challenges = [
    {
      title: 'Cinema com a família',
      description: 'Ir ao cinema com a família assistir a um filme',
      image: '../../../assets/images/cinema.png',
      points: 100,
      buttonText: 'Participar',
      status: 'participate'

    },
    {
      title: 'Noite de jogos com amigos',
      description: 'Ter uma noite de jogos offline com amigos',
      image: '../../../assets/images/jogos.png',
      points: 100,
      buttonText: 'Participar',
      status: 'participate'

    },
    {
      title: 'Pedalada Recife',
      description: 'Participar do evento de ciclismo do Recife',
      image: '../../../assets/images/pedalada.png',
      points: 100,
      buttonText: 'Ver mais',
      status: 'see-more'
     
    },
  ];
}
