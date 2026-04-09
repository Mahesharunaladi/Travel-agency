package com.airlinebooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * SecurityConfig - Centralized Spring Security configuration for the application.
 * 
 * Configures:
 * - JWT-based stateless authentication
 * - CORS policies for frontend integration
 * - Public vs protected endpoints
 * - Password encoding using BCrypt
 * 
 * Uses JWT filter for token-based authentication instead of sessions,
 * enabling scalability across multiple instances.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Password encoder bean using BCrypt with default strength (10).
     * BCrypt automatically handles salt generation and is resistant to
     * brute-force attacks.
     * 
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication manager bean for processing authentication requests.
     * Used by AuthService to authenticate users during login.
     * 
     * @param config Spring's authentication configuration
     * @return AuthenticationManager bean
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Security filter chain configuration.
     * 
     * Defines the security policy:
     * 1. CSRF protection disabled (not needed with stateless JWT)
     * 2. CORS enabled for frontend communication
     * 3. Public endpoints: /auth/*, /health, /metrics, /swagger-ui/*
     * 4. Protected endpoints: require JWT authentication
     * 5. Stateless sessions: no server-side session storage
     * 6. JWT filter added to authentication chain
     * 
     * @param http HttpSecurity builder for configuring security
     * @return configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/register",
                    "/auth/login",
                    "/health",
                    "/metrics",
                    "/prometheus"
                ).permitAll()
                .requestMatchers(
                    "/v3/api-docs",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /**
     * CORS configuration for frontend integration.
     * 
     * Allows frontend (localhost:3000) to communicate with backend (localhost:3001)
     * with credentials support for cookie-based authentication if needed.
     * 
     * Configuration:
     * - Allowed origins: http://localhost:3000, http://localhost:3001
     * - Allowed methods: GET, POST, PUT, DELETE, OPTIONS
     * - Allowed headers: all
     * - Credentials: enabled
     * - Max age: 1 hour (3600 seconds)
     * 
     * @return CorsConfigurationSource for the entire application
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001"
        ));
        
        configuration.setAllowedMethods(Arrays.asList(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));
        
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        configuration.setAllowCredentials(true);
        
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
