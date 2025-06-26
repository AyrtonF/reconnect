# 🔗 ReConnect - Plataforma de Combate à Dependência Digital

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [API Reference](#api-reference)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

**ReConnect** é uma aplicação móvel híbrida desenvolvida para combater a dependência digital através de:

- 🎯 **Desafios gamificados** para reduzir o tempo de tela
- 👨‍👩‍👧‍👦 **Sistema de família** para apoio mútuo
- 🏆 **Sistema de pontuação e recompensas**
- 🎓 **Cursos educacionais** oferecidos por instituições parceiras
- 💰 **Marketplace de cupons** como incentivo
- 📱 **Interface intuitiva** baseada em Ionic/Angular

### Objetivo Principal
Ajudar usuários a desenvolver hábitos saudáveis de uso de tecnologia através de uma abordagem gamificada e suporte social.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Angular)     │◄──►│  (Spring Boot)  │◄──►│  (PostgreSQL)   │
│   Ionic         │    │   REST API      │    │   Render.com    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Capacitor     │    │   Render.com    │
│   (Mobile)      │    │   (Deploy)      │
└─────────────────┘    └─────────────────┘
```

### Padrão de Arquitetura
- **Frontend**: Arquitetura em camadas (Components, Services, Guards, Interceptors)
- **Backend**: Arquitetura MVC com Spring Boot
- **Segurança**: JWT Authentication + Spring Security
- **Comunicação**: RESTful API com interceptadores para autenticação

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework**: Angular 19 + Ionic 8
- **Linguagem**: TypeScript
- **UI Components**: Ionic Framework
- **HTTP Client**: Angular HttpClient
- **Roteamento**: Angular Router
- **Autenticação**: JWT + Guards
- **Validação**: Angular Reactive Forms
- **Build**: Angular CLI

### Backend
- **Framework**: Spring Boot 3.2.0
- **Linguagem**: Java 17
- **Segurança**: Spring Security + JWT
- **Banco de Dados**: PostgreSQL (Produção) / H2 (Desenvolvimento)
- **ORM**: Hibernate/JPA
- **Build**: Maven
- **Validação**: Bean Validation
- **Mapping**: MapStruct
- **Documentação**: Lombok

### DevOps & Deploy
- **Containerização**: Docker
- **Deploy Backend**: Render.com
- **Build Frontend**: Angular Build
- **Banco de Dados**: PostgreSQL (Render.com)

## 📋 Pré-requisitos

### Desenvolvimento Local

**Backend:**
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (opcional - pode usar H2)

**Frontend:**
- Node.js 18+
- npm 9+
- Angular CLI 19+
- Ionic CLI 7+

**Mobile (opcional):**
- Android Studio (para Android)
- Xcode (para iOS - apenas macOS)

## ⚙️ Instalação e Configuração

### 1. Clonando o Repositório

```bash
git clone <url-do-repositorio>
cd reconnect
```

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
./mvnw clean install

# Configurar banco de dados (opcional - usa H2 por padrão)
# Editar src/main/resources/application.properties

# Executar aplicação
./mvnw spring-boot:run
```

**Configuração de Banco (application.properties):**
```properties
# PostgreSQL (Produção)
spring.datasource.url=jdbc:postgresql://localhost:5432/reconnect
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# H2 (Desenvolvimento)
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
```

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
ionic serve

# Build para produção
ionic build --prod
```

**Configuração de Ambiente (src/environments/environment.ts):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Backend local
};
```

### 4. Executar Ambos Simultaneamente

**Terminal 1 (Backend):**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd frontend
ionic serve
```

## 📁 Estrutura do Projeto

### Backend Structure
```
backend/
├── src/main/java/com/nassau/reconnect/
│   ├── controllers/         # REST Controllers
│   ├── services/           # Business Logic
│   ├── repositories/       # Data Access Layer
│   ├── entities/           # JPA Entities
│   ├── dto/               # Data Transfer Objects
│   ├── security/          # Security Configuration
│   └── ReconnectApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── application-docker.properties
├── Dockerfile
└── pom.xml
```

### Frontend Structure
```
frontend/src/
├── app/
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Serviços HTTP
│   ├── guards/           # Route Guards
│   ├── interceptors/     # HTTP Interceptors
│   ├── models/           # TypeScript Interfaces
│   └── config/           # Configurações
├── environments/         # Variáveis de ambiente
└── assets/              # Recursos estáticos
```

## 🔧 Funcionalidades

### 👤 Gestão de Usuários
- **Cadastro/Login**: Sistema completo de autenticação
- **Perfis Diferenciados**: 
  - Usuário comum
  - Administrador de instituição
  - Staff de instituição
- **Gerenciamento de Perfil**: Edição de dados pessoais

### 🎮 Sistema Gamificado
- **Desafios**: Criar e participar de desafios
- **Pontuação**: Sistema de pontos por conclusão
- **Rankings**: Leaderboards e competições
- **Conquistas**: Badges e marcos

### 👨‍👩‍👧‍👦 Sistema de Família
- **Criação de Grupos**: Famílias para apoio mútuo
- **Compartilhamento**: Progresso e conquistas
- **Incentivo**: Motivação em grupo

### 🎓 Educação Digital
- **Cursos**: Conteúdo educacional sobre uso consciente
- **Instituições Parceiras**: Universidades e escolas
- **Certificações**: Conclusão de cursos

### 💰 Marketplace
- **Cupons de Desconto**: Recompensas por pontos
- **Parcerias**: Estabelecimentos locais
- **Conversão**: Pontos em benefícios reais

### 📱 Social
- **Posts**: Compartilhamento de conquistas
- **Interações**: Likes e comentários
- **Comunidade**: Networking saudável

## 🔗 API Reference

### Autenticação
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

### Usuários
```http
GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### Desafios
```http
GET    /api/challenges
POST   /api/challenges
GET    /api/challenges/{id}
PUT    /api/challenges/{id}
DELETE /api/challenges/{id}
POST   /api/challenges/{id}/complete
```

