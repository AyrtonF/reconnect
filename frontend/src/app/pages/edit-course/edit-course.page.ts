import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CourseInstitutionService } from '../../services/course-institution.service';
import { AuthService } from '../../services/auth.service';
import { InstitutionCourse } from '../../models/types';
import {
  AlertController,
  LoadingController,
  ToastController,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.page.html',
  styleUrls: ['./edit-course.page.scss'],
  standalone: false,
})
export class EditCoursePage implements OnInit {
  courseForm: FormGroup;
  courseId: number | null = null;
  isEditMode = false;
  isLoading = false;
  selectedTab: 'info' | 'videos' | 'materials' | 'quizzes' = 'info';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseInstitutionService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {
    this.courseForm = this.createCourseForm();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.isEditMode = true;
        this.loadCourse();
      }
    });

    // Verificar se usuário tem permissão
    this.checkPermissions();
  }

  checkPermissions() {
    const currentUser = this.authService.getCurrentUser();
    currentUser.subscribe({
      next: (user) => {
        if (user.role !== 'institution_admin') {
          this.showAlert(
            'Acesso Negado',
            'Você não tem permissão para editar cursos.'
          );
          this.navCtrl.navigateBack('/courses');
        }
      },
      error: () => {
        this.navCtrl.navigateRoot('/login');
      },
    });
  }

  createCourseForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      videos: this.fb.array([]),
      materials: this.fb.array([]),
    });
  }

  get videosArray(): FormArray {
    return this.courseForm.get('videos') as FormArray;
  }

  get materialsArray(): FormArray {
    return this.courseForm.get('materials') as FormArray;
  }

  loadCourse() {
    if (!this.courseId) return;

    this.isLoading = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.populateForm(response.data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar curso:', error);
        this.showToast('Erro ao carregar curso', 'danger');
        this.isLoading = false;
      },
    });
  }

  populateForm(course: InstitutionCourse) {
    this.courseForm.patchValue({
      name: course.name,
      description: course.description,
      image: course.image,
    });

    // Popula vídeos
    course.videos?.forEach((video) => this.addVideo(video));

    // Popula materiais
    course.materials?.forEach((material) => this.addMaterial(material));
  }

  // Métodos para vídeos
  createVideoForm(video?: any): FormGroup {
    return this.fb.group({
      id: [video?.id || null],
      title: [video?.title || '', Validators.required],
      description: [video?.description || ''],
      url: [video?.url || '', Validators.required],
      duration: [video?.duration || 0],
      thumbnail: [video?.thumbnail || ''],
    });
  }

  addVideo(video?: any) {
    this.videosArray.push(this.createVideoForm(video));
  }

  removeVideo(index: number) {
    this.videosArray.removeAt(index);
  }

  // Métodos para materiais
  createMaterialForm(material?: any): FormGroup {
    return this.fb.group({
      id: [material?.id || null],
      title: [material?.title || '', Validators.required],
      description: [material?.description || '', Validators.required],
    });
  }

  addMaterial(material?: any) {
    this.materialsArray.push(this.createMaterialForm(material));
  }

  removeMaterial(index: number) {
    this.materialsArray.removeAt(index);
  }

  async saveCourse() {
    if (this.courseForm.invalid) {
      this.showToast(
        'Por favor, preencha todos os campos obrigatórios',
        'warning'
      );
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isEditMode ? 'Atualizando curso...' : 'Criando curso...',
    });
    await loading.present();

    try {
      const courseData = this.prepareCourseData();

      if (this.isEditMode && this.courseId) {
        await this.courseService
          .updateCourse(this.courseId, courseData)
          .toPromise();
        this.showToast('Curso atualizado com sucesso!', 'success');
      } else {
        await this.courseService.createCourse(courseData).toPromise();
        this.showToast('Curso criado com sucesso!', 'success');
      }

      this.navCtrl.navigateBack('/courses');
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      this.showToast('Erro ao salvar curso', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  prepareCourseData(): any {
    const formValue = this.courseForm.value;

    // Obter institutionId do usuário autenticado
    const institutionId =
      this.authService.getInstitutionId() || this.authService.getUserId();

    return {
      institutionId: institutionId,
      name: formValue.name,
      description: formValue.description,
      image: formValue.image,
      // Incluir vídeos apenas se existirem
      ...(formValue.videos &&
        formValue.videos.length > 0 && {
          videos: formValue.videos.map((video: any) => ({
            title: video.title,
            description: video.description,
            filename: video.filename || '',
            url: video.url,
            duration: video.duration || 0,
            thumbnail: video.thumbnail || '',
          })),
        }),
      // Incluir materiais apenas se existirem
      ...(formValue.materials &&
        formValue.materials.length > 0 && {
          materials: formValue.materials.map((material: any) => ({
            title: material.title,
            description: material.description,
            filename: material.filename || '',
            type: material.type || 'document',
            size: material.size || 0,
          })),
        }),
      // Incluir questões apenas se existirem
      ...(formValue.questions &&
        formValue.questions.length > 0 && {
          questions: formValue.questions.map((question: any) => ({
            question: question.question,
            alternatives: question.alternatives || [],
            correctAnswer: question.correctAnswer || 0,
          })),
        }),
      settings: {
        allowEnrollment: true,
        requireApproval: false,
        maxStudents: 100,
      },
    };
  }

  async deleteCourse() {
    if (!this.isEditMode || !this.courseId) return;

    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message:
        'Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Excluindo curso...',
            });
            await loading.present();

            try {
              await this.courseService.deleteCourse(this.courseId!).toPromise();
              await loading.dismiss();
              this.showToast('Curso excluído com sucesso!', 'success');
              this.navCtrl.navigateBack('/courses');
            } catch (error) {
              await loading.dismiss();
              console.error('Erro ao excluir curso:', error);
              this.showToast('Erro ao excluir curso', 'danger');
            }
          },
        },
      ],
    });

    await alert.present();
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
