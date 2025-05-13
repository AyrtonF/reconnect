import { Injectable } from '@angular/core';
import { Course } from '../models/types';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [
    {
      id: 1,
      title: 'Os riscos da exposição à internet na adolescência',
      description: 'Aprenda a identificar e prevenir os principais riscos da exposição de crianças e adolescentes na internet.',
      workload: 90,
      score: 150,
      progress: 80,
      videos: ['assets/videos/aula1.mp4', 'assets/videos/aula2.mp4'],
      textMaterialIds: [1, 2]
    },
    {
      id: 2,
      title: 'Introdução à Programação com JavaScript',
      description: 'Um curso básico para iniciantes que desejam aprender a programar com JavaScript.',
      workload: 60,
      score: 100,
      progress: 30,
      videos: ['assets/videos/js_aula1.mp4'],
      textMaterialIds: [3]
    },
    // Adicione mais cursos de mock conforme necessário
  ];

  constructor() { }

  // Retorna todos os cursos
  getAllCourses(): Observable<Course[]> {
    return of(this.courses);
  }

  // Retorna um curso pelo ID
  getCourseById(id: number): Observable<Course | undefined> {
    const course = this.courses.find(course => course.id === id);
    return of(course);
  }

  // Adiciona um novo curso
  addCourse(course: Course): Observable<Course> {
    course.id = this.generateId(); // Simula a geração de um ID
    this.courses.push(course);
    return of(course);
  }

  // Atualiza um curso existente
  updateCourse(updatedCourse: Course): Observable<Course | undefined> {
    const index = this.courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      this.courses[index] = updatedCourse;
      return of(updatedCourse);
    }
    return of(undefined); // Retorna undefined se o curso não for encontrado
  }

  // Deleta um curso pelo ID
  deleteCourse(id: number): Observable<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(course => course.id !== id);
    return of(this.courses.length < initialLength);
  }

  // Simula a geração de um ID único
  private generateId(): number {
    if (this.courses.length === 0) {
      return 1;
    }
    return Math.max(...this.courses.map(course => course.id)) + 1;
  }
}