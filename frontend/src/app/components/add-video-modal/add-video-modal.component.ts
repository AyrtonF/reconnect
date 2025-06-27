import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ModalController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { CloudinaryService } from '../../services/cloudnary.service';

interface VideoData {
  id: number;
  title: string;
  description: string;
  filename: string;
  url?: string;
  file?: File;
}

@Component({
  selector: 'app-add-video-modal',
  templateUrl: './add-video-modal.component.html',
  styleUrls: ['./add-video-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddVideoModalComponent implements OnInit {
  videoData: VideoData = {
    id: Date.now(),
    title: '',
    description: '',
    filename: '',
  };

  selectedFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private modalCtrl: ModalController,
    private cloudinaryService: CloudinaryService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async selectVideo() {
    try {
      // Criar input de arquivo programaticamente
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*'; // Aceita apenas arquivos de vídeo
      input.multiple = false;

      // Manipular a seleção do arquivo
      input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files && files.length > 0) {
          const file = files[0];

          // Verificar o tamanho do arquivo (exemplo: limite de 100MB)
          const maxSize = 500 * 1024 * 1024; // 100MB em bytes
          if (file.size > maxSize) {
            this.errorMessage =
              'O arquivo é muito grande. Tamanho máximo: 100MB';
            return;
          }

          // Verificar o tipo do arquivo
          if (!file.type.startsWith('video/')) {
            this.errorMessage = 'Por favor, selecione apenas arquivos de vídeo';
            return;
          }

          this.selectedFile = file;
          this.videoData.filename = file.name;
          this.videoData.file = file;
          this.errorMessage = '';
        }
      };

      // Acionar o input
      input.click();
    } catch (error) {
      console.error('Erro ao selecionar vídeo:', error);
      this.errorMessage = 'Erro ao selecionar o vídeo. Tente novamente.';
    }
  }

  removeVideo() {
    this.selectedFile = null;
    this.videoData.filename = '';
    this.videoData.file = undefined;
  }

  validateForm(): boolean {
    if (!this.videoData.title.trim()) {
      this.errorMessage = 'Por favor, insira um título para o vídeo';
      return false;
    }

    if (!this.videoData.description.trim()) {
      this.errorMessage = 'Por favor, insira uma descrição para o vídeo';
      return false;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecione um vídeo';
      return false;
    }

    return true;
  }

  async save() {
    try {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      // Verificar se as configurações do Cloudinary estão corretas
      if (!this.cloudinaryService.validateConfig()) {
        await this.showToast('Configurações do Cloudinary não encontradas');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Enviando vídeo...',
      });
      await loading.present();

      try {
        // Upload do vídeo para o Cloudinary
        const videoUrl = await this.cloudinaryService.uploadVideo(
          this.selectedFile!
        );
        this.videoData.url = videoUrl;

        await loading.dismiss();
        await this.showToast('Vídeo enviado com sucesso!');

        // Retornar os dados do vídeo com a URL
        await this.modalCtrl.dismiss(this.videoData);
      } catch (uploadError) {
        await loading.dismiss();
        console.error('Erro no upload do vídeo:', uploadError);
        this.errorMessage = 'Erro ao enviar o vídeo. Tente novamente.';
      }
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
      this.errorMessage = 'Erro ao salvar o vídeo. Tente novamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
