package com.airlinebooking.controller;

import com.airlinebooking.dto.AuthResponseDTO;
import com.airlinebooking.dto.LoginRequestDTO;
import com.airlinebooking.dto.RegisterRequestDTO;
import com.airlinebooking.dto.UserResponseDTO;
import com.airlinebooking.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterSuccess() throws Exception {
        RegisterRequestDTO request = RegisterRequestDTO.builder()
                .email("test@example.com")
                .password("password123")
                .firstName("John")
                .lastName("Doe")
                .build();

        UserResponseDTO response = UserResponseDTO.builder()
                .id("1")
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .build();

        when(authService.register(request)).thenReturn(response);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testLoginSuccess() throws Exception {
        LoginRequestDTO request = LoginRequestDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        UserResponseDTO user = UserResponseDTO.builder()
                .id("1")
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .build();

        AuthResponseDTO response = AuthResponseDTO.builder()
                .accessToken("access-token")
                .refreshToken("refresh-token")
                .user(user)
                .expiresIn(86400000L)
                .build();

        when(authService.login(request)).thenReturn(response);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"));
    }
}
