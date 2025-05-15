import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../services/coupon.service';
import { UserService } from '../../services/user.service';
import { Coupon } from '../../models/types';

@Component({
  selector: 'app-my-coupons',
  templateUrl: './my-coupons.page.html',
  styleUrls: ['./my-coupons.page.scss'],
  standalone:false
})
export class MyCouponsPage implements OnInit {
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'Todos';
  categories = ['Todos', 'Cinema', 'Alimentos', 'Saúde'];

  constructor(
    private couponService: CouponService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    // Usando ID 1 como exemplo para o usuário logado
    this.userService.getUserById(1).subscribe(user => {
      if (user) {
        this.couponService.getAvailableCoupons(user?.score || 0).subscribe(coupons => {
          this.coupons = coupons;
          this.filterCoupons();
        });
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterCoupons();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterCoupons();
  }

  filterCoupons() {
    this.filteredCoupons = this.coupons.filter(coupon => {
      const matchesSearch = coupon.title.toLowerCase().includes(this.searchTerm) ||
                          coupon.description?.toLowerCase().includes(this.searchTerm);
      const matchesCategory = this.selectedCategory === 'Todos' ? true :
                            coupon.title.includes(this.selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }

  useCoupon(coupon: Coupon) {
    this.couponService.redeemCoupon(coupon.id, 1).subscribe(success => {
      if (success) {
        // Implementar lógica de feedback ao usuário
        console.log('Cupom usado com sucesso!');
      }
    });
  }
}