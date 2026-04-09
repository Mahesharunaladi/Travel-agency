# 🎨 Code Style Guide - Airline Booking System

**Version**: 1.0.0  
**Last Updated**: April 9, 2026  
**Status**: ✅ Active

---

## Table of Contents

1. [Overview](#overview)
2. [Java Backend Standards](#java-backend-standards)
3. [TypeScript/React Frontend Standards](#typescriptreact-frontend-standards)
4. [General Principles](#general-principles)
5. [Code Examples](#code-examples)
6. [Naming Conventions](#naming-conventions)
7. [Documentation](#documentation)
8. [Testing](#testing)

---

## Overview

This guide ensures all code in the airline booking system is **humanized, readable, and maintainable**. Our codebase follows enterprise standards with emphasis on clarity, consistency, and best practices.

**Key Principles:**
- 👤 **Humanized**: Code written for humans first, machines second
- 📖 **Readable**: Self-documenting with clear intent
- 🔄 **Consistent**: Uniform style across all files
- ✅ **Validated**: Type-safe and tested
- 🚀 **Performant**: Optimized without sacrificing clarity

---

## Java Backend Standards

### File Organization

```java
// 1. Package declaration
package com.airlinebooking.service;

// 2. Import statements (organized by scope)
// Standard imports
import java.util.*;
import java.time.*;

// External imports (alphabetically)
import lombok.*;
import org.springframework.stereotype.Service;

// Project imports
import com.airlinebooking.dto.*;
import com.airlinebooking.entity.*;

// 3. Class declaration
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    // Implementation...
}
```

### Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Class | PascalCase | `AuthService`, `UserRepository` |
| Method | camelCase | `registerUser()`, `validateEmail()` |
| Variable | camelCase | `userEmail`, `isValid` |
| Constant | UPPER_SNAKE_CASE | `JWT_EXPIRATION`, `MAX_LOGIN_ATTEMPTS` |
| Package | lowercase.dot | `com.airlinebooking.service` |

### Code Structure

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Registers a new user with validation and error handling.
     * 
     * @param request the registration request containing user details
     * @return UserResponseDTO with created user information
     * @throws ResourceAlreadyExistsException if email already exists
     */
    @Transactional
    public UserResponseDTO register(RegisterRequestDTO request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Business logic with clear comments
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                "Email already registered: " + request.getEmail()
            );
        }
        
        // Use builder pattern for clarity
        User user = User.builder()
                .email(request.getEmail())
                .password(hashPassword(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id: {}", savedUser.getId());
        
        return mapToUserResponseDTO(savedUser);
    }
    
    private String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(12));
    }
}
```

### Best Practices

✅ **DO:**
- Use `@Slf4j` for logging (Lombok annotation)
- Use `@RequiredArgsConstructor` for dependency injection
- Use `@Transactional` for database operations
- Use `@Valid` for input validation
- Use builder patterns for complex objects
- Add meaningful log statements at INFO level for key operations
- Add Javadoc for public methods
- Handle exceptions explicitly
- Use Optional instead of null checks

❌ **DON'T:**
- Don't use System.out.println()
- Don't hardcode values
- Don't ignore exceptions silently
- Don't use raw types
- Don't create deep nesting (max 3 levels)
- Don't skip null safety checks
- Don't use abbreviations in variable names

### Logging Standards

```java
// ✅ GOOD - Contextual and helpful
log.info("User registered successfully with email: {}", userEmail);
log.warn("Login attempt failed for user: {}", userId);
log.error("Database connection failed", exception);

// ❌ BAD - Vague or redundant
log.info("Processing");
log.debug("x = " + x);
System.out.println("Done");
```

---

## TypeScript/React Frontend Standards

### File Organization

```typescript
// 1. Imports (organized by scope)
// External libraries
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Utilities and services
import { authService } from '@/services/auth.service';
import apiClient from '@/lib/api-client';

// Types
import type { LoginFormData } from '@/types';

// Components (if applicable)
import Button from '@/components/Button';

// 2. Type definitions
interface FormData {
  email: string;
  password: string;
}

// 3. Component
export default function LoginPage() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  
  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  
  // Handlers
  const handleSubmit = useCallback(async (data: FormData) => {
    // Implementation
  }, []);
  
  // Render
  return <div>{/* JSX */}</div>;
}
```

### Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Component | PascalCase | `LoginPage`, `UserCard` |
| Function | camelCase | `handleSubmit()`, `validateEmail()` |
| Variable | camelCase | `isLoading`, `userEmail` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_TIMEOUT` |
| Hook | camelCase with 'use' prefix | `useAuth()`, `useUserStore()` |
| Type | PascalCase | `UserResponse`, `AuthState` |

### Code Structure

```typescript
'use client';

import React, { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema for form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginPage - User authentication page with email and password
 */
export default function LoginPage(): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData): Promise<void> => {
      try {
        setError(null);
        setIsSubmitting(true);
        
        // Call authentication service
        await authService.login(data.email, data.password);
        
        // Redirect on success
        window.location.href = '/dashboard';
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Sign in to your account
        </h2>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form fields */}
        </form>
      </div>
    </div>
  );
}
```

### Best Practices

✅ **DO:**
- Use 'use client' directive for client components
- Use TypeScript for type safety
- Use Tailwind CSS classes for styling
- Use proper error handling with try-catch
- Use callback functions for memoization
- Use descriptive variable names
- Use early returns for clarity
- Add JSDoc comments for complex functions

❌ **DON'T:**
- Don't use `any` type (use `unknown` or proper types)
- Don't use inline styles
- Don't mix styled-components with Tailwind
- Don't ignore TypeScript errors
- Don't create nested components
- Don't use console.log() in production
- Don't hardcode strings (use constants)

---

## General Principles

### 1. Single Responsibility Principle (SRP)

Each class/function should have ONE clear purpose:

```java
// ✅ GOOD - Specific responsibility
public class PasswordHasher {
    public String hash(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(12));
    }
}

// ❌ BAD - Too many responsibilities
public class User {
    public void register() { }
    public void hash() { }
    public void sendEmail() { }
    public void log() { }
}
```

### 2. Dependency Injection

```java
// ✅ GOOD - Dependencies injected
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
}

// ❌ BAD - Hard dependency
public class AuthService {
    private UserRepository repo = new UserRepository();
}
```

### 3. Error Handling

```java
// ✅ GOOD - Specific exception handling
try {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "User not found: " + id
        ));
} catch (ResourceNotFoundException e) {
    log.warn("User not found: {}", id);
    throw e;
}

// ❌ BAD - Generic exception handling
try {
    User user = userRepository.findById(id).get();
} catch (Exception e) {
    e.printStackTrace();
}
```

### 4. Comments and Documentation

```java
// ✅ GOOD - Clear, purposeful comments
// HashSet offers O(1) lookup, crucial for performance in large lists
Set<String> uniqueEmails = new HashSet<>(emails);

// ✅ GOOD - Javadoc for public methods
/**
 * Authenticates a user with email and password.
 * 
 * @param email the user's email address
 * @param password the user's password (plain text)
 * @return AuthResponseDTO containing tokens and user info
 * @throws ResourceNotFoundException if user not found
 * @throws IllegalArgumentException if password is invalid
 */
public AuthResponseDTO authenticate(String email, String password) { }

// ❌ BAD - Obvious comments
// Set i to 0
int i = 0;

// ❌ BAD - No documentation for public API
public void register(RegisterRequestDTO request) { }
```

### 5. Code Formatting

**Java:**
- Line length: 100 characters
- Indentation: 4 spaces
- Braces: Allman style (next line)

**TypeScript/React:**
- Line length: 80 characters
- Indentation: 2 spaces
- Semicolons: Yes
- Quotes: Single quotes

---

## Code Examples

### Complete Example: Java Service

```java
package com.airlinebooking.service;

import com.airlinebooking.dto.AuthResponseDTO;
import com.airlinebooking.dto.LoginRequestDTO;
import com.airlinebooking.entity.User;
import com.airlinebooking.exception.ResourceNotFoundException;
import com.airlinebooking.repository.UserRepository;
import com.airlinebooking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AuthService - Handles authentication logic including login, registration,
 * and token management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Authenticates user with email and password.
     * 
     * Validates credentials against stored hash and issues JWT tokens.
     * 
     * @param request contains email and password
     * @return AuthResponseDTO with access and refresh tokens
     * @throws ResourceNotFoundException if user not found or password invalid
     */
    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        log.info("Login attempt for user: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("User not found: {}", request.getEmail());
                    return new ResourceNotFoundException(
                        "Invalid email or password"
                    );
                });

        if (!isPasswordValid(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password for user: {}", request.getEmail());
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String accessToken = jwtTokenProvider
                .generateAccessTokenFromUsername(user.getEmail());
        String refreshToken = jwtTokenProvider
                .generateRefreshToken(user.getEmail());

        log.info("Login successful for user: {}", user.getEmail());

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .build();
    }

    /**
     * Validates plain text password against BCrypt hash.
     * 
     * @param plainPassword the plain text password provided by user
     * @param hashedPassword the stored BCrypt hash
     * @return true if password matches, false otherwise
     */
    private boolean isPasswordValid(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}
```

### Complete Example: React Component

```typescript
'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginPage Component
 * 
 * Provides secure user authentication with email and password.
 * Handles form validation, error states, and loading states.
 */
export default function LoginPage(): React.ReactElement {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  /**
   * Handles form submission with authentication
   */
  const onSubmit = useCallback(
    async (data: LoginFormData): Promise<void> => {
      try {
        setApiError(null);
        setIsSubmitting(true);

        await authService.login(data.email, data.password);

        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed. Please try again.';
        setApiError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{apiError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

## Naming Conventions

### Database Entities

```
Table Names: lowercase_with_underscores
Examples: users, airline_bookings, flight_schedules

Column Names: lowercase_with_underscores
Examples: user_id, created_at, is_active

Foreign Keys: parent_table_id
Examples: user_id, booking_id
```

### API Endpoints

```
Format: /api/v1/{resource}/{action}

Examples:
POST   /api/v1/auth/register      - Create user
POST   /api/v1/auth/login         - Authenticate
GET    /api/v1/users/me           - Get current user
GET    /api/v1/users/{id}         - Get user by ID
PUT    /api/v1/users/{id}         - Update user
DELETE /api/v1/users/{id}         - Delete user
```

### DTOs (Data Transfer Objects)

```
{noun}RequestDTO   - Input data
{noun}ResponseDTO  - Output data

Examples:
LoginRequestDTO
LoginResponseDTO
UserResponseDTO
CreateBookingRequestDTO
```

---

## Documentation

### Javadoc Template

```java
/**
 * Brief description of what the method does.
 * 
 * Detailed description with additional context, algorithm explanation,
 * or important business logic.
 * 
 * @param paramName description of the parameter
 * @return description of return value
 * @throws ExceptionType description of when/why thrown
 */
```

### JSDoc Template

```typescript
/**
 * Brief description of the function
 * 
 * @param {type} paramName - description
 * @returns {type} - description
 * @throws {Error} - when this happens
 */
```

---

## Testing

### Unit Tests

```java
// ✅ GOOD - Clear test names
@Test
void shouldReturnUserResponseWhenValidRegistrationRequestProvided() { }

@Test
void shouldThrowExceptionWhenEmailAlreadyExists() { }

// ❌ BAD - Unclear test names
@Test
void testRegister() { }

@Test
void test1() { }
```

### Test Structure (AAA Pattern)

```java
@Test
void shouldLoginSuccessfullyWithValidCredentials() {
    // Arrange - Set up test data
    String email = "test@example.com";
    String password = "password123";
    User expectedUser = createTestUser(email);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(expectedUser));

    // Act - Execute the operation
    AuthResponseDTO result = authService.login(
        new LoginRequestDTO(email, password)
    );

    // Assert - Verify the results
    assertNotNull(result);
    assertNotNull(result.getAccessToken());
    verify(userRepository, times(1)).findByEmail(email);
}
```

---

## Checklist

Before committing code, verify:

- [ ] Code follows naming conventions
- [ ] Variables and functions have clear, descriptive names
- [ ] No magic numbers (use constants instead)
- [ ] Error handling is explicit
- [ ] Logging statements are meaningful
- [ ] Comments explain WHY, not WHAT
- [ ] Public methods have documentation
- [ ] No console.log() or System.out.println()
- [ ] No hardcoded credentials or secrets
- [ ] Tests pass with good coverage
- [ ] Code is formatted consistently

---

## Summary

This codebase is **humanized** because:

✅ **Readable** - Clear intent from code structure and naming  
✅ **Documented** - Comprehensive comments and documentation  
✅ **Consistent** - Uniform style across all files  
✅ **Maintainable** - Easy to understand and modify  
✅ **Professional** - Enterprise-grade standards  
✅ **Type-Safe** - Java types and TypeScript prevent errors  
✅ **Testable** - Well-structured for unit testing  
✅ **Performant** - Optimized without sacrificing clarity  

---

**Questions or suggestions?** See `DEVELOPMENT_GUIDE.md` for more details.

**Last reviewed:** April 9, 2026  
**Next review:** July 9, 2026
