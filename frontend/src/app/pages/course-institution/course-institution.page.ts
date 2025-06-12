import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CourseInstitutionService } from 'src/app/services/course-institution.service';
import { InstitutionCourse, ApiResponse } from 'src/app/models/types';

@Component({
  selector: 'app-course-institution',
  templateUrl: './course-institution.page.html',
  styleUrls: ['./course-institution.page.scss'],
  standalone: false
})
export class CourseInstitutionPage implements OnInit {
  searchText: string = '';
  courses: InstitutionCourse[] = [];
  filteredCourses: InstitutionCourse[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private courseService: CourseInstitutionService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadCourses();
  }

  async loadCourses() {
    try {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Carregando cursos...'
      });
      await loading.present();

      this.courseService.getCourses().subscribe({
        next: (courses: InstitutionCourse[]) => {
          this.courses = courses;
          this.filteredCourses = courses;
          loading.dismiss();
          this.isLoading = false;
        },
        error: async (error: any) => {
          console.error('Erro ao carregar cursos:', error);
          loading.dismiss();
          this.isLoading = false;
          const toast = await this.toastController.create({
            message: 'Erro ao carregar cursos',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.error('Erro ao carregar cursos:', error);
    }
  }

  addNewCourse() {
    this.router.navigate(['/add-course-institution']);
  }

  searchCourse(event: any) {
    const searchTerm = event?.target?.value?.toLowerCase() || '';
    
    if (!searchTerm) {
      this.filteredCourses = [...this.courses];
      return;
    }

    this.courseService.searchCourses(searchTerm).subscribe((courses: InstitutionCourse[]) => {
      this.filteredCourses = courses;
    });
  }

  async editCourse(course: InstitutionCourse) {
    this.router.navigate(['/edit-course-institution', course.id]);
  }

  async deleteCourse(course: InstitutionCourse) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir o curso "${course.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Excluindo curso...'
            });
            await loading.present();

            this.courseService.deleteCourse(course.id).subscribe({
              next: async (response: ApiResponse<void>) => {
                loading.dismiss();
                if (response.success) {
                  const toast = await this.toastController.create({
                    message: 'Curso excluído com sucesso',
                    duration: 2000,
                    color: 'success'
                  });
                  toast.present();
                  this.loadCourses();
                }
              },
              error: async (error: any) => {
                loading.dismiss();
                const toast = await this.toastController.create({
                  message: 'Erro ao excluir curso',
                  duration: 2000,
                  color: 'danger'
                });
                toast.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}