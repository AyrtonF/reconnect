import { Component } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone:false
})
export class CoursesPage {
  userAvatar = 'assets/user-avatar.jpg';

  searchTerm: string = '';

  courses = [
    {
      title: 'Os riscos da exposição à internet na adolescência',
      description:
        'Aprenda a identificar e prevenir os principais riscos da exposição de crianças e adolescentes na internet, promovendo um uso seguro e consciente das redes.',
      image: '../../../assets/images/course1.png', 
    },
    {
      title: 'O Impacto do Uso Excessivo da Internet',
      description:
        'Entenda os sinais de dependência digital em crianças e adolescentes e aprenda estratégias para promover um uso saudável da tecnologia.',
      image: '../../../assets/images/course2.png',
    },
  ];

  filteredCourses() {
    if (!this.searchTerm.trim()) return this.courses;
    const lower = this.searchTerm.toLowerCase();
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(lower)
    );
  }
}
