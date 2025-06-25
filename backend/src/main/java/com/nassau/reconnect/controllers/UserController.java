package com.nassau.reconnect.controllers;


import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.user.UserCreateDto;
import com.nassau.reconnect.dtos.user.UserDto;
import com.nassau.reconnect.dtos.user.UserUpdateDto;
import com.nassau.reconnect.models.enums.Role;
import com.nassau.reconnect.security.JwtTokenProvider;
import com.nassau.reconnect.services.UserService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostConstruct
    public void init() {
        if (!userService.existsByEmail("admin@admin.com")) {
            UserCreateDto user = new UserCreateDto(
                    "Admin",
                    "admin@admin.com",
                    "admin1234",
                    Role.ADMIN,
                    null,
                    null,
                    null
            );
            userService.createUser(user);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTITUTION_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasPermission(#id, 'User', 'READ') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('INSTITUTION_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Token não enviado ou inválido"));
        }
        String token = authorizationHeader.substring(7);
        Long id = jwtTokenProvider.getUserIdFromJWT(token);
        UserDto currentUser = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(currentUser));
    }

    @GetMapping("/institution/{institutionId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('INSTITUTION_ADMIN') and #institutionId == authentication.principal.institutionId)")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByInstitution(@PathVariable Long institutionId) {
        List<UserDto> users = userService.getUsersByInstitution(institutionId);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasPermission(null, 'User', 'CREATE')")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody UserCreateDto userCreateDto) {
        UserDto createdUser = userService.createUser(userCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdUser, "User created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasPermission(#id, 'User', 'UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto userUpdateDto) {
        UserDto updatedUser = userService.updateUser(id, userUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}