import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { Course, CourseModule, Video, TextMaterial, Quiz, Achievement, QuizAttempt } from '../../models/types';
import { Observable, map, tap, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
  standalone: false
})
export class CourseDetailsPage implements OnInit {
  courseId: number = 1;
  course$ = new BehaviorSubject<Course | null>(null);
  currentModule: CourseModule | null = null;
  selectedSegment: 'videos' | 'materials' | 'quizzes' = 'videos';
  
  isVideoPlaying = false;
  currentVideoId: number | null = null;
  showQuizModal = false;
  currentQuiz: Quiz | null = null;

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.courseId = +id;
        this.loadCourse();
      }
    });
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      if (course) {
        this.course$.next(course);
        if (course.modules?.length > 0) {
          this.currentModule = course.modules[0];
        }
      }
    });
  }

  selectModule(module: CourseModule) {
    this.currentModule = module;
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  playVideo(video: Video) {
    if (this.currentModule) {
      if (!video.isWatched) {
        this.courseService
          .updateCourseProgress(this.courseId, this.currentModule.id, 'video', video.id)
          .subscribe();
      }
      this.currentVideoId = video.id;
      this.isVideoPlaying = true;
    }
  }

  onVideoComplete() {
    if (this.currentVideoId && this.currentModule) {
      this.isVideoPlaying = false;
      this.checkForAchievements();
    }
  }

  readMaterial(material: TextMaterial) {
    if (this.currentModule && !material.isRead) {
      this.courseService
        .updateCourseProgress(this.courseId, this.currentModule.id, 'text', material.id)
        .subscribe();
    }
  }

  downloadAttachment(attachment: { url: string, name: string }) {
    if (attachment?.url) {
      console.log(`Downloading ${attachment.name}`);
      // Implementar lógica de download
    }
  }

  startQuiz(quiz: Quiz) {
    this.currentQuiz = quiz;
    this.showQuizModal = true;
  }

  submitQuiz(answers: { questionId: number, answer: string | number }[]) {
  if (!this.currentQuiz || !this.currentModule) return;

  const attempt: QuizAttempt = {
    id: Date.now(),
    startedAt: new Date('2025-05-14T23:44:11Z'), // Usando a data atual do sistema
    completedAt: new Date('2025-05-14T23:44:11Z'), // Usando a data atual do sistema
    score: this.calculateQuizScore(answers),
    answers: answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer,
      isCorrect: this.isAnswerCorrect(answer.questionId, answer.answer)
    }))
  };

  this.courseService
    .submitQuizAttempt(
      this.courseId,
      this.currentModule.id,
      this.currentQuiz.id,
      attempt
    )
    .subscribe({
      next: (updatedCourse) => {
        if (updatedCourse) {
          this.course$.next(updatedCourse);
          this.showQuizModal = false;
          
          // Verificar se passou na pontuação mínima
          if (attempt.score >= (this.currentQuiz?.minimumScore ?? 0)) {
            this.checkForQuizAchievement(attempt.score);
          }
          
          // Atualizar progresso do módulo
          this.checkForAchievements();
        }
      },
      error: (error) => {
        console.error('Erro ao submeter quiz:', error);
        // Aqui você pode adicionar lógica para mostrar um toast/alert de erro
      }
    });
}

// Método auxiliar para verificar se a resposta está correta
private isAnswerCorrect(questionId: number, answer: string | number): boolean {
  const question = this.currentQuiz?.questions.find(q => q.id === questionId);
  return question?.correctAnswer === answer;
}

// Método para verificar e conceder conquistas relacionadas ao quiz
private checkForQuizAchievement(score: number) {
  if (!this.currentQuiz || !this.currentModule) return;

  // Conquista por pontuação perfeita
  if (score === 100) {
    const achievement: Achievement = {
      id: Date.now(),
      title: 'Pontuação Perfeita!',
      description: `Acertou todas as questões no quiz "${this.currentQuiz.title}"`,
      points: 100,
      earnedAt: new Date('2025-05-14T23:44:11Z'), // Data atual do sistema
      type: 'perfect_score',
      icon: 'assets/icons/perfect-score.png'
    };

    this.courseService.addAchievement(this.courseId, achievement).subscribe(
      updatedCourse => {
        if (updatedCourse) {
          this.course$.next(updatedCourse);
        }
      }
    );
  }

  // Conquista por primeira conclusão de quiz
  if (!this.currentQuiz.attempts || this.currentQuiz.attempts.length === 1) {
    const achievement: Achievement = {
      id: Date.now(),
      title: 'Primeiro Quiz Concluído',
      description: `Completou seu primeiro quiz no módulo "${this.currentModule.title}"`,
      points: 50,
      earnedAt: new Date('2025-05-14T23:44:11Z'), // Data atual do sistema
      type: 'completion',
      icon: 'assets/icons/first-quiz.png'
    };

    this.courseService.addAchievement(this.courseId, achievement).subscribe(
      updatedCourse => {
        if (updatedCourse) {
          this.course$.next(updatedCourse);
        }
      }
    );
  }
}

// Atualizar o método calculateQuizScore para ser mais preciso
private calculateQuizScore(answers: { questionId: number, answer: string | number }[]): number {
  if (!this.currentQuiz) return 0;
  
  const totalPoints = this.currentQuiz.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const earnedPoints = answers.reduce((score, answer) => {
    const question = this.currentQuiz?.questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.answer) {
      return score + (question.points ?? 0);
    }
    return score;
  }, 0);

  // Retorna a porcentagem da pontuação
  return Math.round((earnedPoints / totalPoints) * 100);
}

  private checkForAchievements() {
    const course = this.course$.getValue();
    if (!course || !this.currentModule) return;

    const allVideosWatched = this.currentModule.content.videos.every(v => v.isWatched);
    if (allVideosWatched) {
      const achievement: Achievement = {
        id: Date.now(),
        title: 'Mestre dos Vídeos',
        description: `Completou todos os vídeos do módulo ${this.currentModule.title}`,
        points: 50,
        earnedAt: new Date(),
        type: 'completion',
        icon: 'assets/icons/video-achievement.png'
      };
      this.courseService.addAchievement(this.courseId, achievement).subscribe();
    }
  }

  moduleProgress(module: CourseModule): number {
    if (!module?.content) return 0;

    const total = 
      (module.content.videos?.length ?? 0) +
      (module.content.textMaterials?.length ?? 0) +
      (module.content.quizzes?.length ?? 0);
    
    if (total === 0) return 0;

    const completed =
      (module.content.videos?.filter(v => v.isWatched)?.length ?? 0) +
      (module.content.textMaterials?.filter(t => t.isRead)?.length ?? 0) +
      (module.content.quizzes?.filter(q => q.isCompleted)?.length ?? 0);

    return (completed / total) * 100;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor((seconds ?? 0) / 60);
    const remainingSeconds = (seconds ?? 0) % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}