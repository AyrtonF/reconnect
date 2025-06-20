package com.nassau.reconnect.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nassau.reconnect.dtos.auth.AuthRequest;
import com.nassau.reconnect.dtos.auth.RegisterRequest;
import com.nassau.reconnect.dtos.user.UserCreateDto;
import com.nassau.reconnect.security.JwtTokenProvider;
import com.nassau.reconnect.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collection;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserService userService;

    private Authentication mockAuthentication;

    @BeforeEach
    public void setup() {
        // Configuração do mock de Authentication
        mockAuthentication = mock(Authentication.class);

        // Usando cast para ignorar verificação de tipo
        when(mockAuthentication.getAuthorities()).thenReturn(
                (Collection) Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Test
    public void loginSuccess() throws Exception {
        // Preparação
        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuthentication);
        when(jwtTokenProvider.generateToken(any(Authentication.class)))
                .thenReturn("test-jwt-token");

        // Execução e Verificação
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.data.role").value("USER"))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    public void loginFailureInvalidCredentials() throws Exception {
        // Preparação
        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));

        // Execução e Verificação
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void loginFailureInvalidRequest() throws Exception {
        // Preparação - Email inválido
        AuthRequest invalidAuthRequest = new AuthRequest();
        invalidAuthRequest.setEmail("invalid-email");
        invalidAuthRequest.setPassword("password123");

        // Execução e Verificação
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidAuthRequest)))
                .andExpect(status().isBadRequest());

        // Preparação - Sem senha
        AuthRequest noPasswordRequest = new AuthRequest();
        noPasswordRequest.setEmail("test@example.com");

        // Execução e Verificação
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(noPasswordRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void registerSuccess() throws Exception {
        // Preparação
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("password123");

        when(userService.existsByEmail("newuser@example.com")).thenReturn(false);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuthentication);
        when(jwtTokenProvider.generateToken(any(Authentication.class)))
                .thenReturn("test-jwt-token");

        // Execução e Verificação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.data.role").value("USER"))
                .andExpect(jsonPath("$.message").value("Registration successful"));

        // Verificar se o serviço foi chamado com os parâmetros corretos
        verify(userService).createUser(any(UserCreateDto.class));
    }

    @Test
    public void registerFailureEmailExists() throws Exception {
        // Preparação
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("existing@example.com");
        registerRequest.setPassword("password123");

        when(userService.existsByEmail("existing@example.com")).thenReturn(true);

        // Execução e Verificação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Email already in use"));

        // Verificar que o serviço de criação de usuário não foi chamado
        verify(userService, never()).createUser(any(UserCreateDto.class));
    }

    @Test
    public void registerFailureInvalidRequest() throws Exception {
        // Preparação - Senha muito curta
        RegisterRequest invalidPasswordRequest = new RegisterRequest();
        invalidPasswordRequest.setName("Test User");
        invalidPasswordRequest.setEmail("test@example.com");
        invalidPasswordRequest.setPassword("short");

        // Execução e Verificação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPasswordRequest)))
                .andExpect(status().isBadRequest());

        // Preparação - Email inválido
        RegisterRequest invalidEmailRequest = new RegisterRequest();
        invalidEmailRequest.setName("Test User");
        invalidEmailRequest.setEmail("invalid-email");
        invalidEmailRequest.setPassword("password123");

        // Execução e Verificação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidEmailRequest)))
                .andExpect(status().isBadRequest());

        // Preparação - Sem nome
        RegisterRequest noNameRequest = new RegisterRequest();
        noNameRequest.setEmail("test@example.com");
        noNameRequest.setPassword("password123");

        // Execução e Verificação
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(noNameRequest)))
                .andExpect(status().isBadRequest());
    }
}