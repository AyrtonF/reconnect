// Configurações do Cloudinary
export const CLOUDINARY_CONFIG = {
  cloudName: 'dicaajxk0',
  uploadPreset: 'angular_reconnect',
  // Adicione outras configurações se necessário
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
};

// Validar se as configurações estão corretas
export const validateCloudinaryConfig = (): boolean => {
  return !!(CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset);
};
