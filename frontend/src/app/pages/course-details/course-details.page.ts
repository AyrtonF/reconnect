import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
  standalone:false
})
export class CourseDetailsPage implements OnInit {

  course: any;
  progress: number = 0;

  ngOnInit() {
    this.course = {
      title: 'O Impacto do Uso Excessivo Da Internet',
      description: 'Lorem ipsum dolor bla bla lorem ipsum dolor radkitum blablak tengo tengo...',
      image: '../../../assets/images/internet-impact.png',
      videos: [
        { title: 'Aula 01 - Uso do instagram', completed: false },
        { title: 'Aula 02 - Dependência digital', completed: true },
        { title: 'Aula 03 - Desconectar-se em família', completed: false }
      ]
    };

    this.updateProgress();
  }

  toggleComplete(index: number) {
    this.course.videos[index].completed = !this.course.videos[index].completed;
    this.updateProgress();
  }

  updateProgress() {
    const total = this.course.videos.length;
    const completed = this.course.videos.filter((v:any) => v.completed).length;
    this.progress = total > 0 ? completed / total : 0;
  }
}
