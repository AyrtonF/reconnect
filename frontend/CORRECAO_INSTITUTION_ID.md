# Correção - Erro ao Salvar Curso (institutionId obrigatório)

## Problema Identificado

O erro `400 (Bad Request)` com a mensagem `{institutionId=ID da instituição é obrigatório}` ocorria porque o campo `institutionId` não estava sendo enviado na requisição para criar cursos.

## Solução Implementada

### 1. **AuthService - Novos Métodos**

Adicionados métodos para gerenciar o `institutionId`:

```typescript
// Salvar institutionId no localStorage
saveInstitutionId(institutionId: number): void

// Obter institutionId do localStorage
getInstitutionId(): number | null

// Logout agora remove o institutionId também
logout(): void // atualizado
```

### 2. **LoginPage - Salvamento do institutionId**

Atualizada para salvar o `institutionId` do usuário ao fazer login:

```typescript
// Salvar institutionId se disponível
if (user?.institutionId) {
  this.authService.saveInstitutionId(user.institutionId);
}
```

### 3. **AddCourseInstitutionPage - Principais Mudanças**

#### a) **Importações Adicionadas**

- `AuthService`
- `User` do types

#### b) **Propriedades Adicionadas**

```typescript
currentUser: User | null = null;
```

#### c) **ngOnInit Atualizado**

Agora carrega os dados do usuário atual:

```typescript
ngOnInit() {
  this.loadCurrentUser();
}
```

#### d) **Novo Método loadCurrentUser()**

```typescript
async loadCurrentUser() {
  // Carrega dados do usuário através da API
}
```

#### e) **Método saveCourse() Corrigido**

- ✅ Verifica se `institutionId` está disponível
- ✅ Inclui `institutionId` no objeto `courseToSave`
- ✅ Tem fallback para obter institutionId de múltiplas fontes
- ✅ Logs detalhados para debug

#### f) **Método de Fallback**

```typescript
private getInstitutionIdFallback(): number | null {
  // Tenta obter de AuthService -> currentUser -> null
}
```

## Fluxo de Funcionamento

### 1. **Login**

1. Usuário faz login
2. Sistema obtém dados do usuário da API
3. `userId` e `institutionId` são salvos no localStorage
4. Usuário é redirecionado

### 2. **Criar Curso**

1. Página carrega dados do usuário atual
2. `institutionId` é obtido do usuário ou localStorage
3. Curso é criado com `institutionId` incluso
4. Requisição enviada com todos os dados necessários

## Validações Implementadas

- ✅ Verifica se `institutionId` existe antes de salvar
- ✅ Carrega dados do usuário na inicialização
- ✅ Fallback para obter `institutionId` de múltiplas fontes
- ✅ Mensagens de erro específicas
- ✅ Logs detalhados para debug

## Dados Enviados na Requisição

Agora o objeto `courseToSave` inclui:

```typescript
{
  institutionId: number,        // ✅ ADICIONADO
  name: string,
  description: string,
  image: string,
  materials: InstitutionMaterial[],
  videos: InstitutionVideo[],
  questions: InstitutionQuestion[],
  status: 'published',
  createdAt: Date,
  updatedAt: Date
}
```

## Como Testar

1. **Fazer Login** como `INSTITUTION_ADMIN`
2. **Navegar** para `/course-institution`
3. **Clicar** em "Adicionar Curso"
4. **Preencher** dados do curso
5. **Fazer Upload** de uma imagem
6. **Salvar** o curso
7. **Verificar** que não há mais erro 400
8. **Conferir** no console os logs: "Dados do curso a serem salvos"

## Arquivos Modificados

- ✅ `src/app/services/auth.service.ts`
- ✅ `src/app/pages/login/login.page.ts`
- ✅ `src/app/pages/add-course-institution/add-course-institution.page.ts`

## Resultado Esperado

- ✅ Erro 400 resolvido
- ✅ Cursos salvos com sucesso
- ✅ `institutionId` presente nas requisições
- ✅ Melhor experiência do usuário
- ✅ Logs para debug quando necessário
