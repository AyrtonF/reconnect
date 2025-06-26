import { environment } from '../../environments/environment';

export const APP_CONFIG = {
  // URLs da API
  API_URL: environment.apiUrl,

  // Configurações de autenticação
  AUTH: {
    TOKEN_KEY: 'authToken',
    USER_ROLE_KEY: 'userRole',
    USER_ID_KEY: 'userId',
    TOKEN_EXPIRY_HOURS: 24,
  },

  // Configurações da aplicação
  APP: {
    NAME: 'Reconnect',
    VERSION: '1.0.0',
  },

  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // Timeouts
  TIMEOUTS: {
    DEFAULT_HTTP_TIMEOUT: 30000, // 30 segundos
    TOAST_DURATION: 3000,
  },

  // Roles de usuários
  USER_ROLES: {
    ADMIN: 'ADMIN',
    INSTITUTION_ADMIN: 'INSTITUTION_ADMIN',
    USER: 'USER',
  },

  // Rotas protegidas que precisam de autenticação
  PROTECTED_ROUTES: [
    '/home',
    '/profile',
    '/courses',
    '/challenge',
    '/family-details',
    '/partners',
    '/my-coupons',
    '/home-company',
    '/course-institution',
    '/add-course-institution',
    '/add-coupon',
  ],

  // Rotas públicas
  PUBLIC_ROUTES: ['/main', '/login', '/register'],
};
