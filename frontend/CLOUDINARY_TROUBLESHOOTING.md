# Guia de Troubleshooting - Cloudinary

## Problemas Comuns e Soluções

### 0. Erro de CORS (MAIS COMUM)

**Problema**: `Access to XMLHttpRequest at 'https://api.cloudinary.com/v1_1/dicaajxk0/image/upload' from origin 'http://localhost:8100' has been blocked by CORS policy`

**Causa**: O interceptor de autenticação estava adicionando headers de Authorization em todas as requisições, incluindo as para o Cloudinary.

**Solução**: ✅ **JÁ CORRIGIDO** - O interceptor foi atualizado para não adicionar token em URLs do Cloudinary.

**Como verificar se está resolvido**:

- Abra o DevTools (F12)
- Vá na aba Network
- Tente fazer upload de uma imagem
- Verifique se a requisição para `api.cloudinary.com` NÃO possui header `Authorization`

### 1. Erro de Upload Preset

**Problema**: `Dados inválidos. Verifique se o upload preset está correto.`

**Soluções**:

- Verifique se o upload preset `angular_reconnect` existe no seu painel do Cloudinary
- Certifique-se de que o upload preset está configurado como "unsigned" (não assinado)
- Verifique se o nome do preset está digitado corretamente

### 2. Erro de Conexão

**Problema**: `Erro de conexão. Verifique sua internet.`

**Soluções**:

- Verifique a conexão com a internet
- Teste se a URL `https://api.cloudinary.com` está acessível
- Verifique se não há bloqueios de firewall ou proxy

### 3. Erro de Cloud Name

**Problema**: `Não autorizado. Verifique as configurações do Cloudinary.`

**Soluções**:

- Verifique se o cloud name `dicaajxk0` está correto
- Confirme no painel do Cloudinary qual é o cloud name exato
- Certifique-se de que não há espaços ou caracteres especiais

### 4. Arquivo Muito Grande

**Problema**: `A imagem é muito grande. Tamanho máximo: 10MB`

**Soluções**:

- Reduza o tamanho da imagem antes do upload
- Use ferramentas de compressão de imagem
- Considere redimensionar a imagem

### 5. Tipo de Arquivo Não Suportado

**Problema**: `Tipo de arquivo não suportado. Use: JPEG, PNG, GIF ou WebP`

**Soluções**:

- Converta o arquivo para um formato suportado
- Verifique se a extensão do arquivo está correta

## Como Testar as Configurações

1. **Verificar Upload Preset**:

   - Acesse o painel do Cloudinary
   - Vá em Settings > Upload
   - Procure pelo preset `angular_reconnect`
   - Certifique-se de que está marcado como "Unsigned"

2. **Testar Manualmente**:

   - Use o método `testCloudinaryConfig()` na página de adicionar curso
   - Verifique o console do navegador para logs detalhados

3. **Verificar Rede**:
   - Abra o DevTools do navegador
   - Vá na aba Network
   - Tente fazer upload de uma imagem
   - Verifique se há requisições falhando

## Configurações Atuais

- **Cloud Name**: `dicaajxk0`
- **Upload Preset**: `angular_reconnect`
- **Tamanho Máximo**: 10MB
- **Tipos Suportados**: JPEG, PNG, GIF, WebP

## Logs de Debug

Para debugar problemas:

1. Abra o console do navegador (F12)
2. Tente fazer upload de uma imagem
3. Verifique os logs que começam com "Enviando imagem para Cloudinary:"
4. Se houver erro, verifique os logs que começam com "Erro detalhado:"
