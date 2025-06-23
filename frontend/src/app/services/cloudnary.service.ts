import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dicaajxk0';
  private uploadPreset = 'angular_reconnect'; 
  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    try {
      const response: any = await lastValueFrom(this.http.post(url, formData));
      return response.secure_url;
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
      throw err;
    }
  }
}