import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  CLOUDINARY_CONFIG,
  validateCloudinaryConfig,
} from '../config/cloudinary.config';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    // Validações básicas
    if (!file) {
      throw new Error('Nenhum arquivo fornecido');
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem');
    }

    // Verificar tipos permitidos
    if (!CLOUDINARY_CONFIG.allowedTypes.includes(file.type)) {
      throw new Error(
        'Tipo de arquivo não suportado. Use: JPEG, PNG, GIF ou WebP'
      );
    }

    // Verificar tamanho
    if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
      throw new Error('A imagem é muito grande. Tamanho máximo: 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

    try {
      console.log('Enviando imagem para Cloudinary:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      });

      const response: any = await lastValueFrom(this.http.post(url, formData));

      console.log('Resposta do Cloudinary:', response);

      if (response && response.secure_url) {
        return response.secure_url;
      } else {
        throw new Error('Resposta inválida do Cloudinary');
      }
    } catch (error: any) {
      console.error('Erro detalhado ao enviar imagem:', error);

      // Melhor tratamento de erros
      if (error.error?.error?.message) {
        throw new Error(`Erro do Cloudinary: ${error.error.error.message}`);
      } else if (error.status === 0) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else if (error.status === 400) {
        throw new Error(
          'Dados inválidos. Verifique se o upload preset está correto.'
        );
      } else if (error.status === 401) {
        throw new Error(
          'Não autorizado. Verifique as configurações do Cloudinary.'
        );
      } else {
        throw new Error('Erro ao enviar imagem. Tente novamente.');
      }
    }
  }

  async uploadVideo(file: File): Promise<string> {
    // Validações básicas
    if (!file) {
      throw new Error('Nenhum arquivo fornecido');
    }

    // Verificar se é um vídeo
    if (!file.type.startsWith('video/')) {
      throw new Error('O arquivo deve ser um vídeo');
    }

    // Verificar tamanho (aumentado para vídeos - 100MB)
    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxVideoSize) {
      throw new Error('O vídeo é muito grande. Tamanho máximo: 100MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`;

    try {
      console.log('Enviando vídeo para Cloudinary:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        url: url,
      });

      const response = await lastValueFrom(this.http.post<any>(url, formData));

      console.log('Resposta do Cloudinary para vídeo:', response);

      if (response?.secure_url) {
        return response.secure_url;
      } else {
        console.error('Resposta inesperada do Cloudinary:', response);
        throw new Error('Resposta inválida do Cloudinary');
      }
    } catch (error: any) {
      console.error('Erro detalhado ao enviar vídeo:', error);

      // Melhor tratamento de erros
      if (error.error?.error?.message) {
        throw new Error(`Erro do Cloudinary: ${error.error.error.message}`);
      } else if (error.status === 0) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else if (error.status === 400) {
        throw new Error(
          'Dados inválidos. Verifique se o upload preset está correto.'
        );
      } else if (error.status === 401) {
        throw new Error(
          'Não autorizado. Verifique as configurações do Cloudinary.'
        );
      } else {
        throw new Error('Erro ao enviar vídeo. Tente novamente.');
      }
    }
  }

  // Método auxiliar para validar configurações
  validateConfig(): boolean {
    return validateCloudinaryConfig();
  }

  // Método de teste para debug de CORS
  async testConnection(): Promise<boolean> {
    try {
      // Teste simples de conectividade
      const testUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

      // Criar um formData de teste mínimo
      const formData = new FormData();
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

      console.log('Testando conexão com Cloudinary...');
      console.log('URL:', testUrl);
      console.log('Upload Preset:', CLOUDINARY_CONFIG.uploadPreset);

      return true;
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      return false;
    }
  }
}
