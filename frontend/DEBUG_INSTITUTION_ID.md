# 🔍 Debug do Problema do InstitutionId

## Problema Identificado

Quando você clica em "Salvar" na página de adicionar curso, o código está caindo na condição que diz que o `institutionId` não foi encontrado.

## ✅ Correções Implementadas

### 1. **Logs de Debug Adicionados**

- Adicionei logs detalhados no método `saveCourse()` para mostrar:
  - Dados do `currentUser`
  - `institutionId` do usuário atual
  - Dados do `AuthService`
  - Role do usuário
  - Estado do localStorage

### 2. **Verificação de Role**

- Agora o sistema verifica se o usuário é `INSTITUTION_ADMIN` ou `INSTITUTION_STAFF` antes de tentar salvar
- Usuários do tipo `USER` não podem criar cursos

### 3. **Melhor Fallback para InstitutionId**

- O método `getInstitutionIdFallback()` agora verifica:
  1. AuthService.getInstitutionId()
  2. currentUser.institutionId
  3. localStorage diretamente
  4. Logs detalhados de cada tentativa

### 4. **Auto-save do InstitutionId**

- O método `loadCurrentUser()` agora salva automaticamente o `institutionId` no localStorage quando o usuário é carregado

### 5. **Botão de Teste Adicionado**

- Adicionei um botão "🔍 Testar Dados do Usuário (Debug)" na página
- Este botão mostra todos os dados no console e em toast

## 🧪 Como Testar

### Passo 1: Execute o projeto

```bash
cd "c:\Users\Ayrton\Music\reconnect\frontend"
ionic serve
```

### Passo 2: Faça login como INSTITUTION_ADMIN ou INSTITUTION_STAFF

- Vá para a página de login
- Use credenciais de um usuário com role `INSTITUTION_ADMIN` ou `INSTITUTION_STAFF`

### Passo 3: Vá para a página de adicionar curso

- Após o login, navegue para `/add-course-institution`

### Passo 4: Clique no botão de teste

- Clique em "🔍 Testar Dados do Usuário (Debug)"
- Abra o console do navegador (F12)
- Verifique os logs que aparecerão

### Passo 5: Tente salvar um curso

- Preencha os campos básicos (nome, descrição, imagem)
- Clique em "Salvar"
- Veja os logs detalhados no console

## 📋 O que Verificar nos Logs

Procure por estas informações no console:

```
=== DEBUG SAVE COURSE ===
currentUser: { id: X, institutionId: Y, role: "..." }
currentUser.institutionId: Y
AuthService.getInstitutionId(): Y
AuthService.getUserRole(): "INSTITUTION_ADMIN" ou "INSTITUTION_STAFF"
institutionId final: Y
```

E também:

```
=== DEBUG FALLBACK ===
institutionIdFromService: Y
institutionId from currentUser: Y
institutionId from localStorage: Y
```

## 🔧 Possíveis Problemas e Soluções

### Problema 1: currentUser é null

**Causa**: O usuário não foi carregado corretamente do backend
**Solução**: Verificar se o endpoint `/api/users/me` está respondendo corretamente

### Problema 2: currentUser não tem institutionId

**Causa**: O usuário no banco não possui institutionId associado
**Solução**: Verificar os dados do usuário no banco e associar a uma instituição

### Problema 3: Role incorreta

**Causa**: O usuário não é INSTITUTION_ADMIN nem INSTITUTION_STAFF
**Solução**: Fazer login com um usuário da instituição

### Problema 4: localStorage vazio

**Causa**: O institutionId não foi salvo durante o login
**Solução**: Verificar se o login está chamando `getCurrentUser()` e salvando os dados

## 🎯 Próximos Passos

1. **Execute os testes** conforme descrito acima
2. **Copie os logs** do console e me envie
3. **Informe qual erro específico** está aparecendo
4. Se necessário, **criaremos uma solução personalizada** baseada nos dados reais

## 🚨 Lembrete

Após resolvermos o problema, **lembre-se de remover o botão de teste** da interface de produção!

## 📞 Como Relatar os Resultados

Quando testar, me envie:

1. **Logs do console** (copie e cole)
2. **Mensagem de erro exata** que aparece no toast
3. **Role do usuário** que você está usando para testar
4. **Se o usuário possui institutionId** no banco de dados

Com essas informações, posso identificar exatamente onde está o problema e corrigi-lo definitivamente!
