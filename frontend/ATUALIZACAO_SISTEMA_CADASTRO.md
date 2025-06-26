# Atualização de Sistema de Cadastro - Múltiplos Tipos de Usuário

## Resumo das Mudanças

Este documento descreve as implementações realizadas para criar um sistema de cadastro específico para cada tipo de usuário, com redirecionamento personalizado no login.

## Tipos de Usuário Implementados

### 1. USER (Usuário comum)

- **Página de cadastro**: `/register-user`
- **Redirecionamento após login**: `/home`
- **Campos específicos**: Nome, email, telefone, senha

### 2. INSTITUTION_ADMIN (Administrador de Instituição)

- **Página de cadastro**: `/register-institution-admin`
- **Redirecionamento após login**: `/course-institution`
- **Campos específicos**: Nome, email, telefone, nome da instituição, endereço da instituição, senha

### 3. INSTITUTION_STAFF (Staff da Empresa)

- **Página de cadastro**: `/register-institution-staff`
- **Redirecionamento após login**: `/home-company`
- **Campos específicos**: Nome, email, telefone, nome da empresa, departamento, cargo, senha

## Arquivos Criados

### Página de Seleção de Tipo de Usuário

- `src/app/pages/user-type-selection/user-type-selection.page.ts`
- `src/app/pages/user-type-selection/user-type-selection.page.html`
- `src/app/pages/user-type-selection/user-type-selection.page.scss`
- `src/app/pages/user-type-selection/user-type-selection.module.ts`
- `src/app/pages/user-type-selection/user-type-selection-routing.module.ts`

### Página de Cadastro de Usuário

- `src/app/pages/register-user/register-user.page.ts`
- `src/app/pages/register-user/register-user.page.html`
- `src/app/pages/register-user/register-user.page.scss`
- `src/app/pages/register-user/register-user.module.ts`
- `src/app/pages/register-user/register-user-routing.module.ts`

### Página de Cadastro de Administrador de Instituição

- `src/app/pages/register-institution-admin/register-institution-admin.page.ts`
- `src/app/pages/register-institution-admin/register-institution-admin.page.html`
- `src/app/pages/register-institution-admin/register-institution-admin.page.scss`
- `src/app/pages/register-institution-admin/register-institution-admin.module.ts`
- `src/app/pages/register-institution-admin/register-institution-admin-routing.module.ts`

### Página de Cadastro de Staff da Empresa

- `src/app/pages/register-institution-staff/register-institution-staff.page.ts`
- `src/app/pages/register-institution-staff/register-institution-staff.page.html`
- `src/app/pages/register-institution-staff/register-institution-staff.page.scss`
- `src/app/pages/register-institution-staff/register-institution-staff.module.ts`
- `src/app/pages/register-institution-staff/register-institution-staff-routing.module.ts`

## Arquivos Modificados

### AuthService

- `src/app/services/auth.service.ts`
  - Atualizado para suportar o tipo `INSTITUTION_STAFF`
  - Adicionado método `isInstitutionStaff()`
  - Atualizado método `getRedirectRoute()` para incluir todos os tipos de usuário

### App Routing

- `src/app/app-routing.module.ts`
  - Adicionadas rotas para todas as novas páginas de cadastro

### Login Page

- `src/app/pages/login/login.page.ts`
  - Atualizado para redirecionar para a página de seleção de tipo de usuário
- `src/app/pages/login/login.page.html`
  - Texto do link de cadastro atualizado

## Fluxo de Navegação

### Novo Usuário (Cadastro)

1. Usuário clica em "Cadastre-se aqui" na página de login
2. Navega para `/user-type-selection`
3. Seleciona o tipo de usuário desejado
4. Navega para a página de cadastro específica:
   - Usuário comum → `/register-user`
   - Administrador → `/register-institution-admin`
   - Staff → `/register-institution-staff`
5. Após cadastro bem-sucedido, é redirecionado para a página apropriada

### Login de Usuário Existente

1. Usuário faz login na página `/login`
2. Sistema verifica o role do usuário
3. Redireciona para a página apropriada:
   - USER → `/home`
   - INSTITUTION_ADMIN → `/course-institution`
   - INSTITUTION_STAFF → `/home-company`

## Características Implementadas

### Validações

- Validação de email
- Validação de senha (mínimo 6 caracteres)
- Confirmação de senha
- Campos obrigatórios validados
- Feedback visual para erros

### UX/UI

- Design responsivo e moderno
- Feedback visual durante carregamento
- Mensagens de toast para sucesso/erro
- Navegação intuitiva
- Separação visual de seções nos formulários

### Integração com Backend

- Chamadas para API de autenticação
- Salvamento seguro de tokens
- Tratamento de erros da API
- Integração com sistema de roles existente

## Modularização Mantida

O projeto mantém a estrutura modular com:

- **Services**: Lógica de autenticação centralizada
- **Pages**: Componentes de páginas específicas
- **Models/Types**: Definições de tipos mantidas
- **Routing**: Sistema de roteamento organizado

## Como Testar

1. Navegue para a página de login
2. Clique em "Cadastre-se aqui"
3. Selecione um tipo de usuário
4. Preencha o formulário de cadastro
5. Verifique o redirecionamento após o cadastro
6. Teste o login com diferentes tipos de usuário
7. Verifique se o redirecionamento após login está correto

## Observações Importantes

- O sistema mantém compatibilidade com a estrutura existente
- Todos os tipos de usuário utilizam o mesmo endpoint de autenticação
- O redirecionamento é baseado no role retornado pelo backend
- As validações são realizadas tanto no frontend quanto no backend
- O design visual diferencia cada tipo de cadastro com cores específicas
