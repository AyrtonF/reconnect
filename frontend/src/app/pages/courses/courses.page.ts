import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
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
    private navCtrl: NavController
  ) {
    this.courses$ = this.courseService.getAllCourses();
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courses$ = this.courseService.getAllCourses();
  }

  goBack() {
    navigate(this.navCtrl, '/home');
  }
  startCourse(course: Course) {
    if (!course.isEnrolled) {
      this.courseService.enrollInCourse(course.id).subscribe(() => {
        const type = course.id > 1000 ? 'institutional' : 'regular';
        const actualId = course.id > 1000 ? course.id - 1000 : course.id;
        this.navCtrl.navigateForward(`/course-details/${actualId}`, {
          queryParams: { type },
        });
      });
    } else {
      const type = course.id > 1000 ? 'institutional' : 'regular';
      const actualId = course.id > 1000 ? course.id - 1000 : course.id;
      this.navCtrl.navigateForward(`/course-details/${actualId}`, {
        queryParams: { type },
      });
    }
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
