import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

interface MaterialData {
  id: number;
  title: string;
  description: string;
  filename: string;
  file?: File;
}

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.component.html',
  styleUrls: ['./add-material-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddMaterialModalComponent implements OnInit {
  materialData: MaterialData = {
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

  async selectDocument() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.ppt,.pptx'; // Tipos de arquivo permitidos
      input.multiple = false;

      input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files && files.length > 0) {
          const file = files[0];

          // Verificar tamanho do arquivo (limite de 50MB)
          const maxSize = 50 * 1024 * 1024;
          if (file.size > maxSize) {
            this.errorMessage =
              'O arquivo é muito grande. Tamanho máximo: 50MB';
            return;
          }

          // Verificar extensão do arquivo
          const validExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
          if (!validExtensions.includes(fileExtension)) {
            this.errorMessage = 'Formato de arquivo não suportado';
            return;
          }

          this.selectedFile = file;
          this.materialData.filename = file.name;
          this.materialData.file = file;
          this.errorMessage = '';
        }
      };

      input.click();
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      this.errorMessage = 'Erro ao selecionar o documento. Tente novamente.';
    }
  }

  removeDocument() {
    this.selectedFile = null;
    this.materialData.filename = '';
    this.materialData.file = undefined;
  }

  validateForm(): boolean {
    if (!this.materialData.title.trim()) {
      this.errorMessage = 'Por favor, insira um título para o material';
      return false;
    }

    if (!this.materialData.description.trim()) {
      this.errorMessage = 'Por favor, insira uma descrição para o material';
      return false;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecione um documento';
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
      // Exemplo com FormData:
      /*
      const formData = new FormData();
      formData.append('document', this.selectedFile);
      formData.append('title', this.materialData.title);
      formData.append('description', this.materialData.description);
      
      // await this.uploadService.uploadDocument(formData);
      */

      await this.modalCtrl.dismiss(this.materialData);
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      this.errorMessage = 'Erro ao salvar o documento. Tente novamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
