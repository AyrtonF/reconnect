import { Injectable } from '@angular/core';
import { TextMaterial } from '../models/types';

import { Observable, of } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class TextMaterialService {
  private textMaterials: TextMaterial[] = [
    { id: 1, title: 'Atenção aos riscos digitais', text: 'Entenda os principais riscos...' },
    { id: 2, title: 'Guia de Segurança Online para Adolescentes' },
    // Adicione mais materiais de texto conforme necessário
  ];

  constructor() { }

  getAllTextMaterials(): Observable<TextMaterial[]> {
    return of(this.textMaterials);
  }

  getTextMaterialById(id: number): Observable<TextMaterial | undefined> {
    const textMaterial = this.textMaterials.find(tm => tm.id === id);
    return of(textMaterial);
  }

  addTextMaterial(textMaterial: TextMaterial): Observable<TextMaterial> {
    textMaterial.id = this.generateId();
    this.textMaterials.push(textMaterial);
    return of(textMaterial);
  }

  updateTextMaterial(updatedTextMaterial: TextMaterial): Observable<TextMaterial | undefined> {
    const index = this.textMaterials.findIndex(tm => tm.id === updatedTextMaterial.id);
    if (index !== -1) {
      this.textMaterials[index] = updatedTextMaterial;
      return of(updatedTextMaterial);
    }
    return of(undefined);
  }

  deleteTextMaterial(id: number): Observable<boolean> {
    const initialLength = this.textMaterials.length;
    this.textMaterials = this.textMaterials.filter(tm => tm.id !== id);
    return of(this.textMaterials.length < initialLength);
  }

  private generateId(): number {
    if (this.textMaterials.length === 0) {
      return 1;
    }
    return Math.max(...this.textMaterials.map(tm => tm.id)) + 1;
  }
}