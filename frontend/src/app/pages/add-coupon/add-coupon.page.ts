import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { CouponService } from '../../services/coupon.service';
import { Coupon } from '../../models/types';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.page.html',
  styleUrls: ['./add-coupon.page.scss'],
  standalone: false
})
export class AddCouponPage implements OnInit {
  couponForm: FormGroup = this.createForm();
  today: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private couponService: CouponService
  ) {
    // Configurando a data mínima como hoje
    const currentDate = new Date('2025-06-13T00:24:53Z');
    this.today = currentDate.toISOString().slice(0, 10);
  }

  ngOnInit() {
    this.initForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      scoreRequired: [null, [Validators.required, Validators.min(0)]],
      image: ['../../../assets/images/cinemark.png'], // Valor padrão
      validUntil: ['', [Validators.required]]
    });
  }

  initForm() {
    this.couponForm = this.createForm();
  }

  async saveCoupon() {
    if (this.couponForm.valid) {
      try {
        const couponData = this.couponForm.value;
        
        // Garantindo que validUntil esteja no formato ISO
        if (couponData.validUntil && typeof couponData.validUntil === 'string') {
          // Se for apenas uma data sem hora, adicionar o final do dia
          if (couponData.validUntil.length <= 10) {
            couponData.validUntil = `${couponData.validUntil}T23:59:59Z`;
          }
        }

        this.couponService.addCoupon(couponData).subscribe(
          newCoupon => {
            console.log('Cupom adicionado com sucesso:', newCoupon);
            this.presentToast('Cupom adicionado com sucesso!');
            this.navCtrl.back();
          },
          error => {
            console.error('Erro ao adicionar cupom:', error);
            this.presentToast('Erro ao adicionar cupom. Tente novamente.');
          }
        );
      } catch (error) {
        console.error('Erro ao processar formulário:', error);
        await this.presentToast('Erro ao adicionar cupom. Tente novamente.');
      }
    } else {
      // Marcar todos os campos como touched para exibir mensagens de validação
      Object.keys(this.couponForm.controls).forEach(key => {
        const control = this.couponForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      await this.presentToast('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  // Getters para controles do formulário
  get titleControl() { return this.couponForm.get('title'); }
  get descriptionControl() { return this.couponForm.get('description'); }
  get scoreRequiredControl() { return this.couponForm.get('scoreRequired'); }
  get validUntilControl() { return this.couponForm.get('validUntil'); }
}