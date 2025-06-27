import { Component, OnInit } from '@angular/core';
import { FamilyService } from 'src/app/services/family.service';
import { Family } from 'src/app/models/types';
import {
  NavController,
  ToastController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.page.html',
  styleUrls: ['./add-family.page.scss'],
  standalone: false,
})
export class AddFamilyPage implements OnInit {
  familyData = {
    name: '',
  };

  searchTerm = '';
  searchResults: Family[] = [];
  isLoading = false;
  isJoining = false;

  constructor(
    private familyService: FamilyService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  async createFamily() {
    if (!this.familyData.name.trim()) {
      await this.showToast(
        'Por favor, digite um nome para a família',
        'warning'
      );
      return;
    }

    this.isLoading = true;

    try {
      const currentUserId = this.authService.getUserId();
      if (!currentUserId) {
        throw new Error('Usuário não autenticado');
      }

      const familyToCreate: Omit<Family, 'id'> = {
        name: this.familyData.name.trim(),
        membersIds: [currentUserId], // Adicionar o usuário criador automaticamente
        postsIds: [], // Array vazio inicialmente
        challengesIds: [], // Array vazio inicialmente
      };

      const newFamily = await this.familyService
        .addFamily(familyToCreate)
        .toPromise();

      // Tentar adicionar o usuário à família criada (fallback se o backend não fez automaticamente)
      try {
        await this.familyService
          .joinFamilyCurrentUser(newFamily!.id)
          .toPromise();
      } catch (joinError) {
        console.log(
          'Usuário já foi adicionado automaticamente à família ou erro menor:',
          joinError
        );
      }

      await this.showToast(
        'Família criada com sucesso! Você já faz parte dela.',
        'success'
      );
      this.navCtrl.navigateRoot('/family-details');
    } catch (error) {
      console.error('Erro ao criar família:', error);
      await this.showAlert(
        'Erro',
        'Não foi possível criar a família. Tente novamente.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  async searchFamilies() {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    try {
      const families = await this.familyService
        .searchFamiliesByName(this.searchTerm.trim())
        .toPromise();
      this.searchResults = families || [];
    } catch (error) {
      console.error('Erro ao buscar famílias:', error);
      this.searchResults = [];
      await this.showToast('Erro ao buscar famílias', 'danger');
    }
  }

  async joinFamily(familyId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Participação',
      message: 'Deseja realmente participar desta família?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            await this.confirmJoinFamily(familyId);
          },
        },
      ],
    });

    await alert.present();
  }

  private async confirmJoinFamily(familyId: number) {
    this.isJoining = true;

    const loading = await this.loadingController.create({
      message: 'Participando da família...',
    });
    await loading.present();

    try {
      await this.familyService.joinFamilyCurrentUser(familyId).toPromise();
      await loading.dismiss();
      await this.showToast('Você agora faz parte da família!', 'success');
      this.navCtrl.navigateRoot('/family-details');
    } catch (error) {
      await loading.dismiss();
      console.error('Erro ao participar da família:', error);
      await this.showAlert(
        'Erro',
        'Não foi possível participar da família. Tente novamente.'
      );
    } finally {
      this.isJoining = false;
    }
  }

  private async showToast(message: string, color: string = 'medium') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
