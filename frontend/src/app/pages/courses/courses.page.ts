import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CourseInstitutionService } from 'src/app/services/course-institution.service';
import { AuthService } from 'src/app/services/auth.service';
import { Course } from 'src/app/models/types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavController, ToastController } from '@ionic/angular';
import { navigate } from 'src/app/functions/navigate';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: false,
})
export class CoursesPage implements OnInit {
  searchTerm: string = '';
  courses$: Observable<Course[]>;

  constructor(
    private courseService: CourseService,
    private courseInstitutionService: CourseInstitutionService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
    // Inicializar com todos os cursos por enquanto
    this.courses$ = this.courseService.getAllCourses();
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    // Por enquanto, carregar todos os cursos até que o backend implemente os endpoints necessários
    this.courses$ = this.courseService.getAllCourses();
  }

  goBack() {
    navigate(this.navCtrl, '/home');
  }

  // Método para inscrever-se em um curso
  enrollInCourse(course: Course) {
    const isInstitutionalCourse = course.isInstitutional || false;

    if (isInstitutionalCourse) {
      // Para cursos institucionais
      console.log('Matriculando em curso institucional:', course.id);
      this.enrollInInstitutionalCourse(course.id, course);
    } else {
      // Para cursos regulares
      console.log('Matriculando em curso regular:', course.id);
      this.courseService.enrollInCourseCurrentUser(course.id).subscribe({
        next: (enrolled) => {
          if (enrolled) {
            // Matrícula bem-sucedida, navegar para detalhes
            this.showSuccessMessage('Matriculado com sucesso no curso!');
            this.goToCourseDetails(course);
            // Recarregar lista para atualizar status
            this.loadCourses();
          } else {
            this.showErrorMessage('Não foi possível realizar a matrícula.');
          }
        },
        error: (error) => {
          console.error('Erro ao matricular no curso regular:', error);
          this.showErrorMessage(
            'Erro ao se matricular no curso. Tente novamente.'
          );
        },
      });
    }
  }

  // Método para navegar para detalhes do curso
  goToCourseDetails(course: Course) {
    const type = course.isInstitutional ? 'institutional' : 'regular';
    this.navCtrl.navigateForward(`/course-details/${course.id}`, {
      queryParams: { type },
    });
  }

  // Método legado mantido para compatibilidade (será removido)
  startCourse(course: Course) {
    if (!course.isEnrolled) {
      this.enrollInCourse(course);
    } else {
      this.goToCourseDetails(course);
    }
  }

  // Método para matricular em cursos institucionais
  private enrollInInstitutionalCourse(courseId: number, course: Course) {
    const userId = this.authService.getUserId();
    console.log(userId);
    if (!userId) {
      this.showErrorMessage('Usuário não autenticado. Faça login novamente.');
      return;
    }

    console.log(
      'Matriculando em curso institucional:',
      courseId,
      'para usuário:',
      userId
    );

    // Usar o serviço de cursos institucionais com o ID real
    this.courseInstitutionService
      .enrollUserInCourse(courseId, userId)
      .subscribe({
        next: (enrolled) => {
          if (enrolled) {
            // Matrícula bem-sucedida
            this.showSuccessMessage('Matriculado com sucesso no curso!');

            // Navegar para o curso usando o método padronizado
            console.log('OLHA O ID AQUI' + courseId);
            this.goToCourseDetails(course);

            // Recarregar lista para atualizar status
            this.loadCourses();
          } else {
            this.showErrorMessage('Não foi possível realizar a matrícula.');
          }
        },
        error: (error) => {
          console.error('Erro ao matricular em curso institucional:', error);

          if (error.status === 400) {
            this.showErrorMessage(
              'Dados da matrícula inválidos. Verifique se você tem permissão para este curso.'
            );
          } else if (error.status === 404) {
            this.showErrorMessage(
              'Curso não encontrado. Verifique se o curso existe.'
            );
          } else if (error.status === 403) {
            this.showErrorMessage(
              'Você não tem permissão para se matricular neste curso.'
            );
          } else {
            this.showErrorMessage(
              'Erro ao se matricular no curso. Tente novamente.'
            );
          }
        },
      });
  }

  // Método para mostrar mensagem de erro
  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  // Método para mostrar mensagem de sucesso
  private async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  filterCourses(event: any) {
    const searchTerm = event?.target?.value?.toLowerCase() || '';

    if (!searchTerm) {
      this.loadCourses();
      return;
    }

    this.courses$ = this.courseService
      .getAllCourses()
      .pipe(
        map((courses) =>
          courses.filter(
            (course) =>
              course.title.toLowerCase().includes(searchTerm) ||
              course.description.toLowerCase().includes(searchTerm)
          )
        )
      );
  }
}
