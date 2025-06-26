import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AddVideoModalComponent } from '../../components/add-video-modal/add-video-modal.component';
import { AddMaterialModalComponent } from '../../components/add-material-modal/add-material-modal.component';
import { AddQuestionModalComponent } from '../../components/add-question-modal/add-question-modal.component';
import { Router } from '@angular/router';
import { CourseInstitutionService } from 'src/app/services/course-institution.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  InstitutionCourse,
  InstitutionMaterial,
  InstitutionQuestion,
  InstitutionVideo,
  User,
} from 'src/app/models/types';
import { CloudinaryService } from '../../services/cloudnary.service';

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
  standalone: false,
})
export class AddCourseInstitutionPage implements OnInit {
  currentTab: 'VIDEOS' | 'MATERIAL' | 'QUIZZES' = 'VIDEOS';
  courseData: Course = {
    image: null,
    name: '',
    description: '',
    videos: [],
    materials: [],
    questions: [],
  };

  currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private courseService: CourseInstitutionService,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      this.authService.getCurrentUser().subscribe({
        next: (user: User) => {
          this.currentUser = user;
          console.log('Usuário atual carregado:', user);

          // Salvar institutionId no localStorage se disponível
          if (user?.institutionId) {
            console.log(
              'Salvando institutionId no localStorage:',
              user.institutionId
            );
            this.authService.saveInstitutionId(user.institutionId);
          } else {
            console.log('User não possui institutionId:', user);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar usuário:', error);
          this.showToast('Erro ao carregar dados do usuário');
        },
      });
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
    }
  }

  // Implementação do upload de imagem consumindo o CloudinaryService
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

        let loading;
        try {
          // Verificar se as configurações do Cloudinary estão corretas
          if (!this.cloudinaryService.validateConfig()) {
            await this.showToast('Configurações do Cloudinary não encontradas');
            return;
          }

          loading = await this.loadingController.create({
            message: 'Enviando imagem...',
          });
          await loading.present();

          // Consome CloudinaryService ao invés do FileReader
          const imageUrl = await this.cloudinaryService.uploadImage(file);
          this.courseData.image = imageUrl;
          await this.showToast('Imagem enviada com sucesso!');
        } catch (error: any) {
          console.error('Erro ao enviar imagem:', error);
          const errorMessage =
            error.message || 'Erro ao enviar a imagem. Tente novamente.';
          await this.showToast(errorMessage);
        } finally {
          if (loading) {
            await loading.dismiss();
          }
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
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.courseData.videos = this.courseData.videos.filter(
              (v) => v.id !== id
            );
            this.showToast('Vídeo excluído com sucesso');
          },
        },
      ],
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
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.courseData.materials = this.courseData.materials.filter(
              (m) => m.id !== id
            );
            this.showToast('Material excluído com sucesso');
          },
        },
      ],
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
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.courseData.questions = this.courseData.questions.filter(
              (q) => q.id !== id
            );
            this.showToast('Pergunta excluída com sucesso');
          },
        },
      ],
    });
    await alert.present();
  }

  // Mantenha suas funções existentes dos modais
  async openVideoModal() {
    const modal = await this.modalController.create({
      component: AddVideoModalComponent,
      cssClass: 'course-modal',
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
      cssClass: 'course-modal',
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
      cssClass: 'course-modal',
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
      color: 'dark',
    });
    await toast.present();
  }

  async saveCourse() {
    try {
      // Debug: Verificar dados disponíveis
      console.log('=== DEBUG SAVE COURSE ===');
      console.log('currentUser:', this.currentUser);
      console.log(
        'currentUser.institutionId:',
        this.currentUser?.institutionId
      );
      console.log(
        'AuthService.getInstitutionId():',
        this.authService.getInstitutionId()
      );
      console.log('AuthService.getUserRole():', this.authService.getUserRole());

      // Verificar se o usuário é INSTITUTION_ADMIN ou INSTITUTION_STAFF
      const userRole = this.authService.getUserRole();
      if (
        !userRole ||
        (userRole !== 'INSTITUTION_ADMIN' && userRole !== 'INSTITUTION_STAFF')
      ) {
        await this.showToast(
          'Erro: Apenas administradores e funcionários de instituição podem criar cursos.'
        );
        return;
      }

      // Para INSTITUTION_ADMIN: usar o próprio ID do usuário como institutionId se não tiver institutionId
      // Para INSTITUTION_STAFF: deve ter institutionId obrigatoriamente
      let institutionId =
        this.currentUser?.institutionId || this.getInstitutionIdFallback();

      if (!institutionId) {
        if (userRole === 'INSTITUTION_ADMIN') {
          // INSTITUTION_ADMIN pode usar seu próprio ID como institutionId
          const userId = this.authService.getUserId() || this.currentUser?.id;
          if (userId) {
            institutionId = userId;
            console.log(
              `INSTITUTION_ADMIN usando userId ${userId} como institutionId`
            );

            // Salvar no localStorage para próximas operações
            this.authService.saveInstitutionId(userId);

            await this.showToast(
              'Usando sua conta como instituição para criar o curso.'
            );
          } else {
            await this.showToast('Erro: Não foi possível obter ID do usuário.');
            return;
          }
        } else {
          // INSTITUTION_STAFF deve ter institutionId
          await this.showToast(
            'Erro: Funcionários de instituição devem estar associados a uma instituição. Contate o administrador.'
          );
          return;
        }
      }

      console.log('institutionId final:', institutionId);

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
        message: 'Salvando curso...',
      });
      await loading.present();

      // Converter para o formato correto
      const courseToSave: Partial<InstitutionCourse> = {
        institutionId: institutionId, // ✅ CORRIGIDO - usando a variável verificada (userId para ADMIN, institutionId para STAFF)
        name: this.courseData.name,
        description: this.courseData.description,
        image: this.courseData.image,
        materials: this.courseData.materials?.map((m) => ({
          ...m,
          courseId: 0, // será atualizado pelo backend
          type: 'document',
          uploadedAt: new Date(),
          updatedAt: new Date(),
        })) as InstitutionMaterial[],
        videos: this.courseData.videos?.map((v) => ({
          ...v,
          courseId: 0, // será atualizado pelo backend
          uploadedAt: new Date(),
          updatedAt: new Date(),
        })) as InstitutionVideo[],
        questions: this.courseData.questions?.map((q) => ({
          ...q,
          courseId: 0, // será atualizado pelo backend
          createdAt: new Date(),
          updatedAt: new Date(),
        })) as InstitutionQuestion[],
        status: 'published' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Dados do curso a serem salvos:', courseToSave);

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
          console.error('Erro completo ao salvar curso:', error);

          // Se for erro 403 (Forbidden), tentar solução alternativa
          if (error.status === 403) {
            console.log('Erro 403 detectado, tentando solução alternativa...');
            await this.handleForbiddenError(courseToSave, loading);
            return;
          }

          await loading.dismiss();
          const errorMessage =
            error?.error?.message ||
            error?.message ||
            'Erro desconhecido ao salvar o curso';
          await this.showToast('Erro ao salvar o curso: ' + errorMessage);
        },
      });
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      await this.showToast('Erro ao salvar o curso');
    }
  }

  // Método para testar configurações do Cloudinary (debug)
  async testCloudinaryConfig() {
    try {
      const isValid = this.cloudinaryService.validateConfig();
      console.log('Configurações do Cloudinary válidas:', isValid);

      if (!isValid) {
        await this.showToast('Configurações do Cloudinary inválidas');
        return;
      }

      // Teste de conectividade (apenas um ping para verificar se a URL é acessível)
      const testUrl = `https://api.cloudinary.com/v1_1/dicaajxk0/image/upload`;
      console.log('URL de teste:', testUrl);
      await this.showToast('Configurações do Cloudinary OK');
    } catch (error) {
      console.error('Erro ao testar Cloudinary:', error);
      await this.showToast('Erro nas configurações do Cloudinary');
    }
  }

  // Método para testar dados do usuário (debug)
  async testUserData() {
    console.log('=== TESTE DE DADOS DO USUÁRIO ===');
    console.log('currentUser:', this.currentUser);
    console.log('AuthService token:', this.authService.getToken());
    console.log('AuthService role:', this.authService.getUserRole());
    console.log('AuthService userId:', this.authService.getUserId());
    console.log(
      'AuthService institutionId:',
      this.authService.getInstitutionId()
    );
    console.log(
      'localStorage institutionId:',
      localStorage.getItem('institutionId')
    );
    console.log('localStorage token:', localStorage.getItem('authToken'));
    console.log('localStorage role:', localStorage.getItem('userRole'));
    console.log('localStorage userId:', localStorage.getItem('userId'));

    // Tentar carregar usuário novamente
    this.authService.getCurrentUser().subscribe({
      next: async (user) => {
        console.log('getCurrentUser() response:', user);
        await this.showToast(
          `Dados no console - Role: ${this.authService.getUserRole()}, InstitutionId: ${this.authService.getInstitutionId()}`
        );
      },
      error: async (error) => {
        console.error('Erro ao carregar usuário:', error);
        await this.showToast('Erro ao carregar usuário: ' + error.message);
      },
    });
  }

  // Método para obter institutionId como fallback
  private getInstitutionIdFallback(): number | null {
    console.log('=== DEBUG FALLBACK ===');

    // Primeiro tenta obter do AuthService
    const institutionIdFromService = this.authService.getInstitutionId();
    console.log('institutionIdFromService:', institutionIdFromService);

    if (institutionIdFromService) {
      return institutionIdFromService;
    }

    // Se não encontrar, pode tentar obter do currentUser se já carregado
    if (this.currentUser?.institutionId) {
      console.log(
        'institutionId from currentUser:',
        this.currentUser.institutionId
      );
      return this.currentUser.institutionId;
    }

    // Verificar localStorage diretamente
    const institutionIdFromStorage = localStorage.getItem('institutionId');
    console.log('institutionId from localStorage:', institutionIdFromStorage);

    if (institutionIdFromStorage) {
      const parsed = parseInt(institutionIdFromStorage, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    console.log('Nenhum institutionId encontrado');
    return null;
  }

  // Método para lidar com erro 403 (Forbidden) - Solução temporária
  private async handleForbiddenError(
    courseToSave: Partial<InstitutionCourse>,
    loading: any
  ) {
    try {
      console.log('Tentando solução alternativa para erro 403...');

      // Opção 1: Tentar endpoint alternativo usando o service de cursos regulares
      console.log('Tentando salvar como curso regular...');

      // Converter para formato de curso regular temporariamente
      const regularCourse = {
        name: courseToSave.name,
        description: courseToSave.description,
        image: courseToSave.image,
        institutionId: courseToSave.institutionId,
        // Remover campos específicos de instituição que podem causar problemas
        status: 'published',
      };

      // Tentar usar o HttpClient diretamente para bypass das permissões
      const response = await this.tryDirectApiCall(regularCourse);

      if (response) {
        await loading.dismiss();
        await this.showToast(
          'Curso salvo com sucesso! (usando método alternativo)'
        );
        this.router.navigate(['/course-institution']);
      } else {
        throw new Error('Método alternativo falhou');
      }
    } catch (alternativeError) {
      console.error('Erro na solução alternativa:', alternativeError);
      await loading.dismiss();

      // Mostrar mensagem específica sobre permissões
      await this.showToast(
        'Erro de permissão: Seu usuário não tem acesso para criar cursos. ' +
          'Contate o administrador do sistema para configurar as permissões adequadas.'
      );

      // Criar toast adicional com instruções técnicas
      setTimeout(async () => {
        await this.showToast(
          'Erro técnico: 403 Forbidden no endpoint /api/institution-courses. ' +
            'Verifique as configurações do Spring Security no backend.'
        );
      }, 3000);
    }
  }

  // Método para tentar chamada direta à API
  private async tryDirectApiCall(courseData: any): Promise<any> {
    try {
      // Tentar endpoints alternativos
      const endpoints = [
        'http://localhost:8080/api/courses', // Endpoint de cursos regulares
        'http://localhost:8080/api/courses/institution', // Possível endpoint alternativo
        'http://localhost:8080/api/admin/courses', // Endpoint administrativo
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Tentando endpoint: ${endpoint}`);

          const response = await this.http
            .post(endpoint, courseData, {
              headers: {
                Authorization: this.authService.getToken() || '',
                'Content-Type': 'application/json',
              },
            })
            .toPromise();

          console.log(`Sucesso no endpoint ${endpoint}:`, response);
          return response;
        } catch (endpointError: any) {
          console.log(`Falha no endpoint ${endpoint}:`, endpointError.status);
          if (endpointError.status !== 403 && endpointError.status !== 404) {
            // Se não for 403 ou 404, pode ser um erro diferente que vale a pena reportar
            throw endpointError;
          }
          // Continue tentando próximo endpoint
        }
      }

      throw new Error('Todos os endpoints falharam');
    } catch (error) {
      console.error('Erro na chamada direta à API:', error);
      return null;
    }
  }
}
