import { Component } from '@angular/core';

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.page.html',
  styleUrls: ['./partner-details.page.scss'],
  standalone:false
})
export class PartnerDetailsPage {
  showFullText = false;

  partner = {
    name: 'CINEMARK',
    banner: '../../../assets/images/cinemark-banner.png',
    description:
      'Lorem ipsum dolor bla bla lorem ipsum dolor radkitum blablak tengo lengoo tengo, bla bla ka lorem ipsum dolor randandnadnadan',
    coupons: [
      {
        title: '30% de Desconto no ingresso',
        used: false,
      },
      {
        title: '50% de Desconto no ingresso',
        used: true,
      },
    ],
  };

  get shortDescription(): string {
    return this.partner.description.slice(0, 80) + '...';
  }
}
