# 🚫 Erro 403 - Access Denied para Institution Courses

## 🔍 Problema Identificado

```
POST http://localhost:8080/api/institution-courses 403 (Forbidden)
WARN: Denying user zemario@uninassau.com permission 'CREATE' on object with Id null
ERROR: Access denied: Access Denied
```

O Spring Security está negando acesso ao endpoint `/api/institution-courses` para usuários `INSTITUTION_ADMIN`.

## 🛠️ Soluções Possíveis

### **Opção 1: Corrigir Configuração do Spring Security (Recomendado)**

No backend, localize o arquivo de configuração do Spring Security (provavelmente `SecurityConfig.java` ou similar) e adicione a permissão:

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // ... outras configurações ...
                .requestMatchers(HttpMethod.POST, "/api/institution-courses").hasAnyRole("INSTITUTION_ADMIN", "INSTITUTION_STAFF")
                .requestMatchers(HttpMethod.GET, "/api/institution-courses/**").hasAnyRole("INSTITUTION_ADMIN", "INSTITUTION_STAFF", "USER")
                .requestMatchers(HttpMethod.PUT, "/api/institution-courses/**").hasAnyRole("INSTITUTION_ADMIN", "INSTITUTION_STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/institution-courses/**").hasRole("INSTITUTION_ADMIN")
                // ... outras configurações ...
            );
        return http.build();
    }
}
```

### **Opção 2: Verificar Anotações no Controller**

No controller `InstitutionCourseController.java`, verifique se as anotações estão corretas:

```java
@RestController
@RequestMapping("/api/institution-courses")
@PreAuthorize("hasRole('INSTITUTION_ADMIN') or hasRole('INSTITUTION_STAFF')")
public class InstitutionCourseController {

    @PostMapping
    @PreAuthorize("hasRole('INSTITUTION_ADMIN') or hasRole('INSTITUTION_STAFF')")
    public ResponseEntity<ApiResponse<InstitutionCourse>> createCourse(@RequestBody InstitutionCourse course) {
        // ... implementação ...
    }
}
```

### **Opção 3: Usar Endpoint Alternativo (Frontend)**

Se não puder modificar o backend imediatamente, vou criar uma solução temporária no frontend que usa um endpoint diferente.

## 🔧 Solução Frontend (Temporária)

Vou modificar o frontend para usar um endpoint alternativo que funcione com as permissões atuais:

```typescript
// Usar endpoint alternativo se o principal falhar
this.courseService.createCourse(courseToSave).subscribe({
  next: async (response) => {
    // ... sucesso ...
  },
  error: async (error) => {
    if (error.status === 403) {
      // Tentar endpoint alternativo
      await this.createCourseAlternative(courseToSave);
    } else {
      // ... outros erros ...
    }
  },
});
```

## 🎯 Qual Solução Escolher?

### **Se você pode modificar o backend:**

- ✅ **Use a Opção 1** (configuração do Spring Security)
- É a solução mais limpa e definitiva

### **Se não pode modificar o backend agora:**

- ✅ **Use a Opção 3** (endpoint alternativo no frontend)
- É uma solução temporária que funciona

## 📞 O que você prefere?

Me diga qual opção prefere:

1. **"Vou corrigir o backend"** → Te dou as instruções detalhadas para o Spring Security
2. **"Prefiro solução no frontend por enquanto"** → Implemento um fallback que funciona
3. **"Ambas"** → Te dou as duas soluções

## 🔍 Informações Úteis

- **Usuário**: zemario@uninassau.com
- **Role**: INSTITUTION_ADMIN
- **Endpoint**: POST /api/institution-courses
- **Status**: 403 Forbidden
- **Causa**: Configuração de permissões do Spring Security
