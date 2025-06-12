import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

interface VideoData {
  id: number;
  title: string;
  description: string;
  filename: string;
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

  constructor(private modalCtrl: ModalController) {}

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

      // Aqui você pode adicionar a lógica para upload do arquivo
      // Por exemplo, usando FormData para enviar para um servidor

      /*
      const formData = new FormData();
      formData.append('video', this.selectedFile);
      formData.append('title', this.videoData.title);
      formData.append('description', this.videoData.description);
      
      // Exemplo de upload:
      // await this.uploadService.uploadVideo(formData);
      */

      // Por enquanto, apenas retornamos os dados do vídeo
      await this.modalCtrl.dismiss(this.videoData);
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
      this.errorMessage = 'Erro ao salvar o vídeo. Tente novamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
