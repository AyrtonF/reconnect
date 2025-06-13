import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { CouponService } from '../../services/coupon.service';
import { AuthService } from '../../services/auth.service';
import { UserService, InstitutionalUser } from '../../services/user.service';
import { Coupon } from '../../models/types';

@Component({
  selector: 'app-home-company',
  templateUrl: './home-company.page.html',
  styleUrls: ['./home-company.page.scss'],
  standalone: false
})
export class HomeCompanyPage implements OnInit {
  companyName: string = '';
  coupons: Coupon[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  currentUser: InstitutionalUser | null = null;
  currentDate = new Date('2025-06-13T00:30:02Z'); // Use a data atual fornecida

  constructor(
    private couponService: CouponService,
    private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadCoupons();
  }

  async loadCurrentUser() {
    // Vamos buscar o primeiro usuário institucional como exemplo
    this.userService.getInstitutionalUsers().subscribe(users => {
      if (users.length > 0) {
        this.currentUser = users[0];
        this.companyName = this.getCompanyName();
      }
    });
  }

  getCompanyName(): string {
    // Este é um mock - em um cenário real, você buscaria o nome da instituição
    // com base no institutionId do usuário logado
    const companyNames = {
      1: 'Cinemark',
      2: 'RexiBom',
      3: 'Uber'
    };
    
    if (this.currentUser?.institutionId && companyNames[this.currentUser.institutionId as keyof typeof companyNames]) {
      return companyNames[this.currentUser.institutionId as keyof typeof companyNames];
    }
    return 'Cinemark'; // Valor padrão
  }

  async loadCoupons() {
  

    this.couponService.getAllCoupons().subscribe({
      next: (coupons) => {
        this.coupons = coupons;
        this.hideLoading();
      },
      error: (error) => {
        console.error('Erro ao carregar cupons:', error);
        this.hideLoading();
        this.showToast('Erro ao carregar cupons. Tente novamente.');
      }
    });
  }

  filterCoupons(): Coupon[] {
    if (!this.searchTerm.trim()) {
      return this.coupons;
    }
    
    return this.coupons.filter(coupon => 
      coupon.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  addCoupon() {
    this.navCtrl.navigateForward('/add-coupon');
  }

  editCoupon(coupon: Coupon) {
    // Em uma implementação real, você navegaria para a página de edição
    // passando o ID do cupom como parâmetro
    console.log('Editar cupom:', coupon);
    // this.navCtrl.navigateForward(`/edit-coupon/${coupon.id}`);
    this.showToast('Função de edição em desenvolvimento');
  }

  async deleteCoupon(coupon: Coupon) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir o cupom "${coupon.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.showLoading('Excluindo cupom...');
            
            this.couponService.deleteCoupon(coupon.id).subscribe({
              next: (success) => {
                this.hideLoading();
                if (success) {
                  this.loadCoupons(); // Recarregar a lista após exclusão
                  this.showToast('Cupom excluído com sucesso!');
                } else {
                  this.showToast('Erro ao excluir cupom. Tente novamente.');
                }
              },
              error: (error) => {
                console.error('Erro ao excluir cupom:', error);
                this.hideLoading();
                this.showToast('Erro ao excluir cupom. Tente novamente.');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  isCouponExpired(coupon: Coupon): boolean {
    if (!coupon.validUntil) return false;
    return new Date(coupon.validUntil) < this.currentDate;
  }

  getExpirationLabel(coupon: Coupon): string {
    if (!coupon.validUntil) return 'Sem data de expiração';
    
    const expirationDate = new Date(coupon.validUntil);
    const daysLeft = Math.floor((expirationDate.getTime() - this.currentDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysLeft < 0) return 'Expirado';
    if (daysLeft === 0) return 'Expira hoje';
    if (daysLeft === 1) return 'Expira amanhã';
    return `Expira em ${daysLeft} dias`;
  }

  getCouponScoreLabel(coupon: Coupon): string {
    return coupon.scoreRequired ? `${coupon.scoreRequired} pontos` : 'Sem pontuação mínima';
  }

  async showLoading(message: string = 'Carregando...') {
    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'circles'
    });
    await loading.present();
  }

  hideLoading() {
    this.loading = false;
    this.loadingCtrl.dismiss();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async refreshCoupons(event: any) {
    this.loadCoupons();
    if (event && event.target) {
      event.target.complete();
    }
  }
}