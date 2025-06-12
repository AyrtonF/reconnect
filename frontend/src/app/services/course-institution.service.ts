import { Injectable } from '@angular/core';
import { ApiResponse, Course, InstitutionCourse } from '../models/types';
import { BehaviorSubject, delay, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseInstitutionService {
 private mockCourses: InstitutionCourse[] = [
    {
      id: 1,
      institutionId: 1,
      name: 'Vida X Dependencia de Internet',
      description: 'Como a dependencia de internet afeta a vida moderna',
      image: '../../assets/images/course-image.png',
      materials: [],
      videos: [],
      questions: [],
      createdAt: new Date('2025-06-12'),
      updatedAt: new Date('2025-06-12'),
      status: 'published',
      studentsEnrolled: [],
      settings: {
        allowEnrollment: true,
        requireApproval: false,
        maxStudents: 100
      }
    },
    {
      id: 2,
      institutionId: 1,
      name: 'como melhorar a interação fora da internet',
      description: 'a internet esta atraplhando a interação social?',
      image: '../../assets/images/course/course-1.png',
      materials: [],
      videos: [],
      questions: [],
      createdAt: new Date('2025-06-11'),
      updatedAt: new Date('2025-06-11'),
      status: 'published',
      studentsEnrolled: [],
      settings: {
        allowEnrollment: true,
        requireApproval: false,
        maxStudents: 50
      }
    }
  ];

  private courses = new BehaviorSubject<InstitutionCourse[]>(this.mockCourses);

  constructor() {}

  // Obter todos os cursos
  getCourses(): Observable<InstitutionCourse[]> {
    return this.courses.asObservable().pipe(
      delay(500) // Simula delay de rede
    );
  }

  // Buscar cursos
  searchCourses(query: string): Observable<InstitutionCourse[]> {
    return this.courses.pipe(
      map(courses => courses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Obter curso por ID
  getCourseById(id: number): Observable<ApiResponse<InstitutionCourse>> {
    const course = this.mockCourses.find(c => c.id === id);
    
    if (!course) {
      return throwError(() => ({
        success: false,
        error: 'Curso não encontrado',
        message: 'O curso solicitado não existe'
      }));
    }

    return of({
      success: true,
      data: course
    }).pipe(delay(300));
  }

  // Criar novo curso
  createCourse(courseData: Partial<InstitutionCourse>): Observable<ApiResponse<InstitutionCourse>> {
    const newCourse: InstitutionCourse = {
      id: this.generateNewId(),
      institutionId: 1,
      name: courseData.name || '',
      description: courseData.description || '',
      image: courseData.image,
      materials: courseData.materials || [],
      videos: courseData.videos || [],
      questions: courseData.questions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      studentsEnrolled: [],
      settings: {
        allowEnrollment: true,
        requireApproval: false,
        maxStudents: 100
      }
    };

    this.mockCourses.push(newCourse);
    this.courses.next(this.mockCourses);

    return of({
      success: true,
      data: newCourse,
      message: 'Curso criado com sucesso'
    }).pipe(delay(500));
  }

  // Atualizar curso
  updateCourse(courseId: number, updates: Partial<InstitutionCourse>): Observable<ApiResponse<InstitutionCourse>> {
    const index = this.mockCourses.findIndex(c => c.id === courseId);
    
    if (index === -1) {
      return throwError(() => ({
        success: false,
        error: 'Curso não encontrado',
        message: 'Não foi possível atualizar o curso'
      }));
    }

    const updatedCourse = {
      ...this.mockCourses[index],
      ...updates,
      updatedAt: new Date()
    };

    this.mockCourses[index] = updatedCourse;
    this.courses.next(this.mockCourses);

    return of({
      success: true,
      data: updatedCourse,
      message: 'Curso atualizado com sucesso'
    }).pipe(delay(500));
  }

  // Excluir curso
  deleteCourse(courseId: number): Observable<ApiResponse<void>> {
    const index = this.mockCourses.findIndex(c => c.id === courseId);
    
    if (index === -1) {
      return throwError(() => ({
        success: false,
        error: 'Curso não encontrado',
        message: 'Não foi possível excluir o curso'
      }));
    }

    this.mockCourses.splice(index, 1);
    this.courses.next(this.mockCourses);

    return of({
      success: true,
      message: 'Curso excluído com sucesso'
    }).pipe(delay(500));
  }

  // Gerar novo ID (simulando auto-increment do banco)
  private generateNewId(): number {
    return Math.max(...this.mockCourses.map(c => c.id)) + 1;
  }

  // Upload de imagem (mock)
  uploadImage(file: File): Observable<ApiResponse<string>> {
    return new Observable<ApiResponse<string>>(observer => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        
        observer.next({
          success: true,
          data: base64Image,
          message: 'Imagem carregada com sucesso'
        });
        
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error({
          success: false,
          error: 'Erro ao carregar imagem',
          message: error.toString()
        });
      };

      reader.readAsDataURL(file);
    }).pipe(delay(1000));
  }
}
