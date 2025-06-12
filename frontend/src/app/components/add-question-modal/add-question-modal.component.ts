import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

interface QuestionData {
  id: number;
  question: string;
  alternatives: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
  standalone: true
})
export class AddQuestionModalComponent implements OnInit {
  questionData: QuestionData = {
    id: Date.now(),
    question: '',
    alternatives: ['', '', '', ''],
    correctAnswer: 0
  };
  
  isSubmitting = false;
  errorMessage = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  // Novo método para atualizar a questão
  updateQuestion(event: any) {
    const value = event?.detail?.value || '';
    this.questionData.question = value;
  }

  // Método atualizado para as alternativas
  updateAlternative(index: number, event: any) {
    const value = event?.detail?.value || '';
    this.questionData.alternatives = [
      ...this.questionData.alternatives.slice(0, index),
      value,
      ...this.questionData.alternatives.slice(index + 1)
    ];
  }

  validateForm(): boolean {
    if (!this.questionData.question.trim()) {
      this.errorMessage = 'Por favor, insira a pergunta';
      return false;
    }

    const emptyAlternative = this.questionData.alternatives.findIndex(alt => !alt.trim());
    if (emptyAlternative !== -1) {
      this.errorMessage = `Por favor, preencha a alternativa ${['A', 'B', 'C', 'D'][emptyAlternative]}`;
      return false;
    }

    return true;
  }

  async save() {
    try {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      await this.modalCtrl.dismiss(this.questionData);
      
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
      this.errorMessage = 'Erro ao salvar a pergunta. Tente novamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  setCorrectAnswer(index: number) {
    this.questionData.correctAnswer = index;
  }

  trackByFn(index: number): number {
    return index;
  }
}