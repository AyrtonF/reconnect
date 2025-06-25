package com.nassau.reconnect.controllers;


import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.auth.AuthRequest;
import com.nassau.reconnect.dtos.auth.AuthResponse;
import com.nassau.reconnect.dtos.auth.RegisterRequest;
import com.nassau.reconnect.dtos.user.UserCreateDto;
import com.nassau.reconnect.models.enums.Role;
import com.nassau.reconnect.security.JwtTokenProvider;
import com.nassau.reconnect.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        String role = authentication.getAuthorities().stream()
                .filter(grantedAuthority -> grantedAuthority.getAuthority().startsWith("ROLE_"))
                .map(grantedAuthority -> grantedAuthority.getAuthority().substring(5))
                .findFirst()
                .orElse("USER");

        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .role(role)
                .build();

        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if email already exists
        if (userService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already in use"));
        }

        // Create user
        UserCreateDto userCreateDto = UserCreateDto.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .role(registerRequest.getRole())
                .build();

        userService.createUser(userCreateDto);

        // Login the new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .role(registerRequest.getRole().name())
                .build();

        return ResponseEntity.ok(ApiResponse.success(authResponse, "Registration successful"));
    }
}