package com.airlinebooking.service;

import com.airlinebooking.dto.AuthResponseDTO;
import com.airlinebooking.dto.LoginRequestDTO;
import com.airlinebooking.dto.RegisterRequestDTO;
import com.airlinebooking.dto.UserResponseDTO;
import com.airlinebooking.entity.User;
import com.airlinebooking.exception.ResourceAlreadyExistsException;
import com.airlinebooking.exception.ResourceNotFoundException;
import com.airlinebooking.repository.UserRepository;
import com.airlinebooking.security.JwtTokenProvider;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public UserResponseDTO register(RegisterRequestDTO request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt(12)));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id: {}", savedUser.getId());

        return mapToUserResponseDTO(savedUser);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        log.info("User login attempt with email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password attempt for user: {}", request.getEmail());
            throw new ResourceNotFoundException("Invalid credentials");
        }

        String accessToken = jwtTokenProvider.generateAccessTokenFromUsername(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("User logged in successfully: {}", request.getEmail());

        return new AuthResponseDTO(
                accessToken,
                refreshToken,
                mapToUserResponseDTO(user),
                jwtTokenProvider.getExpirationTime()
        );
    }

    public AuthResponseDTO refresh(String refreshToken) {
        log.info("Refreshing access token");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromJWT(refreshToken);
        String newAccessToken = jwtTokenProvider.generateAccessTokenFromUsername(username);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponseDTO(
                newAccessToken,
                refreshToken,
                mapToUserResponseDTO(user),
                jwtTokenProvider.getExpirationTime()
        );
    }

    public UserResponseDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponseDTO(user);
    }

    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToUserResponseDTO(user);
    }

    private UserResponseDTO mapToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getTier(),
                user.getLoyaltyPoints()
        );
    }
}
