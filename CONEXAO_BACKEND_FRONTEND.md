# Conexão Backend-Frontend - Reconnect App

## Resumo das Implementações

### 🔐 **Autenticação e Segurança**

1. **AuthGuard** (`/guards/auth.guard.ts`)

   - Guard de autenticação para proteger rotas
   - Redireciona usuários não autenticados para `/main`

2. **AuthInterceptor** (atualizado)

   - Adiciona automaticamente o token de autorização nas requisições
   - Corrigido para não duplicar o prefixo "Bearer"

3. **ErrorInterceptor** (`/interceptors/error.interceptor.ts`)
   - Intercepta erros HTTP globalmente
   - Trata tokens expirados automaticamente
   - Exibe toasts para erros críticos

### 📱 **Serviços Principais**

4. **AuthService** (melhorado)

   - Integração completa com backend
   - Métodos para login, register, logout
   - Gerenciamento de tokens e roles
   - Obtenção de dados do usuário atual

5. **UserService** (existente, melhorado)

   - Comunicação com API de usuários
   - Headers de autenticação corretos
   - Tratamento de erros aprimorado

6. **PostService** (ajustado)

   - Endpoints compatíveis com backend
   - Método de like ajustado para API correta

7. **UtilsService** (novo)

   - Funções utilitárias comuns
   - Toasts, alerts, loading padronizados
   - Validações e formatações

8. **InitializationService** (novo)
   - Verifica estado de autenticação na inicialização
   - Redireciona usuários baseado no status de login

### 🛣️ **Roteamento e Navegação**

9. **AppRoutingModule** (atualizado)

   - Guards de autenticação em rotas protegidas
   - Estrutura de rotas organizada

10. **MenuService** (existente)
    - Controla visibilidade do menu
    - Rotas excluídas do menu

### 📄 **Páginas Principais**

11. **LoginPage** (melhorado)

    - Integração com AuthService
    - Salvamento de userId
    - Redirecionamento baseado em role

12. **RegisterPage** (simplificado)

    - Registro direto via AuthService
    - Remoção de duplicação de criação de usuário

13. **HomePage** (ajustado)

    - Carrega dados do usuário via AuthService
    - Tratamento de sessão expirada

14. **ProfilePage** (melhorado)

    - Carrega dados do usuário atual
    - Integração com AuthService

15. **HomeCompanyPage** (ajustado)

    - Carrega dados do usuário institucional atual

16. **SideMenuComponent** (melhorado)
    - Menu completo com todas as opções
    - Logout funcional com confirmação

### ⚙️ **Configuração**

17. **APP_CONFIG** (novo)

    - Configurações centralizadas da aplicação
    - URLs, timeouts, roles, etc.

18. **AppComponent** (melhorado)
    - Inicialização automática da aplicação
    - Verificação de autenticação no startup

---

## 🚀 **Como Executar**

### Backend (Java Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (Angular/Ionic)

```bash
cd frontend
npm install
ionic serve
```

---

## 🔄 **Fluxo de Autenticação**

1. **Usuário acessa a aplicação**

   - AppComponent verifica token salvo
   - Se válido: redireciona para página apropriada
   - Se inválido: redireciona para `/main`

2. **Login**

   - Usuário insere credenciais
   - AuthService faz chamada para `/api/auth/login`
   - Token é salvo no localStorage
   - Usuário é redirecionado baseado no role

3. **Navegação Protegida**

   - AuthGuard verifica autenticação
   - AuthInterceptor adiciona token nas requisições
   - ErrorInterceptor trata erros e tokens expirados

4. **Logout**
   - Remove dados do localStorage
   - Redireciona para `/main`

---

## 🗂️ **Estrutura de Roles**

- **USER**: Usuário padrão → `/home`
- **INSTITUTION_ADMIN**: Admin institucional → `/home-company`
- **ADMIN**: Administrador geral → `/home`

---

## 📊 **Endpoints Principais Conectados**

### Autenticação

- `POST /api/auth/login`
- `POST /api/auth/register`

### Usuários

- `GET /api/users/me` - Usuário atual
- `GET /api/users` - Todos os usuários
- `GET /api/users/{id}` - Usuário por ID
- `PUT /api/users/{id}` - Atualizar usuário

### Posts

- `GET /api/posts` - Todos os posts
- `GET /api/posts/family/{id}` - Posts por família
- `POST /api/posts/{id}/like/{userId}` - Curtir post

### Cupons

- `GET /api/coupons` - Todos os cupons
- `POST /api/coupons` - Criar cupom

---

## ✅ **Funcionalidades Conectadas**

- ✅ Login/Logout
- ✅ Registro de usuários
- ✅ Proteção de rotas
- ✅ Gerenciamento de sessão
- ✅ Menu lateral dinâmico
- ✅ Perfil do usuário
- ✅ Home personalizada por role
- ✅ Interceptors de autenticação e erro
- ✅ Inicialização automática
- ✅ Tratamento de erros global

---

## 🔧 **Próximos Passos**

1. **Testes**: Implementar testes unitários e de integração
2. **Upload de arquivos**: Implementar upload de imagens/documentos
3. **Push notifications**: Notificações em tempo real
4. **Cache**: Implementar cache local para dados
5. **Offline**: Funcionalidades offline
6. **PWA**: Transformar em Progressive Web App

---

## 🐛 **Troubleshooting**

### Erro de CORS

- Verificar se o backend permite requisições do frontend
- Configuração em `SecurityConfig.java`

### Token não funcionando

- Verificar se o formato do token está correto
- Verificar se o interceptor está adicionando o header

### Redirecionamentos não funcionando

- Verificar se as rotas estão registradas
- Verificar se o AuthGuard está aplicado corretamente

### Erro 401/403

- Verificar se o token não expirou
- Verificar se o usuário tem as permissões necessárias
