Estou enfrentando um erro 403 (Forbidden) no meu backend Spring Boot quando tento criar cursos através do endpoint POST /api/institution-courses.

**Erro específico:**

```
POST http://localhost:8080/api/institution-courses 403 (Forbidden)
WARN: Denying user zemario@uninassau.com permission 'CREATE' on object with Id null
ERROR: Access denied: Access Denied
```

**Contexto:**

- Usuário: zemario@uninassau.com
- Role: INSTITUTION_ADMIN
- Endpoint: POST /api/institution-courses
- O usuário deveria ter permissão para criar cursos, mas está sendo negado

**Preciso que você:**

1. **Verifique o SecurityConfig.java** e adicione as permissões corretas para o endpoint `/api/institution-courses`:

   - INSTITUTION_ADMIN deve poder fazer POST, GET, PUT, DELETE
   - INSTITUTION_STAFF deve poder fazer POST, GET, PUT
   - USER deve poder fazer apenas GET

2. **Verifique o InstitutionCourseController.java** e garanta que as anotações @PreAuthorize estão corretas:

   - O controller deve aceitar roles INSTITUTION_ADMIN e INSTITUTION_STAFF
   - O método createCourse (POST) deve permitir essas roles

3. **Verifique se as roles estão sendo lidas corretamente** do token JWT e se o usuário zemario@uninassau.com realmente tem a role INSTITUTION_ADMIN no banco de dados

**Exemplo do que preciso no SecurityConfig:**

```java
.requestMatchers(HttpMethod.POST, "/api/institution-courses").hasAnyRole("INSTITUTION_ADMIN", "INSTITUTION_STAFF")
.requestMatchers(HttpMethod.GET, "/api/institution-courses/**").hasAnyRole("INSTITUTION_ADMIN", "INSTITUTION_STAFF", "USER")
.requestMatchers(HttpMethod.PUT, "/api/institution-courses/**").hasAnyRole("INSTITUTION_ADMIN", "INSTITUTION_STAFF")
.requestMatchers(HttpMethod.DELETE, "/api/institution-courses/**").hasRole("INSTITUTION_ADMIN")
```

**Exemplo do que preciso no Controller:**

```java
@PreAuthorize("hasRole('INSTITUTION_ADMIN') or hasRole('INSTITUTION_STAFF')")
public ResponseEntity<ApiResponse<InstitutionCourse>> createCourse(@RequestBody InstitutionCourse course)
```

Por favor, identifique e corrija o problema de permissões para que usuários INSTITUTION_ADMIN possam criar cursos normalmente.
