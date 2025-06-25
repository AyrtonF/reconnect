import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Coupon, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  // Retorna todos os cupons
  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<ApiResponse<Coupon[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  // Retorna cupons disponíveis para um determinado score
  getAvailableCoupons(userScore: number): Observable<Coupon[]> {
    const params = new HttpParams().set('userScore', userScore.toString());
    return this.http
      .get<ApiResponse<Coupon[]>>(`${this.apiUrl}/available`, { params })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  // Retorna um cupom pelo ID
  getCouponById(id: number): Observable<Coupon> {
    return this.http.get<ApiResponse<Coupon>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  // Adiciona um novo cupom
  addCoupon(coupon: Omit<Coupon, 'id'>): Observable<Coupon> {
    return this.http.post<ApiResponse<Coupon>>(`${this.apiUrl}`, coupon).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  // Atualiza um cupom existente
  updateCoupon(id: number, coupon: Omit<Coupon, 'id'>): Observable<Coupon> {
    return this.http
      .put<ApiResponse<Coupon>>(`${this.apiUrl}/${id}`, coupon)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  // Deleta um cupom
  deleteCoupon(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.errorHandler.handleError)
    );
  }

  // Verifica se um cupom está disponível para resgate
  isCouponAvailable(couponId: number, userScore: number): Observable<boolean> {
    const params = new HttpParams().set('userScore', userScore.toString());
    return this.http
      .get<ApiResponse<boolean>>(`${this.apiUrl}/${couponId}/available`, {
        params,
      })
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }

  // Resgata um cupom
  redeemCoupon(couponId: number, userId: number): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${this.apiUrl}/${couponId}/redeem/${userId}`,
        {}
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }

  // Retorna cupons próximos de expirar
  getExpiringCoupons(daysThreshold: number = 7): Observable<Coupon[]> {
    const params = new HttpParams().set(
      'daysThreshold',
      daysThreshold.toString()
    );
    return this.http
      .get<ApiResponse<Coupon[]>>(`${this.apiUrl}/expiring`, { params })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }
}
