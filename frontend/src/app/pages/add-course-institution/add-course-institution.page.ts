import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AddVideoModalComponent } from '../../components/add-video-modal/add-video-modal.component';
import { AddMaterialModalComponent } from '../../components/add-material-modal/add-material-modal.component';
import { AddQuestionModalComponent } from '../../components/add-question-modal/add-question-modal.component';
import { Router } from '@angular/router';
import { CourseInstitutionService } from 'src/app/services/course-institution.service';
import { InstitutionCourse, InstitutionMaterial, InstitutionQuestion, InstitutionVideo } from 'src/app/models/types';
interface Course {
  image: string | null;
  name: string;
  description: string;
  videos: Video[];
  materials: Material[];
  questions: Question[];
}

interface Video {
  id: number;
  title: string;
  description: string;
  filename: string;
}

interface Material {
  id: number;
  title: string;
  description: string;
  filename: string;
}

interface Question {
  id: number;
  question: string;
  alternatives: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-add-course-institution',
  templateUrl: './add-course-institution.page.html',
  styleUrls: ['./add-course-institution.page.scss'],
  standalone: false
})
export class AddCourseInstitutionPage implements OnInit {
currentTab: 'VIDEOS' | 'MATERIAL' | 'QUIZZES' = 'VIDEOS';
  courseData: Course = {
    image: null,
    name: '',
    description: '',
    videos: [],
    materials: [],
    questions: []
  };

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
     private courseService: CourseInstitutionService 

  ) {}

  ngOnInit() {}

  // Implementação do upload de imagem
  async uploadCourseImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (files && files.length > 0) {
        const file = files[0];
        
        // Verificar tamanho (5MB máximo)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          await this.showToast('A imagem é muito grande. Tamanho máximo: 5MB');
          return;
        }

        try {
          // Converter para base64
          const reader = new FileReader();
          reader.onload = (e) => {
            this.courseData.image = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          await this.showToast('Erro ao processar a imagem. Tente novamente.');
        }
      }
    };

    input.click();
  }

  // Funções de exclusão
  async deleteVideo(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Deseja realmente excluir este vídeo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.courseData.videos = this.courseData.videos.filter(v => v.id !== id);
            this.showToast('Vídeo excluído com sucesso');
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteMaterial(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Deseja realmente excluir este material?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.courseData.materials = this.courseData.materials.filter(m => m.id !== id);
            this.showToast('Material excluído com sucesso');
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteQuestion(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Deseja realmente excluir esta pergunta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.courseData.questions = this.courseData.questions.filter(q => q.id !== id);
            this.showToast('Pergunta excluída com sucesso');
          }
        }
      ]
    });
    await alert.present();
  }

  // Mantenha suas funções existentes dos modais
  async openVideoModal() {
    const modal = await this.modalController.create({
      component: AddVideoModalComponent,
      cssClass: 'course-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.courseData.videos.push(result.data);
      }
    });

    return await modal.present();
  }

  async openMaterialModal() {
    const modal = await this.modalController.create({
      component: AddMaterialModalComponent,
      cssClass: 'course-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.courseData.materials.push(result.data);
      }
    });

    return await modal.present();
  }

  async openQuestionModal() {
    const modal = await this.modalController.create({
      component: AddQuestionModalComponent,
      cssClass: 'course-modal'
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.courseData.questions.push(result.data);
      }
    });

    return await modal.present();
  }

  // Nova função para mostrar mensagens
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

 async saveCourse() {
    try {
      if (!this.courseData.image) {
        await this.showToast('Por favor, adicione uma imagem para o curso');
        return;
      }

      if (!this.courseData.name?.trim()) {
        await this.showToast('Por favor, digite o nome do curso');
        return;
      }

      if (!this.courseData.description?.trim()) {
        await this.showToast('Por favor, digite a descrição do curso');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Salvando curso...'
      });
      await loading.present();

      // Converter para o formato correto
      const courseToSave: Partial<InstitutionCourse> = {
        name: this.courseData.name,
        description: this.courseData.description,
        image: this.courseData.image,
        materials: this.courseData.materials?.map(m => ({
          ...m,
          courseId: 0, // será atualizado pelo backend
          type: 'document',
          uploadedAt: new Date(),
          updatedAt: new Date()
        })) as InstitutionMaterial[],
        videos: this.courseData.videos?.map(v => ({
          ...v,
          courseId: 0, // será atualizado pelo backend
          uploadedAt: new Date(),
          updatedAt: new Date()
        })) as InstitutionVideo[],
        questions: this.courseData.questions?.map(q => ({
          ...q,
          courseId: 0, // será atualizado pelo backend
          createdAt: new Date(),
          updatedAt: new Date()
        })) as InstitutionQuestion[],
        status: 'published' as const
      };

      this.courseService.createCourse(courseToSave).subscribe({
        next: async (response) => {
          await loading.dismiss();
          if (response.success) {
            await this.showToast('Curso salvo com sucesso!');
            this.router.navigate(['/course-institution']);
          } else {
            await this.showToast('Erro ao salvar o curso');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          await this.showToast('Erro ao salvar o curso: ' + error.message);
        }
      });
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      await this.showToast('Erro ao salvar o curso');
    }
  }
}
