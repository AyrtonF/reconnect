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
    const userId = this.authService.getUserId();

    console.log(
      'CoursesPage.enrollInCourse - Iniciando processo de matrícula:',
      {
        courseId: course.id,
        userId,
        courseTitle: course.title,
        isInstitutional: isInstitutionalCourse,
        hasToken: !!this.authService.getToken(),
      }
    );

    if (!userId) {
      console.error('CoursesPage.enrollInCourse - Usuário não autenticado');
      this.showErrorMessage('Usuário não autenticado. Faça login novamente.');
      return;
    }

    if (isInstitutionalCourse) {
      // Para cursos institucionais
      console.log(
        'CoursesPage.enrollInCourse - Delegando para curso institucional:',
        course.id
      );
      this.enrollInInstitutionalCourse(course.id, course);
    } else {
      // Para cursos regulares - ir direto para matrícula sem verificação prévia
      console.log(
        'CoursesPage.enrollInCourse - Tentando matrícula em curso regular sem verificação prévia:',
        course.id
      );

      // TEMPORÁRIO: Removendo verificação prévia por problemas de endpoint no backend
      // TODO: Quando o backend implementar os endpoints de verificação, reativar
      this.performRegularEnrollment(course);
    }
  }

  // Método auxiliar para realizar matrícula em curso regular
  private performRegularEnrollment(course: Course) {
    console.log(
      'CoursesPage.performRegularEnrollment - Matriculando em curso regular:',
      course.id
    );

    this.courseService.enrollInCourseCurrentUser(course.id).subscribe({
      next: (enrolled) => {
        console.log(
          'CoursesPage.performRegularEnrollment - Resultado da matrícula:',
          { enrolled, courseId: course.id }
        );

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
        console.error(
          'CoursesPage.performRegularEnrollment - Erro na matrícula:',
          { error, courseId: course.id, status: error.status }
        );

        // Capturar mensagem de erro de múltiplas fontes possíveis
        const errorMessage =
          error.error?.message ||
          error.error ||
          error.message ||
          (typeof error === 'string' ? error : '') ||
          '';

        console.log('CoursesPage.performRegularEnrollment - Analisando erro:', {
          errorMessage,
          fullError: error.error,
          errorType: typeof error,
          errorKeys: Object.keys(error || {}),
          originalError: error,
          status: error.status,
        });

        // Verificar se a mensagem indica que o usuário já está matriculado
        // Independente do status, se a mensagem indica matrícula já existente, tratar como sucesso
        if (
          errorMessage.toLowerCase().includes('já matriculado') ||
          errorMessage.toLowerCase().includes('already enrolled') ||
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage
            .toLowerCase()
            .includes('student may already be enrolled') ||
          errorMessage.toLowerCase().includes('may already be enrolled')
        ) {
          console.log(
            'CoursesPage.performRegularEnrollment - Erro indica usuário já matriculado'
          );
          this.showSuccessMessage(
            'Você já está matriculado neste curso! Redirecionando...'
          );
          this.goToCourseDetails(course);
          return;
        }

        // Outros tipos de erro baseados no status (se disponível)
        if (error.status === 401) {
          this.showErrorMessage('Sessão expirada. Faça login novamente.');
        } else if (error.status === 400) {
          // Erro 400 que não é matrícula já existente
          this.showErrorMessage(
            'Não foi possível realizar a matrícula. Verifique se você tem permissão para este curso.'
          );
        } else {
          this.showErrorMessage(
            'Erro ao se matricular no curso. Tente novamente.'
          );
        }
      },
    });
  }

  // Método para navegar para detalhes do curso
  goToCourseDetails(course: Course) {
    const type = course.isInstitutional ? 'institutional' : 'regular';
    const courseId = course.id;

    console.log(
      'CoursesPage.goToCourseDetails - Navegando para detalhes do curso:',
      {
        courseId,
        courseTitle: course.title,
        isInstitutional: course.isInstitutional,
        type,
        navigationUrl: `/course-details/${courseId}`,
        queryParams: { type },
      }
    );

    this.navCtrl.navigateForward(`/course-details/${courseId}`, {
      queryParams: {
        type,
        // Adicionar informações extras para debug
        courseTitle: course.title,
        isInstitutional: course.isInstitutional,
      },
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
    console.log(
      'CoursesPage.enrollInInstitutionalCourse - Iniciando processo de matrícula:',
      {
        courseId,
        userId,
        course: course.title,
        hasToken: !!this.authService.getToken(),
      }
    );

    if (!userId) {
      console.error(
        'CoursesPage.enrollInInstitutionalCourse - Usuário não autenticado'
      );
      this.showErrorMessage('Usuário não autenticado. Faça login novamente.');
      return;
    }

    // TEMPORÁRIO: Ir direto para matrícula sem verificação prévia
    // TODO: Quando o backend implementar o endpoint GET /{courseId}/enrollment/{userId},
    // reativar a verificação prévia
    console.log(
      'CoursesPage.enrollInInstitutionalCourse - Tentando matrícula diretamente (sem verificação prévia)',
      { courseId, userId }
    );

    this.performEnrollment(courseId, userId, course);
  }

  // Método auxiliar para realizar a matrícula
  private performEnrollment(courseId: number, userId: number, course: Course) {
    console.log('CoursesPage.performEnrollment - Realizando matrícula:', {
      courseId,
      userId,
      courseTitle: course.title,
    });

    this.courseInstitutionService
      .enrollUserInCourse(courseId, userId)
      .subscribe({
        next: (enrolled) => {
          console.log(
            'CoursesPage.performEnrollment - Resultado da matrícula:',
            enrolled
          );
          if (enrolled) {
            // Matrícula bem-sucedida
            this.showSuccessMessage('Matriculado com sucesso no curso!');

            // Navegar para o curso usando o método padronizado
            console.log(
              'CoursesPage.performEnrollment - Navegando para curso ID:',
              courseId
            );
            this.goToCourseDetails(course);

            // Recarregar lista para atualizar status
            this.loadCourses();
          } else {
            console.warn(
              'CoursesPage.performEnrollment - Matrícula retornou false'
            );
            this.showErrorMessage('Não foi possível realizar a matrícula.');
          }
        },
        error: (error) => {
          console.error('CoursesPage.performEnrollment - Erro na matrícula:', {
            error,
            status: error.status,
            statusText: error.statusText,
            errorBody: error.error,
            courseId,
            userId,
          });

          // Capturar mensagem de erro de múltiplas fontes possíveis
          const errorMessage =
            error.error?.message ||
            error.error ||
            error.message ||
            (typeof error === 'string' ? error : '') ||
            '';

          console.log('CoursesPage.performEnrollment - Analisando erro:', {
            errorMessage,
            fullError: error.error,
            errorType: typeof error,
            errorKeys: Object.keys(error || {}),
            originalError: error,
            status: error.status,
          });

          // Verificar se a mensagem indica que o usuário já está matriculado
          // Independente do status, se a mensagem indica matrícula já existente, tratar como sucesso
          if (
            errorMessage.toLowerCase().includes('já matriculado') ||
            errorMessage.toLowerCase().includes('already enrolled') ||
            errorMessage.toLowerCase().includes('duplicate') ||
            errorMessage
              .toLowerCase()
              .includes('student may already be enrolled') ||
            errorMessage.toLowerCase().includes('may already be enrolled')
          ) {
            console.log(
              'CoursesPage.performEnrollment - Erro indica usuário já matriculado'
            );
            this.showSuccessMessage(
              'Você já está matriculado neste curso! Redirecionando...'
            );
            this.goToCourseDetails(course);
            return;
          }

          // Outros tipos de erro baseados no status (se disponível)
          if (error.status === 404) {
            this.showErrorMessage(
              'Curso não encontrado. Verifique se o curso existe.'
            );
          } else if (error.status === 403) {
            this.showErrorMessage(
              'Você não tem permissão para se matricular neste curso.'
            );
          } else if (error.status === 401) {
            this.showErrorMessage('Sessão expirada. Faça login novamente.');
          } else if (error.status === 400) {
            // Erro 400 que não é matrícula já existente
            this.showErrorMessage(
              'Não foi possível realizar a matrícula. Verifique se você tem permissão para este curso.'
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
