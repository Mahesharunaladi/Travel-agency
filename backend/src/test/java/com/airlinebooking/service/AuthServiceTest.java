package com.airlinebooking.service;

import com.airlinebooking.dto.LoginRequestDTO;
import com.airlinebooking.dto.RegisterRequestDTO;
import com.airlinebooking.entity.User;
import com.airlinebooking.repository.UserRepository;
import com.airlinebooking.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDTO registerRequest;
    private LoginRequestDTO loginRequest;
    private User testUser;

    @BeforeEach
    public void setUp() {
        registerRequest = RegisterRequestDTO.builder()
                .email("test@example.com")
                .password("password123")
                .firstName("John")
                .lastName("Doe")
                .build();

        loginRequest = LoginRequestDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        testUser = User.builder()
                .id("1")
                .email("test@example.com")
                .password(BCrypt.hashpw("password123", BCrypt.gensalt(12)))
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    @Test
    public void testRegisterNewUser() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        var result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals(result.getEmail(), registerRequest.getEmail());
        assertEquals(result.getFirstName(), registerRequest.getFirstName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testLoginSuccess() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateAccessTokenFromUsername(anyString())).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(anyString())).thenReturn("refresh-token");
        when(jwtTokenProvider.getExpirationTime()).thenReturn(86400000L);

        var result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals(result.getAccessToken(), "access-token");
        assertEquals(result.getRefreshToken(), "refresh-token");
        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
    }

    @Test
    public void testGetUserById() {
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

        var result = authService.getUserById("1");

        assertNotNull(result);
        assertEquals(result.getId(), "1");
        assertEquals(result.getEmail(), testUser.getEmail());
    }
}
