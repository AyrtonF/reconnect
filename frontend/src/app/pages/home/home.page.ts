import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { User, StudentCourse as Course } from 'src/app/models/types';
import { NavController } from '@ionic/angular';
import { navigate } from 'src/app/functions/navigate';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  username = '';
  points = 0;
  progress = 0;
  pointsAwarded = 100;
  userId: number | null = null;
  inProgressCourses: Course[] = [];

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.userId = 1;

    if (this.userId !== null) {
      this.loadUserData(this.userId);
      this.loadInProgressCourses();
    }
  }

  loadUserData(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        if (user) {
          this.username = user.name || 'Usuário';
          this.points = user.score || 0;
          this.progress = Math.min(100, (this.points / 1000) * 100);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    });
  }

  loadInProgressCourses() {
    this.courseService.getAllCourses().subscribe(courses => {
      this.inProgressCourses = courses.filter(course => 
        course.isEnrolled && 
        course.progress?.status === 'in_progress'
      );
    });
  }

  navigateToPage(pageName: string) {
    navigate(this.navCtrl, pageName);
  }

  accessCourse(courseId: number) {
    const actualId = courseId > 1000 ? courseId - 1000 : courseId;
    const type = courseId > 1000 ? 'institutional' : 'regular';
    this.navCtrl.navigateForward(`/course-details/${actualId}`, {
      queryParams: { type }
    });
  }
}