import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Coupon } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private coupons: Coupon[] = [
    {
      id: 1,
      title: 'Desconto 15% em Cursos',
      description: 'Cupom de 15% de desconto em qualquer curso da plataforma',
      scoreRequired: 500,
      image:'../../../assets/images/coco-bambu.png',
      validUntil: '2025-06-15T23:59:59Z'
    },
    {
      id: 2,
      title: 'Curso Grátis',
      description: 'Resgate um curso gratuito à sua escolha',
      scoreRequired: 1000,
      image:'../../../assets/images/uber.png',
      validUntil: '2025-07-01T23:59:59Z'
    },
    {
      id: 3,
      title: 'Emblema Exclusivo',
      description: 'Desbloqueie um emblema exclusivo para seu perfil',
      scoreRequired: 300,
      image:'../../../assets/images/recibom.png',
      validUntil: '2025-12-31T23:59:59Z'
    },
    {
      id: 4,
      title: 'Acesso Antecipado',
      description: 'Acesso antecipado aos novos cursos por 1 mês',
      scoreRequired: 750,
      image:'../../../assets/images/cinemark.png',
      validUntil: '2025-08-31T23:59:59Z'
    },
    {
      id: 5,
      title: 'Certificado Premium',
      description: 'Certificado especial com design premium',
      scoreRequired: 600,
      image:'../../../assets/images/cinemark.png',
      validUntil: '2025-09-30T23:59:59Z'
    }
  ];

  constructor() { }

  // Retorna todos os cupons
  getAllCoupons(): Observable<Coupon[]> {
    return of(this.coupons);
  }

  // Retorna cupons disponíveis para um determinado score
  getAvailableCoupons(userScore: number): Observable<Coupon[]> {
    const availableCoupons = this.coupons.filter(coupon => {
      const isValid = !coupon.validUntil || new Date(coupon.validUntil) > new Date('2025-05-15T12:51:15Z');
      const hasScore = !coupon.scoreRequired || userScore >= coupon.scoreRequired;
      return isValid && hasScore;
    });
    return of(availableCoupons);
  }

  // Retorna um cupom pelo ID
  getCouponById(id: number): Observable<Coupon | undefined> {
    const coupon = this.coupons.find(coupon => coupon.id === id);
    return of(coupon);
  }

  // Adiciona um novo cupom
  addCoupon(coupon: Omit<Coupon, 'id'>): Observable<Coupon> {
    const newCoupon: Coupon = {
      ...coupon,
      id: this.generateId()
    };
    this.coupons.push(newCoupon);
    return of(newCoupon);
  }

  // Atualiza um cupom existente
  updateCoupon(updatedCoupon: Coupon): Observable<Coupon | undefined> {
    const index = this.coupons.findIndex(coupon => coupon.id === updatedCoupon.id);
    if (index !== -1) {
      this.coupons[index] = updatedCoupon;
      return of(updatedCoupon);
    }
    return of(undefined);
  }

  // Deleta um cupom
  deleteCoupon(id: number): Observable<boolean> {
    const initialLength = this.coupons.length;
    this.coupons = this.coupons.filter(coupon => coupon.id !== id);
    return of(this.coupons.length < initialLength);
  }

  // Verifica se um cupom está disponível para resgate
  isCouponAvailable(couponId: number, userScore: number): Observable<boolean> {
    const coupon = this.coupons.find(c => c.id === couponId);
    if (!coupon) return of(false);

    const isValid = !coupon.validUntil || new Date(coupon.validUntil) > new Date('2025-05-15T12:51:15Z');
    const hasScore = !coupon.scoreRequired || userScore >= coupon.scoreRequired;

    return of(isValid && hasScore);
  }

  // Resgata um cupom (poderia integrar com UserService)
  redeemCoupon(couponId: number, userId: number): Observable<boolean> {
    const coupon = this.coupons.find(c => c.id === couponId);
    if (!coupon) return of(false);

    // Aqui você poderia adicionar lógica adicional:
    // - Verificar se o usuário já resgatou este cupom
    // - Atualizar o score do usuário
    // - Adicionar o cupom à lista de cupons do usuário
    // - etc.

    return of(true);
  }

  // Retorna cupons próximos de expirar
  getExpiringCoupons(daysThreshold: number = 7): Observable<Coupon[]> {
    const currentDate = new Date('2025-05-15T12:51:15Z');
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(currentDate.getDate() + daysThreshold);

    const expiringCoupons = this.coupons.filter(coupon => {
      if (!coupon.validUntil) return false;
      const expirationDate = new Date(coupon.validUntil);
      return expirationDate <= thresholdDate && expirationDate > currentDate;
    });

    return of(expiringCoupons);
  }

  // Retorna cupons por faixa de pontuação
  getCouponsByScoreRange(minScore: number, maxScore: number): Observable<Coupon[]> {
    const filteredCoupons = this.coupons.filter(coupon => {
      const score = coupon.scoreRequired || 0;
      return score >= minScore && score <= maxScore;
    });
    return of(filteredCoupons);
  }

  private generateId(): number {
    if (this.coupons.length === 0) {
      return 1;
    }
    return Math.max(...this.coupons.map(coupon => coupon.id)) + 1;
  }
}