### Cursos
```http
GET    /api/courses
POST   /api/courses
GET    /api/courses/{id}
PUT    /api/courses/{id}
DELETE /api/courses/{id}
POST   /api/courses/{id}/enroll
```

### Cupons
```http
GET    /api/coupons
POST   /api/coupons
GET    /api/coupons/{id}
PUT    /api/coupons/{id}
DELETE /api/coupons/{id}
POST   /api/coupons/{id}/redeem
```

### Famílias
```http
GET    /api/families
POST   /api/families
GET    /api/families/{id}
PUT    /api/families/{id}
DELETE /api/families/{id}
POST   /api/families/{id}/join
```

## 🚀 Deploy

### Backend (Render.com)

1. **Preparar aplicação:**
```bash
# Build do projeto
./mvnw clean package -DskipTests

# Testar localmente
java -jar target/reconnect-*.jar
```

2. **Deploy no Render:**
- Conectar repositório Git
- Configurar variáveis de ambiente
- Deploy automático via Docker

3. **Variáveis de Ambiente:**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
APP_JWT_SECRET=...
```

### Frontend

1. **Build para produção:**
```bash
ionic build --prod
```

2. **Deploy estático:**
- Netlify, Vercel, ou GitHub Pages
- Upload da pasta `dist/`

3. **Mobile (opcional):**
```bash
# Android
ionic capacitor add android
ionic capacitor run android

# iOS
ionic capacitor add ios
ionic capacitor run ios
```

## 🔧 Configurações Importantes

### Security Headers
```java
// CORS configurado para desenvolvimento
@CrossOrigin(origins = {"http://localhost:8100", "http://localhost:4200"})
```

### Interceptadores Frontend
```typescript
// Autenticação automática
AuthInterceptor: Adiciona JWT em todas as requisições
ErrorInterceptor: Trata erros globalmente
```

### Guards de Rota
```typescript
// Proteção de rotas
AuthGuard: Verifica autenticação antes de acessar rotas protegidas
```

## 🐛 Troubleshooting

### Problemas Comuns

**1. CORS Error:**
```bash
# Verificar se backend está rodando na porta correta
# Verificar configuração de CORS no SecurityConfig.java
```

**2. JWT Token Expirado:**
```bash
# Token expira em 24h por padrão
# Logout e login novamente
```

**3. Erro de Conexão com Banco:**
```bash
# Verificar se PostgreSQL está rodando
# Verificar credenciais no application.properties
```

**4. Build Error Frontend:**
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Scripts Úteis

### Backend
```bash
# Executar testes
./mvnw test

# Build sem testes
./mvnw clean package -DskipTests

# Executar com profile específico
./mvnw spring-boot:run -Dspring-boot.run.profiles=docker
```

### Frontend
```bash
# Servir com reload automático
ionic serve

# Build para diferentes ambientes
ionic build --configuration=production

# Executar testes
ng test

# Análise de bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Criar** branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para branch (`git push origin feature/nova-funcionalidade`)
5. **Abrir** Pull Request

### Padrões de Código

**Backend:**
- Seguir padrões Spring Boot
- Usar Lombok para reduzir boilerplate
- Documentar APIs com comentários
- Testes unitários obrigatórios

**Frontend:**
- Seguir Angular Style Guide
- Usar TypeScript estrito
- Componentes reutilizáveis
- Responsive design

## 📄 Licença

Este projeto está sob licença [MIT](LICENSE).

## 👥 Equipe

- **Desenvolvimento Backend**: Spring Boot + PostgreSQL
- **Desenvolvimento Frontend**: Angular + Ionic
- **UI/UX Design**: Interface mobile-first
- **DevOps**: Docker + Render.com

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@reconnect.app
- 🐛 Issues: [GitHub Issues](link-para-issues)
- 📖 Documentação: [Wiki do Projeto](link-para-wiki)

## 📊 Diagramas

[![Diagrama de classes](https://img.shields.io/badge/Diagrama%20de%20classes-blue?style=for-the-badge)](https://github.com/andrefilipe1310/reconnect/tree/main/docs/diagrams/class_diagram.md)

[![Diagrama ER](https://img.shields.io/badge/Diagrama%20Entidade%20Relacionamento-blue?style=for-the-badge)](https://github.com/andrefilipe1310/reconnect/tree/main/docs/diagrams/er_diagram.md)
