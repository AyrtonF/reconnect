import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: false
})
export class CoursesPage implements OnInit {
  userAvatar = '../../../assets/images/default-user.png';
  currentUser = 'andre';
  searchTerm: string = '';
  courses$: Observable<Course[]>;
  
  // Estatísticas do usuário
  userStats = {
    totalCourses: 0,
    completedCourses: 0,
    totalAchievements: 0,
    totalPoints: 0
  };

  constructor(private courseService: CourseService) {
    this.courses$ = this.courseService.getAllCourses();
    this.updateUserStats();
  }

  ngOnInit() {
    // Inicializar dados do usuário e cursos
    this.loadUserData();
  }

  filteredCourses(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => {
        if (!this.searchTerm.trim()) return courses;
        const lower = this.searchTerm.toLowerCase();
        return courses.filter(course =>
          course.title.toLowerCase().includes(lower) ||
          course.description.toLowerCase().includes(lower) ||
          course.tags.some(tag => tag.toLowerCase().includes(lower))
        );
      })
    );
  }

  // Métodos para manipulação de cursos
  enrollInCourse(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe((course:any) => {
      if (course) {
        course.isEnrolled = true;
        course.enrollmentDate = new Date('2025-05-14T23:20:25Z');
        this.courseService.updateCourse(course).subscribe(() => {
          this.updateUserStats();
        });
      }
    });
  }

  continueLastCourse() {
    this.courses$.pipe(
      map(courses => courses
        .filter(course => course.isEnrolled)
        .sort((a, b) => 
          (b.progress.lastAccessDate?.getTime() || 0) - 
          (a.progress.lastAccessDate?.getTime() || 0)
        )[0]
      )
    ).subscribe(course => {
      if (course) {
        // Navegar para o último módulo acessado
        console.log('Continuando curso:', course.title);
      }
    });
  }

  // Métodos de filtro e ordenação
  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === category))
    );
  }

  filterByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.level === level))
    );
  }

  sortByProgress(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => 
        [...courses].sort((a, b) => 
          (b.progress?.percentageCompleted || 0) - (a.progress?.percentageCompleted || 0)
        )
      )
    );
  }

  // Métodos de estatísticas e progresso
  private updateUserStats() {
    this.courses$.subscribe(courses => {
      const enrolledCourses = courses.filter(course => course.isEnrolled);
      this.userStats = {
        totalCourses: enrolledCourses.length,
        completedCourses: enrolledCourses.filter(course => 
          course.progress.status === 'completed'
        ).length,
        totalAchievements: enrolledCourses.reduce((total, course) => 
          total + course.score.achievements.length, 0),
        totalPoints: enrolledCourses.reduce((total, course) => 
          total + course.score.current, 0)
      };
    });
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }

  // Métodos auxiliares
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes}min`
      : `${remainingMinutes}min`;
  }

  private loadUserData() {
    // Simular carregamento de dados do usuário
    console.log('Carregando dados para usuário:', this.currentUser);
    this.updateUserStats();
  }

  // Getters para template
  get enrolledCourses$(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.isEnrolled))
    );
  }

  get availableCourses$(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => !course.isEnrolled))
    );
  }

  get inProgressCourses$(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => 
        course.isEnrolled && 
        course.progress.status === 'in_progress'
      ))
    );
  }
}