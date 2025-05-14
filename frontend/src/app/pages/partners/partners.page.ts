import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
  standalone:false
})
export class PartnersPage implements OnInit {

  searchTerm: string = '';
  selectedCategory: string = 'Todos';

  categories: string[] = ['Todos', 'Cinema', 'Alimentos', 'Saúde', 'Transporte', 'Restaurante'];

  partners = [
    { name: 'Cinemark', category: 'Cinema', logo: '../../../assets/images/cinemark.png' },
    { name: 'Uber', category: 'Transporte', logo: '../../../assets/images/uber.png' },
    { name: 'Coco Bambu', category: 'Restaurante', logo: '../../../assets/images/coco-bambu.png' },
    { name: 'ReciBom', category: 'Alimentos', logo: '../../../assets/images/recibom.png' },
    { name: 'Pague Menos', category: 'Saúde', logo: '../../../assets/images/paguemenos.png' }
  ];

  filteredPartners = [...this.partners];

  ngOnInit() {
    this.filterPartners();
  }

  filterPartners() {
    this.filteredPartners = this.partners.filter(partner => {
      const matchesCategory = this.selectedCategory === 'Todos' || partner.category === this.selectedCategory;
      const matchesSearch = partner.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filterPartners();
  }
}
