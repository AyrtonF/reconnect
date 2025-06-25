import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { AuthService } from 'src/app/services/auth.service';
import { User, StudentCourse as Course } from 'src/app/models/types';
import { NavController, AlertController } from '@ionic/angular';
import { navigate } from 'src/app/functions/navigate';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  username = '';
  points = 0;
  progress = 0;
  pointsAwarded = 100;
  currentUser: User | null = null;
  inProgressCourses: Course[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserData();
    this.loadInProgressCourses();
  }

  loadCurrentUserData() {
    if (!this.authService.isLoggedIn()) {
      this.navCtrl.navigateRoot('/login');
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.username = user.name || 'Usuário';
        this.points = user.score || 0;
        this.progress = Math.min(100, (this.points / 1000) * 100);
        this.loading = false;
      },
      error: async (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
        this.loading = false;

        if (
          error.message.includes('Token inválido') ||
          error.message.includes('não autorizado')
        ) {
          // Token inválido, redireciona para login
          await this.showAlert(
            'Sessão Expirada',
            'Sua sessão expirou. Faça login novamente.'
          );
          this.authService.logout();
          this.navCtrl.navigateRoot('/login');
        } else {
          await this.showAlert('Erro', 'Erro ao carregar dados do usuário');
        }
      },
    });
  }

  loadInProgressCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.inProgressCourses = courses.filter(
          (course) =>
            course.isEnrolled && course.progress?.status === 'in_progress'
        );
      },
      error: (error) => {
        console.error('Erro ao carregar cursos:', error);
      },
    });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  navigateToPage(pageName: string) {
    navigate(this.navCtrl, pageName);
  }

  accessCourse(courseId: number) {
    const actualId = courseId > 1000 ? courseId - 1000 : courseId;
    const type = courseId > 1000 ? 'institutional' : 'regular';
    this.navCtrl.navigateForward(`/course-details/${actualId}`, {
      queryParams: { type },
    });
  }

  // Método para refresh dos dados
  doRefresh(event: any) {
    this.loadCurrentUserData();
    this.loadInProgressCourses();

    // Simula um delay para o refresh
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
